const API_URL = "";

let token = localStorage.getItem("token") || "";
let currentRole = localStorage.getItem("role") || "";

async function registerUser() {
  const body = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("registerEmail").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("registerPassword").value,
    role: document.getElementById("role").value,
  };

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    document.getElementById("registerMessage").textContent =
      data.message || `Status: ${response.status}`;
  } catch (error) {
    document.getElementById("registerMessage").textContent =
      "Could not connect to the backend.";
  }
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      document.getElementById("loginMessage").textContent =
        data.message || "Login failed";
      return;
    }

    token = data.token;
    currentRole = data.user.role;

    localStorage.setItem("token", token);
    localStorage.setItem("role", currentRole);

    document.getElementById("loginMessage").textContent =
      "Login successful";

    showDashboard();
    getCurrentUser();
  } catch (error) {
    document.getElementById("loginMessage").textContent =
      "Could not connect to the backend.";
  }
}

async function getCurrentUser() {
  if (!token) return;

  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: authHeaders(),
  });

  const data = await response.json();

  if (response.ok) {
    document.getElementById("currentUser").textContent =
      `${data.firstName} ${data.lastName} - ${data.role}`;
  }
}

async function createRide() {
  const pickupLocation =
    document.getElementById("pickupLocation").value;
  const destination =
    document.getElementById("destination").value;

  const response = await fetch(`${API_URL}/api/rides`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pickupLocation,
      destination,
    }),
  });

  const data = await response.json();

  alert(data.message || `Status: ${response.status}`);

  if (response.ok) {
    document.getElementById("pickupLocation").value = "";
    document.getElementById("destination").value = "";
    getMyRides();
  }
}

async function getMyRides() {
  const response = await fetch(`${API_URL}/api/rides/my`, {
    headers: authHeaders(),
  });

  const rides = await response.json();

  if (!response.ok) {
    document.getElementById("myRides").textContent =
      rides.message || "Could not load rides.";
    return;
  }

  const container = document.getElementById("myRides");
  container.innerHTML = "";

  rides.forEach((ride) => {
    const div = document.createElement("div");
    div.className = "ride";

    div.innerHTML = `
      <p><strong>Pickup:</strong> ${ride.pickupLocation}</p>
      <p><strong>Destination:</strong> ${ride.destination}</p>
      <p><strong>Status:</strong> ${ride.status}</p>
      <p><strong>Distance:</strong> ${ride.distanceKm ?? "-"} km</p>
      <p><strong>Fare:</strong> $${ride.fare ?? 0}</p>
      ${
        ride.status === "PENDING"
          ? `
             <button onclick="updateRide('${ride._id}')">Update Ride</button>
      <button onclick="cancelRide('${ride._id}')">Cancel Ride</button>
      <button onclick="deleteRide('${ride._id}')">Delete Ride</button>
    `
          : ""
      }
    `;

    container.appendChild(div);
  });
}

async function updateRide(id) {
  const pickupLocation = prompt("New pickup location:");
  const destination = prompt("New destination:");

  if (!pickupLocation && !destination) return;

  const response = await fetch(`${API_URL}/api/rides/${id}`, {
    method: "PATCH",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pickupLocation: pickupLocation || undefined,
      destination: destination || undefined,
    }),
  });

  const data = await response.json();
  alert(data.message || `Status: ${response.status}`);

  if (response.ok) {
    getMyRides();
  }
}

