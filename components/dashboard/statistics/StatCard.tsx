import type { NetworkStat } from "@/lib/dashboard/types";
import KpiCard from "@/components/dashboard/KpiCard";

/**
 * Thin compatibility wrapper that maps the existing NetworkStat shape onto the
 * unified `<KpiCard>` primitive. Network/Usage tabs pass `NetworkStat` objects
 * by reference; this lets us collapse three KPI implementations to one without
 * touching every caller.
 */
export default function StatCard({ stat }: { stat: NetworkStat }) {
  return (
    <KpiCard
      label={stat.label}
      value={stat.value}
      delta={stat.delta}
      trend={stat.trend ?? "flat"}
    />
  );
}
