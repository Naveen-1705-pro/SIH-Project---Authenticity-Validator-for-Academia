// Support page functionality
class SupportManager {
  constructor() {
    this.chatOpen = false;
    this.chatMessages = [];
    this.initializeSupport();
  }
  
  initializeSupport() {
    this.setupEventListeners();
    this.initializeFAQ();
    this.initializeChatWidget();
    this.initializeContactForm();
    this.initializeAnimations();
  }
  
  setupEventListeners() {
    // Live chat button
    const liveChatBtn = document.getElementById('liveChatBtn');
    if (liveChatBtn) {
      liveChatBtn.addEventListener('click', () => this.openChat());
    }
    
    // Chat widget controls
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    
    if (closeChatBtn) {
      closeChatBtn.addEventListener('click', () => this.closeChat());
    }
    
    if (sendChatBtn) {
      sendChatBtn.addEventListener('click', () => this.sendChatMessage());
    }
    
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendChatMessage();
        }
      });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
    }
    
    // FAQ items
    this.setupFAQListeners();
  }
  
  setupFAQListeners() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => this.toggleFAQ(question));
    });
  }
  
  initializeFAQ() {
    // Add smooth animations to FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      setTimeout(() => {
        item.style.transition = 'all 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
  
  toggleFAQ(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = questionElement.querySelector('i');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item.active').forEach(item => {
      if (item !== faqItem) {
        item.classList.remove('active');
        const otherAnswer = item.querySelector('.faq-answer');
        const otherIcon = item.querySelector('.faq-question i');
        if (otherAnswer) otherAnswer.style.maxHeight = '0';
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      }
    });
    
    // Toggle current item
    if (!isActive) {
      faqItem.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      icon.style.transform = 'rotate(180deg)';
      
      // Add a subtle bounce animation
      setTimeout(() => {
        answer.style.transform = 'scale(1.02)';
        setTimeout(() => {
          answer.style.transform = 'scale(1)';
        }, 150);
      }, 300);
    } else {
      faqItem.classList.remove('active');
      answer.style.maxHeight = '0';
      icon.style.transform = 'rotate(0deg)';
    }
  }
  
  initializeChatWidget() {
    // Add initial bot message
    this.chatMessages = [
      {
        type: 'bot',
        message: "Hello! I'm here to help you with any questions about document verification. How can I assist you today?",
        timestamp: new Date()
      }
    ];
    
    this.renderChatMessages();
  }
  
  openChat() {
    const chatWidget = document.getElementById('chatWidget');
    if (chatWidget) {
      chatWidget.classList.remove('hidden');
      this.chatOpen = true;
      
      // Add entrance animation
      chatWidget.style.transform = 'translateY(100px) scale(0.8)';
      chatWidget.style.opacity = '0';
      setTimeout(() => {
        chatWidget.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        chatWidget.style.transform = 'translateY(0) scale(1)';
        chatWidget.style.opacity = '1';
      }, 10);
      
      // Focus on input
      const chatInput = document.getElementById('chatInput');
      if (chatInput) {
        setTimeout(() => chatInput.focus(), 300);
      }
      
      window.SACVS.showNotification('Chat opened - Our support team is ready to help!', 'info', 3000);
    }
  }
  
  closeChat() {
    const chatWidget = document.getElementById('chatWidget');
    if (chatWidget) {
      chatWidget.style.transform = 'translateY(100px) scale(0.8)';
      chatWidget.style.opacity = '0';
      setTimeout(() => {
        chatWidget.classList.add('hidden');
        chatWidget.style.transform = '';
        chatWidget.style.opacity = '';
      }, 300);
      
      this.chatOpen = false;
      window.SACVS.showNotification('Chat closed', 'info', 2000);
    }
  }
  
  async sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput || !chatInput.value.trim()) return;
    
    const userMessage = chatInput.value.trim();
    chatInput.value = '';
    
    // Add user message
    this.chatMessages.push({
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    });
    
    this.renderChatMessages();
    this.scrollChatToBottom();
    
    // Simulate bot typing
    this.showTypingIndicator();
    
    // Generate bot response after delay
    setTimeout(() => {
      this.hideTypingIndicator();
      const botResponse = this.generateBotResponse(userMessage);
      
      this.chatMessages.push({
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      });
      
      this.renderChatMessages();
      this.scrollChatToBottom();
    }, 1500 + Math.random() * 1000);
  }
  
  generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! Welcome to SACVS support. I'm here to help you with document verification. What would you like to know?";
    }
    
    if (message.includes('verification') || message.includes('verify')) {
      return "Document verification typically takes 2-5 minutes. You can upload PDF, PNG, or JPG files up to 10MB. The system uses blockchain technology to ensure authenticity. Do you have a specific question about the verification process?";
    }
    
    if (message.includes('blockchain')) {
      return "Our blockchain verification creates a unique digital fingerprint of your document and stores it on a tamper-proof network. This ensures any modifications can be instantly detected. Would you like to know more about how this protects your documents?";
    }
    
    if (message.includes('file') || message.includes('upload')) {
      return "We support PDF, PNG, and JPG files up to 10MB each. Make sure your documents are clear and readable. You can upload up to 5 files per verification session. Is there an issue with your file upload?";
    }
    
    if (message.includes('error') || message.includes('problem') || message.includes('issue')) {
      return "I understand you're experiencing an issue. Could you please describe the specific problem you're facing? Common issues include file format problems, network connectivity, or browser compatibility. I'm here to help resolve it!";
    }
    
    if (message.includes('contact') || message.includes('support')) {
      return "You can contact our support team through multiple channels: Use this chat, fill out the contact form on this page, call our helpline at 1800-XXX-XXXX, or email us. What type of assistance do you need?";
    }
    
    if (message.includes('thanks') || message.includes('thank')) {
      return "You're welcome! I'm glad I could help. If you have any other questions about document verification or need further assistance, feel free to ask. Have a great day!";
    }
    
    // Default responses
    const defaultResponses = [
      "I'd be happy to help you with that. Could you please provide more details about what you're looking for?",
      "That's a great question! Let me connect you with more specific information. Could you clarify what aspect you'd like to know more about?",
      "I'm here to assist you with document verification questions. Could you rephrase your question so I can provide the most helpful answer?",
      "For complex technical issues, I recommend contacting our support team directly at 1800-XXX-XXXX. They can provide detailed assistance. Is there anything else I can help you with right now?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  renderChatMessages() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = this.chatMessages.map(msg => `
      <div class="chat-message ${msg.type}">
        <div class="message-avatar">
          <i class="fas ${msg.type === 'bot' ? 'fa-robot' : 'fa-user'}"></i>
        </div>
        <div class="message-content">
          <p>${msg.message}</p>
        </div>
      </div>
    `).join('');
  }
  
  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chat-message bot typing';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    this.scrollChatToBottom();
  }
  
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  scrollChatToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
  
  async handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      institution: formData.get('institution'),
      category: formData.get('category'),
      message: formData.get('message')
    };
    
    // Validate form
    const errors = this.validateContactForm(contactData);
    if (errors.length > 0) {
      window.SACVS.showNotification(errors[0], 'error');
      return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    window.SACVS.showLoading(submitBtn, 'Sending...');
    
    try {
      // Simulate form submission
      await this.sleep(2000);
      
      // Store in localStorage (in real app, send to server)
      const supportTickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
      const ticket = {
        id: Date.now(),
        ...contactData,
        timestamp: new Date().toISOString(),
        status: 'submitted'
      };
      supportTickets.push(ticket);
      localStorage.setItem('supportTickets', JSON.stringify(supportTickets));
      
      // Clear form
      e.target.reset();
      
      window.SACVS.showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
      
      // Add confirmation animation
      this.showContactFormSuccess();
      
    } catch (error) {
      window.SACVS.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      window.SACVS.hideLoading(submitBtn);
    }
  }
  
  validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Please enter a valid name');
    }
    
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!data.category) {
      errors.push('Please select an issue category');
    }
    
    if (!data.message || data.message.trim().length < 10) {
      errors.push('Please provide a detailed message (at least 10 characters)');
    }
    
    return errors;
  }
  
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  showContactFormSuccess() {
    const form = document.getElementById('contactForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.innerHTML = `
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h3>Message Sent Successfully!</h3>
      <p>Thank you for contacting us. We've received your message and will respond within 24 hours.</p>
    `;
    
    form.parentNode.appendChild(successMessage);
    
    // Animate success message
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'translateY(20px)';
    setTimeout(() => {
      successMessage.style.transition = 'all 0.5s ease';
      successMessage.style.opacity = '1';
      successMessage.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
      successMessage.style.opacity = '0';
      setTimeout(() => {
        successMessage.remove();
      }, 500);
    }, 5000);
  }
  
  initializeAnimations() {
    // Animate support cards
    const supportCards = document.querySelectorAll('.support-card, .resource-card');
    supportCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 200);
    });
    
    // Add hover effects to resource cards
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.resource-icon');
        if (icon) {
          icon.style.transform = 'scale(1.1) rotate(5deg)';
          icon.style.background = 'linear-gradient(135deg, var(--accent-info), var(--primary-color))';
        }
      });
      
      card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.resource-icon');
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
          icon.style.background = '';
        }
      });
    });
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Additional styles for support page
function addSupportStyles() {
  if (document.querySelector('#support-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'support-styles';
  style.textContent = `
    .support-content {
      animation: fade-in-up 0.6s ease-out;
    }
    
    .faq-question {
      position: relative;
      overflow: hidden;
    }
    
    .faq-question::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 86, 210, 0.1), transparent);
      transition: left 0.5s ease;
    }
    
    .faq-question:hover::before {
      left: 100%;
    }
    
    .faq-answer {
      transition: all 0.3s ease;
    }
    
    .chat-message.typing .message-content {
      background: var(--bg-secondary);
      padding: 12px;
      border-radius: 12px;
    }
    
    .typing-dots {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    
    .typing-dots span {
      width: 8px;
      height: 8px;
      background: var(--text-secondary);
      border-radius: 50%;
      animation: typing-pulse 1.4s infinite;
    }
    
    .typing-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typing-pulse {
      0%, 80%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      40% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .form-success-message {
      background: var(--bg-card);
      border: 2px solid var(--accent-verified);
      border-radius: var(--border-radius);
      padding: 2rem;
      text-align: center;
      margin-top: 2rem;
      box-shadow: 0 8px 25px rgba(40, 167, 69, 0.15);
    }
    
    .success-icon {
      width: 60px;
      height: 60px;
      background: var(--accent-verified);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin: 0 auto 1rem;
      animation: success-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    @keyframes success-pop {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    .form-success-message h3 {
      color: var(--accent-verified);
      margin-bottom: 0.5rem;
    }
    
    .form-success-message p {
      color: var(--text-secondary);
    }
    
    .status-indicator {
      animation: pulse 2s infinite;
    }
    
    .status-indicator.online::before {
      animation: pulse-ring 2s infinite;
    }
    
    .chat-widget {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    .chat-message {
      animation: message-appear 0.3s ease-out;
    }
    
    @keyframes message-appear {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .resource-card {
      position: relative;
      overflow: hidden;
    }
    
    .resource-card::after {
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
    
    .resource-card:hover::after {
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
    
    .contact-form .form-input:focus,
    .contact-form .form-select:focus,
    .contact-form .form-textarea:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(0, 86, 210, 0.1);
      transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
      .support-header {
        text-align: left;
        padding: 0 1rem;
      }
      
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .help-resources {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .chat-widget {
        left: 10px;
        right: 10px;
        width: auto;
      }
    }
    
    @media (max-width: 480px) {
      .help-resources {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize support manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addSupportStyles();
  window.supportManager = new SupportManager();
});

// Make toggleFAQ available globally for onclick handlers in HTML
window.toggleFAQ = function(questionElement) {
  if (window.supportManager) {
    window.supportManager.toggleFAQ(questionElement);
  }
};