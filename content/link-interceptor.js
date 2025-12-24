(function() {
    // ignore the way i code, too lazy to recode current scriptflow to match my new coding style
    if (window.self !== window.top) return;

    function AttachInstallListeners() {
        const installLinks = document.querySelectorAll('a[href$=".user.js"]');

        installLinks.forEach(link => {
            if (link.dataset.sfAttached) return;
            link.dataset.sfAttached = "true";

            link.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const url = link.href;
                const originalText = link.textContent;

                if (!chrome.runtime?.id) {
                    alert("ScriptFlow: Extension context lost. Please refresh the page.");
                    return;
                }

                link.textContent = "Installing.";
                link.style.opacity = "0.7";

                try {
                    const response = await chrome.runtime.sendMessage({
                        action: 'installScriptRequest',
                        url: url
                    });

                    if (!response) {
                        throw new Error("No response from background script. Extension may need to be reloaded.");
                    }

                    if (response && response.success) {
                        link.textContent = "Installed";
                        link.style.backgroundColor = "#37b24d";
                        link.style.color = "white";
                    } else {
                        link.textContent = "Failed";
                        console.error("ScriptFlow Install Error:", response?.error);
                        alert("ScriptFlow: Installation failed. " + (response?.error || "Check console."));
                        setTimeout(() => {
                            link.textContent = originalText;
                        }, 2000);
                    }
                } catch (err) {
                    console.error("ScriptFlow Message Error:", err);
                    link.textContent = "Error";

                    if (err.message.includes("Extension context invalidated")) {
                        alert("ScriptFlow: Extension was reloaded. Please refresh this page and try again.");
                    } else if (err.message.includes("message port closed")) {
                        alert("ScriptFlow: Connection lost. Please refresh the page and try again.");
                    } else {
                        alert("ScriptFlow: " + err.message);
                    }

                    setTimeout(() => {
                        link.textContent = originalText;
                    }, 2000);
                }
            });
        });
    }

    AttachInstallListeners();

    const observer = new MutationObserver(AttachInstallListeners);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();