import { onBeforeUnmount } from 'vue'

// 后台数据自动刷新：迁移到 Cloudflare Workers 后，原 WebSocket 广播改为定时轮询。
// 为兼容所有调用方，函数签名保持不变：useWebSocket(() => fetchXxx())
// 第二个参数仅为兼容旧调用，url/retry 不再生效，可用 { interval } 自定义轮询间隔。
export function useWebSocket(onMessage, { interval = 5000 } = {}) {
  let timer = null
  let stopped = false

  const tick = async () => {
    try {
      await onMessage()
    } catch (e) {
      /* 忽略单次轮询失败，等待下一轮 */
    }
  }

  const start = () => {
    if (stopped) return
    tick()
    timer = setInterval(tick, interval)
  }

  const stop = () => {
    stopped = true
    clearInterval(timer)
    timer = null
  }

  start()
  onBeforeUnmount(stop)

  return { stop }
}
