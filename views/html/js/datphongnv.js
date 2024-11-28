const apiTyperoomByIdHotelUrl = 'http://192.168.10.103:3000/api/typeroombyidhotel';
const apiTyperoomUrl = 'http://192.168.10.103:3000/api/typerooma';
const apiRoomUrl = 'http://192.168.10.103:3000/api/roombyidhotel';
const apiRoomUrla = 'http://192.168.10.103:3000/api/rooms';
const apidatphongUrl = "http://192.168.10.103:3000/api/orderroombyidhotel";
const apiKhachHang = "http://192.168.10.103:3000/api/accountbycccd";
const apiOrderrooma = "http://192.168.10.103:3000/api/orderrooma";
const apiDichVuUrl = 'http://192.168.10.103:3000/api/dichvu';



const hotelId = localStorage.getItem('IdKhachSan');

async function fetchBookings() {
    const response = await fetch(`${apidatphongUrl}/${hotelId}`);
    const bookings = await response.json();
    return bookings.filter(booking => booking.status !== 2 && booking.status !== 3);

}
async function fetchRoomTypes() {
    const response = await fetch(`${apiTyperoomUrl}`);
    return await response.json();
}
async function fetchRoomTypeById(idLoaiPhong) {
    const response = await fetch(`${apiTyperoomUrl}/${idLoaiPhong}`);
    const roomTypeData = await response.json();
    return roomTypeData.tenLoaiPhong; 
}

async function fetchServices() {
    try {
        const response = await fetch(apiDichVuUrl);
        if (response.ok) {
            const services = await response.json();
            return services;
        } else {
            console.error("Không thể tải danh sách dịch vụ.");
            return [];
        }
    } catch (error) {
        console.error("Có lỗi xảy ra khi tải danh sách dịch vụ:", error);
        return [];
    }
}

async function fetchRooms() {
    const response = await fetch(`${apiRoomUrl}/${hotelId}`);
    return await response.json();
}

