/**
 * Checklist Page - Interactive Equipment Guide
 * هيما - موقع السياحة الداخلية السورية
 */

document.addEventListener('DOMContentLoaded', function() {
  initChecklist();
});

var state = {
  checkedItems: new Set(),
  rentedItems: new Map(),
  totalItems: 0,
  mountainItems: 0,
  safariItems: 0
};

var dom = {};

function initChecklist() {
  dom = {
    mainProgressBar: document.getElementById('mainProgressBar'),
    progressPercentage: document.getElementById('progressPercentage'),
    progressStatus: document.getElementById('progressStatus'),
    checkedCount: document.getElementById('checkedCount'),
    uncheckedCount: document.getElementById('uncheckedCount'),
    rentedCount: document.getElementById('rentedCount'),
    mountainPercent: document.getElementById('mountainPercent'),
    safariPercent: document.getElementById('safariPercent'),
    rentedItemsCount: document.getElementById('rentedItemsCount'),
    totalRentCost: document.getElementById('totalRentCost'),
    summaryPercent: document.getElementById('summaryPercent'),
    rentalToast: document.getElementById('rentalToast'),
    rentalToastMessage: document.getElementById('rentalToastMessage')
  };

  var allItems = document.querySelectorAll('.checklist-item');
  state.totalItems = allItems.length;
  state.mountainItems = document.querySelectorAll('[data-category="mountain"]').length;
  state.safariItems = document.querySelectorAll('[data-category="safari"]').length;

  // Attach event listeners to checkboxes
  document.querySelectorAll('.item-checkbox').forEach(function(cb) {
    cb.addEventListener('change', updateProgress);
  });

  updateProgress();
  loadState();
}

function updateProgress() {
  var checkboxes = document.querySelectorAll('.item-checkbox');
  var checked = document.querySelectorAll('.item-checkbox:checked');

  var total = checkboxes.length;
  var completed = checked.length;
  var percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (dom.mainProgressBar) {
    dom.mainProgressBar.style.width = percentage + '%';
    dom.mainProgressBar.setAttribute('aria-valuenow', percentage);
    dom.mainProgressBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
    if (percentage < 30) dom.mainProgressBar.classList.add('bg-danger');
    else if (percentage < 70) dom.mainProgressBar.classList.add('bg-warning');
    else if (percentage < 100) dom.mainProgressBar.classList.add('bg-info');
    else dom.mainProgressBar.classList.add('bg-success');
  }

  if (dom.progressPercentage) dom.progressPercentage.textContent = percentage + '%';
  updateStatusMessage(percentage);
  if (dom.checkedCount) dom.checkedCount.textContent = completed;
  if (dom.uncheckedCount) dom.uncheckedCount.textContent = total - completed;
  if (dom.rentedCount) dom.rentedCount.textContent = state.rentedItems.size;
  updateSectionProgress();
  updateSummary();
  saveState();
}

function updateStatusMessage(percentage) {
  if (!dom.progressStatus) return;
  var messages = {
    0: 'ابدأ باختيار المعدات',
    25: 'بداية جيدة! استمر في التجهيز',
    50: 'أنت في منتصف الطريق',
    75: 'تقريباً جاهز! لا تنسَ الباقي',
    100: '🎉 أنت جاهز تماماً للمغامرة!'
  };
  var message = messages[0];
  for (var threshold in messages) {
    if (percentage >= parseInt(threshold)) {
      message = messages[threshold];
    }
  }
  dom.progressStatus.textContent = message;
}

function updateSectionProgress() {
  var mountainChecked = document.querySelectorAll('[data-category="mountain"] .item-checkbox:checked').length;
  var mountainPercentValue = state.mountainItems > 0 
    ? Math.round((mountainChecked / state.mountainItems) * 100) : 0;
  if (dom.mountainPercent) dom.mountainPercent.textContent = mountainPercentValue + '%';

  var safariChecked = document.querySelectorAll('[data-category="safari"] .item-checkbox:checked').length;
  var safariPercentValue = state.safariItems > 0 
    ? Math.round((safariChecked / state.safariItems) * 100) : 0;
  if (dom.safariPercent) dom.safariPercent.textContent = safariPercentValue + '%';
}

