var API = "http://192.168.10.103:3000/api/account";
function isValidPhoneNumber(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
}
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
    //date
    const date = document.getElementById('ngaysinh').value;
    const ngaySinh = formatDate(date);
    const email = document.getElementById('email').value;
    const gioiTinh = document.getElementById('gioitinh').value;
    const cccd = document.getElementById('cccd').value;
    const avt = document.getElementById('avt-url').value;
    const password = document.getElementById('pass').value;
    if (!username || !diaChi || !sdt || !quocTich || !ngaySinh || !email || !gioiTinh || !cccd || !password) {
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
    if (pass.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
    }
    const checkExits = currenUser.some(user => user.email === email);
    if (checkExits) {
        alert('Email đã tồn tại.');
        email.value = '';
        return;
    }
    const newCustomer = {
        username,
        password,
        diaChi,
        sdt,
        quocTich,
        ngaySinh,
        email,
        gioiTinh,
        cccd,
        avt
    };
    console.log(newCustomer);
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
        alert(`Thêm tài khoản thành công`);
        getAPI();
        document.getElementById('customer-form').reset();
    } catch (error) {
        console.error(error);
    }
}
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options); // Định dạng ngày theo kiểu Việt Nam
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
    let date = cells[8].innerText;
    date = date.split('/').reverse().join('-');
    document.getElementById('ngaysinh').value = date;
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
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        alert(`Xoá tài khoảnh thành công, mã khách hàng: ${uid}`);
        getAPI();
        document.getElementById('customer-form').reset();
    } catch (error) {
        console.error(error);
    }
}

const suaTK = async () => {
    const id = document.getElementById('makhachhang').value;
    const username = document.getElementById('tenkhachhang').value;
    const diaChi = document.getElementById('diachi').value;
    const sdt = document.getElementById('sdt').value;
    const quocTich = document.getElementById('quoctich').value;
    const date = document.getElementById('ngaysinh').value;
    const ngaySinh = formatDate(date).toString();
    const email = document.getElementById('email').value;
    const gioiTinh = document.getElementById('gioitinh').value;
    const cccd = document.getElementById('cccd').value;
    const avt = document.getElementById('avt-url').value;
    if (!id) {
        alert('Vui lòng chọn khách hàng để sửa.');
        return;
    }
    const edit = {
        username,
        diaChi,
        sdt,
        quocTich,
        ngaySinh,
        email,
        gioiTinh,
        cccd,
        avt
    }
    console.log(edit);
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(edit)
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        getAPI();
        alert(`Sửa tài khoản thành công, mã khách hàng: ${id}`);
        document.getElementById('customer-form').reset();
    } catch (error) {
        console.error('False', error);
    }
}
document.getElementById('search').addEventListener('input', search_user);