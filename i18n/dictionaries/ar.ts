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
    heroTitle: "أدوات مجانية على الإنترنت للجميع.",
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
    recent: "الأخيرة:",
    clearRecent: "مسح",
    popularSearches: "الشائعة:",
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
    about: "عن TOOLAK",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    rights: "© {year} TOOLAK. جميع الحقوق محفوظة.",
    builtFor: "مصمّمة للسرعة. بلا تسجيل.",
  },
  comingSoon: {
    label: "قريباً",
    toolsTitle: "أولى الأدوات شارفت على الاكتمال",
    toolsBody:
      "نضع اللمسات الأخيرة على الدفعة الأولى: أدوات نصية ومحوّلات ومولّدات — جميعها تعمل بالكامل داخل متصفحك، بلا تثبيت وبلا تسجيل.",
    pricingTitle: "مجاني خلال فترة الإطلاق المبكر",
    pricingBody:
      "كل أداة في TOOLAK مجانية الآن — بلا حساب وبلا حدود للاستخدام. ستتوفر لاحقاً خطط مدفوعة بمزايا إضافية، وسيبقى كل ما هو مجاني اليوم مجانياً.",
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
  stats: {
    heading: "TOOLAK في لمحة",
    totalTools: "أداة",
    categories: "فئات",
    languages: "لغات",
    browserProcessing: "معالجة داخل المتصفح",
    browserProcessingValue: "100%",
  },
  usage: {
    label: "الاستخدام",
    high: "استخدام مرتفع",
    growing: "نموّ سريع",
    new: "أُطلق حديثاً",
    steady: "استخدام مستمر",
  },
  featuredSection: {
    title: "أدوات مختارة",
    description:
      "أدوات منتقاة بعناية تُظهر قدرات المنصة — ابدأ هنا إن كنت جديداً.",
  },
  why: {
    title: "لماذا TOOLAK",
    description:
      "بُنيت على مبدأ واحد: ملفاتك ملكك. وكل شيء آخر ينبع من ذلك.",
    privacyTitle: "الخصوصية أولاً",
    privacyBody:
      "تُعالَج الملفات على جهازك ولا تُرفع أبداً. لا يوجد خادم يمكنه الاطلاع عليها.",
    fastTitle: "نتائج فورية",
    fastBody:
      "لا طوابير رفع، ولا خوادم معالجة، ولا انتظار — يبدأ العمل لحظة إفلات الملف.",
    freeTitle: "مجاني بالكامل",
    freeBody: "كل أداة مجانية، بلا حساب وبلا فترة تجريبية وبلا حدود للاستخدام.",
    offlineTitle: "يعمل دون اتصال",
    offlineBody:
      "بعد تحميل صفحة الأداة، تواصل معظم الأدوات عملها دون إنترنت — فالمعالجة محلية.",
    noUploadTitle: "بلا رفع للملفات، أبداً",
    noUploadBody:
      "بينما ترفع المواقع الأخرى ملفات PDF وصورك لضغطها، ينجز TOOLAK العمل داخل المتصفح نفسه.",
  },
  faq: {
    title: "الأسئلة الشائعة",
    items: [
      {
        q: "هل تُرفع ملفاتي إلى خادم؟",
        a: "لا. كل أداة تعمل بالكامل داخل متصفحك بمعالجة محلية. ملفاتك لا تغادر جهازك أبداً — لا توجد خطوة رفع أصلاً.",
      },
      {
        q: "هل TOOLAK مجاني فعلاً؟",
        a: "نعم. جميع الأدوات مجانية بلا حساب وبلا فترة تجريبية وبلا حدود استخدام. قد تتوفر لاحقاً خطط مدفوعة بمزايا إضافية، لكن ما هو مجاني اليوم سيبقى مجانياً.",
      },
      {
        q: "هل أحتاج إلى إنشاء حساب؟",
        a: "لا. افتح أي أداة وابدأ العمل فوراً — لا تسجيل ولا دخول ولا بريد إلكتروني.",
      },
      {
        q: "ما اللغات التي يدعمها TOOLAK؟",
        a: "الواجهة متوفرة بالعربية (بدعم كامل للكتابة من اليمين إلى اليسار) والإنجليزية، والمنصة مبنية لإضافة مزيد من اللغات مستقبلاً.",
      },
      {
        q: "هل تعمل الأدوات على الجوال؟",
        a: "نعم. كل أداة متجاوبة وسهلة الاستخدام باللمس، فدمج PDF وضغط الصور وغيرها تعمل على الهواتف والأجهزة اللوحية كما على الحاسوب.",
      },
      {
        q: "ما الذي يميّز TOOLAK عن الأدوات الأخرى؟",
        a: "معظم المحوّلات الإلكترونية ترفع ملفاتك إلى خوادمها. أما TOOLAK فيعالج كل شيء محلياً في متصفحك، ما يجعله أسرع في معظم المهام وخاصاً بالتصميم.",
      },
    ],
  },
  cta: {
    title: "جاهز لتوفير بعض الوقت؟",
    body: "اختر أياً من الأدوات الـ{count} وابدأ العمل — بلا تسجيل وبلا تثبيت.",
    button: "تصفّح جميع الأدوات",
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
