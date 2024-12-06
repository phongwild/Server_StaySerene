const apiUrls = {
    typeroomByIdHotel: `${base_url}typeroombyidhotel`,
    typeroom: `${base_url}typerooma`,
    roomByHotel: `${base_url}roombyidhotel`,
    roomUpdate: `${base_url}rooms`,
    orderroomByHotel: `${base_url}orderroombyidhotel`,
    accountByCCCD: `${base_url}accountbycccd`,
    orderroom: `${base_url}orderrooma`,
    service: `${base_url}dichvu`
};

const hotelId = localStorage.getItem('IdKhachSan');

/* ======================== Helper Functions ======================== */

// Hàm định dạng ngày giờ
function formatDate(date, includeTime = true) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = '00';

    return includeTime
        ? `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
        : `${day}/${month}/${year}`;
}

// Chuyển đổi ngày giờ từ input thành ISO
function parseDateISO(dateString) {
    const [time, date] = dateString.split(" ");
    const [day, month, year] = date.split("/");
    const [hours, minutes, seconds] = time.split(":");

    return new Date(year, month - 1, day, hours, minutes, seconds).toISOString();
}

// Kiểm tra ngày trong khoảng
function isDateInRange(dateToCheck, startDate, endDate) {
    return dateToCheck >= startDate && dateToCheck <= endDate;
}

// Hiển thị thông báo lỗi người dùng
function showAlert(message) {
    alert(message);
}

/* ======================== API Functions ======================== */

// Gọi API chung
async function fetchData(url, options = {}) {
    showProgressBar(); // Hiển thị progress bar
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Lỗi khi gọi API: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        hideProgressBar(); // Ẩn progress bar sau khi hoàn thành
    }
}

// Lấy danh sách đặt phòng
async function fetchBookings() {
    const bookings = await fetchData(`${apiUrls.orderroomByHotel}/${hotelId}`);
    return bookings ? bookings.filter(b => b.status !== 2 && b.status !== 3) : [];
}

// Lấy danh sách phòng
async function fetchRooms() {
    return await fetchData(`${apiUrls.roomByHotel}/${hotelId}`) || [];
}

// Lấy danh sách loại phòng
async function fetchRoomTypeById(idLoaiPhong) {
    const roomType = await fetchData(`${apiUrls.typeroom}/${idLoaiPhong}`);
    return roomType ? roomType.tenLoaiPhong : "Không xác định";
}

// Lấy danh sách dịch vụ
async function fetchServices() {
    return await fetchData(apiUrls.service) || [];
}

/* ======================== Booking Logic ======================== */

// Hiển thị danh sách phòng trống
document.getElementById("searchBtn").addEventListener("click", async function () {
    const timeGetInput = document.getElementById("thoiGianNhan").value;
    const timeCheckoutInput = document.getElementById("thoiGianTra").value;
    const noteInput = document.getElementById("ghiChu").value;

    // Kiểm tra input
    if (!timeGetInput || !timeCheckoutInput) {
        showAlert("Vui lòng điền đầy đủ các trường: Thời gian nhận, Thời gian trả");
        return;
    }

    showProgressBar(); // Hiển thị progress bar khi bắt đầu tìm kiếm

    try {
        const startDate = new Date(timeGetInput);
        const endDate = new Date(timeCheckoutInput);
        const currentDate = new Date();

        if (endDate <= startDate) {
            showAlert("Ngày trả phải sau ngày nhận");
            return;
        }

        if (startDate <= currentDate) {
            showAlert("Thời gian nhận phòng phải sau thời gian hiện tại");
            return;
        }

        // Lấy danh sách đặt phòng và phòng
        const bookings = await fetchBookings();
        const rooms = await fetchRooms();

        // Lọc phòng trống
        const bookedRoomIds = bookings
            .filter(booking => {
                const bookingStart = parseDateISO(booking.timeGet);
                const bookingEnd = parseDateISO(booking.timeCheckout);
                return (
                    isDateInRange(startDate, bookingStart, bookingEnd) ||
                    isDateInRange(endDate, bookingStart, bookingEnd) ||
                    isDateInRange(bookingStart, startDate, endDate)
                );
            })
            .map(booking => booking.IdPhong);

        const availableRooms = rooms.filter(room => !bookedRoomIds.includes(room._id));

        // Cập nhật UI
        const customerList = document.getElementById("customer-list");
        customerList.innerHTML = "";
        for (let room of availableRooms) {
            const roomTypeName = await fetchRoomTypeById(room.IdLoaiPhong);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="hidden">${room._id}</td>
                <td>${room.soPhong}</td>
                <td>${roomTypeName}</td>
                <td>${room.giaPhong}</td>
                <td>
                    <button type="button" onclick="bookRoom('${room._id}', '${noteInput}', '${room.giaPhong}', '${room.anhPhong}')">
                        Đặt Phòng
                    </button>
                </td>
            `;
            customerList.appendChild(row);
        }

        // Hiển thị các mục
        document.getElementById("cccd-section").style.display = "block";
        document.getElementById("dichvu-section").style.display = "block";
        document.getElementById("ghichu-section").style.display = "block";
        document.getElementById("table-section").style.display = "";
        document.getElementById("searchBtn").style.display = "none";
        document.getElementById("thoiGianNhan").disabled = true;
        document.getElementById("thoiGianTra").disabled = true;

    } catch (error) {
        console.error("Lỗi khi tìm kiếm phòng:", error);
    } finally {
        hideProgressBar(); // Ẩn progress bar sau khi hoàn thành
    }
});


/* ======================== Event Handlers ======================== */

