// i dont get paid enough for this
class ScriptFlowOptions {
    constructor() {
        this.defaultSettings = {
            executionTimeout: 10,
            updateFrequency: 'weekly',
            enableLogging: false,
            autoInject: true,
            editorFontSize: 14,
            tabSize: 4,
            wordWrap: true,
            autoSave: true,
            confirmExecution: false,
            blockUnsafeScripts: true,
            allowedDomains: '',
            sandboxMode: false
        };
        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('advancedToggle').addEventListener('click', () => {
            const advancedOptions = document.getElementById('advancedSecurity');
            advancedOptions.classList.toggle('show');
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('resetFormBtn').addEventListener('click', () => {
            this.resetForm();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetSettings();
        });

        document.getElementById('chooseFileBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.importData(e);
        });

        const dropArea = document.getElementById('dropArea');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
        });

        dropArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.importDataFromFile(files[0]);
            }
        }, false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    async loadSettings() {
        try {
            const stored = await chrome.storage.sync.get(Object.keys(this.defaultSettings));

            Object.keys(this.defaultSettings).forEach(key => {
                const value = stored[key] !== undefined ? stored[key] : this.defaultSettings[key];
                const element = document.getElementById(key);

                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = value;
                    } else {
                        element.value = value;
                    }
                }
            });
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.showStatus('Failed to load settings', 'error');
        }
    }

    async loadStats() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getScripts'
            });
            const scripts = response.scripts || [];

            const totalScripts = scripts.length;
            const enabledScripts = scripts.filter(s => s.enabled).length;
            const totalExecutions = await this.getTotalExecutions();
            const storageUsed = await this.getStorageUsed();

            document.getElementById('totalScripts').textContent = totalScripts;
            document.getElementById('enabledScripts').textContent = enabledScripts;
            document.getElementById('totalExecutions').textContent = totalExecutions;
            document.getElementById('storageUsed').textContent = this.formatBytes(storageUsed);
        } catch (error) {
            console.error('Failed to load statistics:', error);
        }
    }

    async getTotalExecutions() {
        try {
            const result = await chrome.storage.local.get(['totalExecutions']);
            return result.totalExecutions || 0;
        } catch (error) {
            return 0;
        }
    }

    async getStorageUsed() {
        try {
            const result = await chrome.storage.local.getBytesInUse();
            return result;
        } catch (error) {
            return 0;
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    async saveSettings() {
        try {
            const settings = {};

            Object.keys(this.defaultSettings).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        settings[key] = element.checked;
                    } else if (element.type === 'number') {
                        settings[key] = parseInt(element.value) || this.defaultSettings[key];
                    } else {
                        settings[key] = element.value;
                    }
                }
            });

            await chrome.storage.sync.set(settings);
            this.showStatus('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showStatus('Failed to save settings', 'error');
        }
    }

    resetForm() {
        Object.keys(this.defaultSettings).forEach(key => {
            const element = document.getElementById(key);
            const value = this.defaultSettings[key];

            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });

        this.showStatus('Form reset to defaults', 'success');
    }

    async resetSettings() {
        if (!confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
            return;
        }

        try {
            await chrome.storage.sync.clear();
            this.resetForm();
            this.showStatus('Settings reset to defaults', 'success');
        } catch (error) {
            console.error('Failed to reset settings:', error);
            this.showStatus('Failed to reset settings', 'error');
        }
    }

    async exportData() {
        try {
            const scriptsResponse = await chrome.runtime.sendMessage({
                action: 'getScripts'
            });
            const scripts = scriptsResponse.scripts || [];

            const settings = await chrome.storage.sync.get();

            const exportData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                scripts: scripts,
                settings: settings
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `scriptflow-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showStatus('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Failed to export data:', error);
            this.showStatus('Failed to export data', 'error');
        }
    }

    importData(event) {
        const file = event.target.files[0];
        if (file) {
            this.importDataFromFile(file);
        }
    }

    importDataFromFile(file) {
        if (!file.type === 'application/json' && !file.name.endsWith('.json')) {
            this.showStatus('Please select a valid JSON backup file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (!data.version || !data.scripts) {
                    this.showStatus('Invalid backup file format', 'error');
                    return;
                }

                if (!confirm(`This will import ${data.scripts.length} scripts. Continue?`)) {
                    return;
                }

                for (const script of data.scripts) {
                    await chrome.runtime.sendMessage({
                        action: 'saveScript',
                        script: script
                    });
                }

                if (data.settings) {
                    await chrome.storage.sync.set(data.settings);
                    await this.loadSettings();
                }

                await this.loadStats();
                this.showStatus(`Successfully imported ${data.scripts.length} scripts!`, 'success');
            } catch (error) {
                console.error('Failed to import data:', error);
                this.showStatus('Failed to import data: Invalid file format', 'error');
            }
        };

        reader.readAsText(file);
    }

    showStatus(message, type = 'success') {
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = message;
        statusElement.className = `status-message status-${type}`;
        statusElement.style.display = 'block';

        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScriptFlowOptions();
});