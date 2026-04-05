// Especificación Operativa JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const botonWhatsApp = document.getElementById('btn-whatsapp');
    
    // Configuración de la API
    const numeroDestino = '573242919434';
    const mensajeBase = 'Hola, estoy leyendo tu página. Quiero arreglar mi postura antes de que sea tarde.';
    const mensajeCodificado = encodeURIComponent(mensajeBase);
    
    // Construcción del enlace universal
    const urlWhatsApp = `https://wa.me/${numeroDestino}?text=${mensajeCodificado}`;
    
    // Asignación dinámica del destino
    botonWhatsApp.href = urlWhatsApp;

    // Monitoreo de eventos de conversión
    botonWhatsApp.addEventListener('click', (evento) => {
        // En este bloque se integran los códigos de rastreo (ej. fbq('track', 'Contact');)
        console.log('Intención de compra registrada. Redirigiendo a WhatsApp...');
        // El comportamiento por defecto del enlace <a> continuará la redirección
    });
});
