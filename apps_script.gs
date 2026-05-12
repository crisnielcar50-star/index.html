// ============================================================
//  HeyySagash — Apps Script completo
//  Cada vez que lo cambies aquí, copia y pega en el editor
//  de Apps Script y haz: Implementar → Nueva implementación
// ============================================================

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const datos = JSON.parse(e.postData.contents);
  const ok = JSON.stringify({ resultado: 'ok' });
  const noAuth = JSON.stringify({ error: 'no autorizado' });
  const json = t => ContentService.createTextOutput(t).setMimeType(ContentService.MimeType.JSON);

  // --- Analytics (eventos de la tienda) ---
  if (datos.tipo === 'analytics') {
    ss.getSheetByName('Analytics').appendRow([
      new Date().toLocaleString('es-CO'), datos.flujo, datos.producto, datos.evento
    ]);
    return json(ok);
  }

  // --- Lead búho (rueda de descuento) ---
  if (datos.tipo === 'lead') {
    ss.getSheetByName('Leads').appendRow([
      new Date().toLocaleString('es-CO'), datos.email, datos.telefono, datos.descuento + '%'
    ]);
    return json(ok);
  }

  // --- Pedido desde página de Correctores ---
  if (datos.tipo === 'pedido_corrector') {
    let sheetCor = ss.getSheetByName('Correctores');
    if (!sheetCor) sheetCor = ss.insertSheet('Correctores');
    sheetCor.appendRow([
      new Date().toLocaleString('es-CO'),
      datos.producto,
      datos.nombre,
      datos.celular,
      datos.ciudad,
      datos.direccion,
      datos.correo
    ]);
    MailApp.sendEmail({
      to: datos.correo,
      subject: '✓ Tu pedido en HeyySagash fue recibido',
      htmlBody: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#0a0702;color:#fff;padding:32px;border-radius:12px;">
          <h2 style="color:#C9A84C;margin-bottom:8px">¡Pedido recibido! ✓</h2>
          <p style="color:#ffffff99;margin-bottom:20px">Hola <strong style="color:#fff">${datos.nombre}</strong>, ya tenemos tu solicitud.</p>
          <div style="background:#150d00;border:1px solid #c9a84c22;border-radius:8px;padding:16px;margin-bottom:16px;">
            <p style="color:#C9A84C;font-size:0.8rem;letter-spacing:2px;margin-bottom:6px">PRODUCTO SOLICITADO</p>
            <p style="font-weight:700;font-size:1rem;margin:0">${datos.producto}</p>
          </div>
          <div style="background:#150d00;border:1px solid #c9a84c22;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="color:#C9A84C;font-size:0.8rem;letter-spacing:2px;margin-bottom:8px">DATOS DE ENTREGA</p>
            <p style="color:#ccc;font-size:0.88rem;margin:4px 0">📍 ${datos.ciudad} — ${datos.direccion}</p>
            <p style="color:#ccc;font-size:0.88rem;margin:4px 0">📞 ${datos.celular}</p>
          </div>
          <p style="color:#ffffff66;font-size:0.85rem;line-height:1.7;margin-bottom:0;">
            En menos de 24 horas te contactamos para confirmar tu envío.<br>
            <strong style="color:#C9A84C">Pago contra entrega — pagas solo cuando recibes.</strong>
          </p>
          <p style="color:#ffffff22;font-size:0.72rem;margin-top:24px;padding-top:16px;border-top:1px solid #ffffff11;">
            HeyySagash · Tu bienestar, nuestra pasión
          </p>
        </div>
      `
    });
    return json(ok);
  }

  // --- Protección para edición de productos ---
  const tiposProtegidos = ['actualizar_producto', 'nuevo_producto', 'eliminar_producto'];
  if (tiposProtegidos.includes(datos.tipo) && datos.clave !== 'sagash2025') {
    return json(noAuth);
  }

  if (datos.tipo === 'actualizar_producto') {
    const hoja = ss.getSheetByName('Productos');
    const filas = hoja.getDataRange().getValues();
    for (let i = 1; i < filas.length; i++) {
      if (String(filas[i][0]) === String(datos.nombreOriginal)) {
        hoja.getRange(i + 1, 1, 1, 9).setValues([[
          datos.nombre, datos.storytelling, datos.miniCopy,
          datos.categorias, datos.precio, datos.imagen,
          datos.linkDropi, datos.activo, datos.unidades || 0
        ]]);
        break;
      }
    }
    return json(ok);
  }

  if (datos.tipo === 'nuevo_producto') {
    ss.getSheetByName('Productos').appendRow([
      datos.nombre, datos.storytelling, datos.miniCopy,
      datos.categorias, datos.precio, datos.imagen,
      datos.linkDropi, datos.activo, datos.unidades || 0
    ]);
    return json(ok);
  }

  if (datos.tipo === 'eliminar_producto') {
    const hoja = ss.getSheetByName('Productos');
    const filas = hoja.getDataRange().getValues();
    for (let i = 1; i < filas.length; i++) {
      if (String(filas[i][0]) === String(datos.nombreOriginal)) {
        hoja.deleteRow(i + 1);
        break;
      }
    }
    return json(ok);
  }

  // --- Pedido normal (tienda principal) ---
  ss.getSheetByName('Hoja 1').appendRow([
    new Date().toLocaleString('es-CO'), datos.nombre, datos.celular,
    datos.ciudad, datos.direccion, datos.producto, datos.descuento || 'Sin descuento'
  ]);
  return json(ok);
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cb = e.parameter.callback;
  const responder = (obj) => {
    const txt = JSON.stringify(obj);
    const mime = cb ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;
    return ContentService.createTextOutput(cb ? cb + '(' + txt + ')' : txt).setMimeType(mime);
  };

  // --- Productos activos (tienda) ---
  if (e.parameter.action === 'productos') {
    const filas = ss.getSheetByName('Productos').getDataRange().getValues().slice(1);
    const productos = filas
      .filter(f => String(f[7]).trim().toUpperCase() === 'SI')
      .map(f => ({
        nombre: String(f[0]), storytelling: String(f[1]), miniCopy: String(f[2]),
        categorias: String(f[3]).split(',').map(c => c.trim()),
        precio: String(f[4]), imagen: String(f[5]), linkDropi: String(f[6]),
        unidades: parseInt(f[8]) || 0
      }));
    return responder(productos);
  }

  // --- Pedidos de Correctores (admin) ---
  if (e.parameter.action === 'correctores') {
    if (e.parameter.clave !== 'sagash2025') return responder({ error: 'no autorizado' });
    const sheetCor = ss.getSheetByName('Correctores');
    if (!sheetCor || sheetCor.getLastRow() === 0) return responder({ correctores: [] });
    return responder({ correctores: sheetCor.getDataRange().getValues() });
  }

  // --- Dashboard admin (pedidos + analytics) ---
  if (e.parameter.clave !== 'sagash2025') return responder({ error: 'no autorizado' });
  const pedidos = ss.getSheetByName('Hoja 1').getDataRange().getValues().slice(1);
  const analytics = ss.getSheetByName('Analytics').getDataRange().getValues().slice(1);
  return responder({ pedidos, analytics });
}
