// 1. Año automático en el pie de página
document.getElementById('anio').textContent = new Date().getFullYear();

// 2. Tema claro/oscuro (se guarda en el navegador si está disponible)
const raiz = document.documentElement;
const botonTema = document.getElementById('tema');
function aplicarTema(tema) {
  raiz.setAttribute('data-tema', tema);
  botonTema.textContent = tema === 'oscuro' ? 'Tema claro' : 'Tema oscuro';
}
let temaInicial = null;
try { temaInicial = localStorage.getItem('tema'); } catch (e) {}
if (!temaInicial) {
  temaInicial = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}
aplicarTema(temaInicial);
botonTema.addEventListener('click', () => {
  const nuevo = raiz.getAttribute('data-tema') === 'oscuro' ? 'claro' : 'oscuro';
  aplicarTema(nuevo);
  try { localStorage.setItem('tema', nuevo); } catch (e) {}
});

// 3. Rol que cambia en la portada (edita esta lista con tus propios textos)
const roles = ['[tu carrera]', '[tu área de interés]', '[lo que quieres ser]'];
const rolEl = document.getElementById('rol-dinamico');
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!sinMovimiento) {
  let i = 0;
  setInterval(() => {
    i = (i + 1) % roles.length;
    rolEl.textContent = roles[i];
  }, 2500);
}

// 4. Resaltar la sección visible en el menú
const enlaces = document.querySelectorAll('#menu a');
const secciones = document.querySelectorAll('main section');
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) {
      enlaces.forEach((a) => a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
secciones.forEach((s) => observador.observe(s));

// 5. Filtro de habilidades
const botonesFiltro = document.querySelectorAll('.filtro');
const habilidades = document.querySelectorAll('#lista-habilidades li');
botonesFiltro.forEach((b) => {
  b.addEventListener('click', () => {
    botonesFiltro.forEach((x) => x.classList.remove('activo'));
    b.classList.add('activo');
    const f = b.dataset.filtro;
    habilidades.forEach((li) => { li.hidden = !(f === 'todas' || li.dataset.tipo === f); });
  });
});

// 6. Intereses: mostrar detalle al tocar
const chips = document.querySelectorAll('#chips button');
const detalle = document.getElementById('detalle-chip');
chips.forEach((c) => {
  c.addEventListener('click', () => {
    chips.forEach((x) => x.setAttribute('aria-pressed', 'false'));
    c.setAttribute('aria-pressed', 'true');
    detalle.textContent = c.textContent + ': ' + c.dataset.detalle;
  });
});

// 7. Validación del formulario de contacto
const form = document.getElementById('form');
const estado = document.getElementById('estado');
function validar(campo, mensaje) {
  const err = document.getElementById('err-' + campo.id);
  const valido = campo.checkValidity() && campo.value.trim() !== '';
  campo.setAttribute('aria-invalid', String(!valido));
  err.textContent = valido ? '' : mensaje;
  return valido;
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const n = validar(form.nombre, 'Escribe tu nombre.');
  const c = validar(form.correo, 'Escribe un correo válido, por ejemplo nombre@dominio.com.');
  const m = validar(form.mensaje, 'Escribe un mensaje.');
  if (n && c && m) {
    estado.textContent = 'Mensaje listo. Se abrirá tu aplicación de correo para enviarlo.';
    const asunto = encodeURIComponent('Contacto desde tu página web');
    const cuerpo = encodeURIComponent(form.mensaje.value + '\n\n' + form.nombre.value + ' (' + form.correo.value + ')');
    window.location.href = 'mailto:tucorreo@ejemplo.com?subject=' + asunto + '&body=' + cuerpo;
    form.reset();
  } else {
    estado.textContent = 'Revisa los campos marcados.';
  }
});
