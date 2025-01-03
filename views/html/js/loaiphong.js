const apiUrl = `${base_url}typeroom`;
const apiKhachSanUrl = `${base_url}hotel`;

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

async function fetchTypeRooms() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const typeRooms = await response.json();
        renderTypeRooms(typeRooms);
    } catch (error) {
        console.error('Error fetching type rooms:', error);
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

function validateForm() {
    const makhachsan = document.getElementById('makhachsan').value.trim();
    const tenloaiphong = document.getElementById('tenloaiphong').value.trim();
    const anhloaiphong = document.getElementById('anhloaiphong').value.trim();
    const soluongphong = parseInt(document.getElementById('soluongphong').value, 10);
    const giaLoaiPhong = parseFloat(document.getElementById('giaLoaiPhong').value);

    if (!makhachsan || !tenloaiphong || !anhloaiphong) {
        alert('Vui lòng nhập đầy đủ thông tin !');
        return false;
    }


    if (isNaN(giaLoaiPhong) || giaLoaiPhong < 0) {
        alert('Giá loại phòng phải lớn hơn hoặc bằng 0!');
        return false;
    }

    if (isNaN(giaLoaiPhong) || giaLoaiPhong > 1000000000) {
        alert('Giá loại phòng quá lớn');
        return false;
    }
    return true;
}
async function renderTypeRooms(typeRooms) {
    const typeRoomList = document.getElementById('typeroom-list');
    typeRoomList.innerHTML = '';

    const allHotels = await fetchAllKhachSan();  

    typeRooms.forEach(room => {
        const hotel = allHotels.find(hotel => hotel._id === room.IdKhachSan);
        const hotelName = hotel ? hotel.tenKhachSan : 'Khách sạn không tồn tại';

        const row = document.createElement('tr');
        row.setAttribute('data-id', room._id);
        row.onclick = () => showTypeRoomDetails(room);

        row.innerHTML = `
            <td class="hidden">${room._id}</td>
            <td>${hotelName}</td> <!-- Hiển thị tên khách sạn -->
            <td>${room.tenLoaiPhong}</td>
            <td>${room.soLuongPhong}</td>
            <td><img src="${room.anhLoaiPhong}" alt="${room.tenLoaiPhong}" style="width: 100px; height: auto;" /></td>
        `;
        typeRoomList.appendChild(row);
    });
}


async function showTypeRoomDetails(room) {
    const { _id, IdKhachSan, tenLoaiPhong, moTaLoaiPhong, anhLoaiPhong, soLuongPhong, giaLoaiPhong, tienNghi } = room;

    document.getElementById('maloaiphong').value = _id;
    document.getElementById('makhachsan').value = IdKhachSan;
    document.getElementById('tenloaiphong').value = tenLoaiPhong;
    document.getElementById('motaloaiphong').value = moTaLoaiPhong;
    document.getElementById('anhloaiphong').value = anhLoaiPhong;
    document.getElementById('soluongphong').value = soLuongPhong;
    document.getElementById('giaLoaiPhong').value = giaLoaiPhong;  
    document.getElementById('tiennghi').value = tienNghi;
    await populateHotels();
    const selectElement = document.getElementById('tenkhachsan');
    const options = selectElement.options;
    for (let option of options) {
        if (option.value === IdKhachSan) {
            option.selected = true; 
            break;
        }
    }
}


async function checkTypeRoomExists(idKhachSan, tenLoaiPhong) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const typeRooms = await response.json();
        return typeRooms.some(room => room.IdKhachSan === idKhachSan && room.tenLoaiPhong === tenLoaiPhong);
    } catch (error) {
        console.error('Error fetching type rooms for existence check:', error);
        return false;
    }
}

