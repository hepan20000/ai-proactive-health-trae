import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Heart, Droplet, Wind, Thermometer, Activity, FlaskConical,
  Power, User,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend,
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/health-profile")({
  head: () => ({
    meta: [
      { title: "居民健康画像 · 数字人模型" },
      { name: "description", content: "以生理数字人为核心，呈现居民多维度健康指标、睡眠、运动、器官分析与疾病风险预测。" },
    ],
  }),
  component: HealthProfilePage,
});

// ---------- mock data ----------
const sleepData = Array.from({ length: 8 }).map((_, i) => ({
  seg: `${i}`,
  深睡: 60 + Math.round(Math.sin(i) * 15) + 20,
  浅睡: 40 + Math.round(Math.cos(i) * 20) + 15,
  清醒: i === 3 || i === 6 ? 15 : 4,
}));

const stepData = Array.from({ length: 25 }).map((_, h) => {
  let v = 40;
  if (h >= 6 && h <= 9) v = 800 + Math.random() * 1100;
  else if (h >= 12 && h <= 14) v = 300 + Math.random() * 500;
  else if (h >= 18 && h <= 20) v = 200 + Math.random() * 400;
  else if (h >= 1 && h <= 5) v = 0;
  return { h: `${String(h).padStart(2, "0")}:00`, v: Math.round(v) };
});

