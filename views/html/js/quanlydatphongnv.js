const apiUrl = "http://10.62.4.33:3000/api/orderroom";
const apidatphongUrl = "http://10.62.4.33:3000/api/orderroombyidhotel";
const serviceApiUrl = "http://10.62.4.33:3000/api/dichvu";
const apiKhachHang = "http://10.62.4.33:3000/api/accounta";
const apirooma = "http://10.62.4.33:3000/api/roomsa";
const apiroom = "http://10.62.4.33:3000/api/rooms";

const hotelId = localStorage.getItem('IdKhachSan');
let services = {};

async function fetchRoomById(roomId) {
  try {
    const response = await fetch(`${apirooma}/${roomId}`); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const room = await response.json();
    return room; 
  } catch (error) {
    console.error('Error fetching room by ID:', error);
    return null;
  }
}
async function fetchCustomerById(customerId) {
  try {
    const response = await fetch(`${apiKhachHang}/${customerId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    return null;
  }
}

async function fetchAllServices() {
  try {
    const response = await fetch(serviceApiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("Fetched services:", data);
    return data;
  } catch (error) {
    console.error('Error fetching all services:', error);
    return [];
  }
}
async function fetchServiceById(serviceId) {
  try {
    const response = await fetch(`${serviceApiUrl}/${serviceId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const service = await response.json();
    console.log("Fetched service:", service);
    return service;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    return null;
  }
}

async function populateServices() {
  try {
    services = await fetchAllServices();  
    console.log("Available services:", services); 

    const select = document.getElementById('tenDichVu');
    select.innerHTML = '<option value="">Chọn dịch vụ</option>';

    if (services.length === 0) {
      console.log("No services found");
    }

    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service._id; 
      option.textContent = service.tenDichVu; 
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating services:', error);
  }
}



const statusMapping = {
  0: "Đã đặt cọc",
  1: "Đã nhận phòng",
  2: "Đã trả phòng",
  3: "Đã hủy"
};

function validateDateTimeFormat(dateTime) {
  const dateTimePattern = /^\d{2}:\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}$/;
  return dateTimePattern.test(dateTime);
}
function isNotEmpty(value, fieldName) {
  if (!value) {
    alert(`${fieldName} không được để trống`);
    return false;
  }
  return true;
}
async function fetchLichSus() {
  try {
    const response = await fetch(`${apidatphongUrl}/${hotelId}`);
    const lichsus = await response.json();
    displayLichSus(lichsus);
  } catch (error) {
    console.error("Lỗi khi fetch lichsus:", error);
  }
}


async function displayLichSus(lichsus) {
  const customerList = document.getElementById("customer-list");
  customerList.innerHTML = "";

  for (const lichsu of lichsus) {
    const row = document.createElement("tr");
    const mdp = lichsu._id;
    const Uid = lichsu.Uid;
    const phongID = lichsu.IdPhong;
    const thoiGianDatPhong = lichsu.orderTime;
    const thoiGianNhan = lichsu.timeGet;
    const thoiGianTra = lichsu.timeCheckout;
    const ghiChu = lichsu.note;
    const trangThaiValue = lichsu.status;
    const dichVuID = lichsu.IdDichVu || "N/A";
    const tongTien = lichsu.total;

    const room = await fetchRoomById(phongID);
    const soPhong = room ? room.soPhong : "Không có số phòng"; 

    const customer = await fetchCustomerById(Uid);
    const customerName = customer ? customer.username : "Không tìm thấy tên khách hàng";
    const customerCCCD= customer ? customer.cccd : "Không tìm thấy tên khách hàng";

    row.innerHTML = `
      <td class="hidden">${mdp}</td>
      <td>${customerName}</td> <!-- Thay thế mã khách hàng bằng tên khách hàng -->
      <td>${customerCCCD}</td> <!-- Thay thế mã khách hàng bằng tên khách hàng -->
      <td>${soPhong}</td>
      <td>${thoiGianDatPhong}</td>
      <td>${thoiGianNhan}</td>
      <td>${thoiGianTra}</td>
      <td>${statusMapping[trangThaiValue]}</td>
    `;

    row.onclick = async function () {
      console.log("Row clicked:", mdp);
      document.getElementById("mdp").value = mdp;
      document.getElementById("uid").value = Uid;
      document.getElementById("TenKhachHang").value = customerName;
      document.getElementById("phong1").value = phongID;
      document.getElementById("thoiGianDat").value = thoiGianDatPhong;
      document.getElementById("thoiGianNhan").value = thoiGianNhan;
      document.getElementById("thoiGianTra").value = thoiGianTra;
      document.getElementById("ghiChu").value = ghiChu;
      document.getElementById("trangThai").value = trangThaiValue;
      document.getElementById("tongTien").value = tongTien;
      document.getElementById("cccd").value = customerCCCD;

      const room = await fetchRoomById(phongID);
      if (room) {
        document.getElementById("soPhong").value = room.soPhong;
      } else {
        document.getElementById("soPhong").value = "Phòng không tồn tại";
      }

      const service = await fetchServiceById(dichVuID);
      if (service) {
        document.getElementById("tenDichVu").value = service.tenDichVu;
      } else {
        document.getElementById("tenDichVu").value = "Dịch vụ không tồn tại";
      }
    };

    customerList.appendChild(row);
  }
}


async function editderroom() {
  const mdpValue = document.getElementById("mdp").value;

  if (!mdpValue) {
    alert("Vui lòng chọn đặt phòng để cập nhật.");
    return;
  }

  const uid = document.getElementById("uid").value;
  const phong = document.getElementById("phong1").value; 
  const dichVu = document.getElementById("dichVu").value;
  const thoiGianDat = document.getElementById("thoiGianDat").value; 
  const thoiGianNhan = document.getElementById("thoiGianNhan").value;
  const thoiGianTra = document.getElementById("thoiGianTra").value;
  const trangThai = document.getElementById("trangThai").value;
  const tongTien = document.getElementById("tongTien").value;

  if (
    !isNotEmpty(uid, "mã khách hàng ") ||
    !isNotEmpty(thoiGianDat, "Thời gian đặt") ||
    !isNotEmpty(thoiGianNhan, "Thời gian nhận") ||
    !isNotEmpty(thoiGianTra, "Thời gian trả") ||
    !isNotEmpty(trangThai, "Trạng thái")
  ) {
    return; 
  }

  const updatedOrder = {
    Uid: uid,
    IdPhong: phong, 
    IdDichVu: dichVu || "6707ed79df6d7c9585d8ebab",
    orderTime: thoiGianDat,
    timeGet: thoiGianNhan,
    timeCheckout: thoiGianTra,
    note: document.getElementById("ghiChu").value,
    status: trangThai || 0,
    total: tongTien,
  };

  try {
    if (trangThai === "2" || trangThai === "3") { 
      await fetch(`${apiroom}/${phong}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tinhTrangPhong: 0 }),
      });
    }
    if (trangThai === "0" || trangThai === "1") {  
      await fetch(`${apiroom}/${phong}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tinhTrangPhong: 1 }),
      });
    }

    const response = await fetch(`${apiUrl}/${mdpValue}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOrder),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log("Order updated successfully:", result);
    alert("Cập nhật thông tin thành công");
    fetchLichSus();
    document.getElementById("customer-form").reset();
  } catch (error) {
    console.error("Error updating order:", error);
  }
}



function formatToISO(dateString) {
  const date = new Date(dateString);

  if (isNaN(date)) {
    console.error("Invalid date format:", dateString);
    return null;
  }

  return date.toISOString();
}


function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function filterTable() {
  const searchInput = removeVietnameseTones(
    document.getElementById("search").value.toLowerCase()
  );
  const rows = document.querySelectorAll("#customer-list tr");

  rows.forEach((row) => {
    const cells = row.getElementsByTagName("td");
    if (cells.length > 1) {
      const serviceText = removeVietnameseTones(cells[1].innerText.toLowerCase());

      row.style.display = serviceText.includes(searchInput) ? "" : "none";
    }
  });
}
function formatDateTime(dateTime) {
  const date = new Date(dateTime);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}




function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

window.onload = function () {
  fetchLichSus();
};




document.getElementById('tenDichVu').addEventListener('change', function () {
  const selectedOption = this.options[this.selectedIndex];
  const selectedServiceId = selectedOption.value;

  console.log('Selected Service ID:', selectedServiceId);
});
document.getElementById('tenDichVu').addEventListener('change', async function () {
  const selectedOption = this.options[this.selectedIndex];
  const selectedServiceId = selectedOption.value;

  const service = await fetchServiceById(selectedServiceId);
  if (service) {
    document.getElementById('dichVu').value = service._id; 
    console.log('Selected Service:', service.tenDichVu); 
    document.getElementById('dichVu').value = ""; 
    console.log('Service not found');
  }
});

document.getElementById('dichVu').addEventListener('input', function () {
  const inputServiceId = this.value;

  const select = document.getElementById('tenDichVu');
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === inputServiceId) {
      select.selectedIndex = i; 
      console.log('Selected Service ID:', inputServiceId);
      break;
    }
  }
});
document.addEventListener('DOMContentLoaded', () => {
  populateServices(); 
});

document.getElementById('searchBtn').addEventListener('click', async function() {
  const searchMadatphong = document.getElementById('search-madatphong').value.toLowerCase();
  const searchTenKhachHang = document.getElementById('search-tenkhachhang').value.toLowerCase();
  const searchSoPhong = document.getElementById('search-sophong').value.toLowerCase();

  try {
    const response = await fetch(`${apidatphongUrl}/${hotelId}`);
    const bookings = await response.json();

    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = "";

    for (const booking of bookings) {
      const customer = await fetchCustomerById(booking.Uid);
      const room = await fetchRoomById(booking.IdPhong);

      const matchesMadatphong = searchMadatphong ? (customer && customer.username.toLowerCase().includes(searchMadatphong)) : true;
      const matchesTenKhachHang = searchTenKhachHang ? (customer && customer.cccd.toLowerCase().includes(searchTenKhachHang)) : true;
      const matchesSoPhong = searchSoPhong ? (room && room.soPhong.toString().toLowerCase().includes(searchSoPhong)) : true;

      if (matchesMadatphong && matchesTenKhachHang && matchesSoPhong) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="hidden">${booking._id}</td>
          <td>${customer ? customer.username : "Không tìm thấy tên khách hàng"}</td>
          <td>${customer ? customer.cccd : "Không tìm thấy tên khách hàng"}</td>
          <td>${room ? room.soPhong : "Không có số phòng"}</td>
          <td>${booking.orderTime}</td>
          <td>${booking.timeGet}</td>
          <td>${booking.timeCheckout}</td>
          <td>${statusMapping[booking.status]}</td>
        `;

        row.onclick = async function () {
          document.getElementById("mdp").value = booking._id;
          document.getElementById("uid").value = booking.Uid;
          document.getElementById("phong1").value = booking.IdPhong;
          document.getElementById("thoiGianDat").value = booking.orderTime;
          document.getElementById("thoiGianNhan").value = booking.timeGet;
          document.getElementById("thoiGianTra").value = booking.timeCheckout;
          document.getElementById("ghiChu").value = booking.note;
          document.getElementById("trangThai").value = booking.status;
          document.getElementById("tongTien").value = booking.total;
          document.getElementById("dichVu").value = booking.IdDichVu || "N/A";

          const roomDetails = await fetchRoomById(booking.IdPhong);
          document.getElementById("soPhong").value = roomDetails ? roomDetails.soPhong : "Phòng không tồn tại";

          const serviceDetails = await fetchServiceById(booking.IdDichVu);
          document.getElementById("tenDichVu").value = serviceDetails ? serviceDetails.tenDichVu : "Dịch vụ không tồn tại";
        };

        customerList.appendChild(row);
      }
    }
  } catch (error) {
    console.error("Error during search:", error);
  }
});




function populateFormWithOrderData(lichsu) {
  document.getElementById("mdp").value = lichsu._id;
  document.getElementById("uid").value = lichsu.Uid;
  document.getElementById("phong1").value = lichsu.IdPhong;
  document.getElementById("thoiGianDat").value = lichsu.orderTime;
  document.getElementById("thoiGianNhan").value = lichsu.timeGet;
  document.getElementById("thoiGianTra").value = lichsu.timeCheckout;
  document.getElementById("ghiChu").value = lichsu.note;
  document.getElementById("trangThai").value = lichsu.status;
  document.getElementById("tongTien").value = lichsu.total;

  const service = services.find(s => s._id === lichsu.IdDichVu);
  if (service) {
    document.getElementById("tenDichVu").value = service.tenDichVu;
    document.getElementById("dichVu").value = service._id;
  } else {
    document.getElementById("tenDichVu").value = "Dịch vụ không tồn tại";
    document.getElementById("dichVu").value = "";
  }
}
function confirmLogout(event) {
  event.preventDefault();
  const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?"); 

  if (userConfirmed) {
      window.location.href = "../../welcome.html"; 
  }
}