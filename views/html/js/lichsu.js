const apiUrl = "http://192.168.1.4:3000/api/orderroom";


const statusMapping = {
  0: "Đã đặt cọc",  
  1: "Đã trả phòng",    
  2: "Đã hủy"      
};

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
      const thoiGianDatPhong = formatDateTime(lichsu.orderTime); 
      const thoiGianNhan = formatDateTime(lichsu.timeGet);
      const thoiGianTra = formatDateTime(lichsu.timeCheckout); 
      const ghiChu = lichsu.note;                 
      const trangThaiValue = lichsu.status; // Get the raw status value
      const dichVuID = lichsu.IdDichVu || "N/A";   
      const tongTien = lichsu.total ? formatCurrency(lichsu.total) : "N/A"; 

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
          document.getElementById("dichVu").value = dichVuID; 
          document.getElementById("trangThai").value = trangThaiValue; // Set the raw value directly
          document.getElementById("tongTien").value = tongTien; 
      };

      customerList.appendChild(row); 
  });
}


async function editderroom() {
  const mdpValue = document.getElementById("mdp").value;

  if (!mdpValue) {
      alert("Vui lòng chọn đặt phòng để cập nhật.");
      return; 
  }

  const updatedOrder = {
      Uid: document.getElementById("uid").value,                  
      IdPhong: document.getElementById("phong1").value,          
      IdDichVu: document.getElementById("dichVu").value || null, 
      orderTime: formatToISO(document.getElementById("thoiGianDat").value),   
      timeGet: formatToISO(document.getElementById("thoiGianNhan").value),     
      timeCheckout: formatToISO(document.getElementById("thoiGianTra").value),  
      note: document.getElementById("ghiChu").value,               
      status: document.getElementById("trangThai").value || 0,    
      total: parseFloat(document.getElementById("tongTien").value), 
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
      
      // Refresh the list of orders
      fetchLichSus(); 

      // Reset the form after updating
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


