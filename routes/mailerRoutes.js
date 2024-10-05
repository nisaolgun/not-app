const express = require('express');
const sendEmailNotification = require('../controllers/mailer'); 
const router = express.Router();

/**
 * @swagger
 * /email/notify:
 *   post:
 *     summary: E-posta bildirimi gönder
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: user@example.com
 *             subject:
 *               type: string
 *               example: Yeni Yorum
 *             text:
 *               type: string
 *               example: Yeni bir yorumunuz var!
 *     responses:
 *       200:
 *         description: E-posta başarıyla gönderildi
 *       400:
 *         description: Geçersiz istek
 */
router.post('/notify', async (req, res) => {
    const { email, subject, text } = req.body;

    try {
        await sendEmailNotification(email, subject, text);
        res.status(200).json({ message: 'E-posta gönderildi.' });
    } catch (error) {
        res.status(500).json({ error: 'E-posta gönderilemedi.' });
    }
});

module.exports = router;
