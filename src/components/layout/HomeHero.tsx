"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BURG       = "#7B1D2A";
const BURG_DEEP  = "#5C1320";
const BURG_MID   = "#8E2535";
const GOLD       = "#C9A96E";
const GOLD_LIGHT = "#E8C98A";
const CREAM      = "#F5EDE0";

const PHOTOS = [
  "/hero/hero1.jpg",
  "/hero/hero2.jpg",
  "/hero/hero3.jpg",
];

const HERO_CSS = `
@keyframes heroDrift {
  0%,100% { transform:scale(1.06) translate(0%,0%); }
  35%      { transform:scale(1.10) translate(-1.5%,1.5%); }
  70%      { transform:scale(1.08) translate(1.5%,-1%); }
}
@keyframes heroFadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes heroFadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
@keyframes heroScanLine { 0%{left:-100%} 100%{left:100%} }
@keyframes heroGrain    { 0%{transform:translate(0,0)} 25%{transform:translate(-5%,-3%)} 50%{transform:translate(3%,4%)} 75%{transform:translate(-2%,2%)} }
@keyframes heroTwinkle  { 0%,100%{opacity:0;transform:translateY(0) scale(.5)} 50%{opacity:.38;transform:translateY(-20px) scale(1)} }
@keyframes heroBarPulse { from{height:3px} to{height:var(--h,12px)} }

.hero-fade-up-1  { opacity:0; animation:heroFadeUp 1s ease forwards .4s; }
.hero-fade-up-2  { opacity:0; animation:heroFadeUp 1.2s ease forwards .8s; }
.hero-fade-up-3  { opacity:0; animation:heroFadeUp 1s ease forwards 1.4s; }
.hero-fade-up-4  { opacity:0; animation:heroFadeUp 1s ease forwards 1.6s; }
.hero-fade-up-5  { opacity:0; animation:heroFadeUp 1s ease forwards 2s; }
.hero-fade-up-6  { opacity:0; animation:heroFadeUp 1s ease forwards 2.8s; }
.hero-fade-up-7  { opacity:0; animation:heroFadeUp 1s ease forwards 3s; }
.hero-fade-up-8  { opacity:0; animation:heroFadeUp 1s ease forwards 3.2s; }
.hero-fade-down-1{ opacity:0; animation:heroFadeDown 1s ease forwards .2s; }
.hero-fade-down-2{ opacity:0; animation:heroFadeDown 1s ease forwards 1s; }

.hero-grain {
  position:absolute;inset:0;opacity:.03;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:heroGrain .4s steps(1) infinite;
}

.hero-scan-line::after {
  content:'';position:absolute;top:0;left:-100%;
  width:100%;height:100%;background:${GOLD_LIGHT};
  animation:heroScanLine 2.5s ease-in-out infinite 3s;
}

.hero-bar {
  width:2px;border-radius:1px;background:currentColor;
  animation:heroBarPulse var(--d,.8s) ease-in-out infinite var(--dl,0s) alternate;
}
.hero-bar.paused { animation-play-state:paused!important; height:3px!important; }
`;

