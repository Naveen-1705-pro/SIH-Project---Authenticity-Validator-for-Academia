// Global Variables and Configuration
let currentTheme = localStorage.getItem('theme') || 'light';
let currentLanguage = localStorage.getItem('language') || 'en';
let userData = JSON.parse(localStorage.getItem('userData')) || {};

// Language translations
const translations = {
  en: {
    'secure-login': 'Secure Login',
    'welcome': 'Welcome',
    'verification-complete': 'Verification Complete',
    'loading': 'Loading...',
    'error': 'Error occurred',
    'success': 'Success'
  },
  hi: {
    'secure-login': 'सुरक्षित लॉगिन',
    'welcome': 'स्वागत है',
    'verification-complete': 'सत्यापन पूर्ण',
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि हुई',
    'success': 'सफलता'
  },
  te: {
    'secure-login': 'సురక్షిత లాగిన్',
    'welcome': 'స్వాగతం',
    'verification-complete': 'ధృవీకరణ పూర్తయింది',
    'loading': 'లోడ్ అవుతోంది...',
    'error': 'లోపం సంభవించింది',
    'success': 'విజయం'
  }
};

// Theme Management
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeToggle();
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeToggle();
  
  // Add smooth transition effect
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
}

function updateThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const moonIcon = themeToggle.querySelector('.fa-moon');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    
    if (currentTheme === 'dark') {
      moonIcon.style.opacity = '0';
      moonIcon.style.transform = 'rotate(-180deg)';
      sunIcon.style.opacity = '1';
      sunIcon.style.transform = 'rotate(0deg)';
    } else {
      moonIcon.style.opacity = '1';
      moonIcon.style.transform = 'rotate(0deg)';
      sunIcon.style.opacity = '0';
      sunIcon.style.transform = 'rotate(180deg)';
    }
  }
}

// Language Management
function initializeLanguage() {
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.value = currentLanguage;
    updateLanguage();
  }
}

function changeLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('language', currentLanguage);
  updateLanguage();
}

function updateLanguage() {
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });
}

// Animation Utilities
function addFloatingAnimation(element) {
  element.style.animation = 'float 3s ease-in-out infinite';
}

function addPulseAnimation(element) {
  element.style.animation = 'pulse 2s infinite';
}

function addGlowAnimation(element) {
  element.style.animation = 'glow 2s ease-in-out infinite alternate';
}

// Form Validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm(formData) {
  const errors = [];
  
  if (!formData.username || formData.username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (!formData.password || formData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!formData.institutionCode || formData.institutionCode.trim().length < 2) {
    errors.push('Institution code is required');
  }
  
  return errors;
}

// Loading States
function showLoading(element, text = 'Loading...') {
  if (element) {
    element.disabled = true;
    const btnText = element.querySelector('.btn-text');
    const btnLoader = element.querySelector('.btn-loader');
    
    if (btnText) btnText.style.opacity = '0';
    if (btnLoader) btnLoader.classList.remove('hidden');
    
    // Update loading text if provided
    const loadingText = element.querySelector('.loading-text');
    if (loadingText) loadingText.textContent = text;
  }
}

function hideLoading(element) {
  if (element) {
    element.disabled = false;
    const btnText = element.querySelector('.btn-text');
    const btnLoader = element.querySelector('.btn-loader');
    
    if (btnText) btnText.style.opacity = '1';
    if (btnLoader) btnLoader.classList.add('hidden');
  }
}

function showGlobalLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

function hideGlobalLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

// Notification System
function showNotification(message, type = 'info', duration = 5000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="closeNotification(this)">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add notification styles if not already present
  if (!document.querySelector('.notification-container')) {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  const container = document.querySelector('.notification-container');
  container.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  }, 100);
  
  // Auto remove
  if (duration > 0) {
    setTimeout(() => {
      closeNotification(notification.querySelector('.notification-close'));
    }, duration);
  }
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success': return 'check-circle';
    case 'error': return 'exclamation-circle';
    case 'warning': return 'exclamation-triangle';
    default: return 'info-circle';
  }
}

function closeNotification(button) {
  const notification = button.closest('.notification');
  notification.style.transform = 'translateX(100%)';
  notification.style.opacity = '0';
  setTimeout(() => {
    notification.remove();
  }, 300);
}

// Banner Slider
function initializeBannerSlider() {
  const bannerSlider = document.getElementById('bannerSlider');
  if (!bannerSlider) return;
  
  const slides = bannerSlider.querySelectorAll('.banner-slide');
  let currentSlide = 0;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  
  // Auto-advance slides every 4 seconds
  setInterval(nextSlide, 4000);
}

