const list = []
let itemlists = [...document.querySelectorAll('.itemlist')]
for (const itemlist of itemlists) {
	for (const li of itemlist.querySelectorAll('li')) {
		const name = li.querySelector('a').getAttribute('title').trim()
    	list.push(name !== 'Functional Statues' ? name : 'Statues')
    }
}

list.pop()
print(list)