// 播种管理员账号（可用环境变量 ADMIN_PASSWORD 覆盖）
// 用法：node seed.mjs local | node seed.mjs remote
// 远程（生产）D1 必须显式传入 ADMIN_PASSWORD，避免弱默认密码上线
import { spawnSync } from 'node:child_process'
import { webcrypto } from 'node:crypto'

if (!globalThis.crypto) globalThis.crypto = webcrypto

const { hashPassword } = await import('./src/auth.js')

const isRemote = process.argv[2] === 'remote'
const mode = isRemote ? '--remote' : '--local'
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
if (isRemote && !process.env.ADMIN_PASSWORD) {
  console.error('[seed] 远程 seed 必须显式设置环境变量 ADMIN_PASSWORD，例如：ADMIN_PASSWORD=xxx node seed.mjs remote')
  process.exit(1)
}
const passwordHash = await hashPassword(adminPassword)
const safeHash = passwordHash.replaceAll("'", "''")

const sql =
  `INSERT INTO users (username, password, role, identity_code) ` +
  `VALUES ('admin', '${safeHash}', 'admin', 'ADMIN000000') ` +
  `ON CONFLICT(username) DO UPDATE SET password = excluded.password, role = 'admin', identity_code = 'ADMIN000000';`

console.log(`[seed] 写入 admin 账号（${isRemote ? '远程' : '本地'} D1）${isRemote ? '' : `，默认密码：${adminPassword}`}`)
// shell 模式下 SQL 含空格，必须整体用双引号包住（SQL 内不含双引号，安全）
const result = spawnSync(
  `npx wrangler d1 execute cainiao-db ${mode} --command "${sql}"`,
  { stdio: 'inherit', shell: true }
)
process.exit(result.status ?? 1)
