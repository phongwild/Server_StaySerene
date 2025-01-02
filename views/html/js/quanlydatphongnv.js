const apiUrl = `${base_url}orderroom`;
const apidatphongUrl = `${base_url}orderroombyidhotel`;
const serviceApiUrl = `${base_url}dichvu`;
const apiKhachHang = `${base_url}accounta`;
const apirooma = `${base_url}roomsa`;
const hotelId = localStorage.getItem('IdKhachSan');

// Caching dữ liệu để tối ưu
const cache = {
  rooms: new Map(),
  customers: new Map(),
  services: new Map()
};

// Hàm dùng chung để fetch dữ liệu và cache
async function fetchWithCache(url, cacheMap, key) {
  if (cacheMap.has(key)) {
    return cacheMap.get(key);
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Lỗi khi gọi API: ${response.status}`);
    }
    const data = await response.json();
    cacheMap.set(key, data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
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
// Hàm fetch dữ liệu với cache
async function fetchRoomById(roomId) {
  return fetchWithCache(`${apirooma}/${roomId}`, cache.rooms, roomId);
}

async function fetchCustomerById(customerId) {
  return fetchWithCache(`${apiKhachHang}/${customerId}`, cache.customers, customerId);
}

// Map trạng thái
const statusMapping = {
  0: "Đã đặt cọc",
  1: "Đã nhận phòng",
  2: "Đã trả phòng",
  3: "Đã hủy"
};

// Hàm lấy class CSS cho trạng thái
function getStatusClass(trangThaiValue) {
  switch (trangThaiValue) {
    case 0: return 'status-booked';
    case 1: return 'status-checked-in';
    case 2: return 'status-checked-out';
    case 3: return 'status-cancelled';
    default: return '';
  }
}

// Hàm hiển thị danh sách đặt phòng
async function displayLichSus(lichsus) {
  const customerList = document.getElementById("customer-list");
  customerList.innerHTML = "";

  showProgressBar(); // Hiển thị progress bar khi bắt đầu xử lý

  try {
    // Fetch dữ liệu song song
    const roomPromises = lichsus.map(lichsu => fetchRoomById(lichsu.IdPhong));
    const customerPromises = lichsus.map(lichsu => fetchCustomerById(lichsu.Uid));

    const rooms = await Promise.all(roomPromises);
    const customers = await Promise.all(customerPromises);

    lichsus.forEach((lichsu, index) => {
      const room = rooms[index];
      const customer = customers[index];

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${customer ? customer.username : "Không tìm thấy tên khách hàng"}</td>
        <td>${customer ? customer.cccd : "Không tìm thấy CCCD"}</td>
        <td>${room ? room.soPhong : "Không có số phòng"}</td>
        <td>${lichsu.orderTime}</td>
        <td>${lichsu.timeGet}</td>
        <td>${lichsu.timeCheckout}</td>
        <td class="${getStatusClass(lichsu.status)}">${statusMapping[lichsu.status]}</td>
      `;

      row.onclick = () => handleRowClick(lichsu, customer, room);
      customerList.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi hiển thị danh sách:", error);
  } finally {
    hideProgressBar(); // Ẩn progress bar sau khi hoàn thành
  }
}


// Hàm xử lý khi click vào dòng đặt phòng
function handleRowClick(lichsu, customer, room) {
  const itemInfo = {
    mdp: lichsu._id,
    Uid: lichsu.Uid,
    TenKhachHang: customer.username,
    phongID: lichsu.IdPhong,
    cccd: customer.cccd,
    dichVuID: lichsu.IdDichVu || "N/A",
    sdt: customer.sdt,
    email: customer.email,
    thoiGianDat: lichsu.orderTime,
    thoiGianNhan: lichsu.timeGet,
    thoiGianTra: lichsu.timeCheckout,
    ghiChu: lichsu.note,
    trangThai: lichsu.status,
    tongTien: lichsu.total
  };
  localStorage.setItem('itemInfo', JSON.stringify(itemInfo));
  window.location.href = '../htmlnhanvien/lichsuchitiet.html';
}

// Hàm tìm kiếm
function filterLichSus() {
  const searchMadatphong = document.getElementById('search-madatphong').value.toLowerCase();
  const searchTenKhachHang = document.getElementById('search-tenkhachhang').value.toLowerCase();
  const searchSoPhong = document.getElementById('search-sophong').value.toLowerCase();

  const filteredLichsus = previousLichsus.filter(lichsu => {
    const customer = cache.customers.get(lichsu.Uid);
    const room = cache.rooms.get(lichsu.IdPhong);

    const matchesMadatphong = searchMadatphong ? (customer && customer.username.toLowerCase().includes(searchMadatphong)) : true;
    const matchesTenKhachHang = searchTenKhachHang ? (customer && customer.cccd.toLowerCase().includes(searchTenKhachHang)) : true;
    const matchesSoPhong = searchSoPhong ? (room && room.soPhong.toString().toLowerCase().includes(searchSoPhong)) : true;

    return matchesMadatphong && matchesTenKhachHang && matchesSoPhong;
  });

  displayLichSus(filteredLichsus);
}

// Hàm fetch lịch sử đặt phòng
async function fetchLichSus() {
  try {
    showProgressBar(); // Hiển thị progress bar

    const response = await fetch(`${apidatphongUrl}/${hotelId}`);
    if (!response.ok) throw new Error('Network response was not ok');

    const lichsus = await response.json();
    previousLichsus = lichsus; // Lưu vào bộ nhớ để tìm kiếm
    displayLichSus(lichsus);
  } catch (error) {
    console.error("Lỗi khi fetch lịch sử đặt phòng:", error);
  } finally {
    hideProgressBar(); // Ẩn progress bar sau khi hoàn thành
  }
}


// Xử lý khi nhấn nút tìm kiếm
document.getElementById('searchBtn').addEventListener('click', filterLichSus);

// Chạy khi tải trang
document.addEventListener('DOMContentLoaded', fetchLichSus);
function confirmLogout(event) {
  event.preventDefault();
  const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

  if (userConfirmed) {
    window.location.href = "../../welcome.html";
  }
}