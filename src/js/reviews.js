// ═══════════════════════════════════════════════════════
// ملف التقييمات - reviews.js
// يستخدم Vanilla JS فقط
// ═══════════════════════════════════════════════════════

// ─── بيانات التقييمات الافتراضية ───
let reviews = [
  {
    id: 1,
    name: 'محمد العلي',
    avatar: 'https://ui-avatars.com/api/?name=محمد+العلي&background=1a5f3c&color=fff',
    rating: 5,
    text: 'رحلة تدمر رائعة! التنظيم كان ممتاز والمرشدون محترفون جداً. أنصح الجميع بتجربتها.',
    trip: 'سفاري تدمر الأثرية'
  },
  {
    id: 2,
    name: 'سارة الحسن',
    avatar: 'https://ui-avatars.com/api/?name=سارة+الحسن&background=c41e3a&color=fff',
    rating: 4,
    text: 'تجربة تخييم في الساحل لا تُنسى. الطبيعة خلابة والخدمة ممتازة. سأعود بالتأكيد!',
    trip: 'مخيم غابات الساحل'
  },
  {
    id: 3,
    name: 'أحمد الكردي',
    avatar: 'https://ui-avatars.com/api/?name=أحمد+الكردي&background=f4a261&color=fff',
    rating: 5,
    text: 'أفضل تجربة مغامرة في سوريا. التنظيم والأمان كانا على أعلى مستوى.',
    trip: 'سفاري بادية الشام'
  }
];

// ─── تحميل التقييمات من localStorage ───
function loadReviews() {
  const saved = localStorage.getItem('planeteer-reviews');
  if (saved) {
    reviews = JSON.parse(saved);
  }
  renderReviews();
}

// ─── حفظ التقييمات ───
function saveReviews() {
  localStorage.setItem('planeteer-reviews', JSON.stringify(reviews));
}

// ─── إنشاء نجوم التقييم ───
function createStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '★';
    } else {
      stars += '☆';
    }
  }
  return stars;
}

// ─── عرض التقييمات ───
function renderReviews() {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  container.innerHTML = reviews.map(review => `
    <div class="col-md-4 mb-4">
      <div class="review-card">
        <div class="review-header">
          <img src="${review.avatar}" alt="${review.name}" class="reviewer-avatar">
          <div class="reviewer-info">
            <h5>${review.name}</h5>
            <div class="review-rating">${createStars(review.rating)}</div>
          </div>
        </div>
        <p class="review-text">${review.text}</p>
        <div class="review-trip">
          <i class="bi bi-geo-alt"></i> ${review.trip}
        </div>
      </div>
    </div>
  `).join('');
}

// ─── إضافة تقييم جديد ───
function addReview(name, rating, text, trip) {
  const newReview = {
    id: Date.now(),
    name: name,
    avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=1a5f3c&color=fff',
    rating: parseInt(rating),
    text: text,
    trip: trip || 'رحلة عامة'
  };

  reviews.unshift(newReview);
  saveReviews();
  renderReviews();
}

// ─── معالجة نموذج التقييم ───
function initReviewForm() {
  const form = document.getElementById('review-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewer-name').value.trim();
    const rating = document.getElementById('reviewer-rating').value;
    const text = document.getElementById('reviewer-text').value.trim();
    const trip = document.getElementById('reviewer-trip').value;

    if (!name || !rating || !text) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    addReview(name, rating, text, trip);
    form.reset();
    alert('شكراً لمشاركة تقييمك! 🌟');
  });
}

// ─── تهيئة عند تحميل الصفحة ───
document.addEventListener('DOMContentLoaded', () => {
  loadReviews();
  initReviewForm();
});
