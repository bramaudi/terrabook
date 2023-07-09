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