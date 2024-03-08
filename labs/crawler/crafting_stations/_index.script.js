const list = []
const tables = document.querySelectorAll('table')

for (const table of tables) {
	for (const row of table.querySelectorAll('tr')) {
        const col = row.querySelectorAll('td')
		if (col.length > 0) {
            for (const link of col[0].querySelectorAll('a[title]')) {
            	list.push(link.textContent.trim())
            }
        }
	}
}

print(list.filter(n => n.length))