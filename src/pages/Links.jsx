import { motion } from "motion/react";
import { ArrowUpRight, Palette, Robot } from "@phosphor-icons/react";
import BackLink from "../components/BackLink";
import BorderGlow from "../components/BorderGlow";
import { AI_LINKS, DESIGN_LINKS } from "../data/links";

function LinkCard({ icon: Icon, accent, title, links }) {
  return (
        <BorderGlow
      className="p-7 md:p-8"
      backgroundColor="rgba(10, 13, 21, 0.6)"
      borderRadius={22}
      glowRadius={36}
      glowColor="40 80 80"
      glowIntensity={1}
      edgeSensitivity={30}
      coneSpread={25}
      colors={["#e9b35f", "#6fd0bb", "#f0a868"]}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center border"
          style={{
            background: `${accent}14`,
            borderColor: `${accent}40`,
            color: accent,
            boxShadow: `0 0 20px ${accent}1f`,
          }}
        >
          <Icon size={18} weight="duotone" />
        </span>
        <h2 className="font-display font-semibold text-xl tracking-tight">{title}</h2>
        <span className="chip !text-[0.65rem] ml-auto">{links.length} 个入口</span>
      </div>

      <ul className="divide-y divide-white/[0.06]">
        {links.map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-3.5">
              <span className="flex-1 min-w-0">
                <span className="block text-[0.95rem] font-medium text-ink group-hover:text-gold transition-colors">
                  {l.name}
                </span>
                <span className="block mt-0.5 text-xs text-inkfaint truncate">{l.desc}</span>
              </span>
              <ArrowUpRight size={15} className="text-inkfaint group-hover:text-gold shrink-0 transition-colors" />
            </a>
          </li>
        ))}
      </ul>
    </BorderGlow>
  );
}

export default function Links() {
  return (
    <div className="shell pb-8">
      <header className="pt-14 pb-10">
        <BackLink />
        <p className="mono-label mb-5 mt-4">SECTION 04 · LINKS</p>
        <h1
          className="font-display font-semibold tracking-tight"
          style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", lineHeight: 1.1 }}
        >
          相关<span className="title-grad">链接</span>
        </h1>
        <p className="mt-3 max-w-[62ch] text-inkdim leading-relaxed text-[1.02rem]">
          AI 前沿与设计竞赛入口，点进去自己看。
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <LinkCard icon={Robot} accent="#6fd0bb" title="AI 前沿" links={AI_LINKS} />
        <LinkCard icon={Palette} accent="#e9b35f" title="设计竞赛" links={DESIGN_LINKS} />
      </motion.div>
    </div>
  );
}
