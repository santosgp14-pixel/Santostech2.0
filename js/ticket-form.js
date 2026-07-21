/* ============================================
   TICKET-FORM.JS — SantOps Ticketera
   ============================================ */

// ============================================================
// CONFIGURACIÓN
// ============================================================

// URL de tu Google Apps Script (reemplazá con la URL del nuevo deployment)
const TICKET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyy8U9rD3Bgwn-q5uYB_zxqPjQWmtk324XFbGNIzcCMk8OzEloA0HpYwjxPu1tA6YGHTQ/exec';

// Códigos de acceso válidos para clientes
// Agregá o eliminá códigos según tus clientes
const VALID_CLIENT_CODES = [
    'ST-RNKCFCT-01',
    'ST-CLIENT-02',
    'ST-CLIENT-03',
    'ST-CLIENT-04',
    'ST-CLIENT-05',
    'ST-DEMO-TEST',  // Para testear
];

// Paso actual del formulario
let currentStep = 1;
let activeClientCode = '';

// ============================================================
// PANTALLA DE ACCESO (GATE)
// ============================================================

function checkClientCode() {
    const input = document.getElementById('clientCode');
    const code = input.value.trim().toUpperCase();
    const errorEl = document.getElementById('gateError');
    const btnText = document.querySelector('.gate-btn-text');
    const btnLoading = document.querySelector('.gate-btn-loading');

    // Limpiar estado previo
    errorEl.style.display = 'none';
    input.classList.remove('shake');

    if (!code) {
        showGateError(input, errorEl, 'Ingresá tu código de cliente.');
        return;
    }

    // Simular verificación (pequeño delay para efecto)
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';

    setTimeout(() => {
        btnText.style.display = 'flex';
        btnLoading.style.display = 'none';

        if (VALID_CLIENT_CODES.includes(code)) {
            activeClientCode = code;
            unlockPortal(code);
        } else {
            showGateError(input, errorEl, 'Código incorrecto. Verificá e intentá de nuevo.');
        }
    }, 600);
}

function showGateError(input, errorEl, msg) {
    errorEl.textContent = '';
    errorEl.innerHTML = `
        <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5a.75.75 0 1 1 1.5 0v3.25a.75.75 0 1 1-1.5 0V4.5zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </svg>
        ${msg}
    `;
    errorEl.style.display = 'flex';
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
}

function unlockPortal(code) {
    const gate = document.getElementById('ticketGate');
    const form = document.getElementById('ticketForm');

    // Actualizar badge con código
    document.getElementById('clientCodeDisplay').textContent = code;

    // Animación de salida del gate
    gate.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    gate.style.opacity = '0';
    gate.style.transform = 'scale(1.03)';

    setTimeout(() => {
        gate.style.display = 'none';
        form.style.display = 'block';
        form.style.opacity = '0';
        form.style.transition = 'opacity 0.5s ease';

        requestAnimationFrame(() => {
            form.style.opacity = '1';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }, 500);
}

// Enter en el input también activa el botón
document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('clientCode');
    if (codeInput) {
        codeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') checkClientCode();
        });

        // Auto-uppercase mientras escribe
        codeInput.addEventListener('input', () => {
            const pos = codeInput.selectionStart;
            codeInput.value = codeInput.value.toUpperCase();
            codeInput.setSelectionRange(pos, pos);
        });
    }
});

// ============================================================
// STEPPER — NAVEGACIÓN ENTRE PASOS
// ============================================================

function goToStep(step) {
    // Validar paso actual antes de avanzar
    if (step > currentStep && !validateStep(currentStep)) return;

    const prevStep = currentStep;
    currentStep = step;

    // Ocultar paso anterior
    const prevEl = document.getElementById(`formStep${prevStep}`);
    if (prevEl) {
        prevEl.style.animation = 'none';
        prevEl.style.opacity = '0';
        prevEl.style.transform = step > prevStep ? 'translateX(-20px)' : 'translateX(20px)';
        setTimeout(() => {
            prevEl.style.display = 'none';
            showStep(step, step > prevStep);
        }, 200);
    }
}

