// Templates de mensajes
const messageTemplates = {
    bienvenida: {
        label: 'Cliente',
        template: (name, company) => `Hola ${name},

¡Bienvenido a bordo! Estamos emocionados de comenzar a trabajar contigo y transformar ${company}.

Nos comprometemos a: (1) Cumplir todos los plazos acordados, (2) Mantener comunicación constante y transparente, (3) Entregarte resultados medibles desde el día 1.

Próximos pasos:
• En las próximas 48 horas recibirás el cronograma detallado
• Agendaré nuestra primera sesión de kickoff
• Tendrás acceso directo a mí por WhatsApp 24/7

¿Preguntas? Respóndeme este mensaje.

Gracias por confiar en SantOps para llevar tu negocio al siguiente nivel.

Saludos,
Equipo SantOps`
    },
    seguimiento: {
        label: 'Monto de propuesta',
        template: (name, company, extra) => `Hola ${name},

¿Tuviste oportunidad de revisar la propuesta que te enviamos para ${company}?

Recap rápido:
• Inversión: ${extra || '$XX,XXX'}
• ROI estimado: 300-500% en 12 meses
• Tiempo de implementación: [X semanas]
• Ahorro proyectado: [X horas/semana]

Entiendo que tomar decisiones estratégicas requiere tiempo. Si tienes dudas o necesitas ajustes, estoy disponible para:
• Responder preguntas específicas
• Ajustar el alcance según tu presupuesto
• Programar una llamada de 15 minutos para aclarar detalles

¿Cuándo te viene bien que hablemos?

Saludos,
Equipo SantOps`
    },
    recordatorio: {
        label: 'Monto pendiente',
        template: (name, company, extra) => `Hola ${name},

Espero que estés bien. Te escribo para recordarte que tenemos un pago pendiente:

• Monto: ${extra || '$XX,XXX'}
• Concepto: Servicios para ${company}
• Vencimiento: [Fecha]

Si ya procesaste el pago, por favor ignora este mensaje y envíame el comprobante para actualizar nuestros registros.

Opciones de pago:
• Transferencia bancaria: [Datos]
• MercadoPago/PayPal: [Link]

¿Alguna dificultad? Podemos evaluar opciones de pago en cuotas o ajustar fechas. Mi prioridad es encontrar una solución que funcione para ambos.

Quedo atento.

Saludos,
Equipo SantOps`
    },
    agradecimiento: {
        label: 'Producto/Servicio',
        template: (name, company, extra) => `Hola ${name},

¡Gracias por elegirnos! Tu confianza en SantOps significa mucho para nosotros.

Ya estamos trabajando en ${extra || 'tu proyecto'} para ${company}. Nuestro compromiso:

• Resultados medibles en las primeras 2 semanas
• Comunicación constante sobre el progreso
• Soporte ilimitado durante 30 días post-implementación

¿Necesitas ayuda o tienes preguntas? Escríbeme directamente:
• WhatsApp: +54 11 2673-0434 (respuesta en <2 horas)
• Email: santosgp14@gmail.com

Ah, y si conoces a alguien que pueda beneficiarse de automatización, te agradeceremos la referencia (y ellos recibirán un 15% de descuento).

¡A construir algo genial juntos!

Saludos,
Equipo SantOps`
    }
};

// Elementos del DOM
const clientNameInput = document.getElementById('clientName');
const companyNameInput = document.getElementById('companyName');
const messageTypeSelect = document.getElementById('messageType');
const extraFieldInput = document.getElementById('extraField');
const extraFieldLabel = document.getElementById('extraFieldLabel');
const extraFieldContainer = document.getElementById('extraFieldContainer');
const generateBtn = document.getElementById('generateBtn');
const generatedMessage = document.getElementById('generatedMessage');
const outputRecipient = document.getElementById('outputRecipient');
const copyBtn = document.getElementById('copyBtn');
const copySuccess = document.getElementById('copySuccess');
const whatsappBtn = document.getElementById('whatsappBtn');
const emailBtn = document.getElementById('emailBtn');

// Actualizar el label del campo extra según el tipo de mensaje
function updateExtraField() {
    const messageType = messageTypeSelect.value;
    const template = messageTemplates[messageType];
    
    if (template.label) {
        extraFieldLabel.textContent = template.label;
        extraFieldContainer.style.display = 'flex';
        
        // Placeholder según el tipo
        if (messageType === 'seguimiento') {
            extraFieldInput.placeholder = '$50,000';
        } else if (messageType === 'recordatorio') {
            extraFieldInput.placeholder = '$25,000';
        } else if (messageType === 'agradecimiento') {
            extraFieldInput.placeholder = 'nuestro servicio';
        }
    }
}

