import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity, AlertTriangle, ArrowUpRight, BatteryLow, HeartPulse,
  Users, Wifi, WifiOff, Stethoscope, ArrowLeft, Radio,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "业务监管大屏 · 主动健康管理" },
      { name: "description", content: "运营核心指标、实时预警态势、医生绩效与设备在线概览。" },
    ],
  }),
  component: DashboardPage,
});

const trendData = Array.from({ length: 7 }).map((_, i) => ({
  day: `${i + 22}日`,
  脑血管: 12 + Math.round(Math.sin(i) * 4) + i,
  睡眠: 18 + Math.round(Math.cos(i) * 5) + Math.round(i / 2),
  情绪: 8 + Math.round(Math.sin(i + 1) * 3) + i,
}));

const newResidents = Array.from({ length: 7 }).map((_, i) => ({
  day: `${i + 22}日`,
  value: 40 + Math.round(Math.sin(i / 1.5) * 12) + i * 3,
}));

const riskPie = [
  { name: "脑血管", value: 38, color: "var(--color-chart-4)" },
  { name: "睡眠", value: 27, color: "var(--color-chart-1)" },
  { name: "情绪压力", value: 19, color: "var(--color-chart-5)" },
  { name: "其他", value: 16, color: "var(--color-chart-3)" },
];

const doctorRanking = [
  { name: "陈雪松", dept: "心内科", interventions: 142, plans: 38, response: 6.2, score: 4.9 },
  { name: "周婷",   dept: "神经内科", interventions: 128, plans: 35, response: 7.4, score: 4.8 },
  { name: "李翰林", dept: "全科",   interventions: 117, plans: 31, response: 8.1, score: 4.8 },
  { name: "黄宇航", dept: "内分泌", interventions: 102, plans: 27, response: 9.6, score: 4.7 },
  { name: "罗思琪", dept: "睡眠",   interventions:  96, plans: 24, response: 10.2, score: 4.7 },
  { name: "孙磊",   dept: "心理",   interventions:  84, plans: 19, response: 12.8, score: 4.6 },
];

const alertFeed = [
  { time: "10:42:18", level: "高危", name: "王建国 · 68岁", msg: "收缩压 186 mmHg，触发脑血管红色预警", doctor: "陈雪松" },
  { time: "10:39:51", level: "高危", name: "刘梅 · 71岁",   msg: "夜间血氧持续 < 88%，触发睡眠呼吸预警", doctor: "罗思琪" },
  { time: "10:36:07", level: "中危", name: "张伟 · 54岁",   msg: "PHQ-9 自评 16 分，情绪压力中度", doctor: "孙磊" },
  { time: "10:31:44", level: "中危", name: "赵芳 · 49岁",   msg: "心率连续 30 分钟 > 110 次/分", doctor: "周婷" },
  { time: "10:27:12", level: "提醒", name: "周文 · 62岁",   msg: "智能手表电量 12%，建议联系充电", doctor: "客服 李欣" },
  { time: "10:21:09", level: "高危", name: "吴桂英 · 76岁", msg: "突发心率失常，已自动呼叫责任医生", doctor: "陈雪松" },
];

