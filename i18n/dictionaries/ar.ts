import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * i18n/dictionaries/ar.ts
 *
 * Arabic UI strings. Typed as `Dictionary`, so the compiler rejects this
 * file if any key is missing, misspelled, or added without an English
 * counterpart — translations can't silently drift out of sync.
 *
 * Notes on the translation itself:
 * - Arabic-Indic vs Western digits: interpolated counts stay Western
 *   (٣ vs 3), which is the norm in Saudi/Gulf software UI and matches the
 *   tabular figures used throughout the product.
 * - Quotation marks use Arabic «» guillemets where the English uses “”.
 * - Interface verbs are imperative and short, as in native Arabic UI.
 */

export const ar: Dictionary = {
  nav: {
    home: "الرئيسية",
    tools: "الأدوات",
    pricing: "الأسعار",
    blog: "المدونة",
    soon: "قريباً",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    skipToContent: "تخطي إلى المحتوى",
    mainNav: "التنقل الرئيسي",
    mobileNav: "قائمة الجوال",
    breadcrumb: "مسار التنقل",
    language: "اللغة",
    toggleTheme: "تبديل المظهر",
    lightTheme: "التبديل إلى المظهر الفاتح",
    darkTheme: "التبديل إلى المظهر الداكن",
    exploreTools: "استكشف الأدوات",
  },
  home: {
    heroBadge: "{count} أداة · لا شيء يغادر جهازك",
    heroTitle: "وفّر ساعات من وقتك بأدوات إلكترونية فعّالة.",
    heroSubtitle:
      "اضغط ملف PDF، صغّر حجم صورة، نظّف نصاً — كل أداة تعمل بالكامل داخل متصفحك. بلا رفع للملفات، وبلا حسابات، وبلا انتظار.",
    heroCtaPrimary: "استكشف الأدوات",
    heroCtaSecondary: "ادمج ملف PDF",
    searchTip: "كل أداة تعمل داخل متصفحك — لا يتم رفع أي ملف.",
    tip: "معلومة",
    popularTitle: "الأكثر استخداماً",
    popularDescription:
      "الأدوات التي يستخدمها الناس أكثر من غيرها — معالجة ملفات PDF والصور التي تحتاج عادةً إلى برنامج مثبّت.",
    recentTitle: "أُضيف حديثاً",
    recentDescription: "أحدث الإضافات إلى مجموعة الأدوات.",
    categoriesTitle: "تصفّح حسب الفئة",
    allToolsTitle: "جميع الأدوات",
    allToolsDescription: "كل أداة في المجموعة — {count} أداة والعدد في ازدياد.",
    openDirectory: "افتح دليل الأدوات",
  },
  tools: {
    directoryTitle: "أدوات مجانية على الإنترنت",
    directorySubtitle:
      "{count} أداة سريعة تعمل داخل المتصفح للنصوص والبرمجة وتحسين محركات البحث ووسائل التواصل والصور والإنتاجية. كل شيء يعمل محلياً — بلا رفع للملفات، وبلا حسابات، وبلا انتظار.",
    searchPlaceholder: "ابحث في {count} أداة — جرّب «PDF» أو «ضغط» أو «QR»…",
    searchLabel: "البحث في الأدوات",
    clearSearch: "مسح البحث",
    filterByCategory: "تصفية الأدوات حسب الفئة",
    all: "الكل",
    featured: "أدوات مختارة",
    results: "النتائج",
    allTools: "جميع الأدوات",
    toolCount: "{count} أداة",
    toolCountPlural: "{count} أداة",
    openTool: "افتح الأداة",
    free: "مجاني",
    pro: "مدفوع",
    popular: "شائع",
    new: "جديد",
    featuredBadge: "مختار",
    relatedKeywords: "كلمات مفتاحية ذات صلة",
    moreInCategory: "المزيد من أدوات {category}",
    viewAllInCategory: "عرض جميع أدوات {category}",
    browseOtherCategories: "تصفّح الفئات الأخرى",
    allCategoryTools: "جميع أدوات {category}",
    launchingSoon: "قريباً",
    comingSoonTitle: "{tool} في مراحلها الأخيرة",
    comingSoonBody:
      "هذه الأداة قيد التطوير الآن وستعمل بالكامل داخل متصفحك — مجاناً، وبخصوصية تامة، وبلا تسجيل. وحتى ذلك الحين، بقية الأدوات على بُعد نقرة واحدة.",
    browseAll: "تصفّح جميع الأدوات",
    loadingTool: "جارٍ تحميل الأداة…",
  },
  search: {
    emptyTitle: "لا توجد أدوات مطابقة لبحثك",
    emptyBody:
      "لا نتائج مطابقة لـ «{query}». جرّب كلمة أخرى، أو تصفّح المجموعة كاملة.",
    emptyBodyCategory:
      "لا نتائج مطابقة لـ «{query}» في هذه الفئة. جرّب كلمة أخرى، أو تصفّح المجموعة كاملة.",
    clearFilters: "مسح البحث والتصفية",
    noMatches: "لا توجد أدوات مطابقة لـ «{query}».",
    browseCatalog: "تصفّح المجموعة كاملة",
    seeAllMatches: "عرض جميع النتائج ({count}) في الدليل ←",
    resultsFound: "تم العثور على {count} أداة",
  },
  footer: {
    tagline:
      "أدوات سريعة ومجانية تعمل داخل المتصفح للمطورين والكتّاب والمهام اليومية. بلا تسجيل.",
    product: "المنتج",
    resources: "المصادر",
    legal: "الشؤون القانونية",
    social: "التواصل",
    allTools: "جميع الأدوات",
    pricing: "الأسعار",
    whatsNew: "الجديد",
    blog: "المدونة",
    contact: "اتصل بنا",
    about: "عن ToolSprint",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    rights: "© {year} ToolSprint. جميع الحقوق محفوظة.",
    builtFor: "مصمّمة للسرعة. بلا تسجيل.",
  },
  comingSoon: {
    label: "قريباً",
    toolsTitle: "أولى الأدوات شارفت على الاكتمال",
    toolsBody:
      "نضع اللمسات الأخيرة على الدفعة الأولى: أدوات نصية ومحوّلات ومولّدات — جميعها تعمل بالكامل داخل متصفحك، بلا تثبيت وبلا تسجيل.",
    pricingTitle: "مجاني خلال فترة الإطلاق المبكر",
    pricingBody:
      "كل أداة في ToolSprint مجانية الآن — بلا حساب وبلا حدود للاستخدام. ستتوفر لاحقاً خطط مدفوعة بمزايا إضافية، وسيبقى كل ما هو مجاني اليوم مجانياً.",
    pricingCta: "استخدم الأدوات المجانية",
    blogTitle: "أدلة وشروحات في الطريق",
    blogBody:
      "نكتب مقالات عملية ومباشرة: كيف تستفيد من كل أداة إلى أقصى حد، ونصائح لسير العمل، ومقارنات تساعدك على اختيار الأداة المناسبة.",
    blogCta: "استكشف الأدوات",
    backHome: "العودة إلى الرئيسية",
  },
  errors: {
    notFoundTitle: "هذه الصفحة غير موجودة",
    notFoundBody:
      "ربما تم نقل الصفحة التي تبحث عنها، أو أن الرابط غير صحيح. دليل الأدوات على بُعد نقرة واحدة.",
    genericTitle: "حدث خطأ ما",
    genericBody:
      "قاطع هذه الصفحة خطأ غير متوقع. إعادة التحميل تحل المشكلة عادةً.",
    tryAgain: "أعد المحاولة",
    backToTools: "العودة إلى الأدوات",
  },
  common: {
    copy: "نسخ",
    copied: "تم النسخ",
    clear: "مسح",
    download: "تنزيل",
    remove: "إزالة",
    close: "إغلاق",
  },
};
