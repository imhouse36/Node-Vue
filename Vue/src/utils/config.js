/**
 * 环境变量配置文件
 * 统一管理从.env文件读取的配置信息
 */

// 应用基础配置
export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'Vue App',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: import.meta.env.VITE_APP_DESCRIPTION || '基于Vue 3的应用',
}

// API配置
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  version: import.meta.env.VITE_API_VERSION || 'v1',
}

// Element Plus UI配置
export const UI_CONFIG = {
  size: import.meta.env.VITE_EL_SIZE || 'default',
  locale: import.meta.env.VITE_EL_LOCALE || 'zh-cn',
  zIndex: parseInt(import.meta.env.VITE_EL_Z_INDEX) || 2000,
  namespace: import.meta.env.VITE_EL_NAMESPACE || 'el',
}

// 主题配置
export const THEME_CONFIG = {
  mode: import.meta.env.VITE_THEME_MODE || 'light',
  colors: {
    primary: import.meta.env.VITE_PRIMARY_COLOR || '#409EFF',
    success: import.meta.env.VITE_SUCCESS_COLOR || '#67C23A',
    warning: import.meta.env.VITE_WARNING_COLOR || '#E6A23C',
    danger: import.meta.env.VITE_DANGER_COLOR || '#F56C6C',
    info: import.meta.env.VITE_INFO_COLOR || '#909399',
  }
}

// 功能开关
export const FEATURE_CONFIG = {
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  enableI18n: import.meta.env.VITE_ENABLE_I18N === 'true',
}

// 构建配置
export const BUILD_CONFIG = {
  compress: import.meta.env.VITE_BUILD_COMPRESS || 'gzip',
  dropConsole: import.meta.env.VITE_BUILD_DROP_CONSOLE === 'true',
  dropDebugger: import.meta.env.VITE_BUILD_DROP_DEBUGGER === 'true',
}

// 上传配置
export const UPLOAD_CONFIG = {
  sizeLimit: parseInt(import.meta.env.VITE_UPLOAD_SIZE_LIMIT) || 5,
  types: import.meta.env.VITE_UPLOAD_TYPES || 'image/*,application/pdf',
}

// 缓存配置
export const CACHE_CONFIG = {
  enabled: import.meta.env.VITE_CACHE_ENABLED === 'true',
  prefix: import.meta.env.VITE_CACHE_PREFIX || 'vue_app_',
  expire: parseInt(import.meta.env.VITE_CACHE_EXPIRE) || 86400,
}

// 导出所有配置
export default {
  APP_CONFIG,
  API_CONFIG,
  UI_CONFIG,
  THEME_CONFIG,
  FEATURE_CONFIG,
  BUILD_CONFIG,
  UPLOAD_CONFIG,
  CACHE_CONFIG,
} 