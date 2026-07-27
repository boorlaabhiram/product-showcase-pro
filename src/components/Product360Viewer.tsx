import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  MoveHorizontal,
  Sparkles,
} from 'lucide-react';

interface Product360ViewerProps {
  images?: string[];
  productName: string;
  fallbackImage: string;
}

export const Product360Viewer: React.FC<Product360ViewerProps> = ({
  images = [],
  productName,
  fallbackImage,
}) => {
  // If no multi-angle frame array provided, construct synthetic 360 frames using gallery/fallback
  const frameList =
    images.length >= 3
      ? images
      : [
          fallbackImage,
          images[0] || fallbackImage,
          images[1] || fallbackImage,
          images[2] || fallbackImage,
          fallbackImage,
        ];

  const totalFrames = frameList.length;
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto spin effect
  useEffect(() => {
    let interval: any = null;
    if (isAutoSpin) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % totalFrames);
      }, 150);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAutoSpin, totalFrames]);

  // Mouse Drag / Touch Swipe Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsAutoSpin(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 15) {
      if (deltaX > 0) {
        setCurrentFrameIndex((prev) => (prev - 1 + totalFrames) % totalFrames);
      } else {
        setCurrentFrameIndex((prev) => (prev + 1) % totalFrames);
      }
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoSpin(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 15) {
      if (deltaX > 0) {
        setCurrentFrameIndex((prev) => (prev - 1 + totalFrames) % totalFrames);
      } else {
        setCurrentFrameIndex((prev) => (prev + 1) % totalFrames);
      }
      setStartX(e.touches[0].clientX);
    }
  };

  const handleReset = () => {
    setCurrentFrameIndex(0);
    setZoomLevel(1);
    setIsAutoSpin(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl bg-zinc-900/60 border border-white/10 overflow-hidden backdrop-blur-xl transition-all select-none group ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-zinc-950 p-6' : 'aspect-square sm:aspect-[4/3]'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Top Banner Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold backdrop-blur-md shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          Interactive 360° Studio View
        </span>
      </div>

      {/* Drag Indicator Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-zinc-300 text-[11px] font-mono backdrop-blur-md pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
        <MoveHorizontal className="w-3.5 h-3.5 text-blue-400" />
        <span>Drag / Swipe to Rotate</span>
      </div>

      {/* Main Image Frame Container */}
      <div className="w-full h-full flex items-center justify-center p-8 cursor-grab active:cursor-grabbing overflow-hidden">
        <motion.img
          key={currentFrameIndex}
          src={frameList[currentFrameIndex]}
          alt={`${productName} 360 View Frame ${currentFrameIndex + 1}`}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-75"
          style={{ transform: `scale(${zoomLevel})` }}
          initial={{ opacity: 0.9, scale: zoomLevel * 0.98 }}
          animate={{ opacity: 1, scale: zoomLevel }}
          transition={{ duration: 0.1 }}
          draggable={false}
        />
      </div>

      {/* Rotation Progress Bar */}
      <div className="absolute bottom-16 left-6 right-6 z-20 flex items-center gap-2">
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-150 rounded-full"
            style={{ width: `${((currentFrameIndex + 1) / totalFrames) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-zinc-400 bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
          Angle {(currentFrameIndex * (360 / totalFrames)).toFixed(0)}° ({currentFrameIndex + 1}/{totalFrames})
        </span>
      </div>

      {/* Floating Control Toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
        <button
          type="button"
          onClick={() => setIsAutoSpin(!isAutoSpin)}
          className={`p-2 rounded-full transition-all ${
            isAutoSpin ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-zinc-300 hover:bg-white/10'
          }`}
          title={isAutoSpin ? 'Pause 360° Auto Spin' : 'Start 360° Auto Spin'}
        >
          {isAutoSpin ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="w-[1px] h-4 bg-white/10" />

        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
          className="p-2 rounded-full text-zinc-300 hover:bg-white/10 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1))}
          className="p-2 rounded-full text-zinc-300 hover:bg-white/10 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-full text-zinc-300 hover:bg-white/10 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-white/10" />

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-full text-zinc-300 hover:bg-white/10 transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
