/**
 * Planner Page - Multi-step Trip Planner with Live Price Calculator
 * هيما - موقع السياحة الداخلية السورية
 */

document.addEventListener('DOMContentLoaded', function() {
  initPlanner();
  loadPlannerState();
});

let currentStep = 1;
const totalSteps = 4;

const destinationNames = {
  coast: 'الساحل السوري',
  desert: 'البادية السورية',
  qalamoun: 'جبال القلمون'
};

const activityNames = {
  hiking: 'مشي طويل',
  bedouin: 'سهرة بدوية',
  horse: 'ركوب خيل',
  camping: 'تخييم ليلي',
  photography: 'جولة تصوير',
  stargazing: 'مراقبة النجوم',
  cooking: 'طبخ تقليدي',
  camel: 'ركوب جمل'
};

let dom = {};

function initPlanner() {
  dom = {
    livePriceWidget: document.getElementById('livePriceWidget'),
    livePrice: document.getElementById('livePrice'),
    breakdownDestination: document.getElementById('breakdownDestination'),
    breakdownDays: document.getElementById('breakdownDays'),
    breakdownActivities: document.getElementById('breakdownActivities'),
    bookingModal: document.getElementById('bookingModal')
  };

  if (dom.livePriceWidget) {
    setTimeout(function() { dom.livePriceWidget.classList.add('show'); }, 500);
  }
  updateStepIndicator();
  calculatePrice();
}

function nextStep(step) {
  if (!validateStep(currentStep)) return;
  currentStep = step;
  showStep(currentStep);
  updateStepIndicator();
  updateSummary();
  var section = document.querySelector('.planner-section');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevStep(step) {
  currentStep = step;
  showStep(currentStep);
  updateStepIndicator();
}

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(function(el) { el.classList.remove('active'); });
  var targetStep = document.querySelector('.form-step[data-step="' + step + '"]');
  if (targetStep) targetStep.classList.add('active');
}

function updateStepIndicator() {
  document.querySelectorAll('.steps-progress .step').forEach(function(stepEl, index) {
    var stepNum = index + 1;
    stepEl.classList.remove('active', 'completed');
    if (stepNum === currentStep) stepEl.classList.add('active');
    else if (stepNum < currentStep) stepEl.classList.add('completed');
  });
}

function validateStep(step) {
  switch(step) {
    case 1:
      if (!document.querySelector('input[name="destination"]:checked')) {
        showValidationError('الرجاء اختيار وجهة الرحلة');
        return false;
      }
      return true;
    case 2:
      var days = parseInt(document.getElementById('tripDays').value);
      if (!days || days < 1) {
        showValidationError('الرجاء تحديد عدد أيام الرحلة');
        return false;
      }
      return true;
    default: return true;
  }
}

