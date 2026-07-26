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

  /* Booking form (placeholder — no backend wired up yet) ------------------ */
  var bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = document.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      bookingForm.reset();
    });
  }

  /* Footer year ------------------------------------------------------------ */
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

});
