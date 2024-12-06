const apiUrl = `${base_url}orderroom`;
const apidatphongUrl = `${base_url}orderroombyidhotel`;
const serviceApiUrl = `${base_url}dichvu`;
const apiKhachHang = `${base_url}accounta`;
const apirooma = `${base_url}roomsa`;
const apiroom = `${base_url}rooms`;

const hotelId = localStorage.getItem('IdKhachSan');
let services = {};

window.onload = async function () {
    let itemInfo = JSON.parse(localStorage.getItem('itemInfo'));
    if (itemInfo) {
        document.getElementById('mdp').value = itemInfo.mdp
        document.getElementById("uid").value = itemInfo.Uid
        document.getElementById('TenKhachHang').value = itemInfo.TenKhachHang;
        document.getElementById('cccd').value = itemInfo.cccd;
        document.getElementById('sdt').value = itemInfo.sdt;
        document.getElementById('phong1').value = itemInfo.phongID;
        document.getElementById('email').value = itemInfo.email;
        document.getElementById('thoiGianDat').value = itemInfo.thoiGianDat;
        document.getElementById('thoiGianNhan').value = itemInfo.thoiGianNhan;
        document.getElementById('thoiGianTra').value = itemInfo.thoiGianTra;
        document.getElementById('ghiChu').value = itemInfo.ghiChu;
        document.getElementById('trangThai').value = itemInfo.trangThai;
        document.getElementById('tongTien').value = itemInfo.tongTien;
        const room = await fetchRoomById(itemInfo.phongID);
        if (room) {
            document.getElementById("soPhong").value = room.soPhong;
        } else {
            document.getElementById("soPhong").value = "Phòng không tồn tại";
        }

        const service = await fetchServiceById(itemInfo.dichVuID);
        if (service) {
            document.getElementById("tenDichVu").value = service.tenDichVu;
        } else {
            document.getElementById("tenDichVu").value = "Dịch vụ không tồn tại";
        }
    }
}
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
function isNotEmpty(value, fieldName) {
    if (!value) {
      alert(`${fieldName} không được để trống`);
      return false;
    }
    return true;
  }
async function editderroom() {
    const mdpValue = document.getElementById("mdp").value;
  
    if (mdpValue=="") {
      alert("Vui lòng chọn đơn đặt phòng để cập nhật.");
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
      window.location.href = 'quanlydatphongnv.html'; 
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }
