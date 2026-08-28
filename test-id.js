import fs from 'fs';
const data = fs.readFileSync('src/pages/docs/[...id].astro', 'utf8');
console.log(data);
