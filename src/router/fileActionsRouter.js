const express = require('express');
const router = express.Router();
const { upload } = require('../databases/fileActions');
const { generateCodes } = require('../scripts/generateCodes');
const { getResults } = require('../scripts/getResults');
const path = require('path');

router.post('/', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            next(err);
        } else {
            generateCodes(req.body.userId);
            res.send('Файл загружен успешно');
        }
    });
});

router.get('/', async (req, res) => {
    const fileName = req.query.userId;
    const filePath = path.join(__dirname, `../../results/${fileName}.xlsx`);

    try {
        // Предполагаем, что getResults теперь асинхронная функция
        await getResults(req.query.userId);
        // Теперь мы можем безопасно отправить файл для скачивания
        res.download(filePath, (err) => {
            if (err) {
                console.error('Ошибка при скачивании файла:', err);
                res.status(500).send('Ошибка при скачивании файла');
            } else {
                console.log('Файл успешно скачан');
            }
        });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).send('Ошибка при обработке запроса');
    }
});

module.exports = router;