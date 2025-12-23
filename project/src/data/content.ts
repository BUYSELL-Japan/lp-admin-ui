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
    text: '琉球そば',
  },
  navigation: [
    { id: 'about', label: 'こだわり' },
    { id: 'menu', label: 'お品書き' },
    { id: 'pricing', label: 'コース・プラン' },
    { id: 'gallery', label: 'ギャラリー' },
    { id: 'staff', label: 'スタッフ' },
    { id: 'reviews', label: 'お客様の声' },
    { id: 'news', label: 'お知らせ' },
    { id: 'company', label: '事業所概要' },
    { id: 'access', label: 'アクセス' },
    { id: 'faq', label: 'よくある質問' },
    { id: 'contact', label: 'お問い合わせ' },
  ],
};

export const heroData: HeroData = {
  title: '琉球の魂を\n一杯に込めて',
  subtitle: '伝統の味わい、自家製麺へのこだわり',
  backgroundImage: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=1920&q=90',
};

export const aboutData: AboutData = {
  sectionTitle: '私たちのこだわり',
  features: [
    {
      title: '伝統の味わい',
      description: '創業以来守り続けてきた秘伝の出汁。鰹節と豚骨を丁寧に煮込み、沖縄の海の恵みを凝縮した深い味わいを実現しています。',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    },
    {
      title: '自家製麺へのこだわり',
      description: '毎朝手打ちする麺は、小麦の香りと独特のコシが特徴。職人が一本一本心を込めて打ち上げる麺が、スープと絶妙に絡み合います。',
      image: 'https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?w=800&q=80',
    },
    {
      title: '厳選された食材',
      description: '地元沖縄の契約農家から直送される新鮮な野菜、厳選された豚肉。素材の良さが、そばの味を一層引き立てます。',
      image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80',
    },
  ],
};

export const menuData: MenuData = {
  sectionTitle: 'お品書き',
  sectionSubtitle: '心を込めてお作りする、こだわりの一杯',
  items: [
    {
      name: '琉球そば',
      price: '¥950',
      description: '伝統の三枚肉と紅生姜が映える定番の一杯',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=80',
    },
    {
      name: 'ソーキそば',
      price: '¥1,100',
      description: '柔らかく煮込んだソーキがたっぷり',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    },
    {
      name: '特製琉球そば',
      price: '¥1,300',
      description: '三枚肉とソーキの豪華な組み合わせ',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
    },
    {
      name: '野菜そば',
      price: '¥1,050',
      description: '季節の野菜をたっぷり使った健康志向の一杯',
      image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=600&q=80',
    },
    {
      name: '辛味噌そば',
      price: '¥1,150',
      description: '自家製辛味噌が効いた新感覚の味わい',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80',
    },
    {
      name: '海老天そば',
      price: '¥1,250',
      description: 'サクサクの海老天が贅沢にのった一杯',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80',
    },
    {
      name: 'あぐー豚そば',
      price: '¥1,400',
      description: '希少なあぐー豚を使った最高級の一杯',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    },
    {
      name: '冷やしそば',
      price: '¥1,000',
      description: '夏季限定、冷たいスープでさっぱりと',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=80',
    },
    {
      name: 'ゆし豆腐そば',
      price: '¥980',
      description: 'ふわふわのゆし豆腐が優しい味わい',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
    },
    {
      name: '炙りチャーシューそば',
      price: '¥1,200',
      description: '香ばしく炙ったチャーシューが絶品',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    },
    {
      name: 'きのこそば',
      price: '¥1,050',
      description: '5種類のきのこが香る秋の味覚',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
    },
    {
      name: '海鮮そば',
      price: '¥1,350',
      description: '沖縄近海の魚介をふんだんに使用',
      image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=600&q=80',
    },
    {
      name: 'つけそば',
      price: '¥1,100',
      description: '濃厚なつけ汁で味わう新スタイル',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80',
    },
    {
      name: 'カレーそば',
      price: '¥1,150',
      description: 'スパイシーなカレースープとの融合',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80',
    },
    {
      name: '鶏白湯そば',
      price: '¥1,100',
      description: 'クリーミーな鶏白湯スープ',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    },
    {
      name: 'まぜそば',
      price: '¥1,000',
      description: 'スープなしで味わう新感覚',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=80',
    },
    {
      name: '黒胡麻担々そば',
      price: '¥1,200',
      description: '黒胡麻の風味が効いたピリ辛仕立て',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    },
    {
      name: 'お子様そば',
      price: '¥680',
      description: '小さなお子様でも安心の優しい味',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
    },
  ],
};

