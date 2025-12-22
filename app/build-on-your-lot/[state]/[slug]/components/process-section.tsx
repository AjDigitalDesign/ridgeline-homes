"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LotProcessPage, LotProcessStep } from "@/lib/api";

interface ProcessSectionProps {
  processPage: LotProcessPage;
}

// Helper to detect YouTube URLs and extract video ID
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /youtube\.com\/shorts\/([^&?/]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getVideoThumbnail(mediaUrl: string): string | null {
  const youtubeId = getYouTubeVideoId(mediaUrl);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  // For regular video files, try to get a jpg version
  const jpgUrl = mediaUrl.replace(/\.(mp4|webm|mov)$/i, '.jpg');
  if (jpgUrl !== mediaUrl) {
    return jpgUrl;
  }
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url);
}

interface ProcessStepProps {
  step: LotProcessStep;
  index: number;
  isLast: boolean;
}

function ProcessStep({ step, index, isLast }: ProcessStepProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const isEven = index % 2 === 0;

  const stepInfoContent = (
    <div className="flex flex-col justify-center">
      {/* Step Number and Icon with Connector Line */}
      <div className="flex items-start gap-6 mb-6">
        {/* Large Step Number */}
        <span className="text-6xl lg:text-8xl font-light text-gray-200 leading-none select-none">
          {index + 1}
        </span>

        {/* Icon Circle with Line */}
        <div className="relative flex flex-col items-center">
          <div className="flex items-center justify-center size-16 rounded-full border-2 border-main-primary bg-white text-main-primary overflow-hidden">
            {step.icon ? (
              <Image
                src={step.icon}
                alt={step.title}
                width={32}
                height={32}
                className="object-contain"
              />
            ) : (
              <span className="text-2xl font-bold">{index + 1}</span>
            )}
          </div>
          {/* Connector Line */}
          <div className="hidden lg:block w-px h-24 bg-gray-300 mt-4" />
        </div>
      </div>

      {/* Step Title */}
      <h3 className="text-xl lg:text-2xl font-bold text-main-primary uppercase tracking-wide mb-4">
        {step.shortTitle || step.title}
      </h3>

      {/* Decorative Line */}
      <div className="w-16 h-0.5 bg-main-primary mb-6" />

      {/* Step Content */}
      {step.content && (
        <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
          {step.content}
        </p>
      )}

      {/* Optional Link */}
      {step.linkUrl && step.linkLabel && (
        <Link
          href={step.linkUrl}
          className="mt-4 text-main-primary font-semibold hover:underline inline-flex items-center gap-1"
        >
          {step.linkLabel}
        </Link>
      )}
    </div>
  );

  const mediaContent = (
    <div className="flex items-center justify-center">
      {step.mediaUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          {step.mediaType === "video" ? (
            <>
              {!isVideoPlaying ? (
                <>
                  {/* Video Thumbnail */}
                  {(() => {
                    const thumbnailUrl = getVideoThumbnail(step.mediaUrl);
                    if (thumbnailUrl) {
                      return (
                        <Image
                          src={thumbnailUrl}
                          alt={step.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      );
                    }
                    return (
                      <div className="absolute inset-0 bg-gray-800" />
                    );
                  })()}
                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                  >
                    <div className="flex items-center justify-center size-20 rounded-full border-4 border-white bg-white/20 group-hover:bg-white/30 transition-colors mb-4">
                      <Play className="size-10 text-white fill-white ml-1" />
                    </div>
                    <span className="text-white font-semibold uppercase tracking-wider">
                      Watch Video
                    </span>
                  </button>
                </>
              ) : (
                <>
                  {isYouTubeUrl(step.mediaUrl) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(step.mediaUrl)}?autoplay=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={step.mediaUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <Image
              src={step.mediaUrl}
              alt={step.title}
              fill
              className="object-cover"
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Step Content - Two Column Layout with alternating order */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 py-12 lg:py-16">
        {/* On even indexes (0, 2, 4...): info left, media right */}
        {/* On odd indexes (1, 3, 5...): media left, info right */}
        {isEven ? (
          <>
            {stepInfoContent}
            {mediaContent}
          </>
        ) : (
          <>
            <div className="order-2 lg:order-1">{mediaContent}</div>
            <div className="order-1 lg:order-2">{stepInfoContent}</div>
          </>
        )}
      </div>

      {/* Horizontal Divider */}
      {!isLast && (
        <div className="border-b border-gray-200" />
      )}
    </div>
  );
}

export default function ProcessSection({ processPage }: ProcessSectionProps) {
  const sortedSteps = [...(processPage.lotProcessSteps || [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 pt-12 lg:pt-16">
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Build on Your Lot
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-main-primary uppercase tracking-wide">
            {processPage.lotProcessStepsTitle || "Our Process"}
          </h2>
          <div className="w-24 h-1 bg-main-primary mt-4" />
        </div>
      </div>

      {/* Steps */}
      <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24">
        {sortedSteps.length > 0 ? (
          sortedSteps.map((step, index) => (
            <ProcessStep
              key={step.id}
              step={step}
              index={index}
              isLast={index === sortedSteps.length - 1}
            />
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            Process steps coming soon...
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-main-primary mt-12">
        <div className="container mx-auto px-4 lg:px-10 xl:px-20 2xl:px-24 py-12 lg:py-16 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about building on your lot. Our team is ready to help you bring your vision to life.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-main-secondary text-main-primary hover:bg-main-secondary/90 uppercase tracking-wide font-semibold"
          >
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
