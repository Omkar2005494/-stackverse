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
        padding: '12px 16px',
        margin: '6px 12px',
        borderRadius: '16px',
        background: isActive ? `rgba(${hexToRgb(world.color)}, 0.15)` : 'transparent',
        border: isActive ? `1px solid rgba(${hexToRgb(world.color)}, 0.4)` : '1px solid transparent',
        color: isActive ? world.color : world.locked ? '#475569' : '#cbd5e1',
        cursor: world.locked ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isActive ? `0 0 20px rgba(${hexToRgb(world.color)}, 0.2)` : 'none',
      }}
      title={!isExpanded ? world.title : ""}
    >
      {/* Active Left Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          style={{
            position: 'absolute',
            left: 0,
            top: '10%',
            bottom: '10%',
            width: '4px',
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
          minWidth: '24px',
          marginRight: isExpanded ? '16px' : '0',
          transition: 'margin 0.3s ease',
        }}
      >
        <IconComponent 
          size={24} 
          style={{
            filter: isActive ? `drop-shadow(0 0 8px ${world.color})` : 'none',
            transition: 'all 0.3s ease',
          }} 
        />
      </div>

      {/* Text Container */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          opacity: isExpanded ? 1 : 0,
          width: isExpanded ? 'auto' : 0,
          overflow: 'hidden',
          transition: 'opacity 0.3s ease, width 0.3s ease',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ 
          fontWeight: isActive ? '800' : '600', 
          fontSize: '15px',
          letterSpacing: '0.5px'
        }}>
          {world.title}
        </span>
        <span style={{ 
          fontSize: '11px', 
          color: isActive ? `rgba(${hexToRgb(world.color)}, 0.8)` : '#64748b',
          marginTop: '2px',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {world.subtitle}
        </span>
      </div>

      {/* Lock Icon for future worlds */}
      {world.locked && isExpanded && (
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', opacity: 0.5 }}>
          <Lock size={14} />
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
