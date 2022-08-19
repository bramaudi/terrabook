const list = []
for (const itemlist of document.querySelectorAll('.itemlist')) {
	for (const li of itemlist.querySelectorAll('li')) {
    	list.push(li.querySelector('a').getAttribute('title'))
    }
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

print(list.filter(onlyUnique))