// 播种管理员账号：admin / admin123（可用环境变量 ADMIN_PASSWORD 覆盖）
// 用法：node seed.mjs local | node seed.mjs remote
import { spawnSync } from 'node:child_process'
import { webcrypto } from 'node:crypto'

if (!globalThis.crypto) globalThis.crypto = webcrypto

const { hashPassword } = await import('./src/auth.js')

const mode = process.argv[2] === 'remote' ? '--remote' : '--local'
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
const passwordHash = await hashPassword(adminPassword)
const safeHash = passwordHash.replaceAll("'", "''")

const sql =
  `INSERT INTO users (username, password, role, identity_code) ` +
  `VALUES ('admin', '${safeHash}', 'admin', 'ADMIN000000') ` +
  `ON CONFLICT(username) DO UPDATE SET password = excluded.password, role = 'admin', identity_code = 'ADMIN000000';`

console.log(`[seed] 写入 admin 账号（${mode === '--remote' ? '远程' : '本地'} D1），默认密码：${adminPassword}`)
// shell 模式下 SQL 含空格，必须整体用双引号包住（SQL 内不含双引号，安全）
const result = spawnSync(
  `npx wrangler d1 execute cainiao-db ${mode} --command "${sql}"`,
  { stdio: 'inherit', shell: true }
)
process.exit(result.status ?? 1)
