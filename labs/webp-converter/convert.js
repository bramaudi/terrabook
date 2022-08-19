import webp from 'webp-converter'
import fg from 'fast-glob'
import { basename } from 'path';

const dirname = path => {
	return new URL(path, import.meta.url).pathname
}

const pngs = await fg(dirname('png-gif/*.png'))
const gifs = await fg(dirname('png-gif/*.gif'))
for (const img of [...pngs,...gifs]) {
	const command = {
		'png': 'cwebp',
		'gif': 'gwebp'
	}
	const ext = basename(img).split('.').slice(-1)
	await webp[command[ext]](
		img,
		dirname(`webp/${basename(img).replace(/\.(png|gif)/, '.webp')}`),
		"-q 80"
	);
	console.log(`Convert ${basename(img)}`);
}

