# Node.js 开发规则 - AI代码生成标准

> **AI指令**: 生成Node.js代码时严格遵循此文档的所有规则和模板

## 🔴 强制项目结构 (AI必须遵循)

```
必须结构:
src/
├── app.js           # 应用入口文件
├── routes/          # 路由定义文件
├── controllers/     # 业务逻辑控制器  
├── models/          # Mongoose数据模型
├── middleware/      # 中间件函数
└── utils/           # 工具函数
```

## 🔴 强制响应格式标准 (前后端统一)

### API响应格式 (绝不允许偏离)
```typescript
// 成功响应模板 - 后端返回，前端接收
{
  success: true,
  data: T,                    // 任何类型的数据 (对象、数组、字符串、数字等)
  message: string            // 操作结果描述 (如: "获取成功", "创建成功")
}

// 错误响应模板 - 后端返回，前端接收  
{
  success: false,
  message: string            // 错误描述 (如: "参数错误", "用户不存在")
}
```

### 前端对接说明
```
前端必须这样处理响应:
✓ 检查 result.success 字段
✓ 成功时使用 result.data 
✓ 失败时显示 result.message
✓ 网络错误显示 "网络连接失败"
```

### 控制器函数模板 (强制结构)
```javascript
// 所有控制器函数必须使用此模板
async function controllerName(req, res) {
  try {
    // 1. 参数验证
    // 2. 业务逻辑
    // 3. 数据库操作
    
    res.json({
      success: true,
      data: result,
      message: '操作描述'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
```

## 🔴 强制开发约束 (AI必须遵循)

### 代码结构约束
```
必须遵循:
- 必须使用async/await语法 (禁止Promise.then)
- 必须使用try-catch错误处理
- 必须返回{success,data,message}格式
- 必须使用Express框架
- 必须使用Mongoose操作数据库
```

### 文件组织约束
```
文件组织规则:
- 控制器: 必须放在controllers/目录
- 路由: 必须放在routes/目录
- 模型: 必须放在models/目录
- 中间件: 必须放在middleware/目录
- 工具函数: 必须放在utils/目录
```

### 错误处理约束
```
错误处理规则:
- 所有async函数必须有try-catch
- 数据库错误返回500状态码
- 验证错误返回400状态码
- 认证错误返回401状态码  
- 资源不存在返回404状态码
```

## 📦 功能模块 (需要时再添加)

### 🟡 数据库连接 (需要存储数据时)

<details>
<summary>点击展开MongoDB连接代码 (可选功能)</summary>

```javascript
// 只有需要数据库时才添加这部分代码
const mongoose = require('mongoose')

/**
 * 连接MongoDB数据库
 */
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/myapp')
    console.log('✅ 数据库连接成功')
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    process.exit(1)  // 连接失败就退出程序
  }
}

// 在app.js中调用
connectDB()
```

**简单的用户模型示例:**
```javascript
// models/User.js - 简单版本
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true  // 自动添加创建时间和更新时间
})

module.exports = mongoose.model('User', userSchema)
```
</details>

### 🟡 用户认证 (需要登录功能时)

<details>
<summary>点击展开JWT认证代码 (可选功能)</summary>

```javascript
// 简单的JWT认证
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

/**
 * 生成JWT令牌
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '24h' })
}

/**
 * 验证密码
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword)
}

/**
 * 加密密码  
 */
const hashPassword = async (password) => {
  return await bcryptjs.hash(password, 10)
}

/**
 * 认证中间件 - 保护需要登录的接口
 */
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: '请先登录' 
    })
  }
  
  try {
    const decoded = jwt.verify(token, 'your-secret-key')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: '登录已过期，请重新登录' 
    })
  }
}

module.exports = { generateToken, comparePassword, hashPassword, authMiddleware }
```
</details>

### 🟡 文件上传 (需要上传功能时)

<details>
<summary>点击展开文件上传代码 (可选功能)</summary>

