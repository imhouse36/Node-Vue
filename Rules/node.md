
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
  data: null,                 // 【优化】失败时，data字段必须为 null
  message: string            // 对用户友好的、安全的错误描述
}
```

### 前端对接说明
```
前端必须这样处理响应:
✓ 检查 result.success 字段
✓ 成功时使用 result.data 
✓ 失败时显示 result.message
✓ 网络错误显示 "网络连接失败"
// 【优化】此部分逻辑将由前端的中央api.js模块统一处理
```

### 控制器函数模板 (强制结构)
```javascript
// 【优化】所有控制器函数必须使用此黄金规则模板
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

## 🔴 强制开发约束 (AI必须遵循)

### 代码结构约束
```
必须遵循:
- 必须使用async/await语法 (禁止Promise.then)
- 必须使用try-catch错误处理，并遵循黄金规则模板
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
- 所有async函数必须有try-catch。
- **【新增规则】catch块必须先用 `console.error` 记录完整错误。**
- 数据库错误返回500状态码，并使用通用错误消息。
- 验证错误返回400状态码。
- 认证错误返回401状态码。  
- 资源不存在返回404状态码。
```

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
    // 【优化】应用黄金规则
    console.error(`[${req.method}] ${req.originalUrl} -> 错误:`, error);
    res.status(500).json({
      success: false,
      data: null,
      message: '服务器内部错误'
    });
  }
}
```

**前端对接 (Vue.js):**
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api.js' // 【优化】使用中央api模块

const loading = ref(false)
const userList = ref([])

const fetchUsers = async () => {
  loading.value = true
  try {
    const result = await api.get('/users')
    userList.value = result.data
  } catch (error) {
    // 错误已由 api.js 统一处理
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
  // 【优化】所有函数的catch块都应用黄金规则
  async getUsers(req, res) {
    try {
      const users = await User.find().select('-password')
      res.json({ success: true, data: users, message: '获取用户列表成功' })
    } catch (error) {
      console.error(`[GET] /api/users -> 错误:`, error);
      res.status(500).json({ success: false, data: null, message: '服务器错误' });
    }
  },

  async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-password')
      if (!user) {
        return res.status(404).json({ success: false, data: null, message: '用户不存在' });
      }
      res.json({ success: true, data: user, message: '获取用户信息成功' });
    } catch (error) {
      console.error(`[GET] /api/users/:id -> 错误:`, error);
      res.status(500).json({ success: false, data: null, message: '服务器错误' });
    }
  },

  async createUser(req, res) {
    try {
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ success: false, data: null, message: '用户名或邮箱已存在' });
      }
      const user = new User({ username, email, password });
      await user.save();
      res.status(201).json({ success: true, data: { id: user._id, username: user.username, email: user.email }, message: '用户创建成功' });
    } catch (error) {
      console.error(`[POST] /api/users -> 错误:`, error);
      res.status(500).json({ success: false, data: null, message: '服务器错误' });
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, data: null, message: '用户不存在' });
      }
      res.json({ success: true, data: user, message: '用户信息更新成功' });
    } catch (error) {
      console.error(`[PUT] /api/users/:id -> 错误:`, error);
      res.status(500).json({ success: false, data: null, message: '服务器错误' });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, data: null, message: '用户不存在' });
      }
      res.json({ success: true, data: null, message: '用户删除成功' });
    } catch (error) {
      console.error(`[DELETE] /api/users/:id -> 错误:`, error);
      res.status(500).json({ success: false, data: null, message: '服务器错误' });
    }
  }
}

module.exports = userController
```
