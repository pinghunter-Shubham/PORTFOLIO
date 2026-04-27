/**
 * Central data file — all portfolio content for Shubham Singh.
 */

// ─── Projects ────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  title: string
  category: 'ML / AI' | 'Computer Vision' | 'Python' | 'IoT / Embedded' | 'Research'
  description: string
  tech: string[]
  hasDemo: boolean
  github: string
  demo: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'brain-tumor',
    title: 'Brain Tumor Detection & Classification',
    category: 'Computer Vision',
    description:
      'U-Net model for tumor segmentation combined with an ImageNet-based classifier achieving 94% accuracy. Integrates patient data for risk prediction using the Kaggle LGG MRI Segmentation dataset.',
    tech: ['Python', 'TensorFlow', 'U-Net', 'Keras', 'Pandas', 'Kaggle'],
    hasDemo: false,
    github: '#',
    demo: '#',
    featured: true,
  },
  {
    id: 'sign-language',
    title: 'Indian Sign Language Detection',
    category: 'Computer Vision',
    description:
      'Real-time hand sign detection model using MediaPipe and Random Forest, accurately classifying Indian Sign Language alphabets from hand landmarks for live translation.',
    tech: ['Python', 'MediaPipe', 'Scikit-learn', 'Random Forest', 'OpenCV'],
    hasDemo: false,
    github: '#',
    demo: '#',
    featured: true,
  },
  {
    id: 'legal-prediction',
    title: 'Legal Petition Decision Prediction',
    category: 'ML / AI',
    description:
      'ML model predicting legal petition outcomes with 91.3% accuracy using the ILDC dataset and Random Forest with feature selection techniques. Research collaboration with a faculty mentor.',
    tech: ['Python', 'Random Forest', 'Scikit-learn', 'ILDC Dataset', 'NLP'],
    hasDemo: false,
    github: '#',
    demo: '#',
    featured: true,
  },
  {
    id: 'erc-classification',
    title: 'ERC Classification Research',
    category: 'Research',
    description:
      'Machine learning model identifying Early Career Researchers (ECRs) using bibliographic data with high accuracy, applying feature selection techniques in a faculty-guided research project.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'Feature Engineering', 'NLP'],
    hasDemo: false,
    github: '#',
    demo: '#',
  },
  {
    id: 'smart-india-hackathon',
    title: 'Heritage Tourism App — SIH 2024',
    category: 'Python',
    description:
      'Smart India Hackathon project (SANSKRITI_06): Python-based app for scanning QR codes at heritage sites to display information in text, audio, and virtual formats. Boosted user engagement by 20%.',
    tech: ['Python', 'Flask', 'QR Code', 'TTS', 'REST API'],
    hasDemo: false,
    github: '#',
    demo: '#',
  },
  {
    id: 'iot-safety',
    title: 'IoT Safety Device for Mining Workers',
    category: 'IoT / Embedded',
    description:
      'NodeMCU-based safety system with MQ-4 gas sensor, pulse sensor, and DHT11 for real-time environmental monitoring and emergency alerts via the Blynk IoT platform.',
    tech: ['NodeMCU', 'C++', 'Blynk', 'MQ-4', 'DHT11', 'IoT'],
    hasDemo: false,
    github: '#',
    demo: '#',
  },
  {
    id: 'image-colorization',
    title: 'Image Colorization with Deep Learning',
    category: 'Computer Vision',
    description:
      'Deep learning pipeline for automatic colorization of grayscale images, improving visual interpretation using convolutional neural networks.',
    tech: ['Python', 'TensorFlow', 'Keras', 'CNN', 'OpenCV'],
    hasDemo: false,
    github: '#',
    demo: '#',
  },
]

// ─── Skills ──────────────────────────────────────────────────────────────────

export interface Skill {
  id: string
  name: string
  group: 'AI / ML' | 'Frontend' | 'Backend' | 'Tools'
  level: number // 1–100
  description: string
}

