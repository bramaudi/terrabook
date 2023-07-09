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
function removeSoundTag($el) {
	[...$el.querySelectorAll('.sound')].forEach(el => {
    	el.outerHTML = el
            .querySelector('.sound-title')
        	.textContent.trim()
    })
}
function normalizeText($el) {
	$el.innerHTML = $el.innerHTML
        .replace(/&nbsp;/g, ' ')
        .replace(/\n+/g, '')
        .replace(/\t+/g, '')
        .trim()
}
function format(el, tags = ['s']) {
    normalizeText(el)
    clearSpan(el)
    parseImg(el)
    parseLinks(el)
    removeTags(el, tags)
    removeSoundTag(el)
    return el
}
function parseCraftTable() {    
    const result = {}
    const crafts = document.querySelectorAll('.recipes')
    for (const $craft of crafts) {
        if (!$craft.previousElementSibling) return
        const title = (() => {
            const prev1 = $craft.previousElementSibling
            const prev2 = $craft
            	.previousElementSibling
            	.previousElementSibling
            const caption = prev1.querySelector('caption')
            let el = prev2?.nodeName === 'H3' ? prev2 : prev1
            if (caption) el = caption
            format(el, ['s','br'])
            return el.innerHTML
        })()
    	const rows = []
        for (const tr of $craft.querySelectorAll('tr')) {
            function getCol(className) {
                const el = tr.querySelector(className)
                if (!el) return undefined
                clearSpan(el)
                parseImg(el)
                parseLinks(el)
                normalizeText(el)
                const rowspan = ~~el.getAttribute('rowspan') || undefined
                const value = el.innerHTML
                return { rowspan, value }
            }
            const result = getCol('.result')
            const ingredients = getCol('.ingredients')
            const station = getCol('.station')
            rows.push({ result, ingredients, station })
        }
        result[title] = rows.slice(1)
    }
    return result
}
function getInfobox() {
    const title = $url.split('/').slice(-1)[0].replace(/_/g, ' ')
	for (const infobox of document.querySelectorAll('.infobox.npc')) {
        if (infobox.querySelector('.title').firstChild.textContent === title) {
            return infobox
        }
    }
    for (const infobox of document.querySelectorAll('.infobox.npc')) {
        if (!infobox.querySelector('.variant')) return infobox
    }
    return document.querySelector('.infobox.npc')
}