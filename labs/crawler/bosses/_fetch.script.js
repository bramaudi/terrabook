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

const title = $url.split('/').slice(-1)[0].replace(/_/g, ' ')

const summaries = (() => {
    let walk = (() => {
        const mwParser = document.querySelector('.mw-parser-output')
        let i = 0
        while (mwParser.children[i].nodeName !== 'P') i++
        return mwParser.children[i]
    })()
    const data = []
    while (walk && (
        walk.getAttribute('id') !== 'toc' &&
        walk.nodeName !== 'H2' ||
        (walk.nodeName === 'TABLE' && !walk.classList.contains('infobox'))
    )) {
        if (['DIV','BLOCKQUOTE','TABLE'].includes(walk.nodeName) ||
           walk.querySelector('.gameText')) {
            walk = walk.nextElementSibling
            continue;
        }
        clearSpan(walk)
        parseImg(walk)
        removeTags(walk, ['sup', 'br'])
        removeTags(walk, ['a'], false)
        removeSoundTag(walk)
        normalizeText(walk)
        if (walk.nodeName === 'UL') {
            data.push(walk.outerHTML)
        }
        else data.push(walk.innerHTML)
        walk = walk.nextElementSibling
    }
    return data
})()

const statistics = (() => {
    const stats = document.querySelector('.section.statistics')
    const tbody = stats.querySelector('tbody')
    const rows = {}
    for (const tr of tbody.querySelectorAll('tr')) {
        const [col1, col2] = tr.childNodes
        const key = col1.textContent.trim()
        normalizeText(col2)
        clearSpan(col2)
        parseImg(col2)
        removeTags(col2, ['s','sup'])
        removeTags(col2, ['a'], false)
        let value = col2.innerHTML
        if (key === 'Immune to') {
        	value = [...col2.querySelectorAll('span.i')]
            	.map(e => e.textContent.trim().replace(/\[img:(.*)\]/, '$1'))
            	.join(', ')
        }
        rows[key] = value
    }
    delete rows['Type']
    return rows
})()

const format = el => {
    normalizeText(el)
    clearSpan(el)
    parseImg(el)
    removeTags(el, ['s','sup'])
    removeTags(el, ['a'], false)
    return el
}

const summon = (() => {
	const headline = (() => {
    	let el = document.getElementById('Spawning') ||
            document.getElementById('Spawn') ||
            document.getElementById('Summoning')
        if (!el) return
        el = el.parentElement
        if (el.nodeName === 'H2') return el
    })()
    if (!headline) return
    const arr = []
    let walk = headline.nextElementSibling
    while (walk.nodeName !== 'H2') {
        if (walk.classList.contains('message-box-container') ||
           walk.classList.contains('hat-note')) {
        	walk = walk.nextElementSibling
            continue
        }
        format(walk)
        arr.push(walk.outerHTML)
    	walk = walk.nextElementSibling
    }
    return arr
})()

const drops= (() => {
    const ul = document.querySelector('ul.drops.items')
    if (!ul) return
    return format(ul).outerHTML
})()

const json_result = {
    type: 'bosses',
    title,
    summaries,
    statistics,
    summon,
    drops,
}
print(JSON.parse(JSON.stringify(json_result)))