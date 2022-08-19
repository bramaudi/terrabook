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
        $el.innerHTML = $el.innerHTML
            .replace(img.outerHTML, `[img:${alt}]`)
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
        .replace(/\n+/g, '')
        .replace(/\t+/g, '')
        .trim()
}

const title = document.querySelector('#firstHeading').textContent

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
        if (['DIV','BLOCKQUOTE','TABLE'].includes(walk.nodeName)) {
            walk = walk.nextElementSibling
            continue;
        }
        clearSpan(walk)
        parseImg(walk)
        removeTags(walk, ['sup', 'br'])
        removeTags(walk, ['a'], false)
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
        const value = col2.innerHTML
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
const living_preferences = (() => {
    let el = document.querySelector('.living-preferences') ||
          document.querySelector('#Living_preferences')
    if (!el) return

    if (el.id === 'Living_preferences') {
        el = el.closest('h2')
        let html = ''
        while (el.nextElementSibling.nodeName === 'P') {
            const next = format(el.nextElementSibling)
            html += next.outerHTML
            el = el.nextElementSibling
        }
        return html
    }

    format(el)
    return el.innerHTML
})()

const drops= (() => {
    const ul = document.querySelector('ul.drops.items')
    if (!ul) return
    return format(ul).outerHTML
})()

const json_result = {
    type: 'npcs',
    title,
    summaries,
    statistics,
    living_preferences,
    drops,
}
print(JSON.parse(JSON.stringify(json_result)))