/**
 * 用户控制器
 * 处理用户相关的API请求
 */

const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * 获取所有用户
 * @param {object} req Express请求对象
 * @param {object} res Express响应对象
 */
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', role = '' } = req.query;
        
        // 构建查询条件
        const query = {};
        
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (role) {
            query.role = role;
        }
        
        // 分页查询
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await User.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    total,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users',
            message: error.message
        });
    }
};

/**
 * 根据ID获取用户
 * @param {object} req Express请求对象
 * @param {object} res Express响应对象
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'No user found with the provided ID'
            });
        }
        
        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user',
            message: error.message
        });
    }
};

/**
 * 创建新用户
 * @param {object} req Express请求对象
 * @param {object} res Express响应对象
 */
const createUser = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, role } = req.body;
        
        // 检查用户是否已存在
        const existingUser = await User.findByEmailOrUsername(email || username);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists',
                message: 'A user with this email or username already exists'
            });
        }
        
        // 创建新用户
        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            role: role || 'user'
        });
        
        await user.save();
        
        // 生成JWT token
        const token = generateToken({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });
        
        res.status(201).json({
            success: true,
            data: {
                user: user.getPublicProfile(),
                token
            },
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Create user error:', error);
        
        // 处理验证错误
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                message: errors.join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to create user',
            message: error.message
        });
    }
};

/**
 * 更新用户信息
 * @param {object} req Express请求对象
 * @param {object} res Express响应对象
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // 移除不允许直接更新的字段
        delete updates.password;
        delete updates._id;
        delete updates.createdAt;
        delete updates.updatedAt;
        
        const user = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'No user found with the provided ID'
            });
        }
        
        res.json({
            success: true,
            data: { user },
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update user',
            message: error.message
        });
    }
};

/**
 * 删除用户
 * @param {object} req Express请求对象
 * @param {object} res Express响应对象
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'No user found with the provided ID'
            });
        }
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user',
            message: error.message
        });
    }
};

/**
 * 获取用户统计信息
 * @param {object} req Express请求对象
 * @param {object} res Express响应对象
 */
const getUserStats = async (req, res) => {
    try {
        const stats = await User.getUserStats();
        
        res.json({
            success: true,
            data: { stats }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user statistics',
            message: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserStats
};