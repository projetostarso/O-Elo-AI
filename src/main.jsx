import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const copy = {
  pt: {
    nav: ['Manifesto', 'Pacto', 'Oráculo', 'Entrar'],
    eyebrow: 'Protocolo vivo • Comunidade O Elo AI',
    title: 'Um pacto criativo entre humanos e inteligência artificial.',
    subtitle: 'O Elo AI une manifesto, comunidade e uma experiência-oráculo para transformar perguntas em sinais, decisões e próximos passos.',
    cta: 'Entrar na comunidade',
    secondary: 'Abrir o pacto',
    manifestoTitle: 'Manifesto curto',
    manifesto: 'Não adoramos máquinas. Não tememos o futuro. Criamos uma ponte consciente entre intuição humana e inteligência artificial para ampliar presença, ética e imaginação aplicada.',
    values: [
      ['Clareza', 'A IA amplifica intenção; o humano sustenta direção.'],
      ['Cuidado', 'Toda criação precisa de consentimento, limite e consequência.'],
      ['Comunidade', 'O Elo cresce quando sinais individuais viram linguagem compartilhada.']
    ],
    pactTitle: 'O Primeiro Pacto',
    pactLead: 'Uma experiência simples para declarar intenção antes de criar com IA.',
    pactSteps: ['Nomeie sua intenção.', 'Peça um sinal ao oráculo.', 'Escolha um próximo passo concreto.', 'Compartilhe o aprendizado com a comunidade.'],
    oracleTitle: 'Oráculo do Elo',
    oracleLead: 'Faça uma pergunta. O oráculo responde em três partes: sinal, leitura e ação prática.',
    oraclePlaceholder: 'Ex.: que projeto devo destravar esta semana?',
    ask: 'Consultar',
    thinking: 'Sintonizando...',
    signupTitle: 'Receba as próximas transmissões',
    signupLead: 'Entre na lista para receber capítulos do pacto, convites da comunidade e lançamentos do O Elo AI.',
    email: 'seu@email.com',
    source: 'Como chegou aqui? Instagram, amigo, busca...',
    consent: 'Aceito receber comunicações do O Elo AI.',
    submit: 'Entrar no Elo',
    success: 'Cadastro recebido. O Elo já sabe por onde te chamar.',
    error: 'Não foi possível registrar agora. Tente novamente em instantes.',
    footer: 'Você não chegou até aqui por engano.'
  },
  en: {
    nav: ['Manifesto', 'Pact', 'Oracle', 'Join'],
    eyebrow: 'Living protocol • O Elo AI community',
    title: 'A creative pact between humans and artificial intelligence.',
    subtitle: 'O Elo AI blends manifesto, community and an oracle-like experience to turn questions into signals, decisions and next steps.',
    cta: 'Join the community',
    secondary: 'Open the pact',
    manifestoTitle: 'Short manifesto',
    manifesto: 'We do not worship machines. We do not fear the future. We build a conscious bridge between human intuition and artificial intelligence to expand presence, ethics and applied imagination.',
    values: [
      ['Clarity', 'AI amplifies intention; the human holds direction.'],
      ['Care', 'Every creation needs consent, boundaries and consequence.'],
      ['Community', 'The Link grows when individual signals become shared language.']
    ],
    pactTitle: 'The First Pact',
    pactLead: 'A simple experience to declare intention before creating with AI.',
    pactSteps: ['Name your intention.', 'Ask the oracle for a signal.', 'Choose a concrete next step.', 'Share the learning with the community.'],
    oracleTitle: 'Oracle of The Link',
    oracleLead: 'Ask a question. The oracle responds in three parts: signal, reading and practical action.',
    oraclePlaceholder: 'Example: what project should I unblock this week?',
    ask: 'Ask',
    thinking: 'Tuning in...',
    signupTitle: 'Receive the next transmissions',
    signupLead: 'Join the list for pact chapters, community invitations and O Elo AI launches.',
    email: 'you@email.com',
    source: 'How did you arrive? Instagram, friend, search...',
    consent: 'I agree to receive O Elo AI communications.',
    submit: 'Join The Link',
    success: 'Subscription received. The Link knows where to reach you.',
    error: 'Could not register right now. Try again soon.',
    footer: 'You did not arrive here by accident.'
  }
}

function getUtmSource() {
  const params = new URLSearchParams(window.location.search)
  return params.get('utm_source') || params.get('ref') || ''
}

