const host = window.location.origin;
const roleElement = document.getElementById('role');
const menu = document.getElementById('menu');

if (roleElement) {
  fetch(`${host}/api/user`)
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login.html';
        }
        throw new Error('Unauthorized');
      }
      return res.json();
    })
    .then(user => {
      // Show role + username
      roleElement.innerText = `Logged in as: ${user.username} (${user.role})`;

      if (menu) {
        menu.innerHTML = ''; // Clear before injecting

        // Inject role-specific links
        switch (user.role) {
          case 'admin':
            menu.innerHTML += `<li><a href="/admin.html">Admin Panel</a></li>`;
            menu.innerHTML += `<li><a href="/machines.html">Manage Machines</a></li>`;
            menu.innerHTML += `<li><a href="/print.html">Print</a></li>`;
            menu.innerHTML += `<li><a href="/tech.html">Tech Panel</a></li>`;
            menu.innerHTML += `<li><a href="/support.html">Support Tools</a></li>`;
            break;

          case 'support':
            menu.innerHTML += `<li><a href="/support.html">Support Tools</a></li>`;
            menu.innerHTML += `<li><a href="/print.html">Print</a></li>`;
            break;

          case 'technician':
            menu.innerHTML += `<li><a href="/tech.html">Technician Console</a></li>`;
            menu.innerHTML += `<li><a href="/machines.html">Machines</a></li>`;
            break;
        }
      }
    })
    .catch(err => {
      console.error('User fetch failed:', err);
      roleElement.innerText = 'Not logged in.';
    });
}
