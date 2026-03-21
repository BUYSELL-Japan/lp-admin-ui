import type {
  HeaderData,
  HeroData,
  AboutData,
  MenuData,
  StoreInfoData,
  ContactData,
  FooterData,
  GalleryData,
  StaffData,
  ReviewsData,
  NewsData,
  AccessData,
  FAQData,
  CTAData,
  PricingData,
  CompanyData
} from './types';

export const headerData: HeaderData = {
  logo: {
    text: '和ダイニング 結 -YUI-',
  },
  navigation: [
    { id: 'about', label: 'コンセプト' },
    { id: 'menu', label: 'メニュー' },
    { id: 'pricing', label: 'コース・プラン' },
    { id: 'cta', label: 'ご予約' },
    { id: 'gallery', label: 'ギャラリー' },
    { id: 'staff', label: 'スタッフ' },
    { id: 'reviews', label: 'お客様の声' },
    { id: 'news', label: 'お知らせ' },
    { id: 'storeInfo', label: '店舗情報' },
    { id: 'company', label: '運営会社' },
    { id: 'access', label: 'アクセス' },
    { id: 'faq', label: 'よくある質問' },
    { id: 'contact', label: 'お問い合わせ' },
  ],
};

export const heroData: HeroData = {
  sectionTitle: '四季を味わう、\nくつろぎの空間',
  subtitle: '厳選された旬の食材と、心温まるおもてなし',
  backgroundImage: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=1920&q=90',
};

export const aboutData: AboutData = {
  sectionTitle: '私たちのこだわり',
  features: [
    {
      title: '伝統と革新の味わい',
      description: '創業以来守り続けてきた秘伝の出汁。厳選された素材から丁寧に取った出汁が、料理の奥深い味わいのベースとなっています。',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    },
    {
      title: '職人の手仕事',
      description: '毎朝仕込む自家製麺や、手間暇を惜しまない仕込み。職人が一つ一つの工程に心を込め、最高の状態でお客様に提供します。',
      image: 'https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?w=800&q=80',
    },
    {
      title: '厳選された旬の食材',
      description: '契約農家から直送される新鮮な野菜や、市場で厳選した旬の魚介類。四季折々の素材の良さを最大限に引き出します。',
      image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80',
    },
  ],
};

export const menuData: MenuData = {
  sectionTitle: 'お品書き',
  sectionSubtitle: '心を込めてお作りする、こだわりの一皿',
  items: [
    {
      name: '特製和風御膳',
      price: '¥1,800',
      description: '旬の食材をふんだんに使った当店一番人気の御膳',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=80',
    },
    {
      name: '季節の天ぷら盛り合わせ',
      price: '¥1,500',
      description: 'サクサクの衣と旬の野菜・魚介の豊かな風味',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    },
    {
      name: '極上肉豆腐',
      price: '¥1,200',
      description: 'じっくり煮込んだ特選牛と滑らかな手作り豆腐',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
    },
    {
      name: '旬魚のお造り三点盛り',
      price: '¥1,600',
      description: 'その日に水揚げされた新鮮な魚介を厳選',
      image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=600&q=80',
    },
    {
      name: '自家製つくね',
      price: '¥850',
      description: '軟骨の食感がアクセントの自家製鶏つくね',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80',
    },
    {
      name: '海老と野菜の和風サラダ',
      price: '¥950',
      description: '特製和風ドレッシングでさっぱりと',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80',
    },
    {
      name: '特選牛の炙り焼き',
      price: '¥2,400',
      description: '上質な肉の旨味を閉じ込めた逸品',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    },
    {
      name: '冷やし梅うどん',
      price: '¥1,000',
      description: '夏季限定、さっぱりとした梅の風味が食欲をそそる',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=80',
    },
    {
      name: 'ふんわり出汁巻き卵',
      price: '¥780',
      description: '特製出汁をたっぷりと含んだ優しい味わい',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
    },
  ],
};

export const storeInfoData: StoreInfoData = {
  sectionTitle: '店舗情報',
  items: [
    {
      icon: 'MapPin',
      title: '所在地',
      content: '東京都渋谷区〇〇 1-2-3',
    },
    {
      icon: 'Clock',
      title: '営業時間',
      content: 'ランチ 11:30-14:30 / ディナー 17:30-22:30',
    },
    {
      icon: 'Phone',
      title: '電話番号',
      content: '03-XXXX-XXXX',
    },
    {
      icon: 'Mail',
      title: 'メール',
      content: 'info@example.com',
    },
  ],
  mainImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
  mainImageCaption: '温かみのある落ち着いた空間で、ごゆっくりとお過ごしください',
};

export const contactData: ContactData = {
  sectionTitle: 'お問い合わせ',
  sectionSubtitle: 'ご予約やご質問など、お気軽にお問い合わせください',
  fields: {
    name: 'お名前',
    email: 'メールアドレス',
    subject: '件名',
    message: 'お問い合わせ内容',
  },
  submitButton: '送信する',
};

