import React from 'react';
import { motion } from 'framer-motion';

export default function MobileApp() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '24px',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: '350px'
        }}
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ fontSize: '4rem', marginBottom: '1.5rem' }}
        >
          💻
        </motion.div>
        
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem', 
          background: 'linear-gradient(to right, #38bdf8, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Desktop Recommended
        </h1>
        
        <p style={{ 
          fontSize: '1rem', 
          color: '#94a3b8', 
          lineHeight: '1.6' 
        }}>
          StackVerse is an immersive 3D gamified learning platform designed for desktop and big screens. Please open it on a computer to start learning!
        </p>
      </motion.div>
    </div>
  );
}
