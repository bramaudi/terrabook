function removeTags($el, tags, recursive = true) {
	tags.forEach(tag => {
    	for (const elm of $el.querySelectorAll(tag)) {
            if (!recursive) {
                $el.innerHTML = $el.innerHTML
                	.replace(elm.outerHTML, elm.innerHTML)
            }
        	else elm.remove()
        }
    })
}
function parseImg($el) {
    for (const img of $el.querySelectorAll('img')) {
        const alt = img.getAttribute('alt')
            .replace(/\.(png|gif)/g, '')
        if (alt.match('Template loop')) { // Moon phase image
            const moonPhase = img.src
            	.split('/').slice(-1)[0]
            	.match(/Moon-(.*)/, '$1')[1]
                .replace(/\.(png|gif)/g, '')
            $el.innerHTML = $el.innerHTML
                .replace(img.outerHTML, `[img:Moon_phase_${moonPhase}]`)
        } else {
            $el.innerHTML = $el.innerHTML
                .replace(img.outerHTML, `[img:${alt}]`)
        }
    }
}
function parseLinks($el) {
	for (const elm of $el.querySelectorAll('a')) {
        $el.innerHTML = $el.innerHTML
            .replace(elm.outerHTML, `<linked>${elm.textContent}</linked>`)
    }
}
function clearSpan($el) {
    for (const span of $el.querySelectorAll('span')) {
    	if (span.getAttribute('style') || span.classList.contains('nowrap')) {
        	$el.innerHTML = $el.innerHTML
            	.replace(span.outerHTML, span.innerHTML)
        }
    }
}
function normalizeText($el) {
	$el.innerHTML = $el.innerHTML
        .replace(/&nbsp;/g, ' ')
        .trim()
}

let slug = $url.split('/').splice(-1)[0]
	slug = slug.split('#').splice(-1)[0]
	slug = slug.replace(/'/g, '\\\'')

const row = (() => {
    const list = [...document.querySelectorAll('.il2c')]
        .map(el => el.querySelector('a').textContent.trim())
    return [...document.querySelectorAll('.il2c')][list.indexOf(slug.replace(/_/, ' '))]
        .closest('tr')
})()

const title = slug.replace(/_/g, ' ')

const statistics = (() => {
    clearSpan(row)
    parseImg(row)
    removeTags(row, ['s'])
    parseLinks(row)
    normalizeText(row)
    const [,,Damage,Availability,Rarity,,Blast,Destroy] = row.children
    return {
        Damage: Damage.innerHTML.trim(),
        Availability: Availability.textContent.trim(),
        Rarity: Rarity.innerHTML.trim(),
        'Normal blast radius': Blast.innerHTML.trim(),
        'Destroy tiles': Destroy.innerHTML.trim(),
    }
})()

const summaries = (() => {
    const [,,,,,Source] = row.children
    return [Source.innerHTML.trim()]
})()

print({
	type: 'ammunitions',
	title,
    summaries,
    statistics,
})