const ExcelJS = require('exceljs');
const axios = require('axios');
const path = require('path');


async function getTeacher(reqId) {
    try {
        const url = `${process.env.BASE_URL}/teacher/one?id=${reqId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function postStudent(fullName, className) {
    try {
        const url = process.env.BASE_URL;
        const response = await axios.post(`${url}/student?fullName=${fullName}&className=${className}`);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getStudent(fullName) {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/student/one?fullName=${fullName}`);
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function generateCodes(reqId) {
    try {
        const teacher = await getTeacher(reqId);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.join(__dirname, `../../upload/${teacher._id}.xlsx`));
        const worksheet = workbook.worksheets[0];

        const students = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { 
                const name = row.values[1];
                students.push(name);
            }
        });

        for (const student of students) {
            await postStudent(student, teacher.class);
        }

        const newWorkbook = new ExcelJS.Workbook();
        const newWorksheet = newWorkbook.addWorksheet('Students Codes');

        newWorksheet.addRow(['Ученик', 'Код']);

        for (const student of students) {
            const fullName = student;
            const code = await getStudent(fullName);
            newWorksheet.addRow([code.fullName, code.code]);
        }

        await newWorkbook.xlsx.writeFile(path.join(__dirname, `../../codes/${teacher._id}.xlsx`));

        console.log(`Фамилии с кодами успешно экспортированы в ${teacher._id}.xlsx`);
    } catch (err) {
        console.error(err);
    }
}

module.exports = { generateCodes };
