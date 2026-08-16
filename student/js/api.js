/* ============================================================
   api.js – centralised API client for student frontend
   All requests go to API_BASE from window.MS_CONFIG or env
   ============================================================ */

const API_BASE = window.MS_CONFIG?.apiBase ?? 'http://localhost:4000';

const API = {
  /* ── Helpers ─────────────────────────────────────── */
  token() { return localStorage.getItem('ms_token'); },
  setToken(t) { localStorage.setItem('ms_token', t); },
  clearToken() { localStorage.removeItem('ms_token'); localStorage.removeItem('ms_user'); },

  async request(method, path, body, requireAuth = false) {
    const headers = { 'Content-Type': 'application/json' };
    const tok = this.token();
    if (tok) headers['Authorization'] = 'Bearer ' + tok;

    const res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401 && !path.includes('/login')) {
      this.clearToken();
      window.location.href = '/index.html';
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  patch(path, body) { return this.request('PATCH', path, body); },
  del(path) { return this.request('DELETE', path); },

  /* ── Auth ────────────────────────────────────────── */
  async login(email, password) {
    const d = await this.post('/api/auth/login', { email, password });
    this.setToken(d.token);
    localStorage.setItem('ms_user', JSON.stringify(d.user));
    if (d.force_password_reset) localStorage.setItem('ms_fpr', '1');
    else localStorage.removeItem('ms_fpr');
    return d.user;
  },
  async register(name, email, password) {
    const d = await this.post('/api/auth/register', { name, email, password });
    return d;
  },
  async me() {
    const d = await this.get('/api/auth/me');
    localStorage.setItem('ms_user', JSON.stringify(d));
    if (d.force_password_reset) localStorage.setItem('ms_fpr', '1');
    else localStorage.removeItem('ms_fpr');
    return d;
  },
  currentUser() {
    const raw = localStorage.getItem('ms_user');
    return raw ? JSON.parse(raw) : null;
  },
  isLoggedIn() { return !!this.token(); },
  isAdmin() { return this.currentUser()?.role === 'admin'; },
  mustChangePassword() { return localStorage.getItem('ms_fpr') === '1'; },
  logout() { this.clearToken(); localStorage.removeItem('ms_fpr'); window.location.href = 'index.html'; },
  changePassword(new_password) { return this.post('/api/auth/change-password', { new_password }); },

  /* ── Announcements ───────────────────────────────── */
  getAnnouncements() { return this.get('/api/announcements'); },
  addAnnouncement(d) { return this.post('/api/announcements', d); },
  deleteAnnouncement(id) { return this.del('/api/announcements/' + id); },
  patchAnnouncement(id, d) { return this.patch('/api/announcements/' + id, d); },

  /* ── Materials ───────────────────────────────────── */
  getMaterials(cat) { return this.get('/api/materials' + (cat ? '?category=' + cat : '')); },
  addMaterial(d) { return this.post('/api/materials', d); },
  deleteMaterial(id) { return this.del('/api/materials/' + id); },

  /* ── Mock-Exam ───────────────────────────────────── */
  getTheorySubjects() { return this.get('/api/mock/theory-subjects'); },
  getExerciseSubjects() { return this.get('/api/mock/exercise-subjects'); },
  submitMock(d) { return this.post('/api/mock/submit', d); },
  myResults() { return this.get('/api/mock/my-results'); },

  /* ── Admin ───────────────────────────────────────── */
  adminUsers() { return this.get('/api/admin/users'); },
  adminUpdateUser(id, d) { return this.patch('/api/admin/users/' + id, d); },
  adminDeleteUser(id) { return this.del('/api/admin/users/' + id); },
  adminMockResults() { return this.get('/api/admin/mock-results'); },
  adminGrade(resultId, d) { return this.post('/api/admin/grade/' + resultId, d); },
  adminAddSubject(type, d) { return this.post('/api/mock/subjects/' + type, d); },
  adminDeleteSubject(type, id) { return this.del('/api/mock/subjects/' + type + '/' + id); },
};
