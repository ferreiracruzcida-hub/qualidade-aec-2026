// ==========================================================
// CONFIGURAÇÃO — cole aqui a URL do Apps Script após publicar
// ==========================================================
const API_URL = "https://script.google.com/macros/s/AKfycbyBwEqWlThjdvoVPAA0AEyAEmgAiOXodmb3WmPCmGi2l3OSOML4-wKBiykyWQk9u3tfpA/exec";

// ---------------- API ----------------
async function callApi(action, params = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...params })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'Erro desconhecido no servidor.');
  return json.data;
}

// ---------------- Sessão (aba/janela do navegador) ----------------
function getSession() {
  const raw = sessionStorage.getItem('qaec_session');
  return raw ? JSON.parse(raw) : null;
}

function setSession(session) {
  sessionStorage.setItem('qaec_session', JSON.stringify(session));
}

function requireSession(adminOnly = false) {
  const s = getSession();
  if (!s) { window.location.href = 'index.html'; return null; }
  if (adminOnly && !s.isAdmin) { window.location.href = 'index.html'; return null; }
  return s;
}

function logout() {
  sessionStorage.removeItem('qaec_session');
  window.location.href = 'index.html';
}

function renderSessionBar() {
  const s = getSession();
  const el = document.getElementById('sessionBar');
  if (!el || !s) return;
  el.innerHTML = `${s.nome}${s.isAdmin ? ' · admin' : ''} <button onclick="logout()">Sair</button>`;
}

// ---------------- Helpers visuais ----------------
const CONTA_COLORS = {
  'GOL': 'var(--conta-gol)',
  'TON': 'var(--conta-ton)',
  'Porto': 'var(--conta-porto)',
  'Carrefour Varejo': 'var(--conta-varejo)',
  "Sam's Club": 'var(--conta-sams)',
  'Carrefour Banco': 'var(--conta-banco)',
  'Stone': 'var(--conta-stone)'
};

function contaTagHtml(conta) {
  const color = CONTA_COLORS[conta] || '#94a3b8';
  return `<span class="conta-tag"><span class="conta-dot" style="background:${color}"></span>${conta}</span>`;
}

const STATUS_CLASS = {
  'Não iniciado': 'st-nao-iniciado',
  'Em andamento': 'st-em-andamento',
  'Concluído': 'st-concluido',
  'Em risco': 'st-em-risco'
};

function statusPillHtml(status) {
  const cls = STATUS_CLASS[status] || 'st-nao-iniciado';
  return `<span class="status-pill ${cls}"><span class="status-dot"></span>${status || 'Não iniciado'}</span>`;
}

function showMsg(elId, text, ok = true) {
  const el = document.getElementById(elId);
  el.textContent = text;
  el.className = 'msg ' + (ok ? 'ok' : 'err');
}

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString('pt-BR');
}

function currentMonthRef() {
  const now = new Date();
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${meses[now.getMonth()]}/${now.getFullYear()}`;
}
