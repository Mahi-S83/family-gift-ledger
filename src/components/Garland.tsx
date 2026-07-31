import React from 'react';

export const Garland: React.FC = () => {
  return (
    <div className="h-[22px] mb-4 relative overflow-hidden">
      <svg viewBox="0 0 1200 22" preserveAspectRatio="none" className="w-full h-full">
        <path
          d="M0,4 Q30,22 60,4 T120,4 T180,4 T240,4 T300,4 T360,4 T420,4 T480,4 T540,4 T600,4 T660,4 T720,4 T780,4 T840,4 T900,4 T960,4 T1020,4 T1080,4 T1140,4 T1200,4"
          fill="none"
          stroke="#C9A227"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <g fill="#F2971D">
          {[30, 90, 150, 210, 270, 330, 390, 450, 510, 570, 630, 690, 750, 810, 870, 930, 990, 1050, 1110, 1170].map(x => (
            <circle key={x} cx={x} cy="13" r="4" />
          ))}
        </g>
        <g fill="#7A1730">
          {[60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140].map(x => (
            <circle key={x} cx={x} cy="6" r="2.4" />
          ))}
        </g>
      </svg>
    </div>
  );
};