import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [keyword, setKeyword] = useState('');
    const [urls, setUrls] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);

    const handleKeywordSubmit = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/keywords/${keyword}`);
            setUrls(response.data);
            setError('');
        } catch (error) {
            setError('Error fetching URLs');
            setUrls([]);
        }
    };

    const handleDownloadContent = (url) => {
        setLoading(true);
        setContent('');
        setError('');
        setProgress(0);

        const socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => {
            socket.send(JSON.stringify({ url }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.progress !== undefined) {
                setProgress(message.progress);
            }

            if (message.content) {
                setContent(message.content);
                localStorage.setItem('content', message.content);
                openContentInNewTab(message.content);
                setLoading(false);
            }

            if (message.error) {
                setError(message.error);
                setLoading(false);
            }
        };

        socket.onerror = () => {
            setError('Error downloading content');
            setLoading(false);
        };
    };

    const openContentInNewTab = (content) => {
        const newWindow = window.open();
        newWindow.document.write(content);
        newWindow.document.close();
    };

    const openOfflineContent = () => {
        const offlineContent = localStorage.getItem('content');
        if (offlineContent) {
            openContentInNewTab(offlineContent);
        } else {
            alert('No offline content available');
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="Enter keyword" 
            />
            <button onClick={handleKeywordSubmit}>Search</button>

            {urls.length > 0 && (
                <div>
                    <h3>URLs:</h3>
                    <ul>
                        {urls.map((url, index) => (
                            <li key={index}>
                                <button onClick={() => handleDownloadContent(url)}>
                                    {url}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {loading && <p>Loading... Progress: {progress}%</p>}
            {error && <p>{error}</p>}
            {content && (
                <div>
                    <h3>Content:</h3>
                    <button onClick={() => openContentInNewTab(content)}>Open in New Tab</button>
                </div>
            )}

            <button onClick={openOfflineContent}>Open Offline Content</button>
        </div>
    );
}

export default App;