function showStep(step, forward = true) {
    const el = document.getElementById(`formStep${step}`);
    if (!el) return;

    el.style.display = 'block';
    el.style.opacity = '0';
    el.style.transform = forward ? 'translateX(20px)' : 'translateX(-20px)';

    requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
    });

    updateStepper(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepper(activeStep) {
    for (let i = 1; i <= 3; i++) {
        const item = document.getElementById(`step-indicator-${i}`);
        if (!item) continue;

        item.classList.remove('active', 'completed');

        if (i < activeStep) {
            item.classList.add('completed');
        } else if (i === activeStep) {
            item.classList.add('active');
        }

        // Animar la línea entre pasos
        const lines = document.querySelectorAll('.stepper-line');
        lines.forEach((line, idx) => {
            if (idx < activeStep - 1) {
                line.classList.add('filled');
                line.querySelector ? null : null; // línea CSS lo maneja
                line.style.setProperty('--line-fill', '100%');
            } else {
                line.style.setProperty('--line-fill', '0%');
            }
        });
    }
}

// ============================================================
// VALIDACIÓN DE CAMPOS
// ============================================================

function validateStep(step) {
    let valid = true;

    if (step === 1) {
        const name = document.getElementById('t_name');
        const email = document.getElementById('t_email');

        if (!name.value.trim()) {
            showFieldError('t_name', 'err_name', 'El nombre es obligatorio.');
            valid = false;
        } else {
            clearFieldError('t_name', 'err_name');
        }

        if (!email.value.trim()) {
            showFieldError('t_email', 'err_email', 'El email es obligatorio.');
            valid = false;
        } else if (!isValidEmail(email.value)) {
            showFieldError('t_email', 'err_email', 'Ingresá un email válido.');
            valid = false;
        } else {
            clearFieldError('t_email', 'err_email');
        }
    }

    if (step === 2) {
        const category = document.getElementById('t_category');
        const priority = document.getElementById('t_priority');
        const title = document.getElementById('t_title');
        const description = document.getElementById('t_description');

        if (!category.value) {
            showFieldError('t_category', 'err_category', 'Seleccioná una categoría.');
            valid = false;
        } else {
            clearFieldError('t_category', 'err_category');
        }

        if (!priority.value) {
            showFieldError('t_priority', 'err_priority', 'Seleccioná la prioridad.');
            valid = false;
        } else {
            clearFieldError('t_priority', 'err_priority');
        }

        if (!title.value.trim()) {
            showFieldError('t_title', 'err_title', 'El título del ticket es obligatorio.');
            valid = false;
        } else if (title.value.trim().length < 10) {
            showFieldError('t_title', 'err_title', 'El título debe tener al menos 10 caracteres.');
            valid = false;
        } else {
            clearFieldError('t_title', 'err_title');
        }

        if (!description.value.trim()) {
            showFieldError('t_description', 'err_description', 'La descripción es obligatoria.');
            valid = false;
        } else if (description.value.trim().length < 20) {
            showFieldError('t_description', 'err_description', 'Por favor describí el problema con más detalle.');
            valid = false;
        } else {
            clearFieldError('t_description', 'err_description');
        }
    }

    return valid;
}

function showFieldError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) {
        error.textContent = msg;
        error.style.display = 'block';
        error.style.animation = 'none';
        requestAnimationFrame(() => { error.style.animation = 'errorIn 0.3s ease'; });
    }
}

function clearFieldError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (error) error.style.display = 'none';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', () => {
    const fields = ['t_name', 't_email', 't_title', 't_description'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                if (el.classList.contains('error')) {
                    clearFieldError(id, `err_${id.replace('t_', '')}`);
                }
            });
        }
    });
});

// ============================================================
// INTERACCIONES — PRIORIDAD Y CATEGORÍA
// ============================================================

function updatePriorityBadge() {
    const select = document.getElementById('t_priority');
    const indicator = document.getElementById('priorityIndicator');
    const dot = document.getElementById('priorityDot');
    const label = document.getElementById('priorityLabel');
    const bar = document.getElementById('priorityBar');

    const config = {
        baja:    { label: 'Prioridad Baja — Te respondemos en 48–72 hs', dot: 'baja', color: '#22c55e', barWidth: '25%' },
        media:   { label: 'Prioridad Media — Te respondemos en 24 hs', dot: 'media', color: '#eab308', barWidth: '50%' },
        alta:    { label: 'Prioridad Alta — Te respondemos hoy', dot: 'alta', color: '#ef4444', barWidth: '75%' },
        urgente: { label: '🚨 Urgente — Respondemos en menos de 2 hs', dot: 'urgente', color: '#dc2626', barWidth: '100%' },
    };

    const val = select.value;
    if (!val) { indicator.style.display = 'none'; return; }

    const cfg = config[val];
    indicator.style.display = 'flex';
    dot.className = `priority-dot ${cfg.dot}`;
    label.textContent = cfg.label;
    bar.style.background = cfg.color;
    bar.style.width = cfg.barWidth;
}

// Char counter para el título
document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('t_title');
    const charCount = document.getElementById('charCount');
    if (titleInput && charCount) {
        titleInput.addEventListener('input', () => {
            const len = titleInput.value.length;
            charCount.textContent = len;
            charCount.style.color = len > 100 ? 'var(--error)' : 'var(--text-secondary)';
        });
    }
});

// ============================================================
// ENVÍO DEL TICKET
// ============================================================

