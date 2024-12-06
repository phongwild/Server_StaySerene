const apiUrl = 'https://stayserene.vercel.app/api/hotel';
const apiUrla = 'https://stayserene.vercel.app/api/hotela';

// Kiểm tra số điện thoại hợp lệ
function isValidPhoneNumber(phone) {
    const phoneRegex = /^0\d{9}$/; 
    return phoneRegex.test(phone);
}

// Kiểm tra email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email);
}

// Kiểm tra đánh giá hợp lệ
function isValidRating(rating) {
    const numericRating = parseFloat(rating);
    return numericRating > 0 && numericRating <= 5; 
}

// Lấy danh sách khách sạn từ API
async function fetchHotels() {
    try {
        const response = await fetch(apiUrl);
        const hotels = await response.json();
        currentHotels = hotels;
        displayHotels(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
    }
}

// Hiển thị danh sách khách sạn
function displayHotels(hotels) {
    const customerList = document.getElementById('customer-list');
    customerList.innerHTML = '';
    hotels.forEach(hotel => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', hotel._id || 'N/A');
        row.setAttribute('onclick', 'showHotelDetails(this)');
        const shortId = (hotel._id || 'N/A').length > 8 ? 
            (hotel._id || 'N/A').substring(0, 8) + '...' : 
            hotel._id || 'N/A';

        const moTaKhachSan = hotel.moTaKhachSan.length > 30 ? 
            hotel.moTaKhachSan.substring(0, 30) + '...' : 
            hotel.moTaKhachSan;

        row.setAttribute('data-full-description', hotel.moTaKhachSan);

        row.innerHTML = `
            <td class="hidden">${shortId}</td> <!-- Hiển thị mã khách sạn rút gọn -->
            <td>${hotel.tenKhachSan}</td>
            <td>${hotel.diaChi}</td>
            <td>${hotel.sdt}</td>
            <td><img src="${hotel.anhKhachSan}" alt="${hotel.tenKhachSan}" style="width:100px;height:auto;"></td>
        `;

        customerList.appendChild(row);
    });
}


document.addEventListener('DOMContentLoaded', fetchHotels);

// Tìm kiếm khách sạn
function searchHotels() {
    const searchValue = removeDiacritics(document.getElementById('search').value.toLowerCase().trim());
    const rows = document.querySelectorAll('#customer-list tr');
    let hasResults = false; // Biến kiểm tra có kết quả hay không

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const hotelName = removeDiacritics(cells[1].textContent.toLowerCase());

        const isMatch = hotelName.includes(searchValue);
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
                <td colspan="7" style="text-align: center;">Không tìm thấy khách sạn nào</td>
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


// loại bỏ dấu khi tìm kiếm
function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Thêm khách sạn mới
async function addCustomer() {
    const hotelId = document.getElementById('makhachsan').value; 
    const tenKhachSan = document.getElementById('name').value;
    const diaChi = document.getElementById('diachi').value;
    const sdt = document.getElementById('sdt').value;
    const email = document.getElementById('email').value;
    const moTaKhachSan = document.getElementById('motakhachsan').value;
    const anhKhachSan = document.getElementById('anhkhachsan').value;

    if (!tenKhachSan || !diaChi || !sdt || !email || !moTaKhachSan || !anhKhachSan) {
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



    const hotelExists = currentHotels.some(hotel => hotel._id === hotelId);
    const nameExists = currentHotels.some(hotel => hotel.tenKhachSan === tenKhachSan && hotel.diaChi === diaChi);   
    if (nameExists) {
        alert(`Bạn không thể thêm . Tên khách sạn ${tenKhachSan} đã có ở ${diaChi} .`);
        return;
    }
    const danhGia = 4.5;
    const newHotel = {
        tenKhachSan,
        diaChi,
        sdt,
        email,
        danhGia,
        moTaKhachSan,
        anhKhachSan
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newHotel)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result); 
        alert(`Thêm khách sạn : ${tenKhachSan} Thành công .`)
        fetchHotels(); 
        document.getElementById('customer-form').reset();

    } catch (error) {
        console.error('Error adding hotel:', error);
    }
}
async function getHotelById(hotelId) {
    try {
        const response = await fetch(`${apiUrla}/${hotelId}`);
        if (!response.ok) {
            throw new Error('Không thể lấy thông tin khách sạn');
        }

        const hotel = await response.json();

        document.getElementById('makhachsan').value = hotel._id || ''; 
        document.getElementById('name').value = hotel.tenKhachSan || ''; 
        document.getElementById('diachi').value = hotel.diaChi || ''; 
        document.getElementById('sdt').value = hotel.sdt || ''; 
        document.getElementById('email').value = hotel.email || ''; 
        document.getElementById('motakhachsan').value = hotel.moTaKhachSan || ''; 
        document.getElementById('anhkhachsan').value = hotel.anhKhachSan || ''; 

    } catch (error) {
        console.error('Error fetching hotel by ID:', error);
    }
}

