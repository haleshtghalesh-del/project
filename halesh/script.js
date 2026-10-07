/**
 * HALESH | SOFTWARE ENGINEER PORTFOLIO
 * Main Interactive JavaScript
 *
 * Features:
 * 1. Light / Night Mode Toggle with system preference detection & localStorage
 * 2. Mobile Hamburger Navigation Menu Toggle & Auto-Close
 * 3. Active Nav Link Scrollspy (IntersectionObserver)
 * 4. Contact Form Validation & User Feedback
 * 5. Dynamic Footer Copyright Year
 * 6. Pixel Art Sidebar — Collapse / Expand (Desktop) & Drawer (Mobile)
 * 7. Sidebar Scrollspy — synced active states
 * 8. Skills Progress Bars — animated on scroll reveal
 * 9. AI Chat Interface — simulated AI responses with portfolio context
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================================
     1. LIGHT / NIGHT MODE TOGGLE
     ======================================================================== */
  const themeToggleBtn   = document.getElementById('theme-toggle');
  const themeToggleLabel = document.getElementById('theme-toggle-label');
  const rootElement      = document.documentElement;
  const THEME_STORAGE_KEY = 'halesh-portfolio-theme';
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getSystemTheme() { return darkQuery.matches ? 'dark' : 'light'; }

  function applyTheme(theme, isManual = false) {
    rootElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night Mode');
    }
    if (themeToggleLabel) {
      themeToggleLabel.textContent = theme === 'dark' ? 'Night' : 'Light';
    }
    if (isManual) localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(savedTheme || getSystemTheme(), false);

  darkQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light', false);
  });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = rootElement.getAttribute('data-theme') || getSystemTheme();
      applyTheme(current === 'dark' ? 'light' : 'dark', true);
    });
  }

  /* ========================================================================
     2. MOBILE TOP NAVIGATION MENU
     ======================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const siteNav       = document.getElementById('site-nav');
  const topNavLinks   = document.querySelectorAll('.site-nav .nav-link');

  if (mobileMenuBtn && siteNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      mobileMenuBtn.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    topNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!siteNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        siteNav.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ========================================================================
     3. ACTIVE NAV LINK SCROLLSPY (top nav)
     ======================================================================== */
  const trackedSections = document.querySelectorAll('main > section');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        topNavLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { root: null, rootMargin: '-25% 0px -65% 0px', threshold: 0 });

  trackedSections.forEach((section) => scrollObserver.observe(section));

  /* ========================================================================
     4. CONTACT FORM VALIDATION & SUBMISSION
     ======================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus  = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput    = document.getElementById('contact-name');
      const emailInput   = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      let isValid = true;

      [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
        if (input && input.parentElement) input.parentElement.classList.remove('has-error');
      });

      if (!nameInput.value.trim()) { nameInput.parentElement.classList.add('has-error'); isValid = false; }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) { emailInput.parentElement.classList.add('has-error'); isValid = false; }
      if (!subjectInput.value.trim()) { subjectInput.parentElement.classList.add('has-error'); isValid = false; }
      if (!messageInput.value.trim()) { messageInput.parentElement.classList.add('has-error'); isValid = false; }

      if (!isValid) {
        if (formStatus) { formStatus.className = 'form-status-message error'; formStatus.textContent = 'Please fill in all required fields with valid information.'; }
        return;
      }

      /* TODO: Replace with Resend API or EmailJS call:
         const response = await fetch('/api/send-email', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ name, email, subject, message })
         });
      */

      if (formStatus) {
        formStatus.className = 'form-status-message success';
        formStatus.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been sent to Halesh. I will reply shortly.`;
      }
      contactForm.reset();

      setTimeout(() => {
        if (formStatus) { formStatus.className = 'form-status-message'; formStatus.textContent = ''; }
      }, 6000);
    });
  }

  /* ========================================================================
     5. DYNAMIC FOOTER COPYRIGHT YEAR
     ======================================================================== */
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

  /* ========================================================================
     6. PIXEL ART SIDEBAR — COLLAPSE / EXPAND & MOBILE DRAWER
     ======================================================================== */
  const pixelSidebar    = document.getElementById('pixel-sidebar');
  const collapseBtn     = document.getElementById('sidebar-collapse-btn');
  const mobileToggleBtn = document.getElementById('sidebar-mobile-toggle');
  const sidebarOverlay  = document.getElementById('sidebar-overlay');
  const sidebarLinks    = document.querySelectorAll('.sidebar-link');
  const SIDEBAR_STORAGE_KEY = 'halesh-sidebar-collapsed';

  /** Desktop: collapse / expand with localStorage persistence */
  function setSidebarCollapsed(collapsed, save = true) {
    if (!pixelSidebar) return;
    pixelSidebar.classList.toggle('collapsed', collapsed);
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    if (collapseBtn) {
      collapseBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      collapseBtn.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
    }
    if (save) localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? '1' : '0');
  }

  // Restore collapse state on page load (desktop only)
  if (window.innerWidth > 860 && localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1') {
    setSidebarCollapsed(true, false);
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      setSidebarCollapsed(!pixelSidebar.classList.contains('collapsed'));
    });
  }

  /** Mobile: slide-in drawer */
  function openMobileSidebar() {
    if (!pixelSidebar) return;
    pixelSidebar.classList.add('mobile-open');
    sidebarOverlay?.classList.add('active');
    mobileToggleBtn?.classList.add('open');
    mobileToggleBtn?.setAttribute('aria-expanded', 'true');
    sidebarOverlay?.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    if (!pixelSidebar) return;
    pixelSidebar.classList.remove('mobile-open');
    sidebarOverlay?.classList.remove('active');
    mobileToggleBtn?.classList.remove('open');
    mobileToggleBtn?.setAttribute('aria-expanded', 'false');
    sidebarOverlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', () => {
    pixelSidebar?.classList.contains('mobile-open') ? closeMobileSidebar() : openMobileSidebar();
  });

  sidebarOverlay?.addEventListener('click', closeMobileSidebar);

  // Close drawer on link click (mobile)
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) closeMobileSidebar();
    });
  });

  // Escape key closes sidebar on mobile
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pixelSidebar?.classList.contains('mobile-open')) closeMobileSidebar();
  });

  /* ========================================================================
     7. SIDEBAR SCROLLSPY — synced active states
     ======================================================================== */
  const sidebarSectionMap = {
    'hero':           document.getElementById('sb-nav-hero'),
    'about':          document.getElementById('sb-nav-about'),
    'skills':         document.getElementById('sb-nav-skills'),
    'timeline':       document.getElementById('sb-nav-timeline'),
    'projects':       document.getElementById('sb-nav-projects'),
    'portfolio-video':null, // no sidebar item for video section
    'testimonials':   document.getElementById('sb-nav-testimonials'),
    'chat':           document.getElementById('sb-nav-chat'),
    'contact':        document.getElementById('sb-nav-contact'),
  };

  const sidebarScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarLinks.forEach((l) => l.classList.remove('active'));
        const activeLink = sidebarSectionMap[id];
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { root: null, rootMargin: '-25% 0px -65% 0px', threshold: 0 });

  trackedSections.forEach((section) => sidebarScrollObserver.observe(section));

  /* ========================================================================
     8. SKILLS PROGRESS BARS — Animate fill on scroll reveal
     ======================================================================== */
  const skillBarItems = document.querySelectorAll('.skill-bar-item');

  // IntersectionObserver triggers the CSS animation by adding .animated class
  const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        skillBarObserver.unobserve(entry.target); // Animate only once
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.3 });

  skillBarItems.forEach((item) => skillBarObserver.observe(item));

  /* ========================================================================
     9. AI CHAT INTERFACE — Simulated AI responses
        TODO: Replace simulateAIResponse() with a real API call to:
              - OpenAI GPT-4o
              - Google Gemini
              - Anthropic Claude
        Pass portfolio context as a system prompt.
     ======================================================================== */
  const chatForm        = document.getElementById('chat-form');
  const chatInput       = document.getElementById('chat-input');
  const chatMessages    = document.getElementById('chat-messages');
  const chatTyping      = document.getElementById('chat-typing');
  const chatSuggestions = document.getElementById('chat-suggestions');

  // Portfolio knowledge base for simulated AI responses
  const portfolioKnowledge = {
    skills: [
      'Java', 'Python', 'JavaScript', 'TypeScript', 'C/C++', 'SQL',
      'React.js', 'Node.js', 'Express.js', 'Spring Boot', 'Next.js',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
      'Docker', 'AWS', 'Git', 'CI/CD', 'Jest', 'JUnit'
    ],
    projects: [
      'Enterprise Task & Workflow Management Platform (React, Node.js, PostgreSQL, WebSockets)',
      'Cloud-Native Microservices API Gateway (Java, Spring Boot, Docker, Redis, JWT)',
      'Medical Image Root Apex Detection System (Python, OpenCV, Flask)',
      'Scalable Multi-Vendor E-Commerce Backend (Node.js, TypeScript, MongoDB, Stripe)'
    ],
    experience: [
      'Software Engineer at Tech Innovators Corp (2024–Present)',
      'Software Engineering Intern at CloudPulse Solutions (2023)',
    ],
    education: 'B.E. in Computer Science from VTU (2020–2024) — First Class with Distinction',
    contact: 'Email: halesh.dev@example.com | Phone: +91 98765 43210 | LinkedIn: linkedin.com/in/halesh',
    location: 'Karnataka, India — Open to remote work and relocation',
  };

  /**
   * Generates a contextual simulated response based on the user's message.
   * TODO: Replace this function body with a fetch() to your chosen AI API.
   * 
   * @param {string} msg — user's input message
   * @returns {string} — AI response HTML string
   */
  function simulateAIResponse(msg) {
    const lower = msg.toLowerCase();

    if (/skill|tech|language|framework|tool|know|stack|proficien/i.test(lower)) {
      return `<p>Halesh is proficient in a wide range of technologies:</p>
        <p><strong>Languages:</strong> ${portfolioKnowledge.skills.slice(0,6).join(', ')}</p>
        <p><strong>Frameworks/Web:</strong> ${portfolioKnowledge.skills.slice(6,13).join(', ')}</p>
        <p><strong>Databases:</strong> ${portfolioKnowledge.skills.slice(13,18).join(', ')}</p>
        <p><strong>DevOps/Cloud:</strong> ${portfolioKnowledge.skills.slice(18).join(', ')}</p>`;
    }

    if (/project|work|build|built|portfol|app/i.test(lower)) {
      return `<p>Halesh has built some impressive projects! Here's a quick overview:</p>
        ${portfolioKnowledge.projects.map(p => `<p>→ ${p}</p>`).join('')}
        <p>Want to know more about any specific project?</p>`;
    }

    if (/experience|job|work|career|employ/i.test(lower)) {
      return `<p>Halesh's work experience includes:</p>
        ${portfolioKnowledge.experience.map(e => `<p>▸ ${e}</p>`).join('')}
        <p>He also achieved a <em>Hackathon Finalist</em> title at regional state-level competitions. 🏆</p>`;
    }

    if (/educat|degree|study|universit|college|vtu/i.test(lower)) {
      return `<p>🎓 ${portfolioKnowledge.education}</p>
        <p>Key subjects: Data Structures, OOP, DBMS, Computer Networks, OS, and Cloud Computing.</p>`;
    }

    if (/contact|email|phone|hire|reach|talk|meet/i.test(lower)) {
      return `<p>You can reach Halesh via:</p>
        <p>📧 ${portfolioKnowledge.contact}</p>
        <p>📍 ${portfolioKnowledge.location}</p>
        <p>He's currently <strong>open to full-time roles and project collaborations</strong>!</p>`;
    }

    if (/locat|where|india|karnatak|remote/i.test(lower)) {
      return `<p>📍 ${portfolioKnowledge.location}</p>`;
    }

    if (/hello|hi|hey|greet|howdy/i.test(lower)) {
      return `<p>Hey there! 👋 Great to see you here. I'm AI-Halesh.</p>
        <p>You can ask me about Halesh's <strong>skills</strong>, <strong>projects</strong>, <strong>work experience</strong>, or how to <strong>get in touch</strong>!</p>`;
    }

    // Default fallback response
    return `<p>That's an interesting question! I can help you learn about Halesh's <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, and <strong>contact info</strong>.</p>
      <p>Try asking: <em>"What technologies does Halesh know?"</em> or <em>"Tell me about his projects."</em> 🚀</p>`;
  }

  /** Appends a message bubble to the chat window */
  function appendMessage(role, htmlContent) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg chat-msg--${role}`;

    const avatarEl = document.createElement('div');
    avatarEl.className = 'chat-msg-avatar';
    avatarEl.textContent = role === 'ai' ? 'H' : 'You';
    avatarEl.setAttribute('aria-hidden', 'true');

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'chat-msg-bubble';
    bubbleEl.innerHTML = htmlContent;

    const timeEl = document.createElement('span');
    timeEl.className = 'chat-msg-time';
    timeEl.setAttribute('aria-label', `Message sent at ${timeStr}`);
    timeEl.textContent = timeStr;

    msgEl.appendChild(avatarEl);
    msgEl.appendChild(bubbleEl);
    msgEl.appendChild(timeEl);

    chatMessages.appendChild(msgEl);
    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /** Shows the animated typing indicator */
  function showTyping() {
    if (chatTyping) {
      chatTyping.classList.add('visible');
      chatTyping.setAttribute('aria-hidden', 'false');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  /** Hides the typing indicator */
  function hideTyping() {
    if (chatTyping) {
      chatTyping.classList.remove('visible');
      chatTyping.setAttribute('aria-hidden', 'true');
    }
  }

  /** Handles sending a message and showing the AI response */
  function sendMessage(message) {
    const trimmed = message.trim();
    if (!trimmed) return;

    // Show user message
    appendMessage('user', `<p>${escapeHtml(trimmed)}</p>`);

    // Clear input & hide suggestions after first message
    if (chatInput) chatInput.value = '';
    if (chatSuggestions) chatSuggestions.style.display = 'none';

    // Show typing indicator (simulates AI thinking delay)
    showTyping();

    // Simulate network delay — replace with actual API latency
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      hideTyping();
      const response = simulateAIResponse(trimmed);
      appendMessage('ai', response);
    }, delay);
  }

  /** HTML escape utility to prevent XSS in user input */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Chat form submit handler
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (chatInput && chatInput.value.trim()) {
        sendMessage(chatInput.value);
      }
    });
  }

  // Quick suggestion button handler
  document.querySelectorAll('.chat-suggestion-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt) sendMessage(prompt);
    });
  });

  // Allow Enter to submit chat (Shift+Enter for newline if needed)
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (chatInput.value.trim()) sendMessage(chatInput.value);
      }
    });
  }

});
