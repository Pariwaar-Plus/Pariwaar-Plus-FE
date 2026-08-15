"use client";

import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  ArrowUp,
  Check,
  Droplet,
  Heart,
  Minus,
  Wind
} from "lucide-react";
import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getClientHealthDashboard,
  ReceiverHealthData,
  VisitLogEntry
} from "../api/client-dashboard-api";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });
}

function formatDateFull(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

type VitalStatus = "normal" | "warning" | "danger" | "unknown";

function getBpStatus(sys: number | null, dia: number | null): VitalStatus {
  if (!sys || !dia) return "unknown";
  if (sys >= 140 || dia >= 90) return "danger";
  if (sys >= 130 || dia >= 80) return "warning";
  return "normal";
}

function getGlucoseStatus(val: number | null): VitalStatus {
  if (!val) return "unknown";
  if (val > 140 || val < 70) return "danger";
  if (val > 125) return "warning";
  return "normal";
}

function getO2Status(val: number | null): VitalStatus {
  if (!val) return "unknown";
  if (val < 93) return "danger";
  if (val < 95) return "warning";
  return "normal";
}

function getPulseStatus(val: number | null): VitalStatus {
  if (!val) return "unknown";
  if (val > 100 || val < 50) return "danger";
  if (val > 90 || val < 60) return "warning";
  return "normal";
}

function getRowStatus(log: VisitLogEntry): VitalStatus {
  const statuses = [
    getBpStatus(log.bloodPressureSystolic, log.bloodPressureDiastolic),
    getGlucoseStatus(log.bloodSugar),
    getO2Status(log.oxygenSaturation),
    getPulseStatus(log.pulseRate),
  ];
  if (statuses.includes("danger"))  return "danger";
  if (statuses.includes("warning")) return "warning";
  if (statuses.every((s) => s === "unknown")) return "unknown";
  return "normal";
}

const STATUS_BADGE: Record<VitalStatus, { label: string; className: string }> = {
  normal:  { label: "Normal",  className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" },
  warning: { label: "Watch",   className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800" },
  danger:  { label: "High",    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800" },
  unknown: { label: "No data", className: "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700" },
};

/* ─────────────────────────────────────────────
   Stat card (top row summary tiles)
───────────────────────────────────────────── */

interface StatCardProps {
  icon:    React.ElementType;
  label:   string;
  value:   string;
  unit?:   string;
  status:  VitalStatus;
  trend?:  string;
}

const STATUS_TREND: Record<VitalStatus, { icon: React.ElementType; color: string }> = {
  normal:  { icon: Check,     color: "text-emerald-600 dark:text-emerald-400" },
  warning: { icon: ArrowUp,   color: "text-amber-600 dark:text-amber-400" },
  danger:  { icon: ArrowUp,   color: "text-red-600 dark:text-red-400" },
  unknown: { icon: Minus,     color: "text-slate-400" },
};

function StatCard({ icon: Icon, label, value, unit, status, trend }: StatCardProps) {
  const { icon: TIcon, color } = STATUS_TREND[status];
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none mb-1">
        {value}
        {unit && <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>}
      </p>
      <div className={cn("flex items-center gap-1 text-xs font-medium mt-2", color)}>
        <TIcon className="w-3 h-3" />
        {trend ?? STATUS_BADGE[status].label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Vitals table
───────────────────────────────────────────── */

function VitalsTable({ logs }: { logs: VisitLogEntry[] }) {
  const thClass = "text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3 text-left whitespace-nowrap";
  const tdClass = "py-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap";

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <th className={thClass}>Date</th>
            <th className={thClass}>BP (mmHg)</th>
            <th className={thClass}>Glucose</th>
            <th className={thClass}>SpO₂</th>
            <th className={thClass}>Pulse</th>
            <th className={thClass}>Temp</th>
            <th className={cn(thClass, "text-right")}>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-10 text-center text-sm text-slate-400">
                No visit data recorded yet
              </td>
            </tr>
          ) : (
            logs.map((log) => {
              const rowStatus = getRowStatus(log);
              const { label, className } = STATUS_BADGE[rowStatus];
              return (
                <tr
                  key={log.id}
                  className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className={tdClass}>{formatDateFull(log.scheduledAt)}</td>
                  <td className={tdClass}>
                    {log.bloodPressureSystolic && log.bloodPressureDiastolic
                      ? `${log.bloodPressureSystolic}/${log.bloodPressureDiastolic}`
                      : "—"}
                  </td>
                  <td className={tdClass}>
                    {log.bloodSugar ? `${log.bloodSugar} mg/dL` : "—"}
                  </td>
                  <td className={tdClass}>
                    {log.oxygenSaturation ? `${log.oxygenSaturation}%` : "—"}
                  </td>
                  <td className={tdClass}>
                    {log.pulseRate ? `${log.pulseRate} bpm` : "—"}
                  </td>
                  <td className={tdClass}>
                    {log.temperature ? `${log.temperature}°C` : "—"}
                  </td>
                  <td className="py-3 text-right">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border",
                      className
                    )}>
                      {label}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Chart data + reusable trend chart
───────────────────────────────────────────── */

function buildChartData(logs: VisitLogEntry[]) {
  return [...logs].reverse().map((log) => ({
    date: formatDate(log.scheduledAt),
    sys:  log.bloodPressureSystolic  ?? null,
    dia:  log.bloodPressureDiastolic ?? null,
    glucose: log.bloodSugar       ?? null,
    spo2:    log.oxygenSaturation ?? null,
    pulse:   log.pulseRate        ?? null,
  }));
}

type ChartRow = ReturnType<typeof buildChartData>[number];
type ChartKey = "sys" | "dia" | "glucose" | "spo2" | "pulse";

interface LineConfig {
  key:   ChartKey;
  name:  string;
  color: string;
}

interface VitalOption {
  value: "bloodPressure" | "glucose" | "spo2" | "pulse";
  label: string;
  unit:  string;
  lines: LineConfig[];
  statusFn: (row: ChartRow) => VitalStatus;
}

const VITAL_OPTIONS: VitalOption[] = [
  {
    value: "bloodPressure",
    label: "Blood pressure",
    unit: "mmHg",
    lines: [
      { key: "sys", name: "Systolic",  color: "#E24B4A" },
      { key: "dia", name: "Diastolic", color: "#378ADD" },
    ],
    statusFn: (row) => getBpStatus(row.sys, row.dia),
  },
  {
    value: "glucose",
    label: "Blood glucose",
    unit: "mg/dL",
    lines: [{ key: "glucose", name: "Glucose", color: "#EF9F27" }],
    statusFn: (row) => getGlucoseStatus(row.glucose),
  },
  {
    value: "spo2",
    label: "Oxygen saturation",
    unit: "%",
    lines: [{ key: "spo2", name: "SpO₂", color: "#1D9E75" }],
    statusFn: (row) => getO2Status(row.spo2),
  },
  {
    value: "pulse",
    label: "Pulse rate",
    unit: "bpm",
    lines: [{ key: "pulse", name: "Pulse", color: "#8B5CF6" }],
    statusFn: (row) => getPulseStatus(row.pulse),
  },
];

const chartProps = {
  margin:    { top: 4, right: 8, left: -16, bottom: 0 },
  className: "text-xs",
};

/** Generic trend chart — renders whichever line(s) the selected vital needs. */
function TrendChart({ data, lines }: { data: ChartRow[]; lines: LineConfig[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────────────────────────────
   Vital tabs (replaces the dropdown)
───────────────────────────────────────────── */

function VitalTabs({
  value,
  onChange,
}: {
  value: VitalOption["value"];
  onChange: (v: VitalOption["value"]) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 p-1 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-100 dark:border-slate-800">
      {VITAL_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 h-7 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
            value === opt.value
              ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stats summary (fills whitespace with real info)
───────────────────────────────────────────── */

function computeSeriesStats(data: ChartRow[], key: ChartKey) {
  const values = data
    .map((row) => row[key])
    .filter((v): v is number => v !== null && v !== undefined);

  if (values.length === 0) {
    return { latest: null, avg: null, min: null, max: null };
  }

  const latest = values[values.length - 1];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  return { latest, avg, min, max };
}

function StatsSummary({ data, option }: { data: ChartRow[]; option: VitalOption }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {option.lines.map((line) => {
        const stats = computeSeriesStats(data, line.key);
        return (
          <div
            key={line.key}
            className="rounded-lg border border-slate-100 dark:border-slate-800 p-3"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: line.color }}
              />
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {line.name}
              </span>
            </div>
            {stats.latest === null ? (
              <p className="text-xs text-slate-400">No data</p>
            ) : (
              <>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none mb-2">
                  {stats.latest}
                  <span className="text-[11px] font-normal text-slate-400 ml-1">
                    {option.unit}
                  </span>
                </p>
                <div className="flex gap-3 text-[11px] text-slate-400">
                  <span>Avg {stats.avg!.toFixed(1)}</span>
                  <span>Min {stats.min}</span>
                  <span>Max {stats.max}</span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Receiver panel
───────────────────────────────────────────── */

function ReceiverPanel({ receiver }: { receiver: ReceiverHealthData }) {
  const v = receiver.latestVitals;
  const chartData = buildChartData(receiver.visitLogs);
  const [selectedVital, setSelectedVital] = React.useState<VitalOption["value"]>(
    "bloodPressure"
  );

  const selectedOption =
    VITAL_OPTIONS.find((opt) => opt.value === selectedVital) ?? VITAL_OPTIONS[0];

  return (
    <div className="space-y-5">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={Heart}
          label="Blood Pressure"
          value={v?.bloodPressureSystolic && v?.bloodPressureDiastolic
            ? `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic}`
            : "—"}
          unit="mmHg"
          status={getBpStatus(v?.bloodPressureSystolic ?? null, v?.bloodPressureDiastolic ?? null)}
        />
        <StatCard
          icon={Droplet}
          label="Blood Glucose"
          value={v?.bloodSugar ? String(v.bloodSugar) : "—"}
          unit="mg/dL"
          status={getGlucoseStatus(v?.bloodSugar ?? null)}
        />
        <StatCard
          icon={Wind}
          label="SpO₂"
          value={v?.oxygenSaturation ? String(v.oxygenSaturation) : "—"}
          unit="%"
          status={getO2Status(v?.oxygenSaturation ?? null)}
        />
        <StatCard
          icon={Activity}
          label="Pulse Rate"
          value={v?.pulseRate ? String(v.pulseRate) : "—"}
          unit="bpm"
          status={getPulseStatus(v?.pulseRate ?? null)}
        />
      </div>

      {/* ── Interactive trend card ── */}
      {chartData.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {selectedOption.label} trend
            </p>
            <VitalTabs value={selectedVital} onChange={setSelectedVital} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TrendChart data={chartData} lines={selectedOption.lines} />
            </div>
            <div>
              <StatsSummary data={chartData} option={selectedOption} />
            </div>
          </div>
        </div>
      )}

      {/* ── Vitals history table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Visit vitals history
        </p>
        <VitalsTable logs={receiver.visitLogs} />
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex gap-2">
        <div className="h-8 w-28 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="h-8 w-28 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-800" />
      <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main dashboard
───────────────────────────────────────────── */

interface HealthDashboardProps {
  /** Pass clientId for admin view. Omit for client's own dashboard. */
  clientId?: string;
}

export function HealthDashboard({ clientId }: HealthDashboardProps) {
  const [activeReceiverId, setActiveReceiverId] = React.useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health-dashboard"],
    queryFn:  getClientHealthDashboard,
    staleTime: 1000 * 60 * 3,
  });

  // Set first receiver as active once loaded
  React.useEffect(() => {
    if (data?.receivers?.length && !activeReceiverId) {
      setActiveReceiverId(data.receivers[0].id);
    }
  }, [data, activeReceiverId]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Failed to load health dashboard
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {(error as Error)?.message ?? "Something went wrong"}
        </p>
      </div>
    );
  }

  if (!data || data.receivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
          <Activity className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          No care receivers enrolled yet
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Add a care receiver to start tracking health data.
        </p>
      </div>
    );
  }

  const activeReceiver = data.receivers.find((r) => r.id === activeReceiverId)
    ?? data.receivers[0];

  return (
    <div className="space-y-5">

      {/* ── Care receiver tabs ── */}
      {data.receivers.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {data.receivers.map((receiver) => (
            <button
              key={receiver.id}
              onClick={() => setActiveReceiverId(receiver.id)}
              className={cn(
                "px-4 h-8 rounded-lg text-sm font-medium border transition-colors",
                receiver.id === activeReceiverId
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              {receiver.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Receiver info strip ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xs font-bold text-violet-700 dark:text-violet-400 shrink-0">
          {activeReceiver.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {activeReceiver.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeReceiver.city}
            {activeReceiver.medicalCondition && ` · ${activeReceiver.medicalCondition}`}
          </p>
        </div>
        {activeReceiver.latestVitals && (
          <p className="text-xs text-slate-400 whitespace-nowrap shrink-0">
            Last recorded {formatDate(activeReceiver.latestVitals.recordedAt)}
          </p>
        )}
      </div>

      {/* ── Panel ── */}
      <ReceiverPanel receiver={activeReceiver} />

    </div>
  );
}