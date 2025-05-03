function sendDockerCommand(action, name) {
    console.log(action, name);

    const CMD = {
        'start': 'Iniciando...',
        'stop': 'Parando...',
        'restart': 'Reiniciando...',
    };
    // atualizar badge
    const badge = document.getElementById('status-badge');
    badge.textContent = CMD[action] || 'Executando...';
    badge.className = 'badge rounded-pill text-bg-secondary';

    fetch(`http://localhost:5000/container/${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
    })
        .then(res => res.json())
        .then(data => {
            // alert(data.status || data.error);

            // Atualiza o iframe (forçando reload)
            const iframe = document.querySelector('iframe');
            iframe.src = "http://localhost:8080/?t=" + new Date().getTime();
            atualizarStatusContainer(name);

        })
        .catch(err => {
            console.error(err);
            // alert('Ocorreu um erro. Veja o console para detalhes.');
        });
}


function atualizarStatusContainer(name) {
    fetch(`http://localhost:5000/container/status/${name}`)
        .then(res => res.json())
        .then(data => {
            const badge = document.getElementById('status-badge');
            const status = data.status;

            const STATUS_ACTIONS = {
                'running': () => {
                    badge.textContent = 'Ativo';
                    badge.className = 'badge rounded-pill text-bg-success';
                },
                'exited': () => {
                    badge.textContent = 'Parado';
                    badge.className = 'badge rounded-pill text-bg-danger';
                },
                'stopped': () => {
                    badge.textContent = 'Parado';
                    badge.className = 'badge rounded-pill text-bg-danger';
                },
            }
            STATUS_ACTIONS[status] ? STATUS_ACTIONS[status]() : (() => {
                badge.textContent = 'Indefinido';
                badge.className = 'badge rounded-pill text-bg-secondary';
            })();
        });
}

// fetch(`http://localhost:5000/`)
//     .then(data => {
//         console.log(data);
//     });
    
// console.log(('----------------'));
atualizarStatusContainer('ctn-teste');