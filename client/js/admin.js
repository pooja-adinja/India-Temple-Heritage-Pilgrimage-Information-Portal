const API_URL = 'http://16.170.229.152:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        document.getElementById('loginSection').style.display   = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        fetchAdminTemples();
    } else {
        document.getElementById('loginSection').style.display   = 'block';
        document.getElementById('dashboardSection').style.display = 'none';
    }
}

// --- Auth ---
async function login() {
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errDiv   = document.getElementById('loginError');
    errDiv.style.display = 'none';

    if (!email || !password) {
        errDiv.innerText     = 'Please enter email and password.';
        errDiv.style.display = 'block';
        return;
    }

    try {
        const res  = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.role === 'admin') {
            localStorage.setItem('adminToken', data.token);
            checkAuth();
        } else if (res.ok && data.role !== 'admin') {
            errDiv.innerText     = 'Access denied. Admin accounts only.';
            errDiv.style.display = 'block';
        } else {
            errDiv.innerText     = data.message || 'Invalid credentials.';
            errDiv.style.display = 'block';
        }
    } catch (err) {
        errDiv.innerText     = 'Cannot connect to server. Make sure it is running.';
        errDiv.style.display = 'block';
    }
}

function adminLogout() {
    localStorage.removeItem('adminToken');
    checkAuth();
}

function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId + 'Tab').classList.add('active');
    if (btn) btn.classList.add('active');

    if (tabId === 'analytics') fetchKPIs();
    if (tabId === 'circuits')  { loadTempleSelector(); loadCircuitsList(); }
    if (tabId === 'temples')   fetchAdminTemples();
}

// --- Manage Temples ---
async function fetchAdminTemples() {
    const token = localStorage.getItem('adminToken');
    const list  = document.getElementById('adminTemplesList');
    list.innerHTML = '<p style="color:var(--text-muted);">Loading...</p>';

    try {
        const res     = await fetch(`${API_URL}/temples/admin/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            list.innerHTML = `<p style="color:red;">Error ${res.status}: ${res.statusText}. Check server.</p>`;
            return;
        }

        const temples = await res.json();

        if (!temples.length) {
            list.innerHTML = '<p style="color:var(--text-muted);">No temples found. Add some using the Add Temple tab.</p>';
            return;
        }

        list.innerHTML = temples.map(t => `
            <div class="temple-row" id="row-${t._id}">
                <div style="flex:1;">
                    <strong style="font-size:1rem;">${t.name}</strong>
                    <span style="color:var(--text-muted); margin-left:10px; font-size:0.85rem;">📍 ${t.city}, ${t.state}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span class="status-badge status-${t.status}">${t.status}</span>
                    ${t.status === 'pending'  ? `<button class="action-btn btn-approve" onclick="updateTempleStatus('${t._id}', 'approved')">✅ Approve</button>` : ''}
                    ${t.status === 'approved' ? `<button class="action-btn btn-reject"  onclick="updateTempleStatus('${t._id}', 'rejected')">❌ Reject</button>`  : ''}
                    ${t.status === 'rejected' ? `<button class="action-btn btn-approve" onclick="updateTempleStatus('${t._id}', 'approved')">✅ Approve</button>` : ''}
                    <button class="action-btn btn-delete" onclick="deleteTemple('${t._id}')">🗑 Delete</button>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error(err);
        list.innerHTML = '<p style="color:red;">Failed to load temples. Is the server running?</p>';
    }
}

async function updateTempleStatus(id, status) {
    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(`${API_URL}/temples/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            fetchAdminTemples();
        } else {
            const err = await res.json();
            alert('Error: ' + (err.message || 'Could not update status.'));
        }
    } catch (err) {
        console.error(err);
        alert('Server error updating status.');
    }
}

async function deleteTemple(id) {
    if (!confirm('Delete this temple permanently? This cannot be undone.')) return;
    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(`${API_URL}/temples/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const row = document.getElementById('row-' + id);
            if (row) row.remove();
        } else {
            alert('Error deleting temple.');
        }
    } catch (err) {
        console.error(err);
        alert('Server error deleting temple.');
    }
}

