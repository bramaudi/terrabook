const list = [...document.querySelectorAll('.hgroup .main')]
    .map(e => e.textContent.replace(/\(.*\)/g, '').trim())
    .slice(0, -3) // remove 3ds bosses
print(list)