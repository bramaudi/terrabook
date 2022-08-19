import fg from 'fast-glob'
import { rmSync } from 'fs';
import { basename } from 'path';

const dirname = path => {
	return new URL(path, import.meta.url).pathname
}

for (const img of await fg(dirname('webp/*.webp'))) {
	rmSync(img)
	console.log(`Remove ${basename(img)}`);
}

