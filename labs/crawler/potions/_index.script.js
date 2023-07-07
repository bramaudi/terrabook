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

const list = []
const only_golf = table.classList.contains('sortable')
if (only_golf) {
	table.querySelector('tr').remove()
}

for (const tr of table.querySelectorAll('tr')) {
    const td = tr.querySelectorAll('td')
	if (td.length > 1) {
        if (only_golf) removeTags(td[0], ['div'])
    	list.push(
            td[0].textContent
                .replace(/\(.*\)/g, '')
                .replace(/\d/g, '')
                .trim()
        )
    }
}
print(list)