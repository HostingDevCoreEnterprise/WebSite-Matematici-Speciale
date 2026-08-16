/* ============================================================
   admin-ui.js – Premium shared UI utilities for admin dashboard
   ============================================================ */

function injectChangePasswordModal() {
  const html = `
  <div class="modal-bg" id="chpw-modal" style="z-index: 10000">
    <div class="modal">
      <div class="modal-hd">
        <span class="modal-title">Securitate: Schimbă Parola</span>
      </div>
      <div style="background:rgba(234,179,8,.08); border:1px solid rgba(234,179,8,.3); border-radius:12px; padding:14px; margin-bottom:20px; font-size:13px; color:var(--text-dim)">
        ⚠️ Parola ta a fost resetată de sistem. Te rugăm să îți alegi o parolă nouă, personală, pentru a securiza accesul la consola admin.
      </div>
      <div class="form-group">
        <label class="form-label">Parolă Nouă</label>
        <input id="adm-chpw-new" type="password" class="form-input" placeholder="min. 6 caractere" />
      </div>
      <div class="form-group">
        <label class="form-label">Confirmă Parola</label>
        <input id="adm-chpw-confirm" type="password" class="form-input" placeholder="repetă parola" />
      </div>
      <div id="adm-chpw-err" class="form-error" style="display:none; margin:12px 0"></div>
      <button class="btn btn-primary" style="width:100%; margin-top:10px" onclick="doAdminChangePassword()">Actualizează și Continuă</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

async function doAdminChangePassword() {
  const btn = event.target;
  const newPw = document.getElementById('adm-chpw-new').value;
  const confirm = document.getElementById('adm-chpw-confirm').value;
  const err = document.getElementById('adm-chpw-err');

  try {
    err.style.display = 'none';
    if (!newPw || newPw.length < 6) throw new Error('Parola trebuie să aibă cel puțin 6 caractere.');
    if (newPw !== confirm) throw new Error('Parolele nu coincid.');

    btn.disabled = true;
    btn.textContent = 'Se salvează...';

    await API.changePassword(newPw); //
    localStorage.removeItem('ms_fpr'); //

    toast('Parola de administrator a fost actualizată!', 'ok'); //
    setTimeout(() => location.reload(), 1000);
  } catch (e) {
    err.textContent = e.message;
    err.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Actualizează și Continuă';
  }
}
function toast(msg, type = 'info') {
  let dock = document.getElementById('toast-dock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'toast-dock'; dock.className = 'toast-dock';
    document.body.appendChild(dock);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px">
      <div style="font-size:18px">${type === 'ok' ? '✓' : 'ℹ'}</div>
      <div>${msg}</div>
    </div>`;
  dock.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px) scale(0.95)'; setTimeout(() => t.remove(), 400); }, 3500);
}

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

const NAV = [
  { label: 'Utilizatori & Note', href: 'index.html', icon: '<i data-lucide="users" style="width:18px;height:18px;"></i>' },
  { label: 'Management Materiale', href: 'materiale.html', icon: '<i data-lucide="folder-open" style="width:18px;height:18px;"></i>' },
  { label: 'Subiecte Mock-Exam', href: 'subiecte.html', icon: '<i data-lucide="pen-tool" style="width:18px;height:18px;"></i>' },
  { label: 'Gestiune Anunțuri', href: 'anunturi.html', icon: '<i data-lucide="radio" style="width:18px;height:18px;"></i>' },
  { label: 'Site Studenți', href: 'https://matematicispeciale.site', icon: '<i data-lucide="external-link" style="width:18px;height:18px;"></i>', ext: true },
];

function buildSidebar(active) {
  const user = API.currentUser();
  let navHtml = NAV.map(it => `
    <a class="nav-item${active === it.href ? ' active' : ''}" href="${it.href}" ${it.ext ? 'target="_blank"' : ''}>
      <i class="nav-icon">${it.icon}</i><span>${it.label}</span>
    </a>`).join('');

  const html = `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div class="brand-mark" style="background:linear-gradient(135deg, var(--gold), #b45309)">⚙️</div>
      <div class="brand-text">
        <div class="brand-title">Admin Console</div>
        <div class="brand-sub">Matematici Speciale</div>
      </div>
    </div>
    <nav class="nav-body" style="padding-top:20px">${navHtml}</nav>
    <div class="sidebar-foot">
      <div class="user-row">
        <div class="user-avatar" style="background:linear-gradient(135deg, var(--gold), #fbbf24)">${user?.name?.charAt(0) || 'A'}</div>
        <div class="user-info">
          <div class="user-name">${user?.name || 'Administrator'}</div>
          <div class="user-role">Sistem Central</div>
        </div>
      </div>
      <button class="logout-btn" onclick="API.logout()" style="background:rgba(255,255,255,0.05);color:var(--text-dim);border:1px solid var(--border)">Ieșire Securizată</button>
    </div>
  </aside>
  <div class="overlay" id="overlay" onclick="toggleSidebar()"></div>`;
  document.body.insertAdjacentHTML('afterbegin', html);
}

function buildTopbar(title) {
  return `<div class="topbar">
    <button class="mobile-toggle" onclick="toggleSidebar()">☰</button>
    <div class="topbar-title" style="font-family:var(--font-hd);letter-spacing:-0.01em">${title}</div>
    <div style="flex:1"></div>
    <div style="font-size:11px;color:var(--text-mute);font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Sesiune Admin Activă</div>
  </div>`;
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('overlay')?.classList.toggle('open');
}

function initPage(title, active) {
  if (!API.isLoggedIn() && active !== 'login') { window.location.href = 'index.html'; return; }
  buildSidebar(active);
  injectChangePasswordModal(); // Injectăm modalul pe orice pagină de admin
  const tb = document.getElementById('topbar');
  if (tb) tb.innerHTML = buildTopbar(title);
  
  // Inject Lucide icons
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/lucide@latest';
  script.onload = () => lucide.createIcons();
  document.head.appendChild(script);

  // Dacă flag-ul de resetare este activ, forțăm deschiderea modalului
  if (API.isLoggedIn() && API.mustChangePassword()) {
    openModal('chpw-modal');
  }
  const foot = document.getElementById('footer');
  if (foot) {
    foot.style.borderTop = '1px solid var(--border)';
    foot.style.padding = '20px 60px';
    foot.innerHTML = `<span style="font-size:11px;color:var(--text-mute)">Consola de Administrare · Matematici Speciale Portal</span>`;
  }
}
