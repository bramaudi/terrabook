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

const table = document.querySelector('.terraria')
	|| document.querySelector('.crafts .sortable')

let list = []
const only_golf = table.classList.contains('sortable')
if (only_golf) {
	table.querySelector('tr').remove()
}

for (const tr of table.querySelectorAll('tr')) {
    const td = tr.querySelector('td')
    const anchors = [...td.querySelectorAll('a')]
        .map(n => (n.getAttribute('title') || n.textContent)
                .replace(/\(.*\)/g, '')
                .trim()
        )
        .filter(v => v)
    list = [...list, ...anchors]
}
print(list)