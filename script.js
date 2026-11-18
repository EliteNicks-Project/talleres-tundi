/* ==========================================================================
   TALLERES TUNDI - BADAJOZ | JAVASCRIPT PRINCIPAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú Hamburguesa Responsive
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  }

  // 2. Carga diferida (Lazy Load) del Mapa de Google Maps para máximo rendimiento
  const lazyMapContainer = document.getElementById('lazyMap');
  const loadMapBtn = document.getElementById('loadMapBtn');

  function injectGoogleMap(container) {
    if (!container || container.dataset.loaded === 'true') return;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps?q=Hernando+de+Soto,+3,+06006+Badajoz,+España&output=embed';
    iframe.title = 'Ubicación de Talleres TUNDI en C/ Hernando de Soto 3, Badajoz';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    container.innerHTML = '';
    container.appendChild(iframe);
    container.dataset.loaded = 'true';
  }

  if (lazyMapContainer) {
    if (loadMapBtn) {
      loadMapBtn.addEventListener('click', () => injectGoogleMap(lazyMapContainer));
    }

    if ('IntersectionObserver' in window) {
      const mapObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            injectGoogleMap(lazyMapContainer);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });

      mapObserver.observe(lazyMapContainer);
    }
  }

  // 3. Envío de Formularios sin backend (Web3Forms / Formspree)
  const contactForms = document.querySelectorAll('.tundi-form');

  contactForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const statusBox = form.querySelector('.form-status');
      const originalBtnHTML = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando solicitud...';

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && (data.success || response.status === 200)) {
          statusBox.className = 'form-status success';
          statusBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>¡Solicitud enviada!</strong> Nos pondremos en contacto contigo lo antes posible. Si es urgente, llámanos o escríbenos por WhatsApp al <strong>626 18 30 35</strong>.';
          form.reset();
        } else {
          throw new Error(data.message || 'Error al procesar el envío.');
        }
      } catch (error) {
        statusBox.className = 'form-status error';
        statusBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> No se pudo enviar automáticamente (verifica que hayas configurado tu clave de Web3Forms). Puedes escribirnos directamente a <strong>tallerestundi@gmail.com</strong> o llamar al <strong>626 18 30 35</strong>.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  });

  // 4. Año actual automático en el Footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