const hrTrend = Array.from({ length: 48 }).map((_, i) => ({
  t: `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
  v: 72 + Math.round(Math.sin(i / 3) * 14) + Math.round(Math.random() * 8),
}));

const riskList = [
  { name: "房颤",     v: 0 },
  { name: "心力衰竭", v: 0 },
  { name: "冠心病",   v: 0 },
  { name: "心动过速", v: 5.2 },
  { name: "心动过缓", v: 0.1 },
  { name: "心梗",     v: 0.6 },
  { name: "脑卒中",   v: 1.8 },
  { name: "糖尿病",   v: 3.4 },
];

const bodyTags: { label: string; tone: "good" | "warn" | "normal"; side: "L" | "R"; top: number }[] = [
  { label: "睡眠不足", tone: "warn",   side: "L", top: 8 },
  { label: "异常血脂", tone: "warn",   side: "R", top: 8 },
  { label: "高血脂",   tone: "normal", side: "L", top: 24 },
  { label: "高血压",   tone: "normal", side: "R", top: 24 },
  { label: "高血脂",   tone: "normal", side: "L", top: 40 },
  { label: "高血压",   tone: "normal", side: "R", top: 40 },
  { label: "正常体重", tone: "good",   side: "L", top: 56 },
  { label: "正常心率", tone: "good",   side: "R", top: 56 },
  { label: "正常血压", tone: "good",   side: "L", top: 72 },
  { label: "正常尿酸", tone: "good",   side: "R", top: 72 },
];

const organs = [
  "肝", "心", "脾", "肺", "肾", "胃", "胆", "膀胱",
  "大肠", "小肠", "心包", "三焦",
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function HealthProfilePage() {
  const now = useClock();
  const stamp =
    now.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "-") +
    " " +
    now.toLocaleTimeString("zh-CN", { hour12: false });

  return (
    <div className="min-h-screen bg-[color:var(--color-screen-bg)] text-[color:var(--color-screen-foreground)] grid-bg">
      {/* Header */}
      <header className="relative border-b border-[color:var(--color-screen-border)] px-8 py-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-screen-accent)]/60 to-transparent" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-[color:var(--color-screen-muted)]">
            <Link to="/" className="flex items-center gap-1 hover:text-[color:var(--color-screen-accent)]">
              <ArrowLeft className="h-4 w-4" /> 返回
            </Link>
            <span className="opacity-40">|</span>
            <span>北京时间：</span>
            <span className="font-mono tabular-nums text-[color:var(--color-screen-foreground)]">{stamp}</span>
          </div>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold tracking-[0.3em]">
            居 民 健 康 画 像
          </h1>
          <button className="text-[color:var(--color-screen-muted)] hover:text-[color:var(--color-screen-accent)]">
            <Power className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="grid gap-4 p-6 xl:grid-cols-12">
        {/* LEFT column */}
        <section className="xl:col-span-3 space-y-4">
          {/* profile */}
          <div className="screen-panel p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-screen-accent)]/15 text-[color:var(--color-screen-accent)]">
                  <User className="h-4 w-4" />
                </span>
                <span className="font-medium">用****6</span>
              </span>
              <span className="text-xs text-[color:var(--color-screen-muted)]">手机号 139****9056</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
              {[["性别", "男"], ["身高", "170cm"], ["体重", "69kg"], ["BMI", "23.88"]].map(([k, v]) => (
                <div key={k} className="rounded-md border border-[color:var(--color-screen-border)] py-2">
                  <div className="text-[color:var(--color-screen-muted)]">{k}</div>
                  <div className="mt-0.5 font-mono text-sm text-[color:var(--color-screen-foreground)]">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* vitals grid */}
          <div className="grid grid-cols-2 gap-3">
            <VitalCard icon={<Heart className="h-4 w-4" />} label="心率" value="80" unit="次/分" ts="13:52" tone="danger" />
            <VitalCard icon={<Droplet className="h-4 w-4" />} label="血氧" value="99" unit="%" ts="13:52" tone="info" />
            <VitalCard icon={<Wind className="h-4 w-4" />} label="呼吸率" value="19" unit="次/分" ts="13:52" tone="accent" />
            <VitalCard icon={<Thermometer className="h-4 w-4" />} label="体温" value="—" unit="°C" ts="13:59" tone="warn" />
            <VitalCard icon={<Activity className="h-4 w-4" />} label="血压" value="128/53" unit="mmHg" ts="13:52" tone="danger" />
            <VitalCard icon={<Droplet className="h-4 w-4" />} label="血糖" value="5" unit="mmol/L" ts="21:00" tone="info" />
            <VitalCard icon={<FlaskConical className="h-4 w-4" />} label="尿酸" value="423" unit="μmol/L" ts="07:00" tone="warn" />
            <div className="screen-panel p-3 text-[11px] leading-relaxed">
              <div className="mb-1 text-[color:var(--color-screen-muted)]">血脂四项</div>
              <Lipid k="总胆固醇" tag="正常" v="4.33" tone="good" />
              <Lipid k="甘油三酯" tag="偏高" v="2.46" tone="warn" />
              <Lipid k="高密度蛋白" tag="偏低" v="0.92" tone="warn" />
              <Lipid k="低密度蛋白" tag="正常" v="2.28" tone="good" />
            </div>
          </div>
        </section>

        {/* CENTER column – digital human */}
        <section className="xl:col-span-6 screen-panel relative overflow-hidden p-5">
          <PanelTitle title="生理数字人模型" subtitle="综合健康标签 · 实时映射" />
          <div className="relative mt-4 h-[520px]">
            {/* body silhouette */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <BodySilhouette />
            </div>

            {/* orbit ring */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--color-screen-accent)]/20" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[color:var(--color-screen-accent)]/10" />

            {/* tags */}
            {bodyTags.map((t, i) => (
              <BodyTag key={i} {...t} />
            ))}

            {/* base ring */}
            <div className="absolute inset-x-16 bottom-0 h-16">
              <div className="mx-auto h-full w-full max-w-md rounded-[50%] border border-[color:var(--color-screen-accent)]/40 bg-gradient-to-b from-[color:var(--color-screen-accent)]/10 to-transparent" />
            </div>
          </div>

          {/* health rating */}
          <div className="mt-2 flex items-center justify-center gap-3 border-t border-[color:var(--color-screen-border)] pt-4">
            <span className="text-sm text-[color:var(--color-screen-muted)]">24 小时健康评估：</span>
            <span className="text-lg font-semibold text-[color:var(--color-warning)]">亚健康</span>
            <span className="flex gap-0.5 text-[color:var(--color-warning)]">
              <Star filled /> <Star /> <Star /> <Star /> <Star />
            </span>
          </div>
        </section>

        {/* RIGHT column */}
        <section className="xl:col-span-3 space-y-4">
          <div className="screen-panel p-4">
            <PanelTitle title="睡眠分析" subtitle="入睡 03:22 · 起床 06:04" right={<SleepLegend />} />
            <div className="mt-2 flex gap-4 text-[11px] text-[color:var(--color-screen-muted)]">
              <span>总睡眠 <span className="text-[color:var(--color-screen-foreground)]">2h42m</span></span>
              <span>深睡 <span className="text-[color:var(--color-screen-foreground)]">1h40m</span></span>
              <span>浅睡 <span className="text-[color:var(--color-screen-foreground)]">1h02m</span></span>
            </div>
            <div className="mt-2 h-40">
              <ResponsiveContainer>
                <BarChart data={sleepData} stackOffset="expand" barCategoryGap={4}>
                  <XAxis dataKey="seg" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="深睡" stackId="s" fill="var(--color-chart-2)" />
                  <Bar dataKey="浅睡" stackId="s" fill="var(--color-chart-1)" />
                  <Bar dataKey="清醒" stackId="s" fill="var(--color-warning)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="screen-panel p-4">
            <PanelTitle title="运动分析" subtitle="今日 · 每小时步数" right={<span className="text-xs">总步数 <span className="font-mono text-base text-[color:var(--color-screen-accent)]">5,247</span></span>} />
            <div className="mt-2 h-40">
              <ResponsiveContainer>
                <BarChart data={stepData}>
                  <CartesianGrid stroke="var(--color-screen-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="h" stroke="var(--color-screen-muted)" fontSize={9} tickLine={false} axisLine={false} interval={3} />
                  <YAxis stroke="var(--color-screen-muted)" fontSize={9} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="v" fill="var(--color-chart-5)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* BOTTOM row */}
        <section className="xl:col-span-4 screen-panel p-5">
          <PanelTitle title="用户生理数据" subtitle="心率 · 24h 趋势" />
          <div className="mt-3 flex gap-4 border-b border-[color:var(--color-screen-border)] pb-2 text-xs">
            {["心率", "血氧", "呼吸率", "体温", "血压", "血糖"].map((t, i) => (
              <span key={t} className={i === 0 ? "border-b-2 border-[color:var(--color-screen-accent)] pb-1.5 text-[color:var(--color-screen-accent)]" : "text-[color:var(--color-screen-muted)] hover:text-[color:var(--color-screen-foreground)] cursor-pointer"}>{t}</span>
            ))}
          </div>
          <div className="mt-3 h-52">
            <ResponsiveContainer>
              <AreaChart data={hrTrend}>
                <defs>
                  <linearGradient id="hr" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-screen-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-screen-muted)" fontSize={10} tickLine={false} axisLine={false} interval={7} />
                <YAxis stroke="var(--color-screen-muted)" fontSize={10} tickLine={false} axisLine={false} width={30} domain={[40, 140]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="v" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#hr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="xl:col-span-4 screen-panel p-5">
          <PanelTitle title="未来一个月疾病风险概率" subtitle="AI 模型预测" />
          <ul className="mt-3 space-y-2.5">
            {riskList.map((r) => {
              const tone = r.v >= 5 ? "var(--color-danger)" : r.v >= 1 ? "var(--color-warning)" : "var(--color-chart-1)";
              return (
                <li key={r.name} className="flex items-center gap-3 text-xs">
                  <span className="w-16 shrink-0 text-[color:var(--color-screen-muted)]">{r.name}</span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(r.v * 6, r.v > 0 ? 4 : 0)}%`, background: tone }} />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono tabular-nums" style={{ color: tone }}>{r.v}%</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="xl:col-span-4 screen-panel p-5">
          <PanelTitle title="器官分析 · 子午流注" subtitle="未时 13:00 – 15:00 · 小肠经" />
          <div className="mt-3 flex gap-4">
            <div className="relative h-52 w-52 shrink-0">
              <div className="absolute inset-0 rounded-full border border-[color:var(--color-screen-border)]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-[color:var(--color-screen-accent)]/25" />
              {organs.map((o, i) => {
                const a = (i / organs.length) * Math.PI * 2 - Math.PI / 2;
                const r = 92;
                const x = 50 + (Math.cos(a) * r) / 2;
                const y = 50 + (Math.sin(a) * r) / 2;
                return (
                  <span
                    key={o}
                    className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--color-screen-accent)]/40 bg-[color:var(--color-screen-bg)] text-[10px] text-[color:var(--color-screen-accent)]"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {o}
                  </span>
                );
              })}
              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[color:var(--color-screen-accent)]/50 bg-[color:var(--color-screen-panel)]">
                <div className="text-xs text-[color:var(--color-screen-muted)]">小肠</div>
                <div className="text-sm font-semibold text-[color:var(--color-warning)]">亚健康</div>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-2 text-xs leading-relaxed">
              <p><span className="text-[color:var(--color-screen-accent)]">虚证：</span><span className="text-[color:var(--color-screen-muted)]">腹胀、易便秘、易患痔疮、肩与前臂后背疼痛、指痛、内火旺、口干舌燥。</span></p>
              <p><span className="text-[color:var(--color-screen-accent)]">常见症状：</span><span className="text-[color:var(--color-screen-muted)]">小腹绕脐前痛、心烦气闷、头顶痛、容易腹泻、手脚寒凉、吸收不良、虚肥、肩周炎。</span></p>
              <p><span className="text-[color:var(--color-screen-accent)]">中医解释：</span><span className="text-[color:var(--color-screen-muted)]">未时小肠经当令，主分清泌浊。建议此时段饭后小憩，忌饮浓茶咖啡，宜温饮以助消化。</span></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ---------- helpers ----------
