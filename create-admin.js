
import https from 'https';

const data = JSON.stringify({
    email: 'admin@eventflow.com',
    password: 'password123',
    name: 'Admin User'
});

const options = {
    hostname: 'prolance01.onrender.com',
    port: 443,
    path: '/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', responseBody);
        if (res.statusCode === 201 || res.statusCode === 200 || res.statusCode === 400) {
            console.log('\n-----------------------------------');
            console.log('✅ Try logging in with:');
            console.log('Email: admin@eventflow.com');
            console.log('Password: password123');
            console.log('-----------------------------------');
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
