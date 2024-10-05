const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let users = [];

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
};

exports.register = (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const newUser = {
        id: users.length + 1,
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role || 'user',
    };
    users.push(newUser);
    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.' });
};

exports.login = (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Geçersiz şifre!' });
    }
    const token = generateToken(user);
    res.json({ accessToken: token });
};

exports.getUsers = (req, res) => {
    res.json(users);
};

exports.updateUserProfile = (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (req.body.username) {
        users[userIndex].username = req.body.username;
    }
    if (req.body.password) {
        users[userIndex].password = bcrypt.hashSync(req.body.password, 8);
    }
    if (req.body.role) {
        users[userIndex].role = req.body.role;
    }

    res.json({ message: 'Kullanıcı profili başarıyla güncellendi' });
};

exports.resetPassword = (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    const newPassword = req.body.newPassword;
    user.password = bcrypt.hashSync(newPassword, 8);

    res.json({ message: 'Şifre başarıyla güncellendi' });
};

exports.updateUserRole = (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    users[userIndex].role = req.body.role;
    res.json({ message: 'Kullanıcının rolü başarıyla güncellendi' });
};
