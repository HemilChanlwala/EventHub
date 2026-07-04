import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export const SampleLine = ({ data, options }) => {
  if (!data) return null
  return <Line data={data} options={options} />
}

export const SampleBar = ({ data, options }) => {
  if (!data) return null
  return <Bar data={data} options={options} />
}

export default { SampleLine, SampleBar }
