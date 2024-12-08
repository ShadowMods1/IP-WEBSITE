function execute(action) {
    const ip = prompt('Enter IP Address:');
    if (!ip) return;

    fetch(`/command/${action}?ip=${ip}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').innerText = data.output || data.error;
        })
        .catch(err => {
            document.getElementById('output').innerText = `Error: ${err.message}`;
        });
}
