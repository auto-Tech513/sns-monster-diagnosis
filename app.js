/**
 * SNS承認欲求モンスター診断
 * 
 * システム制御・4大脳汁ASMRギミック（iOS AudioContext絶対防御・feTurbulenceグリッチ・3D Parallax・html2canvasフォント補償エクスポート）・Ollama連携・時限消滅・年齢フォーム・完全多言語化(JA, EN, KO, ZH)
 */

(function () {
    'use strict';

    const COUNTDOWN_SECONDS = 60;

    // ==========================================
    // 1. アプリケーション状態管理 (State)
    // ==========================================
    const state = {
        username: '',
        age: '',
        lang: 'ja', // デフォルト言語
        currentQuestionIndex: 0,
        answers: {
            p: 0, a: 0, // 次元1: Passive / Active
            o: 0, s: 0, // 次元2: Objective / Subjective
            m: 0, n: 0, // 次元3: Growth (Maslow) / Need
            e: 0, r: 0  // 次元4: External / Reflexive (Internal)
        },
        answerHistory: [],
        typeCode: '', // 最終的な4文字コード (小文字)
        approvalPercent: 0, // 承認欲求スコア (0<100)
        isPremium: true,
        countdown: COUNTDOWN_SECONDS,
        timerId: null,
        audioCtx: null,
        heartbeatTimeout: null,
        currentBpm: 60,
        isTypingActive: false,
        psychAnimFrame: null,
        aiCommentRequestId: 0,
        
        // 3D Parallax用
        currentRotateX: 0,
        currentRotateY: 0,
        targetRotateX: 0,
        targetRotateY: 0,
        hasGyro: false
    };

    const PREMIUM_KEY = "CUTE2026"; // プレミアムパステルキー
    const PREMIUM_STORAGE_KEY = "sns_monster_premium_unlocked";
    const PERMANENT_PAID_STORAGE_KEY = "permanentPaid";
    const COMPAT_PAID_STORAGE_KEY = "compatPaid";
    const TALENT_PAID_STORAGE_KEY = "talentPaid";
    const COMPAT_PAID_TYPES_KEY = "compatPaidTypes";
    const TALENT_PAID_TYPES_KEY = "talentPaidTypes";
    const TALENT_STRIPE_URL = "https://buy.stripe.com/aFa7sE5v64WL8Bqb3u8AE02";
    const LAST_RESULT_TYPE_KEY = "lastResultType";
    const LAST_RESULT_TYPE_CODE_KEY = "lastResultTypeCode";
    const LAST_RESULT_SCORE_KEY = "lastResultScore";
    const LAST_RESULT_AI_KEY = "lastResultAi";
    const LAST_RESULT_AI_LANG_KEY = "lastResultAiLang";
    const LAST_RESULT_NICKNAME_KEY = "lastResultNickname";
    const LAST_RESULT_AGE_KEY = "lastResultAge";
    const LAST_RESULT_DESCRIPTION_KEY = "lastResultDescription";
    const LAST_RESULT_ANSWERS_KEY = "lastResultAnswers";
    const CONSENT_STORAGE_KEY = "sns_monster_cookie_consent";
    const LANG_STORAGE_KEY = "sns_monster_lang";
    const SUPPORTED_LANGS = ["ja", "en", "ko", "zh"];
    const ANSWER_KEYS = ["p", "a", "o", "s", "m", "n", "e", "r"];

    // ==========================================
    // 2. 多言語辞書 (i18n)
    // ==========================================
    const i18n = {
        ja: {
            appTitle: "SNS承認欲求モンスター診断",
            appSubtitle: "マズローの承認欲求2軸モデル診断",
            labelNickname: "あなたのニックネームを入力してください",
            placeholderNickname: "（例：ぽめちゃん）",
            labelAge: "あなたの年齢層を選択してください",
            ages: ["10代", "20代", "30代", "40代以上", "回答しない"],
            startDiagnosisBtn: "診断を開始する 💓",
            scanBpm: "スキャン深度上昇中...",
            qHeader: "Q{num} / {total}",
            backBtn: "← 1つ前に戻る",
            countdownText: "⚠️ 無料体験版: あと <span>{sec}</span> 秒で神託チェキが灰（霧）になります！",
            chekiUserName: "ユーザー: {name}",
            chekiUserAge: "年齢層: {age}",
            chekiSerialTitle: "シリアル番号",
            resultTitleLabel: "あなたの承認欲求タイプ",
            aiCommentTitleLabel: "AIによる分析（毒舌解説）",
            exportBtn: "📸 チェキを画像として保存/共有する",
            exportHint: "👆タップで画像保存（スクショ不要・キレイに保存）",
            shareBtn: "🐦 X（Twitter）に結果を共有する",
            lineShareBtn: "💬 LINEで友だちに送る",
            copyShareBtn: "🔗 リンクをコピー",
            retryBtn: "🔄 もう一度診断する",
            lockTitle: "🌸 神託は忘却の彼方へ 🌸",
            lockText: "無料体験枠の60秒が経過したため、診断結果のチェキはパステル霧に包まれて消滅しました。診断を永久保存したい場合は、パステルキーを入力してロックを解除してください。",
            premiumKeyLabel: "プレミアムパステルキー入力",
            unlockBtn: "パステルロック解除",
            iosModalTitle: "心の準備はよろしいですか？",
            iosModalText: "これからあなたの承認欲求および生体反応スキャナーをロードします。タイピング速度と連動した心拍フィードバックが流れます。",
            iosStartBtn: "進む",
            toastAudioInit: "生体スキャナー初期化完了 💓",
            toastKeySuccess: "プレミアムライセンス適合。時限消滅を永久回避しました！",
            toastKeyFail: "パステルキーが適合しません！",
            toastExportStart: "チェキを物質化（現像）中...",
            toastExportEnd: "現像完了！表示された画面から保存してください。",
            toastExportFail: "現像エラーが発生しました。",
            saveModalTitle: "チェキ画像ができました",
            saveModalText: "iPhoneでは共有画面から「画像を保存」を選んでください。開けない場合は画像を長押しして保存できます。",
            saveModalShareBtn: "共有/保存を開く",
            saveModalDownloadBtn: "ダウンロード",
            saveModalCloseBtn: "閉じる",
            toastAiSuccess: "AIとの深層接続に成功 💓",
            toastAiFallback: "AIオフライン。防弾フォールバック適用。",
            toastShareSuccess: "共有しました！",
            toastCopySuccess: "リンクをコピーしました",
            toastCopyFail: "コピーに失敗しました",
            loadingAi: "AIがあなたの精神をスキャン中……",
            shareImageTitle: "SNS承認欲求モンスター診断",
            shareImageText: "診断結果チェキ画像",
            xHashtag: "SNS承認欲求モンスター診断",
            chekiFooterCta: "あなたは何モンスター？→",
            shareVariants: [
                "私の承認欲求モンスターは『${name}』でした（スコア${scorePct}%）。当たりすぎて笑う…あなたは何タイプ？",
                "【閲覧注意】承認欲求、可視化されました→『${name}』(${scorePct}%)。あなたのモンスター、当ててみて👀",
                "承認欲求モンスター診断、『${name}』(${scorePct}%)だった。みんなのタイプも知りたい！やったら教えて👇"
            ],
            aiBadge: "AI的神託",
            approvalMeterTitle: "💓 承認欲求スコア",
            meterLow: "😌 達観",
            meterMiddle: "😅 中間",
            meterHigh: "🔥 承認欲求モンスター",
            chekiScoreLabel: "承認欲求スコア:",
            resultGrowthTitle: "診断結果をもっと楽しむ",
            resultGrowthLinks: [
                { href: "articles/result-types.html", label: "16タイプ診断結果の楽しみ方" },
                { href: "articles/sns-approval-desire.html", label: "SNSの承認欲求とは何か" },
                { href: "articles/sns-fatigue.html", label: "SNS疲れを軽くする投稿との付き合い方" },
                { href: "articles/how-to-share-results.html", label: "結果をXでシェアして遊ぶコツ" }
            ],
            footerLinks: {
                privacy: "プライバシーポリシー",
                contact: "お問い合わせ",
                about: "運営情報",
                articles: "承認欲求コラム"
            },
            consentText: "利用状況の分析と広告表示のためにCookie等を使います。ニックネームや入力内容はGA4へ送信しません。",
            consentReject: "拒否",
            consentAccept: "同意",
            adLabel: "スポンサーリンク",
            btnPermanentSave: "✦ 詳細AI診断書を保存＋永久保存 ¥120",
            btnLockPurchase: "✦ 詳細AI診断書を保存＋永久保存 ¥120",
            orDivider: "─── または ───",
            btnCompatibility: "もう少し覗いてみる？ ¥360",
            btnTalent: "眠った才能、起こしてみない？ ¥360",
            sectionTalentTitle: "🌟 眠った才能パック",
            sectionTalentLocked: "才能データを準備中です。購入後にここへ表示されます。",
            sectionTalentHidden: "眠った才能",
            sectionTalentWhy: "なぜその才能なのか",
            sectionTalentJobs: "向いている仕事",
            sectionTalentStrength: "弱みの中の強み",
            sectionTalentFuture: "未来のヒント",
            sectionTalentAction: "今日の一手",
            sectionCompatTitle: "💖 相性診断結果",
            sectionGoodMatch: "💚 相性◎ タイプ",
            sectionBadMatch: "💔 相性× タイプ",
            sectionLoveStyle: "📖 あなたの恋愛観",
            sectionGoodSecret: "💡 相性を活かすコツ",
            sectionBadAdvice: "🛠 こじらせない接し方",
            sectionLoveAdvice: "💞 恋愛ワンポイント",
            detailedReportTitle: "📄 詳細AI診断書",
            detailedReportUnlockedText: "タイプ説明とAI毒舌を1枚の画像で保存できます。",
            detailedReportLockedTitle: "🔒 詳細AI診断書は永久保存版で解放",
            detailedReportLockedText: "タイプ説明＋AI毒舌の詳細診断書を画像で残せるのは¥120だけ。60秒で霧に消える前に。",
            detailedReportSaveBtn: "📄 詳細AI診断書を画像で保存",
            detailedReportPurchaseBtn: "✦ ¥120で詳細診断書を保存＋永久保存",
            detailedReportLossCopy: "タイプ説明＋AI毒舌の詳細診断書を画像で残せるのは¥120だけ。60秒で霧に消える前に。",
            detailedReportScoreLabel: "承認欲求スコア",
            detailedReportFooter: "@snsmonsterdiag / sns-monster-diagnosis.pages.dev",
            paidSaveBtn: "✨ 詳細AI診断書を保存＋永久保存 ¥{price}",
            paidSaveHint: "またはXで共有して無料保存",
            paidSavedLabel: "保存済み",
            paidUnlockSuccess: "永久保存が有効になりました！",
            
            // ポップ用語定義
            dimensionNeed: "ビビリなあんしん安全第一派",
            dimensionGrowth: "意識高めな限界突破オタク",
            dimensionInternal: "マイペースなゴーイングマイウェイ精神",
            dimensionExternal: "視線泥棒なハッピーかまってちゃん"
        },
        en: {
            appTitle: "SNS Recognition Monster Diagnosis",
            appSubtitle: "Maslow's 2-Axis Approval Desire Model",
            labelNickname: "Please enter your nickname",
            placeholderNickname: "(e.g., Pome-chan)",
            labelAge: "Please select your age group",
            ages: ["10s", "20s", "30s", "40s or above", "Rather not say"],
            startDiagnosisBtn: "Start Diagnosis 💓",
            scanBpm: "Scanning depth rising...",
            qHeader: "Q{num} / {total}",
            backBtn: "← Previous",
            countdownText: "⚠️ Free trial: <span>{sec}</span>s until the Cheki fades into pastel fog!",
            chekiUserName: "User: {name}",
            chekiUserAge: "Age: {age}",
            chekiSerialTitle: "Serial Number",
            resultTitleLabel: "Your Approval Desire Type",
            aiCommentTitleLabel: "AI Analysis (Sarcastic Comments)",
            exportBtn: "📸 Save / Share Cheki",
            exportHint: "Tap to save (no screenshot needed)",
            shareBtn: "🐦 Share on X (Twitter)",
            lineShareBtn: "💬 Share on LINE",
            copyShareBtn: "🔗 Copy link",
            retryBtn: "🔄 Try Again",
            lockTitle: "🌸 Faded Into Forgetfulness 🌸",
            lockText: "Because 60 seconds passed, your Cheki has faded into pastel fog. Enter the pastel key to unlock and save it permanently.",
            premiumKeyLabel: "Enter Premium Pastel Key",
            unlockBtn: "Unlock Pastel Card",
            iosModalTitle: "Are you ready?",
            iosModalText: "We will now load your approval desire and biometrics scanner. Heartbeat audio feedback will sync with your typing speed.",
            iosStartBtn: "Proceed",
            toastAudioInit: "Scanner initialized 💓",
            toastKeySuccess: "Premium license matched. Vanishing avoided permanently!",
            toastKeyFail: "Invalid pastel key!",
            toastExportStart: "Processing Cheki...",
            toastExportEnd: "Image is ready. Save it from the screen shown.",
            toastExportFail: "Failed to process image.",
            saveModalTitle: "Your Cheki image is ready",
            saveModalText: "On iPhone, choose Save Image from the share sheet. If it does not open, long-press the image to save it.",
            saveModalShareBtn: "Open share/save",
            saveModalDownloadBtn: "Download",
            saveModalCloseBtn: "Close",
            toastAiSuccess: "AI deep connection succeeded 💓",
            toastAiFallback: "AI offline. Fallback applied.",
            toastShareSuccess: "Shared successfully!",
            toastCopySuccess: "Link copied",
            toastCopyFail: "Copy failed",
            loadingAi: "AI scanning your mind...",
            shareImageTitle: "SNS Recognition Monster Diagnosis",
            shareImageText: "My diagnosis result Cheki image",
            xHashtag: "SNSRecognitionMonster",
            chekiFooterCta: "Which monster are you? →",
            shareVariants: [
                "My SNS approval monster is \"${name}\" (score ${scorePct}%). Honestly too accurate 😂 What's yours?",
                "I got my approval desire scanned… it's \"${name}\" (${scorePct}%). Bet you can't guess yours 👀",
                "Just got \"${name}\" (${scorePct}%) on the SNS approval monster test. Drop yours, let's compare 👇"
            ],
            aiBadge: "AI Oracle",
            approvalMeterTitle: "💓 Approval Desire Score",
            meterLow: "😌 Detached",
            meterMiddle: "😅 Middle",
            meterHigh: "🔥 Approval Monster",
            chekiScoreLabel: "Approval Score:",
            resultGrowthTitle: "Enjoy your result more",
            resultGrowthLinks: [
                { href: "articles/result-types.html", label: "How to enjoy the 16 result types" },
                { href: "articles/sns-approval-desire.html", label: "What approval desire on SNS means" },
                { href: "articles/sns-fatigue.html", label: "How to ease SNS fatigue" },
                { href: "articles/how-to-share-results.html", label: "Tips for sharing your result on X" }
            ],
            footerLinks: {
                privacy: "Privacy Policy",
                contact: "Contact",
                about: "About",
                articles: "Approval Desire Columns"
            },
            consentText: "We use cookies and similar technologies for analytics and ads. Nicknames and typed answers are not sent to GA4.",
            consentReject: "Reject",
            consentAccept: "Accept",
            adLabel: "Sponsored",
            btnPermanentSave: "✦ Save full AI report + keep forever ¥120",
            btnLockPurchase: "✦ Save full AI report + keep forever ¥120",
            orDivider: "─── or ───",
            btnCompatibility: "Want to peek a little more? ¥360",
            btnTalent: "Wanna wake your sleeping talent? ¥360",
            sectionTalentTitle: "🌟 Sleeping Talent Pack",
            sectionTalentLocked: "Talent data is being prepared. It will appear here after purchase.",
            sectionTalentHidden: "Hidden Talent",
            sectionTalentWhy: "Why This Fits",
            sectionTalentJobs: "Ideal Jobs",
            sectionTalentStrength: "Strength in the Weakness",
            sectionTalentFuture: "Future Hint",
            sectionTalentAction: "Action Advice",
            sectionCompatTitle: "💖 Compatibility Results",
            sectionGoodMatch: "💚 Great Match",
            sectionBadMatch: "💔 Clash Type",
            sectionLoveStyle: "📖 Your Love Style",
            sectionGoodSecret: "💡 How to make it click",
            sectionBadAdvice: "🛠 How to keep the peace",
            sectionLoveAdvice: "💞 Love tip",
            detailedReportTitle: "📄 Full AI Report",
            detailedReportUnlockedText: "Save your type description and AI roast as one clean image.",
            detailedReportLockedTitle: "🔒 Full AI report unlocks with the forever-save version",
            detailedReportLockedText: "Only the ¥120 version lets you keep the type notes and AI roast as an image before it fades in 60 seconds.",
            detailedReportSaveBtn: "📄 Save full AI report as image",
            detailedReportPurchaseBtn: "✦ Save full AI report + keep forever ¥120",
            detailedReportLossCopy: "Only ¥120 lets you keep the type notes and AI roast as an image before the 60-second fog takes it.",
            detailedReportScoreLabel: "Approval Desire Score",
            detailedReportFooter: "@snsmonsterdiag / sns-monster-diagnosis.pages.dev",
            paidSaveBtn: "✨ Save full AI report + keep forever ¥{price}",
            paidSaveHint: "Or share on X to save for free",
            paidSavedLabel: "Saved forever",
            paidUnlockSuccess: "Permanent save is now unlocked!",

            // ポップ用語定義
            dimensionNeed: "Timid Safety-First Group",
            dimensionGrowth: "High-Conscious Limit-Break Otaku",
            dimensionInternal: "My-Way Independent Spirit",
            dimensionExternal: "Attention-Stealer Happy Needy"
        },
        ko: {
            appTitle: "SNS 승인욕구 몬스터 진단",
            appSubtitle: "매슬로 승인욕구 2축 모델 진단",
            labelNickname: "닉네임을 입력해 주세요",
            placeholderNickname: "(예: 포메짱)",
            labelAge: "연령대를 선택해 주세요",
            ages: ["10대", "20대", "30대", "40대 이상", "답변 거부"],
            startDiagnosisBtn: "진단 시작하기 💓",
            scanBpm: "스캔 깊이 상승 중...",
            qHeader: "Q{num} / {total}",
            backBtn: "← 이전 문제",
            countdownText: "⚠️ 무료 체험판: 앞으로 <span>{sec}</span>초 뒤 체키가 안개 속으로 사라집니다!",
            chekiUserName: "유저: {name}",
            chekiUserAge: "연령대: {age}",
            chekiSerialTitle: "시리얼 번호",
            resultTitleLabel: "당신의 승인욕구 유형",
            aiCommentTitleLabel: "AI 심층 분석 (독설 해설)",
            exportBtn: "📸 체키 저장/공유하기",
            exportHint: "탭하면 이미지 저장 (스크린샷 불필요)",
            shareBtn: "🐦 X(Twitter)에 공유하기",
            lineShareBtn: "💬 LINE에 공유하기",
            copyShareBtn: "🔗 링크 복사",
            retryBtn: "🔄 다시 도전하기",
            lockTitle: "🌸 신탁은 망각의 너머로 🌸",
            lockText: "무료 체험 시간 60초가 지나 진단 결과 체키가 파스텔 안개에 봉인되었습니다. 영구 보존하려면 파스텔 키를 입력하여 잠금을 해제하십시오.",
            premiumKeyLabel: "프리미엄 파스텔 키 입력",
            unlockBtn: "파스텔 락 해제",
            iosModalTitle: "마음의 준비는 되셨습니까?",
            iosModalText: "지금부터 당신의 승인욕구와 생체 반응 스캐너를 실행합니다. 타이핑 속도에 맞춰 심장 박동 피드백이 재생됩니다.",
            iosStartBtn: "시작하기",
            toastAudioInit: "스캐너 초기화 완료 💓",
            toastKeySuccess: "프리미엄 라이선스 인증 완료. 영구 해제되었습니다!",
            toastKeyFail: "파스텔 키가 일치하지 않습니다!",
            toastExportStart: "체키 인화 중...",
            toastExportEnd: "인화 완료! 표시된 화면에서 저장해 주세요.",
            toastExportFail: "인화 중 오류가 발생했습니다.",
            saveModalTitle: "체키 이미지가 준비되었습니다",
            saveModalText: "iPhone에서는 공유 화면에서 이미지 저장을 선택해 주세요. 열리지 않으면 이미지를 길게 눌러 저장할 수 있습니다.",
            saveModalShareBtn: "공유/저장 열기",
            saveModalDownloadBtn: "다운로드",
            saveModalCloseBtn: "닫기",
            toastAiSuccess: "AI 심층 연결 성공 💓",
            toastAiFallback: "AI 오프라인. 백업 텍스트 적용.",
            toastShareSuccess: "공유되었습니다!",
            toastCopySuccess: "링크가 복사되었습니다",
            toastCopyFail: "복사 실패",
            loadingAi: "AI가 당신의 정신을 스캔 중……",
            shareImageTitle: "SNS 승인욕구 몬스터 진단",
            shareImageText: "진단 결과 체키 이미지",
            xHashtag: "SNS승인욕구몬스터진단",
            chekiFooterCta: "당신은 무슨 몬스터? →",
            shareVariants: [
                "내 SNS 승인욕구 몬스터는 『${name}』! (점수 ${scorePct}%) 너무 잘 맞아서 소름… 당신은?",
                "내 승인욕구가 스캔당했다… 결과는 『${name}』(${scorePct}%). 당신의 몬스터, 맞혀볼래요? 👀",
                "『${name}』(${scorePct}%) 나왔어요! 다들 무슨 타입인지 궁금… 해보고 댓글로 알려줘요 👇"
            ],
            aiBadge: "AI 신탁",
            approvalMeterTitle: "💓 승인욕구 점수",
            meterLow: "😌 달관",
            meterMiddle: "😅 중간",
            meterHigh: "🔥 승인욕구 몬스터",
            chekiScoreLabel: "승인욕구 점수:",
            resultGrowthTitle: "진단 결과 더 즐기기",
            resultGrowthLinks: [
                { href: "articles/result-types.html", label: "16가지 진단 결과 즐기는 법" },
                { href: "articles/sns-approval-desire.html", label: "SNS의 승인욕구란 무엇인가" },
                { href: "articles/sns-fatigue.html", label: "SNS 피로를 줄이는 게시물과의 거리" },
                { href: "articles/how-to-share-results.html", label: "결과를 X에 공유하며 즐기는 법" }
            ],
            footerLinks: {
                privacy: "개인정보 처리방침",
                contact: "문의",
                about: "운영 정보",
                articles: "승인욕구 칼럼"
            },
            consentText: "이용 분석과 광고 표시를 위해 쿠키 등을 사용합니다. 닉네임과 입력 내용은 GA4로 보내지 않습니다.",
            consentReject: "거부",
            consentAccept: "동의",
            adLabel: "스폰서 링크",
            btnPermanentSave: "✦ 상세 AI 진단서 저장＋영구 보존 ¥120",
            btnLockPurchase: "✦ 상세 AI 진단서 저장＋영구 보존 ¥120",
            orDivider: "─── 또는 ───",
            btnCompatibility: "좀 더 들여다볼래? ¥360",
            btnTalent: "잠든 재능, 깨워볼래? ¥360",
            sectionTalentTitle: "🌟 잠든 재능 팩",
            sectionTalentLocked: "재능 데이터는 준비 중입니다. 구매 후 이곳에 표시됩니다.",
            sectionTalentHidden: "잠든 재능",
            sectionTalentWhy: "왜 이 재능인가",
            sectionTalentJobs: "어울리는 일",
            sectionTalentStrength: "약점 속 강점",
            sectionTalentFuture: "미래 힌트",
            sectionTalentAction: "오늘의 한 수",
            sectionCompatTitle: "💖 궁합 진단 결과",
            sectionGoodMatch: "💚 궁합 최고",
            sectionBadMatch: "💔 최악의 궁합",
            sectionLoveStyle: "📖 당신의 연애관",
            sectionGoodSecret: "💡 궁합을 살리는 비결",
            sectionBadAdvice: "🛠 충돌을 줄이는 법",
            sectionLoveAdvice: "💞 연애 한마디",
            detailedReportTitle: "📄 상세 AI 진단서",
            detailedReportUnlockedText: "유형 설명과 AI 독설을 한 장의 이미지로 저장할 수 있습니다.",
            detailedReportLockedTitle: "🔒 상세 AI 진단서는 영구 보존판에서 열립니다",
            detailedReportLockedText: "유형 설명＋AI 독설 진단서를 이미지로 남길 수 있는 건 ¥120뿐입니다. 60초 뒤 안개 속으로 사라지기 전에.",
            detailedReportSaveBtn: "📄 상세 AI 진단서를 이미지로 저장",
            detailedReportPurchaseBtn: "✦ ¥120으로 상세 진단서 저장＋영구 보존",
            detailedReportLossCopy: "유형 설명＋AI 독설 진단서를 이미지로 남길 수 있는 건 ¥120뿐입니다. 60초 뒤 안개 속으로 사라지기 전에.",
            detailedReportScoreLabel: "승인욕구 점수",
            detailedReportFooter: "@snsmonsterdiag / sns-monster-diagnosis.pages.dev",
            paidSaveBtn: "✨ 상세 AI 진단서 저장＋영구 보존 ¥{price}",
            paidSaveHint: "또는 X에 공유하고 무료로 저장",
            paidSavedLabel: "저장 완료",
            paidUnlockSuccess: "영구 저장이 활성화되었습니다!",

            // ポップ用語定義
            dimensionNeed: "소심한 안심안전 제일파",
            dimensionGrowth: "의식 높은 한계돌파 오타쿠",
            dimensionInternal: "마이웨이 마이페이스 정신",
            dimensionExternal: "시선강탈 해피 관심종자"
        },
        zh: {
            appTitle: "SNS认同感怪物诊断",
            appSubtitle: "基于马斯洛需求模型的双轴认同诊断",
            labelNickname: "请输入您的昵称",
            placeholderNickname: "（例：小博美）",
            labelAge: "请选择您的年龄段",
            ages: ["10代", "20代", "30代", "40代以上", "拒绝回答"],
            startDiagnosisBtn: "开始诊断 💓",
            scanBpm: "扫描深度上升中...",
            qHeader: "Q{num} / {total}",
            backBtn: "← 上一题",
            countdownText: "⚠️ 免费体验版: 剩 <span>{sec}</span> 秒神谕拍立得就会化为粉雾！",
            chekiUserName: "用户: {name}",
            chekiUserAge: "年龄段: {age}",
            chekiSerialTitle: "序列号",
            resultTitleLabel: "您的认同感欲求类型",
            aiCommentTitleLabel: "AI毒舌分析",
            exportBtn: "📸 保存/分享拍立得图片",
            exportHint: "点击保存图片（无需截图）",
            shareBtn: "🐦 分享到 X (Twitter)",
            lineShareBtn: "💬 分享到 LINE",
            copyShareBtn: "🔗 复制链接",
            retryBtn: "🔄 重新诊断",
            lockTitle: "🌸 神谕已归于遗忘 🌸",
            lockText: "由于免费体验的60秒已过，您的诊断结果已被封锁在粉雾中。请输入钥匙解锁以永久保存您的拍立得。",
            premiumKeyLabel: "输入升级钥匙",
            unlockBtn: "解除粉色锁定",
            iosModalTitle: "准备好迎接真实的自己吗？",
            iosModalText: "我们将加载您的社交认同欲求与生物反馈系统。心跳声音将与您的打字速度保持同步。",
            iosStartBtn: "前进",
            toastAudioInit: "生物反馈初始化完毕 💓",
            toastKeySuccess: "钥匙验证成功！已为您永久保留拍立得。",
            toastKeyFail: "无效的钥匙！",
            toastExportStart: "正在冲印拍立得...",
            toastExportEnd: "冲印完成！请在显示的页面中保存。",
            toastExportFail: "冲印失败，发生了内部错误。",
            saveModalTitle: "拍立得图片已生成",
            saveModalText: "在 iPhone 上请从分享面板选择保存图片。若无法打开，请长按图片保存。",
            saveModalShareBtn: "打开分享/保存",
            saveModalDownloadBtn: "下载",
            saveModalCloseBtn: "关闭",
            toastAiSuccess: "AI连接成功 💓",
            toastAiFallback: "AI已离线。已使用本地诊断。",
            toastShareSuccess: "分享成功！",
            toastCopySuccess: "链接已复制",
            toastCopyFail: "复制失败",
            loadingAi: "AI正在深入扫描您的内心...",
            shareImageTitle: "SNS认同感怪物诊断",
            shareImageText: "诊断结果拍立得图片",
            xHashtag: "SNS认同感怪物诊断",
            chekiFooterCta: "你是什么怪物？→",
            shareVariants: [
                "我的社交认同感怪物是『${name}』！（分数${scorePct}%）准到笑出来…你是哪一种？",
                "我的认同感被扫描了……结果是『${name}』(${scorePct}%)。猜猜你的怪物是什么？👀",
                "测出来是『${name}』(${scorePct}%)！好奇大家都是什么类型，快测一下评论告诉我 👇"
            ],
            aiBadge: "AI神谕",
            approvalMeterTitle: "💓 认同感欲求分数",
            meterLow: "😌 超然",
            meterMiddle: "😅 中间",
            meterHigh: "🔥 认同感怪物",
            chekiScoreLabel: "认同感分数:",
            resultGrowthTitle: "进一步享受诊断结果",
            resultGrowthLinks: [
                { href: "articles/result-types.html", label: "16种诊断结果的玩法" },
                { href: "articles/sns-approval-desire.html", label: "SNS上的认同感欲求是什么" },
                { href: "articles/sns-fatigue.html", label: "减轻SNS疲劳的相处方式" },
                { href: "articles/how-to-share-results.html", label: "在X分享结果的玩法" }
            ],
            footerLinks: {
                privacy: "隐私政策",
                contact: "联系我们",
                about: "运营信息",
                articles: "认同感专栏"
            },
            consentText: "我们会为使用情况分析和广告显示使用Cookie等技术。昵称和输入内容不会发送到GA4。",
            consentReject: "拒绝",
            consentAccept: "同意",
            adLabel: "赞助链接",
            btnPermanentSave: "✦ 保存详细AI诊断书＋永久保存 ¥120",
            btnLockPurchase: "✦ 保存详细AI诊断书＋永久保存 ¥120",
            orDivider: "─── 或者 ───",
            btnCompatibility: "想再窥探一点吗？¥360",
            btnTalent: "唤醒沉睡的才能？ ¥360",
            sectionTalentTitle: "🌟 沉睡才能包",
            sectionTalentLocked: "才能数据正在准备中。购买后会显示在这里。",
            sectionTalentHidden: "沉睡的才能",
            sectionTalentWhy: "为什么适合你",
            sectionTalentJobs: "适合的工作",
            sectionTalentStrength: "弱点中的强项",
            sectionTalentFuture: "未来提示",
            sectionTalentAction: "今日行动",
            sectionCompatTitle: "💖 配对诊断结果",
            sectionGoodMatch: "💚 最佳搭档",
            sectionBadMatch: "💔 冲突类型",
            sectionLoveStyle: "📖 你的恋爱观",
            sectionGoodSecret: "💡 加分小秘诀",
            sectionBadAdvice: "🛠 减少摩擦的建议",
            sectionLoveAdvice: "💞 恋爱小建议",
            detailedReportTitle: "📄 详细AI诊断书",
            detailedReportUnlockedText: "可将类型说明和AI毒舌分析保存为一张清晰图片。",
            detailedReportLockedTitle: "🔒 详细AI诊断书将在永久保存版中解锁",
            detailedReportLockedText: "只有¥120版本能把类型说明＋AI毒舌诊断书保存成图片。请在60秒粉雾消失前保存。",
            detailedReportSaveBtn: "📄 保存详细AI诊断书图片",
            detailedReportPurchaseBtn: "✦ ¥120保存详细诊断书＋永久保存",
            detailedReportLossCopy: "只有¥120版本能把类型说明＋AI毒舌诊断书保存成图片。请在60秒粉雾消失前保存。",
            detailedReportScoreLabel: "认同感欲求分数",
            detailedReportFooter: "@snsmonsterdiag / sns-monster-diagnosis.pages.dev",
            paidSaveBtn: "✨ 保存详细AI诊断书＋永久保存 ¥{price}",
            paidSaveHint: "或分享到X免费保存",
            paidSavedLabel: "已保存",
            paidUnlockSuccess: "永久保存已启用！",

            // ポップ用語定義
            dimensionNeed: "胆小安心安全第一派",
            dimensionGrowth: "意识超前极限突破宅",
            dimensionInternal: "我行我素我的路精神",
            dimensionExternal: "抢镜开心求关注狂"
        }
    };

    // ==========================================
    // 3. 多言語質問データベース (全16問)
    // ==========================================
    const questions = [
        {
            category: {
                ja: "承認の源泉", en: "Approval Source", ko: "승인의 원천", zh: "认同的源泉"
            },
            text: {
                ja: "SNSの投稿に対するリアクション（いいね数など）が期待より少なかった時の気持ちは？",
                en: "How do you feel when your SNS post gets fewer likes/reactions than expected?",
                ko: "SNS 게시물에 대한 반응(좋아요 수 등)이 기대보다 적었을 때의 기분은?",
                zh: "当社交媒体帖子的互动（点赞数等）低于预期時，你的感受是？"
            },
            answers: [
                {
                    text: {
                        ja: "「誰にも見られてないのかな…」と寂しくなり、投稿を消したくなる。",
                        en: "I feel lonely, wondering if no one is watching, and want to delete the post.",
                        ko: "「아무도 안 보나...」 하고 쓸쓸해져서 게시물을 지우고 싶어진다.",
                        zh: "会觉得「是不是没人看啊…」而感到寂寞，甚至想删帖。"
                    },
                    value: 'e'
                },
                {
                    text: {
                        ja: "「まあ、自分が気に入っているから関係ないや！」と気にしない。",
                        en: "I don't care because I like it myself anyway!",
                        ko: "「뭐, 내가 마음에 드니까 상관없어!」라며 신경 쓰지 않는다.",
                        zh: "觉得「嘛，我自己喜欢就行！」所以不在意。"
                    },
                    value: 'r'
                }
            ]
        },
        {
            category: {
                ja: "欲求の動機", en: "Motivations", ko: "욕구의 동기", zh: "欲求的动机"
            },
            text: {
                ja: "新しいスキルや知識を身につけようと思う最大の動機は？",
                en: "What is your main motivation for acquiring new skills or knowledge?",
                ko: "새로운 기술이나 지식을 습득하려는 가장 큰 동기는?",
                zh: "您学习新技能或知识的最大动力是？"
            },
            answers: [
                {
                    text: {
                        ja: "周りに置いていかれたくない、または将来の不安を解消するため。",
                        en: "To avoid being left behind, or to resolve future anxieties.",
                        ko: "주변에 뒤처지고 싶지 않거나, 미래의 불안을 해소하기 위해.",
                        zh: "不想被周围人落下，或者想消除对未来的不安。"
                    },
                    value: 'n'
                },
                {
                    text: {
                        ja: "自分の可能性を広げたい、新しいことに純粋に挑戦したいため。",
                        en: "To expand my potential, or out of pure curiosity for new things.",
                        ko: "자신의 가능성을 넓히고 싶거나, 새로운 일에 순수하게 도전하기 위해.",
                        zh: "想要拓宽自己的可能性，纯粹想尝试新事物。"
                    },
                    value: 'm'
                }
            ]
        },
        {
            category: {
                ja: "表出アプローチ", en: "Approach Style", ko: "표출 어프로치", zh: "表出态度"
            },
            text: {
                ja: "自分の魅力や趣味を周囲に伝えるときのスタイルは？",
                en: "What is your style when showing your charm or hobbies to others?",
                ko: "자신의 매력이나 취미를 주변에 알릴 때의 스타일은?",
                zh: "向周围展示自己的魅力或兴趣时，您倾向于哪种风格？"
            },
            answers: [
                {
                    text: {
                        ja: "自ら積極的にSNSなどで発信し、多くの人に知ってもらおうとする。",
                        en: "I actively post on SNS to get as many people to know as possible.",
                        ko: "스스로 적극적으로 SNS 등에 올려 많은 사람들에게 알리려고 한다.",
                        zh: "自己主动在社交媒体上发布，想让更多的人知道。"
                    },
                    value: 'a'
                },
                {
                    text: {
                        ja: "聞かれたら答える程度で、わかる人にだけ見つけてほしいと願う。",
                        en: "I only answer if asked, hoping that only those who get it will find me.",
                        ko: "누가 물어보면 대답하는 정도로, 알아주는 사람만 찾아주길 바란다.",
                        zh: "有人问起才说，只希望懂的人能发现自己就行。"
                    },
                    value: 'p'
                }
            ]
        },
        {
            category: {
                ja: "評価基準", en: "Evaluation Criteria", ko: "평가 기준", zh: "评价标准"
            },
            text: {
                ja: "あなたが「他人に認められた」と強く実感する瞬間はどちら？",
                en: "When do you feel most strongly that you have been recognized by others?",
                ko: "당신이 「타인에게 인정받았다」고 강하게 실감하는 순간은?",
                zh: "以下哪一种情况能让您强烈感受到「被他人认可」？"
            },
            answers: [
                {
                    text: {
                        ja: "売上、フォロワー数、点数などの「明確な数値や結果」が出たとき。",
                        en: "When concrete numbers like sales, followers, or scores are achieved.",
                        ko: "매출, 팔로워 수, 점수 등 「명확한 수치나 결과」가 나왔을 때.",
                        zh: "当销售额、粉丝数、分数等「明确的数据或结果」出来时。"
                    },
                    value: 'o'
                },
                {
                    text: {
                        ja: "「あなたと一緒にいると楽しい」といった「感情的・感覚的な言葉」をもらったとき。",
                        en: "When receiving emotional words like 'It is fun to be with you'.",
                        ko: "「너랑 있으면 즐거워」 등 「감정적・감각적인 말」을 들었을 때.",
                        zh: "当听到「和你在一起很开心」这类「情感上或感觉上的话语」时。"
                    },
                    value: 's'
                }
            ]
        },
        {
            category: {
                ja: "承認の源泉", en: "Approval Source", ko: "승인의 원천", zh: "认同的源泉"
            },
            text: {
                ja: "目標を達成して人から大絶賛されたとき、脳内で真っ先に思うことは？",
                en: "What is your immediate thought when you reach a goal and get highly praised?",
                ko: "목표를 달성해 사람들에게 대찬사를 받았을 때, 머릿속에 가장 먼저 드는 생각은?",
                zh: "当达成目标并获得大家赞赏时，您脑海中第一个想法是？"
            },
            answers: [
                {
                    text: {
                        ja: "「みんなが認めてくれた！これでもう安心だ！」と胸を撫で下ろす。",
                        en: "I sigh with relief thinking, 'Everyone accepts me! Now I'm safe!'",
                        ko: "「모두가 인정해 줬어! 이제 안심이다!」라며 안도한다.",
                        zh: "拍着胸脯松口气：「大家都认可我了！这下终于安全了！」"
                    },
                    value: 'e'
                },
                {
                    text: {
                        ja: "「よし、自分の努力がしっかり実を結んだな」と心の中で静かに噛み締める。",
                        en: "I quietly reflect: 'Yes, my efforts have truly paid off.'",
                        ko: "「좋아, 내 노력이 확실히 결실을 맺었구나」라며 마음속으로 다짐한다.",
                        zh: "在心中默默赞许：「很好，自分の努力がようやく実を結んだ。」"
                    },
                    value: 'r'
                }
            ]
        },
        {
            category: {
                ja: "欲求の動機", en: "Motivations", ko: "욕구의 동기", zh: "欲求的动机"
            },
            text: {
                ja: "あなたにとって「生きる上で最も避けたい状態」は？",
                en: "What is the single state in life you want to avoid most?",
                ko: "당신에게 있어 「살아가면서 가장 피하고 싶은 상태」는?",
                zh: "对您来说，「人生中最想避免的状态」是？"
            },
            answers: [
                {
                    text: {
                        ja: "社会的な孤立、仲間外れ、あるいは自分の居場所がなくなること。",
                        en: "Social isolation, being excluded, or having no place to belong.",
                        ko: "사회적인 고립, 따돌림, 혹은 자신의 설 자리가 없어지는 것.",
                        zh: "社交上的孤立、被边缘化，或者没有自己的容身之所。"
                    },
                    value: 'n'
                },
                {
                    text: {
                        ja: "現状維持のまま衰退し、自分のやりたいことが一生できずに終わること。",
                        en: "Decaying in status quo, ending life without doing what I wanted.",
                        ko: "현상 유지에 머무르다 쇠퇴해, 내가 하고 싶은 일을 평생 못 하고 끝나는 것.",
                        zh: "在安于现状中慢慢退步，一生都无法做自己真正想做的事。"
                    },
                    value: 'm'
                }
            ]
        },
        {
            category: {
                ja: "表出アプローチ", en: "Approach Style", ko: "표출 어프로치", zh: "表出态度"
            },
            text: {
                ja: "もしグループワークで自分のアイデアが良い成果を上げた場合、どう動く？",
                en: "If your idea leads to great results in a group project, what do you do?",
                ko: "만약 그룹 과제에서 자신의 아이디어가 좋은 성과를 냈을 때, 어떻게 행동합니까?",
                zh: "如果团队工作中因为您的创意取得了不错成果，您会怎么做？"
            },
            answers: [
                {
                    text: {
                        ja: "「私のアイデアなんです！」と実績をしっかりアピールする。",
                        en: "I clearly assert my credit: 'That was my idea!'",
                        ko: "「이거 제 아이디어입니다!」라며 내 실적을 확실히 어필한다.",
                        zh: "明确表明主权：「这其实是我的想法！」积极展示自我。"
                    },
                    value: 'a'
                },
                {
                    text: {
                        ja: "自分が提案したと周囲が気づいて自然と評価してくれるのを待つ。",
                        en: "I wait for others to naturally realize and appreciate that I proposed it.",
                        ko: "내가 제안한 것임을 주변이 눈치채고 자연스레 평가해 주길 기다린다.",
                        zh: "等待大家注意到是由自己提案的，并自然而然地给予认可。"
                    },
                    value: 'p'
                }
            ]
        },
        {
            category: {
                ja: "評価基準", en: "Evaluation Criteria", ko: "평가 기준", zh: "评价标准"
            },
            text: {
                ja: "何かのイベントに参加した際、あなたが最も価値を感じるのは？",
                en: "When attending an event, what do you find most valuable?",
                ko: "어떤 이벤트에 참여했을 때, 당신이 가장 가치를 느끼는 것은?",
                zh: "参加某项活动时，您认为最有价值的是？"
            },
            answers: [
                {
                    text: {
                        ja: "修了証やバッジなどの「客観的に証明できる戦利品」をもらうこと。",
                        en: "Receiving tangible trophies like certificates or badges.",
                        ko: "수료증이나 배지 등 「객관적으로 증명할 수 있는 전리품」을 받는 것.",
                        zh: "获得结业证书或勋章等「可以作为客观证明的战利品」。"
                    },
                    value: 'o'
                },
                {
                    text: {
                        ja: "その場で生まれた「仲間とのエモい連帯感や、直感的な楽しさ」を味わうこと。",
                        en: "Experiencing emotional bonding and intuitive fun with others.",
                        ko: "그 자리에서 싹튼 「동료들과의 에모한 연대감이나 직관적인 즐거움」을 맛보는 것.",
                        zh: "体验当时产生的「与同伴之间的感性纽带，或直观的乐趣」。"
                    },
                    value: 's'
                }
            ]
        },
        {
            category: {
                ja: "承認の源泉", en: "Approval Source", ko: "승인의 원천", zh: "认同的源泉"
            },
            text: {
                ja: "ストーリーの閲覧数はあるのに反応が少ないとき、つい考えるのは？",
                en: "When your story has views but almost no reactions, what do you tend to think?",
                ko: "스토리 조회수는 있는데 반응이 거의 없을 때, 무심코 드는 생각은?",
                zh: "动态有浏览量却几乎没人互动时，你最容易想到什么？"
            },
            answers: [
                {
                    text: {
                        ja: "「見てるなら何か押してよ」と、誰が見たかまで確認してしまう。",
                        en: "I check who saw it and think, 'If you looked, react to it.'",
                        ko: "「봤으면 뭐라도 눌러주지」 싶어서 누가 봤는지까지 확인한다.",
                        zh: "会想「都看了怎么不点一下」，甚至去查是谁看过。"
                    },
                    value: 'e'
                },
                {
                    text: {
                        ja: "記録として残せたなら十分で、反応の有無はあまり引きずらない。",
                        en: "If it works as my own record, reactions do not linger much.",
                        ko: "내 기록으로 남겼다면 충분해서 반응 유무를 오래 끌지 않는다.",
                        zh: "能作为自己的记录留下就够了，不太纠结有没有反应。"
                    },
                    value: 'r'
                }
            ]
        },
        {
            category: {
                ja: "欲求の動機", en: "Motivations", ko: "욕구의 동기", zh: "欲求的动机"
            },
            text: {
                ja: "知らないSNSの流行が急に周りで盛り上がったとき、最初の反応は？",
                en: "When a new SNS trend suddenly spreads around you, what is your first reaction?",
                ko: "모르는 SNS 유행이 갑자기 주변에서 뜰 때, 첫 반응은?",
                zh: "身边突然流行起一个你不了解的社交媒体玩法时，你的第一反应是？"
            },
            answers: [
                {
                    text: {
                        ja: "「乗り遅れたら存在感が薄くなるかも」と急いで把握する。",
                        en: "I rush to understand it because being late might make me invisible.",
                        ko: "「늦으면 존재감이 옅어질지도」 싶어서 급히 파악한다.",
                        zh: "会赶紧弄懂，担心「跟不上就会没存在感」。"
                    },
                    value: 'n'
                },
                {
                    text: {
                        ja: "面白そうなら自分なりの使い方を試し、違えば静かに見送る。",
                        en: "If it seems fun, I test my own spin; if not, I let it pass.",
                        ko: "재밌어 보이면 내 방식으로 써 보고, 아니면 조용히 넘긴다.",
                        zh: "觉得有趣就用自己的方式试试，不合适就安静略过。"
                    },
                    value: 'm'
                }
            ]
        },
        {
            category: {
                ja: "表出アプローチ", en: "Approach Style", ko: "표출 어프로치", zh: "表出态度"
            },
            text: {
                ja: "いい感じの作品や成果ができた直後、あなたが取りがちな行動は？",
                en: "Right after making something you feel proud of, what do you usually do?",
                ko: "마음에 드는 작품이나 성과가 생긴 직후, 주로 어떤 행동을 하나요?",
                zh: "刚做出自己满意的作品或成果时，你通常会怎么做？"
            },
            answers: [
                {
                    text: {
                        ja: "熱が冷めないうちに、制作過程やこだわりも含めて投稿する。",
                        en: "I post it while the energy is fresh, including the process and details.",
                        ko: "열기가 식기 전에 과정과 포인트까지 함께 올린다.",
                        zh: "趁热度还在，把过程和讲究也一起发出来。"
                    },
                    value: 'a'
                },
                {
                    text: {
                        ja: "まず自分だけで眺め、見せる相手やタイミングをかなり選ぶ。",
                        en: "I enjoy it privately first and carefully choose who and when to show.",
                        ko: "먼저 혼자 감상하고, 보여줄 사람과 타이밍을 꽤 고른다.",
                        zh: "先自己欣赏，再慎重选择给谁看、什么时候发。"
                    },
                    value: 'p'
                }
            ]
        },
        {
            category: {
                ja: "評価基準", en: "Evaluation Criteria", ko: "평가 기준", zh: "评价标准"
            },
            text: {
                ja: "投稿が伸びた日の夜、あとで見返したくなるのはどちら？",
                en: "On a day when a post performs well, what do you want to revisit later?",
                ko: "게시물이 잘 된 날 밤, 나중에 다시 보고 싶은 것은?",
                zh: "帖子表现不错的那天晚上，你之后更想回看哪一种？"
            },
            answers: [
                {
                    text: {
                        ja: "伸びた数字、ランキング、保存数などの結果画面。",
                        en: "The result screen: numbers, ranking, saves, and reach.",
                        ko: "올라간 숫자, 순위, 저장 수 같은 결과 화면.",
                        zh: "增长的数据、排名、收藏数等结果画面。"
                    },
                    value: 'o'
                },
                {
                    text: {
                        ja: "誰かの一言コメントや、空気が変わった瞬間の感触。",
                        en: "A single comment from someone, or the feeling that the mood shifted.",
                        ko: "누군가의 한마디 댓글이나 분위기가 바뀐 순간의 감각.",
                        zh: "某个人的一句评论，或氛围突然变化的那种感觉。"
                    },
                    value: 's'
                }
            ]
        },
        {
            category: {
                ja: "承認の源泉", en: "Approval Source", ko: "승인의 원천", zh: "认同的源泉"
            },
            text: {
                ja: "投稿前に最後まで迷うとき、判断基準になりやすいのは？",
                en: "When you hesitate before posting, what usually decides it?",
                ko: "게시 전 끝까지 망설일 때, 판단 기준이 되기 쉬운 것은?",
                zh: "发布前犹豫到最后时，最容易成为判断标准的是？"
            },
            answers: [
                {
                    text: {
                        ja: "これを出したらどう見られるか、変に思われないか。",
                        en: "How people will see it, and whether it might look weird.",
                        ko: "이걸 올리면 어떻게 보일지, 이상하게 보이지 않을지.",
                        zh: "别人会怎么看，会不会觉得奇怪。"
                    },
                    value: 'e'
                },
                {
                    text: {
                        ja: "今の自分の好みや感覚にちゃんと合っているか。",
                        en: "Whether it honestly matches my own taste and sense right now.",
                        ko: "지금 내 취향과 감각에 제대로 맞는지.",
                        zh: "是否真的符合此刻自己的喜好和感觉。"
                    },
                    value: 'r'
                }
            ]
        },
        {
            category: {
                ja: "欲求の動機", en: "Motivations", ko: "욕구의 동기", zh: "欲求的动机"
            },
            text: {
                ja: "同年代の誰かが急に注目されたとき、心の奥で強く出る反応は？",
                en: "When someone your age suddenly gets attention, what rises inside first?",
                ko: "또래 누군가가 갑자기 주목받을 때, 마음속에서 강하게 올라오는 반응은?",
                zh: "同龄人突然受到关注时，你内心最强烈的反应是？"
            },
            answers: [
                {
                    text: {
                        ja: "「自分だけ取り残されているかも」と焦りが出る。",
                        en: "I feel anxious that I might be the only one falling behind.",
                        ko: "「나만 뒤처지는 건가」 하는 조급함이 올라온다.",
                        zh: "会焦虑「是不是只有我被落下了」。"
                    },
                    value: 'n'
                },
                {
                    text: {
                        ja: "刺激を受けるが、最後は自分の伸ばし方を考える。",
                        en: "I feel stimulated, then think about how I want to grow.",
                        ko: "자극은 받지만 결국 내 성장 방식을 생각한다.",
                        zh: "会受到刺激，但最后会思考自己的成长方式。"
                    },
                    value: 'm'
                }
            ]
        },
        {
            category: {
                ja: "表出アプローチ", en: "Approach Style", ko: "표출 어프로치", zh: "表出态度"
            },
            text: {
                ja: "オンラインの会話で、自分の考えに近い話題が出たときは？",
                en: "When an online conversation touches a topic close to your thoughts, what do you do?",
                ko: "온라인 대화에서 내 생각과 가까운 주제가 나왔을 때는?",
                zh: "线上聊天中出现和你想法很接近的话题时，你会？"
            },
            answers: [
                {
                    text: {
                        ja: "流れに入って、自分の視点も早めに差し込む。",
                        en: "I join the flow and add my perspective fairly quickly.",
                        ko: "흐름에 들어가 내 관점도 빠르게 보탠다.",
                        zh: "进入话题，很快加入自己的观点。"
                    },
                    value: 'a'
                },
                {
                    text: {
                        ja: "場の空気を見て、言えそうな隙があればそっと出す。",
                        en: "I read the room and speak only if a good opening appears.",
                        ko: "분위기를 보고 말할 틈이 있으면 조심히 꺼낸다.",
                        zh: "先观察气氛，有合适空隙才轻轻说出来。"
                    },
                    value: 'p'
                }
            ]
        },
        {
            category: {
                ja: "評価基準", en: "Evaluation Criteria", ko: "평가 기준", zh: "评价标准"
            },
            text: {
                ja: "SNSを続ける意味を感じるのは、どちらの瞬間に近い？",
                en: "Which moment makes SNS feel worth continuing for you?",
                ko: "SNS를 계속할 의미를 느끼는 순간은 어느 쪽에 가까운가요?",
                zh: "哪一种时刻更会让你觉得继续玩社交媒体有意义？"
            },
            answers: [
                {
                    text: {
                        ja: "フォロワーや閲覧数がじわじわ伸びて、積み上がりが見えたとき。",
                        en: "When followers or views steadily grow and I can see the accumulation.",
                        ko: "팔로워나 조회수가 조금씩 늘어 쌓이는 게 보일 때.",
                        zh: "粉丝数或浏览量慢慢增长，看得见积累的时候。"
                    },
                    value: 'o'
                },
                {
                    text: {
                        ja: "少人数でも濃い反応があり、自分の感覚が届いたと感じたとき。",
                        en: "When a small but deep reaction makes me feel my sensibility reached someone.",
                        ko: "소수라도 깊은 반응이 있어 내 감각이 닿았다고 느낄 때.",
                        zh: "即使人数不多，但有很深的回应，让你觉得自己的感觉传达到了。"
                    },
                    value: 's'
                }
            ]
        }
    ];

    // ==========================================
    // 4. 16タイプ定義 ＆ 静的フォールバック毒舌解説 (多言語)
    // ==========================================
    const typeDatabase = {
        pome: {
            emoji: "🐶",
            name: { ja: "かまってちゃん型ポメラニアン", en: "Whining Pomeranian", ko: "관심종자형 포메라니안", zh: "求关注型博美犬" },
            description: {
                ja: "他人の視線（視線泥棒なハッピーかまってちゃん）と客観的ステータスを渇望しつつ、自分からはアピールできない（ビビリなあんしん安全第一派）。しかし心は成長（意識高めな限界突破オタク）を望むアンバランス種。",
                en: "Craving others' gaze (Attention-Stealer Happy Needy) and objective status, yet unable to assert yourself (Timid Safety-First Group), while secretly desiring inner growth (High-Conscious Limit-Break Otaku).",
                ko: "타인의 시선(시선강탈 해피 관심종자)과 객관적 스펙을 갈망하면서도, 정작 스스로 어필하지는 못하는(소심한 안심안전 제일파). 하지만 마음속으로는 성장(의식 높은 한계돌파 오타쿠)을 바라는 불안정한 존재.",
                zh: "渴望他人的目光（抢镜开心求关注狂）与客观地位，却无法主动展示自我（胆小安心安全第一派），同时内心深处又向往着个人成长（意识超前极限突破宅）的矛盾结合体。"
            },
            fallback: {
                ja: "「誰か私を褒めて！」と内心で絶叫しているくせに、スルーされる恐怖から自分では一切発信できないチキン。過去の栄光の数字を必死に握りしめ、物陰から誰かが「凄いね」と声をかけてくれるのをじっと監視しているイタい忠犬です。無駄に高いプライドのせいで身動きが取れなくなっていますよ。",
                en: "Dying for praise, yet you lack the courage to post. Clinging to status metrics, you watch from the shadows like a watchdog waiting for someone to walk by and call you 'brilliant.' Your useless pride is weighing you down.",
                ko: "칭찬은 받고 싶어 안달 났으면서 정작 스스로 올릴 배짱은 없다. 실적 숫자만 꽉 쥐고 지나가던 누군가가 '우수하네'라고 말해주길 그늘 속에서 충견처럼 감시하고 있군요. 쓸데없는 자존심만 너무 무겁습니다.",
                zh: "极度渴望被夸奖，却又没有勇气主动发声。只敢死死抱住数据，像只看门狗一样躲在暗处，监视着有没有人路过时顺口夸一句「你真棒」。你那毫无意义的自尊心实在太沉重了。"
            }
        },
        pomr: {
            emoji: "🐌",
            name: { ja: "殻にこもる自律カタツムリ", en: "Hermit Snail", ko: "껍질 속에 숨는 자율 달팽이", zh: "隐居自律小蜗牛" },
            description: {
                ja: "マイペースなゴーイングマイウェイ精神と客観的実績にストイックに向き合う。アピールせず（ビビリなあんしん安全第一派）静かに殻の中で「自分が最強」と自惚れる気難しい哲学者。",
                en: "Stoically facing My-Way Independent Spirit and objective results. Quietly bragging inside your shell (Timid Safety-First Group) that you are the best without advertising it.",
                ko: "마이웨이 마이페이스 정신과 객관적 성과를 스토익하게 마주함. 어필은 극도로 자제하며(소심한 안심안전 제일파) 조용히 껍질 속에서 '내가 최고'라며 자만하는 까다로운 철학자.",
                zh: "默默地坚持着我行我素我的路精神并追求客观成果。从不炫耀（胆小安心安全第一派），只是静静地躲在壳里自恋地认为「我才是最强的」的孤僻哲学家。"
            },
            fallback: {
                ja: "「私は他人の評価なんて興味ない、成長しか追わない」とスカしたツラで嘯く、自称・孤高の天才。自分が世界で一番優秀だと本気で信じ込んでいるので、他人が自分を神格化して崇め奉らない現状に、殻の中でイライラしながら怒り狂っています。",
                en: "A snail posing as a lonely sage claiming to only care about results. Convinced you're superior, you pretend to reject lukewarm opinions, but inside you're raging at a world that refuses to bow down to your secret genius.",
                ko: "'나는 오직 성과와 성장만을 쫓는다'고 으스대는 외로운 현자 행세 달팽이. 자신이 가장 뛰어나다고 믿고 있기에 남들의 미지근한 평가는 거부하는 척하지만, 본심은 자신에게 굴복하지 않는 세상에 분노하고 있습니다.",
                zh: "自诩为「只追求成果与成长」的孤高贤者。因为坚信自己是最优秀的，所以表面上对他人平庸的评价不屑一顾，内心其实在为这个世界没有向你屈服而咬牙切齿。"
            }
        },
        pone: {
            emoji: "🐩",
            name: { ja: "怯える甘えん坊トイプー", en: "Frightened Toy Poodle", ko: "겁먹은 응석받이 토이푸들", zh: "胆怯撒娇贵宾犬" },
            description: {
                ja: "安心安全な居場所（ビビリなあんしん安全第一派）と視線泥棒なハッピーかまってちゃん欲求にしがみつく。自ら動かず、客観的実績の鎧で武装して誰かが拾ってくれるのを待つタイプ。",
                en: "Clinging to safe places (Timid Safety-First Group) and Attention-Stealer Happy Needy needs. Staying passive, waiting with objective armor for someone to save you.",
                ko: "안심하고 쉴 곳(소심한 안심안전 제일파)과 시선강탈 해피 관심종자 성향에 집착함. 먼저 나서지 않고 객관적 실적의 갑옷을 입은 채 누군가 자신을 데려가 주길 기다리는 타입.",
                zh: "死死抓住安全港湾（胆小安心安全第一派）以及抢镜开心求关注狂の渴望不放。自己不愿迈出一步，只敢披着客观成果的外衣，等待着别人来拯救自己。"
            },
            fallback: {
                ja: "社会的な死（孤立）を病的に恐れ、他人のいいねや評価という酸素ボンベなしでは息もできない寄生生物。自分を売り込む度胸は皆無なので、過去の実績や学歴などのラベルを全身に貼り付け、物陰でプルプル震えながら「誰か私を養って」と物乞いしています。",
                en: "Trembling with fear of exclusion, you crave praise like an oxygen tank. Lacking the courage to pitch yourself, you just wear credentials like armor, shivering and silently begging: 'Someone rescue me.'",
                ko: "사회에서 버림받을까 두려움에 떨며 타인의 평가라는 산소 호흡기를 찾고 있습니다. 스스로 어필할 용기는 눈곱만큼도 없기에 그저 객관적 스펙만 껴입은 채 '누구 없어요?'라며 떠는 응석받이입니다.",
                zh: "一边对被社会排挤的恐惧战战兢兢，一边疯狂渴求他人认可的供氧。因为没有丝毫自我展示的勇气，只能用客观标签包装自己，像个缩在角落瑟瑟发抖哭喊「谁来帮帮我」的巨婴。"
            }
        },
        ponr: {
            emoji: "🐨",
            name: { ja: "要領のいい保身コアラ", en: "Sly Protector Koala", ko: "처세 좋은 보신 코알라", zh: "善于保身的树袋熊" },
            description: {
                ja: "安全第一（ビビリなあんしん安全第一派）で自分の評価だけは守りたいマイペースなゴーイングマイウェイ精神。客観的な数字やルールを盾にして絶対に傷つかない位置をキープする。",
                en: "Seeking safety (Timid Safety-First Group) while holding onto My-Way Independent Spirit. Hiding behind figures and rules to stay out of harm's way.",
                ko: "안전제일(소심한 안심안전 제일파)로 자기 평가만은 지키고 싶은 마이웨이 마이페이스 정신. 객관적인 수치와 규칙을 방패 삼아 절대로 상처받지 않는 포지션을 사수하는 인물.",
                zh: "奉行安全第一（胆小安心安全第一派），极力维护自身评价的我行我素我的路精神。用客观数据 and 规则做盾牌，将自己安放在绝对不会受伤的安全位置。"
            },
            fallback: {
                ja: "傷つくのが怖すぎて、絶対に責任を取らなくて済む安全シェルターから一歩も出ない究極のヘタレ。他人の実績や既存のルールを盾にして「私は悪くありません」と予防線を張りまくる保身のプロですが、その徹底した逃げ腰人生、薄っぺらすぎて虚しくないですか？",
                en: "Pathologically terrified of hurt, you watch the world from a bulletproof zone holding metrics as a shield. Your lazy self-defense is genius, but your shallow life will eventually bore you to death.",
                ko: "상처받는 걸 병적으로 두려워해 책임질 필요가 없는 안전지대에서 수치와 실적이란 방패 뒤에 숨어 세상을 관찰합니다. 보신술 하나는 천재적이지만 그 인생の 얄팍함에 언젠가 본인조차 질려버릴 겁니다.",
                zh: "病态般地害怕受伤。躲在绝对不需要承担责任的安全地带，拿着数据和成果 of 盾牌冷眼旁观。你的节能保身术堪称天下一绝，但如此空洞的人生，迟早有一天连你自己都会觉得无聊透顶。"
            }
        },
        psme: {
            emoji: "🐹",
            name: { ja: "エモさ渇望インフルエンサー予備軍", en: "Emo-Star Wannabe", ko: "감성 갈망 인플루언서 꿈나무", zh: "渴望情怀的预备网红" },
            description: {
                ja: "共感やエモさ（視線泥棒なハッピーかまってちゃん）と他人の称賛で精神を満たし、意識高めな限界突破オタクへ成長したいと願うが、受動的（ビビリなあんしん安全第一派）で動けない。",
                en: "Desiring emotional sparks (Attention-Stealer Happy Needy) and praise, wanting to grow (High-Conscious Limit-Break Otaku), but too timid (Timid Safety-First Group) to take action.",
                ko: "공감과 갬성(시선강탈 해피 관심종자) 및 타인의 찬사로 충전되어 의식 높은 한계돌파 오타쿠로 거듭나길 꿈꾸나, 소심함(소심한 안심안전 제일파) 때문에 꼼짝도 못 함.",
                zh: "用共鸣与情怀（抢镜开心求关注狂）以及他人的赞美滋养精神，渴望蜕变为意识超前极限突破宅。然而骨子里的被动与胆小（胆小安心安全第一派）让你根本无法迈步。"
            },
            fallback: {
                ja: "「私のエモい感性を誰か発見して絶賛して！」と夢見る、発信力ゼロのインフルエンサー気取り。スルーされるのが怖くて自分からは何も出せず、他人の投稿にせっせとイイネを配りながら、「早く私を見つけて崇めて」と不気味なテレパシーを送り続けています。",
                en: "You desperately want high-end doses of 'empathy' and 'praise,' but your passivity locks you up. As you double-tap others' posts, you send telepathic waves saying: 'Someone notice me!'",
                ko: "'에모한 공감'과 '남들의 찬사'라는 명품 비타민을 간절히 원하지만 소심함에 걸려 아무것도 올리지 못합니다. 남들 글에 하트만 누르면서 '빨리 날 알아채줘' 하고 텔레파시를 보낼 뿐입니다.",
                zh: "对「感性的共鸣」和「他人的盛赞」这种高级补药垂涎三尺，却因为被动诅咒而不敢发声。在给别人的帖子点赞的同时，默默在脑海里发送着「快来发现我」的怨念脑波。"
            }
        },
        psmr: {
            emoji: "🐈‍⬛",
            name: { ja: "孤高のパステル黒猫", en: "Aloof Pastel Black Cat", ko: "고고한 파스텔 검은 고양이", zh: "高冷的粉彩黑猫" },
            description: {
                ja: "独自の主観的世界観を育み、マイペースなゴーイングマイウェイ精神でのみ成長（意識高めな限界突破オタク）する。アピールもしない（ビビリなあんしん安全第一派）ミステリアス種。",
                en: "Nurturing an original subjective worldview, growing (High-Conscious Limit-Break Otaku) only through My-Way Independent Spirit. Unassertive (Timid Safety-First Group) and mysterious.",
                ko: "독자적인 감성 세계관을 키우며 오직 마이웨이 마이페이스 정신으로만 성장(의식 높은 한계돌파 오타쿠)함. 자신을 알리려 하지 않는(소심한 안심안전 제일파) 미스터리 고양이.",
                zh: "孕育着独特的个人主观世界，完全依靠我行我素我的路精神来获得成长（意识超前极限突破宅）。从不自我张扬（胆小安心安全第一派），极其神秘。"
            },
            fallback: {
                ja: "「凡人に私の高尚なセンスは理解できない」と斜に構え、自分の脳内ワールドで自家発電している痛々しい迷子。外へのアピールを拒絶しているため、周囲からは単なる「気難しくて絡みづらい陰キャ」として完全に空気扱いされています。それに気づかず孤高を気取っているのがおめでたいですね。",
                en: "Shut off in your own worldview and self-satisfaction, pretending you don't need anyone's understanding. With zero voice, you're forgotten as 'that quiet, stubborn person,' which is your ultimate shelter.",
                ko: "독자적인 뇌내 세계와 자기 만족으로 완전히 차단되어 타인의 이해 따윈 거부하는 척합니다. 아웃풋이 전혀 없기에 주변에선 '그냥 까탈스럽고 조용한 애'로 잊혔으며, 그 소외감이 본인에겐 최고의 벙커입니다.",
                zh: "用独特的个人世界和自我感动画地为牢，摆出一副不需要任何人理解的姿态。发声力为零的你，在周围人眼中不过是个「性格古怪的闷葫芦」，并彻底被遗忘，而这正是你最享受的避风港。"
            }
        },
        psne: {
            emoji: "🐥",
            name: { ja: "見守られ待ちピヨちゃん", en: "Watch-Me Baby Chick", ko: "보살핌 대기조 삐약이", zh: "求关注的孵化小鸡" },
            description: {
                ja: "主観的なキャラクター愛と他人の保護（視線泥棒なハッピーかまってちゃん）を求める安全志向（ビビリなあんしん安全第一派）。自分からは一切アピールせず見守りを受ける。",
                en: "Seeking character love and safety (Timid Safety-First Group) through Attention-Stealer Happy Needy. Never marketing yourself, simply waiting to be nurtured.",
                ko: "주관적인 감정 이입과 타인의 따스한 시선(시선강탈 해피 관심종자)을 갈구하는 안전 지향형(소심한 안심안전 제일파). 자신은 움직이지 않고 그저 남이 챙겨주길 바람.",
                zh: "追求主观的角色魅力与他人的呵护（抢镜开心求关注狂），属于极度缺乏安全感（胆小安心安全第一派）类型。自己摆脱不掉被动，只静静等待他人的守护。"
            },
            fallback: {
                ja: "自分は一切の努力もリスクテイクもしないくせに、周囲から「可愛いね、守ってあげる」と無条件でチヤホヤされるのを待っている甘えたヒヨコ。他人の善意と優しさを吸い尽くすことしか考えておらず、永遠に他力本願の温室でぬくぬくしていたいだけの幼児退行モンスターです。",
                en: "An infant type feeding on subjective personality and others' free kindness. You never extend a hand, simply scanning the horizon for a warm cradle where someone will pet you and call you cute.",
                ko: "주관적인 오구오구 감성과 타인의 대가 없는 친절을 빨아먹는 영아형. 본인은 절대 먼저 베풀지 않고 '어머 귀여워라, 챙겨줄게'라며 누군가 쓰다듬어 줄 따뜻한 요람만 필사적으로 수색합니다.",
                zh: "一味吸食主观特质与他人无偿善意的幼儿型。自己绝不伸手，只用尽全力去搜寻那张能听到别人夸「真可爱、好想保护你」并摸摸头的心灵温床。"
            }
        },
        psnr: {
            emoji: "🐼",
            name: { ja: "マイペースな引きこもりパンダ", en: "Low-Energy Panda", ko: "마이웨이 방구석 판다", zh: "我行我素宅地熊猫" },
            description: {
                ja: "自分の感性のみを信じ、他人の視線や成長を必要としない安全志向（ビビリなあんしん安全第一派）のマイペースなゴーイングマイウェイ精神。省エネで静かに余生を過ごす。",
                en: "Believing only in your own senses, needing no gaze or growth, living in My-Way Independent Spirit (Timid Safety-First Group). Quietly idling through life on energy-saving mode.",
                ko: "내 감성만 믿으며, 타인의 평판이나 성장도 필요 없는 안전 우선형(소심한 안심안전 제일파)의 마이웨이 마이페이스 정신. 에너지 절약으로 편안히 여생을 보냄.",
                zh: "只相信自己的感性，既不需要他人的目光也不在乎个人成长，安全至上（胆小安心安全第一派）的我行我素我的路精神。用节能模式静静地安度余生。"
            },
            fallback: {
                ja: "「私は私、他人は他人」と達観したフリをして、成長からも他者との関わりからも全力で逃避している引きこもりパンダ。省エネという名の怠惰の極みであり、世間の荒波からソッコーでログアウトして、自分の狭い趣味の世界だけを咀嚼して一生を終える予定のようです。",
                en: "A sleeping panda who thinks your taste is absolute, and cares zero about evaluation or growth. The peak of energy-saving defense: you quietly log out and munch on your tiny world.",
                ko: "자기 감각만 최고며, 남들의 채점표도 본인의 성장조차도 진심으로 아웃 오브 안중인 채 잠만 자는 판다. 절약형 처세의 극치로, 세상의 소음에서 조용히 로그아웃해 자신만의 세상을 갉아먹고 있습니다.",
                zh: "坚信只有自己的感性是绝对的，同时对别人的评价甚至自己的成长都打心底觉得无所谓的瞌睡熊猫。节能保身的终极形态，悄无声息地从世界的喧嚣中登出，津津有味地咀嚼着自己的小世界。"
            }
        },
        aome: {
            emoji: "🦁",
            name: { ja: "マウンティング突撃ライオン", en: "Flexing Charging Lion", ko: "마운팅 돌격 사자", zh: "炫耀突击狂暴狮" },
            description: {
                ja: "実績や数値と他者承認（視線泥棒なハッピーかまってちゃん）を求め、誰よりも能動的（意識高めな限界突破オタク）に自己アピールしながら成長したいと願うギラギラ種。",
                en: "Demanding results, metrics, and others' approval (Attention-Stealer Happy Needy), actively pushing yourself (High-Conscious Limit-Break Otaku) while hunting for growth.",
                ko: "성과 수치와 타인 승인(시선강탈 해피 관심종자)을 좇아, 누구보다 능동적으로(의식 높은 한계돌파 오타쿠) 자신을 세일즈하며 성장하고픈 야망의 포식자.",
                zh: "追求数据与他人的认可（抢镜开心求关注狂），比任何人都更加主动地表现自我（意识超前极限突破宅），渴望在攀登的过程中获得成长。"
            },
            fallback: {
                ja: "「私の努力と実績を見よ！」と全速力でマウンティングの山を駆け登る、自己アピール過剰の爆走ライオン。自分が主役で、常にスポットライトを浴びていないと死んでしまう病気です。いくら「いいね」をもらっても底なし沼のように乾ききっており、一生承認欲求に追われて走り続ける哀れなモンスター。",
                en: "A passionate lion sprinting up the climbing wall with metrics in one hand and compliments in the other. Your display of hustle must be watched by all. Your hunger is infinite; satisfy it once, and you roar again in seconds.",
                ko: "실적 데이터와 남들의 찬양을 양손에 쥐고 마운팅 정상을 향해 질주하는 열혈 사자. 내가 가장 애쓰고 자라는 걸 남들이 생생히 중계해 줘야만 직성이 풀립니다. 승인 굶주림이 심해 잠시 채워져도 금세 으르렁거립니다.",
                zh: "双手捧着成就数据与他人的鲜花，全速向着阶层顶端攀登的热血狂狮。必须让所有人目睹你最努力、最优秀的姿态。对认同感的饥饿感极强，即使短暂获得满足，也很快会再次焦虑吼叫。"
            }
        },
        aomr: {
            emoji: "🐺",
            name: { ja: "無自覚マニアックオオカミ", en: "Aggressive Solo Wolf", ko: "무자각 매니악 늑대", zh: "无意识狂热孤狼" },
            description: {
                ja: "成長欲求（意識高めな限界突破オタク）が高く、実績数値と自己承認（マイペースなゴーイングマイウェイ精神）を持つ。能動的なアピールは行う戦闘型。",
                en: "Highly ambitious (High-Conscious Limit-Break Otaku), holding solid output and self-standard (My-Way Independent Spirit). An active, combative hunter.",
                ko: "성장 의욕(의식 높은 한계돌파 오타쿠)이 매우 높으며, 확고한 결과물과 자기 기준(마이웨이 마이페이스 정신)을 갖춤. 능동적 아필에 주저함이 없는 전투형 늑대.",
                zh: "拥有强烈的成长欲求（意识超前极限突破宅），具备过硬的成果与自我标准（我行我素我的路精神）。会进行积极展示的战斗型人格。"
            },
            fallback: {
                ja: "圧倒的な成長アピールと成果をこれでもかと見せつけつつ、「他人の評価なんか眼中にない」とクールを装う一番めんどくさい自惚れオオカミ。他人に認められること以上に、「私、お前ら凡人とは次元が違うから」とマインドマウンティングをして悦に浸っている痛々しいナルシストです。",
                en: "A toxic show-off flexing accomplishments and growth speed while muttering 'I don't care what you think.' You care less about being loved than getting drunk on your own self-assessed dominance.",
                ko: "자랑스러운 실적และ 압도적 성장 스피드를 있는 대로 동네방네 자랑하면서 '남의 눈초리 따윈 아무래도 좋은데'라며 내숭 떠는 가장 성가신 부류. 인정받기보단 내가 한참 위에 있다는 서열질에 취해 있습니다.",
                zh: "一边向周围人疯狂炫耀自己引以为傲的成果与惊人的成长速度，一边装模作样地嘀咕着「反正别人的评价我根本不在乎」，简直是死要面子。比起被认同，你更沉醉于自己居高临下的优越感。"
            }
        },
        aone: {
            emoji: "🦜",
            name: { ja: "手柄泥棒アピールオウム", en: "Credit-Claiming Parrot", ko: "공치사 어필 앵무새", zh: "抢功大喇叭鹦鹉" },
            description: {
                ja: "他人の視線（視線泥棒なハッピーかまってちゃん）と安息（ビビリなあんしん安全第一派）が最優先。自分の少しの実績数値をこれでもかと吹聴し、実力以上の評価を狙う。",
                en: "Attention-Stealer Happy Needy and safety (Timid Safety-First Group) are your oxygen. Loudly broadcasting minor results to hook a rating beyond your pay grade.",
                ko: "남의 시선(시선강탈 해피 관심종자)과 안락한 포지션(소심한 안심안전 제일파)이 생명선. 소소한 내 실적을 귀가 따갑게 불어대며 능력 이상의 버블 평가를 노리는 기회주의자.",
                zh: "将他人的视线（抢镜开心求关注狂）与自身安全（胆小安心安全第一派）视为生命线。疯狂吹嘘自己取得的丁点数据，试图以此谋取超出实力的地位。"
            },
            fallback: {
                ja: "嫌われる恐怖に怯えながらも、コミュニティの主導権を握りたくて必死にデカい声でアピールを繰り返す、手柄泥棒オウム。他人の功績やちょっとした実績をさも「自分がやりました」風にデコレーションして吹聴する、中身スカスカの拡声器タイプです。",
                en: "Terrified of being hated, you push active marketing just to secure a safe spot in the club. Exaggerating others' ideas or tiny numbers, you're a loud bird fighting for a nest.",
                ko: "집단에서 미움받을까 전전긍긍하면서 정작 권력의 안전한 코어에 서기 위해 요란한 어필을 늘어놓습니다. 남의 기획안이나 푼돈 같은 숫자를 과장해 소란을 피우며 생존 공간을 확보하려는 시끄러운 새입니다.",
                zh: "因为害怕被群体排斥，同时为了确保自己在社群中的核心安全地位，不断进行夸张的主动宣传。把别人的创意或微不足道的数据无限放大并四处声张，拼命巩固立足之地的噪杂鸟类。"
            }
        },
        aonr: {
            emoji: "🐕",
            name: { ja: "合理的ルールポリス柴犬", en: "Rational Rule Police Dog", ko: "합리적 규칙 경찰 시바견", zh: "理性规则哨兵柴犬" },
            description: {
                ja: "安全と保身（ビビリなあんしん安全第一派）のため、実績数値と自己ルール（マイペースなゴーイングマイウェイ精神）をフル稼働し、能動的アプローチで周囲を管理・統制する。",
                en: "For protection (Timid Safety-First Group), using results and rules (My-Way Independent Spirit) to actively monitor and organize your environment.",
                ko: "신분 보장(소심한 안심안전 제일파)을 위해 성과 지표와 사내 룰(마이웨이 마이페이스 정신)을 악착같이 가동함. 주도적으로 주변を 관리하고 규제하는 헌병견.",
                zh: "为了自身的安全与保身（胆小安心安全第一派），物尽其用地压榨客观数据与个人准则（我行我素我的路精神），以积极的态度对周围进行规制与统治。"
            },
            fallback: {
                ja: "自分の安全と利益（ビビリなあんしん安全第一派）を絶対防衛するため、ルールやマニュアルを棍棒のように振り回して他者を管理・攻撃（能動的ゴリゴリ系）する冷酷なポリス柴犬。客観的な「正論」という防弾チョッキを着てマウントを取り、絶対に責任の及ばない安全な特等席にドカッと腰掛けています。",
                en: "To secure personal safety and gains, you aggressively run rule systems to build a fortress. Using objective correctness as a weapon, you lecture everyone and sit on a comfortable throne like a cold guard dog.",
                ko: "자기 안전과 몫을 챙기기 위해 제약과 매뉴얼을 칼같이 단속하고 들이밀며 난공불락 성벽을 쌓습니다. 본인의 객관적 결백함을 무기 삼아 남을 훈계하며 꿀 빠는 자리에 앉은 차가운 경비견입니다.",
                zh: "为了牢牢守护自己的安全与既得利益，蛮横地制定并推行各种规则体制以搭建避难所。把客观上的「正确性」当作挡箭牌四处怼人，稳坐于最稳妥、最舒服的防御高台的冷酷守卫犬。"
            }
        },
        asme: {
            emoji: "🦚",
            name: { ja: "ドヤ顔クリエイティブ孔雀", en: "Showy Creative Peacock", ko: "거들먹거리는 크리에이티브 공작", zh: "得意洋洋的文艺孔雀" },
            description: {
                ja: "感性やエモさ（視線泥棒なハッピーかまってちゃん）を能動的に振りまき、他人の絶賛を浴びながら意識高めな限界突破オタクへと成長したい自己愛モンスター。",
                en: "Actively spreading aesthetic vibes (Attention-Stealer Happy Needy), feeding on praise to grow as a High-Conscious Limit-Break Otaku.",
                ko: "자신의 재능과 갬성(시선강탈 해피 관심종자)을 거침없이 발산하며, 남들의 숭배를 마시며 의식 높은 한계돌파 오타쿠로 진화하고픈 자기애 과잉 포식자.",
                zh: "将自身的情怀与感性（抢镜开心求关注狂）当成羽毛四处招摇，渴望在别人的瞩目中成长为意识超前极限突破宅的极度自恋怪。"
            },
            fallback: {
                ja: "「私のこの唯一無二のエモい感性とセンスを見て！」と羽をバサバサ広げて踊り狂う、自己表現過剰な孔雀。他人の「センス良すぎ！」という絶賛（視線泥棒なハッピーかまってちゃん）だけが主食で、それがないと干からびます。他人に消費され、飽きられるまで踊り続ける終わりのない悲劇のピエロ。",
                en: "Spreading wings screaming 'Watch my deep emotions and growth!', feeding and swelling on comments calling you 'so artistic.' You won't stop dancing until your vibes are totally sucked dry by spectators.",
                ko: "'내 남다른 감각과 진화를 봐줘!'라며 활짝 꼬리를 펴고 '센스 만점!'이라는 남들의 물개박수를 주워 먹고 부풀어 오르는 자기애 덩어리. 내 감성이 남들에게 다 닳아 없어질 때까지 댄스를 멈출 줄 모릅니다.",
                zh: "张开绚丽的尾羽向全世界高喊「快看我这无与伦比的才华与成长！」，吸食着别人打心底奉上的「你真有品味」等赞辞而自我膨胀。在你的感性被观众压榨干净之前，你是绝对无法停止这支求偶舞的。"
            }
        },
        asmr: {
            emoji: "🦔",
            name: { ja: "我道突っ走りハリネズミ", en: "Edgy Solo Hedgehog", ko: "독불장군 질주 고슴도치", zh: "独来独往的狂奔刺猬" },
            description: {
                ja: "強い自己基準（マイペースなゴーイングマイウェイ精神）と独自の感性を持ち、成長（意識高めな限界突破オタク）のために能動的に我が道を切り拓くトゲだらけのクリエイター。",
                en: "Holding strong self-satisfaction (My-Way Independent Spirit) and unique taste, actively creating paths for Growth (High-Conscious Limit-Break Otaku). A prickly designer.",
                ko: "굳건한 자부심(마이웨이 마이페이스 정신)과 남다른 안목을 지님. 한계 돌파 오타쿠적 성장만을 위해 공격적으로 마이웨이를 돌파하는 가시 돋친 크리에이터.",
                zh: "怀抱极强的个人准则（我行我素我的路精神）与奇妙的感性，为了实现自我价值（意识超前极限突破宅）而横冲直撞、浑身是刺的开路者。"
            },
            fallback: {
                ja: "「お前ら凡人の理解なんか1ミリも要らん」と周囲を拒絶し、己の絶対的な感性（主観エモ至上主義）と自己成長（意識高めな限界突破オタク）のために他者を威嚇（能動的ゴリゴリ系）するトゲトゲ尖りすぎモンスター。周囲に攻撃的な毒を吐き散らしながら進むため、誰も寄り付かない孤独なイタい芸術家ロードを爆進中。",
                en: "Ignoring others' validation, actively attacking for your personal aesthetics and self-growth. Poking needles into everyone you pass, you walk a lonely, scarred path of a self-proclaimed genius.",
                ko: "남의 시선이나 비판은 전면 무시하고 본인의 절대 미학(Subjective)과 커리어(Growth)를 위해 주동적으로 가시를 세우는 고슴도치. 온 사방에 생채기를 내며 걷기에 상처뿐인 고독한 예술가 행세입니다.",
                zh: "彻底无视他人的看法，为了自己那不可动摇的美学标准与个人价值实现，主动龇牙咧嘴宣示主权的刺猬。因为一路上会把尖刺无差别扎向所有路人，所以走的是一条伤痕累累、只配孤独一生的「伪天才之路」。"
            }
        },
        asne: {
            emoji: "🐕‍🦺",
            name: { ja: "依存型バズりチワワ", en: "Viral-Desperate Chihuahua", ko: "의존성 관심 갈구 치와와", zh: "病态求关注的抖动吉娃娃" },
            description: {
                ja: "情緒的な安心感（ビビリなあんしん安全第一派）と愛されたい欲求（視線泥棒なハッピーかまってちゃん）を満たすため、能動的にかまってアピールを繰り返すモンスター。",
                en: "Seeking safety (Timid Safety-First Group) and love (Attention-Stealer Happy Needy). Desperately spamming active shouts to trigger validation.",
                ko: "정서적 유대(소심한 안심안전 제일파)와 예쁨 받고 싶은 욕망(시선강탈 해피 관심종자)을 먹으려, 극성맞게 치대며 애교를 남발하는 귀찮은 멍뭉이.",
                zh: "为了填补情感安全感的缺失（胆小安心安全第一派）以及渴望被爱的诉求（抢镜开心求关注狂），频繁且主动地采取抱大腿等行为的黏人小妖精。"
            },
            fallback: {
                ja: "愛されたい、居場所が欲しいという寂しさ（ビビリなあんしん安全第一派）から、なりふり構わず「構って！」とSNSで暴れる（能動的ゴリゴリ系）メンヘラチワワ。他人の目を引くためならお気持ち表明や過激な自虐も厭わず、キャンキャン吠えながら優しくしてくれるカモを血眼で探しています。",
                en: "Driven by a desperate urge to be loved and secure, you pitch yourself with zero shame. You'll ruin your own character to catch eyes, yapping loudly while chasing anyone who gives you a scrap of attention.",
                ko: "사랑받고 보호받고 싶단 일념하에 물불 안 가리고 극성맞은 자기 광고를 지속합니다. 이목을 끌 수 있다면 망가지는 것도 불사하며, 컹컹 짖으며 간식 주는 집사를 졸졸 따라다니는 반려견 신세입니다.",
                zh: "脑子里只有「好想被爱、好想安全」这档子事，甚至连脸皮都不要地进行着极端招摇。为了博眼球不惜自毁人设，一边神经质地嚎叫一边紧追着任何愿意理睬你的人不放。"
            }
        },
        asnr: {
            emoji: "🐖",
            name: { ja: "頑固なマイキャラ黒豚", en: "Stubborn Unique Boar", ko: "고집불통 마이캐릭터 흑돼지", zh: "顽固的人设小野猪" },
            description: {
                ja: "独自のキャラ（マイペースなゴーイングマイウェイ精神）を能動的に貫き、自己基準で安息（ビビリなあんしん安全第一派）を得る。他人のアドバイスは全てノイズとして弾き返す。",
                en: "Actively enforcing your brand (My-Way Independent Spirit) to acquire safety (Timid Safety-First Group) under self-satisfaction. Bouncing off others' feedback as noise.",
                ko: "독특한 내 이미지(마이웨이 마이페이스 정신)를 우격다짐으로 밀어붙여 자기 방어(소심한 안심안전 제일파)를 획득함. 타인의 훈수는 모조리 잡음으로 스킵함.",
                zh: "强硬地贯彻自己独特的人设（我行我素我的路精神），在满足自我感觉的基础上获取安全感（胆小安心安全第一派）。把别人提出的意见当成放屁。"
            },
            fallback: {
                ja: "自分勝手なルールと独自の主観（主観エモ至上主義）を周囲に能動的（能動的ゴリゴリ系）に押し付け、何が何でも自己防衛（ビビリなあんしん安全第一派）と自己正当化（マイペースなゴーイングマイウェイ精神）を貫く頑固な黒豚。他人の親切なアドバイスはすべて「私に対する攻撃（ノイズ）」としてシャットアウトし、聞く耳を持たずに暴走し続けます。",
                en: "Pushing your personal rule and views onto others, wrapping yourself in safety and absolute self-assessment. Bouncing all advice away as useless static, yapping your own theories forever.",
                ko: "나만의 질서와 감성을 남에게 억지로 주입하며 자가 보신과 절대적 자의식 과잉을 달성합니다. 충고는 단 한 귀로도 듣지 않고 오로지 자기 논설만 핏대 세워 떠들어 대는 쇠고집입니다.",
                zh: "将个人准则与主观意志强行输出给他人，借此来实现自我防卫与绝对的迷之自信。把所有的善意忠告当作杂音屏蔽，永远在那里唾沫横飞地宣扬自己那一套神逻辑。"
            }
        }
    };

    // ==========================================
    // 5. 言語切り替え処理 (i18n Binder)
    // ==========================================
    function updateLanguage() {
        const data = i18n[state.lang];
        if (!data) return;

        // ドキュメントタイトル
        document.title = data.appTitle;

        // UI テキスト置換
        const ids = [
            'appTitle', 'appSubtitle', 'labelNickname', 'labelAge',
            'startDiagnosisBtn', 'resultTitleLabel', 'aiCommentTitleLabel',
            'exportBtn', 'exportHint', 'shareBtn', 'retryBtn',
            'lockTitle', 'lockText', 'premiumKeyLabel', 'unlockBtn',
            'iosModalTitle', 'iosModalText', 'iosStartBtn',
            'chekiSerialTitle',
            'saveModalTitle', 'saveModalText', 'saveModalShareBtn',
            'saveModalDownloadBtn', 'saveModalCloseBtn',
            'detailedReportTitle', 'detailedReportLossCopy',
            'detailedReportLockedTitle', 'detailedReportLockedText',
            'detailedReportSaveBtn', 'detailedReportPurchaseBtn'
        ];

        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el && data[id]) {
                el.textContent = data[id];
            }
        });

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key && data[key]) {
                el.textContent = data[key];
            }
        });

        // プレースホルダーの多言語化
        const nicknameInput = document.getElementById('nicknameInput');
        if (nicknameInput) nicknameInput.placeholder = data.placeholderNickname;

        // 年齢選択肢の多言語インジェクション
        const ageSelect = document.getElementById('ageSelect');
        if (ageSelect) {
            const currentVal = ageSelect.value;
            ageSelect.innerHTML = '';
            data.ages.forEach((ageText, idx) => {
                const opt = document.createElement('option');
                opt.value = idx.toString();
                opt.textContent = ageText;
                ageSelect.appendChild(opt);
            });
            // 選択値をキープ
            if (currentVal !== '') {
                ageSelect.value = currentVal;
            }
        }

        // 診断中画面の更新 (進行中の場合)
        if (state.currentQuestionIndex < questions.length && document.getElementById('questionView').classList.contains('active')) {
            showQuestion();
        }

        // 診断結果画面の更新 (結果表示中の場合)
        if (state.typeCode && document.getElementById('resultView').classList.contains('active')) {
            applyResultUI();
            renderLocalizedAiFallback(state.typeCode, state.lang);
            prepareResultAdSlot();
        }

        // 結果後導線、フッター、静的ラベルの更新
        const aiBox = document.getElementById('aiCommentaryBox');
        if (aiBox) aiBox.setAttribute('data-ai-label', data.aiBadge);

        const approvalMeterTitle = document.getElementById('approvalMeterTitle');
        if (approvalMeterTitle) approvalMeterTitle.textContent = data.approvalMeterTitle;

        const meterLabels = document.querySelectorAll('.approval-meter-emoji-row span');
        [data.meterLow, data.meterMiddle, data.meterHigh].forEach((label, idx) => {
            if (meterLabels[idx]) meterLabels[idx].textContent = label;
        });

        const chekiScoreLabel = document.getElementById('chekiScoreLabel');
        if (chekiScoreLabel) chekiScoreLabel.textContent = data.chekiScoreLabel;

        const growthTitle = document.querySelector('.result-growth-title');
        if (growthTitle) growthTitle.textContent = data.resultGrowthTitle;

        document.querySelectorAll('.result-growth-grid a').forEach((link, idx) => {
            const item = data.resultGrowthLinks[idx];
            if (!item) return;
            link.textContent = item.label;
            link.href = withLangParam(item.href);
        });

        const footerLinks = document.querySelectorAll('.site-footer a');
        const footerData = [
            { href: 'privacy.html', label: data.footerLinks.privacy },
            { href: 'contact.html', label: data.footerLinks.contact },
            { href: 'about.html', label: data.footerLinks.about },
            { href: 'articles/index.html', label: data.footerLinks.articles }
        ];
        footerLinks.forEach((link, idx) => {
            const item = footerData[idx];
            if (!item) return;
            link.textContent = item.label;
            link.href = withLangParam(item.href);
        });

        const consentText = document.querySelector('#consentBanner .consent-text');
        if (consentText) consentText.textContent = data.consentText;
        const consentReject = document.getElementById('consentRejectBtn');
        if (consentReject) consentReject.textContent = data.consentReject;
        const consentAccept = document.getElementById('consentAcceptBtn');
        if (consentAccept) consentAccept.textContent = data.consentAccept;

        updatePaidSaveCta();
        updateLockPurchaseCta();
        updateDetailedReportCard();
        renderCompatibilitySection();
        renderTalentSection();

        document.documentElement.lang = state.lang;

        // カウントダウン警告の更新
        updateCountdownBanner();
    }

    function updateCountdownBanner() {
        const banner = document.getElementById('countdownBanner');
        if (!banner) return;
        const data = i18n[state.lang];
        banner.innerHTML = data.countdownText.replace("{sec}", `<span>${state.countdown}</span>`);
    }

    function localizeDimensionTerms(text, lang = state.lang) {
        const data = i18n[lang] || i18n.ja;
        return String(text || '')
            .replace(/Need/g, data.dimensionNeed)
            .replace(/Growth/g, data.dimensionGrowth)
            .replace(/Internal/g, data.dimensionInternal)
            .replace(/External/g, data.dimensionExternal)
            .replace(/Subjective/g, data.dimensionInternal);
    }

    function createEmptyAnswerCounts() {
        return { p: 0, a: 0, o: 0, s: 0, m: 0, n: 0, e: 0, r: 0 };
    }

    function normalizeAnswerCounts(value) {
        const normalized = createEmptyAnswerCounts();
        if (!value || typeof value !== 'object') return normalized;

        ANSWER_KEYS.forEach(key => {
            const count = Number(value[key]);
            normalized[key] = Number.isFinite(count) && count > 0 ? Math.round(count) : 0;
        });

        return normalized;
    }

    function axisRatio(primary, secondary) {
        const p = Number(primary) || 0;
        const s = Number(secondary) || 0;
        const total = p + s;
        return total > 0 ? p / total : 0;
    }

    function calculateApprovalPercent() {
        const answers = normalizeAnswerCounts(state.answers);
        const externalScore = axisRatio(answers.e, answers.r);
        const activeScore = axisRatio(answers.a, answers.p);
        const objectiveScore = axisRatio(answers.o, answers.s);
        const belongingAnxietyScore = axisRatio(answers.n, answers.m);

        const rawScore =
            (externalScore * 0.45) +
            (activeScore * 0.25) +
            (objectiveScore * 0.2) +
            (belongingAnxietyScore * 0.1);

        return Math.max(0, Math.min(100, Math.round(rawScore * 100)));
    }

    function getAgeVariantKey(ageText = state.age) {
        const age = String(ageText || '').toLowerCase();
        if (age.includes('10')) return 'teen';
        if (age.includes('20')) return 'twenties';
        if (age.includes('30')) return 'thirties';
        if (age.includes('40') || age.includes('above') || age.includes('以上') || age.includes('이상')) return 'forties';
        return 'unknown';
    }

    function getScoreBand(score = state.approvalPercent) {
        const value = Number.isFinite(Number(score)) ? Number(score) : 0;
        if (value <= 0) return 'zero';
        if (value <= 14) return 'low';
        if (value <= 34) return 'mild';
        if (value <= 54) return 'medium';
        if (value <= 74) return 'high';
        return 'extreme';
    }

    function getPersonalizationCopy(lang = state.lang) {
        const copies = {
            ja: {
                age: {
                    teen: "10代らしく、周囲の反応がその日の気分に直結しやすい年代補正が出ています。",
                    twenties: "20代らしく、見られ方と自分の伸びしろを同時に気にする分岐です。",
                    thirties: "30代らしく、実績・役割・納得感のバランスで承認を測る傾向が出ています。",
                    forties: "40代以上らしく、場の信用や自分の基準を守る方向に承認欲求が現れています。",
                    unknown: "年齢を伏せたぶん、回答そのものの癖を強めに読んでいます。"
                },
                score: {
                    zero: "承認欲求度0%帯。見られたいというより、他人の評価圏からそっと離れたい反応です。",
                    low: "承認欲求度はかなり低め。反応は視界に入るものの、自分の世界を守る力が勝っています。",
                    mild: "承認欲求度は控えめ。気にはなるが、最後は自分の基準に戻れるタイプです。",
                    medium: "承認欲求度は中間。自分軸と他人の視線が綱引きしています。",
                    high: "承認欲求度は高め。反応・数字・居場所への感度が行動を押しています。",
                    extreme: "承認欲求度はかなり強め。通知と評価が心の操縦席に座りがちです。"
                },
                patternIntro: "回答傾向は「{parts}」。",
                patternUnknown: "回答履歴が復元できないため、タイプコードとスコア中心に読んでいます。",
                patternJoiner: " / ",
                labels: {
                    active: "自分から見せにいく",
                    passive: "見つけてほしい",
                    objective: "数字や実績で測る",
                    subjective: "空気や言葉で感じる",
                    growth: "成長で満たす",
                    safety: "置いていかれ不安で動く",
                    external: "他者評価で安心する",
                    internal: "自分基準で納得する"
                },
                aiScore: {
                    zero: "0%帯なので、承認欲求というより承認回避である。褒められる前に通知圏外へ避難し、心の平穏を守る省エネ設計だ。",
                    low: "低スコア帯なので、反応待ちで溶けるほど繊細ではない。ただし興味のある相手の一言だけは、地味に刺さって長持ちする。",
                    mild: "控えめスコア帯なので、見られたい気持ちを冗談で薄める癖がある。『別にいいけど』の裏で、少しだけ通知を見ている。",
                    medium: "中間スコア帯なので、自分軸と他人軸の押し合いが激しい。投稿ボタンの前で、脳内会議だけがやけに民主的だ。",
                    high: "高スコア帯なので、評価の気配に反射神経が良すぎる。数字と空気を同時に読もうとして、心の通知欄が常に満員である。",
                    extreme: "超高スコア帯なので、承認は嗜好品ではなく燃料である。反応が薄いだけで、自尊心の通信環境まで圏外になる。"
                },
                aiAge: {
                    teen: "10代補正で、仲間内の空気がかなり強く効く。軽い既読や未反応でも、脳内では小さな社会裁判が始まりやすい。",
                    twenties: "20代補正で、比較と自己実現が同時に走る。『自分らしく』と言いながら、同年代の伸びだけは妙に鮮明に見えている。",
                    thirties: "30代補正で、単なる人気よりも役割・実績・信用への執着が混ざる。承認欲求が少し社会人顔をしているだけだ。",
                    forties: "40代以上補正で、派手な反応よりも信頼と品位を気にする。とはいえ評価されたい心が消えたわけではなく、表札を付け替えただけである。",
                    unknown: "年齢非公開なので、年齢という逃げ道を使わせず回答だけを読む。隠した分だけ、癖はむしろ輪郭を持つ。"
                },
                aiPattern: "回答の核は「{parts}」。つまりこの結果はキャラ絵の雰囲気ではなく、あなたが選んだ逃げ方・見せ方・測り方の合成である。"
            },
            en: {
                age: {
                    teen: "The 10s age band adds a peer-response filter: reactions can swing the mood fast.",
                    twenties: "The 20s age band splits you between image management and personal growth.",
                    thirties: "The 30s age band makes approval pass through achievement, role, and self-respect.",
                    forties: "The 40s+ age band shifts approval toward trust, credibility, and personal standards.",
                    unknown: "Because age is hidden, the reading leans harder on the answer pattern itself."
                },
                score: {
                    zero: "Approval desire sits at 0%. This is less 'notice me' and more 'please leave my inner room untouched.'",
                    low: "Approval desire is very low. Reactions register, but your private standard wins first.",
                    mild: "Approval desire is mild. You notice attention, then usually return to your own baseline.",
                    medium: "Approval desire is in the middle. Your self-image and outside gaze are pulling the same rope.",
                    high: "Approval desire is high. Reactions, numbers, and belonging cues push your behavior.",
                    extreme: "Approval desire is intense. Notifications and evaluation tend to sit in the control seat."
                },
                patternIntro: "Answer pattern: {parts}.",
                patternUnknown: "Answer history was not restored, so this reading leans on type code and score.",
                patternJoiner: " / ",
                labels: {
                    active: "shows up actively",
                    passive: "wants to be discovered",
                    objective: "trusts numbers and proof",
                    subjective: "reads mood and words",
                    growth: "seeks growth",
                    safety: "moves from exclusion anxiety",
                    external: "rests on outside approval",
                    internal: "returns to self-approval"
                },
                aiScore: {
                    zero: "At 0%, this is not approval hunger but approval avoidance. You protect your peace by stepping outside the scoreboard before anyone can grade you.",
                    low: "With a low score, you are not melting over every reaction. Still, one well-placed comment from the right person can live rent-free.",
                    mild: "With a mild score, you downplay wanting attention as a joke. The notification check still happens; it is just dressed as irony.",
                    medium: "At midrange, self-approval and public gaze keep negotiating. The post button becomes a tiny committee meeting.",
                    high: "With a high score, your reflexes around feedback are too sharp. You read numbers and vibes at once, then call it intuition.",
                    extreme: "At the extreme end, approval is not a snack; it is fuel. A quiet post can make your whole self-image lose signal."
                },
                aiAge: {
                    teen: "The 10s filter makes peer atmosphere heavy. Even a small silence can feel like a referendum.",
                    twenties: "The 20s filter mixes comparison with self-making. You say 'my own path' while watching your peers with suspicious clarity.",
                    thirties: "The 30s filter turns popularity into role, record, and credibility. The desire is simply wearing business clothes.",
                    forties: "The 40s+ filter cares about trust and dignity more than flash. The need to be seen is still there; it just changed costume.",
                    unknown: "With age undisclosed, the answers have no demographic hiding place. The pattern becomes the evidence."
                },
                aiPattern: "The core pattern is {parts}. This result is not just the character image; it is the combined shape of how you hide, show, measure, and seek safety."
            },
            ko: {
                age: {
                    teen: "10대 보정으로 또래 반응이 그날의 기분에 바로 닿는 흐름이 보입니다.",
                    twenties: "20대 보정으로 보여지는 모습과 성장 욕구가 동시에 흔들리는 분기입니다.",
                    thirties: "30대 보정으로 성과, 역할, 납득감의 균형 속에서 인정 욕구가 드러납니다.",
                    forties: "40대 이상 보정으로 신뢰, 품위, 자기 기준을 지키는 쪽으로 인정 욕구가 나타납니다.",
                    unknown: "나이를 숨긴 만큼, 답변 패턴 자체를 더 강하게 읽었습니다."
                },
                score: {
                    zero: "인정욕구 0%대입니다. 봐 달라는 마음보다 평가권 밖에 있고 싶은 반응이 더 큽니다.",
                    low: "인정욕구는 매우 낮은 편입니다. 반응은 보이지만 자기 세계를 지키는 힘이 앞섭니다.",
                    mild: "인정욕구는 약한 편입니다. 신경은 쓰지만 결국 자기 기준으로 돌아옵니다.",
                    medium: "인정욕구는 중간입니다. 자기축과 타인의 시선이 줄다리기 중입니다.",
                    high: "인정욕구는 높은 편입니다. 반응, 숫자, 소속감의 신호가 행동을 밀어냅니다.",
                    extreme: "인정욕구가 상당히 강합니다. 알림과 평가가 마음의 운전석에 앉기 쉽습니다."
                },
                patternIntro: "답변 경향은 「{parts}」입니다.",
                patternUnknown: "답변 기록이 복원되지 않아 타입 코드와 점수 중심으로 읽었습니다.",
                patternJoiner: " / ",
                labels: {
                    active: "직접 보여주려 함",
                    passive: "발견되길 기다림",
                    objective: "숫자와 성과로 판단",
                    subjective: "분위기와 말로 느낌",
                    growth: "성장으로 채움",
                    safety: "뒤처짐 불안으로 움직임",
                    external: "타인 평가로 안심",
                    internal: "자기 기준으로 납득"
                },
                aiScore: {
                    zero: "0%대라서 인정욕구라기보다 인정 회피에 가깝습니다. 평가받기 전에 조용히 빠져나가 마음의 평온을 지키는 구조입니다.",
                    low: "낮은 점수대라 모든 반응에 녹아내리지는 않습니다. 다만 중요한 사람의 한마디는 오래 남습니다.",
                    mild: "약한 점수대라 관심받고 싶은 마음을 농담으로 흐립니다. 그래도 알림 확인은 합니다. 단지 아닌 척할 뿐입니다.",
                    medium: "중간 점수대라 자기 기준과 타인의 시선이 계속 협상합니다. 게시 버튼 앞에서 마음속 회의가 길어집니다.",
                    high: "높은 점수대라 피드백에 대한 반사신경이 너무 빠릅니다. 숫자와 분위기를 동시에 읽고 직감이라고 부릅니다.",
                    extreme: "최고 점수대라 인정은 간식이 아니라 연료입니다. 반응이 조용하면 자존감의 신호까지 약해집니다."
                },
                aiAge: {
                    teen: "10대 보정으로 또래 분위기의 영향이 큽니다. 작은 무반응도 마음속에서는 사회적 판정처럼 커질 수 있습니다.",
                    twenties: "20대 보정으로 비교와 자기실현이 동시에 달립니다. 내 길을 말하면서도 또래의 성장은 유난히 선명하게 보입니다.",
                    thirties: "30대 보정으로 단순한 인기보다 역할, 성과, 신뢰가 섞입니다. 인정욕구가 사회생활 말투를 배운 셈입니다.",
                    forties: "40대 이상 보정으로 화려한 반응보다 신뢰와 품위를 중시합니다. 인정받고 싶은 마음이 사라진 것은 아닙니다.",
                    unknown: "나이 비공개라서 도망갈 배경이 없습니다. 답변의 습관이 그대로 증거가 됩니다."
                },
                aiPattern: "핵심 패턴은 「{parts}」입니다. 이 결과는 캐릭터 분위기가 아니라, 당신이 고른 숨는 법, 보이는 법, 평가하는 법의 합성입니다."
            },
            zh: {
                age: {
                    teen: "10代年龄层会让同伴反应更直接影响当天情绪。",
                    twenties: "20代年龄层让你在外界形象和自我成长之间同时摇摆。",
                    thirties: "30代年龄层会把认同感放进成果、角色和自我说服的平衡里。",
                    forties: "40代以上年龄层更容易把认同感转向信任、体面和个人标准。",
                    unknown: "因为隐藏了年龄，所以这次更重视回答模式本身。"
                },
                score: {
                    zero: "认同感欲求为0%。这不是想被看见，而是想暂时离开别人的评价范围。",
                    low: "认同感欲求很低。你会看到反应，但保护自己世界的力量更强。",
                    mild: "认同感欲求偏弱。会在意，但最后通常回到自己的判断。",
                    medium: "认同感欲求处于中间。自我标准和外界目光正在拉扯。",
                    high: "认同感欲求偏高。互动、数字和归属感信号会推动你的行为。",
                    extreme: "认同感欲求非常强。通知和评价很容易坐到内心驾驶位上。"
                },
                patternIntro: "回答倾向是「{parts}」。",
                patternUnknown: "回答记录未能恢复，因此主要根据类型代码和分数判断。",
                patternJoiner: " / ",
                labels: {
                    active: "主动展示自己",
                    passive: "希望被发现",
                    objective: "用数字和成果判断",
                    subjective: "用氛围和话语感受",
                    growth: "通过成长获得满足",
                    safety: "由落后焦虑驱动",
                    external: "靠他人评价安心",
                    internal: "回到自我标准"
                },
                aiScore: {
                    zero: "0%区间更像是回避认同，而不是渴望认同。你在被评价前先撤出赛道，以此保护内心安静。",
                    low: "低分区间说明你不会为每个反应崩塌。但关键对象的一句话，仍然能在心里停留很久。",
                    mild: "偏低分区间会把想被看见包装成玩笑。通知还是会看，只是会装作顺手而已。",
                    medium: "中间分数代表自我标准和外界视线一直谈判。发布按钮前，内心会议格外漫长。",
                    high: "高分区间说明你对反馈太敏感。你同时读数字和氛围，然后把它称为直觉。",
                    extreme: "最高区间里，认同不是点心而是燃料。帖子一安静，自我形象的信号也跟着变弱。"
                },
                aiAge: {
                    teen: "10代补正让同伴气氛影响很大。一个小小的沉默，也容易被内心放大成社会审判。",
                    twenties: "20代补正把比较和自我实现混在一起。你说走自己的路，却把同龄人的进度看得格外清楚。",
                    thirties: "30代补正让人气变成角色、履历和可信度。认同欲只是换上了成熟外衣。",
                    forties: "40代以上补正更在意信任与体面，而不是表面热闹。想被认可的心没有消失，只是换了名字。",
                    unknown: "年龄未公开，所以无法用年龄解释自己。回答习惯本身就是证据。"
                },
                aiPattern: "核心模式是「{parts}」。这个结果不是角色图的气氛，而是你选择的隐藏方式、展示方式、衡量方式的组合。"
            }
        };

        return copies[normalizeLang(lang)] || copies.ja;
    }

    function getAnswerPatternParts(lang = state.lang) {
        const answers = normalizeAnswerCounts(state.answers);
        const total = ANSWER_KEYS.reduce((sum, key) => sum + (answers[key] || 0), 0);
        const copy = getPersonalizationCopy(lang);
        if (!total) return [];

        return [
            answers.a >= answers.p ? copy.labels.active : copy.labels.passive,
            answers.s >= answers.o ? copy.labels.subjective : copy.labels.objective,
            answers.m >= answers.n ? copy.labels.growth : copy.labels.safety,
            answers.r >= answers.e ? copy.labels.internal : copy.labels.external
        ];
    }

    function getAnswerPatternSummary(lang = state.lang) {
        const copy = getPersonalizationCopy(lang);
        const parts = getAnswerPatternParts(lang);
        if (!parts.length) return copy.patternUnknown;
        return copy.patternIntro.replace("{parts}", parts.join(copy.patternJoiner));
    }

    function getPersonalizedResultDescription(info, lang = state.lang) {
        if (!info) return "";
        const copy = getPersonalizationCopy(lang);
        const base = info.description[lang] || info.description.ja || "";
        const scoreLine = copy.score[getScoreBand()] || "";
        const ageLine = copy.age[getAgeVariantKey()] || "";
        const patternLine = getAnswerPatternSummary(lang);

        return [base, scoreLine, ageLine, patternLine].filter(Boolean).join(" ");
    }

    function getPersonalizedAiFallback(typeCode, lang = state.lang) {
        const info = typeDatabase[typeCode];
        if (!info) return "";
        const copy = getPersonalizationCopy(lang);
        const base = info.fallback[lang] || info.fallback.ja || "";
        const scoreLine = copy.aiScore[getScoreBand()] || "";
        const ageLine = copy.aiAge[getAgeVariantKey()] || "";
        const parts = getAnswerPatternParts(lang);
        const patternLine = parts.length
            ? copy.aiPattern.replace("{parts}", parts.join(copy.patternJoiner))
            : copy.patternUnknown;

        return [base, scoreLine, ageLine, patternLine].filter(Boolean).join(" ");
    }

    function normalizeLang(lang) {
        return SUPPORTED_LANGS.includes(lang) ? lang : 'ja';
    }

    function getInitialLang() {
        const params = new URLSearchParams(window.location.search);
        const urlLang = normalizeLang(params.get('lang'));
        if (urlLang !== 'ja' || params.has('lang')) return urlLang;

        try {
            const storedLang = normalizeLang(localStorage.getItem(LANG_STORAGE_KEY));
            if (storedLang) return storedLang;
        } catch (err) {
            console.warn('Language storage could not be read:', err);
        }

        const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
        return normalizeLang(browserLang);
    }

    function rememberLang() {
        try {
            localStorage.setItem(LANG_STORAGE_KEY, state.lang);
        } catch (err) {
            console.warn('Language storage could not be written:', err);
        }
    }

    function withLangParam(href) {
        const url = new URL(href, window.location.href);
        url.searchParams.set('lang', state.lang);
        return url.href;
    }

    function getSiteConfig() {
        return window.SNS_MONSTER_CONFIG || {};
    }

    function getPaidPremiumConfig() {
        const config = getSiteConfig();
        const stripeUrl = String(config.stripePermanentSaveUrl || '').trim();
        const price = Number(config.permanentSavePrice || 120);

        return {
            enabled: Boolean(config.enablePaidPremium && stripeUrl),
            stripeUrl,
            price: Number.isFinite(price) && price > 0 ? price : 120
        };
    }

    function getCompatibilityConfig() {
        const config = getSiteConfig();
        const stripeUrl = String(config.stripeCompatibilityUrl || '').trim();
        const price = Number(config.compatibilityPrice || 360);

        return {
            enabled: Boolean(config.enableCompatibilityFeature && stripeUrl),
            stripeUrl,
            price: Number.isFinite(price) && price > 0 ? price : 360
        };
    }

    function buildStripeUrlWithLocale(baseUrl) {
        if (!baseUrl) return "";

        const lang = normalizeLang(state.lang || document.documentElement.lang || "ja");
        const url = new URL(baseUrl);
        url.searchParams.set('locale', lang);
        return url.href;
    }

    function isPremiumLockEnabled() {
        const { enablePremiumLock } = getSiteConfig();
        return Boolean(enablePremiumLock || getPaidPremiumConfig().enabled);
    }

    function hasPermanentPaid() {
        return localStorage.getItem(PERMANENT_PAID_STORAGE_KEY) === 'true';
    }

    function readPaidTypeList(key) {
        try { const v = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(v) ? v : []; }
        catch (err) { return []; }
    }

    function addPaidType(key, typeCode) {
        if (!typeCode) return;
        const list = readPaidTypeList(key);
        if (!list.includes(typeCode)) {
            list.push(typeCode);
            try { localStorage.setItem(key, JSON.stringify(list)); } catch (err) {}
        }
    }

    function hasAnyCompatibilityPaid() { return readPaidTypeList(COMPAT_PAID_TYPES_KEY).length > 0; }
    function hasAnyTalentPaid() { return readPaidTypeList(TALENT_PAID_TYPES_KEY).length > 0; }

    // 課金は「購入時に診断していたタイプ」に紐付く。別タイプは未購入扱い。
    function hasCompatibilityPaid() {
        return Boolean(state.typeCode) && readPaidTypeList(COMPAT_PAID_TYPES_KEY).includes(state.typeCode);
    }

    function hasTalentPaid() {
        return Boolean(state.typeCode) && readPaidTypeList(TALENT_PAID_TYPES_KEY).includes(state.typeCode);
    }

    function updatePaidSaveCta() {
        const cta = document.getElementById('paidSaveCta');
        const btn = document.getElementById('btn-permanent-save') || document.getElementById('paidSaveBtn');
        const hint = document.getElementById('paidSaveHint');
        if (!cta || !btn || !hint) return;

        const paidConfig = getPaidPremiumConfig();
        const saved = hasPermanentPaid();
        const shouldShow = paidConfig.enabled && (!state.isPremium || saved);
        cta.hidden = !shouldShow;
        cta.classList.toggle('active', shouldShow);
        btn.hidden = saved;
        const btnTemplate = i18n[state.lang].btnPermanentSave || i18n[state.lang].paidSaveBtn || i18n.ja.btnPermanentSave || i18n.ja.paidSaveBtn;
        btn.textContent = btnTemplate
            .replace('{price}', paidConfig.price.toLocaleString('ja-JP'));
        hint.textContent = saved
            ? (i18n[state.lang].paidSavedLabel || i18n.ja.paidSavedLabel)
            : (i18n[state.lang].paidSaveHint || i18n.ja.paidSaveHint);
    }

    function updateLockPurchaseCta() {
        const btn = document.getElementById('btn-lock-stripe-purchase');
        const divider = document.getElementById('lockOrDivider');
        if (!btn || !divider) return;

        const shouldShow = getPaidPremiumConfig().enabled && !state.isPremium && !hasPermanentPaid();
        btn.hidden = !shouldShow;
        divider.hidden = !shouldShow;
        btn.textContent = i18n[state.lang].btnLockPurchase || i18n.ja.btnLockPurchase;
        divider.textContent = i18n[state.lang].orDivider || i18n.ja.orDivider;
    }

    function updateDetailedReportCard() {
        const section = document.getElementById('detailedReportSection');
        const card = document.getElementById('detailedReportCard');
        if (!section || !card || !state.typeCode || !typeDatabase[state.typeCode]) return;

        const copy = i18n[state.lang] || i18n.ja;
        const paidConfig = getPaidPremiumConfig();
        const unlocked = Boolean(state.isPremium || hasPermanentPaid());
        const info = typeDatabase[state.typeCode];
        const typeName = getCurrentTypeName(state.lang);
        const descriptionEl = document.getElementById('resultTypeDesc');
        const aiBox = document.getElementById('aiCommentaryBox');
        const description = descriptionEl && descriptionEl.textContent.trim()
            ? descriptionEl.textContent.trim()
            : localizeDimensionTerms(info.description[state.lang] || info.description.ja || "", state.lang);
        const aiText = aiBox && aiBox.textContent.trim()
            ? aiBox.textContent.trim()
            : localizeDimensionTerms(info.fallback[state.lang] || info.fallback.ja || "", state.lang);

        const nameEl = document.getElementById('detailedReportMonsterName');
        const scoreEl = document.getElementById('detailedReportScore');
        const descEl = document.getElementById('detailedReportTypeDesc');
        const aiEl = document.getElementById('detailedReportAiComment');
        const footerEl = document.getElementById('detailedReportFooter');
        const lockOverlay = document.getElementById('detailedReportLockOverlay');
        const saveBtn = document.getElementById('detailedReportSaveBtn');
        const purchaseBtn = document.getElementById('detailedReportPurchaseBtn');
        const lossCopy = document.getElementById('detailedReportLossCopy');
        const lockedTitle = document.getElementById('detailedReportLockedTitle');
        const lockedText = document.getElementById('detailedReportLockedText');

        if (nameEl) nameEl.textContent = typeName;
        if (scoreEl) scoreEl.textContent = `${copy.detailedReportScoreLabel || i18n.ja.detailedReportScoreLabel} ${state.approvalPercent}%`;
        if (descEl) descEl.textContent = description;
        if (aiEl) aiEl.textContent = aiText;
        if (footerEl) footerEl.textContent = copy.detailedReportFooter || i18n.ja.detailedReportFooter;
        if (lossCopy) lossCopy.textContent = unlocked
            ? (copy.detailedReportUnlockedText || i18n.ja.detailedReportUnlockedText)
            : (copy.detailedReportLossCopy || i18n.ja.detailedReportLossCopy);
        if (lockedTitle) lockedTitle.textContent = copy.detailedReportLockedTitle || i18n.ja.detailedReportLockedTitle;
        if (lockedText) lockedText.textContent = copy.detailedReportLockedText || i18n.ja.detailedReportLockedText;

        card.classList.toggle('is-blurred', !unlocked);
        if (lockOverlay) lockOverlay.hidden = unlocked;
        if (saveBtn) saveBtn.hidden = !unlocked;
        if (purchaseBtn) purchaseBtn.hidden = unlocked || !paidConfig.enabled;
    }

    function getCurrentTypeName(lang = state.lang) {
        const info = typeDatabase[state.typeCode];
        if (!info) return "";
        return info.name[lang] || info.name.ja || "";
    }

    function resolveTypeCodeFromSavedResult(saved) {
        if (!saved) return "";
        if (saved.typeCode && typeDatabase[saved.typeCode]) return saved.typeCode;

        const typeName = saved.typeName || "";
        if (!typeName) return "";

        return Object.keys(typeDatabase).find(code => {
            const names = Object.values(typeDatabase[code].name || {});
            return names.includes(typeName);
        }) || "";
    }

    function readLastResult() {
        try {
            const typeName = localStorage.getItem(LAST_RESULT_TYPE_KEY) || "";
            const typeCode = localStorage.getItem(LAST_RESULT_TYPE_CODE_KEY) || "";
            const score = Number(localStorage.getItem(LAST_RESULT_SCORE_KEY));
            let answers = createEmptyAnswerCounts();

            try {
                answers = normalizeAnswerCounts(JSON.parse(localStorage.getItem(LAST_RESULT_ANSWERS_KEY) || '{}'));
            } catch (parseErr) {
                console.warn('Last result answers could not be parsed:', parseErr);
            }

            if (!typeName && !typeCode) return null;

            return {
                typeName,
                typeCode,
                score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
                ai: localStorage.getItem(LAST_RESULT_AI_KEY) || "",
                aiLang: normalizeLang(localStorage.getItem(LAST_RESULT_AI_LANG_KEY)),
                nickname: localStorage.getItem(LAST_RESULT_NICKNAME_KEY) || "",
                age: localStorage.getItem(LAST_RESULT_AGE_KEY) || "",
                description: localStorage.getItem(LAST_RESULT_DESCRIPTION_KEY) || "",
                answers
            };
        } catch (err) {
            console.warn('Last result could not be read:', err);
            return null;
        }
    }

    function persistLastResult(aiText) {
        const info = typeDatabase[state.typeCode];
        if (!info) return;

        try {
            const commentBox = document.getElementById('aiCommentaryBox');
            const descBox = document.getElementById('resultTypeDesc');
            const fallback = getPersonalizedAiFallback(state.typeCode, state.lang) || info.fallback[state.lang] || info.fallback.ja || "";
            const ai = typeof aiText === 'string'
                ? aiText
                : (commentBox && commentBox.textContent ? commentBox.textContent.trim() : fallback);
            const description = descBox && descBox.textContent
                ? descBox.textContent.trim()
                : getPersonalizedResultDescription(info, state.lang);

            localStorage.setItem(LAST_RESULT_TYPE_KEY, getCurrentTypeName(state.lang));
            localStorage.setItem(LAST_RESULT_TYPE_CODE_KEY, state.typeCode);
            localStorage.setItem(LAST_RESULT_SCORE_KEY, String(state.approvalPercent));
            localStorage.setItem(LAST_RESULT_AI_KEY, localizeDimensionTerms(ai || fallback, state.lang));
            localStorage.setItem(LAST_RESULT_AI_LANG_KEY, state.lang);
            localStorage.setItem(LAST_RESULT_NICKNAME_KEY, state.username || "");
            localStorage.setItem(LAST_RESULT_AGE_KEY, state.age || "");
            localStorage.setItem(LAST_RESULT_DESCRIPTION_KEY, description);
            localStorage.setItem(LAST_RESULT_ANSWERS_KEY, JSON.stringify(normalizeAnswerCounts(state.answers)));
        } catch (err) {
            console.warn('Last result could not be saved:', err);
        }
    }

    function showResultViewDirectly() {
        document.querySelectorAll('.section-view').forEach(view => {
            view.classList.remove('active');
        });

        const resultView = document.getElementById('resultView');
        const iosModal = document.getElementById('iosModal');
        if (resultView) resultView.classList.add('active');
        if (iosModal) iosModal.classList.add('hide');
    }

    function restoreLastResultView(source = 'stored_result') {
        const saved = readLastResult();
        const typeCode = resolveTypeCodeFromSavedResult(saved);
        if (!saved || !typeCode) return false;

        state.typeCode = typeCode;
        state.approvalPercent = saved.score;
        state.username = saved.nickname;
        state.age = saved.age;
        state.answers = normalizeAnswerCounts(saved.answers);
        state.currentQuestionIndex = questions.length;
        clearInterval(state.timerId);

        showResultViewDirectly();
        applyResultUI();
        prepareResultAdSlot();

        const commentBox = document.getElementById('aiCommentaryBox');
        if (commentBox && saved.ai && saved.aiLang === state.lang) {
            commentBox.textContent = saved.ai;
        } else {
            renderLocalizedAiFallback(typeCode, state.lang);
        }

        updatePaidSaveCta();
        updateLockPurchaseCta();
        updateDetailedReportCard();
        renderCompatibilitySection();
        renderTalentSection();
        startChekiParallax();
        persistLastResult(commentBox ? commentBox.textContent.trim() : undefined);
        // 復元ビュー（課金済み/購入からの復帰）では無料体験カウントダウンのバナーは表示しない
        const restoredCountdownBanner = document.getElementById('countdownBanner');
        if (restoredCountdownBanner) restoredCountdownBanner.style.display = 'none';
        safeTrack('result_restore', { source, monster_code: state.typeCode || 'none' });
        return true;
    }

    function shouldRestoreStoredResultOnBoot(returnSource) {
        return Boolean(returnSource || hasAnyTalentPaid() || hasAnyCompatibilityPaid() || hasPermanentPaid());
    }

    function updateCompatibilityCta() {
        const btn = document.getElementById('btn-compatibility');
        if (!btn) return;

        const compatConfig = getCompatibilityConfig();
        const shouldShow = compatConfig.enabled && !hasCompatibilityPaid();
        btn.hidden = !shouldShow;
        btn.style.display = shouldShow ? '' : 'none';
        btn.textContent = i18n[state.lang].btnCompatibility || i18n.ja.btnCompatibility;
    }

    function updateTalentCta() {
        const btn = document.getElementById('btnTalent') || document.getElementById('btn-talent');
        if (!btn) return;

        // 才能パックは「相性パック購入済み」の人にのみ表示（段階的アップセル導線）
        const shouldShow = Boolean(TALENT_STRIPE_URL) && hasCompatibilityPaid() && !hasTalentPaid();
        btn.hidden = !shouldShow;
        btn.style.display = shouldShow ? '' : 'none';
        btn.textContent = i18n[state.lang].btnTalent || i18n.ja.btnTalent;
    }

    function setCompatibilitySectionVisible(section, visible) {
        section.style.display = visible ? 'block' : 'none';
        section.classList.toggle('active', visible);
    }

    function setTalentSectionVisible(section, visible) {
        section.style.display = visible ? 'block' : 'none';
        section.classList.toggle('active', visible);
    }

    function createCompatibilityMatchCard(title, matches, tipLabel) {
        const card = document.createElement('div');
        card.className = 'compatibility-card';

        const heading = document.createElement('h4');
        heading.textContent = title;
        card.appendChild(heading);

        matches.forEach(match => {
            const item = document.createElement('div');
            item.className = 'compatibility-item';

            const name = document.createElement('span');
            name.className = 'compatibility-name';
            name.textContent = match.name;

            const reason = document.createElement('span');
            reason.className = 'compatibility-reason';
            reason.textContent = match.reason;

            item.append(name, reason);

            const tipText = match.secret || match.advice;
            if (tipText) {
                const tip = document.createElement('span');
                tip.className = 'compatibility-tip';

                const label = document.createElement('span');
                label.className = 'compatibility-tip-label';
                label.textContent = tipLabel || '';

                const body = document.createElement('span');
                body.textContent = tipText;

                tip.append(label, body);
                item.appendChild(tip);
            }

            card.appendChild(item);
        });

        return card;
    }

    function renderCompatibilitySection() {
        const section = document.getElementById('compatibility-section');
        if (!section) return;

        try {
            const compatConfig = getCompatibilityConfig();
            if (!compatConfig.enabled || !hasCompatibilityPaid() || !state.typeCode) {
                section.innerHTML = '';
                setCompatibilitySectionVisible(section, false);
                updateCompatibilityCta();
                return;
            }

            const lang = normalizeLang(state.lang);
            const typeName = getCurrentTypeName(lang);
            const data = window.COMPATIBILITY_DATA && window.COMPATIBILITY_DATA[lang];
            const record = data && data[typeName];

            if (!record) {
                section.innerHTML = '';
                setCompatibilitySectionVisible(section, false);
                updateCompatibilityCta();
                return;
            }

            const copy = i18n[lang] || i18n.ja;
            section.innerHTML = '';

            const title = document.createElement('div');
            title.className = 'result-details-title';
            title.textContent = copy.sectionCompatTitle;

            const grid = document.createElement('div');
            grid.className = 'compatibility-grid';
            grid.append(
                createCompatibilityMatchCard(copy.sectionGoodMatch, record.goodMatch || [], copy.sectionGoodSecret),
                createCompatibilityMatchCard(copy.sectionBadMatch, record.badMatch || [], copy.sectionBadAdvice)
            );

            const love = document.createElement('div');
            love.className = 'compatibility-love';
            const loveTitle = document.createElement('h4');
            loveTitle.textContent = copy.sectionLoveStyle;
            const loveText = document.createElement('p');
            loveText.textContent = record.loveStyle || '';
            love.append(loveTitle, loveText);

            if (record.loveAdvice) {
                const loveAdvice = document.createElement('p');
                loveAdvice.className = 'compatibility-love-advice';

                const adviceLabel = document.createElement('strong');
                adviceLabel.textContent = copy.sectionLoveAdvice;

                const adviceText = document.createElement('span');
                adviceText.textContent = ` ${record.loveAdvice}`;

                loveAdvice.append(adviceLabel, adviceText);
                love.appendChild(loveAdvice);
            }

            section.append(title, grid, love);
            setCompatibilitySectionVisible(section, true);
            updateCompatibilityCta();
        } catch (err) {
            console.warn('Compatibility section could not be rendered:', err);
            section.innerHTML = '';
            setCompatibilitySectionVisible(section, false);
            updateCompatibilityCta();
        }
    }

    function appendTalentBlock(parent, title, content) {
        const block = document.createElement('div');
        block.className = 'talent-block';

        const heading = document.createElement('h4');
        heading.textContent = title;
        block.appendChild(heading);

        if (Array.isArray(content)) {
            content.forEach(item => {
                const row = document.createElement('div');
                row.className = 'talent-job-item';

                const name = document.createElement('span');
                name.className = 'talent-job-name';
                name.textContent = item.name || '';

                const reason = document.createElement('span');
                reason.className = 'talent-job-reason';
                reason.textContent = item.reason || '';

                row.append(name, reason);
                block.appendChild(row);
            });
        } else {
            const text = document.createElement('p');
            text.textContent = content || '';
            block.appendChild(text);
        }

        parent.appendChild(block);
    }

    function renderTalentSection() {
        const section = document.getElementById('talent-section');
        if (!section) return;

        try {
            if (!hasTalentPaid() || !state.typeCode) {
                section.innerHTML = '';
                setTalentSectionVisible(section, false);
                updateTalentCta();
                return;
            }

            const lang = normalizeLang(state.lang);
            const typeName = getCurrentTypeName('ja');

            if (!window.TALENT_DATA || !window.TALENT_DATA[lang] || !window.TALENT_DATA[lang][typeName]) {
                const copy = i18n[lang] || i18n.ja;
                section.innerHTML = '';

                const title = document.createElement('div');
                title.className = 'result-details-title';
                title.textContent = copy.sectionTalentTitle;

                const pending = document.createElement('div');
                pending.className = 'talent-placeholder';
                pending.textContent = copy.sectionTalentLocked;

                section.append(title, pending);
                setTalentSectionVisible(section, true);
                updateTalentCta();
                return;
            }

            const copy = i18n[lang] || i18n.ja;
            const record = window.TALENT_DATA[lang][typeName];
            section.innerHTML = '';

            const title = document.createElement('div');
            title.className = 'result-details-title';
            title.textContent = copy.sectionTalentTitle;

            const body = document.createElement('div');
            body.className = 'talent-grid';
            appendTalentBlock(body, copy.sectionTalentHidden, record.hiddenTalent);
            appendTalentBlock(body, copy.sectionTalentWhy, record.whyThisFits);
            appendTalentBlock(body, copy.sectionTalentJobs, record.idealJobs || []);
            appendTalentBlock(body, copy.sectionTalentStrength, record.strengthInWeakness);
            appendTalentBlock(body, copy.sectionTalentFuture, record.futureHint);
            appendTalentBlock(body, copy.sectionTalentAction, record.actionAdvice);

            section.append(title, body);
            setTalentSectionVisible(section, true);
            updateTalentCta();
        } catch (err) {
            console.warn('Talent section could not be rendered:', err);
            section.innerHTML = '';
            setTalentSectionVisible(section, false);
            updateTalentCta();
        }
    }

    function goToPermanentSaveCheckout(source) {
        const paidConfig = getPaidPremiumConfig();
        if (!paidConfig.enabled) {
            updatePaidSaveCta();
            updateLockPurchaseCta();
            return;
        }

        safeTrack('paid_permanent_save_click', {
            price_yen: paidConfig.price,
            source
        });
        window.location.assign(buildStripeUrlWithLocale(paidConfig.stripeUrl));
    }

    function goToCompatibilityCheckout(source) {
        const compatConfig = getCompatibilityConfig();
        if (!compatConfig.enabled) {
            updateCompatibilityCta();
            return;
        }

        safeTrack('paid_compatibility_click', {
            price_yen: compatConfig.price,
            source,
            monster_code: state.typeCode || 'none'
        });
        window.location.assign(buildStripeUrlWithLocale(compatConfig.stripeUrl));
    }

    function goToTalentCheckout(source) {
        if (!TALENT_STRIPE_URL) {
            updateTalentCta();
            return;
        }

        safeTrack('paid_talent_click', {
            price_yen: 360,
            source,
            monster_code: state.typeCode || 'none'
        });
        window.location.assign(buildStripeUrlWithLocale(TALENT_STRIPE_URL));
    }

    function hasConsent() {
        return localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted';
    }

    function showConsentBannerIfNeeded() {
        const banner = document.getElementById('consentBanner');
        if (!banner) return;

        const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!saved) {
            banner.classList.add('active');
        }
    }

    function setupConsentControls() {
        const banner = document.getElementById('consentBanner');
        const acceptBtn = document.getElementById('consentAcceptBtn');
        const rejectBtn = document.getElementById('consentRejectBtn');
        if (!banner || !acceptBtn || !rejectBtn) return;

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
            banner.classList.remove('active');
            enableMeasurementAndAds();
        });

        rejectBtn.addEventListener('click', () => {
            localStorage.setItem(CONSENT_STORAGE_KEY, 'rejected');
            banner.classList.remove('active');
            hideAdSlots();
        });
    }

    function loadExternalScript(src, id, attrs = {}) {
        return new Promise((resolve, reject) => {
            if (id && document.getElementById(id)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            if (id) script.id = id;
            script.async = true;
            script.src = src;
            Object.entries(attrs).forEach(([key, value]) => {
                script.setAttribute(key, value);
            });
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }

    function initGa4() {
        const { ga4MeasurementId } = getSiteConfig();
        if (!ga4MeasurementId || window.__snsMonsterGaReady) return;

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', ga4MeasurementId, {
            anonymize_ip: true,
            send_page_view: true
        });
        window.__snsMonsterGaReady = true;

        loadExternalScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`, 'ga4-script')
            .catch(err => console.warn('GA4 script load failed:', err));
    }

    function safeTrack(eventName, params = {}) {
        if (!hasConsent() || typeof window.gtag !== 'function') return;

        const safeParams = {
            app_language: state.lang,
            monster_code: state.typeCode || 'none',
            score_bucket: Math.floor((state.approvalPercent || 0) / 10) * 10,
            ...params
        };

        // ニックネームや自由入力文字列は送らない。
        delete safeParams.username;
        delete safeParams.nickname;
        delete safeParams.name;

        window.gtag('event', eventName, safeParams);
    }

    function hideAdSlots() {
        const slot = document.getElementById('resultAdSlot');
        if (slot) {
            slot.classList.remove('active');
            slot.innerHTML = `<span class="monetize-label">${i18n[state.lang].adLabel}</span>`;
        }
    }

    function prepareResultAdSlot() {
        const { enableAds, adsenseClientId, resultAdSlot } = getSiteConfig();
        const slot = document.getElementById('resultAdSlot');
        if (!slot) return;

        if (!hasConsent() || !enableAds || !adsenseClientId || !resultAdSlot) {
            hideAdSlots();
            return;
        }

        slot.classList.add('active');
        slot.innerHTML = `
            <span class="monetize-label">${i18n[state.lang].adLabel}</span>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${adsenseClientId}"
                 data-ad-slot="${resultAdSlot}"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        `;

        loadExternalScript(
            `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClientId)}`,
            'adsense-script',
            { crossorigin: 'anonymous' }
        ).then(() => {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
        }).catch(err => console.warn('AdSense script load failed:', err));
    }

    function enableMeasurementAndAds() {
        if (!hasConsent()) return;
        initGa4();
        prepareResultAdSlot();
    }

    async function requestMotionPermissionIfNeeded() {
        const orientationApi = window.DeviceOrientationEvent;
        if (!orientationApi || typeof orientationApi.requestPermission !== 'function') {
            return;
        }

        try {
            const permission = await orientationApi.requestPermission();
            state.hasGyro = permission === 'granted';
        } catch (err) {
            console.warn('Device orientation permission was not granted:', err);
        }
    }

    // ==========================================
    // 6. 初期化
    // ==========================================
    function init() {
        state.lang = getInitialLang();
        const langSelect = document.getElementById('langSelect');
        if (langSelect) langSelect.value = state.lang;
        rememberLang();

        setupEventListeners();
        const paidReturn = handlePaidReturn();
        const compatibilityReturn = handleCompatibilityReturn();
        const talentReturn = handleTalentReturn();
        loadPremiumState();
        setupConsentControls();

        // 初回の年齢層インジェクション
        updateLanguage();
        if (shouldRestoreStoredResultOnBoot(paidReturn || compatibilityReturn || talentReturn)) {
            restoreLastResultView(paidReturn ? 'paid_return' : compatibilityReturn ? 'compatibility_return' : talentReturn ? 'talent_return' : 'stored_paid_result');
        }
        showConsentBannerIfNeeded();
        enableMeasurementAndAds();
    }

    function loadPremiumState() {
        const premiumLockEnabled = isPremiumLockEnabled();
        const unlocked = localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true' || hasPermanentPaid();

        if (!premiumLockEnabled || unlocked) {
            state.isPremium = true;
            document.getElementById('countdownBanner').style.display = 'none';
            document.getElementById('fogOverlay').classList.remove('active');
            updatePaidSaveCta();
            updateLockPurchaseCta();
            return;
        }

        state.isPremium = false;
        document.getElementById('countdownBanner').style.display = '';
        updatePaidSaveCta();
        updateLockPurchaseCta();
    }

    function unlockPremium(source = 'key') {
        state.isPremium = true;
        localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
        if (source === 'stripe_payment_link') {
            localStorage.setItem(PERMANENT_PAID_STORAGE_KEY, 'true');
        }
        clearInterval(state.timerId);

        const countdownBanner = document.getElementById('countdownBanner');
        const fogOverlay = document.getElementById('fogOverlay');
        if (countdownBanner) countdownBanner.style.display = 'none';
        if (fogOverlay) {
            fogOverlay.classList.remove('active');
            fogOverlay.style.background = '';
            fogOverlay.style.backdropFilter = '';
            fogOverlay.style.webkitBackdropFilter = '';
        }
        updatePaidSaveCta();
        updateLockPurchaseCta();
        updateDetailedReportCard();
        safeTrack('premium_unlock', { unlock_method: source });
    }

    function handlePaidReturn() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('paid') !== '1') return false;

        localStorage.setItem(PERMANENT_PAID_STORAGE_KEY, 'true');
        unlockPremium('stripe_payment_link');
        showToast(i18n[state.lang].paidUnlockSuccess);
        params.delete('paid');
        const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
        window.history.replaceState({}, document.title, nextUrl || window.location.pathname);
        return true;
    }

    function handleCompatibilityReturn() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('compat') !== '1') return false;

        addPaidType(COMPAT_PAID_TYPES_KEY, resolveTypeCodeFromSavedResult(readLastResult()));
        params.delete('compat');
        const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
        window.history.replaceState({}, document.title, nextUrl || window.location.pathname);
        return true;
    }

    function handleTalentReturn() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('talent') !== '1') return false;

        addPaidType(TALENT_PAID_TYPES_KEY, resolveTypeCodeFromSavedResult(readLastResult()));
        params.delete('talent');
        const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
        window.history.replaceState({}, document.title, nextUrl || window.location.pathname);
        return true;
    }

    function setupEventListeners() {
        // 多言語切り替えセレクトボックス
        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                state.lang = normalizeLang(e.target.value);
                e.target.value = state.lang;
                rememberLang();
                state.aiCommentRequestId += 1;
                updateLanguage();
                showToast(state.lang === 'ja' ? "言語を日本語に切り替えました" :
                          state.lang === 'en' ? "Language switched to English" :
                          state.lang === 'ko' ? "한국어로 변경되었습니다" : "语言已切换为中文");
                safeTrack('language_change', { selected_language: state.lang });
            });
        }

        // iOSオーディオブロック解除モーダル
        const iosStartBtn = document.getElementById('iosStartBtn');
        const iosModal = document.getElementById('iosModal');
        if (iosStartBtn && iosModal) {
            iosStartBtn.addEventListener('click', () => {
                setupAudioContext();
                requestMotionPermissionIfNeeded();
                iosModal.classList.add('hide');
                showToast(i18n[state.lang].toastAudioInit);
            });
        }

        // ニックネーム入力監視（タイピング鼓動 ＆ グリッチ連動）
        const nicknameInput = document.getElementById('nicknameInput');
        const startDiagnosisBtn = document.getElementById('startDiagnosisBtn');
        if (nicknameInput && startDiagnosisBtn) {
            let lastKeyTime = Date.now();
            
            nicknameInput.addEventListener('input', (e) => {
                const name = e.target.value.trim();
                state.username = name;
                
                startDiagnosisBtn.disabled = name.length === 0;

                // タイピング速度（BPM）計算
                const now = Date.now();
                const diff = now - lastKeyTime;
                lastKeyTime = now;

                if (diff > 0 && diff < 2000) {
                    const typingBpm = 60000 / diff;
                    state.currentBpm = Math.max(60, Math.min(200, typingBpm * 0.45 + state.currentBpm * 0.55));
                }

                state.isTypingActive = true;
                triggerHeartbeatLoop();
                startPsychedelicEffect();

                const feedback = document.getElementById('typingFeedback');
                if (feedback) {
                    feedback.textContent = `${i18n[state.lang].scanBpm} ［BPM: ${Math.round(state.currentBpm)}］`;
                }
            });
        }

        // 診断開始
        if (startDiagnosisBtn) {
            startDiagnosisBtn.addEventListener('click', () => {
                const ageSelect = document.getElementById('ageSelect');
                if (ageSelect) {
                    const idx = parseInt(ageSelect.value) || 0;
                    state.age = i18n[state.lang].ages[idx];
                }
                safeTrack('shindan_start', {
                    age_bucket: state.age || 'unknown'
                });
                transitionView('registerView', 'questionView');
                showQuestion();
            });
        }

        // プレミアムキー入力
        const premiumKeyInput = document.getElementById('premiumKeyInput');
        const unlockBtn = document.getElementById('unlockBtn');
        if (premiumKeyInput && unlockBtn) {
            unlockBtn.addEventListener('click', () => {
                const val = premiumKeyInput.value.trim();
                if (val === PREMIUM_KEY) {
                    unlockPremium('pastel_key');
                    showToast(i18n[state.lang].toastKeySuccess);
                } else {
                    showToast(i18n[state.lang].toastKeyFail);
                }
            });
        }

        const paidSaveBtn = document.getElementById('btn-permanent-save') || document.getElementById('paidSaveBtn');
        if (paidSaveBtn) {
            paidSaveBtn.addEventListener('click', () => {
                goToPermanentSaveCheckout('result_screen');
            });
        }

        const detailedReportPurchaseBtn = document.getElementById('detailedReportPurchaseBtn');
        if (detailedReportPurchaseBtn) {
            detailedReportPurchaseBtn.addEventListener('click', () => {
                goToPermanentSaveCheckout('detailed_report');
            });
        }

        const compatibilityBtn = document.getElementById('btn-compatibility');
        if (compatibilityBtn) {
            compatibilityBtn.addEventListener('click', () => {
                goToCompatibilityCheckout('result_screen');
            });
        }

        const talentBtn = document.getElementById('btnTalent') || document.getElementById('btn-talent');
        if (talentBtn) {
            talentBtn.addEventListener('click', () => {
                goToTalentCheckout('result_screen');
            });
        }

        const lockStripeBtn = document.getElementById('btn-lock-stripe-purchase');
        if (lockStripeBtn) {
            lockStripeBtn.addEventListener('click', () => {
                goToPermanentSaveCheckout('lock_screen');
            });
        }

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', handleBack);
        }

        // 再チャレンジ
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                state.currentQuestionIndex = 0;
                state.answers = { p: 0, a: 0, o: 0, s: 0, m: 0, n: 0, e: 0, r: 0 };
                state.answerHistory = [];
                state.typeCode = '';
                state.approvalPercent = 0;
                clearInterval(state.timerId);
                state.countdown = COUNTDOWN_SECONDS;
                
                updateCountdownBanner();

                transitionView('resultView', 'registerView');
                
                if (nicknameInput) nicknameInput.value = '';
                if (startDiagnosisBtn) startDiagnosisBtn.disabled = true;
                const feedback = document.getElementById('typingFeedback');
                if (feedback) feedback.textContent = '';
                safeTrack('shindan_retry');
            });
        }

        const transparentGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

        const beginExportMode = () => {
            const savedBgImage = document.body.style.backgroundImage;

            if (state.psychAnimFrame) {
                cancelAnimationFrame(state.psychAnimFrame);
                state.psychAnimFrame = null;
            }

            document.body.style.backgroundImage = 'none';
            document.body.classList.add('export-mode');

            return () => {
                document.body.classList.remove('export-mode');
                document.body.style.backgroundImage = savedBgImage;
                startPsychedelicEffect();
            };
        };

        const waitForFonts = async () => {
            if (document.fonts && document.fonts.ready) {
                try {
                    await document.fonts.ready;
                } catch (fontErr) {
                    console.warn('Font loading wait failed, continuing export:', fontErr);
                }
            }
        };

        const waitForPaint = () => new Promise(resolve => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
        });

        const waitForChekiImage = () => new Promise(resolve => {
            const img = document.getElementById('chekiImg');
            if (!img || img.style.display === 'none' || !img.src || img.complete) {
                resolve();
                return;
            }

            const done = () => resolve();
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
            setTimeout(done, 2500);
        });

        const prepareChekiClone = (clonedDoc, forcePlaceholderImage = false) => {
            clonedDoc.body.classList.add('export-mode');
            clonedDoc.body.style.backgroundImage = 'none';
            clonedDoc.body.style.background = 'none';

            const clonedWrapper = clonedDoc.querySelector('.cheki-wrapper');
            if (clonedWrapper) {
                clonedWrapper.style.perspective = 'none';
                clonedWrapper.style.transformStyle = 'flat';
            }

            const clonedCard = clonedDoc.querySelector('#chekiCard');
            if (clonedCard) {
                clonedCard.style.transform = 'none';
                clonedCard.style.transformStyle = 'flat';
                clonedCard.style.boxShadow = 'none';
            }

            const clonedImgSlot = clonedDoc.querySelector('.cheki-img-slot');
            if (clonedImgSlot) {
                clonedImgSlot.style.transform = 'none';
            }

            const clonedInfo = clonedDoc.querySelector('.cheki-info');
            if (clonedInfo) {
                clonedInfo.style.transform = 'none';
            }

            const clonedImg = clonedDoc.querySelector('.cheki-img');
            if (clonedImg) {
                clonedImg.style.transform = 'none';

                const placeholder = clonedDoc.getElementById('chekiPlaceholder');
                if (placeholder) {
                    placeholder.style.background = '#FFE4E1';
                }

                const embeddedImage = window.MONSTER_IMAGE_DATA && window.MONSTER_IMAGE_DATA[state.typeCode];
                if (embeddedImage && !forcePlaceholderImage) {
                    clonedImg.src = embeddedImage;
                    clonedImg.style.display = 'block';
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                }

                const hasEmbeddedImage = Boolean(embeddedImage && !forcePlaceholderImage);
                const shouldUsePlaceholder = forcePlaceholderImage ||
                    (!hasEmbeddedImage && (
                        (placeholder && placeholder.style.display !== 'none') ||
                        clonedImg.style.display === 'none' ||
                        !clonedImg.complete ||
                        clonedImg.naturalWidth === 0
                    ));

                if (shouldUsePlaceholder) {
                    clonedImg.removeAttribute('src');
                    clonedImg.src = transparentGif;
                    clonedImg.style.display = 'none';
                    if (placeholder) {
                        const placeholderText = placeholder.querySelector('#chekiPlaceholderText');
                        const info = typeDatabase[state.typeCode];
                        if (placeholderText && info) {
                            placeholderText.textContent = info.name[state.lang] || info.name.ja;
                        }
                        placeholder.style.display = 'flex';
                    }
                }
            }

            const clonedScoreBar = clonedDoc.querySelector('.cheki-score-bar-fill');
            if (clonedScoreBar) {
                clonedScoreBar.style.width = `${state.approvalPercent}%`;
                clonedScoreBar.style.background = '#FF8DA1';
            }

            clonedDoc.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
        };

        const renderChekiCanvas = (forcePlaceholderImage = false) => {
            const target = document.getElementById('chekiCard');
            if (!target) {
                throw new Error('chekiCard is missing');
            }

            if (typeof html2canvas === 'undefined') {
                throw new Error('html2canvas is not loaded');
            }

            return html2canvas(target, {
                scale: Math.min(2, window.devicePixelRatio || 2),
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#FFFFFF',
                logging: false,
                imageTimeout: 15000,
                onclone: clonedDoc => prepareChekiClone(clonedDoc, forcePlaceholderImage)
            });
        };

        const createChekiCanvas = async () => {
            const restoreExportState = beginExportMode();

            try {
                await waitForFonts();
                await waitForChekiImage();
                await waitForPaint();

                try {
                    return await renderChekiCanvas(false);
                } catch (primaryErr) {
                    console.warn('html2canvas primary render failed, retrying without image:', primaryErr);
                    return await renderChekiCanvas(true);
                }
            } finally {
                restoreExportState();
            }
        };

        const prepareDetailedReportClone = clonedDoc => {
            clonedDoc.body.classList.add('export-mode');
            clonedDoc.body.style.backgroundImage = 'none';
            clonedDoc.body.style.background = 'none';

            const clonedCard = clonedDoc.querySelector('#detailedReportCard');
            if (clonedCard) {
                clonedCard.classList.remove('is-blurred');
                clonedCard.style.filter = 'none';
                clonedCard.style.boxShadow = 'none';
                clonedCard.style.transform = 'none';
            }

            clonedDoc.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
        };

        const createDetailedReportCanvas = async () => {
            if (!state.isPremium && !hasPermanentPaid()) {
                throw new Error('Detailed report is locked');
            }

            const target = document.getElementById('detailedReportCard');
            if (!target) {
                throw new Error('detailedReportCard is missing');
            }

            if (typeof html2canvas === 'undefined') {
                throw new Error('html2canvas is not loaded');
            }

            updateDetailedReportCard();
            const restoreExportState = beginExportMode();

            try {
                await waitForFonts();
                await waitForPaint();
                return await html2canvas(target, {
                    scale: Math.min(2, window.devicePixelRatio || 2),
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: '#FFFFFF',
                    logging: false,
                    imageTimeout: 15000,
                    onclone: prepareDetailedReportClone
                });
            } finally {
                restoreExportState();
            }
        };

        const canvasToBlob = canvas => new Promise((resolve, reject) => {
            if (!canvas.toBlob) {
                try {
                    fetch(canvas.toDataURL('image/png')).then(res => res.blob()).then(resolve).catch(reject);
                } catch (dataUrlErr) {
                    reject(dataUrlErr);
                }
                return;
            }

            try {
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('canvas.toBlob returned null'));
                    }
                }, 'image/png');
            } catch (blobErr) {
                reject(blobErr);
            }
        });

        const getChekiFilename = () => `sns-monster-${state.typeCode || 'result'}-${Date.now()}.png`;
        const getDetailedReportFilename = () => `sns-monster-report-${state.typeCode || 'result'}-${Date.now()}.png`;

        const createImageFile = (blob, filename) => {
            if (typeof File === 'undefined') return null;
            return new File([blob], filename, { type: 'image/png' });
        };

        const canShareImageFile = file => (
            file &&
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
        );

        const shareImageFile = async file => {
            if (!canShareImageFile(file)) return false;
            await navigator.share({
                files: [file],
                title: i18n[state.lang].shareImageTitle,
                text: i18n[state.lang].shareImageText
            });
            safeTrack('shindan_share', { channel: 'webshare' });
            return true;
        };

        const isIOSLikeDevice = () => (
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        );

        let savePreviewUrl = '';
        let savePreviewFile = null;

        const closeSaveModal = () => {
            const modal = document.getElementById('saveModal');
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
            if (savePreviewUrl) {
                URL.revokeObjectURL(savePreviewUrl);
                savePreviewUrl = '';
            }
            savePreviewFile = null;
        };

        const showSaveModal = (blob, filename) => {
            const modal = document.getElementById('saveModal');
            const preview = document.getElementById('savePreviewImg');
            const downloadLink = document.getElementById('saveModalDownloadBtn');
            if (!modal || !preview || !downloadLink) return;

            if (savePreviewUrl) {
                URL.revokeObjectURL(savePreviewUrl);
            }

            savePreviewUrl = URL.createObjectURL(blob);
            savePreviewFile = createImageFile(blob, filename);

            preview.src = savePreviewUrl;
            downloadLink.href = savePreviewUrl;
            downloadLink.download = filename;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        };

        const triggerDownload = (dataUrl, filename = getChekiFilename()) => {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                if (a.parentNode) {
                    a.parentNode.removeChild(a);
                }
                if (dataUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(dataUrl);
                }
            }, 1000);
        };

        const downloadCanvas = async (canvas, filename = getChekiFilename()) => {
            try {
                const blob = await canvasToBlob(canvas);
                const file = createImageFile(blob, filename);

                if (isIOSLikeDevice()) {
                    try {
                        if (await shareImageFile(file)) {
                            return;
                        }
                    } catch (shareErr) {
                        console.warn('Image share sheet was not completed, showing preview:', shareErr);
                    }

                    showSaveModal(blob, filename);
                    return;
                }

                triggerDownload(URL.createObjectURL(blob), filename);
            } catch (blobErr) {
                console.warn('Blob export failed, using toDataURL fallback:', blobErr);
                triggerDownload(canvas.toDataURL('image/png'), filename);
            }
        };

        const saveModalShareBtn = document.getElementById('saveModalShareBtn');
        if (saveModalShareBtn) {
            saveModalShareBtn.addEventListener('click', async () => {
                if (!savePreviewFile) return;
                try {
                    if (await shareImageFile(savePreviewFile)) {
                        showToast(i18n[state.lang].toastExportEnd);
                    }
                } catch (err) {
                    console.warn('Image share from modal failed:', err);
                    showToast(i18n[state.lang].saveModalText);
                }
            });
        }

        const saveModalCloseBtn = document.getElementById('saveModalCloseBtn');
        if (saveModalCloseBtn) {
            saveModalCloseBtn.addEventListener('click', closeSaveModal);
        }

        const buildShareText = (name, scorePct) => {
            const copy = i18n[state.lang] || i18n.ja;
            const variants = Array.isArray(copy.shareVariants) && copy.shareVariants.length
                ? copy.shareVariants
                : i18n.ja.shareVariants;
            const index = Math.floor(Math.random() * variants.length);
            const variant = ['a', 'b', 'c'][index] || 'a';
            const template = variants[index] || variants[0] || '';
            const text = template
                .replace(/\$\{name\}/g, name)
                .replace(/\$\{scorePct\}/g, String(scorePct));
            return { text, variant };
        };

        const buildResultShareUrl = source => {
            const siteUrl = String(getSiteConfig().siteUrl || window.location.origin || window.location.href || '').trim();
            const shareUrl = new URL('/r', siteUrl || window.location.href);
            shareUrl.searchParams.set('utm_source', source);
            shareUrl.searchParams.set('utm_medium', 'social');
            shareUrl.searchParams.set('utm_campaign', 'result_share');
            shareUrl.searchParams.set('monster', state.typeCode || 'unknown');
            shareUrl.searchParams.set('lang', state.lang);
            return shareUrl;
        };

        const buildLineShareUrl = () => {
            const lineUrl = buildResultShareUrl('line');
            return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(lineUrl.toString())}`;
        };

        const copyTextToClipboard = async text => {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                try {
                    await navigator.clipboard.writeText(text);
                    return true;
                } catch (err) {
                    console.warn('Clipboard API failed, trying fallback:', err);
                }
            }

            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.top = '-1000px';
            textarea.style.left = '-1000px';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                return document.execCommand('copy');
            } finally {
                if (textarea.parentNode) {
                    textarea.parentNode.removeChild(textarea);
                }
            }
        };

        // html2canvas エクスポート (document.fonts.ready 補償 ＆ iOS防弾 ＆ file://対応)
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', async () => {
                showToast(i18n[state.lang].toastExportStart);

                try {
                    exportBtn.disabled = true;
                    const canvas = await createChekiCanvas();
                    await downloadCanvas(canvas);
                    showToast(i18n[state.lang].toastExportEnd);
                    safeTrack('cheki_download');
                } catch (err) {
                    console.error('Cheki export failed:', err);
                    showToast(i18n[state.lang].toastExportFail);
                } finally {
                    exportBtn.disabled = false;
                }
            });
        }

        const detailedReportSaveBtn = document.getElementById('detailedReportSaveBtn');
        if (detailedReportSaveBtn) {
            detailedReportSaveBtn.addEventListener('click', async () => {
                if (!state.isPremium && !hasPermanentPaid()) {
                    goToPermanentSaveCheckout('detailed_report_locked');
                    return;
                }

                showToast(i18n[state.lang].toastExportStart);

                try {
                    detailedReportSaveBtn.disabled = true;
                    const canvas = await createDetailedReportCanvas();
                    await downloadCanvas(canvas, getDetailedReportFilename());
                    showToast(i18n[state.lang].toastExportEnd);
                    safeTrack('detailed_report_download');
                } catch (err) {
                    console.error('Detailed report export failed:', err);
                    showToast(i18n[state.lang].toastExportFail);
                } finally {
                    detailedReportSaveBtn.disabled = false;
                }
            });
        }

        // SNSシェア (X/Twitter intent直接遷移 ＆ file://対応)
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const info = typeDatabase[state.typeCode];
                if (!info) {
                    showToast('診断結果がありません。先に診断を完了してください。');
                    return;
                }

                const name = info.name[state.lang] || info.name.ja;
                const scorePct = state.approvalPercent;
                const shareCopy = buildShareText(name, scorePct);
                const shareUrl = buildResultShareUrl('x');
                const intentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareCopy.text)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(i18n[state.lang].xHashtag)}`;
                safeTrack('shindan_share', {
                    channel: 'x',
                    share_platform: 'x',
                    share_variant: shareCopy.variant
                });

                showToast(i18n[state.lang].toastShareSuccess);
                window.location.assign(intentUrl);
            });
        }

        const lineShareBtn = document.getElementById('lineShareBtn');
        if (lineShareBtn) {
            lineShareBtn.addEventListener('click', () => {
                safeTrack('shindan_share', { channel: 'line' });
                showToast(i18n[state.lang].toastShareSuccess);
                const opened = window.open(buildLineShareUrl(), '_blank', 'noopener,noreferrer');
                if (!opened) {
                    window.location.assign(buildLineShareUrl());
                }
            });
        }

        const copyShareBtn = document.getElementById('copyShareBtn');
        if (copyShareBtn) {
            if (typeof navigator.share === 'function') {
                copyShareBtn.hidden = true;
                copyShareBtn.style.display = 'none';
            } else {
                copyShareBtn.addEventListener('click', async () => {
                    const shareUrl = buildResultShareUrl('copy').toString();
                    try {
                        const copied = await copyTextToClipboard(shareUrl);
                        if (!copied) throw new Error('Copy command returned false');
                        showToast(i18n[state.lang].toastCopySuccess);
                        safeTrack('shindan_share', { channel: 'copy' });
                    } catch (err) {
                        console.warn('Copy share URL failed:', err);
                        showToast(i18n[state.lang].toastCopyFail);
                    }
                });
            }
        }
    }

    // ==========================================
    // 7. 質問フロー制御
    // ==========================================
    function showQuestion() {
        const q = questions[state.currentQuestionIndex];
        const data = i18n[state.lang];
        
        const qNum = document.getElementById('questionNumber');
        const qCat = document.getElementById('questionCategory');
        const qText = document.getElementById('questionText');
        const ansList = document.getElementById('answerList');
        const barFill = document.getElementById('progressBarFill');

        if (!qNum || !qCat || !qText || !ansList || !barFill) return;

        qNum.textContent = data.qHeader.replace("{num}", state.currentQuestionIndex + 1).replace("{total}", questions.length);
        qCat.textContent = q.category[state.lang] || q.category.ja;
        qText.textContent = q.text[state.lang] || q.text.ja;

        const progressPercent = ((state.currentQuestionIndex) / questions.length) * 100;
        barFill.style.width = `${progressPercent}%`;

        ansList.innerHTML = '';
        let isAnswerSubmitting = false;
        q.answers.forEach((ans) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = ans.text[state.lang] || ans.text.ja;
            btn.addEventListener('click', () => {
                if (isAnswerSubmitting || btn.disabled) return;
                isAnswerSubmitting = true;

                const selectedIndex = state.currentQuestionIndex;
                btn.classList.add('is-selected');
                ansList.querySelectorAll('.answer-btn').forEach((answerBtn) => {
                    answerBtn.disabled = true;
                });

                setTimeout(() => {
                    state.answers[ans.value] = (state.answers[ans.value] || 0) + 1;
                    state.answerHistory[selectedIndex] = ans.value;

                    // 心拍BPM一時上昇
                    state.currentBpm = Math.min(200, state.currentBpm + 15);
                    triggerHeartbeatLoop();

                    state.currentQuestionIndex = selectedIndex + 1;
                    if (state.currentQuestionIndex < questions.length) {
                        showQuestion();
                    } else {
                        finishDiagnosis();
                    }
                }, 220);
            });
            ansList.appendChild(btn);
        });

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.classList.toggle('is-hidden', state.currentQuestionIndex === 0);
            backBtn.setAttribute('aria-label', data.backBtn);
        }
    }

    function handleBack() {
        if (state.currentQuestionIndex <= 0) return;

        state.currentQuestionIndex--;
        const prevValue = state.answerHistory[state.currentQuestionIndex];
        if (prevValue && state.answers[prevValue] > 0) {
            state.answers[prevValue]--;
        }
        state.answerHistory.length = state.currentQuestionIndex;
        safeTrack('shindan_back');
        showQuestion();
    }

    // ==========================================
    // 8. 診断完了 ＆ 画面遷移
    // ==========================================
    function finishDiagnosis() {
        const d1 = state.answers.a >= state.answers.p ? 'a' : 'p';
        const d2 = state.answers.s >= state.answers.o ? 's' : 'o';
        const d3 = state.answers.m >= state.answers.n ? 'm' : 'n';
        const d4 = state.answers.r >= state.answers.e ? 'r' : 'e';
        
        state.typeCode = `${d1}${d2}${d3}${d4}`;

        // 承認欲求スコアを計算:
        // 外部評価・能動発信・数字評価に加え、所属不安を軽く反映する。
        // これにより同じタイプコードでも、回答の濃淡に応じて0/10/40/80%帯が分岐する。
        state.approvalPercent = calculateApprovalPercent();
        
        applyResultUI();
        persistLastResult(getPersonalizedAiFallback(state.typeCode, state.lang));
        prepareResultAdSlot();
        safeTrack('shindan_complete', {
            monster_code: state.typeCode,
            score_bucket: Math.floor(state.approvalPercent / 10) * 10,
            age_bucket: state.age || 'unknown'
        });

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                transitionView('questionView', 'resultView');
            });
        } else {
            transitionView('questionView', 'resultView');
        }

        if (!state.isPremium) {
            startCountdownTimer();
        }

        // Ollama AIへ年齢と言語、結果を送る
        fetchOllamaCommentary(state.age, state.typeCode, typeDatabase[state.typeCode].name[state.lang] || typeDatabase[state.typeCode].name.ja);

        startChekiParallax();
    }

    function applyResultUI() {
        const info = typeDatabase[state.typeCode];
        if (!info) return;

        const name = info.name[state.lang] || info.name.ja;
        const description = getPersonalizedResultDescription(info, state.lang);

        const chekiTitle = document.getElementById('chekiTitle');
        const chekiUserName = document.getElementById('chekiUserName');
        const chekiUserAge = document.getElementById('chekiUserAge');
        const chekiSerial = document.getElementById('chekiSerial');
        const chekiImg = document.getElementById('chekiImg');
        const placeholder = document.getElementById('chekiPlaceholder');
        const placeholderEmoji = document.getElementById('chekiPlaceholderEmoji');
        const resultTypeDesc = document.getElementById('resultTypeDesc');

        const data = i18n[state.lang];

        if (chekiTitle) chekiTitle.textContent = name;
        if (chekiUserName) chekiUserName.textContent = data.chekiUserName.replace("{name}", state.username);
        if (chekiUserAge) chekiUserAge.textContent = data.chekiUserAge.replace("{age}", state.age);
        
        const hash = generateHash(state.username + state.typeCode);
        const serialHex = hash.toString(16).toUpperCase().padStart(8, '0');
        if (chekiSerial) chekiSerial.textContent = `NO. ${serialHex}`;

        const customDesc = localizeDimensionTerms(description);
                               
        if (resultTypeDesc) resultTypeDesc.textContent = customDesc;

        if (chekiImg && placeholder && placeholderEmoji) {
            chekiImg.style.display = 'none';
            placeholder.style.display = 'flex';
            placeholderEmoji.textContent = info.emoji;

            const embeddedImage = window.MONSTER_IMAGE_DATA && window.MONSTER_IMAGE_DATA[state.typeCode];
            chekiImg.src = embeddedImage || `${state.typeCode}.png`;
            chekiImg.onload = () => {
                placeholder.style.display = 'none';
                chekiImg.style.display = 'block';
            };
            chekiImg.onerror = () => {
                // 画像が存在しない場合は、srcを透過GIFにしてエラーマークを出さず、プレースホルダーを維持
                chekiImg.removeAttribute('src');
                chekiImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                chekiImg.style.display = 'none';
                placeholder.style.display = 'flex';
                
                const textEl = placeholder.querySelector('#chekiPlaceholderText');
                if (textEl) {
                    textEl.textContent = state.lang === 'ja' ? "（画像未配置）" :
                                         state.lang === 'en' ? "(Image not placed)" :
                                         state.lang === 'ko' ? "(이미지 없음)" : "(无画像)";
                }
            };
        }

        // 承認欲求スコアメーターをアニメーション付きで更新
        const pct = state.approvalPercent;
        const scoreDisplay = document.getElementById('approvalScoreDisplay');
        const meterFill = document.getElementById('approvalMeterFill');
        const chekiScoreNum = document.getElementById('chekiScoreNum');
        const chekiScoreBarFill = document.getElementById('chekiScoreBarFill');

        if (scoreDisplay) scoreDisplay.textContent = `${pct}%`;
        if (chekiScoreNum) chekiScoreNum.textContent = `${pct}%`;

        // アニメーションは少し遅らせて開始する
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (meterFill) meterFill.style.width = `${pct}%`;
                if (chekiScoreBarFill) chekiScoreBarFill.style.width = `${pct}%`;
            });
        });

        renderCompatibilitySection();
        renderTalentSection();
        updateDetailedReportCard();
    }

    // ==========================================
    // 9. Ollama AI連携 ＆ タイムアウト防弾フォールバック (多言語・年齢考慮)
    // ==========================================
    function renderLocalizedAiFallback(typeCode, lang = state.lang) {
        const commentBox = document.getElementById('aiCommentaryBox');
        const info = typeDatabase[typeCode];
        if (!commentBox || !info) return;

        const fallback = getPersonalizedAiFallback(typeCode, lang) || info.fallback[lang] || info.fallback.ja;
        commentBox.textContent = localizeDimensionTerms(fallback, lang);
        persistLastResult(commentBox.textContent.trim());
        updateDetailedReportCard();
    }

    function fetchOllamaCommentary(age, typeCode, typeName) {
        const commentBox = document.getElementById('aiCommentaryBox');
        if (!commentBox) return;

        // 本番ガード: Ollama (http://localhost:11434) はローカル開発専用。
        // 本番(HTTPS/非localhost)では混在コンテンツでブロックされ常にフォールバックになるため、
        // fetchを行わず静的フォールバックを直接描画する(混在コンテンツ/接続失敗のconsoleエラー回避)。
        const __ollamaHost = location.hostname;
        const __isLocalDev = __ollamaHost === 'localhost' || __ollamaHost === '127.0.0.1' || __ollamaHost === '0.0.0.0';
        if (!__isLocalDev) {
            if (typeDatabase[typeCode]) {
                renderLocalizedAiFallback(typeCode, state.lang);
            } else {
                commentBox.textContent = "Error scanning approval desire.";
            }
            return;
        }

        const requestedLang = state.lang;
        const requestId = ++state.aiCommentRequestId;
        const requestedI18n = i18n[requestedLang] || i18n.ja;

        commentBox.textContent = requestedI18n.loadingAi;

        const langName = requestedLang === 'en' ? 'English' :
                         requestedLang === 'ko' ? 'Korean (한국어)' :
                         requestedLang === 'zh' ? 'Simplified Chinese (简体中文)' : 'Japanese (日本語)';

        const scoreBand = getScoreBand();
        const answerPattern = getAnswerPatternSummary(requestedLang);
        const systemPrompt = `診断結果コードは '${typeCode}' (小文字) で、名称は '${typeName}' です。年齢層は '${age}' です。承認欲求スコアは '${state.approvalPercent}%'、スコア帯は '${scoreBand}'、回答傾向は '${answerPattern}' です。
