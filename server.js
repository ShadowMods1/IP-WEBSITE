const express = require('express');
const whois = require('whois-json');
const sslChecker = require('ssl-check');
const ping = require('ping');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Your Discord webhook URL
const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL'; // Replace with your actual Discord webhook URL

app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());  // Middleware to parse JSON request bodies

// Route for traceroute
app.get('/command/traceroute', (req, res) => {
    const { ip } = req.query;
    exec(`traceroute ${ip}`, (err, stdout, stderr) => {
        if (err) {
            res.json({ output: 'Error executing traceroute' });
        } else {
            sendToDiscord(`Traceroute result for IP: ${ip}\n${stdout}`);
            res.json({ output: stdout });
        }
    });
});

// Route for Whois lookup
app.get('/command/whois', (req, res) => {
    const { domain } = req.query;
    whois(domain, (err, data) => {
        if (err) {
            res.json({ output: 'Error performing Whois lookup' });
        } else {
            sendToDiscord(`Whois result for domain: ${domain}\n${JSON.stringify(data, null, 2)}`);
            res.json({ output: JSON.stringify(data, null, 2) });
        }
    });
});

// Route for SSL certificate check
app.get('/command/sslcheck', (req, res) => {
    const { domain } = req.query;
    sslChecker(domain).then(data => {
        sendToDiscord(`SSL certificate check result for domain: ${domain}\n${JSON.stringify(data, null, 2)}`);
        res.json({ output: JSON.stringify(data, null, 2) });
    }).catch(err => {
        sendToDiscord(`Error checking SSL certificate for domain: ${domain}`);
        res.json({ output: 'Error checking SSL certificate' });
    });
});

// Route for Ping test
app.get('/command/ping', (req, res) => {
    const { ip } = req.query;
    ping.sys.probe(ip, function(isAlive) {
        const msg = isAlive ? `${ip} is reachable` : `${ip} is not reachable`;
        sendToDiscord(`Ping result for IP: ${ip}\n${msg}`);
        res.json({ output: msg });
    });
});

// Route for Web Vulnerability Scanner (basic example)
app.get('/command/vulnscan', (req, res) => {
    const { url } = req.query;
    // Simple check for 'inject' keyword to simulate vulnerability scan
    const isVulnerable = url.includes('inject');
    const result = isVulnerable ? 'Potential vulnerability found: SQL Injection' : 'No vulnerabilities detected';
    sendToDiscord(`Web vulnerability scan result for URL: ${url}\n${result}`);
    res.json({ output: result });
});

// Function to send data to Discord Webhook
function sendToDiscord(message) {
    const fetch = require('node-fetch');
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message })
    }).catch(err => console.error('Error sending to Discord:', err));
}

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
