import { copyFile, writeFile } from 'node:fs/promises';
await copyFile('src/figures.json','dist-pages/figures.json');
await writeFile('dist-pages/.nojekyll','');
console.log('GitHub Pages data and static assets prepared.');
