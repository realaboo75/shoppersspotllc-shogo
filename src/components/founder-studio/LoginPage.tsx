import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from './AuthContext'

const CHERRI_PHOTO = '/avatars/cherri.svg'

export default function LoginPage({ onBack }: { onBack: () => void }) {
  const { login, loading, requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetMessage, setResetMessage] = useState('')

  const handleLogin = async () => {
    setError('')
    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!password.trim()) { setError('Please enter your password.'); return }
    const result = await login(email.trim(), password)
    if (!result.ok && result.error) setError(result.error)
  }

  const handleResetSubmit = async () => {
    if (!resetEmail.trim()) { setError('Please enter your email address.'); return }
    const result = await requestPasswordReset(resetEmail.trim())
    if (result.ok) { setResetMessage(result.message || 'If the account exists, instructions will be sent.'); setResetSent(true) }
    else setError(result.error || 'Password reset is unavailable.')
  }

  if (showForgot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <button onClick={() => { setShowForgot(false); setResetSent(false); setError(''); setResetEmail(''); setResetMessage('') }}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </button>
          <div className="glass rounded-2xl p-8 gradient-border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Reset Password</h1>
              <p className="text-sm text-text-secondary mt-2">
                {resetSent ? 'Check your email for instructions' : "Enter your email and we'll send you a reset link"}
              </p>
            </div>
            {!resetSent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-muted mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleResetSubmit()}
                      placeholder="founder@shoppersspotllc.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-all" />
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 text-error text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}
                <button onClick={handleResetSubmit}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2">
                  Send Reset Link <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-16 h-16 text-success" />
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{resetMessage}</p>
                <p className="text-xs text-text-muted">
                  Check your inbox at <strong className="text-text-primary">usaaboo@gmail.com</strong> for the password reset link.
                </p>
                <button onClick={() => { setShowForgot(false); setResetSent(false); setResetEmail(''); setResetMessage('') }}
                  className="w-full py-3 rounded-xl bg-bg-elevated border border-border-subtle text-text-primary font-semibold text-sm hover:bg-bg-hover transition-all">
                  Back to Login
                </button>
              </div>
            )}
          </div>
          <p className="text-center text-xs text-text-muted mt-6">ShoppersSpot Studio · © 2026 Shoppers Spot LLC</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to website
        </button>
        <div className="glass rounded-2xl p-8 gradient-border">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={CHERRI_PHOTO} alt="Cherri" className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/30" />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
            <p className="text-sm text-text-secondary mt-2">Sign in to Founder Studio</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="founder@shoppersspotllc.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-all" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-secondary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => { setShowForgot(true); setError(''); setResetEmail(email) }}
                className="text-xs text-accent hover:text-accent/80 transition-colors">Forgot password?</button>
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 text-error text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}
            <button onClick={handleLogin} disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>) : (<>Sign In <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-muted">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Google', logo: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                { name: 'Microsoft', logo: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg> },
                { name: 'Apple', logo: <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.65-2.2.48-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg> },
              ].map(s => (
                <button key={s.name} type="button" disabled aria-label={`${s.name} sign-in is not configured`}
                  className="py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-sm text-text-secondary hover:bg-bg-hover hover:border-accent/30 transition-all flex items-center justify-center gap-2">
                  {s.logo} <span className="text-xs">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">© 2026 Shoppers Spot LLC. All rights reserved.</p>
      </div>
    </div>
  )
}