<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import ElementExample from './components/ElementExample.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-full xl:max-w-8xl 2xl:max-w-9xl 3xl:max-w-full mx-auto px-4 lg:px-6 xl:px-8 py-6">
        <div class="flex items-center space-x-4">
          <img alt="Vue logo" class="w-12 h-12" src="./assets/logo.svg" />
          <div>
            <HelloWorld msg="Vue 3 + Element Plus + TailwindCSS!" />
            <p class="text-sm text-gray-600 mt-1">测试样式框架兼容性</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-full xl:max-w-8xl 2xl:max-w-9xl 3xl:max-w-full mx-auto px-4 lg:px-6 xl:px-8 py-8">
      <!-- 样式兼容性测试区域 -->
      <div class="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">样式框架兼容性测试</h2>
        <div class="space-y-4">
          <!-- TailwindCSS + Element Plus 按钮测试 -->
          <div class="flex space-x-4 items-center">
            <el-button type="primary" class="bg-blue-500 hover:bg-blue-600">
              Element Plus 主要按钮
            </el-button>
            <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              TailwindCSS 按钮
            </button>
          </div>
          
          <!-- 输入框测试 -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <el-input placeholder="Element Plus 输入框" class="w-full" />
            <input 
              type="text" 
              placeholder="TailwindCSS 输入框" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <!-- 大屏幕下显示更多示例 -->
            <el-input placeholder="大屏展示区域1" class="w-full hidden xl:block" />
            <el-input placeholder="大屏展示区域2" class="w-full hidden 2xl:block" />
          </div>
        </div>
      </div>
      
      <!-- Element Plus 示例组件 -->
      <ElementExample />
      
      <!-- 原有的欢迎组件 -->
      <TheWelcome />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

/* 优化大屏幕布局，确保正常显示 */
@media (min-width: 1024px) {
  .logo {
    margin: 0 2rem 0 0;
  }
}

/* 超大屏幕优化 */
@media (min-width: 1920px) {
  header {
    font-size: 1.1rem;
  }
}
</style>
