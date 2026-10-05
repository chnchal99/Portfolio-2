import { useState, useEffect, type ReactNode, type ChangeEvent } from "react";
import { Film, Image as ImageIcon, Play, Camera, RotateCcw, Loader2 } from "lucide-react";
import {
  getCustomMedia,
  uploadCustomMedia,
  deleteCustomMedia,
  subscribeToMediaChanges,
  isEditorMode,
} from "@/lib/mediaStore";

interface ProjectMediaFrameProps {
  src?: string | null;
  alt: string;
  projectTitle: string;
  category?: string;
  label?: string;
  badge?: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-[16/10]" or "aspect-video"
  loading?: "lazy" | "eager";
  interactive?: boolean;
  showPlayBadge?: boolean;
  overlayShade?: boolean;
  mediaId?: string;
  projectId?: string;
  isEditor?: boolean;
  children?: ReactNode;
  objectFit?: "cover" | "contain";
}

export function ProjectMediaFrame({
  src: initialSrc,
  alt,
  projectTitle,
  category,
  label,
  badge,
  className = "",
  aspectRatio = "",
  loading = "lazy",
  showPlayBadge = false,
  overlayShade = false,
  mediaId,
  projectId = "general",
  isEditor: explicitIsEditor,
  children,
  objectFit = "contain",
}: ProjectMediaFrameProps) {
  const [loadError, setLoadError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [, setTick] = useState(0);

  // Editor mode detection (explicit prop or global detection)
  const isEditor = explicitIsEditor !== undefined ? explicitIsEditor : isEditorMode();

  // Listen to media store changes
  useEffect(() => {
    const unsubscribe = subscribeToMediaChanges(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  // Determine effective media source: custom uploaded media takes precedence
  const customMediaUrl = mediaId ? getCustomMedia(mediaId) : null;
  const effectiveSrc = customMediaUrl || initialSrc;

  // Reset load error when src changes
  useEffect(() => {
    setLoadError(false);
  }, [effectiveSrc]);

  // Check if media is a video file
  const isVideo = Boolean(
    effectiveSrc && (effectiveSrc.endsWith(".mp4") || effectiveSrc.endsWith(".webm") || effectiveSrc.includes("/video/"))
  );

  // Check if media source is provided and hasn't errored
  const hasValidMedia = Boolean(effectiveSrc && !loadError);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !mediaId) return;

    try {
      setIsUploading(true);
      await uploadCustomMedia(mediaId, projectId, file);
      setLoadError(false);
    } catch (err) {
      console.error("Failed to upload image:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!mediaId) return;
    try {
      await deleteCustomMedia(mediaId);
      setLoadError(false);
    } catch (err) {
      console.error("Failed to reset image:", err);
    }
  };

  return (
    <div
      className={`group/media relative w-full h-full overflow-hidden select-none bg-[#0e080b] border border-[rgba(184,184,184,0.12)] transition-all duration-300 ${aspectRatio} ${className}`}
    >
      {/* Media rendering */}
      {hasValidMedia ? (
        isVideo ? (
          <div className="relative w-full h-full">
            <video
              src={effectiveSrc || ""}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onError={() => setLoadError(true)}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            {!isVideoPlaying && showPlayBadge && (
              <div className="hero-play-badge pointer-events-none" aria-hidden="true">
                <Play size={14} fill="currentColor" />
              </div>
            )}
          </div>
        ) : (
          <>
            <img
              src={effectiveSrc || ""}
              alt={alt}
              loading={loading}
              onError={() => setLoadError(true)}
              className={`w-full h-full ${objectFit === "cover" ? "object-cover" : "object-contain bg-[#080808]"} transition-transform duration-700 ease-out group-hover:scale-[1.01]`}
            />
            {overlayShade && objectFit === "cover" && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            )}
            {showPlayBadge && (
              <div className="hero-play-badge pointer-events-none" aria-hidden="true">
                <Play size={13} fill="currentColor" />
              </div>
            )}
          </>
        )
      ) : (
        /* Subtle Neutral Architectural Project Placeholder (100% No Stock Photos) */
        <div className="relative w-full h-full min-h-[14rem] flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-br from-[#12090d] via-[#0b0507] to-[#15070c] border border-[#7A0010]/30 group-hover:border-[#7A0010]/60 transition-colors">
          {/* Subtle architectural crosshair markings in corners */}
          <div className="absolute top-2.5 left-2.5 text-[9px] font-mono text-[#7A0010]/40 select-none">+</div>
          <div className="absolute top-2.5 right-2.5 text-[9px] font-mono text-[#7A0010]/40 select-none">+</div>
          <div className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-[#7A0010]/40 select-none">+</div>
          <div className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-[#7A0010]/40 select-none">+</div>

          {/* Top metadata row */}
          <div className="flex items-center justify-between gap-2 z-10">
            <span className="font-mono text-[0.58rem] tracking-widest uppercase text-[#ff3355] bg-[#7A0010]/20 border border-[#7A0010]/40 px-2 py-0.5 rounded-xs">
              {badge || (customMediaUrl ? "UPLOADED ASSET" : "OFFICIAL ASSET")}
            </span>
            <span className="font-mono text-[0.55rem] tracking-wider uppercase text-[#b8b8b8]/60">
              CHANCHAL MATHARU
            </span>
          </div>

          {/* Center brand graphic */}
          <div className="my-auto py-4 flex flex-col items-center justify-center text-center z-10">
            <div className="w-11 h-11 rounded-full bg-[#1e0a12] border border-[#7A0010]/45 flex items-center justify-center text-[#ff3355] mb-3 shadow-[0_0_25px_rgba(122,0,16,0.25)] group-hover:scale-105 transition-transform">
              {isVideo ? <Film size={18} /> : <ImageIcon size={18} />}
            </div>
            <h4 className="font-heading text-lg sm:text-xl text-[#F1EDE5] tracking-tight mb-1">
              {projectTitle}
            </h4>
            {category && (
              <p className="font-mono text-[0.62rem] text-[#b8b8b8]/75 uppercase tracking-wider max-w-[18rem]">
                {category}
              </p>
            )}
          </div>

          {/* Bottom indicator */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3 z-10">
            <span className="font-mono text-[0.55rem] text-[#b8b8b8]/50 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A0010] animate-pulse" />
              Campaign Media Archive
            </span>
            <span className="font-mono text-[0.55rem] text-[#F1EDE5]/70">
              {label || "Chanchal M. Direction"}
            </span>
          </div>
        </div>
      )}

      {/* CHANGE / UPLOAD CONTROLS — Only visible in Editor mode */}
      {isEditor && mediaId && (
        <div
          className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5 opacity-90 group-hover/media:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {customMediaUrl && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset uploaded photo"
              className="px-2 py-1 text-[10px] font-mono uppercase text-[#b8b8b8]/80 hover:text-white bg-black/80 hover:bg-[#7A0010]/70 border border-white/15 rounded-xs backdrop-blur-md transition-colors cursor-pointer"
            >
              <RotateCcw size={10} className="inline mr-1" />
              RESET
            </button>
          )}

          <label
            className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase font-semibold text-white bg-[#7A0010]/90 hover:bg-[#990014] border border-[#ff3355]/40 rounded-xs shadow-lg backdrop-blur-md transition-all ${
              isUploading ? "opacity-75 pointer-events-none" : ""
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={12} className="animate-spin text-white" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <Camera size={12} />
                <span>CHANGE</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {/* Optional custom children overlay */}
      {children}
    </div>
  );
}
