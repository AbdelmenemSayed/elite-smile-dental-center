/**
 * Elite Smile Dental Center - Main Interactive Engine
 * Handles Before/After Slider, Insurance Search, Booking & WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initBeforeAfterSlider();
  initInsuranceSearch();
  initBookingForm();
  initFaqAccordion();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Mobile Menu Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking on any link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   2. Sticky Header Scroll Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Interactive Before/After Split Comparison Slider
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const sliderBox = document.getElementById('baSliderBox');
  const afterLayer = document.getElementById('baAfterLayer');
  const afterImg = document.getElementById('baAfterImg');
  const handle = document.getElementById('baHandle');
  const caseButtons = document.querySelectorAll('.ba-nav-btn');
  const caseTitle = document.getElementById('baCaseTitle');
  const caseDesc = document.getElementById('baCaseDesc');
  const beforeImg = document.getElementById('baBeforeImg');

  if (!sliderBox || !afterLayer || !handle) return;

  let isDragging = false;

  // Sync after image width to match parent container
  function syncImageWidth() {
    if (afterImg) {
      afterImg.style.width = `${sliderBox.offsetWidth}px`;
    }
  }
  syncImageWidth();
  window.addEventListener('resize', syncImageWidth);

  function setSliderPosition(xPos) {
    const rect = sliderBox.getBoundingClientRect();
    let pos = (xPos - rect.left) / rect.width;
    
    // Clamp between 5% and 95%
    if (pos < 0.05) pos = 0.05;
    if (pos > 0.95) pos = 0.95;

    const percentage = pos * 100;
    
    // In RTL, afterLayer is aligned to right
    handle.style.left = `${percentage}%`;
    afterLayer.style.width = `${100 - percentage}%`;
  }

  // Pointer & Mouse Events
  sliderBox.addEventListener('pointerdown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  // Touch Events for Mobile
  sliderBox.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches.length > 0) {
      setSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      setSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Case Studies Data
  const cases = {
    fillings: {
      title: 'الحشوات التجميلية للأسنان الأمامية',
      desc: 'إعادة بناء وتجميل الأسنان الأمامية التالفة بحشوات كمبوزيت ميكروسكوبية ذات تطابق لوني وتشريحي طبيعي 100% بدون أي ألم.',
      beforeImg: 'assets/case-fillings.jpg',
      afterImg: 'assets/case-fillings.jpg',
      initialPos: 50
    },
    implants: {
      title: 'تركيبات وزراعة الأسنان لابتسامة متكاملة',
      desc: 'تعويض الأسنان المفقودة بغرسات التيتانيوم الألمانية عالية الثبات وتركيب تيجان الزيركون الجمالية لاستعادة وظيفة المضغ والشكل الطبيعي.',
      beforeImg: 'assets/case-implant.jpg',
      afterImg: 'assets/case-implant.jpg',
      initialPos: 50
    },
    hollywood: {
      title: 'ابتسامة هوليوود وعدسات الفينير (Hollywood Smile)',
      desc: 'تصميم ابتسامة المشاهير المخصصة وفق نسب الوجه الذهبية باستخدام عدسات إيماكس فائقة النقاء والدقة لابتسامة متألقة تدوم طويلاً.',
      beforeImg: 'assets/hero-banner.jpg',
      afterImg: 'assets/hollywood-smile.jpg',
      initialPos: 50
    }
  };

  caseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      caseButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const caseKey = btn.getAttribute('data-case');
      const data = cases[caseKey];

      if (data) {
        if (caseTitle) caseTitle.textContent = data.title;
        if (caseDesc) caseDesc.textContent = data.desc;
        if (beforeImg) beforeImg.src = data.beforeImg;
        if (afterImg) {
          afterImg.src = data.afterImg;
          syncImageWidth();
        }
        
        // Reset slider to middle
        handle.style.left = '50%';
        afterLayer.style.width = '50%';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Insurance Search & Partner Filtering
   -------------------------------------------------------------------------- */
function initInsuranceSearch() {
  const searchInput = document.getElementById('insuranceSearch');
  const cards = document.querySelectorAll('.insurance-card');
  const countBadge = document.getElementById('insuranceCount');
  const insuranceSelect = document.getElementById('bookingInsurance');

  if (!searchInput || !cards) return;

  function filterPartners() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const name = card.getAttribute('data-name').toLowerCase();
      const category = card.getAttribute('data-category') || '';
      
      if (name.includes(query) || category.toLowerCase().includes(query)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countBadge) {
      if (query) {
        countBadge.textContent = `تم العثور على ${visibleCount} جهة متعاقدة تطابق بحثك`;
      } else {
        countBadge.textContent = `شبكة تضم أكثر من 29 جهة وشركة تأمين ونقابة معتمدة`;
      }
    }
  }

  searchInput.addEventListener('input', filterPartners);

  // Clicking an insurance card autofills the booking form and scrolls there
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const partnerName = card.getAttribute('data-name');
      if (insuranceSelect) {
        // Find matching option or add
        let found = false;
        for (let i = 0; i < insuranceSelect.options.length; i++) {
          if (insuranceSelect.options[i].text.includes(partnerName)) {
            insuranceSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          const opt = new Option(partnerName, partnerName, true, true);
          insuranceSelect.add(opt);
        }

        // Smooth scroll to booking form
        const bookingSec = document.getElementById('booking');
        if (bookingSec) {
          bookingSec.scrollIntoView({ behavior: 'smooth' });
          insuranceSelect.focus();
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Booking Form & WhatsApp Integration
   -------------------------------------------------------------------------- */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const modal = document.getElementById('confirmationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalWhatsappLink = document.getElementById('modalWhatsappBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const branch = document.getElementById('bookingBranch').value;
    const service = document.getElementById('bookingService').value;
    const insurance = document.getElementById('bookingInsurance').value;
    const notes = document.getElementById('bookingNotes').value.trim();

    if (!name || !phone) {
      alert('يرجى كتابة الاسم ورقم الهاتف للتواصل معك');
      return;
    }

    // Format Structured WhatsApp Message
    let waMessage = `*طلب حجز موعد جديد - مركز إيليت سمايل*\n\n`;
    waMessage += `👤 *الاسم:* ${name}\n`;
    waMessage += `📱 *رقم الهاتف:* ${phone}\n`;
    waMessage += `🏢 *الفرع المفضل:* ${branch}\n`;
    waMessage += `✨ *الخدمة المطلوبة:* ${service}\n`;
    waMessage += `🛡️ *شركة التأمين:* ${insurance || 'بدون تأمين / كشف خاص'}\n`;
    if (notes) {
      waMessage += `📝 *ملاحظات:* ${notes}\n`;
    }
    waMessage += `\n_تم الإرسال عبر الموقع الإلكتروني لمركز إيليت سمايل_`;

    const encodedMsg = encodeURIComponent(waMessage);
    const whatsappUrl = `https://wa.me/201065863017?text=${encodedMsg}`;

    // Update modal button
    if (modalWhatsappLink) {
      modalWhatsappLink.href = whatsappUrl;
    }

    // Show luxury confirmation modal
    if (modal) {
      modal.classList.add('active');
    }

    // Reset form
    form.reset();
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   7. Smooth Anchor Scroll with Offset
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