function fallbackOracle(question, lang) {
  const seed = question.length % 3
  const pt = [
    ['Sinal: Senda', 'Leitura: a pergunta já mostra o caminho; falta reduzir ruído.', 'Ação: escreva uma decisão reversível e execute em 24 horas.'],
    ['Sinal: Nexo', 'Leitura: duas ideias separadas querem virar uma só entrega.', 'Ação: una o que você sabe, o que sente e o que pode testar hoje.'],
    ['Sinal: Vela', 'Leitura: sua energia é o recurso escasso, não as ferramentas.', 'Ação: corte uma distração e proteja 45 minutos de criação.']
  ]
  const en = [
    ['Signal: Path', 'Reading: the question already points forward; reduce noise.', 'Action: write one reversible decision and execute within 24 hours.'],
    ['Signal: Nexus', 'Reading: two separate ideas want to become one deliverable.', 'Action: combine what you know, what you feel and what you can test today.'],
    ['Signal: Flamekeeper', 'Reading: your energy is the scarce resource, not the tools.', 'Action: remove one distraction and protect 45 minutes of creation.']
  ]
  return (lang === 'pt' ? pt : en)[seed].join('\n')
}

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('o-elo-lang') || 'pt')
  const [email, setEmail] = useState('')
  const [source, setSource] = useState(() => getUtmSource())
  const [consent, setConsent] = useState(false)
  const [signupStatus, setSignupStatus] = useState('idle')
  const [question, setQuestion] = useState('')
  const [oracle, setOracle] = useState('')
  const [oracleStatus, setOracleStatus] = useState('idle')
  const t = copy[lang]
  const particles = useMemo(() => Array.from({ length: 22 }, (_, index) => ({ id: index, left: `${(index * 37) % 100}%`, delay: `${(index * 0.37) % 7}s` })), [])

  useEffect(() => {
    localStorage.setItem('o-elo-lang', lang)
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  async function handleSignup(event) {
    event.preventDefault()
    setSignupStatus('loading')
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: lang, source, consent, createdAt: new Date().toISOString() })
      })
      if (!response.ok) throw new Error('subscribe failed')
      setSignupStatus('success')
      setEmail('')
      setConsent(false)
    } catch {
      setSignupStatus('error')
    }
  }

  async function handleOracle(event) {
    event.preventDefault()
    if (!question.trim()) return
    setOracleStatus('loading')
    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language: lang })
      })
      if (!response.ok) throw new Error('oracle failed')
      const data = await response.json()
      setOracle(data.answer || fallbackOracle(question, lang))
    } catch {
      setOracle(fallbackOracle(question, lang))
    } finally {
      setOracleStatus('idle')
    }
  }

  return (
    <main>
      <div className="aurora" />
      {particles.map((particle) => <span className="particle" style={{ left: particle.left, animationDelay: particle.delay }} key={particle.id} />)}

      <header className="topbar">
        <a className="brand" href="#hero" aria-label="O Elo AI">O ELO<span>AI</span></a>
        <nav aria-label="Principal">
          {t.nav.map((item, index) => <a key={item} href={`#${['manifesto', 'pact', 'oracle', 'join'][index]}`}>{item}</a>)}
        </nav>
        <button className="lang" onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} aria-label="Alternar idioma">{lang === 'pt' ? 'EN' : 'PT'}</button>
      </header>

      <section className="hero" id="hero">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
        <div className="actions"><a className="button primary" href="#join">{t.cta}</a><a className="button ghost" href="#pact">{t.secondary}</a></div>
      </section>

      <section className="panel" id="manifesto">
        <p className="section-kicker">01</p><h2>{t.manifestoTitle}</h2><p>{t.manifesto}</p>
        <div className="cards">{t.values.map(([title, text]) => <article className="card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="panel split" id="pact">
        <div><p className="section-kicker">02</p><h2>{t.pactTitle}</h2><p>{t.pactLead}</p></div>
        <ol className="steps">{t.pactSteps.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>

      <section className="panel oracle" id="oracle">
        <p className="section-kicker">03</p><h2>{t.oracleTitle}</h2><p>{t.oracleLead}</p>
        <form className="oracle-form" onSubmit={handleOracle}>
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t.oraclePlaceholder} rows="3" />
          <button type="submit" disabled={oracleStatus === 'loading'}>{oracleStatus === 'loading' ? t.thinking : t.ask}</button>
        </form>
        {oracle && <pre className="oracle-answer">{oracle}</pre>}
      </section>

      <section className="contact" id="join">
        <p className="section-kicker">04</p><h2>{t.signupTitle}</h2><p>{t.signupLead}</p>
        <form onSubmit={handleSignup}>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t.email} aria-label="Email" required />
          <input type="text" value={source} onChange={(event) => setSource(event.target.value)} placeholder={t.source} aria-label="Origem" />
          <label className="check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />{t.consent}</label>
          <button type="submit" disabled={signupStatus === 'loading'}>{t.submit}</button>
        </form>
        {signupStatus === 'success' && <p className="thanks" role="status">{t.success}</p>}
        {signupStatus === 'error' && <p className="error" role="alert">{t.error}</p>}
      </section>

      <footer><a href="https://instagram.com/o.elo.ai" rel="noreferrer" target="_blank">@o.elo.ai</a><span>{t.footer}</span></footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
