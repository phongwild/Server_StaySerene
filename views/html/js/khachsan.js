const apiUrl = 'http://192.168.1.5:3000/api/hotel';

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
        console.log(hotels); 
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
        row.setAttribute('data-id', hotel.maKhachSan || hotel._id); 
        row.setAttribute('onclick', 'showHotelDetails(this)');
        const moTaKhachSan = hotel.moTaKhachSan.length > 30 ? 
        hotel.moTaKhachSan.substring(0, 30) + '...' : 
        hotel.moTaKhachSan;
        row.setAttribute('data-full-description', hotel.moTaKhachSan);
        row.innerHTML = `
            <td>${hotel.maKhachSan || hotel._id || 'N/A'}</td>
            <td>${hotel.tenKhachSan}</td>
            <td>${hotel.diaChi}</td>
            <td>${hotel.sdt}</td>
            <td>${hotel.email}</td>
            <td>${hotel.danhGia}</td>
            <td>${moTaKhachSan}</td>
            <td><img src="${hotel.anhKhachSan}" alt="${hotel.tenKhachSan}" style="width:100px;height:auto;"></td>
        `;
        customerList.appendChild(row);
    });
}

// Lấy danh sách khách sạn khi tài liệu được tải
document.addEventListener('DOMContentLoaded', fetchHotels);

// Tìm kiếm khách sạn
function searchHotels() {
    const searchValue = removeDiacritics(document.getElementById('search').value.toLowerCase().trim());
    const rows = document.querySelectorAll('#customer-list tr');

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const hotelId = removeDiacritics(cells[0].textContent.toLowerCase());
        const hotelName = removeDiacritics(cells[1].textContent.toLowerCase());

        row.style.display = hotelId.includes(searchValue) || hotelName.includes(searchValue) ? '' : 'none';
    });
}

// Hàm loại bỏ dấu
function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Thêm khách hàng mới
async function addCustomer() {
    const tenKhachSan = document.getElementById('name').value;
    const diaChi = document.getElementById('diachi').value;
    const sdt = document.getElementById('sdt').value;
    const email = document.getElementById('email').value;
    const danhGia = document.getElementById('danhgia').value;
    const moTaKhachSan = document.getElementById('motakhachsan').value;
    const anhKhachSan = document.getElementById('anhkhachsan').value;

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

        fetchHotels(); 
        document.getElementById('customer-form').reset();

    } catch (error) {
        console.error('Error adding hotel:', error);
    }
}

// Hiển thị chi tiết khách sạn khi nhấp vào hàng
function showHotelDetails(row) {
    const hotelId = row.getAttribute('data-id');
    const cells = row.getElementsByTagName('td');

    document.getElementById('makhachsan').value = hotelId; 
    document.getElementById('name').value = cells[1].innerText; 
    document.getElementById('diachi').value = cells[2].innerText; 
    document.getElementById('sdt').value = cells[3].innerText; 
    document.getElementById('email').value = cells[4].innerText; 
    document.getElementById('danhgia').value = cells[5].innerText; 
    const fullDescription = row.getAttribute('data-full-description');
    document.getElementById('motakhachsan').value = fullDescription;  
    document.getElementById('anhkhachsan').value = cells[7].getElementsByTagName('img')[0].src; 
}

// Lấy mô tả khách sạn
async function fetchHotelDescription(hotelId) {
    try {
        const response = await fetch(`${apiUrl}/${hotelId}`);
        const hotel = await response.json();
        return hotel.moTaKhachSan; // Trả về mô tả đầy đủ
    } catch (error) {
        console.error('Error fetching hotel description:', error);
        return ''; // Trả về chuỗi rỗng nếu có lỗi
    }
}

// Xóa khách sạn
async function deleteCustomer() {
    const hotelId = document.getElementById('makhachsan').value; 

    if (!hotelId) {
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

        console.log('Khách sạn đã được xóa.');
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
    const danhGia = document.getElementById('danhgia').value;
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

        fetchHotels(); 
        document.getElementById('customer-form').reset();

    } catch (error) {
        console.error('Error editing hotel:', error);
    }
}

// Kết nối sự kiện tìm kiếm
document.getElementById('search').addEventListener('input', searchHotels);
