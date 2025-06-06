/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 扩展Element Plus的颜色主题
      colors: {
        'el-primary': '#409eff',
        'el-success': '#67c23a',
        'el-warning': '#e6a23c',
        'el-danger': '#f56c6c',
        'el-info': '#909399',
      },
      // 优化大屏幕响应式断点
      screens: {
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',  // 新增超大屏幕断点
      },
      // 确保大屏幕下的最大宽度合理
      maxWidth: {
        '8xl': '88rem',   // 1408px
        '9xl': '96rem',   // 1536px
        'full': '100%',
      }
    },
  },
  plugins: [],
  // 关键配置：禁用preflight避免与Element Plus冲突
  corePlugins: {
    preflight: false,
  },
  // 为了避免样式覆盖，使用important前缀
  important: '#app',
} 