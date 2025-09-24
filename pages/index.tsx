
import Head from 'next/head'
import ScriptGenerator from '../components/ScriptGenerator'

export default function Home() {
  return (
    <>
      <Head>
        <title>Explainer Script Generator — Drive80</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Generate two explainer scripts (60s and 30s) from a website or pasted text." />
      </Head>
      <main style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>
        <ScriptGenerator />
      </main>
    </>
  )
}
