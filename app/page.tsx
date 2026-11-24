// app/page.tsx
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Bookmark, Menu } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-[1800px] mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-10 flex items-center gap-2 sm:gap-4">
        <nav className="relative flex-1 bg-neutral-800/90 backdrop-blur-sm text-white flex items-center justify-between border-2 rounded-full py-2 xl:py-3 px-6 xl:px-8">
          {/* logo */}
          <a href="#" className="nav-logo">
            <div className="logo-icon"></div>
            <span className="text-xl">
              Pariwaar<span className="text-yellow-500">+</span>
            </span>
          </a>

          {/* center nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how">How It Works</Link>
            <Link href="#features">What Families Track</Link>
            <Separator orientation="vertical" />
            <Link href="#testimonials">FAQS</Link>
            <Link href="#support">Support</Link>
            <Link href="#about">About Us</Link>
            <Link href="#teams">For Teams</Link>
          </div>

          {/* right nav */}
          <div className="hidden md:flex items-center gap-4">
            <button className="font-semibold cursor-pointer">Login</button>
            <button className="cursor-pointer bg-orange-600 text-white py-3! px-8! rounded-full font-semibold">
              Get Started
            </button>
          </div>

          <button className="md:hidden p-2 cursor-pointer">
            <Menu />
          </button>
        </nav>

        <div className="bg-neutral-800/90 backdrop-blur-sm text-white flex items-center justify-center border border-gray-300 rounded-full p-4">
          <Bookmark />
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="min-h-[calc(100vh-8rem)] flex flex-col justify-center py-12 sm:py-16">
        <div className="w-full max-w-3xl space-y-4 flex flex-col justify-center items-center lg:justify-start lg:items-start text-center lg:text-start mx-auto lg:mx-0">
          <h2 className="border px-4 py-1 w-fit border-green-100 text-green-100 bg-green-700 rounded-full font-semibold">
            CARING FOR AGING PARENTS - FROM ANYWHERE IN THE WORLD
          </h2>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl">
            Your parents deserve{" "}
            <span className="text-yellow-500 italic">warmth</span>,<br /> even
            when <br /> you are far away.
          </h1>

          <p className="text-xl">
            Pariwaar+ connects families abroad with dedicated care companions,
            vitals monitoring, and real-time updates - so{" "}
            <span className="text-yellow-500">आमाबुबा</span> are never truly
            alone.
          </p>

          <div className="flex flex-col items-stretch sm:flex-row sm:items-center gap-4 mt-8 sm:mt-12">
            <button className="bg-neutral-800/90 backdrop-blur-sm font-semibold text-white flex items-center gap-2 rounded-full py-3 px-8 border border-gray-400">
              Get Started Free <ArrowRight />
            </button>
            <button className="rounded-full font-semibold py-3 px-8 border border-gray-400">
              See How It Works
            </button>
          </div>
        </div>

        <Separator className="mt-8 mb-4" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* avatar group */}
          <AvatarGroup className="grayscale">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </AvatarGroup>

          <p className="text-lg">
            <span className="font-semibold">2,400+ diaspora families</span>{" "}
            trust Athelon Pariwaar across Australia, UK, USA, Qatar & beyond
          </p>
        </div>
      </section>
    </main>
  );
}
