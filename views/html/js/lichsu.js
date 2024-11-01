const apiUrl = "http://192.168.1.2:3000/api/orderroom";
const serviceApiUrl = "http://192.168.1.2:3000/api/dichvu";
let services = {};
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
    services = await fetchAllServices();  // Update to set the global services variable
    console.log("Available services:", services); // Kiểm tra dịch vụ có sẵn

    const select = document.getElementById('tenDichVu');
    select.innerHTML = '<option value="">Chọn dịch vụ</option>';

    if (services.length === 0) {
      console.log("No services found");
    }

    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service._id; // Assuming each service has an _id field
      option.textContent = service.tenDichVu; // Assuming the service has a name field like tenDichVu
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating services:', error);
  }
}



const statusMapping = {
  0: "Đã đặt cọc",
  1: "Đã trả phòng",
  2: "Đã hủy"
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
    const response = await fetch(apiUrl);
    const lichsus = await response.json();
    displayLichSus(lichsus);
  } catch (error) {
    console.error("Lỗi khi fetch lichsus:", error);
  }
}


function displayLichSus(lichsus) {
  const customerList = document.getElementById("customer-list");
  customerList.innerHTML = "";

  lichsus.forEach((lichsu) => {
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

    row.innerHTML = `
      <td>${mdp}</td>
      <td>${Uid}</td>
      <td>${phongID}</td>
      <td>${thoiGianDatPhong}</td>
      <td>${thoiGianNhan}</td>
      <td>${thoiGianTra}</td>
      <td>${statusMapping[trangThaiValue]}</td>
    `;

    // Gán sự kiện onclick để hiển thị thông tin vào các input
    row.onclick = function () {
      console.log("Row clicked:", mdp);
      document.getElementById("mdp").value = mdp;
      document.getElementById("uid").value = Uid;
      document.getElementById("phong1").value = phongID;
      document.getElementById("thoiGianDat").value = thoiGianDatPhong;
      document.getElementById("thoiGianNhan").value = thoiGianNhan;
      document.getElementById("thoiGianTra").value = thoiGianTra;
      document.getElementById("ghiChu").value = ghiChu;
      document.getElementById("trangThai").value = trangThaiValue;
      document.getElementById("tongTien").value = tongTien;
      document.getElementById("dichVu").value = dichVuID;

      if (dichVuID) {
        // Find the service by ID
        const service = services.find(s => s._id === dichVuID);
        if (service) {

          document.getElementById("tenDichVu").value = service.tenDichVu;
          // Update the dropdown selection to match the service ID
          const select = document.getElementById('tenDichVu');
          select.value = service._id; // Set the select element to the correct service ID
        } else {
          document.getElementById("tenDichVu").value = "Dịch vụ không tồn tại";
          document.getElementById("dichVu").value = dichVuID;
        }
      } else {
        document.getElementById("tenDichVu").value = "Dịch vụ không tồn tại";
        document.getElementById("dichVu").value = dichVuID;
      }
    };


    customerList.appendChild(row);
  });
}




async function addOrderroom() {
  const mdpValue = document.getElementById("mdp").value;

  if (mdpValue) {
    alert("Không thể thêm đặt phòng. Mã đặt đã tồn tại.");
    document.getElementById("customer-form").reset();
    return;
  }

  const uid = document.getElementById("uid").value;
  const phong = document.getElementById("phong1").value; // This should reference the _id from phong.json
  const dichVu = document.getElementById("dichVu").value;
  const thoiGianDat = document.getElementById("thoiGianDat").value; // Added this variable
  const thoiGianNhan = document.getElementById("thoiGianNhan").value;
  const thoiGianTra = document.getElementById("thoiGianTra").value;
  const trangThai = document.getElementById("trangThai").value;
  const tongTien = document.getElementById("tongTien").value;

  // Check for empty fields
  if (
    !isNotEmpty(uid, "mã khách hàng ") ||
    !isNotEmpty(thoiGianDat, "Thời gian đặt") ||
    !isNotEmpty(thoiGianNhan, "Thời gian nhận") ||
    !isNotEmpty(thoiGianTra, "Thời gian trả") ||
    !isNotEmpty(trangThai, "Trạng thái")
  ) {
    return; // Stop if any field is empty
  }

  if (
    !validateDateTimeFormat(thoiGianDat) ||
    !validateDateTimeFormat(thoiGianNhan) ||
    !validateDateTimeFormat(thoiGianTra)
  ) {
    alert("Thời gian phải có định dạng hh:mm:ss dd/MM/yyyy");
    return;
  }

  const newOrder = {
    Uid: uid,
    IdPhong: phong, // Ensure this is set to the room's _id
    IdDichVu: dichVu || null,
    orderTime: thoiGianDat,
    timeGet: thoiGianNhan,
    timeCheckout: thoiGianTra,
    note: document.getElementById("ghiChu").value,
    status: trangThai || 0,
    total: tongTien,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log("Order added successfully:", result);
    fetchLichSus();
    document.getElementById("customer-form").reset();
  } catch (error) {
    console.error("Error adding order:", error);
  }
}

