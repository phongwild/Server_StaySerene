const apiHotelUrl = 'http://192.168.1.7:3000/api/hotel';
const apiTyperoomUrl = 'http://192.168.1.7:3000/api/typerooma';
const apiRoomUrl = 'http://192.168.1.7:3000/api/rooms';
const apiRoomUrla = 'http://192.168.1.7:3000/api/roomsa';
const apiTyperoomByHotelUrl = 'http://192.168.1.7:3000/api/typeroombyidhotel';
const apiRoomByHotelUrl = 'http://192.168.1.7:3000/api/roombyidhotel';
const hotelId = localStorage.getItem('IdKhachSan');

async function fetchRoomData() {
    try {
        const response = await fetch(`${apiRoomByHotelUrl}/${hotelId}`);
        if (!response.ok) throw new Error("Không thể lấy dữ liệu phòng.");
        const rooms = await response.json();

        const roomTypes = await fetchTyperoomData();
        const hotels = await fetchHotelData();

        const customerList = document.getElementById("customer-list");
        customerList.innerHTML = "";

        rooms.forEach((room) => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", room._id);
            row.onclick = () => showRoomDetails(room, roomTypes, hotels);

            const roomType = roomTypes.find((type) => type._id === room.IdLoaiPhong);

            row.innerHTML = `
                <td class="hidden">${room._id || "N/A"}</td>
                <td>${roomType ? roomType.tenLoaiPhong : "Không tồn tại."}</td>
                <td>${room.soPhong || "N/A"}</td>
                <td>${room.moTaPhong || "N/A"}</td>
                <td class="hidden">${room.tinhTrangPhong === 0 ? "phong trống" : "Đã được đặt"}</td>
            `;

            customerList.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching room data:", error);
        alert("Không thể lấy dữ liệu phòng. Vui lòng thử lại.");
    }
}


async function fetchTyperoomData() {
    const response = await fetch(apiTyperoomUrl);
    return response.json();
}

async function fetchTyperoomByHotelId(hotelId) {
    try {
        const response = await fetch(`${apiTyperoomByHotelUrl}/${hotelId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching room types:', error);
        return [];
    }
}



function populateRoomTypeOptions(roomTypes) {
    const roomTypeSelect = document.getElementById('tenloaiphong');
    roomTypeSelect.innerHTML = '<option value="">Chọn loại phòng</option>'; 

    roomTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type._id; 
        option.textContent = type.tenLoaiPhong; 
        roomTypeSelect.appendChild(option);
    });

    roomTypeSelect.addEventListener('change', () => {
        const selectedRoomTypeId = roomTypeSelect.value;
        document.getElementById('maloaiphong').value = selectedRoomTypeId; 
    });
}


async function fetchHotelData() {
    const response = await fetch(apiHotelUrl);
    return response.json();
}

async function showRoomDetails(room, roomTypes, hotels) {
    document.getElementById('maphong').value = room._id || '';

    const roomType = await fetchRoomTypeById(room.IdLoaiPhong);

    document.getElementById('maloaiphong').value = room.IdLoaiPhong || ''; 


        const roomTypesByHotel = await fetchTyperoomByHotelId(hotelId);
        populateRoomTypeOptions(roomTypesByHotel); 

        const roomTypeSelect = document.getElementById('tenloaiphong');
        if (roomType) {
            roomTypeSelect.value = room.IdLoaiPhong;
            roomTypeSelect.options[roomTypeSelect.selectedIndex].textContent = roomType.tenLoaiPhong;
        } else {
            roomTypeSelect.value = '';
            roomTypeSelect.options[roomTypeSelect.selectedIndex].textContent = 'Chọn loại phòng';
        }
    

    document.getElementById('sophong').value = room.soPhong || '';
    document.getElementById('sotang').value = room.soTang || '';
    document.getElementById('moTaPhong').value = room.moTaPhong || '';
    document.getElementById('tinhTrangPhong').value = room.tinhTrangPhong || '0';
    document.getElementById('anhkhachsan').value = room.anhPhong || '';
}

async function fetchRoomTypeById(roomTypeId) {
    try {
        const response = await fetch(`${apiTyperoomUrl}/${roomTypeId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching room type by ID:', error);
        return null;
    }
}


async function addRoom() {
    // Lấy giá trị từ các trường input
    const soPhong = document.getElementById('sophong').value;
    const soTang = document.getElementById('sotang').value;
    const maLoaiPhong = document.getElementById('maloaiphong').value;

    if (!maLoaiPhong) {
        alert('Vui lòng chọn loại phòng.');
        return;
    }
    if (soPhong < 100||soPhong > 10000) {
        alert('Số phòng phải trong khoảng 100 đến 10000.');
        return;
    }
    if (soTang < 1||soTang > 100) {
        alert('Số tầng phải trong khoảng từ 1 đến 100.');
        return;
    }

    try {
        const response = await fetch(apiRoomUrl);
        const rooms = await response.json();

        const isDuplicate = rooms.some(room => room.soPhong == soPhong && room.IdLoaiPhong === maLoaiPhong);
        if (isDuplicate) {
            alert(`Số phòng ${soPhong} của loại phòng này đã tồn tại. Không thể thêm.`);
            return;
        }

        const roomType = await fetchRoomTypeById(maLoaiPhong);
        const giaPhong = roomType ? roomType.giaLoaiPhong : 0;  
        const anhPhong = roomType ? roomType.anhLoaiPhong : "";
        const moTaPhong = roomType ? roomType.moTaLoaiPhong : "";
        const soLuongPhong = roomType ? roomType.soLuongPhong : 0;

        // Chuẩn bị dữ liệu để gửi lên API
        const roomData = {
            IdLoaiPhong: maLoaiPhong,
            soPhong: soPhong,
            soTang: soTang,
            moTaPhong: moTaPhong,
            tinhTrangPhong: 0,
            anhPhong: anhPhong,
            giaPhong: giaPhong  
        };

        // Gọi API để thêm phòng
        const addResponse = await fetch(apiRoomUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(roomData)
        });

        if (!addResponse.ok) {
            throw new Error('Thêm phòng thất bại');
        }

        const responselp = await fetch(`${apiTyperoomUrl}/${maLoaiPhong}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                soLuongPhong:soLuongPhong+1
            })
        });

        if (!responselp.ok) {
            throw new Error('Network response was not ok');
        }

        alert('Phòng mới đã được thêm thành công!');

        document.getElementById('customer-form').reset();
        fetchRoomData();

    } catch (error) {
        console.error('Lỗi khi thêm phòng:', error);
        alert('Không thể thêm phòng. Vui lòng kiểm tra dữ liệu và thử lại.');
    }
}


async function updateRoom() {
    // Lấy giá trị từ các trường input
    const maPhong = document.getElementById('maphong').value;
    const soPhong = document.getElementById('sophong').value;
    const soTang = document.getElementById('sotang').value;
    const maLoaiPhong = document.getElementById('maloaiphong').value;

    // Kiểm tra điều kiện
    if (maPhong==="") {
        alert('Vui lòng chọn phòng để cập nhật.');
        document.getElementById('customer-form').reset();
        return;
    }
    if (!maLoaiPhong) {
        alert('Vui lòng chọn loại phòng.');
        return;
    }
    if (soPhong < 100||soPhong > 10000) {
        alert('Số phòng phải trong khoảng 100 đến 10000.');
        return;
    }
    if (soTang < 1||soTang > 100) {
        alert('Số tầng phải trong khoảng từ 1 đến 100.');
        return;
    }
    try {
        const response = await fetch(apiRoomUrl);
        const rooms = await response.json();

        const isDuplicate = rooms.some(room => room.soPhong == soPhong && room.IdLoaiPhong === maLoaiPhong);
        if (isDuplicate) {
            alert(`Số phòng ${soPhong} của loại phòng này đã tồn tại. Không thể cập nhật.`);
            return;
        }

        const roomData = {
            IdLoaiPhong: maLoaiPhong,
            soPhong: soPhong,
            soTang: soTang,
            moTaPhong: document.getElementById('moTaPhong').value,
            anhPhong: document.getElementById('anhkhachsan').value
        };

        try {
            const response = await fetch(`${apiRoomUrla}/${maPhong}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roomData)
            });

            if (!response.ok) {
                throw new Error('Cập nhật thông tin phòng thất bại');
            }

            alert('Thông tin phòng đã được cập nhật thành công!');

            // Reset form sau khi cập nhật thành công
            document.getElementById('customer-form').reset();

            fetchRoomData();

        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin phòng:', error);
            alert('Không thể cập nhật thông tin phòng. Vui lòng kiểm tra dữ liệu và thử lại.');
        }

    } catch (error) {
        console.error('Lỗi khi thêm phòng:', error);
        alert('Không thể thêm phòng. Vui lòng kiểm tra dữ liệu và thử lại.');
    }

}

