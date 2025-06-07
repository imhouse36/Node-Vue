
# Vue.js 开发规则 - AI代码生成标准

> **AI指令**: 生成Vue.js代码时严格遵循此文档的所有规则和模板

## 🔴 强制项目结构 (AI必须遵循)

为了确保项目代码的组织性和可维护性，所有前端代码必须遵循以下目录结构。AI在生成或修改文件时，必须将文件放置在正确的目录中。

```
Vue/
└── src/                          # 🏠 前端源代码根目录
    ├── api.js                    # ⭐ 【核心】中央API请求模块
    ├── assets/                   # 🎨 静态资源 (图片, 全局CSS等)
    │   └── styles/               # 💄 样式文件目录
    │       └── main.css          # 🎭 全局样式（如需要）
    ├── components/               # 🧩 可复用的全局UI组件
    │   └── common/               # 📦 通用基础组件目录
    │       └── CustomCard.vue    # 🃏 自定义卡片组件示例
    ├── router/                   # 🛣️  路由配置
    │   └── index.js              # 🗺️  路由配置文件
    ├── utils/                    # 🔧 通用工具函数
    │   └── index.js              # ⚒️  工具函数 (例如: formatDate)
    ├── views/                    # 📱 页面级组件 (与路由对应)
    │   ├── HomeView.vue          # 🏡 首页组件
    │   └── UserManagement.vue    # 👥 用户管理页面
    ├── App.vue                   # 🌟 应用根组件
    └── main.js                   # 🚀 应用入口文件
```

### 目录及文件说明

#### 📁 核心文件

| 文件 | 重要级别 | 功能说明 |
|------|----------|----------|
| **`src/`** | 根目录 | 所有前端源代码的根目录 |
| **`api.js`** | **[核心规则]** | 项目中所有与后端API交互的唯一出口，封装fetch/axios，统一处理请求头、响应格式和错误提示。**禁止在组件中直接调用 `fetch` 或 `axios`** |
| **`App.vue`** | 应用根组件 | 应用的根组件，所有页面视图都将通过 `<router-view>` 在此组件内渲染 |
| **`main.js`** | 应用入口 | 应用的入口文件，负责创建Vue实例、挂载路由、Element Plus以及其他全局插件 |

#### 📂 功能模块目录

| 目录 | 层级类型 | 功能说明 | 示例文件 |
|------|----------|----------|----------|
| **`assets/`** | 静态资源层 | 存放静态资源，如图片、字体、全局CSS文件等 | `styles/main.css` - 全局样式文件 |
| **`components/`** | 组件层 | 存放**可复用**的UI组件，不与特定路由绑定，可在多个页面中使用 | `common/CustomCard.vue` - 自定义卡片组件 |
| **`router/`** | 路由层 | 存放Vue Router的所有配置 | `index.js` - 定义URL路径与页面组件的映射关系 |
| **`utils/`** | 工具层 | 存放通用的、与业务逻辑无关的辅助函数 | `index.js` - 日期格式化、数据校验等工具函数 |
| **`views/`** | **页面层** | 存放**页面级别**的组件，每个文件对应一个独立页面或路由，组合components目录下的可复用组件构建完整UI | `HomeView.vue`、`UserManagement.vue` |

## 🔴 强制组件结构 (AI必须复制)

### Vue组件标准模板
```vue
<!-- 【优化】模板使用中央api模块，逻辑更清晰 -->
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api.js' // 引入中央api模块

// 状态定义
const loading = ref(false)
const data = ref(null)

// API请求函数
const fetchData = async () => {
  loading.value = true
  try {
    const result = await api.get('/your-endpoint')
    data.value = result.data
  } catch (error) {
    // 错误已由 api.js 统一处理和记录
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div v-loading="loading" class="p-4">
    <!-- 页面内容 -->
  </div>
</template>
```

## 🔴 强制开发约束

