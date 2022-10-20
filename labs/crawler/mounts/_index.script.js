const tables = document.querySelectorAll('table.terraria')
const list = []
for (const table of tables) {
	for (const tr of table.querySelectorAll('tr')) {
    	const td = tr.querySelectorAll('td')
		if (td.length > 1) {
            const nosuffix = ['Golf Cart','Flamingo','Witch\'s Broom','Rudolph', 'Wolf']
            const name = td[0]
                .querySelector('span span a')
                .textContent.trim()
            list.push(nosuffix.includes(name) ? name : `${name} Mount`)
        }
	}
}
print(list)