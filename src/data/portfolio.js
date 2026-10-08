// ALL content lives here. Edit this file to change any text on the site.
// Page = { title, lines: [...], link?: { label, url } }
// List item = { label, url? }  (projects and experience also have pages)

export const portfolio = {
    name: 'AKSHUM GARG',
    title: 'STUDENT DEVELOPER',
  
    about: [
      {
        title: 'WHO AM I',
        lines: [
          'Hi, I am Akshum Garg.',
          'I study Software Engineering at Delhi Technological University.',
          'I build with React and Django, and use Python for data and ML.',
        ],
      },
      {
        title: 'EDUCATION',
        lines: [
          'B.Tech, Software Engineering',
          'Delhi Technological University',
          '2024 to 2028',
          'CGPA: 8.88',
        ],
      },
      {
        title: 'SCHOOL',
        lines: [
          'Class XII (CBSE), 2024',
          '87.60%',
          'Class X (CBSE), 2022',
          '93.20%',
        ],
      },
      {
        title: 'ACHIEVEMENTS',
        lines: [
          'AIR 5047 in JEE Advanced 2024, among 180,000+ qualified candidates.',
          'Solved 200+ DSA problems on LeetCode and Codeforces.',
        ],
      },
      {
        title: 'LEARNING',
        lines: [
          'Machine Learning Specialization by Andrew Ng (Coursera, DeepLearning.AI).',
          'Covers supervised and unsupervised learning, neural networks and ML best practices.',
        ],
      },
    ],
  
    skills: [
      { title: 'LANGUAGES', lines: ['C', 'C++', 'Python', 'JavaScript', 'HTML and CSS'] },
      { title: 'WEB', lines: ['React', 'Django', 'Django REST'] },
      { title: 'MOBILE', lines: ['Android'] },
      {
        title: 'TOOLS',
        lines: ['Git', 'VS Code', 'Google Earth Engine', 'Jupyter Notebook'],
      },
    ],
  
    projects: [
      {
        label: 'BAH 2026: AQI + HCHO',
        pages: [
          {
            title: 'SUMMARY',
            lines: [
              'Surface AQI prediction and HCHO hotspot detection over India.',
              'Academic project for BAH 2026.',
            ],
          },
          {
            title: 'WHAT I DID',
            lines: [
              'Processed Sentinel-5P TROPOMI HCHO data in Google Earth Engine.',
              'Looked for formaldehyde hotspots in the Oct to Nov crop burning season.',
            ],
          },
          {
            title: 'FINDINGS',
            lines: [
              'Found 1,182 hotspot cells, mostly over Punjab, Haryana, Delhi-NCR and UP.',
              'Fire and HCHO are correlated, with a 5-day transport lag.',
              'ERA5 wind back-trajectories trace smoke toward Delhi-NCR.',
            ],
          },
          {
            title: 'TECH',
            lines: ['Python', 'Google Earth Engine', 'TROPOMI', 'ERA5', 'MODIS'],
          },
        ],
      },
      {
        label: 'RETRO PORTFOLIO',
        pages: [
          {
            title: 'SUMMARY',
            lines: [
              'This website.',
              'A portfolio that looks and works like an old handheld game console.',
            ],
          },
          {
            title: 'TECH',
            lines: ['React and Vite', 'Plain CSS with variables', 'useReducer for all button logic'],
          },
          {
            title: 'WHAT I DID',
            lines: [
              'Designed the console in CSS.',
              'Built the screen stack and the input system myself.',
            ],
          },
          {
            title: 'LINKS',
            lines: ['A = open GitHub'],
            link: { label: 'GitHub', url: 'https://github.com/akshumgarg' },
          },
        ],
      },
    ],
  
    experience: [
      {
        label: 'MENTOR, MS299 OUTREACH',
        pages: [
          {
            title: 'DETAILS',
            lines: [
              'Mentored Class 10 students at a government school.',
              'Topic: future academic and career paths.',
              'Part of MS299 (Community Outreach) at DTU.',
            ],
          },
        ],
      },
    ],
  
    contact: [
      { label: 'EMAIL', url: 'mailto:akshumgarg20@gmail.com' },
      { label: 'GITHUB', url: 'https://github.com/akshumgarg' },
      { label: 'LINKEDIN', url: 'https://www.linkedin.com/in/akshum-garg-06840b2b7/' },
      { label: 'RESUME', url: '/resume.pdf' }, // put resume.pdf in the public/ folder
    ],
  }