const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'superadmin@sjia.com', password: 'unknown' })
});
const text = await res.text();
console.log(res.status, text);
