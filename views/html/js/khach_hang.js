var API = "http://192.168.1.2:3000/api/account";
var currenUser = []; // To store current user data

function isValidPhoneNumber(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
}

// Kiểm tra email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
async function getAPI() {
    try {
        const res = await fetch(API);
        const json = await res.json();
        currenUser = json;
        showKH(json);
    } catch (error) {
        console.error('Error fetch account: ', error);
    }
}

const showKH = (account) => {
    const list = document.getElementById('list-tk');
    list.innerHTML = '';
    account.forEach(account => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', account._id || 'N/A');
        row.setAttribute('onclick', 'showKH_detail(this)');
        
        row.innerHTML = `
            <td>${account._id}</td>
            <td>${account.username}</td>
            <td>${account.diaChi}</td>
            <td>${account.sdt}</td>
            <td>${account.gioiTinh}</td>
            <td>${account.ngaySinh}</td>
            <td><img src="${account.avt}" alt="${account.avt}" style="width:100px;height:auto; border-radius:10px;"></td>
        `;
        row.dataset.email = account.email;
        row.dataset.cccd = account.cccd;
        row.dataset.quocTich = account.quocTich;
        list.appendChild(row);
    });
}
document.addEventListener('DOMContentLoaded', getAPI);

function generateRandomString(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let randomString = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    return randomString;
}

async function themKH() {
    const username = document.getElementById('tenkhachhang').value.trim();
    const diaChi = document.getElementById('diachi').value.trim();
    const sdt = document.getElementById('sdt').value.trim();
    const quocTich = document.getElementById('quoctich').value.trim();
    const ngaySinh = document.getElementById('ngaysinh').value.trim();
    const email = document.getElementById('email').value.trim();
    const gioiTinh = document.getElementById('gioitinh').value.trim();
    const cccd = document.getElementById('cccd').value.trim();
    const avt_url = document.getElementById('avt-url').value.trim(); 
    const avt_file = document.getElementById('avt-file').value.trim(); 
    const newAccountId = document.getElementById('makhachhang').value.trim(); 
    const checkExitsId = currenUser.some(user => user._id === newAccountId);
    if (checkExitsId) {
        alert('Mã tài khoản đã tồn tại.');
        document.getElementById('customer-form').reset();
        return;
    }
    if (!username || !diaChi || !sdt || !quocTich || !ngaySinh || !email || !gioiTinh || !cccd) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }
    
    if (!isValidPhoneNumber(sdt)) {
        alert('Số điện thoại phải là 10 số và bắt đầu bằng 0.');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Vui lòng nhập địa chỉ email hợp lệ.');
        return;
    }

    const checkExits = currenUser.some(user => user.email === email);
    if (checkExits) {
        alert('Email đã tồn tại.');
        return;
    }
    const avatarUrl = avt_url || avt_file;
    const password = generateRandomString(20); 
    const token = generateRandomString(20);    

    const newCustomer = {
        username,
        diaChi,
        sdt,
        quocTich,
        ngaySinh,
        email,
        gioiTinh,
        cccd,
        avt: avatarUrl, 
        token,           
        role: '',       
        password         
    };

    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCustomer)
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await res.json();
        console.log(result); 
        getAPI(); 
        alert('Tạo tài khoản khách hàng thành công ');
        document.getElementById('customer-form').reset();
    } catch (error) {
        console.error('Error adding customer: ', error);
        alert('Có lỗi xảy ra khi thêm khách hàng.');
    }
}

function showKH_detail(row) {
    const uid = row.getAttribute('data-id');
    const cells = [...row.getElementsByTagName('td')];

    document.getElementById('makhachhang').value = uid;
    document.getElementById('tenkhachhang').value = cells[1].innerText; // username
    document.getElementById('diachi').value = cells[2].innerText; // diaChi
    document.getElementById('sdt').value = cells[3].innerText; // sdt
    document.getElementById('email').value = row.dataset.email; // email từ data-* attribute
    document.getElementById('cccd').value = row.dataset.cccd; // cccd từ data-* attribute
    document.getElementById('quoctich').value = row.dataset.quocTich; // quocTich từ data-* attribute
    document.getElementById('gioitinh').value = cells[4].innerText; // gioiTinh
    document.getElementById('ngaysinh').value = cells[5].innerText; // ngaySinh
    document.getElementById('avt-url').value = cells[6].getElementsByTagName('img')[0].src; // avt
}

