document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://192.168.1.4:3000/api/admin');
        if (!response.ok) {
            throw new Error('Không thể lấy danh sách tài khoản');
        }
        const accounts = await response.json();

        const adminAccount = accounts.find(account => account.email === email && account.password === password);

        if (adminAccount) {
            window.location.href = '../management/khachhang.html'; 
        } else {
            alert('Thông tin đăng nhập không chính xác.');
        }
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        alert('Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
});
