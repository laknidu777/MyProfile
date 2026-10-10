"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import HeroOverlay from "../components/HeroOverlay";
import AboutSection from "../components/AboutSection";
import ResearchSection from "../components/ResearchSection";
import GamesSection from "../components/GamesSection";
import FreelanceSection from "../components/FreelanceSection";
import ProjectsSection from "../components/ProjectsSection";
import ExperienceSection from "../components/ExperienceSection";
import SkillsSection from "../components/SkillsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

type IntroState = "loading" | "playing_forward" | "showing_text" | "done";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  // States for intro and loading
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [introState, setIntroState] = useState<IntroState>("loading");
  
  // Total number of frames in the directory
  const frameCount = 300;
  const rafIdRef = useRef<number | null>(null);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/ezgif-6916cc84d1500b24-jpg/ezgif-frame-${paddedIndex}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / frameCount) * 100));
        
        if (loadedCount === frameCount) {
          setImages([...loadedImages]);
          setIsLoaded(true);
        }
      };
      
      loadedImages.push(img);
    }
  }, []);

  // Helper to draw a specific frame
  const drawFrame = (index: number) => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const currentImage = images[index];
    
    if (ctx && currentImage) {
      if (canvas.width !== currentImage.width) canvas.width = currentImage.width;
      if (canvas.height !== currentImage.height) canvas.height = currentImage.height;
      ctx.drawImage(currentImage, 0, 0);
    }
  };

  // 1a. Transition state when loaded
  useEffect(() => {
    if (isLoaded && introState === "loading") {
      setIntroState("playing_forward");
    }
  }, [isLoaded, introState]);

  // 1b. Play slower forward animation
  useEffect(() => {
    if (introState === "playing_forward") {
      let frame = 0;
      let lastTime = performance.now();
      const fps = 60;
      const frameInterval = 1000 / fps;
      
      const frameStep = 1; 

      const playIntro = (time: number) => {
        if (time - lastTime >= frameInterval) {
          frame += frameStep;
          
          if (frame >= frameCount - 1) {
            frame = frameCount - 1;
            drawFrame(frame);
            // Stop at arms crossed, transition to text
            setIntroState("showing_text");
            return; 
          }
          
          drawFrame(frame);
          lastTime = time;
        }
        
        rafIdRef.current = requestAnimationFrame(playIntro);
      };
      
      drawFrame(0);
      
      const timeoutId = setTimeout(() => {
        rafIdRef.current = requestAnimationFrame(playIntro);
      }, 500);
      
      return () => {
        clearTimeout(timeoutId);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    }
  }, [introState, images]);

  // 2. Handle Background Reset while showing text
  useEffect(() => {
    if (introState === "showing_text") {
      
      // Quietly reverse the canvas back to frame 0
      let frame = frameCount - 1;
      let lastTime = performance.now();
      const fps = 60;
      
      const backwardStep = 2;

      const resetCanvas = (time: number) => {
        if (time - lastTime >= 1000 / fps) {
          frame -= backwardStep;
          if (frame <= 0) {
            frame = 0;
            drawFrame(frame);
            return;
          }
          drawFrame(frame);
          lastTime = time;
        }
        rafIdRef.current = requestAnimationFrame(resetCanvas);
      };
      
      rafIdRef.current = requestAnimationFrame(resetCanvas);
      
      // Unlock scroll after a few seconds
      const timer = setTimeout(() => {
        setIntroState("done");
      }, 3500);
      
      return () => {
        clearTimeout(timer);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    }
  }, [introState]);

  // 3. Handle normal scroll animation after intro is done
  useEffect(() => {
    if (introState !== "done") return;

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
      
      const scrollFraction = maxScrollTop === 0 ? 0 : Math.max(0, Math.min(1, scrollTop / maxScrollTop));
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );

      requestAnimationFrame(() => drawFrame(frameIndex));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); 
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [introState, images]);

  // Prevent scrolling while intro is playing
  useEffect(() => {
    if (introState !== "done") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [introState]);

  return (
    <main className="bg-transparent min-h-screen text-gray-100 font-sans selection:bg-indigo-500/30">
      {introState === "done" && <Header />}
      
      {/* The fixed background canvas */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black -z-10 pointer-events-none">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover transition-opacity duration-1000 opacity-80 blur-none"
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          
          {/* Loading Indicator */}
          <div 
            className={`transition-opacity duration-700 absolute ${
              introState === "loading" ? "opacity-100" : "opacity-0"
            } flex flex-col items-center`}
          >
            <div className="text-white text-xl tracking-[0.3em] font-light mb-4">
              LOADING
            </div>
            <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out" 
                style={{ width: `${loadProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Intro Text that appears and then disappears */}
          <div 
            className={`transition-all duration-1000 absolute flex flex-col items-center justify-center px-6 ${
              introState === "showing_text" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
            }`}
          >
            <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl text-center">
              <span className="block text-2xl md:text-4xl text-gray-300 font-medium mb-4">Hi! I'm</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-500">
                Laknidu Thilakawardhana.
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      {introState === "done" && (
        <div className="relative z-20 bg-transparent">
          {/* Spacer to make the first page empty with a scroll down indicator */}
          <div className="w-full h-screen pointer-events-none flex flex-col items-center justify-end pb-12">
            <div className="animate-bounce flex flex-col items-center gap-2 text-white/50">
              <span className="text-sm font-medium tracking-widest uppercase">Scroll Down</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <HeroOverlay />
          <AboutSection />
          <ResearchSection />
          <GamesSection />
          <FreelanceSection />
          <ProjectsSection />
          <ExperienceSection />
          <SkillsSection />
          <ContactSection />
          <Footer />
        </div>
      )}
    </main>
  );
}
