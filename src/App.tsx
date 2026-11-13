import { useState } from 'react';
import Parse from './parse';
import Auth from './Auth';
import Todos from './Todos';
import './styles.css';

export default function App() {
  // the SDK keeps the session between visits
  const [user, setUser] = useState<Parse.User | null>(Parse.User.current() ?? null);
  return (
    <main>
      {user ? <Todos user={user} onLogout={() => setUser(null)} /> : <Auth onLogin={setUser} />}
      <p className="muted footer">Backend on <a href="https://www.sashido.io">SashiDo</a></p>
    </main>
  );
}
