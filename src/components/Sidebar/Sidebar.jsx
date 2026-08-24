import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, LogOut, Trophy } from 'lucide-react';
import { worldsConfig } from '../../data/worldsConfig';
import SidebarItem from './SidebarItem';

export default function Sidebar({ 
  currentWorld, 
  switchWorld, 
  user, 
  userProfile,
  onOpenCharacterSetup,
  level, 
  xp, 
  signOut, 
  setShowAchievements 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
        setIsMobile(true);
      } else {
        setIsExpanded(true);
        setIsMobile(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const archetypeColor = userProfile?.archetypeColor || '#38bdf8';
  const avatar = userProfile?.avatar || '⚡';
  const codename = userProfile?.codename || user?.displayName || user?.email?.split('@')[0] || 'PlayerOne';
  const archetypeName = userProfile?.archetypeName || 'Cyber Architect';

  return (
    <motion.div
      initial={{ width: 260 }}
      animate={{ width: isExpanded ? 260 : 72 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      style={{
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header / Logo Section */}
      <div 
        style={{
          padding: isExpanded ? '20px 16px' : '18px 0',
          height: '64px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        }}
      >
        {isExpanded ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#22d3ee',
                boxShadow: '0 0 12px #22d3ee',
                flexShrink: 0,
              }}
            />
            <span 
              style={{
                color: 'white',
                fontWeight: '900',
                letterSpacing: '2.5px',
                fontSize: '14.5px',
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
              }}
            >
              STACKVERSE
            </span>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            title="Expand Sidebar"
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
            }}
          >
            <PanelLeftOpen size={18} />
          </button>
        )}

        {/* Toggle Collapse Button (When Expanded) */}
        {isExpanded && !isMobile && (
          <button
            onClick={() => setIsExpanded(false)}
            title="Minimize Sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#38bdf8';
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* Navigation Worlds List */}
      <div 
        style={{
          flex: 1,
          padding: isExpanded ? '14px 4px' : '14px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {worldsConfig.map((world) => (
          <SidebarItem
            key={world.id}
            world={world}
            isActive={currentWorld === world.id}
            isExpanded={isExpanded}
            onClick={() => switchWorld(world.id)}
          />
        ))}
      </div>

      {/* User / Profile Footer Section */}
      <div
        style={{
          padding: isExpanded ? '14px 14px' : '12px 6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {isExpanded ? (
          <div 
            onClick={() => onOpenCharacterSetup && onOpenCharacterSetup()}
            title="Click to customize character & profile"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              width: '100%',
              cursor: 'pointer',
              padding: '6px 4px',
              borderRadius: '10px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {/* Glowing Custom Avatar */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: `${archetypeColor}20`,
                border: `1.5px solid ${archetypeColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 14px ${archetypeColor}40`,
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              {avatar}
            </div>

            <div style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ 
                color: 'white', 
                fontWeight: '700', 
                fontSize: '13.5px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {codename}
              </span>
              <div style={{ fontSize: '11px', color: archetypeColor, fontWeight: '700', marginTop: '1px' }}>
                {archetypeName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                <span style={{ color: '#22d3ee', fontSize: '11px', fontWeight: 'bold' }}>Lv.{level}</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((xp % 500) / 5, 100)}%`, height: '100%', background: 'linear-gradient(90deg,#22d3ee,#6366f1)' }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => onOpenCharacterSetup && onOpenCharacterSetup()}
            title={`${codename} (${archetypeName}) - Lv.${level} (${xp} XP) • Click to edit character`}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `${archetypeColor}20`,
              border: `1.5px solid ${archetypeColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 14px ${archetypeColor}40`,
              fontSize: '20px',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {avatar}
          </div>
        )}

        {/* Action Buttons */}
        {isExpanded ? (
          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
            <button
              onClick={() => onOpenCharacterSetup && onOpenCharacterSetup()}
              title="Customize Character"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '7px 3px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; }}
            >
              <span>⚡</span> Hero
            </button>
            <button
              onClick={() => setShowAchievements && setShowAchievements(true)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '7px 3px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'; }}
            >
              <Trophy size={12} /> Awards
            </button>
            <button
              onClick={() => signOut()}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '7px 3px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            >
              <LogOut size={12} /> Exit
            </button>
          </div>
        ) : (
          <button
            onClick={() => signOut()}
            title="Exit / Logout"
            style={{
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '9px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
