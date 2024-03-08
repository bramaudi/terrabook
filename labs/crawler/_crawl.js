import {
	readFileSync,
	writeFileSync,
	existsSync,
	mkdirSync
} from 'fs'
import fetch from 'node-fetch'
import { parseHTML } from 'linkedom'

/**
 * Crawler
 * @param {{
 * script: string[]
 * slug: string
 * name: string?
 * update_cache: boolean?
 * verbose: boolean?
 * custom_slug: boolean?
 * }} props 
 * @returns 
 */


/**
 * Crawler
 * @param {string[]} props.script
 * @param {string} props.slug
 * @param {boolean} props.update_cache default: false
 * @param {boolean} props.verbose default: false
 * @param {boolean} props.custom_slug default: false
 */
export default async function crawl(props) {
	let {
		script,
		slug,
		name = null,
		update_cache = false,
		verbose = false,
		custom_slug = false
	} = props
	if (!script) return console.log('"--script" argument cannot be empty')
	if (!slug) return console.log('"--slug" argument cannot be empty')

	const WIKI_URL = 'https://terraria.wiki.gg/' + (custom_slug ? '' : 'wiki/')
	const CACHE = `./labs/crawler/_cache/${custom_slug ? name : slug}.html`
	
	// Create if script folder exists
	const folder = `./public/json`
	if (!existsSync(folder)) {
		mkdirSync(folder)
	}
	
	// Get html and save in cache (if update_cache disabled)
	if (!existsSync(CACHE) || update_cache) {
		await fetch(WIKI_URL + slug).then(async (res) => {
			if (verbose) console.log(`Caching ${slug}`);
			writeFileSync(CACHE, await res.text(), { encoding: 'utf-8' })
		})
	}
	
	// Run script and write json result
	let scriptStr = ''
	for (const scriptPath of script) {
		if (!existsSync(scriptPath)) return console.log(`--script ${scriptPath} not found`)
		scriptStr += readFileSync(scriptPath, { encoding: 'utf-8' })
	}
	const html = readFileSync(CACHE, { encoding: 'utf-8' })
	const { document } = parseHTML(html)

	// Saved file name
	name = name || slug
	
	function json(obj) {
		const target = `${folder}/${name}.json`
		const content = JSON.stringify(obj, null, 2)
		if (verbose) console.log(`Write ${target}`);
		writeFileSync(target, content, { encoding: 'utf-8' })
	}

	try {
		new Function('document', 'print', '$url', scriptStr)(document, json, WIKI_URL + slug)
		// process.stdout.write()
		process.stdout.write(`\u001b[32m [✔] ${name}\u001b[39m\n`);
	} catch (error) {
		process.stdout.write(`\u001b[31m [✗] ${name}\u001b[39m\n`);
		writeFileSync(`./labs/crawler/_logs/${name}.txt`, error.stack, { encoding: 'utf-8' })
	}

	return
}