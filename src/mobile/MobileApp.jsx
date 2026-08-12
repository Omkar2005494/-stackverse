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
      background: '#020617',
      backgroundImage: `
        radial-gradient(circle at 50% -20%, rgba(34, 211, 238, 0.15), transparent 40%),
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 30px 30px, 30px 30px',
      backgroundPosition: '0 0, 0 0, 0 0',
      color: 'white',
      fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
      padding: '24px',
      textAlign: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative blurred glowing orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '300px',
        height: '300px',
        background: 'rgba(34, 211, 238, 0.2)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'rgba(129, 140, 248, 0.15)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ zIndex: 1, marginBottom: '2.5rem' }}
      >
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: '900',
          letterSpacing: '8px',
          textTransform: 'uppercase',
          margin: 0,
          background: 'linear-gradient(to right, #ffffff, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))'
        }}>
          STACKVERSE
        </h1>
        <p style={{
          fontSize: '0.75rem',
          color: '#22d3ee',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          marginTop: '0.75rem',
          opacity: 0.9,
          fontWeight: '500'
        }}>
          Data Structure Universe
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          border: '1px solid rgba(34, 211, 238, 0.25)',
          boxShadow: '0 0 50px rgba(34, 211, 238, 0.15), inset 0 0 20px rgba(34, 211, 238, 0.05)',
          backdropFilter: 'blur(20px)',
          maxWidth: '380px',
          width: '100%',
          zIndex: 1,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated scanning line across the top border */}
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #22d3ee, #818cf8, transparent)',
            width: '100%',
            opacity: 0.8
          }}
        />

        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}
        >
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '22px',
            background: 'rgba(34, 211, 238, 0.1)',
            border: '1px solid rgba(34, 211, 238, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(34, 211, 238, 0.25), inset 0 0 15px rgba(34, 211, 238, 0.15)'
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))' }}>
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
        </motion.div>
        
        <h2 style={{ 
          fontSize: '1.35rem', 
          fontWeight: '700', 
          marginBottom: '1.25rem', 
          color: 'white',
          letterSpacing: '1px',
          textShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
        }}>
          Desktop Environment Required
        </h2>
        
        <p style={{ 
          fontSize: '0.95rem', 
          color: '#94a3b8', 
          lineHeight: '1.7',
          marginBottom: 0
        }}>
          Stackverse utilizes a high-performance 3D WebGL engine to render physical data structures. 
          <br /><br />
          For the optimal immersive experience, please switch to a device with a larger screen.
        </p>
      </motion.div>
      
      {/* Decorative corner accents for the futuristic feel */}
      <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '20px', height: '20px', borderBottom: '2px solid rgba(34, 211, 238, 0.4)', borderLeft: '2px solid rgba(34, 211, 238, 0.4)' }} />
      <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '20px', height: '20px', borderBottom: '2px solid rgba(34, 211, 238, 0.4)', borderRight: '2px solid rgba(34, 211, 238, 0.4)' }} />
      <div style={{ position: 'absolute', top: '24px', left: '24px', width: '20px', height: '20px', borderTop: '2px solid rgba(34, 211, 238, 0.4)', borderLeft: '2px solid rgba(34, 211, 238, 0.4)' }} />
      <div style={{ position: 'absolute', top: '24px', right: '24px', width: '20px', height: '20px', borderTop: '2px solid rgba(34, 211, 238, 0.4)', borderRight: '2px solid rgba(34, 211, 238, 0.4)' }} />
    </div>
  );
}