async function deleteRide(id) {
  if (!confirm("Delete this ride?")) return;

  const response = await fetch(`${API_URL}/api/rides/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json();
  alert(data.message || `Status: ${response.status}`);

  if (response.ok) {
    getMyRides();
  }
}

async function getPendingRides() {
  const response = await fetch(`${API_URL}/api/rides`, {
    headers: authHeaders(),
  });

  const rides = await response.json();

  if (!response.ok) {
    document.getElementById("pendingRides").textContent =
      rides.message || "Could not load rides.";
    return;
  }

  const container = document.getElementById("pendingRides");
  container.innerHTML = "";

  rides.forEach((ride) => {
    const div = document.createElement("div");
    div.className = "ride";

    div.innerHTML = `
      <p><strong>Pickup:</strong> ${ride.pickupLocation}</p>
      <p><strong>Destination:</strong> ${ride.destination}</p>
      <p><strong>Distance:</strong> ${ride.distanceKm ?? "-"} km</p>
      <p><strong>Fare:</strong> $${ride.fare ?? 0}</p>
      <button onclick="acceptRide('${ride._id}')">Accept Ride</button>
    `;

    container.appendChild(div);
  });
}

async function acceptRide(id) {
  const response = await fetch(
    `${API_URL}/api/rides/${id}/accept`,
    {
      method: "PATCH",
      headers: authHeaders(),
    }
  );

  const data = await response.json();
  alert(data.message || `Status: ${response.status}`);

  if (response.ok) {
    getPendingRides();
    getDriverRides();
  }
}

async function getDriverRides() {
  const response = await fetch(
    `${API_URL}/api/rides/driver/my`,
    {
      headers: authHeaders(),
    }
  );

  const rides = await response.json();

  if (!response.ok) {
    document.getElementById("driverRides").textContent =
      rides.message || "Could not load rides.";
    return;
  }

  const container = document.getElementById("driverRides");
  container.innerHTML = "";

  rides.forEach((ride) => {
    const div = document.createElement("div");
    div.className = "ride";

    div.innerHTML = `
      <p><strong>Pickup:</strong> ${ride.pickupLocation}</p>
      <p><strong>Destination:</strong> ${ride.destination}</p>
      <p><strong>Status:</strong> ${ride.status}</p>
      <p><strong>Fare:</strong> $${ride.fare ?? 0}</p>
      ${
        ride.status === "ACCEPTED"
          ? `<button onclick="completeRide('${ride._id}')">Complete Ride</button>
      <button onclick="cancelRide('${ride._id}')">Cancel Ride</button>
    `
          : ""
      }
    `;

    container.appendChild(div);
  });
}

async function completeRide(id) {
  const response = await fetch(
    `${API_URL}/api/rides/${id}/complete`,
    {
      method: "PATCH",
      headers: authHeaders(),
    }
  );

  const data = await response.json();
  alert(data.message || `Status: ${response.status}`);

  if (response.ok) {
    getDriverRides();
  }
}
async function cancelRide(id) {
  if (!confirm("Are you sure you want to cancel this ride?")) {
    return;
  }

  const response = await fetch(
    `${API_URL}/api/rides/${id}/cancel`,
    {
      method: "PATCH",
      headers: authHeaders(),
    }
  );

  const data = await response.json();

  alert(data.message || `Status: ${response.status}`);

  if (response.ok) {
    if (currentRole === "CUSTOMER") {
      getMyRides();
    }

    if (currentRole === "DRIVER") {
      getDriverRides();
      getPendingRides();
    }
  }
}

function authHeaders() {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function showDashboard() {
  document.getElementById("accountSection").classList.remove("hidden");

  if (currentRole === "CUSTOMER") {
    document.getElementById("customerSection").classList.remove("hidden");
    document.getElementById("driverSection").classList.add("hidden");
    getMyRides();
  } else if (currentRole === "DRIVER") {
    document.getElementById("driverSection").classList.remove("hidden");
    document.getElementById("customerSection").classList.add("hidden");
    getPendingRides();
    getDriverRides();
  }
}

function logout() {
  token = "";
  currentRole = "";

  localStorage.removeItem("token");
  localStorage.removeItem("role");

  document.getElementById("customerSection").classList.add("hidden");
  document.getElementById("driverSection").classList.add("hidden");
  document.getElementById("accountSection").classList.add("hidden");

  document.getElementById("loginMessage").textContent = "Logged out";
}

if (token && currentRole) {
  showDashboard();
  getCurrentUser();
}
