const apiHotelUrl = `${base_url}hotel`;
const apiTyperoomUrl = `${base_url}typerooma`;
const apiRoomUrl = `${base_url}rooms`;
const apiRoomUrla = `${base_url}roomsa`;
const apiTyperoomByHotelUrl = `${base_url}typeroombyidhotel`;
const apiRoomByHotelUrl = `${base_url}roombyidhotel`;
const hotelId = localStorage.getItem('IdKhachSan');
let allRooms = []; // Lưu toàn bộ dữ liệu phòng
let currentPage = 1;
const itemsPerPage = 10; // Số lượng phòng hiển thị mỗi trang

async function fetchRoomData() {
    try {
        const response = await fetch(`${apiRoomByHotelUrl}/${hotelId}`);
        if (!response.ok) throw new Error("Không thể lấy dữ liệu phòng.");
        allRooms = await response.json(); // Lưu toàn bộ dữ liệu vào biến

        renderRoomData(); // Hiển thị dữ liệu cho trang đầu tiên
        setupPagination(); // Thiết lập giao diện phân trang
    } catch (error) {
        console.error("Error fetching room data:", error);
        alert("Không thể lấy dữ liệu phòng. Vui lòng thử lại.");
    }
}
async function renderRoomData() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const roomsToDisplay = allRooms.slice(startIndex, endIndex); 

    const roomTypes = await fetchTyperoomData();
    const hotels = await fetchHotelData();
    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = "";

    roomsToDisplay.forEach((room) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", room._id);
        row.onclick = () => showRoomDetails(room, roomTypes, hotels);
        const roomType = roomTypes.find((type) => type._id === room.IdLoaiPhong);
        row.innerHTML = `
            <td class="hidden">${room._id || "N/A"}</td>
            <td>${roomType ? roomType.tenLoaiPhong : "Không tồn tại."}</td>
            <td>${room.soPhong || "N/A"}</td>
            <td>${room.moTaPhong || "N/A"}</td>
            <td class="hidden">${room.tinhTrangPhong === 0 ? "Phòng trống" : "Đã được đặt"}</td>
        `;

        customerList.appendChild(row);
    });
}
function setupPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(allRooms.length / itemsPerPage); // Tổng số trang

    // Nút Previous
    const prevButton = document.createElement("button");
    prevButton.textContent = "⇐";
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        currentPage--;
        renderRoomData();
        setupPagination();
    };
    pagination.appendChild(prevButton);

    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.className = currentPage === i ? "active" : "";
        pageButton.onclick = () => {
            currentPage = i;
            renderRoomData();
            setupPagination();
        };
        pagination.appendChild(pageButton);
    }

    // Nút Next
    const nextButton = document.createElement("button");
    nextButton.textContent = "⇒";
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        currentPage++;
        renderRoomData();
        setupPagination();
    };
    pagination.appendChild(nextButton);
}

async function fetchTyperoomData() {
    const response = await fetch(apiTyperoomUrl);
    return response.json();
}

async function fetchTyperoomByHotelId() {
    try {
        const response = await fetch(`${apiTyperoomByHotelUrl}/${hotelId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching room types:', error);
        return [];
    }
}

function setupRoomTypeChangeListener() {
    const roomTypeSelect = document.getElementById('tenloaiphong');
    const maLoaiPhongInput = document.getElementById('maloaiphong');

    roomTypeSelect.addEventListener('change', () => {
        const selectedRoomTypeId = roomTypeSelect.value; // Lấy giá trị IdLoaiPhong từ select
        maLoaiPhongInput.value = selectedRoomTypeId || ''; // Gán giá trị vào input
    });
}

async function populateRoomTypeOptions() {
    try {
        const roomTypes = await fetchTyperoomByHotelId();
        const roomTypeSelect = document.getElementById('tenloaiphong');
        roomTypeSelect.innerHTML = '<option value="">Chọn loại phòng</option>';

        roomTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type._id; 
            option.textContent = type.tenLoaiPhong;
            roomTypeSelect.appendChild(option);
        });

        console.log('Danh sách loại phòng:', roomTypes);

        setupRoomTypeChangeListener();
    } catch (error) {
        console.error('Lỗi khi hiển thị danh sách loại phòng:', error);
        alert('Không thể lấy danh sách loại phòng. Vui lòng thử lại.');
    }
}


async function fetchHotelData() {
    const response = await fetch(apiHotelUrl);
    return response.json();
}


async function showRoomDetails(room, roomTypes, hotels) {
    if (!room || !roomTypes || !hotels) {
        console.error("Thiếu dữ liệu để hiển thị thông tin phòng.");
        return;
    }

    // Điền dữ liệu phòng vào các trường input
    document.getElementById('maphong').value = room._id || '';
    document.getElementById('maloaiphong').value = room.IdLoaiPhong || '';
    document.getElementById('sophong').value = room.soPhong || '';
    document.getElementById('sotang').value = room.soTang || '';

    // Lọc loại phòng theo khách sạn
    const filteredRoomTypes = roomTypes.filter(type => type.IdKhachSan === hotelId);

    // Hiển thị danh sách loại phòng trong select
    const roomTypeSelect = document.getElementById('tenloaiphong');
    roomTypeSelect.innerHTML = '<option value="">Chọn loại phòng</option>';

    // Thêm các loại phòng thuộc khách sạn vào select
    filteredRoomTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type._id; 
        option.textContent = type.tenLoaiPhong; 
        roomTypeSelect.appendChild(option);
    });

    // Đặt giá trị select theo IdLoaiPhong của phòng
    if (room.IdLoaiPhong) {
        roomTypeSelect.value = room.IdLoaiPhong;
    } else {
        roomTypeSelect.value = '';
    }
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
    if (soPhong < 100 || soPhong > 10000) {
        alert('Số phòng phải trong khoảng 100 đến 10000.');
        return;
    }
    if (soTang < 1 || soTang > 100) {
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
                soLuongPhong: soLuongPhong + 1
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
    if (maPhong === "") {
        alert('Vui lòng chọn phòng để cập nhật.');
        document.getElementById('customer-form').reset();
        return;
    }
    if (!maLoaiPhong) {
        alert('Vui lòng chọn loại phòng.');
        return;
    }
    if (soPhong < 100 || soPhong > 10000) {
        alert('Số phòng phải trong khoảng 100 đến 10000.');
        return;
    }
    if (soTang < 1 || soTang > 100) {
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
            soTang: soTang
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
            alert('Không thể cập nhật thông tin phòng.');
        }

    } catch (error) {
        console.error('Lỗi khi thêm phòng:', error);
        alert('Không thể cập nhật thông tin phòng. Vui lòng kiểm tra dữ liệu và thử lại.');
    }

}

async function deleteRoom() {
    const maPhong = document.getElementById('maphong').value;

    if (maPhong === "") {
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

            const updatedRoomCount = typeroom.soLuongPhong - 1;
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


window.onload = async () => {
    await fetchRoomData();
    await populateRoomTypeOptions();
};function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

    if (userConfirmed) {
        window.location.href = "../../welcome.html";
    }
}