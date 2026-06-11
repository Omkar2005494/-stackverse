import { useEffect, useState } from 'react';

export default function MobileSplash() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 40);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at center, rgba(34,211,238,0.18) 0%, #020617 45%, #01030f 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          border: '4px solid rgba(34,211,238,0.3)',
          boxShadow: '0 0 60px rgba(34,211,238,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          transform: 'translateY(-50px)',
        }}
      >
        <h1
          style={{
            color: '#22d3ee',
            fontSize: 28,
            letterSpacing: 3,
            margin: 0,
          }}
        >
          ⚡ STACKVERSE
        </h1>
      </div>

      <p
        style={{
          color: '#cbd5e1',
          fontSize: 16,
          marginBottom: 24,
          transform: 'translateY(-50px)',
        }}
      >
        Entering the Data Structure Universe...
      </p>

      <div
        style={{
          width: 280,
          height: 8,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
          transform: 'translateY(-50px)',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            transition: 'width 0.04s linear',
            boxShadow: '0 0 12px rgba(34,211,238,0.8)',
            height: '100%',
            borderRadius: 999,
            background: 'linear-gradient(90deg, #22d3ee, #8b5cf6)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </div>
  );
}