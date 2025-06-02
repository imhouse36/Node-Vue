/**
 * Express应用程序主入口文件
 * 配置Express服务器、中间件、路由和错误处理
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// 导入配置和数据库
const { getConfig, validateEnvironment } = require('./config/environment');
const { initializeDatabase } = require('./config/database');

// 导入路由
const apiRoutes = require('./routes/index');

const app = express();
const config = getConfig();
const PORT = config.port;

/**
 * 中间件配置
 */
// 安全头部
app.use(helmet());

// CORS配置
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * 基础路由
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Node.js API Server is running!',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

/**
 * API路由
 */
app.use('/api', apiRoutes);

// TODO: 添加更多具体路由
// app.use('/api/users', require('./routes/users'));
// app.use('/api/auth', require('./routes/auth'));

/**
 * 404错误处理
 */
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// 或者使用具体的路径匹配
// app.all('*', (req, res) => {
//     res.status(404).json({
//         error: 'Route not found',
//         message: `Cannot ${req.method} ${req.originalUrl}`
//     });
// });

/**
 * 全局错误处理中间件
 */
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

/**
 * 启动服务器
 */
const startServer = async () => {
    try {
        // 验证环境变量
        validateEnvironment();
        
        // 尝试初始化数据库连接（可选）
        try {
            await initializeDatabase();
            console.log('✅ Database connected successfully');
        } catch (dbError) {
            console.warn('⚠️  Database connection failed, starting without database:', dbError.message);
            console.warn('💡 You can install and start MongoDB later to enable database features');
        }
        
        // 启动服务器
        app.listen(PORT, () => {
            console.log('\n🎉 Server started successfully!');
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📍 Environment: ${config.environment}`);
            console.log(`🌐 Access URL: http://localhost:${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
            console.log('\n✅ Ready to accept requests!\n');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// 启动服务器
startServer();

module.exports = app;