function spawnParticles(container: HTMLElement, count: number) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.style.cssText = `
      position:absolute;width:2px;height:2px;border-radius:50%;
      background:${GOLD_LIGHT};opacity:0;
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      animation:heroTwinkle ${7 + Math.random() * 8}s ease-in-out infinite ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}

// ── Web Audio nature sounds ──────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let audioPlaying = false;

function buildNatureSounds() {
  audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

  function makeReverb(dur: number, decay: number) {
    const len = audioCtx!.sampleRate * dur;
    const buf = audioCtx!.createBuffer(2, len, audioCtx!.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    const cv = audioCtx!.createConvolver();
    cv.buffer = buf;
    return cv;
  }
  const reverb  = makeReverb(4, 2.5);
  const rvGain  = audioCtx.createGain(); rvGain.gain.value  = 0.6;
  const dryGain = audioCtx.createGain(); dryGain.gain.value = 0.4;

  // Rain
  const rainBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
  const rd = rainBuf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i=0;i<rd.length;i++) {
    const w=Math.random()*2-1;
    b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.96900*b2+w*.153852;
    b3=.86650*b3+w*.3104856;b4=.55000*b4+w*.5329522;b5=-.7616*b5-w*.016898;
    rd[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926;
  }
  const rainSrc = audioCtx.createBufferSource();
  rainSrc.buffer = rainBuf; rainSrc.loop = true;
  const hpf = audioCtx.createBiquadFilter(); hpf.type="highpass"; hpf.frequency.value=800;
  const lpf = audioCtx.createBiquadFilter(); lpf.type="lowpass";  lpf.frequency.value=8000;
  const rg  = audioCtx.createGain(); rg.gain.value=.35;
  rainSrc.connect(hpf);hpf.connect(lpf);lpf.connect(rg);rg.connect(dryGain);rg.connect(reverb);
  rainSrc.start();

  function rainDrop() {
    if (!audioPlaying||!audioCtx) return;
    const o=audioCtx.createOscillator(),eg=audioCtx.createGain(),f=audioCtx.createBiquadFilter();
    f.type="bandpass";f.frequency.value=800+Math.random()*1200;f.Q.value=8;
    o.type="sine";
    o.frequency.setValueAtTime(600+Math.random()*800,audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(200+Math.random()*200,audioCtx.currentTime+.25);
    eg.gain.setValueAtTime(.04+Math.random()*.04,audioCtx.currentTime);
    eg.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.3);
    o.connect(f);f.connect(eg);eg.connect(reverb);o.start();o.stop(audioCtx.currentTime+.35);
    setTimeout(rainDrop,120+Math.random()*600);
  }
  setTimeout(rainDrop,400);

  function chirp() {
    if (!audioPlaying||!audioCtx) return;
    const o=audioCtx.createOscillator(),eg=audioCtx.createGain();
    const base=1800+Math.random()*1400;
    o.type="sine";
    o.frequency.setValueAtTime(base,audioCtx.currentTime);
    o.frequency.linearRampToValueAtTime(base*1.18,audioCtx.currentTime+.08);
    o.frequency.linearRampToValueAtTime(base*.92,audioCtx.currentTime+.18);
    o.frequency.linearRampToValueAtTime(base*1.1,audioCtx.currentTime+.28);
    eg.gain.setValueAtTime(0,audioCtx.currentTime);
    eg.gain.linearRampToValueAtTime(.022+Math.random()*.015,audioCtx.currentTime+.04);
    eg.gain.setValueAtTime(.022,audioCtx.currentTime+.22);
    eg.gain.linearRampToValueAtTime(0,audioCtx.currentTime+.35);
    o.connect(eg);eg.connect(reverb);eg.connect(dryGain);o.start();o.stop(audioCtx.currentTime+.4);
    setTimeout(chirp,2500+Math.random()*5000);
  }
  setTimeout(chirp,1000);

  dryGain.connect(masterGain!);
  reverb.connect(rvGain);rvGain.connect(masterGain!);
  masterGain!.connect(audioCtx.destination);
}

export default function HomeHero() {
  const [photoIdx, setPhotoIdx]   = useState(0);
  const [photoFade, setPhotoFade] = useState(true);
  const [musicOn, setMusicOn]     = useState(false);
  const dustLeftRef  = useRef<HTMLDivElement>(null);
  const dustRightRef = useRef<HTMLDivElement>(null);
  const parallaxRef  = useRef<HTMLDivElement>(null);

  // Spawn dust
  useEffect(() => {
    if (dustLeftRef.current)  spawnParticles(dustLeftRef.current,  26);
    if (dustRightRef.current) spawnParticles(dustRightRef.current, 20);
  }, []);

  // Photo cycling
  useEffect(() => {
    const id = setInterval(() => {
      setPhotoFade(false);
      setTimeout(() => {
        setPhotoIdx(i => (i + 1) % PHOTOS.length);
        setPhotoFade(true);
      }, 1200);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
      el.style.transform = `translate(${dx * 5}px,${dy * 5}px)`;
      el.style.transition = "transform 2.2s ease";
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const toggleMusic = () => {
    if (!audioCtx) buildNatureSounds();
    if (!audioPlaying) {
      audioPlaying = true;
      setMusicOn(true);
      masterGain!.gain.setValueAtTime(masterGain!.gain.value, audioCtx!.currentTime);
      masterGain!.gain.linearRampToValueAtTime(1, audioCtx!.currentTime + 1.8);
      if (audioCtx!.state === "suspended") audioCtx!.resume();
    } else {
      audioPlaying = false;
      setMusicOn(false);
      masterGain!.gain.setValueAtTime(masterGain!.gain.value, audioCtx!.currentTime);
      masterGain!.gain.linearRampToValueAtTime(0, audioCtx!.currentTime + 1.2);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      <section
        aria-label="Presentación"
        style={{ width: "100%", minHeight: "100svh", background: BURG_DEEP, overflow: "hidden", position: "relative" }}
        className="grid grid-cols-1 md:grid-cols-2"
      >

        {/* ══ LEFT ══ */}
        <div style={{
          position: "relative",
          background: `linear-gradient(145deg, ${BURG_MID} 0%, ${BURG} 50%, ${BURG_DEEP} 100%)`,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "72px 64px", zIndex: 2, overflow: "hidden",
        }}
          className="max-md:col-span-1 max-md:px-6 max-md:py-16 max-md:justify-center"
        >
          {/* Gold glow */}
          <div style={{ position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 60% at 38% 48%, rgba(232,201,138,.10) 0%, transparent 70%)`,pointerEvents:"none" }} />

          {/* Diagonal edge — desktop only */}
          <div className="max-md:hidden" style={{
            position:"absolute",top:0,right:"-58px",bottom:0,width:"116px",
            background:`linear-gradient(145deg, ${BURG_MID} 0%, ${BURG} 50%, ${BURG_DEEP} 100%)`,
            clipPath:"polygon(0 0, 42% 0, 100% 100%, 0 100%)", zIndex:3,
          }} />

          {/* Constellation */}
          <svg style={{ position:"absolute",inset:0,zIndex:0,pointerEvents:"none",width:"100%",height:"100%" }} viewBox="0 0 720 900" preserveAspectRatio="xMidYMid slice">
            <g stroke="rgba(232,201,138,.14)" strokeWidth=".8" fill="none">
              <line x1="80" y1="120" x2="380" y2="300"/>
              <line x1="380" y1="300" x2="640" y2="180"/>
              <line x1="380" y1="300" x2="320" y2="560"/>
              <line x1="320" y1="560" x2="60"  y2="700"/>
              <line x1="320" y1="560" x2="600" y2="750"/>
              <line x1="200" y1="80"  x2="320" y2="560"/>
            </g>
            <g fill="rgba(232,201,138,.32)">
              <circle cx="80"  cy="120" r="2.5"/>
              <circle cx="380" cy="300" r="3.5"/>
              <circle cx="640" cy="180" r="2"/>
              <circle cx="320" cy="560" r="3"/>
              <circle cx="60"  cy="700" r="2"/>
              <circle cx="600" cy="750" r="2.5"/>
              <circle cx="200" cy="80"  r="2"/>
            </g>
          </svg>

          {/* Dust */}
          <div ref={dustLeftRef} style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:1,overflow:"hidden" }} />

          {/* Content */}
          <div style={{ position:"relative",zIndex:5 }}>
            {/* Eyebrow */}
            <div className="hero-fade-up-1" style={{ display:"inline-flex",alignItems:"center",gap:"10px",marginBottom:"28px" }}>
              <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:GOLD_LIGHT,display:"inline-block",flexShrink:0 }} />
              <span style={{ fontFamily:"sans-serif",fontWeight:400,fontSize:"11px",letterSpacing:"0.28em",color:GOLD_LIGHT,textTransform:"uppercase" }}>
                Test gratuito · 2 minutos
              </span>
            </div>

            {/* H1 */}
            <h1 className="hero-fade-up-2" style={{ fontFamily:"Georgia,serif",fontWeight:400,fontSize:"clamp(40px,5vw,68px)",lineHeight:1.1,color:CREAM,marginBottom:0 }}>
              El hábito más fácil de crear:<br />
              <em style={{ fontStyle:"italic",color:GOLD_LIGHT,fontWeight:400 }}>comer rico y sentirte mejor.</em>
            </h1>

            {/* Divider */}
            <div className="hero-fade-up-3" style={{ width:"48px",height:"1px",background:`linear-gradient(90deg,${GOLD},transparent)`,margin:"26px 0" }} />

            {/* Sub */}
            <p className="hero-fade-up-4" style={{ fontFamily:"Georgia,serif",fontWeight:300,fontSize:"clamp(15px,1.3vw,18px)",lineHeight:1.65,color:"rgba(245,237,224,.72)",maxWidth:"380px" }}>
              Comida funcional para el eje intestino-cerebro. Cada receta nutre y actúa — sobre tu energía, tu estado de ánimo y tus hábitos. Sin esfuerzo. Solo placer.
            </p>

            {/* CTAs */}
            <div className="hero-fade-up-5" style={{ marginTop:"36px",display:"flex",flexDirection:"column",gap:"14px",alignItems:"flex-start" }}>
              <Link
                href="/test"
                style={{ fontFamily:"sans-serif",fontWeight:500,fontSize:"13px",letterSpacing:"0.18em",textTransform:"uppercase",color:BURG_DEEP,background:GOLD_LIGHT,padding:"16px 36px",display:"inline-block",textDecoration:"none",transition:"background .25s",borderRadius:"2px" }}
                onMouseEnter={e => (e.currentTarget.style.background = CREAM)}
                onMouseLeave={e => (e.currentTarget.style.background = GOLD_LIGHT)}
              >
                Descubre tu estado ahora →
              </Link>
              <a
                href="#como-funciona"
                style={{ fontFamily:"sans-serif",fontWeight:200,fontSize:"11px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(245,237,224,.4)",textDecoration:"none",display:"flex",alignItems:"center",gap:"6px",transition:"color .25s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,237,224,.75)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,237,224,.4)")}
              >
                Ver cómo funciona ↓
              </a>
            </div>

          </div>

          {/* Scroll hint */}
          <div className="hero-fade-up-7 max-md:hidden" style={{ position:"absolute",bottom:"30px",left:"64px",display:"flex",alignItems:"center",gap:"10px" }}>
            <div style={{ width:"32px",height:"1px",background:"rgba(245,237,224,.18)",position:"relative",overflow:"hidden" }} className="hero-scan-line" />
            <span style={{ fontFamily:"sans-serif",fontWeight:200,fontSize:"10px",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(245,237,224,.36)" }}>Explorar</span>
          </div>
        </div>

        {/* ══ RIGHT — PHOTO (desktop only) ══ */}
        <div style={{ position:"relative",overflow:"hidden",background:BURG_DEEP }} className="max-md:hidden">
          {/* Photo */}
          <div ref={parallaxRef} style={{
            position:"absolute",inset:"-5%",
            transition:"opacity 1.2s ease",
            opacity: photoFade ? 1 : 0,
            animation:"heroDrift 28s ease-in-out infinite",
          }}>
            <Image
              src={PHOTOS[photoIdx]}
              alt=""
              fill
              style={{ objectFit:"cover", objectPosition:"center" }}
              priority={photoIdx === 0}
              sizes="50vw"
            />
          </div>
          {/* Overlays */}
          <div style={{ position:"absolute",inset:0,background:`linear-gradient(135deg,rgba(92,19,32,.68) 0%,rgba(123,29,42,.42) 45%,rgba(142,37,53,.28) 100%)`,mixBlendMode:"multiply",zIndex:1 }} />
          <div style={{ position:"absolute",inset:0,background:`radial-gradient(ellipse 65% 55% at 50% 44%, rgba(201,169,110,.14) 0%, transparent 70%)`,zIndex:2 }} />
          <div style={{ position:"absolute",inset:0,background:`linear-gradient(90deg,rgba(92,19,32,.82) 0%,transparent 28%)`,zIndex:3 }} className="max-md:hidden" />
          <div style={{ position:"absolute",inset:0,background:`radial-gradient(ellipse 72% 72% at 52% 46%, transparent 28%, rgba(50,8,18,.72) 100%)`,zIndex:4 }} />
          <div className="hero-grain" style={{ zIndex:5 }} />
          <div ref={dustRightRef} style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:6,overflow:"hidden" }} />

          {/* Photo tag */}
          <div className="hero-fade-down-2" style={{ position:"absolute",top:"36px",right:"36px",zIndex:8,textAlign:"right" }}>
            <span style={{ fontFamily:"sans-serif",fontWeight:200,fontSize:"9px",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(232,201,138,.6)",display:"block" }}>Comida consciente</span>
            <span style={{ fontFamily:"sans-serif",fontWeight:200,fontSize:"9px",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(232,201,138,.3)",display:"block",marginTop:"4px" }}>food · mood</span>
          </div>

          {/* Caption */}
          <div className="hero-fade-up-6" style={{ position:"absolute",bottom:"36px",left:0,right:0,textAlign:"center",zIndex:8 }}>
            <p style={{ fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"15px",color:"rgba(245,237,224,.58)",letterSpacing:"0.1em" }}>Comida que nutre desde adentro</p>
          </div>
        </div>

        {/* ══ LOGO (top-left, over split) ══ */}
        <div className="hero-fade-down-1" style={{ position:"absolute",top:"36px",left:"64px",zIndex:10 }} >
          <div style={{ fontFamily:"Georgia,serif",fontStyle:"italic",fontWeight:500,fontSize:"22px",color:CREAM }}>
            food<span style={{ color:GOLD }}>·</span>mood
          </div>
        </div>

        {/* ══ MUSIC BUTTON ══ */}
        <button
          type="button"
          onClick={toggleMusic}
          className="hero-fade-up-8"
          style={{ position:"absolute",bottom:"30px",right:"36px",zIndex:10,display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",background:"none",border:"none",padding:0,color:musicOn ? GOLD_LIGHT : "rgba(245,237,224,.55)",transition:"color .3s" }}
          title="Sonidos de naturaleza"
        >
          <div style={{ width:"32px",height:"32px",border:"1px solid currentColor",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .3s" }}>
            <div style={{ display:"flex",gap:"2px",alignItems:"center",height:"14px" }}>
              {[{d:".7s",dl:"0s",h:"8px"},{d:".9s",dl:".1s",h:"14px"},{d:".6s",dl:".2s",h:"10px"},{d:"1s",dl:".15s",h:"6px"}].map((b,i) => (
                <div key={i} className={`hero-bar${musicOn ? "" : " paused"}`}
                  style={{ "--d":b.d,"--dl":b.dl,"--h":b.h } as React.CSSProperties} />
              ))}
            </div>
          </div>
          <span style={{ fontFamily:"sans-serif",fontWeight:200,fontSize:"9px",letterSpacing:"0.28em",textTransform:"uppercase" }}>
            {musicOn ? "Pausar" : "Naturaleza"}
          </span>
        </button>

      </section>
    </>
  );
}
