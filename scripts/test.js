const testFolder = './node_modules/';
const fs = require('fs');
const files = fs.readdirSync(testFolder);
console.log(files.filter(file => file[0] !== '.' & file[0] !== '@'))
