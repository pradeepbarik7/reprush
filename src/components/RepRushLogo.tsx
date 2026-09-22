/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

interface RepRushLogoProps {
  className?: string;
  size?: number;
  showBadge?: boolean;
}

export const RepRushLogo: React.FC<RepRushLogoProps> = ({
  className = 'w-10 h-10',
  size,
  showBadge = true,
}) => {
  const uniqueId = useId().replace(/:/g, '');

  const redGradId = `rr-red-${uniqueId}`;
  const redHighlightId = `rr-red-hi-${uniqueId}`;
  const blueGradId = `rr-blue-${uniqueId}`;
  const blueHighlightId = `rr-blue-hi-${uniqueId}`;
  const athleteGradId = `rr-ath-${uniqueId}`;
  const badgeShadowId = `rr-shadow-${uniqueId}`;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="RepRush Logo"
    >
      <defs>
        {/* Dynamic Red Gradient for Top Crescent & Lightning */}
        <linearGradient id={redGradId} x1="75" y1="70" x2="420" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF1826" />
          <stop offset="60%" stopColor="#E20613" />
          <stop offset="100%" stopColor="#B3000E" />
        </linearGradient>

        {/* Hot Red Rim Highlight for Athlete Spine & Back */}
        <linearGradient id={redHighlightId} x1="70" y1="310" x2="420" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF2E3E" />
          <stop offset="50%" stopColor="#FF1124" />
          <stop offset="100%" stopColor="#FF4D5E" />
        </linearGradient>

        {/* Electric Blue Gradient for Bottom Crescent & Lightning */}
        <linearGradient id={blueGradId} x1="440" y1="220" x2="140" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0062FF" />
          <stop offset="50%" stopColor="#0084FF" />
          <stop offset="100%" stopColor="#0051E6" />
        </linearGradient>

        {/* Electric Cyan Rim Highlight for Athlete Chest, Arms & Shoes */}
        <linearGradient id={blueHighlightId} x1="430" y1="345" x2="70" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="50%" stopColor="#0091FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>

        {/* Athlete Silhouette Dark Obsidian/Navy */}
        <linearGradient id={athleteGradId} x1="100" y1="220" x2="420" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#080E1E" />
          <stop offset="60%" stopColor="#0D162B" />
          <stop offset="100%" stopColor="#0A1224" />
        </linearGradient>

        {/* Soft squircle badge shadow */}
        <filter id={badgeShadowId} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* 1. App Icon Squircle Background */}
      {showBadge && (
        <rect
          x="20"
          y="20"
          width="472"
          height="472"
          rx="106"
          fill="#FFFFFF"
          stroke="#F1F5F9"
          strokeWidth="3"
          filter={`url(#${badgeShadowId})`}
        />
      )}

      {/* ========================================================= */}
      {/* 2. TOP RED CRESCENT ARC & LIGHTNING BOLT                  */}
      {/* ========================================================= */}
      <g id="top-red-energy">
        {/* Upper Sweeping Curved Crescent */}
        <path
          d="M 82 268 
             C 86 172 155 88 266 70 
             C 336 58 392 84 419 124 
             C 388 102 334 88 268 96 
             C 176 108 114 176 96 250 
             C 93 260 88 265 82 268 Z"
          fill={`url(#${redGradId})`}
        />

        {/* Sharp Red Lightning Bolt striking inwards behind athlete */}
        <path
          d="M 142 186 
             L 366 138 
             L 204 184 
             L 92 268 
             C 100 250 118 214 142 186 Z"
          fill={`url(#${redGradId})`}
        />
      </g>

      {/* ========================================================= */}
      {/* 3. BOTTOM BLUE CRESCENT ARC & LIGHTNING BOLT               */}
      {/* ========================================================= */}
      <g id="bottom-blue-energy">
        {/* Lower Sweeping Curved Crescent */}
        <path
          d="M 436 218 
             C 440 318 368 408 258 438 
             C 188 456 130 432 140 416 
             C 178 430 236 428 296 408 
             C 382 380 426 312 432 238 
             C 434 226 435 220 436 218 Z"
          fill={`url(#${blueGradId})`}
        />

        {/* Sharp Blue Lightning Bolt striking inwards under athlete */}
        <path
          d="M 374 322 
             L 142 368 
             L 306 324 
             L 434 236 
             C 424 262 402 298 374 322 Z"
          fill={`url(#${blueGradId})`}
        />
      </g>

      {/* ========================================================= */}
      {/* 4. GROUND CONTACT SHADOWS                                 */}
      {/* ========================================================= */}
      <g id="ground-shadows" opacity="0.45">
        {/* Hands contact shadow */}
        <ellipse cx="388" cy="346" rx="48" ry="3.5" fill="#0A1124" />
        {/* Feet contact shadow */}
        <ellipse cx="82" cy="343" rx="28" ry="3" fill="#0A1124" />
      </g>

      {/* ========================================================= */}
      {/* 5. ATHLETE PUSH-UP SILHOUETTE (Dark Obsidian Navy)         */}
      {/* ========================================================= */}
      <g id="athlete-body">
        {/* Main Anatomical Silhouette */}
        <path
          d="M 68 335 
             C 63 324 66 310 74 298 
             C 82 286 96 284 108 292 
             C 118 288 138 276 168 266 
             C 192 258 214 246 236 230 
             C 252 218 274 210 298 206 
             C 318 202 338 196 352 186 
             C 358 182 366 178 372 176 
             C 378 174 386 170 392 165 
             C 398 158 406 150 416 148 
             C 428 146 440 152 448 162 
             C 454 169 452 176 446 182 
             C 438 190 428 196 418 200 
             C 412 202 406 205 400 210 
             L 426 270 
             C 430 282 436 308 440 334 
             C 442 342 438 345 428 345 
             L 404 345 
             C 398 344 396 338 395 328 
             L 384 278 
             L 374 244 
             C 368 240 360 238 350 240 
             L 344 266 
             L 348 310 
             C 350 326 352 340 352 345 
             C 352 346 344 346 338 345 
             L 316 345 
             C 310 344 312 334 314 318 
             L 316 278 
             C 316 268 312 260 302 258 
             C 288 256 264 264 242 272 
             C 216 282 188 296 154 314 
             C 126 328 108 338 94 342 
             L 68 335 Z"
          fill={`url(#${athleteGradId})`}
        />

        {/* Head and Hair Strands Definition */}
        <path
          d="M 396 160 
             C 404 150 415 146 428 147 
             C 440 148 449 155 452 165 
             C 453 172 449 178 442 182 
             C 432 188 424 192 414 195 
             L 404 178 
             C 400 172 398 166 396 160 Z"
          fill="#0D162B"
        />

        {/* Muscular Ribs / Abs / Deltoid Shadow Cut */}
        <path
          d="M 342 248 
             C 355 244 366 242 376 244 
             C 370 256 362 264 354 268 
             C 348 266 344 258 342 248 Z"
          fill="#131F38"
        />
        <path
          d="M 288 226 
             C 305 218 324 214 342 216 
             C 334 226 320 234 304 238 
             C 296 236 290 232 288 226 Z"
          fill="#131F38"
        />
      </g>

      {/* ========================================================= */}
      {/* 6. RED RIM LIGHTING & HIGHLIGHTS (Top Edge / Spine)       */}
      {/* ========================================================= */}
      <g id="athlete-red-highlights">
        {/* Heel & Achilles Red Highlight */}
        <path
          d="M 68 335 
             C 63 324 66 310 74 298 
             C 78 304 77 318 78 330 
             L 68 335 Z"
          fill={`url(#${redHighlightId})`}
        />

        {/* Calves, Hamstrings, Glutes & Spine Red Rim Contour */}
        <path
          d="M 74 298 
             C 82 286 96 284 108 292 
             C 134 278 174 262 212 244 
             C 246 228 274 214 306 206 
             C 332 200 354 192 368 180 
             C 356 188 330 196 304 204 
             C 272 214 242 228 208 244 
             C 170 262 130 278 104 292 
             C 94 286 82 288 74 298 Z"
          fill={`url(#${redHighlightId})`}
        />

        {/* Shoulders, Neck & Hair Red Rim Highlight */}
        <path
          d="M 368 180 
             C 378 172 388 166 396 160 
             C 404 150 415 146 428 147 
             C 418 148 408 152 400 162 
             C 392 168 382 174 372 182 
             L 368 180 Z"
          fill={`url(#${redHighlightId})`}
        />

        {/* Tricep Red Rim Lighting */}
        <path
          d="M 352 186 
             C 346 202 342 224 340 248 
             C 338 232 342 210 348 194 
             L 352 186 Z"
          fill={`url(#${redHighlightId})`}
        />
      </g>

      {/* ========================================================= */}
      {/* 7. BLUE RIM LIGHTING & HIGHLIGHTS (Front Edge / Arms)      */}
      {/* ========================================================= */}
      <g id="athlete-blue-highlights">
        {/* Sneaker Soles and Laces Electric Blue */}
        <path
          d="M 78 336 
             L 106 339 
             L 102 343 
             L 76 341 Z"
          fill={`url(#${blueHighlightId})`}
        />
        <path
          d="M 88 308 
             C 94 300 104 296 112 304 
             C 106 312 98 316 92 318 
             L 88 308 Z"
          fill={`url(#${blueHighlightId})`}
        />

        {/* Forearm & Wrist Front Edge Electric Blue */}
        <path
          d="M 344 266 
             L 348 310 
             C 350 326 352 340 352 345 
             C 350 343 348 334 346 318 
             L 342 278 
             L 344 266 Z"
          fill={`url(#${blueHighlightId})`}
        />

        {/* Hands Ground Contact Electric Blue Edge */}
        <path
          d="M 338 344 
             L 354 344 
             L 352 346 
             L 336 346 Z"
          fill={`url(#${blueHighlightId})`}
        />

        {/* Far Arm (Right Hand) Electric Blue Lighting */}
        <path
          d="M 426 270 
             C 430 282 436 308 440 334 
             C 442 342 438 345 428 345 
             C 434 343 436 336 434 322 
             L 426 278 
             L 426 270 Z"
          fill={`url(#${blueHighlightId})`}
        />

        {/* Chest and Abdominal Under-Glow Accent */}
        <path
          d="M 374 244 
             C 362 254 348 262 334 266 
             C 346 260 358 252 368 244 
             L 374 244 Z"
          fill={`url(#${blueHighlightId})`}
        />
      </g>
    </svg>
  );
};