export const storeInfoData: StoreInfoData = {
  sectionTitle: '店舗情報',
  items: [
    {
      icon: 'MapPin',
      title: '所在地',
      content: '沖縄県那覇市牧志1-2-3',
    },
    {
      icon: 'Clock',
      title: '営業時間',
      content: '11:00 - 21:00（ラストオーダー 20:30）',
    },
    {
      icon: 'Phone',
      title: '電話番号',
      content: '098-XXX-XXXX',
    },
    {
      icon: 'Mail',
      title: 'メール',
      content: 'info@ryukyu-soba.jp',
    },
  ],
  mainImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
  mainImageCaption: '温かみのある空間で、ごゆっくりとお過ごしください',
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
  sectionSubtitle: '美味しさの瞬間を写真でお届け',
  categories: ['すべて', '料理', '店内', 'イベント'],
  images: [
    { url: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80', caption: '伝統の琉球そば', category: '料理' },
    { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', caption: '自家製麺の調理風景', category: '料理' },
    { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', caption: '温かみのある店内', category: '店内' },
    { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', caption: 'カウンター席', category: '店内' },
    { url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80', caption: 'ソーキそば', category: '料理' },
    { url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80', caption: '特製琉球そば', category: '料理' },
    { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', caption: 'テーブル席', category: '店内' },
    { url: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800&q=80', caption: '野菜そば', category: '料理' },
    { url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80', caption: '年末感謝祭', category: 'イベント' },
  ],
};

export const staffData: StaffData = {
  sectionTitle: 'オーナー・スタッフ紹介',
  sectionSubtitle: '心を込めてお迎えする、私たちのチーム',
  members: [
    {
      name: '比嘉 太郎',
      role: 'オーナー・料理長',
      description: '沖縄そば一筋30年。祖父から受け継いだ伝統の味を守りながら、新しい挑戦も続けています。',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&q=80',
    },
    {
      name: '宮里 花子',
      role: '副料理長',
      description: '麺打ち10年のベテラン。毎朝手打ちする麺の美味しさには自信があります。',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
    },
    {
      name: '金城 次郎',
      role: 'ホールスタッフ',
      description: '明るい笑顔でお客様をお迎えします。沖縄の文化や観光情報もお気軽にどうぞ。',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    },
    {
      name: '新垣 美咲',
      role: 'ホールスタッフ',
      description: '丁寧な接客を心がけています。お子様連れのご家族も安心してお越しください。',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    },
  ],
};

export const reviewsData: ReviewsData = {
  sectionTitle: 'お客様の声',
  sectionSubtitle: 'たくさんの嬉しいお言葉をいただいています',
  reviews: [
    {
      name: '田中 良太',
      rating: 5,
      comment: '沖縄旅行で訪れましたが、本当に美味しかったです！スープの味わいが深く、麺のコシも最高。また沖縄に来たら必ず立ち寄ります。',
      date: '2024-11-15',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    },
    {
      name: '佐藤 美香',
      rating: 5,
      comment: '地元の友人に連れてきてもらいました。スタッフの方も親切で、料理も絶品。特に三枚肉が柔らかくて感動しました。',
      date: '2024-11-10',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    },
    {
      name: '鈴木 健一',
      rating: 5,
      comment: '家族で訪問。子供用のメニューもあり、家族全員で楽しめました。お店の雰囲気も良く、リラックスできました。',
      date: '2024-11-05',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    },
    {
      name: '山田 裕子',
      rating: 4,
      comment: '観光で初めて沖縄そばを食べましたが、想像以上に美味しかったです。出汁の香りが素晴らしい。',
      date: '2024-10-28',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    },
    {
      name: '高橋 誠',
      rating: 5,
      comment: 'ソーキそばが絶品！お肉がとろとろで、スープとの相性も抜群です。県外からの出張時には必ず寄ります。',
      date: '2024-10-20',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    },
    {
      name: '伊藤 愛',
      rating: 5,
      comment: '友達とランチで利用しました。野菜そばが予想以上に美味しくて、ヘルシーで大満足です。',
      date: '2024-10-15',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    },
  ],
};

export const newsData: NewsData = {
  sectionTitle: '最新情報・お知らせ',
  sectionSubtitle: 'お店の最新情報をお届けします',
  items: [
    {
      date: '2024-12-01',
      category: 'お知らせ',
      title: '年末年始の営業時間のご案内',
      content: '12月31日は15時まで、1月1日は休業、1月2日から通常営業いたします。',
    },
    {
      date: '2024-11-20',
      category: '新メニュー',
      title: '冬季限定「あぐー豚そば」登場',
      content: '希少な沖縄県産あぐー豚を使用した贅沢な一杯。数量限定でご提供しています。',
    },
    {
      date: '2024-11-10',
      category: 'イベント',
      title: '創業10周年感謝祭開催',
      content: '12月中旬に創業10周年を記念した感謝祭を開催予定。詳細は後日お知らせします。',
    },
    {
      date: '2024-10-25',
      category: 'メディア',
      title: 'テレビ番組で紹介されました',
      content: '地元TV局の人気グルメ番組「うちなーの味」で当店が紹介されました。',
    },
    {
      date: '2024-10-15',
      category: 'お知らせ',
      title: 'テイクアウトメニュー拡充',
      content: 'お持ち帰りメニューを拡充しました。ご自宅でも当店の味をお楽しみいただけます。',
    },
  ],
};

export const accessData: AccessData = {
  sectionTitle: 'アクセス・駐車場',
  sectionSubtitle: 'お店への行き方をご案内します',
  address: '沖縄県那覇市牧志1-2-3',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.1447437301044!2d127.68589831501648!3d26.21424098342371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34e56bd0b4a42ff1%3A0x36812e0e598f7d6b!2z54CP6Yar!5e0!3m2!1sja!2sjp!4v1234567890123!5m2!1sja!2sjp',
  parking: {
    title: '駐車場のご案内',
    description: '店舗専用駐車場を完備しています',
    spaces: '10台',
    notes: '満車の際は近隣のコインパーキングをご利用ください（徒歩2分圏内に3箇所あり）',
  },
  transportation: {
    title: '公共交通機関でのアクセス',
    methods: [
      { type: 'ゆいレール', description: '牧志駅から徒歩5分' },
      { type: 'バス', description: '「牧志」バス停から徒歩3分（系統：1番、3番、5番）' },
      { type: 'タクシー', description: '那覇空港から約20分' },
    ],
  },
};

export const ctaData: CTAData = {
  sectionTitle: 'ご予約・お問い合わせ',
  sectionSubtitle: '心よりお待ちしております',
  description: '本格的な琉球そばを味わいに、ぜひお越しください。ご予約やご質問など、お気軽にお問い合わせください。',
  buttons: [
    { text: 'お電話でご予約', link: '#contact', type: 'primary' },
    { text: 'お問い合わせ', link: '#contact', type: 'secondary' },
  ],
  backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80',
};

export const pricingData: PricingData = {
  sectionTitle: 'コース・プラン',
  sectionSubtitle: 'お好みに合わせた各種プランをご用意',
  plans: [
    {
      name: 'スタンダードコース',
      description: 'お一人様でも気軽にお楽しみいただけるコース',
      price: '1,500円',
      features: [
        '琉球そば（標準）',
        '小鉢2品',
        'ジューシー（沖縄風炊き込みご飯）',
        'さんぴん茶',
      ],
    },
    {
      name: 'デラックスコース',
      description: '当店自慢の料理を堪能できる人気コース',
      price: '2,800円',
      features: [
        '琉球そば（ソーキ・三枚肉選択可）',
        '沖縄料理小鉢3品',
        'ジューシー',
        'もずく酢',
        '島豆腐サラダ',
        'デザート',
        'さんぴん茶またはオリオンビール',
      ],
      isPopular: true,
    },
    {
      name: '団体プラン',
      description: '10名様以上のグループ向けプラン',
      price: '3,500円〜',
      features: [
        '琉球そば各種',
        '沖縄料理盛り合わせ',
        'ジューシー',
        '島豆腐料理',
        'ゴーヤーチャンプルー',
        'デザート',
        '飲み放題オプション（＋1,500円）',
        '個室利用可能',
      ],
    },
  ],
  note: '※価格は税込表示です。※コース料理は2日前までの要予約となります。',
};

export const companyData: CompanyData = {
  sectionTitle: '事業所概要',
  sectionSubtitle: '伝統を守り、未来へつなぐ',
  philosophy: {
    title: '経営理念',
    content: '沖縄の豊かな食文化と伝統の味を次世代へ継承し、地域に愛される店づくりを通じて、お客様の心と体に温かさと幸せをお届けすることを使命としています。素材へのこだわり、手作りの温もり、そして真心を込めた接客で、琉球そばの魅力を国内外に発信し続けます。',
  },
  history: {
    title: '沿革',
    timeline: [
      { year: '2014年', event: '那覇市牧志に「琉球そば」を創業' },
      { year: '2016年', event: '自家製麺工房を併設、完全手打ち麺の提供開始' },
      { year: '2018年', event: 'テイクアウトサービス開始' },
      { year: '2020年', event: '創業5周年記念イベント開催、地域貢献活動を強化' },
      { year: '2022年', event: '観光雑誌「沖縄BEST100」に掲載' },
      { year: '2024年', event: '創業10周年を迎え、新メニュー開発に注力' },
    ],
  },
  companyInfo: {
    title: '会社情報',
    items: [
      { label: '屋号', value: '琉球そば' },
      { label: '創業', value: '2014年4月' },
      { label: '代表', value: '比嘉 太郎' },
      { label: '所在地', value: '沖縄県那覇市牧志1-2-3' },
      { label: '電話番号', value: '098-XXX-XXXX' },
      { label: '営業時間', value: '11:00 - 21:00（定休日：火曜日）' },
      { label: '席数', value: '38席（カウンター10席、テーブル28席）' },
      { label: '駐車場', value: '専用駐車場10台' },
    ],
  },
};

export const faqData: FAQData = {
  sectionTitle: 'よくあるご質問',
  sectionSubtitle: 'お客様からよく寄せられる質問にお答えします',
  items: [
    {
      question: '予約は必要ですか？',
      answer: '平日のランチタイムは比較的空いていますが、週末や祝日は混雑が予想されますので、お電話でのご予約をおすすめします。特に4名様以上の場合は事前にご連絡いただけるとスムーズです。',
    },
    {
      question: '子供連れでも大丈夫ですか？',
      answer: 'もちろんです！お子様用のイスや食器もご用意しております。お子様向けメニューもございますので、ご家族でお気軽にお越しください。',
    },
    {
      question: 'アレルギー対応はできますか？',
      answer: 'はい、可能な限り対応させていただきます。アレルギーをお持ちの方は、ご来店時またはご予約時にスタッフまでお申し付けください。',
    },
    {
      question: 'テイクアウトはできますか？',
      answer: 'はい、全メニューテイクアウト可能です。お電話でご注文いただければ、待ち時間なくお渡しできます。容器代として別途50円いただいております。',
    },
    {
      question: 'クレジットカードは使えますか？',
      answer: 'VISA、MasterCard、JCB、AMEX、Dinersなど主要なクレジットカードをご利用いただけます。電子マネーやQRコード決済にも対応しています。',
    },
    {
      question: '駐車場はありますか？',
      answer: '店舗専用駐車場を10台分ご用意しています。満車の際は近隣のコインパーキング（徒歩2分圏内に3箇所）をご利用ください。',
    },
    {
      question: '団体での利用は可能ですか？',
      answer: '10名様以上の団体様も歓迎いたします。事前にご予約いただければ、お席の準備やコース料理のご相談も承ります。',
    },
    {
      question: '観光客ですが、荷物を預かってもらえますか？',
      answer: 'お食事中のお荷物はお預かりいたします。大きなスーツケースなどもお気軽にお申し付けください。',
    },
  ],
};

export const footerData: FooterData = {
  logo: '琉球そば',
  description: '沖縄の伝統と心を大切に、\n真心込めた一杯をお届けします。',
  businessHours: {
    title: '営業時間',
    days: '月曜日 - 日曜日',
    hours: '11:00 - 21:00',
    closedDay: '定休日: 火曜日',
  },
  social: {
    title: 'SNSでフォロー',
    links: [
      { platform: 'Facebook', url: '#' },
      { platform: 'Instagram', url: '#' },
      { platform: 'Twitter', url: '#' },
    ],
  },
  copyright: '琉球そば. All rights reserved.',
};
