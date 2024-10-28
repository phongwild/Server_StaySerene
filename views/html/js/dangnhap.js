// API URL cho đăng nhập
const apiLoginUrl = 'http://localhost:3000/api/login';

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn chặn form submit theo cách thông thường

    // Lấy dữ liệu từ các trường email và password
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(apiLoginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const result = await response.json();
            alert('Đăng nhập thành công!');
            // Chuyển hướng người dùng sau khi đăng nhập thành công
            window.location.href = '../htmlnhanvien/chamsocnv.html'; // Chuyển đến trang khách hàng hoặc trang chính
        } else {
            alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
});
