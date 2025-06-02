/**
 * 认证中间件
 * 处理JWT token验证和用户认证
 */

const jwt = require('jsonwebtoken');
const { getConfig } = require('../config/environment');

const config = getConfig();

/**
 * JWT认证中间件
 * @param {object} req Express请求对象
 * @param {object} res Express响应对象
 * @param {function} next 下一个中间件函数
 */
const authenticateToken = (req, res, next) => {
    try {
        // 从请求头获取token
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({
                error: 'Access denied',
                message: 'No token provided'
            });
        }
        
        // 验证token
        jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    error: 'Invalid token',
                    message: 'Token verification failed'
                });
            }
            
            // 将用户信息添加到请求对象
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            error: 'Authentication failed',
            message: 'Internal server error during authentication'
        });
    }
};

/**
 * 可选的JWT认证中间件
 * 如果提供了token则验证，否则继续执行
 * @param {object} req Express请求对象
 * @param {object} res Express响应对象
 * @param {function} next 下一个中间件函数
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return next();
        }
        
        jwt.verify(token, config.jwt.secret, (err, decoded) => {
            if (!err) {
                req.user = decoded;
            }
            next();
        });
    } catch (error) {
        console.error('Optional authentication error:', error);
        next();
    }
};

/**
 * 生成JWT token
 * @param {object} payload token载荷数据
 * @param {string} expiresIn 过期时间
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = config.jwt.expiresIn) => {
    try {
        return jwt.sign(payload, config.jwt.secret, { expiresIn });
    } catch (error) {
        console.error('Token generation error:', error);
        throw new Error('Failed to generate token');
    }
};

/**
 * 验证JWT token
 * @param {string} token JWT token
 * @returns {object|null} 解码后的token数据或null
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
};

/**
 * 角色权限检查中间件
 * @param {string|array} roles 允许的角色
 * @returns {function} 中间件函数
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Please login to access this resource'
            });
        }
        
        const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.role];
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        
        const hasPermission = allowedRoles.some(role => userRoles.includes(role));
        
        if (!hasPermission) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                message: 'You do not have permission to access this resource'
            });
        }
        
        next();
    };
};

module.exports = {
    authenticateToken,
    optionalAuth,
    generateToken,
    verifyToken,
    requireRole
};