const headers = {
    'Authorization': `token ${TOKEN}`
}

async function carregarRepositorios() {
    const urls = [
        'https://api.github.com/repos/LukBomfim/Fcar',
        'https://api.github.com/repos/jcdev01/Locadora',
        'https://api.github.com/repos/LukBomfim/projeto-programacao',
        'https://api.github.com/repos/LukBomfim/Biblioteca',
        'https://api.github.com/repos/LukBomfim/MELLK',
        'https://api.github.com/repos/LukBomfim/Portfolio',
    ]

    const respostas = await Promise.all(
        urls.map(url => fetch(url, { headers }))
    )

    const repos = await Promise.all(
        respostas.map(resposta => resposta.json())
    )
    
    return repos
}

function concluido(repo){
    if (repo.topics.includes('production-ready') || repo.name === 'Locadora') {
        return true
    } else if (repo.topics.includes('work-in-progress')) {
        return false
    } else{
        return null
    }
}

async function linguagens(repos) {

    const linguagens = await Promise.all (
        
        repos.map(async repo => {
            const resposta = await fetch(
                repo.languages_url,
                { headers }
            )

            const dados = await resposta.json();

            return {
                name: repo.name,
                linguagens: Object.keys(dados)
            }
        })
    )
    
    return linguagens
}

async function exibirRepositorios() {
    const repositorios = await carregarRepositorios()
    const lista = document.getElementById('lista-projetos')
    const linguagensProjeto = await linguagens(repositorios)

    repositorios.forEach(repo => {
        const item = document.createElement('li')
        let progresso = ''

        // VERIFICAR SE TA CONCLUÍDO OU EM PROGRESSO
        if (concluido(repo) === true) {
            progresso = `
                <span class="progresso concluido">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Concluído
                </span>
            `;
        } else if (concluido(repo) === false) {
            progresso = `
                <span class="progresso wip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Em progresso
                </span>
            `
        } else {
            progresso = ''
        }

        const repoLinguagens = linguagensProjeto.find(
            linguagem => linguagem.name === repo.name
        )

        const divStack = document.createElement('div')
        divStack.classList.add('stack')

        repoLinguagens.linguagens.forEach(linguagem => {
            const spanLing = document.createElement('span')

            if (linguagem === 'Python') {
                spanLing.textContent = 'Python'
                spanLing.classList.add('span-python')
            } 
            else if (linguagem === 'HTML') {
                spanLing.textContent = 'HTML'
                spanLing.classList.add('span-html')
            } 
            else if (linguagem === 'CSS') {
                spanLing.textContent = 'CSS'
                spanLing.classList.add('span-css')
            }
            else if (linguagem === 'JavaScript') {
                spanLing.textContent = 'JavaScript'
                spanLing.classList.add('span-javascript')
            }
            else if (linguagem === 'Java') {
                spanLing.textContent = 'Java'
                spanLing.classList.add('span-java')
            } else {
                return
            }

            divStack.appendChild(spanLing)
        })

        item.innerHTML = `
            <div class="projeto-header">
                <h4>${repo.name.toUpperCase()}</h4>
                ${progresso}
            </div>
            <p>
                ${repo.description || ''}
            </p>
        `
        item.appendChild(divStack)
        lista.appendChild(item)
    })

}

window.onload = function() {
    exibirRepositorios()
}