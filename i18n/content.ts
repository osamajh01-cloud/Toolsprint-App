import type { Locale } from "@/i18n/config";
import type { CategorySlug, Tool, ToolCategory } from "@/types/tool";

/**
 * i18n/content.ts
 *
 * Translations for REGISTRY content (tool names, descriptions, keywords,
 * category names) — kept here rather than in the registry files so there
 * is still exactly ONE registry entry per tool. The registry holds the
 * canonical English text plus all structural metadata; this module holds
 * the other languages, keyed by slug.
 *
 * Anything without a translation falls back to the registry's English, so
 * a newly added tool is never blank in Arabic — it simply appears in
 * English until its translation lands.
 */

interface ToolContent {
  title: string;
  shortDescription: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}

interface CategoryContent {
  title: string;
  description: string;
}

const arTools: Record<string, ToolContent> = {
  "word-counter": {
    title: "عدّاد الكلمات",
    shortDescription: "احسب الكلمات والأحرف والجمل ووقت القراءة أثناء الكتابة.",
    tags: ["كلمات", "أحرف", "عد", "وقت القراءة", "كتابة"],
    seoTitle: "عدّاد الكلمات المجاني — الكلمات والأحرف ووقت القراءة",
    seoDescription: "الصق أو اكتب نصاً لحساب الكلمات والأحرف والجمل ووقت القراءة التقديري فوراً. مجاني وخاص ويعمل بالكامل داخل متصفحك.",
  },
  "case-converter": {
    title: "محوّل حالة الأحرف",
    shortDescription: "بدّل النص بين الأحرف الكبيرة والصغيرة وحالة العنوان والجملة بنقرة واحدة.",
    tags: ["أحرف كبيرة", "أحرف صغيرة", "حالة العنوان", "حالة الجملة"],
    seoTitle: "محوّل حالة الأحرف — كبيرة وصغيرة وحالة العنوان",
    seoDescription: "حوّل النص إلى أحرف كبيرة أو صغيرة أو حالة العنوان أو الجملة فوراً. أداة مجانية بلا تسجيل وبلا رفع للملفات.",
  },
  "lorem-ipsum-generator": {
    title: "مولّد نص لوريم إيبسوم",
    shortDescription: "أنشئ فقرات أو جملاً أو كلمات وهمية للتصاميم والنماذج الأولية.",
    tags: ["نص وهمي", "نص بديل", "نموذج أولي", "حشو"],
    seoTitle: "مولّد لوريم إيبسوم — نص بديل للمصممين",
    seoDescription: "أنشئ نصاً بديلاً نظيفاً بعدد الفقرات أو الجمل أو الكلمات. نص جاهز للنسخ للنماذج الأولية، مجاناً وفورياً.",
  },
  "text-cleaner": {
    title: "منظّف النصوص",
    shortDescription: "احذف المسافات الزائدة وفواصل الأسطر والأحرف غير المرئية من النص الملصق.",
    tags: ["مسافات", "حذف فواصل الأسطر", "تنظيف النص", "تنسيق"],
    seoTitle: "منظّف النصوص — احذف المسافات الزائدة وفواصل الأسطر",
    seoDescription: "نظّف النص الملصق بنقرة واحدة: احذف المسافات المزدوجة وفواصل الأسطر الشاردة والأحرف غير المرئية. أداة مجانية تعمل في المتصفح.",
  },
  "text-reverser": {
    title: "عاكس النصوص",
    shortDescription: "اعكس النص حسب الأحرف أو ترتيب الكلمات أو ترتيب الأسطر — فوراً.",
    tags: ["عكس", "بالمقلوب", "انعكاس", "قلب", "أسطر"],
    seoTitle: "عاكس النصوص — اعكس الأحرف والكلمات والأسطر",
    seoDescription: "اعكس أي نص فوراً: اقلب الأحرف أو رتّب الكلمات عكسياً أو اعكس ترتيب الأسطر. يدعم الرموز التعبيرية، مجاناً وداخل متصفحك.",
  },
  "remove-duplicate-lines": {
    title: "حذف الأسطر المكررة",
    shortDescription: "الصق قائمة واحصل على الأسطر الفريدة — مع خيارات الفرز وتجاهل حالة الأحرف.",
    tags: ["حذف التكرار", "أسطر فريدة", "تنظيف قائمة", "فرز"],
    seoTitle: "حذف الأسطر المكررة — نظّف ورتّب أي قائمة",
    seoDescription: "احذف الأسطر المكررة من أي قائمة بلصقة واحدة. خيارات لتجاهل حالة الأحرف وإزالة المسافات والفرز أبجدياً. مجاني وداخل المتصفح بالكامل.",
  },
  "json-formatter": {
    title: "منسّق JSON",
    shortDescription: "نسّق وتحقّق واضغط JSON مع رسائل خطأ واضحة للمدخلات غير الصالحة.",
    tags: ["JSON", "تنسيق", "تحقق", "ضغط", "تنسيق مقروء"],
    seoTitle: "منسّق ومدقّق JSON — تنسيق JSON على الإنترنت",
    seoDescription: "نسّق وتحقّق واضغط JSON فوراً مع تحديد دقيق لمواضع الأخطاء. منسّق JSON مجاني لا يرفع بياناتك أبداً.",
  },
  "base64-encoder": {
    title: "مرمّز Base64",
    shortDescription: "رمّز النص إلى Base64 أو فك ترميزه إلى نص عادي، دون اتصال بالإنترنت.",
    tags: ["Base64", "ترميز", "فك ترميز", "تحويل"],
    seoTitle: "ترميز وفك ترميز Base64 — سريع وخاص",
    seoDescription: "رمّز النص إلى Base64 أو فك ترميز سلاسل Base64 إلى نص مقروء. يعمل بالكامل في متصفحك — لا شيء يُرسل إلى خادم.",
  },
  "uuid-generator": {
    title: "مولّد UUID",
    shortDescription: "أنشئ معرّفات UUID v4 عشوائية جاهزة للنسخ إلى شيفرتك.",
    tags: ["UUID", "GUID", "معرّف فريد", "v4"],
    seoTitle: "مولّد UUID v4 — إنشاء معرّفات عشوائية فريدة",
    seoDescription: "أنشئ معرّفات UUID v4 عشوائية بكميات كبيرة. انسخ معرّفاً واحداً أو قائمة كاملة — مجاناً وفورياً وداخل المتصفح.",
  },
  "regex-tester": {
    title: "مختبِر التعابير النمطية",
    shortDescription: "اختبر التعابير النمطية على نص تجريبي مع تمييز المطابقات مباشرة.",
    tags: ["regex", "تعبير نمطي", "نمط", "مطابقة", "اختبار"],
    seoTitle: "مختبِر التعابير النمطية — اختبر Regex مع المطابقات المباشرة",
    seoDescription: "اكتب تعبيراً نمطياً وشاهد المطابقات مميّزة مباشرة على نصك التجريبي. يدعم الرايات ومعاينة المجموعات، مجاناً في المتصفح.",
  },
  "url-encoder": {
    title: "مرمّز الروابط",
    shortDescription: "رمّز الروابط بترميز النسبة المئوية أو فك ترميزها إلى نص مقروء.",
    tags: ["رابط", "ترميز النسبة", "ترميز", "فك ترميز", "سلسلة الاستعلام"],
    seoTitle: "ترميز وفك ترميز الروابط — ترميز URL على الإنترنت",
    seoDescription: "رمّز الروابط وسلاسل الاستعلام أو فك ترميزها فوراً. أداة ترميز روابط مجانية، لا تغادر بياناتك متصفحك.",
  },
  "slug-generator": {
    title: "مولّد الروابط اللطيفة",
    shortDescription: "حوّل أي عنوان إلى رابط نظيف بأحرف صغيرة وشرطات.",
    tags: ["slug", "رابط", "رابط دائم", "صديق لمحركات البحث"],
    seoTitle: "مولّد Slug — حوّل العناوين إلى روابط صديقة لمحركات البحث",
    seoDescription: "حوّل أي عنوان أو جملة إلى رابط نظيف بأحرف صغيرة مفصولة بشرطات. يعالج علامات الترقيم والأحرف الخاصة تلقائياً.",
  },
  "meta-tag-generator": {
    title: "مولّد وسوم Meta",
    shortDescription: "املأ نموذجاً واحصل على وسوم العنوان والوصف وOpen Graph جاهزة للنسخ.",
    tags: ["وسوم meta", "Open Graph", "وسم العنوان", "الوصف", "رأس HTML"],
    seoTitle: "مولّد وسوم Meta — العنوان والوصف وOpen Graph",
    seoDescription: "أنشئ وسوم HTML جاهزة للّصق: العنوان والوصف وOpen Graph وبطاقات تويتر. عاين شكل صفحتك في نتائج البحث والمشاركات.",
  },
  "keyword-density-checker": {
    title: "مدقّق كثافة الكلمات المفتاحية",
    shortDescription: "الصق نصاً لترى تكرار كل كلمة ونسبتها من الإجمالي.",
    tags: ["كثافة الكلمات", "تكرار الكلمات", "تحليل المحتوى", "تدقيق SEO"],
    seoTitle: "مدقّق كثافة الكلمات المفتاحية — تحليل تكرار الكلمات",
    seoDescription: "تحقّق من كثافة الكلمات المفتاحية في أي نص: شاهد العدد والنسبة لكل كلمة وعبارة. تحليل SEO مجاني داخل متصفحك.",
  },
  "social-character-counter": {
    title: "عدّاد أحرف وسائل التواصل",
    shortDescription: "عدّ الأحرف مباشرة مقابل حدود X وإنستغرام ولينكدإن وتيك توك.",
    tags: ["حد الأحرف", "تويتر", "إنستغرام", "لينكدإن", "طول المنشور"],
    seoTitle: "عدّاد أحرف وسائل التواصل — حدود X وإنستغرام ولينكدإن",
    seoDescription: "اكتب منشوراً وشاهد عدد الأحرف مباشرة مقابل حدود X وإنستغرام ولينكدإن وتيك توك. لن يُقتطع منشورك بعد الآن.",
  },
  "hashtag-generator": {
    title: "مولّد الوسوم",
    shortDescription: "حوّل الكلمات المفتاحية إلى مجموعات وسوم منسّقة وجاهزة للنسخ.",
    tags: ["هاشتاق", "وسوم", "إنستغرام", "انتشار"],
    seoTitle: "مولّد الهاشتاق — أنشئ مجموعات وسوم نظيفة من كلماتك",
    seoDescription: "الصق كلمات مفتاحية واحصل على مجموعة وسوم نظيفة بلا تكرار، منسّقة لإنستغرام وX وتيك توك. انسخ الكتلة كاملة بنقرة.",
  },
  "utm-link-builder": {
    title: "منشئ روابط UTM",
    shortDescription: "أنشئ روابط حملات بمعاملات UTM وتحقّق منها قبل المشاركة.",
    tags: ["UTM", "حملة", "رابط تتبّع", "تحليلات", "تسويق"],
    seoTitle: "منشئ روابط UTM — أنشئ روابط حملات قابلة للتتبّع",
    seoDescription: "أنشئ روابط حملات بمعاملات utm_source وutm_medium وutm_campaign. مُتحقّق منها ومرمّزة وجاهزة للّصق في منشوراتك وإعلاناتك.",
  },
  "image-to-base64": {
    title: "تحويل الصور إلى Base64",
    shortDescription: "حوّل ملف صورة إلى Base64 دون رفعه إلى أي مكان.",
    tags: ["صورة", "Base64", "data URI", "تضمين", "تحويل"],
    seoTitle: "تحويل الصور إلى Base64 — بلا رفع للملفات",
    seoDescription: "حوّل صور PNG أو JPG أو SVG إلى Base64 مباشرة في متصفحك. ملفك لا يغادر جهازك أبداً — خصوصية بالتصميم.",
  },
  "color-palette-extractor": {
    title: "مستخرج لوحة الألوان",
    shortDescription: "أدرج صورة واستخرج ألوانها السائدة بصيغة hex.",
    tags: ["ألوان", "لوحة ألوان", "hex", "تصميم", "استخراج"],
    seoTitle: "مستخرج لوحة الألوان — استخرج ألوان hex من أي صورة",
    seoDescription: "استخرج الألوان السائدة من أي صورة بصيغة hex جاهزة للنسخ. المعالجة تتم محلياً في متصفحك — بلا رفع وبلا حساب.",
  },
  "qr-code-generator": {
    title: "مولّد رمز QR",
    shortDescription: "أنشئ رموز QR للروابط والنصوص والبريد والهاتف والرسائل وشبكات الواي فاي.",
    tags: ["رمز QR", "واي فاي QR", "رابط إلى QR", "PNG", "مسح", "مولّد"],
    seoTitle: "مولّد رمز QR — روابط وواي فاي وبريد ونصوص (مجاناً)",
    seoDescription: "أنشئ رموز QR للروابط والنصوص والبريد الإلكتروني والهاتف والرسائل وبيانات الواي فاي. اختر الحجم ومستوى تصحيح الأخطاء ونزّل صورة PNG واضحة — مجاناً وداخل المتصفح.",
  },
  "image-compressor": {
    title: "ضاغط الصور",
    shortDescription: "صغّر ملفات JPEG وPNG وWebP داخل متصفحك — بلا رفع للملفات.",
    tags: ["ضغط", "JPEG", "PNG", "WebP", "تصغير الحجم", "تحسين", "دفعات"],
    seoTitle: "ضاغط الصور — صغّر JPEG وPNG وWebP (بخصوصية تامة)",
    seoDescription: "اضغط صور JPEG وPNG وWebP مع معاينة مباشرة للجودة وتنزيل دفعة كاملة بصيغة ZIP. يعمل بالكامل في متصفحك — صورك لا تغادر جهازك.",
  },
  "pomodoro-timer": {
    title: "مؤقّت بومودورو",
    shortDescription: "حافظ على تركيزك بفترات عمل واستراحة قابلة للتخصيص داخل التبويب.",
    tags: ["بومودورو", "تركيز", "مؤقّت", "جلسات عمل", "استراحات"],
    seoTitle: "مؤقّت بومودورو — جلسات تركيز داخل متصفحك",
    seoDescription: "مؤقّت بومودورو أنيق وقابل للتخصيص بفترات عمل واستراحة وتنبيهات لطيفة. حافظ على تركيزك دون تثبيت أي شيء.",
  },
  "password-generator": {
    title: "مولّد كلمات المرور",
    shortDescription: "أنشئ كلمات مرور قوية عشوائية بطول ومجموعة أحرف مخصصة.",
    tags: ["كلمة مرور", "عشوائي", "آمن", "مولّد", "قوة"],
    seoTitle: "مولّد كلمات مرور قوية — عشوائي وآمن داخل المتصفح",
    seoDescription: "أنشئ كلمات مرور قوية عشوائية بطول ورموز وأرقام مخصصة. تُنشأ محلياً عبر Web Crypto API — لا تُرسل إلى أي مكان.",
  },
  "unit-converter": {
    title: "محوّل الوحدات",
    shortDescription: "حوّل وحدات الطول والوزن والحرارة والبيانات بنتائج فورية.",
    tags: ["وحدات", "تحويل", "متري", "إمبراطوري", "حرارة"],
    seoTitle: "محوّل الوحدات — الطول والوزن والحرارة والبيانات",
    seoDescription: "حوّل بين الوحدات المترية والإمبراطورية للطول والوزن ودرجة الحرارة وأحجام البيانات. فوري ودقيق ومجاني داخل متصفحك.",
  },
  "pdf-merge": {
    title: "دمج ملفات PDF",
    shortDescription: "ادمج عدة ملفات PDF في ملف واحد بالترتيب الذي تختاره — داخل متصفحك بالكامل.",
    tags: ["PDF", "دمج", "ضم", "توحيد", "مستندات"],
    seoTitle: "دمج ملفات PDF — اجمع ملفات PDF بخصوصية تامة (مجاناً)",
    seoDescription: "ادمج عدة ملفات PDF في مستند واحد، وأعد ترتيب الملفات، ونزّل النتيجة فوراً. يعمل بالكامل في متصفحك — بلا رفع وبلا حسابات.",
  },
  "pdf-split": {
    title: "تقسيم ملفات PDF",
    shortDescription: "استخرج صفحات أو نطاقات أو قسّم ملف PDF إلى أجزاء — مع معاينة مرئية للصفحات.",
    tags: ["PDF", "تقسيم", "استخراج صفحات", "فصل", "نطاق صفحات"],
    seoTitle: "تقسيم PDF — استخرج الصفحات والنطاقات بخصوصية (مجاناً)",
    seoDescription: "قسّم ملف PDF حسب نطاقات الصفحات أو صفحات مفردة أو كل صفحة أو كل N صفحة — مع صور مصغّرة لاختيار الصفحات. داخل المتصفح بالكامل، بلا رفع.",
  },
  "pdf-compressor": {
    title: "ضاغط ملفات PDF",
    shortDescription: "صغّر ملفات PDF بإعادة ضغط الصور المضمّنة — مع بقاء النص واضحاً وقابلاً للتحديد.",
    tags: ["PDF", "ضغط", "تصغير الحجم", "تقليص", "تحسين"],
    seoTitle: "ضغط PDF — قلّل حجم ملفات PDF بخصوصية تامة (مجاناً)",
    seoDescription: "اضغط ملفات PDF في متصفحك: أعد ضغط الصور المضمّنة واحذف البيانات الوصفية وحسّن البنية مع بقاء النص قابلاً للتحديد. لا يتم رفع أي ملف.",
  },
};

