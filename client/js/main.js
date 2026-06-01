const API_URL = 'http://localhost:5000/api';

// --- Shared Utility Functions ---

async function fetchFeaturedTemples() {
    try {
        const res = await fetch(`${API_URL}/temples/featured`);
        const temples = await res.json();
        const grid = document.getElementById('featuredGrid');
        if (temples.length === 0) {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No featured temples found.</p>';
            return;
        }
        grid.innerHTML = temples.map(t => createTempleCard(t)).join('');
    } catch (error) {
        console.error("Error fetching featured temples:", error);
    }
}

async function fetchCircuits() {
    try {
        const res = await fetch(`${API_URL}/circuits`);
        const circuits = await res.json();
        const grid = document.getElementById('circuitsGrid');
        if (circuits.length === 0) {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No circuits found.</p>';
            return;
        }
        grid.innerHTML = circuits.map(c =>
            '<div class="glass-panel" onclick="openCircuitModal(\'' + c._id + '\')" style="cursor:pointer; transition:transform 0.2s, box-shadow 0.2s;" ' +
            'onmouseover="this.style.transform=\'translateY(-4px)\'; this.style.boxShadow=\'0 8px 30px rgba(212,175,55,0.2)\'" ' +
            'onmouseout="this.style.transform=\'\'; this.style.boxShadow=\'\'">' +
            '<h3 style="color:var(--gold-main);">' + c.name + '</h3>' +
            '<p style="color:var(--teal-light); margin-bottom:10px;">' + (c.region || '') + '</p>' +
            '<p style="color:var(--text-muted); margin-bottom:15px;">' + c.description + '</p>' +
            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
            '<span style="font-size:0.9rem; color:var(--text-muted);">🛕 ' + c.temples.length + ' temple' + (c.temples.length !== 1 ? 's' : '') + '</span>' +
            '<span style="color:var(--gold-main); font-size:0.85rem; font-weight:600;">View Temples →</span>' +
            '</div></div>'
        ).join('');
    } catch (error) {
        console.error("Error fetching circuits:", error);
    }
}

async function openCircuitModal(circuitId) {
    const modal = document.getElementById('circuitModal');
    if (!modal) return;

    document.getElementById('modalTemplesList').innerHTML = '<p style="color:var(--text-muted);">Loading temples...</p>';
    document.getElementById('modalCircuitName').innerText  = '';
    document.getElementById('modalCircuitRegion').innerText = '';
    document.getElementById('modalCircuitDesc').innerText  = '';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    try {
        const res      = await fetch(`${API_URL}/circuits`);
        const circuits = await res.json();
        const circuit  = circuits.find(c => c._id === circuitId);
        if (!circuit) return;

        document.getElementById('modalCircuitName').innerText   = circuit.name;
        document.getElementById('modalCircuitRegion').innerText = circuit.region || '';
        document.getElementById('modalCircuitDesc').innerText   = circuit.description;

        const list = document.getElementById('modalTemplesList');

        if (!circuit.temples || circuit.temples.length === 0) {
            list.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:30px; color:var(--text-muted);"><div style="font-size:2.5rem; margin-bottom:10px;">🛕</div><p>No temples linked to this circuit yet.</p><p style="font-size:0.85rem; margin-top:8px;">Admin can add temples via the Manage Circuits panel.</p></div>';
            return;
        }

        list.innerHTML = circuit.temples.map(t =>
            '<div style="border:1px solid var(--glass-border); border-radius:10px; padding:15px; background:rgba(255,255,255,0.03);">' +
            '<h4 style="color:var(--gold-main); margin-bottom:5px; font-size:1rem;">' + t.name + '</h4>' +
            '<p style="color:var(--teal-light); font-size:0.85rem; margin-bottom:8px;">📍 ' + t.city + ', ' + t.state + '</p>' +
            (t.deities && t.deities.length ? '<p style="color:var(--text-muted); font-size:0.8rem; margin-bottom:8px;">🙏 ' + t.deities.join(', ') + '</p>' : '') +
            (t.darshanTimings ? '<p style="color:var(--text-muted); font-size:0.8rem; margin-bottom:10px;">⏰ ' + t.darshanTimings + '</p>' : '') +
            '<a href="temple-details.html?id=' + t._id + '" style="display:block; text-align:center; padding:7px; border:1px solid var(--gold-main); color:var(--gold-main); border-radius:6px; font-size:0.85rem; text-decoration:none;">View Details</a>' +
            '</div>'
        ).join('');

    } catch (err) {
        document.getElementById('modalTemplesList').innerHTML = '<p style="color:red;">Error loading temples.</p>';
    }
}