const levelStyles: Record<string, string> = {
  高危: "bg-[color:var(--color-danger)]/15 text-[color:var(--color-danger)] border-[color:var(--color-danger)]/40",
  中危: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)] border-[color:var(--color-warning)]/40",
  提醒: "bg-[color:var(--color-info)]/15 text-[color:var(--color-info)] border-[color:var(--color-info)]/40",
};

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function DashboardPage() {
  const now = useClock();
  const date = now.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "long" });
  const time = now.toLocaleTimeString("zh-CN", { hour12: false });

  return (
    <div className="min-h-screen bg-[color:var(--color-screen-bg)] text-[color:var(--color-screen-foreground)] grid-bg">
      {/* Header */}
      <header className="relative border-b border-[color:var(--color-screen-border)] px-8 py-5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-screen-accent)]/60 to-transparent" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-[color:var(--color-screen-muted)]">
            <Link to="/" className="flex items-center gap-1 hover:text-[color:var(--color-screen-accent)]">
              <ArrowLeft className="h-4 w-4" /> 返回
            </Link>
            <span className="opacity-40">|</span>
            <span>{date}</span>
            <span className="font-mono tabular-nums text-[color:var(--color-screen-foreground)]">{time}</span>
          </div>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold tracking-[0.3em]">
            主 动 健 康 业 务 监 管 大 屏
          </h1>
          <div className="flex items-center gap-2 text-xs text-[color:var(--color-screen-muted)]">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            数据每 30s 刷新
          </div>
        </div>
      </header>

      <div className="grid gap-4 p-6 xl:grid-cols-12">
        {/* KPI row */}
        <section className="xl:col-span-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <KpiCard icon={<Users className="h-5 w-5" />} label="在管居民总数" value="12,486" delta="+128 今日" tone="info" />
          <KpiCard icon={<Activity className="h-5 w-5" />} label="活跃设备数" value="9,217" delta="在线率 87.4%" tone="success" />
          <KpiCard icon={<AlertTriangle className="h-5 w-5" />} label="待处理预警" value="42" delta="高危 7" tone="danger" pulse />
          <KpiCard icon={<HeartPulse className="h-5 w-5" />} label="今日干预人次" value="318" delta="覆盖率 100%" tone="accent" />
        </section>

        {/* Middle row */}
        <section className="xl:col-span-3 screen-panel p-5">
          <PanelTitle title="风险类型分布" subtitle="近 24h 触发占比" />
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskPie} dataKey="value" innerRadius={48} outerRadius={78} paddingAngle={3} stroke="none">
                  {riskPie.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {riskPie.map((d) => (
              <li key={d.name} className="flex items-center justify-between rounded-md border border-[color:var(--color-screen-border)] px-2 py-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-mono text-[color:var(--color-screen-muted)]">{d.value}%</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="xl:col-span-6 screen-panel p-5">
          <PanelTitle title="近 7 日警情趋势" subtitle="按风险类型分系列" right={<Legend2 />} />
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid stroke="var(--color-screen-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-screen-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-screen-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="脑血管" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="睡眠" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="情绪" stroke="var(--color-chart-5)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="xl:col-span-3 screen-panel p-5">
          <PanelTitle title="设备在线概览" subtitle="智能穿戴 · 实时" />
          <div className="mt-3 space-y-3">
            <DeviceStat icon={<Wifi className="h-4 w-4" />} label="在线" value={8056} total={9217} tone="success" />
            <DeviceStat icon={<WifiOff className="h-4 w-4" />} label="离线" value={1161} total={9217} tone="muted" />
            <DeviceStat icon={<BatteryLow className="h-4 w-4" />} label="低电量 < 20%" value={283} total={9217} tone="warning" />
            <DeviceStat icon={<Radio className="h-4 w-4" />} label="心跳异常" value={37} total={9217} tone="danger" />
          </div>
          <div className="mt-5 rounded-md border border-[color:var(--color-screen-border)] p-3">
            <p className="text-xs text-[color:var(--color-screen-muted)]">客服跟进反馈率</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">96.2%</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-[color:var(--color-success)]" style={{ width: "96.2%" }} />
            </div>
          </div>
        </section>

        {/* Bottom row */}
        <section className="xl:col-span-5 screen-panel p-5">
          <PanelTitle
            title="实时预警流"
            subtitle="按时间倒序"
            right={<span className="text-xs text-[color:var(--color-screen-muted)]">共 42 条待处理</span>}
          />
          <ul className="mt-3 max-h-[360px] divide-y divide-[color:var(--color-screen-border)] overflow-hidden">
            {alertFeed.map((a, i) => (
              <li key={i} className="flex items-start gap-3 py-3">
                <span className="mt-0.5 font-mono text-xs text-[color:var(--color-screen-muted)]">{a.time}</span>
                <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] ${levelStyles[a.level]}`}>{a.level}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-medium">{a.name}</span>
                    <span className="ml-2 text-[color:var(--color-screen-muted)]">{a.msg}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-[color:var(--color-screen-muted)]">→ 指派给 {a.doctor}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="xl:col-span-4 screen-panel p-5">
          <PanelTitle title="医生绩效榜" subtitle="本月干预人次 TOP" right={<Stethoscope className="h-4 w-4 text-[color:var(--color-screen-muted)]" />} />
          <div className="mt-3 space-y-2">
            {doctorRanking.map((d, i) => {
              const max = doctorRanking[0].interventions;
              const w = (d.interventions / max) * 100;
              return (
                <div key={d.name} className="rounded-md border border-[color:var(--color-screen-border)] px-3 py-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`flex h-5 w-5 items-center justify-center rounded text-[11px] font-semibold ${i < 3 ? "bg-[color:var(--color-screen-accent)]/20 text-[color:var(--color-screen-accent)]" : "bg-white/5 text-[color:var(--color-screen-muted)]"}`}>{i + 1}</span>
                      <span className="font-medium">{d.name}</span>
                      <span className="text-xs text-[color:var(--color-screen-muted)]">{d.dept}</span>
                    </span>
                    <span className="font-mono tabular-nums">{d.interventions}</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-screen-accent)] to-[color:var(--color-chart-2)]" style={{ width: `${w}%` }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-[color:var(--color-screen-muted)]">
                    <span>方案 {d.plans}</span>
                    <span>响应 {d.response} 分</span>
                    <span>满意度 {d.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="xl:col-span-3 grid grid-cols-1 gap-4">
          <div className="screen-panel p-5">
            <PanelTitle title="新增在管居民" subtitle="近 7 日" />
            <div className="h-32">
              <ResponsiveContainer>
                <AreaChart data={newResidents}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-screen-accent)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-screen-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area dataKey="value" stroke="var(--color-screen-accent)" strokeWidth={2} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-semibold tabular-nums">+342</span>
              <span className="inline-flex items-center gap-0.5 text-xs text-[color:var(--color-success)]">
                <ArrowUpRight className="h-3 w-3" /> 周环比 12.4%
              </span>
            </div>
          </div>

          <div className="screen-panel p-5">
            <PanelTitle title="健康评级分布" subtitle="在管居民" />
            <div className="h-40">
              <ResponsiveContainer>
                <BarChart data={[
                  { name: "绿 · 正常", v: 8420, c: "var(--color-success)" },
                  { name: "黄 · 亚健康", v: 3210, c: "var(--color-warning)" },
                  { name: "红 · 高危", v: 856, c: "var(--color-danger)" },
                ]} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid stroke="var(--color-screen-border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-screen-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--color-screen-muted)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="v" radius={[0, 4, 4, 0]}>
                    {[0, 1, 2].map((i) => <Cell key={i} fill={["var(--color-success)", "var(--color-warning)", "var(--color-danger)"][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: "oklch(0.22 0.05 230)",
  border: "1px solid var(--color-screen-border)",
  borderRadius: 8,
  color: "var(--color-screen-foreground)",
  fontSize: 12,
} as const;

function PanelTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between border-b border-[color:var(--color-screen-border)] pb-3">
      <div>
        <h3 className="text-sm font-semibold tracking-wider text-[color:var(--color-screen-foreground)]">
          <span className="mr-2 inline-block h-3 w-0.5 align-[-1px] bg-[color:var(--color-screen-accent)]" />
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-[11px] text-[color:var(--color-screen-muted)]">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function Legend2() {
  const items = [
    { name: "脑血管", c: "var(--color-chart-4)" },
    { name: "睡眠", c: "var(--color-chart-1)" },
    { name: "情绪", c: "var(--color-chart-5)" },
  ];
  return (
    <div className="flex gap-3 text-[11px] text-[color:var(--color-screen-muted)]">
      {items.map((i) => (
        <span key={i.name} className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: i.c }} /> {i.name}
        </span>
      ))}
    </div>
  );
}

function KpiCard({
  icon, label, value, delta, tone, pulse,
}: {
  icon: React.ReactNode; label: string; value: string; delta: string;
  tone: "info" | "success" | "danger" | "accent"; pulse?: boolean;
}) {
  const toneMap = {
    info:    "from-[color:var(--color-info)]/30 to-transparent text-[color:var(--color-info)]",
    success: "from-[color:var(--color-success)]/30 to-transparent text-[color:var(--color-success)]",
    danger:  "from-[color:var(--color-danger)]/30 to-transparent text-[color:var(--color-danger)]",
    accent:  "from-[color:var(--color-screen-accent)]/30 to-transparent text-[color:var(--color-screen-accent)]",
  } as const;
  return (
    <div className="screen-panel relative overflow-hidden p-5">
      <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-radial ${toneMap[tone]} opacity-40 blur-2xl`} />
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-wider text-[color:var(--color-screen-muted)]">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-md bg-white/5 ${toneMap[tone].split(" ").pop()}`}>
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums tracking-tight">{value}</span>
        {pulse && (
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-danger)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-danger)]" />
          </span>
        )}
      </div>
      <p className={`mt-1 text-xs ${toneMap[tone].split(" ").pop()}`}>{delta}</p>
    </div>
  );
}

function DeviceStat({
  icon, label, value, total, tone,
}: { icon: React.ReactNode; label: string; value: number; total: number; tone: "success" | "muted" | "warning" | "danger" }) {
  const pct = (value / total) * 100;
  const color = {
    success: "var(--color-success)",
    muted: "var(--color-screen-muted)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
  }[tone];
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-[color:var(--color-screen-muted)]">
          <span style={{ color }}>{icon}</span> {label}
        </span>
        <span className="font-mono tabular-nums" style={{ color }}>{value.toLocaleString()}</span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