const arCategories: Record<string, CategoryContent> = {
  "text": { title: "النصوص", description: "عدّ وحوّل ونظّف وأنشئ النصوص — أدوات كتابة يومية تعمل فوراً في متصفحك." },
  "developer": { title: "المطوّرون", description: "نسّق ورمّز وأنشئ واختبر — أدوات صغيرة توفّر على المطورين كتابة سكربتات مؤقتة." },
  "seo": { title: "تحسين محركات البحث", description: "روابط لطيفة ووسوم meta وفحص الكلمات المفتاحية — أدوات سريعة تجعل صفحاتك أسهل في الاكتشاف." },
  "social-media": { title: "وسائل التواصل", description: "حدود الأحرف والوسوم وروابط الحملات — أدوات للنشر بذكاء عبر المنصات." },
  "image": { title: "الصور", description: "حوّل وافحص الصور دون رفعها إلى أي مكان — كل شيء يعمل محلياً في متصفحك." },
  "productivity": { title: "الإنتاجية", description: "مؤقّتات ومولّدات ومحوّلات للمهام الصغيرة التي تقاطع يومك." },
};

/**
 * A tool with its text localized. Structure (slug, category, icon, dates,
 * collections) is untouched — only the human-readable fields change.
 */
export function localizeTool(tool: Tool, locale: Locale): Tool {
  if (locale === "en") return tool;
  const content = arTools[tool.slug];
  if (!content) return tool; // fall back to English
  return { ...tool, ...content };
}

export function localizeTools(tools: Tool[], locale: Locale): Tool[] {
  return locale === "en" ? tools : tools.map((tool) => localizeTool(tool, locale));
}

export function localizeCategory(
  category: ToolCategory,
  locale: Locale,
): ToolCategory {
  if (locale === "en") return category;
  const content = arCategories[category.slug];
  return content ? { ...category, ...content } : category;
}

export function localizeCategories(
  categories: ToolCategory[],
  locale: Locale,
): ToolCategory[] {
  return locale === "en"
    ? categories
    : categories.map((category) => localizeCategory(category, locale));
}

/** Arabic search keywords merged with the English ones, so a query in
 *  either language matches — see hooks/use-tool-search.ts. */
export function searchTermsFor(slug: string): string[] {
  const content = arTools[slug];
  if (!content) return [];
  return [content.title, content.shortDescription, ...content.tags];
}

export function getCategorySlugs(): CategorySlug[] {
  return Object.keys(arCategories) as CategorySlug[];
}
