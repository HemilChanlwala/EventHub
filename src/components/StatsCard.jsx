// Shows one labelled numerical statistic in dashboard summaries.
const StatsCard = ({ title, value }) => {
  return (
    <div className="glass-card p-7 text-center transition duration-300 hover:-translate-y-1">
      <div className="text-4xl font-bold tracking-[-0.06em] text-[var(--primary)]">{value}</div>
      <div className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-[var(--text-weak)]">{title}</div>
    </div>
  )
}

export default StatsCard
