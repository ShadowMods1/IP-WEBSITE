// Automatically grab user info
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://ipinfo.io/json?token=660283c26d0707') // Replace with your API token
        .then(response => response.json())
        .then(data => {
            const info = `
IP: ${data.ip}
City: ${data.city}
Region: ${data.region}
Country: ${data.country}
ISP: ${data.org}
Timezone: ${data.timezone}
            `;
            document.getElementById('info').innerText = info;

            // Optionally store IP for later use
            window.userIP = data.ip;
        })
        .catch(err => {
            document.getElementById('info').innerText = 'Error fetching IP info.';
            console.error(err);
        });
});

// Execute server-side actions
function execute(action) {
    const ip = window.userIP || prompt('Enter IP Address:');
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