// Thay đổi dịch vụ
document.getElementById("tenDichVu").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const giaDichVuInput = document.getElementById("giadichVu");
    const giaDichVu = selectedOption.dataset.giaDichVu || "";
    giaDichVuInput.value = giaDichVu ? `${giaDichVu} VNĐ` : "";
});
// Hàm định dạng ngày giờ cho booking (thay thế `formatDateForBookingod`)
function formatDateForBooking(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

async function bookRoom(roomId, note, giaPhong, img) {
    const timeGetInput = document.getElementById("thoiGianNhan").value;
    const timeCheckoutInput = document.getElementById("thoiGianTra").value;
    const serviceId = document.getElementById("tenDichVu").value;
    const giaDichVuInput = document.getElementById("giadichVu").value;
    const uidInput = document.getElementById("uid").value;

    // Kiểm tra các trường bắt buộc
    if (!timeGetInput || !timeCheckoutInput || !uidInput) {
        showAlert("Vui lòng điền đầy đủ các trường: Thời gian nhận, Thời gian trả, và số CCCD");
        return;
    }

    if (!/^\d{12}$/.test(uidInput)) {
        showAlert("Số CCCD phải là 12 chữ số.");
        return;
    }

    const customerResponse = await fetch(`${apiUrls.accountByCCCD}/${uidInput}`);
    if (!customerResponse.ok) {
        showAlert("Khách hàng không tồn tại. Vui lòng kiểm tra lại.");
        return;
    }

    const customerData = await customerResponse.json();
    const uid = customerData._id;

    // Kiểm tra dịch vụ đã chọn
    if (!serviceId) {
        showAlert("Vui lòng chọn dịch vụ.");
        return;
    }

    const formattedTimeGet = formatDate(timeGetInput);
    const formattedTimeCheckout = formatDate(timeCheckoutInput);

    if (!formattedTimeGet || !formattedTimeCheckout) {
        showAlert("Thời gian phải có dạng HH:mm:ss dd:MM:yyyy. Vui lòng kiểm tra lại!");
        return;
    }

    // Kiểm tra ngày nhận phòng và trả phòng
    const startDate = new Date(timeGetInput);
    const endDate = new Date(timeCheckoutInput);
    const orderTime = new Date();
    const formattedOrderTime = formatDateForBooking(orderTime);
    const timeDiff = endDate - startDate;
    const timeDiffa = startDate - orderTime;
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const numberOfDaysa = Math.ceil(timeDiffa / (1000 * 3600 * 24));

    if (numberOfDays <= 0) {
        showAlert("Ngày trả phải sau ngày nhận");
        return;
    }

    if (numberOfDaysa <= 0) {
        showAlert("Thời gian nhận phòng phải sau thời gian đặt phòng ");
        return;
    }

    const total = numberOfDays * giaPhong + parseFloat(giaDichVuInput.replace(/[^0-9.-]+/g, "")) || 0;

    const orderData = {
        IdPhong: roomId,
        Uid: uid,
        IdDichVu: serviceId,
        orderTime: formattedOrderTime,
        timeGet: formattedTimeGet,
        timeCheckout: formattedTimeCheckout,
        note: note,
        total: total,
        img: img,
        status: 0
    };

    const response = await fetch(apiUrls.orderroom, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });

    if (response.ok) {
        const data = await response.json();
        showAlert("Đặt phòng thành công!");
        console.log(data);
        await fetch(`${apiUrls.roomUpdate}/${roomId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tinhTrangPhong: 1 }) // Đánh dấu phòng là đã đặt
        });

        location.reload(); // Tải lại trang để cập nhật dữ liệu
    } else {
        showAlert("Đặt phòng thất bại!");
    }
}

// Kiểm tra CCCD khách hàng
document.getElementById('uid').addEventListener('input', async function () {
    const uid = this.value;
    const nameField = document.getElementById("TenKhachHang");

    if (!uid) {
        nameField.value = "";
        return;
    }

    const customerData = await fetchData(`${apiUrls.accountByCCCD}/${uid}`);
    nameField.value = customerData ? customerData.username || "Tên không có sẵn" : "Khách hàng không tồn tại";
});
//Progressbar
function showProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    progressBar.style.display = 'block';
    progressBarFill.style.width = '0%';

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 90) { // Giới hạn đến 90% khi đang load
            clearInterval(interval);
        } else {
            width += 10;
            progressBarFill.style.width = width + '%';
        }
    }, 300);
}

function hideProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    progressBarFill.style.width = '100%';
    setTimeout(() => {
        progressBar.style.display = 'none';
    }, 500); // Ẩn sau khi hoàn thành
}
async function populateServiceDropdown() {
    const serviceDropdown = document.getElementById("tenDichVu");
    serviceDropdown.innerHTML = '<option value="">Vui lòng chọn dịch vụ</option>'; // Reset dropdown

    showProgressBar(); // Hiển thị progress bar

    try {
        const services = await fetchServices(); // Lấy danh sách dịch vụ
        if (services && services.length > 0) {
            services.forEach(service => {
                const option = document.createElement("option");
                option.value = service._id;
                option.textContent = service.tenDichVu;
                option.dataset.giaDichVu = service.giaDichVu; // Lưu giá dịch vụ
                serviceDropdown.appendChild(option);
            });
        } else {
            serviceDropdown.innerHTML = '<option value="">Không có dịch vụ nào</option>';
        }
    } catch (error) {
        console.error("Lỗi khi tải dịch vụ:", error);
        showAlert("Không thể tải danh sách dịch vụ.");
    } finally {
        hideProgressBar(); // Ẩn progress bar
    }
}

document.addEventListener("DOMContentLoaded", populateServiceDropdown); // Tải dịch vụ khi trang tải xong

// Đăng xuất
function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (userConfirmed) window.location.href = "../../welcome.html";
}
