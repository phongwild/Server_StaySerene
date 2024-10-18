const apiUrl = 'http://192.168.1.5:3000/api/messenger';
const apiUrlAccount = 'http://192.168.1.5:3000/api/account';
let selectedIdKhachSan = null;
let selectedUid = null; 
let lastMessageTimestamp = null; 
let previousChamSocList = []; 

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
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Updated trangThaiNv:', result);
    } catch (error) {
        console.error('Error updating trangThaiNv:', error);
    }
}

async function fetchAccountInfo(uid) {
    try {
        const response = await fetch(`${apiUrlAccount}/${uid}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching account info:', error);
        return null; // Nếu có lỗi, trả về null
    }
}

async function fetchChamSoc() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const chamSocList = await response.json();

        // So sánh với dữ liệu trước đó
        if (JSON.stringify(previousChamSocList) !== JSON.stringify(chamSocList)) {
            previousChamSocList = chamSocList; // Cập nhật dữ liệu trước đó

            const grouped = {};

            chamSocList.forEach(chamSoc => {
                const key = `${chamSoc.IdKhachSan}-${chamSoc.Uid}`;
                
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(chamSoc);
            });

            const chatList = document.querySelector('.chat-list');
            chatList.innerHTML = ''; // Xóa nội dung hiện có

            // Chuyển đổi grouped thành một mảng và sắp xếp
            const sortedGroups = Object.values(grouped).map(records => {
                const latestRecord = records.reduce((latest, current) => {
                    return new Date(current.thoiGianGui) > new Date(latest.thoiGianGui) ? current : latest;
                });
                return latestRecord;
            });

            // Sắp xếp các item theo thời gian gửi từ gần nhất
            sortedGroups.sort((a, b) => new Date(b.thoiGianGui) - new Date(a.thoiGianGui));

            // Hiển thị danh sách đã sắp xếp
            for (const latestRecord of sortedGroups) {
                const accountInfo = await fetchAccountInfo(latestRecord.Uid);

                if (accountInfo) {
                    const listItem = document.createElement('li');
                    listItem.style.border = 'none'; // Xóa viền trước

                    // Đặt màu viền dựa trên trangThaiNv
                    if (latestRecord.trangThaiNv === 1) {
                        listItem.style.border = '2px solid red'; // Viền đỏ
                    } else if (latestRecord.trangThaiNv === 2) {
                        listItem.style.border = '2px solid blue'; // Viền xanh
                    } else {
                        listItem.style.border = '1px solid #ccc'; // Mặc định
                    }

                    listItem.style.borderRadius = '5px'; // Bo góc
                    listItem.style.padding = '10px'; // Padding cho item
                    listItem.style.margin = '5px 0'; // Khoảng cách giữa các item
                    listItem.style.display = 'flex'; // Sử dụng flex để căn chỉnh hình ảnh và tên
                    listItem.style.alignItems = 'center'; // Căn giữa theo chiều dọc

                    // Tạo hình ảnh và tên người dùng
                    const userImage = document.createElement('img');
                    userImage.src = accountInfo.avt; // Đường dẫn đến hình ảnh của tài khoản
                    userImage.alt = 'User Image';
                    userImage.style.width = '40px'; // Đặt kích thước hình ảnh nếu cần
                    userImage.style.height = '40px';
                    userImage.style.borderRadius = '50%'; // Nếu bạn muốn hình ảnh tròn
                    userImage.style.marginRight = '10px'; // Khoảng cách giữa hình ảnh và tên

                    const usernameText = document.createElement('span');
                    usernameText.textContent = accountInfo.username; // Tên người dùng

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
        console.error('Error fetching chăm sóc records:', error);
    }
}
setInterval(fetchChamSoc, 1000); 


// Hàm hiển thị các chăm sóc tương ứng
async function displayChamSoc(idKhachSan, uid) {
    selectedIdKhachSan = idKhachSan;
    selectedUid = uid; 
    const response = await fetch(apiUrl);
    const chamSocList = await response.json();
    const filteredChamSoc = chamSocList.filter(cs => cs.IdKhachSan === idKhachSan && cs.Uid === uid);

    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML = ''; 

    for (const cs of filteredChamSoc) {
        await updateTrangThaiNv(cs._id); 
    }

    // Hiển thị các chăm sóc đã lọc
    filteredChamSoc.forEach(cs => {
        const messageItem = document.createElement('div');
        messageItem.style.padding = '10px';
        messageItem.style.marginBottom = '5px'; // Khoảng cách giữa các thông điệp
        messageItem.style.maxWidth = '70%'; // Giới hạn độ rộng tối đa
        messageItem.style.display = 'flex'; // Sử dụng flex để căn chỉnh các phần tử bên trong
        messageItem.style.flexDirection = 'column'; // Chia theo chiều dọc

        // Tạo nội dung gửi
        const contentText = document.createElement('div');
        contentText.textContent = cs.noiDungGui; // Giữ nguyên nội dung gửi

        // Tạo thời gian gửi
        const timeText = document.createElement('div');
        timeText.textContent = new Date(cs.thoiGianGui).toLocaleString(); // Chuyển đổi thời gian sang định dạng đọc được
        timeText.style.fontSize = '0.8em'; // Kích thước chữ nhỏ hơn
        timeText.style.color = '#bdc3c7'; // Màu sắc chữ cho thời gian gửi
        timeText.style.marginTop = '10px'; // Cách nội dung gửi 10px

        // Kiểm tra vai trò và thiết lập kiểu dáng phù hợp
        if (cs.vaiTro === 'Khách hàng') {
            // Thiết lập kiểu cho vai trò Khách hàng
            messageItem.style.border = '2px solid #3498db'; // Viền xanh
            messageItem.style.backgroundColor = 'white'; // Nền trắng
            messageItem.style.color = '#3498db'; // Chữ màu xanh
            messageItem.style.alignSelf = 'flex-start'; // Căn trái
            messageItem.style.borderRadius = '20px'; 
        } else if (cs.vaiTro === 'Khách sạn') {
            messageItem.style.border = '2px solid #3498db'; 
            messageItem.style.backgroundColor = '#3498db'; 
            messageItem.style.color = 'white'; 
            messageItem.style.alignSelf = 'flex-end'; 
            messageItem.style.borderRadius = '20px'; 

            // Căn thời gian gửi bên phải
            timeText.style.alignSelf = 'flex-end'; // Căn phải cho thời gian gửi
        }

        // Thêm nội dung gửi và thời gian vào messageItem
        messageItem.appendChild(contentText);
        messageItem.appendChild(timeText);
        chatMessages.appendChild(messageItem);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;

}


function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}


// Hàm tìm kiếm
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
        return; // Dừng thực hiện nếu chưa chọn khách hàng
    }

    if (!messageContent) {
        alert('Nội dung tin nhắn không thể trống!');
        return; // Dừng thực hiện nếu không có nội dung
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
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Tin nhắn đã được gửi:', result);
        messageInput.value = '';
        await fetchChamSoc(); 
        await displayChamSoc(selectedIdKhachSan, selectedUid); 
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
    }
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Thêm sự kiện click vào nút gửi
document.getElementById('gui-button').addEventListener('click', sendMessage);


// Gọi hàm fetch khi trang được tải
document.addEventListener('DOMContentLoaded', fetchChamSoc);

// Thêm sự kiện cho ô tìm kiếm
document.getElementById('searchInput').addEventListener('input', searchItems);





