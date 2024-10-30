var API = "http://192.168.1.4:3000/api/account";

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
        const shortId = (account._id || 'N/A').length > 8 ?
            (account._id || 'N/A').substring(0, 8) + '...' : account._id || 'N/A';
        row.innerHTML = `
            <td>${shortId}</td>
            <td>${account.username}</td>
            <td>${account.diaChi}</td>
            <td>${account.sdt}</td>
            <td>${account.email}</td>
            <td>${account.cccd}</td>
            <td>${account.quocTich}</td>
            <td>${account.gioiTinh}</td>
            <td>${account.ngaySinh}</td>
            <td><img src="${account.avt}" alt="${account.avt}" style="width:100px;height:auto; border-radius:10px;"></td>
        `;
        list.appendChild(row);
    });
}
document.addEventListener('DOMContentLoaded', getAPI);
function search_user() {
    const searchValue = removeDiacritics(document.getElementById('search').value.toLowerCase().trim());
    const rows = document.querySelectorAll('#customer-list tr');
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const uid = removeDiacritics(cells[0].textContent.toLowerCase());
        const username = removeDiacritics(cells[1].textContent.toLowerCase());

        row.style.display = uid.includes(searchValue) || username.includes(searchValue) ? '' : 'none';
    })
}
function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
async function themKH() {
    const username = document.getElementById('tenkhachhang').value;
    const diaChi = document.getElementById('diachi').value;
    const sdt = document.getElementById('sdt').value;
    const quocTich = document.getElementById('quoctich').value;
    const ngaySinh = document.getElementById('ngaysinh').value;
    const email = document.getElementById('email').value;
    const gioiTinh = document.getElementById('gioitinh').value;
    const cccd = document.getElementById('cccd').value;
    const avt_url = document.getElementById('avt-url').value;
    const avt_file = document.getElementById('avt-file').value;
    // if (!username || diaChi || !sdt || !quocTich || !ngaySinh || !email || !gioiTinh || !cccd) {
    //     alert('Vui lòng điền đầy đủ thông tin.');
    //     return;
    // }
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
        document.getElementById('customer-form').reset();
        return;
    }
    const checkAvt = () => {
        if (!avt_url) {
            return avt_file;
        } else {
            return avt_url;
        }
    }
    const newCustomer = {
        username,
        diaChi,
        sdt,
        quocTich,
        ngaySinh,
        email,
        gioiTinh,
        cccd,
        token,
        role,
        password,
        checkAvt
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
        document.getElementById('customer-form').reset();
    } catch (error) {
        console.error(error);
    }
}
function showKH_detail(row) {
    const uid = row.getAttribute('data-id');
    const cells = [...row.getElementsByTagName('td')];
    
    document.getElementById('makhachhang').value = uid;
    document.getElementById('tenkhachhang').value = cells[1].innerText;
    document.getElementById('diachi').value = cells[2].innerText;
    document.getElementById('sdt').value = cells[3].innerText;
    document.getElementById('email').value = cells[4].innerText;
    document.getElementById('cccd').value = cells[5].innerText;
    document.getElementById('quoctich').value = cells[6].innerText;
    document.getElementById('gioitinh').value = cells[7].innerText;
    document.getElementById('ngaysinh').value = cells[8].innerText;
    document.getElementById('avt-url').value = cells[9].getElementsByTagName('img')[0].src;
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
    const username = document.getElementById('tenkhachhang').value;
    const diaChi = document.getElementById('diachi').value;
    const sdt = document.getElementById('sdt').value;
    const quocTich = document.getElementById('quoctich').value;
    const ngaySinh = document.getElementById('ngaysinh').value;
    const email = document.getElementById('email').value;
    const gioiTinh = document.getElementById('gioitinh').value;
    const cccd = document.getElementById('cccd').value;
    
    // if (!username || diaChi || !sdt || !quocTich || !ngaySinh || !email || !gioiTinh || !cccd) {
    //     alert('Vui lòng điền đầy đủ thông tin.');
    //     return;
    // }
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
        document.getElementById('customer-form').reset();
        return;
    }
}
document.getElementById('search').addEventListener('input', search_user);