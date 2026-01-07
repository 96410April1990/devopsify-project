const express = require('express');
const app = express();
const PORT = 4000;

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));