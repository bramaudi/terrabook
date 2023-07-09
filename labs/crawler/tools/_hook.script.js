let slug = $url.split('/').splice(-1)[0]
	slug = slug.split('#').splice(-1)[0]

const row = document.querySelector(`#${slug}`).closest('tr')

const title = slug.replace(/_/g, ' ')

const summaries = (() => {
    const list = row.lastElementChild.querySelectorAll('li')
	return [...list].map(n => n.innerHTML.trim())
})()

const statistics = (() => {
    clearSpan(row)
    parseImg(row)
    removeTags(row, ['s'])
    parseLinks(row)
    normalizeText(row)
    const [,,,Reach,Velocity,Hooks,Latching,Sell,Rarity] = row.children
    return {
        Reach: Reach.innerHTML.trim(),
        Velocity: Velocity.textContent.trim(),
        Hooks: Hooks.textContent.trim(),
        Latching: Latching.textContent.trim(),
        Sell: Sell.innerHTML.trim(),
        Rarity: Rarity.textContent.trim(),
    }
})()

const source = (() => {
    const [,,Source] = row.children
    return Source.innerHTML.trim()
})()

print({
    type: 'hooks',
	title,
    summaries,
    statistics,
    source,
})