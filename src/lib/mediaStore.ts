import initialStore from "@/data/project-media-store.json";

// In-memory cache of resolved media URLs
const memoryStore: Record<string, string> = { ...initialStore };

// Unified alias groupings for all projects so any slot mirrors to hero and vice-versa
export const MEDIA_ALIASES: Record<string, string[]> = {
  // Project 01 — Country Rolls
  "project-01-hero": ["cr-launch-01", "country-rolls-hero", "cr-food-01", "cr-influencer-01", "cr-offline-01"],
  "country-rolls-hero": ["project-01-hero", "cr-launch-01"],
  "cr-launch-01": ["project-01-hero", "country-rolls-hero"],

  // Project 02 — Shree Nandi's Sweets
  "project-02-hero": ["sn-launch-01", "shree-nandis-hero", "sn-influencer-01", "sn-food-01"],
  "shree-nandis-hero": ["project-02-hero", "sn-launch-01"],
  "sn-launch-01": ["project-02-hero", "shree-nandis-hero"],

  // Project 03 — Coffee Co @ 7th Gear
  "project-03-hero": ["cc-relaunch-01", "coffee-co-hero", "cc-event-01"],
  "coffee-co-hero": ["project-03-hero", "cc-relaunch-01"],
  "cc-relaunch-01": ["project-03-hero", "coffee-co-hero"],

  // Project 04 — 10+ Creators Raipur
  "project-04-hero": ["crp-lineup-01", "creators-raipur-hero"],
  "creators-raipur-hero": ["project-04-hero", "crp-lineup-01"],
  "crp-lineup-01": ["project-04-hero", "creators-raipur-hero"],

  // Content Lab
  "lab-01": ["content-01", "lab-01"],
  "content-01": ["lab-01", "content-01"],
  "lab-02": ["content-02", "lab-02"],
  "content-02": ["lab-02", "content-02"],
  "lab-03": ["content-03", "lab-03"],
  "content-03": ["lab-03", "content-03"],

  // About
  "chanchal-about-photo": ["about-photo", "chanchal-portrait"],
  "about-photo": ["chanchal-about-photo"],
};

// Listeners for real-time reactivity
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => {
    try {
      l();
    } catch {
      // ignore listener error
    }
  });
}

/**
 * Checks whether the user is in Editor Mode (where CHANGE buttons are visible)
 * vs Published/Visitor mode (where CHANGE buttons are completely hidden).
 */
export function isEditorMode(): boolean {
  if (typeof window === "undefined") return false;

  // 1. Explicit query parameter override: ?edit=true or ?editor=true
  const params = new URLSearchParams(window.location.search);
  if (params.get("edit") === "true" || params.get("editor") === "true") return true;
  if (params.get("edit") === "false" || params.get("visitor") === "true") return false;

  // 2. Saved editor mode in localStorage
  try {
    const saved = localStorage.getItem("chanchal_portfolio_edit_mode");
    if (saved === "true") return true;
    if (saved === "false") return false;
  } catch {
    // localStorage might be unavailable
  }

  // 3. AI Studio development environment or localhost
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host.includes("ais-dev-")) {
    return true;
  }

  // 4. Vite DEV flag
  return Boolean(import.meta.env.DEV);
}

export function setEditorMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("chanchal_portfolio_edit_mode", enabled ? "true" : "false");
  } catch {
    // ignore
  }
  notify();
}

/**
 * Get media URL by mediaId (e.g. "project-02-hero", "sn-launch-01", "shree-nandis-hero", etc.)
 * Resolves across memoryStore, localStorage, and defined aliases.
 */
export function getCustomMedia(mediaId: string): string | null {
  if (!mediaId) return null;

  const candidateKeys = [mediaId, ...(MEDIA_ALIASES[mediaId] || [])];

  // 1. Check memory store across candidate keys
  for (const key of candidateKeys) {
    if (memoryStore[key]) {
      // Propagate to original requested mediaId
      if (key !== mediaId) memoryStore[mediaId] = memoryStore[key];
      return memoryStore[key];
    }
  }

  // 2. Check localStorage across candidate keys
  if (typeof window !== "undefined") {
    for (const key of candidateKeys) {
      try {
        const local = localStorage.getItem(`portfolio_media_${key}`);
        if (local) {
          memoryStore[mediaId] = local;
          memoryStore[key] = local;
          return local;
        }
      } catch {
        // ignore
      }
    }
  }

  return null;
}

/**
 * Upload an image for a specific media slot.
 * Automatically synchronizes across all aliases in memory, localStorage, and backend.
 */
export async function uploadCustomMedia(
  mediaId: string,
  projectId: string,
  file: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const allKeys = Array.from(new Set([mediaId, ...(MEDIA_ALIASES[mediaId] || [])]));

      // 1. Immediately store in memory and localStorage for zero-latency preview
      allKeys.forEach((key) => {
        memoryStore[key] = dataUrl;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`portfolio_media_${key}`, dataUrl);
          } catch {
            // ignore quota errors
          }
        }
      });
      notify();

      // 2. Persist to server / static files so it survives refresh & build
      try {
        const response = await fetch("/api/upload-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaId,
            projectId,
            dataUrl,
            filename: file.name,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.url) {
            allKeys.forEach((key) => {
              memoryStore[key] = resData.url;
              if (typeof window !== "undefined") {
                try {
                  localStorage.setItem(`portfolio_media_${key}`, resData.url);
                } catch {
                  // ignore
                }
              }
            });
            notify();
            resolve(resData.url);
            return;
          }
        }
      } catch (err) {
        console.warn("Server persistence endpoint unavailable, using optimistic cache", err);
      }

      // If server write failed or in static mode, dataUrl works
      resolve(dataUrl);
    };

    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Delete / Reset a custom media item and its aliases
 */
