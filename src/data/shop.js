import { BookOpen, Gift, Planet, Rocket, Sparkle, Star } from "@phosphor-icons/react";

export const SHOP_ITEMS = [
  { id: "bookmark", name: "星尘书签", price: 2, icon: BookOpen, tint: "#e9b35f", desc: "一枚夹住灵感的书签" },
  { id: "postcard", name: "星野明信片", price: 4, icon: Planet, tint: "#6fd0bb", desc: "来自深空的问候" },
  { id: "stickers", name: "银河贴纸包", price: 6, icon: Sparkle, tint: "#e2705f", desc: "把星星贴满手账" },
  { id: "tote", name: "星图帆布包", price: 10, icon: Gift, tint: "#f6d9a0", desc: "装下整个宇宙的容量" },
  { id: "lamp", name: "引力星球灯", price: 16, icon: Star, tint: "#d98f3f", desc: "桌面上的小小恒星" },
  { id: "giftbox", name: "神秘大礼盒", price: 40, icon: Rocket, tint: "#c7d0e0", desc: "献给星辰之子的神秘奖励" },
];