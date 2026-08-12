import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { StoreProvider } from "./store";
import Galaxy from "./components/Galaxy";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ToastViewport from "./components/Toast";
import Home from "./pages/Home";
import Logs from "./pages/Logs";
import Level from "./pages/Level";
import Shop from "./pages/Shop";
import Universe from "./pages/Universe";
import Links from "./pages/Links";

function Shell() {
  const location = useLocation();
  return (
    <div className="min-h-[100dvh] relative pb-28">
      <Galaxy
        hueShift={42}
        saturation={0.55}
        glowIntensity={0.4}
        density={1.0}
        starSpeed={0.6}
        rotationSpeed={0.06}
        mouseInteraction
        mouseRepulsion
        repulsionStrength={2.5}
      />
      <div className="nebula" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main className="relative z-10 pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/level" element={<Level />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/universe" element={<Universe />} />
              <Route path="/links" element={<Links />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastViewport />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </StoreProvider>
  );
}