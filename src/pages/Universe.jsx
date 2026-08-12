import { motion } from "motion/react";
import BackLink from "../components/BackLink";
import OrbitingGlobe from "../components/OrbitingGlobe";
import BorderGlow from "../components/BorderGlow";

export default function Universe() {
  return (
    <div className="shell pb-8">
      <header className="pt-14 pb-10">
        <BackLink />
        <p className="mono-label mb-5 mt-4">SECTION 03 · MY UNIVERSE</p>
        <h1 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", lineHeight: 1.1 }}>
          我为<span className="title-grad">宇宙</span>
        </h1>
        <p className="mt-3 max-w-[62ch] text-inkdim leading-relaxed text-[1.02rem]">
          我即宇宙。每一次学习、每一次创作，都在为这片星域注入引力——从商店购入的星辰，也会悬挂在这片轨道上。
        </p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className=""
      >
                <BorderGlow
          className="px-4 md:px-10 pt-6"
          backgroundColor="rgba(10, 13, 21, 0.6)"
          borderRadius={22}
          glowRadius={36}
          glowColor="40 80 80"
          glowIntensity={1}
          edgeSensitivity={30}
          coneSpread={25}
          colors={["#e9b35f", "#6fd0bb", "#f0a868"]}
        >
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(111,208,187,0.1), transparent 70%)" }}
        />
        <OrbitingGlobe />
      </BorderGlow>
      </motion.section>
    </div>
  );
}