const tooltipStyle = {
  background: "oklch(0.22 0.05 230)",
  border: "1px solid var(--color-screen-border)",
  borderRadius: 8,
  color: "var(--color-screen-foreground)",
  fontSize: 12,
} as const;

function PanelTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between border-b border-[color:var(--color-screen-border)] pb-2">
      <div>
        <h3 className="text-sm font-semibold tracking-wider">
          <span className="mr-2 inline-block h-3 w-0.5 align-[-1px] bg-[color:var(--color-screen-accent)]" />
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-[11px] text-[color:var(--color-screen-muted)]">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function VitalCard({
  icon, label, value, unit, ts, tone,
}: {
  icon: React.ReactNode; label: string; value: string; unit: string; ts: string;
  tone: "danger" | "info" | "warn" | "accent";
}) {
  const color = {
    danger: "var(--color-danger)",
    info: "var(--color-info)",
    warn: "var(--color-warning)",
    accent: "var(--color-screen-accent)",
  }[tone];
  return (
    <div className="screen-panel p-3">
      <div className="flex items-center justify-between text-[11px] text-[color:var(--color-screen-muted)]">
        <span className="flex items-center gap-1.5" style={{ color }}>{icon}<span className="text-[color:var(--color-screen-muted)]">{label}</span></span>
        <span className="font-mono">{ts}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-lg font-semibold tabular-nums" style={{ color }}>{value}</span>
        <span className="text-[11px] text-[color:var(--color-screen-muted)]">{unit}</span>
      </div>
    </div>
  );
}

