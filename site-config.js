window.SNS_MONSTER_CONFIG = {
    siteUrl: "https://sns-monster-diagnosis.pages.dev",
    // GA4 Measurement ID (例: G-XXXXXXXXXX)。公開IDなので秘密情報は入れない。
    ga4MeasurementId: "G-HRTJGYRZLF",
    // AdSense の公開クライアントID/広告枠ID。審査・承認後に設定する。
    adsenseClientId: "",
    resultAdSlot: "",
    articleAdSlot: "",
    // true にすると、同意後に結果画面だけ広告枠を表示する。
    enableAds: false,
    // 永久保存（フェーズ1）
    enablePaidPremium: true,
    stripePermanentSaveUrl: "https://buy.stripe.com/fZuaEQ7De0Gv4la4F68AE00",
    permanentSavePrice: 120,
    // 相性診断（フェーズ2・後で実装）
    enableCompatibilityFeature: true,
    stripeCompatibilityUrl: "https://buy.stripe.com/cNi7sE9Lm9d104U6Ne8AE01",
    compatibilityPrice: 360,
    // 決済導線を用意するまでは公開版でロックを出さない。
    enablePremiumLock: false
};
