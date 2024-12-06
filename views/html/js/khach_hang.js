var API = `${base_url}account`;
const apiOrderroombyUid = `${base_url}orderroombyUid`;
var currenUser = [];
function isValidPhoneNumber(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidDateFormat(date) {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(date)) return false;

    const [day, month, year] = date.split('/').map(Number);
    const isValidDay = day > 0 && day <= 31;
    const isValidMonth = month > 0 && month <= 12;
    const isValidYear = year > 1900 && year <= new Date().getFullYear();

    return isValidDay && isValidMonth && isValidYear;
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
        row.addEventListener('click', () => showHotelDetails(row));

        row.innerHTML = `
            <td class="hidden">${account._id}</td>
            <td>${account.username}</td>
            <td>${account.cccd}</td>
            <td>${account.diaChi}</td>
            <td>${account.sdt}</td>
            <td>${account.gioiTinh}</td>
            <td>${account.ngaySinh}</td>
        `;
        row.dataset.email = account.email;
        row.dataset.cccd = account.cccd;
        row.dataset.quocTich = account.quocTich;
        row.dataset.avt = account.avt;
        row.dataset.imgcccdtruoc = account.imgcccdtruoc || '';  
        row.dataset.imgcccdsau = account.imgcccdsau || '';  
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


function showHotelDetails(row) {
    var customerId = row.getAttribute('data-id');
    sessionStorage.setItem('customerId', customerId);
    window.location.href = '../management/khachhangchitiet.html';
}




async function deleteCustomer() {
    const uid = document.getElementById('makhachhang').value;
    const nameCustomer = document.getElementById('tenkhachhang').value;

    if (!uid) {
        alert('Vui lòng chọn khách hàng để xóa.');
        return;
    }

    try {

        const confirmDelete = confirm('Bạn có chắc chắn muốn xóa khách hàng này?');
        if (!confirmDelete) return;

        const deleteRes = await fetch(`${API}/${uid}`, {
            method: 'DELETE'
        });

        if (!deleteRes.ok) {
            throw new Error('Không thể kết nối đến máy chủ để xóa.');
        }

        alert(`Xóa tài khoản thành công, mã khách hàng: ${uid}`);
        getAPI();
        document.getElementById('customer-form').reset();

    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Đã xảy ra lỗi khi xóa tài khoản.');
    }
}




function searchTypeRooms() {
    const searchMakhachhang = removeDiacritics(document.getElementById('search-mkh').value.toLowerCase().trim());
    const searchTenkhachhang = removeDiacritics(document.getElementById('search-tkh').value.toLowerCase().trim());
    const searchDiachi = removeDiacritics(document.getElementById('search-diachi').value.toLowerCase().trim());

    const rows = document.querySelectorAll('#list-tk tr');
    let hasResults = false; // Biến kiểm tra có kết quả hay không

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');

        const makhachhang = cells[2].textContent.toLowerCase();
        const tenkhachhang = cells[1].textContent.toLowerCase();
        const diachi = cells[4].textContent.toLowerCase();

        const matchesMakhachhang = searchMakhachhang === '' || makhachhang.includes(searchMakhachhang);
        const matchesTenkhachhang = searchTenkhachhang === '' || tenkhachhang.includes(searchTenkhachhang);
        const matchesDiachi = searchDiachi === '' || diachi.includes(searchDiachi);

        const isMatch = matchesMakhachhang && matchesTenkhachhang && matchesDiachi;
        row.style.display = isMatch ? '' : 'none';

        if (isMatch) {
            hasResults = true; // Nếu tìm thấy kết quả, đặt thành true
        }
    });

    const list = document.getElementById('list-tk');
    const noResultsRow = document.getElementById('no-results-row');

    if (!hasResults) {
        // Nếu không có kết quả, hiển thị dòng thông báo
        if (!noResultsRow) {
            const row = document.createElement('tr');
            row.id = 'no-results-row';
            row.innerHTML = `
                <td colspan="7" style="text-align: center;">Không tìm thấy khách hàng nào</td>
            `;
            list.appendChild(row);
        }
    } else {
        // Nếu có kết quả, xóa dòng thông báo (nếu có)
        if (noResultsRow) {
            noResultsRow.remove();
        }
    }
}



function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

document.getElementById('search-button').addEventListener('click', function (event) {
    event.preventDefault();
    searchTypeRooms();
});
function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

    if (userConfirmed) {
        window.location.href = "../../welcome.html";
    }
}

