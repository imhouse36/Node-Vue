<template>
  <div class="element-example">
    <h2>Element Plus 示例组件</h2>
    
    <!-- 按钮示例 -->
    <div class="section">
      <h3>按钮组件</h3>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </div>

    <!-- 输入框示例 -->
    <div class="section">
      <h3>输入框组件</h3>
      <el-input v-model="inputValue" placeholder="请输入内容" style="width: 200px;" />
      <p>输入的内容：{{ inputValue }}</p>
    </div>

    <!-- 图标示例 -->
    <div class="section">
      <h3>图标组件</h3>
      <el-icon size="20"><Edit /></el-icon>
      <el-icon size="20"><Delete /></el-icon>
      <el-icon size="20"><Search /></el-icon>
      <el-icon size="20"><Plus /></el-icon>
    </div>

    <!-- 消息提示示例 -->
    <div class="section">
      <h3>消息提示</h3>
      <el-button @click="showMessage">显示消息</el-button>
      <el-button @click="showNotification">显示通知</el-button>
    </div>

    <!-- 表单示例 -->
    <div class="section">
      <h3>表单组件</h3>
      <el-form :model="form" label-width="120px" style="max-width: 600px;">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio value="male">男</el-radio>
            <el-radio value="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

// 响应式数据
const inputValue = ref('')

const form = reactive({
  username: '',
  password: '',
  gender: 'male'
})

// 方法
const showMessage = () => {
  ElMessage({
    message: '这是一条消息提示',
    type: 'success',
  })
}

const showNotification = () => {
  ElNotification({
    title: '通知标题',
    message: '这是一条通知消息',
    type: 'info',
  })
}

const onSubmit = () => {
  console.log('表单提交:', form)
  ElMessage.success('表单提交成功!')
}

const onReset = () => {
  form.username = ''
  form.password = ''
  form.gender = 'male'
  ElMessage.info('表单已重置')
}
</script>

<style scoped>
.element-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.section h3 {
  margin-bottom: 15px;
  color: #303133;
}

.el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-icon {
  margin-right: 10px;
}
</style> 