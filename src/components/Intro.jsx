import React, { useEffect } from 'react';
import './Intro.css';

const Intro = ({ onComplete }) => {
  useEffect(() => {
    // Synth a "ta-dum" like drum/oscillator sound effect (optional, browser policies permitting)
    const playIntroSound = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // Ta-dum is a quick double beat/tone. 
        // Beat 1: Low deep synth tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(80, ctx.currentTime); // low pitch
        gain1.gain.setValueAtTime(0.001, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.1);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.6);

        // Beat 2 (0.15s later): Higher, more full tone
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sawtooth';
          osc2.frequency.setValueAtTime(105, ctx.currentTime); // slightly higher
          
          // Low-pass filter to make it sound deeper and cinematic
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 160;

          gain2.gain.setValueAtTime(0.001, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.1);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
          
          osc2.connect(filter);
          filter.connect(gain2);
          gain2.connect(ctx.destination);
          
          osc2.start();
          osc2.stop(ctx.currentTime + 0.9);
        }, 150);

      } catch (err) {
        // Browser block or context error
        console.log('[Intro] Web Audio autoplay prevented or not supported');
      }
    };

    // Play sound immediately on mount
    playIntroSound();

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000); // 2 seconds duration matches CSS fadeOutContainer animation

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="intro-container">
      <h1 className="intro-logo">FunFlix</h1>
    </div>
  );
};

export default Intro;
