
import https from 'https';

const loginData = JSON.stringify({
    email: 'admin@eventflow.com',
    password: 'password123'
});

const options = {
    hostname: 'prolance01.onrender.com',
    port: 443,
    path: '/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log(`Login Status: ${res.statusCode}`);
        console.log('Response:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(loginData);
req.end();
