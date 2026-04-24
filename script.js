
// Theme Toggle
const themeToggleBtn = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});

// Mobile Navigation Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate hamburger to X
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Active Link Highlight on Scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.section-reveal');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// Trigger animations for sections already visible on load
window.addEventListener('load', () => {
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);
});

// Github Repositories Fetcher
async function fetchGithubRepos() {
    const reposContainer = document.getElementById('github-repos');
    if (!reposContainer) return;

    try {
        const response = await fetch('https://api.github.com/users/Syedshafiullah160904/repos?sort=updated&per_page=100');
        if (!response.ok) throw new Error('Failed to fetch');

        const allRepos = await response.json();

        // Filter out repos already displayed in the main grid or not needed
        const excludeList = ['Library-Management-System', 'Online-Food-ordering', 'banking-concole-app-java', 'E-Commerce-Website', 'Syedshafiullah160904', 'Syed-Shafiullah-SF', 'WiFi-Credentials-Card-Generator', 'MY-Checklist', 'Calculator', 'Student-Management-System-', 'Finance-Management-System'];
        const validRepos = allRepos.filter(repo => !repo.fork && !excludeList.includes(repo.name));

        if (validRepos.length === 0) {
            reposContainer.innerHTML = '<p style="text-align: center; width: 100%; color: var(--text-secondary);">No additional projects found.</p>';
            return;
        }

        reposContainer.innerHTML = validRepos.map(repo => `
            <a href="${repo.html_url}" target="_blank" class="github-repo-card glass-card">
                <div class="repo-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="repo-icon"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    <h4>${repo.name.replace(/-/g, ' ')}</h4>
                </div>
                <p class="repo-desc">${repo.description || 'No description provided.'}</p>
                <div class="repo-meta">
                    ${repo.language ? `<span class="repo-lang"><span class="lang-dot"></span>${repo.language}</span>` : ''}
                    <span class="repo-stars">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        ${repo.stargazers_count}
                    </span>
                </div>
            </a>
        `).join('');

    } catch (error) {
        reposContainer.innerHTML = '<p style="text-align: center; width: 100%; color: #ef4444;">Could not load GitHub projects.</p>';
        console.error('Error fetching repos:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchGithubRepos);

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add slight delay to outline for trailing effect
    setTimeout(() => {
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    }, 50);
});

// Cursor Hover Effects
const hoverElements = document.querySelectorAll('a, button, .glass-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// Dynamic Typing Effect
const typedTextSpan = document.querySelector('.typed-text');
const textArray = ["Java FullStack Developer", "Spring Boot Expert", "Problem Solver"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if(textArray.length) setTimeout(type, newTextDelay + 250);
});

// Vanilla Tilt Initialization
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".glass-card"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.05
    });
}

// Advanced Features Implementation

// 1. Scroll Progress & Back to Top
const scrollProgress = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = scrollPercent + '%';
    }

    if (scrollTop > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 2. Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card-filterable');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const categoriesStr = card.getAttribute('data-category');
            if(!categoriesStr) return;
            const categories = categoriesStr.split(' ');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// 3. Hidden Terminal Easter Egg
const terminalModal = document.getElementById('terminal-modal');
const terminalBody = document.getElementById('terminal-body');
const terminalInput = document.getElementById('terminal-input');
const closeTerminalBtn = document.getElementById('close-terminal');
const terminalTrigger = document.getElementById('terminal-trigger');

function openTerminal() {
    terminalModal.classList.add('open');
    setTimeout(() => terminalInput.focus(), 100);
}

function closeTerminal() {
    terminalModal.classList.remove('open');
}

document.addEventListener('keydown', (e) => {
    if ((e.key === '`' || e.key === '~') && !terminalModal.classList.contains('open')) {
        e.preventDefault();
        openTerminal();
    } else if (e.key === 'Escape' && terminalModal.classList.contains('open')) {
        closeTerminal();
    }
});

if (terminalTrigger) terminalTrigger.addEventListener('click', openTerminal);
if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', closeTerminal);
if (terminalModal) {
    terminalModal.addEventListener('click', (e) => {
        if (e.target === terminalModal) closeTerminal();
    });
}

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';

            if (cmd !== '') {
                appendTerminalLine(`syed@portfolio:~$ <span class="terminal-command">${cmd}</span>`);
            } else {
                appendTerminalLine(`syed@portfolio:~$`);
                return;
            }

            switch(cmd) {
                case 'help':
                    appendTerminalLine('Available commands: <br> - <span class="terminal-command">whoami</span>: Learn about me <br> - <span class="terminal-command">skills</span>: List my top skills <br> - <span class="terminal-command">contact</span>: Get my email <br> - <span class="terminal-command">clear</span>: Clear terminal');
                    break;
                case 'whoami':
                    appendTerminalLine('Syed Shafiullah SF - Java FullStack Developer & Problem Solver.');
                    break;
                case 'skills':
                    appendTerminalLine('Java, Spring Boot, React, MySQL, PostgreSQL, REST APIs.');
                    break;
                case 'contact':
                    appendTerminalLine('Email me at: <a href="mailto:syedshafiullah2004@gmail.com" style="color: #3b82f6;">syedshafiullah2004@gmail.com</a>');
                    break;
                case 'clear':
                    terminalBody.innerHTML = '';
                    break;
                default:
                    appendTerminalLine(`Command not found: ${cmd}. Type 'help' for available commands.`);
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}

function appendTerminalLine(htmlContent) {
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = htmlContent;
    terminalBody.appendChild(div);
}
