
import { useEffect, useRef } from 'react';

const ReptileCursor = () => {
  const reptileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (reptileRef.current) {
        // Add a slight delay for smooth following effect
        setTimeout(() => {
          if (reptileRef.current) {
            reptileRef.current.style.left = `${e.clientX - 25}px`;
            reptileRef.current.style.top = `${e.clientY - 25}px`;
          }
        }, 100);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={reptileRef}
      className="fixed pointer-events-none transition-all duration-200 ease-out"
      style={{
        zIndex: -1,
        left: '0px',
        top: '0px',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Simple reptile/lizard shape using CSS */}
      <div className="relative">
        {/* Body */}
        <div className="w-12 h-6 bg-green-600 rounded-full relative">
          {/* Head */}
          <div className="absolute -left-4 top-1 w-8 h-4 bg-green-700 rounded-full">
            {/* Eyes */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-red-500 rounded-full"></div>
            <div className="absolute top-1 right-1 w-1 h-1 bg-red-500 rounded-full"></div>
          </div>
          {/* Tail */}
          <div className="absolute -right-6 top-2 w-8 h-2 bg-green-500 rounded-full transform rotate-12"></div>
          {/* Legs */}
          <div className="absolute -bottom-1 left-2 w-2 h-3 bg-green-700 rounded-sm"></div>
          <div className="absolute -bottom-1 left-5 w-2 h-3 bg-green-700 rounded-sm"></div>
          <div className="absolute -bottom-1 right-5 w-2 h-3 bg-green-700 rounded-sm"></div>
          <div className="absolute -bottom-1 right-2 w-2 h-3 bg-green-700 rounded-sm"></div>
          {/* Pattern spots */}
          <div className="absolute top-1 left-2 w-1 h-1 bg-green-800 rounded-full"></div>
          <div className="absolute top-3 left-4 w-1 h-1 bg-green-800 rounded-full"></div>
          <div className="absolute top-1 right-3 w-1 h-1 bg-green-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ReptileCursor;
