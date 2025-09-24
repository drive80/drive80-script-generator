
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Cheerio from 'cheerio'

function htmlToText(html: string) {
  const $ = Cheerio.load(html)
  ;['script','style','noscript','svg','nav','footer','form','button'].forEach(sel => $(sel).remove())
  const title = $('title').first().text()
  const metaDesc = $('meta[name="description"]').attr('content') || ''
  const h1 = $('h1').first().text()
  const paragraphs: string[] = []
  $('p').each((_, el) => {
    const t = $(el).text().replace(/\s+/g, ' ').trim()
    if (t && t.length > 40 && t.length < 600) paragraphs.push(t)
  })
  const body = paragraphs.slice(0, 8).join(' ')
  return { title, metaDesc, h1, body }
}

function summarize(text: string, targetWords: number) {
  const sents = text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean)
  const ranked = sents
    .map((s, i) => ({ s, i, score: Math.min(s.length, 220) - Math.abs(s.length - 120) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .sort((a, b) => a.i - b.i)
    .map(r => r.s)
  const out: string[] = []
  let count = 0
  for (const sentence of ranked) {
    const words = sentence.split(/\s+/).length
    if (count + words <= targetWords + 20) {
      out.push(sentence)
      count += words
    }
  }
  if (!out.length) return sents.slice(0, 3).join(' ')
  return out.join(' ')
}

type Payload = {
  url?: string
  pastedText?: string
  companyName?: string
  audience?: string
  goal?: string
  tone?: string
  cta?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url, pastedText, companyName, audience, goal, tone, cta } = req.body as Payload
    let baseText = ''

    if (pastedText && pastedText.trim().length > 60) {
      baseText = pastedText.trim()
    } else if (url) {
      const r = await fetch(url as string, { headers: { 'User-Agent': 'Drive80-ScriptBot/1.0' } as any })
      const html = await r.text()
      const { title, metaDesc, h1, body } = htmlToText(html)
      baseText = [companyName || h1 || title, metaDesc, body].filter(Boolean).join('. ')
    } else {
      return res.status(400).json({ error: 'Provide a url or pastedText.' })
    }

    const clean = baseText.replace(/\s+/g, ' ').trim()
    const short = summarize(clean, 140)  // ~60s seed
    const shorter = summarize(clean, 75) // ~30s seed

    const name = companyName || (clean.match(/^([^.]{3,60})\./)?.[1] ?? 'Your Company')
    const tgt = audience || 'busy decision-makers'
    const g = goal || 'learn more'
    const t = tone || 'clear, friendly, confident'
    const call = cta || `Visit ${name.replace(/\s+/g, '')}.com to ${g}.`

    const script60 = `Narrator (${t}):\n` +
      `Meet ${name}. Here's the problem we solve for ${tgt}: ${short}\n` +
      `With ${name}, you get a simple way to cut the noise, move faster, and get results. ` +
      `Here's how it works: step one, we understand your needs; step two, we deliver a tailored solution; ` +
      `step three, you launch with confidence. Real teams use us to save time and hit their goals—without babysitting vendors.\n` +
      `Ready to see it in action? ${call}`

    const script30 = `Narrator (${t}):\n` +
      `${name} helps ${tgt} solve this fast: ${shorter}\n` +
      `Try it now—${call}`

    res.status(200).json({ script60, script30 })
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}
