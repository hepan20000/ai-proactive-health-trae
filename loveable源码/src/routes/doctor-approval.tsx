import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Search, Filter, Download, CheckCircle2, XCircle, Clock,
  FileText, ShieldCheck, AlertCircle, User2, Calendar, Phone, Mail, MapPin,
  ChevronRight, MoreHorizontal, UserPlus,
} from "lucide-react";

export const Route = createFileRoute("/doctor-approval")({
  head: () => ({
    meta: [
      { title: "医生入驻审批 · 主动健康管理" },
      { name: "description", content: "双通道资质审核、批量审批、驳回与延迟激活。" },
    ],
  }),
  component: ApprovalPage,
});

type Status = "待审批" | "已通过" | "已驳回" | "已停用";
type Source = "医生自注册" | "管理员直加";

interface Applicant {
  id: string;
  name: string;
  gender: "男" | "女";
  dept: string;
  title: string;
  years: number;
  hospital: string;
  phone: string;
  email: string;
  city: string;
  source: Source;
  status: Status;
  submittedAt: string;
  licenseNo: string;
  titleNo: string;
  expertise: string[];
  intro: string;
  warnings?: string[];
}

const data: Applicant[] = [
  { id: "DR-2026-0042", name: "陈雪松", gender: "男", dept: "心内科", title: "副主任医师", years: 14, hospital: "市第一人民医院", phone: "138****2284", email: "chen.xs@example.com", city: "上海", source: "医生自注册", status: "待审批", submittedAt: "2026-06-28 09:42", licenseNo: "1101**********42", titleNo: "FZR-2018-08741", expertise: ["高血压管理", "冠心病随访", "心律失常"], intro: "从事心血管慢病管理 14 年，长期负责高血压及冠心病院后随访，擅长基于动态体征的远程干预。" },
  { id: "DR-2026-0041", name: "罗思琪", gender: "女", dept: "睡眠医学", title: "主治医师", years: 8, hospital: "睡眠医学中心", phone: "139****1102", email: "luo.sq@example.com", city: "杭州", source: "医生自注册", status: "待审批", submittedAt: "2026-06-28 09:18", licenseNo: "3301**********11", titleNo: "ZZR-2021-02913", expertise: ["睡眠呼吸暂停", "失眠认知行为治疗"], intro: "聚焦成人睡眠障碍的非药物干预与可穿戴长程监测。", warnings: ["职称证有效期 2026-12 前到期，请提醒续期"] },
  { id: "DR-2026-0040", name: "黄宇航", gender: "男", dept: "内分泌科", title: "主任医师", years: 21, hospital: "省人民医院", phone: "136****7708", email: "huang.yh@example.com", city: "南京", source: "管理员直加", status: "待审批", submittedAt: "2026-06-28 08:51", licenseNo: "3201**********77", titleNo: "ZRY-2010-00518", expertise: ["糖尿病管理", "代谢综合征", "甲状腺"], intro: "代谢性疾病慢病管理专家，主持院内糖尿病多学科诊疗团队。" },
  { id: "DR-2026-0039", name: "周婷", gender: "女", dept: "神经内科", title: "副主任医师", years: 12, hospital: "市第二人民医院", phone: "137****8821", email: "zhou.t@example.com", city: "苏州", source: "医生自注册", status: "待审批", submittedAt: "2026-06-28 08:33", licenseNo: "3205**********88", titleNo: "FZR-2019-04421", expertise: ["脑卒中二级预防", "头痛"], intro: "脑血管疾病高危人群院前主动干预与院后康复管理。" },
  { id: "DR-2026-0038", name: "孙磊", gender: "男", dept: "心理科", title: "主治医师", years: 6, hospital: "心理卫生中心", phone: "135****0029", email: "sun.l@example.com", city: "上海", source: "医生自注册", status: "待审批", submittedAt: "2026-06-27 18:02", licenseNo: "3101**********00", titleNo: "ZZR-2022-08810", expertise: ["焦虑抑郁", "情绪压力干预"], intro: "面向城市职场人群的轻中度情绪问题干预与量表化随访。", warnings: ["执业证扫描件第二页模糊，请确认或补充"] },
  { id: "DR-2026-0037", name: "李翰林", gender: "男", dept: "全科医学", title: "副主任医师", years: 16, hospital: "社区卫生服务中心", phone: "138****5512", email: "li.hl@example.com", city: "成都", source: "管理员直加", status: "已通过", submittedAt: "2026-06-27 15:21", licenseNo: "5101**********55", titleNo: "FZR-2017-02256", expertise: ["慢病综合管理", "老年人健康"], intro: "社区主动健康管理，老年慢病多病共管经验丰富。" },
  { id: "DR-2026-0036", name: "吴静",   gender: "女", dept: "营养科", title: "主治医师", years: 5, hospital: "三甲营养门诊", phone: "139****3344", email: "wu.j@example.com", city: "广州", source: "医生自注册", status: "已驳回", submittedAt: "2026-06-27 11:08", licenseNo: "4401**********33", titleNo: "ZZR-2023-01122", expertise: ["药食同源", "体重管理"], intro: "营养干预与体重管理。" },
];

