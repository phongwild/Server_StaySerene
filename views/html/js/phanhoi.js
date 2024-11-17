const apiphanhoiUrl = "http://192.168.108.95:3000/api/phanhoibyidhotel";
const apikhachhang = "http://192.168.108.95:3000/api/account";
const hotelId = localStorage.getItem('IdKhachSan');

let customers = {};
let phanhois = [];

async function fetchCustomers() {
    try {
        const response = await fetch(apikhachhang);
        const customerData = await response.json();
        customers = customerData.reduce((acc, customer) => {
            acc[customer._id] = customer.username;
            return acc;
        }, {});
    } catch (error) {
        console.error('Lỗi khi fetch khách hàng:', error);
    }
}

async function fetchPhanHois() {
    try {
        const response = await fetch(`${apiphanhoiUrl}/${hotelId}`);
        phanhois = await response.json();
        console.log(phanhois);
        displayPhanHois(phanhois);
    } catch (error) {
        console.error('Lỗi khi fetch phanhois:', error);
    }
}

function displayPhanHois(feedbackList) {
    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = "";

    feedbackList.forEach((phanhoi) => {
        const row = document.createElement("tr");
        const Uid = phanhoi.Uid || "N/A";
        const noiDung = phanhoi.noiDung || "N/A";
        const thoiGian = phanhoi.thoiGian || "N/A";
        const tenKhachHang = customers[Uid] || "Người dùng không tồn tại .";

        row.innerHTML = `
            <td>${tenKhachHang}</td>
            <td>${noiDung}</td>
            <td>${thoiGian}</td>
        `;

        customerList.appendChild(row);
    });
}


function normalizeString(str) {
    if (!str) return "";
    const unaccentedStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return unaccentedStr.replace(/\s+/g, '').toLowerCase();
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options);
}

window.onload = async function() {
    await fetchCustomers();
    await fetchPhanHois();
};

function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (userConfirmed) {
        window.location.href = "../../welcome.html";
    }
}
