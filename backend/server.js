const express = require('express');
const session = require('express-session');
const path = require('path');
const users = require('./users');
const { ensureLogin, checkRole } = require('./middleware');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'portalSecret123',
  resave: false,
  saveUninitialized: true
}));

// Public files
app.use(express.static(path.join(__dirname, '../public')));

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.redirect('/dashboard.html');
  } else {
    res.send('Invalid login');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// Role-protected routes
app.get('/dashboard.html', ensureLogin, (req, res, next) => next());
app.get('/admin.html', ensureLogin, checkRole('admin'), (req, res, next) => next());
app.get('/support.html', ensureLogin, checkRole('support'), (req, res, next) => next());
app.get('/tech.html', ensureLogin, checkRole('technician'), (req, res, next) => next());

// API to get logged-in user info
app.get('/api/user', (req, res) => {
  if (req.session.user) res.json(req.session.user);
  else res.status(401).json({ error: 'Not logged in' });
});

app.listen(PORT, () => {
  console.log(`✅ Office Portal Server running at http://localhost:${PORT} and http://portal:${PORT}`);
});
