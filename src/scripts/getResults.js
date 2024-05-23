const ExcelJS = require('exceljs');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function getSomeStudent(req) {
    try {
        const url = `${process.env.BASE_URL}/student/some?className=${req}`;
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err; // Выбросить ошибку, чтобы она могла быть обработана выше по стеку вызовов
    }
}

async function getTeacher(reqId) {
    try {
        const url = `${process.env.BASE_URL}/teacher/one?id=${reqId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; // Выбросить ошибку, чтобы она могла быть обработана выше по стеку вызовов
    }
}

function divideArrayBy13(arr) {
    const chunkSize = 13;
    const result = [];

    for (let i = 0; i < chunkSize; i++) {
        const chunk = arr.filter((_, index) => index % chunkSize === i);
        result.push(chunk);
    }

    return result;
}

function parseReults(arr) {
    const result = [];


    for (const item of arr) {
        let answer = Number(item.split(":")[1].slice(1, -1));
        result.push(answer);
    }

    return result;
}

function interpretResults(student) {
    let result = [];
    if (!student.results || student.results === String) {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    const rawResults = student.results;
    const parsedResults = parseReults(rawResults)


    const changeSign = [
        13, 26, 52, 65, 1, 40, 53, 2, 15, 41, 54, 67,
        15, 29, 42, 55, 68, 17, 69, 5, 44, 57, 70, 83,
        6, 32, 45, 71, 84, 7, 20, 33, 85, 8, 47, 73,
        86, 22, 35, 48, 61, 74, 87, 23, 36, 75, 88, 11,
        24, 37, 50, 63, 89, 64, 77
    ];

    for (let index = 0; index < parsedResults.length; index++) {
        let element = parsedResults[index];
        if (changeSign.includes(index)) {
            element = element * -1;
        }
    }

    const divideResults = divideArrayBy13(parsedResults);
    divideResults.forEach((item) => {
        if (item.length > 0) {
            result.push(item.reduce((a, b) => a + b));
        } else {
            // Обработка случая, когда массив пустой
            console.warn('Пустой массив обнаружен при попытке суммирования.');
        }
    });

    const averageValue = result.reduce((a, b) => a + b) / result.length;
    result.push(averageValue);

    return result;
}

async function getResults(reqId) {
    const resultsPath = path.join(__dirname, `../../results/${reqId}.xlsx`);

    // Создание нового экземпляра Workbook
    const workbook = new ExcelJS.Workbook();

    // Удаление существующего файла, если он существует
    try {
        await fs.promises.access(resultsPath);
        await fs.promises.unlink(resultsPath);
    } catch (err) {
        console.error("File could not be accessed or deleted", err);
    }

    // Добавление листа в книгу, если он еще не был добавлен
    if (!workbook.worksheets.length) {
        const worksheet = workbook.addWorksheet('Sheet 1');
    }

    const teacher = await getTeacher(reqId);
    const studentsList = await getSomeStudent(teacher.class);

    // Добавление заголовков в первый лист
    const worksheet = workbook.worksheets[0];
    worksheet.addRow([
        '№', 'Ученики', 'К семье', 'К Отечеству', 'К земле',
        'К миру', 'К труду', 'К культуре', 'К знаниям', 'К человеку как таковому',
        'К человеку как другому', 'К человеку как иному', 'К своему телесному я', 'К своему душевному я', 'К своему духовному я',
        'Среднее значение'
    ]);

    // Добавление данных о студентах в лист
    for (let index = 0; index < studentsList.length; index++) {
        const student = studentsList[index];
        const number = index + 1;
        const fullName = student.fullName;
        const results = interpretResults(student);
        const row = [number, fullName,...results];
        worksheet.addRow(row);
    }

    // Запись изменений в файл
    try {
        await workbook.xlsx.writeFile(resultsPath);
    } catch (err) {
        console.error("Failed to write file", err);
    }
}

module.exports = { getResults };