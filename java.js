// ===== CONFIGURACIÓN =====
// ACTUALIZAR con nueva URL después de reimplementar Apps Script
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby41ElkvoBfHzuNzZ0NhCfviloGiof5rAJxs3YKF72s7Oj0IBFh7QtHhSugPZ0t1wwf/exec';
const NUMERO_SOPORTE = '573242919434';
const CACHE_TTL = 60 * 60 * 1000; // 1 hora

// ===== PRODUCTOS (fallback si falla el Sheet) =====
const productosDefault = [
    {
        id: 'corrector',
        nombre: 'Corrector de Postura',
        storytelling: 'Tu jefe no va a notar que eres más productivo. Pero tú vas a notar que ya no llegas a casa con ganas de arrancarte la columna.',
        miniCopy: 'Para los que ya se acostumbraron al dolor sin darse cuenta.',
        categorias: ['ti', 'regalo'],
        imagen: 'img/corrector.png',
        precio: '$89.900',
        linkDropi: 'https://app.dropi.co/dashboard/product-details/729188/corrector-postura-espalda-ralla-colores'
    },
    {
        id: 'masajeador',
        nombre: 'Masajeador de Pies',
        storytelling: 'Llevas todo el día de pie y tu cuerpo lo sabe. Tus pies no están pidiendo descanso. Están exigiendo justicia.',
        miniCopy: 'El final del día que te mereces.',
        categorias: ['ti', 'hogar', 'regalo'],
        imagen: 'img/masajeador.png',
        precio: '$99.900',
        linkDropi: 'https://app.dropi.co/dashboard/product-details/1722321/masajeador-pasiva-para-pies'
    },
    {
        id: 'hombrera',
        nombre: 'Hombrera Térmica',
        storytelling: 'El frío no avisa. El dolor en el hombro tampoco. Pero tú puedes elegir no esperar a que llegue.',
        miniCopy: 'Protección antes de que el daño decida por ti.',
        categorias: ['ti', 'regalo'],
        imagen: 'img/hombrera.png',
        precio: '$119.900',
        linkDropi: 'https://app.dropi.co/dashboard/product-details/1941964/hombrera-termica-v8'
    },
    {
        id: 'consola',
        nombre: 'Consola USB',
        storytelling: 'No necesitas una excusa para volver a jugar. Ya eres adulto. Y ya trabajaste suficiente hoy.',
        miniCopy: 'Entretenimiento sin disculpas.',
        categorias: ['hogar', 'regalo'],
        imagen: 'img/consola.png',
        precio: '$229.900',
        linkDropi: 'https://app.dropi.co/dashboard/product-details/650864/consola-retro-usb-20000-juegos-m8'
    }
];

let productos = [...productosDefault];
let productoActual = null;
let flujoActual = null;

// ===== CARGAR PRODUCTOS DESDE SHEET =====
function cargarProductosDesdeSheet(urlScript) {
    const cacheKey = 'sagash_productos';
    const cacheTime = localStorage.getItem(cacheKey + '_time');
    const cacheData = localStorage.getItem(cacheKey);

    if (cacheData && cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_TTL) {
        productos = JSON.parse(cacheData);
        return;
    }

    const callbackName = 'sagashProd_' + Date.now();
    window[callbackName] = function(data) {
        delete window[callbackName];
        if (Array.isArray(data) && data.length > 0) {
            productos = data;
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheKey + '_time', Date.now().toString());
        }
    };

    const script = document.createElement('script');
    script.src = `${urlScript}?action=productos&callback=${callbackName}`;
    document.head.appendChild(script);
}

// ===== CONTADOR DE PEDIDOS =====
function iniciarContador() {
    const hora = new Date().getHours();
    let base = hora >= 18 ? 14 : hora >= 12 ? 9 : 5;
    base += Math.floor(Math.random() * 4);

    const el = document.getElementById('contador-numero');
    if (el) el.textContent = base;

    setInterval(() => {
        if (Math.random() < 0.3) {
            base += 1;
            if (el) el.textContent = base;
        }
    }, 45000);
}

