// ===== ESTILOS URGENCIA =====
(function() {
    const s = document.createElement('style');
    s.textContent = `
        .urgencia-badges { display:flex; flex-direction:column; align-items:center; gap:8px; margin-top:10px; }
        .badge-stock { background:#ff4d4d18; border:1px solid #ff4d4d55; color:#ff7070; border-radius:20px; padding:5px 14px; font-size:0.8rem; font-weight:600; letter-spacing:0.5px; }
        .badge-timer { background:#c9a96e18; border:1px solid #c9a96e55; color:#c9a96e; border-radius:20px; padding:5px 14px; font-size:0.8rem; font-weight:600; letter-spacing:0.5px; }
        .producto-card-urgencia { display:flex; flex-direction:column; gap:4px; margin-top:6px; }
        .producto-card-stock { color:#ff7070; font-size:0.75rem; font-weight:600; }
        .producto-card-timer { color:#c9a96e; font-size:0.75rem; }
    `;
    document.head.appendChild(s);
})();

// ===== CONFIGURACIÓN =====
// ACTUALIZAR con nueva URL después de reimplementar Apps Script
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1Stwhwb1S3icxJH0jLGUVAgzP5HD3wruFkUKWDA5daQvzstFsJOnNJeZddQUhY10D/exec';
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
        unidades: 4,
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
        unidades: 3,
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
        unidades: 5,
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
        unidades: 2,
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

// ===== TIMER EVERGREEN =====
let timerInterval = null;

function obtenerTimerFin() {
    const key = 'sagash_timer_fin';
    let fin = sessionStorage.getItem(key);
    if (!fin || parseInt(fin) < Date.now()) {
        const duracion = (2 + Math.random() * 2) * 60 * 60 * 1000; // 2-4 horas
        fin = Date.now() + duracion;
        sessionStorage.setItem(key, fin);
    }
    return parseInt(fin);
}

