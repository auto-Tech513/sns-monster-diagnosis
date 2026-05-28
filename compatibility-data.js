// compatibility-data.js v2
// SNS承認欲求モンスター診断 - 相性診断パック
// 16タイプ x 4言語。app.js は COMPATIBILITY_DATA[lang][表示名] を参照するため、
// 外側キーは各言語のタイプ表示名と完全一致させる。
(function () {
  "use strict";

  const LANGS = ["ja", "en", "ko", "zh"];

  const TYPES = {
    aome: {
      name: { ja: "マウンティング突撃ライオン", en: "Flexing Charging Lion", ko: "마운팅 돌격 사자", zh: "炫耀突击狂暴狮" },
      gift: { ja: "前に出る推進力", en: "bold forward drive", ko: "앞으로 밀고 나가는 추진력", zh: "主动向前冲的推进力" },
      wound: { ja: "負けたくない焦り", en: "fear of losing status", ko: "지기 싫은 초조함", zh: "不想输的焦虑" },
      shadow: { ja: "主導権を奪いにいく圧", en: "pressure to dominate", ko: "주도권을 빼앗으려는 압박", zh: "抢夺主导权的压迫感" }
    },
    aone: {
      name: { ja: "手柄泥棒アピールオウム", en: "Credit-Claiming Parrot", ko: "공치사 어필 앵무새", zh: "抢功大喇叭鹦鹉" },
      gift: { ja: "場を明るく言語化する力", en: "the knack for making a moment visible", ko: "분위기를 밝게 언어화하는 힘", zh: "把场面说热闹的表达力" },
      wound: { ja: "自分だけ見落とされる恐怖", en: "panic at being overlooked", ko: "나만 놓칠까 봐 두려운 마음", zh: "害怕只有自己被忽略" },
      shadow: { ja: "他人の成果まで自分色に染める癖", en: "turning others' wins into your own spotlight", ko: "남의 성과까지 자기 색으로 칠하는 습관", zh: "把别人的成果也染成自己的颜色" }
    },
    asne: {
      name: { ja: "依存型バズりチワワ", en: "Viral-Desperate Chihuahua", ko: "의존성 관심 갈구 치와와", zh: "病态求关注的抖动吉娃娃" },
      gift: { ja: "反応を拾う愛嬌", en: "quick, affectionate responsiveness", ko: "반응을 잘 살피는 애교", zh: "敏锐接住回应的亲和力" },
      wound: { ja: "反応が途切れる不安", en: "anxiety when replies slow down", ko: "반응이 끊길 때의 불안", zh: "回应一停就不安" },
      shadow: { ja: "愛情確認を連打する癖", en: "spamming reassurance checks", ko: "애정 확인을 연타하는 습관", zh: "反复确认爱意的习惯" }
    },
    psme: {
      name: { ja: "エモさ渇望インフルエンサー予備軍", en: "Emo-Star Wannabe", ko: "감성 갈망 인플루언서 꿈나무", zh: "渴望情怀的预备网红" },
      gift: { ja: "感情を物語に変える感性", en: "turning feelings into stories", ko: "감정을 이야기로 바꾸는 감성", zh: "把情绪变成故事的感性" },
      wound: { ja: "共感されない寂しさ", en: "loneliness when your feelings are not mirrored", ko: "공감받지 못할 때의 외로움", zh: "不被共情时的孤独" },
      shadow: { ja: "平凡な日常までドラマ化する癖", en: "dramatizing even quiet days", ko: "평범한 하루도 드라마로 만드는 습관", zh: "把普通日常也戏剧化" }
    },
    pome: {
      name: { ja: "かまってちゃん型ポメラニアン", en: "Whining Pomeranian", ko: "관심종자형 포메라니안", zh: "求关注型博美犬" },
      gift: { ja: "素直に甘える柔らかさ", en: "soft, honest need for closeness", ko: "솔직하게 기대는 부드러움", zh: "坦率撒娇的柔软感" },
      wound: { ja: "見捨てられそうな不安", en: "fear of being quietly abandoned", ko: "버려질 것 같은 불안", zh: "害怕被悄悄抛下" },
      shadow: { ja: "遠回しに構ってサインを出す癖", en: "hinting for attention instead of asking", ko: "돌려서 관심 신호를 보내는 습관", zh: "拐弯抹角地求关注" }
    },
    psne: {
      name: { ja: "見守られ待ちピヨちゃん", en: "Watch-Me Baby Chick", ko: "보살핌 대기조 삐약이", zh: "求关注的孵化小鸡" },
      gift: { ja: "小さな変化を喜べる純度", en: "pure delight in small care", ko: "작은 변화를 기뻐하는 순도", zh: "会为小小关心开心的纯度" },
      wound: { ja: "自分から動く怖さ", en: "fear of moving first", ko: "먼저 움직이는 것에 대한 두려움", zh: "害怕自己先行动" },
      shadow: { ja: "待つだけで察してもらおうとする癖", en: "waiting to be understood without asking", ko: "기다리기만 하며 알아주길 바라는 습관", zh: "只等待别人主动看懂" }
    },
    pone: {
      name: { ja: "怯える甘えん坊トイプー", en: "Frightened Toy Poodle", ko: "겁먹은 응석받이 토이푸들", zh: "胆怯撒娇贵宾犬" },
      gift: { ja: "守られた時に花開く信頼感", en: "trust that blooms under gentle care", ko: "보호받을 때 피어나는 신뢰감", zh: "被温柔保护时绽放的信任感" },
      wound: { ja: "失敗したら嫌われる恐怖", en: "fear that one mistake ruins love", ko: "실수하면 미움받을 것 같은 공포", zh: "害怕一失误就被讨厌" },
      shadow: { ja: "不安を相手の責任にしがちな癖", en: "handing your anxiety to the other person", ko: "불안을 상대 책임으로 돌리는 습관", zh: "把不安交给对方承担" }
    },
    ponr: {
      name: { ja: "要領のいい保身コアラ", en: "Sly Protector Koala", ko: "처세 좋은 보신 코알라", zh: "善于保身的树袋熊" },
      gift: { ja: "衝突を避けて場を整える勘", en: "instinct for lowering conflict", ko: "충돌을 피하며 판을 정리하는 감각", zh: "降低冲突、整理局面的直觉" },
      wound: { ja: "傷つく前に逃げたい本能", en: "urge to retreat before getting hurt", ko: "상처받기 전에 도망치고 싶은 본능", zh: "受伤前就想退开的本能" },
      shadow: { ja: "安全圏から本音を隠す癖", en: "hiding truth from a safe distance", ko: "안전지대에서 속마음을 숨기는 습관", zh: "躲在安全区隐藏真心" }
    },
    asme: {
      name: { ja: "ドヤ顔クリエイティブ孔雀", en: "Showy Creative Peacock", ko: "거들먹거리는 크리에이티브 공작", zh: "得意洋洋的文艺孔雀" },
      gift: { ja: "空気を華やかにする表現力", en: "expressive power that brightens a room", ko: "분위기를 화려하게 만드는 표현력", zh: "让气氛变华丽的表现力" },
      wound: { ja: "センスを否定される痛み", en: "pain when your taste is dismissed", ko: "센스를 부정당할 때의 아픔", zh: "品味被否定时的疼痛" },
      shadow: { ja: "拍手がないと踊り続ける癖", en: "performing harder when applause is thin", ko: "박수가 없으면 더 과하게 춤추는 습관", zh: "掌声不够就表演得更用力" }
    },
    asmr: {
      name: { ja: "我道突っ走りハリネズミ", en: "Edgy Solo Hedgehog", ko: "독불장군 질주 고슴도치", zh: "独来独往的狂奔刺猬" },
      gift: { ja: "独自路線を切り開く突破力", en: "power to carve a private path", ko: "독자 노선을 뚫고 나가는 힘", zh: "开辟自我路线的突破力" },
      wound: { ja: "理解されない怒り", en: "anger at not being understood", ko: "이해받지 못할 때의 분노", zh: "不被理解时的怒气" },
      shadow: { ja: "近づく相手にも棘を向ける癖", en: "pointing your spikes even at allies", ko: "다가오는 사람에게도 가시를 세우는 습관", zh: "连靠近的人也会被刺到" }
    },
    aomr: {
      name: { ja: "無自覚マニアックオオカミ", en: "Aggressive Solo Wolf", ko: "무자각 매니악 늑대", zh: "无意识狂热孤狼" },
      gift: { ja: "深掘りして形にする集中力", en: "focus that turns obsession into output", ko: "집요함을 결과물로 바꾸는 집중력", zh: "把执念做成成果的专注力" },
      wound: { ja: "浅く扱われる苛立ち", en: "irritation when treated superficially", ko: "얕게 취급받을 때의 짜증", zh: "被肤浅对待时的不耐" },
      shadow: { ja: "熱量で相手を置き去りにする癖", en: "leaving people behind with intensity", ko: "열정으로 상대를 놓고 가는 습관", zh: "用过高热量把别人甩在后面" }
    },
    aonr: {
      name: { ja: "合理的ルールポリス柴犬", en: "Rational Rule Police Dog", ko: "합리적 규칙 경찰 시바견", zh: "理性规则哨兵柴犬" },
      gift: { ja: "関係を安定させる整備力", en: "ability to stabilize a relationship", ko: "관계를 안정시키는 정비력", zh: "让关系稳定下来的整理力" },
      wound: { ja: "曖昧さに振り回される不快感", en: "discomfort with ambiguity", ko: "애매함에 휘둘리는 불쾌감", zh: "被暧昧牵着走的不适" },
      shadow: { ja: "正しさで相手を管理する癖", en: "managing people through correctness", ko: "정답으로 상대를 관리하는 습관", zh: "用正确性管理别人" }
    },
    pomr: {
      name: { ja: "殻にこもる自律カタツムリ", en: "Hermit Snail", ko: "껍질 속에 숨는 자율 달팽이", zh: "隐居自律小蜗牛" },
      gift: { ja: "静かに積み上げる自律心", en: "quiet self-discipline", ko: "조용히 쌓아 올리는 자율성", zh: "安静积累的自律心" },
      wound: { ja: "急かされることへの拒絶感", en: "resistance to being rushed", ko: "재촉당하는 것에 대한 거부감", zh: "抗拒被催促" },
      shadow: { ja: "殻の中で結論を出してしまう癖", en: "deciding everything inside your shell", ko: "껍질 안에서 혼자 결론 내는 습관", zh: "在壳里独自下结论" }
    },
    psmr: {
      name: { ja: "孤高のパステル黒猫", en: "Aloof Pastel Black Cat", ko: "고고한 파스텔 검은 고양이", zh: "高冷的粉彩黑猫" },
      gift: { ja: "美意識で距離を整える力", en: "aesthetic boundaries that protect peace", ko: "미감으로 거리를 조율하는 힘", zh: "用审美调整距离的能力" },
      wound: { ja: "雑に踏み込まれる嫌悪感", en: "disgust at careless intrusion", ko: "무례하게 들어오는 것에 대한 혐오감", zh: "讨厌被粗暴闯入" },
      shadow: { ja: "冷たさで好意まで隠す癖", en: "hiding affection behind coolness", ko: "차가움으로 호감까지 숨기는 습관", zh: "用冷淡把好感也藏起来" }
    },
    psnr: {
      name: { ja: "マイペースな引きこもりパンダ", en: "Low-Energy Panda", ko: "마이웨이 방구석 판다", zh: "我行我素宅地熊猫" },
      gift: { ja: "何もしない時間を守る包容力", en: "the calm to protect unforced time", ko: "아무것도 하지 않는 시간을 지키는 포용력", zh: "守住无压力时间的包容力" },
      wound: { ja: "ペースを乱される疲労感", en: "fatigue when your pace is disrupted", ko: "페이스가 깨질 때의 피로감", zh: "节奏被打乱时的疲惫" },
      shadow: { ja: "省エネを理由に関係を止める癖", en: "using low energy to pause intimacy", ko: "에너지 절약을 핑계로 관계를 멈추는 습관", zh: "用省力当理由停下关系" }
    },
    asnr: {
      name: { ja: "頑固なマイキャラ黒豚", en: "Stubborn Unique Boar", ko: "고집불통 마이캐릭터 흑돼지", zh: "顽固的人设小野猪" },
      gift: { ja: "世界観を貫く芯の強さ", en: "a backbone that protects your world", ko: "세계관을 밀고 가는 단단함", zh: "坚持世界观的骨气" },
      wound: { ja: "自分らしさを削られる恐怖", en: "fear of having your identity sanded down", ko: "나답다는 감각이 깎일 것 같은 두려움", zh: "害怕自我被磨平" },
      shadow: { ja: "譲歩まで敗北と見なす癖", en: "treating compromise as defeat", ko: "양보를 패배로 여기는 습관", zh: "把让步也看成失败" }
    }
  };

  const MATRIX = {
    aome: { good: ["pomr", "psne"], bad: ["aone", "asnr"] },
    aone: { good: ["psne", "pone"], bad: ["aome", "asne"] },
    asne: { good: ["aonr", "psne"], bad: ["psmr", "pomr"] },
    psme: { good: ["psne", "psmr"], bad: ["aonr", "asnr"] },
    pome: { good: ["psnr", "psmr"], bad: ["aome", "aone"] },
    psne: { good: ["aonr", "psnr"], bad: ["psme", "asmr"] },
    pone: { good: ["aonr", "pomr"], bad: ["aome", "asmr"] },
    ponr: { good: ["psnr", "asnr"], bad: ["aonr", "aomr"] },
    asme: { good: ["pone", "psne"], bad: ["aome", "aone"] },
    asmr: { good: ["aomr", "psnr"], bad: ["pone", "psne"] },
    aomr: { good: ["asmr", "psmr"], bad: ["psne", "pome"] },
    aonr: { good: ["pone", "psne"], bad: ["psme", "asmr"] },
    pomr: { good: ["pone", "psmr"], bad: ["aome", "asme"] },
    psmr: { good: ["psnr", "pomr"], bad: ["asne", "aome"] },
    psnr: { good: ["psmr", "pomr"], bad: ["aome", "psme"] },
    asnr: { good: ["psnr", "ponr"], bad: ["aonr", "aone"] }
  };

  const COPY = {
    ja: {
      goodReason(self, other) {
        return `${other.name.ja}は、あなたの「${self.wound.ja}」を責めず、${other.gift.ja}で受け止めてくれる相手です。承認を奪い合わず、足りない部分を自然に補い合えるので、背伸びより回復が起きやすい組み合わせ。`;
      },
      badReason(self, other) {
        return `${other.name.ja}は、あなたの「${self.wound.ja}」に${other.shadow.ja}をぶつけやすい相手です。最初は刺激的でも、関係が深まるほど互いの弱点を増幅し、承認の取り合いか沈黙の我慢大会に転びやすい。`;
      },
      secret(other) {
        return `${other.name.ja}の${other.gift.ja}を先に言葉にすると、関係の温度が一段上がります。`;
      },
      advice(other) {
        return `${other.name.ja}とは勝ち負けを急がず、境界線を短い言葉で先に共有すること。`;
      },
      loveStyle(self) {
        return `あなたの恋愛は「${self.wound.ja}」をどう扱うかで大きく変わります。強がったり察してもらおうとしたりすると、せっかくの${self.gift.ja}が防衛反応に見えてしまうタイプ。本当に相性が良い相手は、あなたの不器用な承認欲求を笑わず、静かに翻訳してくれる人です。`;
      },
      loveAdvice(self) {
        return `今日の一手は、${self.shadow.ja}を少しだけ止めて、欲しい反応を一文で伝えること。恋は演出より、説明できる勇気で長持ちします。`;
      }
    },
    en: {
      goodReason(self, other) {
        return `${other.name.en} does not punish your ${self.wound.en}; they meet it with ${other.gift.en}. Instead of fighting for the same spotlight, this pairing lets both sides recover, breathe, and feel useful without turning love into a scoreboard.`;
      },
      badReason(self, other) {
        return `${other.name.en} easily collides with your ${self.wound.en} through their ${other.shadow.en}. The chemistry may feel exciting at first, but the longer it runs, the more both shadows amplify each other until affection becomes a contest.`;
      },
      secret(other) {
        return `Name ${other.name.en}'s ${other.gift.en} before asking for anything.`;
      },
      advice(other) {
        return `With ${other.name.en}, slow down and state one boundary before the mood turns into a trial.`;
      },
      loveStyle(self) {
        return `Your love pattern changes around your ${self.wound.en}. When you overperform, hint, or protect yourself too hard, your ${self.gift.en} starts looking like a defense mechanism. The right partner reads the fear underneath and helps you feel wanted without forcing you to audition for affection.`;
      },
      loveAdvice(self) {
        return `Today's move: pause your ${self.shadow.en}, then ask for one concrete kind of reassurance. Directness will feel scary, but it is cheaper than another emotional performance.`;
      }
    },
    ko: {
      goodReason(self, other) {
        return `${other.name.ko}${koJosa(other.name.ko, "eun")} 당신 안의 '${self.wound.ko}'${koJosa(self.wound.ko, "eul")} 비난하지 않고, ${other.gift.ko}${koJosa(other.gift.ko, "ro")} 받아 줍니다. 같은 관심을 빼앗기보다 서로의 부족한 부분을 보완하니, 과장된 어필보다 회복감이 먼저 생기기 쉬운 조합입니다.`;
      },
      badReason(self, other) {
        return `${other.name.ko}${koJosa(other.name.ko, "eun")} 당신 안의 '${self.wound.ko}'에 ${other.shadow.ko}${koJosa(other.shadow.ko, "eul")} 부딪치기 쉽습니다. 처음엔 강렬해 보여도 시간이 갈수록 서로의 약점을 키워, 애정이 확인이 아니라 경쟁처럼 변할 위험이 큽니다.`;
      },
      secret(other) {
        return `${other.name.ko}의 ${other.gift.ko}${koJosa(other.gift.ko, "eul")} 먼저 인정하면 관계가 훨씬 부드러워집니다.`;
      },
      advice(other) {
        return `${other.name.ko}${koJosa(other.name.ko, "gwa")}는 이기려 하지 말고, 필요한 거리와 기준을 짧게 말하세요.`;
      },
      loveStyle(self) {
        return `당신의 연애는 '${self.wound.ko}'${koJosa(self.wound.ko, "eul")} 어떻게 다루느냐에 따라 크게 달라집니다. 강한 척하거나 눈치채 주길 기다리면 ${self.gift.ko}${koJosa(self.gift.ko, "i")} 방어처럼 보일 수 있습니다. 좋은 상대는 그 불안을 웃어넘기지 않고 조용히 번역해 주는 사람입니다.`;
      },
      loveAdvice(self) {
        return `오늘의 한 수는 ${self.shadow.ko}${koJosa(self.shadow.ko, "eul")} 잠깐 멈추고, 원하는 반응을 한 문장으로 말하는 것입니다. 설명할 용기가 관계를 오래 살립니다.`;
      }
    },
    zh: {
      goodReason(self, other) {
        return `${other.name.zh}不会责怪你的「${self.wound.zh}」，反而会用${other.gift.zh}接住你。你们不太会抢同一份关注，反而容易互补，让关系从表演和逞强里慢慢恢复呼吸感。`;
      },
      badReason(self, other) {
        return `${other.name.zh}很容易用${other.shadow.zh}撞上你的「${self.wound.zh}」。一开始也许很有火花，但相处越久，彼此的弱点越会被放大，爱意会慢慢变成较劲。`;
      },
      secret(other) {
        return `先说出${other.name.zh}的${other.gift.zh}，关系温度会明显上升。`;
      },
      advice(other) {
        return `和${other.name.zh}相处时，不要急着分输赢，先把界线说清楚。`;
      },
      loveStyle(self) {
        return `你的恋爱模式取决于如何处理「${self.wound.zh}」。越是逞强、暗示、保护自己，${self.gift.zh}就越容易被误解成防御。真正适合你的人，会读懂你笨拙的确认需求，而不是逼你继续表演。`;
      },
      loveAdvice(self) {
        return `今天的行动：先停下${self.shadow.zh}，再用一句话说出你想要的回应。关系能长久，靠的不是演出，而是说明白的勇气。`;
      }
    }
  };

  function koJosa(text, type) {
    const chars = Array.from(String(text || "").trim());
    const last = chars[chars.length - 1] || "";
    const code = last.charCodeAt(0);
    const hasBatchim = code >= 0xac00 && code <= 0xd7a3 && ((code - 0xac00) % 28) !== 0;
    const finalIndex = code >= 0xac00 && code <= 0xd7a3 ? (code - 0xac00) % 28 : 0;
    if (type === "eul") return hasBatchim ? "을" : "를";
    if (type === "ro") return hasBatchim && finalIndex !== 8 ? "으로" : "로";
    if (type === "i") return hasBatchim ? "이" : "가";
    if (type === "eun") return hasBatchim ? "은" : "는";
    if (type === "gwa") return hasBatchim ? "과" : "와";
    return "";
  }

  function makeMatch(lang, code, kind) {
    const self = TYPES[code];
    const formatter = COPY[lang];
    return MATRIX[code][kind].map(otherCode => {
      const other = TYPES[otherCode];
      return kind === "good"
        ? {
            name: other.name[lang],
            reason: formatter.goodReason(self, other),
            secret: formatter.secret(other)
          }
        : {
            name: other.name[lang],
            reason: formatter.badReason(self, other),
            advice: formatter.advice(other)
          };
    });
  }

  function makeRecord(lang, code) {
    const self = TYPES[code];
    const formatter = COPY[lang];
    return {
      goodMatch: makeMatch(lang, code, "good"),
      badMatch: makeMatch(lang, code, "bad"),
      loveStyle: formatter.loveStyle(self),
      loveAdvice: formatter.loveAdvice(self)
    };
  }

  function makeLanguageData(lang) {
    return Object.fromEntries(
      Object.keys(TYPES).map(code => [TYPES[code].name[lang], makeRecord(lang, code)])
    );
  }

  window.COMPATIBILITY_DATA = Object.fromEntries(
    LANGS.map(lang => [lang, makeLanguageData(lang)])
  );
})();
