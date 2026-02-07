// Smooth scroll para los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Cerrar menú móvil si está abierto
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

// Animación al hacer scroll con Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a los elementos
const animatedElements = document.querySelectorAll('.problem-card, .service-card, .step, .diff-card, .audience-card');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// Añadir efecto parallax suave al hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        const translateY = Math.min(scrolled * 0.3, 100);
        const opacity = Math.max(1 - (scrolled / hero.offsetHeight) * 0.3, 0.7);
        hero.style.transform = `translateY(${translateY}px)`;
        hero.style.opacity = opacity;
    }
});

// Sticky header con sombra al hacer scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 8px 24px rgba(8, 145, 178, 0.15)';
    } else {
        header.style.boxShadow = '0 4px 24px rgba(8, 145, 178, 0.08)';
    }
});

// Counter animation para las estadísticas
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
};

// Observar cuando las estadísticas entran en viewport
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    stat.dataset.suffix = text.replace(number, '');
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// SCROLL PROGRESS BAR
// ===================================
const scrollProgress = document.querySelector('.scroll-progress');

if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// ===================================
// CONTACT FORM HANDLING
// ===================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value || 'No proporcionado',
            company: document.getElementById('company').value || 'No proporcionado',
            message: document.getElementById('message').value
        };
        
        // Mostrar estado de carga
        const btnText = contactForm.querySelector('.btn-text');
        const btnLoading = contactForm.querySelector('.btn-loading');
        const submitBtn = contactForm.querySelector('.btn-submit');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;
        
        // Simular envío
        try {
            // Crear mensaje para WhatsApp
            const whatsappMessage = `Hola! Mi nombre es ${formData.name}.%0A%0AEmail: ${formData.email}%0ATel: ${formData.phone}%0AEmpresa: ${formData.company}%0A%0AMensaje:%0A${formData.message}`;
            const whatsappLink = `https://wa.me/541126730434?text=${whatsappMessage}`;
            
            // Simular delay de envío
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Ocultar formulario y mostrar mensaje de éxito
            contactForm.style.display = 'none';
            formSuccess.style.display = 'flex';
            
            // Abrir WhatsApp después de 2 segundos
            setTimeout(() => {
                window.open(whatsappLink, '_blank');
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            contactForm.style.display = 'none';
            formError.style.display = 'flex';
        } finally {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
    
    // Resetear formulario cuando se hace clic en los mensajes
    if (formSuccess) {
        formSuccess.addEventListener('click', () => {
            formSuccess.style.display = 'none';
            contactForm.style.display = 'flex';
            contactForm.reset();
        });
    }
    
    if (formError) {
        formError.addEventListener('click', () => {
            formError.style.display = 'none';
            contactForm.style.display = 'flex';
        });
    }
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================
// Lazy loading para imágenes (si agregas imágenes en el futuro)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Optimización de will-change para animaciones
const optimizeAnimations = () => {
    const animatedEls = document.querySelectorAll('.whatsapp-float, .scroll-to-top, .mobile-menu');
    animatedEls.forEach(el => {
        el.style.willChange = 'transform';
    });
};

// Ejecutar después de que la página cargue
window.addEventListener('load', optimizeAnimations);

// ===================================
// FAQ ACCORDION
// ===================================
window.addEventListener('load', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('FAQ items encontrados:', faqItems.length);
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Click en FAQ item:', index);
                
                // Cerrar todos los otros items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle el item actual
                item.classList.toggle('active');
                console.log('Item activo:', item.classList.contains('active'));
            });
        }
    });
});

console.log('🚀 SantOps - Website loaded successfully!');

