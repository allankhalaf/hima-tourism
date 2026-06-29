/**
 * Gallery Page - Interactive Filtering System
 * هيما - موقع السياحة الداخلية السورية
 */

document.addEventListener('DOMContentLoaded', function() {
  initGallery();
});

var filterButtons = document.querySelectorAll('.filter-btn');
var galleryItems = document.querySelectorAll('.gallery-item');
var noResults = document.getElementById('noResults');
var lightboxModal = document.getElementById('lightboxModal');
var lightboxImage = document.getElementById('lightboxImage');
var lightboxCaption = document.getElementById('lightboxCaption');

var lightboxData = {
  palmyra: {
    src: '../images/palmyra.jpg',
    caption: 'آثار تدمر - مدينة النخيل الأثرية، واحدة من أهم المدن القديمة في العالم'
  },
  krak: {
    src: '../images/Alhussen.jpg',
    caption: 'قلعة الحصن - أحد أهم القلاع الصليبية في الشرق الأوسط'
  },
  kasab: {
    src: '../images/kasab.jpg',
    caption: 'كسب - قرية ساحلية ساحرة تطل على البحر الأبيض المتوسط'
  },
  mashta: {
    src: '../images/mashta.jpg',
    caption: 'مشتى الحلو - قرية جبلية خلابة تتميز بأشجار الصنوبر'
  },
  badia: {
    src: '../images/badia.jpg',
    caption: 'بادية الشام - صحراء شاسعة تمتد عبر سوريا والعراق والأردن'
  },
  slenfeh: {
    src: '../images/slenfeh.jpg',
    caption: 'صلنفة - قرية جبلية تطل على الساحل السوري من ارتفاع 1130 متراً'
  },
  abwab: {
    src: '../images/abwab.jpg',
    caption: 'أبواب الهوى - موقع أثري يعود للعصر الروماني'
  },
  qalamoun: {
    src: '../images/qalamoun.jpg',
    caption: 'جبال القلمون - سلسلة جبلية خلابة تتميز بغابات الصنوبر والأرز'
  },
  safita: {
    src: '../images/safita.jpg',
    caption: 'صافيتا - مدينة ساحلية تاريخية تضم برج صافيتا الصليبي'
  },
  maarat: {
    src: '../images/maarat.jpg',
    caption: 'معرة النعمان - تضم متحف الفسيفساء الأكبر في الشرق الأوسط'
  }
};

function initGallery() {
  // Check URL params for pre-selected filter
  var urlParams = new URLSearchParams(window.location.search);
  var filterParam = urlParams.get('filter');

  if (filterParam && ['historical', 'nature', 'coastal'].indexOf(filterParam) !== -1) {
    var targetBtn = document.querySelector('[data-filter="' + filterParam + '"]');
    if (targetBtn) {
      filterButtons.forEach(function(btn) { btn.classList.remove('active'); });
      targetBtn.classList.add('active');
      filterGallery(filterParam);
    }
  }

  // Attach click handlers to filter buttons
  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var filter = this.dataset.filter;

      // Update active state
      filterButtons.forEach(function(btn) { btn.classList.remove('active'); });
      this.classList.add('active');

      // Apply filter
      filterGallery(filter);

      // Update URL without reload
      var url = new URL(window.location);
      if (filter === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', filter);
      }
      window.history.replaceState({}, '', url);
    });
  });

  // Close lightbox on background click
  if (lightboxModal) {
    lightboxModal.addEventListener('click', function(e) {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Close lightbox on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function filterGallery(category) {
  var visibleCount = 0;

  galleryItems.forEach(function(item, index) {
    var itemCategory = item.dataset.category;
    var shouldShow = category === 'all' || itemCategory === category;

    if (shouldShow) {
      // Show item with staggered animation
      item.style.display = '';
      setTimeout(function() {
        item.classList.add('show');
        item.classList.remove('hide');
      }, index * 50);
      visibleCount++;
    } else {
      // Hide item
      item.classList.add('hide');
      item.classList.remove('show');
      setTimeout(function() { item.style.display = 'none'; }, 300);
    }
  });

  // Show/hide no results message
  if (noResults) {
    if (visibleCount === 0) {
      setTimeout(function() {
        noResults.style.display = 'block';
        noResults.classList.add('show');
      }, 300);
    } else {
      noResults.classList.remove('show');
      setTimeout(function() { noResults.style.display = 'none'; }, 300);
    }
  }
}

// Expose lightbox functions globally for HTML onclick handlers
window.openLightbox = function(key) {
  var data = lightboxData[key];
  if (!data || !lightboxImage || !lightboxCaption || !lightboxModal) return;

  lightboxImage.src = data.src;
  lightboxCaption.textContent = data.caption;
  lightboxModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(function() {
    if (lightboxImage) lightboxImage.src = '';
  }, 300);
};