const tabs: { key: "待审批" | "已通过" | "已驳回" | "全部"; label: string }[] = [
  { key: "待审批", label: "待审批" },
  { key: "已通过", label: "已通过" },
  { key: "已驳回", label: "已驳回" },
  { key: "全部", label: "全部" },
];

function ApprovalPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("待审批");
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("全部科室");
  const [source, setSource] = useState<string>("全部来源");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string>(data[0].id);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"approve" | "reject">("approve");

  const filtered = useMemo(() => {
    return data.filter((d) => {
      if (tab !== "全部" && d.status !== tab) return false;
      if (dept !== "全部科室" && d.dept !== dept) return false;
      if (source !== "全部来源" && d.source !== source) return false;
      if (query && !`${d.name}${d.hospital}${d.id}`.includes(query)) return false;
      return true;
    });
  }, [tab, dept, source, query]);

  const active = data.find((d) => d.id === activeId) ?? data[0];
  const stats = {
    pending: data.filter((d) => d.status === "待审批").length,
    today: 5,
    approvedThisWeek: 18,
    rejectedThisWeek: 3,
  };

  const allChecked = filtered.length > 0 && filtered.every((d) => selected.has(d.id));
  function toggleAll() {
    const next = new Set(selected);
    if (allChecked) filtered.forEach((d) => next.delete(d.id));
    else filtered.forEach((d) => next.add(d.id));
    setSelected(next);
  }
  function toggle(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> 返回
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-sm text-muted-foreground">机构管理</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-sm font-medium">医生入驻审批</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-sm hover:bg-secondary">
              <Download className="h-3.5 w-3.5" /> 导出
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90">
              <UserPlus className="h-3.5 w-3.5" /> 管理员直加医生
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1480px] px-6 py-6">
        {/* Stats */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="待审批" value={stats.pending} icon={<Clock className="h-4 w-4" />} tone="warning" />
          <StatCard label="今日新增申请" value={stats.today} icon={<FileText className="h-4 w-4" />} tone="info" />
          <StatCard label="本周通过" value={stats.approvedThisWeek} icon={<CheckCircle2 className="h-4 w-4" />} tone="success" />
          <StatCard label="本周驳回" value={stats.rejectedThisWeek} icon={<XCircle className="h-4 w-4" />} tone="danger" />
        </section>

        {/* Tabs + filters */}
        <section className="mt-6 rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-4">
            <div className="flex items-center gap-1">
              {tabs.map((t) => {
                const count = t.key === "全部" ? data.length : data.filter((d) => d.status === t.key).length;
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => { setTab(t.key); setSelected(new Set()); }}
                    className={`relative px-4 py-3 text-sm transition ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t.label}
                    <span className={`ml-1.5 rounded px-1.5 py-0.5 text-[11px] ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{count}</span>
                    {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 py-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索姓名 / 编号 / 医院"
                  className="h-8 w-56 rounded-md border bg-background pl-7 pr-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <Select value={dept} onChange={setDept} options={["全部科室", "心内科", "神经内科", "内分泌科", "睡眠医学", "心理科", "全科医学", "营养科"]} />
              <Select value={source} onChange={setSource} options={["全部来源", "医生自注册", "管理员直加"]} />
              <button className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                <Filter className="h-3.5 w-3.5" /> 更多
              </button>
            </div>
          </div>

          {/* Batch bar */}
          {selected.size > 0 && (
            <div className="flex items-center justify-between border-b bg-primary/5 px-4 py-2 text-sm">
              <span>已选择 <b className="text-primary">{selected.size}</b> 条申请</span>
              <div className="flex items-center gap-2">
                <button className="rounded-md border bg-background px-3 py-1 text-sm hover:bg-secondary">导出选中</button>
                <button onClick={() => { setDrawerMode("reject"); setShowDrawer(true); }} className="rounded-md border border-[color:var(--color-danger)]/40 px-3 py-1 text-sm text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/10">批量驳回</button>
                <button onClick={() => { setDrawerMode("approve"); setShowDrawer(true); }} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:opacity-90">批量通过</button>
              </div>
            </div>
          )}

          {/* Split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
            {/* Table */}
            <div className="overflow-x-auto border-r">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left font-normal">
                      <input type="checkbox" checked={allChecked} onChange={toggleAll} className="h-3.5 w-3.5 rounded" />
                    </th>
                    <th className="px-3 py-2 text-left font-normal">医生</th>
                    <th className="px-3 py-2 text-left font-normal">科室 / 职称</th>
                    <th className="px-3 py-2 text-left font-normal">来源</th>
                    <th className="px-3 py-2 text-left font-normal">提交时间</th>
                    <th className="px-3 py-2 text-left font-normal">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => {
                    const isActive = d.id === activeId;
                    return (
                      <tr
                        key={d.id}
                        onClick={() => setActiveId(d.id)}
                        className={`cursor-pointer border-b transition hover:bg-secondary/50 ${isActive ? "bg-primary/5" : ""}`}
                      >
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={selected.has(d.id)} onChange={() => toggle(d.id)} className="h-3.5 w-3.5 rounded" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={d.name} />
                            <div className="min-w-0">
                              <p className="truncate font-medium">{d.name} <span className="ml-1 text-xs font-normal text-muted-foreground">{d.gender} · {d.years}年</span></p>
                              <p className="truncate text-xs text-muted-foreground">{d.id} · {d.hospital}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p>{d.dept}</p>
                          <p className="text-xs text-muted-foreground">{d.title}</p>
                        </td>
                        <td className="px-3 py-3">
                          <SourceTag source={d.source} />
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{d.submittedAt}</td>
                        <td className="px-3 py-3"><StatusTag status={d.status} /></td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-3 py-16 text-center text-sm text-muted-foreground">暂无符合条件的申请</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Detail */}
            <DetailPanel
              applicant={active}
              onApprove={() => { setDrawerMode("approve"); setShowDrawer(true); }}
              onReject={() => { setDrawerMode("reject"); setShowDrawer(true); }}
            />
          </div>
        </section>
      </main>

      {showDrawer && (
        <ActionDrawer
          mode={drawerMode}
          count={selected.size > 0 ? selected.size : 1}
          name={selected.size > 0 ? `${selected.size} 位医生` : active.name}
          onClose={() => setShowDrawer(false)}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: "warning" | "info" | "success" | "danger" }) {
  const toneClass = {
    warning: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
    info: "bg-[color:var(--color-info)]/10 text-[color:var(--color-info)]",
    success: "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]",
    danger: "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]",
  }[tone];
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneClass}`}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded-md border bg-background px-2 text-sm outline-none focus:border-primary"
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function Avatar({ name }: { name: string }) {
  const colors = ["bg-cyan-100 text-cyan-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700", "bg-violet-100 text-violet-700"];
  const c = colors[name.charCodeAt(0) % colors.length];
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${c}`}>
      {name[0]}
    </span>
  );
}

function SourceTag({ source }: { source: Source }) {
  const map = {
    "医生自注册": "border-[color:var(--color-info)]/30 bg-[color:var(--color-info)]/10 text-[color:var(--color-info)]",
    "管理员直加": "border-[color:var(--color-chart-5)]/30 bg-[color:var(--color-chart-5)]/10 text-[color:var(--color-chart-5)]",
  } as const;
  return <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[11px] ${map[source]}`}>{source}</span>;
}

function StatusTag({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    待审批: "border-[color:var(--color-warning)]/30 bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
    已通过: "border-[color:var(--color-success)]/30 bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]",
    已驳回: "border-[color:var(--color-danger)]/30 bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]",
    已停用: "border-muted bg-secondary text-muted-foreground",
  };
  return <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] ${map[status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

function DetailPanel({ applicant, onApprove, onReject }: { applicant: Applicant; onApprove: () => void; onReject: () => void }) {
  return (
    <div className="flex max-h-[calc(100vh-260px)] flex-col overflow-y-auto bg-secondary/30">
      <div className="border-b bg-card px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={applicant.name} />
            <div>
              <h2 className="text-lg font-semibold">{applicant.name}</h2>
              <p className="text-xs text-muted-foreground">{applicant.id} · 提交于 {applicant.submittedAt}</p>
            </div>
          </div>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <SourceTag source={applicant.source} />
          <StatusTag status={applicant.status} />
          <span className="rounded-md border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">{applicant.dept} · {applicant.title}</span>
          <span className="rounded-md border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">{applicant.years} 年执业</span>
        </div>
      </div>

      {applicant.warnings && applicant.warnings.length > 0 && (
        <div className="mx-6 mt-4 flex items-start gap-2 rounded-md border border-[color:var(--color-warning)]/30 bg-[color:var(--color-warning)]/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 text-[color:var(--color-warning)]" />
          <div>
            <p className="font-medium text-[color:var(--color-warning)]">资质校验提示</p>
            <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
              {applicant.warnings.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="px-6 py-5">
        <SectionTitle title="基础信息" />
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <Field icon={<User2 className="h-3.5 w-3.5" />} label="性别 / 工龄" value={`${applicant.gender} · ${applicant.years} 年`} />
          <Field icon={<MapPin className="h-3.5 w-3.5" />} label="执业城市" value={applicant.city} />
          <Field icon={<Phone className="h-3.5 w-3.5" />} label="联系电话" value={applicant.phone} />
          <Field icon={<Mail className="h-3.5 w-3.5" />} label="邮箱" value={applicant.email} />
          <Field icon={<Calendar className="h-3.5 w-3.5" />} label="所属医院" value={applicant.hospital} />
          <Field icon={<ShieldCheck className="h-3.5 w-3.5" />} label="职称" value={applicant.title} />
        </dl>
      </div>

      <div className="border-t px-6 py-5">
        <SectionTitle title="资质双证" right={<button className="text-xs text-primary hover:underline">在线放大查看</button>} />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <CertCard label="执业医师证" no={applicant.licenseNo} valid="2024-06 至 2029-06" />
          <CertCard label="职称证" no={applicant.titleNo} valid="2021-09 至 2026-12" warn={applicant.warnings?.[0]?.includes("职称")} />
        </div>
      </div>

      <div className="border-t px-6 py-5">
        <SectionTitle title="专长标签" />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {applicant.expertise.map((e) => (
            <span key={e} className="rounded-md border bg-background px-2 py-1 text-xs">{e}</span>
          ))}
          <button className="rounded-md border border-dashed px-2 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">+ 分配标签</button>
        </div>
      </div>

      <div className="border-t px-6 py-5">
        <SectionTitle title="个人简介" />
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{applicant.intro}</p>
      </div>

      {/* Footer actions */}
      <div className="sticky bottom-0 mt-auto border-t bg-card/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" className="h-3.5 w-3.5 rounded" /> 通过后延迟激活（24h 后生效）
          </label>
          <div className="flex items-center gap-2">
            <button onClick={onReject} className="rounded-md border border-[color:var(--color-danger)]/30 px-4 py-1.5 text-sm text-[color:var(--color-danger)] hover:bg-[color:var(--color-danger)]/10">
              驳回
            </button>
            <button className="rounded-md border bg-background px-4 py-1.5 text-sm hover:bg-secondary">退回补充</button>
            <button onClick={onApprove} className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
              通过审批
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {right}
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-xs text-muted-foreground">{icon}{label}</dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}

function CertCard({ label, no, valid, warn }: { label: string; no: string; valid: string; warn?: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="relative h-28 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
        <div className="absolute inset-3 rounded-md border border-dashed border-primary/30" />
        <ShieldCheck className="absolute right-3 top-3 h-5 w-5 text-primary/70" />
        <p className="absolute bottom-2 left-3 text-xs font-medium text-primary/80">{label}</p>
      </div>
      <div className="space-y-1 p-3 text-xs">
        <p className="font-mono text-foreground">{no}</p>
        <p className={`flex items-center gap-1 ${warn ? "text-[color:var(--color-warning)]" : "text-muted-foreground"}`}>
          {warn && <AlertCircle className="h-3 w-3" />} 有效期：{valid}
        </p>
      </div>
    </div>
  );
}

function ActionDrawer({ mode, count, name, onClose }: { mode: "approve" | "reject"; count: number; name: string; onClose: () => void }) {
  const isApprove = mode === "approve";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30 sm:items-center sm:justify-center">
      <div className="w-full max-w-md rounded-t-xl bg-card p-6 shadow-xl sm:rounded-xl">
        <h3 className="text-base font-semibold">
          {isApprove ? "确认通过审批" : "驳回入驻申请"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          即将{isApprove ? "通过" : "驳回"} <b className="text-foreground">{name}</b> 的入驻申请{count > 1 ? "（批量操作）" : ""}。
        </p>
        {isApprove ? (
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between rounded-md border p-3 text-sm">
              <span>延迟激活</span>
              <input type="checkbox" className="h-4 w-4" />
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">激活生效时间</span>
              <input type="datetime-local" className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" />
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">备注（仅内部可见）</span>
              <textarea rows={3} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" placeholder="可填写资质核验结论 / 标签分配说明" />
            </label>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="text-muted-foreground">驳回原因（将以短信通知医生）</span>
              <select className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm">
                <option>资质证件不清晰，请重新上传</option>
                <option>执业证有效期不符</option>
                <option>科室与职称信息不一致</option>
                <option>其他原因</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground">补充说明</span>
              <textarea rows={4} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm" placeholder="请填写具体原因，方便医生补充材料" />
            </label>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-4 py-1.5 text-sm hover:bg-secondary">取消</button>
          <button
            onClick={onClose}
            className={`rounded-md px-4 py-1.5 text-sm font-medium text-primary-foreground ${isApprove ? "bg-primary" : "bg-[color:var(--color-danger)]"} hover:opacity-90`}
          >
            确认{isApprove ? "通过" : "驳回"}
          </button>
        </div>
      </div>
    </div>
  );
}
