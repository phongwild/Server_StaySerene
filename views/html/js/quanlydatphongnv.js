const apiUrl = `${base_url}orderroom`;
const apidatphongUrl = `${base_url}orderroombyidhotel`;
const serviceApiUrl = `${base_url}dichvu`;
const apiKhachHang = `${base_url}accounta`;
const apirooma = `${base_url}roomsa`;
const apiroom = `${base_url}rooms`;


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
async function fetchOrderRoomByIdHotel(hotelId) {
  try {
    const response = await fetch(`${apiOrderRoomUrl}/${hotelId}`); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const orderRooms = await response.json();
    return orderRooms;  
  } catch (error) {
    console.error('Error fetching order rooms by hotel ID:', error);
    return null;  
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
  fetchOrderRoomByIdHotel(hotelId);

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
    const customerSDT= customer ? customer.sdt : "Không tìm thấy SDT khách hàng";
    const customerEmail= customer ? customer.email : "Không tìm thấy Email khách hàng";

    row.innerHTML = `
      <td class="hidden">${mdp}</td>
      <td>${customerName}</td>
      <td>${customerCCCD}</td> 
      <td>${soPhong}</td>
      <td>${thoiGianDatPhong}</td>
      <td>${thoiGianNhan}</td>
      <td>${thoiGianTra}</td>
      <td style="background-color: ${getStatusColor(trangThaiValue)};color:white">${statusMapping[trangThaiValue]}</td>
    `;

    row.onclick = async function () {
      let itemInfo = {
        mdp:mdp,
        Uid:Uid,
        TenKhachHang: customerName,
        phongID:phongID,
        cccd: customerCCCD,
        dichVuID: dichVuID,
        sdt: customerSDT,
        email: customerEmail,
        thoiGianDat: thoiGianDatPhong,
        thoiGianNhan: thoiGianNhan,
        thoiGianTra: thoiGianTra,
        ghiChu: ghiChu,
        trangThai: trangThaiValue,
        tongTien: tongTien
      };
      localStorage.setItem('itemInfo', JSON.stringify(itemInfo));
      window.location.href = '../htmlnhanvien/lichsuchitiet.html';
    };

    customerList.appendChild(row);
  }
}
function getStatusColor(trangThaiValue) {
  if (trangThaiValue === 1) {
    return 'green';
  } else if (trangThaiValue === 2) {
    return 'blue';
  } else if (trangThaiValue === 0) {
    return '#FFA500';
  } else if (trangThaiValue === 3) {
    return 'red';
  }
  return 'black';  // Default color if value is not 0, 1, 2, or 3
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


window.onload = function () {
  fetchLichSus();
};

document.addEventListener('DOMContentLoaded', () => {
  populateServices(); 
  fetchOrderRoomByIdHotel(hotelId);
});

document.getElementById('searchBtn').addEventListener('click', async function() {
  const searchMadatphong = document.getElementById('search-madatphong').value.toLowerCase();
  const searchTenKhachHang = document.getElementById('search-tenkhachhang').value.toLowerCase();
  const searchSoPhong = document.getElementById('search-sophong').value.toLowerCase();

  try {
    const response = await fetch(`${apidatphongUrl}/${hotelId}`);
    const bookings = await response.json();

    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = "";  // Clear the existing content

    let hasResults = false; // Variable to track if there are any results

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
          <td style="background-color: ${getStatusColor(booking.status)};color:white">${statusMapping[booking.status]}</td>
        `;
        row.onclick = async function () {
          let itemInfo = {
            mdp: booking._id,
            Uid: booking.Uid,
            TenKhachHang: customer.username,
            phongID: booking.IdPhong,
            cccd: customer.cccd,
            dichVuID: booking.IdDichVu || "N/A",
            sdt: customer.sdt,
            email: customer.email,
            thoiGianDat: booking.orderTime,
            thoiGianNhan: booking.timeGet,
            thoiGianTra: booking.timeCheckout,
            ghiChu: booking.note,
            trangThai: booking.status,
            tongTien: booking.total
          };
          localStorage.setItem('itemInfo', JSON.stringify(itemInfo));
          window.location.href = '../htmlnhanvien/lichsuchitiet.html';
        };

        customerList.appendChild(row);
        hasResults = true; 
      }
    }

    if (!hasResults) {
      const noResultsRow = document.createElement("tr");
      noResultsRow.innerHTML = `<td colspan="8" style="text-align: center;">Không tìm thấy đặt phòng</td>`;
      customerList.appendChild(noResultsRow);
    }
  } catch (error) {
    console.error("Error during search:", error);
  }
});

function confirmLogout(event) {
  event.preventDefault();
  const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?"); 

  if (userConfirmed) {
      window.location.href = "../../welcome.html"; 
  }
}

