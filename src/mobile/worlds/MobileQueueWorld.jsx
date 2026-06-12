import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MobileQueueWorld({ onBack }) {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const handleEnqueue = () => {
    if (!inputValue) return;

    if (queue.length >= 8) {
      setMessage('⚠ Queue Full');
      return;
    }

    setQueue([...queue, inputValue]);
    setInputValue('');
    setMessage('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setMessage('📭 Queue Empty');
      return;
    }

    setQueue(queue.slice(1));
    setMessage('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: 'white',
        padding: '20px',
      }}
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#f97316',
          fontSize: '18px',
          marginBottom: '20px',
        }}
      >
        ← Back
      </motion.button>

      <h1
        style={{
          color: '#f97316',
          textAlign: 'center',
          fontSize: '32px',
          marginBottom: '8px',
          textShadow: '0 0 20px rgba(249,115,22,0.5)',
        }}
      >
        📬 Queue City
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '8px',
        }}
      >
        <div
          style={{
            background: '#1e293b',
            border: '1px solid #f97316',
            borderRadius: '999px',
            padding: '8px 16px',
            color: '#fb923c',
            fontWeight: 'bold',
          }}
        >
          Queue Size: {queue.length}/8
        </div>
      </div>

      <div
        style={{
          height: '280px',
          borderRadius: '20px',
          border: '2px solid #f97316',
          background: '#0f172a',
          marginTop: '20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '10px',
          padding: '20px',
          overflowX: 'auto',
        }}
      >
        {queue.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            📭 Queue Empty
            <div style={{ marginTop: '8px', fontSize: '14px' }}>
              Enqueue items to begin
            </div>
          </div>
        )}

        {queue.map((item, index) => {
          const isRear = index === queue.length - 1;

          return (
            <div
              key={index}
              style={{
                minWidth: '90px',
                padding: '12px',
                textAlign: 'center',
                borderRadius: '12px',
                background: isRear ? '#fb923c' : '#f97316',
                boxShadow: isRear
                  ? '0 0 15px rgba(249,115,22,0.8)'
                  : 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            >
              {index === 0 && (
                <div
                  style={{
                    fontSize: '10px',
                    marginBottom: '4px',
                    fontWeight: 'bold',
                  }}
                >
                  FRONT
                </div>
              )}
              {item}

              {isRear && (
                <div
                  style={{
                    fontSize: '10px',
                    marginTop: '4px',
                    fontWeight: 'bold',
                  }}
                >
                  REAR
                </div>
              )}
            </div>
          );
        })}
      </div>

      {message && (
        <div
          style={{
            textAlign: 'center',
            color: '#fb923c',
            fontWeight: 'bold',
            marginBottom: '12px',
          }}
        >
          {message}
        </div>
      )}

      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter queue item"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '14px',
          border: '1px solid #334155',
          marginBottom: '12px',
          fontSize: '18px',
          boxSizing: 'border-box',
          background: '#0f172a',
          color: 'white',
          textAlign: 'center',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleEnqueue}
          style={{
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: '#f97316',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Enqueue
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleDequeue}
          style={{
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: '#ef4444',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Dequeue
        </motion.button>
      </div>
    </div>
  );
}