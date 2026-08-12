import { motion } from "motion/react";
import { Check, Star } from "@phosphor-icons/react";
import { useStore } from "../store";
import BackLink from "../components/BackLink";
import { LEVELS, LEVEL_NAMES, levelFor, levelHue } from "../lib/levels";
import LevelBadge from "../components/LevelBadge";
import BorderGlow from "../components/BorderGlow";

export default function Level() {
  const { state } = useStore();
  const { level, progress, next } = levelFor(state.points);
  const hue = levelHue(level, progress);
  const color = hue == null ? "#565b6b" : `hsl(${hue} 72% 56%)`;
  const nextColor = hue == null ? "#8b93a7" : `hsl(${Math.max(0, hue - 40)} 80% 62%)`;

  return (
    <div className="shell pb-8">
      <header className="pt-14 pb-12">
        <BackLink />
        <p className="mono-label mb-5 mt-4">成长系统 · LEVEL SYSTEM</p>
        <h1 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(2.4rem, 4.6vw, 4rem)", lineHeight: 1.05 }}>
          等级<span className="title-grad">徽章</span>
        </h1>
      </header>

      {/* 当前等级面板 */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className=""
      >
                <BorderGlow
          backgroundColor="rgba(10, 13, 21, 0.6)"
          borderRadius={22}
          glowRadius={36}
          glowColor="40 80 80"
          glowIntensity={1}
          edgeSensitivity={30}
          coneSpread={25}
          colors={["#e9b35f", "#6fd0bb", "#f0a868"]}
        >
          <div className="px-8 md:px-14 py-12 grid md:grid-cols-[auto_1fr] gap-12 items-center">
        <div
          className="absolute -top-32 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, hsla(${hue ?? 140} 80% 55% / 0.12), transparent 70%)` }}
        />
        <div className="flex justify-center">
          <LevelBadge level={level} progress={progress} size={168} showName />
        </div>
        <div className="relative">
          <div className="flex flex-wrap items-end gap-6">
            <div>
              <p className="mono-label mb-2.5">当前积分</p>
              <p className="font-display font-semibold leading-none tabular-nums" style={{ fontSize: "clamp(3rem, 6vw, 4.6rem)", color }}>
                {state.points}
              </p>
            </div>
            <div className="pb-1">
              <p className="text-sm text-inkdim">
                连续登录 <b className="text-ink">{state.streak}</b> 天
              </p>
              <p className="text-xs text-inkfaint mt-1">累计通过每日登录获得</p>
            </div>
          </div>

          <div className="mt-9">
            <div className="flex items-center justify-between text-sm mb-2.5">
              <span className="text-inkdim">
                {level === 0 ? "距启程还差一步" : level >= 6 ? "已抵达星海之巅" : `距离 ${LEVEL_NAMES[level + 1]} 还需`}
              </span>
              <span className="text-inkdim">
                {level >= 6 ? (
                  <span className="text-gold">MAX LEVEL</span>
                ) : (
                  <b className="text-ink tabular-nums">{Math.max(0, next.threshold - state.points)}</b>
                )}
              </span>
            </div>
            <div className="bar" style={{ height: 12 }}>
              <i
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, hsl(${hue ?? 140} 75% 55%), ${nextColor})`,
                  boxShadow: `0 0 14px hsla(${hue ?? 140} 80% 60% / 0.45)`,
                }}
              />
            </div>
            <p className="mt-3 text-xs text-inkfaint">
              {level === 0
                ? `再得 ${3 - state.points} 分即可点亮第一枚徽章`
                : `徽章颜色随等级从绿渐变到红，当前色相 ${hue}°`}
            </p>
          </div>
        </div>
      </div>
        </BorderGlow>
      </motion.section>

      {/* 规则与等级表 */}
      <section className="mt-14 grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className=""
        >
                    <BorderGlow
            className="p-8"
            backgroundColor="rgba(10, 13, 21, 0.6)"
            borderRadius={22}
            glowRadius={36}
            glowColor="40 80 80"
            glowIntensity={1}
            edgeSensitivity={30}
            coneSpread={25}
            colors={["#e9b35f", "#6fd0bb", "#f0a868"]}
          >
          <h2 className="font-display font-semibold text-xl tracking-tight">每日登录积分</h2>
          <p className="mt-2 text-sm text-inkdim leading-relaxed">
            每天首次打开网站自动签到，连续登录天数越多，当日积分越多。
          </p>
          <ul className="mt-6 space-y-3">
            {[
              { d: "第 1 天", p: "+1 积分" },
              { d: "第 2 天", p: "+2 积分" },
              { d: "第 3 天", p: "+3 积分" },
              { d: "第 4 天", p: "+4 积分" },
              { d: "第 5 天起", p: "+5 积分（封顶）" },
            ].map((r) => {
              const isCurrent = state.streak === Number(r.d.replace(/[^0-9]/g, "")) || (state.streak >= 5 && r.d.includes("5"));
              return (
                <li
                  key={r.d}
                  className="flex items-center justify-between rounded-xl px-4 py-3 border transition-colors"
                  style={{
                    borderColor: isCurrent ? "rgba(233,179,95,0.45)" : "rgba(244,236,221,0.08)",
                    background: isCurrent ? "rgba(233,179,95,0.07)" : "rgba(255,255,255,0.025)",
                  }}
                >
                  <span className="text-sm text-inkdim">
                    {isCurrent && <Check size={13} weight="bold" className="inline text-gold mr-1.5" />}
                    {r.d}
                  </span>
                  <b className="text-sm text-gold tabular-nums">{r.p}</b>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-xs text-inkfaint">漏签一天，连续天数从第 1 天重新计算。</p>
        </BorderGlow>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className=""
        >
                    <BorderGlow
            className="p-8"
            backgroundColor="rgba(10, 13, 21, 0.6)"
            borderRadius={22}
            glowRadius={36}
            glowColor="40 80 80"
            glowIntensity={1}
            edgeSensitivity={30}
            coneSpread={25}
            colors={["#e9b35f", "#6fd0bb", "#f0a868"]}
          >
          <h2 className="font-display font-semibold text-xl tracking-tight">等级总表</h2>
          <p className="mt-2 text-sm text-inkdim leading-relaxed">累计积分达到门槛即升入对应等级，徽章颜色由绿渐变为红。</p>
          <ul className="mt-6 space-y-2.5">
            {LEVELS.map((L) => {
              const lHue = levelHue(L.level, 1);
              const reached = state.points >= L.threshold;
              const isCurrent = level === L.level;
              return (
                <li
                  key={L.level}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 border transition-colors ${isCurrent ? "" : ""}`}
                  style={{
                    borderColor: isCurrent ? `hsla(${lHue} 80% 60% / 0.5)` : "rgba(244,236,221,0.08)",
                    background: isCurrent ? `hsla(${lHue} 80% 55% / 0.08)` : "rgba(255,255,255,0.025)",
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-display font-semibold text-sm shrink-0 border"
                    style={{
                      color: reached ? `hsl(${lHue} 80% 64%)` : "#6f6757",
                      borderColor: reached ? `hsla(${lHue} 80% 60% / 0.5)` : "rgba(244,236,221,0.12)",
                      background: reached ? `hsla(${lHue} 80% 55% / 0.12)` : "transparent",
                      boxShadow: reached ? `0 0 14px hsla(${lHue} 80% 60% / 0.3)` : "none",
                    }}
                  >
                    {["一", "二", "三", "四", "五", "六"][L.level - 1]}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-ink">{L.name}</p>
                    <p className="text-xs text-inkfaint mt-0.5">累计 {L.threshold} 分</p>
                  </div>
                  {isCurrent && (
                    <span className="chip !border-[#e9b35f]/50 !text-gold text-[0.65rem]">当前</span>
                  )}
                  {reached && !isCurrent && <Check size={15} weight="bold" className="text-teal" />}
                </li>
              );
            })}
          </ul>
        </BorderGlow>
        </motion.div>
      </section>

      {/* 颜色渐变图例 */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="mt-14"
      >
                <BorderGlow
          className="px-8 md:px-12 py-9"
          backgroundColor="rgba(10, 13, 21, 0.6)"
          borderRadius={22}
          glowRadius={36}
          glowColor="40 80 80"
          glowIntensity={1}
          edgeSensitivity={30}
          coneSpread={25}
          colors={["#e9b35f", "#6fd0bb", "#f0a868"]}
        >
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-inkdim">
            徽章色相 · <b className="text-ink">绿 → 红</b>
          </p>
          <span className="text-xs text-inkfaint">随等级与进度连续渐变</span>
        </div>
        <div
          className="h-3 rounded-full"
          style={{ background: "linear-gradient(90deg, hsl(140 70% 52%), hsl(105 70% 52%), hsl(70 75% 52%), hsl(35 80% 52%), hsl(14 85% 55%), hsl(0 85% 55%))" }}
        />
        <div className="flex justify-between mt-2.5">{["一", "二", "三", "四", "五", "六"].map((n) => (<span key={n} className="text-[0.68rem] text-inkfaint">{n}</span>))}</div>
        <p className="mt-4 text-xs text-inkfaint flex items-center gap-2">
          <Star size={12} className="text-gold" />
          第 1 级绿色起步，逐级向红色演进，第 6 级抵达星海之红。
        </p>
      </BorderGlow>
      </motion.section>
    </div>
  );
}
