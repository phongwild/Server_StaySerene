const apiUrl = `${base_url}messenger`;
const apichamsocUrl = `${base_url}messengerbyidhotel`;
const apiUrlAccount = `${base_url}accounta`;
const hotelId = localStorage.getItem('IdKhachSan');

let selectedIdKhachSan = null;
let selectedUid = null; 
let lastMessageTimestamp = null; 
let previousChamSocList = []; 
let previousChamSocForSelected = [];

async function updateTrangThaiNv(uid) {
    try {
        const response = await fetch(`${apiUrl}/${uid}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trangThaiNv: 2 }) 
        });

        if (!response.ok) {
            throw new Error('Mạng không phản hồi đúng');
        }

        const result = await response.json();
        console.log('Đã cập nhật trangThaiNv:', result);
    } catch (error) {
        console.error('Lỗi khi cập nhật trangThaiNv:', error);
    }
}

async function fetchAccountInfo(uid) {
    try {
        const response = await fetch(`${apiUrlAccount}/${uid}`);
        if (!response.ok) {
            throw new Error('Mạng không phản hồi đúng');
        }
        const accountData = await response.json();
        //Lấy token
        const token = accountData.token;
        if (token) {
            localStorage.setItem('token', token);
        }
        return accountData;
    } catch (error) {
        return null; 
    }
}


async function fetchChamSoc() {
    try {
        const response = await fetch(`${apichamsocUrl}/${hotelId}`);
        if (!response.ok) {
            throw new Error('Mạng không phản hồi đúng');
        }
        const chamSocList = await response.json();

        if (JSON.stringify(previousChamSocList) !== JSON.stringify(chamSocList)) {
            previousChamSocList = chamSocList;

            // Tải toàn bộ thông tin tài khoản trước
            const uniqueUids = [...new Set(chamSocList.map(cs => cs.Uid))];
            const accounts = await Promise.all(uniqueUids.map(fetchAccountInfo));

            const grouped = chamSocList.reduce((acc, cs) => {
                const key = `${cs.IdKhachSan}-${cs.Uid}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(cs);
                return acc;
            }, {});

            const chatList = document.querySelector('.chat-list');
            chatList.innerHTML = '';

            const sortedGroups = Object.values(grouped).map(records => 
                records.reduce((latest, current) =>
                    new Date(current.thoiGianGui) > new Date(latest.thoiGianGui) ? current : latest
                )
            ).sort((a, b) => new Date(b.thoiGianGui) - new Date(a.thoiGianGui));

            sortedGroups.forEach(latestRecord => {
                const account = accounts.find(acc => acc && acc._id === latestRecord.Uid);
                if (account) {
                    const listItem = document.createElement('li');
                    listItem.style = `border: ${latestRecord.trangThaiNv === 1 ? '2px solid red' : 
                        latestRecord.trangThaiNv === 2 ? '2px solid blue' : '1px solid #ccc'}; 
                        padding: 10px; margin: 5px 0; display: flex; align-items: center;`;

                    listItem.innerHTML = `
                        <img src="${account.avt}" alt="Hình ảnh" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                        <span>${account.username}</span>
                    `;
                    listItem.addEventListener('click', () => {
                        listItem.style.border = '2px solid blue';
                        selectedIdKhachSan = latestRecord.IdKhachSan; // Đảm bảo giá trị được cập nhật
                        selectedUid = latestRecord.Uid;              // Cập nhật UID của khách hàng
                        displayChamSoc(latestRecord.IdKhachSan, latestRecord.Uid);
                    });
                    

                    chatList.appendChild(listItem);
                }
            });
        }
    } catch (error) {
        console.error('Lỗi khi lấy bản ghi chăm sóc:', error);
    }
}

setInterval(fetchChamSoc, 1000); 

async function displayChamSoc(idKhachSan, uid) {
    if (!idKhachSan || !uid) return;

    try {
        const response = await fetch(`${apiUrl}/${idKhachSan}/${uid}`);
        if (!response.ok) throw new Error('Mạng không phản hồi đúng');

        const chamSocList = await response.json();
        if (JSON.stringify(chamSocList) !== JSON.stringify(previousChamSocForSelected)) {
            previousChamSocForSelected = chamSocList;

            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.innerHTML = chamSocList.map(cs => `
                <div style="
                    padding: 10px; margin-bottom: 5px; max-width: 70%; 
                    display: flex; flex-direction: column; border-radius: 20px; 
                    background-color: ${cs.vaiTro === 'Khách hàng' ? 'white' : '#3498db'}; 
                    color: ${cs.vaiTro === 'Khách hàng' ? '#3498db' : 'white'};
                    align-self: ${cs.vaiTro === 'Khách hàng' ? 'flex-start' : 'flex-end'};
                ">
                    <div>${cs.noiDungGui}</div>
                    <div style="font-size: 0.8em; color: #bdc3c7; margin-top: 10px;">${new Date(cs.thoiGianGui).toLocaleString()}</div>
                </div>
            `).join('');

            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    } catch (error) {
        console.error('Lỗi khi hiển thị chăm sóc:', error);
    }
}

setInterval(() => displayChamSoc(selectedIdKhachSan, selectedUid), 1000);

function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function searchItems() {
    const searchInput = removeAccents(document.getElementById('searchInput').value.toLowerCase());
    const chatList = document.querySelector('.chat-list');
    const items = chatList.querySelectorAll('li');

    items.forEach(item => {
        const username = removeAccents(item.querySelector('span').textContent.toLowerCase());
        if (username.includes(searchInput)) {
            item.style.display = 'flex'; 
        } else {
            item.style.display = 'none'; 
        }
    });
}


async function sendMessage() {
    const messageInput = document.querySelector('.message-input input');
    const messageContent = messageInput.value.trim();

    // Kiểm tra nếu chưa chọn khách hàng hoặc chưa có nội dung tin nhắn
    if (!selectedIdKhachSan || !selectedUid) {
        alert('Vui lòng chọn khách hàng trước khi gửi tin nhắn!');
        return;
    }

    if (!messageContent) {
        alert('Nội dung tin nhắn không thể trống!');
        return;
    }

    const newChamSoc = {
        noiDungGui: messageContent,
        thoiGianGui: new Date().toISOString(), // Định dạng yyyy-MM-dd'T'HH:mm:ss'Z'
        vaiTro: 'Khách sạn',
        trangThaiKh: 1,
        trangThaiNv: 2,
        Uid: selectedUid,
        IdKhachSan: selectedIdKhachSan,
        userTokenFCM: localStorage.getItem('token') 
    };

    console.log('Dữ liệu gửi đi:', newChamSoc);
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newChamSoc)
        });

        if (!response.ok) {
            messageInput.value = '';
            const errorMessage = `Lỗi: ${response.status} - ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Tin nhắn đã được gửi:', result);
        messageInput.value = '';

        await fetchChamSoc();
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error.message);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.message-input button').addEventListener('click', sendMessage);
    document.querySelector('.message-input input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { 
            event.preventDefault(); 
            sendMessage(); 
        }
    });
});

document.getElementById('searchInput').addEventListener('input', searchItems);

function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?"); 
  
    if (userConfirmed) {
        window.location.href = "../../welcome.html"; 
    }
  }