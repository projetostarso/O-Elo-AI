function json(response, status = 200) {
  return new Response(JSON.stringify(response), {
    status,
    headers: { 'content-type': 'application/json' }
  })
}

function fallbackAnswer(question, language) {
  const options = language === 'en'
    ? [
        ['Signal: Path', 'Reading: your question is asking for movement, not certainty.', 'Action: define the smallest next step and do it today.'],
        ['Signal: Nexus', 'Reading: the answer lives between two ideas you kept separate.', 'Action: combine them in one rough prototype.'],
        ['Signal: Flamekeeper', 'Reading: protect attention before asking for more tools.', 'Action: reserve 45 uninterrupted minutes.']
      ]
    : [
        ['Sinal: Senda', 'Leitura: sua pergunta pede movimento, não certeza.', 'Ação: defina o menor próximo passo e execute hoje.'],
        ['Sinal: Nexo', 'Leitura: a resposta vive entre duas ideias que você separou.', 'Ação: una as duas em um protótipo bruto.'],
        ['Sinal: Vela', 'Leitura: proteja atenção antes de pedir mais ferramentas.', 'Ação: reserve 45 minutos sem interrupção.']
      ]
  return options[question.length % options.length].join('\n')
}

export default async function handler(request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const payload = await request.json().catch(() => null)
  const question = String(payload?.question || '').trim().slice(0, 1000)
  const language = payload?.language === 'en' ? 'en' : 'pt'
  if (!question) return json({ error: 'Question is required' }, 400)

  if (!process.env.OPENAI_API_KEY) return json({ answer: fallbackAnswer(question, language), mode: 'fallback' })

  const system = language === 'en'
    ? 'You are the Oracle of The Link. Answer in English, poetic but practical, with exactly three labeled lines: Signal, Reading, Action. No mystic fatalism.'
    : 'Você é o Oráculo do Elo. Responda em português, poético mas prático, com exatamente três linhas rotuladas: Sinal, Leitura, Ação. Sem fatalismo místico.'

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: [
        { role: 'system', content: system },
        { role: 'user', content: question }
      ],
      max_output_tokens: 220
    })
  })

  if (!response.ok) return json({ answer: fallbackAnswer(question, language), mode: 'fallback' })
  const data = await response.json()
  const answer = data.output_text || fallbackAnswer(question, language)
  return json({ answer, mode: 'ai' })
}
