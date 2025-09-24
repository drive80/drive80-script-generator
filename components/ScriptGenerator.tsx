
import React, { useState } from 'react'

export default function ScriptGenerator() {
  const [url, setUrl] = useState('')
  const [pastedText, setPastedText] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [audience, setAudience] = useState('marketing & creative directors')
  const [goal, setGoal] = useState('book a call')
  const [tone, setTone] = useState('plain, friendly, confident')
  const [cta, setCta] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [script60, setScript60] = useState('')
  const [script30, setScript30] = useState('')

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setScript60('')
    setScript30('')

    try {
      if (url || pastedText) {
        const r = await fetch('/api/site-to-scripts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, pastedText, companyName, audience, goal, tone, cta })
        })
        if (!r.ok) throw new Error(await r.text())
        const data = await r.json()
        setScript60(data.script60)
        setScript30(data.script30)
      } else {
        throw new Error('Provide a website URL or paste your site text.')
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh', width:'100%', background:'white'}}>
      <div style={{maxWidth: '880px', margin: '0 auto', padding: '40px 16px'}}>
        <header style={{marginBottom: '24px'}}>
          <h1 style={{fontSize:'28px', fontWeight:700}}>Explainer Script Generator</h1>
          <p style={{fontSize:'14px', color:'#4b5563', marginTop:'8px'}}>Enter a website URL (recommended) or paste key text. You’ll get two scripts: ~60s and ~30s.</p>
        </header>

        <form onSubmit={handleGenerate} style={{display:'grid', gap:'16px'}}>
          <label style={{display:'block'}}>
            <span style={{fontSize:'14px', fontWeight:600}}>Website URL</span>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{marginTop:'6px', width:'100%', border:'1px solid #d1d5db', borderRadius:12, padding:'10px 14px'}}
            />
          </label>

          <label style={{display:'block'}}>
            <span style={{fontSize:'14px', fontWeight:600}}>Or paste key site text</span>
            <textarea
              placeholder="Paste the most important content from the site here…"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              rows={6}
              style={{marginTop:'6px', width:'100%', border:'1px solid #d1d5db', borderRadius:12, padding:'10px 14px'}}
            />
            <span style={{fontSize:'12px', color:'#6b7280'}}>Tip: Include a short description, top benefits, proof, and a call‑to‑action.</span>
          </label>

          <div style={{display:'grid', gap:'16px', gridTemplateColumns:'1fr 1fr'}}>
            <label style={{display:'block'}}>
              <span style={{fontSize:'14px', fontWeight:600}}>Company/Project Name</span>
              <input
                type="text"
                placeholder="Acme Widgets"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{marginTop:'6px', width:'100%', border:'1px solid #d1d5db', borderRadius:12, padding:'10px 14px'}}
              />
            </label>
            <label style={{display:'block'}}>
              <span style={{fontSize:'14px', fontWeight:600}}>Primary Audience</span>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                style={{marginTop:'6px', width:'100%', border:'1px solid #d1d5db', borderRadius:12, padding:'10px 14px'}}
              />
            </label>
            <label style={{display:'block'}}>
              <span style={{fontSize:'14px', fontWeight:600}}>Goal</span>
              <input
                type="text"
                placeholder="book a call, start a trial, request a quote"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                style={{marginTop:'6px', width:'100%', border:'1px solid #d1d5db', borderRadius:12, padding:'10px 14px'}}
              />
            </label>
            <label style={{display:'block'}}>
              <span style={{fontSize:'14px', fontWeight:600}}>Tone</span>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                style={{marginTop:'6px', width:'100%', border:'1px solid #d1d5db', borderRadius:12, padding:'10px 14px'}}
              />
            </label>
            <label style={{display:'block', gridColumn:'1 / -1'}}>
              <span style={{fontSize:'14px', fontWeight:600}}>Custom CTA (optional)</span>
              <input
                type="text"
                placeholder="Visit acme.com to book a call."
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                style={{marginTop:'6px', width:'100%', border:'1px solid #d1d5db', borderRadius:12, padding:'10px 14px'}}
              />
            </label>
          </div>

          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <button
              type="submit"
              disabled={loading}
              style={{borderRadius:12, background:'#000', color:'#fff', padding:'10px 16px', border:'none', boxShadow:'0 1px 2px rgba(0,0,0,0.1)', transform: loading ? 'scale(0.98)' : 'none', opacity: loading ? 0.7 : 1}}
            >
              {loading ? 'Generating…' : 'Generate Scripts'}
            </button>
            {error && <span style={{fontSize:'14px', color:'#dc2626'}}>{error}</span>}
          </div>
        </form>

        {(script60 || script30) && (
          <section style={{marginTop:'24px', display:'grid', gap:'16px'}}>
            {script60 && (
              <article style={{border:'1px solid #e5e7eb', borderRadius:12, padding:'16px'}}>
                <h2 style={{fontSize:'18px', fontWeight:700}}>~60‑Second Script</h2>
                <pre style={{marginTop:'12px', whiteSpace:'pre-wrap', fontSize:'14px', lineHeight:1.5}}>{script60}</pre>
                <div style={{marginTop:'12px', display:'flex', gap:'8px'}}>
                  <CopyBtn text={script60} label="Copy 60s" />
                  <DownloadBtn text={script60} filename="script-60s.txt" />
                </div>
              </article>
            )}
            {script30 && (
              <article style={{border:'1px solid #e5e7eb', borderRadius:12, padding:'16px'}}>
                <h2 style={{fontSize:'18px', fontWeight:700}}>~30‑Second Script</h2>
                <pre style={{marginTop:'12px', whiteSpace:'pre-wrap', fontSize:'14px', lineHeight:1.5}}>{script30}</pre>
                <div style={{marginTop:'12px', display:'flex', gap:'8px'}}>
                  <CopyBtn text={script30} label="Copy 30s" />
                  <DownloadBtn text={script30} filename="script-30s.txt" />
                </div>
              </article>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      style={{border:'1px solid #d1d5db', borderRadius:12, padding:'8px 12px', fontSize:'14px', background:'#fff'}}
    >
      {copied ? 'Copied!' : label}
    </button>
  )
}

function DownloadBtn({ text, filename }: { text: string; filename: string }) {
  function download() {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
  return (
    <button
      type="button"
      onClick={download}
      style={{border:'1px solid #d1d5db', borderRadius:12, padding:'8px 12px', fontSize:'14px', background:'#fff'}}
    >
      Download
    </button>
  )
}
