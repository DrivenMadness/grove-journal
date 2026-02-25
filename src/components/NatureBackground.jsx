import { motion } from 'framer-motion';

export default function NatureBackground({ intensity = 'full' }) {
  const isSubtle = intensity === 'subtle';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient — deep forest floor to night sky */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            175deg,
            #0a1a0f 0%,
            #0f220f 15%,
            #132a15 30%,
            #1a361a 50%,
            #162e1a 70%,
            #0f220f 85%,
            #081408 100%
          )`,
        }}
      />

      {/* Ambient forest glow — warm light filtering through canopy */}
      <motion.div
        className="ambient-glow"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 10, 0],
          opacity: isSubtle ? [0.08, 0.12, 0.08] : [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '60vw',
          height: '60vh',
          top: '10%',
          left: '20%',
          background: 'radial-gradient(ellipse, rgba(90, 154, 90, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Water reflection glow — bottom */}
      <motion.div
        className="ambient-glow"
        animate={{
          opacity: isSubtle ? [0.05, 0.1, 0.05] : [0.1, 0.2, 0.1],
          scaleX: [1, 1.05, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '80vw',
          height: '30vh',
          bottom: '0',
          left: '10%',
          background: 'radial-gradient(ellipse at bottom, rgba(107, 168, 168, 0.2) 0%, transparent 70%)',
        }}
      />

      {/* Warm earth glow — lower right */}
      <motion.div
        className="ambient-glow"
        animate={{
          opacity: isSubtle ? [0.03, 0.06, 0.03] : [0.06, 0.12, 0.06],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '40vw',
          height: '40vh',
          bottom: '5%',
          right: '5%',
          background: 'radial-gradient(ellipse, rgba(201, 168, 122, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* SVG Trees — silhouette layer */}
      {!isSubtle && (
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: '65vh' }}
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
        >
          {/* Far tree line — darkest */}
          <path
            d="M0 600 L0 280 Q60 200 120 280 Q160 180 200 260 Q250 140 300 240 Q340 180 380 260 Q420 120 460 220 Q500 160 540 240 Q580 100 620 200 Q660 150 700 230 Q740 120 780 210 Q820 160 860 240 Q900 100 940 200 Q980 140 1020 230 Q1060 170 1100 250 Q1140 120 1180 220 Q1220 160 1260 240 Q1300 130 1340 220 Q1380 170 1420 250 L1440 240 L1440 600 Z"
            fill="rgba(8, 20, 8, 0.9)"
          />

          {/* Mid tree line */}
          <motion.path
            d="M0 600 L0 340 Q80 260 140 320 Q180 220 240 300 Q300 180 360 280 Q400 230 460 300 Q520 180 580 280 Q620 230 680 290 Q740 170 800 270 Q840 220 900 290 Q960 180 1020 270 Q1060 220 1120 280 Q1180 160 1240 260 Q1280 210 1340 280 Q1400 200 1440 270 L1440 600 Z"
            fill="rgba(15, 34, 15, 0.85)"
            animate={{ d: [
              "M0 600 L0 340 Q80 260 140 320 Q180 220 240 300 Q300 180 360 280 Q400 230 460 300 Q520 180 580 280 Q620 230 680 290 Q740 170 800 270 Q840 220 900 290 Q960 180 1020 270 Q1060 220 1120 280 Q1180 160 1240 260 Q1280 210 1340 280 Q1400 200 1440 270 L1440 600 Z",
              "M0 600 L0 342 Q80 262 140 322 Q180 218 240 298 Q300 182 360 282 Q400 228 460 298 Q520 182 580 282 Q620 228 680 288 Q740 172 800 272 Q840 218 900 288 Q960 182 1020 272 Q1060 218 1120 278 Q1180 162 1240 262 Q1280 208 1340 278 Q1400 202 1440 272 L1440 600 Z",
            ]}}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />

          {/* Near tree line — lightest */}
          <path
            d="M0 600 L0 400 Q100 340 160 380 Q220 300 300 360 Q380 290 440 350 Q500 310 560 360 Q640 280 720 350 Q780 310 840 360 Q920 280 1000 350 Q1060 300 1140 360 Q1200 310 1280 370 Q1340 320 1440 370 L1440 600 Z"
            fill="rgba(26, 54, 26, 0.7)"
          />

          {/* Individual tall trees */}
          {/* Left pine */}
          <path d="M120 600 L120 200 L100 200 L110 160 L90 160 L110 120 L85 120 L110 70 L135 120 L115 120 L135 160 L115 160 L130 200 L120 200 Z" fill="rgba(15, 34, 15, 0.9)" />
          {/* Right pine */}
          <path d="M1300 600 L1300 240 L1280 240 L1290 200 L1270 200 L1290 150 L1265 150 L1290 90 L1315 150 L1295 150 L1315 200 L1295 200 L1310 240 L1300 240 Z" fill="rgba(15, 34, 15, 0.85)" />
          
          {/* Ground foliage */}
          <ellipse cx="200" cy="580" rx="80" ry="20" fill="rgba(26, 54, 26, 0.5)" />
          <ellipse cx="600" cy="570" rx="60" ry="15" fill="rgba(26, 54, 26, 0.4)" />
          <ellipse cx="1000" cy="585" rx="70" ry="18" fill="rgba(26, 54, 26, 0.5)" />
        </svg>
      )}

      {/* Mist layers */}
      <motion.div
        className="absolute left-0 right-0"
        style={{
          bottom: isSubtle ? '20%' : '30%',
          height: '20vh',
          background: 'linear-gradient(to top, rgba(168, 189, 168, 0.08) 0%, transparent 100%)',
        }}
        animate={{
          x: ['-3%', '3%', '-3%'],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute left-0 right-0"
        style={{
          bottom: isSubtle ? '10%' : '20%',
          height: '15vh',
          background: 'linear-gradient(to top, rgba(168, 189, 168, 0.05) 0%, transparent 100%)',
        }}
        animate={{
          x: ['2%', '-4%', '2%'],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Fireflies — subtle */}
      {!isSubtle && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3,
                height: 3,
                left: `${15 + i * 14}%`,
                top: `${30 + (i % 3) * 15}%`,
                background: 'rgba(201, 168, 122, 0.6)',
                boxShadow: '0 0 6px rgba(201, 168, 122, 0.4)',
              }}
              animate={{
                opacity: [0, 0.8, 0],
                y: [0, -20, -40],
                x: [0, (i % 2 ? 10 : -10), 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 1.5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(8, 20, 8, 0.6) 100%)`,
        }}
      />

      {/* Grain overlay */}
      <div className="grain-overlay absolute inset-0" />
    </div>
  );
}