// ===================================
// ADVANCED CARD INTERACTIONS - 3D TILT EFFECT
// ===================================
class CardTilt {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            maxTilt: options.maxTilt || 8,
            perspective: options.perspective || 1000,
            scale: options.scale || 1.02,
            speed: options.speed || 400,
            glare: options.glare !== undefined ? options.glare : true,
            maxGlare: options.maxGlare || 0.5
        };
        
        this.reset = true;
        this.onMouseEnterBound = this.onMouseEnter.bind(this);
        this.onMouseMoveBound = this.onMouseMove.bind(this);
        this.onMouseLeaveBound = this.onMouseLeave.bind(this);
        
        this.addEventListeners();
        
        // Agregar glare element si está habilitado
        if (this.options.glare) {
            this.glareElement = document.createElement('div');
            this.glareElement.classList.add('card-glare');
            this.element.appendChild(this.glareElement);
        }
    }
    
    addEventListeners() {
        this.element.addEventListener('mouseenter', this.onMouseEnterBound);
        this.element.addEventListener('mousemove', this.onMouseMoveBound);
        this.element.addEventListener('mouseleave', this.onMouseLeaveBound);
    }
    
    onMouseEnter() {
        this.element.style.willChange = 'transform';
        this.reset = false;
    }
    
    onMouseMove(e) {
        if (this.reset) return;
        
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const percentageX = x / rect.width;
        const percentageY = y / rect.height;
        
        const tiltX = (percentageY - 0.5) * this.options.maxTilt * 2;
        const tiltY = (percentageX - 0.5) * -this.options.maxTilt * 2;
        
        this.element.style.transform = `
            perspective(${this.options.perspective}px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale3d(${this.options.scale}, ${this.options.scale}, ${this.options.scale})
        `;
        
        // Update glare
        if (this.glareElement) {
            const glareX = percentageX * 100;
            const glareY = percentageY * 100;
            
            this.glareElement.style.background = `
                radial-gradient(circle at ${glareX}% ${glareY}%, 
                rgba(255, 255, 255, ${this.options.maxGlare}) 0%, 
                transparent 50%)
            `;
            this.glareElement.style.opacity = '1';
        }
    }
    
    onMouseLeave() {
        this.reset = true;
        this.element.style.willChange = 'auto';
        this.element.style.transform = `
            perspective(${this.options.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;
        
        if (this.glareElement) {
            this.glareElement.style.opacity = '0';
        }
    }
}

// Inicializar efecto tilt en todas las tarjetas
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .problem-card, .audience-card, .diff-card');
    cards.forEach(card => {
        new CardTilt(card, {
            maxTilt: 5,
            perspective: 1500,
            scale: 1.03,
            speed: 300,
            glare: true,
            maxGlare: 0.3
        });
    });
});

// ===================================
// MAGNETIC BUTTON EFFECT
// ===================================
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.boundingRect = null;
        
        this.element.addEventListener('mouseenter', () => {
            this.boundingRect = this.element.getBoundingClientRect();
        });
        
        this.element.addEventListener('mousemove', (e) => {
            if (!this.boundingRect) return;
            
            const x = e.clientX - this.boundingRect.left - this.boundingRect.width / 2;
            const y = e.clientY - this.boundingRect.top - this.boundingRect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 50;
            
            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const translateX = x * strength * 0.3;
                const translateY = y * strength * 0.3;
                
                this.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
            }
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = '';
            this.boundingRect = null;
        });
    }
}

// Aplicar efecto magnético a botones principales
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-primary, .nav-cta');
    buttons.forEach(button => {
        new MagneticButton(button);
    });
});

// ===================================
// PARALLAX SCROLL EFFECT FOR SECTIONS
// ===================================
const parallaxElements = document.querySelectorAll('.service-icon, .problem-icon, .diff-icon');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const speed = 0.3 + (index % 3) * 0.1;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yPos = -(scrolled - elementTop) * speed;
            element.style.transform = `translateY(${yPos}px)`;
        }
    });
});

// ===================================
// ANIMATED GRADIENT BACKGROUNDS
// ===================================
const createAnimatedGradient = (element) => {
    let angle = 0;
    
    const animate = () => {
        angle = (angle + 0.5) % 360;
        element.style.background = `
            linear-gradient(${angle}deg, 
                rgba(8, 145, 178, 0.1) 0%, 
                rgba(59, 130, 246, 0.1) 50%, 
                rgba(6, 182, 212, 0.1) 100%)
        `;
        requestAnimationFrame(animate);
    };
    
    animate();
};

// ===================================
// INTERSECTION OBSERVER FOR STAGGER ANIMATIONS
// ===================================
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.service-card, .problem-card, .audience-card, .diff-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Observar grids para animación escalonada
const grids = document.querySelectorAll('.services-grid, .problems-grid, .audience-grid, .diff-grid');
grids.forEach(grid => staggerObserver.observe(grid));

// ===================================
// CURSOR TRAIL EFFECT (SUTIL)
// ===================================
const createCursorTrail = () => {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-trail');
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const animateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    
    animateCursor();
};

// Activar cursor trail en desktop
if (window.innerWidth > 1024) {
    createCursorTrail();
}

console.log('✨ Advanced interactions loaded!');