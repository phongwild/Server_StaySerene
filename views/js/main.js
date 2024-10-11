// Define button variables
const buttons = {
    phong: document.getElementById('phong'),
    khachhang: document.getElementById('khachhang'),
    lichsu: document.getElementById('lichsu'),
    dichvu: document.getElementById('dichvu'),
    khachsan: document.getElementById('khachsan'),
    loaiphong: document.getElementById('loaiphong'),
    nhanvien: document.getElementById('nhanvien'),
    phanhoi: document.getElementById('phanhoi'),
    chamsoc: document.getElementById('chamsoc'),
    thongke: document.getElementById('thongke')
};

// Function to load content
function loadContent(url) {
    const mainContent = document.getElementById('main-content');
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            mainContent.innerHTML = data; 
        })
        .catch(error => {
            console.error('Error loading content:', error);
            mainContent.innerHTML = `<p>Không thể tải nội dung. Lỗi: ${error.message}</p>`;
        });
}

function resetButtonColors() {
    for (const key in buttons) {
        buttons[key].style.backgroundColor = '#34495e'; 
    }
}

function handleButtonClick(event, buttonId, contentUrl) {
    event.preventDefault(); 
    resetButtonColors(); 
    buttons[buttonId].style.backgroundColor = '#1abc9c'; 
    loadContent(contentUrl); 
}

buttons.khachhang.addEventListener('click', function(event) {
    handleButtonClick(event, 'khachhang', 'management/khachhang.html');
});

buttons.nhanvien.addEventListener('click', function(event) {
    handleButtonClick(event, 'nhanvien', 'management/nhanvien.html');
});

buttons.khachsan.addEventListener('click', function(event) {
    handleButtonClick(event, 'khachsan', 'management/khachsan.html');
});

buttons.loaiphong.addEventListener('click', function(event) {
    handleButtonClick(event, 'loaiphong', 'management/loaiphong.html');
});

buttons.phong.addEventListener('click', function(event) {
    handleButtonClick(event, 'phong', 'management/phong.html');
});

buttons.dichvu.addEventListener('click', function(event) {
    handleButtonClick(event, 'dichvu', 'management/dichvu.html');
});

buttons.lichsu.addEventListener('click', function(event) {
    handleButtonClick(event, 'lichsu', 'other/lichsu.html');
});

buttons.phanhoi.addEventListener('click', function(event) {
    handleButtonClick(event, 'phanhoi', 'other/phanhoi.html');
});

buttons.chamsoc.addEventListener('click', function(event) {
    handleButtonClick(event, 'chamsoc', 'other/chamsoc.html');
});

buttons.thongke.addEventListener('click', function(event) {
    handleButtonClick(event, 'thongke', 'other/thongke.html');
});


