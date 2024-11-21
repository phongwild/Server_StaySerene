async function login() {
    event.preventDefault();

    const email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://192.168.1.4:3000/api/nhanvien');
        const employees = await response.json();
        const employee = employees.find(emp => emp.email === email && emp.password === password);

        if (employee) {
            localStorage.setItem('IdKhachSan', employee.IdKhachSan);
            window.location.href = '../htmlnhanvien/phanhoinv.html';
        } else {
            alert('Email hoặc mật khẩu không đúng.');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }

    return false;
}
