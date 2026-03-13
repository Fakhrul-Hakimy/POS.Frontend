const apiHost = window.location.hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
const API_BASE_URL = `http://${apiHost}:5260`;

async function checkLogin() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/verify`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
            if (result.authenticated) {
                console.log('Verified as:', result.user);
                return;
            }
        }

        console.warn(`Session verify failed with status ${response.status}. Redirecting to login.`);
        window.location.href = '/Pages/login.html';
    } catch (error) {
        console.error('Verify request failed:', error);
        window.location.href = '/Pages/login.html';
    }
}

checkLogin();