// Animated Counter
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  
  updateCounter();
}

// Initialize counters when visible
function initializeCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  });
  
  counters.forEach(counter => observer.observe(counter));
}

// FAQ Toggle
function toggleFAQ(questionElement) {
  const faqItem = questionElement.closest('.faq-item');
  const isActive = faqItem.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.faq-item.active').forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('active');
    }
  });
  
  // Toggle current item
  faqItem.classList.toggle('active', !isActive);
}

// Smooth Scrolling
function smoothScrollTo(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Input Focus Effects
function initializeInputEffects() {
  const inputs = document.querySelectorAll('.form-input');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
      addGlowAnimation(this);
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      this.style.animation = '';
    });
    
    input.addEventListener('input', function() {
      this.parentElement.classList.toggle('has-content', this.value.length > 0);
    });
  });
}

// Button Hover Effects
function initializeButtonEffects() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
    
    button.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(0) scale(0.98)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-2px) scale(1)';
    });
  });
}

// Card Hover Effects
function initializeCardEffects() {
  const cards = document.querySelectorAll('.login-card, .upload-card, .result-card, .admin-card, .support-card, .resource-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.01)';
      this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '';
    });
  });
}

// Main Login Form Handler
function handleLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      institutionCode: document.getElementById('institutionCode').value
    };
    
    const loginBtn = this.querySelector('.login-btn');
    showLoading(loginBtn, 'Authenticating...');
    showGlobalLoading();
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
      hideLoading(loginBtn);
      hideGlobalLoading();
      showNotification(errors[0], 'error');
      return;
    }
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock authentication success
      userData = {
        username: formData.username,
        institutionCode: formData.institutionCode,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      hideLoading(loginBtn);
      hideGlobalLoading();
      
      showNotification('Login successful! Redirecting...', 'success', 2000);
      
      // Redirect to upload page
      setTimeout(() => {
        window.location.href = 'upload.html';
      }, 1500);
      
    } catch (error) {
      hideLoading(loginBtn);
      hideGlobalLoading();
      showNotification('Authentication failed. Please try again.', 'error');
    }
  });
}

// Logout Handler
function handleLogout() {
  const logoutBtns = document.querySelectorAll('#logoutBtn');
  
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      localStorage.removeItem('userData');
      showNotification('Logged out successfully', 'success', 2000);
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  });
}

// Page Initialization
function initializePage() {
  // Core initialization
  initializeTheme();
  initializeLanguage();
  initializeBannerSlider();
  initializeCounters();
  
  // UI Effects
  initializeInputEffects();
  initializeButtonEffects();
  initializeCardEffects();
  
  // Form handlers
  handleLoginForm();
  handleLogout();
  
  // Event listeners
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }
  
  // Display user info if logged in
  displayUserInfo();
}

// Display User Information
function displayUserInfo() {
  if (userData.username) {
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(element => {
      element.textContent = `Welcome, ${userData.username}`;
    });
    
    const institutionElements = document.querySelectorAll('#institutionName');
    institutionElements.forEach(element => {
      element.textContent = `${userData.institutionCode} Portal`;
    });
  }
}

// Add notification styles dynamically
function addNotificationStyles() {
  if (document.querySelector('#notification-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .notification {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 300px;
      max-width: 400px;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .notification-success {
      border-left: 4px solid var(--accent-verified);
    }
    
    .notification-error {
      border-left: 4px solid var(--accent-error);
    }
    
    .notification-warning {
      border-left: 4px solid var(--accent-warning);
    }
    
    .notification-info {
      border-left: 4px solid var(--accent-info);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    
    .notification-content i {
      font-size: 18px;
    }
    
    .notification-success .notification-content i {
      color: var(--accent-verified);
    }
    
    .notification-error .notification-content i {
      color: var(--accent-error);
    }
    
    .notification-warning .notification-content i {
      color: var(--accent-warning);
    }
    
    .notification-info .notification-content i {
      color: var(--accent-info);
    }
    
    .notification-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: var(--transition);
    }
    
    .notification-close:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addNotificationStyles();
  initializePage();
  
  // Add some welcome animations
  const heroElements = document.querySelectorAll('.floating-shield, .hero-title, .hero-subtitle');
  heroElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    setTimeout(() => {
      element.style.transition = 'all 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 200);
  });
});

// Export functions for use in other files
window.SACVS = {
  showNotification,
  showLoading,
  hideLoading,
  showGlobalLoading,
  hideGlobalLoading,
  animateCounter,
  toggleFAQ,
  smoothScrollTo,
  currentTheme,
  currentLanguage,
  userData
};