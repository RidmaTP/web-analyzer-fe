import {  useState, useRef } from 'react';
import { startFetchingData } from '../services/service';

function Mainpage() {
  const [urlInput, setUrlInput] = useState('');
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const eventSourceObj = useRef<EventSource | null>(null);
  const [error, setError] = useState<string | null>(null);

  
const handleStart = () => {
    startFetchingData(urlInput, setEventData, setError, setLoading, eventSourceObj);
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
       // padding: '1rem',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
        backgroundColor: '#f0f2f5',
        overflow: 'hidden',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Web Analyzer</h1>
    
              {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center',justifyContent:'center' }}>
        <input
          type="text"
          value={urlInput}
          placeholder="Enter URL"
          onChange={(e) => setUrlInput(e.target.value)}
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
        {eventData ? (
          <div
             style={{
         textAlign:'start'
        }}
          >
      
            <h2>Page Analysis</h2>
            <p><strong>Version:</strong> {String(eventData.Version)}</p>
            <p><strong>Title:</strong> {String(eventData.Title)}</p>

            <h3>Headers</h3>
            <ul>
              {typeof eventData.Headers === 'object' && eventData.Headers !== null
                ? Object.entries(eventData.Headers as Record<string, any>).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key.toUpperCase()}:</strong> {value ?? 'null'}
                  </li>
                ))
                : <li>No headers found</li>}
            </ul>

            <h3>Internal Links</h3>
            <p><strong>Count:</strong> {eventData.InternalLinks?.Count ?? 'null'}</p>
            <ul>
              {Array.isArray(eventData.InternalLinks?.Links)
                ? eventData.InternalLinks.Links.map((link: string, i: number) => (
                  <li key={`internal-${i}`}>{link}</li>
                ))
                : <li>Links: Not found</li>}
            </ul>

            <h3>External Links</h3>
            <p><strong>Count:</strong> {eventData.ExternalLinks?.Count ?? 'null'}</p>
            <ul>
              {Array.isArray(eventData.ExternalLinks?.Links)
                ? eventData.ExternalLinks.Links.map((link: string, i: number) => (
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
                Active Links ({eventData.ActiveLinks?.Count || 0}):
              </strong>
              <p><strong>Count:</strong> {eventData.ActiveLinks?.Count || 0}</p>
              <ul>
                {eventData.ActiveLinks?.Links?.map((link: string, i: number) => (
                  <li key={`active-${i}`} style={{ color: 'green' }}>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                )) || <li style={{ color: 'gray' }}>None</li>}
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'red' }}>
                Inactive Links ({eventData.InactiveLinks?.Count || 0}):
              </strong>
              <p><strong>Count:</strong> {eventData.InactiveLinks?.Count || 0}</p>
              <ul>
                {eventData.InactiveLinks?.Links?.map((link: string, i: number) => (
                  <li key={`inactive-${i}`} style={{ color: 'red' }}>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                )) || <li style={{ color: 'gray' }}>None</li>}
              </ul>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center' }}>Welcome</p>
        )}
      </div>

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