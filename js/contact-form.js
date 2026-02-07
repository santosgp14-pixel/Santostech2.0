// URL de Google Apps Script para guardar los datos en Google Sheets
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4COHR2_Br_gfJe86V5uvLIbAt2jUs2qXSdVixr1ruepc1pVnx8WEpBouqQX2r57Xo/exec';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar estado de carga
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        form.querySelector('button[type="submit"]').disabled = true;
        
        // Ocultar mensajes previos
        formSuccess.style.display = 'none';
        formError.style.display = 'none';
        
        // Recopilar datos del formulario
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value
        };
        
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            // Con mode: 'no-cors', asumimos éxito si no hay error
            // Mostrar mensaje de éxito
            form.style.display = 'none';
            formSuccess.style.display = 'flex';
            
            // Resetear formulario
            form.reset();
            
            // Opcional: recargar la página después de 3 segundos
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            
        } catch (error) {
            console.error('Error:', error);
            formError.style.display = 'flex';
        } finally {
            // Restaurar botón
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            form.querySelector('button[type="submit"]').disabled = false;
        }
    });
});
