const apiUrl = "http://192.168.1.37:3000/api/lichsu";

// Lấy danh sách lịch sử đặt phòng từ API
async function fetchLichSus() {
  try {
    const response = await fetch(apiUrl);
    const lichsus = await response.json();
    displayLichSus(lichsus); // Hiển thị lịch sử đặt phòng lên bảng
  } catch (error) {
    console.error("Lỗi khi fetch lichsus:", error);
  }
}

// Hiển thị danh sách lịch sử đặt phòng lên bảng
function displayLichSus(lichsus) {
  const customerList = document.getElementById("customer-list");
  customerList.innerHTML = ""; // Xóa nội dung cũ (nếu có)

  lichsus.forEach((lichsu) => {
    const row = document.createElement("tr");

    // Lấy giá trị từ API, kiểm tra nếu thuộc tính không có (null hoặc undefined)
    const Uid = lichsu.Uid || "N/A"; // Mã phòng
    const dichVuID = lichsu.dichVuID || "N/A";
    const phongID = lichsu.phongID || "N/A";
    const thoiGianDatPhong = formatDate(lichsu.thoiGianDatPhong) || "N/A";
    const thoiGianNhan = formatDate(lichsu.thoiGianNhan) || "N/A";
    const thoiGianTra = formatDate(lichsu.thoiGianTra) || "N/A";
    const ghiChu = lichsu.ghiChu || "N/A";
    const trangThai = lichsu.trangThai || "N/A";
    const anhDatPhong = lichsu.anhDatPhong || "N/A";
    const tongTien = lichsu.tongTien ? formatCurrency(lichsu.tongTien) : "N/A"; // Tổng tiền

    // Tạo hàng mới và điền dữ liệu
    row.innerHTML = `
            <td>${Uid}</td>
            <td>${dichVuID}</td>
            <td>${phongID}</td>
            <td>${thoiGianDatPhong}</td>
            <td>${thoiGianNhan}</td>
            <td>${thoiGianTra}</td>
            <td>${ghiChu}</td>
            <td>${tongTien}</td>
            <td>${trangThai}</td>
            <td><img src="${anhDatPhong}" alt="${anhDatPhong}" style="width:100px;height:auto;"></td>

        `;

    // Gán sự kiện onclick để hiển thị thông tin vào các input
    row.onclick = function () {
      document.getElementById("dichVu").value = dichVuID;
      document.getElementById("uid").value = Uid;
      document.getElementById("phong1").value = phongID;
      document.getElementById("ghiChu").value = ghiChu;
      document.getElementById("trangThai").value = trangThai;
      document.getElementById("tongTien").value = tongTien;
      document.getElementById("hinhAnhDatPhong").src = anhDatPhong;
      const DateDat = new Date(lichsu.thoiGianDatPhong);
      DateDat.setDate(DateDat.getDate() + 1); // Cộng thêm 1 ngày
      document.getElementById("thoiGianDat").value =
        DateDat.toISOString().split("T")[0];

      const DateNhan = new Date(lichsu.thoiGianNhan);
      DateNhan.setDate(DateNhan.getDate() + 1); // Cộng thêm 1 ngày
      document.getElementById("thoiGianNhan").value =
        DateNhan.toISOString().split("T")[0];
        
      const DateTra = new Date(lichsu.thoiGianTra);
      DateTra.setDate(DateTra.getDate() + 1); // Cộng thêm 1 ngày
      document.getElementById("thoiGianTra").value =
        DateTra.toISOString().split("T")[0];
      // document.getElementById("tongTien").innerText = tongTien;
    };

    customerList.appendChild(row); // Thêm hàng mới vào bảng
  });
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

      // Hiển thị hoặc ẩn hàng tùy vào kết quả tìm kiếm theo dịch vụ
      row.style.display = serviceText.includes(searchInput) ? "" : "none";
    }
  });
}

// Hàm định dạng ngày (nếu cần thiết)
function formatDate(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", options); // Định dạng ngày theo kiểu Việt Nam
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
