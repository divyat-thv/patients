// ================================================
//  AYUSHMAN PATIENT MGMT — auth.js
//  Uses localStorage for GitHub Pages (no backend)
// ================================================

const AUTH_KEY = 'ayushman_users';
const SESS_KEY = 'ayushman_session';

function getUsers()     { return JSON.parse(localStorage.getItem(AUTH_KEY) || '[]'); }
function saveUsers(u)   { localStorage.setItem(AUTH_KEY, JSON.stringify(u)); }
function getSession()   { return JSON.parse(sessionStorage.getItem(SESS_KEY) || 'null'); }
function setSession(u)  { sessionStorage.setItem(SESS_KEY, JSON.stringify(u)); }
function clearSession() { sessionStorage.removeItem(SESS_KEY); }

function registerUser({ name, email, password, phone, clinic, city, specialisation }) {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return { ok: false, error: 'An account with this email already exists.' };
  const user = {
    id: 'usr_' + Date.now(),
    name, email: email.toLowerCase(),
    password: btoa(password),
    phone, clinic, city, specialisation,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}

function loginUser(email, password) {
  const users = getUsers();
  const user  = users.find(u => u.email === email.toLowerCase());
  if (!user)                        return { ok: false, error: 'No account found with this email.' };
  if (user.password !== btoa(password)) return { ok: false, error: 'Incorrect password. Please try again.' };
  const { password: _, ...safe } = user;
  setSession(safe);
  return { ok: true, user: safe };
}

function requireAuth() {
  const s = getSession();
  if (!s) { window.location.href = rootPath() + 'login.html'; return null; }
  return s;
}

function requireGuest() {
  if (getSession()) window.location.href = rootPath() + 'index.html';
}

function logout() {
  clearSession();
  window.location.href = rootPath() + 'login.html';
}

function rootPath() {
  return location.pathname.includes('/pages/') ? '../' : './';
}

window.Auth = { registerUser, loginUser, requireAuth, requireGuest, logout, getSession };
