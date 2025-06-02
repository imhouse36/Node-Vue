/**
 * 数据库连接配置和管理
 * 支持MongoDB连接、重连机制和连接状态监控
 */

const mongoose = require('mongoose');
const { getConfig } = require('./environment');

const config = getConfig();

/**
 * 数据库连接选项
 */
const connectionOptions = {
    ...config.database.options,
    bufferCommands: false
    // 注意：bufferMaxEntries 在新版本的mongoose中已被移除
};

/**
 * 连接到MongoDB数据库
 * @returns {Promise} 数据库连接Promise
 */
const connectDatabase = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        
        await mongoose.connect(config.database.url, connectionOptions);
        
        console.log('✅ MongoDB connected successfully');
        console.log(`📍 Database: ${config.database.url.split('/').pop()}`);
        
        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }
};

/**
 * 断开数据库连接
 * @returns {Promise} 断开连接Promise
 */
const disconnectDatabase = async () => {
    try {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected');
    } catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error.message);
        throw error;
    }
};

/**
 * 获取数据库连接状态
 * @returns {string} 连接状态
 */
const getConnectionStatus = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * 设置数据库事件监听器
 */
const setupEventListeners = () => {
    // 连接成功
    mongoose.connection.on('connected', () => {
        console.log('📡 Mongoose connected to MongoDB');
    });
    
    // 连接错误
    mongoose.connection.on('error', (error) => {
        console.error('❌ Mongoose connection error:', error.message);
    });
    
    // 连接断开
    mongoose.connection.on('disconnected', () => {
        console.log('🔌 Mongoose disconnected from MongoDB');
    });
    
    // 应用终止时关闭数据库连接
    process.on('SIGINT', async () => {
        try {
            await disconnectDatabase();
            console.log('👋 Application terminated, database connection closed');
            process.exit(0);
        } catch (error) {
            console.error('❌ Error during graceful shutdown:', error.message);
            process.exit(1);
        }
    });
};

/**
 * 初始化数据库连接
 * @returns {Promise} 初始化Promise
 */
const initializeDatabase = async () => {
    setupEventListeners();
    return await connectDatabase();
};

/**
 * 检查数据库连接健康状态
 * @returns {Promise<object>} 健康状态信息
 */
const checkDatabaseHealth = async () => {
    try {
        const status = getConnectionStatus();
        
        if (status === 'connected') {
            // 执行简单的数据库操作来验证连接
            await mongoose.connection.db.admin().ping();
            
            return {
                status: 'healthy',
                connection: status,
                database: config.database.url.split('/').pop(),
                timestamp: new Date().toISOString()
            };
        } else {
            return {
                status: 'unhealthy',
                connection: status,
                timestamp: new Date().toISOString()
            };
        }
    } catch (error) {
        return {
            status: 'unhealthy',
            connection: getConnectionStatus(),
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
};

module.exports = {
    connectDatabase,
    disconnectDatabase,
    initializeDatabase,
    getConnectionStatus,
    checkDatabaseHealth,
    mongoose
};