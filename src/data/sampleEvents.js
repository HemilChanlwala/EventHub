import eventWorkshop from '../assets/event_workshop.png'
import eventReactSummit from '../assets/event_react_summit.png'
import eventMusicFest from '../assets/event_music_fest.png'
import eventStartupPitch from '../assets/event_startup_pitch.png'
import eventAiWorkshop from '../assets/event_ai_workshop.png'
import eventHealthWellness from '../assets/event_health_wellness.png'

export const sampleEvents = [
  {
    id: 1,
    title: 'Sample Event',
    date: '2026-07-01',
    location: 'Online',
    price: 'Free',
    category: 'Workshop',
    image: eventWorkshop,
    description: 'A short sample event that demonstrates the EventHub layout and features.',
    seats: 100,
    seatsAvailable: 75,
    speakers: [{ name: 'John Doe', role: 'Host' }],
    reviews: [{ id: 1, name: 'Alex', rating: 5, comment: 'Great event!' }]
  },
  {
    id: 2,
    title: 'React Summit',
    date: '2026-08-12',
    location: 'New York, NY',
    price: '$49',
    category: 'Technology',
    image: eventReactSummit,
    description: 'The premier React conference for developers and teams.',
    seats: 500,
    seatsAvailable: 120,
    speakers: [{ name: 'Dan Abramov', role: 'Keynote' }],
    reviews: [{ id: 2, name: 'Maria', rating: 5, comment: 'Excellent talks and networking.' }]
  },
  {
    id: 3,
    title: 'Music Fest',
    date: '2026-09-05',
    location: 'Los Angeles, CA',
    price: '$99',
    category: 'Music',
    image: eventMusicFest,
    description: 'A weekend of live music and performances.',
    seats: 2000,
    seatsAvailable: 450,
    speakers: [{ name: 'Lineup A', role: 'Performer' }],
    reviews: [{ id: 3, name: 'Sam', rating: 4, comment: 'Loved the atmosphere.' }]
  },
  {
    id: 4,
    title: 'Startup Pitch',
    date: '2026-06-30',
    location: 'San Francisco, CA',
    price: 'Free',
    category: 'Startup',
    image: eventStartupPitch,
    description: 'Founders pitch to investors and mentors.',
    seats: 300,
    seatsAvailable: 20,
    speakers: [{ name: 'Jane Roe', role: 'Moderator' }],
    reviews: []
  },
  {
    id: 5,
    title: 'AI Workshop',
    date: '2026-07-20',
    location: 'Online',
    price: '$29',
    category: 'Technology',
    image: eventAiWorkshop,
    description: 'Hands-on AI and ML mini-workshop for practitioners.',
    seats: 80,
    seatsAvailable: 18,
    speakers: [{ name: 'Dr. AI', role: 'Instructor' }],
    reviews: [{ id: 4, name: 'Lee', rating: 5, comment: 'Very practical!' }]
  },
  {
    id: 6,
    title: 'Health & Wellness',
    date: '2026-10-11',
    location: 'Chicago, IL',
    price: '$15',
    category: 'Seminar',
    image: eventHealthWellness,
    description: 'Wellness sessions and health talks.',
    seats: 150,
    seatsAvailable: 80,
    speakers: [{ name: 'Dr. Well', role: 'Speaker' }],
    reviews: []
  },
]

export default sampleEvents
