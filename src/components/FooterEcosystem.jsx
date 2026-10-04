import {
  CodeXml as Code2,
  Cpu,
  Database,
  FileText,
  GitFork as Github,
  Globe,
  PanelsTopLeft as Layout,
  Shield,
} from "lucide-react";

const PDI_BADGES = [
  { title: "SEBI SCORES", subtitle: "Grievance portal", Icon: Shield },
  { title: "NSDL / CDSL", subtitle: "Depositories",    Icon: Database },
  { title: "Bhashini",    subtitle: "Voice & language AI", Icon: Globe },
  { title: "DigiLocker",  subtitle: "Document vault",  Icon: FileText },
  { title: "FastAPI",     subtitle: "Triage API layer", Icon: Cpu },
  { title: "Python 3.11", subtitle: "Inference runtime", Icon: Code2 },
  { title: "React / Vite",subtitle: "Investor frontend", Icon: Layout },
  { title: "GitHub",      subtitle: "Open collaboration", Icon: Github },
];

const RIGHTS = [
  { code: "SEBI Act §15A", desc: "Penalty for failure to furnish information or redress investor grievances" },
  { code: "SCORES Portal",  desc: "Centralised online grievance redressal mechanism with SEBI tracking" },
  { code: "IEPF-5 Form",   desc: "Statutory claim procedure for recovery of transferred shares and dividends" },
  { code: "NSDL Grievance", desc: "Depository participant dispute resolution and nominee verification" },
];

export default function FooterEcosystem() {
  return (
    <footer id="rights" className="relative mt-0 overflow-hidden bg-[#0A1128] border-t border-white/10">

      {/* Legal rights strip */}
      <section className="bg-[#0A1128] py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs tracking-widest uppercase text-[#FF9933] mb-3">
            Investor Legal Framework
          </p>
          <h2 className="text-3xl font-bold text-white mb-10">
            Know your rights <span className="text-gray-400 font-normal">under SEBI law</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RIGHTS.map(({ code, desc }) => (
              <article
                key={code}
                className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FF9933]/40 p-5 transition-all duration-300 backdrop-blur-md"
              >
                <p className="text-[10px] tracking-widest uppercase text-[#FF9933] mb-2 font-mono">
                  {code}
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PDI integrations */}
      <section className="bg-[#070D1F] border-t border-white/10 py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-6 font-semibold">
            Public Digital Infrastructure Integrations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {PDI_BADGES.map(({ title, subtitle, Icon }) => (
              <article
                key={title}
                className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FF9933]/30 p-4 text-center transition-all duration-300 cursor-default backdrop-blur-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF9933]/10 ring-1 ring-[#FF9933]/25 group-hover:ring-[#FF9933]/50 transition-all">
                  <Icon className="w-4 h-4 text-[#FF9933]" aria-hidden="true" />
                </span>
                <p className="text-[11px] font-semibold text-white leading-tight">{title}</p>
                <p className="text-[9px] text-gray-400 leading-tight">{subtitle}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="bg-[#050A18] border-t border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#FF9933]" aria-hidden="true" />
            <span className="text-xs font-bold tracking-widest uppercase text-white">
              Rakshak<span className="text-[#FF9933]">.</span>
            </span>
          </div>
          <p className="text-[11px] text-gray-400 text-center">
            Built for SEBI SCORES petitions · nominee protection · low-bandwidth Bharat
          </p>
          <p className="text-[11px] text-gray-400">
            &copy; {new Date().getFullYear()} Rakshak. Open source.
          </p>
        </div>
      </div>
    </footer>
  );
}
