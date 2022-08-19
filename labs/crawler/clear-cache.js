import { rmSync } from 'fs'
import fg from 'fast-glob'
import { basename } from 'path';

const caches = await fg('./labs/crawler/_cache/*.html')

for (const cache of caches) {
	rmSync(cache)
	console.log(`Deleted cache "${basename(cache)}"`);
}