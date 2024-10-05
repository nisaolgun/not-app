const express = require('express');
const {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    addComment,
    updateComment,
    deleteComment,
    logActivity,
    getActivityLog,
    getFavorites,
    addFavorite,
    archiveNote,
    getArchivedNotes,
    getLinkedNotes,
    getComments,
    restoreNote,
    getNotesByTag,
    searchNotes,
} = require('../controllers/noteController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Kullanıcının notlarını getir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notlar başarıyla getirildi
 *       401:
 *         description: Yetkisiz
 */
router.get('/', authenticateJWT, getNotes);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Yeni not oluştur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Not başarıyla oluşturuldu
 *       401:
 *         description: Yetkisiz
 */
router.post('/', authenticateJWT, createNote);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Notu güncelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Güncellenecek notun ID'si
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Not başarıyla güncellendi
 *       404:
 *         description: Not bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.put('/:id', authenticateJWT, updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Notu sil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Silinecek notun ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Not başarıyla silindi
 *       404:
 *         description: Not bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.delete('/:id', authenticateJWT, deleteNote);

/**
 * @swagger
 * /notes/{id}/comments:
 *   post:
 *     summary: Not için yeni yorum ekle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Yorum eklemek istenen notun ID'si
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Yorum başarıyla eklendi
 *       404:
 *         description: Not bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.post('/:id/comments', authenticateJWT, addComment);

/**
 * @swagger
 * /notes/{noteId}/comments/{commentId}:
 *   put:
 *     summary: Yorum güncelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         description: Yorum güncellenmek istenen notun ID'si
 *         schema:
 *           type: integer
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Güncellenecek yorumun ID'si
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Yorum başarıyla güncellendi
 *       404:
 *         description: Yorum veya not bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.put('/:noteId/comments/:commentId', authenticateJWT, updateComment);

/**
 * @swagger
 * /notes/{noteId}/comments/{commentId}:
 *   delete:
 *     summary: Yorum sil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         description: Yorum silinecek notun ID'si
 *         schema:
 *           type: integer
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Silinecek yorumun ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Yorum başarıyla silindi
 *       404:
 *         description: Yorum veya not bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.delete('/:noteId/comments/:commentId', authenticateJWT, deleteComment);

/**
 * @swagger
 * /notes/{id}/favorite:
 *   post:
 *     summary: Notu favorilere ekle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Favorilere eklemek istenen notun ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Not başarıyla favorilere eklendi
 *       404:
 *         description: Not bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.post('/:id/favorite', authenticateJWT, addFavorite);

/**
 * @swagger
 * /notes/favorites:
 *   get:
 *     summary: Favori notları getir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favori notlar başarıyla getirildi
 *       401:
 *         description: Yetkisiz
 */
router.get('/favorites', authenticateJWT, getFavorites);

/**
 * @swagger
 * /notes/{id}/archive:
 *   post:
 *     summary: Notu arşivle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Arşivlenecek notun ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Not başarıyla arşivlendi
 *       404:
 *         description: Not bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.post('/:id/archive', authenticateJWT, archiveNote);

/**
 * @swagger
 * /notes/archived:
 *   get:
 *     summary: Arşivli notları getir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Arşivli notlar başarıyla getirildi
 *       401:
 *         description: Yetkisiz
 */
router.get('/archived', authenticateJWT, getArchivedNotes);
/**
 * @swagger
 * /notes/{id}/linked:
 *   get:
 *     summary: Belirli bir notun bağlantılı notlarını al
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Bağlantılı notlarını almak istediğiniz notun ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bağlantılı notlar başarıyla alındı
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   category:
 *                     type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                         comment:
 *                           type: string
 *                         likes:
 *                           type: integer
 *                   userId:
 *                     type: integer
 *                   linkedNotes:
 *                     type: array
 *                     items:
 *                       type: integer
 *       404:
 *         description: Not bulunamadı
 *       401:
 *         description: Yetkisiz
 */
router.get('/:id/linked', authenticateJWT, getLinkedNotes);
/**
 * @swagger
 * /notes/restore/{id}:
 *   post:
 *     summary: Silinen notu geri yükle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Geri yüklenmek istenen notun ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Not başarıyla geri yüklendi
 *       404:
 *         description: Not bulunamadı veya erişim izni yok
 *       401:
 *         description: Yetkisiz
 */
router.post('/restore/:id', authenticateJWT, restoreNote);

/**
 * @swagger
 * /notes/{id}/comments:
 *   get:
 *     summary: Notun yorumlarını getir
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Yorumlarını almak istenen notun ID'si
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Yorumlar başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: string
 *                   comment:
 *                     type: string
 *                   likes:
 *                     type: integer
 *       404:
 *         description: Not bulunamadı veya erişim izni yok
 *       401:
 *         description: Yetkisiz
 */
router.get('/:id/comments', authenticateJWT, getComments);

/**
 * @swagger
 * /notes/tag/{tag}:
 *   get:
 *     summary: Belirli bir etiketle ilişkili notları getir
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         description: Alınmak istenen etiket
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notlar başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   category:
 *                     type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                         comment:
 *                           type: string
 *                         likes:
 *                           type: integer
 *       401:
 *         description: Yetkisiz
 */
router.get('/tag/:tag', authenticateJWT, getNotesByTag);

/**
 * @swagger
 * /notes/search:
 *   get:
 *     summary: Notları arama
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Arama terimi
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arama sonuçları başarıyla getirildi
 *       401:
 *         description: Yetkisiz
 */
router.get('/search', authenticateJWT, searchNotes);

/**
 * @swagger
 * /notes/tag/{tag}:
 *   get:
 *     summary: Belirli bir etiketle ilişkili notları getir
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         description: Alınmak istenen etiket
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notlar başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                   category:
 *                     type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                         comment:
 *                           type: string
 *                         likes:
 *                           type: integer
 *       401:
 *         description: Yetkisiz
 */

module.exports = router;