function formatearTimer(ms) {
    if (ms <= 0) return '00:00:00';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function iniciarTimerEvergreen(elementoId) {
    const el = document.getElementById(elementoId);
    if (!el) return;
    const fin = obtenerTimerFin();
    function tick() {
        const restante = fin - Date.now();
        el.textContent = `Oferta termina en ${formatearTimer(restante)}`;
        if (restante <= 0) sessionStorage.removeItem('sagash_timer_fin');
    }
    tick();
    setInterval(tick, 1000);
}

function mostrarUrgencia(producto, contenedorId) {
    const el = document.getElementById(contenedorId);
    if (!el) return;
    const unidades = producto.unidades;
    let html = '';
    if (unidades && unidades > 0) {
        html += `<span class="badge-stock">Solo quedan ${unidades} unidades</span>`;
    }
    html += `<span class="badge-timer" id="timer-${contenedorId}">⏰ Cargando...</span>`;
    el.innerHTML = html;
    iniciarTimerEvergreen(`timer-${contenedorId}`);
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
        producto: productoActual.nombre,
        descuento: descuentoActivo ? descuentoActivo + '%' : 'Sin descuento'
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
            mostrarUrgencia(producto, 'urgencia-badges');
            if (descuentoActivo) setTimeout(aplicarDescuentoPrecios, 50);

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
        const timerId = 'timer-card-' + producto.nombre.replace(/\s/g,'');
        const stockHtml = producto.unidades && producto.unidades > 0
            ? `<span class="producto-card-stock">Solo quedan ${producto.unidades} unidades</span>` : '' ;
        card.innerHTML = `
            <div class="producto-card-imagen">
                ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}">` : ''}
            </div>
            <div class="producto-card-info">
                <p class="producto-card-nombre">${producto.nombre}</p>
                <p class="producto-card-mini-copy">${producto.miniCopy}</p>
                <p class="producto-card-precio">${producto.precio} · Domicilio incluido</p>
                <div class="producto-card-urgencia">
                    ${stockHtml}
                    <span class="producto-card-timer" id="${timerId}">⏰ Cargando...</span>
                </div>
            </div>
        `;
        setTimeout(() => iniciarTimerEvergreen(timerId), 50);
        card.addEventListener('click', () => mostrarFormulario(producto, 'especifico'));
        grid.appendChild(card);
    });

    grid.classList.remove('oculta');
    if (descuentoActivo) setTimeout(aplicarDescuentoPrecios, 50);
}

// ===== FASE BÚHO =====
const PREMIOS = [
    { label: '5% OFF',  valor: 5,  color: '#0f0f0a' },
    { label: '10% OFF', valor: 10, color: '#1a1200' },
    { label: '15% OFF', valor: 15, color: '#0f0f0a' },
    { label: '20% OFF', valor: 20, color: '#1a1200' },
    { label: '5% OFF',  valor: 5,  color: '#0f0f0a' },
    { label: '10% OFF', valor: 10, color: '#1a1200' },
    { label: '15% OFF', valor: 15, color: '#0f0f0a' },
    { label: '20% OFF', valor: 20, color: '#1a1200' },
];

let descuentoActivo = parseInt(sessionStorage.getItem('sagash_descuento')) || 0;
let buhoMostrado = sessionStorage.getItem('sagash_buho_visto') === '1';
let anguloActual = 0;
let premioBuho = null;

function dibujarRueda() {
    const canvas = document.getElementById('rueda-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 100, cy = 100, r = 95;
    const segmentos = PREMIOS.length;
    const angPorSeg = (2 * Math.PI) / segmentos;

    ctx.clearRect(0, 0, 200, 200);

    // Borde exterior dorado
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = '#c9a96e';
    ctx.lineWidth = 3;
    ctx.stroke();

    PREMIOS.forEach((p, i) => {
        const inicio = anguloActual + i * angPorSeg;
        const fin = inicio + angPorSeg;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, inicio, fin);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#c9a96e55';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(inicio + angPorSeg / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#c9a96e';
        ctx.font = 'bold 12px Segoe UI';
        ctx.fillText(p.label, r - 6, 5);
        ctx.restore();
    });
}

function girarRueda() {
    const btn = document.getElementById('btn-girar');
    btn.disabled = true;
    const angPorSeg = (2 * Math.PI) / PREMIOS.length;
    const anguloInicio = anguloActual;
    const vueltasExtra = 5 + Math.random() * 3;
    const anguloFinal = vueltasExtra * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duracion = 3500;
    const inicio = performance.now();

    function animar(ahora) {
        const t = Math.min((ahora - inicio) / duracion, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        anguloActual = anguloInicio + anguloFinal * ease;
        dibujarRueda();
        if (t < 1) {
            requestAnimationFrame(animar);
        } else {
            // Calcular qué segmento quedó en el puntero (arriba = -π/2)
            const anguloNorm = (((-Math.PI / 2) - anguloActual) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
            const indiceReal = Math.floor(anguloNorm / angPorSeg) % PREMIOS.length;
            premioBuho = PREMIOS[indiceReal];
            setTimeout(() => mostrarFormBuho(), 600);
        }
    }
    requestAnimationFrame(animar);
}

function mostrarFormBuho() {
    document.getElementById('buho-estado-rueda').style.display = 'none';
    document.getElementById('buho-estado-form').style.display = 'block';
    document.getElementById('buho-premio-texto').textContent = `¡Ganaste ${premioBuho.label}!`;
}

function cerrarBuho() {
    document.getElementById('modal-buho').style.display = 'none';
}

async function reclamarDescuento() {
    const email = document.getElementById('buho-email').value.trim();
    const tel = document.getElementById('buho-tel').value.trim();
    if (!email || !tel) { alert('Completa email y teléfono'); return; }

    sessionStorage.setItem('sagash_descuento', premioBuho.valor);
    descuentoActivo = premioBuho.valor;

    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo: 'lead', email, telefono: tel, descuento: premioBuho.valor })
        });
    } catch(e) {}

    document.getElementById('buho-estado-form').style.display = 'none';
    document.getElementById('buho-estado-ok').style.display = 'block';
    document.getElementById('buho-ok-texto').textContent = `${premioBuho.label} aplicado a todos los precios`;

    setTimeout(() => {
        cerrarBuho();
        aplicarDescuentoPrecios();
    }, 2000);
}

function aplicarDescuentoPrecios() {
    if (!descuentoActivo) return;
    document.querySelectorAll('.producto-card-precio').forEach(el => {
        const texto = el.textContent;
        const match = texto.match(/[\d.]+/);
        if (!match) return;
        const original = parseFloat(match[0].replace('.', ''));
        if (isNaN(original)) return;
        const nuevo = Math.round(original * (1 - descuentoActivo / 100));
        el.innerHTML = `<span style="text-decoration:line-through;color:#ffffff33;font-size:0.85em">${match[0]}</span> $${nuevo.toLocaleString('es-CO')} · Domicilio incluido`;
    });

    const precioEl = document.getElementById('producto-precio');
    if (precioEl) {
        const texto = precioEl.textContent;
        const match = texto.match(/[\d.]+/);
        if (match) {
            const original = parseFloat(match[0].replace('.', ''));
            const nuevo = Math.round(original * (1 - descuentoActivo / 100));
            precioEl.innerHTML = `<span style="text-decoration:line-through;color:#ffffff33;font-size:0.85em">${match[0]}</span> $${nuevo.toLocaleString('es-CO')} · Domicilio incluido`;
        }
    }
}

function iniciarBuho() {
    if (buhoMostrado) return;
    setTimeout(() => {
        const buho = document.getElementById('buho');
        buho.style.display = 'block';
        buho.style.top = (20 + Math.random() * 40) + '%';
        buho.style.left = '-60px';
        buho.style.transition = 'left 9s linear, top 1s ease';

        setTimeout(() => { buho.style.left = '110vw'; }, 100);

        setTimeout(() => {
            buho.style.transition = 'left 9s linear, top 1s ease';
            buho.style.left = '-60px';
            buho.style.top = (20 + Math.random() * 40) + '%';
        }, 9500);

        setTimeout(() => { buho.style.left = '110vw'; }, 9700);

        buho.addEventListener('click', () => {
            buhoMostrado = true;
            sessionStorage.setItem('sagash_buho_visto', '1');
            buho.style.display = 'none';
            const modal = document.getElementById('modal-buho');
            modal.style.display = 'flex';
            dibujarRueda();
        });
    }, 30000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    iniciarParticulas();
    iniciarContador();
    cargarProductosDesdeSheet(APPS_SCRIPT_URL);
    iniciarBuho();
    if (descuentoActivo) aplicarDescuentoPrecios();

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
