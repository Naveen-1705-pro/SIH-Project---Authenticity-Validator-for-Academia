// Upload page specific functionality
class UploadManager {
  constructor() {
    this.uploadedFiles = [];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    this.verificationInProgress = false;
    
    this.initializeUpload();
  }
  
  initializeUpload() {
    this.setupDragAndDrop();
    this.setupFileInput();
    this.setupButtons();
    this.checkUserAuthentication();
  }
  
  checkUserAuthentication() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.username) {
      window.SACVS.showNotification('Please login to access this page', 'warning');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
      return;
    }
    
    // Update UI with user info
    this.updateUserInterface(userData);
  }
  
  updateUserInterface(userData) {
    const userName = document.getElementById('userName');
    const institutionName = document.getElementById('institutionName');
    
    if (userName) userName.textContent = `Welcome, ${userData.username}`;
    if (institutionName) institutionName.textContent = `${userData.institutionCode} Portal`;
  }
  
  setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    if (!uploadArea) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, this.preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.add('dragover');
        this.addPulseAnimation(uploadArea);
      });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.classList.remove('dragover');
        uploadArea.style.animation = '';
      });
    });
    
    uploadArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      this.handleFiles(files);
    });
    
    uploadArea.addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });
  }
  
  setupFileInput() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput) return;
    
    fileInput.addEventListener('change', (e) => {
      this.handleFiles(e.target.files);
    });
  }
  
  setupButtons() {
    const verifyBtn = document.getElementById('verifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => this.startVerification());
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAllFiles());
    }
  }
  
  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  handleFiles(files) {
    [...files].forEach(file => this.processFile(file));
  }
  
  processFile(file) {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      window.SACVS.showNotification(validation.message, 'error');
      return;
    }
    
    // Check for duplicates
    const isDuplicate = this.uploadedFiles.some(f => 
      f.name === file.name && f.size === file.size
    );
    
    if (isDuplicate) {
      window.SACVS.showNotification('File already uploaded', 'warning');
      return;
    }
    
    // Add file to collection
    const fileData = {
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      id: Date.now() + Math.random(),
      status: 'pending'
    };
    
    this.uploadedFiles.push(fileData);
    this.renderUploadedFiles();
    this.updateVerifyButton();
    
    // Show success animation
    this.showFileAddedAnimation(file.name);
  }
  
  validateFile(file) {
    if (!this.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: 'Only PDF, PNG, and JPG files are allowed'
      };
    }
    
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        message: 'File size must be less than 10MB'
      };
    }
    
    if (this.uploadedFiles.length >= 5) {
      return {
        valid: false,
        message: 'Maximum 5 files allowed per verification'
      };
    }
    
    return { valid: true };
  }
  
  renderUploadedFiles() {
    const container = document.getElementById('uploadedFiles');
    if (!container) return;
    
    if (this.uploadedFiles.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }
    
    container.style.display = 'block';
    container.innerHTML = `
      <h3 class="uploaded-files-title">
        <i class="fas fa-file-check"></i>
        Uploaded Files (${this.uploadedFiles.length})
      </h3>
      <div class="files-grid">
        ${this.uploadedFiles.map(file => this.renderFileCard(file)).join('')}
      </div>
    `;
  }
  
  renderFileCard(fileData) {
    const sizeFormatted = this.formatFileSize(fileData.size);
    const typeIcon = this.getFileTypeIcon(fileData.type);
    
    return `
      <div class="file-card" data-file-id="${fileData.id}">
        <div class="file-icon">
          <i class="fas ${typeIcon}"></i>
        </div>
        <div class="file-info">
          <div class="file-name" title="${fileData.name}">${fileData.name}</div>
          <div class="file-details">
            <span class="file-size">${sizeFormatted}</span>
            <span class="file-status status-${fileData.status}">${fileData.status}</span>
          </div>
        </div>
        <button class="file-remove" onclick="uploadManager.removeFile('${fileData.id}')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  }
  
  getFileTypeIcon(type) {
    switch (type) {
      case 'application/pdf': return 'fa-file-pdf';
      case 'image/png':
      case 'image/jpeg':
      case 'image/jpg': return 'fa-file-image';
      default: return 'fa-file';
    }
  }
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  removeFile(fileId) {
    this.uploadedFiles = this.uploadedFiles.filter(file => file.id !== fileId);
    this.renderUploadedFiles();
    this.updateVerifyButton();
    
    window.SACVS.showNotification('File removed', 'info', 3000);
  }
  
  clearAllFiles() {
    if (this.uploadedFiles.length === 0) {
      window.SACVS.showNotification('No files to clear', 'info', 3000);
      return;
    }
    
    this.uploadedFiles = [];
    this.renderUploadedFiles();
    this.updateVerifyButton();
    
    // Reset file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    
    window.SACVS.showNotification('All files cleared', 'success', 3000);
  }
  
  updateVerifyButton() {
    const verifyBtn = document.getElementById('verifyBtn');
    if (!verifyBtn) return;
    
    const hasFiles = this.uploadedFiles.length > 0;
    verifyBtn.disabled = !hasFiles || this.verificationInProgress;
    
    if (hasFiles && !this.verificationInProgress) {
      verifyBtn.classList.remove('btn-disabled');
      verifyBtn.innerHTML = `
        <i class="fas fa-shield-check"></i>
        Verify ${this.uploadedFiles.length} Document${this.uploadedFiles.length > 1 ? 's' : ''}
      `;
    } else {
      verifyBtn.classList.add('btn-disabled');
      verifyBtn.innerHTML = `
        <i class="fas fa-shield-check"></i>
        Start Verification
      `;
    }
  }
  
  async startVerification() {
    if (this.uploadedFiles.length === 0) {
      window.SACVS.showNotification('Please upload files first', 'warning');
      return;
    }
    
    if (this.verificationInProgress) {
      return;
    }
    
    this.verificationInProgress = true;
    this.updateVerifyButton();
    
    // Show verification progress
    const progressContainer = document.getElementById('verificationProgress');
    if (progressContainer) {
      progressContainer.classList.remove('hidden');
      this.animateVerificationProgress();
    }
    
    try {
      // Simulate file processing
      for (let i = 0; i < this.uploadedFiles.length; i++) {
        this.uploadedFiles[i].status = 'processing';
        this.renderUploadedFiles();
        await this.sleep(1000); // Simulate processing delay
      }
      
      // Complete verification process
      await this.completeVerification();
      
    } catch (error) {
      this.handleVerificationError(error);
    }
  }
  
  async animateVerificationProgress() {
    const steps = [
      { id: 'step1', name: 'Document Uploaded', delay: 0 },
      { id: 'step2', name: 'Scanning Document', delay: 2000 },
      { id: 'step3', name: 'Blockchain Verification', delay: 4000 },
      { id: 'step4', name: 'Generating Report', delay: 6000 }
    ];
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    for (let i = 0; i < steps.length; i++) {
      await this.sleep(steps[i].delay);
      
      // Update progress bar
      const percentage = ((i + 1) / steps.length) * 100;
      if (progressFill) progressFill.style.width = percentage + '%';
      if (progressText) progressText.textContent = Math.round(percentage) + '%';
      
      // Update step status
      const stepElement = document.getElementById(steps[i].id);
      if (stepElement) {
        stepElement.classList.add('completed');
        stepElement.classList.remove('active');
      }
      
      // Activate next step
      if (i < steps.length - 1) {
        const nextStep = document.getElementById(steps[i + 1].id);
        if (nextStep) nextStep.classList.add('active');
      }
    }
  }
  
  async completeVerification() {
    await this.sleep(2000); // Final processing delay
    
    // Update all files to completed status
    this.uploadedFiles.forEach(file => {
      file.status = 'completed';
    });
    
    this.renderUploadedFiles();
    
    // Store verification results
    const verificationId = 'VRF-' + new Date().getFullYear() + '-' + 
                          Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const verificationResult = {
      id: verificationId,
      timestamp: new Date().toISOString(),
      files: this.uploadedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'verified'
      })),
      status: 'verified',
      userData: JSON.parse(localStorage.getItem('userData'))
    };
    
    localStorage.setItem('verificationResult', JSON.stringify(verificationResult));
    
    // Show success message
    window.SACVS.showNotification(
      'Verification completed successfully! Redirecting to results...', 
      'success', 
      3000
    );
    
    // Redirect to results page
    setTimeout(() => {
      window.location.href = 'results.html';
    }, 2000);
  }
  
  handleVerificationError(error) {
    this.verificationInProgress = false;
    this.updateVerifyButton();
    
    // Hide progress
    const progressContainer = document.getElementById('verificationProgress');
    if (progressContainer) {
      progressContainer.classList.add('hidden');
    }
    
    window.SACVS.showNotification(
      'Verification failed. Please try again.', 
      'error'
    );
    
    console.error('Verification error:', error);
  }
  
  showFileAddedAnimation(fileName) {
    window.SACVS.showNotification(
      `File "${fileName}" added successfully`, 
      'success', 
      3000
    );
  }
  
  addPulseAnimation(element) {
    element.style.animation = 'pulse-border 2s infinite';
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Additional styles for upload page
function addUploadStyles() {
  if (document.querySelector('#upload-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'upload-styles';
  style.textContent = `
    .uploaded-files {
      margin-top: 2rem;
    }
    
    .uploaded-files-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 1rem;
      color: var(--text-primary);
      font-size: 1.1rem;
    }
    
    .files-grid {
      display: grid;
      gap: 1rem;
    }
    
    .file-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      transition: var(--transition);
    }
    
    .file-card:hover {
      background: var(--bg-primary);
      border-color: var(--primary-color);
      transform: translateX(4px);
    }
    
    .file-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-color);
      color: white;
      border-radius: 8px;
      font-size: 18px;
    }
    
    .file-info {
      flex: 1;
      min-width: 0;
    }
    
    .file-name {
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }
    
    .file-details {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .file-size {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    
    .file-status {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-pending {
      background: rgba(255, 193, 7, 0.1);
      color: var(--accent-warning);
    }
    
    .status-processing {
      background: rgba(0, 86, 210, 0.1);
      color: var(--primary-color);
      animation: pulse 1s infinite;
    }
    
    .status-completed {
      background: rgba(40, 167, 69, 0.1);
      color: var(--accent-verified);
    }
    
    .file-remove {
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(220, 53, 69, 0.1);
      color: var(--accent-error);
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }
    
    .file-remove:hover {
      background: var(--accent-error);
      color: white;
      transform: scale(1.1);
    }
    
    .btn-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .verification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1rem;
      background: var(--bg-card);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      border: 1px solid var(--border-color);
    }
    
    .institution-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, var(--primary-color), var(--accent-info));
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
    }
    
    .user-info {
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .info-panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 3rem;
    }
    
    .info-card {
      background: var(--bg-card);
      border-radius: var(--border-radius);
      padding: 1.5rem;
      box-shadow: var(--box-shadow);
      border: 1px solid var(--border-color);
    }
    
    .info-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 1rem;
      color: var(--text-primary);
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .info-list {
      list-style: none;
      padding: 0;
    }
    
    .info-list li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: var(--text-secondary);
    }
    
    .info-list i {
      color: var(--accent-verified);
      font-size: 14px;
    }
    
    .security-features .feature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: var(--bg-secondary);
      border-radius: 6px;
    }
    
    .feature-item i {
      color: var(--primary-color);
      font-size: 16px;
    }
    
    .feature-item span {
      font-size: 0.9rem;
      color: var(--text-primary);
      font-weight: 500;
    }
    
    .govt-banner {
      background: linear-gradient(135deg, #ff6b35, #f7931e);
      color: white;
      padding: 1rem;
      margin-top: 3rem;
      border-radius: var(--border-radius);
      overflow: hidden;
    }
    
    @media (max-width: 768px) {
      .verification-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .info-panel {
        grid-template-columns: 1fr;
      }
      
      .security-features .feature-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize upload manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addUploadStyles();
  window.uploadManager = new UploadManager();
});