function showValidationError(message) {
  var toast = document.createElement('div');
  toast.className = 'planner-toast error';
  toast.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> ' + message;
  document.body.appendChild(toast);
  setTimeout(function() { toast.classList.add('show'); }, 10);
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

function calculatePrice() {
  var totalPrice = 0;
  var destinationPrice = 0;
  var destinationName = '-';
  var days = 0;
  var activitiesTotal = 0;

  var destination = document.querySelector('input[name="destination"]:checked');
  if (destination) {
    destinationPrice = parseInt(destination.dataset.price) || 0;
    destinationName = destinationNames[destination.value] || destination.value;
    totalPrice += destinationPrice;
  }

  var daysInput = document.getElementById('tripDays');
  if (daysInput) {
    days = parseInt(daysInput.value) || 1;
    totalPrice *= days;
  }

  var activities = document.querySelectorAll('input[name="activities"]:checked');
  activities.forEach(function(activity) {
    activitiesTotal += parseInt(activity.dataset.price) || 0;
  });
  totalPrice += activitiesTotal;

  if (dom.livePrice) {
    animatePrice(dom.livePrice, parseInt(dom.livePrice.textContent.replace(/,/g, '')) || 0, totalPrice);
  }
  if (dom.breakdownDestination) dom.breakdownDestination.textContent = destinationName;
  if (dom.breakdownDays) {
    dom.breakdownDays.textContent = days + ' × ' + (destinationPrice > 0 ? destinationPrice.toLocaleString() : '0');
  }
  if (dom.breakdownActivities) dom.breakdownActivities.textContent = activitiesTotal.toLocaleString() + ' ل.س';
  savePlannerState();
}

function animatePrice(element, from, to) {
  var duration = 500;
  var startTime = performance.now();
  function update(currentTime) {
    var elapsed = currentTime - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var easeOut = 1 - Math.pow(1 - progress, 3);
    var current = Math.floor(from + (to - from) * easeOut);
    element.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function changeDays(delta) {
  var input = document.getElementById('tripDays');
  if (!input) return;
  var value = parseInt(input.value) || 1;
  value += delta;
  if (value < 1) value = 1;
  if (value > 14) value = 14;
  input.value = value;
  updateDurationText(value);
  calculatePrice();
}

function setDays(days) {
  var input = document.getElementById('tripDays');
  if (!input) return;
  input.value = days;
  updateDurationText(days);
  calculatePrice();
}

function updateDurationText(days) {
  var textEl = document.getElementById('durationText');
  if (!textEl) return;
  var text = '';
  if (days === 1) text = 'يوم واحد';
  else if (days === 2) text = 'يومان';
  else if (days >= 3 && days <= 10) text = days + ' أيام';
  else text = days + ' يوم';
  textEl.textContent = text;
}

function updateSummary() {
  var destination = document.querySelector('input[name="destination"]:checked');
  var days = document.getElementById('tripDays');
  var activities = document.querySelectorAll('input[name="activities"]:checked');

  var summaryDestination = document.getElementById('summaryDestination');
  var summaryDuration = document.getElementById('summaryDuration');
  var summaryActivities = document.getElementById('summaryActivities');
  var summaryTotal = document.getElementById('summaryTotal');

  if (summaryDestination) {
    summaryDestination.textContent = destination ? destinationNames[destination.value] : '-';
  }

  if (summaryDuration && days) {
    var durationText = days.value + ' ';
    if (days.value == 1) durationText += 'يوم';
    else if (days.value == 2) durationText += 'يومان';
    else durationText += 'أيام';
    summaryDuration.textContent = durationText;
  }

  if (summaryActivities) {
    if (activities.length === 0) {
      summaryActivities.textContent = 'لا توجد أنشطة مختارة';
    } else {
      var activityList = Array.from(activities).map(function(a) { return activityNames[a.value]; }).join('، ');
      summaryActivities.textContent = activityList;
    }
  }

  if (summaryTotal && dom.livePrice) {
    var total = parseInt(dom.livePrice.textContent.replace(/,/g, '')) || 0;
    summaryTotal.textContent = total.toLocaleString() + ' ل.س';
  }
}

function submitBooking() {
  var name = document.getElementById('bookingName');
  var phone = document.getElementById('bookingPhone');

  if (!name || !name.value.trim()) {
    showValidationError('الرجاء إدخال اسمك الكامل');
    return;
  }
  if (!phone || !phone.value.trim()) {
    showValidationError('الرجاء إدخال رقم الهاتف');
    return;
  }

  var destination = document.querySelector('input[name="destination"]:checked');
  var days = document.getElementById('tripDays');
  var activities = document.querySelectorAll('input[name="activities"]:checked');
  var total = dom.livePrice ? dom.livePrice.textContent : '0';

  var modalDetails = document.getElementById('modalDetails');
  if (modalDetails) {
    modalDetails.innerHTML = 
      '<div class="modal-detail-item"><span>الوجهة:</span><strong>' + 
      (destination ? destinationNames[destination.value] : '-') + 
      '</strong></div>' +
      '<div class="modal-detail-item"><span>المدة:</span><strong>' + 
      (days ? days.value : '0') + ' أيام</strong></div>' +
      '<div class="modal-detail-item"><span>التكلفة:</span><strong>' + 
      total + ' ل.س</strong></div>';
  }

  if (dom.bookingModal) {
    dom.bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  saveBooking({
    name: name.value.trim(),
    phone: phone.value.trim(),
    destination: destination ? destination.value : '',
    days: days ? days.value : '',
    activities: Array.from(activities).map(function(a) { return a.value; }),
    total: total,
    date: new Date().toISOString()
  });
  localStorage.removeItem('himaPlanner');
}

function closeBookingModal() {
  if (dom.bookingModal) dom.bookingModal.classList.remove('active');
  document.body.style.overflow = '';
  window.location.href = '../index.html';
}

function savePlannerState() {
  var destination = document.querySelector('input[name="destination"]:checked');
  var days = document.getElementById('tripDays');
  var activities = document.querySelectorAll('input[name="activities"]:checked');

  var state = {
    destination: destination ? destination.value : '',
    days: days ? days.value : '',
    activities: Array.from(activities).map(function(a) { return a.value; }),
    currentStep: currentStep
  };
  localStorage.setItem('himaPlanner', JSON.stringify(state));
}

function loadPlannerState() {
  var saved = localStorage.getItem('himaPlanner');
  if (!saved) return;
  try {
    var state = JSON.parse(saved);
    if (state.destination) {
      var destInput = document.querySelector('input[name="destination"][value="' + state.destination + '"]');
      if (destInput) destInput.checked = true;
    }
    if (state.days) {
      var daysInput = document.getElementById('tripDays');
      if (daysInput) {
        daysInput.value = state.days;
        updateDurationText(parseInt(state.days));
      }
    }
    if (state.activities) {
      state.activities.forEach(function(act) {
        var input = document.querySelector('input[name="activities"][value="' + act + '"]');
        if (input) input.checked = true;
      });
    }
    calculatePrice();
  } catch (e) { console.error('Error loading planner state:', e); }
}

function saveBooking(booking) {
  var bookings = JSON.parse(localStorage.getItem('himaBookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('himaBookings', JSON.stringify(bookings));
}

// Expose functions for HTML onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;
window.calculatePrice = calculatePrice;
window.changeDays = changeDays;
window.setDays = setDays;
window.submitBooking = submitBooking;
window.closeBookingModal = closeBookingModal;