// Generar mensaje
function generateMessage() {
    const name = clientNameInput.value || 'Cliente';
    const company = companyNameInput.value || 'tu empresa';
    const messageType = messageTypeSelect.value;
    const extraValue = extraFieldInput.value;
    
    const template = messageTemplates[messageType];
    const message = template.template(name, company, extraValue);
    
    // Formatear mensaje con párrafos
    const paragraphs = message.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    
    generatedMessage.innerHTML = paragraphs;
    outputRecipient.textContent = name;
    
    // Animación
    generatedMessage.style.opacity = '0';
    setTimeout(() => {
        generatedMessage.style.opacity = '1';
    }, 100);
    
    // Scroll suave al resultado
    generatedMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Copiar al portapapeles
async function copyToClipboard() {
    const text = generatedMessage.innerText;
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Mostrar mensaje de éxito
        copySuccess.style.display = 'flex';
        copyBtn.style.opacity = '0';
        
        setTimeout(() => {
            copySuccess.style.display = 'none';
            copyBtn.style.opacity = '1';
        }, 2000);
    } catch (err) {
        // Fallback para navegadores antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        copySuccess.style.display = 'flex';
        copyBtn.style.opacity = '0';
        
        setTimeout(() => {
            copySuccess.style.display = 'none';
            copyBtn.style.opacity = '1';
        }, 2000);
    }
}

// Enviar por WhatsApp
function sendWhatsApp() {
    const text = generatedMessage.innerText;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
}

// Enviar por Email
function sendEmail() {
    const name = clientNameInput.value || 'Cliente';
    const text = generatedMessage.innerText;
    const subject = encodeURIComponent(`Mensaje para ${name}`);
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Event Listeners
messageTypeSelect.addEventListener('change', () => {
    updateExtraField();
    generateMessage();
});

clientNameInput.addEventListener('input', generateMessage);
companyNameInput.addEventListener('input', generateMessage);
extraFieldInput.addEventListener('input', generateMessage);

generateBtn.addEventListener('click', generateMessage);
copyBtn.addEventListener('click', copyToClipboard);
whatsappBtn.addEventListener('click', sendWhatsApp);
emailBtn.addEventListener('click', sendEmail);

// Generar mensaje inicial
updateExtraField();
generateMessage();

console.log('🚀 Demo de automatización cargada correctamente!');

// ================================================
// TAB SWITCHING FUNCTIONALITY
// ================================================
const demoTabs = document.querySelectorAll('.demo-tab');
const tabContents = document.querySelectorAll('.tab-content');

demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Remove active class from all tabs and contents
        demoTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
});

// ================================================
// ROI CALCULATOR FUNCTIONALITY
// ================================================
const calculateBtn = document.getElementById('calculateBtn');
const taskNameInput = document.getElementById('taskName');
const timePerTaskInput = document.getElementById('timePerTask');
const timesPerWeekInput = document.getElementById('timesPerWeek');
const hourlyCostInput = document.getElementById('hourlyCost');

const timeSavedWeekEl = document.getElementById('timeSavedWeek');
const moneySavedMonthEl = document.getElementById('moneySavedMonth');
const timeSavedYearEl = document.getElementById('timeSavedYear');
const roiPercentageEl = document.getElementById('roiPercentage');
const newClientsEl = document.getElementById('newClients');
const strategicHoursEl = document.getElementById('strategicHours');

function calculateROI() {
    const minutesPerTask = parseFloat(timePerTaskInput.value) || 0;
    const timesPerWeek = parseFloat(timesPerWeekInput.value) || 0;
    const costPerHour = parseFloat(hourlyCostInput.value) || 0;
    
    // Calculations
    const minutesPerWeek = minutesPerTask * timesPerWeek;
    const hoursPerWeek = minutesPerWeek / 60;
    const hoursPerMonth = hoursPerWeek * 4;
    const hoursPerYear = hoursPerWeek * 52;
    
    const savingsPerMonth = hoursPerMonth * costPerHour;
    const savingsPerYear = hoursPerYear * costPerHour;
    
    // Typical automation cost assumption: 1-2 months of savings
    const automationCost = savingsPerMonth * 1.5;
    const roi = ((savingsPerYear - automationCost) / automationCost) * 100;
    
    // Additional insights
    const newClientsPerMonth = Math.floor(hoursPerMonth / 2); // Assuming 2 hours per new client
    const strategicHours = Math.floor(hoursPerMonth * 0.8);
    
    // Update UI
    timeSavedWeekEl.textContent = hoursPerWeek.toFixed(1);
    moneySavedMonthEl.textContent = `ARS ${savingsPerMonth.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
    timeSavedYearEl.textContent = Math.floor(hoursPerYear);
    roiPercentageEl.textContent = `${Math.max(roi, 0).toFixed(0)}%`;
    newClientsEl.textContent = Math.max(newClientsPerMonth, 1);
    strategicHoursEl.textContent = Math.max(strategicHours, 1);
    
    // Add animation
    [timeSavedWeekEl, moneySavedMonthEl, timeSavedYearEl, roiPercentageEl].forEach(el => {
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = 'countUp 0.6s ease-out';
        }, 10);
    });
}

// Real-time calculation on input change
if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateROI);
    
    // Auto-calculate on input change
    [timePerTaskInput, timesPerWeekInput, hourlyCostInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                // Small delay for better UX
                clearTimeout(window.roiCalcTimeout);
                window.roiCalcTimeout = setTimeout(calculateROI, 500);
            });
        }
    });
    
    // Initial calculation
    calculateROI();
}

// Add count-up animation
const style = document.createElement('style');
style.textContent = `
    @keyframes countUp {
        0% {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
        }
        50% {
            transform: translateY(-5px) scale(1.05);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(style);
