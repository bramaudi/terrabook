const tables = [...document.querySelectorAll('.terraria')]
const list = []
for (const table of tables.splice(0, 4)) {
	for (const tr of table.querySelectorAll('tr')) {
        const td = tr.querySelectorAll('td')
        if (td.length > 1) list.push(td[1].textContent.trim())
    }
}
print(list)