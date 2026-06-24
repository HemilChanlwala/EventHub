const StatsCard = ({ title, value }) => {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <div className="text-4xl font-bold text-violet-400">{value}</div>
      <div className="text-sm text-gray-400 mt-2">{title}</div>
    </div>
  )
}

export default StatsCard
