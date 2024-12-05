async function login() {
    event.preventDefault();

    const email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;

    try {
<<<<<<< HEAD
        const response = await fetch('http://192.168.1.7:3000/api/nhanvien');
=======
        const response = await fetch('http://10.62.4.33:3000/api/nhanvien');
>>>>>>> 0ef55029b447dc3f664d7b39d9dbe89048bc4380
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
