document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form

    // Lấy thông tin từ form
    const email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;

    // Gửi yêu cầu để lấy danh sách tài khoản admin
    try {
        const response = await fetch('http://192.168.1.2:3000/api/admin');
        if (!response.ok) {
            throw new Error('Không thể lấy danh sách tài khoản');
        }
        const accounts = await response.json();

        // Kiểm tra thông tin đăng nhập
        const adminAccount = accounts.find(account => account.email === email && account.password === password);

        if (adminAccount) {
            // Đăng nhập thành công
            alert('Đăng nhập thành công!');
            window.location.href = '../management/khachhang.html'; 
        } else {
            alert('Thông tin đăng nhập không chính xác.');
        }
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        alert('Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
});
