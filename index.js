// Function to get current time in readable format
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString(); 
}

// Function to copy text to clipboard
function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied: " + text);
    }).catch(err => {
        console.error("Failed to copy", err);
    });
}

// Track the last alert time to avoid spam
let lastAlertTime = 0; // Stores the timestamp of the last alert

// Function to send WhatsApp alert when the server is down
async function sendWhatsAppMessage(message) {
    const phoneNumber = "60126479378"; // Replace with your WhatsApp number (Malaysia: 60XXXXXXXXX)
    const apiKey = "4946605"; // Replace with your CallMeBot API key

    const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            console.log("WhatsApp message sent successfully!");
        } else {
            console.error("Failed to send WhatsApp message");
        }
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
    }
}

let javaPlayers = [];
let bedrockPlayers = [];

function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('show');
}


// Java server check function
async function checkJavaServer(ip, port) {
    const apiUrl = `https://api.mcsrvstat.us/2/${ip}:${port}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.players.list && data.players.list.length > 0) {
            const playerListElement = document.getElementById("java-player-list");
            playerListElement.innerHTML = ''; // Clear existing list
        
            data.players.list.forEach(playerName => {
                const playerHeadUrl = `https://minotar.net/avatar/${playerName}/32`;
                const listItem = `<li><img src="${playerHeadUrl}" alt="${playerName}'s head" class="player-head" style="width: 32px; height: 32px; margin-right: 10px;">${playerName}</li>`;
                playerListElement.innerHTML += listItem;
            });
        } else {
            document.getElementById("java-player-list").innerText = 'No players online';
        }
        

        // Display number of players online and max capacity
        const onlinePlayers = data.players.online || 0;
        const maxCapacity = data.players.max || 0;
        document.getElementById("java-status").innerHTML = `✅ Online (${onlinePlayers}/${maxCapacity})`;
        document.getElementById("java-status").className = data.online ? 'status online' : 'status offline';

        // Update the last checked time
        document.getElementById("java-last-checked").innerText = `Last checked: ${getCurrentTime()}`;

        // If the server is offline, send a WhatsApp message
        if (!data.online) {
            sendWhatsAppMessage(`Java server is offline at ${getCurrentTime()}`);
        }

    } catch (error) {
        console.error('Error fetching Java server data:', error);
        document.getElementById("java-status").innerText = '⚠️ Error checking status';
        document.getElementById("java-status").className = 'status maintenance';

        // Update the last checked time
        document.getElementById("java-last-checked").innerText = `Last checked: ${getCurrentTime()}`;

        // Send a WhatsApp message if there's an error
        sendWhatsAppMessage(`Error checking Java server at ${getCurrentTime()}`);
    }
}

// Bedrock server check function
function checkBedrockServer() {
    const apiUrl = 'https://api.mcsrvstat.us/2/coldlava.ddns.net:59490'; // Fixed URL for Bedrock server //ACTUAL BEDROCK URL 58942 

    fetch(apiUrl)
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            if (data.info && data.info.html && data.info.html.length > 0) {
                const playerListElement = document.getElementById("bedrock-player-list");
                playerListElement.innerHTML = ''; // Clear existing list
            
                data.info.html.forEach(playerName => {
                    const listItem = `<li>${playerName}</li>`;
                    playerListElement.innerHTML += listItem;
                });
            } else {
                document.getElementById("bedrock-player-list").innerText = 'No players online';
            }
            

            // Display number of players online and max capacity
            const onlinePlayers = data.players.online || 0;
            const maxCapacity = data.players.max || 0;
            document.getElementById("bedrock-status").innerHTML = `✅ Online (${onlinePlayers}/${maxCapacity})`;
            document.getElementById("bedrock-status").className = data.online ? 'status online' : 'status offline';

            // Update the last checked time
            document.getElementById("bedrock-last-checked").innerText = `Last checked: ${getCurrentTime()}`;

            // If the server is offline, send a WhatsApp message
            if (!data.online) {
                sendWhatsAppMessage(`Bedrock server is offline at ${getCurrentTime()}`);
            }

        })
        .catch(error => {
            console.error('Error fetching Bedrock player data:', error);
            document.getElementById("bedrock-status").innerText = '⚠️ Error checking status';
            document.getElementById("bedrock-status").className = 'status maintenance';

            // Update the last checked time
            document.getElementById("bedrock-last-checked").innerText = `Last checked: ${getCurrentTime()}`;

            // Send a WhatsApp message if there's an error
            sendWhatsAppMessage(`Error checking Bedrock server at ${getCurrentTime()}`);
        });
}

// Call the functions when the page is loaded
document.addEventListener("DOMContentLoaded", function() {
    checkJavaServer("coldlava.ddns.net", "59490"); // Replace with your Java server IP and port
    checkBedrockServer(); // Call for the Bedrock server
});

// Auto refresh every 60 seconds
setInterval(() => {
    checkJavaServer("coldlava.ddns.net", "59490");
    checkBedrockServer();
}, 60000);
