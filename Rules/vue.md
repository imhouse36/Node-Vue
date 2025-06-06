# Vue.js 高效开发指南

## 🎯 推荐技术栈
- **核心**: Vue 3 + Composition API + TypeScript
- **UI组件库**: Element Plus 2.9.11
- **CSS框架**: TailwindCSS 3.4.0 (已解决与Element Plus冲突)
- **状态**: Pinia (小项目可用 ref/reactive)
- **构建**: Vite

## 📁 简洁项目结构
```
src/
├── components/     # 组件（按功能分组）
├── composables/    # 复用逻辑
├── views/         # 页面
├── router/        # 路由
├── stores/        # 状态管理
└── utils/         # 工具函数
```

## 🔧 核心开发原则

### 1. 组件设计原则
**保持简单、职责单一，优先使用 Element Plus 组件**

```vue
<script setup lang="ts">
// Props 定义
interface Props {
  title: string
  count?: number
  type?: 'primary' | 'success' | 'warning' | 'danger'
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  type: 'primary'
})

// 业务逻辑
const handleClick = () => {
  // 实现逻辑
}
</script>

<template>
  <el-card class="w-full max-w-md mx-auto">
    <template #header>
      <h2 class="text-lg font-semibold">{{ props.title }}</h2>
    </template>
    
    <div class="flex items-center justify-between">
      <el-text class="text-gray-600">计数: {{ props.count }}</el-text>
      <el-button :type="props.type" @click="handleClick">
        操作
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
/* 只在必要时添加自定义样式 */
</style>
```

### 2. 环境配置 (简化版)
```typescript
// config/env.ts
export const config = {
  isDev: import.meta.env.DEV,
  apiBase: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  appTitle: import.meta.env.VITE_APP_TITLE || 'Node-Vue应用',
  elSize: import.meta.env.VITE_EL_SIZE || 'default'
}
```

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Node-Vue应用
VITE_EL_SIZE=default
VITE_THEME_MODE=light

# .env.production  
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_TITLE=生产应用
VITE_EL_SIZE=default
VITE_THEME_MODE=light
```

### 3. 数据请求模式
**重要：与后端API格式完全匹配，自动处理 `{success, data, message}` 响应格式**

```typescript
// composables/useApi.ts
import { ElMessage } from 'element-plus'

// 后端API响应格式接口（与Node.js后端完全匹配）
interface ApiResponse<T> {
  success: boolean
  data?: T
  message: string
}

export function useApi<T>(url: string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const fetch = async (options?: { method?: string, body?: any }) => {
    loading.value = true
    error.value = null
    
    try {
      // 请求后端API，期望返回标准格式 {success, data, message}
      const response = await $fetch<ApiResponse<T>>(url, {
        method: options?.method || 'GET',
        body: options?.body
      })
      
      if (response.success) {
        data.value = response.data || null
        if (response.message && response.message !== '成功') {
          ElMessage.success(response.message)
        }
        return response.data
      } else {
        error.value = response.message
        ElMessage.error(response.message)
        throw new Error(response.message)
      }
    } catch (err) {
      const errorMsg = err.message || '请求失败'
      error.value = errorMsg
      ElMessage.error(`请求失败: ${errorMsg}`)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return { data, loading, error, fetch }
}
```

## 🚀 性能要点
- 大组件使用 `defineAsyncComponent` 懒加载
- 长列表添加 `:key`，超过100项考虑虚拟滚动
- 图片使用懒加载
- Element Plus 组件按需导入

## ✅ 开发检查清单 (3项核心)
开发完成后检查：
- [ ] **错误处理**: 是否处理了 loading/error 状态，使用了 Element Plus 的 Message 提示
- [ ] **类型安全**: 关键数据是否定义了类型
- [ ] **性能优化**: 列表是否有key，大组件是否懒加载

## 📚 常用代码片段

### Element Plus 表单处理
```vue
<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { useApi } from '@/composables/useApi'

const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  email: ''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})

// 使用useApi进行数据提交，自动处理后端响应格式
const { loading, fetch: submitData } = useApi('/users')

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // submitData会自动处理后端的 {success, data, message} 格式
    await submitData({ method: 'POST', body: form })
    // 成功消息已在useApi中自动显示
  } catch (error) {
    // 错误消息已在useApi中自动显示
    console.error('提交失败:', error)
  }
}
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" class="max-w-md">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" placeholder="请输入姓名" />
    </el-form-item>
    
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" type="email" placeholder="请输入邮箱" />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>
```

### Element Plus 列表渲染
```vue
<template>
  <div v-loading="loading" class="min-h-32">
    <el-alert v-if="error" type="error" :title="error" show-icon />
    
    <el-table v-else :data="items" class="w-full">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
```

### Element Plus 混合 TailwindCSS 示例
```vue
<template>
  <!-- 布局使用 TailwindCSS，组件使用 Element Plus -->
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <el-card v-for="item in items" :key="item.id" 
               class="transition-transform hover:scale-105">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-semibold">{{ item.title }}</span>
            <el-tag :type="item.status">{{ item.status }}</el-tag>
          </div>
        </template>
        
        <p class="text-gray-600 mb-4">{{ item.description }}</p>
        
        <div class="flex justify-end space-x-2">
          <el-button size="small" type="primary">查看</el-button>
          <el-button size="small">编辑</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
```

## 🎨 样式使用原则
- **优先使用 Element Plus 组件**: 按钮、表单、表格、卡片等用 Element Plus
- **布局和工具类使用 TailwindCSS**: margin、padding、flex、grid、响应式等
- **可以混合使用**: Element Plus 组件可以添加 TailwindCSS 类名
- **自定义样式**: 复杂样式写在 `<style scoped>` 中
- **响应式设计**: 使用 TailwindCSS 的响应式类名

### 样式使用示例
```vue
<template>
  <!-- ✅ 推荐：Element Plus + TailwindCSS 组合 -->
  <el-button type="primary" class="w-full mb-4">
    全宽按钮
  </el-button>
  
  <!-- ✅ 推荐：TailwindCSS 布局 + Element Plus 组件 -->
  <div class="flex flex-col md:flex-row gap-4">
    <el-input placeholder="输入内容" class="flex-1" />
    <el-button type="primary">搜索</el-button>
  </div>
  
  <!-- ❌ 避免：完全用 TailwindCSS 重复实现 Element Plus 组件 -->
  <!-- <button class="bg-blue-500 text-white px-4 py-2 rounded">按钮</button> -->
</template>
```

## 🔧 Element Plus 配置建议
```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(ElementPlus, {
  size: 'default', // 全局组件大小
  locale: zhCn, // 中文语言包
})

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

---
**记住**: Element Plus 提供丰富的组件，TailwindCSS 提供灵活的样式工具。两者结合使用，既保证了组件的一致性，又提供了样式的灵活性。 