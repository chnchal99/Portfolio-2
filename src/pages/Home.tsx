import { useEffect, useState, useRef, type CSSProperties, type MouseEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Film,
  Globe,
  Image as ImageIcon,
  Instagram,
  Menu,
  Play,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectMediaFrame } from "@/components/ProjectMediaFrame";
import chanchalPhotoAsset from "@/assets/images/chanchal_matharu_new.jpg";
import {
  isEditorMode,
  setEditorMode,
  recoverLegacyUploadedMedia,
  subscribeToMediaChanges,
  getCustomMedia,
} from "@/lib/mediaStore";
import {
  featuredProjects,
  additionalClientWork,
  contentLabCards,
  serviceCategories,
  credibilityRoles,
  pipelineStages,
  type PortfolioProject,
  type ProjectMediaItem,
} from "@/data/portfolioData";

function SectionEyebrow({ children, testId }: { children: string; testId: string }) {
  return (
    <span className="section-eyebrow" data-testid={testId}>
      <span className="eyebrow-accent" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function Home() {
  const [activeProjectId, setActiveProjectId] = useState<string>(featuredProjects[0].id);
  const [selectedModalProject, setSelectedModalProject] = useState<PortfolioProject | null>(null);
  const [modalActiveMedia, setModalActiveMedia] = useState<ProjectMediaItem | null>(null);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [studioTime, setStudioTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activePipelineStep, setActivePipelineStep] = useState<string>("01");

  const [form, setForm] = useState({
    name: "",
    email: "",
    roleOrBrand: "",
    message: "",
  });

  const [isEditorState, setIsEditorState] = useState<boolean>(() => isEditorMode());
  const [isDevOrLocal, setIsDevOrLocal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const dev =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host.includes("ais-dev-") ||
        Boolean(import.meta.env.DEV);
      setIsDevOrLocal(dev);
      setIsEditorState(isEditorMode());
    }

    // Automatically inspect browser localStorage and recover any previous uploads
    recoverLegacyUploadedMedia().then((count) => {
      if (count > 0) {
        console.log(`[MediaStore] Reconnected ${count} previously uploaded project images.`);
      }
    });

    const unsubscribe = subscribeToMediaChanges(() => {
      setIsEditorState(isEditorMode());
    });
    return unsubscribe;
  }, []);

  const previewRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Permanent verified portrait of Chanchal Matharu
  const permanentAboutPhoto = chanchalPhotoAsset || "/images/chanchal_matharu_new.jpg";

  // Real-time IST clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setStudioTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Preloader removal
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  // Sync modal active media when a new project is selected
  useEffect(() => {
    if (selectedModalProject) {
      if (selectedModalProject.mediaSet && selectedModalProject.mediaSet.length > 0) {
        setModalActiveMedia(selectedModalProject.mediaSet[0]);
      } else {
        setModalActiveMedia(null);
      }
    }
  }, [selectedModalProject]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedModalProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 60fps Kinetic Cursor & Ambient Darkroom Spotlight
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let spotlightX = -200;
    let spotlightY = -200;
    let rafId: number;
    let isVisible = false;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        if (cursorRef.current) cursorRef.current.style.opacity = "1";
        if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
      }

      const element = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const newLabel = (element?.dataset.cursor as string | undefined) ?? "";
      if (cursorLabelRef.current && cursorRef.current) {
        if (cursorLabelRef.current.textContent !== newLabel) {
          cursorLabelRef.current.textContent = newLabel;
          if (newLabel) {
            cursorRef.current.classList.add("has-label");
          } else {
            cursorRef.current.classList.remove("has-label");
          }
        }
      }
    };

    const handlePointerLeave = () => {
      isVisible = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
      if (cursorLabelRef.current) cursorLabelRef.current.textContent = "";
      cursorRef.current?.classList.remove("has-label");
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.28;
      currentY += (targetY - currentY) * 0.28;
      spotlightX += (targetX - spotlightX) * 0.12;
      spotlightY += (targetY - spotlightY) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${spotlightX}px, ${spotlightY}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Reveal animations on scroll
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Zero-cost DOM transform for preview tilt
  const handlePreviewMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    previewRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handlePreviewMouseLeave = () => {
    if (!previewRef.current) return;
    previewRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
  };

  const updateForm = (field: keyof typeof form, value: string) => {
    setSubmitted(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const activeProject = featuredProjects.find((p) => p.id === activeProjectId) ?? featuredProjects[0];
  const heroProjectOne = featuredProjects[0]; // Country Rolls
  const heroProjectTwo = featuredProjects[3] || featuredProjects[1]; // 10+ Creators Collective // Raipur or Shree Nandi's

  return (
    <div className="site-shell" data-testid="portfolio-page">
      {/* INITIAL PAGE PRELOADER */}
      <div
        className={`page-preloader ${isLoading ? "is-active" : "is-complete"}`}
        aria-hidden={!isLoading}
        data-testid="page-preloader"
      >
        <div className="preloader-inner">
          <div className="preloader-brand">
            <span>CHANCHAL MATHARU</span>
            <span className="red-period">.</span>
          </div>
          <div className="preloader-track" aria-hidden="true">
            <div className="preloader-bar" />
          </div>
          <div className="preloader-caption">
            <span>SMM & CONTENT STRATEGY</span>
            <span className="preloader-status">PORTFOLIO</span>
          </div>
        </div>
      </div>

      {/* AMBIENT KINETIC SPOTLIGHT (ZERO-LAG GPU ACCELERATED) */}
      <div ref={spotlightRef} className="cursor-spotlight" aria-hidden="true" />

      {/* LUXURY KINETIC CURSOR */}
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
        <span ref={cursorLabelRef} className="custom-cursor-label" />
      </div>

      {/* SITE HEADER */}
      <header className="site-header" data-testid="site-header">
        <a className="brand-mark" href="#top" data-testid="brand-mark-link" aria-label="CHANCHAL MATHARU home">
          <span data-testid="brand-mark-name">CHANCHAL MATHARU</span>
          <span className="brand-mark-slash" aria-hidden="true">/</span>
          <span className="brand-mark-caption" data-testid="brand-mark-caption">SMM & CONTENT STRATEGY</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation" data-testid="desktop-navigation">
          <a href="#work" data-testid="nav-work-link">Work</a>
          <a href="#methodology" data-testid="nav-method-link">Process</a>
          <a href="#clients" data-testid="nav-clients-link">Clients</a>
          <a href="#studio" data-testid="nav-studio-link">About</a>
          <a href="#services" data-testid="nav-services-link">Capabilities</a>
          <a href="#contact" data-testid="nav-contact-link">Contact</a>
        </nav>
        <a className="header-index" href="#contact" data-testid="header-index-link">
          <span className="audio-wave-visualizer" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>Open for content roles</span>
          <span className="index-dot" aria-hidden="true" />
        </a>
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-expanded={mobileNavOpen}
          aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          data-testid="mobile-menu-button"
        >
          {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        {mobileNavOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation" data-testid="mobile-navigation">
            <a href="#work" onClick={() => setMobileNavOpen(false)} data-testid="mobile-nav-work-link">Work</a>
            <a href="#methodology" onClick={() => setMobileNavOpen(false)} data-testid="mobile-nav-method-link">Process</a>
            <a href="#clients" onClick={() => setMobileNavOpen(false)} data-testid="mobile-nav-clients-link">Clients</a>
            <a href="#studio" onClick={() => setMobileNavOpen(false)} data-testid="mobile-nav-studio-link">About</a>
            <a href="#services" onClick={() => setMobileNavOpen(false)} data-testid="mobile-nav-services-link">Capabilities</a>
            <a href="#contact" onClick={() => setMobileNavOpen(false)} data-testid="mobile-nav-contact-link">Contact</a>
          </nav>
        )}
      </header>

      <main id="top">
        {/* HERO SECTION */}
        <section className={`hero-section ${!isLoading ? "hero-enter" : ""}`} aria-labelledby="hero-title" data-testid="hero-section">
          <div className="hero-ambient hero-ambient-one" aria-hidden="true" />
          <div className="hero-ambient hero-ambient-two" aria-hidden="true" />
          <div className="hero-grid-lines" aria-hidden="true" />

          <div className="hero-topline" data-testid="hero-topline">
            <span className="hero-topline-brand">
              <span className="hero-live-beacon" aria-hidden="true" />
              <span>CHANCHAL MATHARU</span>
            </span>
            <span>Strategy / Scripts / Shoots / Launches</span>
            <span className="hero-time-badge">
              <span className="text-[#888]">IST</span>
              <span className="hero-time-counter">{studioTime || "ACTIVE"}</span>
              <span className="hero-status-pill">OPEN FOR ROLES</span>
            </span>
          </div>

          <div className="hero-main-grid" data-testid="hero-main-grid">
            <div className="hero-copy">
              <p className="hero-kicker" data-testid="hero-kicker">
                Social Media Marketer & Content Strategist<span className="red-period">.</span>
              </p>
              <h1 id="hero-title" className="hero-title" data-testid="hero-title">
                <span className="hero-title-line">
                  <span>Content that</span>
                </span>
                <span className="hero-title-line hero-title-offset">
                  <span>
                    <em>shapes brands</em>
                    <span className="red-period">.</span>
                  </span>
                </span>
              </h1>
              <div className="hero-bottomline">
                <p data-testid="hero-description">
                  I turn brand ideas into social-first content, campaigns and experiences — from strategy and scripting to shoots, launches, influencer coordination and execution.
                </p>
                <a
                  className="round-arrow-link"
                  href="#work"
                  data-cursor="VIEW"
                  data-testid="hero-work-link"
                  aria-label="Explore featured case studies"
                >
                  <ArrowDownRight size={22} strokeWidth={1.2} />
                </a>
              </div>
            </div>

            {/* Media showcase connected to real project media */}
            <div className="hero-media-showcase" data-cursor="VIEW" data-testid="hero-media-stack">
              <div className="hero-showcase-cards">
                <article
                  className="hero-reel-card hero-reel-main group cursor-pointer"
                  data-testid="hero-reel-main"
                  onClick={() => setSelectedModalProject(heroProjectOne)}
                >
                  <ProjectMediaFrame
                    src={heroProjectOne.heroMedia}
                    alt={`${heroProjectOne.title} launch visual`}
                    projectTitle={heroProjectOne.title}
                    category={heroProjectOne.category}
                    badge="FEATURED LAUNCH"
                    showPlayBadge={true}
                    loading="eager"
                    mediaId="project-01-hero"
                    projectId={heroProjectOne.id}
                    isEditor={isEditorState}
                  />
                  <div className="hero-reel-overlay" />
                  <span data-testid="hero-reel-main-label">{heroProjectOne.title} // Launch</span>
                </article>

                <article
                  className="hero-reel-card hero-reel-secondary group cursor-pointer"
                  data-testid="hero-reel-secondary"
                  onClick={() => setSelectedModalProject(heroProjectTwo)}
                >
                  <ProjectMediaFrame
                    src={heroProjectTwo.heroMedia}
                    alt={`${heroProjectTwo.title} visual`}
                    projectTitle={heroProjectTwo.title}
                    category={heroProjectTwo.category}
                    badge="CAMPAIGN ROLLOUT"
                    showPlayBadge={false}
                    loading="eager"
                    mediaId={`${heroProjectTwo.id}-hero`}
                    projectId={heroProjectTwo.id}
                    isEditor={isEditorState}
                  />
                  <span data-testid="hero-reel-secondary-label">{heroProjectTwo.title}</span>
                </article>
              </div>

              <div className="hero-showcase-meta">
                <div className="hero-growth-card" data-testid="hero-growth-card">
                  <span data-testid="hero-growth-label">Workflow Scale</span>
                  <strong data-testid="hero-growth-value">8–9</strong>
                  <div className="growth-sparkline" aria-hidden="true">
                    <i /><i /><i /><i /><i /><i />
                  </div>
                  <small data-testid="hero-growth-note">Active clients handled</small>
                </div>
                <div className="hero-comment-card" data-testid="hero-comment-card">
                  <span className="comment-avatar" aria-hidden="true">CM</span>
                  <p data-testid="hero-comment-copy">
                    From research and scripting to shoots, creators and hype.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-ticker" aria-hidden="true" data-testid="hero-ticker">
            <div className="ticker-track">
              <span>RESEARCH &bull; STRATEGY &bull; SCRIPTING &bull; SHOOTS &bull; INFLUENCERS &bull; LAUNCHES &bull; HYPE &bull; RETENTION &bull;&nbsp;</span>
              <span>RESEARCH &bull; STRATEGY &bull; SCRIPTING &bull; SHOOTS &bull; INFLUENCERS &bull; LAUNCHES &bull; HYPE &bull; RETENTION &bull;&nbsp;</span>
            </div>
          </div>
        </section>

        {/* MANIFESTO / PIPELINE SECTION */}
        <section
          id="methodology"
          className="manifesto-section section-padding"
          data-reveal
          aria-labelledby="manifesto-title"
          data-testid="manifesto-section"
        >
          <div className="section-heading-row">
            <div>
              <SectionEyebrow testId="manifesto-eyebrow">Strategic Pipeline</SectionEyebrow>
              <h2 id="manifesto-title" className="manifesto-title" data-testid="manifesto-title">
                End-to-End <em>Execution</em>
              </h2>
            </div>
            <span className="technical-label" data-testid="manifesto-count">10-Phase Discipline</span>
          </div>

          <p className="manifesto-statement" data-testid="manifesto-quote">
            Great social marketing isn&apos;t just posting reels — it&apos;s architecting a narrative, planning the shoot, managing creators, and engineering launch hype that translates into real business footfall.
          </p>

          {/* Connected 10-Phase Pipeline Grid */}
          <div className="pipeline-flow" data-testid="pipeline-flow">
            <div className="pipeline-track-header">
              <span className="font-mono text-xs uppercase tracking-widest text-[#ff3355]">
                System Architecture
              </span>
              <span className="font-mono text-[0.68rem] text-[#b8b8b8]">
                Hover or select any phase to explore deliverables
              </span>
            </div>

            <div className="pipeline-grid" role="list">
              {pipelineStages.map((st) => {
                const isActive = activePipelineStep === st.step;
                return (
                  <div
                    key={st.step}
                    role="listitem"
                    className={`pipeline-card ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setActivePipelineStep(st.step)}
                    onClick={() => setActivePipelineStep(st.step)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setActivePipelineStep(st.step);
                    }}
                    data-testid={`pipeline-step-${st.step}`}
                  >
                    <div className="pipeline-card-accent-bar" aria-hidden="true" />

                    <div className="pipeline-card-top">
                      <div className="flex items-center gap-1.5">
                        <span className="pipeline-step-num font-mono">{st.step}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3355] animate-pulse shadow-[0_0_6px_#ff3355]" aria-hidden="true" />
                        )}
                      </div>
                      <span className="pipeline-step-phase font-mono">{st.phase}</span>
                    </div>

                    <div className="pipeline-card-body">
                      <h3 className="pipeline-step-name">{st.name}</h3>
                      <p className="pipeline-step-desc">{st.desc}</p>
                    </div>

                    <div className="pipeline-card-footer">
                      <div className="pipeline-deliverable-label font-mono">
                        <span className="pipeline-deliverable-dot" aria-hidden="true" />
                        Key Output
                      </div>
                      <p className="pipeline-deliverable-val font-mono">
                        {st.deliverable}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED WORK / CASE STUDIES */}
        <section
          id="work"
          className="work-section section-padding"
          data-reveal
          aria-labelledby="work-title"
          data-testid="work-section"
        >
          <div className="section-heading-row">
            <div>
              <SectionEyebrow testId="work-eyebrow">Featured Work</SectionEyebrow>
              <h2 id="work-title" className="section-title" data-testid="work-title">
                Ideas / <em>in motion</em>
              </h2>
            </div>
            <span className="technical-label" data-testid="work-count">04 Curated Projects</span>
          </div>

          <div className="work-layout">
            <div className="project-list" data-testid="project-list">
              {featuredProjects.map((project) => (
                <button
                  type="button"
                  key={project.id}
                  className={`project-row ${activeProjectId === project.id ? "is-active" : ""}`}
                  onMouseEnter={() => setActiveProjectId(project.id)}
                  onFocus={() => setActiveProjectId(project.id)}
                  onClick={() => {
                    setActiveProjectId(project.id);
                    setSelectedModalProject(project);
                  }}
                  data-cursor="VIEW"
                  data-testid={`${project.id}-button`}
                >
                  <span className="project-number" data-testid={`${project.id}-number`}>{project.number}</span>
                  <span className="project-name" data-testid={`${project.id}-name`}>{project.title}</span>
                  <span className="project-type" data-testid={`${project.id}-type`}>{project.category}</span>
                  <ArrowUpRight className="project-arrow" size={18} strokeWidth={1.2} aria-hidden="true" />
                </button>
              ))}
            </div>

            {/* Interactive Distortion/Tilt Preview */}
            <div
              ref={previewRef}
              className="project-preview group cursor-pointer"
              style={{
                "--project-color": activeProject.color,
              } as CSSProperties}
              onMouseMove={handlePreviewMouseMove}
              onMouseLeave={handlePreviewMouseLeave}
              data-testid="project-preview"
              onClick={() => setSelectedModalProject(activeProject)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedModalProject(activeProject);
              }}
            >
              <ProjectMediaFrame
                src={activeProject.heroMedia}
                alt={`${activeProject.title} project showcase`}
                projectTitle={activeProject.title}
                category={activeProject.category}
                badge={activeProject.metricLabel}
                className="w-full h-full"
                loading="lazy"
                mediaId={`${activeProject.id}-hero`}
                projectId={activeProject.id}
                isEditor={isEditorState}
              />
              <div className="project-preview-overlay" aria-hidden="true" />

              <div className="project-preview-caption">
                <div>
                  <span data-testid="project-preview-label">{activeProject.metricLabel}</span>
                  <strong data-testid="project-preview-title" className="block mt-1">{activeProject.metric}</strong>
                  <p className="text-[0.62rem] text-[#b8b8b8] mt-1 font-mono tracking-wide">{activeProject.scopeHighlight}</p>
                </div>
                <span className="text-[0.62rem] font-mono text-[#f1ede5] border border-white/20 px-2.5 py-1 uppercase tracking-wider bg-black/60 backdrop-blur-xs flex items-center gap-1.5">
                  View Case <ArrowUpRight size={11} />
                </span>
              </div>
              <span className="project-preview-index" data-testid="project-preview-index">
                {activeProject.number} / 04
              </span>
            </div>
          </div>
        </section>

        {/* WORKFLOW RESPONSIBILITY / INTERLUDE */}
        <section
          className="interlude-section"
          data-reveal
          aria-label="Workflow Scale & Responsibility"
          data-testid="interlude-section"
        >
          <div className="interlude-word interlude-word-top" data-testid="interlude-top-word" aria-hidden="true">
            STRATEGY
          </div>
          <div className="interlude-word interlude-word-bottom" data-testid="interlude-bottom-word" aria-hidden="true">
            EXECUTION
          </div>

          <div className="interlude-inner">
            <div className="interlude-eyebrow-row">
              <span className="interlude-pill font-mono">
                <span className="pill-dot" aria-hidden="true" />
                Operational Bandwidth &amp; Leadership
              </span>
            </div>

            <div className="metrics-cluster" data-testid="metrics-cluster">
              <div className="metric-tile metric-tile-main" data-testid="metric-tile-clients">
                <div className="metric-tile-head">
                  <span data-testid="metric-clients-label">Workflow Scale</span>
                  <span className="metric-badge font-mono">CONCURRENT</span>
                </div>
                <strong data-testid="metric-clients-value">8–9</strong>
                <small data-testid="metric-clients-note">Active retainer clients managed simultaneously without friction</small>
              </div>

              <div className="metric-tile" data-testid="metric-tile-team">
                <div className="metric-tile-head">
                  <span data-testid="metric-team-label">Team Coordination</span>
                  <span className="metric-badge font-mono">CROSS-FUNC</span>
                </div>
                <strong data-testid="metric-team-value">6</strong>
                <small data-testid="metric-team-note">Specialists orchestrated across scripts, cameras, edits &amp; styling</small>
              </div>

              <div className="metric-tile" data-testid="metric-tile-pipeline">
                <div className="metric-tile-head">
                  <span data-testid="metric-pipeline-label">Core Pipeline</span>
                  <span className="metric-badge font-mono">SYSTEM</span>
                </div>
                <strong data-testid="metric-pipeline-value" className="!text-3xl sm:!text-4xl font-mono">FLOW</strong>
                <small data-testid="metric-pipeline-note">Strategy → Content → Shoot → Execution</small>
              </div>
            </div>

            <div className="interlude-copy-wrap">
              <p className="interlude-copy" data-testid="interlude-copy">
                Scope of responsibility: Monthly Plans of Action, shoot planning, content calendars, client reviews &amp; on-time delivery.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT LABORATORY */}
        <section
          className="content-section section-padding"
          data-reveal
          aria-labelledby="content-title"
          data-testid="content-section"
        >
          <div className="section-heading-row content-heading-row">
            <div>
              <SectionEyebrow testId="content-eyebrow">Content Laboratory</SectionEyebrow>
              <h2 id="content-title" className="section-title" data-testid="content-title">
                Built to be <em>remembered</em>
              </h2>
            </div>
            <a href="#contact" className="text-arrow-link" data-testid="content-contact-link">
              Start a project <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="content-wall" data-testid="content-wall">
            {contentLabCards.map((card, index) => (
              <article
                className={`content-card ${card.className} group`}
                key={card.id}
                tabIndex={0}
                data-cursor="PLAY"
                data-testid={`${card.id}-card`}
              >
                <ProjectMediaFrame
                  src={card.mediaUrl}
                  alt={card.title}
                  projectTitle={card.label}
                  category={card.title}
                  badge="CONTENT PILLAR"
                  className="w-full h-full"
                  loading="lazy"
                  mediaId={card.id}
                  projectId="content-lab"
                  isEditor={isEditorState}
                />
                <div className="content-card-shade" aria-hidden="true" />
                <div className="content-card-meta">
                  <span data-testid={`${card.id}-label`}>{card.label}</span>
                  <Play size={14} fill="currentColor" aria-hidden="true" />
                </div>

                <div>
                  <h3 data-testid={`${card.id}-title`}>{card.title}</h3>
                  <p className="absolute bottom-4 left-5 right-5 text-[0.64rem] text-[#b8b8b8] font-mono leading-relaxed opacity-0 transition-opacity duration-300 hover:opacity-100 hidden sm:block">
                    {card.desc}
                  </p>
                </div>
                {index === 1 && (
                  <span className="content-card-stamp" data-testid={`${card.id}-stamp`}>
                    CONTENT LAB
                  </span>
                )}
              </article>
            ))}
          </div>

          <div className="content-marquee" aria-hidden="true" data-testid="content-marquee">
            <div className="content-marquee-track">
              <span>
                RESEARCH &bull; STRATEGY &bull; SCRIPTING &bull; SHOOTS &bull; INFLUENCERS &bull; LAUNCHES &bull; HYPE &bull; RETENTION &bull;&nbsp;
              </span>
              <span>
                RESEARCH &bull; STRATEGY &bull; SCRIPTING &bull; SHOOTS &bull; INFLUENCERS &bull; LAUNCHES &bull; HYPE &bull; RETENTION &bull;&nbsp;
              </span>
            </div>
            <div className="content-marquee-track" aria-hidden="true">
              <span>
                RESEARCH &bull; STRATEGY &bull; SCRIPTING &bull; SHOOTS &bull; INFLUENCERS &bull; LAUNCHES &bull; HYPE &bull; RETENTION &bull;&nbsp;
              </span>
              <span>
                RESEARCH &bull; STRATEGY &bull; SCRIPTING &bull; SHOOTS &bull; INFLUENCERS &bull; LAUNCHES &bull; HYPE &bull; RETENTION &bull;&nbsp;
              </span>
            </div>
          </div>
        </section>

        {/* SELECTED CLIENT WORK ROSTER */}
        <section
          id="clients"
          className="section-padding bg-[#080808] border-b border-[rgba(184,184,184,0.12)]"
          data-reveal
          aria-labelledby="clients-title"
          data-testid="clients-section"
        >
          <div className="section-heading-row">
            <div>
              <SectionEyebrow testId="clients-eyebrow">Client Diversity</SectionEyebrow>
              <h2 id="clients-title" className="section-title" data-testid="clients-title">
                Selected <em>Experience</em>
              </h2>
            </div>
            <span className="technical-label" data-testid="clients-count">Travel / Retail / B2B / Pets / F&amp;B / Wellness</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
            {additionalClientWork.map((client, idx) => (
              <div
                key={client.name}
                className="p-7 border border-[rgba(184,184,184,0.16)] bg-[#120B0E] flex flex-col justify-between hover:border-[#7A0010] hover:bg-[#1a0f14] transition-all duration-300"
                data-testid={`client-card-${idx}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[0.55rem] text-[#7A0010] uppercase tracking-wider block">
                      0{idx + 1} // Client Focus
                    </span>
                    <span className="font-mono text-[0.55rem] text-[#b8b8b8]/60 uppercase tracking-widest">
                      {client.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl text-[#F1EDE5] mb-2">{client.name}</h3>
                  <div className="font-mono text-[0.62rem] text-[#b8b8b8] uppercase tracking-wider mb-3 border-b border-[rgba(184,184,184,0.14)] pb-2.5">
                    {client.tagline}
                  </div>
                  <div className="mb-3 p-2.5 bg-black/40 border border-[#7A0010]/30 rounded-xs">
                    <span className="font-mono text-[0.58rem] text-[#ff3355] uppercase tracking-wider block mb-0.5">
                      My Role:
                    </span>
                    <p className="text-xs text-[#F1EDE5]/90 font-medium">
                      {client.myRole}
                    </p>
                  </div>
                  <p className="text-xs text-[#F1EDE5]/75 leading-relaxed font-sans">
                    {client.desc}
                  </p>
                </div>
                {client.instagramUrl && (
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="font-mono text-[0.58rem] text-[#b8b8b8]/60 uppercase tracking-wider">
                      Real Engagement
                    </span>
                    <a
                      href={client.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ff3355] hover:underline"
                    >
                      <span>Campaign</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>
            ))}

            <div
              className="p-7 border border-[#7A0010]/50 bg-gradient-to-b from-[#1a060e] to-[#120B0E] flex flex-col justify-between hover:border-[#ff3355] transition-all duration-300 md:col-span-2 lg:col-span-1 shadow-lg shadow-black/40 relative overflow-hidden group"
              data-testid="client-card-pipeline"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#7A0010]/15 rounded-bl-full pointer-events-none group-hover:bg-[#7A0010]/25 transition-colors" />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[0.55rem] text-[#ff3355] uppercase tracking-wider block">
                    09 // Strategic Breadth
                  </span>
                  <span className="font-mono text-[0.55rem] text-[#b8b8b8]/75 uppercase tracking-widest">
                    Archive &amp; Retainers
                  </span>
                </div>
                <h3 className="font-heading text-xl text-[#F1EDE5] mb-2">More In the Pipeline</h3>
                <div className="font-mono text-[0.62rem] text-[#b8b8b8] uppercase tracking-wider mb-3 border-b border-[rgba(184,184,184,0.14)] pb-2.5">
                  8–9 Concurrent Client Retainers
                </div>
                <div className="mb-3 p-2.5 bg-black/50 border border-[#7A0010]/40 rounded-xs">
                  <span className="font-mono text-[0.58rem] text-[#ff3355] uppercase tracking-wider block mb-0.5">
                    Strategic System:
                  </span>
                  <p className="text-xs text-[#F1EDE5]/90 font-medium">
                    End-to-End Retainer Oversight, Creator Networks &amp; On-Ground Production
                  </p>
                </div>
                <p className="text-xs text-[#F1EDE5]/75 leading-relaxed font-sans mb-4">
                  From single-day shoot marathons yielding 30 days of branded travel assets to educational B2B dealership content and multi-creator activations, my workflows adapt seamlessly across diverse business models.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="font-mono text-[0.55rem] px-2 py-0.5 bg-[#7A0010]/30 border border-[#7A0010]/50 text-[#F1EDE5]/90 rounded-xs">
                    Monthly POAs
                  </span>
                  <span className="font-mono text-[0.55rem] px-2 py-0.5 bg-[#7A0010]/30 border border-[#7A0010]/50 text-[#F1EDE5]/90 rounded-xs">
                    Creator Lineups
                  </span>
                  <span className="font-mono text-[0.55rem] px-2 py-0.5 bg-[#7A0010]/30 border border-[#7A0010]/50 text-[#F1EDE5]/90 rounded-xs">
                    Rapid Turnaround
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[0.58rem] text-[#b8b8b8]/80 uppercase tracking-wider">
                  Archive Available
                </span>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#ff3355] hover:text-[#ff6680] font-semibold transition-colors"
                  data-testid="pipeline-contact-link"
                >
                  <span>Request Full Roster</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* STUDIO / ABOUT SECTION */}
        <section
          id="studio"
          className="studio-section section-padding"
          data-reveal
          aria-labelledby="studio-title"
          data-testid="studio-section"
        >
          <div className="studio-image-wrap group">
            <div className="studio-image-frame relative">
              <ProjectMediaFrame
                src={permanentAboutPhoto}
                alt="Chanchal Matharu — Social Media Marketer & Content Strategist"
                projectTitle="Chanchal Matharu"
                category="Social Media Marketer & Content Strategist"
                badge="PORTRAIT"
                mediaId="chanchal-about-photo"
                projectId="about"
                className="w-full h-full"
                loading="lazy"
                isEditor={isEditorState}
              />
            </div>
            <div className="studio-image-note" data-testid="studio-image-note">
              Chanchal Matharu // Content Strategist
            </div>
          </div>

          <div className="studio-copy">
            <SectionEyebrow testId="studio-eyebrow">About Chanchal Matharu</SectionEyebrow>
            <h2 id="studio-title" className="studio-title" data-testid="studio-title">
              Hands-on strategy.<br />
              <em>Obsessive execution.</em>
            </h2>
            <p className="studio-description" data-testid="studio-description">
              I work at the intersection of content, social media, strategy and brand experiences. I believe in being personally involved beyond simply scheduling posts — starting with research and strategic angles, translating them into scripts and shoot schedules, directing influencer collaborations, and driving launches into sustained hype.
            </p>
            <p className="studio-description !mt-4 text-sm text-[#b8b8b8]">
              I already have hands-on experience driving real launches and multi-client workflows, and I am intentionally deepening my expertise in content strategy and creative storytelling. I am looking for forward-thinking opportunities where I can grow further in this discipline.
            </p>

            <div className="studio-stats" data-testid="studio-stats">
              <div>
                <strong>8–9</strong>
                <span>Active Clients</span>
              </div>
              <div>
                <strong>6</strong>
                <span>Team Coordinated</span>
              </div>
              <div>
                <strong>10+</strong>
                <span>Influencer Launches</span>
              </div>
            </div>

            <a href="#contact" className="text-arrow-link studio-link" data-testid="studio-contact-link">
              Discuss an opportunity <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* SERVICES / CAPABILITIES SECTION */}
        <section
          id="services"
          className="section-padding bg-[#120B0E] border-t border-[rgba(184,184,184,0.14)]"
          data-reveal
          aria-labelledby="services-title"
          data-testid="services-section"
        >
          <div className="section-heading-row">
            <div>
              <SectionEyebrow testId="services-eyebrow">Disciplines</SectionEyebrow>
              <h2 id="services-title" className="section-title" data-testid="services-title">
                What I <em>Deliver</em>
              </h2>
            </div>
            <span className="technical-label" data-testid="services-count">Comprehensive Capabilities</span>
          </div>

          <div className="services-list" data-testid="services-list">
            {serviceCategories.map((service, index) => (
              <span key={service.title} data-testid={`service-${index}`} className="flex flex-col !h-auto py-4">
                <strong className="text-white text-xs font-mono uppercase tracking-wider block mb-1">{service.title}</strong>
                <small className="text-[#b8b8b8] text-[0.62rem] font-mono normal-case tracking-normal">{service.items}</small>
              </span>
            ))}
          </div>
        </section>

        {/* CONCISE CREDIBILITY & PAST ROLES */}
        <section
          className="section-padding bg-[#080808] border-t border-[rgba(184,184,184,0.14)]"
          data-reveal
          aria-labelledby="experience-title"
          data-testid="experience-section"
        >
          <div className="section-heading-row">
            <div>
              <SectionEyebrow testId="experience-eyebrow">Track Record</SectionEyebrow>
              <h2 id="experience-title" className="section-title" data-testid="experience-title">
                Prior <em>Credibility</em>
              </h2>
            </div>
            <span className="technical-label" data-testid="experience-count">Proven Foundations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {credibilityRoles.map((role) => (
              <div
                key={role.role}
                className="p-7 border border-[rgba(184,184,184,0.18)] bg-[#242426]/30 flex flex-col justify-between hover:border-[#7A0010] transition-colors"
              >
                <div>
                  <span className="font-mono text-[0.55rem] text-[#7A0010] uppercase tracking-wider block mb-1.5">
                    {role.period}
                  </span>
                  <h3 className="font-heading text-lg text-[#F1EDE5] mb-1">{role.role}</h3>
                  <div className="font-mono text-[0.62rem] text-[#b8b8b8] uppercase tracking-wider mb-3.5">
                    {role.company}
                  </div>
                  <p className="text-xs text-[#F1EDE5]/75 leading-relaxed font-sans mb-5">
                    {role.summary}
                  </p>
                </div>
                <div className="pt-3.5 border-t border-[rgba(184,184,184,0.12)]">
                  <span className="font-mono text-[0.6rem] text-[#F1EDE5] block font-medium">
                    {role.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT / CTA SECTION */}
        <section
          id="contact"
          className="contact-section section-padding"
          data-reveal
          aria-labelledby="contact-title"
          data-testid="contact-section"
        >
          <div className="contact-heading">
            <SectionEyebrow testId="contact-eyebrow">Initiate Contact</SectionEyebrow>
            <h2 id="contact-title" className="contact-title" data-testid="contact-title">
              Ready to create <em>momentum?</em><br />
              Let&apos;s talk.
            </h2>
            <p data-testid="contact-description">
              Currently open to content strategy opportunities, full-time/retainer content roles, and high-impact social launches.
            </p>
            <div className="mt-8 space-y-3 font-mono text-xs text-[#F1EDE5]/85">
              <p className="flex items-center gap-2">
                <span className="text-[#7A0010]">//</span> Email:{" "}
                <a href="mailto:chnchal99@gmail.com" className="underline hover:text-white">
                  chnchal99@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#7A0010]">//</span> Direct Focus: Content Strategy, SMM, Video Systems
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#7A0010]">//</span> Availability: Open for new opportunities &amp; collaborations
              </p>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            data-testid="contact-form"
          >
            {submitted && (
              <div className="contact-success" role="status" data-testid="contact-success-message">
                <span>Message recorded.</span> Thank you for reaching out! You can also connect directly via chnchal99@gmail.com.
              </div>
            )}
            <label className="field-label" htmlFor="contact-name" data-testid="contact-name-label">
              Your name
            </label>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              placeholder="Jane Doe"
              required
              data-testid="contact-name-input"
            />

            <label className="field-label" htmlFor="contact-email" data-testid="contact-email-label">
              Your email
            </label>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              placeholder="jane@company.com"
              required
              data-testid="contact-email-input"
            />

            <label className="field-label" htmlFor="contact-role" data-testid="contact-role-label">
              Brand / Opportunity type
            </label>
            <Input
              id="contact-role"
              value={form.roleOrBrand}
              onChange={(event) => updateForm("roleOrBrand", event.target.value)}
              placeholder="e.g. Content Lead Role / Brand Launch / Campaign"
              data-testid="contact-role-input"
            />

            <label className="field-label" htmlFor="contact-message" data-testid="contact-message-label">
              Tell me about your goals
            </label>
            <Textarea
              id="contact-message"
              value={form.message}
              onChange={(event) => updateForm("message", event.target.value)}
              placeholder="Tell me about what you're building, the target audience, and how we can collaborate..."
              rows={4}
              required
              data-testid="contact-message-input"
            />

            <Button
              type="submit"
              className="send-button"
              data-cursor="VIEW"
              data-testid="contact-form-submit-button"
            >
              Send Message <ArrowUpRight size={16} />
            </Button>
            <span className="form-footnote" data-testid="contact-form-footnote">
              Responsive to all serious content, marketing and brand inquiries.
            </span>
          </form>
        </section>
      </main>

      {/* CLEAN PRODUCTION FOOTER */}
      <footer className="site-footer" data-testid="site-footer">
        <div className="footer-brand" data-testid="footer-brand">
          CHANCHAL MATHARU<span className="red-period">.</span>
        </div>
        <div className="footer-middle" data-testid="footer-middle">
          Social Media Marketer &amp; Content Strategist
          <span className="footer-rule" aria-hidden="true" />
        </div>
        <div className="footer-links">
          <a href="#top" data-testid="footer-top-link">
            Back to top <ArrowUpRight size={14} />
          </a>
          <span data-testid="footer-copyright">
            © {new Date().getFullYear()} CHANCHAL MATHARU
          </span>
          <a
            href="mailto:chnchal99@gmail.com"
            className="text-xs font-mono text-[#b8b8b8] hover:text-white transition-colors"
          >
            chnchal99@gmail.com
          </a>
        </div>
      </footer>

      {/* PROJECT DETAIL MODAL / ARCHIVE CASE STUDY */}
      {selectedModalProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedModalProject(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#080808] border border-[rgba(184,184,184,0.28)] p-6 sm:p-8 text-[#F1EDE5] shadow-2xl rounded-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedModalProject(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#b8b8b8] hover:text-white hover:border-[#7A0010] transition-colors"
              aria-label="Close project modal"
            >
              <X size={16} />
            </button>

            {/* Top metadata */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-[0.6rem] text-[#ff3355] uppercase tracking-widest bg-[#7A0010]/20 border border-[#7A0010]/40 px-2 py-0.5">
                Case Archive // {selectedModalProject.number}
              </span>
              {selectedModalProject.location && (
                <span className="font-mono text-[0.58rem] text-[#b8b8b8]/70 uppercase tracking-wider">
                  {selectedModalProject.location}
                </span>
              )}
              {selectedModalProject.timeframe && (
                <span className="font-mono text-[0.58rem] text-[#b8b8b8]/50 uppercase tracking-wider">
                  &bull; {selectedModalProject.timeframe}
                </span>
              )}
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight mb-1">
              {selectedModalProject.title}
            </h2>
            <div className="font-mono text-[0.65rem] text-[#b8b8b8] uppercase tracking-wider mb-5 pb-3 border-b border-white/10 flex items-center justify-between">
              <span>{selectedModalProject.category}</span>
              {selectedModalProject.instagramHandle && (
                <span className="text-[#ff3355]">{selectedModalProject.instagramHandle}</span>
              )}
            </div>

            {/* External Links Bar */}
            {(selectedModalProject.instagramUrl || selectedModalProject.websiteUrl) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedModalProject.instagramUrl && (
                  <a
                    href={selectedModalProject.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono bg-[#1a0f14] border border-[#7A0010]/50 text-[#ff3355] hover:bg-[#7A0010] hover:text-white transition-colors"
                  >
                    <Instagram size={12} />
                    <span>Instagram Profile</span>
                    <ExternalLink size={10} />
                  </a>
                )}
                {selectedModalProject.websiteUrl && (
                  <a
                    href={selectedModalProject.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono bg-white/5 border border-white/20 text-[#F1EDE5] hover:bg-white/15 transition-colors"
                  >
                    <Globe size={12} />
                    <span>Project Website</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            )}

            {/* Main Stage Media Frame */}
            <div className="relative aspect-video w-full overflow-hidden mb-4 border border-white/10 bg-[#0e080b]">
              <ProjectMediaFrame
                src={modalActiveMedia ? modalActiveMedia.url : selectedModalProject.heroMedia}
                alt={modalActiveMedia?.caption || selectedModalProject.title}
                projectTitle={selectedModalProject.title}
                category={modalActiveMedia?.caption || selectedModalProject.category}
                badge={modalActiveMedia?.category?.toUpperCase() || selectedModalProject.metricLabel}
                className="w-full h-full"
                showPlayBadge={Boolean(modalActiveMedia?.type === "video")}
                mediaId={modalActiveMedia ? modalActiveMedia.id : `${selectedModalProject.id}-hero`}
                projectId={selectedModalProject.id}
                isEditor={isEditorState}
              />

              <div className="absolute bottom-3 left-3 bg-[#080808]/90 px-3 py-1.5 border border-white/20 font-mono text-xs z-20">
                <span className="text-[#b8b8b8]">{selectedModalProject.metricLabel}:</span>{" "}
                <strong className="text-white">{selectedModalProject.metric}</strong>
              </div>
            </div>

            {/* Media Set Thumbnails (if project has multi-photo/video assets) */}
            {selectedModalProject.mediaSet && selectedModalProject.mediaSet.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-mono text-[0.65rem] uppercase tracking-widest text-[#b8b8b8] flex items-center gap-1.5">
                    <ImageIcon size={11} className="text-[#ff3355]" />
                    <span>Campaign Media Set ({selectedModalProject.mediaSet.length} Assets)</span>
                  </h4>
                  <span className="font-mono text-[0.6rem] text-[#b8b8b8]/60">
                    Click any asset to preview
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedModalProject.mediaSet.map((media) => {
                    const isCurrent = modalActiveMedia?.id === media.id;
                    const mediaSrc = getCustomMedia(media.id) || media.url;
                    return (
                      <button
                        type="button"
                        key={media.id}
                        onClick={() => setModalActiveMedia(media)}
                        className={`text-left p-2 border transition-all text-xs flex flex-col justify-between overflow-hidden ${
                          isCurrent
                            ? "border-[#ff3355] bg-[#1a0f14]"
                            : "border-white/10 bg-[#120B0E] hover:border-white/30"
                        }`}
                      >
                        {mediaSrc && (
                          <div className="w-full h-12 mb-1.5 overflow-hidden bg-black/40 rounded-xs border border-white/5">
                            <img
                              src={mediaSrc}
                              alt={media.caption || media.id}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[0.55rem] text-[#ff3355] uppercase tracking-wider">
                            {media.category || "Asset"}
                          </span>
                          {media.type === "video" ? <Film size={10} /> : <ImageIcon size={10} />}
                        </div>
                        <p className="line-clamp-2 text-[0.65rem] text-[#b8b8b8] font-mono leading-tight">
                          {media.caption || media.id}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* My Personal Role Banner */}
            <div className="mb-6 p-4 border border-[#7A0010]/40 bg-gradient-to-r from-[#1b0a10] to-[#0a0507]">
              <span className="font-mono text-[0.6rem] text-[#ff3355] uppercase tracking-widest block mb-1">
                // Chanchal Matharu Personal Scope &amp; Role
              </span>
              <p className="text-sm font-medium text-[#F1EDE5]">
                {selectedModalProject.myRole}
              </p>
            </div>

            {/* Strategic Challenge & Narrative */}
            <div className="space-y-4 text-sm font-sans text-[#F1EDE5]/90 leading-relaxed mb-6">
              <p>{selectedModalProject.story}</p>
            </div>

            {/* Execution Deliverables */}
            <div className="mb-6">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#b8b8b8] mb-3">
                Key Deliverables &amp; Execution
              </h4>
              <ul className="space-y-2">
                {selectedModalProject.myExecution.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#F1EDE5]/85">
                    <span className="text-[#ff3355] font-bold">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Offline Mechanics (if present) */}
            {selectedModalProject.offlineMechanics && (
              <div className="mb-6 p-4 border border-[rgba(184,184,184,0.18)] bg-[#120B0E]">
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#7A0010] mb-2">
                  Customer Engagement &amp; On-Ground Mechanics
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedModalProject.offlineMechanics.map((m, i) => (
                    <li key={i} className="text-[0.7rem] font-mono text-[#b8b8b8] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7A0010]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Campaign Reels & Videos */}
            {selectedModalProject.reels && selectedModalProject.reels.length > 0 && (
              <div className="mb-6">
                <h4 className="font-mono text-xs uppercase tracking-widest text-[#b8b8b8] mb-3">
                  Campaign Reels &amp; Video Formats ({selectedModalProject.reels.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedModalProject.reels.map((reel, i) => (
                    <a
                      key={i}
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono border border-white/20 hover:border-[#ff3355] hover:text-[#ff3355] transition-colors bg-[#242426]/50"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>{reel.title}</span>
                      {reel.tag && (
                        <span className="text-[0.55rem] text-[#ff3355] border border-[#ff3355]/40 px-1 rounded-xs">
                          {reel.tag}
                        </span>
                      )}
                      <ExternalLink size={10} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="font-mono text-[0.65rem] text-[#b8b8b8]">
                {selectedModalProject.note || "Real client archive — no fabricated metrics."}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs uppercase tracking-wider border-white/20 hover:bg-[#7A0010] hover:text-white"
                onClick={() => setSelectedModalProject(null)}
              >
                Close View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Editor mode toolbar / toggle — Hidden from visitors in published version */}
      {isEditorState && (
        <aside
          aria-label="Editor status controls"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 bg-black/90 border border-[#7A0010]/80 shadow-[0_4px_30px_rgba(122,0,16,0.45)] backdrop-blur-md rounded-full text-xs font-mono"
        >
          <span className="flex items-center gap-1.5 text-[#ff3355] font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#ff3355] animate-pulse" />
            EDITOR MODE
          </span>
          <span className="text-[#b8b8b8]/60 text-[10px] hidden md:inline">
            Click "CHANGE" on any card to upload real media
          </span>
          <button
            type="button"
            onClick={() => {
              setEditorMode(false);
              setIsEditorState(false);
            }}
            className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors"
          >
            Preview as Visitor
          </button>
        </aside>
      )}

      {/* In dev/local mode, if currently in visitor preview, allow toggling back to edit mode */}
      {!isEditorState && isDevOrLocal && (
        <button
          type="button"
          onClick={() => {
            setEditorMode(true);
            setIsEditorState(true);
          }}
          className="fixed bottom-4 right-4 z-50 px-3 py-1.5 bg-black/85 hover:bg-[#7A0010] border border-[#ff3355]/30 text-[#b8b8b8] hover:text-white rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer shadow-lg backdrop-blur-xs flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3355]" />
          <span>CHANGE PHOTOS</span>
        </button>
      )}
    </div>
  );
}
