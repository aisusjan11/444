function getToken() {
  return localStorage.getItem('jwt_token') || '';
}

function setToken(token) {
  localStorage.setItem('jwt_token', token);
}

function clearToken() {
  localStorage.removeItem('jwt_token');
}

async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || 'Request failed';
    const details = data?.details ? `\n- ${data.details.join('\n- ')}` : '';
    throw new Error(`${res.status} ${msg}${details}`);
  }
  return data;
}

// ---------- Auth ----------
const tokenInput = document.getElementById('tokenInput');
const saveTokenBtn = document.getElementById('saveTokenBtn');
const clearTokenBtn = document.getElementById('clearTokenBtn');
const meBtn = document.getElementById('meBtn');
const meOut = document.getElementById('meOut');

function syncTokenUI() {
  tokenInput.value = getToken();
}
syncTokenUI();

saveTokenBtn.addEventListener('click', () => {
  const raw = tokenInput.value.trim();
  // allow user paste "Bearer xxx" or just token
  const token = raw.startsWith('Bearer ') ? raw.slice(7).trim() : raw;
  setToken(token);
  syncTokenUI();
});

clearTokenBtn.addEventListener('click', () => {
  clearToken();
  syncTokenUI();
  meOut.textContent = '{}';
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = {
      email: document.getElementById('regEmail').value,
      password: document.getElementById('regPassword').value,
      role: document.getElementById('regRole').value,
    };
    const data = await api('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    setToken(data.token);
    syncTokenUI();
    alert(`Registered: ${data.user.email} (${data.user.role})`);
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = {
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value,
    };
    const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    setToken(data.token);
    syncTokenUI();
    alert(`Logged in: ${data.user.email} (${data.user.role})`);
  } catch (err) {
    alert(err.message);
  }
});

meBtn.addEventListener('click', async () => {
  try {
    const data = await api('/api/auth/me');
    meOut.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    meOut.textContent = err.message;
  }
});

// ---------- Books ----------
const booksUl = document.getElementById('books');

async function loadBooks() {
  try {
    const books = await api('/api/books');
    booksUl.innerHTML = '';
    books.forEach((b) => {
      const li = document.createElement('li');
      li.textContent = `${b.title} — ${b.author} — ${b.price} (${b.category}) [${b._id}]`;
      booksUl.appendChild(li);
    });
  } catch (err) {
    booksUl.innerHTML = `<li>${err.message}</li>`;
  }
}

document.getElementById('refreshBooks').addEventListener('click', loadBooks);

document.getElementById('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      price: Number(document.getElementById('price').value),
      category: document.getElementById('category').value,
      inStock: document.getElementById('inStock').value === 'true',
    };
    await api('/api/books', { method: 'POST', body: JSON.stringify(payload) });
    e.target.reset();
    await loadBooks();
    alert('Book created (admin).');
  } catch (err) {
    alert(err.message);
  }
});

// ---------- Orders ----------
const ordersUl = document.getElementById('orders');

async function loadOrders() {
  try {
    const orders = await api('/api/orders');
    ordersUl.innerHTML = '';
    orders.forEach((o) => {
      const li = document.createElement('li');
      li.textContent = `${o.customerName} — ${o.status} — total: ${o.totalAmount} [${o._id}]`;
      ordersUl.appendChild(li);
    });
  } catch (err) {
    ordersUl.innerHTML = `<li>${err.message}</li>`;
  }
}

document.getElementById('refreshOrders').addEventListener('click', loadOrders);

document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = {
      customerName: document.getElementById('customerName').value,
      customerEmail: document.getElementById('customerEmail').value,
      items: [
        {
          bookId: document.getElementById('bookId').value,
          quantity: Number(document.getElementById('quantity').value),
        },
      ],
    };
    await api('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
    e.target.reset();
    await loadOrders();
    alert('Order created (admin).');
  } catch (err) {
    alert(err.message);
  }
});

// initial loads
loadBooks();
loadOrders();
