
# Node + Vue 全栈项目 - AI开发规则

> **AI指令**: 严格遵循此文档的所有规则和模板进行代码生成

## 🔴 核心约束规则 (AI必须遵循)

### 项目结构约束
```
必须结构:
Vue/src/                 # 前端代码目录
Node/src/               # 后端代码目录
Rules/                  # 规则文档目录
```

### 技术栈限制
```
前端技术栈: Vue 3 + Element Plus + TailwindCSS + Vite
后端技术栈: Node.js + Express + MongoDB + Mongoose
API响应格式: {success: boolean, data?: any, message: string}
认证方式: JWT
```

### 启动命令约束
```bash
# 后端启动 (端口3000)
cd Node && npm run dev

# 前端启动 (端口5173)  
cd Vue && npm run dev
```

## 🔴 API响应格式标准 (强制执行)

### 标准响应模板
```typescript
// 成功响应 - 所有API必须使用此格式
{
  success: true,
  data: T,                    // 实际数据
  message: string            // 操作描述
}

// 错误响应 - 所有API必须使用此格式  
{
  success: false,
  data: null,                 // 【优化】失败时，data字段必须为 null
  message: string            // 对用户友好的、安全的错误描述
}
```

### HTTP状态码规范
```
200: 请求成功
201: 创建成功  
400: 请求参数错误
401: 未授权
404: 资源不存在
500: 服务器错误
```

## 🔴 代码生成规则 (AI强制遵循)

### Vue组件生成规则
```typescript
必须使用:
- script setup语法
- Element Plus组件 (禁止原生HTML标签替代)
- ref/reactive响应式数据
- **【新增规则】必须通过中央 `src/api.js` 模块进行API请求**
- v-loading加载状态

组件结构模板:
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api.js' // 【优化】引入中央api模块

const loading = ref(false)
const dataList = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const result = await api.get('/your-endpoint')
    dataList.value = result.data
  } catch (error) {
    // 错误已由 api.js 统一处理和记录，此处通常无需额外操作
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <!-- Element Plus组件 + TailwindCSS类名 -->
</template>
```

### Node.js接口生成规则
```javascript
必须使用:
- Express框架
- async/await语法
- try-catch错误处理
- **【新增规则】必须在catch块中记录详细错误日志**
- 标准响应格式
- Mongoose数据库操作

控制器模板:
async function(req, res) {
  try {
    // 业务逻辑
    res.json({ success: true, data: result, message: '操作成功' })
  } catch (error) {
    // 【优化】应用黄金规则
    // 1. 在后端记录详细错误
    console.error(`[${req.method}] ${req.originalUrl} -> 错误:`, error);
    
    // 2. 向前端返回通用、安全的信息
    res.status(500).json({
      success: false,
      data: null,
      message: '服务器内部错误，请联系管理员'
    });
  }
}
```

## 🔴 环境变量约束

### 前端环境变量 (Vue/.env.development)
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=应用标题
VITE_EL_SIZE=default
```

### 后端环境变量 (Node/.env.development)  
```bash
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dev-secret-key
DATABASE_URL=mongodb://localhost:27017/app_dev
```

## 🔴 文件命名约束

### 前端文件命名规则
```
组件文件: PascalCase (UserList.vue)
页面文件: PascalCase (UserManage.vue)  
API模块:  camelCase (api.js) // 【优化】明确api.js命名
工具函数: camelCase (formatDate.js)
```

### 后端文件命名规则
```
控制器: camelCase (userController.js)
数据模型: PascalCase (User.js)
路由文件: camelCase (users.js)
中间件: camelCase (auth.js)
```

## 🔴 禁止行为清单

```
禁止行为:
- **【新增规则】在Vue组件中直接使用 `fetch` 或 `axios` (必须通过api.js)**
- **【新增规则】后端 `catch` 块中不使用 `console.error` 记录日志**
- 使用原生HTML替代Element Plus组件
- 不加try-catch的异步函数
- 偏离{success,data,message}响应格式
- 在Vue中使用Class组件语法  
- 在Node.js中使用同步操作
- 手动编写CSS样式(使用TailwindCSS)
```

## 📋 参考文档链接

- 详细Vue规则: `Rules/vue.md`
- 详细Node规则: `Rules/node.md`
- 项目约定: 严格按此README执行
