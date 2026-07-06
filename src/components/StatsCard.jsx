const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-surface border border-surface rounded-3xl p-8 text-center shadow-sm transition duration-300 hover:shadow-lg">
      <div className="text-4xl font-bold text-[#4F46E5]">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-300 mt-2">{title}</div>
    </div>
  )
}

export default StatsCard
