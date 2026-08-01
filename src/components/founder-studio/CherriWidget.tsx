import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Image as ImageIcon, Paperclip, X, Minus, Maximize2 } from 'lucide-react'

const CHERRI_PHOTO = '/avatars/cherri.png'

interface Msg { id: string; role: 'user' | 'assistant'; text: string; time: string }

const GREETING: Msg = {
  id: 'g1', role: 'assistant', time: 'Now',
  text: "Hi Aboobakar! I'm Cherri 🍒 What are we building today?"
}

const RESPONSES: Record<string, string> = {
  shopify: "I'll build you a stunning Shopify jewelry store! ✨\n\n**1.** Premium storefront design\n**2.** Product categories & listings\n**3.** Secure checkout flow\n**4.** SEO optimization\n**5.** Ready for customers\n\nShall I get started?",
  crm: "A healthcare CRM — let's do it! 🏥\n\n**1.** Patient intake forms\n**2.** Appointment scheduling\n**3.** Treatment history\n**4.** Billing dashboard\n**5.** Automated follow-ups\n\nStarting now!",
  mobile: "A mobile app! 📱\n\nTell me:\n- What does it do?\n- Who is it for?\n- iOS, Android, or both?\n\nI'll handle the rest.",
  marketing: "Let's create a powerful campaign! 📣\n\n**1.** Social media calendar\n**2.** Ad creatives\n**3.** Email sequences\n**4.** Landing page\n**5.** Analytics tracking\n\nWhat are we promoting?",
  website: "I'll build a beautiful website! 🌐\n\n**1.** Modern design\n**2.** About, Services, Contact pages\n**3.** SEO optimized\n**4.** Mobile-responsive\n**5.** Contact forms\n\nWhat business is this for?",
  landing: "Landing pages that convert! 🎯\n\n**1.** Hero section\n**2.** Benefits & features\n**3.** Social proof\n**4.** Strong CTAs\n**5.** Fast & mobile\n\nWhat product or service?",
  default: "Great idea! 💡\n\nI'll research, design, build, test, and present a polished result. Just tell me what you need!"
}

function getResponse(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('shopify') || t.includes('jewelry') || t.includes('store')) return RESPONSES.shopify
  if (t.includes('crm') || t.includes('healthcare') || t.includes('clinic')) return RESPONSES.crm
  if (t.includes('mobile') || t.includes('app')) return RESPONSES.mobile
  if (t.includes('marketing') || t.includes('campaign') || t.includes('ads') || t.includes('social')) return RESPONSES.marketing
  if (t.includes('website') || t.includes('site')) return RESPONSES.website
  if (t.includes('landing') || t.includes('page')) return RESPONSES.landing
  return RESPONSES.default
}

export default function CherriWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus()
  }, [open, minimized])

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
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: getResponse(msg), time }])
    }, 1200 + Math.random() * 800)
  }

  const renderMd = (t: string) => {
    return t.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**'))
        return <p key={i} className="font-semibold text-gray-800 mt-1">{line.replace(/\*\*/g, '')}</p>
      if (line.match(/^\*\*\d/))
        return <p key={i} className="text-gray-600 ml-1 text-[13px]">{line.replace(/\*\*/g, '')}</p>
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="text-gray-600 text-[13px]">{line.replace(/\*\*/g, '')}</p>
    })
  }

  return (
    <>
      {!open && (
        <button onClick={() => { setOpen(true); setMinimized(false) }} className="fixed bottom-6 right-6 z-[100] group" aria-label="Open Cherri chat">
          <div className="relative">
            <img src={CHERRI_PHOTO} alt="Cherri" className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105" />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="absolute -top-8 right-0 bg-gray-800 text-white text-[11px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Talk to Cherri
          </div>
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300" style={{ width: minimized ? 340 : 380, height: minimized ? 56 : 520 }}>
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-600 flex-shrink-0">
            <img src={CHERRI_PHOTO} alt="Cherri" className="w-9 h-9 rounded-full object-cover border-2 border-white/40" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Cherri</p>
              <p className="text-[11px] text-white/70">AI Business Partner · Online</p>
            </div>
            <button onClick={() => setMinimized(m => !m)} className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-all">
              {minimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            </button>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          {!minimized && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'assistant' && (
                        <img src={CHERRI_PHOTO} alt="Cherri" className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-md' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'}`}>
                          {msg.role === 'assistant' ? renderMd(msg.text) : msg.text}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 px-1">{msg.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="flex gap-2">
                      <img src={CHERRI_PHOTO} alt="Cherri" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-gray-100 bg-white px-3 py-3 flex-shrink-0">
                <div className="flex items-end gap-2 bg-gray-100 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-purple-400/30 transition-all">
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><Mic className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><ImageIcon className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><Paperclip className="w-4 h-4" /></button>
                  <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Ask Cherri anything..." rows={1} className="flex-1 bg-transparent text-[13px] text-gray-800 placeholder:text-gray-400 outline-none resize-none py-1 px-1" />
                  <button onClick={() => send()} disabled={!input.trim() || typing} className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}