// --- Add Temple ---
async function addTemple(e) {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const msgEl = document.getElementById('addTempleMsg');
    const btn   = e.submitter || document.querySelector('#addTempleForm button[type="submit"]');

    msgEl.style.display = 'none';
    btn.disabled        = true;
    btn.innerText       = 'Adding...';

    const deityVal = document.getElementById('tDeity').value.trim();
    const data = {
        name:              document.getElementById('tName').value.trim(),
        city:              document.getElementById('tCity').value.trim(),
        state:             document.getElementById('tState').value.trim(),
        deities:           deityVal ? deityVal.split(',').map(d => d.trim()) : [],
        darshanTimings:    document.getElementById('tTimings').value.trim(),
        dressCode:         document.getElementById('tDressCode').value.trim(),
        history:           document.getElementById('tHistory').value.trim(),
        visitorGuidelines: document.getElementById('tGuidelines').value.trim(),
        nearbyFacilities:  document.getElementById('tFacilities').value.trim(),
        isFeatured:        document.getElementById('tFeatured').checked,
        status:            'approved'
    };

    const lat = document.getElementById('addLat').value;
    const lng = document.getElementById('addLng').value;
    if (lat && lng) {
        data.location = {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
        };
    }

    try {
        const res = await fetch(`${API_URL}/temples`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            msgEl.innerText     = '✅ Temple added and approved successfully!';
            msgEl.style.color   = '#4caf50';
            msgEl.style.display = 'block';
            document.getElementById('addTempleForm').reset();
            setTimeout(() => { msgEl.style.display = 'none'; }, 4000);
        } else {
            const err           = await res.json();
            msgEl.innerText     = '❌ Error: ' + (err.message || 'Could not add temple.');
            msgEl.style.color   = '#ff6b6b';
            msgEl.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        msgEl.innerText     = '❌ Server error. Is the server running?';
        msgEl.style.color   = '#ff6b6b';
        msgEl.style.display = 'block';
    }

    btn.disabled  = false;
    btn.innerText = 'Add Temple';
}

// --- Circuits ---
let selectedTempleIds = [];

async function loadTempleSelector() {
    try {
        const res     = await fetch(`${API_URL}/temples`);
        const temples = await res.json();
        const selector = document.getElementById('templeSelector');
        if (!selector) return;

        if (!temples.length) {
            selector.innerHTML = '<p style="color:var(--text-muted);">No approved temples found.</p>';
            return;
        }

        selector.innerHTML = temples.map(t => `
            <div class="temple-chip" data-id="${t._id}" onclick="toggleTempleChip(this, '${t._id}')">
                <div style="font-weight:600;">${t.name}</div>
                <div style="color:var(--text-muted); font-size:0.75rem;">${t.city}, ${t.state}</div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading temple selector:', err);
    }
}

function toggleTempleChip(el, id) {
    const idx = selectedTempleIds.indexOf(id);
    if (idx === -1) {
        selectedTempleIds.push(id);
        el.classList.add('selected');
    } else {
        selectedTempleIds.splice(idx, 1);
        el.classList.remove('selected');
    }
    const countEl = document.getElementById('selectedCount');
    if (countEl) countEl.innerText = `${selectedTempleIds.length} temple${selectedTempleIds.length !== 1 ? 's' : ''} selected`;
}

async function loadCircuitsList() {
    try {
        const res      = await fetch(`${API_URL}/circuits`);
        const circuits = await res.json();
        const el       = document.getElementById('circuitsList');
        if (!el) return;

        if (!circuits.length) {
            el.innerHTML = '<p style="color:var(--text-muted);">No circuits created yet.</p>';
            return;
        }

        el.innerHTML = circuits.map(c => `
            <div id="circuit-${c._id}" style="border:1px solid var(--glass-border); border-radius:8px; padding:15px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div>
                        <strong style="color:var(--gold-main); font-size:1.1rem;">${c.name}</strong>
                        <span style="margin-left:10px; color:var(--teal-light); font-size:0.85rem;">${c.region || ''}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background:rgba(212,175,55,0.15); color:var(--gold-main); border:1px solid var(--gold-main); border-radius:20px; padding:2px 12px; font-size:0.8rem;">
                            ${c.temples.length} temple${c.temples.length !== 1 ? 's' : ''}
                        </span>
                        <button onclick="deleteCircuit('${c._id}')" style="background:rgba(255,107,107,0.2); color:#ff6b6b; border:1px solid #ff6b6b; border-radius:6px; padding:4px 12px; cursor:pointer; font-size:0.8rem;">
                            🗑 Delete
                        </button>
                    </div>
                </div>
                <p style="color:var(--text-muted); margin-top:8px; font-size:0.9rem;">${c.description}</p>
                ${c.temples.length ? `
                    <div style="margin-top:8px; display:flex; flex-wrap:wrap; gap:6px;">
                        ${c.temples.map(t => `
                            <span style="background:rgba(100,200,180,0.1); color:var(--teal-light); border:1px solid var(--teal-light); border-radius:20px; padding:2px 10px; font-size:0.75rem;">
                                ${t.name || t}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading circuits:', err);
    }
}

async function addCircuit(e) {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const data  = {
        name:        document.getElementById('cName').value,
        description: document.getElementById('cDesc').value,
        region:      document.getElementById('cRegion').value,
        temples:     selectedTempleIds
    };

    try {
        const res = await fetch(`${API_URL}/circuits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert(`Circuit created with ${selectedTempleIds.length} temples!`);
            document.getElementById('addCircuitForm').reset();
            selectedTempleIds = [];
            document.querySelectorAll('.temple-chip').forEach(c => c.classList.remove('selected'));
            document.getElementById('selectedCount').innerText = '0 temples selected';
            loadCircuitsList();
        } else {
            const err = await res.json();
            alert('Error: ' + (err.message || 'Could not create circuit.'));
        }
    } catch (err) {
        alert('Server error creating circuit.');
    }
}

async function deleteCircuit(id) {
    if (!confirm('Delete this circuit? This cannot be undone.')) return;
    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(`${API_URL}/circuits/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const el = document.getElementById('circuit-' + id);
            if (el) el.remove();
        } else {
            alert('Error deleting circuit.');
        }
    } catch (err) {
        alert('Server error deleting circuit.');
    }
}

// --- Analytics ---
async function fetchKPIs() {
    const token = localStorage.getItem('adminToken');
    const grid  = document.getElementById('kpiGrid');
    grid.innerHTML = '<p style="color:var(--text-muted);">Loading...</p>';

    try {
        const res  = await fetch(`${API_URL}/analytics/kpis`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        grid.innerHTML = `
            <div class="glass-panel kpi-card">
                <div class="kpi-number">${data.totalTemples    || 0}</div>
                <div class="kpi-label">Total Temples</div>
            </div>
            <div class="glass-panel kpi-card">
                <div class="kpi-number">${data.approvedTemples || 0}</div>
                <div class="kpi-label">Approved Temples</div>
            </div>
            <div class="glass-panel kpi-card">
                <div class="kpi-number">${data.pendingTemples  || 0}</div>
                <div class="kpi-label">Pending Approval</div>
            </div>
            <div class="glass-panel kpi-card">
                <div class="kpi-number">${data.totalUsers      || 0}</div>
                <div class="kpi-label">Registered Users</div>
            </div>
            <div class="glass-panel kpi-card">
                <div class="kpi-number">${data.totalCircuits   || 0}</div>
                <div class="kpi-label">Pilgrimage Circuits</div>
            </div>
            <div class="glass-panel kpi-card">
                <div class="kpi-number">${data.totalSaves      || 0}</div>
                <div class="kpi-label">Total Temple Saves</div>
            </div>
            <div class="glass-panel kpi-card">
                <div class="kpi-number">${data.avgRating || 'N/A'}</div>
                <div class="kpi-label">Avg Temple Rating</div>
            </div>
        `;
    } catch (err) {
        grid.innerHTML = '<p style="color:var(--text-muted);">Could not load analytics.</p>';
    }
}