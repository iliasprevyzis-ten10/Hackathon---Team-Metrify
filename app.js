const roleSelect = document.getElementById("roleSelect");
const skillsContainer = document.getElementById("skillsContainer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const missingSkillsList = document.getElementById("missingSkills");
const smartTarget = document.getElementById("smartTarget");
const learningSuggestions = document.getElementById("learningSuggestions");
const welcomeUser = document.getElementById("welcomeUser");

const currentUser = localStorage.getItem("loggedInUser");

if (currentUser && welcomeUser) {
  welcomeUser.textContent = `Welcome, ${currentUser}`;
}

const roleData = {
  manualTester: {
    skills: ["Test Cases", "Bug Reporting", "API Testing", "SQL Basics"],
    suggestions: ["ISTQB Foundation Notes", "Postman Beginner Guide", "SQL Basics Course"]
  },
  javaDev: {
    skills: ["Java", "OOP", "Spring Boot", "Unit Testing"],
    suggestions: ["Java OOP Tutorial", "Spring Boot Crash Course", "JUnit Basics"]
  },
  devops: {
    skills: ["CI/CD", "Docker", "Kubernetes", "Cloud Platforms"],
    suggestions: ["Docker Basics", "Intro to CI/CD", "Azure or AWS Fundamentals"]
  },
  dataAnalyst: {
    skills: ["Excel", "SQL", "Power BI", "Python"],
    suggestions: ["Excel Dashboard Tutorial", "SQL for Data Analysis", "Power BI Beginner Course"]
  },
  dataEngineer: {
    skills: ["Python", "SQL", "ETL Pipelines", "Data Warehousing"],
    suggestions: ["ETL Basics", "Python for Data Engineering", "Data Warehouse Concepts"]
  },
  scrumMaster: {
    skills: ["Agile Principles", "Scrum Ceremonies", "Stakeholder Management", "Sprint Planning"],
    suggestions: ["Scrum Guide", "Agile Fundamentals", "Sprint Planning Techniques"]
  }
};

roleSelect.addEventListener("change", loadSkills);

function loadSkills() {
  const selectedRole = roleSelect.value;

  skillsContainer.innerHTML = "";
  missingSkillsList.innerHTML = "";
  learningSuggestions.innerHTML = "";
  progressFill.style.width = "0%";
  progressText.textContent = "0% Complete";
  smartTarget.textContent = "Your SMART target will appear here.";

  if (!selectedRole || !roleData[selectedRole]) {
    return;
  }

  const currentRole = roleData[selectedRole];

  currentRole.skills.forEach((skill) => {
    const skillRow = document.createElement("div");
    skillRow.classList.add("field");

    skillRow.innerHTML = `
      <label>${skill}</label>
      <select class="skill-level">
        <option value="0">0 - Not started</option>
        <option value="1">1 - Beginner</option>
        <option value="2">2 - Working knowledge</option>
        <option value="3">3 - Confident</option>
      </select>
    `;

    skillsContainer.appendChild(skillRow);
  });

  currentRole.suggestions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    learningSuggestions.appendChild(li);
  });

  const skillLevels = document.querySelectorAll(".skill-level");
  skillLevels.forEach((dropdown) => {
    dropdown.addEventListener("change", updateProgress);
  });

  updateProgress();
}

function updateProgress() {
  const skillLevels = document.querySelectorAll(".skill-level");
  const selectedRole = roleSelect.value;

  if (!selectedRole || !roleData[selectedRole] || skillLevels.length === 0) {
    progressFill.style.width = "0%";
    progressText.textContent = "0% Complete";
    missingSkillsList.innerHTML = "";
    smartTarget.textContent = "Your SMART target will appear here.";
    return;
  }

  let totalScore = 0;
  let maxScore = skillLevels.length * 3;
  missingSkillsList.innerHTML = "";

  skillLevels.forEach((dropdown, index) => {
    const value = Number(dropdown.value);
    totalScore += value;

    if (value < 2) {
      const li = document.createElement("li");
      li.textContent = roleData[selectedRole].skills[index];
      missingSkillsList.appendChild(li);
    }
  });

  const percent = Math.round((totalScore / maxScore) * 100);

  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${percent}% Complete`;

  if (percent >= 80) {
    smartTarget.textContent = "Strong progress. Focus on refining the weaker skills and getting hands-on practice this week.";
  } else if (percent >= 50) {
    smartTarget.textContent = "You have a good base. Aim to improve 2 weaker skills over the next 2 weeks.";
  } else {
    smartTarget.textContent = "Start with the fundamentals and build confidence in the missing skills over the next 3 weeks.";
  }

  saveProgress();
}

function saveProgress() {
  const selectedRole = roleSelect.value;
  const skillLevels = document.querySelectorAll(".skill-level");

  const savedLevels = [];
  skillLevels.forEach((dropdown) => {
    savedLevels.push(dropdown.value);
  });

  const data = {
    role: selectedRole,
    levels: savedLevels
  };

  localStorage.setItem("skillsMatrixProgress", JSON.stringify(data));
}

function restoreProgress() {
  const savedData = JSON.parse(localStorage.getItem("skillsMatrixProgress"));

  if (!savedData || !savedData.role) {
    return;
  }

  roleSelect.value = savedData.role;
  loadSkills();

  const skillLevels = document.querySelectorAll(".skill-level");

  skillLevels.forEach((dropdown, index) => {
    if (savedData.levels[index] !== undefined) {
      dropdown.value = savedData.levels[index];
    }
  });

  updateProgress();
}

restoreProgress();