// ================================================
//  AYUSHMAN PATIENT MGMT — app.js (shared nav)
// ================================================

function initNav(activePage) {
  const user = Auth.getSession();
  if (!user) return;

  const root = location.pathname.includes('/pages/') ? '../' : './';

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard',      href: root + 'index.html' },
    { id: 'add',       icon: '➕', label: 'Add Patient',    href: root + 'pages/add-patient.html' },
    { id: 'patients',  icon: '👥', label: 'All Patients',   href: root + 'pages/all-patients.html' },
    { id: 'search',    icon: '🔍', label: 'Search Patient', href: root + 'pages/search-patient.html' },
  ];

  document.getElementById('topbarTitle').textContent = user.clinic || 'Ayushman Bhava';
  document.getElementById('topbarUser').textContent  = user.name   || user.email;

  const drawerNav = document.getElementById('drawerNav');
  const linksHTML = navItems.map(n => `
    <a href="${n.href}" class="drawer-link ${n.id === activePage ? 'active' : ''}">
      <span class="icon">${n.icon}</span>${n.label}
    </a>
  `).join('');

  drawerNav.innerHTML = `
    <span class="drawer-section-label">Menu</span>
    ${linksHTML}
    <div class="drawer-logout">
      <button onclick="Auth.logout()">🚪 Logout (${escHtml(user.name || user.email)})</button>
    </div>
  `;

  const btn     = document.getElementById('hamburgerBtn');
  const drawer  = document.getElementById('drawerNav');
  const overlay = document.getElementById('drawerOverlay');

  function openDrawer()  { drawer.classList.add('open');  overlay.classList.add('show'); }
  function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('show'); }

  btn.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  overlay.addEventListener('click', closeDrawer);
}

function escHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

function fmtDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

function ageFromDob(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

window.initNav     = initNav;
window.escHtml     = escHtml;
window.fmtDate     = fmtDate;
window.fmtDateTime = fmtDateTime;
window.ageFromDob  = ageFromDob;
