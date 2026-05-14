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
      subject: 'Pedido recibido — HeyySagash #' + new Date().getTime().toString().slice(-6),
      htmlBody: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1eb;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1eb;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;">

        <!-- HEADER -->
        <tr><td style="background:#0a0702;padding:32px 36px;border-radius:12px 12px 0 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:4px;color:#C9A84C;font-family:Arial,sans-serif;text-transform:uppercase;">Confirmación de pedido</p>
          <h1 style="margin:0;font-size:26px;color:#ffffff;font-family:Georgia,serif;font-weight:normal;letter-spacing:1px;">HeyySagash</h1>
          <p style="margin:10px 0 0;font-size:12px;color:#ffffff55;font-family:Arial,sans-serif;letter-spacing:1px;">Tu bienestar, nuestra pasión</p>
        </td></tr>

        <!-- SALUDO -->
        <tr><td style="background:#ffffff;padding:32px 36px 0;">
          <p style="margin:0;font-size:15px;color:#1a1200;line-height:1.7;">Hola <strong>${datos.nombre}</strong>,</p>
          <p style="margin:10px 0 0;font-size:14px;color:#555;line-height:1.8;font-family:Arial,sans-serif;">
            Hemos recibido tu pedido correctamente. En menos de <strong style="color:#1a1200;">24 horas</strong> te contactaremos para coordinar la entrega.
          </p>
        </td></tr>

        <!-- PRODUCTO -->
        <tr><td style="background:#ffffff;padding:24px 36px 0;">
          <p style="margin:0 0 10px;font-size:10px;letter-spacing:3px;color:#C9A84C;font-family:Arial,sans-serif;text-transform:uppercase;">Producto solicitado</p>
          <table width="100%" style="border:1px solid #e8e0d0;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:16px 20px;background:#faf8f4;">
                <p style="margin:0;font-size:15px;font-weight:bold;color:#0a0702;">${datos.producto}</p>
                <p style="margin:6px 0 0;font-size:12px;color:#888;font-family:Arial,sans-serif;">Pago contra entrega</p>
              </td>
              <td style="padding:16px 20px;background:#faf8f4;text-align:right;vertical-align:top;">
                <span style="display:inline-block;background:#0a0702;color:#C9A84C;font-size:11px;font-family:Arial,sans-serif;letter-spacing:1px;padding:4px 10px;border-radius:20px;">CONFIRMADO</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- ENTREGA -->
        <tr><td style="background:#ffffff;padding:20px 36px 0;">
          <p style="margin:0 0 10px;font-size:10px;letter-spacing:3px;color:#C9A84C;font-family:Arial,sans-serif;text-transform:uppercase;">Datos de entrega</p>
          <table width="100%" style="border:1px solid #e8e0d0;border-radius:8px;">
            <tr><td style="padding:16px 20px;background:#faf8f4;">
              <table>
                <tr>
                  <td style="padding:4px 12px 4px 0;font-size:12px;color:#999;font-family:Arial,sans-serif;vertical-align:top;">Ciudad</td>
                  <td style="padding:4px 0;font-size:13px;color:#1a1200;font-family:Arial,sans-serif;">${datos.ciudad}</td>
                </tr>
                <tr>
                  <td style="padding:4px 12px 4px 0;font-size:12px;color:#999;font-family:Arial,sans-serif;vertical-align:top;">Dirección</td>
                  <td style="padding:4px 0;font-size:13px;color:#1a1200;font-family:Arial,sans-serif;">${datos.direccion}</td>
                </tr>
                <tr>
                  <td style="padding:4px 12px 4px 0;font-size:12px;color:#999;font-family:Arial,sans-serif;vertical-align:top;">Celular</td>
                  <td style="padding:4px 0;font-size:13px;color:#1a1200;font-family:Arial,sans-serif;">${datos.celular}</td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- NOTA -->
        <tr><td style="background:#ffffff;padding:24px 36px 32px;">
          <table width="100%" style="border-left:3px solid #C9A84C;background:#fdf9f0;border-radius:0 8px 8px 0;">
            <tr><td style="padding:14px 18px;">
              <p style="margin:0;font-size:13px;color:#555;line-height:1.8;font-family:Arial,sans-serif;">
                Pagas <strong style="color:#0a0702;">solo cuando recibes</strong> el producto en tu puerta. No hay ningún cobro anticipado.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#0a0702;padding:24px 36px;border-radius:0 0 12px 12px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#ffffff44;font-family:Arial,sans-serif;letter-spacing:1px;">
            HeyySagash &nbsp;·&nbsp; Colombia &nbsp;·&nbsp; heyysa<wbr>gash.vercel.app
          </p>
          <p style="margin:8px 0 0;font-size:10px;color:#ffffff22;font-family:Arial,sans-serif;">
            Este correo es una confirmación automática. No es necesario responder.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
    });
    MailApp.sendEmail({
      to: 'crisnielcar50@gmail.com',
      subject: '🛒 Nuevo pedido de corrector — ' + datos.nombre,
      htmlBody: `<div style="font-family:Arial,sans-serif;max-width:480px;background:#0a0702;color:#fff;padding:28px;border-radius:10px;">
        <p style="color:#C9A84C;font-size:11px;letter-spacing:3px;margin:0 0 8px">NUEVO PEDIDO · CORRECTORES</p>
        <h2 style="color:#fff;margin:0 0 20px;font-size:1.2rem">${datos.nombre}</h2>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <tr><td style="color:#888;padding:6px 0;border-bottom:1px solid #1a1000">Producto</td><td style="color:#C9A84C;font-weight:700;padding:6px 0;border-bottom:1px solid #1a1000">${datos.producto}</td></tr>
          <tr><td style="color:#888;padding:6px 0;border-bottom:1px solid #1a1000">Ciudad</td><td style="color:#fff;padding:6px 0;border-bottom:1px solid #1a1000">${datos.ciudad}</td></tr>
          <tr><td style="color:#888;padding:6px 0;border-bottom:1px solid #1a1000">Dirección</td><td style="color:#fff;padding:6px 0;border-bottom:1px solid #1a1000">${datos.direccion}</td></tr>
          <tr><td style="color:#888;padding:6px 0;border-bottom:1px solid #1a1000">Celular</td><td style="color:#fff;padding:6px 0;border-bottom:1px solid #1a1000">${datos.celular}</td></tr>
          <tr><td style="color:#888;padding:6px 0">Correo cliente</td><td style="color:#60a5fa;padding:6px 0">${datos.correo}</td></tr>
        </table>
        <p style="color:#ffffff33;font-size:11px;margin-top:20px;border-top:1px solid #1a1000;padding-top:12px;">HeyySagash · Notificación automática en tiempo real</p>
      </div>`
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

  // --- Registro de usuario (coach) ---
  if (e.parameter.action === 'registro_usuario') {
    let sheet = ss.getSheetByName('Usuarios');
    if (!sheet) {
      sheet = ss.insertSheet('Usuarios');
      sheet.appendRow(['fecha', 'nombre', 'email', 'password', 'corrector', 'horas', 'semanas', 'dolores']);
    }
    const email = (e.parameter.email || '').toLowerCase().trim();
    const nombre = e.parameter.nombre || '';
    const pass = e.parameter.password || '';
    const filas = sheet.getDataRange().getValues().slice(1);
    const existe = filas.some(f => String(f[2]).toLowerCase().trim() === email);
    if (existe) return responder({ error: 'Ese correo ya está registrado' });
    sheet.appendRow([new Date().toLocaleString('es-CO'), nombre, email, pass, '', '', '', '']);
    return responder({ usuario: { nombre, email, corrector: '', horas: '', semanas: '', dolores: '' } });
  }

  // --- Login de usuario (coach) ---
  if (e.parameter.action === 'login_usuario') {
    const sheet = ss.getSheetByName('Usuarios');
    if (!sheet) return responder({ error: 'Usuario no encontrado' });
    const email = (e.parameter.email || '').toLowerCase().trim();
    const pass = e.parameter.password || '';
    const filas = sheet.getDataRange().getValues().slice(1);
    const fila = filas.find(f => String(f[2]).toLowerCase().trim() === email && String(f[3]) === pass);
    if (!fila) return responder({ error: 'Correo o contraseña incorrectos' });
    return responder({ usuario: { nombre: fila[1], email: fila[2], corrector: fila[4], horas: fila[5], semanas: fila[6], dolores: fila[7] } });
  }

  // --- Guardar perfil de onboarding (coach) ---
  if (e.parameter.action === 'guardar_perfil') {
    const sheet = ss.getSheetByName('Usuarios');
    if (!sheet) return responder({ error: 'sin hoja' });
    const email = (e.parameter.email || '').toLowerCase().trim();
    const filas = sheet.getDataRange().getValues();
    for (let i = 1; i < filas.length; i++) {
      if (String(filas[i][2]).toLowerCase().trim() === email) {
        sheet.getRange(i + 1, 5, 1, 4).setValues([[
          e.parameter.corrector || '', e.parameter.horas || '',
          e.parameter.semanas || '0', e.parameter.dolores || ''
        ]]);
        break;
      }
    }
    return responder({ ok: true });
  }

  // --- Dashboard admin (pedidos + analytics) ---
  if (e.parameter.clave !== 'sagash2025') return responder({ error: 'no autorizado' });
  const pedidos = ss.getSheetByName('Hoja 1').getDataRange().getValues().slice(1);
  const analytics = ss.getSheetByName('Analytics').getDataRange().getValues().slice(1);
  return responder({ pedidos, analytics });
}
