const apiUrl = 'http://192.168.1.4:3000/api/typeroom';
const apiKhachSanUrl = 'http://192.168.1.4:3000/api/hotel';

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

    if (isNaN(soluongphong) || soluongphong < 0) {
        alert('Số lượng phòng phải lớn hơn hoặc bằng 0!');
        return false;
    }

    if (isNaN(giaLoaiPhong) || giaLoaiPhong < 0) {
        alert('Giá loại phòng phải lớn hơn hoặc bằng 0!');
        return false;
    }

    return true;
}
function renderTypeRooms(typeRooms) {
    const typeRoomList = document.getElementById('typeroom-list');
    typeRoomList.innerHTML = '';

    typeRooms.forEach(room => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', room._id);
        row.onclick = () => showTypeRoomDetails(room);

        row.innerHTML = `
            <td>${room._id}</td>
            <td>${room.IdKhachSan}</td>
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
        alert('Mã khách sạn không tồn tại!');
        return;
    }
    const newTypeRoom = {
        IdKhachSan: document.getElementById('makhachsan').value,
        tenLoaiPhong: document.getElementById('tenloaiphong').value,
        moTaLoaiPhong: document.getElementById('motaloaiphong').value,
        anhLoaiPhong: document.getElementById('anhloaiphong').value,
        soLuongPhong: parseInt(document.getElementById('soluongphong').value, 10),
        giaLoaiPhong: parseFloat(document.getElementById('giaLoaiPhong').value),  
        tienNghi: document.getElementById('tiennghi').value
    };

    const typeRoomExists = await checkTypeRoomExists(newTypeRoom.IdKhachSan, newTypeRoom.tenLoaiPhong);
    if (typeRoomExists) {
        alert(`Bạn không thể thêm. Mã loại phòng ${newTypeRoom.tenLoaiPhong} đã tồn tại.`);
        document.getElementById('customer-form').reset();
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
    if (!validateForm()) return;
    const IdKhachSan = document.getElementById('makhachsan').value.trim();
    const khachSan = await fetchKhachSan(IdKhachSan);
    if (!khachSan) {
        alert('Mã khách sạn không tồn tại!');
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
    if (!id) {
        console.error('ID is undefined, cannot delete type room.');
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

        fetchTypeRooms();
    } catch (error) {
        console.error('Error deleting type room:', error);
    }
    document.getElementById('customer-form').reset();

}
// Hàm tìm kiếm loại phòng
function searchTypeRooms() {
    const searchMakhachsan = removeDiacritics(document.getElementById('search-makhachsan').value.toLowerCase().trim());
    const searchMaloaiphong = removeDiacritics(document.getElementById('search-maloaiphong').value.toLowerCase().trim());
    const searchTenloaiphong = removeDiacritics(document.getElementById('search-tenloaiphong').value.toLowerCase().trim());

    const rows = document.querySelectorAll('#typeroom-list tr');

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const makhachsan = removeDiacritics(cells[1].textContent.toLowerCase());
        const maloai = removeDiacritics(cells[0].textContent.toLowerCase());
        const tenloai = removeDiacritics(cells[2].textContent.toLowerCase());

        const matchesMakhachsan = searchMakhachsan === '' || makhachsan.includes(searchMakhachsan);
        const matchesMaloaiphong = searchMaloaiphong === '' || maloai.includes(searchMaloaiphong);
        const matchesTenloaiphong = searchTenloaiphong === '' || tenloai.includes(searchTenloaiphong);

        row.style.display = (matchesMakhachsan && matchesMaloaiphong && matchesTenloaiphong) ? '' : 'none';
    });
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