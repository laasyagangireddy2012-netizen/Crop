/* ═══════════════════════════════════════════════════
   CropXAI – Login Page Logic
═══════════════════════════════════════════════════ */

'use strict';

// ── USER STORE ──────────────────────────────────────
let users = JSON.parse(localStorage.getItem('cropxai_users')) || {
    farmer: { password: 'demo123', name: 'Demo Farmer', email: 'farmer@demo.com' }
};

// ── COUNTER ANIMATION ───────────────────────────────
(function animateCounters() {
    const els = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            let current = 0;
            const step = Math.ceil(target / 40);
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, 40);
            observer.unobserve(el);
        });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
})();

// ── TAB SWITCHING ───────────────────────────────────
function switchTab(tab) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    if (tab === 'login') {
        document.getElementById('formLogin').classList.add('active');
        document.getElementById('tabLogin').classList.add('active');
    } else if (tab === 'register') {
        document.getElementById('formRegister').classList.add('active');
        document.getElementById('tabRegister').classList.add('active');
    } else if (tab === 'forgot') {
        document.getElementById('formForgot').classList.add('active');
    }
}

// ── TOAST ───────────────────────────────────────────
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => { toast.className = 'toast'; }, 3200);
}

// ── PASSWORD TOGGLE ─────────────────────────────────
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.style.opacity = isHidden ? '1' : '0.5';
}

// ── PASSWORD STRENGTH ───────────────────────────────
document.getElementById('regPassword').addEventListener('input', function () {
    const val = this.value;
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');

    let score = 0;
    if (val.length >= 6)  score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
        { pct: '0%',   color: 'transparent', text: 'Password strength' },
        { pct: '20%',  color: '#fc8181',      text: 'Very weak' },
        { pct: '40%',  color: '#f6ad55',      text: 'Weak' },
        { pct: '60%',  color: '#faf089',      text: 'Fair' },
        { pct: '80%',  color: '#68d391',      text: 'Strong' },
        { pct: '100%', color: '#48bb78',      text: 'Very strong 💪' },
    ];

    const lvl = val.length === 0 ? levels[0] : levels[Math.min(score, 5)];
    fill.style.width = lvl.pct;
    fill.style.background = lvl.color;
    label.textContent = lvl.text;
    label.style.color = lvl.color === 'transparent' ? '#6ee7b7' : lvl.color;
});

// ── FIELD VALIDATION ────────────────────────────────
function setError(inputId, groupId, message) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById('err-' + inputId.replace('login', '').toLowerCase());
    if (input)  input.classList.add('error');
    if (err)    err.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.input-wrap input').forEach(i => i.classList.remove('error'));
    document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
}

// ── LOADING STATE ────────────────────────────────────
function setLoading(btnId, loading) {
    const btn  = document.getElementById(btnId);
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spin = btn.querySelector('.btn-loader');
    btn.disabled = loading;
    if (text) text.style.display = loading ? 'none' : '';
    if (spin) spin.style.display = loading ? 'flex' : 'none';
}

// ── LOGIN HANDLER ────────────────────────────────────
document.getElementById('formLogin').addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    let valid = true;

    if (!username) {
        setError('loginUsername', 'ig-username', 'Username is required');
        valid = false;
    }
    if (!password) {
        setError('loginPassword', 'ig-password', 'Password is required');
        valid = false;
    }
    if (!valid) return;

    setLoading('btnLogin', true);

    setTimeout(() => {
        setLoading('btnLogin', false);

        if (users[username] && users[username].password === password) {
            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('cropxai_remember', username);
            }
            sessionStorage.setItem('cropxai_user', JSON.stringify({ username, ...users[username] }));

            document.getElementById('loginCard').classList.add('success-state');
            showToast('✅ Welcome back, ' + users[username].name + '!', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        } else {
            setError('loginUsername', 'ig-username', ' ');
            setError('loginPassword', 'ig-password', 'Invalid username or password');
            showToast('❌ Login failed. Check your credentials.', 'error');
        }
    }, 900);
});

// ── REGISTER HANDLER ─────────────────────────────────
document.getElementById('formRegister').addEventListener('submit', function (e) {
    e.preventDefault();

    const name     = document.getElementById('regName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm  = document.getElementById('regConfirm').value;

    if (!name || !username || !password || !confirm) {
        showToast('⚠️ Please fill in all fields.', 'error');
        return;
    }
    if (users[username]) {
        showToast('⚠️ Username already taken. Choose another.', 'error');
        return;
    }
    if (password.length < 6) {
        showToast('⚠️ Password must be at least 6 characters.', 'error');
        return;
    }
    if (password !== confirm) {
        showToast('⚠️ Passwords do not match.', 'error');
        return;
    }

    setLoading('btnRegister', true);

    setTimeout(() => {
        setLoading('btnRegister', false);
        users[username] = { password, name };
        localStorage.setItem('cropxai_users', JSON.stringify(users));
        showToast('🎉 Account created! Please sign in.', 'success');
        document.getElementById('formRegister').reset();
        document.getElementById('strengthFill').style.width = '0%';
        document.getElementById('strengthLabel').textContent = 'Password strength';
        switchTab('login');
    }, 800);
});

// ── FORGOT PASSWORD HANDLER ──────────────────────────
document.getElementById('formForgot').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('resetUsername').value.trim();
    const newPw    = document.getElementById('resetNewPw').value;

    if (!username || !newPw) {
        showToast('⚠️ Please fill in all fields.', 'error');
        return;
    }

    if (users[username]) {
        users[username].password = newPw;
        localStorage.setItem('cropxai_users', JSON.stringify(users));
        showToast('✅ Password reset! Please sign in.', 'success');
        document.getElementById('formForgot').reset();
        switchTab('login');
    } else {
        showToast('❌ Username not found.', 'error');
    }
});



// ── AUTO-FILL REMEMBERED USER ────────────────────────
(function checkRemembered() {
    const remembered = localStorage.getItem('cropxai_remember');
    if (remembered) {
        const el = document.getElementById('loginUsername');
        if (el) el.value = remembered;
        const cb = document.getElementById('rememberMe');
        if (cb) cb.checked = true;
    }
})();

// ── KEYBOARD SHORTCUT: Enter on username → focus password ──
document.getElementById('loginUsername').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('loginPassword').focus();
    }
});
