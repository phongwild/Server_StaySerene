const apiNhanVienUrl = 'http://192.168.0.100:3000/api/nhanvien';



function isValidObjectId(id) {
    return /^[a-f\d]{24}$/i.test(id);
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
}


// Lấy tất cả danh sách nhân viên
async function fetchNhanVien() {
    try {
        const response = await fetch(apiNhanVienUrl);
        const nhanVienList = await response.json();
        console.log(nhanVienList); // Kiểm tra dữ liệu nhận được
        currentNhanVien = nhanVienList;
        displayNhanVien(nhanVienList);
    } catch (error) {
        console.error('Error fetching nhan vien:', error);
    }
}


// Hiển thị danh sách nhân viên
function displayNhanVien(nhanVienList) {
    const customerList = document.getElementById('customer-list');
    customerList.innerHTML = '';
    nhanVienList.forEach(nhanVien => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', nhanVien._id || 'N/A');
        row.setAttribute('onclick', 'showHotelDetailsnhanvien(this)');

        const shortId = (nhanVien._id || 'N/A').length > 8 ?
            (nhanVien._id || 'N/A').substring(0, 8) + '...' :
            nhanVien._id || 'N/A';
        const idks = (nhanVien.makhachsan || 'N/A').length > 8 ?
            (nhanVien.makhachsan || 'N/A').substring(0, 8) + '...' :
            nhanVien.makhachsan || 'N/A';
        row.setAttribute('data-full-description', nhanVien.moTaKhachSan);

        row.innerHTML = `
            <td>${shortId}</td>
            <td>${idks}</td>
            <td>${nhanVien.username}</td>
            <td>${nhanVien.sdt}</td>
            <td>${nhanVien.cccd}</td>
            <td>${nhanVien.email}</td>
            <td>${nhanVien.password}</td>
            <td>${nhanVien.gioLam}</td>
            <td><img src="${nhanVien.anhNhanVien}" alt="${nhanVien.anhNhanVien}" style="width:100px;height:auto;"></td>
        `;

        customerList.appendChild(row);
    });
}


document.addEventListener('DOMContentLoaded', fetchNhanVien);



// Lấy thông tin một nhân viên dựa trên ID
async function fetchNhanVienById(idNhanVien) {
    try {
        const response = await fetch(`${apiNhanVienUrl}/${idNhanVien}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching nhan vien:', error);
        return null;
    }
}

// Thêm nhân viên
async function addCustomernhanvien() {
    const makhachsan = document.getElementById('ID-ks').value;
    const tennhanvien = document.getElementById('username').value;
    const sdt = document.getElementById('sdt').value;
    const anhNhanVien = document.getElementById('anhNhanVien').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const cccd = document.getElementById('cccd').value;
    const gioLam = document.getElementById('gioLam').value;

    // Kiểm tra nhập liệu
    if (!tennhanvien || !sdt || !anhNhanVien || !password || !gioLam || !email || !cccd || !makhachsan) {
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

    const newNhanVien = {
        makhachsan,
        username: tennhanvien,
        sdt,
        anhNhanVien,
        password,
        gioLam,
        email,
        cccd
    };

    try {
        const response = await fetch(apiNhanVienUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNhanVien)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert(`Thêm nhân viên ${tennhanvien} thành công!`)
        document.getElementById('customer-form').reset();
        fetchNhanVien();
    } catch (error) {
        console.error('Error adding nhan vien:', error);
    }
}
const updateButton = document.getElementById("updateButton")
updateButton.onclick = editCustomernhanvien;


// Kiểm tra định dạng số điện thoại
function isValidPhoneNumber(sdt) {
    const phoneRegex = /^0\d{9}$/; // Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số
    return phoneRegex.test(sdt);
}

// Kiểm tra định dạng email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Định dạng email cơ bản
    return emailRegex.test(email);
}

//hiển thị ds khi bấm vào hàng
function showHotelDetailsnhanvien(row) {
    const nhanvienId = row.getAttribute('data-id');
    const cells = row.getElementsByTagName('td');
    document.getElementById('ID-nv').value = nhanvienId;
    document.getElementById('ID-ks').value = cells[1].innerText;
    document.getElementById('username').value = cells[2].innerText;
    document.getElementById('sdt').value = cells[3].innerText;
    document.getElementById('cccd').value = cells[4].innerText;
    document.getElementById('email').value = cells[5].innerText;
    document.getElementById('password').value = cells[6].innerText;
    document.getElementById('gioLam').value = cells[7].innerText;
    document.getElementById('anhNhanVien').value = cells[8].getElementsByTagName('img')[0].src;
    const fullDescription = row.getAttribute('data-full-description');

}



// Xóa nhân viên
async function deleteNhanVien() {
    const nhanVienId = document.getElementById('ID-nv').value;
    const name = document.getElementById('username').value;
    if (!nhanVienId) {
        alert('Vui lòng chọn nhân viên để xóa.');
        return;
    }

    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa nhân viên này?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${apiNhanVienUrl}/${nhanVienId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        alert(`Xoá nhân viên ${name} thành công`);
        fetchNhanVien();
        document.getElementById('customer-form').reset();

    } catch (error) {
        console.error('Error deleting nhan vien:', error);
    }
}

// Sửa thông tin nhân viên
async function editCustomernhanvien() {
    const NhanVienId = document.getElementById('ID-nv').value;
    const ID_ks = document.getElementById('ID-ks').value;
    const tenNhanVien = document.getElementById('username').value;
    const CCCD = document.getElementById('cccd').value;
    const anhNhanVien = document.getElementById('anhNhanVien').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const gioLam = document.getElementById('gioLam').value;
    if (!NhanVienId) {
        alert('Vui lòng chọn nhân viên cần sửa.');
        return;
    }

    if (!tenNhanVien || !CCCD || !anhNhanVien || !password || !email || !gioLam) {
        alert('Vui lòng điền đầy đủ thông tin.');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Vui lòng nhập địa chỉ email hợp lệ.');
        return;
    }

    const updatedNhanVien = {
        ID_ks,
        tenNhanVien,
        CCCD,
        anhNhanVien,
        password,
        email,
        gioLam,
    };

    try {
        const response = await fetch(`${apiNhanVienUrl}/${NhanVienId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedNhanVien)
        });


        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert(`Sửa nhân viên ${tenNhanVien} thành công`);
        fetchNhanVien();
        document.getElementById('customer-form').reset();

    } catch (error) {
        console.error('Error editing hotel:', error);
    }
}
// tìm kiếm nhân viên
function searchNhanVien() {
    const searchValue = removeDiacritics(document.getElementById('searchnhanvien').value.toLowerCase().trim());
    const rows = document.querySelectorAll('#customer-list tr');

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        // Kiểm tra xem cells có ít nhất 2 ô không
        if (cells.length >= 2) {
            const ID_ks = removeDiacritics(cells[0].textContent.toLowerCase().trim());
            const tenNhanVien = removeDiacritics(cells[1].textContent.toLowerCase().trim());

            // Hiển thị hoặc ẩn hàng dựa trên giá trị tìm kiếm
            row.style.display = ID_ks.includes(searchValue) || tenNhanVien.includes(searchValue) ? '' : 'none';
        }
    });
}









