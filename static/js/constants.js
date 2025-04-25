const API_BASE_URL = "https://677bd77a20824100c07af8cd.mockapi.io/api";

const API_ENDPOINTS = {
  USERS: "/user",
  JOBS: "/job",
};

// API Functions
async function fetchUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched users:", data);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// Login function
async function loginUser(email, password) {
  try {
    const users = await fetchUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      return user;
    }
    throw new Error("Invalid credentials");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function fetchUserById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function createUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

async function updateUser(id, userData) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.USERS}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.USERS}/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
}

// Jobs API Functions
async function fetchJobs() {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.JOBS}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

async function createJob(jobData) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.JOBS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
}

async function updateJob(id, jobData) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.JOBS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
}

async function deleteJob(id) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.JOBS}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
}
