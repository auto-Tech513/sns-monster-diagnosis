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
        inviteFromTypeCode: '',
        inviteLandingTracked: false,
        inviteTeaserTrackedPair: '',
        
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
    const INVITE_FROM_PARAM = "from";
    const SCORE_HISTORY_STORAGE_KEY = "sns_monster_score_history";
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
            shareInviteNote: "※このリンクから友達が診断すると、ふたりの“相性%”も出ます🐾",
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
            inviteCompatibilityBtn: "🐾 友達・恋人・推しと\"承認欲求の相性\"を測る",
            inviteShareText: "私の承認欲求モンスターは『${name}』。あなたとの相性、測れる？🐾",
            inviteShareTitle: "承認欲求の相性、測れる？",
            inviteCopySuccess: "招待リンクをコピーしました",
            inviteTeaserTitle: "💞 招待相性ティーザー",
            inviteTeaserLine: "💞 {from}のあの人との相性 = {score}%／一言：{comment}",
            inviteTeaserPaidHint: "理由とコツは¥360の相性パックで深掘りできます。",
            inviteTeaserComments: {
                same: "似すぎて鏡。刺さる時は同時に刺さる。",
                great: "欠点の穴をふわっと埋め合える組み合わせ。",
                good: "ノリは違うのに、意外と役割分担がうまい。",
                mixed: "盛り上がるけど、沈黙の読み違いに注意。",
                clash: "弱点が連鎖しやすい。距離感が命。"
            },
            scorePunchlineLow: "達観ゾーン。SNSに振り回されない側の人。…ほんとに？🐾",
            scorePunchlineMid: "中間ゾーン。平気なフリして、伸びた投稿は3回見返すタイプ🐾",
            scorePunchlineHigh: "モンスターゾーン。通知が来ない夜、スマホを3回開くタイプ🐾",
            freePreviewMore: "…続きは詳細AI診断書で",
            premiumReportAdviceTitle: "SNSとの付き合い方",
            premiumReportTruthTitle: "人には言えない本音",
            premiumReportAdviceItems: [
                "投稿前に「誰に見せたいか」を1人だけ決めると、反応待ちの沼が浅くなります。",
                "伸びなかった投稿は削除前に24時間寝かせる。数字より、残したかった感情を先に確認。",
                "褒められたい気持ちは悪役ではありません。出し方を選べば、ちゃんと武器になります。"
            ],
            premiumReportTruth: "本当は、たった一人でいいから「ちゃんと見てたよ」と言われたい。",
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
            btnCompatibility: "相性まで暴く？ ¥360",
            btnTalent: "隠れ才能、暴いてOK？ ¥360",
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
            detailedReportLockedTitle: "🔒 永久保存版で解放",
            detailedReportLockedText: "このまま60秒で霧に消えます。1枚で残せるのは¥120だけ。",
            detailedReportSaveBtn: "📄 詳細AI診断書を画像で保存",
            detailedReportPurchaseBtn: "✦ ¥120で保存＋永久保存",
            detailedReportLossCopy: "この結果はぜんぶ無料で読めます。診断書には、ここに無い\"あなたのタイプ限定\"の【SNSとの付き合い方3つ】と【人には言えない本音】を収録。",
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
            shareInviteNote: "When a friend takes the quiz from your link, you'll also see your chemistry % 🐾",
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
            inviteCompatibilityBtn: "🐾 Check approval-desire chemistry with a friend, crush, or fave",
            inviteShareText: "My approval-desire monster is \"${name}\". Can we measure our chemistry? 🐾",
            inviteShareTitle: "Can we measure our approval-desire chemistry?",
            inviteCopySuccess: "Invite link copied",
            inviteTeaserTitle: "💞 Invite Compatibility Teaser",
            inviteTeaserLine: "💞 Compatibility with that {from}: {score}% / {comment}",
            inviteTeaserPaidHint: "Want the reasons and tips? Unlock the ¥360 compatibility pack.",
            inviteTeaserComments: {
                same: "Too mirror-like. When it hits, it hits both of you.",
                great: "You can gently cover each other's weak spots.",
                good: "Different vibes, surprisingly good role balance.",
                mixed: "Fun chemistry, but silence can be misread.",
                clash: "Weak spots can amplify. Distance is everything."
            },
            scorePunchlineLow: "Zen zone. The type SNS can't push around… right? 🐾",
            scorePunchlineMid: "Middle zone. Acts unbothered, still rereads a good post three times 🐾",
            scorePunchlineHigh: "Monster zone. No notifications tonight? Phone checked three times 🐾",
            freePreviewMore: "...more in the full AI report",
            premiumReportAdviceTitle: "How to live with SNS",
            premiumReportTruthTitle: "The truth you rarely say out loud",
            premiumReportAdviceItems: [
                "Before posting, decide the one person you want to reach. It keeps the reaction spiral smaller.",
                "If a post flops, wait 24 hours before deleting. Check what feeling you wanted to keep first.",
                "Wanting praise is not the villain. With the right timing, it becomes a useful signal."
            ],
            premiumReportTruth: "Deep down, one clear \"I saw you\" from the right person would be enough.",
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
            btnPermanentSave: "✦ Save full result image forever ¥120",
            btnLockPurchase: "✦ Restore full result forever ¥120",
            orDivider: "─── or ───",
            btnCompatibility: "Reveal your best and worst match? ¥360",
            btnTalent: "Expose your hidden SNS talent? ¥360",
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
            detailedReportLockedTitle: "🔒 Unlocks with the forever-save",
            detailedReportLockedText: "It fades into fog in 60 seconds. Keeping it in one image is ¥120 only.",
            detailedReportSaveBtn: "📄 Save full AI report as image",
            detailedReportPurchaseBtn: "✦ Save forever for ¥120",
            detailedReportLossCopy: "Everything on this page is free. The report adds what's not here: 3 ways to live with SNS for your type, plus the one truth you never say out loud.",
            detailedReportScoreLabel: "Approval Desire Score",
            detailedReportFooter: "@snsmonsterdiag / sns-monster-diagnosis.pages.dev",
            paidSaveBtn: "✨ Save full result image forever ¥{price}",
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
            shareInviteNote: "이 링크로 친구가 진단하면 둘의 '궁합%'도 나와요 🐾",
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
            inviteCompatibilityBtn: "🐾 친구·연인·최애와 '승인욕구 궁합' 재보기",
            inviteShareText: "내 승인욕구 몬스터는 『${name}』. 우리 궁합, 한번 재볼래? 🐾",
            inviteShareTitle: "승인욕구 궁합, 재볼래?",
            inviteCopySuccess: "초대 링크가 복사되었습니다",
            inviteTeaserTitle: "💞 초대 궁합 티저",
            inviteTeaserLine: "💞 {from}인 그 사람과의 궁합 = {score}% / 한마디: {comment}",
            inviteTeaserPaidHint: "이유와 살리는 법은 ¥360 궁합 팩에서 더 볼 수 있어요.",
            inviteTeaserComments: {
                same: "너무 닮아서 거울 같아요. 찔릴 때도 같이 찔립니다.",
                great: "서로의 빈틈을 자연스럽게 메워줄 수 있어요.",
                good: "결은 달라도 역할 분담이 의외로 잘 맞아요.",
                mixed: "재미는 있는데, 침묵을 오해하지 않게 조심.",
                clash: "약점이 서로 커질 수 있어요. 거리감이 핵심입니다."
            },
            scorePunchlineLow: "달관 존. SNS에 휘둘리지 않는 쪽. …정말로? 🐾",
            scorePunchlineMid: "중간 존. 아무렇지 않은 척, 잘 된 글은 세 번 다시 봄 🐾",
            scorePunchlineHigh: "몬스터 존. 알림 없는 밤, 폰을 세 번 여는 타입 🐾",
            freePreviewMore: "…이어서 상세 AI 진단서에서",
            premiumReportAdviceTitle: "SNS와 지내는 법",
            premiumReportTruthTitle: "남에게 말 못 하는 속마음",
            premiumReportAdviceItems: [
                "올리기 전, 보여주고 싶은 사람을 딱 한 명만 정해보세요. 반응 기다림의 늪이 얕아집니다.",
                "반응이 약한 글은 지우기 전 24시간만 묵혀두세요. 남기고 싶었던 감정을 먼저 확인해요.",
                "칭찬받고 싶은 마음은 나쁜 게 아닙니다. 타이밍을 고르면 꽤 강한 무기가 됩니다."
            ],
            premiumReportTruth: "사실은 딱 한 사람에게라도 '나 봤어'라는 말을 듣고 싶습니다.",
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
            btnCompatibility: "최고/최악 궁합까지 볼래? ¥360",
            btnTalent: "숨은 SNS 재능, 밝혀볼래? ¥360",
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
            detailedReportLockedTitle: "🔒 영구 보존판에서 열려요",
            detailedReportLockedText: "이대로 60초 뒤 안개 속으로 사라져요. 한 장으로 남기는 건 ¥120뿐.",
            detailedReportSaveBtn: "📄 상세 AI 진단서를 이미지로 저장",
            detailedReportPurchaseBtn: "✦ ¥120으로 저장＋영구 보존",
            detailedReportLossCopy: "이 결과는 전부 무료로 볼 수 있어요. 진단서에는 여기 없는 '내 유형 전용' 【SNS와 지내는 법 3가지】와 【남에게 말 못 하는 속마음】을 담았어요.",
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
            appTitle: "SNS認同感怪獸診斷",
            appSubtitle: "基於馬斯洛需求模型的雙軸認同診斷",
            labelNickname: "請輸入你的暱稱",
            placeholderNickname: "（例：小博美）",
            labelAge: "請選擇你的年齡層",
            ages: ["10代", "20代", "30代", "40代以上", "拒絕回答"],
            startDiagnosisBtn: "開始診斷 💓",
            scanBpm: "掃描深度上升中...",
            qHeader: "Q{num} / {total}",
            backBtn: "← 上一題",
            countdownText: "⚠️ 免費體驗版: 剩 <span>{sec}</span> 秒神諭拍立得就會化為粉霧！",
            chekiUserName: "使用者: {name}",
            chekiUserAge: "年齡層: {age}",
            chekiSerialTitle: "序號",
            resultTitleLabel: "你的認同欲求類型",
            aiCommentTitleLabel: "AI毒舌分析",
            exportBtn: "📸 儲存/分享拍立得圖片",
            exportHint: "點擊儲存圖片（無需截圖）",
            shareBtn: "🐦 分享到 X (Twitter)",
            lineShareBtn: "💬 分享到 LINE",
            copyShareBtn: "🔗 複製連結",
            shareInviteNote: "朋友從這個連結做完診斷，會一併顯示你們的『契合度%』🐾",
            retryBtn: "🔄 重新診斷",
            lockTitle: "🌸 神諭已歸於遺忘 🌸",
            lockText: "由於免費體驗的60秒已過，你的診斷結果已被封鎖在粉霧中。請輸入解鎖碼解鎖以永久保存你的拍立得。",
            premiumKeyLabel: "輸入升級解鎖碼",
            unlockBtn: "解除粉色鎖定",
            iosModalTitle: "準備好迎接真實的自己嗎？",
            iosModalText: "我們將載入你的社交認同欲求與生物反饋系統。心跳聲音將與你的打字速度保持同步。",
            iosStartBtn: "前進",
            toastAudioInit: "生物反饋初始化完畢 💓",
            toastKeySuccess: "解鎖碼驗證成功！已為您永久保留拍立得。",
            toastKeyFail: "無效的解鎖碼！",
            toastExportStart: "正在沖印拍立得...",
            toastExportEnd: "沖印完成！請在顯示的頁面中儲存。",
            toastExportFail: "沖印失敗，發生了內部錯誤。",
            saveModalTitle: "拍立得圖片已生成",
            saveModalText: "在 iPhone 上請從分享面板選擇儲存圖片。若無法開啟，請長按圖片儲存。",
            saveModalShareBtn: "開啟分享/儲存",
            saveModalDownloadBtn: "下載",
            saveModalCloseBtn: "關閉",
            toastAiSuccess: "AI連接成功 💓",
            toastAiFallback: "AI已離線。已使用本地診斷。",
            toastShareSuccess: "分享成功！",
            toastCopySuccess: "連結已複製",
            toastCopyFail: "複製失敗",
            loadingAi: "AI正在深入掃描你的內心...",
            shareImageTitle: "SNS認同感怪獸診斷",
            shareImageText: "診斷結果拍立得圖片",
            xHashtag: "SNS認同感怪獸診斷",
            chekiFooterCta: "你是什麼怪獸？→",
            shareVariants: [
                "我的社交認同感怪獸是『${name}』！（分數${scorePct}%）準到笑出來…你是哪一種？",
                "我的認同感被掃描了……結果是『${name}』(${scorePct}%)。猜猜你的怪獸是什麼？👀",
                "測出來是『${name}』(${scorePct}%)！好奇大家都是什麼類型，快測一下留言告訴我 👇"
            ],
            inviteCompatibilityBtn: "🐾 跟朋友、戀人、推一起測「認同欲求配對」",
            inviteShareText: "我的認同欲求怪獸是『${name}』。要不要測測我們的配對？🐾",
            inviteShareTitle: "要不要測測認同欲求配對？",
            inviteCopySuccess: "邀請連結已複製",
            inviteTeaserTitle: "💞 邀請配對小提示",
            inviteTeaserLine: "💞 和那位{from}的配對 = {score}%／一句話：{comment}",
            inviteTeaserPaidHint: "理由和相處小訣竅可在¥360配對包中解鎖。",
            inviteTeaserComments: {
                same: "太像照鏡子。被戳中時會一起中箭。",
                great: "能自然補上彼此的空缺。",
                good: "氣質不同，卻意外能分工合作。",
                mixed: "很有火花，但要小心誤讀沉默。",
                clash: "弱點容易互相放大。距離感是關鍵。"
            },
            scorePunchlineLow: "達觀區。不被SNS牽著走的那種人……真的嗎？🐾",
            scorePunchlineMid: "中間區。裝沒事，爆的那篇還是會回去看三次🐾",
            scorePunchlineHigh: "怪獸區。沒通知的夜晚，手機開了三次🐾",
            freePreviewMore: "…後續請看詳細AI診斷書",
            premiumReportAdviceTitle: "和SNS相處的方法",
            premiumReportTruthTitle: "不敢對人說的真心話",
            premiumReportAdviceItems: [
                "發文前先決定最想讓誰看到。對反應的等待就不會把你整個拖下去。",
                "反應不如預期時，刪除前先放24小時。先確認你想留下的是哪種心情。",
                "想被稱讚不是壞事。只要選對時機，它也能變成你的武器。"
            ],
            premiumReportTruth: "其實只要有一個重要的人說「我有看到」，你就會安心很多。",
            aiBadge: "AI神諭",
            approvalMeterTitle: "💓 認同欲求分數",
            meterLow: "😌 超然",
            meterMiddle: "😅 中間",
            meterHigh: "🔥 認同感怪獸",
            chekiScoreLabel: "認同感分數:",
            resultGrowthTitle: "進一步享受診斷結果",
            resultGrowthLinks: [
                { href: "articles/result-types.html", label: "16種診斷結果的玩法" },
                { href: "articles/sns-approval-desire.html", label: "SNS 上的認同欲求是什麼" },
                { href: "articles/sns-fatigue.html", label: "減輕SNS疲勞的相處方式" },
                { href: "articles/how-to-share-results.html", label: "在X 分享結果的玩法" }
            ],
            footerLinks: {
                privacy: "隱私權政策",
                contact: "聯絡我們",
                about: "營運資訊",
                articles: "認同感專欄"
            },
            consentText: "我們會為使用情況分析和廣告顯示使用Cookie等技術。暱稱和輸入內容不會傳送到GA4。",
            consentReject: "拒絕",
            consentAccept: "同意",
            adLabel: "贊助連結",
            btnPermanentSave: "✦ 儲存詳細AI診斷書＋永久保存 ¥120",
            btnLockPurchase: "✦ 儲存詳細AI診斷書＋永久保存 ¥120",
            orDivider: "─── 或者 ───",
            btnCompatibility: "要揭開最佳/最糟配對嗎？¥360",
            btnTalent: "要揭開你的隱藏SNS才能嗎？¥360",
            sectionTalentTitle: "🌟 沉睡才能包",
            sectionTalentLocked: "才能資料正在準備中。購買後會顯示在這裡。",
            sectionTalentHidden: "沉睡的才能",
            sectionTalentWhy: "為什麼適合你",
            sectionTalentJobs: "適合的工作",
            sectionTalentStrength: "弱點中的強項",
            sectionTalentFuture: "未來提示",
            sectionTalentAction: "今日行動",
            sectionCompatTitle: "💖 配對診斷結果",
            sectionGoodMatch: "💚 最佳搭檔",
            sectionBadMatch: "💔 衝突類型",
            sectionLoveStyle: "📖 你的戀愛觀",
            sectionGoodSecret: "💡 加分小秘訣",
            sectionBadAdvice: "🛠 減少摩擦的建議",
            sectionLoveAdvice: "💞 戀愛小建議",
            detailedReportTitle: "📄 詳細AI診斷書",
            detailedReportUnlockedText: "可將類型解說和AI毒舌分析儲存為一張清晰圖片。",
            detailedReportLockedTitle: "🔒 永久保存版才解鎖",
            detailedReportLockedText: "再過60秒就會化成霧消失。想留成一張，只要¥120。",
            detailedReportSaveBtn: "📄 儲存詳細AI診斷書圖片",
            detailedReportPurchaseBtn: "✦ ¥120 永久保存",
            detailedReportLossCopy: "這頁的結果全部免費看。診斷書收錄這裡沒有的：你的類型限定【和SNS相處的3個方法】＋【不敢對人說的真心話】。",
            detailedReportScoreLabel: "認同欲求分數",
            detailedReportFooter: "@snsmonsterdiag / sns-monster-diagnosis.pages.dev",
            paidSaveBtn: "✨ 儲存詳細AI診斷書＋永久保存 ¥{price}",
            paidSaveHint: "或分享到X免費保存",
            paidSavedLabel: "已保存",
            paidUnlockSuccess: "永久保存已啟用！",

            // ポップ用語定義
            dimensionNeed: "膽小安心安全第一派",
            dimensionGrowth: "意識超前極限突破宅",
            dimensionInternal: "我行我素我的路精神",
            dimensionExternal: "搶鏡開心求追蹤狂"
        }
    };

    // ==========================================
    // 3. 多言語質問データベース (全12問)
    // ==========================================
    const questions = [
        {
            category: {
                ja: "いいねの正体", en: "What Likes Mean", ko: "좋아요의 정체", zh: "按讚的真相"
            },
            text: {
                ja: "SNSの投稿に対するリアクション（いいね数など）が期待より少なかった時の気持ちは？",
                en: "How do you feel when your SNS post gets fewer likes/reactions than expected?",
                ko: "SNS 게시물에 대한 반응(좋아요 수 등)이 기대보다 적었을 때의 기분은?",
                zh: "當SNS貼文的互動（按讚數等）低於預期時，你的感受是？"
            },
            answers: [
                {
                    text: {
                        ja: "「誰にも見られてないのかな…」と寂しくなり、投稿を消したくなる。",
                        en: "I feel lonely, wondering if no one is watching, and want to delete the post.",
                        ko: "「아무도 안 보나...」 하고 쓸쓸해져서 게시물을 지우고 싶어진다.",
                        zh: "會覺得「是不是沒人看啊…」而感到寂寞，甚至想刪帖。"
                    },
                    value: 'e'
                },
                {
                    text: {
                        ja: "「まあ、自分が気に入っているから関係ないや！」と気にしない。",
                        en: "I don't care because I like it myself anyway!",
                        ko: "「뭐, 내가 마음에 드니까 상관없어!」라며 신경 쓰지 않는다.",
                        zh: "覺得「嘛，我自己喜歡就行！」所以不在意。"
                    },
                    value: 'r'
                }
            ]
        },
        {
            category: {
                ja: "焦りスイッチ", en: "Anxiety Switch", ko: "초조함 스위치", zh: "焦慮開關"
            },
            text: {
                ja: "新しいスキルや知識を身につけようと思う最大の動機は？",
                en: "What is your main motivation for acquiring new skills or knowledge?",
                ko: "새로운 기술이나 지식을 습득하려는 가장 큰 동기는?",
                zh: "您學習新技能或知識的最大動力是？"
            },
            answers: [
                {
                    text: {
                        ja: "周りに置いていかれたくない、または将来の不安を解消するため。",
                        en: "To avoid being left behind, or to resolve future anxieties.",
                        ko: "주변에 뒤처지고 싶지 않거나, 미래의 불안을 해소하기 위해.",
                        zh: "不想被身邊人落下，或者想消除對未來的不安。"
                    },
                    value: 'n'
                },
                {
                    text: {
                        ja: "自分の可能性を広げたい、新しいことに純粋に挑戦したいため。",
                        en: "To expand my potential, or out of pure curiosity for new things.",
                        ko: "자신의 가능성을 넓히고 싶거나, 새로운 일에 순수하게 도전하기 위해.",
                        zh: "想要拓寬自己的可能性，純粹想嘗試新事物。"
                    },
                    value: 'm'
                }
            ]
        },
        {
            category: {
                ja: "見せ方のクセ", en: "Showing Style", ko: "보여주는 습관", zh: "展示習慣"
            },
            text: {
                ja: "自分の魅力や趣味を周囲に伝えるときのスタイルは？",
                en: "What is your style when showing your charm or hobbies to others?",
                ko: "자신의 매력이나 취미를 주변에 알릴 때의 스타일은?",
                zh: "向身邊展示自己的魅力或興趣時，您傾向於哪種風格？"
            },
            answers: [
                {
                    text: {
                        ja: "自ら積極的にSNSなどで発信し、多くの人に知ってもらおうとする。",
                        en: "I actively post on SNS to get as many people to know as possible.",
                        ko: "스스로 적극적으로 SNS 등에 올려 많은 사람들에게 알리려고 한다.",
                        zh: "自己主動在SNS 上發布，想讓更多的人知道。"
                    },
                    value: 'a'
                },
                {
                    text: {
                        ja: "聞かれたら答える程度で、わかる人にだけ見つけてほしいと願う。",
                        en: "I only answer if asked, hoping that only those who get it will find me.",
                        ko: "누가 물어보면 대답하는 정도로, 알아주는 사람만 찾아주길 바란다.",
                        zh: "有人問起才說，只希望懂的人能發現自己就行。"
                    },
                    value: 'p'
                }
            ]
        },
        {
            category: {
                ja: "認められた合図", en: "Proof of Approval", ko: "인정의 신호", zh: "被認可的信號"
            },
            text: {
                ja: "あなたが「他人に認められた」と強く実感する瞬間はどちら？",
                en: "When do you feel most strongly that you have been recognized by others?",
                ko: "당신이 「타인에게 인정받았다」고 강하게 실감하는 순간은?",
                zh: "以下哪一種情況能讓您強烈感受到「被他人認可」？"
            },
            answers: [
                {
                    text: {
                        ja: "売上、フォロワー数、点数などの「明確な数値や結果」が出たとき。",
                        en: "When concrete numbers like sales, followers, or scores are achieved.",
                        ko: "매출, 팔로워 수, 점수 등 「명확한 수치나 결과」가 나왔을 때.",
                        zh: "當銷售額、粉絲數、分數等「明確的資料或結果」出來時。"
                    },
                    value: 'o'
                },
                {
                    text: {
                        ja: "「あなたと一緒にいると楽しい」といった「感情的・感覚的な言葉」をもらったとき。",
                        en: "When receiving emotional words like 'It is fun to be with you'.",
                        ko: "「너랑 있으면 즐거워」 등 「감정적・감각적인 말」을 들었을 때.",
                        zh: "當聽到「和你在一起很開心」這類「情感上或感覺上的話語」時。"
                    },
                    value: 's'
                }
            ]
        },
        {
            category: {
                ja: "褒められた直後", en: "After Praise", ko: "칭찬 직후", zh: "被誇之後"
            },
            text: {
                ja: "目標を達成して人から大絶賛されたとき、脳内で真っ先に思うことは？",
                en: "What is your immediate thought when you reach a goal and get highly praised?",
                ko: "목표를 달성해 사람들에게 대찬사를 받았을 때, 머릿속에 가장 먼저 드는 생각은?",
                zh: "當達成目標並獲得大家讚賞時，您腦海中第一個想法是？"
            },
            answers: [
                {
                    text: {
                        ja: "「みんなが認めてくれた！これでもう安心だ！」と胸を撫で下ろす。",
                        en: "I sigh with relief thinking, 'Everyone accepts me! Now I'm safe!'",
                        ko: "「모두가 인정해 줬어! 이제 안심이다!」라며 안도한다.",
                        zh: "拍著胸脯松口氣：「大家都認可我了！這下終於安全了！」"
                    },
                    value: 'e'
                },
                {
                    text: {
                        ja: "「よし、自分の努力がしっかり実を結んだな」と心の中で静かに噛み締める。",
                        en: "I quietly reflect: 'Yes, my efforts have truly paid off.'",
                        ko: "「좋아, 내 노력이 확실히 결실을 맺었구나」라며 마음속으로 다짐한다.",
                        zh: "在心中默默點頭：「很好，我的努力終於有結果了。」"
                    },
                    value: 'r'
                }
            ]
        },
        {
            category: {
                ja: "避けたい未来", en: "Future to Avoid", ko: "피하고 싶은 미래", zh: "想避開的未來"
            },
            text: {
                ja: "あなたにとって「生きる上で最も避けたい状態」は？",
                en: "What is the single state in life you want to avoid most?",
                ko: "당신에게 있어 「살아가면서 가장 피하고 싶은 상태」는?",
                zh: "對您來說，「人生中最想避免的狀態」是？"
            },
            answers: [
                {
                    text: {
                        ja: "社会的な孤立、仲間外れ、あるいは自分の居場所がなくなること。",
                        en: "Social isolation, being excluded, or having no place to belong.",
                        ko: "사회적인 고립, 따돌림, 혹은 자신의 설 자리가 없어지는 것.",
                        zh: "社交上的孤立、被被邊緣化，或者沒有自己的容身之所。"
                    },
                    value: 'n'
                },
                {
                    text: {
                        ja: "現状維持のまま衰退し、自分のやりたいことが一生できずに終わること。",
                        en: "Decaying in status quo, ending life without doing what I wanted.",
                        ko: "현상 유지에 머무르다 쇠퇴해, 내가 하고 싶은 일을 평생 못 하고 끝나는 것.",
                        zh: "在安於現狀中慢慢退步，一生都無法做自己真正想做的事。"
                    },
                    value: 'm'
                }
            ]
        },
        {
            category: {
                ja: "手柄の置き場", en: "Where Credit Goes", ko: "공로의 위치", zh: "功勞放哪裡"
            },
            text: {
                ja: "もしグループワークで自分のアイデアが良い成果を上げた場合、どう動く？",
                en: "If your idea leads to great results in a group project, what do you do?",
                ko: "만약 그룹 과제에서 자신의 아이디어가 좋은 성과를 냈을 때, 어떻게 행동합니까?",
                zh: "如果團隊工作中因為你的創意取得了不錯成果，您會怎麼做？"
            },
            answers: [
                {
                    text: {
                        ja: "「私のアイデアなんです！」と実績をしっかりアピールする。",
                        en: "I clearly assert my credit: 'That was my idea!'",
                        ko: "「이거 제 아이디어입니다!」라며 내 실적을 확실히 어필한다.",
                        zh: "明確表明主權：「這其實是我的想法！」積極展示自我。"
                    },
                    value: 'a'
                },
                {
                    text: {
                        ja: "自分が提案したと周囲が気づいて自然と評価してくれるのを待つ。",
                        en: "I wait for others to naturally realize and appreciate that I proposed it.",
                        ko: "내가 제안한 것임을 주변이 눈치채고 자연스레 평가해 주길 기다린다.",
                        zh: "等待大家注意到是由自己提案的，並自然而然地給予認可。"
                    },
                    value: 'p'
                }
            ]
        },
        {
            category: {
                ja: "心に残る報酬", en: "Reward That Sticks", ko: "마음에 남는 보상", zh: "留在心裡的獎勵"
            },
            text: {
                ja: "何かのイベントに参加した際、あなたが最も価値を感じるのは？",
                en: "When attending an event, what do you find most valuable?",
                ko: "어떤 이벤트에 참여했을 때, 당신이 가장 가치를 느끼는 것은?",
                zh: "參加某項活動時，您認為最有價值的是？"
            },
            answers: [
                {
                    text: {
                        ja: "修了証やバッジなどの「客観的に証明できる戦利品」をもらうこと。",
                        en: "Receiving tangible trophies like certificates or badges.",
                        ko: "수료증이나 배지 등 「객관적으로 증명할 수 있는 전리품」을 받는 것.",
                        zh: "獲得結業證書或徽章等「可以當作客觀證明的戰利品」。"
                    },
                    value: 'o'
                },
                {
                    text: {
                        ja: "その場で生まれた「仲間とのエモい連帯感や、直感的な楽しさ」を味わうこと。",
                        en: "Experiencing emotional bonding and intuitive fun with others.",
                        ko: "그 자리에서 싹튼 「동료들과의 에모한 연대감이나 직관적인 즐거움」을 맛보는 것.",
                        zh: "體驗當時產生的「與同伴之間的感性紐帶，或直觀的樂趣」。"
                    },
                    value: 's'
                }
            ]
        },
        {
            category: {
                ja: "既読と沈黙", en: "Views and Silence", ko: "조회와 침묵", zh: "已讀與沉默"
            },
            text: {
                ja: "ストーリーの閲覧数はあるのに反応が少ないとき、つい考えるのは？",
                en: "When your story has views but almost no reactions, what do you tend to think?",
                ko: "스토리 조회수는 있는데 반응이 거의 없을 때, 무심코 드는 생각은?",
                zh: "限時動態有瀏覽量卻幾乎沒人互動時，你最容易想到什麼？"
            },
            answers: [
                {
                    text: {
                        ja: "「見てるなら何か押してよ」と、誰が見たかまで確認してしまう。",
                        en: "I check who saw it and think, 'If you looked, react to it.'",
                        ko: "「봤으면 뭐라도 눌러주지」 싶어서 누가 봤는지까지 확인한다.",
                        zh: "會想「都看了怎麼不點一下」，甚至去查是誰看過。"
                    },
                    value: 'e'
                },
                {
                    text: {
                        ja: "記録として残せたなら十分で、反応の有無はあまり引きずらない。",
                        en: "If it works as my own record, reactions do not linger much.",
                        ko: "내 기록으로 남겼다면 충분해서 반응 유무를 오래 끌지 않는다.",
                        zh: "能作為自己的記錄留下就夠了，不太纠結有沒有反應。"
                    },
                    value: 'r'
                }
            ]
        },
        {
            category: {
                ja: "流行への距離", en: "Distance from Trends", ko: "유행과의 거리", zh: "和流行的距離"
            },
            text: {
                ja: "知らないSNSの流行が急に周りで盛り上がったとき、最初の反応は？",
                en: "When a new SNS trend suddenly spreads around you, what is your first reaction?",
                ko: "모르는 SNS 유행이 갑자기 주변에서 뜰 때, 첫 반응은?",
                zh: "身邊突然流行起一個你不了解的SNS玩法時，你的第一反應是？"
            },
            answers: [
                {
                    text: {
                        ja: "「乗り遅れたら存在感が薄くなるかも」と急いで把握する。",
                        en: "I rush to understand it because being late might make me invisible.",
                        ko: "「늦으면 존재감이 옅어질지도」 싶어서 급히 파악한다.",
                        zh: "會趕緊弄懂，擔心「跟不上就會沒存在感」。"
                    },
                    value: 'n'
                },
                {
                    text: {
                        ja: "面白そうなら自分なりの使い方を試し、違えば静かに見送る。",
                        en: "If it seems fun, I test my own spin; if not, I let it pass.",
                        ko: "재밌어 보이면 내 방식으로 써 보고, 아니면 조용히 넘긴다.",
                        zh: "覺得有趣就用自己的方式試試，不合適就安靜略過。"
                    },
                    value: 'm'
                }
            ]
        },
        {
            category: {
                ja: "作品の出し方", en: "Sharing Your Work", ko: "작품을 내는 법", zh: "作品怎麼發"
            },
            text: {
                ja: "いい感じの作品や成果ができた直後、あなたが取りがちな行動は？",
                en: "Right after making something you feel proud of, what do you usually do?",
                ko: "마음에 드는 작품이나 성과가 생긴 직후, 주로 어떤 행동을 하나요?",
                zh: "剛做出自己滿意的作品或成果時，你通常會怎麼做？"
            },
            answers: [
                {
                    text: {
                        ja: "熱が冷めないうちに、制作過程やこだわりも含めて投稿する。",
                        en: "I post it while the energy is fresh, including the process and details.",
                        ko: "열기가 식기 전에 과정과 포인트까지 함께 올린다.",
                        zh: "趁熱度還在，把過程和講究也一起發出來。"
                    },
                    value: 'a'
                },
                {
                    text: {
                        ja: "まず自分だけで眺め、見せる相手やタイミングをかなり選ぶ。",
                        en: "I enjoy it privately first and carefully choose who and when to show.",
                        ko: "먼저 혼자 감상하고, 보여줄 사람과 타이밍을 꽤 고른다.",
                        zh: "先自己欣賞，再慎重選擇給誰看、什麼時候發。"
                    },
                    value: 'p'
                }
            ]
        },
        {
            category: {
                ja: "伸びた夜の本音", en: "The Night It Performs", ko: "잘 된 밤의 속마음", zh: "爆了那晚的真心話"
            },
            text: {
                ja: "投稿が伸びた日の夜、あとで見返したくなるのはどちら？",
                en: "On a day when a post performs well, what do you want to revisit later?",
                ko: "게시물이 잘 된 날 밤, 나중에 다시 보고 싶은 것은?",
                zh: "貼文表現不錯的那天晚上，你之後更想回看哪一種？"
            },
            answers: [
                {
                    text: {
                        ja: "伸びた数字、ランキング、保存数などの結果画面。",
                        en: "The result screen: numbers, ranking, saves, and reach.",
                        ko: "올라간 숫자, 순위, 저장 수 같은 결과 화면.",
                        zh: "增長的資料、排名、收藏數等結果畫面。"
                    },
                    value: 'o'
                },
                {
                    text: {
                        ja: "誰かの一言コメントや、空気が変わった瞬間の感触。",
                        en: "A single comment from someone, or the feeling that the mood shifted.",
                        ko: "누군가의 한마디 댓글이나 분위기가 바뀐 순간의 감각.",
                        zh: "某個人的一句留言，或氛圍突然變化的那種感覺。"
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
            name: { ja: "かまってちゃん型ポメラニアン", en: "Whining Pomeranian", ko: "관심종자형 포메라니안", zh: "求追蹤型博美犬" },
            description: {
                ja: "他人の視線（視線泥棒なハッピーかまってちゃん）と客観的ステータスを渇望しつつ、自分からはアピールできない（ビビリなあんしん安全第一派）。しかし心は成長（意識高めな限界突破オタク）を望むアンバランス種。",
                en: "Craving others' gaze (Attention-Stealer Happy Needy) and objective status, yet unable to assert yourself (Timid Safety-First Group), while secretly desiring inner growth (High-Conscious Limit-Break Otaku).",
                ko: "타인의 시선(시선강탈 해피 관심종자)과 객관적 스펙을 갈망하면서도, 정작 스스로 어필하지는 못하는(소심한 안심안전 제일파). 하지만 마음속으로는 성장(의식 높은 한계돌파 오타쿠)을 바라는 불안정한 존재.",
                zh: "渴望他人的目光（搶鏡開心求追蹤狂）與客觀地位，卻無法主動展示自我（膽小安心安全第一派），同時內心深處又向往著個人成長（意識超前極限突破宅）的矛盾結合體。"
            },
            fallback: {
                ja: "「誰か私を褒めて！」と内心で絶叫しているくせに、スルーされる恐怖から自分では一切発信できないチキン。過去の栄光の数字を必死に握りしめ、物陰から誰かが「凄いね」と声をかけてくれるのをじっと監視しているイタい忠犬です。無駄に高いプライドのせいで身動きが取れなくなっていますよ。",
                en: "Dying for praise, yet you lack the courage to post. Clinging to status metrics, you watch from the shadows like a watchdog waiting for someone to walk by and call you 'brilliant.' Your useless pride is weighing you down.",
                ko: "칭찬은 받고 싶어 안달 났으면서 정작 스스로 올릴 배짱은 없다. 실적 숫자만 꽉 쥐고 지나가던 누군가가 '우수하네'라고 말해주길 그늘 속에서 충견처럼 감시하고 있군요. 쓸데없는 자존심만 너무 무겁습니다.",
                zh: "極度渴望被誇獎，卻又沒有勇氣主動發聲。只敢死死抱住資料，像只看門狗一樣躲在暗處，監視著有沒有人路過時順口誇一句「你真棒」。你那毫無意義的自尊心實在太沉重了。"
            }
        },
        pomr: {
            emoji: "🐌",
            name: { ja: "殻にこもる自律カタツムリ", en: "Hermit Snail", ko: "껍질 속에 숨는 자율 달팽이", zh: "隱居自律小蝸牛" },
            description: {
                ja: "マイペースなゴーイングマイウェイ精神と客観的実績にストイックに向き合う。アピールせず（ビビリなあんしん安全第一派）静かに殻の中で「自分が最強」と自惚れる気難しい哲学者。",
                en: "Stoically facing My-Way Independent Spirit and objective results. Quietly bragging inside your shell (Timid Safety-First Group) that you are the best without advertising it.",
                ko: "마이웨이 마이페이스 정신과 객관적 성과를 스토익하게 마주함. 어필은 극도로 자제하며(소심한 안심안전 제일파) 조용히 껍질 속에서 '내가 최고'라며 자만하는 까다로운 철학자.",
                zh: "默默地堅持著我行我素我的路精神並追求客觀成果。從不炫耀（膽小安心安全第一派），只是靜靜地躲在殼裡自戀地認為「我才是最強的」的孤僻哲學家。"
            },
            fallback: {
                ja: "「私は他人の評価なんて興味ない、成長しか追わない」とスカしたツラで嘯く、自称・孤高の天才。自分が世界で一番優秀だと本気で信じ込んでいるので、他人が自分を神格化して崇め奉らない現状に、殻の中でイライラしながら怒り狂っています。",
                en: "A snail posing as a lonely sage claiming to only care about results. Convinced you're superior, you pretend to reject lukewarm opinions, but inside you're raging at a world that refuses to bow down to your secret genius.",
                ko: "'나는 오직 성과와 성장만을 쫓는다'고 으스대는 외로운 현자 행세 달팽이. 자신이 가장 뛰어나다고 믿고 있기에 남들의 미지근한 평가는 거부하는 척하지만, 본심은 자신에게 굴복하지 않는 세상에 분노하고 있습니다.",
                zh: "自詡為「只追求成果與成長」的孤高賢者。因為堅信自己是最優秀的，所以表面上對他人平庸的評價不屑一顧，內心其實在為這個世界沒有向你屈服而咬牙切齒。"
            }
        },
        pone: {
            emoji: "🐩",
            name: { ja: "怯える甘えん坊トイプー", en: "Frightened Toy Poodle", ko: "겁먹은 응석받이 토이푸들", zh: "膽怯撒嬌貴賓犬" },
            description: {
                ja: "安心安全な居場所（ビビリなあんしん安全第一派）と視線泥棒なハッピーかまってちゃん欲求にしがみつく。自ら動かず、客観的実績の鎧で武装して誰かが拾ってくれるのを待つタイプ。",
                en: "Clinging to safe places (Timid Safety-First Group) and Attention-Stealer Happy Needy needs. Staying passive, waiting with objective armor for someone to save you.",
                ko: "안심하고 쉴 곳(소심한 안심안전 제일파)과 시선강탈 해피 관심종자 성향에 집착함. 먼저 나서지 않고 객관적 실적의 갑옷을 입은 채 누군가 자신을 데려가 주길 기다리는 타입.",
                zh: "死死抓住安全港灣（膽小安心安全第一派）以及搶鏡開心求追蹤狂的渴望不放。自己不願邁出一步，只敢披著客觀成果的外衣，等待著別人來拯救自己。"
            },
            fallback: {
                ja: "社会的な死（孤立）を病的に恐れ、他人のいいねや評価という酸素ボンベなしでは息もできない寄生生物。自分を売り込む度胸は皆無なので、過去の実績や学歴などのラベルを全身に貼り付け、物陰でプルプル震えながら「誰か私を養って」と物乞いしています。",
                en: "Trembling with fear of exclusion, you crave praise like an oxygen tank. Lacking the courage to pitch yourself, you just wear credentials like armor, shivering and silently begging: 'Someone rescue me.'",
                ko: "사회에서 버림받을까 두려움에 떨며 타인의 평가라는 산소 호흡기를 찾고 있습니다. 스스로 어필할 용기는 눈곱만큼도 없기에 그저 객관적 스펙만 껴입은 채 '누구 없어요?'라며 떠는 응석받이입니다.",
                zh: "一邊對被社會排擠的恐惧戰戰兢兢，一邊瘋狂渴求他人認可的供氧。因為沒有絲毫自我展示的勇氣，只能用客觀標籤包裝自己，像個縮在角落瑟瑟發抖哭喊「誰來幫幫我」的巨嬰。"
            }
        },
        ponr: {
            emoji: "🐨",
            name: { ja: "要領のいい保身コアラ", en: "Sly Protector Koala", ko: "처세 좋은 보신 코알라", zh: "善於保身的樹袋熊" },
            description: {
                ja: "安全第一（ビビリなあんしん安全第一派）で自分の評価だけは守りたいマイペースなゴーイングマイウェイ精神。客観的な数字やルールを盾にして絶対に傷つかない位置をキープする。",
                en: "Seeking safety (Timid Safety-First Group) while holding onto My-Way Independent Spirit. Hiding behind figures and rules to stay out of harm's way.",
                ko: "안전제일(소심한 안심안전 제일파)로 자기 평가만은 지키고 싶은 마이웨이 마이페이스 정신. 객관적인 수치와 규칙을 방패 삼아 절대로 상처받지 않는 포지션을 사수하는 인물.",
                zh: "奉行安全第一（膽小安心安全第一派），極力維護自身評價的我行我素我的路精神。用客觀資料與規則做盾牌，將自己安放在絕對不會受傷的安全位置。"
            },
            fallback: {
                ja: "傷つくのが怖すぎて、絶対に責任を取らなくて済む安全シェルターから一歩も出ない究極のヘタレ。他人の実績や既存のルールを盾にして「私は悪くありません」と予防線を張りまくる保身のプロですが、その徹底した逃げ腰人生、薄っぺらすぎて虚しくないですか？",
                en: "Pathologically terrified of hurt, you watch the world from a bulletproof zone holding metrics as a shield. Your lazy self-defense is genius, but your shallow life will eventually bore you to death.",
                ko: "상처받는 걸 병적으로 두려워해 책임질 필요가 없는 안전지대에서 수치와 실적이란 방패 뒤에 숨어 세상을 관찰합니다. 보신술 하나는 천재적이지만 그 인생の 얄팍함에 언젠가 본인조차 질려버릴 겁니다.",
                zh: "病態般地害怕受傷。躲在絕對不需要承擔責任的安全地帶，拿著資料和成果當盾牌冷眼旁觀。你的節能保身術堪稱天下一絕，但如此空洞的人生，遲早有一天連你自己都會覺得無聊透頂。"
            }
        },
        psme: {
            emoji: "🐹",
            name: { ja: "エモさ渇望インフルエンサー予備軍", en: "Emo-Star Wannabe", ko: "감성 갈망 인플루언서 꿈나무", zh: "渴望情懷的預備網紅" },
            description: {
                ja: "共感やエモさ（視線泥棒なハッピーかまってちゃん）と他人の称賛で精神を満たし、意識高めな限界突破オタクへ成長したいと願うが、受動的（ビビリなあんしん安全第一派）で動けない。",
                en: "Desiring emotional sparks (Attention-Stealer Happy Needy) and praise, wanting to grow (High-Conscious Limit-Break Otaku), but too timid (Timid Safety-First Group) to take action.",
                ko: "공감과 갬성(시선강탈 해피 관심종자) 및 타인의 찬사로 충전되어 의식 높은 한계돌파 오타쿠로 거듭나길 꿈꾸나, 소심함(소심한 안심안전 제일파) 때문에 꼼짝도 못 함.",
                zh: "用共鳴與情懷（搶鏡開心求追蹤狂）以及他人的讚美滋養精神，渴望蛻變為意識超前極限突破宅。然而骨子裡的被動與膽小（膽小安心安全第一派）讓你根本無法邁步。"
            },
            fallback: {
                ja: "「私のエモい感性を誰か発見して絶賛して！」と夢見る、発信力ゼロのインフルエンサー気取り。スルーされるのが怖くて自分からは何も出せず、他人の投稿にせっせとイイネを配りながら、「早く私を見つけて崇めて」と不気味なテレパシーを送り続けています。",
                en: "You desperately want high-end doses of 'empathy' and 'praise,' but your passivity locks you up. As you double-tap others' posts, you send telepathic waves saying: 'Someone notice me!'",
                ko: "'에모한 공감'과 '남들의 찬사'라는 명품 비타민을 간절히 원하지만 소심함에 걸려 아무것도 올리지 못합니다. 남들 글에 하트만 누르면서 '빨리 날 알아채줘' 하고 텔레파시를 보낼 뿐입니다.",
                zh: "對「感性的共鳴」和「他人的盛讚」這種高級補藥垂涎三尺，卻因為被動詛咒而不敢發聲。在給別人的貼文按讚的同時，默默在腦海裡傳送著「快來發現我」的怨念腦波。"
            }
        },
        psmr: {
            emoji: "🐈‍⬛",
            name: { ja: "孤高のパステル黒猫", en: "Aloof Pastel Black Cat", ko: "고고한 파스텔 검은 고양이", zh: "高冷的粉彩黑貓" },
            description: {
                ja: "独自の主観的世界観を育み、マイペースなゴーイングマイウェイ精神でのみ成長（意識高めな限界突破オタク）する。アピールもしない（ビビリなあんしん安全第一派）ミステリアス種。",
                en: "Nurturing an original subjective worldview, growing (High-Conscious Limit-Break Otaku) only through My-Way Independent Spirit. Unassertive (Timid Safety-First Group) and mysterious.",
                ko: "독자적인 감성 세계관을 키우며 오직 마이웨이 마이페이스 정신으로만 성장(의식 높은 한계돌파 오타쿠)함. 자신을 알리려 하지 않는(소심한 안심안전 제일파) 미스터리 고양이.",
                zh: "孕育著獨特的個人主觀世界，完全依靠我行我素我的路精神來獲得成長（意識超前極限突破宅）。從不自我張揚（膽小安心安全第一派），極其神秘。"
            },
            fallback: {
                ja: "「凡人に私の高尚なセンスは理解できない」と斜に構え、自分の脳内ワールドで自家発電している痛々しい迷子。外へのアピールを拒絶しているため、周囲からは単なる「気難しくて絡みづらい陰キャ」として完全に空気扱いされています。それに気づかず孤高を気取っているのがおめでたいですね。",
                en: "Shut off in your own worldview and self-satisfaction, pretending you don't need anyone's understanding. With zero voice, you're forgotten as 'that quiet, stubborn person,' which is your ultimate shelter.",
                ko: "독자적인 뇌내 세계와 자기 만족으로 완전히 차단되어 타인의 이해 따윈 거부하는 척합니다. 아웃풋이 전혀 없기에 주변에선 '그냥 까탈스럽고 조용한 애'로 잊혔으며, 그 소외감이 본인에겐 최고의 벙커입니다.",
                zh: "用獨特的個人世界和自我感動畫地為牢，擺出一副不需要任何人理解的姿態。發聲力為零的你，在身邊人眼中不過是個「性格古怪的悶葫蘆」，並徹底被遺忘，而這正是你最享受的避風港。"
            }
        },
        psne: {
            emoji: "🐥",
            name: { ja: "見守られ待ちピヨちゃん", en: "Watch-Me Baby Chick", ko: "보살핌 대기조 삐약이", zh: "求追蹤的孵化小雞" },
            description: {
                ja: "主観的なキャラクター愛と他人の保護（視線泥棒なハッピーかまってちゃん）を求める安全志向（ビビリなあんしん安全第一派）。自分からは一切アピールせず見守りを受ける。",
                en: "Seeking character love and safety (Timid Safety-First Group) through Attention-Stealer Happy Needy. Never marketing yourself, simply waiting to be nurtured.",
                ko: "주관적인 감정 이입과 타인의 따스한 시선(시선강탈 해피 관심종자)을 갈구하는 안전 지향형(소심한 안심안전 제일파). 자신은 움직이지 않고 그저 남이 챙겨주길 바람.",
                zh: "追求主觀的角色魅力與他人的呵護（搶鏡開心求追蹤狂），屬於極度缺乏安全感（膽小安心安全第一派）類型。自己擺脫不掉被動，只靜靜等待他人的守護。"
            },
            fallback: {
                ja: "自分は一切の努力もリスクテイクもしないくせに、周囲から「可愛いね、守ってあげる」と無条件でチヤホヤされるのを待っている甘えたヒヨコ。他人の善意と優しさを吸い尽くすことしか考えておらず、永遠に他力本願の温室でぬくぬくしていたいだけの幼児退行モンスターです。",
                en: "An infant type feeding on subjective personality and others' free kindness. You never extend a hand, simply scanning the horizon for a warm cradle where someone will pet you and call you cute.",
                ko: "주관적인 오구오구 감성과 타인의 대가 없는 친절을 빨아먹는 영아형. 본인은 절대 먼저 베풀지 않고 '어머 귀여워라, 챙겨줄게'라며 누군가 쓰다듬어 줄 따뜻한 요람만 필사적으로 수색합니다.",
                zh: "一味吸食主觀特質與他人無償善意的幼兒型。自己絕不伸手，只用盡全力去搜尋那張能聽到別人誇「真可愛、好想保護你」並摸摸頭的心靈溫床。"
            }
        },
        psnr: {
            emoji: "🐼",
            name: { ja: "マイペースな引きこもりパンダ", en: "Low-Energy Panda", ko: "마이웨이 방구석 판다", zh: "我行我素宅地熊貓" },
            description: {
                ja: "自分の感性のみを信じ、他人の視線や成長を必要としない安全志向（ビビリなあんしん安全第一派）のマイペースなゴーイングマイウェイ精神。省エネで静かに余生を過ごす。",
                en: "Believing only in your own senses, needing no gaze or growth, living in My-Way Independent Spirit (Timid Safety-First Group). Quietly idling through life on energy-saving mode.",
                ko: "내 감성만 믿으며, 타인의 평판이나 성장도 필요 없는 안전 우선형(소심한 안심안전 제일파)의 마이웨이 마이페이스 정신. 에너지 절약으로 편안히 여생을 보냄.",
                zh: "只相信自己的感性，既不需要他人的目光也不在乎個人成長，安全至上（膽小安心安全第一派）的我行我素我的路精神。用節能模式靜靜地安度餘生。"
            },
            fallback: {
                ja: "「私は私、他人は他人」と達観したフリをして、成長からも他者との関わりからも全力で逃避している引きこもりパンダ。省エネという名の怠惰の極みであり、世間の荒波からソッコーでログアウトして、自分の狭い趣味の世界だけを咀嚼して一生を終える予定のようです。",
                en: "A sleeping panda who thinks your taste is absolute, and cares zero about evaluation or growth. The peak of energy-saving defense: you quietly log out and munch on your tiny world.",
                ko: "자기 감각만 최고며, 남들의 채점표도 본인의 성장조차도 진심으로 아웃 오브 안중인 채 잠만 자는 판다. 절약형 처세의 극치로, 세상의 소음에서 조용히 로그아웃해 자신만의 세상을 갉아먹고 있습니다.",
                zh: "堅信只有自己的感性是絕對的，同時對別人的評價甚至自己的成長都打心底覺得無所謂的瞌睡熊貓。節能保身的終極形態，悄無聲息地從世界的喧囂中登出，津津有味地咀嚼著自己的小世界。"
            }
        },
        aome: {
            emoji: "🦁",
            name: { ja: "マウンティング突撃ライオン", en: "Flexing Charging Lion", ko: "마운팅 돌격 사자", zh: "炫耀突擊狂暴獅" },
            description: {
                ja: "実績や数値と他者承認（視線泥棒なハッピーかまってちゃん）を求め、誰よりも能動的（意識高めな限界突破オタク）に自己アピールしながら成長したいと願うギラギラ種。",
                en: "Demanding results, metrics, and others' approval (Attention-Stealer Happy Needy), actively pushing yourself (High-Conscious Limit-Break Otaku) while hunting for growth.",
                ko: "성과 수치와 타인 승인(시선강탈 해피 관심종자)을 좇아, 누구보다 능동적으로(의식 높은 한계돌파 오타쿠) 자신을 세일즈하며 성장하고픈 야망의 포식자.",
                zh: "追求資料與他人的認可（搶鏡開心求追蹤狂），比任何人都更加主動地表現自我（意識超前極限突破宅），渴望在攀登的過程中獲得成長。"
            },
            fallback: {
                ja: "「私の努力と実績を見よ！」と全速力でマウンティングの山を駆け登る、自己アピール過剰の爆走ライオン。自分が主役で、常にスポットライトを浴びていないと死んでしまう病気です。いくら「いいね」をもらっても底なし沼のように乾ききっており、一生承認欲求に追われて走り続ける哀れなモンスター。",
                en: "A passionate lion sprinting up the climbing wall with metrics in one hand and compliments in the other. Your display of hustle must be watched by all. Your hunger is infinite; satisfy it once, and you roar again in seconds.",
                ko: "실적 데이터와 남들의 찬양을 양손에 쥐고 마운팅 정상을 향해 질주하는 열혈 사자. 내가 가장 애쓰고 자라는 걸 남들이 생생히 중계해 줘야만 직성이 풀립니다. 승인 굶주림이 심해 잠시 채워져도 금세 으르렁거립니다.",
                zh: "雙手捧著成就資料與他人的鮮花，全速向著階層頂端攀登的熱血狂獅。必須讓所有人目睹你最努力、最優秀的姿態。對認同感的飢餓感極強，即使短暫獲得滿足，也很快會再次焦慮吼叫。"
            }
        },
        aomr: {
            emoji: "🐺",
            name: { ja: "無自覚マニアックオオカミ", en: "Aggressive Solo Wolf", ko: "무자각 매니악 늑대", zh: "無意識狂熱孤狼" },
            description: {
                ja: "成長欲求（意識高めな限界突破オタク）が高く、実績数値と自己承認（マイペースなゴーイングマイウェイ精神）を持つ。能動的なアピールは行う戦闘型。",
                en: "Highly ambitious (High-Conscious Limit-Break Otaku), holding solid output and self-standard (My-Way Independent Spirit). An active, combative hunter.",
                ko: "성장 의욕(의식 높은 한계돌파 오타쿠)이 매우 높으며, 확고한 결과물과 자기 기준(마이웨이 마이페이스 정신)을 갖춤. 능동적 아필에 주저함이 없는 전투형 늑대.",
                zh: "擁有強烈的成長欲求（意識超前極限突破宅），具備過硬的成果與自我標準（我行我素我的路精神）。會進行積極展示的戰斗型人格。"
            },
            fallback: {
                ja: "圧倒的な成長アピールと成果をこれでもかと見せつけつつ、「他人の評価なんか眼中にない」とクールを装う一番めんどくさい自惚れオオカミ。他人に認められること以上に、「私、お前ら凡人とは次元が違うから」とマインドマウンティングをして悦に浸っている痛々しいナルシストです。",
                en: "A toxic show-off flexing accomplishments and growth speed while muttering 'I don't care what you think.' You care less about being loved than getting drunk on your own self-assessed dominance.",
                ko: "자랑스러운 실적และ 압도적 성장 스피드를 있는 대로 동네방네 자랑하면서 '남의 눈초리 따윈 아무래도 좋은데'라며 내숭 떠는 가장 성가신 부류. 인정받기보단 내가 한참 위에 있다는 서열질에 취해 있습니다.",
                zh: "一邊向身邊人瘋狂炫耀自己引以為傲的成果與驚人的成長速度，一邊裝模作樣地嘀咕著「反正別人的評價我根本不在乎」，簡直是死要面子。比起被認同，你更沉醉於自己居高臨下的優越感。"
            }
        },
        aone: {
            emoji: "🦜",
            name: { ja: "手柄泥棒アピールオウム", en: "Credit-Claiming Parrot", ko: "공치사 어필 앵무새", zh: "搶功大喇叭鸚鵡" },
            description: {
                ja: "他人の視線（視線泥棒なハッピーかまってちゃん）と安息（ビビリなあんしん安全第一派）が最優先。自分の少しの実績数値をこれでもかと吹聴し、実力以上の評価を狙う。",
                en: "Attention-Stealer Happy Needy and safety (Timid Safety-First Group) are your oxygen. Loudly broadcasting minor results to hook a rating beyond your pay grade.",
                ko: "남의 시선(시선강탈 해피 관심종자)과 안락한 포지션(소심한 안심안전 제일파)이 생명선. 소소한 내 실적을 귀가 따갑게 불어대며 능력 이상의 버블 평가를 노리는 기회주의자.",
                zh: "將他人的視線（搶鏡開心求追蹤狂）與自身安全（膽小安心安全第一派）視為生命線。瘋狂吹噓自己取得的丁點資料，試圖以此謀取超出實力的地位。"
            },
            fallback: {
                ja: "嫌われる恐怖に怯えながらも、コミュニティの主導権を握りたくて必死にデカい声でアピールを繰り返す、手柄泥棒オウム。他人の功績やちょっとした実績をさも「自分がやりました」風にデコレーションして吹聴する、中身スカスカの拡声器タイプです。",
                en: "Terrified of being hated, you push active marketing just to secure a safe spot in the club. Exaggerating others' ideas or tiny numbers, you're a loud bird fighting for a nest.",
                ko: "집단에서 미움받을까 전전긍긍하면서 정작 권력의 안전한 코어에 서기 위해 요란한 어필을 늘어놓습니다. 남의 기획안이나 푼돈 같은 숫자를 과장해 소란을 피우며 생존 공간을 확보하려는 시끄러운 새입니다.",
                zh: "因為害怕被群體排斥，同時為了確保自己在社群中的核心安全地位，不斷進行誇張的主動宣傳。把別人的創意或微不足道的資料無限放大並四處聲張，拼命鞏固立足之地的噪雜鳥類。"
            }
        },
        aonr: {
            emoji: "🐕",
            name: { ja: "合理的ルールポリス柴犬", en: "Rational Rule Police Dog", ko: "합리적 규칙 경찰 시바견", zh: "理性規則哨兵柴犬" },
            description: {
                ja: "安全と保身（ビビリなあんしん安全第一派）のため、実績数値と自己ルール（マイペースなゴーイングマイウェイ精神）をフル稼働し、能動的アプローチで周囲を管理・統制する。",
                en: "For protection (Timid Safety-First Group), using results and rules (My-Way Independent Spirit) to actively monitor and organize your environment.",
                ko: "신분 보장(소심한 안심안전 제일파)을 위해 성과 지표와 사내 룰(마이웨이 마이페이스 정신)을 악착같이 가동함. 주도적으로 주변を 관리하고 규제하는 헌병견.",
                zh: "為了自身的安全與保身（膽小安心安全第一派），物盡其用地壓榨客觀資料與個人準則（我行我素我的路精神），以積極的態度對身邊進行規制與統治。"
            },
            fallback: {
                ja: "自分の安全と利益（ビビリなあんしん安全第一派）を絶対防衛するため、ルールやマニュアルを棍棒のように振り回して他者を管理・攻撃（能動的ゴリゴリ系）する冷酷なポリス柴犬。客観的な「正論」という防弾チョッキを着てマウントを取り、絶対に責任の及ばない安全な特等席にドカッと腰掛けています。",
                en: "To secure personal safety and gains, you aggressively run rule systems to build a fortress. Using objective correctness as a weapon, you lecture everyone and sit on a comfortable throne like a cold guard dog.",
                ko: "자기 안전과 몫을 챙기기 위해 제약과 매뉴얼을 칼같이 단속하고 들이밀며 난공불락 성벽을 쌓습니다. 본인의 객관적 결백함을 무기 삼아 남을 훈계하며 꿀 빠는 자리에 앉은 차가운 경비견입니다.",
                zh: "為了牢牢守護自己的安全與既得利益，蠻橫地制定並推行各種規則體制以搭建避難所。把客觀上的「正確性」當作擋箭牌四處懟人，穩坐於最穩妥、最舒服的防禦高台的冷酷守衛犬。"
            }
        },
        asme: {
            emoji: "🦚",
            name: { ja: "ドヤ顔クリエイティブ孔雀", en: "Showy Creative Peacock", ko: "거들먹거리는 크리에이티브 공작", zh: "得意洋洋的文藝孔雀" },
            description: {
                ja: "感性やエモさ（視線泥棒なハッピーかまってちゃん）を能動的に振りまき、他人の絶賛を浴びながら意識高めな限界突破オタクへと成長したい自己愛モンスター。",
                en: "Actively spreading aesthetic vibes (Attention-Stealer Happy Needy), feeding on praise to grow as a High-Conscious Limit-Break Otaku.",
                ko: "자신의 재능과 갬성(시선강탈 해피 관심종자)을 거침없이 발산하며, 남들의 숭배를 마시며 의식 높은 한계돌파 오타쿠로 진화하고픈 자기애 과잉 포식자.",
                zh: "將自身的情懷與感性（搶鏡開心求追蹤狂）當成羽毛四處招搖，渴望在別人的矚目中成長為意識超前極限突破宅的極度自戀怪。"
            },
            fallback: {
                ja: "「私のこの唯一無二のエモい感性とセンスを見て！」と羽をバサバサ広げて踊り狂う、自己表現過剰な孔雀。他人の「センス良すぎ！」という絶賛（視線泥棒なハッピーかまってちゃん）だけが主食で、それがないと干からびます。他人に消費され、飽きられるまで踊り続ける終わりのない悲劇のピエロ。",
                en: "Spreading wings screaming 'Watch my deep emotions and growth!', feeding and swelling on comments calling you 'so artistic.' You won't stop dancing until your vibes are totally sucked dry by spectators.",
                ko: "'내 남다른 감각과 진화를 봐줘!'라며 활짝 꼬리를 펴고 '센스 만점!'이라는 남들의 물개박수를 주워 먹고 부풀어 오르는 자기애 덩어리. 내 감성이 남들에게 다 닳아 없어질 때까지 댄스를 멈출 줄 모릅니다.",
                zh: "張開絢麗的尾羽向全世界高喊「快看我這無與倫比的才華與成長！」，吸食著別人打心底奉上的「你真有品味」等讚辭而自我膨脹。在你的感性被觀眾壓榨乾淨之前，你是絕對無法停止這支求偶舞的。"
            }
        },
        asmr: {
            emoji: "🦔",
            name: { ja: "我道突っ走りハリネズミ", en: "Edgy Solo Hedgehog", ko: "독불장군 질주 고슴도치", zh: "獨來獨往的狂奔刺蝟" },
            description: {
                ja: "強い自己基準（マイペースなゴーイングマイウェイ精神）と独自の感性を持ち、成長（意識高めな限界突破オタク）のために能動的に我が道を切り拓くトゲだらけのクリエイター。",
                en: "Holding strong self-satisfaction (My-Way Independent Spirit) and unique taste, actively creating paths for Growth (High-Conscious Limit-Break Otaku). A prickly designer.",
                ko: "굳건한 자부심(마이웨이 마이페이스 정신)과 남다른 안목을 지님. 한계 돌파 오타쿠적 성장만을 위해 공격적으로 마이웨이를 돌파하는 가시 돋친 크리에이터.",
                zh: "懷抱極強的個人準則（我行我素我的路精神）與奇妙的感性，為了實現自我價值（意識超前極限突破宅）而橫衝直撞、渾身是刺的開路者。"
            },
            fallback: {
                ja: "「お前ら凡人の理解なんか1ミリも要らん」と周囲を拒絶し、己の絶対的な感性（主観エモ至上主義）と自己成長（意識高めな限界突破オタク）のために他者を威嚇（能動的ゴリゴリ系）するトゲトゲ尖りすぎモンスター。周囲に攻撃的な毒を吐き散らしながら進むため、誰も寄り付かない孤独なイタい芸術家ロードを爆進中。",
                en: "Ignoring others' validation, actively attacking for your personal aesthetics and self-growth. Poking needles into everyone you pass, you walk a lonely, scarred path of a self-proclaimed genius.",
                ko: "남의 시선이나 비판은 전면 무시하고 본인의 절대 미학(Subjective)과 커리어(Growth)를 위해 주동적으로 가시를 세우는 고슴도치. 온 사방에 생채기를 내며 걷기에 상처뿐인 고독한 예술가 행세입니다.",
                zh: "徹底無視他人的看法，為了自己那不可動搖的美學標準與個人價值實現，主動齜牙咧嘴宣示主權的刺蝟。因為一路上會把尖刺無差別扎向所有路人，所以走的是一條傷痕累累、只配孤獨一生的「偽天才之路」。"
            }
        },
        asne: {
            emoji: "🐕‍🦺",
            name: { ja: "依存型バズりチワワ", en: "Viral-Desperate Chihuahua", ko: "의존성 관심 갈구 치와와", zh: "病態求追蹤的抖動吉娃娃" },
            description: {
                ja: "情緒的な安心感（ビビリなあんしん安全第一派）と愛されたい欲求（視線泥棒なハッピーかまってちゃん）を満たすため、能動的にかまってアピールを繰り返すモンスター。",
                en: "Seeking safety (Timid Safety-First Group) and love (Attention-Stealer Happy Needy). Desperately spamming active shouts to trigger validation.",
                ko: "정서적 유대(소심한 안심안전 제일파)와 예쁨 받고 싶은 욕망(시선강탈 해피 관심종자)을 먹으려, 극성맞게 치대며 애교를 남발하는 귀찮은 멍뭉이.",
                zh: "為了填補情感安全感的缺失（膽小安心安全第一派）以及渴望被愛的訴求（搶鏡開心求追蹤狂），頻繁且主動地採取抱大腿等行為的黏人小妖精。"
            },
            fallback: {
                ja: "愛されたい、居場所が欲しいという寂しさ（ビビリなあんしん安全第一派）から、なりふり構わず「構って！」とSNSで暴れる（能動的ゴリゴリ系）メンヘラチワワ。他人の目を引くためならお気持ち表明や過激な自虐も厭わず、キャンキャン吠えながら優しくしてくれるカモを血眼で探しています。",
                en: "Driven by a desperate urge to be loved and secure, you pitch yourself with zero shame. You'll ruin your own character to catch eyes, yapping loudly while chasing anyone who gives you a scrap of attention.",
                ko: "사랑받고 보호받고 싶단 일념하에 물불 안 가리고 극성맞은 자기 광고를 지속합니다. 이목을 끌 수 있다면 망가지는 것도 불사하며, 컹컹 짖으며 간식 주는 집사를 졸졸 따라다니는 반려견 신세입니다.",
                zh: "腦子裡只有「好想被愛、好想安全」這檔子事，甚至連臉皮都不要地進行著極端招搖。為了博眼球不惜自毀人設，一邊神經質地嚎叫一邊緊追著任何願意理睬你的人不放。"
            }
        },
        asnr: {
            emoji: "🐖",
            name: { ja: "頑固なマイキャラ黒豚", en: "Stubborn Unique Boar", ko: "고집불통 마이캐릭터 흑돼지", zh: "頑固的人設小野豬" },
            description: {
                ja: "独自のキャラ（マイペースなゴーイングマイウェイ精神）を能動的に貫き、自己基準で安息（ビビリなあんしん安全第一派）を得る。他人のアドバイスは全てノイズとして弾き返す。",
                en: "Actively enforcing your brand (My-Way Independent Spirit) to acquire safety (Timid Safety-First Group) under self-satisfaction. Bouncing off others' feedback as noise.",
                ko: "독특한 내 이미지(마이웨이 마이페이스 정신)를 우격다짐으로 밀어붙여 자기 방어(소심한 안심안전 제일파)를 획득함. 타인의 훈수는 모조리 잡음으로 스킵함.",
                zh: "強硬地貫徹自己獨特的人設（我行我素我的路精神），在滿足自我感覺的基礎上獲取安全感（膽小安心安全第一派）。把別人提出的意見當成放屁。"
            },
            fallback: {
                ja: "自分勝手なルールと独自の主観（主観エモ至上主義）を周囲に能動的（能動的ゴリゴリ系）に押し付け、何が何でも自己防衛（ビビリなあんしん安全第一派）と自己正当化（マイペースなゴーイングマイウェイ精神）を貫く頑固な黒豚。他人の親切なアドバイスはすべて「私に対する攻撃（ノイズ）」としてシャットアウトし、聞く耳を持たずに暴走し続けます。",
                en: "Pushing your personal rule and views onto others, wrapping yourself in safety and absolute self-assessment. Bouncing all advice away as useless static, yapping your own theories forever.",
                ko: "나만의 질서와 감성을 남에게 억지로 주입하며 자가 보신과 절대적 자의식 과잉을 달성합니다. 충고는 단 한 귀로도 듣지 않고 오로지 자기 논설만 핏대 세워 떠들어 대는 쇠고집입니다.",
                zh: "將個人準則與主觀意志強行輸出給他人，借此來實現自我防衛與絕對的迷之自信。把所有的善意忠告當作雜音屏蔽，永遠在那裡唾沫橫飛地宣揚自己那一套神邏輯。"
            }
        }
    };

    const premiumReportJaByType = {
        pome: {
            advice: [
                "「いいね待ち」より自分から1リプ送ると世界が動く。",
                "投稿は反応数でなく「言いたかったか」で評価する。",
                "通知オフの時間を1日1回つくる。"
            ],
            truth: "“どうせ私なんて”の後ろに、ちゃんと見てほしいが隠れてるよね🐾"
        },
        pomr: {
            advice: [
                "積み上げを月1で可視化して自分を褒める。",
                "比較対象は過去の自分だけに固定する。",
                "たまに成果を1つ外に出すと仲間が見つかる。"
            ],
            truth: "“認められたくない”じゃなくて“安売りしたくない”だけでしょ🐾"
        },
        pone: {
            advice: [
                "「既読＝拒否」ではないと唱える。",
                "安心できる1〜2人とだけ深く繋がる。",
                "不安な時は投稿前に一晩寝かせる。"
            ],
            truth: "こわがりなだけで、本当はめちゃくちゃ優しい子だって知ってる🐾"
        },
        ponr: {
            advice: [
                "守りでOK、ただし年1で小さく挑戦枠を作る。",
                "情報の入れすぎ疲れに注意する。",
                "“静けさ”を意識的に確保する。"
            ],
            truth: "無関心なフリして、実は全部ちゃんと見てるよね🐾"
        },
        psme: {
            advice: [
                "完璧を待たず7割で出す。",
                "共感狙いより「自分が本当に好き」を1割混ぜる。",
                "数字は翌朝まで見ない。"
            ],
            truth: "通知が来た瞬間の顔、世界一かわいいやつだよ🐾"
        },
        psmr: {
            advice: [
                "孤高はそのままで良い。",
                "“分かる人”を数人だけ大事にする。",
                "作品は寝かせず出すと届く。"
            ],
            truth: "強がりの下の繊細さ、ちゃんとかわいいよ🐾"
        },
        psne: {
            advice: [
                "助けてほしい時は言葉にする。",
                "全部の空気を読まなくていい。",
                "安心できる場所を1つ決める。"
            ],
            truth: "寂しがりは罪じゃない、ただただ愛おしい🐾"
        },
        psnr: {
            advice: [
                "ROM（潜伏）でOK、罪悪感を持たない。",
                "好きを深掘りする趣味時間を確保する。",
                "出したい時だけ出す。"
            ],
            truth: "マイペースの裏の“分かってほしい”、見えてるからね🐾"
        },
        aome: {
            advice: [
                "承認は燃料、ただし他人の数字と比べない。",
                "“すごい”を自分で先に言う。",
                "発信は量より刺さりで設計する。"
            ],
            truth: "声デカいけど中身やわらかいの、バレてるよ🐾"
        },
        aomr: {
            advice: [
                "長文は冒頭3行に要点を置く。",
                "同好の士の場所に投下する。",
                "数字でなく濃さで満足する。"
            ],
            truth: "その孤高、私は嫌いじゃないよ🐾"
        },
        aone: {
            advice: [
                "盛らなくても価値はある。",
                "既読スルーを攻撃と捉えない。",
                "等身大の1投稿を週1混ぜる。"
            ],
            truth: "“すごい”が主食、既読スルーが一番こたえるよね🐾"
        },
        aonr: {
            advice: [
                "“論破”より“対話”で承認は増える。",
                "正しさの前に共感を1枚。",
                "戦う相手を選ぶ。"
            ],
            truth: "“正しい”より“好き”が本当はほしいでしょ🐾"
        },
        asme: {
            advice: [
                "自信はそのまま、押し付けは1割引く。",
                "共感されない日も3日で立ち直る。",
                "作品の数を出す。"
            ],
            truth: "スルーされると3日凹む繊細さ、可愛いとこだよ🐾"
        },
        asmr: {
            advice: [
                "トゲは武器、刺す相手を選ぶ。",
                "“分かってほしい”を素直に出す日を作る。",
                "創作は寝かせず出す。"
            ],
            truth: "“どうでもいい”が口癖の人ほど、本当は見てほしいんだよね🐾"
        },
        asne: {
            advice: [
                "自分を満たす“ひとり充電”を持つ。",
                "反応の増減に振り回されない。",
                "安心できる繋がりを優先する。"
            ],
            truth: "ちょっと重いとこも含めて、ほっとけないんだよね🐾"
        },
        asnr: {
            advice: [
                "ブレない強みは伸ばす。",
                "たまに流行を1つ試すと幅が出る。",
                "本音を1割だけ見せる。"
            ],
            truth: "マイペースの皮かぶって、実はちょっと寂しがりでしょ🐾"
        }
    };

    Object.entries(premiumReportJaByType).forEach(([typeCode, premium]) => {
        if (!typeDatabase[typeCode]) return;
        typeDatabase[typeCode].premiumAdvice = {
            ...(typeDatabase[typeCode].premiumAdvice || {}),
            ja: premium.advice
        };
        typeDatabase[typeCode].premiumTruth = {
            ...(typeDatabase[typeCode].premiumTruth || {}),
            ja: premium.truth
        };
    });

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
        renderScoreComparison();
        renderInviteTeaser();
        updateInviteCompatibilityCta();

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
        return getViralCopy(lang);
    }

    function getViralCopy(lang = state.lang) {
        const copies = {
          "ja": {
                    "score": {
                              "zero": "もう悟りの域、SNS菩薩。反応より静かな自分時間が勝ち。",
                              "low": "重すぎない承認欲求。たまに見る、でも沼には住まない。",
                              "mild": "気にしてない顔で少し見る。かわいい見栄、出てます。",
                              "medium": "ほどよく気にする民。「別に」の裏で通知は見る。",
                              "high": "重症だね（褒めてる）。いいねの増減で少し顔が変わる。",
                              "extreme": "承認欲求、かなり濃いめ。通知ひとつで天気が変わるタイプ。"
                    },
                    "aiScore": {
                              "zero": "SNS菩薩レベル。褒められ待ちより、自分の静けさを優先できる人。強い🐾",
                              "low": "反応は気になるけど飲まれない。ちゃんと距離を取れる、かなり健全な民🐾",
                              "mild": "平気な顔で少し期待するタイプ。ほどよい承認欲求、むしろ人間味🐾",
                              "medium": "「気にしてない」は半分本当、半分演出。通知の気配にはちゃんと敏感🐾",
                              "high": "重症だね（褒めてる）。反応ひとつで気分が上下する、SNS適性高めの魂🐾",
                              "extreme": "承認欲求が濃厚。通知の一音で世界が明るくなる、かなり正直なタイプ🐾"
                    },
                    "age": {
                              "teen": "教室の空気は今日も全集中。",
                              "twenties": "同世代の伸び、見ないふりして見えてる。",
                              "thirties": "ちゃんとしてる感まで承認に入ってくる。",
                              "forties": "大人の余裕…の裏でこっそりエゴサ。",
                              "unknown": "年齢非公開でもクセは隠れない。"
                    },
                    "aiAge": {
                              "teen": "10代らしく、周りの空気へのセンサーが鋭い。教室の温度まで読んでる🐾",
                              "twenties": "20代の比較疲れが少し出てる。同世代の伸び、見ないふりで見てるね🐾",
                              "thirties": "30代らしく、評価に「ちゃんとしてる感」も混ざる。大人の承認欲求です🐾",
                              "forties": "大人の余裕をまといつつ、内側では静かに反応を確認する職人芸🐾",
                              "unknown": "年齢を伏せても、回答のクセはなかなか正直。隠しきれてません🐾"
                    },
                    "pattern": "得意技は「{parts}」。",
                    "aiPattern": "クセは「{parts}」。隠したつもりで、かなり出てます🐾",
                    "patternUnknown": "まだ本性を隠し気味。",
                    "patternJoiner": "／",
                    "labels": {
                              "active": "自分から見せる",
                              "passive": "見つけてほしい",
                              "objective": "数字を信じる",
                              "subjective": "空気を読む",
                              "growth": "伸びしろで燃える",
                              "safety": "置いてかれ不安",
                              "external": "反応で安心",
                              "internal": "自分基準で納得"
                    }
          },
          "en": {
                    "score": {
                              "zero": "You have reached SNS monk mode. Quiet wins over reactions.",
                              "low": "Your approval craving is light. You peek, but you do not live in the swamp.",
                              "mild": "You pretend not to care, then check a little. Cute vanity detected.",
                              "medium": "You care just enough. Behind that “whatever,” you still check notifications.",
                              "high": "Severe, in a good way. A few likes can change your face.",
                              "extreme": "Your approval craving is extra rich. One notification can change the weather."
                    },
                    "aiScore": {
                              "zero": "SNS monk tier. You can choose your own calm over waiting to be praised. Powerful🐾",
                              "low": "Reactions matter, but they do not own you. That distance is honestly healthy🐾",
                              "mild": "You look calm while hoping a little. A small approval craving makes you human🐾",
                              "medium": "“I do not care” is half true, half performance. You still sense every ping🐾",
                              "high": "Severe, in a flattering way. Your mood follows reactions, which makes you very SNS-ready🐾",
                              "extreme": "A dense approval craving. One ping brightens the whole room. Painfully honest🐾"
                    },
                    "age": {
                              "teen": "The classroom mood has your full attention today too.",
                              "twenties": "You pretend not to see your peers growing, but you see it.",
                              "thirties": "Now “looking put together” is part of the approval game.",
                              "forties": "Adult composure outside, quiet ego-searching inside.",
                              "unknown": "Even with age hidden, your habits are showing."
                    },
                    "aiAge": {
                              "teen": "That teen radar is sharp. You read the room temperature like a weather app🐾",
                              "twenties": "A bit of twenties comparison fatigue is showing. You see the peer growth you pretend to ignore🐾",
                              "thirties": "Very thirties: approval now includes being seen as competent and composed🐾",
                              "forties": "You wear adult calm well, while quietly checking reactions with professional skill🐾",
                              "unknown": "Age hidden, habits visible. Your answers were more honest than planned🐾"
                    },
                    "pattern": "Your signature move is “{parts}.”",
                    "aiPattern": "Your habit says “{parts}.” You tried to hide it, but it leaked🐾",
                    "patternUnknown": "You are still hiding your true form.",
                    "patternJoiner": ", ",
                    "labels": {
                              "active": "showing yourself",
                              "passive": "waiting to be found",
                              "objective": "trusting numbers",
                              "subjective": "reading the room",
                              "growth": "burning on growth",
                              "safety": "fearing being left behind",
                              "external": "needing reactions",
                              "internal": "self-standard first"
                    }
          },
          "ko": {
                    "score": {
                              "zero": "이미 SNS 보살 경지예요. 반응보다 조용한 자기 시간이 이겨요.",
                              "low": "승인욕구가 가벼운 편. 가끔 보지만 늪에 살지는 않아요.",
                              "mild": "신경 안 쓰는 척하면서 살짝 봐요. 귀여운 허세, 보입니다.",
                              "medium": "적당히 신경 쓰는 타입. “별로” 뒤에서 알림은 확인해요.",
                              "high": "중증이네요, 칭찬입니다. 좋아요 수에 표정이 조금 바뀌어요.",
                              "extreme": "승인욕구가 꽤 진해요. 알림 하나로 하루 날씨가 바뀌는 타입."
                    },
                    "aiScore": {
                              "zero": "SNS 보살 레벨. 칭찬을 기다리기보다 자기 평온을 고를 수 있는 사람, 강해요🐾",
                              "low": "반응은 신경 쓰지만 휘둘리지는 않아요. 거리 조절이 꽤 건강합니다🐾",
                              "mild": "괜찮은 척하면서 조금 기대하는 타입. 적당한 승인욕구라 오히려 인간적이에요🐾",
                              "medium": "“신경 안 써”는 반은 진심, 반은 연출. 알림 기척에는 꽤 민감해요🐾",
                              "high": "중증이네요, 칭찬입니다. 반응 하나에 기분이 오르내리는 SNS 적성형🐾",
                              "extreme": "승인욕구 농도가 진합니다. 알림 한 번에 세상이 밝아지는 솔직한 타입🐾"
                    },
                    "age": {
                              "teen": "교실 분위기에 오늘도 온 신경 집중.",
                              "twenties": "또래가 커지는 모습, 안 보는 척 다 보고 있어요.",
                              "thirties": "이제 “제대로 사는 느낌”까지 인정욕구에 들어와요.",
                              "forties": "어른의 여유 뒤에서 조용히 에고서치.",
                              "unknown": "나이를 숨겨도 습관은 숨지 않아요."
                    },
                    "aiAge": {
                              "teen": "10대다운 공기 감지 센서가 날카로워요. 교실 온도까지 읽고 있네요🐾",
                              "twenties": "20대식 비교 피로가 살짝 보여요. 또래의 성장을 모른 척 보죠🐾",
                              "thirties": "30대답게 평가에 “제대로 하고 있다”는 느낌도 섞여 있어요🐾",
                              "forties": "어른의 여유를 두르면서도 안쪽에서는 조용히 반응을 확인하는 장인🐾",
                              "unknown": "나이를 숨겨도 답변의 버릇은 정직해요. 다 보입니다🐾"
                    },
                    "pattern": "주특기는 “{parts}”.",
                    "aiPattern": "버릇은 “{parts}”. 숨긴 줄 알았겠지만 꽤 드러났어요🐾",
                    "patternUnknown": "아직 본모습을 살짝 숨기고 있어요.",
                    "patternJoiner": "／",
                    "labels": {
                              "active": "직접 보여줌",
                              "passive": "발견되길 기다림",
                              "objective": "숫자를 믿음",
                              "subjective": "분위기를 읽음",
                              "growth": "성장에 불탐",
                              "safety": "뒤처짐 불안",
                              "external": "반응으로 안심",
                              "internal": "자기 기준으로 납득"
                    }
          },
          "zh": {
                    "score": {
                              "zero": "已經是SNS菩薩境界。比起反應，你更贏在安靜的自我時間。",
                              "low": "認可欲不重。會偶爾看看，但不住在那片沼澤裡。",
                              "mild": "裝作不在意，其實會偷偷看一眼。可愛的逞強出現了。",
                              "medium": "適度在意型。嘴上說“無所謂”，手上還是會看通知。",
                              "high": "有點重症呢，這是誇你。按讚漲跌會悄悄改變你的表情。",
                              "extreme": "認可欲濃度很高。一個通知就能改變你今天的天氣。"
                    },
                    "aiScore": {
                              "zero": "SNS菩薩級。比起等人誇，你更能選擇自己的安靜，很強🐾",
                              "low": "會在意反應，但不會被它牽著走。這個距離感相當健康🐾",
                              "mild": "表面淡定，心裡小小期待。適量的認可欲，反而很有人味🐾",
                              "medium": "“我不在意”一半是真，一半是演。通知一響你還是很敏感🐾",
                              "high": "有點重症呢，這是誇你。反應一來一去，心情也會跟著走🐾",
                              "extreme": "認可欲很濃。一個提示音就能讓世界變亮，誠實得可愛🐾"
                    },
                    "age": {
                              "teen": "教室裡的空氣，今天也被你全神貫注讀取。",
                              "twenties": "同齡人的成長，你假裝沒看見，其實看得很清楚。",
                              "thirties": "“看起來很可靠”也開始進入認可游戲。",
                              "forties": "外表是成年人的從容，背後偷偷搜自己。",
                              "unknown": "年齡不公開，習慣還是藏不住。"
                    },
                    "aiAge": {
                              "teen": "十幾歲的空氣雷達很敏銳。連教室溫度都讀得出來🐾",
                              "twenties": "二十多歲的比較疲憊有點露出來了。同齡人的進展你其實看見了🐾",
                              "thirties": "很三十代：認可裡也混進了“看起來很穩”的需求🐾",
                              "forties": "披著成年人的余裕，內心安靜地確認反應，很熟練🐾",
                              "unknown": "年齡藏住了，回答習慣沒藏住。比你想的更誠實🐾"
                    },
                    "pattern": "你的拿手戲是“{parts}”。",
                    "aiPattern": "習慣寫著“{parts}”。你以為藏住了，其實露出來了🐾",
                    "patternUnknown": "你還在稍微隱藏本性。",
                    "patternJoiner": "／",
                    "labels": {
                              "active": "主動展示自己",
                              "passive": "等待被發現",
                              "objective": "相信數字",
                              "subjective": "讀取空氣",
                              "growth": "為成長燃燒",
                              "safety": "害怕被落下",
                              "external": "靠反應安心",
                              "internal": "以自我標準認可"
                    }
          }
};
        return copies[normalizeLang(lang)] || copies.ja;
    }

    function getTypeTone(typeCode, lang = state.lang) {
        const tones = {
          "ja": {
                    "aome": [
                              "見て見て！の権化、突撃ライオン。実績は盛って当然、いいねは燃料。伸びてる時は無敵、伸びないと急に「…別に」。通知が3秒来ないだけで世界が終わる。",
                              "「私がやりました」の圧、強め。誰かの「すごい」が来るまで充電できない充電式。今日も自分のポストを3分おきに見に行ってるでしょ、図星🐾"
                    ],
                    "aomr": [
                              "語りたいオオカミ。好きなことは聞かれてなくても全力プレゼン。数字は気にするけど、評価より「極めたい」が勝つ。気づけば長文、気づけば一人語り。",
                              "布教の熱量、業界トップ。バズるかより「分かるやつにだけ刺されば良し」。フォロワーよりニッチな同志を探してる、その孤高、嫌いじゃない🐾"
                    ],
                    "aone": [
                              "盛り担当、アピールオウム。ちっちゃい実績を100倍デコって発信。根は怖がりで、叩かれない範囲で目立ちたい。みんなの「いいね」がないと不安で眠れない。",
                              "声はデカいが中身はふわふわ。「すごいね」が主食で、既読スルーはどんな攻撃より効く。今日も“安全に目立てる投稿”を計算中、バレてるよ🐾"
                    ],
                    "aonr": [
                              "正論担当、ルールポリス柴犬。リプ欄の「それ違くない？」はだいたい君。目立ちたいけど叩かれたくないから理論武装は完璧。安全圏から正しさで殴る派。",
                              "マナー違反を見つける嗅覚、警察犬級。「論破」が承認の代わり。本当は「正しいね」より「あなたが好き」が欲しいの、知ってる🐾"
                    ],
                    "asme": [
                              "世界観で殴る、クリエイティブ孔雀。センスとエモさ全開で披露、バズれば世界一の気分。空気は読むけど、最後は「どう、エモいでしょ？」。",
                              "「分かる人にだけ分かればいい」と言いつつ保存数は秒で確認。共感されると無敵、スルーされると三日へこむ。その繊細な自信、かわいい🐾"
                    ],
                    "asmr": [
                              "我が道トゲトゲ、ハリネズミ。「お前らの理解とかいらん」と言いつつ、発信はやめない。刺さる人にだけ刺さればいいで突っ走る孤高の作家肌。",
                              "「どう思われてもいい」が口癖、なのにアンチには秒で噛みつく。本当は分かってほしい量、人一倍。トゲの下、めっちゃ甘えん坊でしょ🐾"
                    ],
                    "asne": [
                              "かまって全開、バズりチワワ。寂しいと即ポスト、反応が来ると即復活。みんなの「大丈夫？」で生きてる愛されたがり。空気を読みすぎて自爆もする。",
                              "「誰か構って」の電波、24時間発信中。いいねが減ると「嫌われた？」で情緒ジェットコースター。重いけど、それ含めて愛おしいやつ🐾"
                    ],
                    "asnr": [
                              "キャラ貫き勢、マイキャラ黒豚。「これが私だから」で押し通す。発信はするけど流行には乗らない。自分の世界が一番落ち着く頑固な安定派。",
                              "ブレない、というか曲げない。共感より「分かる人だけでいい」。でも実はリプ全部読んでる。マイペースの皮をかぶった、ちゃっかり寂しがり🐾"
                    ],
                    "pome": [
                              "察してほしいポメ。自分からは行けないけど、見てほしい気持ちは満タン。数字は気になるしフォロワーも伸ばしたい、でも「自分からアピール」は無理。",
                              "いいね、こっそり全部数えてる。「なんで反応くれないの」と思いつつ自分からは絶対動かない。待ちの達人、そろそろ自分から行こ？🐾"
                    ],
                    "pomr": [
                              "マイペース職人、自律カタツムリ。アピールはしないけど、こっそり実績は積む。誰かのためじゃなく自分の成長のために黙々。バズより自己ベスト更新。",
                              "静かなのに負けず嫌い。人の数字は見ないフリして自分の伸びだけはチェック。承認いらないと言いつつ、たまに「誰か気づいて」が漏れてる🐾"
                    ],
                    "pone": [
                              "びくびく甘えん坊、トイプー。嫌われるのが何より怖くて、安全な人にだけ甘える。自分から動けないけど、反応がないと不安で死にそう。",
                              "「これ送って大丈夫かな」を100回考えて結局送らない。既読つくまでスマホ握りしめ。怖がりだけど、懐いた相手にはとことん尽くす良い子🐾"
                    ],
                    "ponr": [
                              "省エネ保身、コアラ。目立たず、叩かれず、評価だけは守る。無理はしないし流行も追わない。安全地帯でまったり生きるのが正義。",
                              "炎上は対岸の火事、リスクは全回避。「どう見られるか」より「平穏」。承認欲求ある？と聞くと「別に」、でもプロフはちゃんと整えてる、ね？🐾"
                    ],
                    "psme": [
                              "エモ売り志望、インフルエンサー予備軍。共感とエモさで心を満たしたい。空気を読んで刺さる言葉を狙うけど、自分から大きくは出られない伸びしろ型。",
                              "「これ共感されるかな」で投稿前に5回推敲。バズりたい気持ちと怖さが同居。いいね通知が来た瞬間の顔、たぶん世界一かわいい🐾"
                    ],
                    "psmr": [
                              "孤高の世界観、パステル黒猫。自分の感性が全て。群れず、媚びず、静かに自分を磨く。バズらなくていい、分かる人がいればそれでいい。",
                              "「他人の評価？知らんな」の顔して、たまにエゴサして秒で閉じる。媚びないのは本物、でもふと寂しくなる夜もある。…猫だもんね🐾"
                    ],
                    "psne": [
                              "かまってほしいピヨちゃん。自分から動くより「大丈夫？」のひと言で充電完了。空気を読みすぎて疲れるし、置いてかれるのが怖い甘えん坊。",
                              "察してちゃんの中心地で、ぬくぬく温められ待ち。既読ついて返信ないと脳内で小さな裁判が開廷。さみしがりは罪じゃない、かわいいだけ🐾"
                    ],
                    "psnr": [
                              "省エネ見る専、パンダ。自分の感性だけ信じて、群れない・焦らない・無理しない。通知より自分の世界、SNSはROM専でも全然OK。",
                              "「どう思われるか」はミュート済み。バズより、わかってる数人がいれば充分。…と言いつつ、たまにエゴサして秒で閉じるの、知ってる🐾"
                    ]
          },
          "en": {
                    "aome": [
                              "The pure embodiment of “look at me,” the Charging Lion. Achievements are meant to be polished, and likes are fuel. When the post grows, you feel invincible. When it stalls, suddenly it is “whatever.” Three silent seconds and the world ends.",
                              "That “I did this” pressure is loud. You are rechargeable, but only after someone says “amazing.” You checked your own post every three minutes today, didn’t you? Got you🐾"
                    ],
                    "aomr": [
                              "The Wolf Who Must Explain. Even if nobody asked, your favorite thing becomes a full presentation. Numbers matter, but “mastering it” matters more. Before you notice, it is a long post and a solo lecture.",
                              "Your evangelist energy is top tier. You care less about going viral than hitting the few people who get it. You are hunting niche comrades over followers. That lone-wolf thing is not bad🐾"
                    ],
                    "aone": [
                              "The Hype Parrot in charge of embellishment. Tiny wins become sparkling headlines. Deep down you are cautious, so you want to stand out only where it is safe. Without everyone’s likes, sleep gets difficult.",
                              "Your voice is big, but the inside is soft. “Amazing” is your staple food, and being left on read hurts more than any attack. You are calculating a safe way to stand out again today. We see you🐾"
                    ],
                    "aonr": [
                              "The Rule-Police Shiba with the correct take. The “isn’t that wrong?” in the replies is probably you. You want attention, but not backlash, so the logic armor is perfect. You strike from the safe zone with correctness.",
                              "Your nose for bad manners is police-dog level. “Winning the argument” replaces approval. But honestly, you want “I like you” more than “you are right.” We know🐾"
                    ],
                    "asme": [
                              "The Creative Peacock who attacks with a whole world. Sense and emotion turned all the way up. If it goes viral, you feel like the center of the universe. You read the room, then still ask, “So, it is emotional, right?”",
                              "You say “only the right people need to get it,” then check saves in seconds. When people relate, you are unstoppable. When they ignore it, you sink for three days. That delicate confidence is cute🐾"
                    ],
                    "asmr": [
                              "The Spiky Hedgehog on your own road. You say you do not need anyone’s understanding, yet you never stop posting. If it pierces the right few people, that is enough. A solitary creator with sharp little spines.",
                              "“I do not care what people think” is your catchphrase, yet you bite back at haters instantly. You want to be understood more than most. Under those spikes, you are extremely needy🐾"
                    ],
                    "asne": [
                              "The fully needy Viral Chihuahua. Lonely means instant post, one reaction means instant revival. You live on everyone’s “are you okay?” You read the room so hard you sometimes crash into it.",
                              "Your “someone please notice me” signal broadcasts 24/7. Fewer likes and your brain asks “am I hated?” Emotional roller coaster included. Heavy, yes, but lovable with it🐾"
                    ],
                    "asnr": [
                              "The My-Character Boar who never breaks character. “This is who I am” is your shield. You post, but you do not chase trends. Your own world feels safest, and your stubborn stability is the point.",
                              "You do not bend, or maybe you simply cannot. You say “only the right people need to get it,” yet you read every reply. Under that laid-back skin, you are quietly lonely🐾"
                    ],
                    "pome": [
                              "The Pomeranian who wants people to notice without asking. You cannot go first, but the desire to be seen is full. Numbers matter and follower growth sounds nice, yet “self-promotion” feels impossible.",
                              "You quietly count every like. You wonder why nobody reacts, while refusing to move first. Master of waiting, maybe it is time to take one step yourself?🐾"
                    ],
                    "pomr": [
                              "The Self-Driven Snail, a craftsperson at your own pace. You do not show off, but you quietly stack real progress. Not for anyone else, just for your own growth. Personal best beats buzz.",
                              "Quiet, but secretly competitive. You pretend not to watch other people’s numbers, then check only your own growth. You say you do not need approval, but sometimes “please notice” leaks out🐾"
                    ],
                    "pone": [
                              "The timid Toy Poodle who loves safe people. Being disliked scares you most, so you only soften around trusted people. You cannot move first, but no reaction makes you feel like you might collapse.",
                              "You think “is this okay to send?” a hundred times and send nothing. You hold your phone until it is read. Scared, yes, but once attached, you are deeply loyal🐾"
                    ],
                    "ponr": [
                              "The Energy-Saving Koala of self-protection. Do not stand out, do not get attacked, keep your evaluation intact. No forcing it, no trend chasing. Living slowly in the safe zone is justice.",
                              "Drama is a fire across the river, and you avoid every risk. Peace matters more than how you look. Ask if you crave approval and you say “not really,” but your profile is neatly polished, right?🐾"
                    ],
                    "psme": [
                              "The Influencer-in-Training who sells emotion. You want to fill hearts with empathy and aesthetic feeling. You read the room and aim for words that land, but stepping forward too loudly still scares you. Huge potential.",
                              "Before posting, you revise five times asking, “will people relate?” The wish to go viral and the fear of it live together. Your face when a like arrives is probably the cutest in the world🐾"
                    ],
                    "psmr": [
                              "The Aloof Pastel Black Cat with a private worldview. Your own sensitivity is everything. No crowds, no begging, just quietly refining yourself. You do not need to go viral. One person who gets it is enough.",
                              "You wear the face of “other people’s opinions? irrelevant,” then sometimes ego-search and close it instantly. The non-neediness is real, but some nights still get lonely. You are a cat, after all🐾"
                    ],
                    "psne": [
                              "The Baby Chick who wants to be checked on. One “are you okay?” charges you more than moving first ever could. You read the room until you are tired, and being left behind scares you.",
                              "You are the capital of “please understand without me saying it,” waiting to be gently warmed. Read with no reply and a tiny courtroom opens in your head. Loneliness is not a crime, just cute🐾"
                    ],
                    "psnr": [
                              "The Low-Energy Panda who mostly watches. You trust your own taste, do not herd, do not rush, do not force it. Your world matters more than notifications, and lurking on SNS is completely valid.",
                              "“What people think” is muted. A few who truly get it are enough, not a viral hit. And yet, sometimes you ego-search and close it instantly. We know🐾"
                    ]
          },
          "ko": {
                    "aome": [
                              "“나 좀 봐!”의 화신, 돌격 사자. 실적은 당연히 반짝이게 포장하고, 좋아요는 연료예요. 잘 나갈 땐 무적, 안 오르면 갑자기 “뭐, 별로.” 알림이 3초 조용하면 세상이 끝납니다.",
                              "“제가 했습니다” 압이 꽤 세요. 누군가 “대단해”라고 해줘야 충전되는 충전식 인간. 오늘도 자기 게시물 3분마다 보러 갔죠? 정답🐾"
                    ],
                    "aomr": [
                              "말하고 싶은 늑대. 좋아하는 건 누가 묻지 않아도 전력 프레젠테이션. 숫자는 신경 쓰지만 평가보다 “더 파고들고 싶다”가 이겨요. 정신 차리면 장문, 정신 차리면 혼자 강연.",
                              "전도 열정은 업계 최고. 바이럴보다 “아는 사람한테만 꽂히면 됨”이 중요해요. 팔로워보다 니치한 동지를 찾는 그 고독함, 나쁘지 않아요🐾"
                    ],
                    "aone": [
                              "부풀리기 담당 어필 앵무새. 작은 성과도 100배 데코해서 발신해요. 속은 겁이 많아서 맞지 않을 만큼만 눈에 띄고 싶죠. 모두의 좋아요가 없으면 불안해서 잠이 안 와요.",
                              "목소리는 큰데 속은 말랑말랑. “대단하다”가 주식이고, 읽씹은 어떤 공격보다 아파요. 오늘도 안전하게 눈에 띄는 게시물을 계산 중, 다 보여요🐾"
                    ],
                    "aonr": [
                              "정론 담당 룰 폴리스 시바견. 답글창의 “그건 좀 아니지 않나?”는 대체로 당신. 눈에 띄고 싶지만 맞기는 싫어서 논리 무장은 완벽해요. 안전지대에서 올바름으로 찌르는 타입.",
                              "매너 위반을 찾아내는 후각은 경찰견급. “논파”가 인정의 대체품이에요. 사실은 “네가 맞아”보다 “네가 좋아”를 듣고 싶은 거, 알고 있어요🐾"
                    ],
                    "asme": [
                              "세계관으로 치는 크리에이티브 공작. 센스와 감성을 풀파워로 펼쳐요. 터지면 세상에서 제일 잘난 기분. 분위기는 읽지만 마지막엔 “어때, 감성 있지?”가 나와요.",
                              "“알 사람만 알면 돼”라고 하면서 저장 수는 바로 확인하죠. 공감받으면 무적, 스루당하면 사흘은 꺼져요. 그 섬세한 자신감, 귀여워요🐾"
                    ],
                    "asmr": [
                              "내 길을 가는 뾰족한 고슴도치. “너희 이해 필요 없음”이라면서 발신은 멈추지 않아요. 꽂힐 사람에게만 꽂히면 된다는 고독한 작가 기질.",
                              "“남들이 뭐라 생각하든 상관없어”가 말버릇인데, 안티에게는 즉시 물어요. 사실 이해받고 싶은 양은 남들보다 많죠. 가시 아래, 엄청 응석쟁이죠?🐾"
                    ],
                    "asne": [
                              "관심 풀가동 버즈 치와와. 외로우면 바로 포스트, 반응이 오면 바로 부활. 모두의 “괜찮아?”로 살아가는 사랑받고 싶은 타입. 분위기를 너무 읽다가 자폭도 해요.",
                              "“누가 나 좀 봐줘” 전파를 24시간 송신 중. 좋아요가 줄면 “나 미움받나?”로 감정 롤러코스터. 무겁지만, 그걸 포함해서 사랑스러운 쪽🐾"
                    ],
                    "asnr": [
                              "캐릭터 고수 마이캐릭터 흑돼지. “이게 나니까”로 밀고 나가요. 발신은 하지만 유행에는 타지 않아요. 자기 세계가 제일 편한 고집 있는 안정파.",
                              "흔들리지 않는다기보다 안 굽혀요. 공감보다 “알 사람만 알면 돼.” 그래도 사실 답글은 전부 읽죠. 마이페이스의 껍질을 쓴 은근한 외로움쟁이🐾"
                    ],
                    "pome": [
                              "눈치채 줬으면 하는 포메. 먼저 다가가진 못하지만 봐줬으면 하는 마음은 가득해요. 숫자도 신경 쓰이고 팔로워도 늘고 싶지만, “내가 나를 홍보”는 무리.",
                              "좋아요, 몰래 전부 세고 있어요. “왜 반응 안 해주지”라고 생각하면서 먼저 움직이진 않죠. 기다림의 달인, 이제 슬슬 한 발 가볼래요?🐾"
                    ],
                    "pomr": [
                              "마이페이스 장인, 자율 달팽이. 어필은 안 하지만 조용히 실적은 쌓아요. 누군가를 위해서가 아니라 자기 성장을 위해 묵묵히. 버즈보다 개인 기록 갱신.",
                              "조용한데 은근히 지기 싫어해요. 남의 숫자는 안 보는 척하고 자기 성장만 확인. 인정 필요 없다면서 가끔 “누가 좀 알아줘”가 새어 나와요🐾"
                    ],
                    "pone": [
                              "덜덜 떠는 응석쟁이 토이푸들. 미움받는 게 제일 무서워서 안전한 사람에게만 기대요. 먼저 움직이진 못하지만 반응이 없으면 불안해서 죽을 것 같죠.",
                              "“이거 보내도 괜찮을까”를 100번 생각하고 결국 안 보내요. 읽힐 때까지 폰을 꼭 쥐고 있죠. 겁은 많지만, 마음 연 사람에게는 끝까지 다정한 아이🐾"
                    ],
                    "ponr": [
                              "에너지 절약형 보신 코알라. 눈에 띄지 않고, 맞지 않고, 평판만 지켜요. 무리는 안 하고 유행도 쫓지 않아요. 안전지대에서 느긋하게 사는 게 정의.",
                              "불길은 강 건너 이야기, 리스크는 전부 회피. “어떻게 보일까”보다 “평온”이 먼저. 승인욕구 있냐고 물으면 “별로”라지만 프로필은 깔끔하게 다듬었죠?🐾"
                    ],
                    "psme": [
                              "감성 판매 지망 인플루언서 예비군. 공감과 감성으로 마음을 채우고 싶어요. 분위기를 읽고 꽂히는 말을 노리지만, 크게 나서는 건 아직 무서운 성장형.",
                              "“이거 공감받을까”로 올리기 전 다섯 번 고쳐요. 뜨고 싶은 마음과 무서움이 같이 살아요. 좋아요 알림이 온 순간의 얼굴, 아마 세상에서 제일 귀여워요🐾"
                    ],
                    "psmr": [
                              "고고한 세계관, 파스텔 검은 고양이. 자기 감성이 전부예요. 무리 짓지 않고, 아부하지 않고, 조용히 자신을 갈고닦아요. 안 떠도 돼요. 알아주는 사람이 있으면 충분.",
                              "“남의 평가? 모르겠는데”라는 얼굴로 가끔 에고서치하고 바로 닫죠. 아부하지 않는 건 진짜지만, 문득 외로운 밤도 있어요. 고양이니까요🐾"
                    ],
                    "psne": [
                              "관심받고 싶은 삐약이. 먼저 움직이는 것보다 “괜찮아?” 한마디로 충전 완료. 분위기를 너무 읽어 지치고, 뒤처지는 게 무서운 응석쟁이.",
                              "눈치채 주길 기다리는 중심지에서 따뜻하게 품어지길 기다리는 중. 읽었는데 답이 없으면 머릿속 작은 재판이 열려요. 외로움은 죄가 아니고, 그냥 귀여움🐾"
                    ],
                    "psnr": [
                              "에너지 절약 관전 판다. 자기 감성만 믿고, 무리하지 않고, 조급해하지 않고, 억지로 하지 않아요. 알림보다 자기 세계, SNS는 눈팅이어도 충분히 OK.",
                              "“남들이 어떻게 보든”은 음소거 완료. 버즈보다 알아주는 몇 명이면 충분. …라면서 가끔 에고서치하고 바로 닫는 거, 알고 있어요🐾"
                    ]
          },
          "zh": {
                    "aome": [
                              "看我看我！的化身，突擊獅子🦁 成績一定要灌水，按讚就是燃料。漲粉時無敵，沒人理就突然『…沒差啦』。通知三秒沒響就覺得世界要塌了。",
                              "『這是我做的喔』的氣場超強。要等到有人說『好厲害』才能充電的充電式。今天也每三分鐘回去看自己的貼文吧，被說中了🐾"
                    ],
                    "aomr": [
                              "超想分享的狼🐺 喜歡的東西沒人問也全力簡報。在意數字，但比起評價更想『鑽到底』。回神已是長文，回神已在自言自語。",
                              "傳教的熱情，業界第一。比起爆紅更信『懂的人懂就好』。比起追蹤數更想找同溫層戰友，這份孤高我不討厭🐾"
                    ],
                    "aone": [
                              "灌水擔當，表現鸚鵡🦜 小成績也裝飾成一百倍發出去。骨子裡膽小，只想在不會被罵的範圍裡顯眼。沒有大家的讚就焦慮到睡不著。",
                              "嗓門很大，裡面很軟。『好棒』是主食，已讀不回比任何攻擊都痛。今天也在算怎麼安全地刷存在感，被看穿囉🐾"
                    ],
                    "aonr": [
                              "正論擔當，規則柴犬🐕 留言區那句『這樣不對吧？』大概就是你。想紅又怕被罵，所以理論武裝超完備。從安全區用『正確』打人。",
                              "找碴的嗅覺，警犬等級。把『辯贏』當成讚的替代品。其實比起『你說得對』更想要『我喜歡你』，我知道🐾"
                    ],
                    "asme": [
                              "用世界觀電人，創意孔雀🦚 品味跟氛圍全開展示，爆紅就覺得自己是世界第一。會看氣氛，但最後一定是『怎樣，很有fu吧？』",
                              "嘴上說『懂的人懂就好』，收藏數卻秒看。被共鳴就無敵，被略過就消沉三天。那份纖細的自信，可愛🐾"
                    ],
                    "asmr": [
                              "走自己路的刺蝟🦔『你們懂不懂我都無所謂』嘴上這樣說，發文卻沒停過。抱著『戳到的人戳到就好』一路衝的孤高作家魂。",
                              "『怎麼想都隨便』是口頭禪，對黑粉卻秒回嗆。其實超想被懂，份量比誰都多。刺的底下根本超會撒嬌吧🐾"
                    ],
                    "asne": [
                              "討拍全開，爆紅吉娃娃🐶 一寂寞就馬上PO，有反應就馬上復活。靠大家一句『還好嗎？』活著的討愛型。太會看氣氛，偶爾也自爆。",
                              "『誰來理我一下』的電波24小時放送中。讚一變少就『是不是被討厭了？』情緒雲霄飛車。是有點重，但連這點都讓人疼🐾"
                    ],
                    "asnr": [
                              "貫徹人設派，我風黑豬🐗『因為這就是我』直接硬幹。會發文但不跟流行。自己的世界最自在的固執安定派。",
                              "不動搖，應該說不肯彎。比起共鳴更要『懂的人就好』。但其實留言全都看完了。披著我行我素的皮、其實偷偷怕寂寞🐾"
                    ],
                    "pome": [
                              "想被察覺的博美🐩 自己不敢主動，但超想被看見。在意數字也想漲粉，可是『自己宣傳』辦不到。",
                              "讚，偷偷全都數過。一邊想『怎麼都不理我』，一邊死都不主動。等待的高手，差不多該自己出手了吧？🐾"
                    ],
                    "pomr": [
                              "自己步調的職人，自律蝸牛🐌 不宣傳，但默默累積成績。不是為了誰，是為自己的成長埋頭。比起爆紅更愛刷新自己的最佳紀錄。",
                              "安靜卻不服輸。裝作不看別人的數字，自己的成長倒是緊盯。嘴說不要認同，偶爾還是漏出『誰來發現一下』🐾"
                    ],
                    "pone": [
                              "怕怕的撒嬌貴賓🐩 最怕被討厭，只對安全的人撒嬌。自己不敢動，但沒反應就焦慮到不行。",
                              "『這樣傳出去OK嗎』想一百次最後沒傳。已讀前一直握著手機。膽小，但對熟的人會掏心掏肺的好孩子🐾"
                    ],
                    "ponr": [
                              "省力自保，無尾熊🐨 不顯眼、不被罵、評價只守不攻。不勉強也不追流行。在安全區慢慢過才是正義。",
                              "炎上是隔岸觀火，風險全閃。比起『被怎麼看』更要『平靜』。問你有沒有認同欲？回『還好』，但個人檔案明明整理得很整齊吧？🐾"
                    ],
                    "psme": [
                              "想賣fu的網紅預備軍✨ 想用共鳴跟氛圍填滿內心。會看氣氛抓會戳的字，但自己沒辦法衝太大的成長型。",
                              "『這個會被共鳴嗎』發文前改五次。想紅跟害怕同時存在。讚的通知跳出來那一瞬間的表情，大概世界第一可愛🐾"
                    ],
                    "psmr": [
                              "孤高世界觀，粉彩黑貓🐈‍⬛ 自己的感性就是全部。不結群、不討好，安靜地打磨自己。不爆紅也沒差，有懂的人就夠了。",
                              "擺著『別人的評價？不關我事』的臉，偶爾搜自己又秒關。不討好是真的，但有些夜晚還是會寂寞。畢竟是貓嘛🐾"
                    ],
                    "psne": [
                              "想被疼的小雞🐤 比起自己動，一句『還好嗎？』就充飽電。太會看氣氛而累，也很怕被丟下的撒嬌鬼。",
                              "在『你不說我也要懂』文化的正中央，等著被暖暖呵護。已讀沒回，腦內就開起小型法庭。怕寂寞不是罪，只是可愛🐾"
                    ],
                    "psnr": [
                              "省力潛水，貓熊🐼 只信自己的感性，不結群、不焦慮、不勉強。比起通知更愛自己的世界，當潛水仔也完全OK。",
                              "『被怎麼看』早就靜音了。比起爆紅，有懂的幾個人就夠。…嘴上這樣說，偶爾還是搜自己又秒關，我知道🐾"
                    ]
          }
};
        const langTone = tones[normalizeLang(lang)] || tones.ja;
        return langTone[typeCode] || langTone.psmr;
    }

    function getAnswerPatternParts(lang = state.lang) {
        const answers = normalizeAnswerCounts(state.answers);
        const total = ANSWER_KEYS.reduce((sum, key) => sum + (answers[key] || 0), 0);
        const copy = getViralCopy(lang);
        const labels = copy.labels || {};
        const fallbackLabels = (getViralCopy('ja').labels || {});
        const label = (key) => labels[key] || fallbackLabels[key] || "";
        if (!total) return [];

        return [
            answers.a >= answers.p ? label('active') : label('passive'),
            answers.s >= answers.o ? label('subjective') : label('objective'),
            answers.m >= answers.n ? label('growth') : label('safety'),
            answers.r >= answers.e ? label('internal') : label('external')
        ].filter(Boolean);
    }

    function getAnswerPatternSummary(lang = state.lang) {
        const copy = getViralCopy(lang);
        const parts = getAnswerPatternParts(lang);
        if (!parts.length) return copy.patternUnknown;
        const joiner = typeof copy.patternJoiner === 'string' ? copy.patternJoiner : "／";
        return copy.pattern.replace("{parts}", parts.join(joiner));
    }

    function getBaseResultDescription(info, lang = state.lang) {
        if (!info || !info.description) return "";
        return info.description[lang] || info.description.ja || "";
    }

    function getBaseAiFallback(info, lang = state.lang) {
        if (!info || !info.fallback) return "";
        return info.fallback[lang] || info.fallback.ja || "";
    }

    function getPersonalizedResultDescription(info, lang = state.lang) {
        if (!info) return "";
        const copy = getViralCopy(lang);
        const typeLine = getTypeTone(state.typeCode, lang)[0] || "";
        const scoreLine = copy.score[getScoreBand()] || "";
        const ageLine = copy.age[getAgeVariantKey()] || "";
        const patternLine = getAnswerPatternSummary(lang);

        return [typeLine, scoreLine, ageLine, patternLine].filter(Boolean).join(" ");
    }

    function getPersonalizedAiFallback(typeCode, lang = state.lang) {
        const info = typeDatabase[typeCode];
        if (!info) return "";
        const copy = getViralCopy(lang);
        const base = getTypeTone(typeCode, lang)[1] || "";
        const scoreLine = copy.aiScore[getScoreBand()] || "";
        const ageLine = copy.aiAge[getAgeVariantKey()] || "";
        const parts = getAnswerPatternParts(lang);
        const joiner = typeof copy.patternJoiner === 'string' ? copy.patternJoiner : "／";
        const patternLine = parts.length
            ? copy.aiPattern.replace("{parts}", parts.join(joiner))
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

    function normalizeTypeCode(typeCode) {
        const code = String(typeCode || '').trim().toLowerCase();
        return /^[ap][os][mn][er]$/.test(code) && typeDatabase[code] ? code : '';
    }

    function getTypeNameByCode(typeCode, lang = state.lang) {
        const info = typeDatabase[normalizeTypeCode(typeCode)];
        if (!info) return "";
        const normalizedLang = normalizeLang(lang);
        return info.name[normalizedLang] || info.name.ja || "";
    }

    function getCanonicalSiteUrl() {
        const configuredUrl = String(getSiteConfig().siteUrl || '').trim();
        return configuredUrl || window.location.origin || window.location.href;
    }

    function buildInviteUrl(typeCode = state.typeCode, source = 'invite', campaign = 'invite_share') {
        const code = normalizeTypeCode(typeCode);
        const inviteUrl = new URL('/', getCanonicalSiteUrl() || window.location.href);
        inviteUrl.search = '';
        inviteUrl.searchParams.set('utm_source', String(source || 'invite'));
        inviteUrl.searchParams.set('utm_medium', 'social');
        inviteUrl.searchParams.set('utm_campaign', String(campaign || 'invite_share'));
        if (state.lang) inviteUrl.searchParams.set('lang', state.lang);
        if (code) inviteUrl.searchParams.set('monster', code);
        if (code) inviteUrl.searchParams.set(INVITE_FROM_PARAM, code);
        return inviteUrl;
    }

    function readInviteFromParam() {
        try {
            const params = new URLSearchParams(window.location.search);
            return normalizeTypeCode(params.get(INVITE_FROM_PARAM));
        } catch (err) {
            console.warn('Invite parameter could not be read:', err);
            return '';
        }
    }

    function trackInviteLanding() {
        if (!state.inviteFromTypeCode || state.inviteLandingTracked) return;
        state.inviteLandingTracked = true;
        safeTrack('invite_landed', { from_type: state.inviteFromTypeCode });
    }

    function stableHashString(input) {
        let hash = 2166136261;
        const text = String(input || '');
        for (let i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return Math.abs(hash >>> 0);
    }

    function getCompatibilityRecordByCode(typeCode, lang = state.lang) {
        const normalizedLang = normalizeLang(lang);
        const typeName = getTypeNameByCode(typeCode, normalizedLang);
        const data = window.COMPATIBILITY_DATA && window.COMPATIBILITY_DATA[normalizedLang];
        return data && typeName ? data[typeName] : null;
    }

    function getInviteComment(tier, lang = state.lang) {
        const copy = i18n[normalizeLang(lang)] || i18n.ja;
        const comments = copy.inviteTeaserComments || i18n.ja.inviteTeaserComments;
        return comments[tier] || comments.mixed || '';
    }

    function calculateInviteCompatibility(fromCode, toCode, lang = state.lang) {
        const from = normalizeTypeCode(fromCode);
        const to = normalizeTypeCode(toCode);
        const normalizedLang = normalizeLang(lang);
        const fromName = getTypeNameByCode(from, normalizedLang);
        const toName = getTypeNameByCode(to, normalizedLang);
        const pairKey = `${from}_${to}`;

        if (!from || !to || !fromName || !toName) {
            return { fromName, toName, pair: pairKey, score: 0, scoreBucket: 0, comment: '' };
        }

        const record = getCompatibilityRecordByCode(from, normalizedLang);
        const isGood = Boolean(record && Array.isArray(record.goodMatch) && record.goodMatch.some(match => match.name === toName));
        const isBad = Boolean(record && Array.isArray(record.badMatch) && record.badMatch.some(match => match.name === toName));
        const seed = stableHashString(pairKey);

        let tier = 'mixed';
        let score = 52 + (seed % 17);

        if (from === to) {
            tier = 'same';
            score = 54 + (seed % 9);
        } else if (isGood) {
            tier = 'great';
            score = 88 + (seed % 8);
        } else if (isBad) {
            tier = 'clash';
            score = 28 + (seed % 12);
        } else {
            const sameAxisCount = from.split('').reduce((sum, ch, idx) => sum + (to[idx] === ch ? 1 : 0), 0);
            score = Math.max(42, Math.min(82, 46 + sameAxisCount * 8 + (seed % 13)));
            tier = score >= 70 ? 'good' : score >= 55 ? 'mixed' : 'clash';
        }

        const scoreBucket = Math.floor(score / 10) * 10;
        return {
            fromName,
            toName,
            pair: pairKey,
            score,
            scoreBucket,
            comment: getInviteComment(tier, normalizedLang)
        };
    }

    function readScoreHistory() {
        try {
            const value = JSON.parse(localStorage.getItem(SCORE_HISTORY_STORAGE_KEY) || '[]');
            return Array.isArray(value)
                ? value.map(Number).filter(num => Number.isFinite(num) && num >= 0 && num <= 100)
                : [];
        } catch (err) {
            console.warn('Score history could not be read:', err);
            return [];
        }
    }

    function recordScoreSample(score) {
        const normalizedScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
        try {
            const history = readScoreHistory();
            history.push(normalizedScore);
            localStorage.setItem(SCORE_HISTORY_STORAGE_KEY, JSON.stringify(history.slice(-50)));
        } catch (err) {
            console.warn('Score history could not be written:', err);
        }
    }

    function renderScoreComparison() {
        const el = document.getElementById('scoreComparison');
        if (!el || !state.typeCode) return;

        const copy = i18n[state.lang] || i18n.ja;
        const score = Math.max(0, Math.min(100, Math.round(state.approvalPercent || 0)));
        const punchlineKey = score < 40
            ? 'scorePunchlineLow'
            : score < 70
                ? 'scorePunchlineMid'
                : 'scorePunchlineHigh';
        const text = copy[punchlineKey] || i18n.ja[punchlineKey] || "";

        el.textContent = text;
        el.hidden = false;
    }

    function splitPreviewSentences(text, lang = state.lang) {
        const normalizedText = String(text || '').replace(/\s+/g, ' ').trim();
        if (!normalizedText) return [];
        const normalizedLang = normalizeLang(lang);
        const pattern = normalizedLang === 'en'
            ? /[^.!?]+[.!?]+|[^.!?]+$/g
            : /[^。！？!?]+[。！？!?]+|[^。！？!?]+$/g;
        return normalizedText.match(pattern)
            ? normalizedText.match(pattern).map(item => item.trim()).filter(Boolean)
            : [normalizedText];
    }

    function formatFreePreview(text, lang = state.lang, limit = 2, alwaysAppendMore = false) {
        const sentences = splitPreviewSentences(text, lang);
        if (!sentences.length) return "";
        const copy = i18n[normalizeLang(lang)] || i18n.ja;
        const preview = sentences.slice(0, limit).join(normalizeLang(lang) === 'en' ? ' ' : '');
        return alwaysAppendMore
            ? `${preview}\n${copy.freePreviewMore || i18n.ja.freePreviewMore}`
            : preview;
    }

    function buildPremiumReportText(typeCode = state.typeCode, lang = state.lang, aiOverride = '') {
        const normalizedLang = normalizeLang(lang);
        const info = typeDatabase[normalizeTypeCode(typeCode)];
        if (!info) return "";

        const copy = i18n[normalizedLang] || i18n.ja;
        const fallback = getPersonalizedAiFallback(typeCode, normalizedLang) || getBaseAiFallback(info, normalizedLang);
        const aiText = localizeDimensionTerms(aiOverride || fallback, normalizedLang);
        const typeAdviceItems = info.premiumAdvice && Array.isArray(info.premiumAdvice[normalizedLang])
            ? info.premiumAdvice[normalizedLang]
            : null;
        const adviceItems = typeAdviceItems || (Array.isArray(copy.premiumReportAdviceItems)
            ? copy.premiumReportAdviceItems
            : i18n.ja.premiumReportAdviceItems);
        const typeTruth = info.premiumTruth && typeof info.premiumTruth[normalizedLang] === 'string'
            ? info.premiumTruth[normalizedLang]
            : '';
        const truthText = typeTruth || copy.premiumReportTruth || i18n.ja.premiumReportTruth;
        const adviceText = adviceItems
            .map((item, idx) => `${idx + 1}. ${item}`)
            .join('\n');

        return [
            aiText,
            `${copy.premiumReportAdviceTitle || i18n.ja.premiumReportAdviceTitle}\n${adviceText}`,
            `${copy.premiumReportTruthTitle || i18n.ja.premiumReportTruthTitle}\n${truthText}`
        ].filter(Boolean).join('\n\n');
    }

    function buildInviteSharePayload(source = 'invite') {
        const copy = i18n[state.lang] || i18n.ja;
        const name = getCurrentTypeName(state.lang);
        const url = buildInviteUrl(state.typeCode, source, 'invite_share');
        const text = (copy.inviteShareText || i18n.ja.inviteShareText)
            .replace(/\$\{name\}/g, name);

        return {
            title: copy.inviteShareTitle || i18n.ja.inviteShareTitle,
            text,
            url: url.toString()
        };
    }

    async function copyTextToClipboard(text) {
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
    }

    async function shareInviteLink(source = 'invite_cta') {
        if (!normalizeTypeCode(state.typeCode)) return false;

        const payload = buildInviteSharePayload(source);
        safeTrack('invite_link_created', { from_type: state.typeCode });

        if (typeof navigator.share === 'function') {
            try {
                await navigator.share(payload);
                safeTrack('shindan_share', { channel: 'webshare', share_platform: 'webshare', share_variant: 'invite' });
                showToast(i18n[state.lang].inviteCopySuccess || i18n.ja.inviteCopySuccess);
                return true;
            } catch (err) {
                if (err && err.name === 'AbortError') {
                    console.warn('Invite Web Share was cancelled.');
                    return false;
                }
                console.warn('Invite Web Share failed, falling back to clipboard:', err);
            }
        }

        const copied = await copyTextToClipboard(`${payload.text}\n${payload.url}`);
        if (!copied) throw new Error(`Invite link copy failed: ${source}`);
        safeTrack('shindan_share', { channel: 'copy', share_platform: 'copy', share_variant: 'invite' });
        showToast(i18n[state.lang].inviteCopySuccess || i18n.ja.inviteCopySuccess);
        return true;
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
        const saved = readLastResult();
        let fullDescription = getBaseResultDescription(info, state.lang);
        try {
            fullDescription = getPersonalizedResultDescription(info, state.lang) || fullDescription;
        } catch (err) {
            console.warn('Detailed report description fallback used:', err);
        }
        fullDescription = localizeDimensionTerms(fullDescription, state.lang);

        const savedAi = saved && saved.typeCode === state.typeCode && saved.aiLang === state.lang
            ? saved.ai
            : '';
        const fullAiReport = buildPremiumReportText(state.typeCode, state.lang, savedAi);
        const previewDescription = formatFreePreview(fullDescription, state.lang, 2, false);
        const previewAi = formatFreePreview(savedAi || getPersonalizedAiFallback(state.typeCode, state.lang), state.lang, 2, false);

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
        if (descEl) descEl.textContent = unlocked ? fullDescription : previewDescription;
        if (aiEl) aiEl.textContent = unlocked ? fullAiReport : previewAi;
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
            let fallback = getBaseAiFallback(info, state.lang);
            try {
                fallback = getPersonalizedAiFallback(state.typeCode, state.lang) || fallback;
            } catch (err) {
                console.warn('Personalized AI fallback could not be generated:', err);
            }
            const ai = typeof aiText === 'string'
                ? aiText
                : fallback;
            let description = "";
            try {
                description = getPersonalizedResultDescription(info, state.lang);
            } catch (err) {
                console.warn('Personalized description could not be saved:', err);
                description = getBaseResultDescription(info, state.lang);
            }

            localStorage.setItem(LAST_RESULT_TYPE_KEY, getCurrentTypeName(state.lang));
            localStorage.setItem(LAST_RESULT_TYPE_CODE_KEY, state.typeCode);
            localStorage.setItem(LAST_RESULT_SCORE_KEY, String(state.approvalPercent));
            localStorage.setItem(LAST_RESULT_AI_KEY, localizeDimensionTerms(ai || fallback, state.lang));
            localStorage.setItem(LAST_RESULT_AI_LANG_KEY, state.lang);
            localStorage.setItem(LAST_RESULT_NICKNAME_KEY, state.username || "");
            localStorage.setItem(LAST_RESULT_AGE_KEY, state.age || "");
            localStorage.setItem(LAST_RESULT_DESCRIPTION_KEY, localizeDimensionTerms(description, state.lang));
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
            commentBox.textContent = localizeDimensionTerms(saved.ai, state.lang);
        } else {
            renderLocalizedAiFallback(typeCode, state.lang);
        }

        updatePaidSaveCta();
        updateLockPurchaseCta();
        updateDetailedReportCard();
        renderCompatibilitySection();
        renderTalentSection();
        renderScoreComparison();
        renderInviteTeaser();
        updateInviteCompatibilityCta();
        startChekiParallax();
        persistLastResult(saved.ai && saved.aiLang === state.lang ? saved.ai : undefined);
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

    function updateInviteCompatibilityCta() {
        const btn = document.getElementById('btn-invite-compatibility');
        if (!btn) return;

        const shouldShow = Boolean(normalizeTypeCode(state.typeCode));
        btn.hidden = !shouldShow;
        btn.style.display = shouldShow ? '' : 'none';
        btn.textContent = i18n[state.lang].inviteCompatibilityBtn || i18n.ja.inviteCompatibilityBtn;
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

    function setInviteTeaserVisible(section, visible) {
        section.style.display = visible ? 'block' : 'none';
        section.classList.toggle('active', visible);
    }

    function renderInviteTeaser() {
        const section = document.getElementById('inviteTeaserSection');
        if (!section) return;

        const fromCode = normalizeTypeCode(state.inviteFromTypeCode);
        const toCode = normalizeTypeCode(state.typeCode);
        if (!fromCode || !toCode) {
            section.innerHTML = '';
            setInviteTeaserVisible(section, false);
            return;
        }

        const copy = i18n[state.lang] || i18n.ja;
        const result = calculateInviteCompatibility(fromCode, toCode, state.lang);
        if (!result || !result.score) {
            section.innerHTML = '';
            setInviteTeaserVisible(section, false);
            return;
        }

        const title = document.createElement('div');
        title.className = 'result-details-title invite-teaser-title';
        title.textContent = copy.inviteTeaserTitle || i18n.ja.inviteTeaserTitle;

        const line = document.createElement('p');
        line.className = 'invite-teaser-line';
        line.textContent = (copy.inviteTeaserLine || i18n.ja.inviteTeaserLine)
            .replace('{from}', result.fromName)
            .replace('{score}', String(result.score))
            .replace('{comment}', result.comment);

        const hint = document.createElement('p');
        hint.className = 'invite-teaser-hint';
        hint.textContent = copy.inviteTeaserPaidHint || i18n.ja.inviteTeaserPaidHint;

        section.innerHTML = '';
        section.append(title, line, hint);
        setInviteTeaserVisible(section, true);

        if (state.inviteTeaserTrackedPair !== result.pair) {
            state.inviteTeaserTrackedPair = result.pair;
            safeTrack('compat_teaser_view', {
                pair: result.pair,
                score_bucket: result.scoreBucket
            });
        }
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
            entry: state.inviteFromTypeCode ? 'invite' : 'organic',
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
        state.inviteFromTypeCode = readInviteFromParam();
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
        trackInviteLanding();
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
                          state.lang === 'ko' ? "한국어로 변경되었습니다" : "語言已切換為中文");
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

        const inviteCompatibilityBtn = document.getElementById('btn-invite-compatibility');
        if (inviteCompatibilityBtn) {
            inviteCompatibilityBtn.addEventListener('click', async () => {
                try {
                    await shareInviteLink('invite_cta');
                } catch (err) {
                    console.warn('Invite share failed:', err);
                    showToast(i18n[state.lang].toastCopyFail || i18n.ja.toastCopyFail);
                }
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

        const buildResultShareUrl = source => buildInviteUrl(state.typeCode, source, 'result_share');

        const buildLineShareUrl = (source = 'line') => {
            const lineUrl = buildResultShareUrl(source);
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
                const { text, variant } = buildShareText(name, state.approvalPercent || 0);
                const shareUrl = buildResultShareUrl('x').toString();
                const intentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(i18n[state.lang].xHashtag)}`;
                safeTrack('invite_link_created', { from_type: state.typeCode || 'none' });
                safeTrack('shindan_share', {
                    channel: 'x',
                    share_platform: 'x',
                    share_variant: variant
                });

                showToast(i18n[state.lang].toastShareSuccess);
                window.location.assign(intentUrl);
            });
        }

        const lineShareBtn = document.getElementById('lineShareBtn');
        if (lineShareBtn) {
            lineShareBtn.addEventListener('click', () => {
                safeTrack('invite_link_created', { from_type: state.typeCode || 'none' });
                safeTrack('shindan_share', { channel: 'line', share_platform: 'line', share_variant: 'result' });
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
                        safeTrack('invite_link_created', { from_type: state.typeCode || 'none' });
                        safeTrack('shindan_share', { channel: 'copy', share_platform: 'copy', share_variant: 'result' });
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
        recordScoreSample(state.approvalPercent);
        
        const info = typeDatabase[state.typeCode];
        try {
            applyResultUI();
            persistLastResult(getPersonalizedAiFallback(state.typeCode, state.lang));
        } catch (err) {
            console.error('Result personalization failed; continuing with base result:', err);
            const descEl = document.getElementById('resultTypeDesc');
            const commentBox = document.getElementById('aiCommentaryBox');
            const baseDescription = localizeDimensionTerms(getBaseResultDescription(info, state.lang), state.lang);
            const baseFallback = localizeDimensionTerms(getBaseAiFallback(info, state.lang), state.lang);

            if (descEl) descEl.textContent = baseDescription;
            if (commentBox) commentBox.textContent = baseFallback;
            persistLastResult(baseFallback);
        }
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
        let description = getBaseResultDescription(info, state.lang);
        try {
            description = getPersonalizedResultDescription(info, state.lang) || description;
        } catch (err) {
            console.warn('Personalized result description failed; using base description:', err);
        }

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
                    textEl.textContent = state.lang === 'ja' ? "（畫像未配置）" :
                                         state.lang === 'en' ? "(Image not placed)" :
                                         state.lang === 'ko' ? "(이미지 없음)" : "(無畫像)";
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
        renderScoreComparison();
        renderInviteTeaser();
        updateInviteCompatibilityCta();
        updateDetailedReportCard();
    }

    // ==========================================
    // 9. Ollama AI連携 ＆ タイムアウト防弾フォールバック (多言語・年齢考慮)
    // ==========================================
    function renderLocalizedAiFallback(typeCode, lang = state.lang) {
        const commentBox = document.getElementById('aiCommentaryBox');
        const info = typeDatabase[typeCode];
        if (!commentBox || !info) return;

        let fallback = getBaseAiFallback(info, lang);
        try {
            fallback = getPersonalizedAiFallback(typeCode, lang) || fallback;
        } catch (err) {
            console.warn('Personalized AI fallback failed; using base fallback:', err);
        }
        const fullText = localizeDimensionTerms(fallback, lang);
        commentBox.textContent = fullText;
        persistLastResult(fullText);
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
                         requestedLang === 'zh' ? 'Traditional Chinese (繁體中文)' : 'Japanese (日本語)';

        const scoreBand = getScoreBand();
        const answerPattern = getAnswerPatternSummary(requestedLang);
        const systemPrompt = `診断内部情報: type='${typeCode}', name='${typeName}', age='${age}', approval='${state.approvalPercent}%', intensity='${scoreBand}', habit='${answerPattern}'。
この材料を、システム説明ではなく「SNSあるある」として笑える短い毒舌コメントに変換し、必ず「${langName}」で200字以内で作成してください。

【制約ルール】
1. 診断システムの裏側や判定ロジックを説明する内部用語は絶対に出さない。
2. 年齢・承認欲求の強さ・選び方のクセは、自然な行動描写やSNSあるあるとして溶かし込む。
3. 毒舌だけど可愛げと共感があること。人格否定、差別、ルッキズム、過度な見下しは禁止。
4. SNSでのありがちな行動（通知確認、既読、いいね、見栄、マウンティング、こっそり比較など）を具体的に混ぜる。
5. 挨拶や自己紹介、判定コード自体の説明は不要。最初から短くテンポよく刺す。
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
                const fullText = localizeDimensionTerms(commentary, requestedLang);
                commentBox.textContent = fullText;
                persistLastResult(fullText);
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
                          state.lang === 'ko' ? "체키가 파스텔 안개에 덮였습니다..." : "拍立得已被粉霧封閉...");
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
