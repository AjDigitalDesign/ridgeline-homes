"use client";

import { Play, ExternalLink } from "lucide-react";

interface VideoSectionProps {
  videoUrl: string;
  communityName: string;
}

export default function VideoSection({
  videoUrl,
  communityName,
}: VideoSectionProps) {
  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-main-primary">
          Video Tour
        </h2>
        <div className="w-16 h-1 bg-main-secondary mx-auto mt-4" />
      </div>

      {/* Video Player */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 max-w-4xl mx-auto">
        {videoUrl.includes("youtube") || videoUrl.includes("youtu.be") ? (
          <iframe
            src={videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${communityName} Video Tour`}
          />
        ) : videoUrl.includes("vimeo") ? (
          <iframe
            src={videoUrl.replace("vimeo.com/", "player.vimeo.com/video/")}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={`${communityName} Video Tour`}
          />
        ) : (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-main-primary/5 hover:bg-main-primary/10 transition-colors"
          >
            <div className="text-center">
              <Play className="size-16 text-main-primary mx-auto mb-3" />
              <span className="text-main-primary font-semibold text-lg flex items-center gap-2 justify-center">
                Watch Video <ExternalLink className="size-5" />
              </span>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
