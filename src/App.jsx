import React, { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Gavel,
  Landmark,
  Mic,
  Scale,
  Shield,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import FooterEcosystem from "./components/FooterEcosystem";
import GrievanceWizard from "./components/GrievanceWizard";
import Hero3DScene from "./components/Hero3DScene";
import IepfVaultSearch from "./components/IepfVaultSearch";
import Navbar from "./components/Navbar";

/* ─────────────────────────────────────────────────────
   Team Roster Modal
   ───────────────────────────────────────────────────── */
function TeamRosterModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const team = [
    {
      name: "Shivangi Singh",
      role: "Founder & Lead Architect",
      dept: "B.Tech Computer Engineering · SPIT Mumbai",
      bio: "Leading system architecture, voice-first legal AI pipeline engineering, and public digital infrastructure integrations for Rakshak.",
    },
    {
      name: "Adv. Raghavendra Sharma",
      role: "Lead Securities & SEBI Counsel",
      dept: "Securities Appellate Board / High Court",
      bio: "18+ years litigating investor disputes, unauthorized trading recoveries, and SEBI SCORES escalation pipelines.",
    },
    {
      name: "Dr. Ananya Sen",
      role: "Chief AI Architect",
      dept: "Multilingual Legal LLMs & Speech Triage",
      bio: "Former Bhashini contributor; specializes in acoustic speech-to-text models tailored for 22 Indian regional dialects over 2G/3G.",
    },
    {
      name: "Karan Johar Malhotra",
      role: "VP of Depository Integrations",
      dept: "NSDL / CDSL / DigiLocker Protocols",
      bio: "Architected automated folio discovery and deceased holder nominee succession pipelines across Tier-2/3 investor hubs.",
    },
    {
      name: "Pooja V. Venkatesh",
      role: "Head of IEPF Claims Recovery",
      dept: "Investor Education & Protection Fund",
      bio: "Recovered over ₹42 Crore in unclaimed dividends and physical share dematerializations under MCA & IEPF-5 procedures.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl border border-[#FF9933]/30 bg-[#070b14] p-6 md:p-10 shadow-[0_0_60px_rgba(255,153,51,0.25)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close Team Roster"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF9933]/30 bg-[#FF9933]/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase text-[#FF9933] mb-3">
            <Users className="w-3.5 h-3.5" />
            Core Engineering &amp; Legal Directorate
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            The Architects Behind <span className="text-[#FF9933]">Rakshak</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Bridging cutting-edge legal artificial intelligence with public digital rails.
          </p>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {team.map((m, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-[#FF9933]/40 hover:bg-white/[0.05] transition-all"
            >
              <div>
                <h3 className="font-bold text-white text-base">{m.name}</h3>
                <p className="text-xs font-semibold text-[#FF9933] mt-0.5">{m.role}</p>
              </div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-2 font-mono">
                {m.dept}
              </p>
              <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>Rakshak Legal Technology Consortium</span>
          <button
            onClick={onClose}
            className="rounded-full bg-[#FF9933] px-5 py-2 font-bold text-[#030712] hover:brightness-110 transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Main App Component
   ───────────────────────────────────────────────────── */
export default function App() {
  const [isRosterOpen, setIsRosterOpen] = useState(false);

  const scrollToTriage = () => {
    const el = document.getElementById("triage");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="top" className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF9933] selection:text-black">

      {/* ── Fixed Ambient Background ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[#000000]" />
        <div className="absolute inset-0 grid-overlay opacity-50" />
        <div
          className="orb w-[850px] h-[500px] -top-40 left-1/2 -translate-x-1/2 opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, #FF9933 0%, transparent 70%)" }}
        />
      </div>

      {/* ── Fixed Top Navigation (Exact match to screenshot) ── */}
      <Navbar />

      <main className="flex-grow">

        {/* ════════════════════════════════════════════════════════════
            CINEMATIC 3D HERO VIEWPORT
            Exact visual composition matching the screenshot:
            - Giant "R A K S H A K" metallic gold letters across the horizon
            - 3D voice-to-legal optical bench on perspective rails
            - Floating bottom controls: Team Roster | Scroll to Explore | Launch Live Triage
            ════════════════════════════════════════════════════════════ */}
        <section className="relative w-full border-b border-white/5">
          <Hero3DScene
            onLaunchTriage={scrollToTriage}
            onOpenRoster={() => setIsRosterOpen(true)}
          />
        </section>

        {/* ════════════════════════════════════════════════════════════
            MISSION HEADLINE STRIP
            ════════════════════════════════════════════════════════════ */}
        <section className="relative px-6 py-16 md:py-24 text-center max-w-5xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF9933]/30 bg-[#FF9933]/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-[#FF9933]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
            HIGH-THROUGHPUT INVESTOR PROTECTION ENGINE
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Democratizing{" "}
            <span
              className="font-serif italic text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #FFF0B3 0%, #FF9933 50%, #C25E00 100%)",
                filter: "drop-shadow(0 0 25px rgba(255,153,51,0.35))",
              }}
            >
              Investor Justice.
            </span>
          </h1>

          <p className="mt-6 text-base md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed font-light">
            Voice-first grievance triage &amp; nominee protection for Bharat&apos;s Tier-2/3 investors.
            Bridging everyday citizens to <span className="text-white font-medium">SEBI SCORES</span>,{" "}
            <span className="text-white font-medium">IEPF Dividends</span>, and{" "}
            <span className="text-white font-medium">NSDL/CDSL Depository Vaults</span>.
          </p>

          {/* Metrics Row */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { val: "₹25,000+ Cr", label: "IEPF Unclaimed Pool" },
              { val: "< 90 Sec",    label: "Legal Petition Drafting" },
              { val: "22 Dialects", label: "Bhashini Voice AI" },
              { val: "100% 2G/3G",  label: "Low-Bandwidth Optimized" },
            ].map(({ val, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm"
              >
                <p className="text-2xl md:text-3xl font-black text-[#FF9933] tracking-tight">{val}</p>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            CAPABILITIES SECTION (#capabilities)
            ════════════════════════════════════════════════════════════ */}
        <section id="capabilities" className="relative px-6 py-20 border-t border-white/5 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-[#FF9933]/50" />
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#FF9933]">
                Core Capabilities &amp; Architecture
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              Next-generation legal technology <span className="text-neutral-500 font-normal">for Indian capital markets</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Mic,
                  title: "Acoustic Voice-to-Petition Engine",
                  desc: "Empowers rural and non-English speaking investors to speak naturally in Hindi or regional dialects. Bhashini AI extracts timestamps, broker identifiers, and unauthorized trades into structured legal claims.",
                  tag: "Speech-to-Claim",
                },
                {
                  icon: Scale,
                  title: "Automated SCORES Clause Generator",
                  desc: "Aligns your grievance with SEBI Act 1992 Section 15HA/15A and relevant circulars on unauthorized derivatives transactions, generating a formatted formal petition ready for official filing.",
                  tag: "SEBI Compliance",
                },
                {
                  icon: Landmark,
                  title: "IEPF Dividend & Share Demat Tracer",
                  desc: "Connects your PAN directly to unclaimed corporate dividend pools and physical share registers transferred to the Investor Education & Protection Fund authority.",
                  tag: "Capital Recovery",
                },
              ].map(({ icon: Icon, title, desc, tag }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/[0.015] p-8 hover:border-[#FF9933]/40 hover:bg-white/[0.03] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF9933]/10 ring-1 ring-[#FF9933]/30 group-hover:ring-[#FF9933]/60 transition">
                        <Icon className="h-6 w-6 text-[#FF9933]" />
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF9933] px-2.5 py-1 rounded-full bg-[#FF9933]/10 border border-[#FF9933]/25">
                        {tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-light">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SCORES AI TRIAGE WIZARD (#triage)
            ════════════════════════════════════════════════════════════ */}
        <section id="triage" className="relative px-6 py-20 border-t border-white/5 scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF9933]/30 bg-[#FF9933]/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase text-[#FF9933] mb-3">
                <Gavel className="w-3.5 h-3.5 text-[#FF9933]" />
                Live Interactive Triage
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                SCORES Petition Generator
              </h2>
              <p className="mt-3 text-neutral-400 max-w-xl mx-auto text-sm md:text-base font-light">
                Follow the 3-step AI pipeline to transform your grievance into an official
                SEBI SCORES-compliant draft petition.
              </p>
            </div>

            {/* Glassmorphic wizard shell */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-6 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
              <GrievanceWizard />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            IEPF UNCLAIMED DIVIDENDS VAULT (#iepf)
            ════════════════════════════════════════════════════════════ */}
        <section id="iepf" className="relative px-6 py-20 border-t border-white/5 scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF9933]/30 bg-[#FF9933]/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase text-[#FF9933] mb-3">
                <Landmark className="w-3.5 h-3.5 text-[#FF9933]" />
                Capital Recovery Portal
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                IEPF Unclaimed Dividends Vault
              </h2>
              <p className="mt-3 text-neutral-400 max-w-xl mx-auto text-sm md:text-base font-light">
                Enter your Permanent Account Number (PAN) to search the Investor Education &amp; Protection Fund
                registers for forgotten dividends and transferred equity shares.
              </p>
            </div>

            {/* Glassmorphic search shell */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-6 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
              <IepfVaultSearch />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            NOMINEE VAULT (#vault)
            ════════════════════════════════════════════════════════════ */}
        <section id="vault" className="relative px-6 py-20 border-t border-white/5 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-[#FF9933]/50" />
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#FF9933]">
                Nominee Protection &amp; Legal Succession
              </p>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Protect heirs <span className="text-neutral-500 font-normal">before a dispute starts</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl leading-relaxed font-light mb-12">
              Missing or inaccurate nominees are the #1 cause of tied-up capital in Indian households.
              Rakshak enables seamless NSDL/CDSL nominee auditing and DigiLocker-backed proof storage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "NSDL/CDSL Cross-Depository Check",
                  body: "Automatically identifies folios and demat accounts lacking registered succession nominees or having conflicting PAN KYC entries.",
                },
                {
                  title: "DigiLocker Legal Vault",
                  body: "Stores succession certificates, legal heir affidavits, and cancelled cheques encrypted on-device for instantaneous 2G/3G retrieval.",
                },
                {
                  title: "Instant Ombudsman Dispute Escalation",
                  body: "Direct integration pathways to SEBI SCORES, RBI Banking Ombudsman, and IRDAI Bima Bharosa portals.",
                },
              ].map(({ title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#FF9933]/40 hover:bg-white/[0.04] transition-all"
                >
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-light">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── Cinematic Footer (#rights) ── */}
      <FooterEcosystem />

      {/* ── Team Roster Modal ── */}
      <TeamRosterModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
      />

    </div>
  );
}