```javascript
// 简单的文件上传
const multer = require('multer')
const path = require('path')

// 配置文件存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')  // 文件保存目录
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueName + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制5MB
  fileFilter: (req, file, cb) => {
    // 只允许图片
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('只能上传图片文件'))
    }
  }
})

// 使用示例
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择文件'
      })
    }
    
    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`
      },
      message: '上传成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '上传失败: ' + error.message
    })
  }
})
```
</details>

## 📚 常用代码模板 (复制即用)

### 🔴 前后端对接示例

#### 获取列表 - 完整对接示例
**后端代码:**
```javascript
// GET /api/users
async function getUsers(req, res) {
  try {
    const users = await User.find()
    res.json({
      success: true,
      data: users,
      message: '获取用户列表成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取失败: ' + error.message
    })
  }
}
```

**前端对接 (Vue.js):**
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const userList = ref([])

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/users')
    const result = await response.json()
    
    if (result.success) {
      userList.value = result.data
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    ElMessage.error('网络连接失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>
```

### 🔴 基础CRUD接口模板

```javascript
// controllers/userController.js - 用户相关接口
const User = require('../models/User')

const userController = {
  /**
   * 获取所有用户 - GET /api/users
   */
  async getUsers(req, res) {
    try {
      const users = await User.find().select('-password')  // 不返回密码
      res.json({
        success: true,
        data: users,
        message: '获取用户列表成功'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '服务器错误: ' + error.message
      })
    }
  },

  /**
   * 获取单个用户 - GET /api/users/:id
   */
  async getUser(req, res) {
    try {
      const { id } = req.params
      const user = await User.findById(id).select('-password')
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        })
      }
      
      res.json({
        success: true,
        data: user,
        message: '获取用户信息成功'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '服务器错误: ' + error.message
      })
    }
  },

  /**
   * 创建用户 - POST /api/users
   */
  async createUser(req, res) {
    try {
      const { username, email, password } = req.body
      
      // 检查用户是否已存在
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      })
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名或邮箱已存在'
        })
      }
      
      // 创建新用户
      const user = new User({ username, email, password })
      await user.save()
      
      res.status(201).json({
        success: true,
        data: { id: user._id, username: user.username, email: user.email },
        message: '用户创建成功'
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: '创建失败: ' + error.message
      })
    }
  },

  /**
   * 更新用户 - PUT /api/users/:id
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params
      const updates = req.body
      
      const user = await User.findByIdAndUpdate(
        id, 
        updates, 
        { new: true, runValidators: true }
      ).select('-password')
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        })
      }
      
      res.json({
        success: true,
        data: user,
        message: '用户信息更新成功'
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: '更新失败: ' + error.message
      })
    }
  },

  /**
   * 删除用户 - DELETE /api/users/:id
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params
      const user = await User.findByIdAndDelete(id)
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        })
      }
      
      res.json({
        success: true,
        data: null,
        message: '用户删除成功'
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '删除失败: ' + error.message
      })
    }
  }
}

module.exports = userController
```

### 🔴 路由配置模板

```javascript
// routes/users.js - 用户路由
const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

// 用户相关路由
router.get('/', userController.getUsers)           // 获取所有用户
router.get('/:id', userController.getUser)         // 获取单个用户
router.post('/', userController.createUser)        // 创建用户
router.put('/:id', userController.updateUser)      // 更新用户
router.delete('/:id', userController.deleteUser)   // 删除用户

module.exports = router

// 在app.js中使用
app.use('/api/users', require('./routes/users'))
```

## 🔴 代码验证规则 (AI自检)

### 必须包含的元素
```
验证清单:
✓ 函数声明为async
✓ 包含try-catch块
✓ 返回{success,data,message}格式
✓ 设置正确的HTTP状态码
✓ 使用Mongoose进行数据库操作
✓ 参数验证 (req.body, req.params)
✓ 错误消息清晰描述
```

### 禁止的代码模式
```
禁止模式:
✗ 不使用async/await的异步函数
✗ 缺少try-catch的异步操作
✗ 返回格式不是{success,data,message}
✗ 使用res.send()而非res.json()
✗ 硬编码字符串而不使用环境变量
✗ 同步操作(readFileSync等)
✗ 直接暴露数据库错误给用户
``` 