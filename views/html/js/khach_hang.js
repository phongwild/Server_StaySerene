var API = "http://192.168.1.4:3000/api/account";
const apiOrderroombyUid = "http://192.168.1.4:3000/api/orderroombyUid";
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
        row.setAttribute('onclick', 'showKH_detail(this)');

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


function showKH_detail(row) {
    const uid = row.getAttribute('data-id');
    const cells = [...row.getElementsByTagName('td')];

    document.getElementById('makhachhang').value = uid;
    document.getElementById('tenkhachhang').value = cells[1].innerText;
    document.getElementById('diachi').value = cells[2].innerText;
    document.getElementById('sdt').value = cells[4].innerText;
    document.getElementById('email').value = row.dataset.email;
    document.getElementById('cccd').value = row.dataset.cccd;
    document.getElementById('quoctich').value = row.dataset.quocTich;
    document.getElementById('gioitinh').value = cells[5].innerText;
    document.getElementById('ngaysinh').value = cells[6].innerText;

    const imgAvt = document.getElementById('avt-url');
    imgAvt.src = row.dataset.avt || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq2k2sI1nZyFTtoaKSXxeVzmAwIPchF4tjwg&s';

    const imgCCCDTruoc = document.getElementById('imgcccdtruoc');
    imgCCCDTruoc.src = row.dataset.imgcccdtruoc || 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/C%C4%83n_c%C6%B0%E1%BB%9Bc_c%C3%B4ng_d%C3%A2n_g%E1%BA%AFn_ch%C3%ADp_m%E1%BA%B7t_tr%C6%B0%E1%BB%9Bc.jpg/800px-C%C4%83n_c%C6%B0%E1%BB%9Bc_c%C3%B4ng_d%C3%A2n_g%E1%BA%AFn_ch%C3%ADp_m%E1%BA%B7t_tr%C6%B0%E1%BB%9Bc.jpg'; 

    const imgCCCDSau = document.getElementById('imgcccdsau');
    imgCCCDSau.src = row.dataset.imgcccdsau || 'https://image.plo.vn/w1000/Uploaded/2024/xqeioxdrky/2024_02_11/mau-can-cuoc-tre-tu-6-tuoi-mat-sau-9238.jpg.webp'; 

}


async function deleteCustomer() {
    const uid = document.getElementById('makhachhang').value;
    const nameCustomer = document.getElementById('tenkhachhang').value;

    if (!uid) {
        alert('Vui lòng chọn khách hàng để xóa.');
        return;
    }

    try {
        const orderCheckRes = await fetch(`${apiOrderroombyUid}/${uid}`);
        const orders = await orderCheckRes.json();

        if (orders.length > 0) {
            alert(`Khách hàng ${nameCustomer} có đơn đặt phòng, không thể xóa.`);
            return;
        }

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

