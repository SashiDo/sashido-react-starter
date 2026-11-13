import { useState, type FormEvent } from 'react';
import Parse from './parse';

export default function Auth({ onLogin }: { onLogin: (user: Parse.User) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user =
        mode === 'login'
          ? await Parse.User.logIn(username, password)
          : await new Parse.User({ username, password }).signUp();
      onLogin(user);
    } catch (err) {
      setError((err as Parse.Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h1>{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
      <input aria-label="Username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input aria-label="Password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" disabled={busy}>{mode === 'login' ? 'Log in' : 'Create account'}</button>
      <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'No account yet? Sign up' : 'Have an account? Log in'}
      </button>
    </form>
  );
}
