const users = [
  {
    name: "Ilias",
    email: "ilias@example.com",
    role: "Data Analyst",
    skills: ["SQL", "Python", "Power BI", "Excel"]
  },
  {
    name: "Sarah",
    email: "sarah@example.com",
    role: "DevOps Engineer",
    skills: ["Azure", "CI/CD", "Linux", "Python"]
  },
  {
    name: "Tom",
    email: "tom@example.com",
    role: "Scrum Master",
    skills: ["Agile", "Scrum", "Communication"]
  },
  {
    name: "Maya",
    email: "maya@example.com",
    role: "Data Engineer",
    skills: ["SQL", "Python", "ETL", "Azure"]
  },
  {
    name: "James",
    email: "james@example.com",
    role: "AI Developer",
    skills: ["Python", "Machine Learning", "APIs", "SQL"]
  }
];

function renderUsers(usersArray) {
  const usersList = document.getElementById("usersList");
  usersList.innerHTML = "";

  if (usersArray.length === 0) {
    usersList.innerHTML = `<div class="empty-state">No users found.</div>`;
    return;
  }

  usersArray.forEach(user => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");

    userCard.innerHTML = `
      <h4>${user.name}</h4>
      <p><strong>Email:</strong> ${user.email}</p>
      <span class="role-badge">${user.role}</span>
      <div class="skills-wrap">
        ${user.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}
      </div>
    `;

    usersList.appendChild(userCard);
  });
}

function getSkillStats(usersArray) {
  const skillCount = {};

  usersArray.forEach(user => {
    user.skills.forEach(skill => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });

  const sortedSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]);

  return {
    mostCommon: sortedSkills.slice(0, 5),
    leastCommon: [...sortedSkills].reverse().slice(0, 5)
  };
}

function renderSkillStats(usersArray) {
  const mostCommonList = document.getElementById("mostCommonSkills");
  const leastCommonList = document.getElementById("leastCommonSkills");

  const stats = getSkillStats(usersArray);

  mostCommonList.innerHTML = "";
  leastCommonList.innerHTML = "";

  stats.mostCommon.forEach(([skill, count]) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="skill-name">${skill}</span>
      <span class="skill-count">${count} users</span>
    `;
    mostCommonList.appendChild(li);
  });

  stats.leastCommon.forEach(([skill, count]) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="skill-name">${skill}</span>
      <span class="skill-count">${count} users</span>
    `;
    leastCommonList.appendChild(li);
  });
}

renderUsers(users);
renderSkillStats(users);