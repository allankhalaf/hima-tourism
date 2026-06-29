// ═══════════════════════════════════════════════════════
// ملف إدارة السلة - cart.js (هيما)
// يستخدم Vanilla JS فقط
// ═══════════════════════════════════════════════════════

// ─── مصفوفة السلة ───
let cart = [];

// ─── تحميل السلة من localStorage ───
function loadCart() {
  const saved = localStorage.getItem('hima-cart');
  if (saved) {
    cart = JSON.parse(saved);
    updateCartUI();
  }
}

// ─── حفظ السلة في localStorage ───
function saveCart() {
  localStorage.setItem('hima-cart', JSON.stringify(cart));
}

// ─── إضافة رحلة للسلة ───
function addToCart(trip) {
  const exists = cart.find(item => item.id === trip.id);

  if (exists) {
    exists.quantity += 1;
  } else {
    cart.push({
      id: trip.id,
      name: trip.name,
      price: trip.price,
      image: trip.image,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  showCartMessage('تمت إضافة الرحلة إلى السلة! 🎉');
  renderCartModal();
}

// ─── إزالة رحلة من السلة ───
function removeFromCart(tripId) {
  cart = cart.filter(item => item.id !== tripId);
  saveCart();
  updateCartUI();
  renderCartModal();
}

// ─── تحديث الكمية ───
function updateQuantity(tripId, change) {
  const item = cart.find(item => item.id === tripId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(tripId);
    } else {
      saveCart();
      updateCartUI();
      renderCartModal();
    }
  }
}

// ─── حساب الإجمالي ───
function getTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ─── تحديث واجهة السلة ───
function updateCartUI() {
  const countElements = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  countElements.forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

// ─── عرض رسالة ───
function showCartMessage(message) {
  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: linear-gradient(135deg, #1a5f3c, #2d6a4f);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    font-family: 'Cairo', sans-serif;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(26, 95, 60, 0.4);
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ─── إنشاء نافذة السلة المنبثقة ───
function createCartModal() {
  if (document.getElementById('cart-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'cart-modal';
  modal.className = 'cart-modal';
  modal.innerHTML = `
    <div class="cart-modal-content">
      <div class="cart-modal-header">
        <h3>🛒 سلة المشتريات</h3>
        <button class="cart-close-btn" onclick="closeCart()">&times;</button>
      </div>
      <div class="cart-modal-body" id="cart-modal-body">
        <p class="cart-empty">السلة فارغة</p>
      </div>
      <div class="cart-modal-footer">
        <div class="cart-total">
          <span>الإجمالي:</span>
          <span id="cart-total-price">0 ل.س</span>
        </div>
        <button class="btn-checkout" onclick="checkout()">إتمام الحجز</button>
        <button class="btn-clear" onclick="HimaCart.clear()">إفراغ السلة</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// ─── عرض نافذة السلة ───
function toggleCart() {
  createCartModal();
  const modal = document.getElementById('cart-modal');
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
  renderCartModal();
}

function closeCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) modal.style.display = 'none';
}

// ─── تحديث محتوى السلة ───
function renderCartModal() {
  const body = document.getElementById('cart-modal-body');
  const totalEl = document.getElementById('cart-total-price');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = '<p class="cart-empty">السلة فارغة</p>';
    if (totalEl) totalEl.textContent = '0 ل.س';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.price.toLocaleString()} ل.س</p>
      </div>
      <div class="cart-item-actions">
        <button onclick="HimaCart.updateQuantity('${item.id}', -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="HimaCart.updateQuantity('${item.id}', 1)">+</button>
        <button class="cart-remove" onclick="HimaCart.remove('${item.id}')">🗑️</button>
      </div>
    </div>
  `).join('');

  if (totalEl) {
    totalEl.textContent = getTotal().toLocaleString() + ' ل.س';
  }
}

// ─── إتمام الحجز ───
function checkout() {
  if (cart.length === 0) {
    alert('السلة فارغة! أضف رحلة أولاً');
    return;
  }
  alert('شكراً لحجزك! سنتواصل معك لتأكيد التفاصيل 🌍');
  HimaCart.clear();
  closeCart();
}

// ─── تصدير الدوال للاستخدام العام ───
window.HimaCart = {
  add: addToCart,
  remove: removeFromCart,
  updateQuantity: updateQuantity,
  getItems: () => [...cart],
  getTotal: getTotal,
  clear: () => { cart = []; saveCart(); updateCartUI(); renderCartModal(); },
  toggle: toggleCart,
  close: closeCart
};

window.toggleCart = toggleCart;
window.closeCart = closeCart;
window.checkout = checkout;

// ─── تهيئة عند تحميل الصفحة ───
document.addEventListener('DOMContentLoaded', loadCart);