### 必须遵循的规则
```
✓ 使用script setup语法
✓ 使用Element Plus组件 (禁止原生HTML)
✓ 使用ref/reactive管理状态
✓ **【新增规则】必须通过中央 `src/api.js` 模块进行API请求**
✓ 添加v-loading指令
✓ 错误消息由 `api.js` 统一处理，组件内无需重复提示
✓ 使用TailwindCSS布局类名
```

### 后端对接标准
```
处理后端响应:
- **【优化】所有API请求必须通过 `api.js` 模块。**
- 组件内的 `try...catch` 主要用于控制 `loading` 状态和处理成功后的数据 `result.data`。
- 错误提示和日志记录由 `api.js` 自动完成，组件内无需关心。
```

## 【新增规则】🔴 强制使用中央API模块 (`api.js`)

所有与后端API的通信都 **必须** 通过一个统一的 `src/api.js` 模块。此模块负责封装 `fetch`，并自动处理Token、请求头以及 **统一的日志记录**。组件内不应出现原生的 `fetch` 或 `axios` 调用。

### `api.js` 标准模板 (黄金规则)
```javascript
// src/api.js
import { ElMessage } from 'element-plus';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(url, options) {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${VITE_API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = result.message || `HTTP错误，状态码: ${response.status}`;
      console.error(`API 操作失败: [${options.method || 'GET'}] ${url}`, result);
      ElMessage.error(errorMessage);
      return Promise.reject(result);
    }

    return result;
  } catch (error) {
    console.error(`API 请求错误: [${options.method || 'GET'}] ${url}`, error);
    ElMessage.error('网络连接失败或服务器响应格式错误');
    return Promise.reject(error);
  }
}

export const api = {
  get: (url, options = {}) => request(url, { ...options, method: 'GET' }),
  post: (url, data, options = {}) => request(url, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (url, data, options = {}) => request(url, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (url, options = {}) => request(url, { ...options, method: 'DELETE' }),
};
```

## 🔴 常用页面模板

### 列表页面
```vue
<!-- 【优化】模板使用中央api模块 -->
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { api } from '@/api.js'

const loading = ref(false)
const list = ref([])

const fetchList = async () => {
  loading.value = true;
  try {
    const result = await api.get('/data')
    list.value = result.data
  } catch (error) {
    // 错误已由 api.js 统一处理
  } finally {
    loading.value = false
  }
}

const deleteItem = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除吗？', '提示', { type: 'warning' })
    await api.delete(`/data/${id}`)
    fetchList()
  } catch (error) {
    // 用户点击“取消”或API错误（已由api.js处理）
  }
}

onMounted(fetchList)
</script>

<template>
  <div class="p-6">
    <div class="mb-4 flex justify-between">
      <h1 class="text-2xl font-bold">数据列表</h1>
      <el-button type="primary">新增</el-button>
    </div>
    
    <el-table :data="list" v-loading="loading">
      <el-table-column prop="name" label="名称" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteItem(row._id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
```

### 表单页面
```vue
<!-- 【优化】模板使用中央api模块 -->
<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from '@/api.js'

const loading = ref(false)
const form = ref({
  name: '',
  email: ''
})

const submitForm = async () => {
  loading.value = true
  try {
    const result = await api.post('/data', form.value)
    ElMessage.success(result.message)
    form.value = { name: '', email: '' }
  } catch (error) {
    // 错误已由 api.js 统一处理
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">添加数据</h1>
    
    <el-form :model="form" class="max-w-md">
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submitForm">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
```

## 🔴 验证清单 (AI自检)

```
必须包含:
✓ script setup 语法
✓ loading 状态管理
✓ **通过 `api.js` 进行所有网络请求**
✓ v-loading 指令
✓ Element Plus 组件
✓ TailwindCSS 类名

禁止使用:
✗ 原生HTML标签 (button, input, table等)
✗ **在组件内直接使用 `fetch` 或 `axios`**
✗ 在组件的 `catch` 块中重复调用 `ElMessage.error`
✗ 手写CSS样式
```
