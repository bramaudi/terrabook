import crawl from '../_crawl.js'
import { readFileSync } from 'fs'

await crawl({
	script: './labs/crawler/dyes/_index.script.js',
	slug: 'Dyes',
	name: '_dyes',
})

const items = JSON.parse(readFileSync('./public/json/_dyes.json', { encoding: 'utf-8' }))

let slug = 'Dyes#Red_Dye'
let fetchScript = 'basic'

for (const item of items) {
	const name = decodeURIComponent(item)
	
	try {
		if (name === 'Bright Red Dye') {
			fetchScript = 'combine'
			slug = `Dyes#${name.replace(/ /g, '_')}`
		}
		if (name === 'Acid Dye') {
			fetchScript = 'strange'
			slug = name.replace(/ /g, '_')
		}

		const scriptPath = `./labs/crawler/dyes/_fetch_${fetchScript}.script.js`
		await crawl({script: scriptPath, slug, name})
	 } catch (error) {
		console.log(`[××× Failed] ${error.status} with '${error.message}'`);
	 }
}
