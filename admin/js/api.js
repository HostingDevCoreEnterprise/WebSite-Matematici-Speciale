/* ============================================================
   api.js (Admin) – shared API client
   ============================================================ */

const API_BASE = window.MS_CONFIG?.apiBase ?? 'http://localhost:4000';

const API = {
  token() { return localStorage.getItem('ms_token'); },
  setToken(t) { localStorage.setItem('ms_token', t); },
  clearToken() { localStorage.removeItem('ms_token'); localStorage.removeItem('ms_user'); },

  async request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const tok = this.token();
    if (tok) headers['Authorization'] = 'Bearer ' + tok;

    const res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) { this.clearToken(); window.location.href = 'index.html'; return; }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  patch(path, body) { return this.request('PATCH', path, body); },
  del(path) { return this.request('DELETE', path); },

  async login(email, password) {
    const d = await this.post('/api/auth/login', { email, password });
    if (d.user.role !== 'admin') throw new Error('Acces refuzat. Nu ești administrator.');

    this.setToken(d.token);
    localStorage.setItem('ms_user', JSON.stringify(d.user));

    // Salvăm starea de resetare forțată
    if (d.force_password_reset) {
      localStorage.setItem('ms_fpr', '1');
    } else {
      localStorage.removeItem('ms_fpr');
    }

    return d.user;
  },
  // Verifică dacă adminul trebuie să schimbe parola
  mustChangePassword() { 
    return localStorage.getItem('ms_fpr') === '1'; 
  },

  // Endpoint pentru setarea noii parole
  changePassword(new_password) {
    return this.post('/api/auth/change-password', { new_password });
  },
  currentUser() {
    const raw = localStorage.getItem('ms_user');
    return raw ? JSON.parse(raw) : null;
  },
  isLoggedIn() { return !!this.token() && this.currentUser()?.role === 'admin'; },
  logout() { this.clearToken(); window.location.href = 'index.html'; },

  /* ── Admin Endpoints ─────────────────────────────── */
  getUsers() { return this.get('/api/admin/users'); },
  approveUser(id) { return this.patch('/api/admin/users/' + id, { is_approved: true }); },
  updateUser(id, d) { return this.patch('/api/admin/users/' + id, d); },
  deleteUser(id) { return this.del('/api/admin/users/' + id); },
  getAnnouncements() { return this.get('/api/announcements'); },
  addAnnouncement(d) { return this.post('/api/announcements', d); },
  deleteAnnouncement(id) { return this.del('/api/announcements/' + id); },
  getMaterials(cat) { return this.get('/api/materials' + (cat ? '?category=' + cat : '')); },
  addMaterial(d) { return this.post('/api/materials', d); },
  deleteMaterial(id) { return this.del('/api/materials/' + id); },
  getTheorySubjects() { return this.get('/api/mock/theory-subjects'); },
  getExSubjects() { return this.get('/api/mock/exercise-subjects'); },
  addSubject(type, d) { return this.post('/api/mock/subjects/' + type, d); },
  delSubject(type, id) { return this.del('/api/mock/subjects/' + type + '/' + id); },
  resetPassword(id) { return this.post('/api/admin/users/' + id + '/reset-password', {}); },
  gradeMockResult(resId, d) { return this.post('/api/admin/grade/' + resId, { grade: d.grade, comment: d.comments || d.comment }); },
  getAllResults() { return this.get('/api/admin/mock-results'); },
};
