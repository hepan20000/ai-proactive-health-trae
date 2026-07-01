import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutDashboard, UserCheck, Activity } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "主动健康管理机构端" },
      { name: "description", content: "面向健康管理机构的多角色运营管理平台" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary" />
            <span className="text-base font-semibold tracking-tight">主动健康管理 · 机构端</span>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/dashboard" className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">业务监管大屏</Link>
            <Link to="/health-profile" className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">居民健康画像</Link>
            <Link to="/doctor-approval" className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">医生入驻审批</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">机构端控制中心</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          以居民健康画像为核心数据资产，以医生主动干预为核心服务模式。下方为本次交付的两个页面入口。
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/dashboard"
            className="group rounded-xl border bg-card p-6 transition hover:border-primary/40 hover:shadow-lg"
          >
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">业务监管大屏</h2>
            <p className="mt-1 text-sm text-muted-foreground">M07 · 运营指标、实时预警态势、医生绩效与设备在线概览。</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">进入大屏 →</span>
          </Link>
          <Link
            to="/doctor-approval"
            className="group rounded-xl border bg-card p-6 transition hover:border-primary/40 hover:shadow-lg"
          >
            <UserCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">医生入驻审批</h2>
            <p className="mt-1 text-sm text-muted-foreground">M01 · 双通道资质审核、批量审批、驳回与延迟激活。</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">进入审批 →</span>
          </Link>
          <Link
            to="/health-profile"
            className="group rounded-xl border bg-card p-6 transition hover:border-primary/40 hover:shadow-lg"
          >
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">居民健康画像</h2>
            <p className="mt-1 text-sm text-muted-foreground">生理数字人 · 生命体征、睡眠运动、器官分析与疾病风险预测。</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">进入画像 →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
