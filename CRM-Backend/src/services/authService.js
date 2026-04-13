const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.createUser = async (userData) => {
    return await User.create(userData);
};

exports.findUserByEmail = async (email, includePassword = false) => {
    const query = User.findOne({ email });
    if (includePassword) query.select('+password');
    return await query;
};

exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
