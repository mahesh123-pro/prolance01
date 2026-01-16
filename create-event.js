
import https from 'https';

const loginData = JSON.stringify({
    email: 'admin@eventflow.com',
    password: 'password123'
});

const loginOptions = {
    hostname: 'prolance01.onrender.com',
    port: 443,
    path: '/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

const createEvent = (token) => {
    const eventData = JSON.stringify({
        title: "Future of AI Conference 2026",
        description: "Join us for an immersive deep dive into the latest advancements in Artificial Intelligence. Featuring keynote speakers from Google, OpenAI, and more.",
        date: "April 15, 2026",
        time: "09:00 AM",
        location: "Tech Hub Convention Center, San Francisco",
        type: "Conference", // Workshop, Seminar, etc.
        price: 299,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
        maxSeats: 500,
        startDate: new Date('2026-04-15').toISOString()
    });

    const eventOptions = {
        hostname: 'prolance01.onrender.com',
        port: 443,
        path: '/events',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': eventData.length,
            'Authorization': `Bearer ${token}`
        }
    };

    const req = https.request(eventOptions, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            console.log(`Create Event Status: ${res.statusCode}`);
            console.log('Response:', responseBody);
            if (res.statusCode === 201) {
                console.log('✅ Event successfully created!');
            }
        });
    });

    req.on('error', (error) => {
        console.error('Error creating event:', error);
    });

    req.write(eventData);
    req.end();
};

const req = https.request(loginOptions, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const data = JSON.parse(responseBody);
            console.log('✅ Logged in successfully. Creating event...');
            createEvent(data.token);
        } else {
            console.log('❌ Login failed.');
            console.log(responseBody);
        }
    });
});

req.on('error', (error) => {
    console.error('Login Error:', error);
});

req.write(loginData);
req.end();
