// const pdfjs = require("pdfjs-dist/legacy/build/pdf");

// async function getContent(src) {
//   const doc = await pdfjs.getDocument(src).promise;

//   const page = await doc.getPage(1);
//   return await page.getTextContent();
// }

// async function getItems(src) {
//   const content = await getContent(src);
//   const items = content.map((item) => {
//     return item.str;
//   });
//   console.log(items);
//   return items;
// }

// getItems("../../Images/Osama-dev-resume.pdf");
// const natural = require('natural');

// // Define two example strings
// const string1 = 'hello world';
// const string2 = 'hello w0ld';

// // Calculate the Jaro-Winkler distance between the two strings
// const distance = natural.JaroWinklerDistance(string1, string2, { ignoreCase: true });

// // Output the similarity score
// console.log(`The similarity between "${string1}" and "${string2}" is ${distance * 100}/10`);

// // this is the second example in which we use levenshtein distance algorithm

// function compareStrings(s1, s2) {
//     const m = s1.length;
//     const n = s2.length;
//     const matrix = [];

//     // Initialize matrix
//     for (let i = 0; i <= m; i++) {
//       matrix[i] = [i];
//     }
//     for (let j = 0; j <= n; j++) {
//       matrix[0][j] = j;
//     }

//     // Fill in matrix
//     for (let i = 1; i <= m; i++) {
//       for (let j = 1; j <= n; j++) {
//         if (s1[i-1] === s2[j-1]) {
//           matrix[i][j] = matrix[i-1][j-1];
//         } else {
//           matrix[i][j] = Math.min(
//             matrix[i-1][j-1], // substitution
//             matrix[i][j-1],   // insertion
//             matrix[i-1][j]    // deletion
//           ) + 1;
//         }
//       }
//     }

//     // Calculate similarity score
//     const distance = matrix[m][n];
//     const maxLen = Math.max(m, n);
//     const similarity = (1 - distance / maxLen) * 100;
//     return similarity;
//   }

// const s1 = "hello world";
// const s2 = "hello w0rld";
// const score = compareStrings(s1, s2);
// console.log(score); // Output: 8.75

var completedWork = ''
for(var i = 0; i <500; i++) {
    completedWork+=i
}


console.log(completedWork)