function rentItem(btn, name, price, category) {
  var itemEl = btn.closest('.checklist-item');
  if (!itemEl) return;
  var itemId = itemEl.dataset.item;

  if (state.rentedItems.has(itemId)) {
    showToast('هذه الأداة مستأجرة بالفعل!', 'warning');
    return;
  }

  state.rentedItems.set(itemId, { name: name, price: price, category: category });

  if (typeof HimaCart !== 'undefined' && HimaCart.add) {
    HimaCart.add({
      id: 'rent-' + itemId,
      name: 'استئجار: ' + name,
      price: price
    });
  }

  btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> مستأجر';
  btn.classList.add('rented');
  btn.disabled = true;

  var checkbox = itemEl.querySelector('.item-checkbox');
  if (checkbox && !checkbox.checked) {
    checkbox.checked = true;
    updateProgress();
  }

  showToast('تمت إضافة "' + name + '" للسلة بـ ' + price.toLocaleString() + ' ل.س');
  updateSummary();
  saveState();
}

function updateSummary() {
  var rentedCount = state.rentedItems.size;
  var totalCost = 0;
  state.rentedItems.forEach(function(item) { totalCost += item.price; });

  if (dom.rentedItemsCount) dom.rentedItemsCount.textContent = rentedCount + ' عنصر';
  if (dom.totalRentCost) dom.totalRentCost.textContent = totalCost.toLocaleString() + ' ل.س';

  var totalChecked = document.querySelectorAll('.item-checkbox:checked').length;
  var total = document.querySelectorAll('.item-checkbox').length;
  if (dom.summaryPercent) dom.summaryPercent.textContent = total > 0 ? Math.round((totalChecked / total) * 100) + '%' : '0%';
}

function showToast(message, type) {
  type = type || 'success';
  if (!dom.rentalToastMessage || !dom.rentalToast) return;

  dom.rentalToastMessage.textContent = message;
  dom.rentalToast.className = 'rental-toast show';

  if (type === 'warning') {
    dom.rentalToast.style.background = '#ffc107';
    dom.rentalToast.style.color = '#000';
  } else {
    dom.rentalToast.style.background = '#28a745';
    dom.rentalToast.style.color = '#fff';
  }

  setTimeout(function() {
    dom.rentalToast.classList.remove('show');
  }, 3000);
}

function resetChecklist() {
  if (!confirm('هل أنت متأكد من إعادة تعيين القائمة؟')) return;

  document.querySelectorAll('.item-checkbox').forEach(function(cb) { cb.checked = false; });
  state.rentedItems.clear();
  document.querySelectorAll('.btn-rent').forEach(function(btn) {
    btn.innerHTML = '<i class="bi bi-cart-plus"></i> استئجار';
    btn.classList.remove('rented');
    btn.disabled = false;
  });

  updateProgress();
  localStorage.removeItem('himaChecklist');
  showToast('تم إعادة تعيين القائمة');
}

function checkoutRentals() {
  if (state.rentedItems.size === 0) {
    showToast('لم تقم باستئجار أي أدوات بعد!', 'warning');
    return;
  }
  if (typeof toggleCart !== 'undefined') {
    toggleCart();
  } else {
    showToast('تم إضافة ' + state.rentedItems.size + ' عناصر للسلة!');
  }
}

function saveState() {
  var checkedIds = [];
  document.querySelectorAll('.item-checkbox:checked').forEach(function(cb) {
    var item = cb.closest('.checklist-item');
    if (item) checkedIds.push(item.dataset.item);
  });
  var rentedArray = Array.from(state.rentedItems.entries());
  localStorage.setItem('himaChecklist', JSON.stringify({ checkedIds: checkedIds, rentedItems: rentedArray }));
}

function loadState() {
  var saved = localStorage.getItem('himaChecklist');
  if (!saved) return;
  try {
    var data = JSON.parse(saved);
    if (data.checkedIds) {
      data.checkedIds.forEach(function(id) {
        var item = document.querySelector('[data-item="' + id + '"]');
        if (item) {
          var cb = item.querySelector('.item-checkbox');
          if (cb) cb.checked = true;
        }
      });
    }
    if (data.rentedItems) {
      data.rentedItems.forEach(function(itemData) {
        var id = itemData[0];
        var itemInfo = itemData[1];
        state.rentedItems.set(id, itemInfo);
        var item = document.querySelector('[data-item="' + id + '"]');
        if (item) {
          var btn = item.querySelector('.btn-rent');
          if (btn) {
            btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> مستأجر';
            btn.classList.add('rented');
            btn.disabled = true;
          }
        }
      });
    }
    updateProgress();
  } catch (e) {
    console.error('Error loading checklist state:', e);
  }
}

// Expose functions for HTML onclick handlers
window.updateProgress = updateProgress;
window.rentItem = rentItem;
window.resetChecklist = resetChecklist;
window.checkoutRentals = checkoutRentals;