const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));

// API for commands
app.get('/command/:action', (req, res) => {
    const { action } = req.params;
    const ip = req.query.ip || '';

    let command = '';
    switch (action) {
        case 'geolocate':
            command = `curl -s http://ipinfo.io/${ip}/json`;
            break;
        case 'tracedns':
            command = `nslookup ${ip}`;
            break;
        case 'portscan':
            const ports = req.query.ports || '';
            command = `nmap -p ${ports} ${ip}`;
            break;
        default:
            return res.status(400).send({ error: 'Invalid action' });
    }

    exec(command, (err, stdout) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ output: stdout });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
