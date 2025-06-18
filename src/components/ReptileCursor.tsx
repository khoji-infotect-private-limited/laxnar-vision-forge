
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ReptileCursor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Create segments
    const N = 22; // number of body segments
    const segments: HTMLDivElement[] = [];
    
    if (containerRef.current) {
      // Clear any existing segments
      containerRef.current.innerHTML = '';
      
      // Create new segments
      for (let i = 0; i < N; i++) {
        const seg = document.createElement('div');
        seg.className = 'segment';
        seg.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #38b000;
          border: 2px solid rgba(255,255,255,.25);
          pointer-events: none;
          z-index: -1;
        `;
        containerRef.current.appendChild(seg);
        segments.push(seg);
      }
      
      segmentsRef.current = segments;
    }

    // Follow the pointer
    const handleMouseMove = (e: MouseEvent) => {
      if (segmentsRef.current.length > 0) {
        gsap.to(segmentsRef.current, {
          x: e.clientX - 11, // half of segment width (22px / 2)
          y: e.clientY - 11, // half of segment height (22px / 2)
          stagger: -0.06, // negative = tail lags behind head
          ease: 'power1.out',
          duration: 0.3
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default ReptileCursor;
