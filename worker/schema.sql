-- D1 (SQLite) 初始化脚本
-- 本地：npm run migrate:local    远程：npm run migrate:remote

CREATE TABLE IF NOT EXISTS users (
  username      TEXT PRIMARY KEY,
  password      TEXT NOT NULL,           -- pbkdf2$iterations$salt$hash
  role          TEXT NOT NULL DEFAULT 'user',
  identity_code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stations (
  name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS packages (
  id          TEXT PRIMARY KEY,           -- 快递单号
  pickup_code TEXT NOT NULL,              -- 取件码
  sender      TEXT NOT NULL,              -- 寄件人
  courier     TEXT NOT NULL,              -- 快递公司
  receiver    TEXT NOT NULL,              -- 收件人
  station     TEXT NOT NULL,              -- 所属驿站
  picked_up   INTEGER NOT NULL DEFAULT 0, -- 0 未取件 / 1 已取件
  created_at  TEXT NOT NULL               -- ISO-8601 UTC
);

CREATE INDEX IF NOT EXISTS idx_packages_receiver ON packages (receiver);
CREATE INDEX IF NOT EXISTS idx_packages_station  ON packages (station);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_identity ON users (identity_code);
