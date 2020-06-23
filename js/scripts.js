const del = document.querySelector('#deletar')
del.addEventListener('click', (e) => {
    if(confirm('Confirma a Exclusão deste registro?')) {
        return true
    } else {
        e.preventDefault()
    }
})