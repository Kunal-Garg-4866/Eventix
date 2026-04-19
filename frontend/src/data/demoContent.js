export const demoSocieties = [
  {
    _id: 'soc-ieee',
    name: 'IEEE Student Branch',
    description:
      'Technical community focused on electronics, innovation, research talks, hack sessions, and flagship annual symposiums.',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    admin: { name: 'Aarav Mehta' },
    members: 320,
    eventsHosted: 18,
    category: 'Technology',
  },
  {
    _id: 'soc-gfg',
    name: 'GeeksforGeeks Campus Chapter',
    description:
      'Coding contests, interview preparation circles, DSA bootcamps, and placement-oriented peer learning initiatives.',
    logo: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80',
    admin: { name: 'Riya Khanna' },
    members: 410,
    eventsHosted: 24,
    category: 'Coding',
  },
  {
    _id: 'soc-cn',
    name: 'Coding Ninjas Club',
    description:
      'Hands-on full-stack workshops, problem-solving rounds, project showcases, and industry mentor interactions.',
    logo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    admin: { name: 'Kabir Sethi' },
    members: 275,
    eventsHosted: 16,
    category: 'Development',
  },
  {
    _id: 'soc-mlsa',
    name: 'Microsoft Learn Student Ambassadors',
    description:
      'Cloud, AI, productivity, and developer community programs that connect students with global learning pathways.',
    logo: 'https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&w=400&q=80',
    admin: { name: 'Sana Qureshi' },
    members: 198,
    eventsHosted: 14,
    category: 'Cloud & AI',
  },
  {
    _id: 'soc-robotics',
    name: 'Robotics & Automation Society',
    description:
      'Build-and-compete culture around robotics design, embedded systems, automation demos, and prototype sprints.',
    logo: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=400&q=80',
    admin: { name: 'Dev Malhotra' },
    members: 156,
    eventsHosted: 11,
    category: 'Robotics',
  },
  {
    _id: 'soc-debate',
    name: 'Debate & Public Speaking Forum',
    description:
      'Structured debate leagues, public speaking labs, policy roundtables, and cross-campus communications events.',
    logo: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80',
    admin: { name: 'Ananya Verma' },
    members: 143,
    eventsHosted: 9,
    category: 'Leadership',
  },
]

export const demoEvents = [
  {
    _id: 'event-1',
    title: 'IEEE Tech Symposium 2026',
    description:
      'A flagship symposium featuring research paper showcases, technical talks, and innovation demos from students and faculty.',
    eventType: 'team',
    teamSizeMin: 2,
    teamSizeMax: 4,
    date: '2026-05-06T10:00:00.000Z',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    society: { _id: 'soc-ieee', name: 'IEEE Student Branch', description: 'Technical society for innovation and research.' },
    venue: 'Main Auditorium',
  },
  {
    _id: 'event-2',
    title: 'GFG DSA Sprint Challenge',
    description:
      'A high-intensity coding sprint covering arrays, graphs, and dynamic programming with leaderboard-based rankings.',
    eventType: 'solo',
    teamSizeMin: 1,
    teamSizeMax: 1,
    date: '2026-05-10T14:00:00.000Z',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
    society: { _id: 'soc-gfg', name: 'GeeksforGeeks Campus Chapter', description: 'Competitive coding and placements.' },
    venue: 'Lab Block A',
  },
  {
    _id: 'event-3',
    title: 'Coding Ninjas Full-Stack Buildathon',
    description:
      'Build a production-style web app with frontend, backend, authentication, and deployment review by mentors.',
    eventType: 'team',
    teamSizeMin: 3,
    teamSizeMax: 5,
    date: '2026-05-14T09:30:00.000Z',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    society: { _id: 'soc-cn', name: 'Coding Ninjas Club', description: 'Project-driven engineering community.' },
    venue: 'Innovation Hub',
  },
  {
    _id: 'event-4',
    title: 'Cloud Fundamentals with MLSA',
    description:
      'Hands-on workshop on Azure basics, deployment pipelines, and cloud-native app architecture for student developers.',
    eventType: 'solo',
    teamSizeMin: 1,
    teamSizeMax: 1,
    date: '2026-05-18T11:30:00.000Z',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    society: { _id: 'soc-mlsa', name: 'Microsoft Learn Student Ambassadors', description: 'Cloud and AI learning community.' },
    venue: 'Seminar Hall 2',
  },
  {
    _id: 'event-5',
    title: 'Robowars Qualifier Round',
    description:
      'Prototype battle arena for autonomous and manual bots, with safety checks, design review, and knockout rounds.',
    eventType: 'team',
    teamSizeMin: 2,
    teamSizeMax: 6,
    date: '2026-05-21T15:00:00.000Z',
    status: 'ongoing',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    society: { _id: 'soc-robotics', name: 'Robotics & Automation Society', description: 'Embedded systems and robotics club.' },
    venue: 'Mechanical Workshop Arena',
  },
  {
    _id: 'event-6',
    title: 'Debate League Grand Round',
    description:
      'Structured parliamentary debate round with adjudication, motion briefing, and certificates for finalists.',
    eventType: 'team',
    teamSizeMin: 2,
    teamSizeMax: 3,
    date: '2026-05-24T13:00:00.000Z',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    society: { _id: 'soc-debate', name: 'Debate & Public Speaking Forum', description: 'Communication and leadership society.' },
    venue: 'Conference Room',
  },
]

export const homepageStats = [
  { label: 'Active societies', value: '18+' },
  { label: 'Events this semester', value: '120+' },
  { label: 'Student registrations', value: '4.8k+' },
  { label: 'DL requests processed', value: '950+' },
]

export const homepageHighlights = [
  {
    title: 'Centralized event operations',
    text: 'Manage society profiles, event publishing, registrations, and duty leave in one unified workflow.',
  },
  {
    title: 'Built for student engagement',
    text: 'From coding contests to symposiums and club showcases, Eventix supports a wide range of campus activities.',
  },
  {
    title: 'Admin-ready controls',
    text: 'Role-based dashboards help society admins stay focused only on their own events, approvals, and participation data.',
  },
]

export const featuredTracks = [
  'Hackathons & coding contests',
  'Technical workshops & bootcamps',
  'Debates, forums, and speaker sessions',
  'Robotics, AI, and innovation showcases',
]

export const societyEventCatalog = {
  'IEEE Student Branch': [
    'Circuit Design Challenge',
    'Embedded Systems Mini Hack',
    'Research Paper Clinic',
    'IoT Prototype Showcase',
    'Technical Quiz League',
  ],
  'GeeksforGeeks Campus Chapter': [
    'DSA Night Sprint',
    'Aptitude Power Practice',
    'Mock Interview Marathon',
    'CP Ladder Contest',
    'Problem Solving Relay',
  ],
  'Coding Ninjas Club': [
    'Web Dev Build Sprint',
    'Backend API Masterclass',
    'React Performance Lab',
    'System Design Basics',
    'Placement Prep Camp',
  ],
  'Microsoft Learn Student Ambassadors': [
    'Azure Deploy Day',
    'AI Agents Workshop',
    'GitHub Copilot Studio',
    'Cloud Security Foundations',
    'Productivity with M365',
  ],
  'Robotics & Automation Society': [
    'Line Follower Arena',
    'Drone Control Workshop',
    'Robo Soccer Trials',
    'Automation Circuit Lab',
    'Bot Design Review',
  ],
  'Debate & Public Speaking Forum': [
    'Parliamentary Debate Round',
    'Policy Speech Clinic',
    'Extempore Face-off',
    'Public Speaking Studio',
    'Model UN Prep Session',
  ],
}
