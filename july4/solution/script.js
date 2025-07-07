let session = JSON.parse(localStorage.getItem("session")) || null;
let employees = JSON.parse(localStorage.getItem("employees")) || [];

function showLogin(type) {
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("loginTitle").innerText = type === "admin" ? "Admin Login" : "Employee Login";
  document.getElementById("passwordField").style.display = type === "admin" ? "block" : "none";
  session = { type };
}

function login() {
  const name = document.getElementById("loginName").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();

  if (session.type === "admin") {
    if (name === "pradhan12@gmail.com" && pass === "1234") {
      session.name = "Pradhan";
      session.email = name;
      localStorage.setItem("session", JSON.stringify(session));
      showDashboard();
    } else {
      alert("Invalid admin credentials");
    }
  } else {
    const emp = employees.find(e => e.name.toLowerCase() === name.toLowerCase());
    if (emp) {
      session.name = emp.name;
      session.empId = emp.id;
      session.role = "employee";
      localStorage.setItem("session", JSON.stringify(session));
      showDashboard();
    } else {
      alert("Employee not found");
    }
  }
}

function showDashboard() {
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";

  if (session.type === "admin") {
    document.getElementById("adminDashboard").style.display = "block";
    document.getElementById("employeeDashboard").style.display = "none";
    document.getElementById("adminNameDisplay").innerText = `${session.name} (${session.email})`;
    document.getElementById("actionHeader").style.display = "none";
  } else {
    document.getElementById("adminDashboard").style.display = "none";
    document.getElementById("employeeDashboard").style.display = "block";
    const emp = employees.find(e => e.name === session.name);
    if (emp) {
      document.getElementById("empName").innerText = emp.name;
      document.getElementById("empNameDisplay").innerText = emp.name;
      document.getElementById("empKeyDisplay").innerText = emp.id;
      document.getElementById("empRoleDisplay").innerText = emp.role;
    }
    document.getElementById("actionHeader").style.display = "table-cell";
  }

  renderEmployees();
}

function registerEmployee() {
  const name = document.getElementById("employeeName").value.trim();
  const role = document.getElementById("employeeRole").value;
  if (!name || !role) return alert("Please enter name and role");

  const id = "EMP" + String(Math.floor(Math.random() * 100000)).padStart(3, "0");
  employees.push({ id, name, role });
  localStorage.setItem("employees", JSON.stringify(employees));
  renderEmployees();
}

function renderEmployees() {
  const body = document.getElementById("employeeTableBody");
  if (!body) return;
  body.innerHTML = "";

  employees.forEach(e => {
    const isSelf = session.type === "employee" && e.name === session.name;
    const row = `
      <tr>
        <td>${e.id}</td>
        <td>${e.name}</td>
        <td>${e.role}</td>
        <td>
          ${isSelf ? '<button class="btn btn-sm btn-warning" onclick="editKey()">Edit</button>' : ''}
        </td>
      </tr>
    `;
    body.innerHTML += row;
  });
}

function searchEmployee() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const body = document.getElementById("employeeTableBody");
  if (!body) return;
  body.innerHTML = "";

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(query) || 
    e.id.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    body.innerHTML = `<tr><td colspan="4" class="text-center">No matching employees found.</td></tr>`;
  } else {
    filtered.forEach(e => {
      const isSelf = session.type === "employee" && e.name === session.name;
      const row = `
        <tr>
          <td>${e.id}</td>
          <td>${e.name}</td>
          <td>${e.role}</td>
          <td>
            ${isSelf ? '<button class="btn btn-sm btn-warning" onclick="editKey()">Edit</button>' : ''}
          </td>
        </tr>
      `;
      body.innerHTML += row;
    });
  }
}

function editKey() {
  const newKey = prompt("Enter new Employee ID:");
  if (!newKey) return;

  const index = employees.findIndex(e => e.name === session.name);
  if (index !== -1) {
    employees[index].id = newKey;
    session.empId = newKey;
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("session", JSON.stringify(session));
    document.getElementById("empKeyDisplay").innerText = newKey;
    renderEmployees();
  }
}

function goHome() {
  session = null;
  localStorage.removeItem("session");
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("homeSection").style.display = "block";
}

window.onload = () => {
  session = JSON.parse(localStorage.getItem("session"));
  if (session && session.name) {
    showDashboard();
  } else {
    document.getElementById("homeSection").style.display = "block";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboardSection").style.display = "none";
  }
};
