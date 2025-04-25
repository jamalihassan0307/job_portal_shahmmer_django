// Initialize storage for applications if not exists
if (!localStorage.getItem("applications")) {
  localStorage.setItem("applications", JSON.stringify([]));
}

// Login functionality
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("loginError");

    try {
      const user = await loginUser(email, password);
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "/home/";
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (errorMsg) {
        errorMsg.textContent = "Invalid email or password. Please try again.";
        errorMsg.style.display = "block";
      } else {
        alert("Invalid email or password. Please try again.");
      }
    }
  });
}

// Check if user is logged in
function checkAuth() {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = "index.html";
    return null;
  }
  return JSON.parse(currentUser);
}

// Load jobs on home page
const loadJobs = filterJobs;

// Add job functionality
function showAddJobForm() {
  document.getElementById("addJobModal").style.display = "block";
}

// Add job form submission
const addJobForm = document.getElementById("addJobForm");
if (addJobForm) {
  addJobForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const editingJobId = localStorage.getItem("editingJobId");

    const jobData = {
      title: document.getElementById("jobTitle").value,
      description: document.getElementById("jobDescription").value,
      company: document.getElementById("company").value,
      logo:
        document.getElementById("companyLogo").value ||
        "https://via.placeholder.com/60",
      jobType: document.getElementById("jobType").value,
      salary: document.getElementById("Salery").value,
      createdAt: editingJobId ? Date.now() : Date.now(),
    };

    try {
      if (editingJobId) {
        await updateJob(editingJobId, jobData);
        alert("Job updated successfully!");
      } else {
        await createJob(jobData);
        alert("Job posted successfully!");
      }

      closeModal("addJobModal");
      loadJobs();
      addJobForm.reset();
      localStorage.removeItem("editingJobId");
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Error saving job. Please try again.");
    }
  });
}

// Apply for job
function applyJob(jobId) {
  const applyModal = document.getElementById("applyJobModal");
  if (applyModal) {
    applyModal.style.display = "block";
    localStorage.setItem("applyingForJob", jobId);

    // Pre-fill email if available
    const currentUser = checkAuth();
    if (document.getElementById("applyEmail")) {
      document.getElementById("applyEmail").value = currentUser.email;
    }
    if (document.getElementById("fullName")) {
      document.getElementById("fullName").value = currentUser.fullName || "";
    }
  }
}

// Logout functionality
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// Initialize page
if (window.location.pathname.includes("home.html")) {
  const currentUser = checkAuth();
  if (currentUser.roleId !== 1) {
    document.getElementById("adminControls").style.display = "none";
  }
  loadJobs();
}

// Add this function to close modals
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    if (modalId === "addJobModal") {
      localStorage.removeItem("editingJobId");
      document.getElementById("addJobForm").reset();
      document.querySelector("#addJobModal .modal-header h3").textContent =
        "Post New Job";
      document.querySelector("#addJobForm .submit-btn").textContent =
        "Post Job";
    } else if (modalId === "applyJobModal") {
      localStorage.removeItem("applyingForJob");
      document.getElementById("applyJobForm").reset();
    }
  }
}

// Load my applications
function loadMyApplications() {
  const myJobsList = document.getElementById("myJobsList");
  if (!myJobsList) return;

  const currentUser = checkAuth();
  const applications = JSON.parse(localStorage.getItem("applications")) || [];
  const myApplications = applications.filter(
    (app) => app.userId === currentUser.email
  );

  myJobsList.innerHTML = "";

  if (myApplications.length === 0) {
    myJobsList.innerHTML = `
            <div class="no-applications">
                <i class="fas fa-briefcase"></i>
                <h3>No Applications Yet</h3>
                <p>You haven't applied to any jobs yet.</p>
            </div>
        `;
    return;
  }

  myApplications.forEach((app) => {
    const jobCard = document.createElement("div");
    jobCard.className = "job-card";
    jobCard.innerHTML = `
            <div class="job-card-header">
                <div class="job-logo">
                    <img src="${
                      app.jobLogo || "https://via.placeholder.com/60"
                    }" 
                         alt="${app.company}" 
                         onerror="this.src='https://via.placeholder.com/60'">
                </div>
                <div class="job-title">
                    <h3>${app.jobTitle}</h3>
                    <div class="job-company">
                        <i class="fas fa-building"></i>
                        ${app.company}
                    </div>
                </div>
            </div>
            <div class="job-body">
                <div class="job-meta">
                    <div class="job-tags">
                        <span class="job-tag">
                            <i class="fas fa-briefcase"></i>
                            ${app.jobType || "Not Specified"}
                        </span>
                        <span class="application-status status-${
                          app.status || "pending"
                        }">
                            ${app.status || "Pending"}
                        </span>
                        <span class="job-tag">
                            <i class="fas fa-clock"></i>
                            Applied on: ${new Date(
                              app.appliedAt
                            ).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        `;
    myJobsList.appendChild(jobCard);
  });
}

