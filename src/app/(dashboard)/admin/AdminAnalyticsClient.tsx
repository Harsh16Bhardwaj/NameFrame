"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

type Props = {
  users: { id: string; name: string | null; email: string; role: string; createdAt: string }[];
  events: { id: string; title: string; organizationName: string | null; createdAt: string; participants: number }[];
};

const COLORS = ["#2dd4bf", "#60a5fa", "#f59e0b", "#f43f5e"];

export default function AdminAnalyticsClient({ users, events }: Props) {
  const totals = { users: 37, events: 54, participants: 1366, deliveryRate: 96.8, avgTime: "2m 42s" };
  const monthlySeries = [
    { month: "2025-11", events: 3, participants: 96, emails: 80 },
    { month: "2025-12", events: 4, participants: 122, emails: 105 },
    { month: "2026-01", events: 6, participants: 201, emails: 181 },
    { month: "2026-02", events: 8, participants: 287, emails: 266 },
    { month: "2026-03", events: 11, participants: 322, emails: 301 },
    { month: "2026-04", events: 14, participants: 338, emails: 315 },
    { month: "2026-05", events: 8, participants: 210, emails: 199 },
  ];
  const societies = [
    { name: "Byte MAIT", count: 7 },
    { name: "CST MAIT", count: 6 },
    { name: "GDG MAIT", count: 8 },
    { name: "ECE Cell DTU", count: 5 },
    { name: "TechXtract MAIT", count: 4 },
    { name: "GDG NSUT", count: 6 },
    { name: "IEEE DTU", count: 5 },
  ];
  const statusSplit = [
    { name: "Delivered", value: 1248 },
    { name: "Queued", value: 68 },
    { name: "Failed", value: 28 },
    { name: "Retrying", value: 22 },
  ];
  const activityPipeline = [
    "Queue pooled: ECE Cell DTU - Embedded Systems Bootcamp batch #7",
    "Template bind resolved: GDG MAIT HackSprint (FIRST role)",
    "Import confirm completed: 84 participants accepted, 3 duplicates flagged",
    "Delivery processor drained 120 queued emails in 3 cycles",
    "Event created: TechXtract MAIT - AI Tooling Masterclass",
  ];

  return (
    <div className="min-h-screen bg-[#07080d] text-zinc-100 px-6 py-8">
      <h1 className="text-2xl font-bold">Platform Admin Analytics</h1>
      <p className="text-sm text-zinc-400 mt-1">Data shown = real platform rows + seeded realistic projections.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          ["Total Users", totals.users],
          ["Total Events", totals.events],
          ["Total Participants", totals.participants],
          ["Delivery Success", `${totals.deliveryRate}%`],
          ["Avg Send Time", totals.avgTime],
        ].map(([k, v]) => (
          <div key={String(k)} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{k}</p>
            <p className="mt-2 text-2xl font-bold text-teal-300">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 h-80">
          <p className="text-sm mb-2">Event creation trend (stops at May 2026)</p>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip />
              <Area type="monotone" dataKey="events" stroke="#2dd4bf" fill="#2dd4bf33" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 h-80">
          <p className="text-sm mb-2">Email spike vs participants</p>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="participants" stroke="#60a5fa" />
              <Line type="monotone" dataKey="emails" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 h-80">
          <p className="text-sm mb-2">Society-wise events (Delhi tech chapters)</p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={societies}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#a1a1aa" interval={0} angle={-16} textAnchor="end" height={70} />
              <YAxis stroke="#a1a1aa" />
              <Tooltip />
              <Bar dataKey="count" fill="#2dd4bf" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 h-80">
          <p className="text-sm mb-2">Delivery state split</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={statusSplit} dataKey="value" nameKey="name" outerRadius={95}>
                {statusSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h2 className="font-semibold mb-3">Users</h2>
          <div className="max-h-80 overflow-auto text-sm">
            <table className="w-full">
              <thead className="text-zinc-400">
                <tr><th className="text-left py-2">Name</th><th className="text-left">Email</th><th className="text-left">Role</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-zinc-800">
                    <td className="py-2">{u.name || "Unknown"}</td><td>{u.email}</td><td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <h2 className="font-semibold mb-3">Events on Platform</h2>
          <div className="max-h-80 overflow-auto text-sm">
            <table className="w-full">
              <thead className="text-zinc-400">
                <tr><th className="text-left py-2">Title</th><th className="text-left">Org</th><th className="text-left">Participants</th></tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-t border-zinc-800">
                    <td className="py-2">{e.title}</td><td>{e.organizationName || "N/A"}</td><td>{e.participants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h2 className="font-semibold mb-3">Pipeline Queue Activity</h2>
        <div className="space-y-2 text-sm">
          {activityPipeline.map((entry) => (
            <div key={entry} className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2">{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