async function addTyperoom() {

    if (!validateForm()) return;
    const IdKhachSan = document.getElementById('makhachsan').value.trim();
    const khachSan = await fetchKhachSan(IdKhachSan);
    if (!khachSan) {
        alert('Khách sạn không tồn tại!');
        return;
    }
    const newTypeRoom = {
        IdKhachSan: document.getElementById('makhachsan').value,
        tenLoaiPhong: document.getElementById('tenloaiphong').value,
        moTaLoaiPhong: document.getElementById('motaloaiphong').value,
        anhLoaiPhong: document.getElementById('anhloaiphong').value,
        soLuongPhong: 0,
        giaLoaiPhong: parseFloat(document.getElementById('giaLoaiPhong').value),  
        tienNghi: document.getElementById('tiennghi').value
    };

    const typeRoomExists = await checkTypeRoomExists(newTypeRoom.IdKhachSan, newTypeRoom.tenLoaiPhong);
    if (typeRoomExists) {
        alert(`Bạn không thể thêm. tên loại phòng ${newTypeRoom.tenLoaiPhong} đã tồn tại ở khách sạn này.`);
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTypeRoom)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        fetchTypeRooms();
        alert(`Bạn đã thêm loại phòng thành công `);
    } catch (error) {
        console.error('Error adding type room:', error);
    }

    document.getElementById('customer-form').reset();
}
async function editTyperoom() {
    const IdKhachSan = document.getElementById('makhachsan').value.trim();
    const IdLoaiPhong = document.getElementById('maloaiphong').value.trim();
    const khachSan = await fetchKhachSan(IdKhachSan);
    if (IdLoaiPhong==="") {
        alert('Vui lòng chọn loại phòng để cập nhật');
        return;
    }
    if (!validateForm()) return;
    if (!khachSan) {
        alert('Khách sạn không tồn tại!');
        return;
    }
    
    const updatedTypeRoom = {
        _id: document.getElementById('maloaiphong').value,
        IdKhachSan: document.getElementById('makhachsan').value,
        tenLoaiPhong: document.getElementById('tenloaiphong').value,
        moTaLoaiPhong: document.getElementById('motaloaiphong').value,
        anhLoaiPhong: document.getElementById('anhloaiphong').value,
        soLuongPhong: parseInt(document.getElementById('soluongphong').value, 10),
        giaLoaiPhong: parseFloat(document.getElementById('giaLoaiPhong').value), 
        tienNghi: document.getElementById('tiennghi').value
    };

    try {
        const response = await fetch(`${apiUrl}/${updatedTypeRoom._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTypeRoom)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        fetchTypeRooms();
        alert('Sửa thông tin loại phòng thành công !');
    } catch (error) {
        console.error('Error updating type room:', error);
        alert('Thông tin loại phòng không tồn tại !');
    }
    document.getElementById('customer-form').reset();

}

async function deleteTyperoom(id) {
    const IdLoaiPhong = document.getElementById('maloaiphong').value.trim();
    if (IdLoaiPhong==="") {
        alert('Vui lòng chọn loại phòng muốn xóa');
        return;
    }

    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa loại phòng này?');
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert(`Bạn đã xóa loại phòng thành công `);

        fetchTypeRooms();
    } catch (error) {
        console.error('Error deleting type room:', error);
    }
    document.getElementById('customer-form').reset();

}
// Hàm tìm kiếm loại phòng
function searchTypeRooms() {
    const searchMakhachsan = removeDiacritics(document.getElementById('search-makhachsan').value.toLowerCase().trim());
    const searchTenloaiphong = removeDiacritics(document.getElementById('search-tenloaiphong').value.toLowerCase().trim());

    const rows = document.querySelectorAll('#typeroom-list tr');
    let hasResults = false; // Biến kiểm tra có kết quả hay không

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const makhachsan = removeDiacritics(cells[1].textContent.toLowerCase());
        const tenloai = removeDiacritics(cells[2].textContent.toLowerCase());

        const matchesMakhachsan = searchMakhachsan === '' || makhachsan.includes(searchMakhachsan);
        const matchesTenloaiphong = searchTenloaiphong === '' || tenloai.includes(searchTenloaiphong);

        const isMatch = matchesMakhachsan && matchesTenloaiphong;
        row.style.display = isMatch ? '' : 'none';

        if (isMatch) {
            hasResults = true; 
        }
    });

    const list = document.getElementById('typeroom-list');
    const noResultsRow = document.getElementById('no-results-row');

    if (!hasResults) {
        if (!noResultsRow) {
            const row = document.createElement('tr');
            row.id = 'no-results-row';
            row.innerHTML = `
                <td colspan="4" style="text-align: center;">Không tìm thấy loại phòng</td>
            `;
            list.appendChild(row);
        }
    } else {
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


document.getElementById('tenkhachsan').addEventListener('change', function () {
    const selectedOption = this.options[this.selectedIndex];
    const selectedHotelId = selectedOption.value;

    document.getElementById('makhachsan').value = selectedHotelId;
});


document.addEventListener('DOMContentLoaded', () => {
    populateHotels();
});

document.addEventListener('DOMContentLoaded', fetchTypeRooms());
function confirmLogout(event) {
    event.preventDefault(); 
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

    if (userConfirmed) {
        window.location.href = "../../welcome.html"; 
    }
}