const DEFAULT_POSTS_API_URL = 'https://687eade4efe65e5200875629.mockapi.io/api/v1/posts';
const POSTS_API_URL = process.env.POSTS_API_URL || DEFAULT_POSTS_API_URL;

async function fetchRawPosts() {
  const response = await fetch(POSTS_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to load posts. Upstream responded with status ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function normaliseName(name) {
  if (typeof name !== 'string') {
    return 'Unknown';
  }
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : 'Unknown';
}

function groupPostsByName(posts) {
  const counts = posts.reduce((acc, post) => {
    const normalisedName = normaliseName(post.name);
    const key = normalisedName.toLowerCase();

    if (!acc.has(key)) {
      acc.set(key, { name: normalisedName, postCount: 0 });
    }

    const entry = acc.get(key);
    entry.postCount += 1;

    return acc;
  }, new Map());

  return Array.from(counts.values()).sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
  );
}

async function getPostsSummary(filterName) {
  const posts = await fetchRawPosts();
  const summary = groupPostsByName(posts);

  if (!filterName) {
    return summary;
  }

  const query = filterName.trim().toLowerCase();
  return summary.filter((item) => item.name.toLowerCase().includes(query));
}

module.exports = {
  POSTS_API_URL,
  fetchRawPosts,
  groupPostsByName,
  getPostsSummary,
};
