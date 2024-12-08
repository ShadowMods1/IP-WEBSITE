function fetchCommand(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('output').textContent = data.output;
        })
        .catch(error => {
            document.getElementById('output').textContent = 'Error: ' + error;
        });
}

function geolocate() {
    const ip = prompt('Enter IP for geolocation:');
    fetchCommand(`/command/geolocate?ip=${ip}`);
}

function traceDNS() {
    const ip = prompt('Enter IP for DNS trace:');
    fetchCommand(`/command/tracedns?ip=${ip}`);
}

function portScan() {
    const ip = prompt('Enter IP for port scan:');
    const ports = prompt('Enter ports (e.g., 80, 443):');
    fetchCommand(`/command/portscan?ip=${ip}&ports=${ports}`);
}

function ddos() {
    fetchCommand('/command/ddos');
}

function macAddr() {
    const ip = prompt('Enter IP for Mac address trace:');
    fetchCommand(`/command/macaddr?ip=${ip}`);
}

function arpspoof() {
    const ip = prompt('Enter IP for ARP spoofing:');
    fetchCommand(`/command/arpspoof?ip=${ip}`);
}

function rpcDump() {
    const ip = prompt('Enter IP for RPC dump:');
    fetchCommand(`/command/rpcdump?ip=${ip}`);
}
