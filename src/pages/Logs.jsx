import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Bell,
  CalendarBlank,
  Check,
  MagnifyingGlass,
  Notebook,
  PencilSimple,
  Plus,
  Smiley,
  SmileyAngry,
  SmileyMeh,
  SmileySad,
  SmileyXEyes,
  Sparkle,
  Trash,
} from "@phosphor-icons/react";
import { useStore } from "../store";
import BackLink from "../components/BackLink";
import BorderGlow from "../components/BorderGlow";
import { addDaysKey, daysInMonth, formatDateCN, monthKey, monthLabel, todayKey } from "../lib/dates";

const MOODS = [
  { id: "happy", icon: Smiley, label: "元气", color: "#f6d9a0" },
  { id: "calm", icon: SmileyMeh, label: "平静", color: "#6fd0bb" },
  { id: "tired", icon: SmileySad, label: "疲惫", color: "#e9b35f" },
  { id: "busy", icon: SmileyAngry, label: "忙碌", color: "#e2705f" },
  { id: "low", icon: SmileyXEyes, label: "低落", color: "#8b93a7" },
];

const emptyForm = () => ({ date: todayKey(), title: "", content: "", tags: "", mood: "happy", editingId: null });

export default function Logs() {
  const { state, todayInfo, saveLog, deleteLog, pushToast, saveReminder, saveMemo } = useStore();
  const today = todayKey();
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("全部");
  const [expanded, setExpanded] = useState(new Set());
  const [confirmId, setConfirmId] = useState(null);
  const [reminderText, setReminderText] = useState(state.reminder?.date === today ? state.reminder.text : "");
  const [memoText, setMemoText] = useState(state.memo ?? "");
  const reminderForTomorrow = state.reminder?.date === today;
  const yesterday = addDaysKey(today, -1);
  const yesterdayReminder = state.reminder?.date === yesterday ? state.reminder.text : "";
  const editorRef = useRef(null);
  const confirmTimer = useRef(null);

  // 若今日已有日志，自动载入编辑器
  useEffect(() => {
    const todays = state.logs.find((l) => l.date === today);
    if (todays) {
      setForm({
        date: todays.date,
        title: todays.title,
        content: todays.content,
        tags: todays.tags.join(", "),
        mood: todays.mood,
        editingId: todays.id,
      });
    }
  }, [today]); // eslint-disable-line react-hooks/exhaustive-deps

  const months = useMemo(() => {
    const set = new Set(state.logs.map((l) => monthKey(l.date)));
    return ["全部", ...[...set].sort().reverse()];
  }, [state.logs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return state.logs.filter((l) => {
      if (monthFilter !== "全部" && monthKey(l.date) !== monthFilter) return false;
      if (!q) return true;
      return [l.title, l.content, l.tags.join(" "), l.date].join(" ").toLowerCase().includes(q);
    });
  }, [state.logs, search, monthFilter]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const l of filtered) {
      const k = monthKey(l.date);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(l);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  const heatMonth = monthFilter === "全部" ? today.slice(0, 7) : monthFilter;
  const heatLogged = useMemo(
    () => new Set(state.logs.filter((l) => monthKey(l.date) === heatMonth).map((l) => l.date)),
    [state.logs, heatMonth]
  );

  function submit(e) {
    e.preventDefault();
    const title = form.title.trim();
    const content = form.content.trim();
    if (!title && !content) {
      pushToast("标题或内容至少写一点吧", "rose");
      return;
    }
    const tags = form.tags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6);
    const res = saveLog({
      id: form.editingId,
      date: form.date,
      title,
      content,
      tags,
      mood: form.mood,
    });
    setForm(emptyForm());
    setExpanded((s) => new Set(s));
    pushToast(form.editingId ? "已更新手记" : "手记已寄往星海", "gold");
    if (res.id && res.earnedCoin) {
      // 金币 toast 已由 store 发出
    }
  }

  function startEdit(log) {
    setForm({
      date: log.date,
      title: log.title,
      content: log.content,
      tags: log.tags.join(", "),
      mood: log.mood,
      editingId: log.id,
    });
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startDelete(id) {
    if (confirmId === id) {
      deleteLog(id);
      setConfirmId(null);
      pushToast("手记已删除", "rose");
    } else {
      setConfirmId(id);
      clearTimeout(confirmTimer.current);
      confirmTimer.current = setTimeout(() => setConfirmId(null), 3600);
    }
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleExpand = (id) =>
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="shell pb-8">
      {/* 页头 */}
      <header className="pt-14 pb-12">
        <BackLink />
        <p className="mono-label mb-5 mt-4">SECTION 01 · 每日日志板块</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(2.4rem, 4.6vw, 4rem)", lineHeight: 1.05 }}>
            星辰<span className="title-grad">大海</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="chip">共 {state.logs.length} 篇</span>
            <span className="chip">
              本月 {state.logs.filter((l) => monthKey(l.date) === today.slice(0, 7)).length} 篇
            </span>
            <span className="chip !border-[#6fd0bb]/50 !text-teal">
              {todayInfo.logToday ? "今日已记录" : "今日待记录 · +1 金币"}
            </span>
          </div>
        </div>
      </header>

      {/* 板块：每日提醒 + 备忘录 */}
      <section className="grid md:grid-cols-3 gap-6">
                <BorderGlow
          className="p-6 md:p-7"
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
            className="absolute -top-20 -right-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(233,179,95,0.08), transparent 70%)" }}
          />
          <div className="flex items-center justify-between gap-3 relative">
            <div className="flex items-center gap-2.5">
              <Bell size={18} className="text-gold" />
              <h2 className="font-display font-semibold text-xl tracking-tight">写给明天</h2>
            </div>
            <span className="chip !text-[0.68rem]">
              {reminderForTomorrow ? "已写给明天" : "未写"}
            </span>
          </div>
          <p className="mt-2 text-xs text-inkfaint leading-relaxed relative">
            给明天的自己留一句话，明天打开就能看到。
          </p>
          <textarea
            className="field mt-4 flex-1 min-h-[110px] resize-y leading-relaxed"
            placeholder="给明天的自己留一句话……"
            value={reminderText}
            maxLength={200}
            onChange={(e) => setReminderText(e.target.value)}
          />
          <div className="mt-4 flex items-center justify-between gap-3 relative">
            <span className="text-xs text-inkfaint tabular-nums">{reminderText.length}/200</span>
            <button className="btn btn-gold !py-2 !px-5 text-sm" onClick={() => saveReminder(reminderText)}>
              <Check size={14} weight="bold" /> 留给明天
            </button>
          </div>
        </BorderGlow>

                <BorderGlow
          className="p-6 md:p-7"
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
            className="absolute -top-20 -right-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(233,179,95,0.06), transparent 70%)" }}
          />
          <div className="flex items-center justify-between gap-3 relative">
            <div className="flex items-center gap-2.5">
              <CalendarBlank size={18} className="text-teal" />
              <h2 className="font-display font-semibold text-xl tracking-tight">昨天写了什么</h2>
            </div>
            <span className="chip !text-[0.68rem]">昨天</span>
          </div>
          {yesterdayReminder ? (
            <p className="mt-4 font-quote text-[1.05rem] leading-relaxed text-goldsoft relative">
              {yesterdayReminder}
            </p>
          ) : (
            <p className="mt-4 text-sm text-inkfaint leading-relaxed relative">
              昨天没有留下提醒，今天写一条吧。
            </p>
          )}
        </BorderGlow>

                <BorderGlow
          className="p-6 md:p-7"
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
            className="absolute -top-20 -right-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(111,208,187,0.08), transparent 70%)" }}
          />
          <div className="flex items-center gap-2.5 relative">
            <Notebook size={18} className="text-teal" />
            <h2 className="font-display font-semibold text-xl tracking-tight">备忘录</h2>
          </div>
          <p className="mt-2 text-xs text-inkfaint leading-relaxed relative">
            长期保留的笔记，随时更改，一直陪着你。
          </p>
          <textarea
            className="field mt-4 flex-1 min-h-[110px] resize-y leading-relaxed"
            placeholder="记下想长期保留的想法、清单、灵感……"
            value={memoText}
            maxLength={2000}
            onChange={(e) => setMemoText(e.target.value)}
          />
          <div className="mt-4 flex items-center justify-between gap-3 relative">
            <span className="text-xs text-inkfaint tabular-nums">{memoText.length}/2000</span>
            <button className="btn btn-line !py-2 !px-5 text-sm" onClick={() => saveMemo(memoText)}>
              <Check size={14} weight="bold" /> 保存
            </button>
          </div>
        </BorderGlow>
      </section>

      {/* 板块一：今日手记 */}
      <section ref={editorRef} className="scroll-mt-24 mt-8">
                <BorderGlow
          className="p-7 md:p-10"
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
            className="absolute -bottom-28 -left-24 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(111,208,187,0.09), transparent 70%)" }}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 relative">
            <div className="flex items-center gap-3">
              <Sparkle size={16} className="text-gold" />
              <h2 className="font-display font-semibold text-2xl tracking-tight">今日手记</h2>
              {form.editingId && (
                <span className="chip !border-[#e9b35f]/50 !text-gold">编辑中</span>
              )}
            </div>
            {form.editingId && (
              <button
                className="btn btn-ghost !py-2 !px-4 text-xs"
                onClick={() => {
                  setForm(emptyForm());
                  pushToast("已开始写今日新篇", "teal");
                }}
              >
                <Plus size={14} /> 写今日新篇
              </button>
            )}
          </div>

          <form onSubmit={submit} className="mt-8 grid md:grid-cols-[240px_1fr] gap-8 relative">
            <div>
              <label className="mono-label block mb-3">日期</label>
              <input
                type="date"
                className="field !py-3"
                value={form.date}
                max={today}
                onChange={(e) => set("date", e.target.value)}
                required
              />
              <p className="mt-2 text-xs text-inkfaint">{formatDateCN(form.date, { withYear: true })}</p>

              <label className="mono-label block mt-7 mb-3">今日心情</label>
              <div className="flex flex-wrap gap-2.5">
                {MOODS.map((m) => {
                  const Icon = m.icon;
                  const active = form.mood === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => set("mood", m.id)}
                      className="flex flex-col items-center gap-1.5 rounded-xl px-3 py-2.5 border transition-all duration-300"
                      style={{
                        borderColor: active ? m.color : "rgba(244,236,221,0.12)",
                        background: active ? `${m.color}1f` : "rgba(255,255,255,0.03)",
                        transform: active ? "translateY(-2px)" : "none",
                      }}
                      title={m.label}
                    >
                      <Icon size={22} weight={active ? "fill" : "regular"} style={{ color: active ? m.color : "#a89e8a" }} />
                      <span className="text-[0.68rem]" style={{ color: active ? m.color : "#6f6757" }}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <input
                className="field !py-3.5 !text-lg font-display font-medium"
                placeholder="标题 · 今天发生了什么？"
                value={form.title}
                maxLength={80}
                onChange={(e) => set("title", e.target.value)}
              />
              <textarea
                className="field min-h-[220px] resize-y leading-relaxed"
                placeholder="写下今天的学习、工作、灵感与碎片……"
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
              />
              <input
                className="field"
                placeholder="标签 · 用逗号分隔，如：设计, 读书, AI"
                value={form.tags}
                maxLength={60}
                onChange={(e) => set("tags", e.target.value)}
              />
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <p className="text-xs text-inkfaint">
                  首次完成今日记录 <b className="text-teal">+1 金币</b> · 每日上限 2 枚
                </p>
                <button type="submit" className="btn btn-gold">
                  {form.editingId ? "更新手记" : "寄出手记"} <Check size={17} weight="bold" />
                </button>
              </div>
            </div>
          </form>
        </BorderGlow>
      </section>

      {/* 板块二：时光收藏 */}
      <section className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <p className="mono-label mb-5">SECTION 02 · 历史日志收集</p>
            <h2 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)", lineHeight: 1.1 }}>
              时光<span className="title-grad">收藏</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-inkfaint" />
              <input
                className="field !pl-10 w-[220px]"
                placeholder="搜索手记…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="field w-[150px]" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m === "全部" ? "全部月份" : monthLabel(m)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 月度足迹热力图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
                    <BorderGlow
            className="px-7 py-6"
            backgroundColor="rgba(10, 13, 21, 0.6)"
            borderRadius={22}
            glowRadius={36}
            glowColor="40 80 80"
            glowIntensity={1}
            edgeSensitivity={30}
            coneSpread={25}
            colors={["#e9b35f", "#6fd0bb", "#f0a868"]}
          >
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-inkdim">
              本月足迹 · <b className="text-gold">{heatLogged.size}</b> 天留下记录
            </p>
            <span className="text-xs text-inkfaint">{monthLabel(heatMonth)}</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(20px,1fr))] gap-1.5">
            {Array.from({ length: daysInMonth(heatMonth + "-01") }, (_, i) => {
              const dk = `${heatMonth}-${String(i + 1).padStart(2, "0")}`;
              const on = heatLogged.has(dk);
              const isToday = dk === today;
              return (
                <span
                  key={dk}
                  className={`heat-cell ${on ? "on" : ""} ${isToday ? "today" : ""}`}
                  title={`${dk}${on ? " · 已记录" : ""}`}
                />
              );
            })}
          </div>
        </BorderGlow>
        </motion.div>

        {grouped.length === 0 ? (
                    <BorderGlow
            className="px-8 py-16 text-center"
            backgroundColor="rgba(10, 13, 21, 0.6)"
            borderRadius={22}
            glowRadius={36}
            glowColor="40 80 80"
            glowIntensity={1}
            edgeSensitivity={30}
            coneSpread={25}
            colors={["#e9b35f", "#6fd0bb", "#f0a868"]}
          >
            <p className="text-inkdim text-lg">还没有匹配的手记</p>
            <p className="mt-2 text-sm text-inkfaint">在上面写下第一篇，星星就会亮起。</p>
          </BorderGlow>
        ) : (
          <div>
            {grouped.map(([mk, logs]) => (
              <div key={mk} className="mb-12">
                <div className="flex items-center gap-5 mb-6">
                  <span className="font-display font-semibold text-4xl text-white/90 tracking-tight">
                    {mk.slice(5, 7)}
                  </span>
                  <span className="text-inkfaint text-sm tracking-[0.2em]">{mk.slice(0, 4)} 年 · {logs.length} 篇</span>
                  <span className="flex-1 h-px bg-white/[0.07]" />
                </div>
                <div className="masonry">
                  {logs.map((log) => {
                    const mood = MOODS.find((m) => m.id === log.mood) || MOODS[0];
                    const MoodIcon = mood.icon;
                    const isExpanded = expanded.has(log.id);
                    const long = log.content.length > 90;
                    return (
                      <motion.article
                        key={log.id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.5 }}
                        >
                        <BorderGlow
                          backgroundColor="rgba(10, 13, 21, 0.6)"
                          borderRadius={22}
                          glowRadius={36}
                          glowColor="40 80 80"
                          glowIntensity={1}
                          edgeSensitivity={30}
                          coneSpread={25}
                          className="p-6"
                        >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-inkfaint tracking-wide">
                            {formatDateCN(log.date, { withYear: true })}
                          </span>
                          <MoodIcon size={18} weight="fill" style={{ color: mood.color }} />
                        </div>
                        {log.title && (
                          <h3 className="mt-3 font-display font-semibold text-lg leading-snug tracking-tight">
                            {log.title}
                          </h3>
                        )}
                        {log.content && (
                          <p className={`mt-2.5 text-sm leading-relaxed text-inkdim ${isExpanded ? "" : "clamp-3"}`}>
                            {log.content}
                          </p>
                        )}
                        {long && (
                          <button
                            className="mt-2 text-xs text-gold/80 hover:text-gold transition-colors"
                            onClick={() => toggleExpand(log.id)}
                          >
                            {isExpanded ? "收起" : "展开全文"}
                          </button>
                        )}
                        {log.tags.length > 0 && (
                          <div className="mt-3.5 flex flex-wrap gap-1.5">
                            {log.tags.map((t) => (
                              <span key={t} className="chip !py-1 !px-2.5 !text-[0.68rem]">
                                # {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-5 pt-4 border-t hairline flex items-center justify-between">
                          <span className="text-[0.68rem] text-inkfaint font-mono tracking-[0.15em]">NO. {log.id.slice(-4)}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              className="btn btn-ghost !p-2"
                              onClick={() => startEdit(log)}
                              title="编辑"
                            >
                              <PencilSimple size={15} />
                            </button>
                            <button
                              className={`btn ${confirmId === log.id ? "btn-rose" : "btn-ghost"} !p-2`}
                              onClick={() => startDelete(log.id)}
                              title={confirmId === log.id ? "确认删除" : "删除"}
                            >
                              {confirmId === log.id ? <Check size={15} weight="bold" /> : <Trash size={15} />}
                            </button>
                          </div>
                        </div>
                        </BorderGlow>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