async function submitTicket() {
    // Validar paso 2 antes de enviar
    if (!validateStep(2)) return;

    const submitBtn = document.getElementById('submitBtnText');
    const loadingBtn = document.getElementById('submitBtnLoading');
    const errorEl = document.getElementById('ticketError');

    // Estado de carga
    submitBtn.style.display = 'none';
    loadingBtn.style.display = 'flex';
    errorEl.style.display = 'none';

    // Recopilar datos
    const ticketData = {
        clientCode: activeClientCode,
        name:        document.getElementById('t_name').value.trim(),
        email:       document.getElementById('t_email').value.trim(),
        company:     document.getElementById('t_company').value.trim(),
        phone:       document.getElementById('t_phone').value.trim(),
        category:    document.getElementById('t_category').value,
        categoryLabel: document.getElementById('t_category').options[document.getElementById('t_category').selectedIndex].text,
        priority:    document.getElementById('t_priority').value,
        priorityLabel: document.getElementById('t_priority').options[document.getElementById('t_priority').selectedIndex].text,
        title:       document.getElementById('t_title').value.trim(),
        description: document.getElementById('t_description').value.trim(),
        timestamp:   new Date().toISOString(),
        source:      'Portal Web SantOps',
    };

    try {
        const response = await fetch(TICKET_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketData),
        });

        // Con no-cors asumimos éxito si no hay excepción
        // Generar ID local como fallback (el script también lo genera)
        const ticketId = generateLocalTicketId();
        showSuccessScreen(ticketId);

    } catch (error) {
        console.error('Error enviando ticket:', error);
        submitBtn.style.display = 'flex';
        loadingBtn.style.display = 'none';
        errorEl.style.display = 'flex';
    }
}

function generateLocalTicketId() {
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 9000) + 1000);
    return `#ST-${year}-${num}`;
}

function showSuccessScreen(ticketId) {
    // Ocultar pasos del formulario
    document.getElementById('formStep1').style.display = 'none';
    document.getElementById('formStep2').style.display = 'none';

    // Mostrar pantalla de éxito
    const successScreen = document.getElementById('ticketSuccess');
    successScreen.style.display = 'block';

    // Mostrar ID del ticket
    document.getElementById('ticketIdDisplay').textContent = ticketId;

    // Actualizar stepper al paso 3 (completado)
    updateStepper(3);
    const step3 = document.getElementById('step-indicator-3');
    if (step3) {
        step3.classList.remove('active');
        step3.classList.add('completed');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// COPIAR ID DE TICKET
// ============================================================

function copyTicketId() {
    const ticketId = document.getElementById('ticketIdDisplay').textContent;
    const btn = document.getElementById('copyTicketId');

    navigator.clipboard.writeText(ticketId).then(() => {
        btn.innerHTML = `
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ¡Copiado!
        `;
        btn.style.background = 'rgba(16, 185, 129, 0.15)';
        btn.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        btn.style.color = '#059669';

        setTimeout(() => {
            btn.innerHTML = `
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                    <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M5 5V3a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Copiar
            `;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    }).catch(() => {
        // Fallback para navegadores sin clipboard API
        btn.textContent = '✓ Copiado';
        setTimeout(() => { btn.innerHTML = `Copiar`; }, 2000);
    });
}

// ============================================================
// RESETEAR FORMULARIO (abrir otro ticket)
// ============================================================

function resetTicketForm() {
    document.getElementById('ticketMainForm').reset();
    document.getElementById('ticketSuccess').style.display = 'none';
    document.getElementById('ticketError').style.display = 'none';
    document.getElementById('priorityIndicator').style.display = 'none';
    document.getElementById('charCount').textContent = '0';

    // Limpiar errores
    document.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.ticket-input, .ticket-select, .ticket-textarea').forEach(el => el.classList.remove('error'));

    currentStep = 1;
    showStep(1, false);
}

// ============================================================
// ANIMACIÓN DE ENTRADA DEL GATE
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Efecto de partículas sutiles en el gate (solo desktop)
    if (window.innerWidth > 1024) {
        createGateParticles();
    }
});

function createGateParticles() {
    const bg = document.querySelector('.ticket-gate-bg');
    if (!bg) return;

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(8, 145, 178, ${Math.random() * 0.4 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * -8}s infinite;
        `;
        bg.appendChild(particle);
    }

    // Agregar keyframe de partículas
    if (!document.getElementById('particleStyle')) {
        const style = document.createElement('style');
        style.id = 'particleStyle';
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.4; }
                25% { transform: translateY(-${Math.random() * 40 + 20}px) translateX(${Math.random() * 20 - 10}px) scale(1.2); opacity: 0.8; }
                50% { transform: translateY(-${Math.random() * 60 + 30}px) translateX(${Math.random() * 30 - 15}px) scale(0.8); opacity: 0.3; }
                75% { transform: translateY(-${Math.random() * 20 + 10}px) translateX(${Math.random() * 15 - 8}px) scale(1.1); opacity: 0.6; }
            }
        `;
        document.head.appendChild(style);
    }
}
