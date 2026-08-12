import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Star, Coins, House, Notebook, Newspaper, Planet, Storefront, ChartLineUp } from "@phosphor-icons/react";
import { useStore } from "../store";
import { levelFor, levelHue } from "../lib/levels";
import Dock from "./Dock";

const LINKS = [
  { to: "/", label: "首页", icon: <House size={20} weight="duotone" /> },
  { to: "/logs", label: "星辰大海", icon: <Notebook size={20} weight="duotone" /> },
  { to: "/links", label: "前沿", icon: <Newspaper size={20} weight="duotone" /> },
  { to: "/universe", label: "我为宇宙", icon: <Planet size={20} weight="duotone" /> },
  { to: "/shop", label: "商店", icon: <Storefront size={20} weight="duotone" /> },
  { to: "/level", label: "等级", icon: <ChartLineUp size={20} weight="duotone" /> },
];

export default function Nav() {
  const { state } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { level } = levelFor(state.points);
  const hue = levelHue(level, 0);

  const go = (to) => {
    navigate(to);
    window.scrollTo({ top: 0 });
  };

  const navItems = LINKS.map((l) => ({
    label: l.label,
    icon: l.icon,
    active: location.pathname === l.to,
    onClick: () => go(l.to),
  }));

  const statItems = [
    {
      label: "积分",
      render: (
        <div className="dock-metric">
          <Star size={14} weight="fill" className="text-gold" />
          <span>{state.points}</span>
        </div>
      ),
    },
    {
      label: "金币",
      render: (
        <div className="dock-metric">
          <Coins size={15} className="text-teal" />
          <span>{state.coins}</span>
        </div>
      ),
    },
    {
      label: "等级",
      render: (
        <div className="dock-metric">
          <span
            className="dock-level"
            style={{
              color: hue == null ? "#a89e8a" : `hsl(${hue} 75% 62%)`,
              boxShadow: hue == null ? "none" : `0 0 14px hsla(${hue} 85% 60% / 0.4)`,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            {level === 0 ? "·" : level}
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <NavLink
        to="/"
        onClick={() => go("/")}
        className="fixed top-5 left-5 z-40 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#07090f]/55 px-3 py-2 backdrop-blur-xl transition-colors hover:border-[rgba(233,179,95,0.45)]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#f6d9a0] to-[#d98f3f] shadow-[0_0_20px_rgba(233,179,95,0.35)]">
          <Star size={18} weight="fill" className="text-[#241a09]" />
        </span>
        <span className="font-display text-base tracking-wide text-ink">
          星海拾光
        </span>
      </NavLink>

      <Dock items={[...navItems, { divider: true }, ...statItems]} />
    </>
  );
}
