(function() {
  const SCRIPT_ID = 'feebdack-widget-script';
  const script = document.currentScript || document.getElementById(SCRIPT_ID);
  const SITE_KEY = script ? script.getAttribute('data-site-key') : null;
  // API URL dynamique basée sur l'URL du script
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
  const CONFIG_URL = `${API_URL.replace('/feedbacks', '/public/config')}?siteKey=${SITE_KEY}`;
  
  // Default color
  let config = {
      brandColor: "#164C3A"
  };

  const fetchConfig = async () => {
      try {
          const res = await fetch(CONFIG_URL);
          if (res.ok) {
              const data = await res.json();
              if (data.brandColor) config.brandColor = data.brandColor;
          }
      } catch (error) {
          console.error("Feebdack config error", error);
      }
  };
  
  if (!SITE_KEY) {
    console.error('Feebdack: Missing data-site-key attribute');
    return;
  }

  const styles = `
    :host {
      all: initial;
    }
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
      background: var(--brand-color, #164C3A);
      color: var(--text-color, white);
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
      filter: brightness(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
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
      background: var(--brand-color, #164C3A);
      color: var(--text-color, white);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .feebdack-header a {
      display: flex;
      align-items: center;
      transition: opacity 0.2s ease;
    }
    .feebdack-header a:hover {
      opacity: 0.8;
    }
    .feebdack-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: var(--text-color, white) !important; }
    .feebdack-header p { margin: 4px 0 0; font-size: 12px; opacity: 0.8; color: var(--text-color, white) !important; }
    .feebdack-body { padding: 20px; background: white; }
    .feebdack-field { margin-bottom: 16px; }
    .feebdack-field label { display: block; font-size: 12px; font-weight: 600; color: #64748b !important; margin-bottom: 6px; text-transform: uppercase; }
    .feebdack-input {
      width: 100%;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background-color: white !important;
      color: #0f172a !important;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
      font-family: inherit;
    }
    .feebdack-input::placeholder {
      color: #94a3b8 !important;
      opacity: 1;
    }
    .feebdack-input:focus { border-color: var(--brand-color, #164C3A); }
    .feebdack-submit {
      width: 100%;
      padding: 12px;
      background: var(--brand-color, #164C3A);
      color: white !important;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      font-family: inherit;
    }
    .feebdack-submit:hover { filter: brightness(1.1); }
    .feebdack-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .feebdack-success {
      display: none;
      text-align: center;
      padding: 40px 20px;
      background: white;
    }
    .feebdack-success h4 { margin: 0 0 8px; color: #0f172a !important; }
    .feebdack-success p { margin: 0; font-size: 14px; color: #64748b !important; }
       height: 48px;
       background: #f8fafc;
       color: var(--brand-color, #164C3A) !important;
       border-radius: 50%;
       display: flex;
       align-items: center;
       justify-content: center;
       margin: 0 auto 16px;
       font-size: 24px;
     }
  `;

  // Container avec Shadow DOM
  const container = document.createElement('div');
  container.id = 'feebdack-widget-root';
  const shadow = container.attachShadow({ mode: 'open' });

  // Styles dans Shadow DOM
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  shadow.appendChild(styleSheet);

  const widgetContent = document.createElement('div');
  widgetContent.id = 'feebdack-widget-container';
  widgetContent.innerHTML = `
    <button id="feebdack-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </button>
    <div id="feebdack-modal">
      <div id="feebdack-form-view">
        <div class="feebdack-header">
          <a target="_blank" href="https://feebdack-phi.vercel.app/" title="Visiter Feebdack">
            <img src="${ASSETS_URL}/assets/bdicon.png" style="width: 32px; height: 32px; object-fit: contain; cursor: pointer;">
          </a>
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
        <h4>Merci !</h4>
        <p>Votre feedback a bien été reçu.</p>
      </div>
    </div>
  `;
  shadow.appendChild(widgetContent);
  document.body.appendChild(container);

  // Logique
  const button = shadow.getElementById('feebdack-button');
  const modal = shadow.getElementById('feebdack-modal');
  const submitBtn = shadow.getElementById('feebdack-submit-btn');
  const formView = shadow.getElementById('feebdack-form-view');
  const successView = shadow.getElementById('feebdack-success-view');

  const resetForm = () => {
    shadow.getElementById('feebdack-name').value = '';
    shadow.getElementById('feebdack-feature').value = '';
    shadow.getElementById('feebdack-content').value = '';
    submitBtn.disabled = false;
    submitBtn.innerText = 'Envoyer';
    formView.style.display = 'block';
    successView.style.display = 'none';
  };

  document.addEventListener('click', (event) => {
    if (modal.style.display === 'flex' && !container.contains(event.target)) {
      modal.style.display = 'none';
    }
  });

  button.addEventListener('click', () => {
    const isVisible = modal.style.display === 'flex';
    modal.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
      formView.style.display = 'block';
      successView.style.display = 'none';
    }
  });

  submitBtn.addEventListener('click', async () => {
    const name = shadow.getElementById('feebdack-name').value;
    const feature = shadow.getElementById('feebdack-feature').value;
    const feedback = shadow.getElementById('feebdack-content').value;

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
          resetForm();
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
  
  const getContrast = (color) => {
    let r, g, b;
    
    if (color.startsWith('#')) {
        const hex = color.replace("#", "");
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
    } else if (color.startsWith('rgb')) {
        const values = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',');
        r = parseInt(values[0]);
        g = parseInt(values[1]);
        b = parseInt(values[2]);
    } else {
        return 'white';
    }

    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }
  
  const init = async () => {
      await fetchConfig();
      const textColor = getContrast(config.brandColor);
      container.style.setProperty('--brand-color', config.brandColor);
      container.style.setProperty('--text-color', textColor);
  };

  init();

})();