// ===== ANALYTICS =====
function registrarEvento(flujo, producto, evento) {
    try {
        fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo: 'analytics', flujo, producto, evento })
        });
    } catch (e) {}
}

// ===== PARTÍCULAS =====
function iniciarParticulas() {
    const canvas = document.getElementById('canvas-particulas');
    const ctx = canvas.getContext('2d');

    function redimensionar() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    redimensionar();
    window.addEventListener('resize', redimensionar);

    const particulas = Array.from({ length: 55 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radio: Math.random() * 1.5 + 0.4,
        opacidad: Math.random() * 0.35 + 0.08,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
    }));

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particulas.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201, 168, 76, ${p.opacidad})`;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        });
        requestAnimationFrame(animar);
    }
    animar();
}

// ===== SONIDO =====
function reproducirSonido() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(523, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
        // Navegador sin soporte de audio — continúa sin sonido
    }
}

function reproducirSonidoEsfera() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
}

function reproducirTick() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
}

// ===== NAVEGACIÓN =====
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

// ===== FORMULARIO =====
function mostrarFormulario(producto, flujo) {
    productoActual = producto;
    flujoActual = flujo;
    registrarEvento(flujo, producto.nombre, 'formulario_abierto');
    document.getElementById('form-producto-nombre').textContent = producto.nombre;
    document.getElementById('formulario-pedido').reset();
    const btn = document.getElementById('btn-confirmar');
    btn.textContent = 'Confirmar Pedido';
    btn.disabled = false;
    document.getElementById('modal-formulario').classList.remove('oculta');
}

function cerrarFormulario() {
    document.getElementById('modal-formulario').classList.add('oculta');
}

async function enviarPedido(e) {
    e.preventDefault();

    const btn = document.getElementById('btn-confirmar');
    btn.textContent = 'Procesando...';
    btn.disabled = true;

    const datos = {
        nombre: document.getElementById('input-nombre').value.trim(),
        celular: document.getElementById('input-celular').value.trim(),
        ciudad: document.getElementById('input-ciudad').value.trim(),
        direccion: document.getElementById('input-direccion').value.trim(),
        producto: productoActual.nombre
    };

    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
    } catch (e) {
        // no-cors siempre lanza error de lectura pero los datos llegan igual
    }

    registrarEvento(flujoActual, productoActual.nombre, 'pedido_confirmado');
    cerrarFormulario();
    mostrarPantalla('pantalla-exito');
    reproducirSonido();
    enviarConfirmacionWhatsApp(datos);
}

function enviarConfirmacionWhatsApp(datos) {
    const celular = datos.celular.replace(/\D/g, '');
    const numero = celular.startsWith('57') ? celular : `57${celular}`;
    const mensaje =
        `Hola ${datos.nombre}, tu pedido en HeyySagash fue confirmado.\n\n` +
        `Producto: ${productoActual.nombre}\n` +
        `Ciudad: ${datos.ciudad}\n` +
        `Dirección: ${datos.direccion}\n\n` +
        `Pronto recibirás información de tu envío. Gracias por confiar en HeyySagash.`;

    setTimeout(() => {
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
    }, 1200);
}

// ===== ALEATORIO =====
function iniciarAleatorio() {
    mostrarPantalla('pantalla-aleatorio');

    const slotContenedor = document.getElementById('slot-contenedor');
    const revelacion = document.getElementById('revelacion');
    const slotCard = document.getElementById('slot-card');

    slotContenedor.classList.remove('oculta');
    revelacion.classList.add('oculta');
    slotCard.innerHTML = '<span class="slot-signo">?</span>';
    slotCard.classList.remove('girando');

    const producto = productos[Math.floor(Math.random() * productos.length)];

    slotCard.classList.add('girando');

    // Ticks durante el giro
    const intervaloTick = setInterval(reproducirTick, 180);

    setTimeout(() => {
        clearInterval(intervaloTick);
        slotCard.classList.remove('girando');
        slotCard.innerHTML = `<span style="font-size:1rem;font-weight:900;color:var(--dorado-claro);padding:1rem;text-align:center;line-height:1.3">${producto.nombre}</span>`;

        setTimeout(() => {
            reproducirSonido();
            slotContenedor.classList.add('oculta');

            document.getElementById('storytelling-texto').textContent = producto.storytelling;
            document.getElementById('producto-nombre').textContent = producto.nombre;
            document.getElementById('producto-precio').textContent = producto.precio + ' · Domicilio incluido';

            const imgContainer = document.getElementById('producto-imagen');
            imgContainer.innerHTML = producto.imagen
                ? `<img src="${producto.imagen}" alt="${producto.nombre}">`
                : `<span>Foto próximamente</span>`;

            registrarEvento('aleatorio', producto.nombre, 'revelado');
            document.getElementById('btn-quiero').onclick = () => mostrarFormulario(producto, 'aleatorio');

            revelacion.classList.remove('oculta');
            revelacion.classList.add('fade-in');
        }, 700);
    }, 2500);
}

// ===== ESPECÍFICO =====
function resetEspecifico() {
    const grid = document.getElementById('productos-grid');
    grid.classList.add('oculta');
    grid.innerHTML = '';
    document.querySelectorAll('.categoria-card').forEach(c => c.classList.remove('seleccionada'));
}

function mostrarProductosDeCategoria(categoria, aleatorizar = false) {
    const grid = document.getElementById('productos-grid');
    let filtrados = productos.filter(p => p.categorias.includes(categoria));
    if (aleatorizar) filtrados = filtrados.sort(() => Math.random() - 0.5);

    grid.innerHTML = '';
    filtrados.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'producto-card fade-in';
        card.innerHTML = `
            <div class="producto-card-imagen">
                ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}">` : ''}
            </div>
            <div class="producto-card-info">
                <p class="producto-card-nombre">${producto.nombre}</p>
                <p class="producto-card-mini-copy">${producto.miniCopy}</p>
                <p class="producto-card-precio">${producto.precio} · Domicilio incluido</p>
            </div>
        `;
        card.addEventListener('click', () => mostrarFormulario(producto, 'especifico'));
        grid.appendChild(card);
    });

    grid.classList.remove('oculta');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    iniciarParticulas();
    iniciarContador();
    cargarProductosDesdeSheet(APPS_SCRIPT_URL);

    // Esfera
    const esfera = document.getElementById('esfera');
    const opcionesEsfera = document.getElementById('opciones-esfera');
    const textoToca = document.getElementById('texto-toca');
    let esferaActivada = false;

    function activarEsfera() {
        if (esferaActivada) return;
        esferaActivada = true;
        esfera.classList.add('activa');
        opcionesEsfera.classList.add('visible');
        textoToca.style.display = 'none';
    }

    esfera.addEventListener('mouseenter', activarEsfera);

    esfera.addEventListener('click', () => {
        reproducirSonidoEsfera();
        activarEsfera();
    });

    document.getElementById('btn-aleatorio').addEventListener('click', iniciarAleatorio);

    document.getElementById('btn-especifico').addEventListener('click', () => {
        mostrarPantalla('pantalla-especifico');
        resetEspecifico();
    });

    document.getElementById('btn-volver-aleatorio').addEventListener('click', () => mostrarPantalla('pantalla-esfera'));
    document.getElementById('btn-volver-especifico').addEventListener('click', () => mostrarPantalla('pantalla-esfera'));
    document.getElementById('btn-volver-exito').addEventListener('click', () => mostrarPantalla('pantalla-esfera'));

    // Categorías
    let categoriaActual = null;
    document.querySelectorAll('.categoria-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.categoria-card').forEach(c => c.classList.remove('seleccionada'));
            card.classList.add('seleccionada');
            categoriaActual = card.dataset.cat;
            mostrarProductosDeCategoria(categoriaActual);
            document.getElementById('btn-recargar').classList.remove('oculta');
        });
    });

    // Botón recargar
    document.getElementById('btn-recargar').addEventListener('click', () => {
        if (categoriaActual) mostrarProductosDeCategoria(categoriaActual, true);
    });

    // Formulario
    document.getElementById('formulario-pedido').addEventListener('submit', enviarPedido);
    document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarFormulario);

    // Cerrar modal al tocar fuera
    document.getElementById('modal-formulario').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal-formulario')) cerrarFormulario();
    });
});
