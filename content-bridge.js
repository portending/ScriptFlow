(async function() {
    'use strict';

    let shouldLog; 

    try {
        const result = await chrome.storage.sync.get(['debugLogging']);
        shouldLog = !!result.debugLogging;
    } catch (error) {
        console.error('[ScriptFlow Bridge] Failed to load initial debug setting:', error);
        shouldLog = false;
    }

    function log(message, ...args) {
        if (shouldLog) {
            console.log('[ScriptFlow Bridge]', message, ...args);
        }
    }

    log('Initialized - relay mode');

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && changes.debugLogging !== undefined) {
            shouldLog = !!changes.debugLogging.newValue;
            if (shouldLog) {
                 console.log('[ScriptFlow Bridge]', 'Debug logging dynamically enabled.');
            }
        }
    });
    
    window.addEventListener('message', async function(event) {
        if (event.source !== window) return;
        
        if (event.data && event.data.type === 'SF_FETCH_REQUEST') {
            const { requestId, url, method, headers, credentials, body } = event.data;
            
            log('Relaying to background:', url);
            
            try {
                const response = await chrome.runtime.sendMessage({
                    action: 'fetch',
                    url: url,
                    method: method || 'GET',
                    headers: headers || {},
                    credentials: credentials || 'include',
                    body: body
                });
                
                log('Response received from background:', {
                    status: response.status,
                    ok: response.ok,
                    hasBody: !!response.body,
                    bodyLength: response.body ? response.body.length : 0
                });
                
                const responseBody = response.body !== undefined && response.body !== null 
                    ? String(response.body) 
                    : '';
                
                window.postMessage({
                    type: 'SF_FETCH_RESPONSE',
                    requestId: requestId,
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers || {},
                    body: responseBody
                }, '*');
                
                log('Fetch success:', url, response.status);
            } catch (error) {
                log('Fetch failed:', url, error);
                window.postMessage({
                    type: 'SF_FETCH_RESPONSE',
                    requestId: requestId,
                    ok: false,
                    status: 0,
                    statusText: error.message || 'Unknown error',
                    error: error.message || 'Unknown error',
                    body: ''
                }, '*');
            }
        }
    });
})();