"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  Grid3X3,
} from "lucide-react";

interface LightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

export function Lightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  title = "Gallery",
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setRotation(0);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [open, initialIndex]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setZoom(1);
    setRotation(0);
    setDragOffset({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length, isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setZoom(1);
    setRotation(0);
    setDragOffset({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length, isTransitioning]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setDragOffset({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = images[currentIndex];
    link.download = `${title}-${currentIndex + 1}.jpg`;
    link.click();
  }, [images, currentIndex, title]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          onOpenChange(false);
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "r":
          handleRotate();
          break;
        case "0":
          handleReset();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goToPrevious, goToNext, onOpenChange, handleZoomIn, handleZoomOut, handleRotate, handleReset]);

  // Touch/swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom > 1) return;
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }, [zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart || zoom > 1) return;
    const deltaX = e.touches[0].clientX - touchStart.x;
    setDragOffset({ x: deltaX, y: 0 });
    setIsDragging(true);
  }, [touchStart, zoom]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || zoom > 1) return;

    const threshold = 50;
    if (dragOffset.x > threshold) {
      goToPrevious();
    } else if (dragOffset.x < -threshold) {
      goToNext();
    }

    setTouchStart(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }, [touchStart, dragOffset.x, zoom, goToPrevious, goToNext]);

  // Mouse drag for zoomed images
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setTouchStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  }, [zoom, dragOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !touchStart || zoom <= 1) return;
    setDragOffset({
      x: e.clientX - touchStart.x,
      y: e.clientY - touchStart.y,
    });
  }, [isDragging, touchStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setTouchStart(null);
  }, []);

  // Double click to zoom
  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) {
      handleReset();
    } else {
      setZoom(2);
    }
  }, [zoom, handleReset]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  }, [handleZoomIn, handleZoomOut]);

  // Don't render on server or if closed
  if (!mounted || !open || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const lightboxContent = (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Backdrop with click to close */}
      <div
        className="absolute inset-0"
        onClick={() => zoom === 1 && onOpenChange(false)}
      />

      {/* Top toolbar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        {/* Left side - counter and title */}
        <div className="flex items-center gap-4">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="text-white/70 text-sm hidden sm:block">{title}</span>
        </div>

        {/* Right side - tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Zoom out (-)"
          >
            <ZoomOut className="size-5" />
          </button>
          <span className="text-white/80 text-sm w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 4}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Zoom in (+)"
          >
            <ZoomIn className="size-5" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button
            onClick={handleRotate}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Rotate (R)"
          >
            <RotateCw className="size-5" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset (0)"
          >
            <Maximize2 className="size-5" />
          </button>
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-lg transition-colors ${
              showThumbnails
                ? "text-white bg-white/20"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            title="Toggle thumbnails"
          >
            <Grid3X3 className="size-5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="size-5" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close (Esc)"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div
        ref={imageContainerRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          paddingTop: "60px",
          paddingBottom: showThumbnails && images.length > 1 ? "100px" : "20px"
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        <div
          className={`relative w-full h-full transition-all ${
            isTransitioning ? "duration-300" : isDragging ? "duration-0" : "duration-200"
          }`}
          style={{
            transform: `
              translateX(${dragOffset.x}px)
              translateY(${dragOffset.y}px)
              scale(${zoom})
              rotate(${rotation}deg)
            `,
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
        >
          <Image
            src={currentImage}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-contain select-none pointer-events-none"
            priority
            draggable={false}
          />
        </div>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all hover:scale-110 group"
          >
            <ChevronLeft className="size-8 text-white group-hover:text-main-secondary transition-colors" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all hover:scale-110 group"
          >
            <ChevronRight className="size-8 text-white group-hover:text-main-secondary transition-colors" />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && showThumbnails && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent py-4">
          <div className="flex justify-center gap-2 px-4 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index !== currentIndex) {
                    setIsTransitioning(true);
                    setZoom(1);
                    setRotation(0);
                    setDragOffset({ x: 0, y: 0 });
                    setCurrentIndex(index);
                    setTimeout(() => setIsTransitioning(false), 300);
                  }
                }}
                className={`relative shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                  index === currentIndex
                    ? "w-20 h-14 ring-2 ring-main-secondary ring-offset-2 ring-offset-black"
                    : "w-16 h-12 opacity-50 hover:opacity-100 hover:scale-105"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-main-secondary/20" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint (shown briefly) */}
      <div className="absolute bottom-4 right-4 text-white/40 text-xs hidden lg:block">
        <kbd className="px-1.5 py-0.5 bg-white/10 rounded">←</kbd>
        <kbd className="px-1.5 py-0.5 bg-white/10 rounded ml-1">→</kbd>
        <span className="ml-2">Navigate</span>
        <span className="mx-2">|</span>
        <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd>
        <span className="ml-2">Close</span>
      </div>
    </div>
  );

  // Use portal to render at document body level
  return createPortal(lightboxContent, document.body);
}
