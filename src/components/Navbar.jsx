import { useEffect, useState } from "react";
import { Globe, Shield, Wifi } from "lucide-react";

const NAV_LINKS = [
  { label: "OVERVIEW",     href: "#top" },
  { label: "TRIAGE",       href: "#triage" },
  { label: "IEPF VAULT",   href: "#iepf" },
  { label: "CAPABILITIES", href: "#capabilities" },
  { label: "LEGAL RIGHTS", href: "#vault" },
  { label: "JUDGE REPORT", href: "#rights" },
];

export default function Navbar() {
  const [locale, setLocale]       = useState("en");
  const [active, setActive]       = useState("#top");
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", "")).filter(Boolean);
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-25% 0px -55% 0px" }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A1128]/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-[#0A1128]/80 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 md:px-8">

        {/* Brand / Logo */}
        <a href="#top" className="flex items-center gap-2.5 shrink-0 group">
          <Shield className="h-6 w-6 text-[#FF9933]" aria-hidden="true" />
          <span className="text-lg font-bold tracking-wide text-white">
            RAKSHAK<span className="text-[#FF9933]">.</span>
          </span>
        </a>

        {/* Spaced Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActive(link.href)}
                className={`relative py-1 text-xs font-semibold tracking-widest uppercase transition-colors ${
                  isActive
                    ? "text-[#FF9933]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-[#FF9933]"
                    style={{
                      boxShadow: "0 0 10px rgba(255, 153, 51, 0.8)",
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setLocale((prev) => (prev === "en" ? "hi" : "en"))}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20 transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            {locale === "en" ? "EN / हिन्दी" : "हिन्दी / EN"}
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#138808]/10 text-[#138808] border border-[#138808]/30 px-3 py-1.5 text-xs font-medium">
            <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
            2G/3G Ready
          </span>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-md p-1.5 text-gray-300 hover:text-white hover:bg-white/10 transition"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span className={`block w-4 h-0.5 bg-current transition-all ${mobileOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block w-4 h-0.5 bg-current mt-1 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-4 h-0.5 bg-current mt-1 transition-all ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0A1128]/98 backdrop-blur-xl px-6 py-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => { setActive(link.href); setMobileOpen(false); }}
              className={`block py-2.5 text-xs font-bold tracking-widest uppercase border-b border-white/5 transition-colors ${
                active === link.href ? "text-[#FF9933]" : "text-gray-300"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
