/* ============================================================
   ui.js – Premium shared UI utilities for student pages
   ============================================================ */

/* ── Toast ─────────────────────────────────────────── */
function toast(msg, type = 'info') {
  let dock = document.getElementById('toast-dock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'toast-dock';
    dock.className = 'toast-dock';
    document.body.appendChild(dock);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px">
      <div style="font-size:18px">${type === 'ok' ? '✓' : type === 'err' ? '✕' : 'ℹ'}</div>
      <div>${msg}</div>
    </div>`;
  dock.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px) scale(0.95)'; setTimeout(() => t.remove(), 400); }, 3500);
}

/* ── Modal helpers ─────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── Accordion ─────────────────────────────────────── */
function toggleAcc(btn) {
  const body = btn.nextElementSibling;
  const icon = btn.querySelector('.acc-icon');
  const open = body.classList.contains('on');

  // Close others if single-open preferred (optional)
  btn.classList.toggle('on', !open);
  body.classList.toggle('on', !open);
  if (icon) icon.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
}

/* ── Tabs ──────────────────────────────────────────── */
function switchTab(group, name) {
  document.querySelectorAll(`[data-tabgroup="${group}"]`).forEach(el => {
    const t = el.dataset.tab;
    el.classList.toggle('on', t === name);
  });
}

/* ── Semester progress ─────────────────────────────── */
function semesterPct() {
  const start = new Date('2026-02-23T00:00:00');
  const end = new Date('2026-06-07T23:59:59');
  const now = new Date();
  if (now < start) return 0;
  if (now > end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

function buildSemBlock(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const pct = semesterPct();

  const now = new Date();
  const semStart = new Date('2026-02-23T00:00:00');
  const vacStart = new Date('2026-04-13T00:00:00');
  const vacEnd = new Date('2026-04-19T23:59:59');

  let activeWeek = 1;
  if (now > semStart) {
    let ms = now.getTime() - semStart.getTime();
    if (now > vacEnd) ms -= (7 * 86400000);
    activeWeek = Math.max(1, Math.min(14, Math.ceil(ms / (7 * 86400000))));
  }

  el.innerHTML = `
  <div class="sem-prog fade2">
    <div class="sem-hd">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="brand-mark" style="width:30px;height:30px;font-size:12px;box-shadow:none">∫</div>
        <span class="sem-title">Progresul Semestrului 2</span>
      </div>
      <span class="sem-pct">${pct}%</span>
    </div>
    <div class="prog-wrap"><div class="prog-fill" style="width:${pct}%"></div></div>
    <div class="sem-sub">
      <span>Februarie 2026</span>
      <span style="font-weight:700;color:var(--accent)">Săptămâna ${activeWeek} din 14</span>
      <span>Iunie 2026</span>
    </div>
  </div>`;
}

/* ── Footer ────────────────────────────────────────── */
function buildFooter(containerId = 'footer') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
  <div style="display:flex;flex-direction:column;gap:10px">
    <div style="font-family:var(--font-hd);font-weight:700;color:var(--text-main);font-size:14px">Matematici Speciale</div>
    <span>© 2025–2026 · Facultatea de Matematică și Informatică · Seria 16</span>
  </div>
  <div class="ft-links">
    <a href="https://www.unibuc.ro" target="_blank">UniBuc</a>
    <a href="https://fmi.unibuc.ro" target="_blank">FMI</a>
    <a href="https://www.devcore-enterprise.site" target="_blank">DevCore</a>
  </div>`;
}

/* ── Premium Sidebar ──────────────────────────────── */
const NAV = [
  {
    section: 'General', items: [
      { label: 'Acasă', href: 'index.html', icon: '<i data-lucide="home" style="width:18px;height:18px;"></i>' },
      { label: 'Anunțuri', href: 'anunturi.html', icon: '<i data-lucide="bell" style="width:18px;height:18px;"></i>' },
    ]
  },
  {
    section: 'Resurse Curs', items: [
      { label: 'Materiale', href: 'materiale.html', icon: '<i data-lucide="folder" style="width:18px;height:18px;"></i>' },
      { label: 'Syllabus', href: 'syllabus.html', icon: '<i data-lucide="book-open" style="width:18px;height:18px;"></i>' },
      { label: 'Calendar', href: 'calendar.html', icon: '<i data-lucide="calendar" style="width:18px;height:18px;"></i>' },
      { label: 'Evaluare', href: 'evaluare.html', icon: '<i data-lucide="bar-chart-2" style="width:18px;height:18px;"></i>' },
      { label: 'Examen', href: 'examen.html', icon: '<i data-lucide="file-text" style="width:18px;height:18px;"></i>' },
    ]
  },
  {
    section: 'Platformă', items: [
      { label: 'Mock-Exam', href: 'mock-exam.html', icon: '<i data-lucide="target" style="width:18px;height:18px;"></i>' },
      { label: 'Contul meu', href: 'conturi.html', icon: '<i data-lucide="user" style="width:18px;height:18px;"></i>' },
      { label: 'Grafice', href: 'graph.html', icon: '<i data-lucide="line-chart" style="width:18px;height:18px;"></i>' },
    ]
  },
  {
    section: 'Altele', items: [
      { label: 'FAQ', href: 'faq.html', icon: '<i data-lucide="help-circle" style="width:18px;height:18px;"></i>' },
      { label: 'Feedback', href: 'feedback.html', icon: '<i data-lucide="message-square" style="width:18px;height:18px;"></i>' },
      { label: 'Contact', href: 'contact.html', icon: '<i data-lucide="mail" style="width:18px;height:18px;"></i>' },
    ]
  },
];

function buildSidebar(active) {
  const user = API.currentUser();

  let navHtml = '';
  NAV.forEach(sec => {
    navHtml += `<div class="nav-section">${sec.section}</div>`;
    sec.items.forEach(it => {
      navHtml += `<a class="nav-item${active === it.href ? ' active' : ''}" href="${it.href}">
        <i class="nav-icon">${it.icon}</i><span>${it.label}</span></a>`;
    });
  });

  if (user?.role === 'admin') {
    navHtml += `<div class="nav-section">Administrare</div>
      <a class="nav-item" href="${window.MS_CONFIG?.adminBase ?? 'https://dashboard.matematicispeciale.site'}" target="_blank">
        <i class="nav-icon"><i data-lucide="settings" style="width:18px;height:18px;"></i></i><span>Dashboard Admin</span></a>`;
  }

  let footHtml = '';
  if (user) {
    footHtml = `
      <div class="user-row">
        <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-role">${user.role === 'admin' ? 'Administrator' : 'Student CTI'}</div>
        </div>
      </div>
      <button class="logout-btn" onclick="API.logout()">Ieșire din cont</button>`;
  } else {
    footHtml = `<button class="btn btn-primary" style="width:100%" onclick="openModal('auth-modal')">Autentificare</button>`;
  }

  const html = `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div class="brand-mark">∫</div>
      <div class="brand-text">
        <div class="brand-title">Matematici Speciale</div>
        <div class="brand-sub">Seria 16 · FMI UB</div>
      </div>
    </div>
    <nav class="nav-body">${navHtml}</nav>
    <div class="sidebar-foot">${footHtml}</div>
  </aside>
  <div class="overlay" id="overlay" onclick="closeSidebar()"></div>`;
  document.body.insertAdjacentHTML('afterbegin', html);
}

function buildTopbar(title, sub = '') {
  return `<div class="topbar">
    <button class="mobile-toggle" onclick="toggleSidebar()">☰</button>
    <div style="flex:1">
      <div class="topbar-title">${title}</div>
      ${sub ? `<div class="topbar-sub">${sub}</div>` : ''}
    </div>
    <div style="display:flex;gap:12px;align-items:center">
      ${!API.isLoggedIn() ? `<button class="btn btn-secondary btn-sm" onclick="openModal('auth-modal')">Autentificare</button>` : ''}
    </div>
  </div>`;
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('overlay')?.classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('open');
}

/* ── Auth modal ────────────────────── */
function injectAuthModal() {
  const html = `
  <div class="modal-bg" id="auth-modal" onclick="if(event.target===this)closeModal('auth-modal')">
    <div class="modal">
      <div class="modal-hd">
        <span class="modal-title" id="auth-modal-title">Acces Platformă</span>
        <button class="modal-close" onclick="closeModal('auth-modal')">✕</button>
      </div>
      <div class="tabs" style="margin-bottom:24px">
        <button class="tab on" data-tabgroup="auth" data-tab="login" onclick="switchTab('auth','login')">Autentificare</button>
        <button class="tab" data-tabgroup="auth" data-tab="reg" onclick="switchTab('auth','reg')">Creează Cont</button>
      </div>
      <div class="tab-panel on" data-tabgroup="auth" data-tab="login">
        <div class="form-group"><label class="form-label">Email Instituțional</label>
          <input id="li-email" type="email" class="form-input" placeholder="nume@s.unibuc.ro" /></div>
        <div class="form-group"><label class="form-label">Parolă</label>
          <input id="li-pass" type="password" class="form-input" placeholder="••••••••" /></div>
        <div id="li-err" class="form-error" style="display:none;margin:12px 0"></div>
        <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="doLogin()">Conectare Securizată</button>
      </div>
      <div class="tab-panel" data-tabgroup="auth" data-tab="reg">
        <div class="form-group"><label class="form-label">Nume Complet</label>
          <input id="rg-name" type="text" class="form-input" placeholder="Ion Popescu" /></div>
        <div class="form-group"><label class="form-label">Email</label>
          <input id="rg-email" type="email" class="form-input" placeholder="nume@s.unibuc.ro" /></div>
        <div class="form-group"><label class="form-label">Parolă</label>
          <input id="rg-pass" type="password" class="form-input" placeholder="min. 6 caractere" /></div>
        <div id="rg-err" class="form-error" style="display:none;margin:12px 0"></div>
        <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="doRegister()">Creează Cont Student</button>
      </div>
    </div>
  </div>

  <!-- CHANGE PASSWORD MODAL (force reset) -->
  <div class="modal-bg" id="chpw-modal">
    <div class="modal">
      <div class="modal-hd">
        <span class="modal-title">Schimbă Parola</span>
      </div>
      <div style="background:rgba(234,179,8,.08);border:1px solid rgba(234,179,8,.3);border-radius:12px;padding:14px 16px;margin-bottom:20px;font-size:13px;color:var(--text-dim)">
        🔐 Contul tău a primit o parolă temporară. Trebuie să îți setezi o parolă nouă înainte de a continua.
      </div>
      <div class="form-group">
        <label class="form-label">Parolă Nouă</label>
        <input id="chpw-new" type="password" class="form-input" placeholder="min. 6 caractere" />
      </div>
      <div class="form-group">
        <label class="form-label">Confirmă Parola Nouă</label>
        <input id="chpw-confirm" type="password" class="form-input" placeholder="repetă parola" />
      </div>
      <div id="chpw-err" class="form-error" style="display:none;margin:12px 0"></div>
      <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="doChangePassword()">Salvează Parola Nouă</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

async function doLogin() {
  const btn = event.target;
  const oldText = btn.textContent;
  const email = document.getElementById('li-email').value.trim();
  const pass = document.getElementById('li-pass').value;
  const err = document.getElementById('li-err');
  try {
    err.style.display = 'none';
    btn.textContent = 'Se verifică...';
    btn.disabled = true;
    const u = await API.login(email, pass);
    closeModal('auth-modal');
    if (API.mustChangePassword()) {
      openModal('chpw-modal');
    } else {
      toast(`Bine ai revenit, ${u.name}!`, 'ok');
      setTimeout(() => location.reload(), 800);
    }
  } catch (e) {
    err.textContent = e.message;
    err.style.display = 'block';
    btn.textContent = oldText;
    btn.disabled = false;
  }
}

async function doRegister() {
  const btn = event.target;
  const oldText = btn.textContent;
  const name = document.getElementById('rg-name').value.trim();
  const email = document.getElementById('rg-email').value.trim();
  const pass = document.getElementById('rg-pass').value;
  const err = document.getElementById('rg-err');

  try {
    err.style.display = 'none';
    if (!name || !email || !pass) throw new Error('Toate câmpurile sunt obligatorii.');
    if (pass.length < 6) throw new Error('Parola trebuie să aibă min. 6 caractere.');

    btn.textContent = 'Se creează contul...';
    btn.disabled = true;

    // Apelăm API-ul
    const response = await API.register(name, email, pass);

    // Închidem modalul
    closeModal('auth-modal');

    // Afișăm mesajul de succes primit de la server ("Cont creat! Așteaptă aprobarea...")
    toast(response.message || 'Cont creat! Așteaptă aprobarea administratorului.', 'info');

    // Opțional: Curățăm câmpurile formularului pentru viitor
    document.getElementById('rg-name').value = '';
    document.getElementById('rg-email').value = '';
    document.getElementById('rg-pass').value = '';

  } catch (e) {
    err.textContent = e.message;
    err.style.display = 'block';
  } finally {
    btn.textContent = oldText;
    btn.disabled = false;
  }
}

async function doChangePassword() {
  const btn = event.target;
  const oldText = btn.textContent;
  const newPw = document.getElementById('chpw-new').value;
  const confirm = document.getElementById('chpw-confirm').value;
  const err = document.getElementById('chpw-err');
  try {
    err.style.display = 'none';
    if (!newPw || newPw.length < 6) throw new Error('Parola trebuie să aibă cel puțin 6 caractere.');
    if (newPw !== confirm) throw new Error('Parolele nu coincid.');
    btn.textContent = 'Se salvează...';
    btn.disabled = true;
    await API.changePassword(newPw);
    localStorage.removeItem('ms_fpr');
    closeModal('chpw-modal');
    toast('Parolă actualizată cu succes! Bine ai venit!', 'ok');
    setTimeout(() => location.reload(), 900);
  } catch (e) {
    err.textContent = e.message;
    err.style.display = 'block';
    btn.textContent = oldText;
    btn.disabled = false;
  }
}

/* ── Page init helper ──────────────────────────────── */
function initPage({ title, sub = '', active, footerId = 'footer' } = {}) {
  buildSidebar(active);
  injectAuthModal();
  const tb = document.getElementById('topbar');
  if (tb) tb.innerHTML = buildTopbar(title, sub);
  buildFooter(footerId);
  document.addEventListener('DOMContentLoaded', () => {
    if (API.isLoggedIn()) {
      API.me().then(() => {
        if (API.mustChangePassword()) openModal('chpw-modal');
      });
    }
  });

  // Inject Lucide icons
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/lucide@latest';
  script.onload = () => lucide.createIcons();
  document.head.appendChild(script);
}
