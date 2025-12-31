// Templates de mensajes
const messageTemplates = {
    bienvenida: {
        label: 'Cliente',
        template: (name, company) => `Hola ${name},

¡Bienvenido a nuestra familia! Estamos muy emocionados de comenzar a trabajar contigo y con ${company}.

Queremos que sepas que estás en buenas manos. Nos comprometemos a brindarte el mejor servicio y acompañarte en cada paso del camino.

Si tenés alguna pregunta o necesitás ayuda con algo, no dudes en contactarnos. Estamos acá para vos.

¡Gracias por confiar en nosotros!

Saludos cordiales,
El equipo de SantOps`
    },
    seguimiento: {
        label: 'Monto de propuesta',
        template: (name, company, extra) => `Hola ${name},

Espero que estés muy bien. Te escribo para hacer un seguimiento de la propuesta que te enviamos para ${company}.

Como recordarás, te propusimos un proyecto por ${extra || '$XX,XXX'} que incluye [detalles del servicio].

¿Tuviste oportunidad de revisarla? Me encantaría escuchar tus comentarios y responder cualquier pregunta que puedas tener.

Quedo atento a tu respuesta.

Saludos,
Equipo de SantOps`
    },
    recordatorio: {
        label: 'Monto pendiente',
        template: (name, company, extra) => `Hola ${name},

Espero que estés muy bien. Te escribo para recordarte amablemente que tenemos un pago pendiente de ${extra || '$XX,XXX'} correspondiente a ${company}.

Te agradeceríamos si pudieras procesarlo a la brevedad. Si ya realizaste el pago, por favor ignora este mensaje y avisanos para actualizar nuestros registros.

Si tenés algún inconveniente o necesitás más información, estoy a tu disposición.

Muchas gracias por tu atención.

Saludos cordiales,
Equipo de SantOps`
    },
    agradecimiento: {
        label: 'Producto/Servicio',
        template: (name, company, extra) => `Hola ${name},

¡Muchas gracias por tu compra! En ${company} valoramos enormemente tu confianza en nosotros.

Esperamos que ${extra || 'nuestro producto/servicio'} supere tus expectativas y te ayude a alcanzar tus objetivos.

Recordá que estamos acá para ayudarte en lo que necesites. No dudes en contactarnos si tenés alguna pregunta o comentario.

¡Que lo disfrutes!

Saludos,
El equipo de SantOps`
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