function showHotelDetails(row) {
    const hotelId = row.getAttribute('data-id');
    if (!hotelId) {
        alert('Không tìm thấy ID khách sạn.');
        return;
    }

    console.log('Hotel ID:', hotelId); // Kiểm tra ID
    getHotelById(hotelId);
}



// Lấy mô tả khách sạn
async function fetchHotelDescription(hotelId) {
    try {
        const response = await fetch(`${apiUrl}/${hotelId}`);
        const hotel = await response.json();
        return hotel.moTaKhachSan;
    } catch (error) {
        console.error('Error fetching hotel description:', error);
        return ''; 
    }
}

// Xóa khách sạn
async function deleteCustomer() {
    const hotelId = document.getElementById('makhachsan').value; 

    if (hotelId=="") {
        alert('Vui lòng chọn khách sạn để xóa.');
        return; 
    }

    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa khách sạn này?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${apiUrl}/${hotelId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        alert('Khách sạn đã được xóa.');
        fetchHotels();
        document.getElementById('customer-form').reset();

    } catch (error) {
        console.error('Error deleting hotel:', error);
    }
}

// Chỉnh sửa thông tin khách sạn
async function editCustomer() {
    const hotelId = document.getElementById('makhachsan').value;
    const tenKhachSan = document.getElementById('name').value;
    const diaChi = document.getElementById('diachi').value;
    const sdt = document.getElementById('sdt').value;
    const email = document.getElementById('email').value;
    const danhGia = 4.5;
    const moTaKhachSan = document.getElementById('motakhachsan').value;
    const anhKhachSan = document.getElementById('anhkhachsan').value;

    if (!hotelId) {
        alert('Vui lòng chọn khách sạn để sửa.');
        return; 
    }

    if (!tenKhachSan || !diaChi || !sdt || !email || !danhGia || !moTaKhachSan || !anhKhachSan) {
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

    if (!isValidRating(danhGia)) {
        alert('Đánh giá phải lớn hơn 0 và nhỏ hơn hoặc bằng 5.');
        return;
    }

    const updatedHotel = {
        tenKhachSan,
        diaChi,
        sdt,
        email,
        danhGia,
        moTaKhachSan,
        anhKhachSan
    };

    try {
        const response = await fetch(`${apiUrl}/${hotelId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedHotel)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result); 
        alert(`Cập nhật thông tin khách sạn : ${tenKhachSan} Thành công .`)
        fetchHotels(); 
        document.getElementById('customer-form').reset();

    } catch (error) {
        console.error('Error editing hotel:', error);
    }
}

// Kết nối sự kiện tìm kiếm
document.getElementById('search').addEventListener('input', searchHotels);
function confirmLogout(event) {
    event.preventDefault(); 
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?"); 

    if (userConfirmed) {
        window.location.href = "../../welcome.html"; 
    }
}