async function editderroom() {
  const mdpValue = document.getElementById("mdp").value;

  if (!mdpValue) {
    alert("Vui lòng chọn đặt phòng để cập nhật.");
    return;
  }

  const uid = document.getElementById("uid").value;
  const phong = document.getElementById("phong1").value; // Ensure this is set to the room's _id
  const dichVu = document.getElementById("dichVu").value;
  const thoiGianDat = document.getElementById("thoiGianDat").value; // Added this variable
  const thoiGianNhan = document.getElementById("thoiGianNhan").value;
  const thoiGianTra = document.getElementById("thoiGianTra").value;
  const trangThai = document.getElementById("trangThai").value;
  const tongTien = document.getElementById("tongTien").value;

  // Check for empty fields
  if (
    !isNotEmpty(uid, "mã khách hàng ") ||
    !isNotEmpty(thoiGianDat, "Thời gian đặt") ||
    !isNotEmpty(thoiGianNhan, "Thời gian nhận") ||
    !isNotEmpty(thoiGianTra, "Thời gian trả") ||
    !isNotEmpty(trangThai, "Trạng thái")
  ) {
    return; // Stop if any field is empty
  }

  if (
    !validateDateTimeFormat(thoiGianDat) ||
    !validateDateTimeFormat(thoiGianNhan) ||
    !validateDateTimeFormat(thoiGianTra)
  ) {
    alert("Thời gian phải có định dạng hh:mm:ss dd/MM/yyyy");
    return;
  }

  const updatedOrder = {
    Uid: uid,
    IdPhong: phong, // Ensure this is set to the room's _id
    IdDichVu: dichVu || null,
    orderTime: thoiGianDat,
    timeGet: thoiGianNhan,
    timeCheckout: thoiGianTra,
    note: document.getElementById("ghiChu").value,
    status: trangThai || 0,
    total: tongTien,
  };

  try {
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


// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Hàm tìm kiếm theo dịch vụ
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
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}




// Hàm định dạng tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Gọi hàm lấy dữ liệu khi trang được tải
window.onload = function () {
  fetchLichSus();
};




document.getElementById('tenDichVu').addEventListener('change', function () {
  const selectedOption = this.options[this.selectedIndex];
  const selectedServiceId = selectedOption.value;

  // Update your input or perform other actions based on the selected service
  console.log('Selected Service ID:', selectedServiceId);
});
// Add this event listener to synchronize tenDichVu with dichVu input
document.getElementById('tenDichVu').addEventListener('change', async function () {
  const selectedOption = this.options[this.selectedIndex];
  const selectedServiceId = selectedOption.value;

  // Fetch the service details using the selected ID
  const service = await fetchServiceById(selectedServiceId);
  if (service) {
    document.getElementById('dichVu').value = service._id; // Update the ID input
    console.log('Selected Service:', service.tenDichVu); // Log the service name
  } else {
    document.getElementById('dichVu').value = ""; // Clear the ID input if service not found
    console.log('Service not found');
  }
});

// Add this event listener to synchronize dichVu input with tenDichVu dropdown
document.getElementById('dichVu').addEventListener('input', function () {
  const inputServiceId = this.value;

  // Find the corresponding option in the tenDichVu dropdown
  const select = document.getElementById('tenDichVu');
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === inputServiceId) {
      select.selectedIndex = i; // Set the selected index to match
      console.log('Selected Service ID:', inputServiceId);
      break;
    }
  }
});
document.addEventListener('DOMContentLoaded', () => {
  populateServices(); // Đảm bảo hàm này được gọi
});

document.getElementById('searchBtn').addEventListener('click', async function () {
  const searchMadatphong = document.getElementById('search-madatphong').value.toLowerCase();
  const searchMakhachhang = document.getElementById('search-makhachhang').value.toLowerCase();
  const searchMaphong = document.getElementById('search-maphong').value.toLowerCase();

  // Fetch all lichsus (orders) data to search through
  try {
    const response = await fetch(apiUrl);
    const lichsus = await response.json();

    // Clear previous results
    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = "";

    // Filter results based on search criteria
    const filteredLichsus = lichsus.filter(lichsu => {
      const madatphong = lichsu._id.toLowerCase(); // Mã Đặt Phòng
      const makhachhang = lichsu.Uid.toLowerCase(); // Mã Khách Hàng
      const maphong = lichsu.IdPhong.toLowerCase(); // Mã Phòng

      // Check if each search condition is met
      const matchesMadatphong = searchMadatphong === '' || madatphong.includes(searchMadatphong);
      const matchesMakhachhang = searchMakhachhang === '' || makhachhang.includes(searchMakhachhang);
      const matchesMaphong = searchMaphong === '' || maphong.includes(searchMaphong);

      return matchesMadatphong && matchesMakhachhang && matchesMaphong;
    });

    // Display filtered results
    filteredLichsus.forEach((lichsu) => {
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

    row.innerHTML = `
      <td>${mdp}</td>
      <td>${Uid}</td>
      <td>${phongID}</td>
      <td>${thoiGianDatPhong}</td>
      <td>${thoiGianNhan}</td>
      <td>${thoiGianTra}</td>
      <td>${statusMapping[trangThaiValue]}</td>
    `;

    // Event listener for row click
    row.onclick = async function () {
      console.log("Row clicked:", mdp);
      document.getElementById("mdp").value = mdp;
      document.getElementById("uid").value = Uid;
      document.getElementById("phong1").value = phongID;
      document.getElementById("thoiGianDat").value = thoiGianDatPhong;
      document.getElementById("thoiGianNhan").value = thoiGianNhan;
      document.getElementById("thoiGianTra").value = thoiGianTra;
      document.getElementById("ghiChu").value = ghiChu;
      document.getElementById("trangThai").value = trangThaiValue;
      document.getElementById("tongTien").value = tongTien;
      document.getElementById("dichVu").value = dichVuID;

      // Fetch room details and populate soPhong
      const room = await fetchRoomById(phongID);
      if (room) {
        document.getElementById("soPhong").value = room.soPhong; // Assuming room object contains soPhong
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
    });

    if (filteredLichsus.length === 0) {
      const noResultsRow = document.createElement("tr");
      noResultsRow.innerHTML = "<td colspan='7'>Không tìm thấy kết quả.</td>";
      customerList.appendChild(noResultsRow);
    }

  } catch (error) {
    console.error("Error fetching orders for search:", error);
  }
});
