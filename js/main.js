// Millennium Aesthetics — shared site behavior

document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle ---------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  /* Language toggle (EN / NP) ---------------------------------------------
     Any element that should change language carries data-en and data-np.
     Inputs/textareas use data-en-ph / data-np-ph for placeholders.
     Language choice is kept in memory only (resets on new page load),
     since this is a placeholder build — wire this to a cookie or a
     shared query param later if persistence across pages is wanted. */
  var currentLang = 'en';
  var langButtons = document.querySelectorAll('.lang-toggle button');

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang === 'np' ? 'ne' : 'en');

    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = el.getAttribute('data-' + lang);
      if (text !== null) el.textContent = text;
    });
    document.querySelectorAll('[data-en-ph]').forEach(function (el) {
      var ph = el.getAttribute('data-' + lang + '-ph');
      if (ph !== null) el.setAttribute('placeholder', ph);
    });

    langButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang'));
    });
  });

  /* Booking form → Formspree https://formspree.io/f/mrpzenzr */
  var bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var submitBtn = bookingForm.querySelector('button[type="submit"]');
      var successEl = document.getElementById('formSuccess');
      var errorEl = document.getElementById('formError');
      var originalText = submitBtn ? submitBtn.textContent : '';

      if (successEl) { successEl.style.display = 'none'; successEl.classList.remove('show'); }
      if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }

      // Basic validation
      var fname = document.getElementById('fname');
      var phone = document.getElementById('phone');
      if (!fname.value.trim() || !phone.value.trim()) {
        if (errorEl) {
          errorEl.textContent = currentLang === 'np' ? 'कृपया नाम र फोन नम्बर भर्नुहोस्।' : 'Please fill name and phone.';
          errorEl.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'np' ? 'पठाउँदै...' : 'Sending...';
      }

      try {
        var formData = new FormData(bookingForm);
        // Set _replyto to email field if provided
        var emailVal = document.getElementById('email')?.value || '';
        if (emailVal) formData.set('_replyto', emailVal);

        const res = await fetch(bookingForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          if (successEl) {
            successEl.style.display = 'block';
            successEl.classList.add('show');
            successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          bookingForm.reset();
        } else {
          const data = await res.json().catch(()=>({}));
          throw new Error(data.error || 'Formspree error');
        }
      } catch (err) {
        console.error(err);
        if (errorEl) {
          errorEl.textContent = currentLang === 'np'
            ? 'पठाउन सकिएन। कृपया सिधै फोन गर्नुहोस्।'
            : 'Could not send. Please call us directly or try again.';
          errorEl.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }

  /* Footer year */
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
