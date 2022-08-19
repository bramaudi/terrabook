const tables = document.querySelectorAll('table.terraria')
const list = []
for (const table of tables) {
	for (const tr of table.querySelectorAll('tr')) {
    	const td = tr.querySelectorAll('td')
		if (td.length > 1) {
            list.push(td[1].querySelector('a').textContent.trim())
        }
	}
}
print(list)