import { motion } from 'framer-motion';

export default function NatureBackground({ intensity = 'full' }) {
  const isSubtle = intensity === 'subtle';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient — forest clearing + waterfall at dawn: deep blue-teal to cool green */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            175deg,
            #081816 0%,
            #0f2422 12%,
            #1a332f 25%,
            #1e4d5a 45%,
            #23443f 60%,
            #1a332f 78%,
            #0f2422 90%,
            #081816 100%
          )`,
        }}
      />

      {/* Ambient forest glow — cool blue-green light through canopy */}
      <motion.div
        className="ambient-glow"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 10, 0],
          opacity: isSubtle ? [0.06, 0.12, 0.06] : [0.12, 0.22, 0.12],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '55vw',
          height: '55vh',
          top: '12%',
          left: '25%',
          background: 'radial-gradient(ellipse, rgba(77, 138, 130, 0.28) 0%, rgba(45, 110, 126, 0.15) 40%, transparent 70%)',
        }}
      />

      {/* Water/teal glow — upper right, dawn light */}
      <motion.div
        className="ambient-glow"
        animate={{
          opacity: isSubtle ? [0.04, 0.1, 0.04] : [0.1, 0.18, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '50vw',
          height: '50vh',
          top: '5%',
          right: '10%',
          background: 'radial-gradient(ellipse, rgba(90, 173, 194, 0.2) 0%, rgba(61, 143, 165, 0.08) 50%, transparent 70%)',
        }}
      />

      {/* Waterfall — vertical flowing light on the left */}
      {!isSubtle && (
        <div className="absolute inset-0 left-0 w-[18%] max-w-[120px] overflow-hidden">
          {/* Flowing streaks — continuous downward motion */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                width: 2,
                height: '15%',
                background: 'linear-gradient(to bottom, transparent, rgba(232, 244, 248, 0.5), rgba(168, 220, 235, 0.3), transparent)',
                boxShadow: '0 0 12px rgba(200, 230, 240, 0.3)',
                filter: 'blur(0.5px)',
              }}
              animate={{
                y: ['-20%', '120%'],
                opacity: [0, 0.9, 0.9, 0],
              }}
              transition={{
                duration: 2.2 + (i % 3) * 0.4,
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'linear',
              }}
            />
          ))}
          {/* Soft vertical glow behind waterfall */}
          <motion.div
            className="absolute inset-y-0 w-full"
            style={{
              width: '100%',
              background: 'linear-gradient(to right, transparent, rgba(200, 230, 240, 0.08), rgba(168, 220, 235, 0.05), transparent)',
              filter: 'blur(8px)',
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      {/* Mist near waterfall — drifts and fades */}
      {!isSubtle && (
        <motion.div
          className="absolute left-0"
          style={{
            width: '25%',
            bottom: '25%',
            top: '20%',
            background: 'linear-gradient(to right, rgba(232, 244, 248, 0.06) 0%, transparent 100%)',
            filter: 'blur(20px)',
          }}
          animate={{
            x: [-20, 20, -20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Water reflection glow — bottom (teal/blue) */}
      <motion.div
        className="ambient-glow"
        animate={{
          opacity: isSubtle ? [0.06, 0.12, 0.06] : [0.12, 0.22, 0.12],
          scaleX: [1, 1.06, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '85vw',
          height: '28vh',
          bottom: '0',
          left: '7%',
          background: 'radial-gradient(ellipse at bottom, rgba(90, 173, 194, 0.25) 0%, rgba(61, 143, 165, 0.12) 40%, transparent 70%)',
        }}
      />

      {/* Stream at bottom — horizontal ripple/flow */}
      {!isSubtle && (
        <motion.div
          className="absolute left-0 right-0 h-24 bottom-0 overflow-hidden"
          style={{
            background: 'linear-gradient(to top, rgba(45, 110, 126, 0.15) 0%, rgba(90, 173, 194, 0.08) 30%, transparent 100%)',
          }}
        >
          {/* Flowing ripple bands */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 h-1 rounded-full"
              style={{
                left: '-10%',
                width: '40%',
                background: 'linear-gradient(90deg, transparent, rgba(168, 220, 235, 0.25), rgba(200, 230, 240, 0.2), transparent)',
                filter: 'blur(2px)',
              }}
              animate={{
                x: ['0vw', '110vw'],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.6,
                ease: 'linear',
              }}
            />
          ))}
          {/* Second layer — opposite direction */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`rev-${i}`}
              className="absolute bottom-4 h-0.5 rounded-full"
              style={{
                right: '-10%',
                width: '35%',
                background: 'linear-gradient(90deg, transparent, rgba(200, 230, 240, 0.15), transparent)',
                filter: 'blur(1px)',
              }}
              animate={{
                x: ['0vw', '-110vw'],
              }}
              transition={{
                duration: 10 + i,
                repeat: Infinity,
                delay: i * 2.2,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Shimmer reflection — subtle water surface flicker */}
      {!isSubtle && (
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(200, 230, 240, 0.03) 0%, transparent 60%)',
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Warm earth glow — lower right (softer, so blue dominates) */}
      <motion.div
        className="ambient-glow"
        animate={{
          opacity: isSubtle ? [0.02, 0.05, 0.02] : [0.04, 0.09, 0.04],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '35vw',
          height: '35vh',
          bottom: '5%',
          right: '5%',
          background: 'radial-gradient(ellipse, rgba(181, 166, 122, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* SVG Trees — silhouette layer (cooler fill) */}
      {!isSubtle && (
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: '65vh' }}
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
        >
          <path
            d="M0 600 L0 280 Q60 200 120 280 Q160 180 200 260 Q250 140 300 240 Q340 180 380 260 Q420 120 460 220 Q500 160 540 240 Q580 100 620 200 Q660 150 700 230 Q740 120 780 210 Q820 160 860 240 Q900 100 940 200 Q980 140 1020 230 Q1060 170 1100 250 Q1140 120 1180 220 Q1220 160 1260 240 Q1300 130 1340 220 Q1380 170 1420 250 L1440 240 L1440 600 Z"
            fill="rgba(8, 24, 22, 0.92)"
          />
          <motion.path
            d="M0 600 L0 340 Q80 260 140 320 Q180 220 240 300 Q300 180 360 280 Q400 230 460 300 Q520 180 580 280 Q620 230 680 290 Q740 170 800 270 Q840 220 900 290 Q960 180 1020 270 Q1060 220 1120 280 Q1180 160 1240 260 Q1280 210 1340 280 Q1400 200 1440 270 L1440 600 Z"
            fill="rgba(15, 36, 34, 0.88)"
            animate={{
              d: [
                "M0 600 L0 340 Q80 260 140 320 Q180 220 240 300 Q300 180 360 280 Q400 230 460 300 Q520 180 580 280 Q620 230 680 290 Q740 170 800 270 Q840 220 900 290 Q960 180 1020 270 Q1060 220 1120 280 Q1180 160 1240 260 Q1280 210 1340 280 Q1400 200 1440 270 L1440 600 Z",
                "M0 600 L0 342 Q80 262 140 322 Q180 218 240 298 Q300 182 360 282 Q400 228 460 298 Q520 182 580 282 Q620 228 680 288 Q740 172 800 272 Q840 218 900 288 Q960 182 1020 272 Q1060 218 1120 278 Q1180 162 1240 262 Q1280 208 1340 278 Q1400 202 1440 272 L1440 600 Z",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          <path
            d="M0 600 L0 400 Q100 340 160 380 Q220 300 300 360 Q380 290 440 350 Q500 310 560 360 Q640 280 720 350 Q780 310 840 360 Q920 280 1000 350 Q1060 300 1140 360 Q1200 310 1280 370 Q1340 320 1440 370 L1440 600 Z"
            fill="rgba(26, 51, 47, 0.72)"
          />
          <path d="M120 600 L120 200 L100 200 L110 160 L90 160 L110 120 L85 120 L110 70 L135 120 L115 120 L135 160 L115 160 L130 200 L120 200 Z" fill="rgba(15, 36, 34, 0.9)" />
          <path d="M1300 600 L1300 240 L1280 240 L1290 200 L1270 200 L1290 150 L1265 150 L1290 90 L1315 150 L1295 150 L1315 200 L1295 200 L1310 240 L1300 240 Z" fill="rgba(15, 36, 34, 0.86)" />
          <ellipse cx="200" cy="580" rx="80" ry="20" fill="rgba(26, 51, 47, 0.5)" />
          <ellipse cx="600" cy="570" rx="60" ry="15" fill="rgba(26, 51, 47, 0.4)" />
          <ellipse cx="1000" cy="585" rx="70" ry="18" fill="rgba(26, 51, 47, 0.5)" />
        </svg>
      )}

      {/* Mist layers — blue-white tint */}
      <motion.div
        className="absolute left-0 right-0"
        style={{
          bottom: isSubtle ? '20%' : '30%',
          height: '20vh',
          background: 'linear-gradient(to top, rgba(200, 230, 240, 0.06) 0%, rgba(163, 205, 197, 0.04) 40%, transparent 100%)',
        }}
        animate={{
          x: ['-3%', '3%', '-3%'],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-0 right-0"
        style={{
          bottom: isSubtle ? '10%' : '20%',
          height: '15vh',
          background: 'linear-gradient(to top, rgba(200, 230, 240, 0.04) 0%, transparent 100%)',
        }}
        animate={{
          x: ['2%', '-4%', '2%'],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Fireflies — softer teal tint */}
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
                background: 'rgba(168, 220, 235, 0.55)',
                boxShadow: '0 0 6px rgba(168, 220, 235, 0.35)',
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
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(8, 24, 22, 0.55) 100%)`,
        }}
      />

      {/* Grain overlay */}
      <div className="grain-overlay absolute inset-0" />
    </div>
  );
}
