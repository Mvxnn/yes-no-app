document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const input = document.getElementById('question-input');
    const switchEl = document.getElementById('oracle-switch');
    const sideYes = document.querySelector('.side-yes');
    const sideNo = document.querySelector('.side-no');

    // I18n Elements
    const langBtn = document.getElementById('lang-btn');
    const langIndicator = document.getElementById('lang-indicator');
    const hintText = document.getElementById('hint-text');
    const modalTitle = document.getElementById('modal-title');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const emptyHistoryMsg = document.getElementById('empty-history-msg');

    // History Elements
    const historyBtn = document.getElementById('history-btn');
    const historyModal = document.getElementById('history-modal');
    const closeHistoryBtn = document.getElementById('close-history-btn');
    const historyContainer = document.getElementById('history-list-container');
    const sendBtn = document.getElementById('explicit-send-btn');

    let isProcessing = false;

    // --- DICTIONARY ---
    const translations = {
        fr: {
            placeholder: "Posez votre question...",
            yes: "OUI",
            no: "NON",
            historyTitle: "Historique",
            emptyHistory: "Aucune question pour le moment.",
            clearHistory: "Effacer tout",
            confirmClear: "Tout effacer ?",
            hint: "Appuyez sur Entrée pour décider",
            langName: "FR",
            // Shop Modal
            shopTitle: "Boutique Oracle ⚡",
            tokens: "Jetons",
            nextRegenIn: "Prochaine recharge dans",
            full: "Plein ⚡",
            productRefillTitle: "Recharge Rapide",
            productRefillDesc: "+50 Jetons instantanés",
            productPremiumTitle: "Pass Illimité",
            productPremiumDesc: "Énergie infinie à vie",
            restorePurchases: "Restaurer les achats",
            // Alerts
            oracleTired: "L'Oracle est fatigué (0 Énergie). Ouvrir la boutique ?",
            purchaseRefill: "Paiement Simulé : +50 Jetons ! ⚡",
            purchasePremium: "Paiement Simulé : Mode Premium Activé ! ♾️",
            noPurchases: "Aucun achat trouvé sur ce compte simulé.",
            restoreSuccess: "Simulation : Compte réinitialisé (10 Jetons).",
            searching: "Recherche..."
        },
        en: {
            placeholder: "Ask your question...",
            yes: "YES",
            no: "NO",
            historyTitle: "History",
            emptyHistory: "No questions yet.",
            clearHistory: "Clear all",
            confirmClear: "Clear everything?",
            hint: "Press Enter to decide",
            langName: "EN",
            // Shop Modal
            shopTitle: "Oracle Shop ⚡",
            tokens: "Tokens",
            nextRegenIn: "Next recharge in",
            full: "Full ⚡",
            productRefillTitle: "Quick Refill",
            productRefillDesc: "+50 Instant Tokens",
            productPremiumTitle: "Unlimited Pass",
            productPremiumDesc: "Infinite energy forever",
            restorePurchases: "Restore Purchases",
            // Alerts
            oracleTired: "The Oracle is tired (0 Energy). Open shop?",
            purchaseRefill: "Mock Payment: +50 Tokens! ⚡",
            purchasePremium: "Mock Payment: Premium Mode Activated! ♾️",
            noPurchases: "No purchases found on this demo account.",
            restoreSuccess: "Simulation: Account reset (10 Tokens).",
            searching: "Searching..."
        },
        es: {
            placeholder: "Escribe tu pregunta...",
            yes: "SÍ",
            no: "NO",
            historyTitle: "Historial",
            emptyHistory: "Aún no hay preguntas.",
            clearHistory: "Borrar todo",
            confirmClear: "¿Borrar todo?",
            hint: "Presiona Enter para decidir",
            langName: "ES",
            // Shop Modal
            shopTitle: "Tienda Oráculo ⚡",
            tokens: "Fichas",
            nextRegenIn: "Próxima recarga en",
            full: "Lleno ⚡",
            productRefillTitle: "Recarga Rápida",
            productRefillDesc: "+50 Fichas instantáneas",
            productPremiumTitle: "Pase Ilimitado",
            productPremiumDesc: "Energía infinita de por vida",
            restorePurchases: "Restaurar Compras",
            // Alerts
            oracleTired: "El Oráculo está cansado (0 Energía). ¿Abrir tienda?",
            purchaseRefill: "Pago Simulado: ¡+50 Fichas! ⚡",
            purchasePremium: "Pago Simulado: ¡Modo Premium Activado! ♾️",
            noPurchases: "No se encontraron compras en esta cuenta demo.",
            restoreSuccess: "Simulación: Cuenta reiniciada (10 Fichas).",
            searching: "Buscando..."
        }
    };

    let currentLang = localStorage.getItem('yesno_lang') || 'fr';

    // --- I18n Logic ---
    function updateLanguage() {
        const t = translations[currentLang];

        // Update Static Text
        if (input) input.placeholder = t.placeholder;
        if (sideYes) sideYes.textContent = t.yes;
        if (sideNo) sideNo.textContent = t.no;
        if (modalTitle) modalTitle.textContent = t.historyTitle;
        if (clearHistoryBtn) clearHistoryBtn.textContent = t.clearHistory;
        if (hintText) hintText.textContent = t.hint;
        if (emptyHistoryMsg) emptyHistoryMsg.textContent = t.emptyHistory;
        if (langIndicator) langIndicator.textContent = t.langName;

        // Shop Modal Elements
        const shopTitle = document.querySelector('#shop-modal .modal-header h2');
        const tokensLabel = document.querySelector('.current-balance small');
        const regenTimerLabel = document.querySelector('.regen-timer small');
        const restoreBtn = document.getElementById('restore-btn');
        const refillTitle = document.querySelector('#prod-refill h3');
        const refillDesc = document.querySelector('#prod-refill p');
        const premiumTitle = document.querySelector('#prod-premium h3');
        const premiumDesc = document.querySelector('#prod-premium p');

        if (shopTitle) shopTitle.textContent = t.shopTitle;
        if (tokensLabel) tokensLabel.textContent = t.tokens;
        if (regenTimerLabel) regenTimerLabel.textContent = t.nextRegenIn;
        if (restoreBtn) restoreBtn.textContent = t.restorePurchases;
        if (refillTitle) refillTitle.textContent = t.productRefillTitle;
        if (refillDesc) refillDesc.textContent = t.productRefillDesc;
        if (premiumTitle) premiumTitle.textContent = t.productPremiumTitle;
        if (premiumDesc) premiumDesc.textContent = t.productPremiumDesc;

        // Update History Logic (Re-render to translate answers)
        renderHistory();

        localStorage.setItem('yesno_lang', currentLang);
    }

    function cycleLanguage() {
        if (currentLang === 'fr') currentLang = 'en';
        else if (currentLang === 'en') currentLang = 'es';
        else currentLang = 'fr';
        updateLanguage();
    }

    if (langBtn) {
        langBtn.addEventListener('click', cycleLanguage);
    }

    // --- Theme Logic (FORCED MINIMAL) ---
    function initTheme() {
        // We preserve specific code in case we want to revert, but we force 'minimal'
        document.body.setAttribute('data-theme', 'minimal');
    }
    initTheme();
    updateLanguage(); // Init Text

    // --- Interaction Input ---
    if (input) {
        input.addEventListener('input', () => {
            updateUIState();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!isProcessing && input.value.trim().length > 0) {
                    decideLimit();
                }
            }
        });
    }

    function updateUIState() {
        const hasText = input.value.trim().length > 0;
        if (sendBtn) {
            if (hasText) sendBtn.classList.add('visible');
            else sendBtn.classList.remove('visible');
        }

        if (hintText) {
            if (hasText) hintText.classList.add('visible');
            else hintText.classList.remove('visible');
        }
    }

    if (switchEl) {
        switchEl.addEventListener('click', () => {
            if (!isProcessing && input.value.trim().length > 0) {
                decideLimit();
            } else {
                if (input) input.focus();
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            if (!isProcessing && input.value.trim().length > 0) {
                decideLimit();
            }
        });
    }

    // --- History Logic ---
    if (historyBtn && historyModal) {
        historyBtn.addEventListener('click', openHistory);
        closeHistoryBtn.addEventListener('click', closeHistory);
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                const t = translations[currentLang];
                if (confirm(t.confirmClear)) {
                    localStorage.removeItem('yesno_history');
                    renderHistory();
                }
            });
        }

        historyModal.addEventListener('click', (e) => {
            if (e.target === historyModal) {
                closeHistory();
            }
        });
    }

    function openHistory() {
        renderHistory();
        historyModal.classList.remove('hidden');
    }

    function closeHistory() {
        historyModal.classList.add('hidden');
    }

    function saveToHistory(question, rawAnswer) {
        const history = JSON.parse(localStorage.getItem('yesno_history') || '[]');
        // We store RAW answer (YES/NO) to translate it at display time
        history.unshift({ question, answer: rawAnswer, date: new Date().toISOString() });
        if (history.length > 50) history.pop();
        localStorage.setItem('yesno_history', JSON.stringify(history));
    }

    function renderHistory() {
        if (!historyContainer) return;

        const history = JSON.parse(localStorage.getItem('yesno_history') || '[]');
        historyContainer.innerHTML = '';

        const t = translations[currentLang];

        if (history.length === 0) {
            historyContainer.innerHTML = `<p class="empty-state" id="empty-history-msg">${t.emptyHistory}</p>`;
            return;
        }

        history.forEach(item => {
            const elm = document.createElement('div');
            elm.className = 'history-card';

            // Translate the "YES"/"NO" raw value to current Lang
            const displayAnswer = item.answer === 'YES' ? t.yes : t.no;

            elm.innerHTML = `
                <div class="h-question">${escapeHtml(item.question)}</div>
                <div class="h-answer ${item.answer}">${displayAnswer}</div>
            `;
            historyContainer.appendChild(elm);
        });
    }

    // --- Energy Manager ---
    class EnergyManager {
        constructor() {
            this.maxEnergy = 10;
            this.regenRateMs = 60 * 60 * 1000; // 60 minutes
            this.data = this.loadData();
            this.calcRegen();
        }

        loadData() {
            const defaultData = {
                energy: 10,
                lastRegen: Date.now(),
                isPremium: false,
                inventory: []
            };
            const stored = localStorage.getItem('yesno_user_data');
            return stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
        }

        saveData() {
            localStorage.setItem('yesno_user_data', JSON.stringify(this.data));
            updateEnergyUI();
        }

        calcRegen() {
            if (this.data.isPremium) return;
            if (this.data.energy >= this.maxEnergy) {
                this.data.lastRegen = Date.now();
                return;
            }

            const now = Date.now();
            const elapsed = now - this.data.lastRegen;
            if (elapsed >= this.regenRateMs) {
                const gained = Math.floor(elapsed / this.regenRateMs);
                if (gained > 0) {
                    this.data.energy = Math.min(this.data.energy + gained, this.maxEnergy);
                    // Reset timer but keep remainder to be fair
                    const remainder = elapsed % this.regenRateMs;
                    this.data.lastRegen = now - remainder;
                    this.saveData();
                }
            }
        }

        consume() {
            if (this.data.isPremium) return true;
            this.calcRegen(); // Update before consuming
            if (this.data.energy > 0) {
                this.data.energy--;
                // If we were full, start the timer now
                if (this.data.energy === this.maxEnergy - 1) {
                    this.data.lastRegen = Date.now();
                }
                this.saveData();
                return true;
            }
            return false;
        }

        addEnergy(amount) {
            this.data.energy += amount;
            this.saveData();
        }

        unlockPremium() {
            this.data.isPremium = true;
            this.data.energy = 999; // Visual Symbol
            this.saveData();
        }

        resetToDefault() {
            this.data = {
                energy: 10,
                lastRegen: Date.now(),
                isPremium: false,
                inventory: []
            };
            this.saveData();
        }
    }

    const energyManager = new EnergyManager();

    function updateEnergyUI() {
        const energyCount = document.getElementById('energy-count');
        if (energyCount) {
            if (energyManager.data.isPremium) {
                energyCount.textContent = "∞";
            } else {
                energyCount.textContent = energyManager.data.energy;
            }
        }
    }

    // Initialize energy display on page load
    updateEnergyUI();

    // Timer Update Function
    function updateRegenTimer() {
        const timerDisplay = document.getElementById('timer-display');
        const timerContainer = document.getElementById('next-regen-timer');
        const homeTimer = document.getElementById('home-regen-timer');

        // If premium, hide timers
        if (energyManager.data.isPremium) {
            if (timerContainer) timerContainer.style.display = 'none';
            if (homeTimer) homeTimer.classList.add('hidden');
            return;
        }

        // If full energy, show "Full" or hide home timer
        if (energyManager.data.energy >= energyManager.maxEnergy) {
            if (timerDisplay) timerDisplay.textContent = "Plein ⚡";
            if (timerContainer) timerContainer.style.display = 'flex';
            if (homeTimer) homeTimer.classList.add('hidden');
            return;
        }

        if (!timerDisplay) return;

        // If premium, hide timer
        if (energyManager.data.isPremium) {
            if (timerContainer) timerContainer.style.display = 'none';
            return;
        }

        // If full energy, show "Full"
        if (energyManager.data.energy >= energyManager.maxEnergy) {
            timerDisplay.textContent = "Plein ⚡";
            if (timerContainer) timerContainer.style.display = 'flex';
            return;
        }

        // Calculate time remaining
        const now = Date.now();
        const elapsed = now - energyManager.data.lastRegen;
        const remaining = energyManager.regenRateMs - elapsed;

        if (remaining <= 0) {
            // Trigger regen check
            energyManager.calcRegen();
            updateEnergyUI();
            if (timerDisplay) timerDisplay.textContent = "Plein ⚡";
            if (homeTimer) homeTimer.classList.add('hidden');
            return;
        }

        // Format time
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timerDisplay) timerDisplay.textContent = timeString;
        if (homeTimer) {
            homeTimer.textContent = timeString;
            homeTimer.classList.remove('hidden');
        }

        if (timerContainer) timerContainer.style.display = 'flex';
    }

    // Update timer every second
    setInterval(() => {
        updateRegenTimer();
    }, 1000);

    // Initial timer update
    updateRegenTimer();


    // --- STORE MOCK SERVICE ---
    const shopBtn = document.getElementById('shop-btn');
    const shopModal = document.getElementById('shop-modal');
    const closeShopBtn = document.getElementById('close-shop-btn');
    const buyBtns = document.querySelectorAll('.buy-btn');
    const shopBalance = document.getElementById('shop-balance');
    const restoreBtn = document.getElementById('restore-btn');

    function openShop() {
        console.log('openShop() called');
        if (shopModal) {
            shopModal.classList.remove('hidden');
            if (shopBalance) shopBalance.textContent = energyManager.data.isPremium ? '∞' : energyManager.data.energy;
            updateRegenTimer(); // Refresh timer when opening
        }
    }

    function closeShop() {
        console.log('closeShop() called');
        if (shopModal) shopModal.classList.add('hidden');
    }

    console.log('Shop elements:', { shopBtn, shopModal, closeShopBtn });

    if (shopBtn) {
        console.log('Attaching click listener to shop button');
        shopBtn.addEventListener('click', (e) => {
            console.log('Shop button clicked!', e.target);
            openShop();
        });
    } else {
        console.error('Shop button not found in DOM!');
    }

    if (closeShopBtn) closeShopBtn.addEventListener('click', closeShop);
    if (shopModal) shopModal.addEventListener('click', (e) => {
        if (e.target === shopModal) closeShop();
    });

    if (restoreBtn) {
        restoreBtn.addEventListener('click', async () => {
            const t = translations[currentLang];
            const originalText = restoreBtn.textContent;
            restoreBtn.textContent = t.searching;
            await wait(1500);

            // Mock Success logic for Restore
            energyManager.resetToDefault();
            updateEnergyUI();
            if (shopBalance) shopBalance.textContent = energyManager.data.energy;

            alert(t.restoreSuccess);
            restoreBtn.textContent = originalText;
        });
    }

    buyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const productId = btn.getAttribute('data-id');
            const originalText = btn.textContent;
            const t = translations[currentLang];

            // Simulate Loading
            btn.textContent = "⏳";
            btn.disabled = true;

            await wait(1000); // Fake Network Request

            // Simulate Success
            if (productId === 'energy_refill_50') {
                energyManager.addEnergy(50);
                alert(t.purchaseRefill);
            } else if (productId === 'premium_unlock_lifetime') {
                energyManager.unlockPremium();
                alert(t.purchasePremium);
            }

            // Refresh UI
            updateEnergyUI();
            if (shopBalance) shopBalance.textContent = energyManager.data.isPremium ? '∞' : energyManager.data.energy;

            btn.textContent = "✔";
            await wait(500);
            btn.textContent = originalText;
            btn.disabled = false;
        });
    });


    // --- Core Logic ---

    async function decideLimit() {
        // Energy Check
        if (!energyManager.consume()) {
            // Show "Empty Energy" Popup
            const t = translations[currentLang];
            if (confirm(t.oracleTired)) {
                openShop();
            }
            return;
        }

        isProcessing = true;
        updateEnergyUI(); // Refresh count
        const qText = input.value.trim();
        input.blur();

        if (hintText) hintText.classList.remove('visible');
        if (sendBtn) sendBtn.classList.remove('visible');

        // 1. Thinking
        switchEl.classList.remove('active-YES', 'active-NO');
        switchEl.classList.add('thinking');

        const duration = 3000; // time
        const interval = setInterval(() => {
            // Just keeping opacity animation logic
        }, 100);
        // Note: Minimal theme uses CSS animation for thinking (bar scan), so JS interval is less critical for visuals but good for timing.

        await wait(duration);
        clearInterval(interval);

        switchEl.classList.remove('thinking');

        // 2. Decision
        const rawDecision = Math.random() > 0.5 ? 'YES' : 'NO';

        triggerHaptic(rawDecision === 'YES' ? [20, 50, 20] : [80]);

        if (rawDecision === 'YES') {
            switchEl.classList.add('active-YES');
        } else {
            switchEl.classList.add('active-NO');
        }

        // Save
        saveToHistory(qText, rawDecision);

        // 3. Reset
        await wait(2500);

        switchEl.classList.remove('active-YES', 'active-NO');
        input.value = '';
        isProcessing = false;
        updateUIState();
    }

    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    function triggerHaptic(pattern) {
        if (navigator.vibrate) navigator.vibrate(pattern);
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
