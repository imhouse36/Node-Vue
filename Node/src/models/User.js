/**
 * 用户数据模型
 * 定义用户的数据结构和相关方法
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * 用户Schema定义
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    profileImage: {
        type: String,
        default: null
    }
}, {
    timestamps: true, // 自动添加createdAt和updatedAt字段
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password; // 在JSON输出中隐藏密码
            return ret;
        }
    }
});

/**
 * 密码加密中间件
 * 在保存用户前自动加密密码
 */
userSchema.pre('save', async function(next) {
    // 只有密码被修改时才加密
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // 生成盐值并加密密码
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * 比较密码方法
 * @param {string} candidatePassword 待验证的密码
 * @returns {Promise<boolean>} 密码是否匹配
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * 获取用户公开信息
 * @returns {object} 用户公开信息
 */
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
        isActive: this.isActive,
        profileImage: this.profileImage,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
    };
};

/**
 * 更新最后登录时间
 * @returns {Promise} 更新Promise
 */
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

/**
 * 静态方法：根据邮箱或用户名查找用户
 * @param {string} identifier 邮箱或用户名
 * @returns {Promise<User|null>} 用户对象或null
 */
userSchema.statics.findByEmailOrUsername = function(identifier) {
    return this.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { username: identifier }
        ]
    });
};

/**
 * 静态方法：获取活跃用户统计
 * @returns {Promise<object>} 用户统计信息
 */
userSchema.statics.getUserStats = async function() {
    const totalUsers = await this.countDocuments();
    const activeUsers = await this.countDocuments({ isActive: true });
    const adminUsers = await this.countDocuments({ role: 'admin' });
    
    return {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        admins: adminUsers
    };
};

/**
 * 索引定义
 */
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

/**
 * 创建并导出用户模型
 */
const User = mongoose.model('User', userSchema);

module.exports = User;