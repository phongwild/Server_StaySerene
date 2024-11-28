const { GoogleAuth } = require('google-auth-library');

// Hàm lấy Bearer Token
async function getAccessToken() {
    try {
        // Tạo GoogleAuth với key file
        const auth = new GoogleAuth({
            keyFile: 'service-account-key.json', // Đường dẫn tới file JSON đã tải
            scopes: ['https://www.googleapis.com/auth/cloud-platform'], // Scope cho quyền truy cập
        });

        // Lấy Access Token
        const accessToken = await auth.getAccessToken();
        console.log('Bearer Token:', accessToken); // Hiển thị Bearer Token
        return accessToken;
    } catch (error) {
        console.error('Lỗi khi lấy Bearer Token:', error);
    }
}

module.exports = { getAccessToken };