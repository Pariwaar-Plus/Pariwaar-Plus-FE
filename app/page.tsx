// app/page.tsx
"use client";

import { ContainerWrapper } from "@/components/shared/container-wrapper/ContainerWrapper";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Bookmark, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* =========== HERO BG IMAGE =========== */}
      <Image
        src={"/hero.png"}
        alt="Hero"
        width={1920}
        height={1080}
        className="w-full h-full object-cover absolute top-0 left-0 -z-10"
      />
      <main className="max-w-[1700px] mx-auto pt-24 pb-6 px-4 md:px-8 lg:px-12">
        {/* =========== NAVBAR =========== */}
        <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-[1700px] px-4 md:px-8 lg:px-12 flex items-center gap-2 sm:gap-4">
          <nav className="relative flex-1 bg-[#0C0A09B2]/70 backdrop-blur-xl text-white flex items-center justify-between border border-white/24 rounded-full py-2 xl:py-3 px-6 xl:px-8">
            {/* logo */}
            <a href="#" className="nav-logo">
              <div className="logo-icon"></div>
              <span className="text-xl">
                Pariwaar<span className="text-yellow-500">+</span>
              </span>
            </a>

            {/* center nav */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="#how">How It Works</Link>
              <Link href="#features">What Families Track</Link>
              <Separator orientation="vertical" />
              <Link href="#testimonials">FAQS</Link>
              <Link href="#support">Support</Link>
              <Link href="#about">About Us</Link>
              <Link href="#teams">For Teams</Link>
            </div>

            {/* right nav */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="font-semibold cursor-pointer">Login</button>
              <button className="cursor-pointer bg-orange-600 text-white py-3! px-8! rounded-full font-semibold">
                Get Started
              </button>
            </div>

            {/* mobile menu icon */}
            <button className="lg:hidden p-2 cursor-pointer">
              <Menu />
            </button>
          </nav>

          {/* bookmark */}
          <div className="bg-[#0C0A09B2]/70 backdrop-blur-xl text-white flex items-center justify-center border border-white/24 rounded-full p-4">
            <Bookmark />
          </div>
        </header>

        {/* =========== HERO =========== */}
        <section className="min-h-[calc(100vh-8rem)] flex flex-col justify-center py-12">
          <div className="space-y-5 flex flex-col justify-center items-center lg:justify-start lg:items-start text-center lg:text-start mx-auto lg:mx-0 w-full lg:max-w-[50%]">
            <h2 className="font-inter text-[#6EE7B7] font-semibold flex items-center gap-4 text-xs md:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#6EE7B7]"></span>
              CARING FOR AGING PARENTS - FROM ANYWHERE IN THE WORLD
            </h2>

            <h1 className="font-playfair text-white font-medium text-5xl md:text-6xl 2xl:text-7xl">
              Your parents deserve{" "}
              <span className="text-[#FBBF24] italic">warmth</span>,<br /> even
              when you are <br /> far away.
            </h1>

            <p className="text-lg text-[#E7E5E4F2]/95 font-inter xl:max-w-lg 2xl:max-w-2xl">
              Pariwaar+ connects families abroad with dedicated care companions,
              vitals monitoring, and real-time updates - so{" "}
              <span className="text-[#FBBF24]">आमाबुबा</span> are never truly
              alone.
            </p>

            {/* buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full lg:w-auto mt-8">
              <button className="w-full lg:w-auto bg-[#1C1917] backdrop-blur-sm font-semibold text-white flex items-center justify-center gap-2 rounded-full py-3 px-8 border border-white/20">
                Get Started Free{" "}
                <ArrowRight className="text-[#FBBF24]" size={20} />
              </button>
              <button className="w-full lg:w-auto bg-white/10 text-white rounded-full font-semibold py-3 px-8 border border-white/30 backdrop-blur-xl">
                See How It Works
              </button>
            </div>
          </div>

          <Separator className="w-full 2xl:w-[50%]! mt-8 mb-4 bg-white/20" />

          <div className="flex flex-col lg:flex-row justify-center lg:justify-start items-center gap-4">
            {/* avatar group */}
            <AvatarGroup className="*:data-[slot=avatar]:ring-0!">
              <Avatar className="after:border-black">
                <AvatarFallback className="bg-green-700 text-white">
                  CN
                </AvatarFallback>
              </Avatar>
              <Avatar className="after:border-black">
                <AvatarFallback className="bg-orange-700 text-white">
                  LR
                </AvatarFallback>
              </Avatar>
              <Avatar className="after:border-black">
                <AvatarFallback className="bg-red-700 text-white">
                  ER
                </AvatarFallback>
              </Avatar>
              <Avatar className="after:border-black">
                <AvatarFallback className="bg-blue-700 text-white">
                  ER
                </AvatarFallback>
              </Avatar>
            </AvatarGroup>

            <p className="text-[#E7E5E4E5]/95 font-inter text-center">
              <span className="text-white font-semibold">
                2,400+ diaspora families
              </span>{" "}
              trust Athelon Pariwaar across Australia, UK, USA, Qatar & beyond
            </p>
          </div>
        </section>
      </main>

      {/* =========== MARQUEE =========== */}
      <section className="mt-1.5">
        <div className="overflow-hidden px-6 py-3 bg-[#F8EEDF]">
          <div className="marquee-track">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6">
                {[
                  "Daily Companion Visits",
                  "Medication Reminders",
                  "Doctor Coordination",
                  "24/7 Emergency Response",
                  "Video Call Updates",
                  "Health Vault",
                  "Nepali Language Support",
                  "Real-time Alerts",
                ].map((item, j) => (
                  <div
                    className="flex items-center gap-1.5 text-black text-sm"
                    key={j}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A63B1C]"></span>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== CALL NOW =========== */}
      <section className="bg-[#2B1A12]">
        <ContainerWrapper className="py-0! pt-14! flex items-center gap-12 justify-center">
          <Image
            src="/phone.png"
            alt="Phone"
            width={399}
            height={467}
            unoptimized
          />
          <div className="max-w-2xl space-y-2 text-white">
            <h2 className="text-6xl font-playfair font-bold">
              Give us a call, and we will handle everything.
            </h2>
            <p>
              <span className="h-2 w-2 rounded-full bg-[#FCEDDC]"></span>OUR
              CARE LINE IS OPEN 24/7
            </p>
            <h1 className="text-7xl font-playfair font-bold">98XXXXXXXX</h1>
            <p className="">
              One number for doctors, medicines, emergencies and daily visits —
              guaranteeing the health and longevity of your family.
            </p>

            <div className="flex items-center gap-3">
              <button className="bg-[#1F0D04] text-white font-semibold py-3 px-8 rounded-full mt-4">
                Call Now
              </button>

              <button className="bg-[#FCEDDC] text-black font-semibold py-3 px-8 rounded-full mt-4">
                How we help
              </button>
            </div>
          </div>
        </ContainerWrapper>
      </section>

      {/* =========== HOW IT WORKS =========== */}
      <section className="bg-[#FCEDDC]">
        <ContainerWrapper className="flex gap-6">
          {/* left side */}
          <div className="w-[50%]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-[#E07B22]"></div>
              <h4 className="text-[#2B1203] text-sm font-medium">
                HOW IT WORKS
              </h4>
            </div>

            <h1 className="mt-1 mb-4 text-[#2B1203] text-7xl font-playfair font-bold max-w-xl ">
              A little <span className="italic text-[#E07B22]">care</span> goes
              a long way.
            </h1>

            <p className="max-w-2xl">
              From Kathmandu to your city abroad — Pariwaar+ bridges the
              distance with trust, technology, and a human touch.
            </p>

            <div className="relative my-6 space-y-6">
              <div
                aria-hidden="true"
                className="absolute bottom-4 left-5 top-5 w-px bg-[#E07B2273]"
              />
              {HowItWorksList.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E07B2273] bg-[#FFF4E8]">
                    <span className="text-[#2B1203] font-bold">{item.id}</span>
                  </div>
                  <div>
                    <h2 className="text-lg leading-5 font-semibold text-[#2B1203]">
                      {item.title}
                    </h2>
                    <p className="text-[#3D1A04D9]/85 text-sm xl:max-w-lg 2xl:max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* right side */}
          <div className="w-[50%] border border-white/70 rounded-4xl bg-[#FFF8F1]/72 backdrop-blur-xl shadow-[0px_28px_60px_-10px_#3D1A0424] p-8 space-y-6">
            <h1 className="font-playfair text-center font-bold text-2xl text-[#2B1203]">
              What is included in every plan
            </h1>

            <div className="flex flex-col gap-4">
              {WhatIsIncludedList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FFF7EE] shadow shadow-[#3D1A04]/6 border border-[#E07B222E] p-4 rounded-2xl"
                >
                  <h2 className="text-lg font-semibold text-[#2B1203]">
                    {item.title}
                  </h2>
                  <p className="text-[#3D1A04D9]/85 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ContainerWrapper>
      </section>
    </>
  );
}

const HowItWorksList = [
  {
    id: 1,
    title: "Tell us about your family",
    description:
      "Share your parents' location, health conditions, and daily needs.",
  },
  {
    id: 2,
    title: "We find the right companion",
    description:
      "A trained, background-verified Nepali-speaking companion near your parents' home.",
  },
  {
    id: 3,
    title: "Stay close, wherever you are",
    description:
      "Get daily updates, vital readings, and instant alerts directly on your phone — wherever you are in the world.",
  },
  {
    id: 4,
    title: "We'll take care of the rest",
    description:
      "From appointments, pharmacy runs, emergency response — our local team is always one call away.",
  },
];

const WhatIsIncludedList = [
  {
    id: 1,
    title: "Home Companion Visits",
    description: "Trained local companions visit daily or weekly",
  },
  {
    id: 2,
    title: "Real-Time App Updates",
    description:
      "Vitals, mood, meals, and activity — all reported live to your dashboard.",
  },
  {
    id: 3,
    title: "Emergency Response",
    description:
      "24/7 local response team dispatched within minutes of any alert.",
  },
  {
    id: 4,
    title: "Nepali-First Communication",
    description:
      "All companions speak Nepali. App available in Nepali and English.",
  },
];
