const request = require('supertest');
const createApp = require('../src/app');
const { POSTS_API_URL } = require('../src/services/postsService');

describe('GET /posts', () => {
  let app;
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
    if (!originalFetch) {
      global.fetch = () => Promise.reject(new Error('fetch not implemented in test environment'));
    }
  });

  beforeEach(() => {
    app = createApp();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('aggregates posts by name', async () => {
    const mockPosts = [
      { id: '1', name: 'Ana' },
      { id: '2', name: 'Pedro' },
      { id: '3', name: 'ana ' },
      { id: '4', name: 'pedro' },
      { id: '5', name: null },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });

    const response = await request(app).get('/posts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { name: 'Ana', postCount: 2 },
      { name: 'Pedro', postCount: 2 },
      { name: 'Unknown', postCount: 1 },
    ]);
    expect(global.fetch).toHaveBeenCalledWith(POSTS_API_URL);
  });

  it('filters by name query parameter', async () => {
    const mockPosts = [
      { id: '1', name: 'Ana' },
      { id: '2', name: 'Pedro' },
      { id: '3', name: 'Ana' },
    ];

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });

    const response = await request(app).get('/posts').query({ name: 'an' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ name: 'Ana', postCount: 2 }]);
  });

  it('returns 500 when upstream API fails', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const response = await request(app).get('/posts');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Unable to fetch posts at this time.' });
  });
});
