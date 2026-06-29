# هيما - ملفات الصفحات الإضافية

## 📁 هيكل الملفات

```
hima-project/
├── pages/
│   ├── gallery.html          ← صفحة استكشف سوريا
│   ├── checklist.html        ← صفحة دليل المعدات التفاعلي
│   └── planner.html          ← صفحة صمم رحلتك المخصصة
│
├── js/
│   ├── gallery.js            ← فلترة البطاقات + Lightbox
│   ├── checklist.js          ← شريط التقدم + استئجار
│   └── planner.js            ← نموذج متعدد الخطوات + حاسبة السعر
│
├── src/scss/pages/
│   ├── _index.scss           ← نقطة دخول الصفحات
│   ├── _gallery.scss         ← تنسيقات صفحة الاستكشاف
│   ├── _checklist.scss       ← تنسيقات صفحة المعدات
│   └── _planner.scss         ← تنسيقات صفحة التخطيط
│
└── src/scss/
    └── main.scss             ← الملف الرئيسي (محدّث)
```

## 🔧 كيفية الربط

### 1. في ملف main.scss الرئيسي:
أضف هذا السطر قبل قسم Themes:
```scss
// 5. Pages
@import 'pages/index';
```

### 2. في index.html الرئيسي:
حدّث روابط التنقل لتشير للصفحات الجديدة:
```html
<li class="nav-item"><a class="nav-link" href="pages/gallery.html">استكشف سوريا</a></li>
<li class="nav-item"><a class="nav-link" href="pages/checklist.html">دليل المعدات</a></li>
<li class="nav-item"><a class="nav-link" href="pages/planner.html">صمم رحلتك</a></li>
```

### 3. في contact.html:
أضف نفس الروابط في شريط التنقل.

## 🎯 مميزات كل صفحة

### gallery.html (استكشف سوريا)
- ✅ أزرار تصفية تفاعلية (الكل / أثري / طبيعة / ساحلي)
- ✅ فلترة باستخدام dataset + classes
- ✅ تأثيرات حركية سلسة عند التصفية
- ✅ Lightbox للصور
- ✅ إضافة للسلة من كل بطاقة

### checklist.html (دليل المعدات)
- ✅ شريط تقدم ديناميكي (Bootstrap Progress Bar)
- ✅ نسبة جاهزية لكل قسم (جبلي / صحراوي)
- ✅ حفظ الحالة في localStorage
- ✅ زر استئجار يضيف للسلة
- ✅ ملخص التكلفة

### planner.html (صمم رحلتك)
- ✅ نموذج متعدد الخطوات (4 خطوات)
- ✅ حاسبة سعر فورية (Live Price Calculator)
- ✅ ويدجت السعر العائم
- ✅ حفظ/استعادة الحالة
- ✅ تأكيد الحجز مع Modal

## 📝 ملاحظات مهمة

1. **الصور**: تحتاج لإضافة صور إضافية في مجلد `images/`:
   - `kasab.jpg`, `mashta.jpg`, `slenfeh.jpg`
   - `abwab.jpg`, `qalamoun.jpg`, `safita.jpg`, `maarat.jpg`

2. **HimaCart**: يفترض وجود كائن `HimaCart` ودالة `toggleCart()` في `main.bundle.js`

3. **RTL**: جميع الصفحات تدعم الاتجاه من اليمين لليسار

4. **Responsive**: جميع الصفحات متجاوبة بالكامل مع Bootstrap 5
