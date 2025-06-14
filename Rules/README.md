# 高效开发规则使用说明

## 🎯 设计理念：规范是效率的保障

本目录下的所有规则，旨在通过建立一套**简单、统一且强制**的最佳实践，从根本上提升开发效率、降低沟通成本并简化错误排查。

我们坚信，清晰的规范不是开发的障碍，而是加速器。

### 核心原则
- ✅ **唯一标准**: 为每个关键环节（如错误处理、API请求）提供唯一的、最佳的解决方案。
- ✅ **日志先行**: 任何错误在暴露给用户前，必须先被系统详细记录。
- ✅ **模板驱动**: 提供可直接复制使用的“黄金模板”，确保代码风格和结构的高度一致。
- ✅ **安全可靠**: 默认实施安全策略，如隐藏后端具体错误、统一鉴权等。

## 📚 文件结构与核心内容

```
Rules/
├── vue.md      # 【前端规则】定义了Vue组件的编写标准和统一的API请求模块。
├── node.md     # 【后端规则】定义了Node.js控制器的编写标准和统一的错误处理模型。
└── README.md   # 本文件，高效开发规则的导航和总览。
```

## 🚀 如何使用这套规则？

1.  **项目启动时**: 通读本文件，理解核心设计理念。
2.  **开发前端时**: 打开 `vue.md`，复制 **中央API模块 (`api.js`)** 和 **组件模板** 开始开发。
3.  **开发后端时**: 打开 `node.md`，复制 **控制器函数模板** 开始开发。
4.  **遇到问题时**: 回到对应的规则文档，检查你的代码是否与“黄金模板”完全一致。

## 🎯 核心规则检查清单 (The Golden Rules)

我们摒弃了模糊的检查点，专注于以下**必须遵守**的、可量化的核心规则：

### ✅ 前端核心规则 (详见 `vue.md`)
1.  **统一API请求**: 是否所有后端请求都通过了中央 `api.js` 模块发出？
2.  **统一错误提示**: 组件代码的 `catch` 块中是否保持简洁，没有重复的 `ElMessage` 调用？
3.  **加载状态管理**: 对于所有异步操作，是否都正确使用了 `v-loading` 或等效的加载状态向用户反馈？

### ✅ 后端核心规则 (详见 `node.md`)  
1.  **统一错误处理**: 控制器的 `catch` 块是否严格遵循了“先`console.error`记录，后安全返回”的模板？
2.  **统一响应格式**: 接口返回的数据是否严格遵守 `{ success, data, message }` 格式？（特别是失败时 `data: null`）
3.  **安全第一**: 敏感操作（如查询用户列表）是否经过了认证中间件的保护？密码等敏感信息是否在返回前被移除？

## 📈 遵循规则的好处

遵循这套规则，您将体验到：
- ⚡ **极速排错**: 任何错误都会在控制台留下清晰的日志，定位问题只需数秒。
- 🧠 **认知减负**: 无需思考如何处理API请求和错误，只需套用模板。
- 🔧 **代码健壮**: 统一的、经过验证的最佳实践，让代码质量从第一行就得到保障。
- 😊 **协作顺畅**: 团队成员遵循同一套标准，代码审查更高效，项目交接无压力。

---

> **开始高效开发吧！** 打开 `vue.md` 或 `node.md`，让这些规则成为你最可靠的开发助手。