/**
 * 主路由文件
 * 统一管理所有API路由
 */

const express = require('express');
const router = express.Router();

/**
 * API根路径
 */
router.get('/', (req, res) => {
    res.json({
        message: 'API is working!',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            users: '/api/users',
            auth: '/api/auth'
        }
    });
});

/**
 * 健康检查路由
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// TODO: 在这里添加其他路由模块
// router.use('/users', require('./users'));
// router.use('/auth', require('./auth'));

module.exports = router;