const express = require('express');
const router = express.Router();
const { upload } = require('../databases/fileActions');
const { generateCodes } = require('../scripts/generateCodes');
const { getResults } = require('../scripts/getResults');
const path = require('path');
const fs = require('fs')

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

router.get('/results', async (req, res) => {

    function deleteResults(userId) {
        const resultsDir = path.join(__dirname, '../../results/');
    
        fs.readdir(resultsDir, (err, files) => {
            if (err) throw err;
    
            files.forEach(file => {
                if (file.startsWith(`${userId}`) &&!file.endsWith('.xlsx')) {
                    fs.unlink(path.join(uploadDir, file), err => {
                        if (err) throw err;
                        console.log(`Удалено ${file} из директории upload.`);
                    });
                }
            });
        });
    }

    const fileName = req.query.userId;
    const filePath = path.join(__dirname, `../../results/${fileName}.xlsx`);

    try {
        await getResults(fileName);
        res.download(filePath, (err) => {
            if (err) {
                console.error('Ошибка при скачивании файла:', err);
                res.status(500).send('Ошибка при скачивании файла');
            } else {
                deleteResults(fileName)
                console.log('Файл успешно скачан');
            }
        });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).send('Ошибка при обработке запроса');
    }
});



router.get('/codes', async (req, res) => {

    function deleteUploadAndCodes(userId) {
        const uploadDir = path.join(__dirname, '../../upload/');
        const codesDir = path.join(__dirname, '../../codes/');
    
        fs.readdir(uploadDir, (err, files) => {
            if (err) throw err;
    
            files.forEach(file => {
                if (file.startsWith(`${userId}`) &&!file.endsWith('.xlsx')) {
                    fs.unlink(path.join(uploadDir, file), err => {
                        if (err) throw err;
                        console.log(`Удалено ${file} из директории upload.`);
                    });
                }
            });
        });
    
        fs.readdir(codesDir, (err, files) => {
            if (err) throw err;
    
            files.forEach(file => {
                if (file.startsWith(`${userId}`) &&!file.endsWith('.xlsx')) {
                    fs.unlink(path.join(codesDir, file), err => {
                        if (err) throw err;
                        console.log(`Удалено ${file} из директории codes.`);
                    });
                }
            });
        });
    }
    

    const fileName = req.query.userId;
    const filePath = path.join(__dirname, `../../codes/${fileName}.xlsx`);

    try {
        res.download(filePath, (err) => {
            if (err) {
                console.error('Ошибка при скачивании файла:', err);
                res.status(500).send('Ошибка при скачивании файла');
            } else {
                deleteUploadAndCodes(fileName);
                console.log('Файл успешно скачан');
            }
        });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).send('Ошибка при обработке запроса');
    }
})

module.exports = router;