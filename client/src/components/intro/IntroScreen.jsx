import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/soundEngine';
import { motion, AnimatePresence } from 'framer-motion';
import './IntroScreen.css';

export default function IntroScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Calibrating magnetic lifters...');
  const [ready, setReady] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Lock body and html scroll completely so background is never exposed
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPosition = document.body.style.position;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setReady(true);
          sound.playClick();
          // Mobile Haptic Feedback on 100% completion
          try {
            if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
          } catch (e) {}
          setLoadingText('ALL SYSTEMS GO • GARAGE READY');
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 6;
        const capped = Math.min(next, 100);

        if (capped < 28) setLoadingText('Calibrating magnetic lifters...');
        else if (capped < 56) setLoadingText('Spooling high-rev telemetry...');
        else if (capped < 84) setLoadingText('Pressurizing quantum hydraulics...');
        else setLoadingText('Igniting antigravity thrusters...');

        return capped;
      });
    }, 65);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    if (!ready || exiting) return;
    sound.playClick();
    sound.playEngineRev();
    sound.playNitroBlast();
    try {
      if (navigator.vibrate) navigator.vibrate(50);
    } catch (e) {}
    setLaunching(true);
    
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 400);
    }, 380);
  };

  return (
    <div className={`intro-antigravity-viewport ${exiting ? 'fade-out' : ''}`}>
      
      {/* Full-Bleed Gritty Oil-Slick Garage Floor & Ambient Atmospheric Backing */}
      <div className="garage-wall-texture"></div>
      <div className="garage-ambient-glow"></div>

      {/* Atmospheric Upward-Drifting Floating Sparks & Levitating Embers */}
      <div className="floating-embers-container">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [40, -320],
              x: [0, (i % 2 === 0 ? 1 : -1) * (20 + (i * 3))],
              opacity: [0, 0.85, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2 + (i * 0.35),
              delay: i * 0.25,
              ease: "easeInOut"
            }}
            className="floating-ember"
            style={{
              left: `${8 + (i * 5.8)}%`,
              bottom: `${12 + (i % 4 * 4)}%`
            }}
          />
        ))}
      </div>

      {/* Main Full-Screen Layout: No box! Everything bleeds directly to edges */}
      <div className="intro-fullbleed-content">
        
        {/* Top: Stenciled Physical Header Wall Paint */}
        <div className="intro-top-stencil">
          <div className="stenciled-acm-badge">
            <img 
              src="/assets/logo/wce-acm-logo.png" 
              alt="WCE ACM Logo" 
              className="stenciled-acm-logo"
            />
            <div className="stenciled-college">
              WALCHAND COLLEGE OF ENGINEERING, SANGLI
            </div>
            <div className="stenciled-sub">
              WCE ACM STUDENT CHAPTER • PRESENTS
            </div>
          </div>

          <h1 className="stenciled-synanto-title">
            SYNANTO <span className="title-red-amber">2K26</span>
          </h1>
          <div className="stenciled-tagline">
            ⚡ ANTIGRAVITY PIT PADDOCK
          </div>
        </div>

        {/* Center: The Antigravity Levitating McQueen Centerpiece */}
        <div className="antigravity-stage-center">
          
          {/* Vertical Antigravity Plasma Beam from Pad to Undercarriage */}
          <div className="magnetic-plasma-beam"></div>

          {/* Heavy Industrial Magnetic Lift Pad with Glowing Rings */}
          <div className="magnetic-jack-pad">
            <div className="pad-outer-glow"></div>
            <div className="pad-metallic-disc"></div>
            <div className="pad-inner-concentric-core"></div>
          </div>

          {/* Detached Antigravity Levitation Shadow */}
          <motion.div 
            animate={{
              scale: [0.85, 0.96, 0.85],
              opacity: [0.55, 0.8, 0.55]
            }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            className="levitation-shadow"
          />

          {/* Levitating Lightning McQueen Floating in Mid-Air */}
          <motion.div
            animate={{
              y: launching ? [0, -40, -400] : [0, -14, 0],
              scale: launching ? [1, 1.1, 1.4] : 1,
              opacity: launching ? [1, 1, 0] : 1
            }}
            transition={
              launching 
                ? { duration: 0.45, ease: "easeIn" }
                : { y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" } }
            }
            className="levitating-car-wrapper"
          >
            <img 
              src="/assets/crews/mcqueen.png" 
              alt="Lightning McQueen Antigravity" 
              className="antigravity-car-img"
            />
          </motion.div>

        </div>

        {/* Bottom: Tactile Plasma Tube Progress & Slide-Up Stamped Metal CTA */}
        <div className="intro-bottom-controls">
          
          {/* Dynamic Cycling Microcopy */}
          <div className="loading-microcopy-row">
            <span className="microcopy-indicator">⚙</span>
            <span className="microcopy-text">{loadingText}</span>
            <span className="microcopy-percentage">{progress}%</span>
          </div>

          {/* Heavy-Duty Metal Track Plasma Tube Progress Bar */}
          <div className="plasma-tube-track">
            <div 
              className="plasma-tube-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="plasma-head-flare"></div>
            </div>
          </div>

          {/* Slide-Up Stamped Metal "ENTER THE GARAGE" CTA Button */}
          <div className="thumb-zone-trigger">
            <AnimatePresence>
              {ready && (
                <motion.button
                  initial={{ y: 80, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleStart}
                  className="stamped-metal-enter-btn"
                >
                  <span className="btn-icon">🏎️</span>
                  <span className="btn-text">ENTER THE GARAGE</span>
                  <span className="btn-arrow">➔</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