async function deleteRoom() {
    const maPhong = document.getElementById('maphong').value;

    if (maPhong==="") {
        alert('Vui lòng chọn phòng để xóa.');
        return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        try {
            const roomResponse = await fetch(`${apiRoomUrla}/${maPhong}`);
            const room = await roomResponse.json();
            const roomTypeId = room.IdLoaiPhong;

            const deleteResponse = await fetch(`${apiRoomUrl}/${maPhong}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!deleteResponse.ok) {
                throw new Error('Xóa phòng thất bại');
            }

            const typeroomResponse = await fetch(`${apiTyperoomUrl}/${roomTypeId}`);
            const typeroom = await typeroomResponse.json();

            const updatedRoomCount = typeroom.soLuongPhong-1;
            await fetch(`${apiTyperoomUrl}/${roomTypeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ soLuongPhong: updatedRoomCount })
            });
            document.getElementById('customer-form').reset();
            alert('Xóa phòng thành công');
            fetchRoomData();
        } catch (error) {
            console.error('Lỗi khi xóa phòng:', error);
            alert('Không thể xóa phòng. Vui lòng thử lại.');
        }
    }
}

function searchRooms() {
    // Lấy giá trị tìm kiếm từ các ô input
    const sophongSearch = removeDiacritics(document.getElementById("search-sophong").value.toLowerCase().trim());
    const loaiphongSearch = removeDiacritics(document.getElementById("search-loaiphong").value.toLowerCase().trim());

    // Lấy tất cả các dòng phòng trong bảng
    const rows = document.querySelectorAll("#customer-list tr");
    let hasResults = false;

    rows.forEach((row) => {
        const sophong = removeDiacritics(row.cells[2].textContent.toLowerCase());
        const loaiphong = removeDiacritics(row.cells[1].textContent.toLowerCase()); // Loại phòng ở cột thứ 2

        const matchesSốPhong = sophong.includes(sophongSearch);
        const matchesLoạiPhong = loaiphong.includes(loaiphongSearch);

        if (
            (sophongSearch === "" || matchesSốPhong) &&
            (loaiphongSearch === "" || matchesLoạiPhong)
        ) {
            row.style.display = "";
            hasResults = true;
        } else {
            row.style.display = "none";
        }
    });

    if (!hasResults) {
        alert("Không tìm thấy kết quả phù hợp.");
    }
}

// Gán sự kiện cho nút tìm kiếm
document.getElementById('searchBtn').addEventListener('click', function (event) {
    event.preventDefault();
    searchRooms();
});

// Hàm loại bỏ dấu tiếng Việt
function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}


window.onload = fetchRoomData;
function confirmLogout(event) {
    event.preventDefault(); 
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?"); 

    if (userConfirmed) {
        window.location.href = "../../welcome.html"; 
    }
}