function closeCircuitModal(event) {
    const modal = document.getElementById('circuitModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

async function fetchTemples(query = '') {
    try {
        const res = await fetch(`${API_URL}/temples${query}`);
        const temples = await res.json();
        const grid = document.getElementById('templesGrid');
        const count = document.getElementById('resultsCount');
        count.innerText = `Showing ${temples.length} temples`;
        if (temples.length === 0) {
            grid.innerHTML = '<p>No temples found matching criteria.</p>';
            return;
        }
        grid.innerHTML = temples.map(t => createTempleCard(t)).join('');
    } catch (error) {
        console.error("Error fetching temples:", error);
    }
}

async function fetchTempleDetails(id) {
    try {
        const res = await fetch(`${API_URL}/temples/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const t = await res.json();

        document.getElementById('tName').innerText = t.name;
        document.getElementById('tLocation').innerText = `${t.city}, ${t.state}`;
        const sourceEl = document.getElementById('tSource');
        if (sourceEl) sourceEl.innerText = t.verificationSource || 'Unverified';
        document.getElementById('tHistory').innerText = t.history || 'N/A';
        document.getElementById('tDeities').innerText = (t.deities || []).join(', ') || 'N/A';
        document.getElementById('tTimings').innerText = t.darshanTimings || 'N/A';
        document.getElementById('tDressCode').innerText = t.dressCode || 'N/A';
        document.getElementById('tGuidelines').innerText = t.visitorGuidelines || 'N/A';
        document.getElementById('tFacilities').innerText = t.nearbyFacilities || 'N/A';

        const ritualsHtml = (t.rituals && t.rituals.length > 0) ?
            t.rituals.map(r => `
                <div class="ritual-item">
                    <strong>${r.name}</strong> - <span style="color: var(--teal-light);">${r.timing}</span>
                    <p style="font-size: 0.9rem; margin-top: 5px;">${r.description || ''}</p>
                </div>
            `).join('') : '<p>No ritual information available.</p>';
        document.getElementById('tRituals').innerHTML = ritualsHtml;

        const festsHtml = (t.festivals && t.festivals.length > 0) ?
            t.festivals.map(f => `<li><strong>${f.name}</strong> (${f.dateOrMonth})</li>`).join('') :
            '<li>No festival data</li>';
        document.getElementById('tFestivals').innerHTML = festsHtml;

    } catch (error) {
        console.error(error);
        document.getElementById('tName').innerText = "Error loading temple data.";
    }
}

function createTempleCard(t) {
    return `
        <div class="glass-panel" style="display: flex; flex-direction: column;">
            <h3 style="font-size: 1.5rem; margin-bottom: 5px;">${t.name}</h3>
            <p style="color: var(--gold-main); font-weight: 600; margin-bottom: 15px;">${t.city}, ${t.state}</p>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px; flex: 1;">
                ${t.history ? t.history.substring(0, 100) + '...' : ''}
            </p>
            <a href="temple-details.html?id=${t._id}" class="btn btn-outline" style="text-align: center;">View Details</a>
        </div>
    `;
}

// --- User Authentication & Profile ---
async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errDiv = document.getElementById('loginError');

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
            localStorage.setItem('userToken', data.token);
            const saved = localStorage.getItem('userToken');
            if (saved) {
                window.location.href = 'profile.html';
            } else {
                errDiv.innerText = "Login failed - please try again.";
                errDiv.style.display = 'block';
            }
        } else {
            errDiv.innerText = data.message || "Login failed";
            errDiv.style.display = 'block';
        }
    } catch (error) {
        errDiv.innerText = "Server Error";
        errDiv.style.display = 'block';
    }
}

async function handleRegister() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const errDiv = document.getElementById('registerError');

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role: 'user' })
        });
        const data = await res.json();
        if (res.ok && data.token) {
            localStorage.setItem('userToken', data.token);
            const saved = localStorage.getItem('userToken');
            if (saved) {
                window.location.href = 'profile.html';
            } else {
                errDiv.innerText = "Registration failed - please try again.";
                errDiv.style.display = 'block';
            }
        } else {
            errDiv.innerText = data.message || "Registration failed";
            errDiv.style.display = 'block';
        }
    } catch (error) {
        errDiv.innerText = "Server Error";
        errDiv.style.display = 'block';
    }
}

function userLogout() {
    localStorage.removeItem('userToken');
    window.location.href = 'index.html';
}

async function fetchUserProfile() {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const user = await res.json();
            const nameEl = document.getElementById('profileName');
            const emailEl = document.getElementById('profileEmail');
            if (nameEl) nameEl.innerText = `Welcome, ${user.name}!`;
            if (emailEl) emailEl.innerText = user.email;
        } else {
            userLogout();
        }
    } catch (error) {
        console.error(error);
    }
}

async function fetchSavedTemples() {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/users/saved-temples`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const temples = await res.json();
        const grid = document.getElementById('savedTemplesGrid');
        if (!grid) return;
        if (temples.length === 0) {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">You haven\'t saved any temples yet.</p>';
            return;
        }
        grid.innerHTML = temples.map(t => createTempleCard(t)).join('');
    } catch (error) {
        console.error(error);
    }
}

async function toggleSaveTemple(templeId) {
    const token = localStorage.getItem('userToken');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    const btn = document.getElementById('saveBtn');
    if (btn) btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/users/save-temple/${templeId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            if (btn) {
                btn.disabled = false;
                btn.innerText = data.isSaved ? '♥ Saved' : '♡ Save Temple';
                btn.style.color = data.isSaved ? 'var(--gold-main)' : '';
                btn.classList.toggle('btn-primary', data.isSaved);
                btn.classList.toggle('btn-outline', !data.isSaved);
            }
        } else if (res.status === 401) {
            localStorage.removeItem('userToken');
            sessionStorage.setItem('returnTo', window.location.href);
            window.location.href = 'auth.html';
        } else {
            if (btn) btn.disabled = false;
        }
    } catch (error) {
        console.error(error);
        if (btn) btn.disabled = false;
    }
}

async function checkSavedStatus(templeId) {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const user = await res.json();
            const isSaved = user.savedTemples.includes(templeId);
            const btn = document.getElementById('saveBtn');
            if (btn && isSaved) {
                btn.innerText = '♥ Saved';
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-primary');
            }
        } else if (res.status === 401) {
            localStorage.removeItem('userToken');
        }
    } catch (error) {
        console.error(error);
    }
}

