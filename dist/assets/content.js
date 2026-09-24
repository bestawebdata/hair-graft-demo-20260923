/* 医療情報・料金・会場の更新元。原資料の確認を経て更新してください。 */
window.SITE_CONTENT = {
  treatment: {
    name: "毛根グラフト再生治療",
    price: "30",
    priceUnit: "万円",
    priceStatus: "仮表示・検討中",
  },
  venue: {
    text: "伊丹市内の提携医療機関等で実施予定",
    status: "契約・会場調整中",
    date: "開催日未定",
  },
  doctor: {
    name: "上田 敬博",
    credential: "医学博士",
    english: "Takahiro Ueda",
    headline: "熱傷治療で培った経験を、毛髪の治療へ。",
    introduction: "上田敬博医師は、2009年から自家培養表皮を用いた熱傷治療に携わり、2023年に毛根再生医療を開始。自分自身の皮膚組織を治療に生かす臨床経験を、髪の悩みに向き合う治療へつなげています。",
    availability: "各地域の担当医は、開催日程とあわせてご案内します。",
    gallery: [
      {
        image: "assets/doctor/ueda-clinical.webp",
        width: 800,
        height: 919,
        alt: "診療中の上田敬博医師",
        label: "臨床の現場から",
        caption: "上田敬博医師の診療風景",
        className: "clinical",
      },
      {
        image: "assets/doctor/ueda-isbi-2018.webp",
        width: 1400,
        height: 935,
        alt: "ISBI 2018の会場で発表する上田敬博医師",
        label: "学術活動の記録",
        caption: "国際熱傷学会 ISBI 2018・インド／デリー",
        className: "academic",
      },
    ],
    source:
      "提供された治療説明資料に記載された経歴の抜粋です。現在の所属・役職、診療・監修体制は公開前に確認します。",
    career: [
      ["1999", "近畿大学医学部 卒業"],
      ["2009", "自家培養表皮を用いた熱傷治療を開始"],
      ["2014", "兵庫医科大学大学院 修了"],
      ["2018", "近畿大学救急医学講師・熱傷センター長"],
      ["2020", "鳥取大学医学部附属病院 救命救急センター教授"],
      ["2023", "健常皮膚を用いた毛根再生医療を開始"],
    ],
  },
  treatmentVisuals: {
    equipment: {
      image: "assets/treatment/rigenera-n4sa.webp",
      width: 735,
      height: 865,
      alt: "皮膚組織を微細化する機器、リジェネラN4SA",
      name: "リジェネラ N4SA",
      source: "N4SAカタログ（2023.10）1ページより",
    },
    cartridge: {
      image: "assets/treatment/cartridge-holder.webp",
      width: 457,
      height: 563,
      alt: "専用カートリッジとホルダー",
      caption: "専用カートリッジとホルダー",
      source: "AGA説明資料 3ページより",
    },
    procedurePhotos: [
      {
        image: "assets/treatment/tissue-preparation.webp",
        width: 960,
        height: 731,
        alt: "手袋をした手で採取した皮膚組織を処理している場面",
        label: "採取した皮膚組織の処理",
        caption: "採取した皮膚組織を処理し、注入に向けた準備を進めます。",
        source: "AGA説明資料 59ページより",
      },
      {
        image: "assets/treatment/scalp-injection.webp",
        width: 960,
        height: 1020,
        alt: "注射器で頭皮へ注入している場面",
        label: "頭皮への注入",
        caption: "作成した注入液を、薄毛が気になる頭皮へ少量ずつ注入します。",
        source: "AGA説明資料 60ページより",
      },
    ],
    note: "写真は機器・施術工程のイメージです。使用する機器や施術場所は、ご案内時にお知らせします。",
  },
  regions: [
    { id: "itami", name: "伊丹市・阪神エリア", status: "初期開催を検討中" },
    { id: "kobe", name: "神戸エリア", status: "ご希望を伺う候補地域" },
    { id: "osaka", name: "大阪エリア", status: "ご希望を伺う候補地域" },
    { id: "other", name: "その他の地域", status: "地域名をご入力ください" },
  ],
  medical: {
    overview:
      "耳の後ろから少量の皮膚組織を採取し、専用の機器で細かくした注入液を、薄毛が気になる頭皮へ注入する治療です。",
    purpose:
      "毛髪の太さや密度の改善、発毛の促進が期待できる治療です。細くなった髪や、気になるボリュームに、自分自身の皮膚組織を用いてアプローチします。",
    purposeNote:
      "効果には個人差があり、十分な効果が得られない場合もあります。完全な無毛部では効果が限定的な場合があります。",
    duration: "30〜60分程度",
    highlights: [
      { title: "採取する皮膚組織は少量", text: "局所麻酔を行い、耳の後ろから米粒大の皮膚組織を少量採取します。" },
      { title: "施術は約30〜60分", text: "施術後は当日帰宅できます。診察などを含む所要時間は、日程のご案内時にお知らせします。" },
      { title: "翌日から洗髪が可能", text: "術後の状態に合わせてケアをご案内します。洗髪の時期や方法は、担当医の指示に従ってください。" },
    ],
    aftercareNote: "赤み・腫れ・内出血が数日〜1週間ほど続く場合があります。施術後数日は、激しい運動・飲酒・サウナを控えてください。",
    steps: [
      {
        title: "診察・ご説明",
        text: "医師が頭皮の状態や治療経験を確認。治療内容・費用・リスクの説明を受け、同意のうえで進みます。",
      },
      {
        title: "皮膚組織の採取",
        text: "局所麻酔のもと、耳の後ろから少量の皮膚組織を採取します。",
      },
      {
        title: "注入液の作成・頭皮へ注入",
        text: "リジェネラ装置で皮膚組織を微細化し、作成した注入液を頭皮の薄毛部へ注入します。",
      },
      {
        title: "施術後のケア・経過観察",
        text: "施術後は当日帰宅できます。医師の指示に沿ってケアを行い、経過を確認します。翌日から洗髪が可能です。",
      },
    ],
    risks: [
      "採取部の痛み・赤み・腫れ・違和感",
      "頭皮の腫れ・内出血・圧痛",
      "感染の可能性",
      "アレルギー反応の可能性（自分自身の皮膚組織でもゼロではありません）",
      "効果が不十分、または得られない可能性",
    ],
    downtime: [
      ["赤み・腫れ・内出血", "注射部の症状が続く期間は、数日〜1週間が目安です。"],
      [
        "洗髪",
        "翌日から洗髪が可能です。術後の状態に合わせ、担当医の指示に従ってください。",
      ],
      [
        "運動・飲酒など",
        "施術後数日は、激しい運動・飲酒・サウナを控えてください。",
      ],
    ],
    precautions:
      "重度の皮膚疾患、感染症、免疫不全、出血傾向のある方などは施術できない場合があります。妊娠中・授乳中は原則として施術できません。適応は医師が判断します。",
  },
  // 2026-09-23：医師監修パンフレットの写真使用についてユーザー確認済み。
  // 撮影条件・施術回数等の未提示情報を確認済みに置き換えない。
  brochureGallery: {
    "enabled": true,
    "publicationAuthorized": true,
    "source": "治療説明パンフレット（10ページ資料）6ページ",
    "intro": "術前と治療後の写真で、髪の変化をご覧ください。",
    "note": "治療結果には個人差があり、同様の結果を保証するものではありません。",
    "details": "掲載写真ごとの施術回数・併用治療・当時の費用は確認中です。",
    "records": [
      {
        "id": "brochure-01",
        "title": "経過写真 01",
        "sourcePosition": "原資料の左列・1段目",
        "observations": [
          {
            "label": "術前",
            "image": "assets/cases/brochure-01-before.webp",
            "width": 223,
            "height": 165,
            "alt": "経過写真01・術前"
          },
          {
            "label": "4か月後",
            "image": "assets/cases/brochure-01-after.webp",
            "width": 228,
            "height": 165,
            "alt": "経過写真01・4か月後"
          }
        ]
      },
      {
        "id": "brochure-02",
        "title": "経過写真 02",
        "sourcePosition": "原資料の左列・2段目",
        "observations": [
          {
            "label": "術前",
            "image": "assets/cases/brochure-02-before.webp",
            "width": 223,
            "height": 168,
            "alt": "経過写真02・術前"
          },
          {
            "label": "4か月後",
            "image": "assets/cases/brochure-02-after.webp",
            "width": 228,
            "height": 168,
            "alt": "経過写真02・4か月後"
          }
        ]
      },
      {
        "id": "brochure-03",
        "title": "経過写真 03",
        "sourcePosition": "原資料の左列・3段目",
        "observations": [
          {
            "label": "術前",
            "image": "assets/cases/brochure-03-before.webp",
            "width": 223,
            "height": 207,
            "alt": "経過写真03・術前"
          },
          {
            "label": "4か月後",
            "image": "assets/cases/brochure-03-after.webp",
            "width": 228,
            "height": 207,
            "alt": "経過写真03・4か月後"
          }
        ]
      },
      {
        "id": "brochure-04",
        "title": "経過写真 04",
        "sourcePosition": "原資料の右列・1段目",
        "observations": [
          {
            "label": "術前",
            "image": "assets/cases/brochure-04-before.webp",
            "width": 224,
            "height": 182,
            "alt": "経過写真04・術前"
          },
          {
            "label": "4か月後",
            "image": "assets/cases/brochure-04-after.webp",
            "width": 236,
            "height": 182,
            "alt": "経過写真04・4か月後"
          }
        ]
      },
      {
        "id": "brochure-05",
        "title": "経過写真 05",
        "sourcePosition": "原資料の右列・2段目",
        "observations": [
          {
            "label": "術前",
            "image": "assets/cases/brochure-05-before.webp",
            "width": 230,
            "height": 213,
            "alt": "経過写真05・術前"
          },
          {
            "label": "4か月後",
            "image": "assets/cases/brochure-05-after.webp",
            "width": 229,
            "height": 213,
            "alt": "経過写真05・4か月後"
          }
        ]
      },
      {
        "id": "brochure-06",
        "title": "経過写真 06",
        "sourcePosition": "原資料の右列・3段目",
        "observations": [
          {
            "label": "術前",
            "image": "assets/cases/brochure-06-before.webp",
            "width": 230,
            "height": 142,
            "alt": "経過写真06・術前"
          },
          {
            "label": "4か月後",
            "image": "assets/cases/brochure-06-after.webp",
            "width": 236,
            "height": 142,
            "alt": "経過写真06・4か月後"
          }
        ]
      }
    ]
  },
  // 今後の経過記録。既存パンフレットの比較写真は上のbrochureGalleryで管理。
  // スキーマは docs/case-template.json と docs/DATA_MODEL.md を参照。
  cases: [],
};
