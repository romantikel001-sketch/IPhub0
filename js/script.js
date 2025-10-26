document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    const modal = document.getElementById('consultationModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name') || this.querySelector('input[type="text"]').value,
                phone: formData.get('phone') || this.querySelector('input[type="tel"]').value,
                email: formData.get('email') || this.querySelector('input[type="email"]').value,
                message: formData.get('message') || this.querySelector('textarea').value
            };

            console.log('Данные формы:', data);
            
            showNotification('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
            
            closeModal();
            consultationForm.reset();
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    item.classList.toggle('active');
                });
            }
        });
    }

    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.textContent.trim();
            filterItems(category);
        });
    });

    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterBySearch(searchTerm);
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.card, .svc-card, .stat-item, .case-card, .category-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const accordionDetails = document.querySelectorAll('details');
    accordionDetails.forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                accordionDetails.forEach(otherDetail => {
                    if (otherDetail !== this) {
                        otherDetail.open = false;
                    }
                });
            }
        });
    });
});

function openConsultationForm() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
    }
}

function closeModal() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; 
    }
}

function filterItems(category) {
    const items = document.querySelectorAll('.faq-item, .case-card');
    items.forEach(item => {
        if (category === 'Все услуги') {
            item.style.display = 'block';
        } else {
            item.style.display = 'block';
        }
    });
}

function filterBySearch(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    let hasResults = false;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const text = (question?.textContent + ' ' + answer?.textContent).toLowerCase();
        
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
            hasResults = true;
            
            if (searchTerm.length > 2) {
                highlightText(item, searchTerm);
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    const noResults = document.getElementById('noResults');
    if (!hasResults && searchTerm.length > 0) {
        if (!noResults) {
            const message = document.createElement('div');
            message.id = 'noResults';
            message.style.textAlign = 'center';
            message.style.padding = '40px';
            message.style.color = 'var(--muted)';
            message.textContent = 'По вашему запросу ничего не найдено.';
            document.querySelector('.faq-list').appendChild(message);
        }
    } else if (noResults) {
        noResults.remove();
    }
}

function highlightText(element, searchTerm) {
    const text = element.innerHTML;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlighted = text.replace(regex, '<mark class="search-highlight">$1</mark>');
    element.innerHTML = highlighted;
}

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--panel);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 15px 20px;
        color: #fff;
        z-index: 3000;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: var(--muted);
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .search-highlight {
        background-color: var(--accent);
        color: #111;
        padding: 2px 4px;
        border-radius: 3px;
    }
    
    .notification-success {
        border-left: 4px solid #27ae60;
    }
    
    .notification-error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification-info {
        border-left: 4px solid #3498db;
    }
`;
document.head.appendChild(style);

window.addEventListener('load', function() {
    console.log('IPhub website loaded successfully');
    
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

const revealElements = document.querySelectorAll('.reveal, section, .card, .block');
const revealOnScroll = () => {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.transition = 'all 0.8s ease-out';
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

window.addEventListener('load', () => {
  const title = document.querySelector('h1, .main-title');
  if (title) {
    title.style.opacity = '0';
    title.style.transform = 'translateY(20px)';
    title.style.transition = 'all 1s ease-out';
    setTimeout(() => {
      title.style.opacity = '1';
      title.style.transform = 'translateY(0)';
    }, 200);
  }
});

const buttons = document.querySelectorAll('button, .btn');
buttons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.05)';
    btn.style.transition = 'transform 0.2s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
  });
});

let lastScrollTop = 0;
const nav = document.querySelector('nav, .navbar');
window.addEventListener('scroll', () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  if (nav) {
    if (st < lastScrollTop) {
      nav.style.transform = 'translateY(0)';
      nav.style.transition = 'transform 0.4s ease';
    } else {
      nav.style.transform = 'translateY(-100%)';
    }
  }
  lastScrollTop = st <= 0 ? 0 : st;
});

const images = document.querySelectorAll('img');
images.forEach(img => {
  img.style.transition = 'transform 0.4s ease';
  img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
  img.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
});
