const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Utility function to execute shell commands and return the result
const executeCommand = (command, res) => {
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send({ error: 'Command execution failed' });
        }
        res.send({ output: stdout });
    });
};

// Route to fetch public IP and geolocation information
app.get('/command/geolocate', (req, res) => {
    const ip = req.query.ip || '';
    const command = `curl -s http://ipinfo.io/${ip}/json`;
    executeCommand(command, res);
});

// Route for DNS Trace (nslookup)
app.get('/command/tracedns', (req, res) => {
    const ip = req.query.ip || '';
    const command = `nslookup ${ip}`;
    executeCommand(command, res);
});

// Route for Port Scan using Nmap
app.get('/command/portscan', (req, res) => {
    const ip = req.query.ip;
    const ports = req.query.ports || '';
    if (!ip) return res.status(400).send({ error: 'IP address is required' });
    const command = `nmap -p ${ports} ${ip}`;
    executeCommand(command, res);
});

// Route for DDOS (links to external stressers)
app.get('/command/ddos', (req, res) => {
    const options = `
    1) https://freestresser.so/
    2) https://hardstresser.com/
    3) https://stresser.net/
    4) https://str3ssed.co/
    5) https://projectdeltastress.com/
    `;
    res.send({ output: options });
});

// Route for Mac Address Trace
app.get('/command/macaddr', (req, res) => {
    const ip = req.query.ip || '';
    if (!ip) return res.status(400).send({ error: 'IP address is required' });
    const command = `ping -w 1 ${ip} >nul && arp -a | find "${ip}"`;
    executeCommand(command, res);
});

// Route for ARP Spoof (DOS)
app.get('/command/arpspoof', (req, res) => {
    const ip = req.query.ip || '';
    if (!ip) return res.status(400).send({ error: 'IP address is required' });
    const command = `arpspoof ${ip}`;
    executeCommand(command, res);
});

// Route for RPC Dump (assuming some RPC tool exists, it may need a separate executable or command)
app.get('/command/rpcdump', (req, res) => {
    const ip = req.query.ip || '';
    if (!ip) return res.status(400).send({ error: 'IP address is required' });
    const command = `rpcdump ${ip}`;
    executeCommand(command, res);
});

// Fallback route for invalid paths
app.use((req, res) => {
    res.status(404).send({ error: 'Invalid endpoint' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
