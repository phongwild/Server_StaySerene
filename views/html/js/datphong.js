function confirmLogout(event) {
    event.preventDefault(); // Prevent the default link action
    const userConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất?"); // Show confirmation dialog

    if (userConfirmed) {
        window.location.href = "../../welcome.html"; // Redirect to the logout page if confirmed
    }
}