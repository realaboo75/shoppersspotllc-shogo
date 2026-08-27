import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Image as ImageIcon, Paperclip, User } from 'lucide-react'

interface Msg { id: string; role: 'user' | 'assistant'; text: string; time: string }

const GREETING: Msg = {
  id: 'g1', role: 'assistant', time: 'Now',
  text: "Hey Aboobakar! 👋 I'm Cherri, your AI business partner. I can build websites, stores, apps, marketing campaigns — you name it. What are we working on today?"
}

const CHERRI_RESPONSES: Record<string, string> = {
  shopify: "I'll build you a stunning Shopify jewelry store! ✨\n\nHere's my plan:\n\n**1.** Design a premium, conversion-optimized storefront\n**2.** Set up product categories (rings, necklaces, bracelets, earrings)\n**3.** Create an About page with your brand story\n**4.** Add a secure checkout flow\n**5.** SEO-optimized for Google Shopping\n\n**Ready to start building?** I'll have the preview ready in a few minutes.",
  crm: "Love it! A healthcare CRM that puts patients first. 🏥\n\nHere's what I'll build:\n\n**1.** Patient intake forms with insurance verification\n**2.** Appointment scheduling with smart reminders\n**3.** Treatment history and medical records\n**4.** Billing and invoicing dashboard\n**5.** Automated follow-up campaigns\n\nHIPAA-compliant from day one. Shall I get started?",
  mobile: "A mobile app — exciting! 📱\n\nLet me understand a few things:\n\n**1.** What does the app do?\n**2.** Who is your target audience?\n**3.** iOS, Android, or both?\n**4.** Any must-have features?\n\nOnce you tell me, I'll design the wireframes, build the app, and prepare it for the app stores.",
  marketing: "Let's create a powerful marketing campaign! 📣\n\nHere's what I can prepare:\n\n**1.** Social media content calendar (30 days)\n**2.** Instagram & Facebook ad creatives\n**3.** Email sequences for customer nurturing\n**4.** Google Ads copy and targeting strategy\n**5.** Landing page design\n\nWhat's the product or service you want to promote?",
  website: "I'll build you a stunning website! 🌐\n\nHere's my plan:\n\n**1.** Modern, mobile-first design\n**2.** About, Services, Portfolio, Contact pages\n**3.** SEO optimization for local search\n**4.** Contact forms with automated responses\n**5.** Social media integration\n\nWhat type of business is this website for?",
  landing: "Landing pages convert visitors into customers! 🎯\n\nI'll create:\n\n**1.** Hero section with compelling headline\n**2.** Benefits & features section\n**3.** Social proof & testimonials\n**4.** Clear call-to-action buttons\n**5.** Mobile-optimized, fast-loading design\n\nWhat product or service are we landing for?",
  default: "Great idea! Let me think about this. 💡\n\nI'll analyze your request and come up with the best approach. Here's what I'll do:\n\n**1.** Research the best templates and tools for this\n**2.** Design a custom solution tailored to your needs\n**3.** Build it using the best AI models available\n**4.** Test everything thoroughly\n**5.** Present you with a polished, ready-to-use result\n\nGive me a moment to put this together for you!"
}

function getCherriResponse(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('shopify') || t.includes('jewelry') || t.includes('store')) return CHERRI_RESPONSES.shopify
  if (t.includes('crm') || t.includes('healthcare') || t.includes('clinic')) return CHERRI_RESPONSES.crm
  if (t.includes('mobile') || t.includes('app')) return CHERRI_RESPONSES.mobile
  if (t.includes('marketing') || t.includes('campaign') || t.includes('ads') || t.includes('social media')) return CHERRI_RESPONSES.marketing
  if (t.includes('website') || t.includes('site')) return CHERRI_RESPONSES.website
  if (t.includes('landing') || t.includes('page')) return CHERRI_RESPONSES.landing
  return CHERRI_RESPONSES.default
}

const SUGGESTIONS = [
  'Build me a Shopify jewelry store',
  'Create a healthcare CRM',
  'Build a mobile app',
  'Generate a marketing campaign',
  'Build my website',
  'Create a landing page',
]

export default function Cherri() {
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || typing) return
    setInput('')
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: msg, time: now }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: getCherriResponse(msg), time }])
    }, 1200 + Math.random() * 800)
  }

  const renderMd = (t: string) => {
    const lines = t.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**'))
        return <p key={i} className="font-semibold text-text-primary mt-2">{line.replace(/\*\*/g, '')}</p>
      if (line.match(/^\*\*\d/))
        return <p key={i} className="text-text-secondary ml-2">{line.replace(/\*\*/g, '')}</p>
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="text-text-secondary">{line.replace(/\*\*/g, '')}</p>
    })
  }

  return (
    <div className="flex flex-col h-full bg-bg relative">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0 mt-0.5">
                {msg.role === 'assistant' ? <img src="/avatars/cherri.svg" alt="Cherri" className="w-7 h-7 rounded-full object-cover" /> : <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center"><User className="w-3.5 h-3.5 text-accent" /></div>}
              </div>
              <div>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-accent text-white rounded-br-md' : 'bg-bg-elevated text-text-primary border border-border-subtle rounded-bl-md'}`}>
                  {msg.role === 'assistant' ? renderMd(msg.text) : msg.text}
                </div>
                <p className="text-[10px] text-text-muted mt-1 px-1">{msg.time}</p>
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex gap-2.5">
              <img src="/avatars/cherri.svg" alt="Cherri" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
              <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-bg-elevated border border-border-subtle">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 justify-center px-4 pb-4 max-w-3xl mx-auto">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="border-t border-border p-4 bg-bg/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-bg-elevated rounded-2xl border border-border-subtle p-3 focus-within:border-accent/50 transition-all">
            <button className="p-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-all" title="Voice input"><Mic className="w-5 h-5" /></button>
            <button className="p-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-all" title="Upload image"><ImageIcon className="w-5 h-5" /></button>
            <button className="p-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-all" title="Upload file"><Paperclip className="w-5 h-5" /></button>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Ask Cherri what you want to build..." rows={1} className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none resize-none py-2 px-1 max-h-32" />
            <button onClick={() => send()} disabled={!input.trim() || typing} className="p-2 rounded-xl bg-accent text-white hover:bg-accent/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><Send className="w-5 h-5" /></button>
          </div>
          <p className="text-center text-[10px] text-text-muted mt-2">Cherri by Shoppers Spot LLC · AI Business Partner</p>
        </div>
      </div>
    </div>
  )
}