const firebaseConfig = {
    apiKey: "AIzaSyA86vacmGFN8Fg1CaMqshjgL1krNFjeaKk",
    authDomain: "stayserene-f36b5.firebaseapp.com",
    databaseURL: "https://stayserene-f36b5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stayserene-f36b5",
    storageBucket: "stayserene-f36b5.appspot.com",
    messagingSenderId: "1082178476167",
    appId: "1:1082178476167:web:c6aee2f3162c2aa3f90022"
};
firebase.initializeApp(firebaseConfig);

var API = "http://192.168.10.103:3000/api/account";
const avt_file = document.getElementById('avt-file').value;
var linkAvt;
var percentVal;
var fileItem;
var fileName;
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
function getFile(e) {
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    console.log(fileItem);
}
const uploadImg = () => {
    let storageRef = FIREBASE_APP.storage().ref('images/'+fileName);
    let task =  storageRef.put(fileItem);
    task.on('state_changed', (snapshot) => {
        console.log(snapshot);
    },(error) => {
        console.error(error);
    },() => {
        task.snapshot.getDownloadURL().then((url) => {
            console.log(url);
            linkAvt = url;
        })
    })
}
async function themKH() {
    const username = document.getElementById('tenkhachhang').value;
    const diaChi = document.getElementById('diachi').value;
    const sdt = document.getElementById('sdt').value;
    const quocTich = document.getElementById('quoctich').value;
    //date
    const ngaySinh = document.getElementById('ngaysinh').value;
    const date = new Date(ngaySinh);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateFormat = date.toLocaleDateString('vi-VN', options);
    const email = document.getElementById('email').value;
    const gioiTinh = document.getElementById('gioitinh').value;
    const cccd = document.getElementById('cccd').value;
    const avt_url = document.getElementById('avt-url').value;
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
        document.getElementById('customer-form').reset();
        return;
    }
    const checkAvt = () => {
        if (!avt_file) {
            return avt_url;
        } else {
            return linkAvt;
        }
    }
    //uploadImg();
    const newCustomer = {
        username,
        password,
        diaChi,
        sdt,
        quocTich,
        dateFormat,
        email,
        gioiTinh,
        cccd,
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
        alert(`Thêm tài khoản thành công, mã khách hàng: ${result._id}`);
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

const suaTK = async() => {
    const id = document.getElementById('makhachhang').value;
    const username = document.getElementById('tenkhachhang').value;
    const diaChi = document.getElementById('diachi').value;
    const sdt = document.getElementById('sdt').value;
    const quocTich = document.getElementById('quoctich').value;
    const ngaySinh = document.getElementById('ngaysinh').value;
    const date = new Date(ngaySinh);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dateFormat = date.toLocaleDateString('vi-VN', options);
    console.log(dateFormat);
    const email = document.getElementById('email').value;
    const gioiTinh = document.getElementById('gioitinh').value;
    const cccd = document.getElementById('cccd').value;
    const avt_url = document.getElementById('avt-url').value;
    const avt_file = document.getElementById('avt-file').value;
    if(!id){
        alert('Vui lòng chọn khách hàng để sửa.');
        return;
    }
    try {
        const res = await fetch(`${API}/${id}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                diaChi,
                sdt,
                quocTich,
                dateFormat,
                email,
                gioiTinh,
                cccd,
                avt_url
            })
        });
        if(!res.ok){
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