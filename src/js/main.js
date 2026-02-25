
console.log('⚡ MANSA App Starting...');

const renderApp = () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div style="font-family: system-ui, sans-serif; text-align: center; padding: 2rem;">
        <h1 style="color: #667eea;">MANSA</h1>
        <p>منصة تعليمية تفاعلية</p>
      </div>
    `;
  }
};

// Render immediately for FCP
renderApp();

// Initialize services asynchronously
(async () => {
  try {
    await import('@config/firebase.js');
    console.log('⚡ MANSA Services Initialized');
  } catch (error) {
    console.warn('⚡ MANSA Services Warning:', error.message);
    // App continues to run even if Firebase fails (e.g. missing keys in dev)
  }
})();
