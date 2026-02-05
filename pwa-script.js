// دالة لفتح محتوى التبويب المناسب
function openTab(tabName) {
  // إخفاء جميع محتويات التبويبات
  var contents = document.querySelectorAll('.tab-content');
  contents.forEach(function(content) {
    content.style.display = 'none';
  });

  // إزالة الفئة النشطة من جميع التبويبات
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function(tab) {
    tab.classList.remove('active-tab');
  });

  // عرض محتوى التبويب المحدد
  document.getElementById(tabName).style.display = 'block';
  
  // إضافة الفئة النشطة للتبويب المحدد
  var activeTab = document.querySelector(`[onclick="openTab('${tabName}')"]`);
  activeTab.classList.add('active-tab');
  
  // تخزين التبويب النشط في localStorage
  localStorage.setItem('activeTab', tabName);
}

// التحقق من وجود تبويب نشط محفوظ
document.addEventListener('DOMContentLoaded', function() {
  var savedTab = localStorage.getItem('activeTab');
  if (savedTab) {
    openTab(savedTab);
  } else {
    // افتراضيًا، نفتح التبويب الأول (جوجل)
    openTab('google');
  }
});

// تسجيل service worker للـ PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(function(error) {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
