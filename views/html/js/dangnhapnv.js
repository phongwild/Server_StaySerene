async function login() {
    // Ngăn chặn hành vi gửi biểu mẫu mặc định
    event.preventDefault();

    // Lấy thông tin đăng nhập từ biểu mẫu
    const email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;

    try {
        // Gửi yêu cầu GET đến API để lấy danh sách nhân viên
        const response = await fetch('http://192.168.1.2:3000/api/nhanvien');
        const employees = await response.json();

        // Tìm kiếm nhân viên với email và password tương ứng
        const employee = employees.find(emp => emp.email === email && emp.password === password);

        if (employee) {
            // Nếu tìm thấy, lưu mã khách sạn vào localStorage
            localStorage.setItem('makhachsan', employee.makhachsan);

            // Chuyển hướng đến trang home.html
            window.location.href = '../htmlnhanvien/DatPhong.html';
        } else {
            alert('Email hoặc mật khẩu không đúng.');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }

    return false; // Ngăn chặn gửi biểu mẫu
}
