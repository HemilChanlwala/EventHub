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
  const defaultData = data || {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Attendance', data: [12, 19, 8, 17, 14, 20], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.2)' }
    ]
  }
  return <Line data={defaultData} options={options} />
}

export const SampleBar = ({ data, options }) => {
  const defaultData = data || {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      { label: 'Tickets Sold', data: [30, 45, 28, 50, 42], backgroundColor: '#4f46e5' }
    ]
  }
  return <Bar data={defaultData} options={options} />
}

export default { SampleLine, SampleBar }
