"use client";

import { useState, useEffect } from "react";
import { Phone, Shield, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Garantijos", href: "#garantijos" },
    { name: "Tamsumo Gidas", href: "#tamsumas" },
    { name: "Prieš ir Po", href: "#pries-po" },
    { name: "Skaičiuoklė", href: "#skaiciuokle" },
    { name: "Paslaugos", href: "#paslaugos" },
    { name: "Palyginimas", href: "#palyginimas" },
    { name: "Atsiliepimai", href: "#atsiliepimai" },
    { name: "D.U.K.", href: "#duk" },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-amber-950 text-xs py-1.5 px-4 border-b border-cyan-900/30 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200 font-medium">Šiandien dirbame: 08:00 – 19:00</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-cyan-300">Šią savaitę liko 4 laisvos vietos</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              10 m. rašytinė garantija
            </span>
            <a href="tel:+37060012345" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
              <Phone className="w-3 h-3" />
              +370 600 12345
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#090b10]/95 backdrop-blur-md shadow-2xl border-b border-slate-800/80 py-3"
            : "bg-[#090b10]/80 backdrop-blur-sm border-b border-slate-800/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0a0d16] rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white">
                  TAMSINIMO <span className="text-cyan-400">MEISTRAS</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  Sertifikuota Studija
                </span>
              </div>
            </a>

            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="hidden sm:flex items-center gap-3">
              <a
                href="tel:+37060012345"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>+370 600 12345</span>
              </a>
              <a
                href="#skaiciuokle"
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-amber-300 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Kainos Skaičiuoklė
              </a>
            </div>

            <div className="flex xl:hidden items-center gap-2">
              <a href="tel:+37060012345" className="p-2 text-cyan-400 bg-slate-900 border border-cyan-900/50 rounded-lg" aria-label="Skambinti">
                <Phone className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
                aria-label="Meniu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="xl:hidden bg-[#0a0d16] border-b border-slate-800 px-4 pt-3 pb-5 mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:+37060012345"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-200 bg-slate-800 rounded-xl border border-slate-700"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                Skambinti: +370 600 12345
              </a>
              <a
                href="#skaiciuokle"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-amber-300 rounded-xl"
              >
                Apskaičiuoti Kainą & Registruotis
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
