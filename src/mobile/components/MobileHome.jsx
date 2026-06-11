
import { motion } from 'framer-motion';

export default function MobileHome({ onEnterWorld }) {
  const worlds = [
    { icon: '📚', name: 'Stack Kingdom', desc: 'Master LIFO mechanics', level: 'Beginner', xp: 250, color: '#06b6d4' },
    { icon: '📬', name: 'Queue City', desc: 'Learn FIFO operations', level: 'Beginner', xp: 250, color: '#f97316' },
    { icon: '🌳', name: 'Tree Nexus', desc: 'Explore binary trees', level: 'Intermediate', xp: 400, color: '#22c55e' },
    { icon: '🌐', name: 'Graph Realm', desc: 'Traverse graph networks', level: 'Advanced', xp: 600, color: '#3b82f6' },
    { icon: '🌋', name: 'Heap Citadel', desc: 'Understand heap structures', level: 'Intermediate', xp: 450, color: '#ef4444' },
    { icon: '🌲', name: 'Linked List Forest', desc: 'Navigate linked nodes', level: 'Beginner', xp: 300, color: '#a855f7' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: 'white',
        padding: '24px',
      }}
    >
      <h1
        style={{
          color: '#22d3ee',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        ⚡ STACKVERSE
      </h1>

      <p style={{ textAlign: 'center', color: '#94a3b8' }}>
        Level 3 • 1385 XP
      </p>

      <div style={{ marginTop: '30px' }}>
        {worlds.map((world) => (
          <div
            key={world.name}
            style={{
              background: '#0f172a',
              border: `1px solid ${world.color}`,
              boxShadow: `0 0 12px ${world.color}33`,
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '6px' }}>
              {world.icon} {world.name}
            </div>

            <div style={{ color: '#94a3b8', marginBottom: '12px' }}>
              {world.desc}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                fontSize: '14px',
              }}
            >
              <span>⭐ {world.level}</span>
              <span>🏆 {world.xp} XP</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (world.name === 'Stack Kingdom' && onEnterWorld) {
                  onEnterWorld('stack');
                }
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                background: world.color,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Enter World
            </motion.button>
          </div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '16px',
          borderRadius: '16px',
          border: 'none',
          background: '#22d3ee',
          fontWeight: 'bold',
          fontSize: '18px',
        }}
      >
        Continue Adventure
      </motion.button>
    </div>
  );
}