"use client";

import Image from "next/image";
import { Camera, Play, Map, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GallerySectionProps {
  gallery: string[];
  videoUrl: string | null;
  interactiveSiteMap: string | null;
  onOpenGallery: (index: number) => void;
}

export default function GallerySection({
  gallery,
  videoUrl,
  interactiveSiteMap,
  onOpenGallery,
}: GallerySectionProps) {
  if (!gallery || gallery.length === 0) return null;

  // Display first 6 images in grid
  const displayImages = gallery.slice(0, 6);
  const remainingCount = gallery.length - 6;

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-main-primary">
            Photo Gallery
          </h2>
          <p className="text-gray-600 mt-1">
            {gallery.length} photo{gallery.length !== 1 ? "s" : ""}
            {videoUrl ? " & video" : ""}
          </p>
          <div className="w-16 h-1 bg-main-secondary mt-3" />
        </div>
        <div className="flex items-center gap-3">
          {interactiveSiteMap && (
            <Button asChild variant="outline" size="sm">
              <a
                href={interactiveSiteMap}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Map className="size-4 mr-2" />
                Site Map
              </a>
            </Button>
          )}
          {gallery.length > 6 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenGallery(0)}
              className="hidden lg:flex"
            >
              <Camera className="size-4 mr-2" />
              View All Photos
            </Button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => onOpenGallery(index)}
            className={`relative overflow-hidden rounded-xs group ${
              index === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <div
              className={`relative ${
                index === 0
                  ? "h-[300px] lg:h-[400px]"
                  : "h-[150px] lg:h-[190px]"
              }`}
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

              {/* Show remaining count on last visible image */}
              {index === 5 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="size-8 mx-auto mb-2" />
                    <p className="text-lg font-semibold">
                      +{remainingCount} more
                    </p>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Video Section */}
      {videoUrl && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Play className="size-5 text-main-primary" />
            <h3 className="text-lg font-semibold text-main-primary">
              Video Tour
            </h3>
          </div>
          <div className="relative aspect-video rounded-xs overflow-hidden bg-gray-100">
            {videoUrl.includes("youtube") || videoUrl.includes("youtu.be") ? (
              <iframe
                src={videoUrl
                  .replace("watch?v=", "embed/")
                  .replace("youtu.be/", "youtube.com/embed/")}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoUrl.includes("vimeo") ? (
              <iframe
                src={videoUrl.replace("vimeo.com/", "player.vimeo.com/video/")}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-main-primary/5 hover:bg-main-primary/10 transition-colors"
              >
                <div className="text-center">
                  <Play className="size-12 text-main-primary mx-auto mb-2" />
                  <span className="text-main-primary font-medium flex items-center gap-1">
                    Watch Video <ExternalLink className="size-4" />
                  </span>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Mobile View All Button */}
      {gallery.length > 6 && (
        <div className="mt-6 lg:hidden">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenGallery(0)}
          >
            <Camera className="size-4 mr-2" />
            View All {gallery.length} Photos
          </Button>
        </div>
      )}
    </div>
  );
}
