const apiTyperoomByIdHotelUrl = 'http://192.168.1.2:3000/api/typeroombyidhotel';
const apiTyperoomUrl = 'http://192.168.1.2:3000/api/typeroom';
const apiRoomUrl = 'http://192.168.1.2:3000/api/roombyidhotel';
const apidatphongUrl = "http://192.168.1.2:3000/api/orderroombyidhotel";
const apiKhachHang = "http://192.168.1.2:3000/api/accountac";


const hotelId = localStorage.getItem('IdKhachSan');

async function fetchBookings() {
    const response = await fetch(`${apidatphongUrl}/${hotelId}`);
    return await response.json();
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

    const formattedTimeGet = formatDateForBooking(timeGetInput);
    const formattedTimeCheckout = formatDateForBooking(timeCheckoutInput);

    if (!formattedTimeGet || !formattedTimeCheckout) {
        alert("Thời gian không hợp lệ. Vui lòng kiểm tra lại!");
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

    const availableRooms = rooms.filter(room => !bookedRoomIds.includes(room._id));

    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = ""; 
    availableRooms.forEach(room => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${room._id}</td>
            <td>${room.soPhong}</td>
            <td>${room.moTaPhong}</td>
            <td>${room.giaPhong}</td>
            <td><button type="button" onclick="bookRoom('${room._id}', '${uidInput}', '${noteInput}', ${room.giaPhong})">Đặt Phòng</button></td>
        `;
        customerList.appendChild(row);
    });
});

async function bookRoom(roomId, uid, note, total) {
    const timeGetInput = document.getElementById("thoiGianNhan").value;
    const timeCheckoutInput = document.getElementById("thoiGianTra").value;

    const formattedTimeGet = formatDateForBooking(timeGetInput);
    const formattedTimeCheckout = formatDateForBooking(timeCheckoutInput);

    if (!formattedTimeGet || !formattedTimeCheckout) {
        alert("Thời gian không hợp lệ. Vui lòng kiểm tra lại!");
        return;
    }

    const orderTime = new Date(); 

    const formattedOrderTime = formatDateForBookingod(orderTime);

    const orderData = {
        IdPhong: roomId,
        Uid: uid,
        IdDichVu: "6707ed79df6d7c9585d8ebac", 
        orderTime: formattedOrderTime,       
        timeGet: formattedTimeGet,           
        timeCheckout: formattedTimeCheckout, 
        note: note,
        total: total,
        status: 0
    };

    const response = await fetch("http://192.168.1.2:3000/api/orderroom", {
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

function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (userConfirmed) {
        window.location.href = "../../welcome.html";
    }
}
