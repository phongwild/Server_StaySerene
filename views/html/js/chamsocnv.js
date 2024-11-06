const apiUrl = 'http://192.168.1.2:3000/api/messenger';
const apichamsocUrl = 'http://192.168.1.2:3000/api/messengerbyidhotel';
const apiUrlAccount = 'http://192.168.1.2:3000/api/account';
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
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tài khoản:', error);
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

            const grouped = {};

            chamSocList.forEach(chamSoc => {
                const key = `${chamSoc.IdKhachSan}-${chamSoc.Uid}`;
                
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(chamSoc);
            });

            const chatList = document.querySelector('.chat-list');
            chatList.innerHTML = ''; 

            const sortedGroups = Object.values(grouped).map(records => {
                const latestRecord = records.reduce((latest, current) => {
                    return new Date(current.thoiGianGui) > new Date(latest.thoiGianGui) ? current : latest;
                });
                return latestRecord;
            });

            sortedGroups.sort((a, b) => new Date(b.thoiGianGui) - new Date(a.thoiGianGui));

            for (const latestRecord of sortedGroups) {
                const accountInfo = await fetchAccountInfo(latestRecord.Uid);

                if (accountInfo) {
                    const listItem = document.createElement('li');
                    listItem.style.border = 'none'; 

                    if (latestRecord.trangThaiNv === 1) {
                        listItem.style.border = '2px solid red'; 
                    } else if (latestRecord.trangThaiNv === 2) {
                        listItem.style.border = '2px solid blue'; 
                    } else {
                        listItem.style.border = '1px solid #ccc';
                    }

                    listItem.style.borderRadius = '5px'; 
                    listItem.style.padding = '10px'; 
                    listItem.style.margin = '5px 0'; 
                    listItem.style.display = 'flex'; 
                    listItem.style.alignItems = 'center'; 

                    const userImage = document.createElement('img');
                    userImage.src = accountInfo.avt; 
                    userImage.alt = 'Hình ảnh người dùng';
                    userImage.style.width = '40px'; 
                    userImage.style.height = '40px';
                    userImage.style.borderRadius = '50%'; 
                    userImage.style.marginRight = '10px'; 

                    const usernameText = document.createElement('span');
                    usernameText.textContent = accountInfo.username; 

                    listItem.appendChild(userImage);
                    listItem.appendChild(usernameText);
                    chatList.appendChild(listItem);

                    listItem.addEventListener('click', () => {
                        listItem.style.border = '2px solid blue'; 
                        displayChamSoc(latestRecord.IdKhachSan, latestRecord.Uid);
                    });
                }
            }
        }
    } catch (error) {
        console.error('Lỗi khi lấy bản ghi chăm sóc:', error);
    }
}
setInterval(fetchChamSoc, 1000); 

async function displayChamSoc(idKhachSan, uid) {
    selectedIdKhachSan = idKhachSan;
    selectedUid = uid;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Mạng không phản hồi đúng');
        }
        const chamSocList = await response.json();
        const filteredChamSoc = chamSocList.filter(cs => cs.IdKhachSan === idKhachSan && cs.Uid === uid);

        if (JSON.stringify(filteredChamSoc) !== JSON.stringify(previousChamSocForSelected)) {
            previousChamSocForSelected = filteredChamSoc;

            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.innerHTML = ''; 

            for (const cs of filteredChamSoc) {
                await updateTrangThaiNv(cs._id);  

                const messageItem = document.createElement('div');
                messageItem.style.padding = '10px';
                messageItem.style.marginBottom = '5px'; 
                messageItem.style.maxWidth = '70%'; 
                messageItem.style.display = 'flex'; 
                messageItem.style.flexDirection = 'column'; 

                const contentText = document.createElement('div');
                contentText.textContent = cs.noiDungGui; 

                const timeText = document.createElement('div');
                timeText.textContent = new Date(cs.thoiGianGui).toLocaleString(); 
                timeText.style.fontSize = '0.8em'; 
                timeText.style.color = '#bdc3c7'; 
                timeText.style.marginTop = '10px'; 

                if (cs.vaiTro === 'Khách hàng') {
                    messageItem.style.border = '2px solid #3498db'; 
                    messageItem.style.backgroundColor = 'white'; 
                    messageItem.style.color = '#3498db'; 
                    messageItem.style.alignSelf = 'flex-start'; 
                    messageItem.style.borderRadius = '20px'; 
                } else if (cs.vaiTro === 'Khách sạn') {
                    messageItem.style.border = '2px solid #3498db'; 
                    messageItem.style.backgroundColor = '#3498db'; 
                    messageItem.style.color = 'white'; 
                    messageItem.style.alignSelf = 'flex-end'; 
                    messageItem.style.borderRadius = '20px'; 
                    timeText.style.alignSelf = 'flex-end'; 
                }

                messageItem.appendChild(contentText);
                messageItem.appendChild(timeText);
                chatMessages.appendChild(messageItem);
            }

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
        thoiGianGui: new Date().toISOString(), 
        vaiTro: 'Khách sạn',
        trangThaiKh: 1,
        trangThaiNv: 2,
        Uid: selectedUid,
        IdKhachSan: selectedIdKhachSan
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newChamSoc)
        });

        if (!response.ok) {
            throw new Error('Mạng không phản hồi đúng');
        }

        const result = await response.json();
        console.log('Tin nhắn đã được gửi:', result);
        messageInput.value = '';
        await fetchChamSoc();
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
    }
}

document.querySelector('.message-input button').addEventListener('click', sendMessage);
document.getElementById('searchInput').addEventListener('input', searchItems);

function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?"); 
  
    if (userConfirmed) {
        window.location.href = "../../welcome.html"; 
    }
  }