// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const router = useRouter();
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Nav scroll shadow
    const handleScroll = () => {
      if (navbarRef.current) {
        navbarRef.current.classList.toggle("scrolled", window.scrollY > 30);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Scroll reveal
    const reveals = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));

    // FAQ accordion
    const faqBtns = document.querySelectorAll(".faq-q");
    faqBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const wasOpen = item?.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
        if (!wasOpen) item?.classList.add("open");
      });
    });

    // Hamburger
    const hamburger = document.getElementById("hamburger");
    hamburger?.addEventListener("click", () => {
      const links = document.querySelector(".nav-links") as HTMLElement | null;
      if (!links) return;
      if (links.style.display === "flex") {
        links.style.display = "";
      } else {
        Object.assign(links.style, {
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "70px",
          left: "0",
          right: "0",
          background: "var(--cream)",
          padding: "1.5rem 5%",
          borderBottom: "1px solid var(--border)",
          zIndex: "99",
        });
      }
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToLogin = () => router.push("/login");

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream:      #FAF7F2;
          --warm-white: #FFFDF9;
          --green-deep: #1A3C34;
          --green-mid:  #2D6A5F;
          --green-light:#4A9B8C;
          --green-pale: #D4EDE8;
          --saffron:    #E8861A;
          --saffron-lt: #F5A84B;
          --rust:       #C0532A;
          --text-dark:  #1C1C1C;
          --text-mid:   #4A4A4A;
          --text-soft:  #7A7A7A;
          --border:     #E2DDD6;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--text-dark);
          overflow-x: hidden;
        }

        /* ── NAV ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.2rem 5%;
          background: rgba(250,247,242,0.88);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
          transition: box-shadow .3s;
        }
        nav.scrolled { box-shadow: 0 4px 24px rgba(26,60,52,.08); }

        .nav-logo {
          display: flex; align-items: center; gap: .65rem;
          text-decoration: none;
        }
        .logo-icon {
          width: 38px; height: 38px;
          background: var(--green-deep);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .logo-icon svg { width: 22px; height: 22px; fill: #fff; }
        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.45rem; font-weight: 700;
          color: var(--green-deep); letter-spacing: -.02em;
        }
        .logo-text span { color: var(--saffron); }

        .nav-links {
          display: flex; align-items: center; gap: 2.2rem;
          list-style: none;
        }
        .nav-links a {
          font-size: .92rem; font-weight: 500;
          color: var(--text-mid); text-decoration: none;
          transition: color .2s;
        }
        .nav-links a:hover { color: var(--green-deep); }

        .nav-cta {
          background: var(--green-deep) !important;
          color: #fff !important;
          padding: .55rem 1.4rem;
          border-radius: 8px;
          font-weight: 600 !important;
          transition: background .2s, transform .15s !important;
          cursor: pointer; border: none;
          font-size: .92rem; font-family: inherit;
        }
        .nav-cta:hover { background: var(--green-mid) !important; transform: translateY(-1px); }

        .hamburger { display: none; cursor: pointer; flex-direction: column; gap: 5px; background: none; border: none; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--green-deep); border-radius: 2px; }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 7rem 5% 4rem;
          gap: 4rem;
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 55% 60% at 70% 40%, rgba(74,155,140,.11) 0%, transparent 70%),
            radial-gradient(ellipse 40% 50% at 20% 80%, rgba(232,134,26,.07) 0%, transparent 60%);
        }
        .hero-pattern {
          position: absolute; top: 0; right: 0;
          width: 55%; height: 100%; z-index: 0; opacity: .04;
          background-image: repeating-linear-gradient(45deg, var(--green-deep) 0, var(--green-deep) 1px, transparent 0, transparent 50%);
          background-size: 18px 18px;
        }
        .hero-content { position: relative; z-index: 1; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: .5rem;
          background: var(--green-pale); color: var(--green-deep);
          font-size: .8rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
          padding: .38rem .9rem; border-radius: 999px;
          margin-bottom: 1.6rem;
          animation: fadeUp .7s ease both;
        }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green-light); }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 4.5vw, 3.8rem);
          font-weight: 700; line-height: 1.12;
          color: var(--green-deep); margin-bottom: 1.4rem;
          animation: fadeUp .7s .1s ease both;
        }
        .hero-title em { font-style: italic; color: var(--saffron); }

        .hero-subtitle {
          font-size: 1.08rem; line-height: 1.75;
          color: var(--text-mid); max-width: 500px;
          margin-bottom: 2.4rem; font-weight: 400;
          animation: fadeUp .7s .2s ease both;
        }

        .hero-actions {
          display: flex; gap: 1rem; flex-wrap: wrap;
          animation: fadeUp .7s .3s ease both;
        }

        .btn-primary {
          background: var(--green-deep); color: #fff;
          padding: .85rem 2rem; border-radius: 10px;
          font-size: 1rem; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 18px rgba(26,60,52,.22);
          font-family: inherit;
        }
        .btn-primary:hover {
          background: var(--green-mid); transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(26,60,52,.28);
        }
        .btn-secondary {
          background: transparent; color: var(--green-deep);
          padding: .85rem 2rem; border-radius: 10px;
          font-size: 1rem; font-weight: 600;
          text-decoration: none; border: 2px solid var(--green-deep); cursor: pointer;
          transition: background .2s, color .2s, transform .15s; font-family: inherit;
        }
        .btn-secondary:hover { background: var(--green-deep); color: #fff; transform: translateY(-2px); }

        .hero-trust {
          display: flex; align-items: center; gap: 1.4rem;
          margin-top: 2.8rem; animation: fadeUp .7s .4s ease both;
        }
        .trust-avatars { display: flex; }
        .trust-avatars .av {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2.5px solid var(--cream);
          font-size: .75rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          margin-left: -9px; color: #fff;
        }
        .trust-avatars .av:first-child { margin-left: 0; }
        .av1 { background: var(--green-mid); }
        .av2 { background: var(--saffron); }
        .av3 { background: var(--rust); }
        .av4 { background: #6B7DB3; }
        .trust-text { font-size: .88rem; color: var(--text-soft); line-height: 1.45; }
        .trust-text strong { color: var(--text-dark); }

        /* Hero visual card */
        .hero-visual {
          position: relative; z-index: 1;
          animation: fadeLeft .8s .15s ease both;
        }
        .health-card {
          background: #fff; border-radius: 20px; padding: 1.8rem;
          box-shadow: 0 20px 60px rgba(26,60,52,.12), 0 2px 8px rgba(0,0,0,.05);
          max-width: 420px; margin: 0 auto;
        }
        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.4rem; }
        .card-label { font-size: .78rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--text-soft); }
        .card-live { display: flex; align-items: center; gap: .4rem; font-size: .78rem; font-weight: 600; color: #2EAC6B; }
        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #2EAC6B; animation: pulse 1.8s infinite; }
        .patient-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.6rem; }
        .patient-avatar {
          width: 54px; height: 54px; border-radius: 50%;
          background: linear-gradient(135deg, var(--green-pale), var(--green-light));
          display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
        }
        .patient-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 600; color: var(--green-deep); }
        .patient-age { font-size: .83rem; color: var(--text-soft); margin-top: .15rem; }
        .vitals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem; margin-bottom: 1.4rem; }
        .vital-box { background: var(--cream); border-radius: 12px; padding: .9rem 1rem; transition: transform .2s; }
        .vital-box:hover { transform: translateY(-2px); }
        .vital-icon { font-size: 1.2rem; margin-bottom: .3rem; }
        .vital-value { font-size: 1.4rem; font-weight: 700; color: var(--green-deep); }
        .vital-label { font-size: .75rem; color: var(--text-soft); margin-top: .1rem; }
        .vital-status { font-size: .7rem; font-weight: 600; margin-top: .3rem; padding: .18rem .5rem; border-radius: 4px; display: inline-block; }
        .status-good { background: #D4F0E3; color: #1A7048; }
        .status-warn { background: #FDE8CC; color: #A0510E; }
        .medication-row {
          background: var(--green-pale); border-radius: 12px; padding: .9rem 1rem;
          display: flex; align-items: center; gap: .8rem;
        }
        .med-icon { font-size: 1.3rem; }
        .med-info { flex: 1; }
        .med-name { font-size: .9rem; font-weight: 600; color: var(--green-deep); }
        .med-time { font-size: .78rem; color: var(--text-soft); }
        .med-check { width: 24px; height: 24px; border-radius: 50%; background: var(--green-mid); display: flex; align-items: center; justify-content: center; }
        .med-check svg { width: 12px; height: 12px; fill: none; stroke: #fff; stroke-width: 2.5; }

        .floaty {
          position: absolute; right: -30px; top: 30px;
          background: #fff; border-radius: 14px; padding: .8rem 1.1rem;
          box-shadow: 0 8px 30px rgba(0,0,0,.1);
          display: flex; align-items: center; gap: .7rem;
          font-size: .82rem; white-space: nowrap;
          animation: float 3.5s ease-in-out infinite;
        }
        .floaty-icon { font-size: 1.2rem; }
        .floaty-title { font-weight: 600; color: var(--text-dark); }
        .floaty-sub { color: var(--text-soft); font-size: .75rem; }
        .floaty2 {
          position: absolute; left: -20px; bottom: 40px;
          background: var(--green-deep); color: #fff;
          border-radius: 14px; padding: .75rem 1.1rem;
          box-shadow: 0 8px 30px rgba(26,60,52,.25);
          display: flex; align-items: center; gap: .7rem;
          font-size: .82rem; white-space: nowrap;
          animation: float 3.5s 1.2s ease-in-out infinite;
        }
        .floaty2-icon { font-size: 1.1rem; }
        .floaty2-title { font-weight: 600; font-size: .82rem; }
        .floaty2-sub { font-size: .72rem; opacity: .75; }

        /* ── MARQUEE ── */
        .marquee-section { background: var(--green-deep); padding: .9rem 0; overflow: hidden; }
        .marquee-track {
          display: flex; gap: 3rem;
          animation: marquee 22s linear infinite; width: max-content;
        }
        .marquee-item {
          display: flex; align-items: center; gap: .6rem;
          font-size: .82rem; font-weight: 500; color: rgba(255,255,255,.7);
          letter-spacing: .04em; white-space: nowrap;
        }
        .marquee-item span { color: var(--saffron-lt); font-size: .9rem; }

        /* ── SECTION COMMONS ── */
        section { padding: 6rem 5%; }
        .section-label {
          font-size: .78rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          color: var(--saffron); margin-bottom: .8rem;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 700; line-height: 1.2;
          color: var(--green-deep); margin-bottom: 1.2rem;
        }
        .section-desc { font-size: 1.05rem; line-height: 1.75; color: var(--text-mid); max-width: 560px; }

        /* ── HOW IT WORKS ── */
        .how-section { background: var(--warm-white); }
        .how-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .steps { display: flex; flex-direction: column; gap: 0; }
        .step {
          display: flex; gap: 1.4rem; padding: 1.6rem 0;
          border-bottom: 1px solid var(--border); cursor: default; transition: background .2s;
        }
        .step:last-child { border-bottom: none; }
        .step-num {
          width: 42px; height: 42px; border-radius: 12px;
          background: var(--green-pale); color: var(--green-deep);
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: background .2s, color .2s;
        }
        .step:hover .step-num { background: var(--green-deep); color: #fff; }
        .step-content h4 { font-size: 1rem; font-weight: 600; color: var(--green-deep); margin-bottom: .4rem; }
        .step-content p { font-size: .92rem; line-height: 1.65; color: var(--text-mid); }

        .how-visual {
          background: var(--green-deep); border-radius: 24px; padding: 2.5rem;
          color: #fff; position: relative; overflow: hidden;
        }
        .how-visual::before {
          content: ''; position: absolute; top: -40px; right: -40px;
          width: 180px; height: 180px; background: rgba(255,255,255,.04); border-radius: 50%;
        }
        .how-visual h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; margin-bottom: 1.8rem; }
        .feature-list { display: flex; flex-direction: column; gap: 1rem; }
        .feature-item {
          display: flex; align-items: flex-start; gap: 1rem;
          background: rgba(255,255,255,.06); border-radius: 12px; padding: 1rem 1.1rem;
          border: 1px solid rgba(255,255,255,.08);
        }
        .feat-icon { font-size: 1.4rem; }
        .feat-title { font-size: .95rem; font-weight: 600; margin-bottom: .2rem; }
        .feat-desc { font-size: .82rem; opacity: .65; line-height: 1.5; }

        /* ── FEATURES GRID ── */
        .features-section { background: var(--cream); }
        .features-header { max-width: 560px; margin-bottom: 3.5rem; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .feat-card {
          background: #fff; border-radius: 18px; padding: 1.8rem;
          border: 1px solid var(--border);
          transition: transform .25s, box-shadow .25s;
        }
        .feat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(26,60,52,.08); }
        .feat-card-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: var(--green-pale); display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 1.2rem;
        }
        .feat-card h4 { font-size: 1.02rem; font-weight: 700; color: var(--green-deep); margin-bottom: .5rem; }
        .feat-card p { font-size: .88rem; line-height: 1.65; color: var(--text-mid); }

        /* ── TESTIMONIALS ── */
        .testi-section { background: var(--warm-white); }
        .testi-header { text-align: center; margin-bottom: 3.5rem; }
        .testi-header .section-desc { margin: 0 auto; }
        .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .testi-card {
          background: #fff; border-radius: 18px; padding: 1.8rem;
          border: 1px solid var(--border);
          transition: transform .25s;
        }
        .testi-card:hover { transform: translateY(-3px); }
        .testi-stars { color: var(--saffron); font-size: 1rem; margin-bottom: 1rem; letter-spacing: .1em; }
        .testi-text { font-size: .93rem; line-height: 1.7; color: var(--text-mid); margin-bottom: 1.4rem; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: .9rem; }
        .testi-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; color: #fff; font-weight: 700; flex-shrink: 0;
        }
        .testi-name { font-size: .92rem; font-weight: 700; color: var(--green-deep); }
        .testi-loc { font-size: .78rem; color: var(--text-soft); margin-top: .1rem; }

        /* ── FAQ ── */
        .faq-section { background: var(--warm-white); }
        .faq-inner { display: grid; grid-template-columns: 1fr 1.5fr; gap: 5rem; align-items: start; }
        .faq-list { display: flex; flex-direction: column; gap: 0; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-q {
          width: 100%; background: none; border: none; text-align: left; padding: 1.3rem 0;
          font-size: .98rem; font-weight: 600; color: var(--green-deep);
          cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem;
          font-family: inherit;
        }
        .faq-arrow {
          width: 22px; height: 22px; border-radius: 50%; background: var(--green-pale);
          flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          transition: transform .25s, background .2s;
        }
        .faq-arrow svg { width: 10px; height: 10px; stroke: var(--green-deep); stroke-width: 2; fill: none; }
        .faq-item.open .faq-arrow { transform: rotate(180deg); background: var(--green-deep); }
        .faq-item.open .faq-arrow svg { stroke: #fff; }
        .faq-a {
          max-height: 0; overflow: hidden;
          font-size: .92rem; line-height: 1.7; color: var(--text-mid);
          transition: max-height .3s ease, padding .3s;
        }
        .faq-item.open .faq-a { max-height: 200px; padding-bottom: 1.2rem; }

        /* ── CTA ── */
        .cta-section {
          background: var(--green-deep); color: #fff;
          text-align: center; padding: 6rem 5%;
          position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(74,155,140,.2), transparent);
        }
        .cta-section h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700; margin-bottom: 1rem; position: relative; z-index: 1;
        }
        .cta-section p {
          font-size: 1.05rem; opacity: .8; margin-bottom: 2.5rem;
          position: relative; z-index: 1; max-width: 520px; margin-left: auto; margin-right: auto;
        }
        .cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
        .btn-white {
          background: #fff; color: var(--green-deep);
          padding: .9rem 2.2rem; border-radius: 10px;
          font-weight: 700; text-decoration: none; font-family: inherit;
          transition: .2s; font-size: 1rem; border: none; cursor: pointer;
        }
        .btn-white:hover { background: var(--cream); transform: translateY(-2px); }
        .btn-ghost {
          background: transparent; color: #fff;
          padding: .9rem 2.2rem; border-radius: 10px;
          font-weight: 600; text-decoration: none;
          border: 2px solid rgba(255,255,255,.4);
          transition: .2s; font-size: 1rem; font-family: inherit; cursor: pointer;
        }
        .btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,.08); }

        /* ── FOOTER ── */
        footer { background: #0F2A24; color: rgba(255,255,255,.6); padding: 4rem 5% 2.5rem; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
        .footer-brand .logo-text { color: #fff; }
        .footer-brand p { font-size: .88rem; line-height: 1.7; margin-top: 1rem; margin-bottom: 1.4rem; }
        .social-links { display: flex; gap: .7rem; }
        .social-btn {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(255,255,255,.08);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; font-size: .85rem; transition: background .2s; color: rgba(255,255,255,.7);
        }
        .social-btn:hover { background: rgba(255,255,255,.16); }
        .footer-col h5 { font-size: .85rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; margin-bottom: 1.2rem; }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: .6rem; }
        .footer-col a { font-size: .88rem; color: rgba(255,255,255,.55); text-decoration: none; transition: color .2s; }
        .footer-col a:hover { color: #fff; }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,.08); padding-top: 1.8rem;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: .82rem;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(.8); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .reveal { opacity: 0; transform: translateY(28px); transition: opacity .65s ease, transform .65s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; text-align: center; padding-top: 8rem; }
          .hero-subtitle { margin: 0 auto 2.4rem; }
          .hero-actions { justify-content: center; }
          .hero-trust { justify-content: center; }
          .hero-visual { display: none; }
          .how-inner { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: repeat(2,1fr); }
          .testi-grid { grid-template-columns: repeat(2,1fr); }
          .faq-inner { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 680px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .features-grid { grid-template-columns: 1fr; }
          .testi-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── NAV ── */}
      <nav ref={navbarRef} id="navbar">
        <a href="#" className="nav-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21C12 21 3 14.5 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14.5 12 21 12 21Z" opacity=".3"/>
              <path d="M9 11H11V9H13V11H15V13H13V15H11V13H9V11Z"/>
            </svg>
          </div>
          <span className="logo-text">Pariwaar<span>+</span></span>
        </a>
        <ul className="nav-links">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Stories</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><button className="nav-cta" onClick={goToLogin}>Sign In</button></li>
        </ul>
        <button className="hamburger" id="hamburger" aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Caring for Nepalese parents — from anywhere in the world
          </div>
          <h1 className="hero-title">
            Your parents deserve <em>warmth,</em><br />
            even when you are far away.
          </h1>
          <p className="hero-subtitle">
            Pariwaar+ connects Nepali families abroad with dedicated care companions, health monitoring, and real-time updates — so आमाबुवा are never truly alone.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={goToLogin}>Get Started Free</button>
            <a href="#how" className="btn-secondary">See How It Works</a>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars">
              <div className="av av1">S</div>
              <div className="av av2">R</div>
              <div className="av av3">P</div>
              <div className="av av4">A</div>
            </div>
            <div className="trust-text">
              <strong>2,400+ NRN families</strong> trust Pariwaar+<br />
              across Australia, UK, USA, Qatar & beyond
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floaty">
            <div className="floaty-icon">🩺</div>
            <div>
              <div className="floaty-title">Doctor Visit Scheduled</div>
              <div className="floaty-sub">Tomorrow, 10:30 AM · Kathmandu</div>
            </div>
          </div>
          <div className="health-card">
            <div className="card-header">
              <div className="card-label">Parent Health Dashboard</div>
              <div className="card-live"><div className="live-dot" /> Live</div>
            </div>
            <div className="patient-row">
              <div className="patient-avatar">👴</div>
              <div>
                <div className="patient-name">Ram Prasad Sharma</div>
                <div className="patient-age">72 yrs · Kathmandu</div>
              </div>
            </div>
            <div className="vitals-grid">
              <div className="vital-box">
                <div className="vital-icon">❤️</div>
                <div className="vital-value">76</div>
                <div className="vital-label">Heart Rate (bpm)</div>
                <div className="vital-status status-good">Normal</div>
              </div>
              <div className="vital-box">
                <div className="vital-icon">🩸</div>
                <div className="vital-value">128/82</div>
                <div className="vital-label">Blood Pressure</div>
                <div className="vital-status status-warn">Monitor</div>
              </div>
              <div className="vital-box">
                <div className="vital-icon">🌡️</div>
                <div className="vital-value">36.7°</div>
                <div className="vital-label">Temperature</div>
                <div className="vital-status status-good">Normal</div>
              </div>
              <div className="vital-box">
                <div className="vital-icon">🫁</div>
                <div className="vital-value">98%</div>
                <div className="vital-label">Oxygen (SpO₂)</div>
                <div className="vital-status status-good">Excellent</div>
              </div>
            </div>
            <div className="medication-row">
              <div className="med-icon">💊</div>
              <div className="med-info">
                <div className="med-name">Amlodipine 5mg</div>
                <div className="med-time">Taken · 8:00 AM</div>
              </div>
              <div className="med-check">
                <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg>
              </div>
            </div>
          </div>
          <div className="floaty2">
            <div className="floaty2-icon">📞</div>
            <div>
              <div className="floaty2-title">Care Companion checked in</div>
              <div className="floaty2-sub">2 mins ago · All good 🙏</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: "3rem" }}>
              {["Daily Companion Visits", "Medication Reminders", "Doctor Coordination", "24/7 Emergency Response", "Video Call Updates", "Health Vault", "Nepali Language Support", "Real-time Alerts"].map((item, j) => (
                <div className="marquee-item" key={j}>
                  <span>✦</span> {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how">
        <div className="how-inner">
          <div>
            <div className="reveal">
              <div className="section-label">How It Works</div>
              <h2 className="section-title">Simple care, set up in minutes</h2>
              <p className="section-desc">From Kathmandu to your city abroad — Pariwaar+ bridges the distance with trust, technology, and a human touch.</p>
            </div>
            <div className="steps">
              {[
                { n: "1", title: "Register your family", desc: "Sign up online and tell us about your parents — their location, health conditions, and daily needs." },
                { n: "2", title: "Meet your care companion", desc: "We match a trained, background-verified Nepali-speaking companion near your parents' home." },
                { n: "3", title: "Stay connected, always", desc: "Get daily updates, vital readings, and instant alerts directly on your phone — wherever you are in the world." },
                { n: "4", title: "We handle the rest", desc: "Doctor appointments, pharmacy runs, emergency response — our local team is always one call away." },
              ].map((s) => (
                <div className="step reveal" key={s.n}>
                  <div className="step-num">{s.n}</div>
                  <div className="step-content">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="how-visual reveal">
            <h3>What is included in every plan</h3>
            <div className="feature-list">
              {[
                { icon: "🏠", title: "Home Companion Visits", desc: "Trained local companions visit daily or weekly based on your plan." },
                { icon: "📱", title: "Real-Time App Updates", desc: "Vitals, mood, meals, and activity — all reported live to your dashboard." },
                { icon: "🚑", title: "Emergency Response", desc: "24/7 local response team dispatched within minutes of any alert." },
                { icon: "🗣️", title: "Nepali-First Communication", desc: "All companions speak Nepali. App available in Nepali and English." },
              ].map((f) => (
                <div className="feature-item" key={f.title}>
                  <div className="feat-icon">{f.icon}</div>
                  <div>
                    <div className="feat-title">{f.title}</div>
                    <div className="feat-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features">
        <div className="features-header reveal">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything your parents need, coordinated for you</h2>
          <p className="section-desc">Pariwaar+ is built around the real challenges NRN families face — language, distance, trust, and urgency.</p>
        </div>
        <div className="features-grid">
          {[
            { icon: "❤️", title: "Health Monitoring", desc: "Daily vitals tracking including blood pressure, heart rate, oxygen levels, and temperature." },
            { icon: "💊", title: "Medication Management", desc: "Reminders, dose tracking, and refill coordination so no medication is ever missed." },
            { icon: "🩺", title: "Doctor Coordination", desc: "We schedule, accompany, and report back from every hospital visit or check-up." },
            { icon: "📹", title: "Family Video Updates", desc: "Regular video call check-ins so you can see and hear your parents are well." },
            { icon: "🔒", title: "Secure Health Vault", desc: "All records, prescriptions, and test results stored securely and accessible anytime." },
            { icon: "🌏", title: "NRN-Friendly Dashboard", desc: "Time-zone aware, available in English & Nepali, accessible from any device worldwide." },
          ].map((f) => (
            <div className="feat-card reveal" key={f.title}>
              <div className="feat-card-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testi-section" id="testimonials">
        <div className="testi-header reveal">
          <div className="section-label">Family Stories</div>
          <h2 className="section-title">What NRN families are saying</h2>
          <p className="section-desc">From Sydney to London to Doha — Pariwaar+ has become the peace of mind thousands of families rely on.</p>
        </div>
        <div className="testi-grid">
          {[
            { stars: "★★★★★", text: "Pariwaar+ gave me something I hadn't felt since leaving Nepal — genuine peace of mind. My mother had a fall last month and the team responded before I even saw the alert.", name: "Sajan Thapa", loc: "Sydney, Australia", color: "#2D6A5F", init: "S" },
            { stars: "★★★★★", text: "The companion speaks Nepali and treats my parents like family. My father was resistant at first, but now he looks forward to the daily visits. Worth every rupee.", name: "Reena Shrestha", loc: "London, UK", color: "#E8861A", init: "R" },
            { stars: "★★★★★", text: "Managing my father's diabetes from Qatar was exhausting. Now I get daily sugar readings, medication confirmations, and doctor updates — all in one place. Incredible service.", name: "Prashant Adhikari", loc: "Doha, Qatar", color: "#C0532A", init: "P" },
          ].map((t) => (
            <div className="testi-card reveal" key={t.name}>
              <div className="testi-stars">{t.stars}</div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: t.color }}>{t.init}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-loc">{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section" id="faq">
        <div className="faq-inner">
          <div className="reveal">
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Questions we hear most</h2>
            <p className="section-desc">Still unsure? Reach our Nepal-based support team anytime at <strong style={{ color: "var(--green-deep)" }}>support@pariwaarplus.com.np</strong></p>
          </div>
          <div className="faq-list reveal">
            {[
              { q: "How are care companions selected and trained?", a: "All Pariwaar+ companions complete a rigorous background check, first aid certification, and a 40-hour training programme in geriatric care. They are evaluated quarterly and monitored by our in-house nursing team." },
              { q: "Is my parents' health data private and secure?", a: "Yes. All data is end-to-end encrypted and stored on Nepal-based servers. Only you and approved family members can access their records." },
              { q: "What if my parents speak only Nepali or a local dialect?", a: "All companions are native Nepali speakers. Our app is available in Nepali, and support is available in Maithili, Newari, and other regional languages." },
              { q: "What happens during a medical emergency?", a: "Our 24/7 response team is notified immediately. They dispatch a local aide and coordinate ambulance services. You receive real-time updates and can video-call directly from the app." },
              { q: "Which cities in Nepal are currently covered?", a: "We currently operate in Kathmandu Valley, Pokhara, Biratnagar, Birgunj, Dharan, Bharatpur, Butwal, and Nepalgunj — with expansion to 12 more districts by mid-2026." },
              { q: "Can I cancel or pause my plan anytime?", a: "Absolutely. Pause or cancel anytime from your account with no penalty. New subscribers get a 30-day money-back guarantee." },
            ].map((f) => (
              <div className="faq-item" key={f.q}>
                <button className="faq-q">
                  {f.q}
                  <span className="faq-arrow">
                    <svg viewBox="0 0 10 6"><polyline points="1,1 5,5 9,1" /></svg>
                  </span>
                </button>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2>Start caring from wherever you are.</h2>
        <p>Join thousands of NRN families who rest easier every night, knowing आमाबुवा are looked after.</p>
        <div className="cta-buttons">
          <button className="btn-white" onClick={goToLogin}>Create Your Account</button>
          <a href="#how" className="btn-ghost">Learn More First</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="nav-logo" style={{ textDecoration: "none" }}>
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21C12 21 3 14.5 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14.5 12 21 12 21Z" opacity=".3"/>
                  <path d="M9 11H11V9H13V11H15V13H13V15H11V13H9V11Z"/>
                </svg>
              </div>
              <span className="logo-text">Pariwaar<span>+</span></span>
            </a>
            <p>Nepal's trusted health monitoring and care coordination platform for parents of Non-Resident Nepalis worldwide.</p>
            <div className="social-links">
              <a className="social-btn" href="#" title="Facebook">f</a>
              <a className="social-btn" href="#" title="Twitter">𝕏</a>
              <a className="social-btn" href="#" title="Instagram">◎</a>
              <a className="social-btn" href="#" title="YouTube">▶</a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#testimonials">Family Stories</a></li>
              <li><a href="#">Mobile App</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Companions</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Support</h5>
            <ul>
              <li><a href="#">Help Centre</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Pariwaar Plus Pvt. Ltd. · Registered in Nepal 🇳🇵</span>
          <span>Made with love for every Nepali family abroad</span>
        </div>
      </footer>
    </>
  );
}