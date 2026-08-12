import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, LogOut, User, Trophy } from 'lucide-react';
import { worldsConfig } from '../../data/worldsConfig';
import SidebarItem from './SidebarItem';

export default function Sidebar({ currentWorld, switchWorld, user, level, xp, signOut, setShowAchievements }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
        setIsMobile(true);
      } else if (window.innerWidth < 1024) {
        setIsExpanded(false);
        setIsMobile(false);
      } else {
        setIsExpanded(true);
        setIsMobile(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      initial={{ width: 260 }}
      animate={{ width: isExpanded ? 260 : 76 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 50,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Top Header / Logo Section */}
      <div 
        style={{
          padding: '24px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <h2 style={{ 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: 900,
                letterSpacing: '2px',
                background: 'linear-gradient(180deg,#9be7ff,#22d3ee,#38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 15px rgba(34,211,238,0.4)',
              }}>
                STACKVERSE
              </h2>
              <span style={{ 
                fontSize: '10px', 
                color: '#64748b', 
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginTop: '4px',
                fontWeight: '600'
              }}>
                DSA Learning Hub
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => !isMobile && setIsExpanded(!isExpanded)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: isMobile ? 'default' : 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => !isMobile && (e.currentTarget.style.color = '#22d3ee')}
          onMouseLeave={(e) => !isMobile && (e.currentTarget.style.color = '#94a3b8')}
        >
          {isExpanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={24} color="#22d3ee" style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.5))' }} />}
        </button>
      </div>

      {/* Worlds Navigation List */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
        }}
      >
        <style>
          {`
            /* Hide scrollbar for Chrome, Safari and Opera */
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        
        {worldsConfig.map((world) => (
          <SidebarItem
            key={world.id}
            world={world}
            isActive={currentWorld === world.id}
            isExpanded={isExpanded}
            onClick={(id) => switchWorld(id, `ENTERING ${world.title.toUpperCase()}`)}
          />
        ))}
      </div>

      {/* Player Profile Section */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Glowing Default Avatar */}
          <div
            style={{
              width: isExpanded ? '40px' : '44px',
              height: isExpanded ? '40px' : '44px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              flexShrink: 0,
              margin: isExpanded ? '0' : '0 auto',
            }}
          >
            <User size={20} />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <span style={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user?.email?.split('@')[0] || 'PlayerOne'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ color: '#22d3ee', fontSize: '11px', fontWeight: 'bold' }}>Lv.{level}</span>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((xp % 500) / 5, 100)}%`, height: '100%', background: 'linear-gradient(90deg,#22d3ee,#6366f1)' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', gap: '8px', overflow: 'hidden' }}
            >
              <button
                onClick={() => setShowAchievements && setShowAchievements(true)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'; }}
              >
                <Trophy size={14} /> Awards
              </button>
              <button
                onClick={() => signOut()}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
              >
                <LogOut size={14} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