function Lipid({ k, tag, v, tone }: { k: string; tag: string; v: string; tone: "good" | "warn" }) {
  const c = tone === "good" ? "var(--color-success)" : "var(--color-warning)";
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[color:var(--color-screen-muted)]">{k}</span>
      <span className="flex items-center gap-1.5">
        <span style={{ color: c }}>{tag}</span>
        <span className="font-mono tabular-nums text-[color:var(--color-screen-foreground)]">{v}</span>
      </span>
    </div>
  );
}

function BodyTag({ label, tone, side, top }: { label: string; tone: "good" | "warn" | "normal"; side: "L" | "R"; top: number }) {
  const styles = {
    good:   "border-[color:var(--color-success)]/50 text-[color:var(--color-success)] bg-[color:var(--color-success)]/10",
    warn:   "border-[color:var(--color-warning)]/50 text-[color:var(--color-warning)] bg-[color:var(--color-warning)]/10",
    normal: "border-[color:var(--color-info)]/50 text-[color:var(--color-info)] bg-[color:var(--color-info)]/10",
  }[tone];
  return (
    <div
      className={`absolute z-10 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs backdrop-blur ${styles}`}
      style={{ top: `${top}%`, [side === "L" ? "left" : "right"]: "6%" }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </div>
  );
}

function BodySilhouette() {
  return (
    <svg viewBox="0 0 200 460" className="h-full opacity-70">
      <defs>
        <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-screen-accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <g fill="none" stroke="url(#bg)" strokeWidth="1.2" filter="url(#glow)">
        <circle cx="100" cy="40" r="24" />
        <path d="M76 68 L124 68 L138 130 L128 220 L120 320 L128 420 L108 428 L100 340 L92 428 L72 420 L80 320 L72 220 L62 130 Z" />
        <path d="M62 130 L28 200 L36 260 L46 250 L46 200" />
        <path d="M138 130 L172 200 L164 260 L154 250 L154 200" />
      </g>
      <g fill="url(#bg)" opacity="0.15">
        <path d="M76 68 L124 68 L138 130 L128 220 L120 320 L128 420 L108 428 L100 340 L92 428 L72 420 L80 320 L72 220 L62 130 Z" />
        <circle cx="100" cy="40" r="24" />
      </g>
      {/* spine dots */}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx="100" cy={80 + i * 22} r="1.4" fill="var(--color-screen-accent)" opacity={0.6} />
      ))}
    </svg>
  );
}

function SleepLegend() {
  const items = [
    { name: "深睡", c: "var(--color-chart-2)" },
    { name: "浅睡", c: "var(--color-chart-1)" },
    { name: "清醒", c: "var(--color-warning)" },
  ];
  return (
    <div className="flex gap-2 text-[10px] text-[color:var(--color-screen-muted)]">
      {items.map((i) => (
        <span key={i.name} className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: i.c }} /> {i.name}
        </span>
      ))}
    </div>
  );
}

function Star({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
    </svg>
  );
}
