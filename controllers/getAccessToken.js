const { GoogleAuth } = require('google-auth-library');
require('dotenv').config(); 

// Hàm lấy Bearer Token
async function getAccessToken() {
    try {
        // Tạo GoogleAuth với thông tin từ biến môi trường
        const auth = new GoogleAuth({
            credentials: {
                type: 'service_account',
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNU0TMK8obTSNQ\niKjKvGQ9/njTMqeIlrZYbbInC9qYu+AIHWSXAu8S0u2rV1FtGieSAuBKInlqIptY\nVtyDU8UUrM+Nq9Ua8yXF4Q8ZJ1wuANbxiovwXqZaEOHy1SzpXLhugmtFPao8+sTb\nn6cqQKhQe7+s20mbg+8PFyylcuexN+PvSdcWp13DbKdMizk1G7ZmCfwwl97z9g1Z\nnhHydz+ZXlw+czlji98fa/cfTdr4ZbN+ZbONTmkUNF8pPrEIc4TYbWmsxh5Q3n1L\n1mpH9M20Oo+p52WDm8p9SErFb/2df83jERfRHVRBZzZ6zxlEl+r26W+pranrehZb\nx4SA/cn3AgMBAAECggEAOVDpzw7YQ8fEOGp1p+ZwGygqpVYqE0RzEXtJtIGoG2Oy\ntcEyv773autLoj1lQw3+htFbuAYom3qen8nbk6NyTAOziqoxemzume7p7o0gu8zL\nM7EHwGlDibfVwxpEB76001B/zlvY5l3gTyihmvdipNjumDu8r/dj5/QBqAvL5pmh\n7QsadOKU9qTLkuMKTpvZQLoclfUVZwS5gak0oD7qGZzBvb4KtjOZ9nw2vgSyPurj\nARMvRrYFV1eA2zYs6RHznO6VRgbYk5H8J2OQN0nOCD+VKD/dN9p/j4VdnmkeiMZY\nm88OMrc3ydk1B7NgKBc5hR8Vd3DCUAHzB/j21Dq8aQKBgQDscSjfJhclW2iKdIKM\n5b0L5bEpBroaKYsuRGFZtyyt2huSJtsBNNNkbnhqGuQ6U4SDapgtZ2B1xcpqFx+u\nd51mbFrhHCjH07LXZ4CvkGHu+RyvsxqcgDACjFPElRzSLUQCiSTTmhoYzsWe23i/\nG786ayD93q/vTCg7jNGq4joRrwKBgQDeTzAb9y6AGs32b9E+NXdPY9vKYb0zif9l\nTRMLLWxi4FJvmsqm4UGnLn8fpH1Ti+gi9Y3AchOlx0o9IEu+rIfxXY03dVVBzRI9\ndj1fYpI+K9viRno0T44vSAPvkXoUKX4DHL+/K4Z7asfzFXEfkfcxhGg2JXDFa+JA\nNG7DAuZGOQKBgQDjLk9xKe4vbMbj0dLmgo/EcKxqmRYTsTsT94v6YfBCE0FOipr/\na7x50VNN0AzepgS7KJ6TcbLTNnqouRMt1aydDxu7FA1zA0vhgIe7KOWQcjdH8rVt\nDhYTPLX4OrX4lJm2PgPudTECCRsE6if4qDZzcR/ADknJiclWfpWutbPJ7QKBgF8+\nchApMKT11vQUKAONCJbc45erlFH2d5NBGD2bsmoSTX8/RD+HFoe35gL6iC85K7V+\nmsKunThTT70sjwccCAoi2JPAE0zjvULT26t4Icu9IrGpHEY5J2OeaQFExJbKyBAx\nSv1ueml58Dx3HUY3VT7DyZoZJF2QwRhc3m9yWJIRAoGAIDkC/Ab9EoHLPLt8gOhB\nrcNgvrtClb0U//FS2q8kHLdpP8GZG7GazE4GMXaEqixWkj8M4nOC8wH5Lpk9hf9R\nRlWqqRYhE36oGsu+TepFW+scEKXfx+5xQx9xcAzmsLn10IMkz/wqM1n79KKgtsoF\nVI60856I1UugexLD/EeFQHc=\n-----END PRIVATE KEY-----\n', // Thay \\n bằng \n
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID, // Không bắt buộc
                auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                token_uri: process.env.FIREBASE_TOKEN_URI,
                auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
            },
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
getAccessToken()
module.exports = { getAccessToken };
