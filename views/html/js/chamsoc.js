// Kết nối WebSocket (giả lập, nếu thực tế cần server WebSocket)
let socket = new WebSocket('wss://example.com/chat');

// Lắng nghe sự kiện khi WebSocket kết nối thành công
socket.addEventListener('open', function (event) {
    console.log('Connected to WebSocket server');
});

// Nhận tin nhắn từ server
socket.addEventListener('message', function (event) {
    console.log('Message from server', event.data);
    addMessageToChat(event.data, 'received');
});

const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');

// Gửi tin nhắn khi nhấn nút
sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
        socket.send(message); // Gửi tin nhắn qua WebSocket
        addMessageToChat(message, 'sent');
        messageInput.value = ''; // Xóa ô nhập sau khi gửi
    }
});

// Thêm tin nhắn vào giao diện chat
function addMessageToChat(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (type === 'sent') {
        messageDiv.style.alignSelf = 'flex-end';
        messageDiv.style.backgroundColor = '#4C4DDC';
    } else if (type === 'received') {
        messageDiv.style.alignSelf = 'flex-start';
        messageDiv.style.backgroundColor = '#e5e5ea';
        messageDiv.style.color = '#000';
    }
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Tự động cuộn xuống cuối khung chat
}
