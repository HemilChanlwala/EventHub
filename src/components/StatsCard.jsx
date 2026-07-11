const StatsCard = ({ title, value }) => {
  return (
    <div className="rounded-lg border border-surface bg-surface p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="text-4xl font-bold text-[#4F46E5]">{value}</div>
      <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-300">{title}</div>
    </div>
  )
}

export default StatsCard
