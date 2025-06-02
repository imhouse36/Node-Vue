/**
 * 环境配置管理
 * 根据NODE_ENV自动切换不同环境的配置
 */

require('dotenv').config();

/**
 * 获取当前环境
 * @returns {string} 当前环境名称
 */
const getEnvironment = () => {
    return process.env.NODE_ENV || 'development';
};

/**
 * 开发环境配置
 */
const development = {
    port: process.env.PORT || 3000,
    database: {
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/nodeapp_dev',
        options: {
            // 快速连接超时设置，用于开发环境
            serverSelectionTimeoutMS: 2000, // 2秒超时
            connectTimeoutMS: 2000
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    },
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    },
    logging: {
        level: 'debug'
    }
};

/**
 * 生产环境配置
 */
const production = {
    port: process.env.PORT || 8080,
    database: {
        url: process.env.DATABASE_URL,
        options: {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        }
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    },
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    },
    logging: {
        level: 'error'
    }
};

/**
 * 测试环境配置
 */
const test = {
    port: process.env.PORT || 3001,
    database: {
        url: process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/nodeapp_test',
        options: {
            // 快速连接超时设置
            serverSelectionTimeoutMS: 2000,
            connectTimeoutMS: 2000
        }
    },
    jwt: {
        secret: 'test-secret-key',
        expiresIn: '1h'
    },
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    },
    logging: {
        level: 'silent'
    }
};

/**
 * 配置映射
 */
const configs = {
    development,
    production,
    test
};

/**
 * 获取当前环境配置
 * @returns {object} 当前环境的配置对象
 */
const getConfig = () => {
    const env = getEnvironment();
    const config = configs[env];
    
    if (!config) {
        throw new Error(`Unknown environment: ${env}`);
    }
    
    return {
        ...config,
        environment: env
    };
};

/**
 * 验证必需的环境变量
 * @param {string} env 环境名称
 */
const validateEnvironment = (env = getEnvironment()) => {
    const requiredVars = {
        production: ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'],
        development: [],
        test: []
    };
    
    const required = requiredVars[env] || [];
    const missing = required.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables for ${env}: ${missing.join(', ')}`);
    }
};

module.exports = {
    getEnvironment,
    getConfig,
    validateEnvironment,
    configs
};