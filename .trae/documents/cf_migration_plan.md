# 全量迁移 Cloudflare（Workers + D1 + Pages）实施计划

## 调研结论（现状）

### 后端（Spring Boot 3.4.5 / Java 17 / MySQL）
- 单体控制器 [CainiaoController.java](file:///c:/Users/Administrator/Documents/example/example/src/main/java/com/example/Controller/CainiaoController.java)，全部接口在 `/api` 下，`@CrossOrigin(origins="*")`。
- 三张表：
  - `user`：username(PK)、password（**明文**）、role、identitycode
  - `station`：name(PK)
  - `package_info`：id(PK)、pickupCode、sender、courier、receiver、station、pickedUp(bool)、createdAt
- 登录态：[TokenUtil.java](file:///c:/Users/Administrator/Documents/example/example/src/main/java/com/example/util/TokenUtil.java) 用内存 HashMap 存 UUID→username（Workers 多实例下无法存活，必须换方案）。
- WebSocket `/ws`：[WebSocketService.java](file:///c:/Users/Administrator/Documents/example/example/src/main/java/com/example/service/WebSocketService.java) 仅在任何数据变更时广播 `{"type":"refresh"}`，客户端收到后重新拉取列表。共 5 个使用点：4 个后台页面通过 `useWebSocket(cb)`，首页 homepage.vue 内联了一份。
- 管理接口 `/api/admin/**` 与 `/api/sendadmin` **无任何鉴权**。

### 前端（Vue3 + Vite + Element Plus + axios）
- 所有 axios 请求走相对路径 `/api/...`（拦截器自动附加 Bearer token），仅 [send.vue](file:///c:/Users/Administrator/Documents/example/frontend/src/views/send.vue) 用原生 fetch。
- WS 地址硬编码 `ws://127.0.0.1:8080/ws`，2 处（useWebSocket.js、homepage.vue）。
- 路由守卫靠 localStorage 中 `username === 'admin'` + token 校验接口放行后台。
- vue-router 为 history 模式，部署 Pages 需要 SPA fallback。

### 接口清单（Worker 需 1:1 复刻，响应 JSON 结构保持不变）
`POST /api/login`、`POST /api/register`、`GET /api/packages?username=`、`POST /api/send`(Bearer)、`POST /api/sendadmin`、`POST /api/pickup`、`GET /api/getSfmByToken`(Bearer)、`POST /api/scan-pickup`、`GET|POST /api/admin/stations`、`PUT|DELETE /api/admin/station/{name}`、`GET /api/admin/users`、`DELETE /api/admin/user/{username}`、`GET /api/admin/packages`、`PATCH /api/admin/package/{id}/status`、`DELETE /api/admin/package/{id}`、`GET /api/admin/stats`。

## 已确认的决策
1. **实时刷新 → 定时轮询**（免费）：不使用 Durable Object。保留 `useWebSocket(cb)` 的函数签名，内部改为 setInterval 轮询，4 个后台页面零改动；首页改为轮询。
2. **Pages + Worker 分离部署**：Worker 提供 API（开 CORS），Pages 部署静态前端，通过构建期环境变量 `VITE_API_BASE` 指定 Worker 地址。
3. **D1 全新数据**：不迁移 MySQL；schema 重建 + 脚本播种 admin 账号。
4. Token 改为 **HMAC-SHA256 无状态签名 token**（Web Crypto，secret 用 Worker 变量/密钥），不再依赖内存。
5. 新系统密码改为 **salted SHA-256 哈希**（全新数据库，无历史包袱）；注册/登录同一套哈希逻辑。
6. `/api/admin/**`、`/api/sendadmin` 增加服务端管理员校验（Bearer token 且 role=admin）。前端后台页面本就以 admin 登录、拦截器已自动带 token，行为兼容。

## 文件与模块

### 新增 `worker/`（Hono on Workers）
- `worker/package.json`：依赖 `hono`，开发依赖 `wrangler`；脚本 `dev` / `deploy` / `db:create` / `db:migrate:local` / `db:migrate:remote` / `seed:local` / `seed:remote`。
- `worker/wrangler.toml`：name=`cainiao-api`，main=`src/index.js`，compatibility_date，D1 绑定 `DB`（database_id 占位，执行 `wrangler d1 create` 后回填），`[vars] CORS_ORIGIN="*"`。
- `worker/.dev.vars.example`：`AUTH_SECRET=...`（实际 `.dev.vars` 不入库）。
- `worker/.gitignore`：node_modules、.wrangler、.dev.vars。
- `worker/schema.sql`：建 users / stations / packages 三张表（snake_case 列）+ 索引。
- `worker/seed.mjs`：用 node:crypto 按 Worker 同款算法生成 admin 密码哈希，输出/执行 INSERT（默认账号 admin / admin123，role=admin）。
- `worker/src/auth.js`：`signToken(username, secret)`、`verifyToken(token, secret)`，payload=`{sub,iat,exp}`，有效期 7 天，base64url + HMAC-SHA256；`hashPassword(password)`、`verifyPassword()`。
- `worker/src/index.js`：Hono 路由，1:1 复刻全部接口；`mapPackage()` 把 D1 行（snake_case + 0/1）转成前端现用的驼峰 JSON（`pickupCode`/`pickedUp`/`createdAt`）；CORS 中间件处理 OPTIONS 预检与 `Authorization,Content-Type` 头；admin 路由组挂鉴权中间件；stats 聚合在 JS 内完成（created_at 为 ISO 文本，按日期前缀统计近 7 天）。

### 修改 `frontend/`
- `src/main.js`：设置 `axios.defaults.baseURL = import.meta.env.VITE_API_BASE || ''`。
- `src/composables/useWebSocket.js`：**签名不变**，内部移除 WebSocket，改为每 5 秒调用一次回调（立即触发一次），保留卸载清理。
- `src/views/homepage.vue`：删除内联 WebSocket 代码，改为 5 秒轮询包裹列表。
- `src/views/send.vue`：fetch 地址改用 `import.meta.env.VITE_API_BASE` 前缀。
- `vite.config.js`：删除已无用的 `/api` 代理；保留 https 证书配置（扫码页 getUserMedia 需要）。
- `.env.development`：`VITE_API_BASE=http://localhost:8787`；新增 `.env.example` 说明生产变量。
- `public/_redirects`：`/* /index.html 200`（Pages 的 history 路由回退）。

### 不动
- `example/` Java 后端保留在仓库中（不删除，作为对照）。
- 前端证书文件保持原样。

## 实施步骤（依赖顺序）
1. 创建 `worker/` 骨架：package.json、wrangler.toml、.gitignore、.dev.vars.example。
2. 编写 schema.sql 与 auth.js（token + 密码哈希）。
3. 编写 index.js：CORS → 登录/注册/getSfmByToken → 包裹业务 → scan-pickup → admin 鉴权组 → stats。
4. 编写 seed.mjs（admin 播种）。
5. 本地起本地 D1：`wrangler d1 create`（生成 id 回填）→ `d1 execute --local --file schema.sql` → `seed:local` → `wrangler dev` 自测各接口（curl）。
6. 改前端：main.js baseURL、useWebSocket 轮询化、homepage 轮询、send.vue 前缀、vite.config、环境变量文件、_redirects。
7. `npm run build` 验证前端可构建；本地 vite dev + wrangler dev 联调全流程。
8. 输出上线操作清单（wrangler login / d1 create 远程 / migrate / secret put AUTH_SECRET / deploy；Pages 建项目、构建设置、VITE_API_BASE 环境变量）。

## 依赖与注意
- Node 18+（Web Crypto / node:crypto）；wrangler 最新版。
- CORS：允许 `*` 时不能配合 credentials，前端用 Authorization 头不带 cookie，可行；后续绑自定义域名后可收紧 CORS_ORIGIN。
- D1 语句参数用 `?` 绑定，全部防注入；包 id、身份码等字符串直接比较。
- station 改名需在同一事务内同步更新 packages.station（D1 支持 batch）。
- 删除驿站前检查是否仍有关联包裹，逻辑与 Java 版一致。
- token 体系更换 + 全新数据库，所有用户需重新注册/登录（预期行为）。

## 验证
- 本地 D1：注册→登录→寄件→取件码取件；admin 登录→用户/驿站/快递增删改→扫码出库→stats 数据正确。
- 错误路径：错误密码、无效驿站、非本人身份码、重复取件、非 admin 访问管理接口（401/403）。
- `frontend` 执行 `npm run build` 成功，dist 中包含 `_redirects`。
- 浏览器联调：后台四个页面 5 秒自动刷新、首页包裹状态轮询更新、扫码页 HTTPS 可用。

## 风险
- **部署需用户本人 Cloudflare 账号授权**：`wrangler login`、D1 创建、Pages 连接仓库属交互操作，我会准备全部配置并给出逐条命令，无法替你完成账号授权步骤。
- 管理接口收紧鉴权属行为变化：前端唯一入口是 adminlogin 登录 admin，已兼容；若有人直接调旧开放接口会被拒（预期改进）。
- workers.dev 子域名在部分网络环境访问慢；正式用可绑自定义域名，计划不阻塞。
