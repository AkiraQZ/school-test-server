// function parseReults(arr) {
//     const result = [];

//     for (const item of arr) {
//         let answer = Number(item
//             .split(":")[1]
//             .slice(1, -1)
//         );
//         result.push(answer);
//     }

//     return result;
// }

// function divideArrayBy13(arr) {
//     const chunkSize = 13;
//     const result = [];

//     for (let i = 0; i < chunkSize; i++) {
//         const chunk = arr.filter((_, index) => index % chunkSize === i);
//         result.push(chunk);
//     }

//     return result;
// }

// function interpretResults (student){
//     let result = []
//     const rawResults = student.results;
//     const parsedReults = parseReults(rawResults);
//     const changeSign = [
//         13, 26, 52, 65,  1, 40, 53,  2, 15, 41, 54, 67,
//         15, 29, 42, 55, 68, 17, 69,  5, 44, 57, 70, 83,
//          6, 32, 45, 71, 84,  7, 20, 33, 85,  8, 47, 73,
//         86, 22, 35, 48, 61, 74, 87, 23, 36, 75, 88, 11,
//         24, 37, 50, 63, 89, 64, 77
//       ]
//       for (let index = 0; index < parsedReults.length; index++) {
//         let element = parseReults[index];
//         if (changeSign.includes(index)) {
//             element = element * -1
//         }
        
//       }
//       const divideResults = divideArrayBy13(parsedReults);
//       divideResults.forEach((item) => {
//         result.push(item.reduce((a, b) => a + b))
//       })
// }

// const initialArray = Array.from({length: 91}, (_, index) => index + 1);
// const divideResults = divideArrayBy13(initialArray);

// console.log(divideResults);
// console.log(interpretResults);


const axios = require('axios');

async function getSomeStudent (req) {
    try {
        const url = `${process.env.BASE_URL}/student/some?className=${req}`
        const response = await axios.get(url);
        return response.data;
    } 
    catch (err) {
        console.log(err)
    }
};

console.log(getSomeStudent);