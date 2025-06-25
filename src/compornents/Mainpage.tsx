import { useState, useRef } from 'react';
import { startFetchingData } from '../services/service';

function Mainpage() {
    const [link, setLink] = useState('');
    const [responseData, setResponseData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const eventSourceObj = useRef<EventSource | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);

    const handleStart = () => {
        startFetchingData(link, setResponseData, setError, setErrorCode, setLoading, eventSourceObj);
    };

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                fontFamily: 'Arial, sans-serif',
                boxSizing: 'border-box',
                backgroundColor: '#f0f2f5',
                overflow: 'hidden',
            }}
        >
            {/* Heading start */}
            <h1 style={{ textAlign: 'center' }}>Web Analyzer</h1>


            <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                    type="text"
                    value={link}
                    placeholder="Enter URL"
                    onChange={(e) => setLink(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        width: '400px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                    disabled={loading}
                />

                <button
                    onClick={handleStart}
                    style={{
                        marginLeft: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: loading ? '#6c757d' : '#007bff',
                        color: '#fff',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '90px',
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span
                                style={{
                                    border: '2px solid #f3f3f3',
                                    borderTop: '2px solid #fff',
                                    borderRadius: '50%',
                                    width: '14px',
                                    height: '14px',
                                    marginRight: '8px',
                                    animation: 'spin 1s linear infinite',
                                }}
                            />
                            Fetching...
                        </>
                    ) : (
                        'Start'
                    )}
                </button>
            </div>
            {/* Heading end */}

            {/* response view start*/}
            <div
                style={{
                    width: '1200px',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    background: '#fff',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                {responseData ? (

                    <div
                        style={{
                            textAlign: 'start'
                        }}
                    >

                        <h2>Page Analysis</h2>
                        <p><strong>Version:</strong> {String(responseData.Version)}</p>
                        <p><strong>Title:</strong> {String(responseData.Title)}</p>

                        <h3>Headers</h3>
                        <ul>
                            {typeof responseData.Headers === 'object' && responseData.Headers !== null
                                ? Object.entries(responseData.Headers as Record<string, any>).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key.toUpperCase()}:</strong> {value ?? 'null'}
                                    </li>
                                ))
                                : <li>No headers found</li>}
                        </ul>

                        <h3>Internal Links</h3>
                        <p><strong>Count:</strong> {responseData.InternalLinks?.Count ?? 'null'}</p>
                        <ul>
                            {Array.isArray(responseData.InternalLinks?.Links)
                                ? responseData.InternalLinks.Links.map((link: string, i: number) => (
                                    <li key={`internal-${i}`}>{link}</li>
                                ))
                                : <li>Links: Not found</li>}
                        </ul>

                        <h3>External Links</h3>
                        <p><strong>Count:</strong> {responseData.ExternalLinks?.Count ?? 'null'}</p>
                        <ul>
                            {Array.isArray(responseData.ExternalLinks?.Links)
                                ? responseData.ExternalLinks.Links.map((link: string, i: number) => (
                                    <li key={`external-${i}`}>
                                        <a href={link} target="_blank" rel="noopener noreferrer">
                                            {link}
                                        </a>
                                    </li>
                                ))
                                : <li>Links: Not found</li>}
                        </ul>

                        <div style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: 'green' }}>
                                Active Links ({responseData.ActiveLinks?.Count || 0}):
                            </strong>
                            <p><strong>Count:</strong> {responseData.ActiveLinks?.Count || 0}</p>
                            <ul>
                                {responseData.ActiveLinks?.Links?.map((link: string, i: number) => (
                                    <li key={`active-${i}`} style={{ color: 'green' }}>
                                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                                    </li>
                                )) || <li style={{ color: 'gray' }}>None</li>}
                            </ul>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: 'red' }}>
                                Inactive Links ({responseData.InactiveLinks?.Count || 0}):
                            </strong>
                            <p><strong>Count:</strong> {responseData.InactiveLinks?.Count || 0}</p>
                            <ul>
                                {responseData.InactiveLinks?.Links?.map((link: string, i: number) => (
                                    <li key={`inactive-${i}`} style={{ color: 'red' }}>
                                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                                    </li>
                                )) || <li style={{ color: 'gray' }}>None</li>}
                            </ul>
                        </div>

                        <p><strong>Login :</strong> {String(responseData.IsLogin ? "Found" :"Not Found" )}</p>
                    </div>
                ) : (
                    <>
                        {
                            error ? (
                                <div style={{ color: 'red', marginBottom: '1rem' }}>
                                    <strong>Error:</strong> {error}
                                    <div style={{
                                    marginBottom : "5"
                                    }}></div>
                                    <strong>Code:</strong> {errorCode}
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center' }}>Welcome</p>
                            )
                        }
                    </>

                )
                }
            </div>
            {/* response view end*/}
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
        </div>
    );
}

export default Mainpage;