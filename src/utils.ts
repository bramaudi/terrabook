export function parseImg(html: string) {
	return html.replace(/\[img:(.*?)\]/g, (...group) => {
		const name = group[1]
		const slug = name.replace(/ /g, '_')
		return `
		<span class="tooltip">
			<span class="tooltip-text">${name}</span>
			<img
				class="max-h-5 inline"
				${name.match('Rarity') ? '' : 'style="max-width: 1.25rem"'}
				src="${`/images/${slug}.webp`}"
			/>
		</span>
		`.replace(/\n/g, "")
		.replace(/[\t ]+\</g, "<")
		.replace(/\>[\t ]+\</g, "><")
		.replace(/\>[\t ]+$/g, ">")
	})
}