
import { useEffect, useRef } from 'react';

const ReptileCursor = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let cursor = { x: width / 2, y: width / 2 };
    let particles: any[] = [];
    let animationId: number;

    function init() {
      if (!containerRef.current) return;
      
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '1';
      containerRef.current.appendChild(canvas);
      
      const context = canvas.getContext('2d');
      if (!context) return;

      // Gecko cursor implementation
      class Particle {
        x: number;
        y: number;
        angle: number;
        speed: number;
        friction: number;
        gravity: number;
        hue: number;
        brightness: number;
        alpha: number;
        decay: number;

        constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
          this.angle = Math.random() * Math.PI * 2;
          this.speed = Math.random() * 2 + 1;
          this.friction = 0.98;
          this.gravity = 0.1;
          this.hue = Math.random() * 60 + 15; // Orange/yellow range
          this.brightness = Math.random() * 50 + 50;
          this.alpha = 1;
          this.decay = Math.random() * 0.03 + 0.01;
        }

        update() {
          this.speed *= this.friction;
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed + this.gravity;
          this.alpha -= this.decay;
        }

        draw() {
          if (!context) return;
          context.save();
          context.globalCompositeOperation = 'lighter';
          context.globalAlpha = this.alpha;
          context.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
          context.beginPath();
          context.arc(this.x, this.y, 2, 0, Math.PI * 2);
          context.fill();
          context.restore();
        }
      }

      function updateParticles() {
        if (!context) return;
        
        // Clear canvas
        context.clearRect(0, 0, width, height);
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].draw();
          
          if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
          }
        }
        
        animationId = requestAnimationFrame(updateParticles);
      }

      function addParticles(x: number, y: number) {
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(x, y));
        }
      }

      const handleMouseMove = (e: MouseEvent) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
        addParticles(cursor.x, cursor.y);
      };

      const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      };

      document.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
      
      updateParticles();

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }

    const cleanup = init();
    return cleanup;
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default ReptileCursor;
