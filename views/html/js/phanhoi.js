const apiphanhoiUrl = "http://192.168.1.2:3000/api/phanhoibyidhotel";
const apikhachhang = "http://192.168.1.2:3000/api/account";
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
        const maPhanHoi = phanhoi._id || "N/A";
        const IdDatPhong = phanhoi.IdDatPhong || "N/A";
        const Uid = phanhoi.Uid || "N/A";
        const noiDung = phanhoi.noiDung || "N/A";
        const thoiGian = formatDate(phanhoi.thoiGian) || "N/A";
        const tenKhachHang = customers[Uid] || "N/A";

        row.innerHTML = `
            <td>${maPhanHoi}</td>
            <td>${IdDatPhong}</td>
            <td>${Uid}</td>
            <td>${tenKhachHang}</td>
            <td>${noiDung}</td>
            <td>${thoiGian}</td>
        `;

        customerList.appendChild(row);
    });
}

function searchPhanHois() {
    const searchMaPhanHoi = normalizeString(document.getElementById("search-maphanhoi").value);
    const searchMaPhong = normalizeString(document.getElementById("search-maphong").value);
    const searchMaKhachHang = normalizeString(document.getElementById("search-makhachhang").value);
    const searchTenKhachHang = normalizeString(document.getElementById("search-tenkhachhang").value);

    const filteredPhanHois = phanhois.filter(phanhoi => {
        return (normalizeString(phanhoi._id).includes(searchMaPhanHoi) || searchMaPhanHoi === "") &&
               (normalizeString(phanhoi.IdDatPhong).includes(searchMaPhong) || searchMaPhong === "") &&
               (normalizeString(phanhoi.Uid).includes(searchMaKhachHang) || searchMaKhachHang === "") &&
               (normalizeString(customers[phanhoi.Uid] || "").includes(searchTenKhachHang) || searchTenKhachHang === "");
    });

    displayPhanHois(filteredPhanHois); 
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
    document.getElementById("search-button").addEventListener("click", searchPhanHois);
};

function confirmLogout(event) {
    event.preventDefault();
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (userConfirmed) {
        window.location.href = "../../welcome.html";
    }
}
