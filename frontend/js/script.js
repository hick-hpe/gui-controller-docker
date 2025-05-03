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
        .then(_ => {

            const iframe = document.querySelector('iframe');
            iframe.src = "http://localhost:8080/?t=" + new Date().getTime();
            atualizarStatusContainer(name);

        })
        .catch(err => {
            console.error(err);
        });
}


function atualizarStatusContainer(name) {
    fetch(`http://localhost:5000/container/status/${name}`)
        .then(res => res.json())
        .then(data => {
            const badge = document.getElementById('status-badge');
            const status = data.status;

            console.log('Status:', status);

            if (status === 'running') {
                badge.textContent = 'Ativo';
                badge.className = 'badge rounded-pill text-bg-success';
            } else {
                badge.textContent = 'Parado';
                badge.className = 'badge rounded-pill text-bg-danger';
            }
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.querySelector('iframe');
    iframe.src = "http://localhost:8080/?t=" + new Date().getTime();
    console.log('atualizou')
    atualizarStatusContainer('apache');
});