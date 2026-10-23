import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

let isRedirecting = false

function isTokenExpiredPayload(data) {
  if (!data) {
    return false
  }

  const code = data.code || data.status
  if ([401, 403, 50008, 50012, 50014].includes(code)) {
    return true
  }

  const message = String(data.message || data.msg || data.error || '').toLowerCase()
  return message.includes('token') ||
    message.includes('unauthorized') ||
    message.includes('expired') ||
    message.includes('过期') ||
    message.includes('重新登录') ||
    message.includes('请登录')
}

export function handleTokenExpired(router) {
  if (isRedirecting) {
    return
  }

  isRedirecting = true
  const userStore = useUserStore()
  userStore.logout()
  ElMessage.error('登录已过期，请重新登录')

  router.replace({
    path: '/',
    query: {
      redirect: router.currentRoute.value.fullPath
    }
  }).finally(() => {
    isRedirecting = false
  })
}

export function setupAuthExpiredHandler(router) {
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  axios.interceptors.response.use(
    (response) => {
      if (isTokenExpiredPayload(response.data)) {
        handleTokenExpired(router)
        return Promise.reject(new Error('登录已过期，请重新登录'))
      }
      return response
    },
    (error) => {
      if ([401, 403].includes(error.response?.status) || isTokenExpiredPayload(error.response?.data)) {
        handleTokenExpired(router)
      }
      return Promise.reject(error)
    }
  )
}

export async function validateToken() {
  const token = localStorage.getItem('token')
  if (!token) {
    return false
  }

  try {
    const response = await axios.get('/api/getSfmByToken', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data?.type === 'success'
  } catch (error) {
    return false
  }
}
