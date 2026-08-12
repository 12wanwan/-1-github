import { AnimatePresence, motion } from "motion/react";
import { X } from "@phosphor-icons/react";
import { useStore } from "../store";

const TONE = {
  gold: { border: "rgba(233,179,95,0.5)", text: "#f6d9a0", glow: "rgba(233,179,95,0.2)" },
  teal: { border: "rgba(111,208,187,0.5)", text: "#9ce0cf", glow: "rgba(111,208,187,0.18)" },
  rose: { border: "rgba(226,112,95,0.5)", text: "#f0a08e", glow: "rgba(226,112,95,0.18)" },
};

export default function ToastViewport() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const tone = TONE[t.tone] || TONE.gold;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="glass pointer-events-auto flex items-center gap-3 px-4 py-3"
              style={{ borderColor: tone.border, boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 24px ${tone.glow}` }}
            >
              <span className="text-sm" style={{ color: tone.text }}>
                {t.message}
              </span>
              <button
                onClick={() => dismissToast(t.id)}
                className="text-inkfaint hover:text-ink transition-colors"
                aria-label="关闭"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
