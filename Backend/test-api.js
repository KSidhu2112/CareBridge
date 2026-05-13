fetch('http://localhost:5000/api/user/send-otp', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: 'test@example.com' })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
