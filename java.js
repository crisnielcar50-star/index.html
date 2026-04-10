// ===== DATOS DE PRODUCTOS =====
// Reemplaza imagen: con la ruta a la foto del producto cuando la tengas
const productos = [
    {
        id: 'corrector',
        nombre: 'Corrector de Postura',
        storytelling: 'Tu jefe no va a notar que eres más productivo. Pero tú vas a notar que ya no llegas a casa con ganas de arrancarte la columna.',
        miniCopy: 'Para los que ya se acostumbraron al dolor sin darse cuenta.',
        mensaje: 'Hola, vi el corrector de postura en HeyySagash y me interesa. ¿Cómo lo consigo?',
        categorias: ['ti', 'regalo'],
        imagen: 'img/corrector.png'
    },
    {
        id: 'masajeador',
        nombre: 'Masajeador de Pies',
        storytelling: 'Llevas todo el día de pie y tu cuerpo lo sabe. Tus pies no están pidiendo descanso. Están exigiendo justicia.',
        miniCopy: 'El final del día que te mereces.',
        mensaje: 'Hola, vi el masajeador de pies en HeyySagash y me interesa. ¿Cómo lo consigo?',
        categorias: ['ti', 'hogar', 'regalo'],
        imagen: 'img/masajeador.png'
    },
    {
        id: 'hombrera',
        nombre: 'Hombrera Térmica',
        storytelling: 'El frío no avisa. El dolor en el hombro tampoco. Pero tú puedes elegir no esperar a que llegue.',
        miniCopy: 'Protección antes de que el daño decida por ti.',
        mensaje: 'Hola, vi la hombrera térmica en HeyySagash y me interesa. ¿Cómo lo consigo?',
        categorias: ['ti', 'regalo'],
        imagen: 'img/hombrera.png'
    },
    {
        id: 'consola',
        nombre: 'Consola USB',
        storytelling: 'No necesitas una excusa para volver a jugar. Ya eres adulto. Y ya trabajaste suficiente hoy.',
        miniCopy: 'Entretenimiento sin disculpas.',
        mensaje: 'Hola, vi la consola USB en HeyySagash y me interesa. ¿Cómo lo consigo?',
        categorias: ['hogar', 'regalo'],
        imagen: 'img/consola.png'
    }
];

const NUMERO_WHATSAPP = '573242919434';

// ===== UTILIDADES =====
function irAWhatsApp(mensaje) {
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

function mostrarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => {
        p.classList.remove('activa');
        p.style.display = 'none';
    });
    const pantalla = document.getElementById(id);
    pantalla.style.display = 'flex';
    requestAnimationFrame(() => pantalla.classList.add('activa'));
    window.scrollTo(0, 0);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {

    // ----- ESFERA -----
    const esfera = document.getElementById('esfera');
    const opcionesEsfera = document.getElementById('opciones-esfera');
    const textoToca = document.getElementById('texto-toca');
    let esferaActivada = false;

    function activarEsfera() {
        if (esferaActivada) return;
        esferaActivada = true;
        esfera.classList.add('activa');
        opcionesEsfera.classList.add('visible');
        textoToca.classList.add('oculto');
    }

    esfera.addEventListener('click', activarEsfera);
    // En desktop, activar también al pasar el cursor
    esfera.addEventListener('mouseenter', activarEsfera);

    // ----- BOTÓN ALEATORIO -----
    document.getElementById('btn-aleatorio').addEventListener('click', iniciarAleatorio);

    // ----- BOTÓN ESPECÍFICO -----
    document.getElementById('btn-especifico').addEventListener('click', () => {
        mostrarPantalla('pantalla-especifico');
        resetEspecifico();
    });

    // ----- VOLVER -----
    document.getElementById('btn-volver-aleatorio').addEventListener('click', () => {
        mostrarPantalla('pantalla-esfera');
    });

    document.getElementById('btn-volver-especifico').addEventListener('click', () => {
        mostrarPantalla('pantalla-esfera');
    });

    // ----- CATEGORÍAS -----
    document.querySelectorAll('.categoria-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.categoria-card').forEach(c => c.classList.remove('seleccionada'));
            card.classList.add('seleccionada');
            mostrarProductosDeCategoria(card.dataset.cat);
        });
    });
});

// ===== LÓGICA ALEATORIO =====
function iniciarAleatorio() {
    mostrarPantalla('pantalla-aleatorio');

    const slotContenedor = document.getElementById('slot-contenedor');
    const revelacion = document.getElementById('revelacion');
    const slotCard = document.getElementById('slot-card');

    // Reset
    slotContenedor.classList.remove('oculta');
    revelacion.classList.add('oculta');
    slotCard.innerHTML = '<span class="slot-signo">?</span>';
    slotCard.classList.remove('girando');

    // Elegir producto al azar
    const producto = productos[Math.floor(Math.random() * productos.length)];

    // Animación de slot
    slotCard.classList.add('girando');

    setTimeout(() => {
        slotCard.classList.remove('girando');

        // Mostrar nombre en la carta
        slotCard.innerHTML = `<span style="font-size:1rem;font-weight:900;color:var(--dorado-claro);padding:1rem;text-align:center;line-height:1.3">${producto.nombre}</span>`;

        setTimeout(() => {
            slotContenedor.classList.add('oculta');

            // Rellenar revelación
            document.getElementById('storytelling-texto').textContent = producto.storytelling;
            document.getElementById('producto-nombre').textContent = producto.nombre;

            const imgContainer = document.getElementById('producto-imagen');
            if (producto.imagen) {
                imgContainer.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
            } else {
                imgContainer.innerHTML = `<span>Foto próximamente</span>`;
            }

            const btnQuiero = document.getElementById('btn-quiero');
            btnQuiero.onclick = (e) => {
                e.preventDefault();
                irAWhatsApp(producto.mensaje);
            };

            revelacion.classList.remove('oculta');
            revelacion.classList.add('fade-in');
        }, 700);

    }, 2500);
}

// ===== LÓGICA ESPECÍFICO =====
function resetEspecifico() {
    const productosGrid = document.getElementById('productos-grid');
    productosGrid.classList.add('oculta');
    productosGrid.innerHTML = '';
    document.querySelectorAll('.categoria-card').forEach(c => c.classList.remove('seleccionada'));
}

function mostrarProductosDeCategoria(categoria) {
    const productosGrid = document.getElementById('productos-grid');
    const filtrados = productos.filter(p => p.categorias.includes(categoria));

    productosGrid.innerHTML = '';

    filtrados.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'producto-card fade-in';
        card.innerHTML = `
            <div class="producto-card-imagen">
                ${producto.imagen
                    ? `<img src="${producto.imagen}" alt="${producto.nombre}">`
                    : ''
                }
            </div>
            <div class="producto-card-info">
                <p class="producto-card-nombre">${producto.nombre}</p>
                <p class="producto-card-mini-copy">${producto.miniCopy}</p>
            </div>
        `;
        card.addEventListener('click', () => irAWhatsApp(producto.mensaje));
        productosGrid.appendChild(card);
    });

    productosGrid.classList.remove('oculta');
}
