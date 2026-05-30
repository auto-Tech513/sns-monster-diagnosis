const TYPE_NAMES = {
    pome: { ja: "かまってちゃん型ポメラニアン", en: "Whining Pomeranian", ko: "관심종자형 포메라니안", zh: "求关注型博美犬" },
    pomr: { ja: "殻にこもる自律カタツムリ", en: "Hermit Snail", ko: "껍질 속에 숨는 자율 달팽이", zh: "隐居自律小蜗牛" },
    pone: { ja: "怯える甘えん坊トイプー", en: "Frightened Toy Poodle", ko: "겁먹은 응석받이 토이푸들", zh: "胆怯撒娇贵宾犬" },
    ponr: { ja: "要領のいい保身コアラ", en: "Sly Protector Koala", ko: "처세 좋은 보신 코알라", zh: "善于保身的树袋熊" },
    psme: { ja: "エモさ渇望インフルエンサー予備軍", en: "Emo-Star Wannabe", ko: "감성 갈망 인플루언서 꿈나무", zh: "渴望情怀的预备网红" },
    psmr: { ja: "孤高のパステル黒猫", en: "Aloof Pastel Black Cat", ko: "고고한 파스텔 검은 고양이", zh: "高冷的粉彩黑猫" },
    psne: { ja: "見守られ待ちピヨちゃん", en: "Watch-Me Baby Chick", ko: "보살핌 대기조 삐약이", zh: "求关注的孵化小鸡" },
    psnr: { ja: "マイペースな引きこもりパンダ", en: "Low-Energy Panda", ko: "마이웨이 방구석 판다", zh: "我行我素宅地熊猫" },
    aome: { ja: "マウンティング突撃ライオン", en: "Flexing Charging Lion", ko: "마운팅 돌격 사자", zh: "炫耀突击狂暴狮" },
    aomr: { ja: "無自覚マニアックオオカミ", en: "Aggressive Solo Wolf", ko: "무자각 매니악 늑대", zh: "无意识狂热孤狼" },
    aone: { ja: "手柄泥棒アピールオウム", en: "Credit-Claiming Parrot", ko: "공치사 어필 앵무새", zh: "抢功大喇叭鹦鹉" },
    aonr: { ja: "合理的ルールポリス柴犬", en: "Rational Rule Police Dog", ko: "합리적 규칙 경찰 시바견", zh: "理性规则哨兵柴犬" },
    asme: { ja: "ドヤ顔クリエイティブ孔雀", en: "Showy Creative Peacock", ko: "거들먹거리는 크리에이티브 공작", zh: "得意洋洋的文艺孔雀" },
    asmr: { ja: "我道突っ走りハリネズミ", en: "Edgy Solo Hedgehog", ko: "독불장군 질주 고슴도치", zh: "独来独往的狂奔刺猬" },
    asne: { ja: "依存型バズりチワワ", en: "Viral-Desperate Chihuahua", ko: "의존성 관심 갈구 치와와", zh: "病态求关注的抖动吉娃娃" },
    asnr: { ja: "頑固なマイキャラ黒豚", en: "Stubborn Unique Boar", ko: "고집불통 마이캐릭터 흑돼지", zh: "顽固的人设小野猪" }
};

const COPY = {
    ja: {
        appName: "SNS承認欲求モンスター診断",
        title: name => `私の承認欲求モンスターは『${name}』🐾`,
        genericTitle: "SNS承認欲求モンスター診断",
        description: "あなたは何モンスター？SNS承認欲求モンスター診断"
    },
    en: {
        appName: "SNS Recognition Monster Diagnosis",
        title: name => `My approval desire monster is \"${name}\" 🐾`,
        genericTitle: "SNS Recognition Monster Diagnosis",
        description: "Which monster are you? Try the SNS Recognition Monster Diagnosis."
    },
    ko: {
        appName: "SNS 승인욕구 몬스터 진단",
        title: name => `내 승인욕구 몬스터는 '${name}' 🐾`,
        genericTitle: "SNS 승인욕구 몬스터 진단",
        description: "당신은 어떤 몬스터일까요? SNS 승인욕구 몬스터 진단."
    },
    zh: {
        appName: "SNS认可欲怪兽诊断",
        title: name => `我的认可欲怪兽是“${name}”🐾`,
        genericTitle: "SNS认可欲怪兽诊断",
        description: "你是哪种怪兽？来试试 SNS 认可欲怪兽诊断。"
    }
};

const SUPPORTED_LANGS = new Set(["ja", "en", "ko", "zh"]);

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function normalizeLang(value) {
    const lang = String(value || "ja").toLowerCase();
    return SUPPORTED_LANGS.has(lang) ? lang : "ja";
}

function buildAppUrl(requestUrl, lang, typeCode) {
    const appUrl = new URL("/", requestUrl);
    appUrl.searchParams.set("lang", lang);
    if (typeCode) {
        appUrl.searchParams.set("monster", typeCode);
    }
    for (const [key, value] of requestUrl.searchParams.entries()) {
        if (key.toLowerCase().startsWith("utm_")) {
            appUrl.searchParams.set(key, value);
        }
    }
    return appUrl.toString();
}

function buildOgUrl(requestUrl, lang, typeCode) {
    const ogUrl = new URL("/r", requestUrl);
    ogUrl.searchParams.set("lang", lang);
    if (typeCode) {
        ogUrl.searchParams.set("monster", typeCode);
    }
    for (const [key, value] of requestUrl.searchParams.entries()) {
        if (key.toLowerCase().startsWith("utm_")) {
            ogUrl.searchParams.set(key, value);
        }
    }
    return ogUrl.toString();
}

export async function onRequest({ request }) {
    const requestUrl = new URL(request.url);
    const lang = normalizeLang(requestUrl.searchParams.get("lang"));
    const rawMonster = String(requestUrl.searchParams.get("monster") || "").toLowerCase();
    const typeCode = Object.prototype.hasOwnProperty.call(TYPE_NAMES, rawMonster) ? rawMonster : "";
    const copy = COPY[lang] || COPY.ja;
    const typeName = typeCode ? (TYPE_NAMES[typeCode][lang] || TYPE_NAMES[typeCode].ja) : "";
    const title = typeCode ? copy.title(typeName) : copy.genericTitle;
    const description = copy.description;
    const imageCode = typeCode || "_default";
    const imageUrl = new URL(`/og/${imageCode}.png`, requestUrl).toString();
    const ogUrl = buildOgUrl(requestUrl, lang, typeCode);
    const appUrl = buildAppUrl(requestUrl, lang, typeCode);

    const html = `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(copy.appName)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(ogUrl)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
  <meta http-equiv="refresh" content="0;url=${escapeHtml(appUrl)}">
  <script>location.replace(${JSON.stringify(appUrl)});</script>
</head>
<body>
  <p><a href="${escapeHtml(appUrl)}">${escapeHtml(description)}</a></p>
</body>
</html>`;

    return new Response(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=300"
        }
    });
}