export async function deleteCustomMedia(mediaId: string): Promise<void> {
  const allKeys = Array.from(new Set([mediaId, ...(MEDIA_ALIASES[mediaId] || [])]));

  allKeys.forEach((key) => {
    delete memoryStore[key];
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`portfolio_media_${key}`);
      } catch {
        // ignore
      }
    }
  });
  notify();

  try {
    await fetch("/api/delete-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId }),
    });
  } catch {
    // ignore
  }
}

/**
 * Subscribe to store changes
 */
export function subscribeToMediaChanges(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Automatically inspects browser localStorage and server store on boot to recover any
 * previously uploaded images and reconnect them to all matching project slots.
 */
export async function recoverLegacyUploadedMedia(): Promise<number> {
  let recoveredCount = 0;

  // 1. Fetch server-stored media registry on boot
  try {
    const res = await fetch("/api/project-media");
    if (res.ok) {
      const serverMedia = await res.json();
      for (const [k, v] of Object.entries(serverMedia)) {
        if (typeof v === "string") {
          const keysToSet = Array.from(new Set([k, ...(MEDIA_ALIASES[k] || [])]));
          for (const targetKey of keysToSet) {
            if (!memoryStore[targetKey] || memoryStore[targetKey] !== v) {
              memoryStore[targetKey] = v;
              if (typeof window !== "undefined") {
                try {
                  localStorage.setItem(`portfolio_media_${targetKey}`, v);
                } catch {
                  // ignore
                }
              }
              recoveredCount++;
            }
          }
        }
      }
    }
  } catch {
    // ignore network err
  }

  // 2. Scan localStorage for any base64 uploads or orphaned keys
  if (typeof window !== "undefined") {
    const projectPatterns: Array<{ pattern: RegExp; keys: string[]; projectId: string }> = [
      {
        pattern: /(country[_-]?rolls|project[_-]?01|cr[_-]?)/i,
        keys: ["project-01-hero", "country-rolls-hero", "cr-launch-01"],
        projectId: "country-rolls",
      },
      {
        pattern: /(shree[_-]?nandi|project[_-]?02|sn[_-]?)/i,
        keys: ["project-02-hero", "shree-nandis-hero", "sn-launch-01"],
        projectId: "shree-nandis",
      },
      {
        pattern: /(coffee|7th[_-]?gear|bomdia|project[_-]?03|cc[_-]?)/i,
        keys: ["project-03-hero", "coffee-co-hero", "cc-relaunch-01"],
        projectId: "coffee-co-7th-gear",
      },
      {
        pattern: /(creator|raipur|project[_-]?04|crp[_-]?)/i,
        keys: ["project-04-hero", "creators-raipur-hero", "crp-lineup-01"],
        projectId: "creators-raipur",
      },
      {
        pattern: /(travel|project[_-]?05)/i,
        keys: ["travel-hero"],
        projectId: "travel",
      },
      {
        pattern: /(pets|island|project[_-]?06)/i,
        keys: ["pets-island-hero"],
        projectId: "pets-island",
      },
      {
        pattern: /(sunnest|power|project[_-]?07)/i,
        keys: ["sunnest-power-hero"],
        projectId: "sunnest-power",
      },
      {
        pattern: /(naturelite|foods|project[_-]?08)/i,
        keys: ["naturelite-foods-hero"],
        projectId: "naturelite-foods",
      },
      {
        pattern: /(stay[_-]?beyond|project[_-]?09)/i,
        keys: ["stay-beyond-hero"],
        projectId: "stay-beyond",
      },
      {
        pattern: /(podcaster|meet|project[_-]?10)/i,
        keys: ["podcasters-meet-hero"],
        projectId: "podcasters-meet",
      },
      {
        pattern: /(content[_-]?lab[_-]?01|content[_-]?01|lab-01)/i,
        keys: ["content-01", "lab-01"],
        projectId: "content-lab",
      },
      {
        pattern: /(content[_-]?lab[_-]?02|content[_-]?02|lab-02)/i,
        keys: ["content-02", "lab-02"],
        projectId: "content-lab",
      },
      {
        pattern: /(content[_-]?lab[_-]?03|content[_-]?03|lab-03)/i,
        keys: ["content-03", "lab-03"],
        projectId: "content-lab",
      },
      {
        pattern: /(chanchal|portrait|about[_-]?photo)/i,
        keys: ["chanchal-about-photo"],
        projectId: "about",
      },
    ];

    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        const val = localStorage.getItem(key);
        if (!val) continue;

        let resolvedUrl: string | null = null;
        if (val.startsWith("data:image/") || val.startsWith("/images/")) {
          resolvedUrl = val;
        } else if (val.includes("data:image/")) {
          const match = val.match(/data:image\/[a-zA-Z0-9+]+;base64,[^"'\s]+/);
          if (match) resolvedUrl = match[0];
        }

        if (resolvedUrl) {
          for (const item of projectPatterns) {
            if (item.pattern.test(key)) {
              for (const targetKey of item.keys) {
                if (!memoryStore[targetKey]) {
                  memoryStore[targetKey] = resolvedUrl;
                  try {
                    localStorage.setItem(`portfolio_media_${targetKey}`, resolvedUrl);
                  } catch {
                    // ignore
                  }
                  recoveredCount++;
                }
              }
              break;
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  if (recoveredCount > 0) {
    notify();
  }

  return recoveredCount;
}
