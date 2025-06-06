# Node + Vue 全栈项目

本项目为前后端分离的现代化全栈应用，采用Vue 3和Node.js技术栈。

## ⚡ 技术栈

### 🎨 前端技术栈
- **核心框架**: Vue 3.5.13 (Composition API)
- **构建工具**: Vite 6.2.4 (替代vue-cli)
- **UI组件库**: Element Plus 2.9.11
- **CSS框架**: TailwindCSS 3.4.0 (已解决与Element Plus冲突)
- **HTTP客户端**: Axios 1.9.0
- **开发工具**: Vue DevTools、自动导入插件

### 🚀 后端技术栈
- **运行环境**: Node.js + Express 5.1.0
- **数据库**: MongoDB + Mongoose 8.15.1
- **身份认证**: JWT + bcryptjs 3.0.2
- **安全中间件**: helmet、cors
- **开发工具**: nodemon、TypeScript、Jest
- **环境配置**: dotenv

## 🎯 项目特色

✅ **样式框架兼容**: 已解决TailwindCSS与Element Plus冲突  
✅ **环境变量管理**: 完整的开发/生产环境配置  
✅ **TypeScript支持**: 后端完整TS支持  
✅ **安全性**: JWT认证 + helmet安全头  
✅ **现代化构建**: Vite极速热更新

## 📁 项目结构

```
Node-Vue/
├── Vue/                    # 🎨 前端项目目录
│   ├── src/               # 源代码
│   ├── .env.development   # 开发环境配置
│   ├── .env.production    # 生产环境配置
│   ├── tailwind.config.js # TailwindCSS配置
│   └── package.json       # 前端依赖
├── Node/                  # 🚀 后端项目目录
│   ├── src/               # 源代码
│   ├── .env.development   # 开发环境配置
│   ├── .env.production    # 生产环境配置
│   └── package.json       # 后端依赖
└── Rules/                 # 📋 开发规则文档
```

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/imhouse36/Node-Vue
cd Node-Vue
```

### 2. 安装依赖
```bash
# 安装前端依赖
cd Vue
npm install

# 安装后端依赖
cd ../Node
npm install
```

### 3. 环境配置
项目已配置开发环境变量，可直接启动。生产环境需要修改`.env.production`文件。

### 4. 启动开发服务器
```bash
# 启动前端 (http://localhost:5173)
cd Vue
npm run dev

# 启动后端 (http://localhost:3000)
cd Node
npm run dev
```

## 🔧 环境配置说明

### 前端环境变量 (Vue/.env.development)
```env
VITE_API_BASE_URL=http://localhost:3000/api  # 后端API地址
VITE_APP_TITLE=Node-Vue应用                  # 应用标题
VITE_EL_SIZE=default                        # Element Plus组件大小
VITE_THEME_MODE=light                       # 主题模式
```

### 后端环境变量 (Node/.env.development)
```env
NODE_ENV=development                        # 环境模式
PORT=3000                                  # 服务器端口
FRONTEND_URL=http://localhost:5173         # 前端地址(CORS)
JWT_SECRET=dev-secret-key                  # JWT密钥
DATABASE_URL=mongodb://localhost:27017/nodeapp_dev  # 数据库连接
```

## 🎨 样式框架使用

本项目集成了Element Plus和TailwindCSS，已解决样式冲突：

```vue
<template>
  <!-- 可以混合使用两种样式 -->
  <el-button class="bg-blue-500 hover:bg-blue-600">
    Element Plus + TailwindCSS
  </el-button>
</template>
```

## 📋 开发规则

请阅读`Rules/`目录下的开发规范文档，包含：
- Vue.js开发指南
- Node.js开发指南  
- 代码规范和最佳实践

## 🛠️ 构建部署

```bash
# 前端生产构建
cd Vue
npm run build

# 后端生产启动
cd Node
npm start
```

## 📧 问题反馈

如遇到问题，请提交Issue或查看开发规则文档。
