/**
 * @file en.js
 * @description English translation strings — secondary language for MANSA.
 *
 * Direction: LTR
 * Usage: import { t } from '@config/i18n.js';  →  t('nav.home')
 *
 * Key naming convention: feature.component.action
 * e.g. 'auth.form.submit', 'quiz.result.retry'
 *
 * NOTE: Keys must exactly mirror ar.js — if you add a key here, add it there too.
 */

export default {
  // ─── App ───────────────────────────────────────────────────────────────────
  app: {
    name: 'MANSA',
    description: 'Interactive educational platform for university students',
    tagline: 'Study smart, excel with confidence',
  },

  // ─── Common ─────────────────────────────────────────────────────────────────
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    close: 'Close',
    retry: 'Try again',
    search: 'Search...',
    filter: 'Filter',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    yes: 'Yes',
    no: 'No',
    notFound: 'Page not found',
    comingSoon: 'Coming soon',
    or: 'or',
  },

  // ─── Navigation ─────────────────────────────────────────────────────────────
  nav: {
    home: 'Home',
    subjects: 'Subjects',
    leaderboard: 'Leaderboard',
    challenge: 'Challenge',
    login: 'Login',
    register: 'Sign up',
    logout: 'Logout',
    profile: 'Profile',
    admin: 'Admin Panel',
  },

  // ─── Authentication ─────────────────────────────────────────────────────────
  auth: {
    login: 'Login',
    register: 'Create new account',
    logout: 'Logout',
    forgotPassword: 'Forgot your password?',
    resetPassword: 'Reset password',
    resetSent: 'A password reset link has been sent to your email',
    email: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm password',
    username: 'Username',
    university: 'University',
    faculty: 'Faculty',
    year: 'Academic year',
    loginSuccess: 'Logged in successfully',
    registerSuccess: 'Account created successfully. Welcome!',
    logoutSuccess: 'Logged out successfully',
    loginError: 'Incorrect email or password',
    emailTaken: 'This email address is already in use',
    weakPassword: 'Password is too weak',
    passwordMismatch: 'Passwords do not match',
    verifyEmail: 'Please verify your email address before continuing',
    sessionExpired: 'Your session has expired. Please log in again',
  },

  // ─── Subjects ───────────────────────────────────────────────────────────────
  subjects: {
    title: 'Subjects',
    subtitle: 'Choose a subject to get started',
    questions: 'question',
    challenges: 'challenges',
    startQuiz: 'Start challenge',
    viewBank: 'Question bank',
    noSubjects: 'No subjects available at the moment',
  },

  // ─── Quiz / Challenge ────────────────────────────────────────────────────────
  quiz: {
    start: 'Start challenge',
    question: 'Question',
    of: 'of',
    timeLeft: 'Time left',
    submit: 'Submit answer',
    correct: 'Correct!',
    wrong: 'Wrong answer',
    score: 'Score',
    retry: 'Try again',
    backToSubject: 'Back to subject',
    results: 'Challenge results',
    mistakes: 'Mistakes',
    noMistakes: 'Perfect! No mistakes at all',
    timesUp: "Time's up!",
    accuracy: 'Accuracy',
    timeTaken: 'Time taken',
    outOf: 'out of',
    loading: 'Loading questions...',
    noQuestions: 'No questions available for this subject yet',
  },

  // ─── Leaderboard ────────────────────────────────────────────────────────────
  leaderboard: {
    title: 'Leaderboard',
    rank: 'Rank',
    name: 'Name',
    points: 'Points',
    time: 'Time',
    empty: 'No entries yet. Be the first!',
    youAreRanked: 'Your current rank',
    allSubjects: 'All',
    loading: 'Loading leaderboard...',
  },

  // ─── AI Assistant ────────────────────────────────────────────────────────────
  ai: {
    title: 'AI Assistant',
    placeholder: 'Ask any study question...',
    send: 'Send',
    thinking: 'Thinking...',
    error: 'Sorry, I could not answer right now. Please try again.',
    disclaimer: '⚠ Answers are AI-generated — always verify them',
    clearChat: 'Clear chat',
    newChat: 'New conversation',
  },

  // ─── User Profile ────────────────────────────────────────────────────────────
  profile: {
    title: 'My Profile',
    challenges: 'Challenges',
    bestScore: 'Best score',
    accuracy: 'Accuracy',
    edit: 'Edit profile',
    history: 'History',
    noHistory: 'You have not completed any challenges yet. Start now!',
    logout: 'Logout',
    memberSince: 'Member since',
    totalPoints: 'Total points',
  },

  // ─── Errors ─────────────────────────────────────────────────────────────────
  errors: {
    network: 'Network error. Please check your internet connection.',
    auth: 'You must be logged in to access this page',
    forbidden: 'You are not authorized to perform this action',
    notFound: 'The content you are looking for does not exist',
    generic: 'An unexpected error occurred. Please try again.',
    fileTooLarge: 'File size exceeds the allowed limit',
    invalidFile: 'File type is not supported',
    timeout: 'Connection timed out. Please try again.',
  },
};
