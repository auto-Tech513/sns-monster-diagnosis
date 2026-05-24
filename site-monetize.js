(function () {
    const CONSENT_STORAGE_KEY = "sns_monster_cookie_consent";
    const UI = {
        ja: {
            adLabel: "スポンサーリンク",
            consentLabel: "Cookieと広告に関する設定",
            consentText: "利用状況の分析と広告表示のためにCookie等を使います。ニックネームや入力内容はGA4へ送信しません。",
            reject: "拒否",
            accept: "同意"
        },
        en: {
            adLabel: "Sponsored",
            consentLabel: "Cookie and advertising settings",
            consentText: "We use cookies and similar technologies for analytics and ads. Nicknames and typed answers are not sent to GA4.",
            reject: "Reject",
            accept: "Accept"
        },
        ko: {
            adLabel: "스폰서 링크",
            consentLabel: "쿠키 및 광고 설정",
            consentText: "이용 분석과 광고 표시를 위해 쿠키 등을 사용합니다. 닉네임과 입력 내용은 GA4로 보내지 않습니다.",
            reject: "거부",
            accept: "동의"
        },
        zh: {
            adLabel: "赞助链接",
            consentLabel: "Cookie和广告设置",
            consentText: "我们会为使用情况分析和广告显示使用Cookie等技术。昵称和输入内容不会发送到GA4。",
            reject: "拒绝",
            accept: "同意"
        }
    };

    function getConfig() {
        return window.SNS_MONSTER_CONFIG || {};
    }

    function hasConsent() {
        return localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted";
    }

    function currentUi() {
        const lang = (document.documentElement.lang || "ja").slice(0, 2);
        return UI[lang] || UI.ja;
    }

    function loadExternalScript(src, id, attrs) {
        return new Promise((resolve, reject) => {
            if (id && document.getElementById(id)) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            if (id) script.id = id;
            script.async = true;
            script.src = src;
            Object.entries(attrs || {}).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }

    function initGa4() {
        const { ga4MeasurementId } = getConfig();
        if (!hasConsent() || !ga4MeasurementId || window.__snsMonsterStaticGaReady) return;

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", ga4MeasurementId, {
            anonymize_ip: true,
            send_page_view: true
        });
        window.__snsMonsterStaticGaReady = true;

        loadExternalScript(
            `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`,
            "ga4-script"
        ).catch(err => console.warn("GA4 script load failed:", err));
    }

    function hideAds() {
        document.querySelectorAll(".js-ad-slot").forEach(slot => {
            slot.classList.remove("active");
            slot.innerHTML = `<span class="ad-label">${currentUi().adLabel}</span>`;
        });
    }

    function initAds() {
        const { enableAds, adsenseClientId, articleAdSlot, resultAdSlot } = getConfig();
        const adSlotId = articleAdSlot || resultAdSlot;
        const slots = document.querySelectorAll(".js-ad-slot");

        if (!hasConsent() || !enableAds || !adsenseClientId || !adSlotId || slots.length === 0) {
            hideAds();
            return;
        }

        slots.forEach(slot => {
            slot.classList.add("active");
            slot.innerHTML = `
                <span class="ad-label">${currentUi().adLabel}</span>
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${adsenseClientId}"
                     data-ad-slot="${adSlotId}"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            `;
        });

        loadExternalScript(
            `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClientId)}`,
            "adsense-script",
            { crossorigin: "anonymous" }
        ).then(() => {
            window.adsbygoogle = window.adsbygoogle || [];
            slots.forEach(() => window.adsbygoogle.push({}));
        }).catch(err => console.warn("AdSense script load failed:", err));
    }

    function ensureConsentBanner() {
        if (localStorage.getItem(CONSENT_STORAGE_KEY)) return;

        const banner = document.createElement("div");
        const ui = currentUi();
        banner.className = "consent-banner active";
        banner.setAttribute("role", "dialog");
        banner.setAttribute("aria-label", ui.consentLabel);
        banner.innerHTML = `
            <div>${ui.consentText}</div>
            <div class="consent-actions">
                <button type="button" class="consent-btn" data-consent="reject">${ui.reject}</button>
                <button type="button" class="consent-btn primary" data-consent="accept">${ui.accept}</button>
            </div>
        `;
        document.body.appendChild(banner);

        banner.addEventListener("click", event => {
            const action = event.target && event.target.getAttribute("data-consent");
            if (!action) return;
            localStorage.setItem(CONSENT_STORAGE_KEY, action === "accept" ? "accepted" : "rejected");
            banner.classList.remove("active");
            if (action === "accept") {
                initGa4();
                initAds();
            } else {
                hideAds();
            }
        });
    }

    function init() {
        ensureConsentBanner();
        initGa4();
        initAds();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
