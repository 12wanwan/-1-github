import { motion } from "motion/react";
import { Check, Coins, Lock, Storefront } from "@phosphor-icons/react";
import { useStore } from "../store";
import { SHOP_ITEMS } from "../data/shop";
import BackLink from "../components/BackLink";
import BorderGlow from "../components/BorderGlow";

const MAX_COINS_PER_DAY = 2;

export default function Shop() {
  const { state, todayInfo, buyItem } = useStore();
  const remaining = MAX_COINS_PER_DAY - todayInfo.todayCoins;
  const ownedCount = (id) => state.inventory.filter((itemId) => itemId === id).length;

  return (
    <div className="shell pb-8">
      <header className="pt-14 pb-12">
        <BackLink />
        <p className="mono-label mb-5 mt-4">商店 · SHOP</p>
        <h1 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(2.4rem, 4.6vw, 4rem)", lineHeight: 1.05 }}>
          星海<span className="title-grad">商店</span>
        </h1>
      </header>

      {/* 金币面板 */}
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
          <div className="px-8 md:px-14 py-10 grid md:grid-cols-[auto_1fr] gap-10 items-center">
        <div
          className="absolute -top-28 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(111,208,187,0.1), transparent 70%)" }}
        />
        <div className="flex items-center gap-6 relative">
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-[#9ce0cf] to-[#3fa58d] shadow-[0_0_40px_rgba(111,208,187,0.35)]">
            <Coins size={44} weight="fill" className="text-[#07201a]" />
          </div>
          <div>
            <p className="mono-label mb-2">我的金币</p>
            <p className="font-display font-semibold leading-none tabular-nums text-teal" style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}>
              {state.coins}
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="flex items-center justify-between text-sm mb-2.5">
            <span className="text-inkdim">今日已获得</span>
            <span className="text-inkdim">
              <b className="text-teal tabular-nums">{todayInfo.todayCoins}</b> / {MAX_COINS_PER_DAY} 枚
            </span>
          </div>
          <div className="bar" style={{ height: 10 }}>
            <i
              style={{
                width: `${(todayInfo.todayCoins / MAX_COINS_PER_DAY) * 100}%`,
                background: "linear-gradient(90deg, #9ce0cf, #6fd0bb)",
                boxShadow: "0 0 12px rgba(111,208,187,0.5)",
              }}
            />
          </div>
          <p className="mt-4 text-sm text-inkdim leading-relaxed">
            {remaining > 0 ? (
              <>
                今日还可再得 <b className="text-gold">{remaining}</b> 枚金币：每日登录 +1 枚，完成今日日志 +1 枚。
              </>
            ) : (
              <>今日金币已集满，明天再来吧。</>
            )}
          </p>
        </div>
      </div>
        </BorderGlow>
      </motion.section>

      {/* 货架 */}
      <section className="mt-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)" }}>
            星海货架
          </h2>
          <span className="chip">
            已上架 <b className="text-gold tabular-nums">{SHOP_ITEMS.length}</b> 件 · 已挂轨道{" "}
            <b className="text-teal tabular-nums">{state.inventory.length}</b> 件
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOP_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const count = ownedCount(item.id);
            const canBuy = state.coins >= item.price;
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
                >
                <BorderGlow
                  backgroundColor="rgba(10, 13, 21, 0.6)"
                  borderRadius={22}
                  glowRadius={36}
                  glowColor="40 80 80"
                  glowIntensity={1}
                  edgeSensitivity={30}
                  coneSpread={25}
                  className="p-7"
                >
                <div className="flex items-start justify-between">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border"
                    style={{
                      background: `${item.tint}14`,
                      borderColor: `${item.tint}40`,
                      color: item.tint,
                      boxShadow: `0 0 24px ${item.tint}1f`,
                    }}
                  >
                    <Icon size={26} weight="duotone" />
                  </div>
                  {count > 0 && (
                    <span className="chip !py-1 !px-2.5 !text-[0.68rem] !border-[#6fd0bb]/40 !text-teal">
                      <Check size={11} weight="bold" /> 已挂 ×{count}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 font-display font-semibold text-lg tracking-tight">{item.name}</h3>
                <p className="mt-1.5 text-sm text-inkdim leading-relaxed flex-1">{item.desc}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-teal font-display font-semibold tabular-nums">
                    <Coins size={17} weight="fill" />
                    {item.price}
                  </span>
                  <button
                    className={`btn ${canBuy ? "btn-gold" : "btn-line btn-disabled"} !py-2 !px-4 text-xs`}
                    onClick={() => buyItem(item.id, item.price, item.name)}
                    disabled={!canBuy}
                  >
                    {canBuy ? (
                      <>
                        <Storefront size={13} weight="bold" /> {count > 0 ? "再次购买" : "购买"}
                      </>
                    ) : (
                      <>
                        <Lock size={13} /> 金币不足
                      </>
                    )}
                  </button>
                </div>
                </BorderGlow>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-inkfaint">
          购入的物品会悬挂在「我为宇宙」的轨道上 · 可重复购买 · 每日登录与完成日志各得 1 枚金币
        </p>
      </section>
    </div>
  );
}