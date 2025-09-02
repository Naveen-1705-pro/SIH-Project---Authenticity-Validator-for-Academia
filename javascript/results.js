// Results page functionality
class ResultsManager {
  constructor() {
    this.verificationResult = null;
    this.initializeResults();
  }
  
  initializeResults() {
    this.loadVerificationResult();
    this.setupEventListeners();
    this.renderResults();
    this.initializeAnimations();
  }
  
  loadVerificationResult() {
    const stored = localStorage.getItem('verificationResult');
    if (!stored) {
      // Generate mock result for demonstration
      this.verificationResult = this.generateMockResult();
    } else {
      this.verificationResult = JSON.parse(stored);
    }
  }
  
  generateMockResult() {
    return {
      id: 'VRF-2024-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: new Date().toISOString(),
      status: 'verified', // verified, warning, error
      files: [{
        name: 'Bachelor_Degree_Certificate.pdf',
        size: 2048576,
        type: 'application/pdf',
        status: 'verified'
      }],
      documentInfo: {
        type: "Bachelor's Degree Certificate",
        institution: "University of Technology",
        studentName: "John Doe",
        graduationYear: "2023",
        documentHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
        blockNumber: "#1,245,678"
      },
      verificationChecks: [
        { name: 'Digital Signature', status: 'verified', description: 'Valid institutional signature verified' },
        { name: 'Document Integrity', status: 'verified', description: 'No tampering or modifications detected' },
        { name: 'Institution Verification', status: 'verified', description: 'Issuing institution authenticated' },
        { name: 'Blockchain Confirmation', status: 'verified', description: 'Permanently recorded on blockchain' }
      ],
      userData: JSON.parse(localStorage.getItem('userData')) || { username: 'Demo User' }
    };
  }
  