export const skills: Skill[] = [
  // AI / ML
  { id: 's1',  name: 'Python',         group: 'AI / ML',   level: 90, description: 'Primary language — ML, scripting, automation' },
  { id: 's2',  name: 'TensorFlow/Keras',group: 'AI / ML',  level: 82, description: 'CNNs, U-Net, image classification & segmentation' },
  { id: 's3',  name: 'Scikit-learn',    group: 'AI / ML',  level: 85, description: 'Classification, regression, feature selection' },
  { id: 's4',  name: 'Computer Vision', group: 'AI / ML',  level: 80, description: 'OpenCV, MediaPipe, image processing pipelines' },
  { id: 's5',  name: 'Pandas / NumPy',  group: 'AI / ML',  level: 85, description: 'Data wrangling, EDA, preprocessing at scale' },
  { id: 's6',  name: 'LLMs',           group: 'AI / ML',   level: 65, description: 'Large language model concepts and integration' },
  { id: 's7',  name: 'Deep Learning',  group: 'AI / ML',   level: 78, description: 'U-Net, CNNs, transfer learning, Keras' },

  // Frontend
  { id: 's8',  name: 'HTML / CSS',      group: 'Frontend', level: 75, description: 'Responsive layouts, semantic markup' },
  { id: 's9',  name: 'JavaScript',      group: 'Frontend', level: 68, description: 'DOM manipulation, async, REST integration' },
  { id: 's10', name: 'Flask',           group: 'Frontend', level: 72, description: 'Web apps, REST APIs, templating' },

  // Backend
  { id: 's11', name: 'SQL / PostgreSQL',group: 'Backend',  level: 80, description: 'Queries, schema design, relational DBs' },
  { id: 's12', name: 'MySQL / SQLite',  group: 'Backend',  level: 78, description: 'Lightweight databases, data storage' },
  { id: 's13', name: 'C / C++',         group: 'Backend',  level: 70, description: 'Systems programming, embedded (NodeMCU)' },

  // Tools
  { id: 's14', name: 'Jupyter Notebook',group: 'Tools',    level: 90, description: 'Primary environment for ML experimentation' },
  { id: 's15', name: 'AWS Cloud',       group: 'Tools',    level: 65, description: 'ML Foundations + Data Engineering certified' },
  { id: 's16', name: 'Matplotlib',      group: 'Tools',    level: 82, description: 'Data visualization, model evaluation plots' },
  { id: 's17', name: 'VS Code',         group: 'Tools',    level: 85, description: 'Daily driver IDE with Python extensions' },
]

// ─── Experience ───────────────────────────────────────────────────────────────

export interface Experience {
  id: string
  company: string
  role: string
  period: string
  description: string[]
  tech: string[]
}

export const experiences: Experience[] = [
  {
    id: 'e1',
    company: 'Cognizant',
    role: 'Programmer Analyst Trainee',
    period: 'Sep 2025 – Present',
    description: [
      'Building foundational skills in enterprise software delivery and team processes.',
      'Learning and working with the Benchling R&D platform in a life-sciences domain context.',
      'Contributing inputs during team activities and collaborative project sessions.',
      'Developing proficiency in professional software engineering workflows and practices.',
    ],
    tech: ['Benchling', 'Python', 'SQL', 'Agile'],
  },
  {
    id: 'e2',
    company: 'Celebal Technologies',
    role: 'Data Science Intern',
    period: 'May 2024 – Jul 2024',
    description: [
      'Gained hands-on experience in real-world data science projects within a professional team.',
      'Collaborated with senior data scientists to analyse large datasets and derive actionable insights.',
      'Built and optimized predictive machine learning models, improving accuracy by 15%.',
      'Communicated findings through clear reports and visualizations for non-technical stakeholders.',
    ],
    tech: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'ML Modeling'],
  },
  {
    id: 'e3',
    company: 'Smart India Hackathon 2024',
    role: 'Team Lead — Project SANSKRITI_06',
    period: '2024',
    description: [
      'Led a team of 5 engineers to build a heritage tourism app for the national hackathon.',
      'Designed and implemented QR-code based information retrieval with text, audio, and virtual display modes.',
      'Delivered the project on time, resulting in a 20% improvement in measured user engagement.',
      'Managed task distribution, timelines, and cross-member communication throughout the sprint.',
    ],
    tech: ['Python', 'Flask', 'QR Code', 'TTS API', 'REST'],
  },
]

// ─── Blog posts ───────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string
  title: string
  date: string
  readingTime: string
  category: string
  excerpt: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-production-rag-pipelines',
    title: 'Building Production RAG Pipelines: What Nobody Tells You',
    date: '2024-08-15',
    readingTime: '12 min read',
    category: 'LLM Engineering',
    excerpt:
      'After exploring RAG architectures in depth, I collected the lessons that don\'t make it into tutorials — chunking strategies, reranking traps, and why your eval set might be lying to you.',
  },
  {
    slug: 'switched-from-openai-to-claude',
    title: 'Why I Switched from OpenAI to Claude for My Agent Architecture',
    date: '2024-07-22',
    readingTime: '8 min read',
    category: 'AI Engineering',
    excerpt:
      'Six months into building a multi-agent system on GPT-4, I made the switch to Claude. Here\'s what changed, what got better, what got harder, and the architectural decisions that come with the switch.',
  },
  {
    slug: 'react-fastapi-ai-template',
    title: 'React + FastAPI: The Full-Stack AI App Template I Wish Existed',
    date: '2024-06-10',
    readingTime: '15 min read',
    category: 'Full Stack',
    excerpt:
      'A production-ready template for AI applications: streaming responses, token counting, rate limiting, auth, and a sane folder structure. Walk through every decision and why it matters at scale.',
  },
]

// ─── Nav links ────────────────────────────────────────────────────────────────

export const navLinks = [
  { label: 'Home',     href: '#home' },
  { label: 'About',   href: '#about' },
  { label: 'Projects',href: '#projects' },
  { label: 'Skills',  href: '#skills' },
  { label: 'AI Demo', href: '#ai-demo' },
  { label: 'Blog',    href: '#blog' },
  { label: 'Contact', href: '#contact' },
]