この情報に基づき、このユーザーの「承認欲求」について、最高に皮肉が効いていてユーモラス、かつ精神的な深層をズバッと射抜くような「極めて辛辣でイタい毒舌解説」を、必ず「${langName}」で200字以内で作成してください。

【制約ルール】
1. 甘やかす言葉、お世辞、ポジティブな励ましやフォローは一切禁止です。純粋な辛口ユーモアと冷酷な分析だけで構成してください。
2. SNSでのありがちな「痛い行動パターン」（いいね欲しさに必死な姿、見栄、過剰な自意識、マウンティングなど）を具体的に挙げ、抉るように批判してください。
3. 語尾は「〜ですね」「〜のようです」といった日和った表現を避け、「〜である」「〜なのだ」や鋭いツッコミの口調など、断定的でシャープな口調にしてください。
4. 年齢層・承認欲求スコア・回答傾向に必ず触れ、同じタイプ名でもスコアや年齢が違えば別内容になるようにしてください。
5. 挨拶や自己紹介、判定コード自体の説明などは一切不要です。最初から鋭い毒舌だけで開始してください。
Please write the response entirely in ${langName}.`;

        const fetchPromise = fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen3.6-35b-a3b',
                messages: [{ role: 'user', content: systemPrompt }],
                stream: false
            })
        }).then(res => {
            if (!res.ok) throw new Error("Ollama connection failed");
            return res.json();
        }).then(data => {
            return data.message.content.trim();
        });

        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout")), 3000)
        );

        Promise.race([fetchPromise, timeoutPromise])
            .then(commentary => {
                if (requestId !== state.aiCommentRequestId || state.lang !== requestedLang || state.typeCode !== typeCode) return;
                commentBox.textContent = localizeDimensionTerms(commentary, requestedLang);
                persistLastResult(commentBox.textContent.trim());
                updateDetailedReportCard();
                showToast(requestedI18n.toastAiSuccess);
            })
            .catch(err => {
                console.warn("Ollama AI error or timeout, applying static fallback:", err);
                if (requestId !== state.aiCommentRequestId || state.lang !== requestedLang || state.typeCode !== typeCode) return;
                if (typeDatabase[typeCode]) {
                    renderLocalizedAiFallback(typeCode, requestedLang);
                } else {
                    commentBox.textContent = "Error scanning approval desire.";
                }
                showToast(requestedI18n.toastAiFallback);
            });
    }

    // ==========================================
    // 10. 心音合成 AudioContext (音量減衰 0.05 パッチ適用)
    // ==========================================
    function setupAudioContext() {
        if (!state.audioCtx) {
            state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (state.audioCtx.state === 'suspended') {
            state.audioCtx.resume();
        }
    }

    function playHeartbeat(bpm) {
        if (!state.audioCtx) return;
        
        try {
            if (state.audioCtx.state === 'suspended') {
                state.audioCtx.resume();
            }

            const now = state.audioCtx.currentTime;
            
            // 音量減衰基準倍率を 0.8 から 0.05 に変更 (ASMR音響調整)
            const intensity = Math.min(1.0, 0.45 + (bpm - 60) / 140) * 0.05;
            const baseFreq = 48 + (bpm - 60) * 0.18;

            // 1拍目 (ドッ)
            const osc1 = state.audioCtx.createOscillator();
            const gain1 = state.audioCtx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(baseFreq, now);
            osc1.frequency.exponentialRampToValueAtTime(0.01, now + 0.14);
            gain1.gain.setValueAtTime(0.8 * intensity, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

            const osc2 = state.audioCtx.createOscillator();
            const gain2 = state.audioCtx.createGain();
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(baseFreq * 0.75, now);
            osc2.frequency.exponentialRampToValueAtTime(0.01, now + 0.11);
            gain2.gain.setValueAtTime(0.2 * intensity, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.11);

            osc1.connect(gain1);
            osc2.connect(gain2);
            gain1.connect(state.audioCtx.destination);
            gain2.connect(state.audioCtx.destination);

            osc1.start(now);
            osc1.stop(now + 0.14);
            osc2.start(now);
            osc2.stop(now + 0.11);

            // 2拍目 (クン)
            const delay = 0.14 * (60 / bpm);
            const osc3 = state.audioCtx.createOscillator();
            const gain3 = state.audioCtx.createGain();
            osc3.type = 'sine';
            osc3.frequency.setValueAtTime(baseFreq - 6, now + delay);
            osc3.frequency.exponentialRampToValueAtTime(0.01, now + delay + 0.16);
            gain3.gain.setValueAtTime(0.45 * intensity, now + delay);
            gain3.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.16);

            osc3.connect(gain3);
            gain3.connect(state.audioCtx.destination);

            osc3.start(now + delay);
            osc3.stop(now + delay + 0.16);

        } catch (e) {
            console.warn("Heartbeat playback failed:", e);
        }
    }

    function triggerHeartbeatLoop() {
        if (state.heartbeatTimeout) return;

        const loop = () => {
            if (state.isTypingActive || state.currentBpm > 62) {
                playHeartbeat(state.currentBpm);
                state.currentBpm = Math.max(60, state.currentBpm - 2.5);
                if (state.currentBpm <= 60) {
                    state.isTypingActive = false;
                }
            }
            const interval = (60 / state.currentBpm) * 1000;
            state.heartbeatTimeout = setTimeout(loop, interval);
        };
        loop();
    }

    // ==========================================
    // 11. feTurbulence背景脈動グリッチ
    // ==========================================
    function startPsychedelicEffect() {
        if (state.psychAnimFrame) return;

        const step = () => {
            if (state.currentBpm > 61) {
                const heat = (state.currentBpm - 60) / 140;
                const time = Date.now() * 0.006;
                const freq = (1.5 + Math.sin(time) * heat * 1.5).toFixed(4);

                document.body.style.backgroundImage = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.035'/></svg>")`;

                state.psychAnimFrame = requestAnimationFrame(step);
            } else {
                document.body.style.backgroundImage = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.035'/></svg>")`;
                state.psychAnimFrame = null;
            }
        };
        state.psychAnimFrame = requestAnimationFrame(step);
    }

    // ==========================================
    // 12. 3D Parallax (マウス＆ジャイロ)
    // ==========================================
    function startChekiParallax() {
        const card = document.getElementById('chekiCard');
        const img = document.getElementById('chekiImg');
        if (!card) return;

        const update = () => {
            let targetX = state.targetRotateX;
            let targetY = state.targetRotateY;

            if (!state.hasGyro && Math.abs(targetX) < 0.1 && Math.abs(targetY) < 0.1) {
                const drift = Date.now() * 0.0012;
                targetX = Math.sin(drift) * 2.2;
                targetY = Math.cos(drift * 0.9) * 2.2;
            }

            state.currentRotateX += (targetX - state.currentRotateX) * 0.1;
            state.currentRotateY += (targetY - state.currentRotateY) * 0.1;

            card.style.transform = `rotateX(${state.currentRotateX.toFixed(2)}deg) rotateY(${state.currentRotateY.toFixed(2)}deg)`;
            
            if (img && img.style.display !== 'none') {
                const offsetX = -(state.currentRotateY * 0.7).toFixed(2);
                const offsetY = (state.currentRotateX * 0.7).toFixed(2);
                img.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 15px)`;
            }

            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    window.addEventListener('deviceorientation', (e) => {
        if (e.beta === null || e.gamma === null) return;
        state.hasGyro = true;
        state.targetRotateX = Math.max(-15, Math.min(15, (e.beta - 50) * 0.55));
        state.targetRotateY = Math.max(-15, Math.min(15, e.gamma * 0.55));
    });

    document.addEventListener('mousemove', (e) => {
        if (state.hasGyro) return;
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        const mouseX = e.clientX - halfW;
        const mouseY = e.clientY - halfH;
        state.targetRotateX = -(mouseY / halfH) * 15;
        state.targetRotateY = (mouseX / halfW) * 15;
    });

    document.addEventListener('touchmove', (e) => {
        if (state.hasGyro || !e.touches || e.touches.length === 0) return;
        const touch = e.touches[0];
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        const touchX = touch.clientX - halfW;
        const touchY = touch.clientY - halfH;
        state.targetRotateX = Math.max(-12, Math.min(12, -(touchY / halfH) * 12));
        state.targetRotateY = Math.max(-12, Math.min(12, (touchX / halfW) * 12));
    }, { passive: true });

    // ==========================================
    // 13. 時限消滅カウントダウン (無料版用)
    // ==========================================
    function startCountdownTimer() {
        clearInterval(state.timerId);
        state.countdown = COUNTDOWN_SECONDS;
        
        const fogOverlay = document.getElementById('fogOverlay');

        updateCountdownBanner();

        state.timerId = setInterval(() => {
            state.countdown--;
            updateCountdownBanner();

            if (state.countdown <= 0) {
                clearInterval(state.timerId);
                if (fogOverlay) {
                    fogOverlay.classList.add('active');
                    fogOverlay.style.background = "rgba(255, 240, 245, 0.95)";
                    fogOverlay.style.backdropFilter = "blur(15px)";
                    fogOverlay.style.webkitBackdropFilter = "blur(15px)";
                }
                updateLockPurchaseCta();
                showToast(state.lang === 'ja' ? "神託はパステル霧に包まれました..." :
                          state.lang === 'en' ? "The Cheki has faded into pastel fog..." :
                          state.lang === 'ko' ? "체키가 파스텔 안개에 덮였습니다..." : "拍立得已被粉雾封闭...");
            }
        }, 1000);
    }

    // ==========================================
    // 14. 共通ユーティリティ
    // ==========================================
    function transitionView(fromId, toId) {
        const fromView = document.getElementById(fromId);
        const toView = document.getElementById(toId);
        if (fromView && toView) {
            fromView.classList.remove('active');
            toView.classList.add('active');
        }
    }

    function showToast(msg) {
        const toast = document.getElementById('customToast');
        if (!toast) return;

        toast.innerHTML = msg;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    function generateHash(str) {
        let hash = 0;
        if (!str) return 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    // アプリケーション起動
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