export const galleryData: GalleryData = {
  sectionTitle: 'ギャラリー',
  sectionSubtitle: '料理や店内の雰囲気をご覧ください',
  categories: ['すべて', '料理', '店内', 'イベント'],
  images: [
    { url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80', caption: '季節の特別御膳', category: '料理', categoryId: '1' },
    { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', caption: 'こだわりの調理風景', category: '料理', categoryId: '1' },
    { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', caption: '温かみのある店内', category: '店内', categoryId: '2' },
    { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', caption: 'カウンター席', category: '店内', categoryId: '2' },
    { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80', caption: '人気の天ぷら', category: '料理', categoryId: '1' },
    { url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80', caption: '旬の食材', category: '料理', categoryId: '1' },
    { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', caption: 'テーブル席', category: '店内', categoryId: '2' },
    { url: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800&q=80', caption: 'お造り盛り合わせ', category: '料理', categoryId: '1' },
    { url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80', caption: '季節のイベント', category: 'イベント', categoryId: '3' },
  ],
};

export const staffData: StaffData = {
  sectionTitle: 'スタッフ紹介',
  sectionSubtitle: '心を込めてお迎えする、私たちのチーム',
  members: [
    {
      name: '山田 太郎',
      role: 'オーナー・料理長',
      description: '和食一筋30年。伝統の味を守りながら、新しい食材や調理法への挑戦も続けています。',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&q=80',
    },
    {
      name: '佐藤 花子',
      role: 'フロアマネージャー',
      description: 'お客様一人ひとりに合わせた、心地よいサービスと空間づくりを心がけています。',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
    },
    {
      name: '鈴木 次郎',
      role: 'ホールスタッフ',
      description: '明るく丁寧な接客でお客様をおもてなしいたします。お酒の知識も豊富です。',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    },
  ],
};

export const reviewsData: ReviewsData = {
  sectionTitle: 'お客様の声',
  sectionSubtitle: 'ご来店いただいたお客様からのメッセージ',
  reviews: [
    {
      name: '田中 良太',
      rating: 5,
      comment: '会社の接待で利用しましたが、料理の質・接客ともに素晴らしく、ゲストにも大変喜んでいただけました。また利用させていただきます。',
      date: '2024-11-15',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    },
    {
      name: '佐藤 美香',
      rating: 5,
      comment: '友人のお祝いでコース料理をお願いしました。最後のデザートプレートまで、心のこもった演出が嬉しかったです。',
      date: '2024-11-10',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    },
    {
      name: '鈴木 健一',
      rating: 4,
      comment: '旬の魚がとても美味しかったです。静かな店内でゆっくりと食事を楽しむことができました。',
      date: '2024-11-05',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    },
  ],
};

export const newsData: NewsData = {
  sectionTitle: 'お知らせ',
  sectionSubtitle: '最新のメニュー情報や営業に関するお知らせ',
  items: [
    {
      date: '2024-12-01',
      category: '営業情報',
      title: '年末年始の営業時間のご案内',
      content: '平素は当店をご利用いただき誠にありがとうございます。12月31日、1月1日はお休みとさせていただきます。',
    },
    {
      date: '2024-11-20',
      category: '新メニュー',
      title: '冬の特別会席コース開始のお知らせ',
      content: '冬の味覚をふんだんに取り入れた会席コースのご提供を開始いたしました。忘新年会にもおすすめです。',
    },
    {
      date: '2024-10-15',
      category: 'お知らせ',
      title: 'テイクアウト・デリバリー対応のお知らせ',
      content: 'ご自宅でも当店の味をお楽しみいただけるよう、テイクアウトメニューをご用意いたしました。',
    },
  ],
};

export const accessData: AccessData = {
  sectionTitle: 'アクセス',
  sectionSubtitle: '店舗へのご案内',
  address: '東京都渋谷区〇〇 1-2-3',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.1447437301044!2d127.68589831501648!3d26.21424098342371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e56bd0b4a42ff1%3A0x36812e0e598f7d6b!2z54CP6Yar!5e0!3m2!1sja!2sjp!4v1234567890123!5m2!1sja!2sjp',
  parking: {
    title: '駐車場のご案内',
    description: '近隣の提携コインパーキングをご利用ください。',
    spaces: '提携駐車場 約5台',
    notes: 'お食事のお客様には1時間分のサービス券をお渡ししております。',
  },
  transportation: {
    title: '公共交通機関をご利用の方',
    methods: [
      { type: '電車', description: '〇〇線「××駅」西口より徒歩5分' },
      { type: 'バス', description: '「△△2丁目」バス停より徒歩2分' },
      { type: 'タクシー', description: '〇〇駅より約5分' },
    ],
  },
};

export const ctaData: CTAData = {
  sectionTitle: 'ご予約・お問い合わせ',
  sectionSubtitle: '皆様のご来店を心よりお待ちしております',
  description: '記念日のお祝いや接待など、様々なシーンでご利用いただけます。人数に合わせた個室やプランのご提案も承ります。',
  buttons: [
    { text: 'お電話でご予約', link: '#contact', type: 'primary' },
    { text: 'Webでお問い合わせ', link: '#contact', type: 'secondary' },
  ],
  backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80',
};

export const pricingData: PricingData = {
  sectionTitle: 'コース・プラン',
  sectionSubtitle: 'ご利用シーンに合わせた各種プラン',
  plans: [
    {
      name: 'ランチ限定コース',
      description: 'お昼のお集まりに最適な全5品のショートコース',
      price: '3,500円',
      features: [
        '季節の前菜盛り合わせ',
        '本日のお造り',
        '特製焼き物',
        'お食事',
        'デザート・食後のコーヒー',
      ],
    },
    {
      name: '季節の会席コース',
      description: '旬の食材を最も美味しく味わえる当店一番人気',
      price: '6,800円',
      features: [
        '先付・八寸',
        'お造り三点盛り',
        '旬の焼き魚',
        '季節の天ぷら',
        '特選牛の炙り',
        '土鍋ご飯',
        '本日のデザート',
      ],
      isPopular: true,
    },
    {
      name: '特選おまかせコース',
      description: '大切な記念日や接待向けの最高級プラン',
      price: '12,000円',
      features: [
        '贅を尽くした前菜',
        '厳選鮮魚の豪華お造り',
        '高級魚の煮付け',
        '特選和牛ステーキ',
        '握り寿司 または 特製土鍋ご飯',
        '季節のデザート盛り合わせ',
        '乾杯ドリンク付き',
        '完全個室確約',
      ],
    },
  ],
  note: '※価格は税込表示です。※食材の仕入れ状況により内容が変更になる場合がございます。',
};

export const companyData: CompanyData = {
  sectionTitle: '運営会社情報',
  sectionSubtitle: '食を通じて地域社会に貢献する',
  philosophy: {
    title: '経営理念',
    content: '「日本の豊かな食文化を次世代へ伝え、お客様に心からの感動と喜びを提供する」ことを使命としています。厳選された安心・安全な食材と、熟練の職人技、そして真心を込めたおもてなしにより、お客様の素晴らしい思い出づくりに貢献してまいります。',
  },
  history: {
    title: '沿革',
    timeline: [
      { year: '2015年', event: '株式会社YUIダイニング設立' },
      { year: '2016年', event: '第1号店「和ダイニング 結」オープン' },
      { year: '2019年', event: 'デリバリー・ケータリング事業を開始' },
      { year: '2023年', event: '食育・地域貢献活動として地元小学校での料理教室を支援' },
    ],
  },
  companyInfo: {
    title: '会社概要',
    items: [
      { label: '商号', value: '株式会社YUIダイニング' },
      { label: '設立', value: '2015年4月' },
      { label: '代表者', value: '山田 太郎' },
      { label: '所在地', value: '東京都渋谷区〇〇 1-2-3' },
      { label: '事業内容', value: '飲食店経営、ケータリングサービス' },
      { label: '従業員数', value: '約50名（パート・アルバイト含む）' },
    ],
  },
};

export const faqData: FAQData = {
  sectionTitle: 'よくあるご質問',
  sectionSubtitle: 'お客様からのご質問にお答えします',
  items: [
    {
      question: '予約はいつ前から可能ですか？',
      answer: '当日から2ヶ月先までのご予約を承っております。週末や祝日は混み合うことが多いため、お早めのご予約をおすすめいたします。',
    },
    {
      question: '個室はありますか？',
      answer: 'はい、2名様から12名様までご利用いただける個室を3室ご用意しております。個室利用料はかかりませんが、要予約となります。',
    },
    {
      question: 'アレルギー対応は可能ですか？',
      answer: '事前にお伝えいただければ、可能な限り対応させていただきます。ご予約の際に、苦手な食材やアレルギーをお申し付けください。',
    },
    {
      question: 'クレジットカード・電子マネーは利用できますか？',
      answer: '各種クレジットカード（VISA, MasterCard, JCB, AMEX, Diners）と、一部の電子マネー（Suica, PASMO等）、QR決済（PayPay, 楽天Pay等）をご利用いただけます。',
    },
    {
      question: 'サプライズケーキなどは用意してもらえますか？',
      answer: '記念日のデザートプレート（メッセージ付き）を無料でご用意可能です。ホールケーキ等のご用意も有料にて承りますので、事前にご相談ください。',
    },
  ],
};

export const footerData: FooterData = {
  logo: '和ダイニング 結 -YUI-',
  description: 'くつろぎの空間で、\n特別なひとときをお過ごしください。',
  businessHours: {
    title: '営業時間',
    days: '月曜日 - 日曜日',
    hours: 'ランチ 11:30-14:30 / ディナー 17:30-22:30',
    closedDay: '定休日: 不定休',
  },
  social: {
    title: 'SNSアカウント',
    links: [
      { platform: 'Facebook', url: '#' },
      { platform: 'Instagram', url: '#' },
      { platform: 'Twitter', url: '#' },
    ],
  },
  copyright: '© 2024 和ダイニング 結 -YUI-. All rights reserved.',
};
