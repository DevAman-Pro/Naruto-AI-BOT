import { useMemo, useRef, useState } from 'react'
import {
  ArrowUp,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MoonStar,
  PanelLeftClose,
  Search,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import './App.css'

const knowledgeBase = [
  {
    id: 'profile', label: 'PROFILE.md', title: 'Aman at a glance',
    keywords: 'aman dikole full stack developer fresher react node javascript typescript internship web developer',
    text: 'Aman Sajjan Dikole is a motivated Full Stack Developer fresher based in Pandharpur, Maharashtra. He has hands-on experience from a six-month internship and full-stack projects, and is seeking entry-level Full Stack, React, or Web Developer roles.',
  },
  {
    id: 'internship', label: 'EXPERIENCE.md', title: 'Full Stack Developer Intern',
    keywords: 'internship experience do little technologies react node express postgresql mongodb rest api github debugging six month',
    text: 'At Do Little Technologies Pvt. Ltd. (Oct 2025 – Apr 2026), Aman built React, Node.js, and Express.js features, created reusable UI and REST APIs, connected interfaces to PostgreSQL and MongoDB, and contributed through Git-based reviews, debugging, and bug fixes.',
  },
  {
    id: 'job-portal', label: 'PROJECTS/job-portal.md', title: 'Job Portal',
    keywords: 'job portal next nextjs postgresql jwt tailwind team lead team employer candidate apply authentication project',
    text: 'Aman led a four-member team building a full-stack Job Portal. The product lets employers post listings and candidates search and apply. It uses Next.js and PostgreSQL, JWT authentication for protected accounts, and a responsive Tailwind CSS interface.',
  },
  {
    id: 'pm-app', label: 'PROJECTS/project-management.md', title: 'Project Management App',
    keywords: 'project management react node express task tracking assigning crud rest api responsive full stack project',
    text: 'Aman developed a full-stack Project Management Web Application for creating, assigning, and tracking tasks and project progress. It combines reusable React components with Express.js REST APIs, CRUD workflows, and a responsive interface.',
  },
  {
    id: 'skills', label: 'SKILLS.json', title: 'Technical toolkit',
    keywords: 'skills javascript typescript react next html css tailwind node express rest api jwt postgresql mongodb sql git github postman oop agile',
    text: 'Aman works with JavaScript, TypeScript, React.js, Next.js, HTML5, CSS3, Tailwind CSS, Node.js, Express.js, REST APIs, JWT, PostgreSQL, MongoDB, SQL, Git, GitHub, and Postman. His core strengths include full-stack development, debugging, authentication, agile collaboration, and team leadership.',
  },
  {
    id: 'achievements', label: 'ACHIEVEMENTS.md', title: 'Highlights',
    keywords: 'achievement hackathon third place 200 teams coding club nss leadership teamwork',
    text: 'Aman secured 3rd place in a hackathon against 200 competing teams. He is active in the Coding Club and has participated in NSS volunteer activities. His noted strengths are teamwork, leadership, adaptability, and analytical debugging.',
  },
  {
    id: 'education', label: 'EDUCATION.md', title: 'Education',
    keywords: 'education btech computer science engineering sveri college pandharpur 2026',
    text: "Aman completed a B.Tech in Computer Science and Engineering at SVERI's College of Engineering, Pandharpur in May 2026.",
  },
  {
    id: 'contact', label: 'CONTACT.vcf', title: 'Contact',
    keywords: 'contact email phone linkedin github location pandharpur maharashtra aman',
    text: 'Aman is based in Pandharpur, Maharashtra. You can reach him at dikoleaman@gmail.com, connect on LinkedIn at linkedin.com/in/aman-dikole-7b7a14401, or view his GitHub at github.com/DevAman-Pro.',
  },
]

const initialMessage = {
  id: 'welcome', role: 'assistant', heading: 'Your guide is ready.',
  content: 'I’m Kage, Aman’s personal AI guide. Ask about his work, projects, stack, or journey — I’ll retrieve the relevant field notes and answer from there.',
  sources: [knowledgeBase[0], knowledgeBase[2], knowledgeBase[4]],
}

const quickPrompts = [
  { label: 'What has Aman built?', icon: Code2, query: 'What projects has Aman built?' },
  { label: 'Show his tech stack', icon: Database, query: 'What is Aman’s technical stack?' },
  { label: 'Tell me about his internship', icon: BriefcaseBusiness, query: 'Tell me about Aman’s internship experience.' },
]

const stopWords = new Set(['a', 'an', 'and', 'are', 'about', 'the', 'is', 'his', 'her', 'of', 'what', 'me', 'tell', 'show', 'can', 'you', 'with', 'has', 'have', 'in', 'to', 'for', 'on', 'please'])

function retrieve(query) {
  const words = query.toLowerCase().match(/[a-z0-9+#.]+/g) || []
  const meaningful = words.filter((word) => !stopWords.has(word))
  const scored = knowledgeBase.map((item) => {
    const haystack = `${item.title} ${item.keywords} ${item.text}`.toLowerCase()
    const score = meaningful.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0)
    return { ...item, score }
  }).sort((a, b) => b.score - a.score)
  const matches = scored.filter((item) => item.score > 0).slice(0, 3)
  return matches.length ? matches : [knowledgeBase[0], knowledgeBase[2], knowledgeBase[4]]
}

function answerFor(query, sources) {
  const question = query.toLowerCase()
  const has = (...terms) => terms.some((term) => question.includes(term))
  if (has('contact', 'email', 'reach', 'linkedin', 'github', 'hire')) return 'Aman is based in Pandharpur, Maharashtra. The best direct route is dikoleaman@gmail.com. You can also find him on LinkedIn and GitHub through the links in the field kit.'
  if (has('job portal', 'jobportal')) return 'Aman led a four-member team on the Job Portal. They built a full-stack experience where employers can post roles and candidates can search and apply, with Next.js, PostgreSQL, JWT-protected accounts, and a responsive Tailwind UI.'
  if (has('project management', 'task', 'management app')) return 'His Project Management Web Application focuses on creating, assigning, and tracking tasks and progress. It pairs reusable React components with Express REST APIs, CRUD workflows, and a responsive full-stack interface.'
  if (has('intern', 'experience', 'work history')) return 'During his six-month Full Stack Developer internship at Do Little Technologies, Aman worked across React, Node.js, and Express. His work included reusable UI, REST APIs, PostgreSQL and MongoDB integration, Git-based collaboration, debugging, and bug fixes.'
  if (has('stack', 'skill', 'technology', 'tech', 'tools')) return 'Aman’s toolkit spans JavaScript and TypeScript; React and Next.js on the frontend; Node.js and Express on the backend; PostgreSQL and MongoDB for data; plus REST APIs, JWT authentication, Tailwind CSS, Git, GitHub, and Postman.'
  if (has('achievement', 'hackathon', 'award', 'leadership')) return 'A highlight: Aman earned 3rd place in a hackathon competing against 200 teams. He also led a four-member project team, participates in Coding Club activities, and brings teamwork, adaptability, and analytical debugging to the table.'
  if (has('education', 'college', 'degree', 'btech')) return "Aman completed his B.Tech in Computer Science and Engineering from SVERI's College of Engineering, Pandharpur in May 2026."
  if (has('project', 'built', 'portfolio')) return 'Two key builds: a team-led Job Portal with Next.js, PostgreSQL, JWT, and Tailwind; and a Project Management Web Application with React, Node.js, Express, REST APIs, and CRUD task workflows.'
  return `I found the closest field notes for “${query}”. ${sources.slice(0, 2).map((source) => source.text).join(' ')}`
}

function App() {
  const [messages, setMessages] = useState([initialMessage])
  const [question, setQuestion] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const inputRef = useRef(null)
  const messageCount = useMemo(() => messages.filter((message) => message.role === 'assistant').length, [messages])

  const submitQuestion = (value = question) => {
    const trimmed = value.trim()
    if (!trimmed || isThinking) return
    const sources = retrieve(trimmed)
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: 'user', content: trimmed }])
    setQuestion('')
    setIsThinking(true)
    window.setTimeout(() => {
      setMessages((current) => [...current, {
        id: `answer-${Date.now()}`, role: 'assistant', heading: 'Retrieved from Aman’s field notes', content: answerFor(trimmed, sources), sources,
      }])
      setIsThinking(false)
    }, 520)
  }

  const handleSubmit = (event) => { event.preventDefault(); submitQuestion() }

  return (
    <main className="app-shell">
      <div className="backdrop" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="leaf leaf-one" aria-hidden="true" />
      <div className="leaf leaf-two" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Kage home"><span className="brand-mark"><span>火</span></span><span className="brand-copy"><strong>KAGE</strong><small>PERSONAL AI</small></span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a className="active" href="#chat">Mission</a><a href="#knowledge">Knowledge</a><a href="#projects">Projects</a></nav>
        <div className="topbar-actions"><span className="system-status"><i /> System online</span><button className="mobile-menu" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label="Toggle field kit">{sidebarOpen ? <X size={19} /> : <Menu size={20} />}</button></div>
      </header>
      <section className="workspace" id="top">
        <aside className="left-rail" aria-label="Knowledge status"><div className="rail-line" /><p className="eyebrow">KNOWLEDGE BASE</p><div className="knowledge-count"><span>08</span><small>FIELD NOTES<br />INDEXED</small></div><div className="index-meter"><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="rail-bottom"><MoonStar size={18} /><span>Quiet focus<br />mode</span></div></aside>
        <section className="chat-stage" id="chat">
          <div className="intro"><div className="eyebrow-row"><span className="pulse-dot" /> MISSION BRIEF <span className="brief-line" /></div><h1>Ask Aman <em>anything.</em></h1><p>His work, his craft, his next chapter. Kage retrieves the details so you can get to know the builder behind the code.</p></div>
          <div className="conversation" aria-live="polite">
            {messages.map((message) => message.role === 'user' ? <div className="user-message" key={message.id}>{message.content}</div> : <article className="assistant-message" key={message.id}><div className="avatar"><Leaf size={16} strokeWidth={2.4} /></div><div className="message-body">{message.heading && <p className="message-kicker">{message.heading}</p>}<p className="message-copy">{message.content}</p>{message.sources && <div className="source-row" aria-label="Sources used">{message.sources.map((source) => <span className="source-pill" key={source.id}><BookOpen size={12} /> {source.label}</span>)}</div>}</div></article>)}
            {isThinking && <article className="assistant-message thinking"><div className="avatar"><Leaf size={16} strokeWidth={2.4} /></div><div className="typing-dots" aria-label="Kage is searching"><i /><i /><i /></div></article>}
          </div>
          <div className="prompt-area">
            {messages.length === 1 && <div className="suggestion-row">{quickPrompts.map(({ label, icon: Icon, query }) => <button type="button" className="suggestion" key={label} onClick={() => submitQuestion(query)}><Icon size={14} /><span>{label}</span><ChevronRight size={14} /></button>)}</div>}
            <form className="ask-form" onSubmit={handleSubmit}><Search size={18} /><input ref={inputRef} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about Aman’s work, skills, projects..." aria-label="Ask Kage about Aman" /><button type="submit" disabled={!question.trim() || isThinking} aria-label="Send question"><ArrowUp size={18} strokeWidth={2.6} /></button></form>
            <p className="input-note"><Sparkles size={12} /> Grounded in Aman’s portfolio notes <span>·</span> {messageCount} retrieval{messageCount === 1 ? '' : 's'} this session</p>
          </div>
        </section>
        <aside className={`field-kit ${sidebarOpen ? 'open' : ''}`} aria-label="Aman’s profile details">
          <div className="field-kit-top"><p className="eyebrow">FIELD KIT</p><button type="button" className="close-kit" onClick={() => setSidebarOpen(false)} aria-label="Close field kit"><PanelLeftClose size={18} /></button></div>
          <div className="identity"><div className="portrait-placeholder"><span>AD</span><i /></div><div><h2>Aman Dikole</h2><p>Full Stack Developer</p></div></div>
          <div className="availability"><span><Check size={13} /> AVAILABLE FOR OPPORTUNITIES</span></div>
          <div className="field-section" id="projects"><div className="section-heading"><Code2 size={15} /><span>FEATURED BUILDS</span></div><button className="project-link" type="button" onClick={() => submitQuestion('Tell me about the Job Portal project')}><span><strong>Job Portal</strong><small>Next.js · PostgreSQL · JWT</small></span><ChevronRight size={16} /></button><button className="project-link" type="button" onClick={() => submitQuestion('Tell me about the Project Management Web Application')}><span><strong>Project Manager</strong><small>React · Node · Express</small></span><ChevronRight size={16} /></button></div>
          <div className="field-section" id="knowledge"><div className="section-heading"><Award size={15} /><span>QUICK STATS</span></div><div className="stats-grid"><div><strong>6 mo</strong><span>Industry<br />internship</span></div><div><strong>#3</strong><span>of 200<br />hackathon teams</span></div><div><strong>4</strong><span>Members led<br />on Job Portal</span></div><div><strong>2026</strong><span>B.Tech CSE<br />completed</span></div></div></div>
          <div className="field-section contact-section"><div className="section-heading"><Send size={15} /><span>OPEN A CHANNEL</span></div><a href="mailto:dikoleaman@gmail.com"><Mail size={15} /> Email Aman <ExternalLink size={13} /></a><a href="https://www.linkedin.com/in/aman-dikole-7b7a14401" target="_blank" rel="noreferrer"><BriefcaseBusiness size={15} /> LinkedIn <ExternalLink size={13} /></a><a href="https://github.com/DevAman-Pro" target="_blank" rel="noreferrer"><Code2 size={15} /> GitHub <ExternalLink size={13} /></a></div>
          <div className="location"><MapPin size={14} /> Pandharpur, Maharashtra</div>
        </aside>
      </section>
      {sidebarOpen && <button className="mobile-scrim" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
    </main>
  )
}

export default App
