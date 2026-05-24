(function () {
    "use strict";

    const LANG_STORAGE_KEY = "sns_monster_lang";
    const SUPPORTED = ["ja", "en", "ko", "zh"];
    const EMAIL = "pvac25471@gmail.com";

    const labels = {
        ja: { select: "表示言語", back: "診断へ戻る", columns: "コラム一覧へ", privacy: "プライバシーポリシー", contact: "お問い合わせ", about: "運営情報", articles: "承認欲求コラム", ad: "スポンサーリンク" },
        en: { select: "Language", back: "Back to diagnosis", columns: "Back to columns", privacy: "Privacy Policy", contact: "Contact", about: "About", articles: "Approval Desire Columns", ad: "Sponsored" },
        ko: { select: "언어", back: "진단으로 돌아가기", columns: "칼럼 목록으로", privacy: "개인정보 처리방침", contact: "문의", about: "운영 정보", articles: "승인욕구 칼럼", ad: "스폰서 링크" },
        zh: { select: "语言", back: "返回诊断", columns: "返回专栏", privacy: "隐私政策", contact: "联系我们", about: "运营信息", articles: "认同感专栏", ad: "赞助链接" }
    };

    const articleList = {
        ja: [
            ["approval-desire-test.html", "承認欲求診断でわかること", "診断結果を自分責めではなく、SNSとの距離感を眺める入口にします。"],
            ["sns-approval-desire.html", "SNSの承認欲求とは何か", "いいね、閲覧数、反応待ちが心に刺さる理由を整理します。"],
            ["likes-psychology.html", "いいねが気になる心理", "投稿後の通知確認や反応待ちが疲れやすい理由をまとめます。"],
            ["maslow-social-media.html", "マズローの欲求とSNS時代の見られたい気持ち", "承認欲求をエンタメ診断として扱うための前提をまとめます。"],
            ["sns-comparison-fatigue.html", "SNSで人と比べて疲れるときの考え方", "いいね数やフォロワー数を順位表にしすぎないための整理です。"],
            ["sns-fatigue.html", "SNS疲れを軽くする投稿との付き合い方", "反応に振り回されすぎないための現実的な工夫です。"],
            ["result-types.html", "16タイプ診断結果の楽しみ方", "タイプ名をネタとして楽しみながら、自分の傾向を眺めます。"],
            ["how-to-share-results.html", "診断結果をXでシェアして遊ぶコツ", "結果画像、投稿文、ハッシュタグを使って友だちと楽しむ導線です。"]
        ],
        en: [
            ["approval-desire-test.html", "What an Approval Desire Test Shows", "Use the result as a light way to look at your distance from SNS, not as self-blame."],
            ["sns-approval-desire.html", "What Approval Desire on SNS Means", "Why likes, views, and waiting for reactions can hit your feelings so hard."],
            ["likes-psychology.html", "Why You Care About Likes", "A simple look at notification checking, reaction waiting, and the fatigue around them."],
            ["maslow-social-media.html", "Maslow's Needs and the Desire to Be Seen", "How recognition, safety, and self-expression get compressed into one SNS screen."],
            ["sns-comparison-fatigue.html", "When Comparing Yourself on SNS Gets Tiring", "How to stop turning likes and follower counts into a personal ranking board."],
            ["sns-fatigue.html", "How to Ease SNS Fatigue", "Practical ways to avoid being pulled around by every reaction."],
            ["result-types.html", "How to Enjoy the 16 Result Types", "Treat the monster name as a playful nickname and observe your tendencies."],
            ["how-to-share-results.html", "Tips for Sharing Your Result on X", "How to use the image, post text, and hashtag so friends can enjoy it too."]
        ],
        ko: [
            ["approval-desire-test.html", "승인욕구 진단으로 알 수 있는 것", "결과를 자기비난이 아니라 SNS와의 거리감을 보는 가벼운 입구로 사용합니다."],
            ["sns-approval-desire.html", "SNS의 승인욕구란 무엇인가", "좋아요, 조회수, 반응 기다림이 왜 마음에 크게 다가오는지 정리합니다."],
            ["likes-psychology.html", "좋아요가 신경 쓰이는 심리", "게시 후 알림 확인과 반응 대기가 왜 피로해지는지 살펴봅니다."],
            ["maslow-social-media.html", "매슬로 욕구와 SNS 시대의 보이고 싶은 마음", "인정, 안정, 자기표현이 SNS 화면 하나에 압축되는 방식을 설명합니다."],
            ["sns-comparison-fatigue.html", "SNS에서 남과 비교해 지칠 때", "좋아요 수와 팔로워 수를 내 순위표로 만들지 않는 법입니다."],
            ["sns-fatigue.html", "SNS 피로를 줄이는 게시물과의 거리", "모든 반응에 휘둘리지 않기 위한 현실적인 조절법입니다."],
            ["result-types.html", "16가지 진단 결과 즐기는 법", "몬스터 이름을 장난스러운 별명처럼 받아들이며 자신의 경향을 봅니다."],
            ["how-to-share-results.html", "결과를 X에 공유하며 즐기는 법", "이미지, 게시 문구, 해시태그로 친구들과 함께 즐기는 방법입니다."]
        ],
        zh: [
            ["approval-desire-test.html", "认同感诊断能看出什么", "把结果当作观察自己与SNS距离的轻松入口，而不是自我责备。"],
            ["sns-approval-desire.html", "SNS上的认同感欲求是什么", "整理点赞、浏览量和等待反应为什么会牵动情绪。"],
            ["likes-psychology.html", "为什么会在意点赞", "看看发帖后的通知确认和等待反应为什么容易让人疲惫。"],
            ["maslow-social-media.html", "马斯洛需求与SNS时代想被看见的心情", "说明认同、安全感和自我表达如何被压缩进一个SNS画面。"],
            ["sns-comparison-fatigue.html", "在SNS上和别人比较到疲惫时", "避免把点赞数和粉丝数变成个人排名表的思路。"],
            ["sns-fatigue.html", "减轻SNS疲劳的相处方式", "不被每一个反应牵着走的现实调整方法。"],
            ["result-types.html", "16种诊断结果的玩法", "把怪物名当作玩笑式昵称，轻松观察自己的倾向。"],
            ["how-to-share-results.html", "在X分享结果的玩法", "用结果图、投稿文和标签让朋友也一起玩。"]
        ]
    };

    const pages = {
        "about.html": {
            title: { ja: "運営情報 | SNS承認欲求モンスター診断", en: "About | SNS Recognition Monster Diagnosis", ko: "운영 정보 | SNS 승인욕구 몬스터 진단", zh: "运营信息 | SNS认同感怪物诊断" },
            html: {
                ja: `<h1>運営情報</h1><p>「SNS承認欲求モンスター診断」は、SNS時代の承認欲求を16タイプのポップなモンスターとして楽しむエンタメ診断です。</p><h2>診断について</h2><p>本診断は娯楽目的のコンテンツです。医療、心理診断、職業適性判断などの専門的判断を目的としたものではありません。</p><h2>広告について</h2><p>診断中の集中を妨げないため、広告は結果画面付近など限定された場所にのみ表示する方針です。</p>`,
                en: `<h1>About</h1><p>SNS Recognition Monster Diagnosis is an entertainment quiz that turns approval-seeking patterns in the SNS era into 16 playful monster types.</p><h2>About the Diagnosis</h2><p>This site is for entertainment and self-reflection. It is not medical advice, a clinical psychological test, or a professional aptitude assessment.</p><h2>Advertising Policy</h2><p>To protect the flow of the diagnosis, ads are limited to restrained areas such as near the result screen and article pages.</p>`,
                ko: `<h1>운영 정보</h1><p>SNS 승인욕구 몬스터 진단은 SNS 시대의 승인욕구를 16가지 팝한 몬스터 유형으로 즐기는 엔터테인먼트 진단입니다.</p><h2>진단에 대하여</h2><p>본 진단은 오락과 가벼운 자기 점검을 위한 콘텐츠입니다. 의료, 심리 진단, 직업 적성 판단 등 전문적 판단을 목적으로 하지 않습니다.</p><h2>광고에 대하여</h2><p>진단 흐름을 방해하지 않도록 광고는 결과 화면 근처와 칼럼 페이지 등 제한된 위치에만 배치하는 방침입니다.</p>`,
                zh: `<h1>运营信息</h1><p>SNS认同感怪物诊断是一款娱乐诊断，把SNS时代的认同感欲求转化为16种可爱的怪物类型。</p><h2>关于诊断</h2><p>本诊断用于娱乐和轻松自我观察，并非医疗建议、临床心理测验或职业适性判断。</p><h2>关于广告</h2><p>为了不打断诊断体验，广告原则上只会出现在结果页附近和专栏页面等有限位置。</p>`
            }
        },
        "contact.html": {
            title: { ja: "お問い合わせ | SNS承認欲求モンスター診断", en: "Contact | SNS Recognition Monster Diagnosis", ko: "문의 | SNS 승인욕구 몬스터 진단", zh: "联系我们 | SNS认同感怪物诊断" },
            html: {
                ja: `<h1>お問い合わせ</h1><p>診断結果、表示崩れ、不具合、広告表示に関するお問い合わせはこちらで受け付けます。</p><div class="note">お問い合わせ先: <a href="mailto:${EMAIL}">${EMAIL}</a></div><p>不具合報告の際は、ニックネームなど個人情報を含めず、利用ブラウザと発生した画面だけをお知らせください。</p>`,
                en: `<h1>Contact</h1><p>Please use this contact address for result issues, layout problems, bugs, or advertising display questions.</p><div class="note">Contact: <a href="mailto:${EMAIL}">${EMAIL}</a></div><p>When reporting a bug, please avoid sending personal information such as your nickname. The browser and the screen where it happened are enough.</p>`,
                ko: `<h1>문의</h1><p>진단 결과, 화면 깨짐, 오류, 광고 표시와 관련된 문의는 아래 주소로 보내 주세요.</p><div class="note">문의처: <a href="mailto:${EMAIL}">${EMAIL}</a></div><p>오류를 신고할 때는 닉네임 등 개인정보를 포함하지 말고, 사용한 브라우저와 문제가 발생한 화면만 알려 주세요.</p>`,
                zh: `<h1>联系我们</h1><p>关于诊断结果、显示错位、故障或广告显示的问题，请通过以下邮箱联系。</p><div class="note">联系邮箱: <a href="mailto:${EMAIL}">${EMAIL}</a></div><p>反馈故障时，请不要包含昵称等个人信息，只需告知使用的浏览器和发生问题的页面。</p>`
            }
        },
        "privacy.html": {
            title: { ja: "プライバシーポリシー | SNS承認欲求モンスター診断", en: "Privacy Policy | SNS Recognition Monster Diagnosis", ko: "개인정보 처리방침 | SNS 승인욕구 몬스터 진단", zh: "隐私政策 | SNS认同感怪物诊断" },
            html: {
                ja: `<h1>プライバシーポリシー</h1><p>本サイトは、ユーザー体験を保ちながら利用状況の分析と広告表示を行うため、必要最小限の情報のみを扱います。</p><h2>取得する情報</h2><ul><li>診断の開始、完了、画像保存、共有クリックなどの操作イベント</li><li>診断タイプコード、スコア帯、表示言語など、個人を直接特定しない分類情報</li><li>広告配信やアクセス解析に必要なCookie等の識別子</li></ul><h2>取得しない情報</h2><p>ニックネーム、自由入力の文字列、端末内の画像、連絡先、パスワード等をGoogle Analytics 4へ送信しません。</p><h2>外部サービス</h2><p>同意がある場合にGoogle Analytics 4およびGoogle AdSense等を利用することがあります。Cookieはブラウザ設定から削除または無効化できます。</p><h2>お問い合わせ</h2><p><a href="mailto:${EMAIL}">${EMAIL}</a> までお願いします。</p>`,
                en: `<h1>Privacy Policy</h1><p>This site handles only the minimum information needed to improve the experience, analyze usage, and display ads.</p><h2>Information We May Collect</h2><ul><li>Events such as starting the diagnosis, completing it, saving an image, or clicking share</li><li>Non-identifying categories such as result type code, score range, and display language</li><li>Cookie-like identifiers needed for analytics and advertising</li></ul><h2>Information We Do Not Send</h2><p>Nicknames, free-form input text, images on your device, contacts, passwords, and similar personal data are not sent to Google Analytics 4.</p><h2>External Services</h2><p>With consent, this site may use Google Analytics 4 and Google AdSense. Cookies can be deleted or disabled in your browser settings.</p><h2>Contact</h2><p>Please contact <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`,
                ko: `<h1>개인정보 처리방침</h1><p>본 사이트는 사용자 경험을 유지하면서 이용 분석과 광고 표시를 하기 위해 필요한 최소한의 정보만 다룹니다.</p><h2>수집할 수 있는 정보</h2><ul><li>진단 시작, 완료, 이미지 저장, 공유 클릭 등의 조작 이벤트</li><li>진단 유형 코드, 점수 구간, 표시 언어 등 개인을 직접 식별하지 않는 분류 정보</li><li>광고와 접근 분석에 필요한 쿠키 등의 식별자</li></ul><h2>수집하지 않는 정보</h2><p>닉네임, 자유 입력 문자열, 단말기 내 이미지, 연락처, 비밀번호 등은 Google Analytics 4로 보내지 않습니다.</p><h2>외부 서비스</h2><p>동의가 있는 경우 Google Analytics 4 및 Google AdSense 등을 사용할 수 있습니다. 쿠키는 브라우저 설정에서 삭제하거나 비활성화할 수 있습니다.</p><h2>문의</h2><p><a href="mailto:${EMAIL}">${EMAIL}</a> 로 연락해 주세요.</p>`,
                zh: `<h1>隐私政策</h1><p>本网站只处理维持体验、分析使用情况和显示广告所需的最低限度信息。</p><h2>可能取得的信息</h2><ul><li>开始诊断、完成诊断、保存图片、点击分享等操作事件</li><li>诊断类型代码、分数区间、显示语言等不会直接识别个人的分类信息</li><li>广告投放和访问分析所需的Cookie等标识符</li></ul><h2>不会发送的信息</h2><p>昵称、自由输入文本、设备内图片、联系人、密码等不会发送到Google Analytics 4。</p><h2>外部服务</h2><p>在获得同意的情况下，本网站可能使用Google Analytics 4和Google AdSense。Cookie可在浏览器设置中删除或禁用。</p><h2>联系我们</h2><p>请联系 <a href="mailto:${EMAIL}">${EMAIL}</a>。</p>`
            }
        },
        "404.html": {
            title: { ja: "ページが見つかりません | SNS承認欲求モンスター診断", en: "Page Not Found | SNS Recognition Monster Diagnosis", ko: "페이지를 찾을 수 없습니다 | SNS 승인욕구 몬스터 진단", zh: "找不到页面 | SNS认同感怪物诊断" },
            html: {
                ja: `<h1>ページが見つかりません</h1><p class="lead">探しているページは移動したか、存在しないようです。</p>`,
                en: `<h1>Page Not Found</h1><p class="lead">The page you are looking for may have moved or does not exist.</p>`,
                ko: `<h1>페이지를 찾을 수 없습니다</h1><p class="lead">찾는 페이지가 이동했거나 존재하지 않는 것 같습니다.</p>`,
                zh: `<h1>找不到页面</h1><p class="lead">你要找的页面可能已移动或不存在。</p>`
            }
        },
        "articles/index.html": {
            title: { ja: "承認欲求コラム | SNS承認欲求モンスター診断", en: "Approval Desire Columns | SNS Recognition Monster Diagnosis", ko: "승인욕구 칼럼 | SNS 승인욕구 몬스터 진단", zh: "认同感专栏 | SNS认同感怪物诊断" },
            html: {
                ja: `<h1>承認欲求コラム</h1><p class="lead">診断で出たモンスターを笑って終わらせず、SNSとの距離感を少しだけ整えるための読み物です。</p>`,
                en: `<h1>Approval Desire Columns</h1><p class="lead">Short reads for turning your monster result into a lighter, healthier distance from SNS.</p>`,
                ko: `<h1>승인욕구 칼럼</h1><p class="lead">진단에서 나온 몬스터를 웃고 끝내지 않고, SNS와의 거리감을 조금 정리하기 위한 읽을거리입니다.</p>`,
                zh: `<h1>认同感专栏</h1><p class="lead">不只把怪物结果笑一笑就结束，而是轻松整理自己与SNS距离的读物。</p>`
            }
        }
    };

    const articlePages = {
        "approval-desire-test.html": {
            title: ["承認欲求診断でわかること", "What an Approval Desire Test Shows", "승인욕구 진단으로 알 수 있는 것", "认同感诊断能看出什么"],
            lead: ["承認欲求診断は、自分の性格を決めつけるものではなく、SNSで反応を求めるクセを少し離れて眺めるための遊びです。", "An approval desire test is not here to define your personality. It is a playful way to look at your habit of seeking reactions on SNS.", "승인욕구 진단은 성격을 단정하는 것이 아니라, SNS에서 반응을 찾는 습관을 조금 떨어져 보는 놀이입니다.", "认同感诊断不是给性格下结论，而是用轻松方式观察自己在SNS上寻求反应的习惯。"],
            sections: [
                [["診断で見たいのは点数より傾向", "SNSでは「見られること」が日常になる", "モンスター名にする理由"], ["Look at tendencies, not just scores", "Being seen becomes everyday life on SNS", "Why the result becomes a monster name"], ["점수보다 경향을 보기", "SNS에서는 보이는 일이 일상이 된다", "몬스터 이름으로 만드는 이유"], ["看倾向，而不只看分数", "在SNS上，被看见成了日常", "为什么做成怪物名"]],
                [["点数が高いから悪いわけではありません。どんな場面で反応が欲しくなるかを知ることが大切です。", "SNSでは投稿した瞬間に数字が返ってきます。その速さが、表現したい気持ちより評価されたい気持ちを前に出すことがあります。", "少し大げさな名前にすると、自分を責めずに笑って距離を取れます。"], ["A high score is not bad by itself. What matters is noticing when and why you want reactions.", "SNS gives numbers back quickly. That speed can push the wish to be evaluated ahead of the wish to express yourself.", "A slightly exaggerated name makes it easier to laugh, step back, and avoid self-blame."], ["점수가 높다고 나쁜 것은 아닙니다. 어떤 순간에 반응을 원하게 되는지 아는 것이 중요합니다.", "SNS는 게시하자마자 숫자가 돌아옵니다. 그 속도가 표현하고 싶은 마음보다 평가받고 싶은 마음을 앞세우기도 합니다.", "조금 과장된 이름은 자책하지 않고 웃으며 거리를 두게 해 줍니다."], ["分数高并不代表坏。重要的是知道自己在什么场景下会想要反应。", "SNS会在发帖后立刻返回数字，这种速度有时会让“想被评价”压过“想表达”。", "稍微夸张的名字能让人不必责备自己，而是笑着拉开距离。"]]
            ]
        },
        "sns-approval-desire.html": {
            title: ["SNSの承認欲求とは何か", "What Approval Desire on SNS Means", "SNS의 승인욕구란 무엇인가", "SNS上的认同感欲求是什么"],
            lead: ["SNSで反応が気になるのは、弱さというより「見られる場所」に心が置かれているからです。", "Caring about reactions on SNS is less about weakness and more about placing your feelings in a space where you are seen.", "SNS에서 반응이 신경 쓰이는 것은 약함이라기보다, 마음이 보이는 장소에 놓여 있기 때문입니다.", "在SNS上在意反应，与其说是软弱，不如说是把心放在了被看见的地方。"],
            sections: [
                [["承認欲求は悪者ではない", "数字はわかりやすいが、心には雑です", "診断は自分を責めるためではない"], ["Approval desire is not the villain", "Numbers are clear, but rough on the heart", "The diagnosis is not for blaming yourself"], ["승인욕구는 악당이 아니다", "숫자는 알기 쉽지만 마음에는 거칠다", "진단은 자신을 탓하기 위한 것이 아니다"], ["认同感欲求不是坏人", "数字很清楚，但对心很粗糙", "诊断不是为了责备自己"]],
                [["見つけてもらいたい、理解されたい、評価されたい気持ちは自然なものです。問題は、それが行動のすべてを決めてしまうときです。", "いいね数や閲覧数は投稿価値そのものではありません。タイミングやアルゴリズムなど多くの偶然が混ざります。", "この診断は、承認欲求を少し大げさなモンスター名にして笑える距離を作るためのエンタメです。"], ["Wanting to be found, understood, and valued is natural. It becomes tiring when that wish controls every action.", "Likes and views are not the value of a post itself. Timing, algorithms, and chance are mixed in.", "This diagnosis turns approval desire into a playful monster name so you can laugh and get some distance."], ["발견되고 이해받고 평가받고 싶은 마음은 자연스럽습니다. 문제는 그 마음이 행동 전부를 결정할 때입니다.", "좋아요 수와 조회수는 게시물의 가치 그 자체가 아닙니다. 타이밍과 알고리즘, 우연이 섞여 있습니다.", "이 진단은 승인욕구를 조금 과장된 몬스터 이름으로 바꾸어 웃으며 거리를 두기 위한 엔터테인먼트입니다."], ["想被发现、理解、评价是自然的。问题在于这种心情开始决定所有行动。", "点赞和浏览量并不是投稿本身的价值，里面混有时间、算法和偶然。", "这个诊断把认同感欲求做成夸张的怪物名，是为了让你笑着拉开距离。"]]
            ]
        },
        "likes-psychology.html": {
            title: ["いいねが気になる心理", "Why You Care About Likes", "좋아요가 신경 쓰이는 심리", "为什么会在意点赞"],
            lead: ["いいねが気になるのは、投稿が誰かに届いたかを数字で確認できてしまうからです。", "Likes matter because they look like proof that your post reached someone.", "좋아요가 신경 쓰이는 것은 내 게시물이 누군가에게 닿았는지 숫자로 확인할 수 있기 때문입니다.", "会在意点赞，是因为它看起来像投稿被别人看见的证据。"],
            sections: [
                [["数字は安心をくれる", "反応待ちは疲れやすい", "いいね以外の満足を作る"], ["Numbers give reassurance", "Waiting for reactions is tiring", "Create satisfaction beyond likes"], ["숫자는 안심을 준다", "반응 대기는 쉽게 지친다", "좋아요 외의 만족 만들기"], ["数字会带来安心", "等待反应容易疲惫", "创造点赞以外的满足"]],
                [["いいねがつくと、投稿してよかった、誰かに届いたという安心が生まれます。", "通知を開くたびに期待と落胆が起きると、投稿の楽しさより確認作業の疲れが大きくなります。", "投稿前に記録、交流、表現など目的を一つ決めると、数字だけに寄りかかりにくくなります。"], ["A like can make you feel that posting was worth it and that someone received it.", "If every notification check creates hope and disappointment, the checking becomes more exhausting than the posting.", "Before posting, choose one purpose such as memory, connection, or expression so the number is not everything."], ["좋아요가 붙으면 게시하길 잘했다, 누군가에게 닿았다는 안심이 생깁니다.", "알림을 열 때마다 기대와 실망이 반복되면 게시의 즐거움보다 확인 피로가 커집니다.", "게시 전에 기록, 교류, 표현 같은 목적을 하나 정하면 숫자에만 기대지 않게 됩니다."], ["点赞会让人觉得发帖是值得的、确实传达给了某个人。", "每次看通知都伴随期待和失落时，确认本身会比发帖更累。", "发帖前先决定记录、交流或表达等目的，就不容易只依赖数字。"]]
            ]
        },
        "maslow-social-media.html": {
            title: ["マズローの欲求とSNS時代の見られたい気持ち", "Maslow's Needs and the Desire to Be Seen", "매슬로 욕구와 SNS 시대의 보이고 싶은 마음", "马斯洛需求与SNS时代想被看见的心情"],
            lead: ["承認欲求は、誰かに評価されたい気持ちだけでなく、自分で自分を認めたい気持ちとも結びつきます。", "Approval desire is connected not only to being valued by others, but also to wanting to approve of yourself.", "승인욕구는 타인에게 평가받고 싶은 마음뿐 아니라 스스로를 인정하고 싶은 마음과도 연결됩니다.", "认同感欲求不仅与想被别人评价有关，也与想认可自己有关。"],
            sections: [
                [["外側からの承認と内側からの承認", "成長したい気持ちと安心したい気持ち", "診断結果を読むコツ"], ["External approval and internal approval", "Wanting growth and wanting safety", "How to read your result"], ["외부 인정과 내부 인정", "성장하고 싶은 마음과 안심하고 싶은 마음", "진단 결과 읽는 법"], ["外部认同与内部认同", "想成长和想安心", "阅读结果的诀窍"]],
                [["外側からの承認はいいねやコメント、内側からの承認は自分が納得できたかという感覚です。", "SNSでは目立ちたい気持ちと批判されたくない気持ちが同時に動きます。", "結果名は心理分類ではなくエンタメのラベルです。強い名前に振り回されず、軽く眺めてください。"], ["External approval is likes and comments. Internal approval is the feeling that your own standards were met.", "On SNS, the wish to stand out and the wish not to be criticized often move at the same time.", "The result name is an entertainment label, not a clinical category. Let it be a playful hint."], ["외부 인정은 좋아요와 댓글이고, 내부 인정은 스스로 납득했는지의 감각입니다.", "SNS에서는 눈에 띄고 싶은 마음과 비판받고 싶지 않은 마음이 동시에 움직입니다.", "결과명은 심리 분류가 아니라 엔터테인먼트 라벨입니다. 강한 이름에 휘둘리지 말고 가볍게 봐 주세요."], ["外部认同是点赞和评论，内部认同是自己是否满意的感觉。", "在SNS上，想突出和不想被批评的心情常常同时出现。", "结果名不是心理分类，而是娱乐标签。别被强烈的名字牵着走，轻松看看即可。"]]
            ]
        },
        "sns-comparison-fatigue.html": {
            title: ["SNSで人と比べて疲れるときの考え方", "When Comparing Yourself on SNS Gets Tiring", "SNS에서 남과 비교해 지칠 때", "在SNS上和别人比较到疲惫时"],
            lead: ["SNSの比較疲れは、他人のハイライトを連続で見続けることで起きやすくなります。", "Comparison fatigue often comes from watching other people's highlights one after another.", "SNS 비교 피로는 타인의 하이라이트를 계속 보는 데서 생기기 쉽습니다.", "SNS比较疲劳常常来自连续观看别人的高光片段。"],
            sections: [
                [["見えているのは一部だけ", "数字を順位表にしない", "見る時間を少しだけ設計する"], ["You only see a slice", "Do not turn numbers into rankings", "Design when you look"], ["보이는 것은 일부뿐", "숫자를 순위표로 만들지 않기", "보는 시간을 조금 설계하기"], ["看到的只是其中一部分", "不要把数字变成排名", "稍微设计观看时间"]],
                [["投稿は生活の全部ではなく、見せたい瞬間だけが並んでいることもあります。", "いいね数やフォロワー数にはタイミングや話題性など多くの要素が混ざります。", "朝は見ない、投稿直後は見ない、疲れている日はミュートするなど、見るタイミングを変えるだけでも楽になります。"], ["Posts are not a whole life; they are often selected moments.", "Likes and follower counts mix timing, topic, format, and luck.", "Changing when you look can help: not in the morning, not right after posting, or muting when tired."], ["게시물은 생활 전체가 아니라 보여주고 싶은 순간만 모인 것일 수 있습니다.", "좋아요 수와 팔로워 수에는 타이밍, 화제성, 형식, 운이 섞여 있습니다.", "아침에는 보지 않기, 게시 직후에는 보지 않기, 피곤한 날은 뮤트하기처럼 타이밍만 바꿔도 편해집니다."], ["投稿不是生活的全部，往往只是被选出来的瞬间。", "点赞数和粉丝数里混有时间、话题性、形式和运气。", "改变观看时机也会轻松一些：早上不看、刚发帖后不看、疲惫时静音。"]]
            ]
        },
        "sns-fatigue.html": {
            title: ["SNS疲れを軽くする投稿との付き合い方", "How to Ease SNS Fatigue", "SNS 피로를 줄이는 게시물과의 거리", "减轻SNS疲劳的相处方式"],
            lead: ["SNS疲れは、反応の受け取り方が少し過密になっているサインかもしれません。", "SNS fatigue may be a sign that the way you receive reactions has become too crowded.", "SNS 피로는 반응을 받아들이는 방식이 조금 과밀해졌다는 신호일 수 있습니다.", "SNS疲劳也许是接收反应的方式变得过于拥挤的信号。"],
            sections: [
                [["通知を全部「今すぐ」にしない", "比べる対象を減らす", "投稿目的を一つに絞る"], ["Do not make every notification immediate", "Reduce comparison targets", "Choose one purpose for a post"], ["모든 알림을 지금 바로로 만들지 않기", "비교 대상을 줄이기", "게시 목적을 하나로 정하기"], ["不要让所有通知都变成“立刻”", "减少比较对象", "给一条投稿定一个目的"]],
                [["投稿後だけ通知を見る、夜だけ通知を切るなど、反応を見る速度を自分で調整します。", "見るたびに落ち込むアカウントとは、一時的に距離を置いてもかまいません。", "記録、交流、宣伝、表現など、目的を一つに絞ると期待値が整います。"], ["Choose when to check reactions, such as only after posting or not at night.", "It is okay to step away from accounts that make you feel worse every time.", "A post can be for memory, connection, promotion, or expression. Choosing one purpose calms expectations."], ["게시 후에만 알림을 보거나 밤에는 알림을 끄는 등 반응을 보는 속도를 스스로 조절합니다.", "볼 때마다 기분이 가라앉는 계정과는 잠시 거리를 두어도 됩니다.", "기록, 교류, 홍보, 표현 중 목적을 하나로 정하면 기대치가 정리됩니다."], ["比如只在发帖后看通知、晚上关闭通知，自己调整查看反应的速度。", "每次看都会低落的账号，可以暂时保持距离。", "在记录、交流、宣传、表达中选一个目的，期待值会更清楚。"]]
            ]
        },
        "result-types.html": {
            title: ["16タイプ診断結果の楽しみ方", "How to Enjoy the 16 Result Types", "16가지 진단 결과 즐기는 법", "16种诊断结果的玩法"],
            lead: ["強めのタイプ名は、あなたを決めつけるためではなく、SNS上のクセを笑える距離に置くためのものです。", "The intense type names are not meant to define you. They create a playful distance from SNS habits.", "강한 유형명은 당신을 단정하기 위한 것이 아니라 SNS 습관을 웃으며 떨어져 보기 위한 것입니다.", "强烈的类型名不是为了定义你，而是让你和SNS习惯拉开一点好笑的距离。"],
            sections: [
                [["タイプ名はあだ名として受け取る", "スコアは強弱の目安", "共有はネタとして"], ["Treat the type name as a nickname", "The score is a rough intensity guide", "Share it as a joke"], ["유형명은 별명처럼 받아들이기", "점수는 강약의 기준", "공유는 가벼운 소재로"], ["把类型名当作昵称", "分数只是强弱参考", "分享时当作话题"]],
                [["専門的な心理分類ではなく、今日はこういう傾向が出たのかと眺めるくらいがちょうどよい読み方です。", "高いから悪い、低いから正しいというものではありません。その日のSNSとの距離感を表します。", "Xで共有するときは、結果名を会話のきっかけとして使うのがおすすめです。"], ["It is not a professional psychological category. Read it as a light hint about today's tendency.", "High is not bad and low is not correct. It shows your current distance from SNS.", "When sharing on X, use the result name as a conversation starter."], ["전문적인 심리 분류가 아니라 오늘 이런 경향이 나왔구나 정도로 보는 것이 좋습니다.", "높다고 나쁘고 낮다고 옳은 것은 아닙니다. 그날의 SNS와의 거리감을 보여 줍니다.", "X에 공유할 때는 결과명을 대화의 시작점으로 쓰면 좋습니다."], ["这不是专业心理分类，轻松理解成今天出现了这种倾向就好。", "高不代表坏，低不代表正确。它只是表示此刻与SNS的距离。", "在X分享时，可以把结果名当作聊天开头。"]]
            ]
        },
        "how-to-share-results.html": {
            title: ["診断結果をXでシェアして遊ぶコツ", "Tips for Sharing Your Result on X", "결과를 X에 공유하며 즐기는 법", "在X分享结果的玩法"],
            lead: ["診断結果は、友だちと見せ合うとぐっと楽しくなります。", "The result becomes more fun when you show it to friends.", "진단 결과는 친구와 보여 주고 비교하면 훨씬 재미있어집니다.", "诊断结果和朋友互相展示会更有趣。"],
            sections: [
                [["まず結果画像を保存する", "X投稿では一言コメントを足す", "画像とハッシュタグを一緒に使う"], ["Save the result image first", "Add one personal line on X", "Use the image and hashtag together"], ["먼저 결과 이미지를 저장하기", "X 게시물에는 한마디를 더하기", "이미지와 해시태그를 함께 쓰기"], ["先保存结果图片", "在X投稿中加一句自己的话", "图片和标签一起使用"]],
                [["結果画面の保存ボタンからチェキ風画像を端末に保存できます。", "「これは当たってる」「友だちの結果も見たい」など一言を足すと反応が返りやすくなります。", "保存した画像と診断URL、ハッシュタグを一緒に使うと、見た人が試しやすくなります。"], ["Use the save button on the result screen to keep the Cheki-style image on your device.", "A small comment like “this is too accurate” or “I want to see yours” makes replies easier.", "Using the image, diagnosis URL, and hashtag together makes it easy for others to try."], ["결과 화면의 저장 버튼으로 체키풍 이미지를 단말기에 저장할 수 있습니다.", "“이거 맞는 듯”, “친구 결과도 보고 싶다” 같은 한마디를 더하면 반응이 오기 쉽습니다.", "저장한 이미지, 진단 URL, 해시태그를 함께 쓰면 본 사람이 바로 시도하기 쉽습니다."], ["可以通过结果页的保存按钮把拍立得风格图片保存到设备。", "加一句“太准了”或“想看朋友的结果”，更容易收到回应。", "把保存的图片、诊断URL和标签一起使用，看到的人更容易尝试。"]]
            ]
        }
    };

    function normalizeLang(lang) {
        return SUPPORTED.includes(lang) ? lang : "ja";
    }

    function getLang() {
        const params = new URLSearchParams(window.location.search);
        if (params.has("lang")) return normalizeLang(params.get("lang"));
        try {
            const stored = localStorage.getItem(LANG_STORAGE_KEY);
            if (SUPPORTED.includes(stored)) return stored;
        } catch (_) {}
        return "ja";
    }

    function setLang(lang) {
        try {
            localStorage.setItem(LANG_STORAGE_KEY, lang);
        } catch (_) {}
    }

    function currentKey() {
        let path = window.location.pathname;
        if (path.endsWith("/")) path += "index.html";
        const parts = path.split("/").filter(Boolean);
        const last = parts[parts.length - 1] || "index.html";
        if (parts.includes("articles")) {
            return `articles/${last.includes(".") ? last : `${last}.html`}`;
        }
        return last.includes(".") ? last : `${last}.html`;
    }

    function link(href, lang) {
        const url = new URL(href, window.location.href);
        url.searchParams.set("lang", lang);
        return url.href;
    }

    function languageControl(lang) {
        const l = labels[lang];
        return `<div class="static-lang-shell"><label>${l.select}<select id="staticLangSelect"><option value="ja">日本語 (JA)</option><option value="en">English (EN)</option><option value="ko">한국어 (KO)</option><option value="zh">简体中文 (ZH)</option></select></label></div>`;
    }

    function adSlot(lang) {
        return `<div class="article-ad js-ad-slot" aria-label="${labels[lang].ad}"><span class="ad-label">${labels[lang].ad}</span></div>`;
    }

    function articleHtml(copy, lang) {
        const idx = SUPPORTED.indexOf(lang);
        const headings = copy.sections[0][idx];
        const texts = copy.sections[1][idx];
        return `<h1>${copy.title[idx]}</h1><p class="lead">${copy.lead[idx]}</p><h2>${headings[0]}</h2><p>${texts[0]}</p>${adSlot(lang)}<h2>${headings[1]}</h2><p>${texts[1]}</p><h2>${headings[2]}</h2><p>${texts[2]}</p>`;
    }

    function articleIndexHtml(lang) {
        const items = articleList[lang].map(([href, title, desc]) => `<a class="article-link" href="${link(href, lang)}">${title}<span>${desc}</span></a>`).join("");
        return `${pages["articles/index.html"].html[lang]}<div class="article-list">${items}</div>${adSlot(lang)}`;
    }

    function footerHtml(lang, inArticles) {
        const l = labels[lang];
        const prefix = inArticles ? "../" : "";
        return `<a href="${link(`${prefix}privacy.html`, lang)}">${l.privacy}</a> / <a href="${link(`${prefix}contact.html`, lang)}">${l.contact}</a> / <a href="${link(`${prefix}about.html`, lang)}">${l.about}</a>`;
    }

    function bottomLinks(lang, inArticles, includeColumns) {
        const l = labels[lang];
        const home = link(inArticles ? "../index.html" : "index.html", lang);
        if (includeColumns) {
            const columns = link(inArticles ? "index.html" : "articles/index.html", lang);
            return `<p><a href="${home}">${l.back}</a> / <a href="${columns}">${l.articles}</a></p>`;
        }
        if (inArticles) return `<p><a href="${link("index.html", lang)}">${l.columns}</a> / <a href="${home}">${l.back}</a></p>`;
        return `<p><a href="${home}">${l.back}</a></p>`;
    }

    function installStyles() {
        if (document.getElementById("static-i18n-style")) return;
        const style = document.createElement("style");
        style.id = "static-i18n-style";
        style.textContent = `
            .static-lang-shell { display:flex; justify-content:flex-end; margin-bottom:18px; }
            .static-lang-shell label { color:#8B7B7E; font-size:0.82rem; font-weight:700; }
            #staticLangSelect { margin-left:8px; padding:7px 10px; border:2px solid #FFB7C5; border-radius:10px; background:#FFF; color:#4A3C3F; font-weight:700; }
            .note { background:#FFFACD; border:2px solid #FCE17D; border-radius:12px; padding:14px; }
        `;
        document.head.appendChild(style);
    }

    function render() {
        const lang = getLang();
        setLang(lang);
        installStyles();
        document.documentElement.lang = lang;

        const key = currentKey();
        const main = document.querySelector("main");
        if (!main) return;

        let html = "";
        const inArticles = key.startsWith("articles/");
        if (key === "articles/index.html") {
            html = articleIndexHtml(lang);
            document.title = pages[key].title[lang];
        } else if (inArticles && articlePages[key.replace("articles/", "")]) {
            const copy = articlePages[key.replace("articles/", "")];
            html = articleHtml(copy, lang);
            document.title = `${copy.title[SUPPORTED.indexOf(lang)]} | ${i18nTitle(lang)}`;
        } else if (pages[key]) {
            html = pages[key].html[lang];
            document.title = pages[key].title[lang];
        } else {
            return;
        }

        main.innerHTML = `${languageControl(lang)}${html}${bottomLinks(lang, inArticles, key === "404.html")}`;
        const select = document.getElementById("staticLangSelect");
        if (select) {
            select.value = lang;
            select.addEventListener("change", event => {
                const nextLang = normalizeLang(event.target.value);
                setLang(nextLang);
                const url = new URL(window.location.href);
                url.searchParams.set("lang", nextLang);
                window.location.href = url.href;
            });
        }

        const footer = document.querySelector("footer");
        if (footer) footer.innerHTML = footerHtml(lang, inArticles);
    }

    function i18nTitle(lang) {
        return {
            ja: "SNS承認欲求モンスター診断",
            en: "SNS Recognition Monster Diagnosis",
            ko: "SNS 승인욕구 몬스터 진단",
            zh: "SNS认同感怪物诊断"
        }[lang];
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", render);
    } else {
        render();
    }
})();
