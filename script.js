async function carregarRepositorios() {
    const urls = [
        'https://api.github.com/repos/LukBomfim/Fcar',
        'https://api.github.com/repos/LukBomfim/Locadora',
        'https://api.github.com/repos/LukBomfim/projeto-programacao',
        'https://api.github.com/repos/LukBomfim/Biblioteca',
        'https://api.github.com/repos/LukBomfim/MELLK',
        'https://api.github.com/repos/LukBomfim/lista-de-tarefas'
    ]

    const respostas = await Promise.all(
        urls.map(url => fetch(url))
    )

    const repos = await Promise.all(
        respostas.map(resposta => resposta.json())
    )
    
    return repos
}

function concluido(repo){
    if (repo.topics.includes('production-ready')) {
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
                repo.languages_url
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


        // ADICIONAR AS LINGUAGENS
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


        // LINKS DE CADA PROJETO
        const divLinks = document.createElement('div')

        divLinks.classList.add('projeto-link')

        const linkCodigo = document.createElement('a')
        linkCodigo.href = repo.html_url
        linkCodigo.target = '_blank'
        linkCodigo.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
        Código
        `
        divLinks.appendChild(linkCodigo)

        if (repo.homepage) {
            const linkDemo = document.createElement('a')
            linkDemo.href = repo.homepage
            linkDemo.target = '_blank'
            linkDemo.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Demonstração`

            divLinks.appendChild(linkDemo)
        }


        // CRIAÇÃO DO PROJETO
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
        item.appendChild(divLinks)
        lista.appendChild(item)
    })

}

window.onload = function() {
    exibirRepositorios()
}