function formatDateForBookingod(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}
function formatDateForBooking(dateString) {
    const regex = /^(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);

    if (!match) {
        console.error("Định dạng thời gian không hợp lệ");
        return "";
    }

    const [, hours, minutes, seconds, day, month, year] = match;
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

function parseDateISO(dateString) {
    const [time, date] = dateString.split(" ");
    const [day, month, year] = date.split("/");
    const [hours, minutes, seconds] = time.split(":");

    return new Date(year, month - 1, day, hours, minutes, seconds).toISOString();
}

function isDateInRange(dateToCheck, startDate, endDate) {
    return dateToCheck >= startDate && dateToCheck <= endDate;
}

document.getElementById("searchBtn").addEventListener("click", async function() {
    const timeGetInput = document.getElementById("thoiGianNhan").value;
    const timeCheckoutInput = document.getElementById("thoiGianTra").value;
    const noteInput = document.getElementById("ghiChu").value;
    const uidInput = document.getElementById("uid").value; 

    if (!timeGetInput || !timeCheckoutInput || !noteInput || !uidInput) {
        alert("Vui lòng điền đầy đủ các trường: Thời gian nhận, Thời gian trả, Ghi chú, và UID.");
        return;
    }

    const customerResponse = await fetch(`${apiKhachHang}/${uidInput}`);
    if (!customerResponse.ok) {
        alert("Mã khách hàng không tồn tại. Vui lòng kiểm tra lại.");
        return;
    }
    const customerData = await customerResponse.json();
    const uid = customerData._id; 

    const formattedTimeGet = formatDateForBooking(timeGetInput);
    const formattedTimeCheckout = formatDateForBooking(timeCheckoutInput);

    if (!formattedTimeGet || !formattedTimeCheckout) {
        alert("Thời gian không hợp lệ. Vui lòng kiểm tra lại!");
        return;
    }
    const startDatea = new Date(parseDateISO(timeGetInput));
    const endDatea = new Date(parseDateISO(timeCheckoutInput));
    const orderTime = new Date(); 
    const timeDiff = endDatea - startDatea;  
    const timeDiffa = startDatea - orderTime;  
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const numberOfDaysa = Math.ceil(timeDiffa / (1000 * 3600 * 24));

    if (numberOfDays <= 0) {
        alert("Ngày trả phải sau ngày nhận");
        return;
    }
    if (numberOfDaysa <= 0) {
        alert("Thời gian nhận phòng phải sau thời gian hiện tại ");
        return;
    }

    const startDate = parseDateISO(timeGetInput);
    const endDate = parseDateISO(timeCheckoutInput);

    const bookings = await fetchBookings();
    const rooms = await fetchRooms();

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

    const availableRooms = rooms.filter(room => 
        !bookedRoomIds.includes(room._id)
    );
    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = ""; 
    for (let room of availableRooms) {
        const roomTypeName = await fetchRoomTypeById(room.IdLoaiPhong); 

        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="hidden">${room._id}</td>
            <td>${room.soPhong}</td>
            <td>${roomTypeName}</td> <!-- Hiển thị tên loại phòng thay cho moTaPhong -->
            <td>${room.giaPhong}</td>
            <td><button type="button" onclick="bookRoom('${room._id}', '${uid}', '${noteInput}', '${room.giaPhong}', '${room.anhPhong}')">Đặt Phòng</button></td>
        `;
        customerList.appendChild(row);
    }
});

async function bookRoom(roomId, uid, note, giaPhong,img) {
    const timeGetInput = document.getElementById("thoiGianNhan").value;
    const timeCheckoutInput = document.getElementById("thoiGianTra").value;
    const serviceId = document.getElementById("tenDichVu").value;
    const giaDichVuInput = document.getElementById("giadichVu").value;
    const giaDichVu = parseFloat(giaDichVuInput.replace(/[^0-9.-]+/g, "")) || 0;
    const formattedTimeGet = formatDateForBooking(timeGetInput);
    const formattedTimeCheckout = formatDateForBooking(timeCheckoutInput);
    if (!serviceId) {
        alert("Vui lòng chọn dịch vụ.");
        return;
    }
    if (!formattedTimeGet || !formattedTimeCheckout) {
        alert("Thời gian phải có dạng HH:mm:ss dd:MM:yyyy. Vui lòng kiểm tra lại!");
        return;
    }
    const startDate = new Date(parseDateISO(timeGetInput));
    const endDate = new Date(parseDateISO(timeCheckoutInput));
    const orderTime = new Date(); 
    const formattedOrderTime = formatDateForBookingod(orderTime);
    const timeDiff = endDate - startDate;  
    const timeDiffa = startDate - orderTime;  
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const numberOfDaysa = Math.ceil(timeDiffa / (1000 * 3600 * 24));

    if (numberOfDays <= 0) {
        alert("Ngày trả phải sau ngày nhận");
        return;
    }
    if (numberOfDaysa <= 0) {
        alert("Thời gian nhận phòng phải sau thời gian đặt phòng ");
        return;
    }
    const total = numberOfDays * giaPhong + giaDichVu;
    

    const orderData = {
        IdPhong: roomId,
        Uid: uid,
        IdDichVu: serviceId, 
        orderTime: formattedOrderTime,       
        timeGet: formattedTimeGet,           
        timeCheckout: formattedTimeCheckout, 
        note: note,
        total: total,
        img:img,
        status: 0
    };

    const response = await fetch(apiOrderrooma, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });

    if (response.ok) {
        const data = await response.json();
        alert("Đặt phòng thành công!");
        console.log(data); 
        await fetch(`${apiRoomUrla}/${roomId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tinhTrangPhong: 1 })
        });

        location.reload();

    } else {
        alert("Đặt phòng thất bại!");
    }
};
document.getElementById('uid').addEventListener('input', async function() {
    const uid = document.getElementById("uid").value;
    const nameField = document.getElementById("TenKhachHang");

    if (uid) {
        try {
            const response = await fetch(`${apiKhachHang}/${uid}`);
            if (response.ok) {
                const customerData = await response.json();
                nameField.value = customerData.username || "Tên không có sẵn"; 
            } else {
                nameField.value = "Khách hàng không tồn tại";
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi kiểm tra mã khách hàng:", error);
            nameField.value = "Lỗi kết nối";
        }
    } else {
        nameField.value = "";
    }
});
async function populateServiceDropdown() {
    const serviceDropdown = document.getElementById("tenDichVu");
    serviceDropdown.innerHTML = '<option value="">Vui lòng chọn dịch vụ</option>'; 

    const services = await fetchServices();
    services.forEach(service => {
        const option = document.createElement("option");
        option.value = service._id; 
        option.textContent = service.tenDichVu; 
        option.dataset.giaDichVu = service.giaDichVu; 
        serviceDropdown.appendChild(option);
    });
}
document.getElementById("tenDichVu").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const giaDichVuInput = document.getElementById("giadichVu");
    const giaDichVu = selectedOption.dataset.giaDichVu || ""; 

    giaDichVuInput.value = giaDichVu ? `${giaDichVu} VNĐ` : "";
});

document.addEventListener("DOMContentLoaded", populateServiceDropdown);

function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (userConfirmed) {
        window.location.href = "../../welcome.html";
    }
}