  setupEventListeners() {
    const downloadBtn = document.getElementById('downloadReport');
    const generateQRBtn = document.getElementById('generateQR');
    const shareBtn = document.getElementById('shareResult');
    
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadReport());
    }
    
    if (generateQRBtn) {
      generateQRBtn.addEventListener('click', () => this.generateQRCode());
    }
    
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareResult());
    }
  }
  
  renderResults() {
    this.updateVerificationId();
    this.updateResultStatus();
    this.updateDocumentDetails();
    this.updateVerificationDetails();
    this.updateTimestamp();
  }
  
  updateVerificationId() {
    const element = document.getElementById('verificationId');
    if (element && this.verificationResult) {
      element.textContent = this.verificationResult.id;
    }
  }
  
  updateResultStatus() {
    const statusElement = document.getElementById('resultStatus');
    const cardElement = document.getElementById('resultCard');
    
    if (!statusElement || !this.verificationResult) return;
    
    const status = this.verificationResult.status;
    const statusConfig = this.getStatusConfig(status);
    
    statusElement.className = `result-status ${status}`;
    statusElement.innerHTML = `
      <div class="status-icon">
        <i class="fas ${statusConfig.icon}"></i>
      </div>
      <div class="status-text">
        <h2>${statusConfig.title}</h2>
        <p class="status-subtitle">${statusConfig.subtitle}</p>
      </div>
    `;
    
    // Add status class to card for styling
    if (cardElement) {
      cardElement.className = `result-card status-${status}`;
    }
  }
  
  getStatusConfig(status) {
    const configs = {
      verified: {
        icon: 'fa-check-circle',
        title: 'Document Verified',
        subtitle: 'Authenticity confirmed through blockchain verification'
      },
      warning: {
        icon: 'fa-exclamation-triangle',
        title: 'Verification Warning',
        subtitle: 'Document may require additional review'
      },
      error: {
        icon: 'fa-times-circle',
        title: 'Verification Failed',
        subtitle: 'Document could not be authenticated'
      }
    };
    
    return configs[status] || configs.verified;
  }
  
  updateDocumentDetails() {
    if (!this.verificationResult.documentInfo) return;
    
    const details = this.verificationResult.documentInfo;
    const elements = {
      docType: details.type,
      institution: details.institution,
      studentName: details.studentName,
      gradYear: details.graduationYear,
      docHash: details.documentHash,
      blockNumber: details.blockNumber
    };
    
    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  }
  
  updateVerificationDetails() {
    const container = document.querySelector('.verification-grid');
    if (!container || !this.verificationResult.verificationChecks) return;
    
    container.innerHTML = this.verificationResult.verificationChecks
      .map(check => this.renderVerificationCheck(check))
      .join('');
  }
  
  renderVerificationCheck(check) {
    const statusClass = check.status || 'verified';
    const icon = this.getCheckIcon(statusClass);
    
    return `
      <div class="verification-item ${statusClass}">
        <i class="fas ${icon}"></i>
        <div class="item-content">
          <h4>${check.name}</h4>
          <p>${check.description}</p>
        </div>
      </div>
    `;
  }
  
  getCheckIcon(status) {
    const icons = {
      verified: 'fa-check-circle',
      warning: 'fa-exclamation-triangle',
      error: 'fa-times-circle'
    };
    return icons[status] || icons.verified;
  }
  
  updateTimestamp() {
    const element = document.getElementById('verificationTime');
    if (element && this.verificationResult) {
      const date = new Date(this.verificationResult.timestamp);
      const formatted = date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
        timeZoneName: 'short'
      });
      element.textContent = `Verified on: ${formatted}`;
    }
  }
  
  initializeAnimations() {
    // Animate result cards on load
    const cards = document.querySelectorAll('.result-card, .qr-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 200);
    });
    
    // Animate verification items
    const items = document.querySelectorAll('.verification-item');
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        item.style.transition = 'all 0.4s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 500 + (index * 100));
    });
    
    // Add glow animation to status icon
    const statusIcon = document.querySelector('.status-icon');
    if (statusIcon) {
      statusIcon.style.animation = 'glow-pulse 2s infinite';
    }
  }
  
  async downloadReport() {
    const btn = document.getElementById('downloadReport');
    window.SACVS.showLoading(btn, 'Generating...');
    
    try {
      // Simulate report generation
      await this.sleep(2000);
      
      // Generate report content
      const reportContent = this.generateReportHTML();
      
      // Create and download file
      const blob = new Blob([reportContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `verification-report-${this.verificationResult.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      window.SACVS.showNotification('Report downloaded successfully', 'success');
      
    } catch (error) {
      window.SACVS.showNotification('Failed to generate report', 'error');
    } finally {
      window.SACVS.hideLoading(btn);
    }
  }
  
  generateReportHTML() {
    const result = this.verificationResult;
    const timestamp = new Date(result.timestamp).toLocaleString();
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Report - ${result.id}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #0056D2; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .status-verified { color: #28A745; }
        .status-warning { color: #FFC107; }
        .status-error { color: #DC3545; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SACVS Verification Report</h1>
        <p>Verification ID: ${result.id}</p>
        <p>Generated on: ${timestamp}</p>
    </div>
    
    <div class="section">
        <h2>Verification Status</h2>
        <p class="status-${result.status}"><strong>${this.getStatusConfig(result.status).title}</strong></p>
        <p>${this.getStatusConfig(result.status).subtitle}</p>
    </div>
    
    <div class="section">
        <h2>Document Information</h2>
        <table>
            <tr><th>Document Type</th><td>${result.documentInfo.type}</td></tr>
            <tr><th>Institution</th><td>${result.documentInfo.institution}</td></tr>
            <tr><th>Student Name</th><td>${result.documentInfo.studentName}</td></tr>
            <tr><th>Graduation Year</th><td>${result.documentInfo.graduationYear}</td></tr>
            <tr><th>Document Hash</th><td>${result.documentInfo.documentHash}</td></tr>
            <tr><th>Blockchain Block</th><td>${result.documentInfo.blockNumber}</td></tr>
        </table>
    </div>
    
    <div class="section">
        <h2>Verification Checks</h2>
        <table>
            <tr><th>Check</th><th>Status</th><th>Description</th></tr>
            ${result.verificationChecks.map(check => `
                <tr>
                    <td>${check.name}</td>
                    <td class="status-${check.status}">${check.status.toUpperCase()}</td>
                    <td>${check.description}</td>
                </tr>
            `).join('')}
        </table>
    </div>
    
    <div class="section">
        <h2>Security Notice</h2>
        <p>This report is generated by the Secure Academic Credential Verification System (SACVS). 
        The verification is backed by blockchain technology ensuring tamper-proof authentication.</p>
        <p><strong>Warning:</strong> This report should only be considered valid if downloaded directly 
        from the official SACVS portal.</p>
    </div>
</body>
</html>
    `;
  }
  
  async generateQRCode() {
    const btn = document.getElementById('generateQR');
    const qrSection = document.getElementById('qrSection');
    
    window.SACVS.showLoading(btn, 'Generating...');
    
    try {
      await this.sleep(1500);
      
      // Show QR section
      if (qrSection) {
        qrSection.classList.remove('hidden');
        qrSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Update QR code content
      this.updateQRCode();
      
      window.SACVS.showNotification('QR Code generated successfully', 'success');
      
    } catch (error) {
      window.SACVS.showNotification('Failed to generate QR Code', 'error');
    } finally {
      window.SACVS.hideLoading(btn);
    }
  }
  
  updateQRCode() {
    const qrContainer = document.getElementById('qrCode');
    if (!qrContainer) return;
    
    // Create verification URL
    const verificationUrl = `${window.location.origin}/verify/${this.verificationResult.id}`;
    
    qrContainer.innerHTML = `
      <div class="qr-generated">
        <div class="qr-matrix">
          <div class="qr-pattern"></div>
        </div>
        <p class="qr-url">${verificationUrl}</p>
      </div>
    `;
    
    // Add QR animation
    const qrPattern = qrContainer.querySelector('.qr-pattern');
    if (qrPattern) {
      qrPattern.style.animation = 'qr-generate 1s ease-out';
    }
  }
  
  async shareResult() {
    const shareData = {
      title: 'Document Verification Result',
      text: `Document verified successfully via SACVS. Verification ID: ${this.verificationResult.id}`,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        window.SACVS.showNotification('Shared successfully', 'success');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text}\n\nView details: ${shareData.url}`
        );
        window.SACVS.showNotification('Link copied to clipboard', 'success');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        window.SACVS.showNotification('Sharing failed', 'error');
      }
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Additional styles for results page
function addResultsStyles() {
  if (document.querySelector('#results-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'results-styles';
  style.textContent = `
    .results-container {
      animation: fade-in 0.6s ease-out;
    }
    
    .status-verified .result-header {
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(0, 86, 210, 0.1));
    }
    
    .status-warning .result-header {
      background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
    }
    
    .status-error .result-header {
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(255, 87, 87, 0.1));
    }
    
    .qr-generated {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .qr-matrix {
      width: 160px;
      height: 160px;
      background: white;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    
    .qr-pattern {
      width: 140px;
      height: 140px;
      background-image: 
        repeating-linear-gradient(0deg, black 0px, black 2px, white 2px, white 4px),
        repeating-linear-gradient(90deg, black 0px, black 2px, white 2px, white 4px);
      border-radius: 4px;
    }
    
    .qr-url {
      font-size: 0.8rem;
      color: var(--text-muted);
      word-break: break-all;
      text-align: center;
      margin: 0;
    }
    
    @keyframes qr-generate {
      from {
        opacity: 0;
        transform: scale(0.8) rotate(-5deg);
      }
      to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }
    
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .verification-item {
      transition: all 0.3s ease;
    }
    
    .verification-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .coming-soon-badge {
      animation: pulse 2s infinite;
    }
    
    @media (max-width: 768px) {
      .results-header {
        text-align: left;
      }
      
      .page-title {
        font-size: 2rem;
      }
      
      .result-actions {
        grid-template-columns: 1fr;
      }
      
      .qr-matrix {
        width: 140px;
        height: 140px;
      }
      
      .qr-pattern {
        width: 120px;
        height: 120px;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize results manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addResultsStyles();
  window.resultsManager = new ResultsManager();
});