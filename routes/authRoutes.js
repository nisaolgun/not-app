const express = require('express');
const {
    register,
    login,
    getUsers,
    updateUserProfile,
    resetPassword,
    updateUserRole
} = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı oluştur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz istek
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi yap
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla giriş yaptı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       404:
 *         description: Kullanıcı bulunamadı
 *       401:
 *         description: Geçersiz şifre
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Tüm kullanıcıları getir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcılar başarıyla getirildi
 *       401:
 *         description: Yetkisiz
 */
router.get('/users', authenticateJWT, getUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     summary: Kullanıcı profilini güncelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Güncellenecek kullanıcının ID'si
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kullanıcı profili başarıyla güncellendi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.put('/users/:id', authenticateJWT, updateUserProfile);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Kullanıcı şifresini sıfırla
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Şifre başarıyla sıfırlandı
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /auth/users/{id}/role:
 *   patch:
 *     summary: Kullanıcının rolünü güncelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rolü güncellenecek kullanıcının ID'si
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kullanıcının rolü başarıyla güncellendi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.patch('/users/:id/role', authenticateJWT, updateUserRole);

module.exports = router;
