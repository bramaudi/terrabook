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
	slug = slug.replace("'", "\\'")

const row = document.querySelector(`#${slug}`).closest('tr')

const title = slug.replace(/_/g, ' ')

const summaries = (() => {
    clearSpan(row)
    parseImg(row)
    removeTags(row, ['s'])
    parseLinks(row)
    normalizeText(row)
    const list = row.lastElementChild.querySelectorAll('li')
	return [...list].map(n => n.innerHTML.trim())
})()

const statistics = (() => {
    clearSpan(row)
    parseImg(row)
    removeTags(row, ['s'])
    parseLinks(row)
    normalizeText(row)
    const [,,Ingredients,Source,String,Golf,BrightDye,BlackDye,SilverDye,Special] = row.children
    return {
        Ingredients: Ingredients.textContent.trim(),
        Source: Source.textContent.trim(),
        String: String.textContent.trim(),
        'Golf Ball': Golf.textContent.trim(),
        'Bright Dye (+ Silver Dye)': BrightDye.textContent.trim(),
        '+ Black Dye': BlackDye.textContent.trim(),
        '+ Silver Dye': SilverDye.textContent.trim(),
        Special: Special.textContent.trim()
    }
})()

const source = (() => {
    const [,,,Source] = row.children
    return Source.innerHTML.trim()
})()

print({
    type: 'dyes',
	title,
    summaries,
    statistics,
    source,
})