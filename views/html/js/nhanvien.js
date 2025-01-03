const apiNhanVienUrl = `${base_url}nhanvien`;
const apiKhachSanUrl = `${base_url}hotela`;

async function fetchKhachSan(IdKhachSan) {
    try {
        const response = await fetch(`${apiKhachSanUrl}/${IdKhachSan}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const khachSan = await response.json();
        return khachSan;
    } catch (error) {
        console.error('Error fetching khach san:', error);
        return null;
    }
}
async function fetchAllKhachSan() {
    try {
        const response = await fetch(apiKhachSanUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching all khach san:', error);
        return [];
    }
}


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
function isValidCCCD(cccd) {
    const cccdPattern = /^\d{12}$/;
    return cccdPattern.test(cccd);
}


// Lấy tất cả danh sách nhân viên
async function fetchNhanVien() {
    try {
        const response = await fetch(apiNhanVienUrl);
        const nhanVienList = await response.json();
        console.log(nhanVienList); 
        currentNhanVien = nhanVienList;
        displayNhanVien(nhanVienList);
    } catch (error) {
        console.error('Error fetching nhan vien:', error);
    }
}

async function updateHotelName() {
    const IdKhachSan = this.value.trim();
    const selectElement = document.getElementById('tenkhachsan');

    selectElement.innerHTML = '<option value="">Chọn khách sạn</option>';

    const allHotels = await fetchAllKhachSan();

    allHotels.forEach(hotel => {
        const option = document.createElement('option');
        option.value = hotel._id;
        option.textContent = hotel.tenKhachSan;
        selectElement.appendChild(option);
    });

    if (IdKhachSan) {
        const khachSan = await fetchKhachSan(IdKhachSan);
        if (khachSan) {
            const option = document.createElement('option');
            option.value = khachSan._id;
            option.textContent = khachSan.tenKhachSan;
            selectElement.appendChild(option);
            option.selected = true; 
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Khách sạn không tồn tại'; 
            selectElement.appendChild(option);
            option.selected = true; 
        }
    }
}

document.getElementById('makhachsan').addEventListener('input', debounce(updateHotelName, 300));
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}


// Hiển thị danh sách nhân viên
async function displayNhanVien(nhanVienList) {
    const customerList = document.getElementById('customer-list');
    customerList.innerHTML = '';

    for (const nhanVien of nhanVienList) {
        const row = document.createElement('tr');
        row.setAttribute('data-id', nhanVien._id || 'N/A');
        row.onclick = () => showHotelDetailsnhanvien(nhanVien);

        const khachSan = await fetchKhachSan(nhanVien.IdKhachSan);
        const tenKhachSan = khachSan ? khachSan.tenKhachSan : 'Không tìm thấy';

        row.innerHTML = `
        <tr>
            <td class="hidden">${nhanVien._id}</td>
            <td>${tenKhachSan}</td> <!-- Hiển thị tên khách sạn -->
            <td>${nhanVien.username}</td>
            <td>${nhanVien.cccd}</td>
            <td>${nhanVien.sdt}</td>
            <td><img src="${nhanVien.anhNhanVien}" alt="${nhanVien.anhNhanVien}" style="width:100px;height:auto;"></td>
        </tr>
        `;

        customerList.appendChild(row);
    }
}



document.addEventListener('DOMContentLoaded', fetchNhanVien);


async function populateHotels() {
    try {
        const response = await fetch(apiKhachSanUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const hotels = await response.json();

        const select = document.getElementById('tenkhachsan');
        select.innerHTML = '<option value="">Chọn khách sạn</option>'; 
        hotels.forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel._id; 
            option.textContent = hotel.tenKhachSan; 
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching hotels:', error);
    }
}


// Thêm nhân viên
async function addCustomernhanvien() {
    const IdKhachSan = document.getElementById('makhachsan').value;
    const tennhanvien = document.getElementById('username').value;
    const sdt = document.getElementById('sdt').value;
    const anhNhanVien = document.getElementById('anhNhanVien').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const cccd = document.getElementById('cccd').value;
    const gioLam = "full time";
    const khachSan = await fetchKhachSan(IdKhachSan);

    // Kiểm tra mã khách sạn
    if (!khachSan) {
        alert('Mã khách sạn không tồn tại!');
        return;
    }

    // Kiểm tra nhập liệu
    if (!tennhanvien || !sdt || !anhNhanVien || !password || !email || !cccd || !IdKhachSan) {
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
    if (!isValidCCCD(cccd)) {
        alert('Số CCCD không hợp lệ. Vui lòng nhập đúng số CCCD (12 chữ số).');
        return;
    }

    try {
        const response = await fetch(apiNhanVienUrl);
        const employees = await response.json();

        const emailExists = employees.some(employee => employee.email === email);
        const cccdExists = employees.some(employee => employee.cccd === cccd);
        
        if (emailExists) {
            alert('Email đã được sử dụng cho một nhân viên khác!');
            return;
        }
        if (cccdExists) {
            alert('CCCD đã được sử dụng cho một nhân viên khác!');
            return;
        }

        // Nếu email không tồn tại, tiến hành thêm nhân viên mới
        const newNhanVien = {
            IdKhachSan,
            username: tennhanvien,
            sdt,
            anhNhanVien,
            password,
            gioLam,
            email,
            cccd
        };

        // Gửi yêu cầu POST để thêm nhân viên mới
        const addResponse = await fetch(apiNhanVienUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNhanVien)
        });

        if (!addResponse.ok) {
            throw new Error('Network response was not ok');
        }

        alert(`Thêm nhân viên ${tennhanvien} thành công!`);
        document.getElementById('customer-form').reset();
        fetchNhanVien();  // Cập nhật danh sách nhân viên sau khi thêm
    } catch (error) {
        console.error('Error adding nhan vien:', error);
    }
}

const updateButton = document.getElementById("updateButton")
updateButton.onclick = editCustomernhanvien;


// Kiểm tra định dạng số điện thoại
function isValidPhoneNumber(sdt) {
    const phoneRegex = /^0\d{9}$/; 
    return phoneRegex.test(sdt);
}

// Kiểm tra định dạng email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email);
}

async function showHotelDetailsnhanvien(nhanVien) {
    const { _id, IdKhachSan, username, sdt, cccd, email, password, gioLam, anhNhanVien } = nhanVien;
    document.getElementById('manhanvien').value = _id;
    document.getElementById('makhachsan').value = IdKhachSan;
    document.getElementById('username').value = username;
    document.getElementById('sdt').value = sdt;
    document.getElementById('cccd').value = cccd;
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    document.getElementById('anhNhanVien').value = anhNhanVien;
    document.getElementById("cccd").disabled = true;
    document.getElementById("tenkhachsan").disabled = true;

    // No need to call populateHotels here again
    const selectElement = document.getElementById('tenkhachsan');
    const options = selectElement.options;
    for (let option of options) {
        if (option.value === IdKhachSan) {
            option.selected = true; 
            break;
        }
    }
}




// Xóa nhân viên
async function deleteNhanVien() {
    const nhanVienId = document.getElementById('manhanvien').value;
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
    const NhanVienId = document.getElementById('manhanvien').value;
    const IdKhachSan = document.getElementById('makhachsan').value;
    const username = document.getElementById('username').value;
    const cccd = document.getElementById('cccd').value;
    const anhNhanVien = document.getElementById('anhNhanVien').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const sdt = document.getElementById('sdt').value;
    const gioLam = "full time";

    if (NhanVienId==="") {
        alert('Vui lòng chọn nhân viên cần sửa.');
        return;
    }

    if (!username || !cccd || !anhNhanVien || !email || !gioLam || !password || !sdt) {
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

    if (!isValidCCCD(cccd)) {
        alert('Số CCCD không hợp lệ. Vui lòng nhập đúng số CCCD (12 chữ số).');
        return;
    }
    const updatedNhanVien = {
        IdKhachSan,
        username,
        cccd,
        anhNhanVien,
        email,
        gioLam,
        sdt,
        password
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
        alert(`Sửa nhân viên ${username} thành công`);
        fetchNhanVien();
        document.getElementById('customer-form').reset();

    } catch (error) {
        console.error('Error editing nhan vien:', error);
    }
}


// Hàm tìm kiếm loại phòng
function searchTypeRooms() {
    const searchManhanvien = removeDiacritics(document.getElementById('search-manhanvien').value.toLowerCase().trim());
    const searchMakhachsan = removeDiacritics(document.getElementById('search-makhachsan').value.toLowerCase().trim());
    const searchTennhanvien = removeDiacritics(document.getElementById('search-tennhanvien').value.toLowerCase().trim());

    const rows = document.querySelectorAll('#customer-list tr');
    let hasResults = false; // Biến kiểm tra có kết quả hay không

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const manhanvien = removeDiacritics(cells[1].textContent.toLowerCase());
        const makhachsan = removeDiacritics(cells[2].textContent.toLowerCase());
        const tennhanvien = removeDiacritics(cells[3].textContent.toLowerCase());

        const matchesMakhachsan = searchMakhachsan === '' || makhachsan.includes(searchMakhachsan);
        const matchesManhanvien = searchManhanvien === '' || manhanvien.includes(searchManhanvien);
        const matchesTennhanvien = searchTennhanvien === '' || tennhanvien.includes(searchTennhanvien);

        const isMatch = matchesMakhachsan && matchesManhanvien && matchesTennhanvien;
        row.style.display = isMatch ? '' : 'none';

        if (isMatch) {
            hasResults = true; // Nếu tìm thấy kết quả, đặt thành true
        }
    });

    const list = document.getElementById('customer-list');
    const noResultsRow = document.getElementById('no-results-row');

    if (!hasResults) {
        // Nếu không có kết quả, hiển thị dòng thông báo
        if (!noResultsRow) {
            const row = document.createElement('tr');
            row.id = 'no-results-row';
            row.innerHTML = `
                <td colspan="7" style="text-align: center;">Không tìm thấy nhân viên nào</td>
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


// Xóa dấu tiếng Việt
function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

// Kết nối sự kiện tìm kiếm
document.getElementById('search-button').addEventListener('click', function (event) {
    event.preventDefault();
    searchTypeRooms();
});




document.getElementById('tenkhachsan').addEventListener('change', function () {
    const selectedOption = this.options[this.selectedIndex];
    const selectedHotelId = selectedOption.value;

    document.getElementById('makhachsan').value = selectedHotelId;
});
document.addEventListener('DOMContentLoaded', () => {
    populateHotels();
});
function confirmLogout(event) {
    event.preventDefault(); 
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?"); 

    if (userConfirmed) {
        window.location.href = "../../welcome.html"; 
    }
}