// Load profile data
function loadProfile() {
  const profileForm = document.getElementById("profileForm");
  if (!profileForm) return;

  const currentUser = checkAuth();

  // Set email and name
  document.getElementById("email").value = currentUser.email;
  document.getElementById("fullName").value = currentUser.fullName || "";
  document.getElementById("phone").value = currentUser.phone || "";
  document.getElementById("resume").value = currentUser.resume || "";
  document.getElementById("profile_picture").value =
    currentUser.profile_picture || "";

  // Set profile image
  const profileImage = document.getElementById("profileImage");
  if (profileImage) {
    profileImage.src =
      currentUser.profile_picture || "https://via.placeholder.com/150";
    profileImage.onerror = function () {
      this.src = "https://via.placeholder.com/150";
    };
  }

  // Set user name in header
  document.getElementById("userName").textContent =
    currentUser.fullName || "User Profile";
  document.getElementById("userEmail").textContent = currentUser.email;
}

// Save profile data
const profileForm = document.getElementById("profileForm");
if (profileForm) {
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentUser = checkAuth();

    const updatedUserData = {
      ...currentUser,
      fullName: document.getElementById("fullName").value,
      phone: document.getElementById("phone").value,
      resume: document.getElementById("resume").value,
      profile_picture: document.getElementById("profile_picture").value,
    };

    try {
      // Update user in API
      await updateUser(currentUser.id, updatedUserData);

      // Update local storage
      localStorage.setItem("currentUser", JSON.stringify(updatedUserData));

      // Reload profile
      loadProfile();

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  });
}

// Initialize pages
if (window.location.pathname.includes("myjobs.html")) {
  checkAuth();
  loadMyApplications();
} else if (window.location.pathname.includes("profile.html")) {
  checkAuth();
  loadProfile();
}

// Add these functions for edit and delete functionality

// Delete job function
async function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job?")) {
    try {
      await fetch(`${API_BASE_URL}${API_ENDPOINTS.JOBS}/${jobId}`, {
        method: "DELETE",
      });

      // Refresh the jobs list after successful deletion
      loadJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Error deleting job. Please try again.");
    }
  }
}

// Edit job functionality
async function editJob(jobId) {
  try {
    const jobs = await fetchJobs();
    const job = jobs.find((j) => j.id === jobId);

    if (job) {
      // Fill the form with job data
      document.getElementById("jobTitle").value = job.title;
      document.getElementById("jobDescription").value = job.description;
      document.getElementById("company").value = job.company;
      document.getElementById("companyLogo").value = job.logo || "";
      document.getElementById("jobType").value = job.jobType;
      document.getElementById("Salery").value = job.salary || "";

      // Set editing state
      localStorage.setItem("editingJobId", jobId);

      // Update modal title and button
      document.querySelector("#addJobModal .modal-header h3").textContent =
        "Edit Job";
      document.querySelector("#addJobForm .submit-btn").textContent =
        "Update Job";

      // Show the modal
      document.getElementById("addJobModal").style.display = "block";
    }
  } catch (error) {
    console.error("Error loading job for edit:", error);
    alert("Error loading job data. Please try again.");
  }
}