async function deleteCustomer() {
    const uid = document.getElementById('makhachhang').value;
    if (!uid) {
        alert('Vui lòng chọn khách hàng để xóa.');
        return;
    }
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa khách hàng này?');
    if (!confirmDelete) return;
    try {
        const res = await fetch(`${API}/${uid}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            throw new Error('Network response was not ok');
        }   
        alert(`Xoá tài khoảnh thành công, mã khách hàng: ${uid}`);
        getAPI();
        document.getElementById('customer-form').reset();
    } catch (error) {
        console.error(error);
    }
}
async function editCustomer() {
    const uid = document.getElementById('makhachhang').value; // Get the customer ID
    if (!uid) {
        alert('Vui lòng chọn khách hàng để sửa.');
        return;
    }
    const username = document.getElementById('tenkhachhang').value.trim();
    const diaChi = document.getElementById('diachi').value.trim();
    const sdt = document.getElementById('sdt').value.trim();
    const quocTich = document.getElementById('quoctich').value.trim();
    const ngaySinh = document.getElementById('ngaysinh').value.trim();
    const email = document.getElementById('email').value.trim();
    const gioiTinh = document.getElementById('gioitinh').value.trim();
    const cccd = document.getElementById('cccd').value.trim();
    const avatarUrl = document.getElementById('avt-url').value.trim();

    // Input validation
    if (!username || !diaChi || !sdt || !quocTich || !ngaySinh || !email || !gioiTinh || !cccd) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }

    if (!isValidPhoneNumber(sdt)) {
        alert('Số điện thoại phải là 10 số và bắt đầu bằng 0.');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Vui lòng nhập địa chỉ email hợp lệ.');
        return;
    }

    // Check if the email is already in use by another user
    const checkExits = currenUser.some(user => user.email === email && user._id !== uid);
    if (checkExits) {
        alert('Email đã tồn tại.');
        return;
    }

    const updatedCustomer = {
        username,
        diaChi,
        sdt,
        quocTich,
        ngaySinh,
        email,
        gioiTinh,
        cccd,
        avt: avatarUrl, // Assuming the avatar URL is updated
    };

    try {
        const res = await fetch(`${API}/${uid}`, {
            method: 'PUT', // Use PUT for updates
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCustomer)
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await res.json();
        console.log(result); // Log the response for debugging
        getAPI(); // Refresh the user list
        alert('Cập nhật thông tin khách hàng thành công ');
        document.getElementById('customer-form').reset(); // Reset the form
    } catch (error) {
        console.error('Error updating customer: ', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin khách hàng.');
    }
}



// Hàm tìm kiếm 
function searchTypeRooms() {
    const searchMakhachhang = removeDiacritics(document.getElementById('search-mkh').value.toLowerCase().trim());
    const searchTenkhachhang = removeDiacritics(document.getElementById('search-tkh').value.toLowerCase().trim());
    const searchDiachi = removeDiacritics(document.getElementById('search-diachi').value.toLowerCase().trim());

    const rows = document.querySelectorAll('#list-tk tr');

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        
        const makhachhang = cells[0].textContent.toLowerCase(); // Adjusted index for Mã Khách Hàng
        const tenkhachhang = cells[1].textContent.toLowerCase(); // Adjusted index for Tên Khách Hàng
        const diachi = cells[2].textContent.toLowerCase(); // Adjusted index for Địa chỉ

        const matchesMakhachhang = searchMakhachhang === '' || makhachhang.includes(searchMakhachhang);
        const matchesTenkhachhang = searchTenkhachhang === '' || tenkhachhang.includes(searchTenkhachhang);
        const matchesDiachi = searchDiachi === '' || diachi.includes(searchDiachi);

        row.style.display = (matchesMakhachhang && matchesTenkhachhang && matchesDiachi) ? '' : 'none';
    });
}


// Xóa dấu tiếng Việt
function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

// Kết nối sự kiện tìm kiếm
document.getElementById('search-button').addEventListener('click', function (event) {
    event.preventDefault();
    searchTypeRooms();
});

