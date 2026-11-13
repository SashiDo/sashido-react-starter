import { useEffect, useState, type FormEvent } from 'react';
import Parse, { liveQueriesEnabled } from './parse';

type Todo = Parse.Object<{ title: string; done: boolean }>;

export default function Todos({ user, onLogout }: { user: Parse.User; onLogout: () => void }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // the ACL set in cloud/main.js means a user only finds their own todos
    const query = new Parse.Query<Todo>('Todo').descending('createdAt').limit(100);
    query.find().then(setTodos, (err: Parse.Error) => setError(err.message));

    if (!liveQueriesEnabled) return;
    let subscription: { unsubscribe: () => unknown } | undefined;
    query.subscribe().then((sub) => {
      subscription = sub;
      const upsert = (todo: Todo) => setTodos((list) => [todo, ...list.filter((t) => t.id !== todo.id)]);
      sub.on('create', upsert);
      sub.on('update', (todo: Todo) => setTodos((list) => list.map((t) => (t.id === todo.id ? todo : t))));
      sub.on('delete', (todo: Todo) => setTodos((list) => list.filter((t) => t.id !== todo.id)));
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const todo = await new Parse.Object('Todo', { title: title.trim(), done: false }).save() as Todo;
      setTodos((list) => [todo, ...list.filter((t) => t.id !== todo.id)]);
      setTitle('');
    } catch (err) {
      setError((err as Parse.Error).message);
    }
  }

  async function toggle(todo: Todo) {
    await todo.save({ done: !todo.get('done') });
    setTodos((list) => [...list]);
  }

  async function remove(todo: Todo) {
    await todo.destroy();
    setTodos((list) => list.filter((t) => t.id !== todo.id));
  }

  async function logout() {
    await Parse.User.logOut();
    onLogout();
  }

  return (
    <div className="card">
      <header>
        <h1>{user.get('username')}'s todos</h1>
        <button className="link" onClick={logout}>Log out</button>
      </header>
      <form onSubmit={add} className="row">
        <input aria-label="New todo" placeholder="What needs doing?" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.get('done') ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={todo.get('done')} onChange={() => toggle(todo)} />
              {todo.get('title')}
            </label>
            <button className="link" aria-label={`Delete ${todo.get('title')}`} onClick={() => remove(todo)}>Delete</button>
          </li>
        ))}
      </ul>
      {!todos.length && <p className="muted">Nothing yet.</p>}
    </div>
  );
}
