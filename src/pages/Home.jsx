import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  ChartLineUp,
  Check,
  Coins,
  Compass,
  Newspaper,
  Planet,
  Star,
  Storefront,
} from "@phosphor-icons/react";
import { useStore } from "../store";
import { QUOTES } from "../data/quotes";
import { formatDateCN, todayKey } from "../lib/dates";
import { LEVEL_NAMES, levelFor, levelHue } from "../lib/levels";
import LevelBadge from "../components/LevelBadge";
import GradientShimmer from "../components/GradientShimmer";
import BorderGlow from "../components/BorderGlow";

const MAX_POINTS_PER_DAY = 5;
const MAX_COINS_PER_DAY = 2;

function ProgressRing({ progress, color, size = 158, stroke = 8, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)", filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

export default function Home() {
  const { state, todayInfo } = useStore();
  const today = todayKey();
  const { level, progress } = levelFor(state.points);
  const hue = levelHue(level, progress);
  const ringColor = hue == null ? "#565b6b" : `hsl(${hue} 72% 56%)`;

  const [qi, setQi] = useState(() => state.quoteIndex % QUOTES.length);
  const quote = QUOTES[qi];

  useEffect(() => {
    const timer = setInterval(() => {
      setQi((i) => (i + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const step = (dir) => setQi((i) => (i + dir + QUOTES.length) % QUOTES.length);

  return (
    <div className="shell">
      {/* 首屏 */}
      <section className="min-h-[calc(100dvh-64px)] flex items-center py-16">
        <div className="grid lg:grid-cols-12 gap-14 w-full items-center">
          {/* 左侧文案与按钮 */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mono-label mb-7"
            >
              CONTINUOUS {state.streak} DAYS · SINCE 2026
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-1"
              style={{ marginLeft: "-0.75rem" }}
            >
              <GradientShimmer
                gradient="sunrise"
                easing="smooth"
                duration={1.45}
                spread={3}
                angle={105}
                pauseBetween={1000}
                baseColor="#f4ecdd"
                className="font-display font-semibold tracking-tight"
                style={{ display: "block", width: "fit-content", fontSize: "clamp(2.4rem, 5vw, 4.6rem)", lineHeight: 1.25 }}
              >
                把每一天的努力，
              </GradientShimmer>
              <GradientShimmer
                gradient="sunrise"
                easing="smooth"
                duration={1.45}
                spread={3}
                angle={105}
                pauseBetween={1000}
                baseColor="#e9b35f"
                className="font-display font-semibold tracking-tight"
                style={{ display: "block", width: "fit-content", fontSize: "clamp(2.4rem, 5vw, 4.6rem)", lineHeight: 1.25 }}
              >
                寄往星辰大海。
              </GradientShimmer>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-7 max-w-[58ch] text-inkdim leading-relaxed text-[1.02rem]"
            >
              一个属于你的工作学习日志站：每天记下一点，让零散的日子在星图里连成航迹。
              积分记录成长，金币兑换远方——现在，出发。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link to="/logs" className="btn btn-gold text-[1rem] !px-8 !py-4">
                星辰大海 <ArrowUpRight size={18} weight="bold" />
              </Link>
              <Link to="/level" className="btn btn-line">
                <ChartLineUp size={17} /> 等级
              </Link>
              <Link to="/shop" className="btn btn-ghost">
                <Storefront size={17} /> 商店
              </Link>
              <Link to="/universe" className="btn btn-ghost">
                <Planet size={17} /> 我为宇宙
              </Link>

              <Link to="/links" className="btn btn-ghost">
                <Newspaper size={17} /> 前沿资讯
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 flex items-center gap-7 text-sm text-inkdim"
            >
              <div className="flex items-center gap-2">
                <Star size={15} weight="fill" className="text-gold" />
                <span>
                  积分 <b className="text-ink font-semibold text-base tabular-nums">{state.points}</b>
                </span>
              </div>
              <span className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <Coins size={15} className="text-teal" />
                <span>
                  金币 <b className="text-ink font-semibold text-base tabular-nums">{state.coins}</b>
                </span>
              </div>
              <span className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <Compass size={15} className="text-rose" />
                <span>
                  等级 <b className="text-ink font-semibold text-base">{LEVEL_NAMES[level]}</b>
                </span>
              </div>
            </motion.div>
          </div>

          {/* 右侧今日星图 */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5"
          >
                        <BorderGlow
              className="p-7"
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
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(233,179,95,0.16), transparent 70%)" }}
              />
              <div className="flex items-center justify-between">
                <span className="mono-label">TODAY · 今日星图</span>
                <div className="flex items-center gap-2">
                  <span className={`chip ${todayInfo.canLoginCoin ? "!border-[#e9b35f]/50" : ""}`}>
                    <Check size={12} weight="bold" className={todayInfo.canLoginCoin ? "text-gold" : "text-teal"} />
                    <span className={todayInfo.canLoginCoin ? "text-inkdim" : "text-teal"}>
                      登录 {todayInfo.canLoginCoin ? "待领" : "+" + todayInfo.loginPoints + "分"}
                    </span>
                  </span>
                  <span className={`chip ${todayInfo.logToday ? "!border-[#6fd0bb]/50" : ""}`}>
                    <Check size={12} weight="bold" className={todayInfo.logToday ? "text-teal" : "text-inkfaint"} />
                    <span className={todayInfo.logToday ? "text-teal" : "text-inkdim"}>日志</span>
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <ProgressRing progress={progress} color={ringColor}>
                  <LevelBadge level={level} progress={progress} size={96} />
                </ProgressRing>
                <p className="mt-5 mono-label !text-[0.62rem]">
                  {formatDateCN(today, { withYear: true })}
                </p>
                <p className="mt-1.5 text-inkdim text-sm">
                  距离下一级还需{" "}
                  <b className="text-ink font-semibold">{level >= 6 ? 0 : Math.max(0, (levelFor(state.points).next?.threshold ?? 0) - state.points)}</b> 积分
                </p>
              </div>

              <div className="mt-7 pt-5 border-t hairline grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="mono-label !text-[0.6rem] mb-1.5">今日积分</p>
                  <p className="font-display font-semibold text-xl tabular-nums">
                    <span className="text-gold">{todayInfo.loginPoints}</span>
                    <span className="text-inkfaint text-sm">/{MAX_POINTS_PER_DAY}</span>
                  </p>
                </div>
                <div>
                  <p className="mono-label !text-[0.6rem] mb-1.5">今日金币</p>
                  <p className="font-display font-semibold text-xl tabular-nums">
                    <span className="text-teal">{todayInfo.todayCoins}</span>
                    <span className="text-inkfaint text-sm">/{MAX_COINS_PER_DAY}</span>
                  </p>
                </div>
                <div>
                  <p className="mono-label !text-[0.6rem] mb-1.5">连续登录</p>
                  <p className="font-display font-semibold text-xl tabular-nums text-ink">{state.streak}<span className="text-inkfaint text-sm"> 天</span></p>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </section>

      {/* 毛泽东语录 */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="py-14"
      >
                <BorderGlow
          className="px-8 md:px-14 py-12 md:py-16"
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
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(233,179,95,0.5), transparent)" }}
          />
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(233,179,95,0.9)]" />
              <span className="mono-label">语录 · QUOTE OF THE DAY</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost !p-2.5" onClick={() => step(-1)} aria-label="上一条">
                <CaretLeft size={15} />
              </button>
              <button className="btn btn-ghost !p-2.5" onClick={() => step(1)} aria-label="下一条">
                <CaretRight size={15} />
              </button>
            </div>
          </div>

          <div key={qi} className="quote-swap mt-9 min-h-[11rem] md:min-h-[9.5rem]">
            <blockquote className="font-quote font-semibold text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.55] tracking-wide text-ink">
              “{quote.text}”
            </blockquote>
            <p className="mt-6 text-inkfaint text-sm tracking-[0.15em]">—— {quote.source}</p>
          </div>

          <div className="mt-8 flex items-center gap-2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setQi(i)}
                aria-label={`第 ${i + 1} 条`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === qi ? 26 : 6,
                  background: i === qi ? "#e9b35f" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </BorderGlow>
      </motion.section>

      {/* 今日航线：每日收益面板 */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="pt-8 pb-4"
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
          <div className="px-8 md:px-14 py-10 grid md:grid-cols-3 gap-10 md:divide-x md:divide-white/[0.07]">
          <div>
            <p className="mono-label mb-2.5">每日登录积分</p>
            <p className="font-display font-semibold text-[2rem] leading-none">
              <span className="text-gold tabular-nums">{todayInfo.loginPoints}</span>
              <span className="text-inkfaint text-base"> / {MAX_POINTS_PER_DAY} 分</span>
            </p>
            <div className="bar mt-4">
              <i style={{ width: `${(todayInfo.loginPoints / MAX_POINTS_PER_DAY) * 100}%`, background: "linear-gradient(90deg,#f6d9a0,#e9b35f)" }} />
            </div>
            <p className="mt-3 text-xs text-inkfaint">连续登录第 {state.streak} 天 · 第 5 天起每日 5 分封顶</p>
          </div>
          <div>
            <p className="mono-label mb-2.5">每日金币</p>
            <p className="font-display font-semibold text-[2rem] leading-none">
              <span className="text-teal tabular-nums">{todayInfo.todayCoins}</span>
              <span className="text-inkfaint text-base"> / {MAX_COINS_PER_DAY} 枚</span>
            </p>
            <div className="bar mt-4">
              <i style={{ width: `${(todayInfo.todayCoins / MAX_COINS_PER_DAY) * 100}%`, background: "linear-gradient(90deg,#9ce0cf,#6fd0bb)" }} />
            </div>
            <p className="mt-3 text-xs text-inkfaint">登录 +1 · 完成今日日志 +1</p>
          </div>
          <div>
            <p className="mono-label mb-2.5">当前等级</p>
            <p className="font-display font-semibold text-[2rem] leading-none">
              <span style={{ color: ringColor }}>{LEVEL_NAMES[level]}</span>
            </p>
            <div className="bar mt-4">
              <i style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, hsl(${hue ?? 140} 75% 55%), hsl(${Math.max(0, (hue ?? 140) - 40)} 80% 62%))` }} />
            </div>
            <p className="mt-3 text-xs text-inkfaint">
              总积分 {state.points} · 下一级{" "}
              {level >= 6 ? "已是星海之巅" : `还需 ${(levelFor(state.points).next?.threshold ?? 0) - state.points} 分`}
            </p>
          </div>
        </div>
          </BorderGlow>
      </motion.section>
    </div>
  );
}
