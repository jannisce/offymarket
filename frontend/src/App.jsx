import { useEffect, useMemo, useState } from 'react';
import { fetchPosts } from './api/posts';
import PostsTable from './components/PostsTable';

const STATUS = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
};

function App() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(STATUS.idle);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      setStatus(STATUS.loading);
      setErrorMessage('');

      try {
        const data = await fetchPosts();
        if (isMounted) {
          setPosts(data);
          setStatus(STATUS.success);
        }
      } catch (error) {
        if (isMounted) {
          console.error(error);
          setStatus(STATUS.error);
          setErrorMessage('No se pudieron cargar los datos. Inténtalo nuevamente.');
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return posts;
    }

    const query = searchTerm.trim().toLowerCase();
    return posts.filter((item) => item.name.toLowerCase().includes(query));
  }, [posts, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <main className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">Resumen de Posts</h1>
          <p className="mt-2 text-slate-500">
            Datos obtenidos desde el backend, agrupados por nombre de usuario y mostrados en una tabla interactiva.
          </p>
        </header>

        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="w-full sm:max-w-xs">
            <span className="mb-1 block text-sm font-medium text-slate-600">Filtrar por nombre</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ej. Pedro"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring"
            />
          </label>
          <div className="text-sm text-slate-500">
            {status === STATUS.success && `${filteredPosts.length} resultado(s)`}
          </div>
        </section>

        {status === STATUS.loading && (
          <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center text-slate-500">
            Cargando posts...
          </div>
        )}

        {status === STATUS.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            {errorMessage}
          </div>
        )}

        {status === STATUS.success && (
          <PostsTable rows={filteredPosts} emptyMessage="No hay coincidencias para tu búsqueda." />
        )}
      </main>
    </div>
  );
}

export default App;
