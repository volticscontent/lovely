"use client";

import { useEffect, useRef } from 'react';

export default function HoverBorderGradient() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = gradient.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gradient.style.background = `radial-gradient(18.9894% 47.1211% at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)`;
    };

    const handleMouseLeave = () => {
      gradient.style.background = 'radial-gradient(18.9894% 47.1211% at 29.143% 21.839%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)';
    };

    gradient.addEventListener('mousemove', handleMouseMove);
    gradient.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      gradient.removeEventListener('mousemove', handleMouseMove);
      gradient.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={gradientRef}
      className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
      style={{
        filter: 'blur(2px)',
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(18.9894% 47.1211% at 29.143% 21.839%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)',
        transition: 'background 0.3s ease-out'
      }}
      data-sentry-element="unknown"
      data-sentry-source-file="hover-border-gradient.tsx"
    />
  );
} 