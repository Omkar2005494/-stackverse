import { useState } from 'react';
import { motion } from 'framer-motion';
export default function MobileStackWorld({ onBack }) {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handlePush = () => {
    if (!inputValue || stack.length >= 8) return;
    setStack([...stack, inputValue]);
    setInputValue('');
  };

  const handlePop = () => {
    if (stack.length === 0) return;
    setStack(stack.slice(0, -1));
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
          color: '#22d3ee',
          fontSize: '18px',
          marginBottom: '20px',
        }}
      >
        ← Back
      </motion.button>

      <h1
        style={{
          color: '#22d3ee',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        📚 Stack Kingdom
      </h1>

      <p
        style={{
          textAlign: 'center',
          color: '#94a3b8',
          marginBottom: '24px',
        }}
      >
        XP: 1385
      </p>

      <p
        style={{
          textAlign: 'center',
          color: '#22d3ee',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        Stack Size: {stack.length}
      </p>

      <div
        style={{
          height: '320px',
          borderRadius: '20px',
          border: '2px solid #06b6d4',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: '24px',
          flexDirection: 'column',
          gap: '8px',
          padding: '10px',
        }}
      >
        {[...stack].reverse().map((item, index) => {
          const isTop = index === 0;

          return (
            <div
              key={index}
              style={{
                maxWidth: '220px',
                fontSize: '22px',
                background: isTop ? '#67e8f9' : '#22d3ee',
                boxShadow: isTop ? '0 0 20px rgba(103,232,249,0.8)' : 'none',
                color: '#020617',
                padding: '10px',
                borderRadius: '10px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              {isTop && (
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    color: '#020617',
                  }}
                >
                  TOP
                </div>
              )}
              {item}
            </div>
          );
        })}
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          padding: '14px',
          borderRadius: '14px',
          border: 'none',
          width: '100%',
          marginBottom: '12px',
          fontSize: '18px',
          textAlign: 'center',
        }}
        placeholder="Enter stack item"
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
          onClick={handlePush}
          style={{
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: '#06b6d4',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Push
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePop}
          style={{
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: '#ef4444',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Pop
        </motion.button>
      </div>
    </div>
  );
}