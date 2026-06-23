function json(response, status = 200) {
  return new Response(JSON.stringify(response), {
    status,
    headers: { 'content-type': 'application/json' }
  })
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default async function handler(request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const payload = await request.json().catch(() => null)
  if (!payload || !isEmail(payload.email) || payload.consent !== true) {
    return json({ error: 'Valid email and consent are required' }, 400)
  }

  const record = {
    email: payload.email.toLowerCase().trim(),
    language: payload.language === 'en' ? 'en' : 'pt',
    source: String(payload.source || '').slice(0, 160),
    consent: true,
    created_at: payload.createdAt || new Date().toISOString()
  }

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const table = process.env.SUPABASE_SUBSCRIBERS_TABLE || 'subscribers'
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'content-type': 'application/json',
        prefer: 'return=minimal'
      },
      body: JSON.stringify(record)
    })

    if (!response.ok) return json({ error: 'Could not persist subscription' }, 502)
  } else {
    console.info('O Elo subscription received without persistence backend:', record)
  }

  return json({ ok: true })
}
