// Admin Dashboard functionality
class AdminDashboard {
  constructor() {
    this.statsData = {
      verifiedDocuments: 12456,
      flaggedDocuments: 234,
      activeInstitutions: 1287,
      pendingReviews: 567
    };
    this.institutions = [];
    this.auditLogs = [];
    
    this.initializeAdminDashboard();
  }
  
  initializeAdminDashboard() {
    this.checkAdminAuth();
    this.loadMockData();
    this.setupEventListeners();
    this.renderDashboard();
    this.initializeAnimations();
    this.startRealTimeUpdates();
  }
  
  checkAdminAuth() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    // In a real app, check for admin role
    if (!userData) {
      window.SACVS.showNotification('Admin access required', 'error');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
      return;
    }
  }
  
  loadMockData() {
    this.institutions = [
      {
        id: 1,
        name: 'University of Technology',
        status: 'active',
        verifications: 1234,
        lastActive: 'Today',
        registrationDate: '2023-01-15'
      },
      {
        id: 2,
        name: 'State Medical College',
        status: 'pending',
        verifications: 0,
        lastActive: 'N/A',
        registrationDate: '2024-01-10'
      },
      {
        id: 3,
        name: 'Engineering Institute',
        status: 'active',
        verifications: 856,
        lastActive: 'Yesterday',
        registrationDate: '2023-06-20'
      }
    ];
    
    this.auditLogs = [
      {
        timestamp: '2024-01-15T14:30:25Z',
        action: 'verification',
        description: 'Document verified for University of Technology',
        user: 'Admin User',
        severity: 'info'
      },
      {
        timestamp: '2024-01-15T13:45:12Z',
        action: 'login',
        description: 'Institution login: State Medical College',
        user: 'System',
        severity: 'info'
      },
      {
        timestamp: '2024-01-15T12:20:08Z',
        action: 'alert',
        description: 'Suspicious document flagged for review',
        user: 'AI System',
        severity: 'warning'
      }
    ];
  }
  
  setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (!link.href || link.href.includes('#')) {
          e.preventDefault();
          this.handleNavigation(link.textContent.trim());
        }
      });
    });
    
    // Institution management
    this.setupInstitutionActions();
    
    // Add institution button
    const addInstBtn = document.querySelector('.btn-primary');
    if (addInstBtn && addInstBtn.textContent.includes('Add Institution')) {
      addInstBtn.addEventListener('click', () => this.showAddInstitutionModal());
    }
  }
  
  setupInstitutionActions() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-icon.approve')) {
        const institutionId = this.getInstitutionIdFromElement(e.target);
        this.approveInstitution(institutionId);
      } else if (e.target.closest('.btn-icon.reject')) {
        const institutionId = this.getInstitutionIdFromElement(e.target);
        this.rejectInstitution(institutionId);
      } else if (e.target.closest('.btn-icon.edit')) {
        const institutionId = this.getInstitutionIdFromElement(e.target);
        this.editInstitution(institutionId);
      } else if (e.target.closest('.btn-icon.delete')) {
        const institutionId = this.getInstitutionIdFromElement(e.target);
        this.deleteInstitution(institutionId);
      }
    });
  }
  
  getInstitutionIdFromElement(element) {
    const row = element.closest('tr');
    const institutionName = row.querySelector('.institution-info span').textContent;
    return this.institutions.find(inst => inst.name === institutionName)?.id;
  }
  
  renderDashboard() {
    this.animateStatCards();
    this.renderInstitutionsTable();
    this.renderAuditTrail();
    this.renderChartData();
  }
  
  animateStatCards() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-count'));
          window.SACVS.animateCounter(entry.target, target, 2000);
          observer.unobserve(entry.target);
        }
      });
    });
    
    statNumbers.forEach(counter => observer.observe(counter));
  }
  
  renderInstitutionsTable() {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = this.institutions.map(inst => `
      <tr data-institution-id="${inst.id}">
        <td>
          <div class="institution-info">
            <i class="fas fa-university"></i>
            <span>${inst.name}</span>
          </div>
        </td>
        <td>
          <span class="status-badge ${inst.status}">${inst.status}</span>
        </td>
        <td>${inst.verifications.toLocaleString()}</td>
        <td>${inst.lastActive}</td>
        <td>
          <div class="action-buttons">
            ${inst.status === 'pending' ? `
              <button class="btn-icon approve" title="Approve">
                <i class="fas fa-check"></i>
              </button>
              <button class="btn-icon reject" title="Reject">
                <i class="fas fa-times"></i>
              </button>
            ` : `
              <button class="btn-icon edit" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon delete" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            `}
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  renderAuditTrail() {
    const auditList = document.querySelector('.audit-list');
    if (!auditList) return;
    
    auditList.innerHTML = this.auditLogs.map(log => {
      const date = new Date(log.timestamp);
      const formattedTime = date.toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
      
      return `
        <div class="audit-item">
          <div class="audit-timestamp">
            <i class="fas fa-clock"></i>
            <span>${formattedTime}</span>
          </div>
          <div class="audit-action">
            <span class="action-type ${log.action}">${log.action}</span>
            <span>${log.description}</span>
          </div>
          <div class="audit-user">${log.user}</div>
        </div>
      `;
    }).join('');
  }
  
  renderChartData() {
    // Animate chart bars
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
      bar.style.height = '0%';
      setTimeout(() => {
        bar.style.transition = 'height 1s ease-out';
        bar.style.height = bar.style.height || `${50 + Math.random() * 40}%`;
      }, index * 100);
    });
  }
  
  initializeAnimations() {
    // Animate cards on load
    const cards = document.querySelectorAll('.stat-card, .admin-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
  
  startRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateStatsRandomly();
      this.addRandomAuditLog();
    }, 10000); // Update every 10 seconds
  }
  
  updateStatsRandomly() {
    const changes = {
      verifiedDocuments: Math.floor(Math.random() * 5) + 1,
      flaggedDocuments: Math.random() > 0.7 ? 1 : 0,
      activeInstitutions: Math.random() > 0.9 ? 1 : 0,
      pendingReviews: Math.floor(Math.random() * 3) - 1
    };
    
    Object.entries(changes).forEach(([key, change]) => {
      if (change !== 0) {
        this.statsData[key] = Math.max(0, this.statsData[key] + change);
        this.updateStatDisplay(key, this.statsData[key]);
      }
    });
  }
  
  updateStatDisplay(statKey, newValue) {
    const element = document.querySelector(`[data-stat="${statKey}"]`);
    if (element) {
      window.SACVS.animateCounter(element, newValue, 1000);
    }
  }
  
  addRandomAuditLog() {
    const actions = [
      { action: 'verification', description: 'Document verified successfully', user: 'System', severity: 'info' },
      { action: 'login', description: 'Institution user login', user: 'System', severity: 'info' },
      { action: 'alert', description: 'Security check completed', user: 'AI System', severity: 'info' }
    ];
    
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const newLog = {
      ...randomAction,
      timestamp: new Date().toISOString()
    };
    
    this.auditLogs.unshift(newLog);
    this.auditLogs = this.auditLogs.slice(0, 10); // Keep only latest 10 logs
    this.renderAuditTrail();
    
    // Highlight new log
    const auditList = document.querySelector('.audit-list');
    const firstItem = auditList.querySelector('.audit-item');
    if (firstItem) {
      firstItem.style.background = 'rgba(0, 86, 210, 0.1)';
      setTimeout(() => {
        firstItem.style.background = '';
      }, 2000);
    }
  }
  
  handleNavigation(section) {
    const sections = ['Dashboard', 'Institutions', 'Reports'];
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.textContent.trim() === section);
    });
    
    // Show relevant content (simplified for demo)
    window.SACVS.showNotification(`Navigated to ${section}`, 'info', 2000);
  }
  
  async approveInstitution(institutionId) {
    const institution = this.institutions.find(inst => inst.id === institutionId);
    if (!institution) return;
    
    try {
      // Simulate API call
      await this.sleep(1000);
      
      institution.status = 'active';
      institution.lastActive = 'Today';
      
      this.renderInstitutionsTable();
      window.SACVS.showNotification(`${institution.name} approved successfully`, 'success');
      
      // Add audit log
      this.auditLogs.unshift({
        timestamp: new Date().toISOString(),
        action: 'approval',
        description: `Institution approved: ${institution.name}`,
        user: 'Admin User',
        severity: 'info'
      });
      this.renderAuditTrail();
      
    } catch (error) {
      window.SACVS.showNotification('Failed to approve institution', 'error');
    }
  }
  
  async rejectInstitution(institutionId) {
    const institution = this.institutions.find(inst => inst.id === institutionId);
    if (!institution) return;
    
    if (!confirm(`Are you sure you want to reject ${institution.name}?`)) {
      return;
    }
    
    try {
      await this.sleep(1000);
      
      this.institutions = this.institutions.filter(inst => inst.id !== institutionId);
      this.renderInstitutionsTable();
      
      window.SACVS.showNotification(`${institution.name} rejected and removed`, 'warning');
      
      // Add audit log
      this.auditLogs.unshift({
        timestamp: new Date().toISOString(),
        action: 'rejection',
        description: `Institution rejected: ${institution.name}`,
        user: 'Admin User',
        severity: 'warning'
      });
      this.renderAuditTrail();
      
    } catch (error) {
      window.SACVS.showNotification('Failed to reject institution', 'error');
    }
  }
  
  editInstitution(institutionId) {
    const institution = this.institutions.find(inst => inst.id === institutionId);
    if (!institution) return;
    
    // Simplified edit - just show notification for demo
    window.SACVS.showNotification(`Edit feature for ${institution.name} - Coming Soon`, 'info');
  }
  
  async deleteInstitution(institutionId) {
    const institution = this.institutions.find(inst => inst.id === institutionId);
    if (!institution) return;
    
    if (!confirm(`Are you sure you want to delete ${institution.name}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await this.sleep(1000);
      
      this.institutions = this.institutions.filter(inst => inst.id !== institutionId);
      this.renderInstitutionsTable();
      
      window.SACVS.showNotification(`${institution.name} deleted successfully`, 'success');
      
      // Add audit log
      this.auditLogs.unshift({
        timestamp: new Date().toISOString(),
        action: 'deletion',
        description: `Institution deleted: ${institution.name}`,
        user: 'Admin User',
        severity: 'warning'
      });
      this.renderAuditTrail();
      
    } catch (error) {
      window.SACVS.showNotification('Failed to delete institution', 'error');
    }
  }
  
  showAddInstitutionModal() {
    // Simplified modal for demo
    const institutionName = prompt('Enter institution name:');
    if (institutionName && institutionName.trim()) {
      const newInstitution = {
        id: Date.now(),
        name: institutionName.trim(),
        status: 'pending',
        verifications: 0,
        lastActive: 'N/A',
        registrationDate: new Date().toISOString().split('T')[0]
      };
      
      this.institutions.push(newInstitution);
      this.renderInstitutionsTable();
      
      window.SACVS.showNotification(`Institution "${institutionName}" added for review`, 'success');
      
      // Add audit log
      this.auditLogs.unshift({
        timestamp: new Date().toISOString(),
        action: 'registration',
        description: `New institution registered: ${institutionName}`,
        user: 'Admin User',
        severity: 'info'
      });
      this.renderAuditTrail();
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Additional styles for admin dashboard
function addAdminStyles() {
  if (document.querySelector('#admin-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'admin-styles';
  style.textContent = `
    .admin-container {
      animation: fade-in-up 0.6s ease-out;
    }
    
    .stat-card {
      position: relative;
      overflow: hidden;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }
    
    .stat-card:hover::before {
      left: 100%;
    }
    
    .chart-bars .bar {
      position: relative;
      cursor: pointer;
    }
    
    .chart-bars .bar:hover {
      opacity: 0.8;
      transform: scaleY(1.05);
    }
    
    .alert-item {
      position: relative;
      overflow: hidden;
    }
    
    .alert-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      transition: width 0.3s ease;
    }
    
    .alert-item.high::before {
      background: var(--accent-error);
    }
    
    .alert-item.medium::before {
      background: var(--accent-warning);
    }
    
    .alert-item.low::before {
      background: var(--accent-info);
    }
    
    .alert-item:hover::before {
      width: 6px;
    }
    
    .audit-item {
      transition: all 0.3s ease;
      border-radius: 8px;
      margin-bottom: 0.5rem;
    }
    
    .audit-item:hover {
      background: var(--bg-primary) !important;
      transform: translateX(8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .action-type {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-right: 8px;
    }
    
    .action-type.verification {
      background: rgba(40, 167, 69, 0.1);
      color: var(--accent-verified);
    }
    
    .action-type.login {
      background: rgba(0, 86, 210, 0.1);
      color: var(--primary-color);
    }
    
    .action-type.alert {
      background: rgba(255, 193, 7, 0.1);
      color: var(--accent-warning);
    }
    
    .action-type.approval {
      background: rgba(40, 167, 69, 0.1);
      color: var(--accent-verified);
    }
    
    .action-type.rejection,
    .action-type.deletion {
      background: rgba(220, 53, 69, 0.1);
      color: var(--accent-error);
    }
    
    .action-type.registration {
      background: rgba(23, 162, 184, 0.1);
      color: var(--accent-info);
    }
    
    .admin-table tbody tr {
      transition: all 0.2s ease;
    }
    
    .admin-table tbody tr:hover {
      background: var(--bg-secondary) !important;
      transform: translateX(4px);
      box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
    }
    
    .btn-icon {
      transition: all 0.2s ease;
    }
    
    .btn-icon:hover {
      transform: scale(1.2);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .future-modules {
      margin-top: 3rem;
    }
    
    .module-card {
      position: relative;
      background: linear-gradient(135deg, var(--bg-card), var(--bg-secondary));
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }
    
    .module-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }
    
    .module-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }
    
    .module-card:hover::after {
      transform: translateX(100%);
    }
    
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @media (max-width: 768px) {
      .admin-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .admin-table {
        font-size: 0.9rem;
      }
      
      .admin-table th,
      .admin-table td {
        padding: 8px;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addAdminStyles();
  window.adminDashboard = new AdminDashboard();
});