import fg from 'fast-glob'
import { rmSync } from 'fs'
import { basename } from 'path';

const logs = fg.sync('./labs/crawler/_logs/*.txt')

for (const log of logs) {
	rmSync(log)
	console.log(`Deleted log "${basename(log)}"`);
}