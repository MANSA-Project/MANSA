/**
 * @file ar.js
 * @description Arabic translation strings — primary language for MANSA.
 *
 * Direction: RTL
 * Usage: import { t } from '@config/i18n.js';  →  t('nav.home')
 *
 * Key naming convention: feature.component.action
 * e.g. 'auth.form.submit', 'quiz.result.retry'
 */

export default {
  // ─── App ───────────────────────────────────────────────────────────────────
  app: {
    name: 'MANSA',
    description: 'منصة تعليمية تفاعلية لطلاب الجامعات',
    tagline: 'ذاكر بذكاء، تفوق بثقة',
  },

  // ─── Common (reusable across all features) ──────────────────────────────────
  common: {
    loading: 'جاري التحميل...',
    error: 'حدث خطأ ما',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    confirm: 'تأكيد',
    close: 'إغلاق',
    retry: 'إعادة المحاولة',
    search: 'بحث...',
    filter: 'تصفية',
    submit: 'إرسال',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    yes: 'نعم',
    no: 'لا',
    notFound: 'الصفحة غير موجودة',
    comingSoon: 'قريباً',
    or: 'أو',
  },

  // ─── Navigation ─────────────────────────────────────────────────────────────
  nav: {
    home: 'الرئيسية',
    subjects: 'المواد',
    leaderboard: 'المتصدرون',
    challenge: 'تحدي',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    admin: 'لوحة التحكم',
  },

  // ─── Authentication ─────────────────────────────────────────────────────────
  auth: {
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب جديد',
    logout: 'تسجيل الخروج',
    forgotPassword: 'نسيت كلمة المرور؟',
    resetPassword: 'إعادة تعيين كلمة المرور',
    resetSent: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    username: 'اسم المستخدم',
    university: 'الجامعة',
    faculty: 'الكلية',
    year: 'السنة الدراسية',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    registerSuccess: 'تم إنشاء حسابك بنجاح. أهلاً بك!',
    logoutSuccess: 'تم تسجيل الخروج بنجاح',
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    emailTaken: 'البريد الإلكتروني مستخدم بالفعل',
    weakPassword: 'كلمة المرور ضعيفة جداً',
    passwordMismatch: 'كلمتا المرور غير متطابقتين',
    verifyEmail: 'يرجى تأكيد بريدك الإلكتروني قبل المتابعة',
    sessionExpired: 'انتهت جلستك. يرجى تسجيل الدخول مجدداً',
  },

  // ─── Subjects ───────────────────────────────────────────────────────────────
  subjects: {
    title: 'المواد الدراسية',
    subtitle: 'اختر مادة للبدء',
    questions: 'سؤال',
    challenges: 'تحديات',
    startQuiz: 'ابدأ التحدي',
    viewBank: 'بنك الأسئلة',
    noSubjects: 'لا توجد مواد متاحة حالياً',
  },

  // ─── Quiz / Challenge ────────────────────────────────────────────────────────
  quiz: {
    start: 'ابدأ التحدي',
    question: 'سؤال',
    of: 'من',
    timeLeft: 'الوقت المتبقي',
    submit: 'إرسال الإجابة',
    correct: 'إجابة صحيحة!',
    wrong: 'إجابة خاطئة',
    score: 'النتيجة',
    retry: 'حاول مجدداً',
    backToSubject: 'العودة للمادة',
    results: 'نتائج التحدي',
    mistakes: 'الأخطاء',
    noMistakes: 'ممتاز! لا أخطاء على الإطلاق',
    timesUp: 'انتهى الوقت!',
    accuracy: 'الدقة',
    timeTaken: 'الوقت المستغرق',
    outOf: 'من',
    loading: 'جاري تحميل الأسئلة...',
    noQuestions: 'لا توجد أسئلة متاحة لهذه المادة بعد',
  },

  // ─── Leaderboard ────────────────────────────────────────────────────────────
  leaderboard: {
    title: 'لوحة المتصدرين',
    rank: 'الترتيب',
    name: 'الاسم',
    points: 'النقاط',
    time: 'الوقت',
    empty: 'لا يوجد متصدرون بعد. كن الأول!',
    youAreRanked: 'ترتيبك الحالي',
    allSubjects: 'الكل',
    loading: 'جاري تحميل المتصدرين...',
  },

  // ─── AI Assistant ────────────────────────────────────────────────────────────
  ai: {
    title: 'المساعد الذكي',
    placeholder: 'اسأل أي سؤال دراسي...',
    send: 'إرسال',
    thinking: 'يفكر...',
    error: 'عذراً، لم أستطع الإجابة الآن. حاول مرة أخرى.',
    disclaimer: '⚠ الإجابات مولّدة بالذكاء الاصطناعي — تحقق منها دائماً',
    clearChat: 'مسح المحادثة',
    newChat: 'محادثة جديدة',
  },

  // ─── User Profile ────────────────────────────────────────────────────────────
  profile: {
    title: 'الملف الشخصي',
    challenges: 'التحديات',
    bestScore: 'أعلى نتيجة',
    accuracy: 'الدقة',
    edit: 'تعديل الملف',
    history: 'السجل',
    noHistory: 'لم تُجرِ أي تحديات بعد. ابدأ الآن!',
    logout: 'تسجيل الخروج',
    memberSince: 'عضو منذ',
    totalPoints: 'مجموع النقاط',
  },

  // ─── Errors ─────────────────────────────────────────────────────────────────
  errors: {
    network: 'خطأ في الاتصال بالإنترنت. تحقق من الشبكة.',
    auth: 'يجب تسجيل الدخول أولاً للوصول لهذه الصفحة',
    forbidden: 'غير مصرح لك بهذا الإجراء',
    notFound: 'المحتوى الذي تبحث عنه غير موجود',
    generic: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    fileTooLarge: 'حجم الملف يتجاوز الحد المسموح به',
    invalidFile: 'نوع الملف غير مدعوم',
    timeout: 'انتهت مهلة الاتصال. حاول مرة أخرى.',
  },
};
