import { useStore } from "../store";
import { SHOP_ITEMS } from "../data/shop";
import ParticleSphere from "./ParticleSphere";

const ITEM_BY_ID = Object.fromEntries(SHOP_ITEMS.map((item) => [item.id, item]));

const ORBITS = [
  { size: "w-[22rem] h-[22rem] md:w-[30rem] md:h-[30rem]", duration: 18, offset: 0 },
  { size: "w-[28rem] h-[28rem] md:w-[40rem] md:h-[40rem]", duration: 24, offset: 30 },
  { size: "w-[34rem] h-[34rem] md:w-[50rem] md:h-[50rem]", duration: 30, offset: -15 },
];

export default function OrbitingGlobe() {
  const { state } = useStore();
  const purchased = state.inventory.map((id) => ITEM_BY_ID[id]).filter(Boolean);

  // 已购物品轮流挂到三条轨道上
  const rings = ORBITS.map((_, ringIndex) =>
    purchased.filter((_, i) => i % ORBITS.length === ringIndex)
  );

  return (
    <div className="relative w-full h-[36rem] md:h-[52rem] overflow-hidden flex justify-center">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)); }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)); }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)); }
        }
      `}</style>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square pointer-events-none w-64 md:w-[26rem] z-10"
        style={{ filter: "drop-shadow(0 0 34px rgba(233,179,95,0.28))" }}
      >
        <ParticleSphere />
      </div>

      {rings.map((icons, ringIndex) => {
        const isCW = ringIndex % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";
        const orbit = ORBITS[ringIndex];

        return (
          <div
            key={ringIndex}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 ${orbit.size}`}
          >
            {icons.map((item, iconIndex) => {
              const angle = orbit.offset + (iconIndex * 360) / Math.max(icons.length, 1);
              return (
                <div
                  key={`${item.id}-${iconIndex}`}
                  className="absolute top-0 left-1/2 h-1/2 -ml-7 origin-bottom flex flex-col items-center"
                  style={{
                    "--start-angle": `${angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  }}
                >
                  <div
                    className="p-3 border border-white/10 rounded-full bg-[#0b0e17] -mt-7 relative z-10"
                    title={item.name}
                    style={{
                      "--counter-offset": `${-angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                      boxShadow: `0 0 18px ${item.tint}40`,
                    }}
                  >
                    <item.icon size={26} weight="fill" style={{ color: item.tint }} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {purchased.length === 0 && (
        <p className="absolute top-5 left-1/2 -translate-x-1/2 text-sm text-inkfaint whitespace-nowrap px-4 py-2 rounded-full bg-[#0b0e17]/70 border border-white/10 backdrop-blur-sm">
          去商店购入星尘，它们会悬挂在这条轨道上
        </p>
      )}
    </div>
  );
}