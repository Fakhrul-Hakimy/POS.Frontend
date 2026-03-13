const apiHost = window.location.hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
const API_BASE_URL = `http://${apiHost}:5260`;

async function doLogin() {

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try{

        const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: 'include' 
        });

        // Backend may return plain text for failures, so parse safely.
        let result = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            result = await response.json();
        } else {
            const text = await response.text();
            result = { message: text };
        }

        if (response.ok && result.success) {
            console.log("Success:", result.message);
            if(result.role === 'User') {
                    window.location.href = '/Pages/Terminal/home.html'; 
            } else if(result.role === 'Admin') {
                    window.location.href = '/Pages/Portal/home.html'; 
            }
            
            
        } else {
            alert(`Login failed (${response.status}): ` + (result.message || 'Invalid credentials'));
        }

    } catch (error) {
        console.error("Network error:", error);
        alert('Could not connect to server. Check backend is running and CORS allows your frontend origin.');
    }

}