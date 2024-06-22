document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('chat-input').value;
    if (userInput.trim() === '') return;

    const chatOutput = document.getElementById('chat-output');
    const userMessage = document.createElement('div');
    userMessage.classList.add('user-message');
    userMessage.textContent = userInput;
    chatOutput.appendChild(userMessage);

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        function readStream() {
            reader.read().then(({ done, value }) => {
                if (done) return;
                const chunk = decoder.decode(value, { stream: true });
                const botMessage = document.createElement('div');
                botMessage.classList.add('bot-message');
                botMessage.innerHTML = chunk.replace(/\n/g, '<br>');
                chatOutput.appendChild(botMessage);
                chatOutput.scrollTop = chatOutput.scrollHeight;
                readStream();
            });
        }
        readStream();
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('chat-input').value = '';
}
