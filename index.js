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

// Function to check server status
async function checkServer(type, ip, port, statusId, playerListId, lastCheckedId) {
    const url = type === "java" 
        ? `https://api.mcsrvstat.us/2/${ip}:${port}` 
        : `https://api.mcsrvstat.us/bedrock/2/${ip}:${port}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const statusElement = document.getElementById(statusId);
        const playerListElement = document.getElementById(playerListId);
        const lastCheckedElement = document.getElementById(lastCheckedId);

        if (data.online) {
            statusElement.innerText = `✅ Online - ${data.players.online}/${data.players.max} players`;
            statusElement.className = "status online";

            if (data.players.list && data.players.list.length > 0) {
                playerListElement.innerHTML = data.players.list.map(player => `<li>${player}</li>`).join('');
            } else {
                playerListElement.innerHTML = "<li>No players online</li>";
            }
        } else {
            statusElement.innerText = "❌ Offline";
            statusElement.className = "status offline";
            playerListElement.innerHTML = "<li>Server is offline</li>";
        }

        lastCheckedElement.innerText = getCurrentTime(); // Update last-checked time

    } catch (error) {
        document.getElementById(statusId).innerText = "⚠️ Error checking status";
        document.getElementById(statusId).className = "status maintenance";
        document.getElementById(playerListId).innerHTML = "<li>Could not retrieve player list</li>";
    }
}

// Initial server status check
checkServer("java", "coldlava.ddns.net", "59490", "java-status", "java-player-list", "java-last-checked");
checkServer("bedrock", "coldlavabedrock.ddns.net", "58942", "bedrock-status", "bedrock-player-list", "bedrock-last-checked");

// Auto refresh every 60 seconds
setInterval(() => {
    checkServer("java", "coldlava.ddns.net", "59490", "java-status", "java-player-list", "java-last-checked");
    checkServer("bedrock", "coldlavabedrock.ddns.net", "58942", "bedrock-status", "bedrock-player-list", "bedrock-last-checked");
}, 60000);
