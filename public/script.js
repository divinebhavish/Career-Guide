// Global variables
let currentUser = null;
let careers = [];
let colleges = [];
let roadmaps = [];
let currentFilter = 'all';
let searchQuery = '';
let comparisonCareers = [];
let currentCollegeFilter = { region: 'all', type: 'all' };
let collegeSearchQuery = '';

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const authModal = document.getElementById('authModal');
const careerModal = document.getElementById('careerModal');
const collegeModal = document.getElementById('collegeModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const careersGrid = document.getElementById('careersGrid');
const collegesGrid = document.getElementById('collegesGrid');
const careerSearch = document.getElementById('careerSearch');
const collegeSearch = document.getElementById('collegeSearch');
const comparisonSection = document.getElementById('comparisonSection');
const comparisonGrid = document.getElementById('comparisonGrid');
const roadmapDisplay = document.getElementById('roadmapDisplay');

// API Base URL - works for both local and production
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:4000/api' 
    : '/api';

// Carousel functionality
let currentSlideIndex = 0;
let slideInterval;

function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Auto-slide every 5 seconds
    slideInterval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }, 5000);
    
    // Show first slide
    showSlide(0);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    
    currentSlideIndex = index;
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    showSlide(currentSlideIndex);
    
    // Reset auto-slide timer
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }, 5000);
}

function currentSlide(index) {
    showSlide(index - 1);
    
    // Reset auto-slide timer
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % document.querySelectorAll('.carousel-slide').length;
        showSlide(currentSlideIndex);
    }, 5000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeCarousel();
});

function initializeApp() {
    console.log('Initializing Career Guidance App...');
    
    // Load careers data
    loadCareers();
    
    // Load colleges data
    loadColleges();
    
    // Load roadmaps data
    loadRoadmaps();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if user is already logged in
    checkAuthStatus();
    
    console.log('App initialized successfully');
}

function setupEventListeners() {
    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Authentication modal
    if (loginBtn) loginBtn.addEventListener('click', () => openAuthModal('login'));
    if (registerBtn) registerBtn.addEventListener('click', () => openAuthModal('register'));
    if (getStartedBtn) getStartedBtn.addEventListener('click', () => openAuthModal('register'));
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
    
    // Authentication forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Tab switching in auth modal
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', switchAuthTab);
    });
    
    // Career filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const level = e.target.dataset.level;
            filterCareers(level);
        });
    });
    
    // Search functionality
    if (careerSearch) {
        careerSearch.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            filterAndDisplayCareers();
        });
    }
    
    // College search functionality
    if (collegeSearch) {
        collegeSearch.addEventListener('input', (e) => {
            collegeSearchQuery = e.target.value.toLowerCase();
            filterAndDisplayColleges();
        });
    }
    
    // College filters
    document.querySelectorAll('.college-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterType = e.target.dataset.region || e.target.dataset.type;
            const filterCategory = e.target.dataset.region ? 'region' : 'type';
            
            // Update active button
            document.querySelectorAll(`[data-${filterCategory}]`).forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update filter
            currentCollegeFilter[filterCategory] = filterType;
            filterAndDisplayColleges();
        });
    });
    
    // Contact form
    document.querySelector('.contact-form').addEventListener('submit', handleContactForm);
    
    // Newsletter form
    document.querySelector('.newsletter-form').addEventListener('submit', handleNewsletter);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Navigation
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Authentication Functions
function openAuthModal(tab = 'login') {
    console.log('Opening auth modal with tab:', tab);
    
    if (!authModal) {
        console.error('Auth modal not found');
        return;
    }
    
    authModal.style.display = 'block';
    
    const tabButton = document.querySelector(`[data-tab="${tab}"]`);
    if (tabButton) {
        switchAuthTab({ target: tabButton });
    } else {
        console.error('Tab button not found:', tab);
    }
}

function closeModals() {
    authModal.style.display = 'none';
    careerModal.style.display = 'none';
    collegeModal.style.display = 'none';
}

function switchAuthTab(e) {
    const targetTab = e.target.dataset.tab;
    console.log('Switching to tab:', targetTab);
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Show/hide forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.style.display = targetTab === 'login' ? 'block' : 'none';
        registerForm.style.display = targetTab === 'register' ? 'block' : 'none';
    } else {
        console.error('Forms not found:', { loginForm: !!loginForm, registerForm: !!registerForm });
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Get form values
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                showMessage('Server not found. Please check if the server is running.', 'error');
                return;
            }
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            window.currentUser = data.user;
            
            showMessage('Login successful!', 'success');
            closeModals();
            updateAuthUI();
            
            // Reset form
            e.target.reset();
            
            // Add a test dashboard link temporarily
            setTimeout(() => {
                const testLink = document.createElement('div');
                testLink.innerHTML = `<a href="/dashboard" style="position:fixed;top:100px;right:20px;background:#0056b3;color:white;padding:10px;border-radius:5px;text-decoration:none;z-index:9999;">Go to Dashboard</a>`;
                document.body.appendChild(testLink);
                
                setTimeout(() => {
                    testLink.remove();
                }, 5000);
            }, 1000);
        } else {
            showMessage(data.message || 'Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error.message.includes('Failed to fetch')) {
            showMessage('Cannot connect to server. Please check if the server is running on port 4000.', 'error');
        } else {
            showMessage('Network error. Please try again.', 'error');
        }
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Get form values
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const grade = document.getElementById('registerGrade').value;
    const interests = document.getElementById('registerInterests').value.trim();
    
    // Basic validation
    if (!username || !email || !password || !grade) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    if (username.length < 3) {
        showMessage('Username must be at least 3 characters long', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                grade,
                interests: interests ? interests.split(',').map(i => i.trim()).filter(i => i) : []
            })
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                showMessage('Server not found. Please check if the server is running.', 'error');
                return;
            }
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            window.currentUser = data.user;
            
            showMessage('Registration successful! Welcome to Career Guidance!', 'success');
            closeModals();
            updateAuthUI();
            
            // Reset form
            e.target.reset();
            
            // Add a test dashboard link temporarily
            setTimeout(() => {
                const testLink = document.createElement('div');
                testLink.innerHTML = `<a href="/dashboard" style="position:fixed;top:100px;right:20px;background:#0056b3;color:white;padding:10px;border-radius:5px;text-decoration:none;z-index:9999;">Go to Dashboard</a>`;
                document.body.appendChild(testLink);
                
                setTimeout(() => {
                    testLink.remove();
                }, 5000);
            }, 1000);
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        if (error.message.includes('Failed to fetch')) {
            showMessage('Cannot connect to server. Please check if the server is running on port 4000.', 'error');
        } else {
            showMessage('Network error. Please try again.', 'error');
        }
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            currentUser = JSON.parse(user);
            window.currentUser = currentUser;
            updateAuthUI();
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    if (currentUser && loginBtn && registerBtn) {
        // Replace auth buttons with avatar
        const navMenu = document.getElementById('nav-menu');
        
        // Remove existing auth buttons
        loginBtn.remove();
        registerBtn.remove();
        
        // Add avatar with dropdown
        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'auth-container';
        avatarContainer.innerHTML = `
            <div class="user-menu">
                <div class="user-avatar" onclick="toggleUserMenu()" title="${currentUser.username}">
                    ${currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div class="user-dropdown" id="userDropdown" style="display: none;">
                    <div class="dropdown-item" onclick="goToDashboard()">
                        <i class="fas fa-tachometer-alt"></i> Dashboard
                    </div>
                    <div class="dropdown-item" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </div>
                </div>
            </div>
        `;
        
        console.log('Avatar created for user:', currentUser.username);
        
        navMenu.appendChild(avatarContainer);
        
        console.log('Avatar added to navigation');
        
        // Add avatar styles
        if (!document.getElementById('avatar-styles')) {
            const style = document.createElement('style');
            style.id = 'avatar-styles';
            style.textContent = `
                .auth-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .user-menu {
                    position: relative;
                }
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #3498db;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background 0.3s;
                    font-size: 1.2rem;
                }
                .user-avatar:hover {
                    background: #2980b9;
                }
                .user-dropdown {
                    position: absolute;
                    top: 50px;
                    right: 0;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    min-width: 150px;
                    z-index: 1000;
                }
                .dropdown-item {
                    padding: 12px 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #333;
                    transition: background 0.2s;
                }
                .dropdown-item:hover {
                    background: #f8f9fa;
                }
                .dropdown-item:first-child {
                    border-radius: 8px 8px 0 0;
                }
                .dropdown-item:last-child {
                    border-radius: 0 0 8px 8px;
                }
            `;
            document.head.appendChild(style);
        }
    } else if (!currentUser) {
        // Reset to original state - remove avatar and add back auth buttons
        const authContainer = document.querySelector('.auth-container');
        if (authContainer) {
            authContainer.remove();
        }
        
        const navMenu = document.getElementById('nav-menu');
        if (navMenu && !document.getElementById('loginBtn')) {
            const loginButton = document.createElement('button');
            loginButton.className = 'auth-btn';
            loginButton.id = 'loginBtn';
            loginButton.textContent = 'Login';
            loginButton.onclick = () => openAuthModal('login');
            
            const registerButton = document.createElement('button');
            registerButton.className = 'auth-btn';
            registerButton.id = 'registerBtn';
            registerButton.textContent = 'Register';
            registerButton.onclick = () => openAuthModal('register');
            
            navMenu.appendChild(loginButton);
            navMenu.appendChild(registerButton);
        }
    }
}