// Add job application functionality
const applyJobForm = document.getElementById("applyJobForm");
if (applyJobForm) {
  applyJobForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentUser = checkAuth();
    const jobId = localStorage.getItem("applyingForJob");

    try {
      // Get the job details from API
      const jobs = await fetchJobs();
      const job = jobs.find((j) => j.id === jobId);

      if (job) {
        const application = {
          id: Date.now().toString(),
          jobId: jobId,
          jobTitle: job.title,
          company: job.company,
          jobLogo: job.logo,
          jobType: job.jobType,
          userId: currentUser.email,
          fullName: document.getElementById("fullName").value,
          email: document.getElementById("applyEmail").value,
          experience: document.getElementById("experience").value,
          status: "pending",
          appliedAt: new Date().toISOString(),
        };

        // Store application in localStorage
        const applications =
          JSON.parse(localStorage.getItem("applications")) || [];

        // Check if user has already applied
        const hasApplied = applications.some(
          (app) => app.jobId === jobId && app.userId === currentUser.email
        );

        if (hasApplied) {
          alert("You have already applied for this job!");
          closeModal("applyJobModal");
          return;
        }

        // Add new application
        applications.push(application);
        localStorage.setItem("applications", JSON.stringify(applications));

        // Reset form and close modal
        closeModal("applyJobModal");
        applyJobForm.reset();
        alert("Application submitted successfully!");
      } else {
        throw new Error("Job not found");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    }
  });
}

// Filter and display jobs
async function filterJobs() {
  const jobsList = document.getElementById("jobsList");
  const currentUser = checkAuth();
  const searchQuery =
    document.getElementById("searchJobs")?.value.toLowerCase() || "";
  const selectedJobType = document.getElementById("filterJobType")?.value || "";

  try {
    const jobs = await fetchJobs();

    const filteredJobs = jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchQuery) ||
        job.company?.toLowerCase().includes(searchQuery) ||
        job.description?.toLowerCase().includes(searchQuery);

      const matchesType =
        !selectedJobType ||
        job.jobType?.toLowerCase() === selectedJobType.toLowerCase();

      return matchesSearch && matchesType;
    });

    jobsList.innerHTML = "";

    if (filteredJobs.length === 0) {
      jobsList.innerHTML = `
        <div class="no-jobs-found">
          <i class="fas fa-search"></i>
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      `;
      return;
    }

    const jobsGrid = document.createElement("div");
    jobsGrid.className = "jobs-grid";

    filteredJobs.forEach((job) => {
      const jobCard = document.createElement("div");
      jobCard.className = "job-card";
      jobCard.innerHTML = `
        <div class="job-card-header">
          <div class="job-logo">
            <img src="${job.logo || "https://via.placeholder.com/60"}" 
                 alt="${job.company}" 
                 onerror="this.src='https://via.placeholder.com/60'">
          </div>
          <div class="job-title">
            <h3>${job.title}</h3>
            <div class="job-company">
              <i class="fas fa-building"></i>
              ${job.company}
            </div>
          </div>
        </div>
        <div class="job-body">
          <p class="job-description">${job.description}</p>
          <div class="job-meta">
            <div class="job-tags">
              <span class="job-tag">
                <i class="fas fa-briefcase"></i>
                ${job.jobType || "Not Specified"}
              </span>
              <span class="job-tag salary-tag">
                <i class="fas fa-money-bill-wave"></i>
                ${job.salary || "Salary not specified"}
              </span>
              <span class="job-tag">
                <i class="fas fa-clock"></i>
                ${new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div class="job-footer">
          ${
            currentUser.roleId === 1
              ? `<div class="job-actions">
            <button onclick="editJob('${job.id}')" class="action-btn edit-btn">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button onclick="deleteJob('${job.id}')" class="action-btn delete-btn">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>`
              : `<button onclick="applyJob('${job.id}')" class="action-btn apply-btn">
            <i class="fas fa-paper-plane"></i> Apply Now
          </button>`
          }
        </div>
      `;
      jobsGrid.appendChild(jobCard);
    });

    jobsList.appendChild(jobsGrid);
  } catch (error) {
    console.error("Error loading jobs:", error);
    jobsList.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Error loading jobs</h3>
        <p>Please try again later</p>
      </div>
    `;
  }
}

// Add search and filter functionality
const searchInput = document.getElementById("searchJobs");
const filterSelect = document.getElementById("filterJobType");
if (searchInput) {
  searchInput.addEventListener("input", filterJobs);
}
if (filterSelect) {
  filterSelect.addEventListener("change", filterJobs);
}
