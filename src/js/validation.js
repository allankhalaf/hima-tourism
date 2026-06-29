// ═══════════════════════════════════════════════════════
// ملف التحقق من النماذج - validation.js
// يستخدم jQuery للتحقق من صحة جميع الإدخالات
// ═══════════════════════════════════════════════════════

$(document).ready(function() {

  // ─── التحقق من نموذج التواصل ───
  $('#contact-form').on('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    // إعادة ضبط الحالات السابقة
    $('.form-control').removeClass('is-valid is-invalid');
    $('.invalid-feedback').hide();

    // ─── التحقق من الاسم (3 أحرف على الأقل) ───
    const name = $('#contact-name').val().trim();
    if (name.length < 3) {
      showError('#contact-name', 'الاسم يجب أن يكون 3 أحرف على الأقل');
      isValid = false;
    } else if (!/^[؀-ۿ\s]+$/.test(name) && !/^[a-zA-Z\s]+$/.test(name)) {
      showError('#contact-name', 'الاسم يجب أن يحتوي على حروف فقط');
      isValid = false;
    } else {
      showSuccess('#contact-name');
    }

    // ─── التحقق من البريد الإلكتروني ───
    const email = $('#contact-email').val().trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError('#contact-email', 'الرجاء إدخال بريد إلكتروني صحيح (مثال: name@email.com)');
      isValid = false;
    } else {
      showSuccess('#contact-email');
    }

    // ─── التحقق من رقم الهاتف (سوري: 09xxxxxxxx) ───
    const phone = $('#contact-phone').val().trim();
    const phonePattern = /^09\d{8}$/;
    if (!phonePattern.test(phone)) {
      showError('#contact-phone', 'الرجاء إدخال رقم هاتف صحيح يبدأ بـ 09 (10 أرقام)');
      isValid = false;
    } else {
      showSuccess('#contact-phone');
    }

    // ─── التحقق من عدد التذاكر (1-20) ───
    const tickets = $('#contact-tickets').val();
    if (!tickets || tickets < 1 || tickets > 20 || !Number.isInteger(Number(tickets))) {
      showError('#contact-tickets', 'عدد التذاكر يجب أن يكون رقماً صحيحاً بين 1 و 20');
      isValid = false;
    } else {
      showSuccess('#contact-tickets');
    }

    // ─── التحقق من نوع الرحلة ───
    const tripType = $('#contact-trip-type').val();
    if (!tripType) {
      showError('#contact-trip-type', 'الرجاء اختيار نوع الرحلة المطلوبة');
      isValid = false;
    } else {
      showSuccess('#contact-trip-type');
    }

    // ─── التحقق من الرسالة (10 أحرف على الأقل) ───
    const message = $('#contact-message').val().trim();
    if (message.length < 10) {
      showError('#contact-message', 'الرسالة يجب أن تكون 10 أحرف على الأقل');
      isValid = false;
    } else {
      showSuccess('#contact-message');
    }

    // ─── إذا كان كل شيء صحيح ───
    if (isValid) {
      // إظهار رسالة نجاح
      showSuccessMessage();
      // إعادة تعيين النموذج
      $('#contact-form')[0].reset();
      $('.form-control').removeClass('is-valid is-invalid');
    }
  });

  // ─── التحقق المباشر عند مغادرة الحقل (blur) ───
  $('#contact-form input, #contact-form textarea, #contact-form select').on('blur', function() {
    validateField($(this));
  });

  // ─── التحقق المباشر عند الكتابة (input) ───
  $('#contact-form input, #contact-form textarea').on('input', function() {
    const $field = $(this);
    clearTimeout($field.data('timer'));
    $field.data('timer', setTimeout(function() {
      validateField($field);
    }, 500));
  });

  // ─── دوال مساعدة ───

  // التحقق من حقل واحد
  function validateField($field) {
    const id = $field.attr('id');
    const value = $field.val().trim();

    switch(id) {
      case 'contact-name':
        if (value.length < 3) {
          showError('#contact-name', 'الاسم يجب أن يكون 3 أحرف على الأقل');
        } else if (!/^[؀-ۿ\s]+$/.test(value) && !/^[a-zA-Z\s]+$/.test(value)) {
          showError('#contact-name', 'الاسم يجب أن يحتوي على حروف فقط');
        } else {
          showSuccess('#contact-name');
        }
        break;

      case 'contact-email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          showError('#contact-email', 'الرجاء إدخال بريد إلكتروني صحيح');
        } else {
          showSuccess('#contact-email');
        }
        break;

      case 'contact-phone':
        if (!/^09\d{8}$/.test(value)) {
          showError('#contact-phone', 'الرجاء إدخال رقم هاتف صحيح يبدأ بـ 09');
        } else {
          showSuccess('#contact-phone');
        }
        break;

      case 'contact-tickets':
        if (!value || value < 1 || value > 20) {
          showError('#contact-tickets', 'عدد التذاكر يجب أن يكون بين 1 و 20');
        } else {
          showSuccess('#contact-tickets');
        }
        break;

      case 'contact-trip-type':
        if (!value) {
          showError('#contact-trip-type', 'الرجاء اختيار نوع الرحلة');
        } else {
          showSuccess('#contact-trip-type');
        }
        break;

      case 'contact-message':
        if (value.length < 10) {
          showError('#contact-message', 'الرسالة يجب أن تكون 10 أحرف على الأقل');
        } else {
          showSuccess('#contact-message');
        }
        break;
    }
  }

  // عرض خطأ
  function showError(selector, message) {
    $(selector).removeClass('is-valid').addClass('is-invalid');
    $(selector).siblings('.invalid-feedback').text(message).show();
  }

  // عرض نجاح
  function showSuccess(selector) {
    $(selector).removeClass('is-invalid').addClass('is-valid');
    $(selector).siblings('.invalid-feedback').hide();
  }

  // رسالة نجاح
  function showSuccessMessage() {
    const alert = $('<div class="alert alert-success mt-3">' +
      '<i class="bi bi-check-circle"></i> ' +
      'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً 🌍' +
      '</div>');
    $('#contact-form').append(alert);
    setTimeout(() => alert.fadeOut(500, function() { $(this).remove(); }), 5000);
  }

});
