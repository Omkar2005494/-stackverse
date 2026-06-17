import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MobileTreeWorld({ onBack }) {
  const [nodes, setNodes] = useState([50, 30, 70]);
  const [inputValue, setInputValue] = useState('');
  const root = nodes[0];
  const leftChild = nodes.find((n) => n < root);
  const rightChild = nodes.find((n) => n > root);

  const leftGrandChildren = nodes.filter(
    (n) => leftChild && n < leftChild
  );

  const rightGrandChildren = nodes.filter(
    (n) => rightChild && n > rightChild
  );

  const handleInsert = () => {
    if (!inputValue) return;

    const value = Number(inputValue);
    if (nodes.includes(value)) return;

    setNodes([...nodes, value]);
    setInputValue('');
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
          color: '#22c55e',
          fontSize: '18px',
          marginBottom: '20px',
        }}
      >
        ← Back
      </motion.button>

      <h1
        style={{
          textAlign: 'center',
          color: '#22c55e',
          fontSize: '32px',
        }}
      >
        🌳 Tree Nexus
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid #22c55e',
            color: '#22c55e',
            fontWeight: 'bold',
          }}
        >
          Nodes: {nodes.length}
        </div>
      </div>

      <div
        style={{
          height: '650px',
          border: '2px solid #22c55e',
          borderRadius: '20px',
          background: '#0f172a',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <div style={{ position: 'relative', height: '100%' }}>
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <line x1='50%' y1='105' x2='38%' y2='205' stroke='#22c55e' strokeWidth='5' />
            <line x1='50%' y1='105' x2='62%' y2='205' stroke='#22c55e' strokeWidth='5' />

            {leftGrandChildren.length > 0 && (
              <line x1='38%' y1='220' x2='25%' y2='350' stroke='#22c55e' strokeWidth='5' />
            )}

            {rightGrandChildren.length > 0 && (
              <line x1='62%' y1='220' x2='75%' y2='350' stroke='#22c55e' strokeWidth='5' />
            )}
          </svg>

          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#94a3b8', marginBottom: '10px' }}>ROOT</div>
          </div>

          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#22c55e',
              color: '#020617',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '28px',
              position: 'absolute',
              top: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {root}
          </div>

          {leftChild && (
            <div
              style={{
                position: 'absolute',
                top: '160px',
                left: '30%',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#4ade80',
                color: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              {leftChild}
            </div>
          )}

          {rightChild && (
            <div
              style={{
                position: 'absolute',
                top: '160px',
                right: '30%',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#4ade80',
                color: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              {rightChild}
            </div>
          )}

          <div style={{ position: 'absolute', top: '380px', left: '18%', display: 'flex', gap: '10px', flexWrap: 'wrap', width: '25%' }}>
            {leftGrandChildren.map((node) => (
              <div
                key={node}
                style={{
                  width: '55px',
                  height: '55px',
                  borderRadius: '50%',
                  background: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {node}
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', top: '380px', right: '18%', display: 'flex', gap: '10px', flexWrap: 'wrap', width: '25%', justifyContent: 'flex-end' }}>
            {rightGrandChildren.map((node) => (
              <div
                key={node}
                style={{
                  width: '55px',
                  height: '55px',
                  borderRadius: '50%',
                  background: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {node}
              </div>
            ))}
          </div>
        </div>
      </div>

      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter node value"
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '14px',
          border: '1px solid #334155',
          background: '#0f172a',
          color: 'white',
          textAlign: 'center',
          boxSizing: 'border-box',
          marginBottom: '12px',
        }}
      />

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleInsert}
        style={{
          width: '100%',
          padding: '14px',
          border: 'none',
          borderRadius: '14px',
          background: '#22c55e',
          color: '#020617',
          fontWeight: 'bold',
        }}
      >
        Insert Node
      </motion.button>
    </div>
  );
}