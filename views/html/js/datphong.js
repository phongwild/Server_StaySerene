function confirmLogout(event) {
    event.preventDefault(); 
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?"); 
    if (userConfirmed) {
        window.location.href = "../../welcome.html"; 
    }
}