function goToDashboard() {
    console.log('Navigating to dashboard...');
    
    // Close dropdown first
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
    
    // Navigate to dashboard
    window.location.href = '/dashboard';
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    window.currentUser = null;
    updateAuthUI();
    showMessage('Logged out successfully', 'success');
    
    // Reload page to reset state
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Career Functions
async function loadCareers() {
    try {
        if (careersGrid) showLoading(careersGrid);
        
        const response = await fetch(`${API_BASE_URL}/careers`);
        const data = await response.json();
        
        if (response.ok) {
            careers = data;
            displayCareers(careers);
        } else {
            console.error('Failed to load careers from API, using fallback');
            careers = getFallbackCareers();
            displayCareers(careers);
        }
    } catch (error) {
        console.error('Error loading careers:', error);
        careers = getFallbackCareers();
        displayCareers(careers);
    }
}

function getFallbackCareers() {
    return [
        {
            _id: '1',
            title: 'Engineering',
            description: 'Engineering is the application of scientific and mathematical principles to design, build, and maintain structures, machines, devices, systems, and processes.',
            educationLevel: '12th',
            subjects: ['Physics', 'Chemistry', 'Mathematics'],
            skills: ['Problem Solving', 'Analytical Thinking', 'Technical Skills'],
            salary: '₹3-15 LPA (Entry Level), ₹8-25 LPA (Mid-Level)',
            duration: '4 years (B.Tech/B.E.)',
            requirements: ['12th with PCM', 'JEE Main/Advanced'],
            opportunities: ['Software Engineer', 'Mechanical Engineer', 'Civil Engineer']
        },
        {
            _id: '2',
            title: 'Medical',
            description: 'Medicine is the science and practice of diagnosing, treating, and preventing diseases.',
            educationLevel: '12th',
            subjects: ['Physics', 'Chemistry', 'Biology'],
            skills: ['Patient Care', 'Diagnostic Skills', 'Communication'],
            salary: '₹5-20 LPA (Resident), ₹15-40 LPA (General Physician)',
            duration: '5.5 years (MBBS)',
            requirements: ['12th with PCB', 'NEET qualification'],
            opportunities: ['General Physician', 'Surgeon', 'Specialist']
        },
        {
            _id: '3',
            title: 'Commerce',
            description: 'Commerce encompasses the study of business, economics, finance, and trade.',
            educationLevel: '12th',
            subjects: ['Accountancy', 'Business Studies', 'Economics'],
            skills: ['Financial Analysis', 'Business Acumen', 'Communication'],
            salary: '₹3-12 LPA (Entry Level), ₹8-20 LPA (Mid-Level)',
            duration: '3 years (B.Com)',
            requirements: ['12th with Commerce/Arts', 'Strong mathematical skills'],
            opportunities: ['Chartered Accountant', 'Business Analyst', 'Financial Advisor']
        }
    ];
}

function displayCareers(careersToShow) {
    if (!careersGrid) return;
    
    careersGrid.innerHTML = '';
    
    if (careersToShow.length === 0) {
        careersGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No careers found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    careersToShow.forEach(career => {
        const careerCard = document.createElement('div');
        careerCard.className = 'career-card';
        careerCard.innerHTML = `
            <div class="career-header">
                <div class="career-icon">
                    <i class="fas ${getCareerIcon(career.title)}"></i>
                </div>
                <div class="career-title-section">
                    <h3>${career.title}</h3>
                    <span class="education-level">After ${career.educationLevel}</span>
                </div>
                <button class="expand-btn" onclick="toggleCareerDetails(this)">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="career-summary">
                <p>${career.description.substring(0, 150)}${career.description.length > 150 ? '...' : ''}</p>
                <div class="career-highlights">
                    <div class="highlight">
                        <i class="fas fa-clock"></i>
                        <span>${career.duration}</span>
                    </div>
                    <div class="highlight">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>${career.salary}</span>
                    </div>
                </div>
            </div>
            <div class="career-details" style="display: none;">
                <div class="detail-section">
                    <h4><i class="fas fa-book"></i> Subjects Required</h4>
                    <div class="tags">
                        ${career.subjects.map(subject => `<span class="tag">${subject}</span>`).join('')}
                    </div>
                </div>
                <div class="detail-section">
                    <h4><i class="fas fa-tools"></i> Skills Needed</h4>
                    <div class="tags">
                        ${career.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="detail-section">
                    <h4><i class="fas fa-clipboard-check"></i> Requirements</h4>
                    <ul class="requirements-list">
                        ${career.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h4><i class="fas fa-briefcase"></i> Career Opportunities</h4>
                    <div class="opportunities-grid">
                        ${career.opportunities.map(opp => `<span class="opportunity">${opp}</span>`).join('')}
                    </div>
                </div>
                <div class="career-actions">
                    <button class="btn btn-primary" onclick="showCareerDetails('${career._id}')">
                        <i class="fas fa-info-circle"></i> Learn More
                    </button>
                    <button class="btn btn-secondary" onclick="saveCareer('${career._id}')">
                        <i class="fas fa-bookmark"></i> Save
                    </button>
                    <button class="btn btn-outline" onclick="addToComparison('${career._id}')">
                        <i class="fas fa-balance-scale"></i> Compare
                    </button>
                </div>
            </div>
        `;
        careersGrid.appendChild(careerCard);
    });
}

function toggleCareerDetails(button) {
    const careerCard = button.closest('.career-card');
    const details = careerCard.querySelector('.career-details');
    const icon = button.querySelector('i');
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        icon.className = 'fas fa-chevron-up';
        careerCard.classList.add('expanded');
    } else {
        details.style.display = 'none';
        icon.className = 'fas fa-chevron-down';
        careerCard.classList.remove('expanded');
    }
}

function getCareerIcon(careerTitle) {
    const iconMap = {
        'Engineering': 'fa-cogs',
        'Medical': 'fa-user-md',
        'Commerce': 'fa-chart-line',
        'Arts & Humanities': 'fa-palette',
        'ITI (Industrial Training Institute)': 'fa-wrench',
        'Polytechnic': 'fa-tools',
        'Hotel Management': 'fa-hotel',
        'Design': 'fa-paint-brush',
        'Law': 'fa-balance-scale',
        'Agriculture': 'fa-seedling',
        'Aviation': 'fa-plane',
        'Fashion Technology': 'fa-tshirt',
        'Media & Journalism': 'fa-newspaper',
        'Psychology': 'fa-brain',
        'Environmental Science': 'fa-leaf'
    };
    return iconMap[careerTitle] || 'fa-graduation-cap';
}

async function filterAndDisplayCareers() {
    try {
        if (careersGrid) showLoading(careersGrid);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (currentFilter !== 'all') {
            params.append('level', currentFilter);
        }
        if (searchQuery) {
            params.append('search', searchQuery);
        }
        
        const response = await fetch(`${API_BASE_URL}/careers?${params}`);
        const data = await response.json();
        
        if (response.ok) {
            displayCareers(data);
        } else {
            showMessage('Failed to filter careers', 'error');
        }
    } catch (error) {
        console.error('Error filtering careers:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

function filterCareers(level) {
    currentFilter = level;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    filterAndDisplayCareers();
}

function selectLevel(level) {
    filterCareers(level);
    scrollToSection('careers');
}

async function showCareerDetails(careerId) {
    const career = careers.find(c => c._id === careerId);
    if (!career) return;
    
    const modalContent = document.getElementById('careerDetailContent');
    modalContent.innerHTML = `
        <div class="career-detail-header">
            <h2 class="career-detail-title">${career.title}</h2>
            <p class="career-detail-level">After ${career.educationLevel}</p>
        </div>
        
        <div class="career-detail-section">
            <h3>Description</h3>
            <p>${career.description}</p>
        </div>
        
        <div class="career-detail-section">
            <h3>Key Information</h3>
            <div class="career-detail-grid">
                <div class="career-detail-item">
                    <h4>Duration</h4>
                    <p>${career.duration}</p>
                </div>
                <div class="career-detail-item">
                    <h4>Salary Range</h4>
                    <p>${career.salary}</p>
                </div>
                <div class="career-detail-item">
                    <h4>Education Level</h4>
                    <p>After ${career.educationLevel}</p>
                </div>
            </div>
        </div>
        
        <div class="career-detail-section">
            <h3>Subjects</h3>
            <ul class="career-detail-list">
                ${career.subjects.map(subject => `<li>${subject}</li>`).join('')}
            </ul>
        </div>
        
        <div class="career-detail-section">
            <h3>Required Skills</h3>
            <ul class="career-detail-list">
                ${career.skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
        </div>
        
        <div class="career-detail-section">
            <h3>Requirements</h3>
            <ul class="career-detail-list">
                ${career.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        </div>
        
        <div class="career-detail-section">
            <h3>Career Opportunities</h3>
            <ul class="career-detail-list">
                ${career.opportunities.map(opp => `<li>${opp}</li>`).join('')}
            </ul>
        </div>
    `;
    
    careerModal.style.display = 'block';
}

// Utility Functions
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the body
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form Handlers
function handleContactForm(e) {
    e.preventDefault();
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;
    fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    })
    .then(res => {
        if (res.ok) {
            showMessage('Thank you for your message! We will get back to you soon.', 'success');
            e.target.reset();
        } else {
            showMessage('Failed to send message. Please try again.', 'error');
        }
    })
    .catch(() => {
        showMessage('Network error. Please try again.', 'error');
    });
}

function handleNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    showMessage(`Thank you for subscribing with ${email}!`, 'success');
    e.target.reset();
}

// Search functionality
function searchCareers(query) {
    if (!query.trim()) {
        displayCareers(careers);
        return;
    }
    
    const filteredCareers = careers.filter(career => 
        career.title.toLowerCase().includes(query.toLowerCase()) ||
        career.description.toLowerCase().includes(query.toLowerCase()) ||
        career.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
    
    displayCareers(filteredCareers);
}

// Add search functionality to the page
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search careers...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 25px;
        margin-bottom: 2rem;
        font-family: inherit;
        transition: border-color 0.3s ease;
    `;
    
    searchInput.addEventListener('input', (e) => {
        searchCareers(e.target.value);
    });
    
    // Insert search input before careers grid
    const careersSection = document.querySelector('.careers .container');
    careersSection.insertBefore(searchInput, careersGrid);
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    addSearchFunctionality();
});

// Add some interactive animations
function addAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.career-card, .feature-card, .level-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    addAnimations();
});

// Add keyboard navigation for modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModals();
    }
});

// Add smooth scrolling for all internal links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add responsive navigation
function setupResponsiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

// Initialize responsive navigation
document.addEventListener('DOMContentLoaded', function() {
    setupResponsiveNav();
});

// Add career recommendation based on user interests
function getCareerRecommendations() {
    if (!currentUser || !currentUser.interests) return [];
    
    const userInterests = currentUser.interests.map(interest => interest.toLowerCase());
    
    return careers.filter(career => 
        career.skills.some(skill => 
            userInterests.some(interest => 
                skill.toLowerCase().includes(interest) || 
                interest.includes(skill.toLowerCase())
            )
        )
    ).slice(0, 3);
}

// Display recommendations if user is logged in
function displayRecommendations() {
    if (!currentUser) return;
    
    const recommendations = getCareerRecommendations();
    if (recommendations.length === 0) return;
    
    const recommendationsSection = document.createElement('section');
    recommendationsSection.className = 'recommendations';
    recommendationsSection.innerHTML = `
        <div class="container">
            <h2>Recommended for You</h2>
            <div class="careers-grid">
                ${recommendations.map(career => `
                    <div class="career-card recommended" onclick="showCareerDetails('${career._id}')">
                        <div class="career-header">
                            <h3 class="career-title">${career.title}</h3>
                            <p class="career-level">After ${career.educationLevel}</p>
                        </div>
                        <div class="career-body">
                            <p class="career-description">${career.description}</p>
                            <button class="view-details">View Details</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Insert after education levels section
    const educationSection = document.querySelector('.education-levels');
    educationSection.parentNode.insertBefore(recommendationsSection, educationSection.nextSibling);
}

// Initialize recommendations
document.addEventListener('DOMContentLoaded', function() {
    // Check for recommendations after a short delay to ensure user data is loaded
    setTimeout(displayRecommendations, 1000);
});

function addToComparison(careerId) {
    const career = careers.find(c => c._id === careerId);
    if (!career) return;
    
    if (comparisonCareers.length >= 3) {
        showMessage('You can compare up to 3 careers at a time. Remove one to add another.', 'error');
        return;
    }
    
    if (comparisonCareers.find(c => c._id === careerId)) {
        showMessage('This career is already in your comparison.', 'error');
        return;
    }
    
    comparisonCareers.push(career);
    updateComparisonSection();
    showMessage(`${career.title} added to comparison`, 'success');
}

function removeFromComparison(careerId) {
    comparisonCareers = comparisonCareers.filter(c => c._id !== careerId);
    updateComparisonSection();
}

function clearComparison() {
    comparisonCareers = [];
    updateComparisonSection();
    showMessage('Comparison cleared', 'success');
}

function updateComparisonSection() {
    if (comparisonCareers.length === 0) {
        comparisonSection.style.display = 'none';
        return;
    }
    
    comparisonSection.style.display = 'block';
    comparisonGrid.innerHTML = comparisonCareers.map(career => `
        <div class="comparison-card">
            <div class="comparison-header">
                <h4>${career.title}</h4>
                <button class="remove-comparison" onclick="removeFromComparison('${career._id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="comparison-content">
                <div class="comparison-item">
                    <strong>Duration:</strong> ${career.duration}
                </div>
                <div class="comparison-item">
                    <strong>Salary:</strong> ${career.salary}
                </div>
                <div class="comparison-item">
                    <strong>Subjects:</strong> ${career.subjects.slice(0, 3).join(', ')}${career.subjects.length > 3 ? '...' : ''}
                </div>
                <div class="comparison-item">
                    <strong>Skills:</strong> ${career.skills.slice(0, 3).join(', ')}${career.skills.length > 3 ? '...' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function saveCareer(careerId) {
    if (!currentUser) {
        showMessage('Please login to save careers', 'error');
        return;
    }
    
    const savedCareers = JSON.parse(localStorage.getItem('savedCareers') || '[]');
    const career = careers.find(c => c._id === careerId);
    
    if (savedCareers.find(c => c._id === careerId)) {
        showMessage('Career already saved', 'error');
        return;
    }
    
    savedCareers.push(career);
    localStorage.setItem('savedCareers', JSON.stringify(savedCareers));
    showMessage(`${career.title} saved to your list`, 'success');
}

// College Functions
async function loadColleges() {
    try {
        const response = await fetch(`${API_BASE_URL}/colleges`);
        if (response.ok) {
            colleges = await response.json();
            displayColleges(colleges);
        } else {
            console.error('Failed to load colleges from API, using fallback');
            colleges = getFallbackColleges();
            displayColleges(colleges);
        }
    } catch (error) {
        console.error('Error loading colleges:', error);
        colleges = getFallbackColleges();
        displayColleges(colleges);
    }
}

function getFallbackColleges() {
    return [
        {
            _id: '1',
            name: 'IIT Bombay',
            location: 'Mumbai',
            region: 'Mumbai',
            type: 'Government',
            nirfRank: 3,
            established: 1958,
            specializations: ['Computer Science', 'Mechanical', 'Electrical'],
            mhtcetCutoffs: { computer: 99.9, mechanical: 99.5, electrical: 99.3 },
            fees: { government: '₹2-3 LPA', private: 'N/A', nri: '₹10-12 LPA' },
            placement: { averagePackage: '₹18 LPA', highestPackage: '₹1.5 Cr', placementPercentage: '95%', topRecruiters: ['Google', 'Microsoft', 'Amazon'] },
            facilities: ['Hostel', 'Library', 'Labs', 'Sports Complex']
        },
        {
            _id: '2',
            name: 'VJTI Mumbai',
            location: 'Mumbai',
            region: 'Mumbai',
            type: 'Government',
            nirfRank: 45,
            established: 1887,
            specializations: ['Computer Science', 'IT', 'Mechanical'],
            mhtcetCutoffs: { computer: 99.2, mechanical: 98.5, electrical: 98.0 },
            fees: { government: '₹1-2 LPA', private: 'N/A', nri: '₹5-6 LPA' },
            placement: { averagePackage: '₹12 LPA', highestPackage: '₹50 LPA', placementPercentage: '90%', topRecruiters: ['TCS', 'Infosys', 'L&T'] },
            facilities: ['Library', 'Labs', 'Cafeteria', 'Sports']
        }
    ];
}

function displayColleges(collegesToShow) {
    if (!collegesGrid) return;
    
    collegesGrid.innerHTML = '';
    
    if (collegesToShow.length === 0) {
        collegesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-university"></i>
                <h3>No colleges found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    collegesToShow.forEach(college => {
        const collegeCard = document.createElement('div');
        collegeCard.className = 'college-card';
        collegeCard.innerHTML = `
            <div class="college-header">
                <div class="college-badge ${college.type.toLowerCase()}">
                    <span>${college.type}</span>
                </div>
                <div class="college-rank">
                    <i class="fas fa-trophy"></i>
                    <span>NIRF Rank: ${college.nirfRank || 'N/A'}</span>
                </div>
            </div>
            <div class="college-content">
                <h3 class="college-name">${college.name}</h3>
                <div class="college-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${college.location}, ${college.region}</span>
                </div>
                <div class="college-established">
                    <i class="fas fa-calendar"></i>
                    <span>Established: ${college.established}</span>
                </div>
                <div class="college-highlights">
                    <div class="highlight">
                        <i class="fas fa-graduation-cap"></i>
                        <span>${college.specializations.length} Specializations</span>
                    </div>
                    <div class="highlight">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>Avg: ${college.placement.averagePackage}</span>
                    </div>
                    <div class="highlight">
                        <i class="fas fa-percentage"></i>
                        <span>${college.placement.placementPercentage} Placement</span>
                    </div>
                </div>
                <div class="college-cutoffs">
                    <h4>MHT-CET Cutoffs (Previous Year)</h4>
                    <div class="cutoff-grid">
                        ${Object.entries(college.mhtcetCutoffs)
                            .filter(([_, cutoff]) => cutoff > 0)
                            .map(([branch, cutoff]) => `
                                <div class="cutoff-item">
                                    <span class="branch">${getBranchName(branch)}</span>
                                    <span class="cutoff">${cutoff}%</span>
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>
            <div class="college-actions">
                <button class="btn btn-primary" onclick="showCollegeDetails('${college._id}')">
                    <i class="fas fa-info-circle"></i> View Details
                </button>
                <button class="btn btn-secondary" onclick="saveCollege('${college._id}')">
                    <i class="fas fa-bookmark"></i> Save
                </button>
            </div>
        `;
        collegesGrid.appendChild(collegeCard);
    });
}

function getBranchName(branch) {
    const branchNames = {
        computer: 'Computer',
        mechanical: 'Mechanical',
        electrical: 'Electrical',
        civil: 'Civil',
        it: 'IT',
        ai: 'AI/ML',
        dataScience: 'Data Science'
    };
    return branchNames[branch] || branch;
}

async function filterAndDisplayColleges() {
    try {
        if (collegesGrid) showLoading(collegesGrid);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (currentCollegeFilter.region !== 'all') {
            params.append('region', currentCollegeFilter.region);
        }
        if (currentCollegeFilter.type !== 'all') {
            params.append('type', currentCollegeFilter.type);
        }
        if (collegeSearchQuery) {
            params.append('search', collegeSearchQuery);
        }
        
        const response = await fetch(`${API_BASE_URL}/colleges?${params}`);
        const data = await response.json();
        
        if (response.ok) {
            displayColleges(data);
        } else {
            showMessage('Failed to filter colleges', 'error');
        }
    } catch (error) {
        console.error('Error filtering colleges:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

async function showCollegeDetails(collegeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/college/${collegeId}`);
        if (response.ok) {
            const college = await response.json();
            displayCollegeModal(college);
        } else {
            showMessage('Failed to load college details', 'error');
        }
    } catch (error) {
        showMessage('Error loading college details', 'error');
    }
}

function displayCollegeModal(college) {
    const content = document.getElementById('collegeDetailContent');
    content.innerHTML = `
        <div class="college-detail-header">
            <h2>${college.name}</h2>
            <div class="college-meta">
                <span class="college-type ${college.type.toLowerCase()}">${college.type}</span>
                <span class="college-rank">NIRF Rank: ${college.nirfRank || 'N/A'}</span>
            </div>
        </div>
        
        <div class="college-detail-content">
            <div class="detail-section">
                <h3><i class="fas fa-map-marker-alt"></i> Location & Contact</h3>
                <p><strong>Address:</strong> ${college.address}</p>
                <p><strong>Contact:</strong> ${college.contact}</p>
                <p><strong>Website:</strong> <a href="${college.website}" target="_blank">${college.website}</a></p>
                <p><strong>Established:</strong> ${college.established}</p>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-graduation-cap"></i> Specializations</h3>
                <div class="specializations-grid">
                    ${college.specializations.map(spec => `<span class="specialization">${spec}</span>`).join('')}
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-chart-line"></i> MHT-CET Cutoffs (Previous Year)</h3>
                <div class="cutoffs-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Branch</th>
                                <th>Cutoff (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(college.mhtcetCutoffs)
                                .filter(([_, cutoff]) => cutoff > 0)
                                .map(([branch, cutoff]) => `
                                    <tr>
                                        <td>${getBranchName(branch)}</td>
                                        <td>${cutoff}%</td>
                                    </tr>
                                `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-money-bill-wave"></i> Fee Structure</h3>
                <div class="fees-grid">
                    <div class="fee-item">
                        <span class="fee-type">Government Quota</span>
                        <span class="fee-amount">${college.fees.government}</span>
                    </div>
                    <div class="fee-item">
                        <span class="fee-type">Private Quota</span>
                        <span class="fee-amount">${college.fees.private}</span>
                    </div>
                    <div class="fee-item">
                        <span class="fee-type">NRI Quota</span>
                        <span class="fee-amount">${college.fees.nri}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-briefcase"></i> Placement Information</h3>
                <div class="placement-grid">
                    <div class="placement-item">
                        <span class="placement-label">Average Package</span>
                        <span class="placement-value">${college.placement.averagePackage}</span>
                    </div>
                    <div class="placement-item">
                        <span class="placement-label">Highest Package</span>
                        <span class="placement-value">${college.placement.highestPackage}</span>
                    </div>
                    <div class="placement-item">
                        <span class="placement-label">Placement Percentage</span>
                        <span class="placement-value">${college.placement.placementPercentage}</span>
                    </div>
                </div>
                <div class="recruiters">
                    <h4>Top Recruiters</h4>
                    <div class="recruiters-grid">
                        ${college.placement.topRecruiters.map(recruiter => `<span class="recruiter">${recruiter}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-clipboard-list"></i> Admission Process</h3>
                <ol class="process-list">
                    ${college.admissionProcess.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-file-alt"></i> Required Documents</h3>
                <ul class="documents-list">
                    ${college.documents.map(doc => `<li>${doc}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-calendar-alt"></i> Important Dates</h3>
                <ul class="dates-list">
                    ${college.importantDates.map(date => `<li>${date}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-building"></i> Facilities</h3>
                <div class="facilities-grid">
                    ${college.facilities.map(facility => `<span class="facility">${facility}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    collegeModal.style.display = 'block';
}

function saveCollege(collegeId) {
    if (!currentUser) {
        showMessage('Please login to save colleges', 'error');
        return;
    }
    
    const savedColleges = JSON.parse(localStorage.getItem('savedColleges') || '[]');
    const college = colleges.find(c => c._id === collegeId);
    
    if (savedColleges.find(c => c._id === collegeId)) {
        showMessage('College already saved', 'error');
        return;
    }
    
    savedColleges.push(college);
    localStorage.setItem('savedColleges', JSON.stringify(savedColleges));
    showMessage(`${college.name} saved to your list`, 'success');
}

// Roadmap Functions
async function loadRoadmaps() {
    try {
        const response = await fetch(`${API_BASE_URL}/roadmaps`);
        if (response.ok) {
            roadmaps = await response.json();
        } else {
            console.error('Failed to load roadmaps');
        }
    } catch (error) {
        console.error('Error loading roadmaps:', error);
    }
}

async function generateRoadmap() {
    const currentPosition = document.getElementById('currentPosition').value;
    const careerGoal = document.getElementById('careerGoal').value;
    
    if (!currentPosition || !careerGoal) {
        showMessage('Please select both current position and career goal', 'error');
        return;
    }
    
    console.log('Generating roadmap for:', { currentPosition, careerGoal });
    
    try {
        // First try personalized endpoint
        const response = await fetch(`${API_BASE_URL}/roadmaps/personalized`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                careerTitle: careerGoal,
                currentPosition: currentPosition
            })
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const roadmap = await response.json();
            console.log('Roadmap data:', roadmap);
            displayRoadmap(roadmap);
        } else {
            // Fallback: try to find roadmap by career title only
            console.log('Personalized endpoint failed, trying general endpoint...');
            const generalResponse = await fetch(`${API_BASE_URL}/roadmaps/${careerGoal}`);
            
            if (generalResponse.ok) {
                const roadmap = await generalResponse.json();
                console.log('Found roadmap via general endpoint:', roadmap);
                displayRoadmap(roadmap);
            } else {
                const errorData = await response.json();
                console.log('Error data:', errorData);
                showMessage('Roadmap not found for this combination. Try different options.', 'error');
            }
        }
    } catch (error) {
        console.error('Error generating roadmap:', error);
        showMessage('Error generating roadmap', 'error');
    }
}

function displayRoadmap(roadmap) {
    // Update roadmap header
    document.getElementById('roadmapTitle').textContent = `Roadmap: ${roadmap.currentPosition} → ${roadmap.targetPosition}`;
    document.getElementById('roadmapDuration').textContent = roadmap.estimatedDuration;
    document.getElementById('roadmapSuccessRate').textContent = roadmap.successRate;
    document.getElementById('roadmapDifficulty').textContent = roadmap.difficulty;
    document.getElementById('roadmapInvestment').textContent = roadmap.investment;
    
    // Display prerequisites
    const prerequisitesList = document.getElementById('prerequisitesList');
    prerequisitesList.innerHTML = roadmap.prerequisites.map(prereq => 
        `<div class="prerequisite-item">
            <i class="fas fa-check-circle"></i>
            <span>${prereq}</span>
        </div>`
    ).join('');
    
    // Display roadmap steps
    const roadmapSteps = document.getElementById('roadmapSteps');
    roadmapSteps.innerHTML = roadmap.roadmap.map(step => `
        <div class="roadmap-step">
            <div class="step-header">
                <div class="step-number">${step.stepNumber}</div>
                <div class="step-info">
                    <h4>${step.title}</h4>
                    <div class="step-meta">
                        <span class="step-duration"><i class="fas fa-clock"></i> ${step.duration}</span>
                    </div>
                </div>
                <button class="step-toggle" onclick="toggleStepDetails(this)">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="step-description">
                <p>${step.description}</p>
            </div>
            <div class="step-details" style="display: none;">
                <div class="detail-section">
                    <h5><i class="fas fa-clipboard-list"></i> Requirements</h5>
                    <ul>
                        ${step.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h5><i class="fas fa-tasks"></i> Tasks</h5>
                    <ul>
                        ${step.tasks.map(task => `<li>${task}</li>`).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h5><i class="fas fa-file-alt"></i> Exams</h5>
                    <ul>
                        ${step.exams.map(exam => `<li>${exam}</li>`).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h5><i class="fas fa-lightbulb"></i> Tips</h5>
                    <ul>
                        ${step.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
    
    // Display alternatives
    const alternativesList = document.getElementById('alternativesList');
    alternativesList.innerHTML = roadmap.alternatives.map(alt => 
        `<div class="alternative-item">
            <i class="fas fa-route"></i>
            <span>${alt}</span>
        </div>`
    ).join('');
    
    // Show roadmap display
    roadmapDisplay.style.display = 'block';
    
    // Scroll to roadmap
    document.getElementById('roadmap').scrollIntoView({ behavior: 'smooth' });
}

function toggleStepDetails(button) {
    const stepDetails = button.closest('.roadmap-step').querySelector('.step-details');
    const icon = button.querySelector('i');
    
    if (stepDetails.style.display === 'none') {
        stepDetails.style.display = 'block';
        icon.className = 'fas fa-chevron-up';
    } else {
        stepDetails.style.display = 'none';
        icon.className = 'fas fa-chevron-down';
    }
}

// Career Assessment Variables
let assessmentQuestions = [];
let currentQuestionIndex = 0;
let assessmentAnswers = {};
let blogs = [];
let currentBlogPage = 1;
let currentBlogCategory = 'all';
let blogSearchQuery = '';

// Assessment Functions
async function loadAssessmentQuestions() {
    // Always use the default questions for ML model
    assessmentQuestions = getDefaultQuestions();
}

function getDefaultQuestions() {
    return [
        {
            id: 1,
            question: "What are your interests?",
            options: [
                { value: "creative_work", text: "Creative Work" },
                { value: "coding", text: "Coding" },
                { value: "social_work", text: "Social Work" },
                { value: "business_ideas", text: "Business Ideas" },
                { value: "science_research", text: "Science Research" }
            ]
        },
        {
            id: 2,
            question: "What is your future vision?",
            options: [
                { value: "corporate_job", text: "Corporate Job" },
                { value: "research_higher_studies", text: "Research/Higher Studies" },
                { value: "government_job", text: "Government Job" },
                { value: "startup", text: "Startup" }
            ]
        },
        {
            id: 3,
            question: "Do you follow current affairs?",
            options: [
                { value: "sometimes", text: "Sometimes" },
                { value: "rarely", text: "Rarely" },
                { value: "yes", text: "Yes" }
            ]
        },
        {
            id: 4,
            question: "What is your career priority?",
            options: [
                { value: "job_security", text: "Job Security" },
                { value: "social_impact", text: "Social Impact" },
                { value: "high_salary", text: "High Salary" },
                { value: "creativity_freedom", text: "Creativity & Freedom" }
            ]
        },
        {
            id: 5,
            question: "What duration are you aiming for?",
            options: [
                { value: "3_years", text: "3 Years" },
                { value: "4_years", text: "4 Years" },
                { value: "5_plus_years", text: "5+ Years" }
            ]
        },
        {
            id: 6,
            question: "What is your favorite subject?",
            options: [
                { value: "arts", text: "Arts" },
                { value: "computer_science", text: "Computer Science" },
                { value: "political_science", text: "Political Science" },
                { value: "physics", text: "Physics" },
                { value: "literature", text: "Literature" },
                { value: "business_studies", text: "Business Studies" },
                { value: "commerce", text: "Commerce" },
                { value: "mathematics", text: "Mathematics" },
                { value: "biology", text: "Biology" },
                { value: "history", text: "History" },
                { value: "economics", text: "Economics" },
                { value: "chemistry", text: "Chemistry" },
                { value: "sociology", text: "Sociology" },
                { value: "english", text: "English" }
            ]
        }
    ];
}

function startAssessment() {
    document.querySelector('.assessment-intro').style.display = 'none';
    document.getElementById('assessmentQuiz').style.display = 'block';
    currentQuestionIndex = 0;
    assessmentAnswers = {};
    
    // Ensure we have questions loaded
    if (assessmentQuestions.length === 0) {
        assessmentQuestions = getDefaultQuestions();
    }
    
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= assessmentQuestions.length) {
        submitAssessment();
        return;
    }

    const question = assessmentQuestions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = assessmentQuestions.length;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Display options
    const optionsContainer = document.getElementById('questionOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const optionBtn = document.createElement('div');
        optionBtn.className = 'option-btn';
        optionBtn.innerHTML = `
            <input type="radio" name="question${question.id}" value="${option.value}" id="option${option.value}${question.id}">
            <label for="option${option.value}${question.id}">${option.text}</label>
        `;
        
        optionBtn.addEventListener('click', () => {
            selectOption(option.value, question.id);
        });
        optionsContainer.appendChild(optionBtn);
    });
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').style.display = currentQuestionIndex === assessmentQuestions.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = currentQuestionIndex === assessmentQuestions.length - 1 ? 'inline-block' : 'none';
    
    // Pre-select if answer exists
    if (assessmentAnswers[question.id]) {
        const radio = document.querySelector(`input[value="${assessmentAnswers[question.id]}"]`);
        if (radio) {
            radio.checked = true;
            radio.closest('.option-btn').classList.add('selected');
        }
    }d('nextBtn').style.display = currentQuestionIndex === assessmentQuestions.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = currentQuestionIndex === assessmentQuestions.length - 1 ? 'inline-block' : 'none';
    
    // Pre-select if answer exists
    if (assessmentAnswers[question.id]) {
        const radio = document.querySelector(`input[value="${assessmentAnswers[question.id]}"]`);
        if (radio) {
            radio.checked = true;
            radio.closest('.option-btn').classList.add('selected');
        }
    }
}

function selectOption(value, questionId) {
    assessmentAnswers[questionId] = value;
    
    // Update UI - remove selected class from all options
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked option
    const selectedRadio = document.querySelector(`input[value="${value}"]`);
    if (selectedRadio) {
        selectedRadio.checked = true;
        selectedRadio.closest('.option-btn').classList.add('selected');
    }
}

function nextQuestion() {
    const question = assessmentQuestions[currentQuestionIndex];
    
    // Check if answer exists for current question
    if (!assessmentAnswers[question.id]) {
        showMessage('Please select an option before proceeding', 'error');
        return;
    }
    
    currentQuestionIndex++;
    displayQuestion();
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

async function submitAssessment() {
    try {
        // Show loading state
        document.getElementById('assessmentQuiz').style.display = 'none';
        showLoadingMessage('Processing your answers with our AI model...');
        
        const response = await fetch(`${API_BASE_URL}/assessment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers: assessmentAnswers })
        });
        
        hideLoadingMessage();
        
        if (response.ok) {
            const result = await response.json();
            console.log('Assessment result:', result);
            
            // Check if we got a valid ML result
            if (result && (result.recommended_course || result.prediction)) {
                // Handle ML API response format
                const formattedResult = {
                    recommended_course: result.recommended_course || result.prediction,
                    confidence: result.confidence || 'High',
                    description: result.description || ''
                };
                displayMLResults(formattedResult);
            } else {
                // Fallback to local assessment if ML fails
                console.log('ML result invalid, using fallback assessment');
                const fallbackResult = generateFallbackAssessment();
                displayMLResults(fallbackResult);
            }
        } else {
            console.log('API request failed, using fallback assessment');
            // Use fallback assessment when API fails
            const fallbackResult = generateFallbackAssessment();
            displayMLResults(fallbackResult);
        }
    } catch (error) {
        console.error('Error submitting assessment:', error);
        hideLoadingMessage();
        
        // Use fallback assessment on network error
        console.log('Network error, using fallback assessment');
        const fallbackResult = generateFallbackAssessment();
        displayMLResults(fallbackResult);
    }
}

function generateFallbackAssessment() {
    // Analyze answers to provide a reasonable recommendation
    const answerValues = Object.values(assessmentAnswers);
    
    // Simple scoring based on answers
    const scores = {
        technical: 0,
        medical: 0,
        business: 0,
        creative: 0
    };
    
    answerValues.forEach(answer => {
        switch(answer) {
            case 'coding':
            case 'computer_science':
            case 'mathematics':
            case 'science_research':
                scores.technical += 2;
                break;
            case 'creative_work':
            case 'arts':
            case 'literature':
                scores.creative += 2;
                break;
            case 'business_ideas':
            case 'commerce':
            case 'startup':
                scores.business += 2;
                break;
            case 'social_work':
            case 'biology':
            case 'chemistry':
                scores.medical += 1;
                break;
        }
    });
    
    // Find the highest scoring category
    const maxScore = Math.max(...Object.values(scores));
    const topCategory = Object.keys(scores).find(key => scores[key] === maxScore);
    
    // Map to course recommendations
    const courseMapping = {
        technical: 'Software Engineering',
        medical: 'Medical',
        business: 'Business Management',
        creative: 'Arts & Design'
    };
    
    const recommendedCourse = courseMapping[topCategory] || 'Software Engineering';
    
    return {
        recommended_course: recommendedCourse,
        confidence: 'High',
        description: `Based on your responses, ${recommendedCourse} appears to be a great fit for your interests and goals.`
    };
}

function generateAssessmentResults(answers) {
    const scores = {
        technical: 0,
        creative: 0,
        social: 0,
        analytical: 0,
        business: 0
    };
    
    Object.values(answers).forEach(answer => {
        switch(answer) {
            case 'science':
            case 'math':
            case 'technology':
            case 'analytical':
            case 'technical':
                scores.technical += 2;
                scores.analytical += 1;
                break;
            case 'arts':
            case 'creative':
            case 'design':
                scores.creative += 2;
                break;
            case 'social':
            case 'communication':
            case 'team':
            case 'human':
                scores.social += 2;
                break;
            case 'commerce':
            case 'business':
            case 'money':
            case 'lead':
                scores.business += 2;
                break;
        }
    });
    
    const maxScore = Math.max(...Object.values(scores));
    const personalityType = Object.keys(scores).find(key => scores[key] === maxScore);
    
    const personalitySummaries = {
        technical: "You have a strong analytical mind and enjoy working with technology, systems, and data. You prefer structured environments where you can solve complex problems using logical thinking.",
        creative: "You are imaginative and innovative, with a natural talent for artistic expression and creative problem-solving. You thrive in environments that allow for creative freedom and expression.",
        social: "You are people-oriented and excel at communication, collaboration, and helping others. You enjoy working in teams and making a positive impact on people's lives.",
        analytical: "You have excellent problem-solving skills and enjoy analyzing data, patterns, and systems. You prefer work that requires critical thinking and logical reasoning.",
        business: "You are goal-oriented and have strong leadership potential. You enjoy strategic thinking, managing resources, and achieving measurable results."
    };
    
    return {
        personalityType,
        personalitySummary: personalitySummaries[personalityType],
        careerRecommendations: getCareerRecommendationsByType(personalityType),
        skillsAnalysis: generateSkillsAnalysis(scores),
        actionPlan: generateActionPlan(personalityType)
    };
}

function getCareerRecommendationsByType(type) {
    const recommendations = {
        technical: [
            { career: "Software Engineer", score: 95, description: "Develop software applications and systems" },
            { career: "Data Scientist", score: 90, description: "Analyze and interpret complex data" },
            { career: "Mechanical Engineer", score: 85, description: "Design and build mechanical systems" },
            { career: "Network Administrator", score: 80, description: "Manage computer networks and systems" }
        ],
        creative: [
            { career: "Graphic Designer", score: 95, description: "Create visual designs and artwork" },
            { career: "Content Writer", score: 90, description: "Write engaging content for various platforms" },
            { career: "UI/UX Designer", score: 85, description: "Design user interfaces and experiences" },
            { career: "Marketing Specialist", score: 80, description: "Create marketing campaigns and strategies" }
        ],
        social: [
            { career: "Teacher", score: 95, description: "Educate and inspire students" },
            { career: "Human Resources Manager", score: 90, description: "Manage people and workplace culture" },
            { career: "Counselor", score: 85, description: "Help people with personal and professional issues" },
            { career: "Sales Representative", score: 80, description: "Build relationships and sell products" }
        ],
        analytical: [
            { career: "Research Analyst", score: 95, description: "Conduct research and analyze data" },
            { career: "Financial Analyst", score: 90, description: "Analyze financial data and trends" },
            { career: "Management Consultant", score: 85, description: "Solve business problems and improve processes" },
            { career: "Statistician", score: 80, description: "Collect and analyze statistical data" }
        ],
        business: [
            { career: "Business Manager", score: 95, description: "Lead and manage business operations" },
            { career: "Entrepreneur", score: 90, description: "Start and run your own business" },
            { career: "Project Manager", score: 85, description: "Plan and execute projects" },
            { career: "Marketing Manager", score: 80, description: "Develop and implement marketing strategies" }
        ]
    };
    
    return recommendations[type] || recommendations.technical;
}

function generateSkillsAnalysis(scores) {
    const skills = [
        { name: "Technical Skills", level: scores.technical },
        { name: "Creative Thinking", level: scores.creative },
        { name: "Communication", level: scores.social },
        { name: "Analytical Thinking", level: scores.analytical },
        { name: "Leadership", level: scores.business }
    ];
    
    return skills.map(skill => ({
        name: skill.name,
        level: Math.min(100, (skill.level / 10) * 100),
        stars: Math.ceil((skill.level / 10) * 5)
    }));
}

function generateActionPlan(type) {
    const plans = {
        technical: [
            { step: 1, title: "Learn Programming", description: "Start with Python or JavaScript to build technical skills" },
            { step: 2, title: "Get Certified", description: "Obtain relevant certifications in your chosen technical field" },
            { step: 3, title: "Build Projects", description: "Create a portfolio of technical projects to showcase your skills" },
            { step: 4, title: "Network", description: "Join technical communities and attend industry events" }
        ],
        creative: [
            { step: 1, title: "Build Portfolio", description: "Create a portfolio showcasing your creative work" },
            { step: 2, title: "Learn Tools", description: "Master industry-standard creative software and tools" },
            { step: 3, title: "Take Courses", description: "Enroll in creative design or art courses" },
            { step: 4, title: "Freelance", description: "Start with freelance projects to gain experience" }
        ],
        social: [
            { step: 1, title: "Volunteer", description: "Volunteer in community organizations to build people skills" },
            { step: 2, title: "Get Certified", description: "Obtain relevant certifications in counseling or HR" },
            { step: 3, title: "Practice Communication", description: "Join public speaking clubs or take communication courses" },
            { step: 4, title: "Gain Experience", description: "Seek internships or entry-level positions in people-oriented roles" }
        ],
        analytical: [
            { step: 1, title: "Learn Analytics", description: "Study data analysis tools and statistical methods" },
            { step: 2, title: "Get Certified", description: "Obtain certifications in data analysis or research methods" },
            { step: 3, title: "Practice Analysis", description: "Work on real-world analytical problems and case studies" },
            { step: 4, title: "Specialize", description: "Choose a specific field for analytical expertise" }
        ],
        business: [
            { step: 1, title: "Study Business", description: "Learn business fundamentals and management principles" },
            { step: 2, title: "Get Experience", description: "Seek internships or entry-level positions in business" },
            { step: 3, title: "Network", description: "Build professional relationships in the business community" },
            { step: 4, title: "Develop Leadership", description: "Take on leadership roles in projects or organizations" }
        ]
    };
    
    return plans[type] || plans.technical;
}

// Helper functions for ML results
function showLoadingMessage(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingMessage';
    loadingDiv.className = 'loading-message';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>${message}</p>
    `;
    document.querySelector('.assessment-container').appendChild(loadingDiv);
}

function hideLoadingMessage() {
    const loadingDiv = document.getElementById('loadingMessage');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showError(message) {
    document.getElementById('assessmentResults').style.display = 'block';
    document.getElementById('assessmentResults').innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="retakeAssessment()">
                <i class="fas fa-redo"></i> Try Again
            </button>
        </div>
    `;
}

function displayMLResults(result) {
    // Ensure we have a valid result object
    if (!result) {
        result = {
            recommended_course: 'Software Engineering',
            confidence: 'Medium',
            description: 'Based on your responses, this field offers good career prospects.'
        };
    }
    
    // Ensure required fields exist
    if (!result.recommended_course) {
        result.recommended_course = 'Software Engineering';
    }
    if (!result.confidence) {
        result.confidence = 'High';
    }
    if (!result.description) {
        result.description = 'This course offers excellent career opportunities and growth potential.';
    }
    
    // Save results to localStorage for dashboard
    const resultWithTimestamp = {
        ...result,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('lastAssessmentResult', JSON.stringify(resultWithTimestamp));
    
    document.getElementById('assessmentResults').style.display = 'block';
    
    // Get detailed career mapping
    const careerMapping = getCareerMapping(result.recommended_course || 'Software Engineering');
    const collegeRecommendations = getCollegeRecommendations(careerMapping.careers);
    
    // Clear previous content and show ML result
    const resultsContainer = document.getElementById('assessmentResults');
    resultsContainer.innerHTML = `
        <div class="ml-results">
            <div class="results-header">
                <h3>🎯 Your Personalized Career Recommendation</h3>
                <p>Based on our AI analysis of your responses</p>
            </div>
            
            <div class="recommendation-card main-recommendation">
                <div class="recommendation-icon">🎓</div>
                <h2>Recommended Course: ${result.recommended_course || 'Not Available'}</h2>
                <div class="confidence-score">
                    <span class="confidence-label">Confidence Score:</span>
                    <span class="confidence-value">${result.confidence || 'High'}</span>
                </div>
                <div class="course-description">
                    <p>${result.description || careerMapping.description || 'This course offers excellent career opportunities and growth potential.'}</p>
                </div>
                <div class="focus-subjects">
                    <h4>Focus Subjects:</h4>
                    <div class="subjects-list">
                        ${careerMapping.subjects.map(subject => `<span class="subject-tag">${subject}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="career-paths-section">
                <h3>💼 Ideal Career Paths</h3>
                <div class="career-paths-grid">
                    ${careerMapping.careers.map(career => `
                        <div class="career-path-card">
                            <h4>${career}</h4>
                            <div class="recommended-colleges">
                                <h5>🏛️ Recommended Colleges:</h5>
                                <ul>
                                    ${collegeRecommendations[career] && collegeRecommendations[career].length > 0 ? 
                                        collegeRecommendations[career].map(college => 
                                            `<li><strong>${college.name}</strong> - ${college.location} (NIRF Rank: ${college.rank})</li>`
                                        ).join('') : 
                                        `<li>General engineering/management colleges recommended</li>`
                                    }
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="next-steps-section">
                <h3>📋 Next Steps</h3>
                <div class="next-steps-list">
                    <div class="step-item">
                        <span class="step-number">1</span>
                        <div class="step-content">
                            <h4>Research the Field</h4>
                            <p>Learn more about ${result.recommended_course || 'your recommended field'} and its career prospects</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <span class="step-number">2</span>
                        <div class="step-content">
                            <h4>Explore Colleges</h4>
                            <p>Check out the recommended colleges and their admission requirements</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <span class="step-number">3</span>
                        <div class="step-content">
                            <h4>Prepare for Entrance Exams</h4>
                            <p>Start preparing for relevant entrance exams based on your chosen path</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="results-actions">
                ${localStorage.getItem('returnToDashboard') ? `
                    <button class="btn btn-primary" onclick="returnToDashboard()">
                        <i class="fas fa-tachometer-alt"></i> View on Dashboard
                    </button>
                ` : ''}
                <button class="btn btn-primary" onclick="exploreCourse('${result.recommended_course || 'Engineering'}')">
                    <i class="fas fa-search"></i> Explore This Course
                </button>
                <button class="btn btn-secondary" onclick="exploreColleges()">
                    <i class="fas fa-university"></i> View Colleges
                </button>
                <button class="btn btn-secondary" onclick="retakeAssessment()">
                    <i class="fas fa-redo"></i> Retake Assessment
                </button>
                <button class="btn btn-outline" onclick="shareMLResults('${result.recommended_course || 'Career Assessment'}')">
                    <i class="fas fa-share"></i> Share Results
                </button>
            </div>
        </div>
    `;
}

function exploreCourse(course) {
    // Redirect to careers section with filter
    const courseMapping = {
        'Software Engineering': '12th',
        'Medical': '12th', 
        'Business Management': '12th',
        'Political Science': '12th'
    };
    
    const level = courseMapping[course] || '12th';
    filterCareers(level);
    document.getElementById('careers').scrollIntoView({ behavior: 'smooth' });
}

function exploreStream(stream) {
    // Redirect to careers section with filter
    const streamMapping = {
        'Science': '12th',
        'Commerce': '12th', 
        'Arts': '12th',
        'Technical': '10th'
    };
    
    const level = streamMapping[stream] || '12th';
    filterCareers(level);
    document.getElementById('careers').scrollIntoView({ behavior: 'smooth' });
}

function exploreColleges() {
    // Redirect to colleges section
    document.getElementById('colleges').scrollIntoView({ behavior: 'smooth' });
}

function getCareerMapping(course) {
    const mappings = {
        'Software Engineering': {
            subjects: ['Computer Science', 'Mathematics', 'Programming', 'Algorithms'],
            careers: ['Software Developer', 'System Architect', 'Tech Lead', 'Product Manager'],
            description: 'Focus on programming, algorithms, and software development. High-demand field with excellent career prospects.'
        },
        'Medical': {
            subjects: ['Biology', 'Chemistry', 'Physics', 'Anatomy'],
            careers: ['Doctor', 'Surgeon', 'Medical Researcher', 'Healthcare Administrator'],
            description: 'Study human biology, medicine, and healthcare. Serve society while having a stable and respected career.'
        },
        'Business Management': {
            subjects: ['Business Studies', 'Economics', 'Finance', 'Marketing'],
            careers: ['Business Manager', 'Entrepreneur', 'Consultant', 'Financial Analyst'],
            description: 'Learn leadership, strategy, and business operations. Great for entrepreneurship and corporate careers.'
        },
        'Political Science': {
            subjects: ['Political Science', 'History', 'Sociology', 'Public Administration'],
            careers: ['Civil Servant', 'Policy Analyst', 'Diplomat', 'Social Worker'],
            description: 'Understand governance, policy, and social systems. Ideal for public service and social impact careers.'
        },
        'Engineering': {
            subjects: ['Physics', 'Chemistry', 'Mathematics', 'Technical Drawing'],
            careers: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Chemical Engineer'],
            description: 'Apply scientific principles to design and build systems. Wide range of specializations available.'
        },
        'Commerce': {
            subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'],
            careers: ['Chartered Accountant', 'Financial Advisor', 'Business Analyst', 'Investment Banker'],
            description: 'Focus on business, finance, and economics. Strong foundation for corporate and entrepreneurial careers.'
        }
    };
    return mappings[course] || mappings['Software Engineering'];
}

function getCollegeRecommendations(careers) {
    // Enhanced college data with better mapping
    const colleges = [
        {name: 'IIT Jammu', location: 'Jammu', rank: 62, specialties: ['Software Developer', 'System Architect', 'Tech Lead', 'Product Manager', 'Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer']},
        {name: 'NIT Srinagar', location: 'Srinagar', rank: 95, specialties: ['Software Developer', 'System Architect', 'Doctor', 'Medical Researcher', 'Mechanical Engineer', 'Civil Engineer']},
        {name: 'University of Jammu', location: 'Jammu', rank: 151, specialties: ['Software Developer', 'Business Manager', 'Consultant', 'Civil Servant', 'Policy Analyst', 'Social Worker', 'Financial Analyst']},
        {name: 'University of Kashmir', location: 'Srinagar', rank: 120, specialties: ['Software Developer', 'Business Manager', 'Entrepreneur', 'Doctor', 'Civil Servant', 'Policy Analyst', 'Diplomat', 'Social Worker']},
        {name: 'SMVDU Katra', location: 'Katra', rank: 150, specialties: ['Software Developer', 'Tech Lead', 'Business Manager', 'Entrepreneur', 'Product Manager', 'Mechanical Engineer']},
        {name: 'Central University of Jammu', location: 'Jammu', rank: 200, specialties: ['Software Developer', 'Business Manager', 'Consultant', 'Civil Servant', 'Policy Analyst', 'Social Worker', 'Financial Analyst']},
        {name: 'Central University of Kashmir', location: 'Ganderbal', rank: 190, specialties: ['Software Developer', 'Business Manager', 'Entrepreneur', 'Doctor', 'Civil Servant', 'Policy Analyst', 'Diplomat', 'Social Worker']},
        {name: 'Government Medical College Jammu', location: 'Jammu', rank: 180, specialties: ['Doctor', 'Surgeon', 'Medical Researcher', 'Healthcare Administrator']},
        {name: 'Government Medical College Srinagar', location: 'Srinagar', rank: 170, specialties: ['Doctor', 'Surgeon', 'Medical Researcher', 'Healthcare Administrator']},
        {name: 'Islamic University of Science & Technology', location: 'Awantipora', rank: 220, specialties: ['Software Developer', 'Business Manager', 'Mechanical Engineer', 'Civil Engineer']}
    ];
    
    const recommendations = {};
    
    careers.forEach(career => {
        recommendations[career] = colleges.filter(college => 
            college.specialties.includes(career)
        ).slice(0, 3); // Top 3 colleges per career
        
        // If no specific matches, provide general recommendations
        if (recommendations[career].length === 0) {
            recommendations[career] = colleges.slice(0, 3);
        }
    });
    
    return recommendations;
}

function returnToDashboard() {
    localStorage.removeItem('returnToDashboard');
    window.location.href = '/dashboard';
}

function shareMLResults(course) {
    const shareText = `I just completed a career assessment and got recommended: ${course}! Check out this career guidance portal.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Career Assessment Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showMessage('Results copied to clipboard!', 'success');
        });
    }
}

function displayAssessmentResults(results) {
    document.getElementById('assessmentQuiz').style.display = 'none';
    document.getElementById('assessmentResults').style.display = 'block';
    
    // Display personality summary
    document.getElementById('personalitySummary').innerHTML = `
        <p><strong>Personality Type:</strong> ${results.personalityType.charAt(0).toUpperCase() + results.personalityType.slice(1)}</p>
        <p>${results.personalitySummary}</p>
    `;
    
    // Display career recommendations
    const recommendationsHtml = results.careerRecommendations.map(career => `
        <div class="recommendation-card">
            <h5>${career.career}</h5>
            <p>${career.description}</p>
            <div class="recommendation-score">
                <div class="score-bar">
                    <div class="score-fill" style="width: ${career.score}%"></div>
                </div>
                <span class="score-text">${career.score}% Match</span>
            </div>
        </div>
    `).join('');
    document.getElementById('careerRecommendations').innerHTML = recommendationsHtml;
    
    // Display skills analysis
    const skillsHtml = results.skillsAnalysis.map(skill => `
        <div class="skill-item">
            <span class="skill-name">${skill.name}</span>
            <div class="skill-level">
                <span class="skill-stars">${'★'.repeat(skill.stars)}${'☆'.repeat(5 - skill.stars)}</span>
                <span class="skill-percentage">${Math.round(skill.level)}%</span>
            </div>
        </div>
    `).join('');
    document.getElementById('skillsAnalysis').innerHTML = skillsHtml;
    
    // Display action plan
    const planHtml = results.actionPlan.map(step => `
        <div class="plan-step">
            <div class="plan-step-number">${step.step}</div>
            <div class="plan-step-content">
                <h5>${step.title}</h5>
                <p>${step.description}</p>
            </div>
        </div>
    `).join('');
    document.getElementById('actionPlan').innerHTML = planHtml;
}

function retakeAssessment() {
    document.getElementById('assessmentResults').style.display = 'none';
    document.querySelector('.assessment-intro').style.display = 'grid';
    currentQuestionIndex = 0;
    assessmentAnswers = {};
}

function downloadReport() {
    const report = generateAssessmentReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-assessment-report.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function generateAssessmentReport() {
    const results = generateAssessmentResults(assessmentAnswers);
    return `
Career Assessment Report
========================

Personality Type: ${results.personalityType}
${results.personalitySummary}

Top Career Recommendations:
${results.careerRecommendations.map(career => `- ${career.career} (${career.score}% match): ${career.description}`).join('\n')}

Skills Analysis:
${results.skillsAnalysis.map(skill => `- ${skill.name}: ${Math.round(skill.level)}%`).join('\n')}

Action Plan:
${results.actionPlan.map(step => `${step.step}. ${step.title}: ${step.description}`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `;
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'My Career Assessment Results',
            text: 'Check out my career assessment results from CareerGuide!',
            url: window.location.href
        });
    } else {
        const results = generateAssessmentResults(assessmentAnswers);
        const shareText = `My Career Assessment Results:\nPersonality Type: ${results.personalityType}\nTop Recommendation: ${results.careerRecommendations[0].career}`;
        
        navigator.clipboard.writeText(shareText).then(() => {
            showMessage('Results copied to clipboard!', 'success');
        });
    }
}

// Blog Functions
async function loadBlogs() {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs?page=${currentBlogPage}&category=${currentBlogCategory}&search=${blogSearchQuery}`);
        if (response.ok) {
            const data = await response.json();
            blogs = data.blogs || [];
            displayBlogs();
        } else {
            blogs = getDefaultBlogs();
            displayBlogs();
        }
    } catch (error) {
        console.error('Error loading blogs:', error);
        blogs = getDefaultBlogs();
        displayBlogs();
    }
}

function getDefaultBlogs() {
    return [
        {
            id: 1,
            title: "How to Choose the Right Career After 12th Standard",
            excerpt: "Making the right career choice after 12th standard is crucial for your future success. Here's a comprehensive guide to help you make an informed decision.",
            content: `
                <h3>Understanding Your Options</h3>
                <p>After completing 12th standard, students have numerous career paths to choose from. The key is to understand your interests, strengths, and the current market trends.</p>
                
                <h3>Popular Career Options</h3>
                <ul>
                    <li><strong>Engineering:</strong> Various branches like Computer, Mechanical, Electrical, Civil</li>
                    <li><strong>Medical:</strong> MBBS, BDS, Nursing, Pharmacy</li>
                    <li><strong>Commerce:</strong> B.Com, CA, CS, BBA</li>
                    <li><strong>Arts:</strong> Journalism, Literature, Psychology, Sociology</li>
                    <li><strong>Design:</strong> Fashion, Interior, Graphic, Web Design</li>
                </ul>
                
                <h3>Factors to Consider</h3>
                <ol>
                    <li><strong>Interest:</strong> Choose a field that genuinely interests you</li>
                    <li><strong>Aptitude:</strong> Consider your natural abilities and strengths</li>
                    <li><strong>Market Demand:</strong> Research job opportunities and growth potential</li>
                    <li><strong>Financial Investment:</strong> Consider the cost of education and training</li>
                    <li><strong>Work-Life Balance:</strong> Think about the lifestyle you want</li>
                </ol>
                
                <h3>Steps to Make the Right Choice</h3>
                <p>1. <strong>Self-Assessment:</strong> Evaluate your interests, skills, and values</p>
                <p>2. <strong>Research:</strong> Gather information about different careers</p>
                <p>3. <strong>Consult:</strong> Talk to professionals and career counselors</p>
                <p>4. <strong>Experience:</strong> Try internships or shadowing opportunities</p>
                <p>5. <strong>Decide:</strong> Make an informed decision based on your research</p>
                
                <h3>Conclusion</h3>
                <p>Choosing the right career is a significant decision that requires careful consideration. Take your time, do thorough research, and don't hesitate to seek guidance from experts.</p>
            `,
            category: "career-tips",
            author: "Career Expert",
            date: "2024-01-15",
            readTime: "5 min read",
            featured: true
        },
        {
            id: 2,
            title: "Latest Updates on MHT-CET 2024",
            excerpt: "Stay updated with the latest information about MHT-CET 2024 including important dates, exam pattern, and preparation tips.",
            content: `
                <h3>MHT-CET 2024 Overview</h3>
                <p>The Maharashtra Common Entrance Test (MHT-CET) is a state-level entrance examination for admission to various professional courses in Maharashtra.</p>
                
                <h3>Important Dates</h3>
                <ul>
                    <li><strong>Application Start Date:</strong> January 2024</li>
                    <li><strong>Application End Date:</strong> March 2024</li>
                    <li><strong>Admit Card Release:</strong> April 2024</li>
                    <li><strong>Exam Date:</strong> May 2024</li>
                    <li><strong>Result Declaration:</strong> June 2024</li>
                </ul>
                
                <h3>Exam Pattern</h3>
                <p>The exam consists of three sections:</p>
                <ul>
                    <li><strong>Physics:</strong> 50 questions (50 marks)</li>
                    <li><strong>Chemistry:</strong> 50 questions (50 marks)</li>
                    <li><strong>Mathematics:</strong> 50 questions (50 marks)</li>
                </ul>
                
                <h3>Preparation Tips</h3>
                <ol>
                    <li>Focus on NCERT textbooks for basic concepts</li>
                    <li>Practice previous year question papers</li>
                    <li>Take regular mock tests</li>
                    <li>Manage your time effectively</li>
                    <li>Stay updated with current affairs</li>
                </ol>
            `,
            category: "exam-updates",
            author: "Exam Expert",
            date: "2024-01-10",
            readTime: "4 min read",
            featured: false
        },
        {
            id: 3,
            title: "Effective Study Techniques for Competitive Exams",
            excerpt: "Discover proven study techniques that can help you excel in competitive exams and achieve your academic goals.",
            content: `
                <h3>The Power of Active Learning</h3>
                <p>Active learning involves engaging with the material rather than passively reading or listening. This approach helps in better retention and understanding.</p>
                
                <h3>Effective Study Techniques</h3>
                <ol>
                    <li><strong>Pomodoro Technique:</strong> Study for 25 minutes, then take a 5-minute break</li>
                    <li><strong>Spaced Repetition:</strong> Review material at increasing intervals</li>
                    <li><strong>Mind Mapping:</strong> Create visual diagrams to connect concepts</li>
                    <li><strong>Practice Testing:</strong> Test yourself regularly on the material</li>
                    <li><strong>Teaching Others:</strong> Explain concepts to friends or family</li>
                </ol>
                
                <h3>Time Management</h3>
                <p>Effective time management is crucial for exam preparation:</p>
                <ul>
                    <li>Create a study schedule</li>
                    <li>Prioritize difficult topics</li>
                    <li>Allocate time for revision</li>
                    <li>Include breaks and rest periods</li>
                </ul>
                
                <h3>Healthy Study Habits</h3>
                <p>Maintain a healthy lifestyle during exam preparation:</p>
                <ul>
                    <li>Get adequate sleep (7-8 hours)</li>
                    <li>Exercise regularly</li>
                    <li>Eat nutritious meals</li>
                    <li>Stay hydrated</li>
                    <li>Take regular breaks</li>
                </ul>
            `,
            category: "study-tips",
            author: "Study Coach",
            date: "2024-01-08",
            readTime: "6 min read",
            featured: false
        },
        {
            id: 4,
            title: "Emerging Career Trends in 2024",
            excerpt: "Explore the latest career trends and job opportunities that are shaping the future of work in 2024 and beyond.",
            content: `
                <h3>Technology-Driven Careers</h3>
                <p>The technology sector continues to dominate with emerging fields like:</p>
                <ul>
                    <li><strong>Artificial Intelligence:</strong> AI engineers, data scientists, ML specialists</li>
                    <li><strong>Cybersecurity:</strong> Security analysts, ethical hackers, security architects</li>
                    <li><strong>Blockchain:</strong> Blockchain developers, cryptocurrency experts</li>
                    <li><strong>Cloud Computing:</strong> Cloud architects, DevOps engineers</li>
                </ul>
                
                <h3>Healthcare Innovations</h3>
                <p>The healthcare sector is evolving with new opportunities:</p>
                <ul>
                    <li>Telemedicine and digital health</li>
                    <li>Medical technology and devices</li>
                    <li>Mental health and wellness</li>
                    <li>Healthcare data analytics</li>
                </ul>
                
                <h3>Sustainability and Green Jobs</h3>
                <p>Environmental consciousness is creating new career paths:</p>
                <ul>
                    <li>Renewable energy specialists</li>
                    <li>Environmental consultants</li>
                    <li>Sustainability managers</li>
                    <li>Green building architects</li>
                </ul>
                
                <h3>Remote Work Opportunities</h3>
                <p>The pandemic has accelerated remote work adoption:</p>
                <ul>
                    <li>Digital marketing specialists</li>
                    <li>Content creators and influencers</li>
                    <li>Virtual assistants</li>
                    <li>Online educators</li>
                </ul>
            `,
            category: "industry-news",
            author: "Industry Analyst",
            date: "2024-01-05",
            readTime: "7 min read",
            featured: false
        },
        {
            id: 5,
            title: "Success Stories: From Student to Professional",
            excerpt: "Read inspiring stories of students who successfully transitioned from education to their dream careers.",
            content: `
                <h3>Story 1: Priya's Journey to Software Engineering</h3>
                <p>Priya, a 12th standard student from Mumbai, always had a passion for technology. Despite facing financial constraints, she worked hard and secured admission to a top engineering college.</p>
                
                <p><strong>Her Strategy:</strong></p>
                <ul>
                    <li>Focused on strong fundamentals in mathematics and science</li>
                    <li>Learned programming languages during summer breaks</li>
                    <li>Participated in coding competitions</li>
                    <li>Built a portfolio of projects</li>
                </ul>
                
                <p>Today, Priya works as a senior software engineer at a leading tech company, earning a competitive salary and enjoying her work.</p>
                
                <h3>Story 2: Rahul's Path to Medical School</h3>
                <p>Rahul dreamed of becoming a doctor since childhood. His journey was challenging but ultimately successful.</p>
                
                <p><strong>His Approach:</strong></p>
                <ul>
                    <li>Maintained excellent academic performance</li>
                    <li>Prepared systematically for NEET</li>
                    <li>Volunteered at local hospitals</li>
                    <li>Stayed focused despite multiple attempts</li>
                </ul>
                
                <p>Rahul is now a third-year medical student, well on his way to achieving his dream of becoming a cardiologist.</p>
                
                <h3>Key Lessons</h3>
                <p>These success stories teach us important lessons:</p>
                <ol>
                    <li>Persistence and hard work pay off</li>
                    <li>Early planning and preparation are crucial</li>
                    <li>Building practical skills alongside academics</li>
                    <li>Staying motivated despite challenges</li>
                    <li>Seeking guidance and mentorship</li>
                </ol>
            `,
            category: "inspiration",
            author: "Career Counselor",
            date: "2024-01-03",
            readTime: "8 min read",
            featured: false
        }
    ];
}

function displayBlogs() {
    const blogsGrid = document.getElementById('blogsGrid');
    const featuredBlog = document.getElementById('featuredBlog');
    
    // Display featured blog
    const featured = blogs.find(blog => blog.featured);
    if (featured) {
        featuredBlog.innerHTML = `
            <div class="featured-blog-image">
                <i class="fas fa-star"></i>
            </div>
            <div class="featured-blog-content">
                <h3>${featured.title}</h3>
                <p>${featured.excerpt}</p>
                <div class="featured-blog-meta">
                    <span><i class="fas fa-user"></i> ${featured.author}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(featured.date).toLocaleDateString()}</span>
                    <span><i class="fas fa-clock"></i> ${featured.readTime}</span>
                    <span class="blog-detail-category">${featured.category.replace('-', ' ')}</span>
                </div>
                <button class="btn btn-primary" onclick="showBlogDetails(${featured.id})">
                    Read More
                </button>
            </div>
        `;
        featuredBlog.style.display = 'grid';
    } else {
        featuredBlog.style.display = 'none';
    }
    
    // Display regular blogs
    const regularBlogs = blogs.filter(blog => !blog.featured);
    blogsGrid.innerHTML = regularBlogs.map(blog => `
        <div class="blog-card" onclick="showBlogDetails(${blog.id})">
            <div class="blog-card-image">
                <i class="fas fa-newspaper"></i>
            </div>
            <div class="blog-card-content">
                <h3>${blog.title}</h3>
                <p>${blog.excerpt}</p>
                <div class="blog-card-meta">
                    <span class="category">${blog.category.replace('-', ' ')}</span>
                    <span class="date"><i class="fas fa-calendar"></i> ${new Date(blog.date).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function showBlogDetails(blogId) {
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) return;
    
    const content = document.getElementById('blogDetailContent');
    content.innerHTML = `
        <div class="blog-detail-header">
            <h2>${blog.title}</h2>
            <div class="blog-detail-meta">
                <span><i class="fas fa-user"></i> ${blog.author}</span>
                <span><i class="fas fa-calendar"></i> ${new Date(blog.date).toLocaleDateString()}</span>
                <span><i class="fas fa-clock"></i> ${blog.readTime}</span>
                <span class="blog-detail-category">${blog.category.replace('-', ' ')}</span>
            </div>
        </div>
        <div class="blog-detail-content">
            ${blog.content}
        </div>
    `;
    
    document.getElementById('blogModal').style.display = 'block';
}

function loadMoreBlogs() {
    currentBlogPage++;
    loadBlogs();
}

// Initialize assessment and blogs
document.addEventListener('DOMContentLoaded', function() {
    // Load default questions immediately
    assessmentQuestions = getDefaultQuestions();
    loadBlogs();
    
    // Blog category filter
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentBlogCategory = e.target.dataset.category;
            currentBlogPage = 1;
            loadBlogs();
        });
    });
    
    // Blog search
    const blogSearch = document.getElementById('blogSearch');
    if (blogSearch) {
        blogSearch.addEventListener('input', (e) => {
            blogSearchQuery = e.target.value;
            currentBlogPage = 1;
            loadBlogs();
        });
    }
});

// --- Ask a Mentor Module ---
async function loadMentorQuestions() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/mentor/questions`, {
    headers: token ? { 'Authorization': 'Bearer ' + token } : {}
  });
  const questions = await res.json();
  renderMentorQuestions(questions);
}

function renderMentorQuestions(questions) {
  const list = document.getElementById('mentorQuestionsList');
  list.innerHTML = questions.map(q => `
    <div class="mentor-question">
      <div class="mentor-question-q">
        <strong>Q:</strong> ${q.question}
        <span class="mentor-question-meta">Asked by: ${q.askedBy?.username || 'Student'} on ${new Date(q.createdAt).toLocaleDateString()}</span>
      </div>
      <div class="mentor-question-a">
        ${q.answer
          ? `<strong>A:</strong> ${q.answer} <span class="mentor-question-meta">Answered by: ${q.answeredBy?.username || 'Mentor'} on ${q.answeredAt ? new Date(q.answeredAt).toLocaleDateString() : ''}</span>`
          : (window.currentUser && window.currentUser.role === 'mentor'
              ? `<form class="mentor-answer-form" data-id="${q._id}">
                  <textarea required placeholder="Type your answer..."></textarea>
                  <button type="submit" class="btn btn-secondary">Submit Answer</button>
                </form>`
              : '<em>Awaiting mentor answer...</em>')}
      </div>
    </div>
  `).join('');
  // Attach answer form listeners
  document.querySelectorAll('.mentor-answer-form').forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const id = form.getAttribute('data-id');
      const answer = form.querySelector('textarea').value;
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/mentor/questions/${id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ answer })
      });
      if (res.ok) {
        loadMentorQuestions();
      } else {
        alert('Failed to submit answer');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Show/hide ask form based on user role
  window.currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const askForm = document.getElementById('askMentorForm');
  const loginPrompt = document.getElementById('askMentorLoginPrompt');
  if (askForm && loginPrompt) {
    if (window.currentUser && window.currentUser.role === 'student') {
      askForm.style.display = '';
      loginPrompt.style.display = 'none';
    } else {
      askForm.style.display = 'none';
      loginPrompt.style.display = '';
    }
    // Ask question submit
    askForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const question = document.getElementById('mentorQuestionInput').value.trim();
      if (!question) return;
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/mentor/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ question })
      });
      if (res.ok) {
        document.getElementById('mentorQuestionInput').value = '';
        loadMentorQuestions();
      } else {
        alert('Failed to submit question');
      }
    });
  }
  loadMentorQuestions();
});

// --- Career Guidance Chatbot ---
const chatbotWidget = document.getElementById('chatbotWidget');
const chatbotWindow = document.getElementById('chatbotWindow');
const openChatbotBtn = document.getElementById('openChatbotBtn');
const closeChatbotBtn = document.getElementById('closeChatbotBtn');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');

if (openChatbotBtn && chatbotWindow && closeChatbotBtn) {
  openChatbotBtn.onclick = () => chatbotWindow.style.display = 'flex';
  closeChatbotBtn.onclick = () => chatbotWindow.style.display = 'none';
}

function appendChatbotMessage(text, sender = 'bot') {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chatbot-message ${sender}`;
  msgDiv.innerHTML = `<div class="chatbot-bubble">${text}</div>`;
  chatbotMessages.appendChild(msgDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

chatbotForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const userMsg = chatbotInput.value.trim();
  if (!userMsg) return;
  appendChatbotMessage(userMsg, 'user');
  chatbotInput.value = '';
  appendChatbotMessage('<span style="color:#888;">Thinking...</span>', 'bot');
  // Call backend AI API
  const res = await fetch(`${API_BASE_URL}/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMsg, user: window.currentUser || null })
  });
  chatbotMessages.removeChild(chatbotMessages.lastChild); // remove 'Thinking...'
  if (res.ok) {
    const data = await res.json();
    appendChatbotMessage(data.reply, 'bot');
  } else {
    appendChatbotMessage('Sorry, I could not process your request. Please try again.', 'bot');
  }
});

// Initial greeting
document.addEventListener('DOMContentLoaded', function() {
  if (chatbotMessages && chatbotMessages.childElementCount === 0) {
    appendChatbotMessage(
      `👋 Hi! I'm your virtual career counselor. Ask me anything about careers, courses, or your future!`, 'bot'
    );
  }
}); 