const table = document.querySelector('.terraria')
	|| document.querySelector('.crafts .sortable')

const list = []

for (const tr of table.querySelectorAll('tr')) {
    const td = tr.querySelectorAll('td')
	if (td.length > 1) {
        removeTags(td[0], ['span.id'])
    	list.push(
            td[0].textContent
                .replace(/\(.*\)/g, '')
                .trim()
        )
    }
}
print(list)