function shareTemple(title) {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title, text: `Check out ${title} on India Temple Heritage Portal!`, url }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!"));
    }
}

// Update Nav Links dynamically based on auth state
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('navLinks');
    const token = localStorage.getItem('userToken');

    if (navLinks) {
        navLinks.querySelectorAll('[data-auth]').forEach(el => el.remove());

        if (token) {
            navLinks.insertAdjacentHTML('beforeend', '<a href="profile.html" data-auth>My Profile</a>');
            navLinks.insertAdjacentHTML('beforeend', '<a href="#" data-auth onclick="userLogout(); return false;" style="cursor:pointer;">Logout</a>');
        } else {
            navLinks.insertAdjacentHTML('beforeend', '<a href="auth.html" data-auth>Login</a>');
        }
    }

    const ratingWidget = document.getElementById('ratingWidget');
    if (token && ratingWidget) {
        ratingWidget.style.display = 'flex';
    }
});

async function submitRating() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        sessionStorage.setItem('returnTo', window.location.href);
        window.location.href = 'auth.html';
        return;
    }

    if (typeof currentTempleId === 'undefined' || !currentTempleId) return;

    const ratingVal = document.getElementById('templeRating').value;
    const msgEl = document.getElementById('ratingMsg');

    try {
        const res = await fetch(`${API_URL}/temples/${currentTempleId}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rating: Number(ratingVal) })
        });
        const data = await res.json();

        if (res.ok) {
            msgEl.innerText = "Thanks for rating!";
            msgEl.style.color = "var(--teal-light)";
        } else {
            msgEl.innerText = data.message || "Error rating";
            msgEl.style.color = "red";
        }
    } catch (error) {
        console.error(error);
        msgEl.innerText = "Server Error";
        msgEl.style.color = "red";
    }
}

// Analytics: Page Engagement Tracking
let pageEnterTime = Date.now();
window.addEventListener('beforeunload', () => {
    const duration = Math.round((Date.now() - pageEnterTime) / 1000);
    const path = window.location.pathname + window.location.search;
    if (duration > 0) {
        const payload = JSON.stringify({ durationSeconds: duration, path });
        navigator.sendBeacon(`${API_URL}/analytics/engagement`, new Blob([payload], { type: 'application/json' }));
    }
});