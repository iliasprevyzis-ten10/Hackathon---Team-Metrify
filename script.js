// Database of careers and their specific skills
        const careerData = {
            "DevOps": [
                { id: "do1", name: "Linux Administration", time: "2-3 Weeks", how: "Practice basic terminal commands, file permissions, and bash scripting.", video: "https://www.youtube.com/watch?v=sWbUDq4S6Y8" },
                { id: "do2", name: "Docker & Containerization", time: "3 Weeks", how: "Learn how to build Dockerfiles, manage images, and run multi-container apps with Docker Compose.", video: "https://www.youtube.com/watch?v=fqMOXICWOEM" },
                { id: "do3", name: "CI/CD Pipelines (GitHub Actions/Jenkins)", time: "4 Weeks", how: "Set up automated testing and deployment workflows for basic web applications.", video: "https://www.youtube.com/watch?v=R8_veQiYBjI" }
            ],
            "Scrum Master": [
                { id: "sm1", name: "Agile Frameworks", time: "2 Weeks", how: "Understand the Agile manifesto, Scrum events (Daily, Sprint Review, Retrospective), and artifacts.", video: "https://www.youtube.com/watch?v=9TycLR0TqFA" },
                { id: "sm2", name: "Jira / Sprint Management", time: "1 Week", how: "Learn to create boards, manage backlogs, write user stories, and track velocity.", video: "https://www.youtube.com/watch?v=R9Kk8gN21hc" },
                { id: "sm3", name: "Facilitation & Conflict Resolution", time: "Ongoing", how: "Study techniques for running effective meetings and handling team disagreements objectively.", video: "https://www.youtube.com/watch?v=QjeXqYpT1UA" }
            ],
            "Data Engineer": [
                { id: "de1", name: "Python for Data", time: "4 Weeks", how: "Master Python basics, Pandas, and data manipulation techniques.", video: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
                { id: "de2", name: "Advanced SQL", time: "3 Weeks", how: "Learn window functions, CTEs, complex joins, and query optimization.", video: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
                { id: "de3", name: "ETL Pipelines (Spark/Airflow)", time: "5 Weeks", how: "Understand how to extract, transform, and load big data using modern data orchestration tools.", video: "https://www.youtube.com/watch?v=H72R0n9y1bM" }
            ],
            "Front-end Developer": [
                { id: "fe1", name: "Semantic HTML & Advanced CSS", time: "3 Weeks", how: "Learn Flexbox, CSS Grid, responsive design, and accessibility standards.", video: "https://www.youtube.com/watch?v=G3e-cpL7ofc" },
                { id: "fe2", name: "JavaScript (ES6+)", time: "4 Weeks", how: "Master DOM manipulation, promises, async/await, and array methods.", video: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
                { id: "fe3", name: "React.js", time: "5 Weeks", how: "Understand components, state management, hooks, and routing.", video: "https://www.youtube.com/watch?v=bMknfKXIFA8" }
            ],
            "Back-end Developer": [
                { id: "be1", name: "Node.js & Express", time: "4 Weeks", how: "Learn to build servers, handle routing, and implement middleware.", video: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
                { id: "be2", name: "RESTful APIs", time: "2 Weeks", how: "Understand HTTP methods, status codes, and JSON formatting.", video: "https://www.youtube.com/watch?v=-MTSQjw5DrM" },
                { id: "be3", name: "Database Design (PostgreSQL/MongoDB)", time: "4 Weeks", how: "Learn how to design schemas, normalize data, and write CRUD operations.", video: "https://www.youtube.com/watch?v=ztHopE5Wnpc" }
            ],
            "Full-Stack Developer": [
                { id: "fs1", name: "Frontend Basics (HTML/CSS/JS)", time: "5 Weeks", how: "Build static and interactive websites using core web technologies.", video: "https://www.youtube.com/watch?v=mU6anWqZJcc" },
                { id: "fs2", name: "Backend APIs & Databases", time: "6 Weeks", how: "Create server-side logic and connect your application to a database.", video: "https://www.youtube.com/watch?v=zZ6vybT1HQs" },
                { id: "fs3", name: "Version Control (Git)", time: "1 Week", how: "Learn to commit, branch, merge, and resolve conflicts using Git and GitHub.", video: "https://www.youtube.com/watch?v=RGOj5yH7evk" }
            ]
        };

        // NEW: Database of images to pair with careers
        const careerImages = {
            "DevOps": "url('https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=500&q=80')",
            "Scrum Master": "url('https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=500&q=80')",
            "Data Engineer": "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80')",
            "Front-end Developer": "url('https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=500&q=80')",
            "Back-end Developer": "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80')",
            "Full-Stack Developer": "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=80')"
        };

        // DOM Elements
        const selectionScreen = document.getElementById('selection-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');
        const careerButtonsContainer = document.getElementById('career-buttons');
        const careerTitle = document.getElementById('career-title');
        const skillsForm = document.getElementById('skills-form');
        const actionPlanList = document.getElementById('action-plan-list');
        const btnChangeCareer = document.getElementById('btn-change-career');

        let currentCareer = null;

        // Initialize Career Buttons with Background Images
        function init() {
            Object.keys(careerData).forEach(career => {
                const btn = document.createElement('button');
                btn.className = 'career-card';
                btn.style.backgroundImage = careerImages[career];
                
                // Wrap text in a span so it sits ABOVE the dark overlay
                const span = document.createElement('span');
                span.textContent = career;
                
                btn.appendChild(span);
                btn.onclick = () => selectCareer(career);
                careerButtonsContainer.appendChild(btn);
            });
        }

        // Handle Career Selection
        function selectCareer(career) {
            currentCareer = career;
            selectionScreen.classList.add('hidden');
            dashboardScreen.classList.remove('hidden');
            careerTitle.textContent = `${career} Skills Checklist`;
            renderSkills();
            updateActionPlan(); // Run once initially
        }

        // Handle Changing Career
        btnChangeCareer.onclick = () => {
            currentCareer = null;
            dashboardScreen.classList.add('hidden');
            selectionScreen.classList.remove('hidden');
        };

        // Render Checkboxes
        function renderSkills() {
            skillsForm.innerHTML = ''; // Clear previous
            const skills = careerData[currentCareer];

            skills.forEach(skill => {
                const div = document.createElement('div');
                div.className = 'skill-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = skill.id;
                checkbox.onchange = updateActionPlan;

                const label = document.createElement('label');
                label.htmlFor = skill.id;
                label.className = 'skill-label';
                label.textContent = skill.name;

                div.appendChild(checkbox);
                div.appendChild(label);
                skillsForm.appendChild(div);
            });
        }

        // Update the Action Plan based on UNCHECKED boxes
        function updateActionPlan() {
            actionPlanList.innerHTML = '';
            const skills = careerData[currentCareer];
            let allCompleted = true;

            skills.forEach(skill => {
                const checkbox = document.getElementById(skill.id);
                if (!checkbox.checked) {
                    allCompleted = false;
                    
                    const card = document.createElement('div');
                    card.className = 'missing-skill-card';
                    card.innerHTML = `
                        <h4>${skill.name}</h4>
                        <p><strong>How to improve:</strong> ${skill.how}</p>
                        <p><strong>Estimated Time:</strong> ${skill.time}</p>
                        <p><a href="${skill.video}" target="_blank" rel="noopener noreferrer">Watch Free Online Tutorial</a></p>
                    `;
                    actionPlanList.appendChild(card);
                }
            });

            if (allCompleted) {
                actionPlanList.innerHTML = `<div class="missing-skill-card" style="border-left-color: #10b981; background-color: #ecfdf5;">
                    <h4 style="color: #047857;">🎉 Congratulations!</h4>
                    <p>You have marked all core skills as complete for this role. You are ready to start applying for jobs or moving to advanced topics!</p>
                </div>`;
            }
        }

        // Start the app
        init();