import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SidebarItem({ 
  world, 
  isActive, 
  isExpanded, 
  onClick 
}) {
  const IconComponent = world.icon;

  return (
    <motion.button
      onClick={() => {
        if (!world.locked) {
          onClick(world.id);
        }
      }}
      whileHover={!world.locked ? { scale: 1.02 } : {}}
      whileTap={!world.locked ? { scale: 0.98 } : {}}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'flex-start' : 'center',
        padding: isExpanded ? '10px 14px' : '0',
        margin: isExpanded ? '3px 8px' : '3px auto',
        width: isExpanded ? 'calc(100% - 16px)' : '48px',
        height: '46px',
        boxSizing: 'border-box',
        borderRadius: '14px',
        background: isActive ? `rgba(${hexToRgb(world.color)}, 0.15)` : 'transparent',
        border: isActive ? `1px solid rgba(${hexToRgb(world.color)}, 0.4)` : '1px solid transparent',
        color: isActive ? world.color : world.locked ? '#475569' : '#cbd5e1',
        cursor: world.locked ? 'not-allowed' : 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isActive ? `0 0 18px rgba(${hexToRgb(world.color)}, 0.25)` : 'none',
        flexShrink: 0,
      }}
      title={!isExpanded ? `${world.title} - ${world.subtitle}` : ""}
    >
      {/* Active Left Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          style={{
            position: 'absolute',
            left: 0,
            top: '12%',
            bottom: '12%',
            width: '3.5px',
            borderRadius: '0 4px 4px 0',
            background: world.color,
            boxShadow: `0 0 10px ${world.color}`,
          }}
        />
      )}

      {/* Icon Container */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          flexShrink: 0,
          marginRight: isExpanded ? '12px' : '0',
          transition: 'margin 0.25s ease',
        }}
      >
        <IconComponent 
          size={20} 
          style={{
            filter: isActive ? `drop-shadow(0 0 8px ${world.color})` : 'none',
            transition: 'all 0.25s ease',
          }} 
        />
      </div>

      {/* Text Container */}
      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.15 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          <span style={{ 
            fontWeight: isActive ? '800' : '600', 
            fontSize: '13.5px',
            letterSpacing: '0.4px',
            lineHeight: 1.2,
          }}>
            {world.title}
          </span>
          <span style={{ 
            fontSize: '10.5px', 
            color: isActive ? `rgba(${hexToRgb(world.color)}, 0.8)` : '#64748b',
            marginTop: '2px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            lineHeight: 1.2,
          }}>
            {world.subtitle}
          </span>
        </motion.div>
      )}

      {/* Lock Icon for future worlds */}
      {world.locked && isExpanded && (
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', opacity: 0.5 }}>
          <Lock size={13} />
        </div>
      )}
    </motion.button>
  );
}

// Helper function to convert hex to rgb for rgba strings
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255, 255, 255';
}
