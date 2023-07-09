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
    const [,,,,Time,Height,Horizontal,Vertical,Rarity] = row.children
    return {
        Time: Time.textContent.trim(),
        Height: Height.textContent.trim(),
        Horizontal: Horizontal.textContent.trim(),
        Vertical: Vertical.innerHTML.trim(),
        Rarity: Rarity.textContent.trim(),
    }
})()

const source = (() => {
    const [,,,Source] = row.children
    return Source.innerHTML.trim()
})()

print({
    type: 'wings',
	title,
    summaries,
    statistics,
    source,
})