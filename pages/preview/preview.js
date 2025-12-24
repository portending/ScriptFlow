let previewFrame = document.getElementById('live-preview');
if (!previewFrame) {
  previewFrame = document.createElement('iframe');
  previewFrame.id = 'live-preview';

  Object.assign(previewFrame.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    border: '0',
    margin: '0',
    padding: '0',
    zIndex: '9999',
    background: '#fff',
  });

  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  document.body.style.margin = '0';
  document.body.appendChild(previewFrame);
}


window.addEventListener('message', event => {
  if (event.data && typeof event.data === 'object' && event.data.type === 'clear') {
    
    if (previewFrame && previewFrame.parentNode) {
      previewFrame.parentNode.removeChild(previewFrame);
    }
    
    previewFrame = document.createElement('iframe');
    previewFrame.id = 'live-preview';
    
    Object.assign(previewFrame.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      border: '0',
      margin: '0',
      padding: '0',
      zIndex: '9999',
      background: '#fff',
    });
    
    document.body.appendChild(previewFrame);
    return;
  }
  
  if (!event.data || typeof event.data !== 'string') return;
  
  console.log('[Preview.js] Received HTML content, length:', event.data.length);
  
  if (/<script[^>]+src=/i.test(event.data)) {
    const matches = event.data.match(/<script[^>]+src=[^>]+>/gi);
  }

  previewFrame.srcdoc = event.data;
}, false);