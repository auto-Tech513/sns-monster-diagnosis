// SNS承認欲求モンスター診断 - 眠った才能パック (¥360 第3層)
// 16タイプ × 4言語 = 64レコード
// app.js: window.TALENT_DATA[lang][japaneseTypeName] で参照される
// （getCurrentTypeName('ja') がハードコードのため、全言語で日本語キー固定。
//   compatibility-data.js とはキー規約が異なるので注意）
//
// record schema:
//   hiddenTalent: string         眠っている才能の核（80-120字）
//   whyThisFits: string          なぜそのタイプにそれが眠っているのかの心理的根拠（120-180字）
//   idealJobs: [{name, reason}×3] その才能が一番活きる職業3つ（reason 60-100字）
//   strengthInWeakness: string    「弱点」と思っていた特性こそが強みになる説明（100-140字）
//   futureHint: string            数年後にどう開花する可能性があるか（100-140字）
//   actionAdvice: string          明日からできる小さな一歩（80-120字）

window.TALENT_DATA = {
  ja: {
    // ===== 高承認×外向 =====

    "マウンティング突撃ライオン": {
      hiddenTalent: "誰もが躊躇する『最初の一歩』を踏み出す爆発的な突破力。停滞した場を動かすことができる、稀有な起爆装置タイプの才能です。",
      whyThisFits: "あなたが普段やっている『マウントしたい』という衝動は、実はその奥に『何かを動かしたい』『止まっていたくない』という強烈なエネルギーが隠れています。承認欲求の方向を『他人より上に立つ』から『誰もやらない最初のリスクを取る』に切り替えた瞬間、あなたは組織で最も価値ある人材に変わります。",
      idealJobs: [
        { name: "新規事業開発・スタートアップ立ち上げ", reason: "既存秩序に挑むエネルギーと、批判を恐れず前に出る突破力が、0→1フェーズで最大の武器になる" },
        { name: "営業マネージャー・BD職", reason: "押しの強さが成果に直結する世界では、あなたの『負けたくない』性質がそのまま数字を作る原動力に" },
        { name: "イベント企画・プロデュース", reason: "場を仕切り、人を巻き込み、注目を集める力。主役級の存在感は舞台演出と非常に相性がいい" }
      ],
      strengthInWeakness: "『負けたくない焦り』は、平凡な日々に流されない強烈な原動力です。安定企業で潰される性質ではなく、数字や勝敗が明確な環境にいれば、その焦りこそが他人の追随を許さない成果を生みます。",
      futureHint: "30代以降、あなたのマウントが『教える側のリーダーシップ』に変換されると一気に魅力化します。後輩を伸ばす良き先輩・コーチ・経営者への道が開け、若い頃の衝動が成熟した推進力に変わります。",
      actionAdvice: "次のミーティングで『俺がやる』ではなく『俺が責任を取る』と一度だけ言ってみる。マウントとリーダーシップを分ける、たった一語の違いがあなたを次のステージに運びます。"
    },

    "手柄泥棒アピールオウム": {
      hiddenTalent: "地味な成果や見過ごされがちな価値を、誰にでも分かる言葉で『見える化』する翻訳力。広報・伝達役として組織を動かせる才能です。",
      whyThisFits: "『自分のものにしたい』という癖の裏側には、『これは凄いことなのに誰も気づいていない』を見抜く目と、それを言語化する力が眠っています。手柄を奪う方向ではなく『地味な仕事の価値を世に伝える』方向に向けると、誰よりも信頼される広報役・橋渡し役になれます。",
      idealJobs: [
        { name: "広報・PR・コミュニケーション職", reason: "他人の業績や商品の魅力を発信する仕事は、あなたの『目立たせる』本能を倫理的に解放できる最適解" },
        { name: "マーケター・コピーライター", reason: "見過ごされる価値を見抜き、ターゲットに刺さる言葉に変換する力は、まさにあなたの才能の核" },
        { name: "セミナー講師・プレゼンター", reason: "場の主導権を握ることに快感を覚えるあなたは、人前で話す職業で水を得た魚になる" }
      ],
      strengthInWeakness: "『自分だけ見落とされる恐怖』は、人の感情の機微を異常な精度で読む力に変換できます。誰がスポットライトを欲しがっているか、誰が冷遇されているかが分かるあなたは、人間関係の達人になれる素質を持っています。",
      futureHint: "5年後、あなたが『自分を売り込む』のをやめて『他人を売り込む』側に回ると、急にあなたの周りに人が集まり始めます。広報役・代理人・プロデューサーとして、人の才能を世に出す立場で大成する可能性が高い。",
      actionAdvice: "今週中に、職場で目立たない誰かの仕事を一度だけ『これ凄いですよね』と公の場で言ってみる。手柄を譲った瞬間、人があなたを信頼し始めます。"
    },

    "依存型バズりチワワ": {
      hiddenTalent: "他人の感情の機微をミリ秒単位で察知する超高感度センサー。誰よりも早く『相手の温度変化』に気づく才能です。",
      whyThisFits: "『反応が途切れる不安』は、裏返せば『反応をキャッチする能力が異常に高い』ことの証明です。普通の人が気づかない既読の遅延、表情の微変化、声のトーンを読み取れるあなたは、顧客や読者の心が離れる『その一歩手前』で動ける唯一のタイプです。",
      idealJobs: [
        { name: "SNS運用・コミュニティマネージャー", reason: "フォロワーの空気感やエンゲージメント低下の兆候を、データではなく直感で察知できる感度はAIに代替できない武器" },
        { name: "カスタマーサクセス・カスタマーサポート", reason: "顧客の解約サインを早期発見し、関係を立て直す仕事はあなたの本能と完全に一致する" },
        { name: "接客・販売・営業フロント", reason: "対面で相手の反応に合わせて瞬時に対応を変える芸当は、依存気質の人ほど上手い職人芸" }
      ],
      strengthInWeakness: "『愛情確認を連打する癖』は、密度の高いコミュニケーションを苦にしない体力でもあります。1日100件の顧客対応を疲弊せずこなせるのは、人との接触そのものがエネルギー源だからです。",
      futureHint: "30代以降、あなたが『自分が反応されたい』から『相手が反応したくなる場を作る』側に回ると、コミュニティビルダーとして独自のポジションを築けます。ファンの心を熟知した『界隈の主』になる未来があります。",
      actionAdvice: "今日、誰かに『反応してください』と求める前に、相手の最近の投稿に1つだけ深いコメントをする。反応を奪う側から、反応を生む側に立つ最初の一歩です。"
    },

    "エモさ渇望インフルエンサー予備軍": {
      hiddenTalent: "ありふれた日常を物語に変える編集眼。感情を映像・言葉・空気感として他人に届ける、生まれつきのストーリーテラー資質です。",
      whyThisFits: "『平凡な日常までドラマ化する癖』は、世界を物語として見る目を持っているという証拠。ただの通勤風景が映画のワンシーンに見える人は実はごく少数で、その感性は鍛えても身につかない天性のものです。エモさへの渇望は、表現者になるべき魂の合図と言えます。",
      idealJobs: [
        { name: "コンテンツクリエイター・YouTuber・ポッドキャスター", reason: "日常を物語化する力は、長尺コンテンツで継続的にファンを掴む最大の武器" },
        { name: "ライター・脚本家・コピーライター", reason: "感情を言葉に変換する才能は、商業的な文章仕事すべての中核スキル" },
        { name: "映像・写真クリエイター・ディレクター", reason: "場の雰囲気や被写体の感情を切り取る感覚は、ビジュアル表現職の根幹そのもの" }
      ],
      strengthInWeakness: "『共感されない寂しさ』は、共感を作り出すことへの探求心の源です。一度でも『これは伝わった』と感じた瞬間の喜びは、他のどんな仕事の成功体験よりも深く、あなたを表現者として強くします。",
      futureHint: "5年後、あなたが『バズりたい』をやめて『一人の誰かの心に刺さる作品を作る』に切り替えると、皮肉なことにそこから本物のファンが育ち始めます。狭く深いコミュニティの中心人物として開花する未来です。",
      actionAdvice: "次の投稿で『映え』を捨て、わざと地味な瞬間を切り取ってみる。装飾を抜いた時に残るあなたの感性が、本当の代表作の入り口です。"
    },

    // ===== 高承認×内向 =====

    "かまってちゃん型ポメラニアン": {
      hiddenTalent: "人の小さな変化に気づく観察眼と、警戒心を解いて懐に入る愛嬌。誰かに『そばにいてほしい』と思わせる稀有な魅力です。",
      whyThisFits: "『見捨てられそうな不安』をずっと抱えてきたあなたは、相手の機嫌・関心の度合いを微細に読み取る訓練を無意識に積んでいます。その能力を『構ってもらう側』ではなく『構ってあげる側』に向けた瞬間、誰よりも温かい人として人気者になります。",
      idealJobs: [
        { name: "保育・福祉・介護関連職", reason: "懐に入る愛嬌と、相手の小さな変化に気づく観察眼は、ケアの現場で唯一無二の存在感を生む" },
        { name: "ペット関連職（トリマー、ペットケア、動物福祉）", reason: "言葉のない相手の感情を読み取り愛情を注ぐ仕事は、あなたの本能と完璧に一致する天職" },
        { name: "秘書・サポート職・パーソナルアシスタント", reason: "上司の表情から先回りして必要なものを察する能力は、優秀な秘書の核となる才能" }
      ],
      strengthInWeakness: "『遠回しに構ってサインを出す癖』は、相手の心理を察する繊細さの裏返しです。直接的に要求できない不器用さは、相手の負担を減らしたいという本来の優しさから来ていて、ケア職では強みに反転します。",
      futureHint: "30代以降、あなたが『誰かに構われたい』から『誰かを構うのが楽しい』に重心移動すると、人が自然と集まる存在になります。ペットを飼う、後輩を持つ、コミュニティを作る—どれも才能開花のトリガーです。",
      actionAdvice: "今日、あなたが構ってほしいと感じた瞬間に、逆に身近な誰かの小さな変化を一つ拾って言葉にしてみる。『最近髪切った？』だけでも、関係の方向が反転します。"
    },

    "見守られ待ちピヨちゃん": {
      hiddenTalent: "弱さや初心者性を許容する包容力と、自分自身が安心できる場所を周囲に伝染させる空気作りの才能です。",
      whyThisFits: "『見守られたい』と願ってきたあなたは、見守られる側の気持ちを誰よりも理解しています。だからこそ、人を見守る側に回ったとき、相手が萎縮せず安心できる空気を自然に作れる。教育・育成の現場で最も価値が出るタイプです。",
      idealJobs: [
        { name: "教育・スクール運営・チューター", reason: "初心者の戸惑いや不安に共鳴できる感性は、生徒が辞めない教室を作るうえで決定的な武器" },
        { name: "児童系職（学童指導員、児童相談、子ども向けプログラム企画）", reason: "子どもの『見守ってほしい』に共鳴し、否定せず受け止める姿勢は、その仕事の本質そのもの" },
        { name: "コミュニティ設計・オンラインサロン運営", reason: "新参者が安心して発言できる場を作る能力は、コミュニティの寿命を決定づける重要スキル" }
      ],
      strengthInWeakness: "『見守られないと動けない』内気さは、衝動的に動かず慎重に観察する慎み深さでもあります。リスクの大きい仕事を任せても、勝手に暴走せず周囲と歩調を合わせるので、組織が長期的に信頼を寄せるタイプです。",
      futureHint: "5年後、あなたが『見守ってくれる人を探す』のをやめて『見守られる側の気持ちを知り尽くしたケア提供者』として独立すると、人柄で選ばれるロングセラー職人になれます。",
      actionAdvice: "今週、自分より初心者の人を一人見つけて、評価せず話を聞いてみる。あなたが欲しかった『見守る空気』を提供する側になる、最初の練習です。"
    },

    "怯える甘えん坊トイプー": {
      hiddenTalent: "危険・違和感をいち早く察知するリスクセンサーと、安心できる関係を慎重に育てる粘り強さ。慎重派の天才肌です。",
      whyThisFits: "『見捨てられたらどうしよう』『間違えたらどうしよう』という不安が常時稼働しているあなたの脳は、リスク検出器として極めて高性能です。普通の人が見落とす微細な異変—契約書の不備、対人関係の不穏、市場の変化—を真っ先に察知できる。この能力はコストを下げ命を救う、最も実利的な才能です。",
      idealJobs: [
        { name: "リスク管理・コンプライアンス・内部監査", reason: "『最悪のシナリオ』を本能的にシミュレーションする思考は、リスク職で重宝される稀有な気質" },
        { name: "医療事務・看護補助・薬剤師補助", reason: "ミスが許されない領域で、複数のチェックを苦にせず慎重に進められる気質は、医療現場の安全網そのもの" },
        { name: "カウンセリング助手・心理職サポート", reason: "不安を抱える人の気持ちが手に取るように分かるあなたは、相談者の安心を作る最初の役として理想的" }
      ],
      strengthInWeakness: "『怯える』性質は、本気で物事を考える人にしか出ない反応です。鈍感な人はリスクを軽く見て大事故を起こしますが、あなたは小さく失敗して致命傷を避けるタイプ。長期的にはあなたの方が必ず生き残ります。",
      futureHint: "40代以降、あなたの慎重さは『信頼の貯金』として複利で効いてきます。若い頃は『心配性』と言われたものが、ある日『慎重で間違いがない人』と評価が反転する瞬間が必ず来ます。",
      actionAdvice: "次に不安を感じた時、それを抑え込まずに『これは何のリスクを察知しているのか』と書き出してみる。あなたの直感が言語化された瞬間、それは立派なリスク分析になります。"
    },

    "要領のいい保身コアラ": {
      hiddenTalent: "全体構造を瞬時に俯瞰し、最小の労力で最大の成果を得るルートを発見する戦略眼。エネルギー配分の天才です。",
      whyThisFits: "『余計な戦いを避ける』本能は、戦略思考の原型です。普通の人が感情で消耗する局面で、あなたは『この戦いは勝ってもメリットが小さい』と冷静に判断できる。この能力は、ビジネスの世界で最も希少で、最も高い報酬が支払われる種類のものです。",
      idealJobs: [
        { name: "経営企画・事業企画", reason: "全体最適とリソース配分を見極める能力は、経営に最も近い職種の中核スキル" },
        { name: "戦略コンサルタント・経営アドバイザー", reason: "クライアントが見えていない『戦わなくていい戦場』を提示する仕事は、保身思考の正統な進化形" },
        { name: "プロジェクトマネージャー・PMO", reason: "炎上する案件を未然に防ぎ、波風を立てずに納期を守る職人芸はあなたの本領発揮の舞台" }
      ],
      strengthInWeakness: "『要領がいい』ことは、若い頃は『ずるい』と批判されがちですが、30代以降は『判断力がある人』と評価が完全に反転します。エネルギーを温存することは、長期戦を制する者の必須スキルです。",
      futureHint: "5年後、あなたが『保身』と呼んでいたものを『リソース管理』と呼び替えた瞬間、自分の戦略眼に自信を持てるようになります。経営層・マネジメント層への昇進が見える年代です。",
      actionAdvice: "次に『これは戦わなくていい』と感じた時、それを罪悪感ではなく戦略として言語化してみる。『今これは優先度が低い』と一度書き出すだけで、判断の質が見えるようになります。"
    },

    // ===== 低承認×外向 =====

    "ドヤ顔クリエイティブ孔雀": {
      hiddenTalent: "『これは美しい』『これはダサい』を瞬時に判定する審美眼と、自分の美意識を最後まで通し切る完成までの執念。",
      whyThisFits: "『ドヤ顔』の根底にあるのは、自分の美的判断への揺るがぬ確信です。承認を求めない外向タイプであるあなたは、他人の評価で美意識をブレさせない。クリエイティブ業界で最も重要な『折れない感性』を、生まれつき持っている数少ない人です。",
      idealJobs: [
        { name: "アートディレクター・クリエイティブディレクター", reason: "複数案件の美的水準を一人で背負う仕事は、自分の美意識を信じきれる人にしか務まらない究極の表現職" },
        { name: "デザイナー（グラフィック・プロダクト・空間）", reason: "細部のミリ単位にこだわり続けられる職人気質は、デザイン職の生命線そのもの" },
        { name: "工芸職人・クラフトマン（陶芸、木工、革製品など）", reason: "完成まで一人で粘れる力と美的基準の高さは、現代に残る数少ない職人世界で輝く資質" }
      ],
      strengthInWeakness: "『ドヤ顔』は嫌われる一方で、それなしに高水準の作品は生まれません。妥協を許せないあなたの傲慢さは、凡庸を量産しない品質ガードであり、ブランドの寿命を伸ばす要素です。",
      futureHint: "30代後半、あなたの作品が『分かる人には分かる』ものとして評価され始める頃、急にファンができ始めます。万人受けではなく、深いファンに長く支持される作家として認められる未来です。",
      actionAdvice: "今週、自分の作品を一つ『これでも私の代表作とは言えないが、好きな人には刺さる』と添えて発表してみる。プライドの一部を捨てた瞬間、本当のファンが現れます。"
    },

    "我道突っ走りハリネズミ": {
      hiddenTalent: "周囲のノイズに流されない圧倒的な集中力と、誰も走らない道を最後まで走り切る粘り。フロンティアを開拓する才能です。",
      whyThisFits: "群れない・流されない性質は、現代日本では『協調性がない』と扱われがちですが、ニッチ領域では『誰も真似できない人』として希少価値が爆発的に高まります。みんなと違う方向に走ることを楽しめるあなたは、ブルーオーシャンを発見する数少ないタイプです。",
      idealJobs: [
        { name: "研究職（基礎研究、特殊分野の専門研究）", reason: "成果が出るまで何年もかかる地味な作業を孤独に続けられる気質は、研究世界の絶対条件" },
        { name: "一人起業・個人事業主（フリーランス）", reason: "上司や同僚の評価を必要としない自立性は、独立経営の精神的な前提そのもの" },
        { name: "ニッチ専門職（特殊翻訳、レアスキル系コンサル、特定領域のライター）", reason: "競合のいない狭い領域を深く掘る働き方は、群れない気質の正統な進化形" }
      ],
      strengthInWeakness: "『独りよがり』『協調性がない』と言われがちな性質は、外部の流行や評価に振り回されない強靭な軸を意味します。SNS時代に最も希少な資質です。",
      futureHint: "5年後、あなたが選んだニッチ領域が突然世間の注目を集めるか、あるいは静かに『あの分野ならあの人』と業界内で第一人者になっています。どちらの未来も独走の果てにあります。",
      actionAdvice: "次に『みんなと違う』と感じた時、それを修正するのではなく、なぜそう感じるかを記録に残す。3年後、その違和感の積み重ねがあなたの専門性の核になります。"
    },

    "無自覚マニアックオオカミ": {
      hiddenTalent: "一つのテーマを底まで掘る尋常でない深さと、評価を求めずに何年も続けられる継続力。本物の専門性で食べていける才能の核です。",
      whyThisFits: "『無自覚』であるということは、好きで続けているという証拠です。承認のために掘り下げている人は3年で飽きますが、あなたは10年掘り続けても飽きない。AI時代に最も希少な『深い専門知識を持つ人間』の素質が、生まれつき備わっています。",
      idealJobs: [
        { name: "研究者・エンジニア専門家・技術スペシャリスト", reason: "一つの技術を10年掘り続けられる気質は、シニアエンジニアや研究者の到達点そのもの" },
        { name: "専門ライター・編集者・技術評論家", reason: "マニアックな知識を持つ人が、それを言語化して食べていく道。あなたの深さがそのまま商品になる" },
        { name: "ニッチ領域のコンサルタント（技術顧問、特定産業の助言者）", reason: "他の人が手を出さない深さに到達しているだけで、業界唯一の助言者ポジションが手に入る" }
      ],
      strengthInWeakness: "『他人に通じない話ばかりする』性質は、専門コミュニティに入った瞬間に『この人は本物だ』と尊敬される唯一無二の武器に変わります。一般受けを諦めると逆に強くなる稀有なタイプです。",
      futureHint: "30代後半、あなたの蓄積が『その分野ならあの人』として業界内で名前で呼ばれるようになります。表舞台ではなく、業界の専門家層に深く食い込む第一人者への道です。",
      actionAdvice: "今週、あなたが当たり前と思っている知識を一つ、初心者向けに丁寧に書き出してみる。あなたにとっての常識は、世間にとっての貴重な資産です。"
    },

    "合理的ルールポリス柴犬": {
      hiddenTalent: "曖昧なものを構造化し、再現可能な仕組みに変える力。混沌を秩序に翻訳する、組織を成熟させる職人技です。",
      whyThisFits: "『正しさ』へのこだわりは、本質的には『再現可能な良さ』を求める気質です。属人的にしか動かない業務、その場しのぎの判断、繰り返されるミス—あなたはこれらが許せない。だからこそ、誰がやっても同じ品質が出る仕組みを作れる、組織にとって極めて貴重な人材です。",
      idealJobs: [
        { name: "システム設計・業務システムアナリスト", reason: "曖昧な業務要件を明確なシステム要件に翻訳する仕事は、ルール志向の正統な活用先" },
        { name: "業務改善・オペレーションマネージャー", reason: "属人化した業務を仕組み化し、誰でも回せる状態にする仕事はあなたの天職と言える領域" },
        { name: "監査・品質管理・ISO担当", reason: "ルールを設計し、それを組織に定着させる役割は、あなたの基準の高さが価値に直結する" }
      ],
      strengthInWeakness: "『細かい』『融通が利かない』と言われる性質は、コトの本質を見抜く正確さの裏返しです。短期的には煙たがられても、長期的にはあなたが作った仕組みが組織を支える基盤になります。",
      futureHint: "40代、あなたが作ってきた仕組みやマニュアルが、後輩たちの仕事の土台になっていることに気づきます。地味で目立たないが、組織が回り続ける本当の理由として尊敬される未来です。",
      actionAdvice: "今週、現場の小さな『なんとなくやっている作業』を一つ選んで、手順を書き出してみる。書き出した瞬間、それはあなたが作った『資産』になります。"
    },

    // ===== 低承認×内向 =====

    "殻にこもる自律カタツムリ": {
      hiddenTalent: "一人で深く考え抜く力と、外圧に左右されず自分のペースを守る自立性。長距離思考が必要な仕事で発揮される才能です。",
      whyThisFits: "『殻にこもる』ことは、世間では弱さと扱われがちですが、実は『自分の頭で考える時間を確保する』高度な自己管理術です。SNSと会議に時間を奪われ続ける現代において、深い思考の時間を意識的に持てる人は極端に少なく、その能力は希少資源です。",
      idealJobs: [
        { name: "研究・学術職・シンクタンク研究員", reason: "一人で長時間思考し続けられる気質は、学術的な深さを生み出す絶対条件" },
        { name: "ソフトウェアエンジニア・プログラマー（特にバックエンド／個人開発）", reason: "対面コミュニケーションを最小化し、自分の頭脳と画面に集中する仕事はあなたのために存在する" },
        { name: "ライター・翻訳家・編集者", reason: "他人の言葉やテキストと長時間向き合える集中力は、文字仕事の根幹となるスキル" }
      ],
      strengthInWeakness: "『付き合いが悪い』『コミュニケーションを取らない』と言われる性質は、本質的には『質の低い人間関係に時間を浪費しない』選別眼です。狭く深い人間関係の方が長期的に充実するという真理を、本能的に知っているタイプです。",
      futureHint: "5年後、あなたが在宅勤務・個人事業など『一人で集中できる働き方』を選んでいる確率は非常に高い。そして、その選択をした人ほど30代以降の成果が伸びる時代に、あなたは適応した働き方をしています。",
      actionAdvice: "今週、誰にも見せない『一人で考えるノート』を作ってみる。SNSに出す前のあなたの思考の純度が、5年後の差を生む源泉になります。"
    },

    "孤高のパステル黒猫": {
      hiddenTalent: "美意識と品質基準の高さ、そして空気・雰囲気・世界観を作るセンス。ブランドや作品の『格』を決める感覚的判断力です。",
      whyThisFits: "『孤高』であろうとする性質は、安易な共感に身を寄せないことで、自分の感性を保護してきた証です。SNSの流行に染まらず、自分の色を保てる稀有な人。だからこそ、世界観を作る仕事—それは均質化した時代に最も価値が出るスキル—で本領を発揮できます。",
      idealJobs: [
        { name: "ブランディング・ブランドマネージャー", reason: "ブランドの世界観を守るという仕事は、妥協しない美意識を持つ人にしか務まらない" },
        { name: "インテリアデザイナー・空間プロデューサー", reason: "空気感や雰囲気を可視化する仕事は、感覚で『これは違う』と判定できる人の専売特許" },
        { name: "編集者・キュレーター（雑誌、ギャラリー、ECセレクト）", reason: "良いものだけを選び抜く目利き力は、情報過多の時代に最も価値が上がっている希少スキル" }
      ],
      strengthInWeakness: "『気取っている』『近寄りがたい』と言われる性質は、誰にでも媚びない品格の現れです。安売りしない佇まいは、長期的にブランド価値を高め、本物の人だけを引き寄せる磁場になります。",
      futureHint: "30代後半、あなたが選んだ世界観や生き方が『センスがいい』と評価され始め、それを参考にしたい人が周りに集まり始めます。模倣されないオリジナリティを持つ人として、独自のポジションに着地します。",
      actionAdvice: "今週、SNSで一つだけ『これは私の好み』と明言した発信をしてみる。万人受けを諦めた瞬間、あなたを真に理解する人が見つかり始めます。"
    },

    "マイペースな引きこもりパンダ": {
      hiddenTalent: "ストレス耐性の高さと、長期戦に淡々と耐え続ける持久力。燃え尽きずに10年走り続けられる、稀有な持続力の才能です。",
      whyThisFits: "『マイペース』を貫けるということは、外的プレッシャーに自我が削られない強さを持っているという証拠です。短距離で爆発する人は多いが、長距離を一定のペースで走り続けられる人は極端に少ない。あなたは安定的に成果を積み重ねる、組織にとって最も信頼できるタイプです。",
      idealJobs: [
        { name: "バックオフィス専門職（経理、人事、総務、法務）", reason: "派手さはないが、安定的に質の高い処理を続けられる気質は、バックオフィスの心臓部に最も求められる資質" },
        { name: "在宅エンジニア・在宅ライター・リモートワーカー", reason: "自宅という低ストレス環境で淡々と高品質な仕事を続けられる気質は、リモート時代の最強プロフィール" },
        { name: "専門技術職（薬剤師、放射線技師、専門事務、保守メンテナンス）", reason: "正確さと持続力が物を言う職人的な専門職は、燃え尽きないあなたの長期キャリアに最適" }
      ],
      strengthInWeakness: "『やる気がなさそう』『熱量が低い』と言われる性質は、燃え尽き症候群と無縁である最強の体質です。同期が次々と疲弊して辞めていく中で、淡々と居続けるだけで気づけば希少な存在になっています。",
      futureHint: "40代以降、あなたの周囲では『あの人だけずっと変わらない』『信頼できる』と評価が定着し始めます。派手なキャリアアップではなく、長期的な信頼の累積で価値を上げる、晩成型の成功パターンです。",
      actionAdvice: "今週、自分のペースを乱す何か（無駄な会議、無理な納期、感情の起伏が激しい人）から、一つだけ距離を取ってみる。マイペースを守ることはサボりではなく、長距離走の必須スキルです。"
    },

    "頑固なマイキャラ黒豚": {
      hiddenTalent: "譲らない芯と一貫性。長期的にブレない『キャラクター』を保ち続けられる、個人ブランド時代に最も価値のある才能です。",
      whyThisFits: "『頑固』は協調性のなさと扱われがちですが、SNS時代においては『替えのきかない個性』という最高の資産です。流行に合わせてキャラを変える人は使い捨てられますが、ブレない人は『この人ならこう言う』と信頼される。あなたは個人ブランドが資産化する時代に完璧に適応しています。",
      idealJobs: [
        { name: "個人ブランド系（インフルエンサー、コラムニスト、評論家）", reason: "ブレない発言一貫性は、フォロワーが長期的に信頼を寄せる個人ブランドの絶対条件" },
        { name: "職人・アーティスト（陶芸、革職人、漆器、アート系作家）", reason: "自分の作風を10年・20年守り続けられる気質は、職人世界で唯一信用される資質" },
        { name: "専門家として独立（士業、コーチ、講師、特定領域のコンサル）", reason: "『この人はこう考える』が明確であるほど指名で仕事が来る独立業界に、あなたの頑固さは最大の武器" }
      ],
      strengthInWeakness: "『融通が利かない』『面倒くさい人』と言われる性質は、迎合しない芯を持っている証拠です。組織内では摩擦を生むこともありますが、独立してフリーになった瞬間、その芯こそが顧客から選ばれる理由に反転します。",
      futureHint: "30代後半から40代、あなたの『変わらなさ』が周囲から信頼の源泉として評価され始めます。組織人としてではなく、一個人として名前で仕事を受けるフェーズに入ったとき、本当の開花が始まります。",
      actionAdvice: "次に『これは譲れない』と感じた時、それを我慢せず、論理的に理由を説明してみる。頑固さを言語化できれば、それは哲学になり、あなたの個人ブランドの核になります。"
    }
  },

  en: {
    // ===== High Approval × Extrovert =====

    "マウンティング突撃ライオン": {
      hiddenTalent: "Explosive first-mover energy. You can take the first uncomfortable step that everyone else hesitates over—a rare ignition-switch talent that makes stalled situations start moving.",
      whyThisFits: "The 'I have to be on top' drive you've always had is, underneath, a craving to move things, to refuse stagnation. The moment you redirect that energy from 'out-ranking others' to 'taking the first real risk no one else will,' you become the single most valuable person in any organization—the one who actually starts things.",
      idealJobs: [
        { name: "New business development, startup founder", reason: "The willingness to charge at established order is the rarest fuel for 0-to-1 phases, where most people freeze" },
        { name: "Sales leadership, business development", reason: "In worlds where outcomes are scored in numbers, your 'I refuse to lose' wiring becomes a direct revenue engine" },
        { name: "Event producer, live host", reason: "Commanding a room, pulling people in, owning attention—stage-adjacent work is where your presence becomes an asset rather than a liability" }
      ],
      strengthInWeakness: "Your 'fear of losing' is what keeps you from drifting through ordinary days. In a stable corporate job it might suffocate you, but put you in any environment with clear scoreboards and the same trait becomes the engine other people can't match.",
      futureHint: "Past 35, when your dominance pivots into 'I teach' instead of 'I outrank,' you suddenly become magnetic. Mentor, coach, founder—the same instinct that read as aggression in your 20s reads as authority by your 40s.",
      actionAdvice: "In the next meeting, try saying 'I'll take responsibility for it' instead of 'I'll do it.' One small word swap is the entire difference between flexing and leading."
    },

    "手柄泥棒アピールオウム": {
      hiddenTalent: "A translator's ear for what's quietly impressive. You can take work that nobody noticed and put it into words that suddenly make everyone see its value—a born communications and PR talent.",
      whyThisFits: "Behind the urge to claim credit lives a sharper instinct: spotting the thing nobody else has framed yet. Redirect that talent from 'making this look like mine' to 'making this hidden work visible,' and you become the most trusted PR voice in any team—the person whose endorsement actually moves things.",
      idealJobs: [
        { name: "Public relations, communications, internal comms", reason: "Amplifying other people's achievements is the ethical, lucrative outlet for your spotlight instinct" },
        { name: "Marketing strategist, copywriter", reason: "Spotting overlooked value and turning it into language that lands—this is literally your wiring as a marketable skill" },
        { name: "Keynote speaker, trainer, course instructor", reason: "You light up when you have the room; teaching and speaking turn that hunger into a paid profession" }
      ],
      strengthInWeakness: "The 'fear of being overlooked' tunes your antenna to who's craving attention and who's being shut out. That makes you a quiet expert on group dynamics—the person who can read political weather faster than anyone else in the room.",
      futureHint: "Five years from now, when you stop selling yourself and start selling others, people start gathering around you. Promoter, agent, producer—the careers where your gift literally pays you to make other people famous.",
      actionAdvice: "This week, publicly name something someone else did well—out loud, in front of others, without making it about you. The moment you hand over credit on purpose is the moment people start trusting you with bigger things."
    },

    "依存型バズりチワワ": {
      hiddenTalent: "Millisecond-level sensitivity to other people's emotional temperature. You catch the smallest shifts in tone, response time, facial expression—a high-precision sensor that AI cannot replicate.",
      whyThisFits: "Your anxiety when replies slow down is, mechanically, evidence that you have an unusually fine antenna for human feedback signals. Most people miss the early signs that someone is pulling away; you feel them in real time. That's not a flaw—it's a professionally valuable instrument once it's pointed at the right work.",
      idealJobs: [
        { name: "Social media manager, community manager", reason: "Sensing community vibe shifts and engagement decay before the data confirms it—this is a gut-level skill that great community managers live on" },
        { name: "Customer success, customer support, retention specialist", reason: "Detecting churn signals one conversation before they happen and saving the relationship—this is precisely what your nervous system already does naturally" },
        { name: "Front-of-house sales, hospitality, premium retail", reason: "Reading a customer's mood mid-interaction and adjusting your approach instantly is a craft you already practice unconsciously" }
      ],
      strengthInWeakness: "The 'reassurance-checking spam' habit also means you have stamina for high-density human contact. You're the type who can handle a hundred customer touches a day without burning out, because human connection isn't draining—it's your fuel.",
      futureHint: "Past 30, when you shift from 'I want to be the one reacted to' into 'I design spaces where others want to react,' you become a community builder. The deep insider who knows exactly what makes a fanbase stay, leaves loyal followers in their wake.",
      actionAdvice: "Today, before asking anyone for a reaction, leave one substantive comment on someone else's recent post. Become the source of attention before you ask for it back."
    },

    "エモさ渇望インフルエンサー予備軍": {
      hiddenTalent: "An editor's eye that sees the ordinary as a story. You can take a mundane morning commute and find the cinematic frame inside it—a native storyteller's instinct that can't be trained from scratch.",
      whyThisFits: "Most people see a Tuesday. You see a scene. That instinct to dramatize even the quietest day is proof you process reality as narrative—which is the exact wiring every successful writer, filmmaker, and content creator depends on. Your 'craving for feels' is the craving of a born narrator who hasn't yet found their format.",
      idealJobs: [
        { name: "Content creator, YouTuber, podcaster", reason: "Long-form formats reward your specific gift: turning daily life into something a stranger wants to stay for" },
        { name: "Writer, screenwriter, copywriter", reason: "Converting feelings into words others recognize is the single core skill behind every commercial writing job worth having" },
        { name: "Photographer, video director, visual storyteller", reason: "Catching a room's atmosphere and a subject's emotion in a single frame is exactly your perceptual habit, now monetized" }
      ],
      strengthInWeakness: "The 'loneliness when nobody mirrors your feelings' is the engine that pushes you to make the mirroring happen. The first time a piece of your work makes a stranger cry, that hit is more addictive than any like count—and it pulls you into making real work.",
      futureHint: "Five years from now, when you abandon 'going viral' and start writing for exactly one person who would understand, real fans show up. Not millions—hundreds, deep. A small, loyal audience that treats you as essential.",
      actionAdvice: "On your next post, kill the aesthetic on purpose. Show the unedited, mundane moment. The version of you that survives without filters is where your strongest work begins."
    },

    // ===== High Approval × Introvert =====

    "かまってちゃん型ポメラニアン": {
      hiddenTalent: "A sharp eye for tiny changes in other people, paired with the rare ability to disarm them with warmth. You make people want to be near you—a magnetism that great caregivers and personal assistants live on.",
      whyThisFits: "Years of the 'will they leave me?' anxiety have trained your nervous system to read other people's mood, attention, and interest at a microscopic level. The moment you redirect that attention-radar from 'am I being noticed?' to 'who needs noticing?'—you flip from clingy to indispensable. Same skill, opposite direction.",
      idealJobs: [
        { name: "Early childhood education, eldercare, social work", reason: "Your warmth and your reflex to track other people's small shifts are exactly what care work pays for and burns through people who don't have them" },
        { name: "Pet care, animal welfare, veterinary support", reason: "Reading non-verbal beings and pouring affection into them is your native wiring; this is a calling, not just a job" },
        { name: "Executive assistant, personal assistant, concierge", reason: "Reading your principal's face and anticipating their next need before they voice it is the entire skill of an excellent EA—and you already do it instinctively" }
      ],
      strengthInWeakness: "Your habit of hinting for attention instead of asking directly comes from a real sensitivity—you don't want to burden anyone. That same restraint, in caregiving contexts, makes you the rare helper who never imposes, who calibrates exactly to what the other person can receive.",
      futureHint: "Past 30, your center of gravity shifts: you stop asking 'will they notice me' and start enjoying 'I notice them.' Adopt a pet, mentor a junior, build a small community—any one of these becomes the trigger that ignites your real talent.",
      actionAdvice: "Today, the moment you feel the urge to be noticed, pivot: notice someone else's small change instead. 'Did you cut your hair?' or 'You seem tired today'—one observation, voiced. The whole direction of your relationships flips on that one sentence."
    },

    "見守られ待ちピヨちゃん": {
      hiddenTalent: "A safe-space-creator's gift. You make weakness and beginnerhood feel okay around you, and that quiet permission radiates outward—people relax simply because you're in the room.",
      whyThisFits: "Having spent years wishing someone would watch over you, you understand the inside of that wish more deeply than anyone. When you become the watcher instead, your awareness of the beginner's fear is so vivid that no one near you ever feels small. This is the foundational skill of every great teacher and every coach who actually grows people.",
      idealJobs: [
        { name: "Teacher, tutor, learning coach", reason: "Tuning into a learner's hesitation and not making them feel stupid for it is what separates classrooms students return to from ones they quit" },
        { name: "Children's services, after-school programs, family support", reason: "Children spot the adult who's actually safe; you read as that adult from the first interaction" },
        { name: "Community designer, online forum or membership host", reason: "Building a place where newcomers feel they can post their first dumb question is the single hardest skill in community design—and you have it naturally" }
      ],
      strengthInWeakness: "Your 'can't move without someone watching' shyness is, in adult work, a sober quality: you don't act impulsively, you wait, you observe, you check. Organizations learn to trust you precisely because you don't run ahead and break things.",
      futureHint: "Five years from now, when you stop searching for someone to watch over you and become known as the person who watches over others—gentle, attentive, never patronizing—you build a long-lived career on word-of-mouth alone. Students, clients, mentees stay for years.",
      actionAdvice: "This week, find someone newer than you at something—anything—and just listen, without grading. The supportive atmosphere you always wanted? Practice being its source."
    },

    "怯える甘えん坊トイプー": {
      hiddenTalent: "An always-on risk sensor and the patient ability to build trust slowly. You're the rare person who actually notices the small wrong note before everything goes sideways.",
      whyThisFits: "Your constantly-running 'what if this goes wrong?' anxiety is, mechanically, a precision-tuned risk detector. Most people miss subtle contract red flags, interpersonal warning signs, market shifts. You feel them instantly. This is the most economically valuable form of anxiety—the kind that prevents disasters and saves lives.",
      idealJobs: [
        { name: "Risk management, compliance, internal audit", reason: "Instinctively simulating the worst-case scenario is the foundational habit of every senior risk professional" },
        { name: "Medical support roles (nursing assistant, pharmacy tech, clinical admin)", reason: "Multi-checking in zero-error environments isn't draining for you—it's normal. That makes you the safety layer organizations actually depend on" },
        { name: "Counseling support, clinical intake, peer-support coordinator", reason: "Anxious people can feel that you understand the inside of fear; this is irreplaceable in any role helping others through hard feelings" }
      ],
      strengthInWeakness: "Being 'afraid all the time' is, paradoxically, evidence that you actually take things seriously. Tone-deaf people miss risks and cause catastrophes. You fail small and avoid the fatal blow. Across a long career, you outlive them by a wide margin.",
      futureHint: "Past 40, your caution compounds into trust capital. The 'worrier' of your 20s becomes, almost overnight, the 'reliable person who never misses things' of your 40s—and that reputation is one of the most lucrative in any industry.",
      actionAdvice: "The next time anxiety spikes, don't suppress it—write down what specific risk it's detecting. The moment your gut feeling becomes language, it stops being neurosis and starts being analysis."
    },

    "要領のいい保身コアラ": {
      hiddenTalent: "An instinct for spotting the entire system at a glance and finding the lowest-effort path to the highest payoff. Energy allocation as a native talent—the foundation of strategic thinking.",
      whyThisFits: "Your reflex to avoid unnecessary fights is, structurally, the seed of strategic thinking. Where ordinary people get emotionally consumed by every battle, you calmly recognize 'winning this costs more than the prize.' That clarity is the rarest and most highly-compensated cognitive habit in the business world.",
      idealJobs: [
        { name: "Corporate strategy, business planning", reason: "Seeing the whole board and allocating resources for net win is the entire game of corporate strategy work" },
        { name: "Management consultant, strategic advisor", reason: "Telling clients which battles they shouldn't even be fighting is the most valuable form of consulting—and it maps directly onto your wiring" },
        { name: "Project manager, PMO, program lead", reason: "Quietly preventing predictable disasters and keeping projects on time without drama is high-end PM work—your home turf" }
      ],
      strengthInWeakness: "Being called 'calculating' in your 20s flips to 'has good judgment' in your 30s. Conserving energy is the underlying skill of anyone who wins long campaigns—it just looks bad until people figure that out.",
      futureHint: "Five years from now, when you stop calling it 'self-protection' and start calling it 'resource management,' you finally believe in your own strategic mind. That self-trust unlocks the promotion to leadership you've been quietly avoiding.",
      actionAdvice: "Next time you sense 'this isn't worth fighting,' don't feel guilty—name it as strategy. Write 'this is low priority right now' once, and the quality of your judgment becomes visible to you for the first time."
    },

    // ===== Low Approval × Extrovert =====

    "ドヤ顔クリエイティブ孔雀": {
      hiddenTalent: "A snap-judgment aesthetic sense—'this is beautiful, this is ugly'—paired with the stubbornness to carry a creative vision through to finished form. The eye plus the follow-through, which almost no one has together.",
      whyThisFits: "Beneath the showy posture is something rarer: an unshakable confidence in your own aesthetic judgment. You don't bend your taste to fit the trending. In creative industries, the single hardest skill to find is exactly this—someone who won't dilute the vision under pressure. You were born with it.",
      idealJobs: [
        { name: "Art director, creative director", reason: "Carrying the aesthetic standard for multiple projects simultaneously requires someone who can trust their own eye under deadline pressure—that's you" },
        { name: "Designer (graphic, product, interior, fashion)", reason: "Obsessing over millimeter-level details across an entire piece is the difference between mediocre and signature design work" },
        { name: "Craftsperson, artisan (ceramics, leather, woodwork, jewelry)", reason: "The patience to finish alone, plus uncompromising standards, is exactly the disposition required for the small artisan careers that still survive in 2026" }
      ],
      strengthInWeakness: "The 'smugness' people complain about is, functionally, a quality guard. People with no swagger about their taste produce mediocre work for fear of opinion. Your refusal to settle is the reason your best work is good—it's not a flaw, it's the engine.",
      futureHint: "By your late 30s, your work earns the label 'not for everyone, but loved by the people who get it.' At that point real fans begin appearing. You're built for the long, deep, niche following—not the mass following—and that's a much better business by your 40s.",
      actionAdvice: "Publish one piece this week with a note: 'I know this isn't my crowd-pleaser, but the right person will get it.' The moment you put down the need for universal approval is the moment your true audience finds you."
    },

    "我道突っ走りハリネズミ": {
      hiddenTalent: "Bulletproof focus that doesn't bend to surrounding noise, and the endurance to keep running down a path no one else is on. A frontier-explorer's wiring.",
      whyThisFits: "Refusing to herd, refusing to drift with the crowd—these traits are penalized in Japanese corporate culture but rewarded in niche markets, where being the only person running in your direction makes you irreplaceable. You're built for blue oceans, not red ones, and the modern economy is increasingly built around finding blue oceans.",
      idealJobs: [
        { name: "Research scientist, deep-tech specialist, dedicated researcher", reason: "Lonely, multi-year, no-applause work is exactly what your nervous system tolerates better than 99% of people" },
        { name: "Solo founder, freelancer, indie creator", reason: "Not needing approval from a boss or colleagues is the psychological prerequisite for working alone—and you have it natively" },
        { name: "Niche specialist (rare translation, specialized consulting, deep-vertical writer)", reason: "Choosing a corner of the field where no one else lives, then mastering it, is the natural evolution of your refusal to follow trends" }
      ],
      strengthInWeakness: "'Loner' and 'uncooperative' in modern Japan are sometimes coded language for 'has an unshakable internal compass.' That compass is the single rarest cognitive resource of the social media era—everyone else is drifting on algorithmic currents.",
      futureHint: "Five years from now, either the niche you've been quietly walking suddenly becomes hot, or you're known inside your field as 'the person for that specific topic.' Both futures are at the end of the same long, solo run.",
      actionAdvice: "Next time you feel 'I don't agree with the room,' don't correct yourself—log it. Three years of those logs become the foundation of your expertise. The disagreements you notice are exactly your map."
    },

    "無自覚マニアックオオカミ": {
      hiddenTalent: "Unusual depth of focus on a single topic, and the ability to keep going without external validation. Real, deep expertise—the foundation of careers that actually pay in the AI era.",
      whyThisFits: "Being 'unaware' that your obsession is unusual is, in fact, the proof that you're doing it for the right reason. People who go deep for status burn out at year three. You'll still be there at year ten. In an era of AI generalists, deeply specialized humans are becoming the most expensive professionals on the market—and your wiring puts you there by default.",
      idealJobs: [
        { name: "Senior research engineer, technical specialist, principal-track expert", reason: "Sustaining a single technical thread for ten years is the literal definition of becoming a senior expert—your disposition matches the destination" },
        { name: "Specialist writer, technical editor, deep-domain reviewer", reason: "Turning your unusual depth of knowledge into long-form content and reference work is a stable career path that rewards exactly your traits" },
        { name: "Niche consultant, technical advisor, expert witness", reason: "Being the person in your country who knows a specific thing best is, alone, enough to build a consulting practice—and you're already accidentally on that road" }
      ],
      strengthInWeakness: "Being told 'you only talk about your weird thing' becomes, the moment you enter a specialist community, 'this person is the real deal.' Giving up on mass appeal makes you stronger, not weaker—a rare inversion that takes most people decades to find.",
      futureHint: "Late 30s: your accumulated depth means people in your field refer to you by name. Not famous—respected. The shift from anonymous worker to known expert in a vertical happens almost overnight when the cumulative work crosses a threshold.",
      actionAdvice: "This week, write down one thing you treat as obvious, in a beginner-friendly way. Your everyday knowledge is someone else's prized resource—you just don't know it yet."
    },

    "合理的ルールポリス柴犬": {
      hiddenTalent: "The ability to take ambiguous work and convert it into reproducible systems. You translate chaos into structure—the master craft of building organizations that scale.",
      whyThisFits: "Your insistence on 'the correct way' is fundamentally a search for 'a good way that can be repeated.' Work that only one person can do, decisions that depend on mood, errors that recur—these offend you. That offense is exactly what drives people to build systems, write documentation, design processes. You are the person organizations need to mature, even when they don't realize it.",
      idealJobs: [
        { name: "Systems analyst, business systems designer", reason: "Translating vague business needs into precise, executable specifications is the orthodox application of rule-loving thinking" },
        { name: "Operations manager, process improvement lead", reason: "Taking work that only happens because one person knows how, and turning it into work anyone can run, is your natural home" },
        { name: "Quality assurance, audit, ISO compliance", reason: "Designing rules and getting an organization to actually follow them rewards exactly your standards—and pays well in mature companies" }
      ],
      strengthInWeakness: "Being called 'rigid' or 'inflexible' is short-term cost; long-term, the systems you build become the bedrock everyone relies on. People who break rules are exciting for a quarter. People who build rules are essential for a decade.",
      futureHint: "Around 40, you'll notice that the SOPs and processes you authored have become how the company actually works. Quiet, unflashy, foundational—you become the kind of senior people trust because nothing breaks under your watch.",
      actionAdvice: "This week, pick one 'we just sort of do it this way' workflow and write the steps down. The moment you document it, it becomes an asset—and your asset, attributable to you."
    },

    // ===== Low Approval × Introvert =====

    "殻にこもる自律カタツムリ": {
      hiddenTalent: "The capacity to think alone, deeply, for long stretches, and the self-discipline to protect your own pace from external pressure. A long-form-thinking talent the modern attention economy is rapidly destroying in everyone else.",
      whyThisFits: "Withdrawing into your shell looks like weakness from outside, but it's actually a high form of self-management: you are protecting your own thinking time. Almost no one in 2026 can do this. Between meetings and notifications, the ability to sit alone with a hard problem for three hours is becoming a scarce economic resource—and you have it by default.",
      idealJobs: [
        { name: "Researcher, academic, think tank analyst", reason: "Sustained solo thinking is the entire engine of academic and intellectual depth; you're not avoiding the work, you're tuned for it" },
        { name: "Software engineer, programmer (especially backend or solo indie dev)", reason: "Minimizing face-to-face interaction and maximizing focus time with your own mind and a screen is a description of high-end engineering" },
        { name: "Writer, translator, editor", reason: "The patience to be alone with text for hours at a time is the foundational stamina of every text-based creative profession" }
      ],
      strengthInWeakness: "Being 'antisocial' or 'closed off' is, more accurately, refusing to spend time on low-quality social interaction. You instinctively know that two deep friends are worth more than fifty acquaintances—and the data on adult happiness backs this up across every study.",
      futureHint: "Five years from now, you're almost certainly on a remote-friendly or solo-work track. And it turns out: the people who chose that path are the ones quietly outpacing the ones stuck in offices. You're early to a structural shift.",
      actionAdvice: "Start a notebook this week that nobody will ever see. The purity of your thoughts before they're shaped for an audience is the source of any real long-term edge."
    },

    "孤高のパステル黒猫": {
      hiddenTalent: "Refined aesthetic standards and an instinct for atmosphere. You shape mood, world, and tone the way other people shape sentences—a curatorial sense that defines what 'class' means in any product or space.",
      whyThisFits: "Staying apart from easy emotional crowds has protected your taste from being averaged-out. You haven't been homogenized by the algorithm. In a market that's drowning in sameness, the rare person who still has a distinct, unbendable aesthetic becomes disproportionately valuable—luxury brands, premium media, and high-end services literally pay for what you naturally are.",
      idealJobs: [
        { name: "Brand strategist, brand manager", reason: "Guarding a brand's world from being cheapened or diluted is work that only people with non-negotiable taste can actually do" },
        { name: "Interior designer, spatial producer, set stylist", reason: "Making atmosphere visible is precisely your perceptual habit, now monetized in spaces, hotels, retail, and film" },
        { name: "Editor, curator (magazines, galleries, curated commerce)", reason: "Selecting only the right things from an overwhelming pool of options is a skill whose price keeps rising as the internet's noise floor rises" }
      ],
      strengthInWeakness: "Being called 'snobbish' or 'cold' is, in fact, what protects your brand value. Refusing to pander makes you long-term magnetic to the people who can actually appreciate quality—and they're the ones with disposable income.",
      futureHint: "Late 30s: people start describing the way you live, dress, and curate as 'taste,' and they begin asking for your guidance. The line between your private aesthetic and a paid practice quietly disappears around this age.",
      actionAdvice: "Post one thing publicly this week labeled 'this is my taste, not universal.' The moment you stop trying to please everyone is the moment the few people who actually understand you finally find you."
    },

    "マイペースな引きこもりパンダ": {
      hiddenTalent: "High stress tolerance and the rare ability to keep moving at a steady pace for ten years without burning out. Endurance is your specialty in a world that mostly burns people out by 35.",
      whyThisFits: "Holding your own pace under pressure proves your sense of self isn't easily eroded by outside demands. Sprinters are common; people who can keep a long, consistent rhythm without flaming out are extraordinarily rare. In organizations, you are the most quietly reliable kind of person—the one still here after everyone else has churned through.",
      idealJobs: [
        { name: "Specialist back-office roles (accounting, HR, legal, ops)", reason: "Not flashy, but doing consistently high-quality processing for years is exactly the engine room of any company that survives long-term" },
        { name: "Remote engineer, remote writer, distributed worker", reason: "Producing high-quality output in a low-stimulation environment from home is the most attractive professional profile of the remote-work era" },
        { name: "Specialized technical work (pharmacist, technician, regulated profession)", reason: "Quiet, precise, repeatable work in regulated fields is where slow-and-steady wins—your wiring matches the lifetime career arc" }
      ],
      strengthInWeakness: "Being seen as 'low-energy' or 'unmotivated' is the inverse of being burnout-proof. While ambitious peers crash and quit, you just keep showing up. Showing up for 15 years in a row is, by itself, enough to make you rare and valuable.",
      futureHint: "Past 40, the consensus around you becomes 'this person doesn't change—I can rely on them.' Not the rocket-ship career, but the long compounding-trust career—and by 50, that's often the more lucrative path.",
      actionAdvice: "This week, remove one thing that disrupts your pace—a pointless meeting, an unrealistic deadline, a moody colleague. Defending your tempo isn't laziness; it's the central skill of the long run."
    },

    "頑固なマイキャラ黒豚": {
      hiddenTalent: "An unbending core and long-form consistency. You can maintain the same character for years without drift—an asset whose value has exploded in the personal-brand era.",
      whyThisFits: "Stubbornness reads as 'difficult to work with' in a team, but in a market where everyone's personal brand keeps shifting to match the trend, the one person who doesn't shift becomes a fixed point people trust. 'I know what this person will say' is, in 2026, one of the most valuable things you can be in any audience's mind.",
      idealJobs: [
        { name: "Personal brand careers (creator, columnist, critic, commentator)", reason: "Long-term position consistency is the absolute requirement for an audience that returns; trend-chasers lose followers, fixed-points keep them" },
        { name: "Artisan, artist (ceramics, leather, lacquer, fine craft)", reason: "Sustaining the same artistic style for decades is exactly what makes an artisan reputable rather than forgettable" },
        { name: "Independent specialist (licensed professional, coach, instructor, niche consultant)", reason: "Clients hire you because they know what you stand for; the clearer your unmoved position, the more requested-by-name your work becomes" }
      ],
      strengthInWeakness: "Being 'inflexible' or 'high-maintenance' inside an organization becomes 'a person with a clear position' the moment you go independent. The same trait that frustrates colleagues becomes the exact reason customers choose you over alternatives.",
      futureHint: "Late 30s to 40s, your refusal to change is finally read as trustworthiness. The shift from being an 'organization person' to being a 'named individual whose work is requested' happens around this age—and that's the phase where you actually bloom.",
      actionAdvice: "Next time you feel 'I will not bend on this,' don't just resist—explain why, in clean logic. Once your stubbornness becomes articulated philosophy, it stops being a flaw and starts being your brand."
    }
  },

  ko: {
    // ===== 높은 승인욕구 × 외향 =====

    "マウンティング突撃ライオン": {
      hiddenTalent: "모두가 머뭇거리는 「첫걸음」을 폭발적으로 떼어내는 추진력. 정체된 상황을 움직이게 만드는, 흔치 않은 점화 장치형 재능입니다.",
      whyThisFits: "당신이 평소 가지고 있는 「내가 위에 서야 한다」는 충동의 본질은, 사실 「무언가를 움직이고 싶다」「멈춰 있고 싶지 않다」는 강렬한 에너지입니다. 그 방향을 「남보다 위에 서기」에서 「아무도 잡지 않는 첫 리스크를 내가 잡기」로 바꾸는 순간, 당신은 조직에서 가장 가치 있는 사람으로 변합니다.",
      idealJobs: [
        { name: "신규 사업 개발 · 스타트업 창업", reason: "기존 질서에 도전하는 에너지와 비판을 두려워하지 않고 앞으로 나가는 돌파력은, 0→1 단계에서 가장 강력한 무기" },
        { name: "영업 매니저 · 사업개발(BD)", reason: "결과가 숫자로 명확히 나오는 세계에서, 당신의 「지기 싫어하는 기질」이 그대로 매출을 만드는 원동력으로 작동" },
        { name: "이벤트 프로듀서 · 행사 기획", reason: "장(場)을 장악하고, 사람을 끌어들이고, 주목받는 힘. 주인공급 존재감은 무대 연출과 궁합이 매우 좋음" }
      ],
      strengthInWeakness: "「지기 싫다」는 초조함은, 평범한 일상에 휩쓸리지 않는 강렬한 동력입니다. 안정된 기업에서는 짓눌릴 기질이지만, 승패가 숫자로 분명한 환경에 있으면 그 초조함이 그대로 추월할 수 없는 성과를 만들어냅니다.",
      futureHint: "30대 이후, 당신의 「위에 서려는 본능」이 「가르치는 리더십」으로 전환되는 순간 단숨에 매력적인 사람으로 변합니다. 후배를 키우는 좋은 선배, 코치, 경영자의 길이 열리며, 젊은 날의 충동이 성숙한 추진력으로 바뀝니다.",
      actionAdvice: "다음 회의에서 「제가 하겠습니다」가 아니라 「제가 책임지겠습니다」라고 한 번만 말해보세요. 마운팅과 리더십을 가르는 단어 하나의 차이가, 당신을 다음 단계로 옮겨놓습니다."
    },

    "手柄泥棒アピールオウム": {
      hiddenTalent: "조용히 묻혀 있는 성과와 지나치기 쉬운 가치를, 누구나 알아볼 수 있는 언어로 「가시화」하는 번역력. 홍보·전달 역할로 조직을 움직일 수 있는 재능입니다.",
      whyThisFits: "「내 것으로 만들고 싶다」는 습관 뒤에는, 「이게 대단한 일인데 아무도 모르고 있다」를 알아보는 눈과 그것을 언어화하는 능력이 숨어 있습니다. 공치사로 빼앗는 방향이 아니라 「묻혀 있는 일의 가치를 세상에 알리는」 방향으로 돌리면, 누구보다 신뢰받는 홍보 담당자·다리 역할이 됩니다.",
      idealJobs: [
        { name: "홍보 · PR · 커뮤니케이션 담당", reason: "타인의 성과나 제품의 매력을 알리는 일은, 당신의 「돋보이게 하고 싶다」는 본능을 윤리적으로 풀어낼 수 있는 최적의 직업" },
        { name: "마케터 · 카피라이터", reason: "지나치기 쉬운 가치를 알아보고 타깃에 꽂히는 언어로 변환하는 능력은, 바로 당신의 재능의 핵심 그 자체" },
        { name: "강연자 · 프레젠터 · 강사", reason: "장의 주도권을 쥐는 데 쾌감을 느끼는 당신은, 사람 앞에서 말하는 직업에서 물 만난 고기가 됨" }
      ],
      strengthInWeakness: "「나만 지나칠까 두려운 마음」은, 사람의 감정 미세 변화를 비정상적으로 정확하게 읽어내는 능력으로 변환됩니다. 누가 스포트라이트를 원하는지, 누가 소외되어 있는지가 보이는 당신은, 인간관계의 달인이 될 자질을 가지고 있습니다.",
      futureHint: "5년 뒤, 당신이 「자신을 팔기」를 그만두고 「남을 팔기」 쪽으로 돌아서면, 갑자기 주변에 사람이 모이기 시작합니다. 홍보 담당자, 에이전트, 프로듀서로서 타인의 재능을 세상에 내보내는 위치에서 크게 자랄 가능성이 높습니다.",
      actionAdvice: "이번 주에 한 번, 직장에서 눈에 띄지 않는 누군가의 일을 공개된 자리에서 「이거 정말 대단하지 않아요?」라고 말해보세요. 공치사를 양보한 순간, 사람들이 당신을 신뢰하기 시작합니다."
    },

    "依存型バズりチワワ": {
      hiddenTalent: "타인의 감정 변화를 밀리초 단위로 감지하는 초고감도 센서. 누구보다 빠르게 「상대의 온도 변화」를 알아차리는 재능입니다.",
      whyThisFits: "「반응이 끊길 때의 불안」은 뒤집어 보면 「반응을 잡아내는 능력이 비정상적으로 높다」는 증거입니다. 보통 사람은 알아차리지 못하는 읽씹의 미세한 지연, 표정의 미세 변화, 목소리 톤을 읽어낼 수 있는 당신은, 고객이나 팬의 마음이 떠나기 「딱 한 발 전」에 움직일 수 있는 유일한 유형입니다.",
      idealJobs: [
        { name: "SNS 운영자 · 커뮤니티 매니저", reason: "팔로워의 분위기 변화와 인게이지먼트 하락 조짐을, 데이터가 아닌 직감으로 감지하는 감도는 AI가 대체할 수 없는 무기" },
        { name: "고객 성공(CS) · 고객 지원", reason: "고객의 이탈 신호를 조기에 발견하고 관계를 되살리는 일은 당신의 본능과 완벽하게 일치하는 영역" },
        { name: "접객 · 영업 프론트 · 호스피탈리티", reason: "대면에서 상대의 반응에 맞춰 즉시 응대를 바꾸는 기술은, 의존 기질의 사람일수록 잘하는 장인 기예" }
      ],
      strengthInWeakness: "「애정 확인을 반복하는 습관」은, 밀도 높은 커뮤니케이션을 힘들어하지 않는 체력이기도 합니다. 하루 100건의 고객 응대를 지치지 않고 해낼 수 있는 건, 사람과의 접촉 자체가 에너지원이기 때문입니다.",
      futureHint: "30대 이후, 당신이 「내가 반응받고 싶다」에서 「상대가 반응하고 싶어지는 장을 만든다」 쪽으로 돌아서면, 커뮤니티 빌더로서 독자적 포지션을 구축할 수 있습니다. 팬의 마음을 꿰뚫고 있는 「업계의 마음 잘 아는 사람」이 되는 미래가 보입니다.",
      actionAdvice: "오늘 누군가에게 「반응 좀 해주세요」라고 조르기 전에, 상대의 최근 게시물에 깊이 있는 댓글을 하나만 달아보세요. 반응을 빼앗는 쪽에서, 반응을 만들어내는 쪽으로 서는 첫걸음입니다."
    },

    "エモさ渇望インフルエンサー予備軍": {
      hiddenTalent: "흔한 일상을 이야기로 바꾸는 편집안. 감정을 영상·언어·분위기로 만들어 타인에게 전하는, 타고난 스토리텔러 자질입니다.",
      whyThisFits: "「평범한 하루도 드라마로 만드는 습관」은 세상을 이야기로 보는 눈을 가지고 있다는 증거입니다. 그저 그런 출근 풍경이 영화의 한 장면으로 보이는 사람은 실은 매우 드물며, 그 감성은 훈련해도 익혀지지 않는 천부적인 것입니다. 「감성에 대한 갈망」은 표현자가 되어야 할 영혼의 신호라 할 수 있습니다.",
      idealJobs: [
        { name: "콘텐츠 크리에이터 · 유튜버 · 팟캐스터", reason: "일상을 이야기화하는 힘은, 장기 콘텐츠에서 지속적으로 팬을 잡는 최대 무기" },
        { name: "작가 · 시나리오 작가 · 카피라이터", reason: "감정을 언어로 변환하는 재능은, 상업적 글쓰기 모든 영역의 핵심 스킬" },
        { name: "영상 · 사진 크리에이터 · 디렉터", reason: "장의 분위기와 피사체의 감정을 잘라내는 감각은, 비주얼 표현 직업의 근간 그 자체" }
      ],
      strengthInWeakness: "「공감받지 못하는 외로움」은, 공감을 만들어내는 일에 대한 탐구심의 원천입니다. 한 번이라도 「이건 통했다」고 느낀 순간의 기쁨은, 다른 어떤 직업의 성공 체험보다 깊게 당신을 표현자로 단단하게 만듭니다.",
      futureHint: "5년 뒤, 당신이 「떠야 한다」를 그만두고 「단 한 사람의 마음에 꽂히는 작품을 만든다」로 갈아타면, 역설적으로 그곳에서 진짜 팬이 자라나기 시작합니다. 좁고 깊은 커뮤니티의 중심 인물로 꽃피는 미래입니다.",
      actionAdvice: "다음 게시물에서 「인스타용 미감」을 버리고, 일부러 평범한 순간을 잘라내 보세요. 장식을 뺐을 때 남는 당신의 감성이, 진짜 대표작의 입구입니다."
    },

    // ===== 높은 승인욕구 × 내향 =====

    "かまってちゃん型ポメラニアン": {
      hiddenTalent: "타인의 작은 변화를 알아차리는 관찰안과 경계심을 풀게 만드는 친근함. 누군가에게 「곁에 있어 줬으면」이라는 마음을 일으키는, 흔치 않은 매력입니다.",
      whyThisFits: "「버려질 것 같은 불안」을 오래 안고 살아온 당신은, 상대의 기분과 관심도를 미세하게 읽어내는 훈련을 무의식적으로 쌓아왔습니다. 그 능력을 「관심받는 쪽」이 아니라 「관심을 주는 쪽」으로 돌리는 순간, 당신은 누구보다 따뜻한 사람으로 인기를 얻게 됩니다. 같은 능력, 반대 방향입니다.",
      idealJobs: [
        { name: "보육 · 사회복지 · 돌봄 관련직", reason: "곁에 다가가는 친근함과, 상대의 작은 변화를 알아차리는 관찰력은 돌봄 현장에서 유일무이한 존재감을 만들어냄" },
        { name: "반려동물 관련직(트리머, 펫 케어, 동물복지)", reason: "말 없는 상대의 감정을 읽고 애정을 쏟는 일은 당신의 본능과 완벽히 일치하는 천직" },
        { name: "비서 · 어시스턴트 · 컨시어지", reason: "상사의 표정에서 필요한 것을 먼저 알아차리는 능력은, 우수한 비서의 핵심 재능 그 자체" }
      ],
      strengthInWeakness: "「돌려서 관심 신호를 보내는 습관」은, 상대의 심리를 헤아리는 섬세함의 다른 얼굴입니다. 직접 요구하지 못하는 어색함은 상대의 부담을 줄이고 싶은 본래의 다정함에서 오는 것이며, 돌봄 직업에서는 강점으로 뒤집힙니다.",
      futureHint: "30대 이후, 당신이 「누군가의 관심을 받고 싶다」에서 「누군가를 챙기는 게 즐겁다」로 무게 중심을 옮기면, 사람이 자연스럽게 모이는 존재가 됩니다. 반려동물을 키우고, 후배를 두고, 작은 커뮤니티를 만드는 것이 모두 재능 개화의 방아쇠입니다.",
      actionAdvice: "오늘, 당신이 관심받고 싶다고 느낀 순간에 거꾸로 주변 누군가의 작은 변화를 하나만 짚어 말로 해보세요. 「최근 머리 잘랐어?」 한마디만으로도 관계의 방향이 뒤집힙니다."
    },

    "見守られ待ちピヨちゃん": {
      hiddenTalent: "약함과 초보를 받아주는 포용력. 자기 자신이 안심할 수 있는 공간을 주변에 전염시키는, 공기 만들기의 재능입니다.",
      whyThisFits: "「누가 보살펴줬으면」 하고 바라온 당신은, 보살핌받는 쪽의 마음을 누구보다 깊이 이해합니다. 그래서 당신이 「지켜보는 쪽」으로 돌아섰을 때, 상대가 위축되지 않고 안심할 수 있는 공기를 자연스럽게 만들 수 있습니다. 교육과 육성의 현장에서 가장 가치가 나는 유형입니다.",
      idealJobs: [
        { name: "교사 · 학원 강사 · 튜터", reason: "초보자의 망설임과 불안에 공명할 수 있는 감성은, 학생이 그만두지 않는 강의실을 만드는 결정적 무기" },
        { name: "아동 관련직(돌봄 지도원, 아동 상담, 어린이 프로그램 기획)", reason: "아이의 「봐달라」는 마음에 공명하고 부정하지 않고 받아주는 자세는, 그 일의 본질 자체" },
        { name: "커뮤니티 설계 · 온라인 살롱 운영", reason: "신참이 안심하고 발언할 수 있는 장을 만드는 능력은, 커뮤니티의 수명을 좌우하는 결정적 스킬" }
      ],
      strengthInWeakness: "「누가 봐주지 않으면 못 움직이는」 내향성은, 충동적으로 움직이지 않고 신중히 관찰하는 겸손함이기도 합니다. 리스크 큰 일을 맡겨도 멋대로 폭주하지 않고 주변과 보조를 맞추기 때문에, 조직이 장기적으로 신뢰를 보내는 유형입니다.",
      futureHint: "5년 뒤, 당신이 「봐주는 사람을 찾기」를 그만두고 「봐주는 쪽 마음을 잘 아는 케어 제공자」로 독립하면, 인품으로 선택받는 롱셀러 장인이 될 수 있습니다.",
      actionAdvice: "이번 주에 자기보다 초보인 한 사람을 찾아, 평가하지 말고 그냥 이야기를 들어주세요. 당신이 받고 싶었던 「지켜봐주는 공기」를 제공하는 쪽이 되는 첫 연습입니다."
    },

    "怯える甘えん坊トイプー": {
      hiddenTalent: "위험과 위화감을 누구보다 빨리 감지하는 리스크 센서와, 안심할 수 있는 관계를 신중히 키우는 끈기. 신중파의 천재형입니다.",
      whyThisFits: "「버려지면 어쩌지」 「틀리면 어쩌지」 하는 불안이 늘 가동되는 당신의 머리는, 리스크 검출기로서 극도로 성능이 높습니다. 보통 사람이 놓치는 미세한 이상—계약서의 빈 구멍, 대인관계의 불온함, 시장의 변화—을 가장 먼저 감지할 수 있습니다. 이 능력은 비용을 낮추고 생명을 구하는, 가장 실리적인 재능입니다.",
      idealJobs: [
        { name: "리스크 관리 · 컴플라이언스 · 내부감사", reason: "「최악의 시나리오」를 본능적으로 시뮬레이션하는 사고는, 리스크 직군에서 귀하게 여겨지는 드문 기질" },
        { name: "의료 보조직(간호 보조, 의료 사무, 약무 보조)", reason: "실수가 허용되지 않는 영역에서, 여러 번의 체크를 힘들어하지 않고 신중히 진행하는 기질은 의료 현장의 안전망 그 자체" },
        { name: "카운슬링 보조 · 심리 보조직", reason: "불안을 안고 있는 사람의 마음이 손에 잡힐 듯 보이는 당신은, 내담자의 안심을 만드는 첫 역할로 이상적" }
      ],
      strengthInWeakness: "「겁먹는」 성질은, 일을 진지하게 받아들이는 사람에게만 나오는 반응입니다. 둔감한 사람은 리스크를 가볍게 보고 큰 사고를 일으키지만, 당신은 작게 실패하고 치명상을 피하는 유형입니다. 장기적으로는 반드시 당신이 살아남습니다.",
      futureHint: "40대 이후, 당신의 신중함은 「신뢰의 적금」으로 복리로 작용하기 시작합니다. 젊은 시절엔 「걱정이 많은 사람」이라 불렸던 것이, 어느 날 「신중해서 실수가 없는 사람」으로 평가가 뒤집히는 순간이 반드시 옵니다.",
      actionAdvice: "다음에 불안이 올라올 때, 그것을 억누르지 말고 「이건 어떤 리스크를 감지하고 있는 걸까」라고 적어보세요. 당신의 직감이 언어가 된 순간, 그건 어엿한 리스크 분석입니다."
    },

    "要領のいい保身コアラ": {
      hiddenTalent: "전체 구조를 단숨에 조망하고, 최소 노력으로 최대 성과를 얻는 경로를 발견하는 전략안. 에너지 배분의 천재입니다.",
      whyThisFits: "「불필요한 싸움을 피한다」는 본능은, 전략 사고의 원형입니다. 보통 사람이 감정으로 소모되는 국면에서, 당신은 「이 싸움은 이겨도 이득이 작다」고 냉정하게 판단할 수 있습니다. 이 능력은 비즈니스 세계에서 가장 희귀하고, 가장 높은 보수가 지급되는 종류의 것입니다.",
      idealJobs: [
        { name: "경영기획 · 사업기획", reason: "전체 최적과 리소스 배분을 가늠하는 능력은, 경영에 가장 가까운 직무의 핵심 스킬" },
        { name: "전략 컨설턴트 · 경영 자문", reason: "클라이언트가 보지 못하는 「싸우지 않아도 되는 전장」을 제시하는 일은, 보신 사고의 정통적 진화형" },
        { name: "프로젝트 매니저 · PMO", reason: "터질 안건을 미연에 막고 풍파 없이 납기를 지키는 장인 기예는, 당신의 진가가 발휘되는 무대" }
      ],
      strengthInWeakness: "「요령이 좋다」는 것은 젊은 시절엔 「잔머리 굴린다」고 비판받기 쉽지만, 30대 이후 「판단력이 좋은 사람」으로 평가가 완전히 뒤집힙니다. 에너지를 아끼는 것은, 장기전을 제압하는 사람의 필수 스킬입니다.",
      futureHint: "5년 뒤, 당신이 「보신」이라 부르던 것을 「리소스 매니지먼트」라 고쳐 부르는 순간, 자신의 전략안에 자신감을 가지게 됩니다. 경영진·관리자 계층으로의 승진이 보이는 연령대입니다.",
      actionAdvice: "다음에 「이건 싸우지 않아도 된다」고 느낄 때, 그것을 죄책감이 아니라 전략으로 언어화해보세요. 「지금 이건 우선순위가 낮다」고 한 번만 적어두면, 판단의 질이 눈에 보이기 시작합니다."
    },

    // ===== 낮은 승인욕구 × 외향 =====

    "ドヤ顔クリエイティブ孔雀": {
      hiddenTalent: "「이건 아름답다」 「이건 별로다」를 즉각 판정하는 심미안과, 자기 미의식을 끝까지 관철하는 완성까지의 집념입니다.",
      whyThisFits: "「잘난척」의 뿌리에는, 자신의 미적 판단에 대한 흔들리지 않는 확신이 있습니다. 승인을 갈구하지 않는 외향 유형인 당신은, 타인의 평가로 미의식을 흔들지 않습니다. 크리에이티브 업계에서 가장 중요한 「꺾이지 않는 감성」을, 타고나서 가지고 있는 몇 안 되는 사람입니다.",
      idealJobs: [
        { name: "아트 디렉터 · 크리에이티브 디렉터", reason: "여러 안건의 미적 수준을 혼자 짊어지는 일은, 자기 미의식을 끝까지 믿을 수 있는 사람만 해낼 수 있는 궁극의 표현직" },
        { name: "디자이너(그래픽 · 제품 · 공간 · 패션)", reason: "디테일의 밀리미터 단위에 집착할 수 있는 장인 기질은, 디자인 직군의 생명선 그 자체" },
        { name: "공예 장인 · 크래프트맨(도예, 목공, 가죽, 옻칠)", reason: "완성까지 혼자 버틸 수 있는 힘과 미적 기준의 높이는, 현대에 남아 있는 몇 안 되는 장인의 세계에서 빛나는 자질" }
      ],
      strengthInWeakness: "「잘난척」은 미움받기 쉽지만, 그게 없으면 높은 수준의 작품은 태어나지 않습니다. 타협을 허락하지 않는 당신의 오만함은, 평범함을 양산하지 않는 품질 가드이며, 브랜드의 수명을 늘리는 요소입니다.",
      futureHint: "30대 후반, 당신의 작품이 「알 사람은 아는」 것으로 평가받기 시작할 무렵 갑자기 팬이 생깁니다. 만인에게 받아들여지는 게 아니라, 깊은 팬에게 오래 지지받는 작가로 인정받는 미래입니다.",
      actionAdvice: "이번 주에 자신의 작품 하나를 「이건 내 대표작이라고는 할 수 없지만, 좋아하는 사람에겐 꽂힐 것」이라 덧붙여 발표해보세요. 프라이드의 일부를 내려놓은 순간, 진짜 팬이 나타납니다."
    },

    "我道突っ走りハリネズミ": {
      hiddenTalent: "주변의 노이즈에 흔들리지 않는 압도적인 집중력과, 아무도 달리지 않는 길을 끝까지 달리는 끈기. 프런티어를 개척하는 재능입니다.",
      whyThisFits: "무리 짓지 않고 휩쓸리지 않는 성질은, 한국의 조직문화에서는 「협조성이 없다」고 다뤄지기 쉽지만, 니치 영역에서는 「아무도 흉내낼 수 없는 사람」으로 희소가치가 폭발적으로 높아집니다. 다들과 다른 방향으로 달리는 것을 즐길 수 있는 당신은, 블루오션을 발견할 수 있는 몇 안 되는 유형입니다.",
      idealJobs: [
        { name: "연구직(기초 연구, 특수 분야의 전문 연구)", reason: "성과가 나올 때까지 몇 년이고 걸리는 지루한 작업을, 외롭게 계속할 수 있는 기질은 연구 세계의 절대 조건" },
        { name: "1인 창업 · 개인사업주(프리랜서)", reason: "상사나 동료의 평가를 필요로 하지 않는 자립성은, 독립 경영의 정신적 전제 그 자체" },
        { name: "니치 전문직(특수 번역, 희귀 스킬 컨설팅, 특정 영역 작가)", reason: "경쟁자가 없는 좁은 영역을 깊이 파는 일하는 방식은, 무리 짓지 않는 기질의 정통적 진화형" }
      ],
      strengthInWeakness: "「독불장군」 「협조성이 없다」고 불리기 쉬운 성질은, 외부의 유행과 평가에 휩쓸리지 않는 강인한 축을 의미합니다. SNS 시대에 가장 희귀한 자질입니다.",
      futureHint: "5년 뒤, 당신이 선택한 니치 영역이 갑자기 세상의 주목을 받거나, 혹은 조용히 「그 분야라면 저 사람」이라고 업계 내에서 제1인자가 되어 있습니다. 두 미래 모두 독주의 끝에 있습니다.",
      actionAdvice: "다음에 「다들과 다르다」고 느낄 때, 그것을 수정하지 말고 왜 그렇게 느끼는지를 기록에 남기세요. 3년 뒤, 그 위화감의 누적이 당신의 전문성의 핵심이 됩니다."
    },

    "無自覚マニアックオオカミ": {
      hiddenTalent: "한 가지 주제를 끝까지 파는 보통이 아닌 깊이와, 평가를 갈구하지 않고 몇 년이고 계속할 수 있는 지속력. 진짜 전문성으로 먹고살 수 있는 재능의 핵심입니다.",
      whyThisFits: "「무자각」이라는 것은 좋아서 계속하고 있다는 증거입니다. 승인을 위해 파고드는 사람은 3년이면 질리지만, 당신은 10년을 파도 질리지 않습니다. AI 시대에 가장 희귀한 「깊은 전문 지식을 가진 인간」의 자질이, 타고나서 갖춰져 있습니다.",
      idealJobs: [
        { name: "연구원 · 엔지니어 전문가 · 기술 스페셜리스트", reason: "한 가지 기술을 10년 파고들 수 있는 기질은, 시니어 엔지니어나 연구원의 도달점 그 자체" },
        { name: "전문 작가 · 편집자 · 기술 평론가", reason: "매니악한 지식을 가진 사람이 그것을 언어화해 먹고사는 길. 당신의 깊이가 그대로 상품이 됨" },
        { name: "니치 영역의 컨설턴트(기술 자문, 특정 산업의 조언자)", reason: "다른 사람이 손대지 않는 깊이에 도달해 있다는 것만으로, 업계 유일의 조언자 포지션이 얻어짐" }
      ],
      strengthInWeakness: "「남에게 통하지 않는 이야기만 한다」는 성질은, 전문 커뮤니티에 들어가는 순간 「이 사람은 진짜다」라고 존경받는 유일무이한 무기로 변합니다. 대중적 인기를 포기하면 오히려 강해지는 보기 드문 유형입니다.",
      futureHint: "30대 후반, 당신의 축적이 「그 분야라면 저 사람」으로 업계 내에서 이름으로 불리게 됩니다. 무대 위가 아니라, 업계 전문가 층에 깊이 파고드는 제1인자로의 길입니다.",
      actionAdvice: "이번 주에, 당신이 당연하다고 생각하는 지식을 하나, 초보자용으로 정성껏 적어보세요. 당신에게의 상식은, 세상에서는 귀중한 자산입니다."
    },

    "合理的ルールポリス柴犬": {
      hiddenTalent: "모호한 것을 구조화하여 재현 가능한 시스템으로 바꾸는 힘. 혼돈을 질서로 번역하는, 조직을 성숙시키는 장인 기예입니다.",
      whyThisFits: "「올바름」에 대한 집착은, 본질적으로는 「재현 가능한 좋음」을 추구하는 기질입니다. 속인적으로만 돌아가는 업무, 그때그때의 임시 판단, 반복되는 실수—당신은 이런 것을 용서할 수 없습니다. 그래서 누가 해도 같은 품질이 나오는 시스템을 만들 수 있는, 조직에게 극히 귀중한 인재입니다.",
      idealJobs: [
        { name: "시스템 설계 · 비즈니스 시스템 분석가", reason: "모호한 업무 요건을 명확한 시스템 요건으로 번역하는 일은, 규칙 지향 사고의 정통적 활용처" },
        { name: "업무 개선 · 오퍼레이션 매니저", reason: "속인화된 업무를 시스템화하여 누구나 굴릴 수 있는 상태로 만드는 일은 당신의 천직이라 할 영역" },
        { name: "감사 · 품질 관리 · ISO 담당", reason: "규칙을 설계하고 그것을 조직에 정착시키는 역할은, 당신의 기준의 높이가 가치로 직결됨" }
      ],
      strengthInWeakness: "「세세하다」 「융통성이 없다」고 불리는 성질은, 본질을 꿰뚫어보는 정확함의 다른 얼굴입니다. 단기적으로는 미움받아도, 장기적으로는 당신이 만든 시스템이 조직을 떠받치는 토대가 됩니다.",
      futureHint: "40대, 당신이 만들어온 시스템과 매뉴얼이 후배들 업무의 토대가 되어 있는 것을 알아차립니다. 지미하고 눈에 띄지 않지만, 조직이 계속 돌아가는 진짜 이유로서 존경받는 미래입니다.",
      actionAdvice: "이번 주에 현장의 작은 「어쩐지 그렇게 해오던 작업」을 하나 골라 절차를 적어보세요. 적은 순간, 그건 당신이 만든 「자산」이 됩니다."
    },

    // ===== 낮은 승인욕구 × 내향 =====

    "殻にこもる自律カタツムリ": {
      hiddenTalent: "혼자 깊이 사고하는 힘과, 외압에 휘둘리지 않고 자기 페이스를 지키는 자립성. 장거리 사고가 필요한 일에서 발휘되는 재능입니다.",
      whyThisFits: "「껍질 속에 숨는」 일은 세상에선 약함으로 다뤄지기 쉽지만, 실은 「자기 머리로 생각하는 시간을 확보하는」 고차원의 자기 관리 기술입니다. SNS와 회의에 시간을 빼앗기는 현대에, 깊은 사고의 시간을 의식적으로 가질 수 있는 사람은 극도로 드물며, 그 능력은 희소 자원입니다.",
      idealJobs: [
        { name: "연구 · 학술직 · 싱크탱크 연구원", reason: "혼자 장시간 사고할 수 있는 기질은, 학술적 깊이를 만들어내는 절대 조건" },
        { name: "소프트웨어 엔지니어 · 프로그래머(특히 백엔드 또는 1인 인디 개발)", reason: "대면 커뮤니케이션을 최소화하고 자신의 두뇌와 화면에 집중하는 일은 당신을 위해 존재함" },
        { name: "작가 · 번역가 · 편집자", reason: "타인의 말이나 텍스트와 장시간 마주할 수 있는 집중력은, 글 일의 근간이 되는 스킬" }
      ],
      strengthInWeakness: "「붙임성이 없다」 「커뮤니케이션을 안 한다」고 불리는 성질은, 본질적으로는 「질 낮은 인간관계에 시간을 허비하지 않는」 선별안입니다. 좁고 깊은 인간관계 쪽이 장기적으로 충실하다는 진리를, 본능적으로 알고 있는 유형입니다.",
      futureHint: "5년 뒤, 당신이 재택 근무·개인 사업 등 「혼자 집중할 수 있는 일하는 방식」을 선택하고 있을 확률은 매우 높습니다. 그리고 그 선택을 한 사람일수록 30대 이후의 성과가 늘어나는 시대에, 당신은 적응한 일하는 방식을 가지고 있습니다.",
      actionAdvice: "이번 주에 아무에게도 보여주지 않는 「혼자 생각하는 노트」를 만들어보세요. SNS에 올리기 전 당신의 사고의 순도가, 5년 뒤의 차이를 만드는 원천이 됩니다."
    },

    "孤高のパステル黒猫": {
      hiddenTalent: "미의식과 품질 기준의 높이, 그리고 공기·분위기·세계관을 만드는 센스. 브랜드와 작품의 「격」을 결정하는 감각적 판단력입니다.",
      whyThisFits: "「고고함」을 지키려는 성질은, 안일한 공감에 몸을 맡기지 않음으로써 자신의 감성을 보호해 온 증거입니다. SNS의 유행에 물들지 않고 자기 색을 지킬 수 있는 드문 사람. 그래서 세계관을 만드는 일—그것은 균질화된 시대에 가장 가치가 나는 스킬—에서 본령을 발휘할 수 있습니다.",
      idealJobs: [
        { name: "브랜딩 · 브랜드 매니저", reason: "브랜드의 세계관을 지키는 일은, 타협하지 않는 미의식을 가진 사람만이 해낼 수 있음" },
        { name: "인테리어 디자이너 · 공간 프로듀서", reason: "공기감이나 분위기를 가시화하는 일은, 감각으로 「이건 아니다」라고 판정할 수 있는 사람의 전매특허" },
        { name: "편집자 · 큐레이터(잡지, 갤러리, EC 셀렉트)", reason: "좋은 것만 골라내는 안목은, 정보 과잉 시대에 가장 가치가 오르고 있는 희소 스킬" }
      ],
      strengthInWeakness: "「잘난 척한다」 「다가가기 어렵다」고 불리는 성질은, 누구에게도 아부하지 않는 품격의 표현입니다. 싸게 팔지 않는 자태는, 장기적으로 브랜드 가치를 높이고 진짜 사람만 끌어들이는 자기장이 됩니다.",
      futureHint: "30대 후반, 당신이 선택한 세계관이나 사는 방식이 「센스가 좋다」고 평가받기 시작하고, 그것을 참고하고 싶은 사람들이 주위에 모이기 시작합니다. 모방되지 않는 오리지널리티를 가진 사람으로서, 독자적인 포지션에 안착합니다.",
      actionAdvice: "이번 주에 SNS에서 한 번만 「이건 내 취향」이라 명확히 밝힌 발신을 해보세요. 만인의 취향을 포기한 순간, 당신을 진짜 이해하는 사람이 발견되기 시작합니다."
    },

    "マイペースな引きこもりパンダ": {
      hiddenTalent: "스트레스 내성의 높음과, 장기전에 묵묵히 견디는 지속력. 번아웃되지 않고 10년 달릴 수 있는, 흔치 않은 지속력의 재능입니다.",
      whyThisFits: "「마이페이스」를 관철할 수 있다는 것은, 외부 압력에 자아가 깎이지 않는 강함을 가지고 있다는 증거입니다. 단거리에서 폭발하는 사람은 많지만, 장거리를 일정 페이스로 계속 달릴 수 있는 사람은 극도로 적습니다. 당신은 안정적으로 성과를 쌓아가는, 조직에게 가장 신뢰할 수 있는 유형입니다.",
      idealJobs: [
        { name: "백오피스 전문직(회계, 인사, 총무, 법무)", reason: "화려함은 없지만 안정적으로 양질의 처리를 계속할 수 있는 기질은, 백오피스의 심장부에 가장 요구되는 자질" },
        { name: "재택 엔지니어 · 재택 작가 · 원격 근무자", reason: "자택이라는 저스트레스 환경에서 묵묵히 고품질 작업을 계속할 수 있는 기질은, 원격 근무 시대의 최강 프로필" },
        { name: "전문 기술직(약사, 방사선기사, 전문 사무, 보수 정비)", reason: "정확함과 지속력이 빛을 발하는 장인적 전문직은, 번아웃되지 않는 당신의 장기 커리어에 최적" }
      ],
      strengthInWeakness: "「의욕이 없어 보인다」 「열량이 낮다」고 불리는 성질은, 번아웃 증후군과 무관한 최강의 체질입니다. 동기들이 차례차례 지쳐 그만두는 와중에, 묵묵히 남아 있는 것만으로 어느새 희소한 존재가 되어 있습니다.",
      futureHint: "40대 이후, 당신의 주변에서는 「저 사람만은 변하지 않는다」 「믿을 만하다」는 평가가 정착하기 시작합니다. 화려한 커리어 점프가 아니라, 장기적인 신뢰의 누적으로 가치를 올리는, 만성형 성공 패턴입니다.",
      actionAdvice: "이번 주에 자기 페이스를 흐트러뜨리는 무언가(불필요한 회의, 무리한 마감, 감정 기복이 심한 사람)에서, 하나만 거리를 두어보세요. 마이페이스를 지키는 일은 게으름이 아니라, 장거리 달리기의 필수 스킬입니다."
    },

    "頑固なマイキャラ黒豚": {
      hiddenTalent: "굽히지 않는 심지와 일관성. 장기적으로 흔들리지 않는 「캐릭터」를 유지할 수 있는, 1인 브랜드 시대에 가장 가치 있는 재능입니다.",
      whyThisFits: "「고집」은 협조성 결여로 다뤄지기 쉽지만, SNS 시대에는 「대체할 수 없는 개성」이라는 최고의 자산입니다. 유행에 맞춰 캐릭터를 바꾸는 사람은 일회용이 되지만, 흔들리지 않는 사람은 「이 사람이라면 이렇게 말한다」로 신뢰받습니다. 당신은 1인 브랜드가 자산화되는 시대에 완벽히 적응되어 있습니다.",
      idealJobs: [
        { name: "1인 브랜드 계열(인플루언서, 칼럼니스트, 평론가)", reason: "흔들리지 않는 발언 일관성은, 팔로워가 장기적으로 신뢰를 보내는 1인 브랜드의 절대 조건" },
        { name: "장인 · 작가(도예, 가죽 장인, 옻칠, 미술 작가)", reason: "자신의 작풍을 10년·20년 지킬 수 있는 기질은, 장인 세계에서 유일하게 신용되는 자질" },
        { name: "독립 전문가(자격사, 코치, 강사, 특정 영역 컨설턴트)", reason: "「이 사람은 이렇게 생각한다」가 명확할수록 지명으로 일이 들어오는 독립 업계에, 당신의 고집은 최대 무기" }
      ],
      strengthInWeakness: "「융통성이 없다」 「피곤한 사람」이라 불리는 성질은, 영합하지 않는 심지를 가지고 있다는 증거입니다. 조직 안에서는 마찰을 낳기도 하지만, 독립해 프리랜서가 된 순간 그 심지야말로 고객에게 선택받는 이유로 뒤집힙니다.",
      futureHint: "30대 후반부터 40대, 당신의 「변하지 않음」이 주위에서 신뢰의 원천으로 평가받기 시작합니다. 조직인으로서가 아니라, 한 개인으로서 이름으로 일을 받는 단계에 들어섰을 때, 진짜 개화가 시작됩니다.",
      actionAdvice: "다음에 「이건 양보 못 한다」고 느낄 때, 그것을 참지 말고 논리적으로 이유를 설명해보세요. 고집을 언어화할 수 있으면, 그건 철학이 되고, 당신의 1인 브랜드의 핵심이 됩니다."
    }
  },

  zh: {
    // ===== 高认同感×外向 =====

    "マウンティング突撃ライオン": {
      hiddenTalent: "在所有人都犹豫的「第一步」前，能爆发性地踏出去的推动力。让停滞局面开始转动的、稀有的「点火装置型」才能。",
      whyThisFits: "你平时那种「我必须站在上面」的冲动，本质上是一股「想让事情动起来」「不想停下来」的强烈能量。把这股能量从「比别人高」转向「敢于承担没人愿意冒的第一个风险」——就在那一刻，你会变成组织里最有价值的那个人。",
      idealJobs: [
        { name: "新业务开发・初创公司创业", reason: "敢于挑战既有秩序、不怕被批评而冲到前面的突破力，是 0→1 阶段最强的燃料" },
        { name: "销售管理・商务拓展（BD）", reason: "在结果用数字直接打分的世界里，你那「不想输」的本能正好转化成持续产出业绩的引擎" },
        { name: "活动策划・大型项目制片人", reason: "掌控场子、把人吸进来、占据全场注意力——这种主角气场和舞台属性的工作匹配度极高" }
      ],
      strengthInWeakness: "「不想输的焦虑」其实是让你不被平庸日常吞没的强烈动力。在稳定大公司里它会被压住，但在胜负用数字明确分出来的环境里，这股焦虑正是别人追不上你的根本原因。",
      futureHint: "30岁之后，你那种「想压过别人」的本能一旦切换成「想教会别人」的领导力，整个人的魅力会瞬间提升一个档次。带后辈的好前辈、教练、经营者的路在前面打开，年轻时的冲动会变成成熟的推动力。",
      actionAdvice: "下一次开会时，把「我来做」换成「我来负责」——只换一个词。这一字之差，就是「炫耀」和「领导」的分界线，也是你迈向下一阶段的入口。"
    },

    "手柄泥棒アピールオウム": {
      hiddenTalent: "把被埋没的成果、容易被忽视的价值，翻译成所有人都能听懂的语言、让它「看得见」的能力。能撑起一个团队对外发声的天才。",
      whyThisFits: "「想把它据为己有」这个习惯的背后，藏着「这件事其实很厉害，但没人意识到」的洞察力，以及把它语言化的能力。如果不是「抢功」而是「把别人被埋没的工作介绍给世界」——你会变成团队里最被信任的传播者、连接者。",
      idealJobs: [
        { name: "公关・传播・内部沟通", reason: "替别人的成果和产品魅力发声，是把你「想被看见」的本能合乎伦理地释放出来的最佳出口" },
        { name: "市场营销・文案策划", reason: "发现被忽视的价值，再把它转化成击中目标人群的语言——这就是你这种人才的核心能力" },
        { name: "讲师・主持人・培训师", reason: "你享受掌控全场的快感，台前职业是你如鱼得水的世界" }
      ],
      strengthInWeakness: "「害怕只有自己被忽略」其实把你的天线调得异常灵敏——谁在渴望聚光灯、谁正在被冷落，你都能立刻看清。这种对人际气场的高分辨率，是少有人具备的隐性专业能力。",
      futureHint: "5年后，当你不再「推销自己」而开始「推销别人」，你身边会突然聚起一群人。公关人、经纪人、制作人——靠帮别人出头来吃饭的职业里，你能长成业内的核心。",
      actionAdvice: "这一周里，公开地说一次别人的好——在团队的群里，或在会议上：「他这件事做得真好」。把功劳让出去的那一刻，别人才开始真心信任你。"
    },

    "依存型バズりチワワ": {
      hiddenTalent: "对他人情绪变化的毫秒级感应器。比任何人都更早察觉到「对方的温度变了」的高灵敏天赋。",
      whyThisFits: "「对方一不回应就开始不安」这件事，翻过来看就是「捕捉反应的能力远超常人」的证据。别人察觉不到的已读延迟、表情的微小变化、声音里的迟疑——你都能瞬间读到。这让你成为唯一一个能在客户或粉丝心已经在动摇的「前一步」就采取行动的人。",
      idealJobs: [
        { name: "社群运营・社区经理", reason: "靠直觉而不是数据，提前察觉到粉丝氛围下滑、互动衰退——这种敏感度是 AI 无法替代的硬通货" },
        { name: "客户成功・客户服务", reason: "在客户流失前一步就发现信号、把关系拉回来——这就是你的本能在做的事，只不过现在被付了工资" },
        { name: "线下零售・高端服务・销售前台", reason: "对面互动中，根据客户瞬时反应调整应对方式，本就是你下意识在练的手艺" }
      ],
      strengthInWeakness: "「反复确认对方爱意」的习惯，意味着你能承受高密度的人际接触。每天和上百个客户互动而不耗竭——是因为人际连接对你而言不是负担，而是能量来源。",
      futureHint: "30岁之后，当你从「我想被回应」切换到「我设计一个让别人想回应的场子」，你就开始变成社群构建者。深谙人心的「圈子的核心人物」——这是属于你的未来路径。",
      actionAdvice: "今天，在你想找谁要反应之前，先去给某个人最近的发帖留一条用心的评论。从「索取关注」转向「创造关注」，第一步就在这里。"
    },

    "エモさ渇望インフルエンサー予備軍": {
      hiddenTalent: "把平凡日常重新剪辑成故事的编辑视角。把情绪转成画面、文字、氛围传递给他人的、天生的叙事者天赋。",
      whyThisFits: "「连普通的一天都想戏剧化」这个习惯，证明你是在用「故事」的眼睛看世界。一个普通的通勤场景在你眼里变成电影画面——这种感性其实极少有人具备，而且后天也练不出来。「渴望情怀」其实是一个本应成为表达者的灵魂在发出信号。",
      idealJobs: [
        { name: "内容创作者・视频博主・播客主理人", reason: "把日常变成故事的能力，在长内容里是持续抓住粉丝的最强武器" },
        { name: "作家・编剧・文案策划", reason: "把情绪翻译成语言——是几乎所有商业写作的核心技能" },
        { name: "摄影师・视频导演・视觉创作者", reason: "捕捉空间氛围与被摄者情绪的瞬间——这正是你日常本能的视觉化输出" }
      ],
      strengthInWeakness: "「不被共情时的孤独」其实是「想创造共情」这件事的源动力。一旦你的某个作品真正打到了陌生人，那一瞬间的快感会比任何工作上的成功都来得深，并把你彻底固定在创作者的轨道上。",
      futureHint: "5年后，当你不再追求「爆款」而是开始为「会懂的那一个人」写作时，反而真正的粉丝开始聚拢。不是百万级，而是几百人深度——这种「窄而深」的核心圈层会成为你长期的根基。",
      actionAdvice: "下一次发帖，故意放弃「精修美感」，发一个朴素的、未经修饰的日常瞬间。当你把滤镜全部拿掉之后还留下来的那部分感性，才是你真正的代表作的入口。"
    },

    // ===== 高认同感×内向 =====

    "かまってちゃん型ポメラニアン": {
      hiddenTalent: "对他人微小变化的观察力，加上能让别人放下戒备靠近你的亲和力。让人觉得「想留你在身边」的稀有魅力。",
      whyThisFits: "你一直背着「会不会被悄悄抛下」的不安，在不知不觉间训练出了对他人情绪、关心度的微观感知能力。一旦把这份「关注雷达」从「我在被注意吗」转向「谁需要被注意」——你就从黏人变成了不可替代。同一种能力，相反的方向。",
      idealJobs: [
        { name: "幼教・社工・养老照护", reason: "靠近他人的亲和力，加上对小变化的察觉，正是照护行业里能让你独一无二的核心能力" },
        { name: "宠物相关（美容师、宠物护理、动物福利）", reason: "解读无言之物的情绪、把爱浇灌进去——这就是你天生的接线方式，与其说是职业，不如说是天职" },
        { name: "助理・私人秘书・礼宾", reason: "通过领导的表情就先一步察觉到他需要什么——这正是优秀助理的核心技能，而你天生就在做" }
      ],
      strengthInWeakness: "「拐弯抹角求关注」这个习惯，背后其实是对他人心理的细腻体察。不能直接开口，是因为不想给对方添麻烦——这份「不想打扰他人」的善意，在照护类工作里会立刻翻转为强项。",
      futureHint: "30岁之后，当你的重心从「想被关心」转向「关心别人很开心」，会有人自然而然地聚到你身边。养只宠物、带个后辈、办个小社群——任何一个都是才能开花的扳机。",
      actionAdvice: "今天，当你又升起「想被人关心一下」的念头时，反过来去发现身边某个人的小变化、说出来。一句「你换发型了？」就足以让关系的方向整个翻转。"
    },

    "見守られ待ちピヨちゃん": {
      hiddenTalent: "能接纳「软弱」和「新手身份」的包容力。让自己感到安心的氛围会自然地传染给周围——「营造安全感的人」。",
      whyThisFits: "因为你一直渴望「有人能守着我」，所以你比任何人都更清楚被守护一方的感受。当你站到「守望者」这一边时，对方不会因为你而萎缩——这是教师、教练、所有真正能让人成长的人的核心能力。",
      idealJobs: [
        { name: "教师・培训讲师・一对一辅导", reason: "对新手犹豫和不安的共情，是让学生不放弃、不退课的关键武器" },
        { name: "儿童相关（学童指导员、儿童咨询、儿童项目策划）", reason: "对孩子「请看着我」这句话的共鸣，以及不评判地接住他——这正是这份职业的本质" },
        { name: "社群设计・知识星球/社群运营", reason: "让新人敢于发出第一句话的氛围设计——是决定社群寿命的最难也最值钱的能力" }
      ],
      strengthInWeakness: "「没人看着就不太敢动」的内向，反过来意味着你不会冲动行事，会先观察、先确认。再大的项目交给你也不会失控乱跑——这种稳，会让组织在长期里反复选择你。",
      futureHint: "5年后，当你不再寻找「能守着我的人」而成为「最懂被守护者心情的照护提供者」并独立出来时，你会靠人品被反复推荐——成为口口相传的长青式职人。",
      actionAdvice: "这周找一个比你更新手的人，只是听他说，不评价。把你一直想被给予的「被守望的氛围」练习成你能给出的东西，从这里开始。"
    },

    "怯える甘えん坊トイプー": {
      hiddenTalent: "对危险和违和感的高速感应器，加上耐心慢慢培育「安心关系」的韧性。慎重派里的天才型选手。",
      whyThisFits: "「万一被抛下怎么办」「万一弄错了怎么办」这些念头在你脑里持续运转，让你的大脑成了一个性能极高的风险检测器。普通人会忽略的微小异常——合同里的漏洞、人际间的暗流、市场的早期信号——你都能最先察觉到。这是一种最实用、最能减少损失的才能。",
      idealJobs: [
        { name: "风险管理・合规・内部审计", reason: "本能性地模拟「最坏情况」的思维方式，正是高级风控人员最稀有的特质" },
        { name: "医疗辅助岗位（护理助理、药剂师助理、医疗行政）", reason: "在零容错环境里反复核查不会让你疲惫，而是日常——这让你成了组织真正依赖的安全网" },
        { name: "心理咨询助理・临床接案人员", reason: "焦虑的来访者一开口你就能从内部理解他，这种共情对入门接案是不可替代的能力" }
      ],
      strengthInWeakness: "「总是在害怕」这件事，证明你认真对待你正在做的每一件事。粗心的人会低估风险酿成大祸，而你会小步失败、避开致命一击。把时间拉长来看，留下来的总是你这一类。",
      futureHint: "40岁之后，你的慎重会变成「信任的复利」开始结算。年轻时被叫做「想太多」的特质，会在某一天突然被重新评价为「靠谱、不会出错的人」——那一刻一定会来。",
      actionAdvice: "下一次焦虑升起时，不要压抑它，而是写下「我现在感受到的是什么风险」。当直觉被语言化的那一刻，它就不再是焦虑，而是正经的风险分析。"
    },

    "要領のいい保身コアラ": {
      hiddenTalent: "瞬间俯瞰整体结构，找到「以最小投入获得最大成果」路径的战略眼光。能源分配的天才。",
      whyThisFits: "「避免不必要的争斗」这个本能，本质上是战略思维的雏形。普通人会被情绪卷进每一场冲突，而你能冷静地判断「这场就算赢了收益也不高」——这种判断力是商业世界里最稀有、报酬最高的认知习惯。",
      idealJobs: [
        { name: "战略策划・业务规划", reason: "看清全局并合理分配资源——正是离经营最近的岗位的核心技能" },
        { name: "战略咨询顾问・经营顾问", reason: "告诉客户「这场仗根本不该打」是顾问业最值钱的能力，而它正好契合你的天性" },
        { name: "项目经理・PMO・项目总监", reason: "在风波闹起来之前就把它扑灭、平稳交付——这种「不出戏」的功夫，是你的主场" }
      ],
      strengthInWeakness: "「会算计」在 20 多岁时常被说成「滑头」，但到了 30 岁之后会被重新评价为「有判断力」。能保存能量的人，才是赢得长线战争的人——这是没人愿意说出口、但所有职场赢家都心里明白的真理。",
      futureHint: "5 年后，当你把自己一直叫做「保身」的东西改口叫「资源管理」时，你才真正信任了自己的战略大脑。这一刻一到，进入管理层、迈入经营层的路就在眼前。",
      actionAdvice: "下一次你直觉「这件事不必争」时，不要带着愧疚，而是把它当作一个战略判断写下来：「这件事现阶段优先级低」。一句话一旦落到纸上，你判断力的轮廓就被自己看见了。"
    },

    // ===== 低认同感×外向 =====

    "ドヤ顔クリエイティブ孔雀": {
      hiddenTalent: "「这个美、那个俗」的瞬间审美判断力，加上能把自己的审美贯彻到作品完成的执念。眼力 + 持久力——这两样能同时拥有的人，世上少之又少。",
      whyThisFits: "「得意洋洋」的根底，是对自己审美判断的不可动摇的确信。不追求认可的外向型——意味着你不会因为别人的评价而妥协自己的眼力。在创意行业最难找的「不会在压力下稀释自己愿景的人」，你天生就是。",
      idealJobs: [
        { name: "艺术指导・创意总监", reason: "独自扛起多个项目的审美标准——这种活只有完全相信自己眼力的人才能做" },
        { name: "设计师（平面、产品、空间、时装）", reason: "对毫米级细节的执着，是把作品从「还行」推到「有签名感」的分水岭" },
        { name: "匠人・手作艺术家（陶艺、皮革、木工、漆艺）", reason: "一个人耐心做到最后的能力，加上不妥协的审美标准——是 2026 年仍能活下来的小型工艺事业的精神底色" }
      ],
      strengthInWeakness: "「得意洋洋」让人讨厌，但少了它就出不了高水准的作品。不允许妥协的傲慢感，本质上是一种品质防线——它阻止你产出平庸的东西，也是品牌寿命延长的根本原因。",
      futureHint: "30岁后半段，你的作品开始被贴上「不是大众款，但懂的人就懂」的标签——真正的粉丝从这里开始出现。不追求万人喜欢，而是被深度粉丝长期支持——你天生就是这种作家。",
      actionAdvice: "这周发表一个作品，备注一句：「这不算我的代表作，但是会击中真正喜欢的人」。把骄傲放下一寸的那一瞬间，真正属于你的粉丝就会出现。"
    },

    "我道突っ走りハリネズミ": {
      hiddenTalent: "对周围噪音的免疫力——没人走的路你能一直跑到底的韧性。开拓「无人区」的天赋。",
      whyThisFits: "不合群、不随波逐流——这些特质在国内职场里常被翻译成「不会做人」，但在垂直领域里，它会让你变成「没人能模仿」的稀有存在，价值会爆发性上升。你天生就是那种能享受「跟别人不一样的方向」、并从中找到蓝海的人。",
      idealJobs: [
        { name: "研究岗（基础研究、特殊领域深耕）", reason: "在不被掌声、要等很多年才有结果的工作里坚持下去——这种孤独耐心是研究世界的入场券" },
        { name: "一人创业・自由职业者", reason: "不需要老板和同事的认可才能动起来——这种独立性正是独立经营的精神前提" },
        { name: "垂直专家（小众翻译、稀有领域顾问、垂直领域写手）", reason: "在没人争抢的窄领域深挖下去——这是你「不合群」气质的正统进化形态" }
      ],
      strengthInWeakness: "「独来独往」「不合群」常被说是缺点，但它意味着你不被外部潮流和评价拉扯——这是 SNS 时代最稀有的内核稳定力。",
      futureHint: "5年后，你正在跑的那个小众领域，要么突然被全网关注，要么悄悄变成了行业内「这块就找他」的第一人。两种未来都站在你独自跑下去的尽头。",
      actionAdvice: "下一次你感觉「我跟大家想的不一样」时，不要去修正自己，而是把这个不一样记下来。三年的违和感累积下来，就是你专业性的核心。"
    },

    "無自覚マニアックオオカミ": {
      hiddenTalent: "把一个主题挖到底的非凡深度，加上不需要外部评价就能持续多年的耐力。能靠真正的专业性吃饭的、最核心的资质。",
      whyThisFits: "「无意识地痴迷」本身就是「为了喜欢而做」的证据。为了求认可而钻研的人三年就会厌倦，而你挖十年都不会腻。在 AI 时代，最稀有的就是「拥有深度专业知识的人类」，而这份资质，你天生就有。",
      idealJobs: [
        { name: "研究员・技术专家・资深工程师", reason: "在同一个技术线上深耕十年的气质，正是资深工程师和研究员的到达点本身" },
        { name: "专业写作者・技术编辑・行业评论员", reason: "把深度知识转化成长内容和参考资料——这是奖励你这种特质的稳定职业路径" },
        { name: "垂直领域顾问（技术顾问、特定行业咨询）", reason: "只要你到达了别人不会去的深度，行业里「这块就你最懂」的位置就是你的" }
      ],
      strengthInWeakness: "「老是在讲别人听不懂的东西」——这句负面评价，在你进入专业圈子的瞬间会变成「这人是真的」。放弃大众认可后反而变强——是少有的逆向变强的体质。",
      futureHint: "30岁后半段，你积累的深度让圈内人开始以名字记住你。不是出名，而是被尊重——从普通职员到「行业里有名号的人」的跃迁，往往在某个临界点上突然发生。",
      actionAdvice: "这周把一个你觉得「太基础没什么好说的」的知识点，用给新手讲的方式认真写下来。对你来说是常识的东西，对外界往往是宝贵的资源——你只是不知道。"
    },

    "合理的ルールポリス柴犬": {
      hiddenTalent: "把模糊的东西结构化、变成可复制的系统的能力。「把混沌翻译成秩序」——能让组织走向成熟的匠人级技能。",
      whyThisFits: "对「正确」的执着，本质上是在追求「可以重复的好」。属人化的工作、临时性的判断、反复出现的失误——这些都让你受不了。正因如此，你能搭建「不管谁来做都能保持品质」的系统——对组织来说，这是极其稀缺的能力。",
      idealJobs: [
        { name: "系统设计・业务系统分析师", reason: "把模糊的业务需求翻译成清晰的系统需求——这是规则型思维最正统的落地方式" },
        { name: "运营管理・流程改进", reason: "把只有特定人能做的工作改造成「谁来都能跑」的状态——是你的主场" },
        { name: "质量管理・审计・ISO 合规", reason: "设计规则并让组织实际遵守——你的高标准在这种岗位里直接变成价值" }
      ],
      strengthInWeakness: "「太较真」「不够灵活」——这些评价短期里让你被嫌弃，但长期来看，你建的系统会变成组织运转的地基。打破规则的人激动一时，建立规则的人重要一生。",
      futureHint: "40岁时，你会发现自己写过的 SOP 和流程已经成了后辈工作的底层。低调、不显眼，但「这套体系还能转」的根本原因正是你——这是属于你的、被尊重的未来。",
      actionAdvice: "这周挑一个「大家就这么做着的」流程，把步骤写下来。把它形成文档的那一秒，它就从「隐性知识」变成了你署名的「资产」。"
    },

    // ===== 低认同感×内向 =====

    "殻にこもる自律カタツムリ": {
      hiddenTalent: "一个人深度思考的能力，加上不被外部压力撼动的自律性。在需要长程思维的工作里发挥的、稀有的内功型才能。",
      whyThisFits: "「躲进壳里」表面上像是软弱，实际上是一项高级的自我管理——你在保护「用自己脑子思考的时间」。在被会议和通知不断切碎注意力的当下，能坐下来独自和一个难题待三个小时的人极少——你天生就具备这种稀缺资源。",
      idealJobs: [
        { name: "研究员・学者・智库分析师", reason: "持续的独自思考能力，是学术深度的发动机本身——你不是逃避工作，而是为这种工作而生" },
        { name: "软件工程师・程序员（特别是后端、独立开发者）", reason: "把面对面沟通压到最低、最大化和自己大脑与屏幕共处的时间——这就是高端开发工作的描述本身" },
        { name: "作家・翻译・编辑", reason: "能长时间和文字独处的耐心，是所有文字类创作工作的底层耐力" }
      ],
      strengthInWeakness: "「不爱社交」「太封闭」——准确说，这是你在拒绝在低质量人际关系上浪费时间。两个深交的朋友胜过五十个泛泛之交——这个事实在每一项成年幸福感研究里都被反复证实，而你本能就懂。",
      futureHint: "5年后，你大概率已经在远程办公、独立工作或个人事业的轨道上。事实证明，选这条路的人正在悄悄超过被困在办公室的人——你只是比大多数人早一步适应了结构性的转变。",
      actionAdvice: "这周开一本「不会给任何人看的笔记本」。在你的想法被为了社媒而修剪之前，那份纯度——才是 5 年后拉开差距的真正源泉。"
    },

    "孤高のパステル黒猫": {
      hiddenTalent: "审美和品质标准的高度，加上塑造氛围、空气感、世界观的天赋。决定一个品牌或作品「格调」的、稀有的策展型直觉。",
      whyThisFits: "保持「高冷」的姿态，其实是你在保护自己的感性不被廉价共情拉低。没有被算法平均化、还保留独特不可弯曲的审美——在一切都越来越同质化的市场里，这种人会变得极其有价值。奢侈品、高端媒体、精品服务，付的钱正是为了你天生的样子。",
      idealJobs: [
        { name: "品牌策略・品牌经理", reason: "守住品牌世界观不被廉价化——这种工作只有审美不会妥协的人才能真正做" },
        { name: "室内设计师・空间策划・陈列师", reason: "把氛围具体化——这正是你日常的感知方式，只不过现在被酒店、零售、影视付钱购买" },
        { name: "编辑・策展人（杂志、画廊、精选电商）", reason: "从海量信息里挑出对的几件——这个能力随着互联网噪音水位上升，价格在持续上涨" }
      ],
      strengthInWeakness: "「装」「难接近」——这些标签其实正是你品牌价值的护城河。拒绝迎合让你在长期里对真正能欣赏品质的人有持续吸引力——而这些人，恰好是有购买力的人。",
      futureHint: "30岁后半段，你的生活方式、穿搭、收藏会被身边的人称为「有品味」，开始有人问你建议。私人审美和有偿实践之间的那条线，会在这个年纪不知不觉地消失。",
      actionAdvice: "这周在社媒上发一条带「这只是我的偏好，不必所有人都喜欢」标签的内容。放弃讨好所有人的那一秒，真正懂你的少数人才会出现并认出你。"
    },

    "マイペースな引きこもりパンダ": {
      hiddenTalent: "高抗压性，加上能在十年长跑里不被烧尽的续航力。在多数人 35 岁就过劳脱队的时代里，「不会熄火」是你的专长。",
      whyThisFits: "能保持自己的节奏不被外界压力侵蚀——这件事本身证明你的自我没那么容易被磨掉。短跑选手很多，但能用稳定节拍长跑十年还不灭灯的人极少。在组织里，你是那种「最后留下来的最可靠的人」——这是被严重低估的稀有资产。",
      idealJobs: [
        { name: "后台职能岗（财务、人事、行政、法务）", reason: "不炫，但年复一年稳定产出高质量处理——这正是任何长寿公司里的发动机舱" },
        { name: "远程工程师・远程写作者・分布式办公者", reason: "在低刺激的家庭环境里持续产出高品质工作——这是远程办公时代最有吸引力的职业画像" },
        { name: "持证专技岗（药剂师、技师、合规审核类）", reason: "需要精确和长期稳定的匠人型专技工作——和你的体质极度匹配" }
      ],
      strengthInWeakness: "「看着没动力」「没什么热情」——这种印象的反面，是「免疫过劳」的最强体质。当周围野心勃勃的同事一个个崩溃离场时，你只是继续按时上下班——光是「持续在场十五年」这件事，就让你变得稀有。",
      futureHint: "40岁之后，你身边的人会形成共识：「这人不会变，可以靠」。不是火箭式的晋升曲线，而是用长期信任复利出来的职业路径——到了 50 岁，这条路往往比那条更值钱。",
      actionAdvice: "这周从扰乱你节奏的某件事（多余的会议、不合理的死线、情绪起伏大的人）里抽身一次。守住自己的节拍不是懒，而是长跑运动员的核心技能。"
    },

    "頑固なマイキャラ黒豚": {
      hiddenTalent: "不会弯曲的内核 + 长期一致性。能维持同一个「人设」很多年不漂移——在「个人品牌时代」最值钱的资质。",
      whyThisFits: "「顽固」在团队里被翻译成「难相处」，但在所有人都在追热点改人设的市场上，那个「不变的人」反而会变成大家心里的锚点。「我知道这个人会怎么说」——在 2026 年的内容市场上，这是观众最愿意付钱购买的东西。",
      idealJobs: [
        { name: "个人品牌方向（KOL、专栏作家、评论员）", reason: "长期立场不变是粉丝持续回流的绝对前提——追热点的人会掉粉，立锚点的人会留住粉" },
        { name: "匠人・艺术家（陶艺、皮革、漆艺、纯艺术作家）", reason: "几十年保持同一种风格，是匠人在业内被尊重而不是被遗忘的根本原因" },
        { name: "独立专业人士（持证专业、教练、讲师、垂直顾问）", reason: "客户找你是因为他清楚「你会怎么想」——你越清晰、越不动摇，被指名的订单就越多" }
      ],
      strengthInWeakness: "在组织内被叫做「不够圆滑」「不好搞」——一旦你出来单干，同样的特质会变成「客户认你这个人」的根本原因。让同事头疼的特质，就是让客户在一群人里挑你的特质。",
      futureHint: "30 岁后半到 40 岁，你的「不变」会被周围重新读成「值得信任」。从「公司里的某个员工」变成「行业里被点名的某个人」的转变，往往在这个年纪发生——你真正的开花期，从这里开始。",
      actionAdvice: "下一次你觉得「这件事不能让步」时，不要只是硬扛，而是用清楚的逻辑解释为什么。当你的顽固变成了能被表达出来的哲学——它就变成了你个人品牌的内核。"
    }
  }
};
