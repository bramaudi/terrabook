import fg from 'fast-glob'
import { rmSync } from 'fs';
import { basename } from 'path';

const dirname = path => {
	return new URL(path, import.meta.url).pathname
}

const pngs = await fg(dirname('png-gif/*.png'))
const gifs = await fg(dirname('png-gif/*.gif'))
for (const img of [...pngs,...gifs]) {
	rmSync(img)
	console.log(`Remove ${basename(img)}`);
}

