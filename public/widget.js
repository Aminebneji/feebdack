(function() {
  const SCRIPT_ID = 'feebdack-widget-script';
  const script = document.currentScript || document.getElementById(SCRIPT_ID);
  const SITE_KEY = script ? script.getAttribute('data-site-key') : null;
  // Dynamic API URL based on where the unknown script is hosted
  const getApiUrl = () => {
    if (!script) return 'http://localhost:3000/api/feedbacks';
    try {
      const scriptUrl = new URL(script.src);
      return `${scriptUrl.origin}/api/feedbacks`;
    } catch (e) {
      return 'http://localhost:3000/api/feedbacks';
    }
  };

  const getAssetsUrl = () => {
    if (!script) return 'http://localhost:3000';
    try {
       const scriptUrl = new URL(script.src);
       return scriptUrl.origin;
    } catch (e) {
       return 'http://localhost:3000';
    }
  }

  const API_URL = getApiUrl();
  const ASSETS_URL = getAssetsUrl();
  
  if (!SITE_KEY) {
    console.error('Feebdack: Missing data-site-key attribute');
    return;
  }

  // Inject Styles
  const styles = `
    #feebdack-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #feebdack-button {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: #164C3A;
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(22, 76, 58, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #feebdack-button:hover {
      transform: scale(1.05) translateY(-2px);
      background: #0d2e23;
      box-shadow: 0 6px 16px rgba(22, 76, 58, 0.4);
    }
    #feebdack-modal {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 320px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
      border: 1px solid #e2e8f0;
      overflow: hidden;
      display: none;
      flex-direction: column;
      animation: feebdack-slide-up 0.3s ease-out;
    }
    @keyframes feebdack-slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .feebdack-header {
      padding: 20px;
      background: #164C3A;
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .feebdack-header h3 { margin: 0; font-size: 16px; font-weight: 700; }
    .feebdack-header p { margin: 4px 0 0; font-size: 12px; opacity: 0.8; }
    .feebdack-body { padding: 20px; }
    .feebdack-field { margin-bottom: 16px; }
    .feebdack-field label { display: block; font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 6px; }
    .feebdack-input {
      width: 100%;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .feebdack-input:focus { border-color: #164C3A; }
    .feebdack-submit {
      width: 100%;
      padding: 12px;
      background: #164C3A;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .feebdack-submit:hover { background: #0d2e23; }
    .feebdack-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .feebdack-success {
      display: none;
      text-align: center;
      padding: 40px 20px;
    }
    .feebdack-success-icon {
      width: 48px;
      height: 48px;
      background: #dcfce7;
      color: #166534;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 24px;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Create Container
  const container = document.createElement('div');
  container.id = 'feebdack-widget-container';
  container.innerHTML = `
    <button id="feebdack-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </button>
    <div id="feebdack-modal">
      <div id="feebdack-form-view">
        <div class="feebdack-header" href="https://feebdack-phi.vercel.app/">
          <img src="${ASSETS_URL}/assets/bdicon.png" style="width: 32px; height: 32px; object-fit: contain;">
          <div>
            <h3 style="margin-left: 15px;">Laissez un feedback</h3>
          </div>
        </div>
        <div class="feebdack-body">
          <div class="feebdack-field">
            <label>NOM</label>
            <input type="text" id="feebdack-name" class="feebdack-input" placeholder="Votre nom">
          </div>
          <div class="feebdack-field">
            <label>FONCTIONNALITÉ</label>
            <input type="text" id="feebdack-feature" class="feebdack-input" placeholder="Ex: Design, UX/UI, Performance ...">
          </div>
          <div class="feebdack-field">
            <label>FEEDBACK</label>
            <textarea id="feebdack-content" class="feebdack-input" rows="4" placeholder="Dites-nous tout..."></textarea>
          </div>
          <button id="feebdack-submit-btn" class="feebdack-submit">Envoyer</button>
        </div>
      </div>
      <div id="feebdack-success-view" class="feebdack-success">
        <div class="feebdack-success-icon">✓</div>
        <h4 style="margin: 0 0 8px; color: #0f172a;">Merci !</h4>
        <p style="margin: 0; font-size: 14px; color: #64748b;">Votre feedback a bien été reçu.</p>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // Logic
  const button = document.getElementById('feebdack-button');
  const modal = document.getElementById('feebdack-modal');
  const submitBtn = document.getElementById('feebdack-submit-btn');
  const formView = document.getElementById('feebdack-form-view');
  const successView = document.getElementById('feebdack-success-view');

  button.addEventListener('click', () => {
    const isVisible = modal.style.display === 'flex';
    modal.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
      formView.style.display = 'block';
      successView.style.display = 'none';
    }
  });

  submitBtn.addEventListener('click', async () => {
    const name = document.getElementById('feebdack-name').value;
    const feature = document.getElementById('feebdack-feature').value;
    const feedback = document.getElementById('feebdack-content').value;

    if (!name || !feature || !feedback) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = 'Envoi...';

    try {
      const payload = { siteKey: SITE_KEY, name, feature, content: feedback };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        formView.style.display = 'none';
        successView.style.display = 'block';
        setTimeout(() => {
          modal.style.display = 'none';
        }, 3000);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
      submitBtn.disabled = false;
      submitBtn.innerText = 'Envoyer';
    }
  });
})();
