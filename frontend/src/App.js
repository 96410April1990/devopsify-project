import React, { useEffect, useState } from 'react';

function App() {
    const [message, setMessage ] = useState('');

    useEffect(() => {
        fetch('/api')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(() => setMessage('Backend not available'));
    }, []);

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial' }}>
            <h1>DevOpsify Frontend</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;