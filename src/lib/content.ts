export type StageId = 1 | 2 | 3 | 4 | 5;
export type Speaker = "글별이" | "소리별" | "주인공" | "보스" | "역사별" | "역사별이" | "당대인물";

export type DialogueChoice = {
  text: string;
  correct: boolean;
  feedback: string;
  icon?: string;
};

export type DialogueMultiOption = {
  id: string;
  text: string;
  isAnswer: boolean;
  explanation: string;
  icon?: string;
  icons?: string[];
  cardImage?: string;
  measureImage?: string;
  timeBadge?: string;
};

export type DialogueMultiCheck = {
  instruction: string;
  options: DialogueMultiOption[];
  successFeedback: string;
};

export type DialogueVisualItem = {
  src?: string;
  title: string;
  beats?: number;
  beatsLabel?: string;
  gridBlocks?: number;
  tag?: string;
  desc?: string;
  icon?: string;
  quote?: string;
  story?: string;
  meaning?: string;
};

export type GrammarConceptCard = {
  title: string;
  badge: string;
  icon: string;
  colorTheme: "rose" | "emerald" | "sky" | "amber" | "purple";
  timeKeywords?: string;
  verbEndings: string;
  goodExample?: string;
  badExample?: string;
  pairLabel1?: string;
  pairLabel2?: string;
  pairDivider?: string;
  goodBadge?: string;
  badBadge?: string;
};

export type GuideSideWings = {
  leftTitle: string;
  leftBadge: string;
  leftIcon: string;
  leftItems: { normal: string; honorific: string }[];
  rightTitle: string;
  rightBadge: string;
  rightIcon: string;
  rightItems: { normal: string; honorific: string }[];
};

export type DialogueVisual = {
  type: "symbol" | "diagram" | "compare" | "grammar-table" | "guide-wings";
  src?: string;
  title?: string;
  caption?: string;
  source?: string;
  items?: DialogueVisualItem[];
  grammarTable?: {
    title: string;
    subtitle?: string;
    cards: GrammarConceptCard[];
  };
  guideWings?: GuideSideWings;
};

export type FillBlankSlot = {
  text: string;
  isSlot?: boolean;
  icon?: string;
};

export type FillBlankOption = {
  id: string;
  text: string;
  icon?: string;
  isAnswer: boolean;
  explanation: string;
};

export type FillBlankTask = {
  type: "fill-blank";
  instruction: string;
  equation: FillBlankSlot[];
  options: FillBlankOption[];
  successFeedback: string;
};

export type MatchPairItem = {
  id: string;
  text: string;
  icon?: string;
  emoji?: string;
  matchId: string;
  image?: string;
  accent?: string;
  subText?: string;
  badge?: string;
};

export type MatchPairsTask = {
  type: "match-pairs";
  instruction: string;
  leftItems: MatchPairItem[];
  rightItems: MatchPairItem[];
  successFeedback: string;
  leftTitle?: string;
  rightTitle?: string;
  anchorSide?: "left" | "right";
};

export type OrderSequenceItem = {
  id: string;
  text: string;
  icon?: string;
  order?: number;
  correctIndex?: number;
};

export type OrderSequenceTask = {
  type: "order-sequence";
  instruction: string;
  items: OrderSequenceItem[];
  successFeedback: string;
  allowedOrders?: number[][];
};

export type RelicSpotlightOption = {
  id: string;
  text: string;
  isAnswer: boolean;
  explanation: string;
};

export type RelicSpotlightTask = {
  type: "relic-spotlight";
  instruction: string;
  relicName: string;
  relicBadge: string;
  relicImage: string;
  relicHint: string;
  options: RelicSpotlightOption[];
  successFeedback: string;
};

export type CategorySortItem = {
  id: string;
  text: string;
  emoji?: string;
  category: "left" | "right";
  explanation: string;
};

export type CategorySortTask = {
  type: "category-sort";
  instruction: string;
  leftBucketTitle: string;
  leftBucketDesc?: string;
  leftBucketEmoji?: string;
  rightBucketTitle: string;
  rightBucketDesc?: string;
  rightBucketEmoji?: string;
  items: CategorySortItem[];
  successFeedback: string;
};

export type OxStatementItem = {
  id: string;
  text: string;
  isTrue: boolean;
  explanation: string;
};

export type OxVerdictTask = {
  type: "ox-verdict";
  instruction: string;
  courtTitle: string;
  statements: OxStatementItem[];
  successFeedback: string;
};

export type DocumentSegment = {
  text: string;
  slotId?: string;
  slotLabel?: string;
};

export type DocumentWordOption = {
  id: string;
  text: string;
  targetSlotId?: string;
  explanation: string;
};

export type DocumentRestoreTask = {
  type: "document-restore";
  instruction: string;
  docTitle: string;
  docBadge: string;
  segments: DocumentSegment[];
  options: DocumentWordOption[];
  successFeedback: string;
};

export type InteractiveTask =
  | FillBlankTask
  | MatchPairsTask
  | OrderSequenceTask
  | RelicSpotlightTask
  | CategorySortTask
  | OxVerdictTask
  | DocumentRestoreTask;

export type DialogueNode = {
  speaker: Speaker;
  speakerRole?: string;
  speakerAvatar?: string;
  sceneLocation?: string;
  text: string;
  bgImage?: string;
  prompt?: string;
  sentence?: string;
  choices?: DialogueChoice[];
  multiCheck?: DialogueMultiCheck;
  task?: InteractiveTask;
  interactiveTask?: InteractiveTask;
  visual?: DialogueVisual;
};

export type Stage = {
  id: StageId;
  title: string;
  shortTitle: string;
  concept: string;
  mission: string;
  bossName: string;
  bossTitle: string;
  bossShortName: string;
  color: string;
  background: string;
  bossImage: string;
  dialogue: DialogueNode[];
};

const choice = (
  correctText: string,
  wrong: string[],
  feedback: string,
  wrongFeedback: string,
  icons?: { correctIcon?: string; wrongIcons?: string[] },
): DialogueChoice[] => {
  const choices: DialogueChoice[] = [
    { text: correctText, correct: true, feedback, icon: icons?.correctIcon },
    ...wrong.map((text, i) => ({
      text,
      correct: false,
      feedback: wrongFeedback,
      icon: icons?.wrongIcons?.[i],
    })),
  ];
  for (let index = choices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [choices[index], choices[swapIndex]] = [choices[swapIndex], choices[index]];
  }
  return choices;
};

const multiCheck = (options: DialogueMultiOption[], successFeedback: string, instruction = "조건에 맞는 보기를 모두 고르세요."): DialogueMultiCheck => {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return { instruction, options: shuffled, successFeedback };
};

const matchPair = (
  pairs: { left: string; right: string; emoji?: string }[],
  successFeedback: string,
  instruction = "알맞은 짝을 찾아 연결하세요.",
  leftTitle?: string,
  rightTitle?: string,
  anchorSide: "left" | "right" = "left",
): MatchPairsTask => {
  const leftItems: MatchPairItem[] = pairs.map((p, i) => ({
    id: `pair-${i}`,
    text: p.left,
    emoji: p.emoji,
    matchId: `pair-${i}`,
  }));
  const rightItems: MatchPairItem[] = pairs.map((p, i) => ({
    id: `right-${i}`,
    text: p.right,
    matchId: `pair-${i}`,
  }));
  for (let index = rightItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [rightItems[index], rightItems[swapIndex]] = [rightItems[swapIndex], rightItems[index]];
  }
  return {
    type: "match-pairs",
    instruction,
    leftItems,
    rightItems,
    successFeedback,
    leftTitle,
    rightTitle,
    anchorSide,
  };
};

const fillBlank = (
  equation: FillBlankSlot[],
  options: FillBlankOption[],
  successFeedback: string,
  instruction = "빈칸에 들어갈 알맞은 낱말 카드를 선택하세요."
): FillBlankTask => {
  const shuffled = [...options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return {
    type: "fill-blank",
    instruction,
    equation,
    options: shuffled,
    successFeedback,
  };
};

const orderSequence = (
  items: OrderSequenceItem[],
  successFeedback: string,
  instruction = "역사적 순서에 맞게 카드를 알맞게 배열하세요."
): OrderSequenceTask => {
  return {
    type: "order-sequence",
    instruction,
    items,
    successFeedback,
  };
};

const withTask = (task: InteractiveTask) => ({ task, interactiveTask: task });

// 📊 스테이지별 핵심 개념 보드 (1슬라이드 1핵심 초점 단독 쇼케이스)
const stage1Visuals: Record<string, DialogueVisual> = {
  hojokRise: {
    type: "diagram",
    title: "신라 말 혼란과 호족의 등장",
    caption: "지방에서 군사력과 경제력을 키운 호족들이 새로운 역사의 주인공으로 떠올랐습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 신라 말 지방 호족 세력의 등장과 성채 수호",
    items: [
      {
        title: "새로운 지방 세력, 호족",
        desc: "신라 말 혼란기, 스스로 성주·장군이라 칭하며 백성을 지키고 세력을 키운 세력입니다.",
        icon: "⚔️",
        src: "/relics/goryeo_local_warlord_hojok.webp",
      },
    ],
  },
  gyeonhwon: {
    type: "diagram",
    title: "견훤의 후백제 건국 (900년)",
    caption: "견훤은 옛 백제 땅의 백성들을 모아 완산주(전주)에 도읍을 정했습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 견훤의 후백제 건국 선포",
    items: [
      {
        title: "완산주에 세운 후백제",
        desc: "신라 장수 출신 견훤이 백성을 모아 가장 먼저 나라를 세우고 신라를 압박했습니다.",
        icon: "🚩",
        src: "/relics/goryeo_gyeonhwon_founding.webp",
      },
    ],
  },
  gungye: {
    type: "diagram",
    title: "궁예의 후고구려와 후삼국 시대 (901년)",
    caption: "신라·후백제·후고구려가 한반도에서 힘을 겨루는 후삼국 시대가 열렸습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 후삼국(궁예·견훤·신라)과 호족 영역 만화 지도",
    items: [
      {
        title: "궁예와 후삼국의 시작",
        desc: "궁예가 옛 고구려 땅을 되찾겠다며 나라를 세워 신라, 후백제와 함께 후삼국을 이루었습니다.",
        icon: "🗺️",
        src: "/relics/goryeo_later_three_kingdoms_map.webp",
      },
    ],
  },
  goryeoFounding: {
    type: "diagram",
    title: "태조 왕건의 고려 건국 (918년)",
    caption: "백성과 호족의 지지를 얻은 왕건이 고구려를 계승하는 '고려'를 세웠습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 포악해진 궁예를 몰아내고 고려를 건국하는 왕건",
    items: [
      {
        title: "고구려를 계승한 나라, 고려",
        desc: "왕건은 포악해진 궁예를 몰아내고 고려를 세운 뒤 수도를 송악(개성)으로 옮겼습니다.",
        icon: "👑",
        src: "/relics/goryeo_taejo_painting.webp",
      },
    ],
  },
  unificationFinish: {
    type: "diagram",
    title: "신라의 항복과 후삼국 통일 (936년)",
    caption: "신라의 평화적 항복을 받고 후백제를 격파하여 마침내 후삼국을 통일했습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 신라의 평화적 항복과 후삼국 통일 선포",
    items: [
      {
        title: "마침내 이룬 후삼국 통일",
        desc: "신라 경순왕의 항복(935년)에 이어 후백제를 격파(936년)하며 통일을 완성했습니다.",
        icon: "🚩",
        src: "/relics/goryeo_unification_triumph.webp",
      },
    ],
  },
  daegwanghyeon: {
    type: "diagram",
    title: "발해 세자 대광현과 유민 수용 (926년)",
    caption: "고려는 거란에 멸망한 발해를 '친척의 나라'로 여겨 따뜻하게 품었습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 발해 세자 대광현과 유민 귀순 및 포용",
    items: [
      {
        title: "발해 왕족 대광현에게 왕씨 성 하사",
        desc: "발해 세자 대광현과 유민 수만 명을 가족처럼 맞이하여 왕실의 성과 토지를 주었습니다.",
        icon: "🤝",
        src: "/relics/goryeo_daegwanghyeon_welcome.webp",
      },
    ],
  },
  nationalUnity: {
    type: "diagram",
    title: "하나가 된 진정한 민족 통합",
    caption: "고구려·백제·신라뿐 아니라 발해 사람들까지 아우른 완전한 민족 통합이었습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 고려 왕궁 앞 4국 민족 통합 환호",
    items: [
      {
        title: "네 나라의 백성이 하나로",
        desc: "신라와 백제, 그리고 발해 유민까지 차별 없이 품어 진정한 우리 민족의 기틀을 다졌습니다.",
        icon: "✨",
        src: "/relics/goryeo_national_integration.webp",
      },
    ],
  },
  taxReduction: {
    type: "diagram",
    title: "농민의 눈물을 닦아준 세금 감면",
    caption: "전쟁에 지친 백성을 위해 세금을 수확량의 10분의 1로 낮추었습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 태조 왕건의 취민유도(10분의 1 조세 감면)",
    items: [
      {
        title: "백성을 살리는 조세 감면",
        desc: "가혹한 세금을 크게 줄여 농민들이 안심하고 농사를 지을 수 있도록 생활을 안정시켰습니다.",
        icon: "🌾",
        src: "/relics/goryeo_tax_reduction_relief.webp",
      },
    ],
  },
  hunyo10Doc: {
    type: "diagram",
    title: "후대 왕을 위한 열 가지 가르침 『훈요 10조』",
    caption: "불교 장려, 서경(평양) 중시, 고려 고유의 풍습 수호를 당부했습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 태조 왕건의 『훈요 10조』 비전 문서",
    items: [
      {
        title: "나라의 미래를 밝힌 10가지 당부",
        desc: "불교를 장려하고 북진 정책을 위해 서경을 아끼며, 거란 풍습을 경계하라고 가르쳤습니다.",
        icon: "📜",
        src: "/relics/goryeo_hunyo10_scroll.webp",
      },
    ],
  },
};

const stage2Visuals: Record<string, DialogueVisual> = {
  nobiLaw: {
    type: "diagram",
    title: "억울한 노비를 해방한 노비안검법",
    caption: "광종은 호족에게 억울하게 빼앗긴 백성의 신분을 양인으로 되돌려 주었습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 광종의 노비안검법과 양인 해방의 감격",
    items: [
      {
        title: "호족을 누르고 백성을 살린 법",
        desc: "호족의 재산과 사병이던 불법 노비를 양인으로 풀어주어 왕권을 강화하고 세수를 늘렸습니다.",
        icon: "🔓",
        src: "/relics/goryeo_nobi_emancipation.webp",
      },
    ],
  },
  hongpaeExam: {
    type: "diagram",
    title: "실력 중심 인재 등용, 과거제 실시",
    caption: "개인의 학문과 실력을 시험하여 관리를 뽑는 과거제를 도입했습니다.",
    source: "🏛️ 국가유산청 국가유산포털: 국보 장양수 홍패",
    items: [
      {
        title: "붉은 종이의 합격증, 장양수 홍패",
        desc: "신분이나 가문 대신 실력으로 관리를 뽑아 국가에 충성하는 인재를 널리 얻었습니다.",
        icon: "📝",
        src: "/relics/goryeo_hongpae.webp",
      },
    ],
  },
  localOfficials: {
    type: "diagram",
    title: "지방에 관리를 보내 백성을 보살피다",
    caption: "성종은 최승로의 건의를 받아들여 12목에 지방관을 파견했습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 성종의 12목 지방관 파견과 백성의 민원 경청",
    items: [
      {
        title: "전국에 파견된 지방관 (12목)",
        desc: "지방 호족의 횡포를 막고 백성의 생활을 고루 살피도록 중앙 관리를 파견했습니다.",
        icon: "🏛️",
        src: "/relics/goryeo_local_official_12myeon.webp",
      },
    ],
  },
  yanginFarmers: {
    type: "diagram",
    title: "자유민 양인과 성실한 농민",
    caption: "고려 인구의 대다수를 차지하며 농사를 짓고 세금을 낸 든든한 백성이었습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 자유민 양인 농민들의 농경 공동체 생활",
    items: [
      {
        title: "나라를 떠받친 자유민, 양인",
        desc: "관리·군인뿐 아니라 땀 흘려 농사짓는 농민들이 자유민으로서 나라의 기둥이 되었습니다.",
        icon: "🌾",
        src: "/relics/goryeo_yangin_farmers_life.webp",
      },
    ],
  },
  cheoninSlaves: {
    type: "diagram",
    title: "천인 노비와 신분 상승의 길",
    caption: "대다수가 노비였으나, 큰 공을 세우거나 시험을 통해 신분이 올라가기도 했습니다.",
    source: "🏛️ 국가유산청 국가유산포털: 보물 순천 송광사 고려고문서 (노비 문서)",
    items: [
      {
        title: "노비 문서와 신분 상승",
        desc: "지배층이나 절에 매여 일했지만, 전쟁에서 공을 세우면 양인이나 관리가 될 수 있었습니다.",
        icon: "📜",
        src: "/relics/goryeo_slave_doc.webp",
      },
    ],
  },
  equalInheritance: {
    type: "diagram",
    title: "아들과 딸이 똑같이 상속받은 가족",
    caption: "고려는 아들과 딸 구별 없이 부모의 재산을 공평하게 나누어 가졌습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 명판관 손변의 남녀 균등 상속 재판",
    items: [
      {
        title: "관리 손변의 공평한 명판결",
        desc: "어린 남동생과 누나에게 부모의 유산을 공평히 반씩 나누어 주도록 판결했습니다.",
        icon: "⚖️",
        src: "/relics/goryeo_sonbyeon_fair_trial.webp",
      },
    ],
  },
  freeWomenStatus: {
    type: "diagram",
    title: "당당하고 자유로웠던 고려 여성의 삶",
    caption: "가정에서 남성과 동등한 권리를 누렸으며 여성이 집안의 가장이 되기도 했습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 주체적인 고려 여성의 삶 (남귀여가혼과 호주)",
    items: [
      {
        title: "남성과 동등했던 가정생활",
        desc: "아들과 딸이 돌아가며 제사를 모시고, 결혼 후 남자가 처가에 살며 여성 호주도 흔했습니다.",
        icon: "🏠",
        src: "/relics/goryeo_women_status_life.webp",
      },
    ],
  },
  yeondeunghoeFest: {
    type: "diagram",
    title: "온 거리를 밝힌 연등회와 팔관회",
    caption: "부처님께 나라의 평안을 빌며 온 백성과 외국 상인까지 어우러진 대축제였습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 개경 연등회 축제",
    items: [
      {
        title: "화려한 국가 불교 축제",
        desc: "오색 연등을 밝히고 음악과 춤을 즐기며 나라의 번영과 백성의 화합을 다졌습니다.",
        icon: "🏮",
        src: "/relics/goryeo_yeondeunghoe_festival.webp",
      },
    ],
  },
  buddhistTreasures: {
    type: "diagram",
    title: "독창적이고 웅장한 고려의 불교 예술",
    caption: "거대한 석조 불상과 우아한 목조 건축으로 뛰어난 문화를 꽃피웠습니다.",
    source: "🏛️ 국가유산청 국가유산포털: 국보 논산 관촉사 석조미륵보살입상",
    items: [
      {
        title: "거대하고 독창적인 은진미륵",
        desc: "높이 18미터가 넘는 웅장한 관촉사 미륵보살 등 고려인들의 담대한 예술혼을 보여줍니다.",
        icon: "🗿",
        src: "/relics/goryeo_gwanchoksa_mireuk.webp",
      },
    ],
  },
};

const stage3Visuals: Record<string, DialogueVisual> = {
  khitanThreat: {
    type: "diagram",
    title: "거란의 침입과 풍전등화의 위기",
    caption: "발해를 멸망시킨 거란이 80만 대군을 이끌고 고려를 위협했습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 거란 80만 대군의 고려 침략",
    items: [
      {
        title: "거란의 침입과 조정의 동요",
        desc: "거란군이 몰려오자 땅을 떼어주고 항복하자는 신하들이 많았습니다.",
        icon: "⚔️",
        src: "/relics/goryeo_khitan_invasion_800k.webp",
      },
    ],
  },
  seoHuiTalk: {
    type: "diagram",
    title: "서희의 외교 담판과 강동 6주",
    caption: "서희는 고구려 계승 명분을 내세워 피 한 방울 없이 강동 6주를 얻었습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 서희와 소손녕의 강동 6주 외교 담판",
    items: [
      {
        title: "말 한마디로 얻은 국경 요충지",
        desc: "거란 장수 소손녕과 당당히 담판하여 압록강 입구의 강동 6주 땅을 확보했습니다.",
        icon: "📜",
        src: "/relics/goryeo_seohui_diplomacy.webp",
      },
    ],
  },
  gangGamChan: {
    type: "diagram",
    title: "강감찬의 귀주 대첩 (1019년)",
    caption: "귀주 벌판에서 거란 10만 대군을 완전히 물리친 역사상 위대한 대승입니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 귀주 대첩과 강감찬 장군",
    items: [
      {
        title: "고려의 기세를 떨친 귀주 대첩",
        desc: "강감찬 장군이 거란 3차 침입을 귀주에서 대파하고 천리장성을 쌓아 나라를 지켰습니다.",
        icon: "🛡️",
        src: "/relics/goryeo_ganggamchan_battle.webp",
      },
    ],
  },
  byeongnandoPort: {
    type: "diagram",
    title: "세계로 열린 국제 무역항, 벽란도",
    caption: "개경 근처 예성강 하구 벽란도는 세계 여러 나라의 무역선으로 붐볐습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 예성강 벽란도 국제 무역항",
    items: [
      {
        title: "세계 각국의 상인이 모인 항구",
        desc: "수심이 깊어 큰 배가 닿았고, 송나라·일본·여진 상인들이 활발하게 오갔습니다.",
        icon: "⛵",
        src: "/relics/goryeo_byeongnando_port.webp",
      },
    ],
  },
  arabiaKorea: {
    type: "diagram",
    title: "아라비아 상인과 '코리아'의 유래",
    caption: "향료와 수은을싣고 온 아라비아 상인들을 통해 '코리아(Korea)'가 서양에 알려졌습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 벽란도의 아라비아 상인과 은병(활구)",
    items: [
      {
        title: "서양에 울려 퍼진 이름, 코리아",
        desc: "벽란도를 찾은 아라비아 상인들이 고려의 뛰어난 청자와 인삼을 서양에 소개했습니다.",
        icon: "🌍",
        src: "/relics/goryeo_eunbyeong_arabia.webp",
      },
    ],
  },
  ganghwaIsland: {
    type: "diagram",
    title: "몽골의 침입과 강화도 천도 항전",
    caption: "세계 최강 몽골 기마 군단의 침략에 맞서 수도를 강화도로 옮기고 30년간 항전했습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 몽골 제국 기마 군단의 고려 침략과 위기",
    items: [
      {
        title: "세계 최강 몽골군의 침략과 결의",
        desc: "유라시아를 정복한 몽골 기마 군단에 굴하지 않고 강화도로 천도하여 30여 년간 치열하게 맞섰습니다.",
        icon: "⚔️",
        src: "/relics/goryeo_mongol_invasion.webp",
      },
    ],
  },
  kimYunHuCheoin: {
    type: "diagram",
    title: "승려 김윤후와 처인성 전투의 승리",
    caption: "승려 김윤후와 일반 백성들이 힘을 합쳐 몽골군 총사령관 살리타를 사살했습니다.",
    source: "🏛️ 국가유산청 국가유산포털: 경기도 기념물 용인 처인성",
    items: [
      {
        title: "백성의 활 한 발로 꺾은 적장",
        desc: "정규군이 아닌 처인 부곡의 백성들과 김윤후가 적장을 쏘아 맞혀 몽골군을 퇴각시켰습니다.",
        icon: "🏹",
        src: "/relics/goryeo_cheoinseong.webp",
      },
    ],
  },
  chungjuBattle: {
    type: "diagram",
    title: "충주성 전투와 노비 문서 소각",
    caption: "김윤후가 관청의 노비 문서를 불태우자, 천민들이 목숨을 바쳐 성을 지켜냈습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 충주성 전투와 김윤후의 노비 문서 소각 결사항전",
    items: [
      {
        title: "신분을 넘어 하나로 뭉친 승리",
        desc: "'공을 세우면 누구나 양인이 된다!'며 노비 문서를 불태워 70일간의 포위를 뚫었습니다.",
        icon: "🔥",
        src: "/relics/goryeo_chungju_slave_burn.webp",
      },
    ],
  },
  culturalBlend: {
    type: "diagram",
    title: "고려양과 몽골풍의 상호 문화 교류",
    caption: "오랜 교류 속에 의복·악기·음식 등 서로의 생활 문화에 깊은 영향을 남겼습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 고려양과 몽골풍의 생활 문화 교류 (변발·족두리와 상추쌈·만두)",
    items: [
      {
        title: "생활 속에 남은 두 나라의 흔적",
        desc: "변발·족두리·태평소·만두·설렁탕이 고려에 전해졌고, 상추쌈·유밀과(약과)·시루떡 등 고려양(高麗樣)이 몽골에서 대유행했습니다.",
        icon: "🥟",
        src: "/relics/goryeo_mongol_cultural_exchange.webp",
      },
    ],
  },
};

const stage4Visuals: Record<string, DialogueVisual> = {
  sanggamCeladon: {
    type: "diagram",
    title: "[제1부 청자 공예] 비색의 신비와 독창적 상감 기법",
    caption: "겉면을 파내고 다른 색 흙을 메꾸어 무늬를 빚어낸 고려만의 독창적 기법입니다.",
    source: "🏛️ 간송미술문화재단: 국보 청자 상감운학문 매병",
    items: [
      {
        title: "하늘을 나는 학, 상감청자",
        desc: "맑고 은은한 비취색 바탕에 백토와 흑토로 구름과 학을 새겨 넣은 걸작입니다.",
        icon: "🏺",
        src: "/relics/goryeo_celadon_maebyeong.webp",
      },
    ],
  },
  noblesLifeCeladon: {
    type: "diagram",
    title: "[제1부 청자 공예] 생활 속 예술로 피어난 고려청자",
    caption: "주전자·향로·연적 등 정교한 조형미로 주로 왕실과 지배층의 생활용품이 되었습니다.",
    source: "🏛️ 국립중앙박물관: 국보 청자 투각칠보문향로",
    items: [
      {
        title: "정교한 조각의 청자 향로",
        desc: "꽃잎과 칠보 무늬를 뚫어 새긴 투각 기법으로 고려 공예의 정점을 보여줍니다.",
        icon: "✨",
        src: "/relics/goryeo_celadon_incense_burner.webp",
      },
    ],
  },
  taeanShipwreck: {
    type: "diagram",
    title: "[제1부 청자 공예] 바다 밑에서 건져 올린 태안 보물선",
    caption: "강진 가마터에서 개경으로 향하던 청자 운반선이 서해 바다에서 발굴되었습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 800년 만에 인양된 태안 해저 청자 운반선",
    items: [
      {
        title: "800년 만에 깨어난 청자 운반선",
        desc: "수만 점의 고려청자가 침몰선과 함께 펄 속에서 온전한 모습으로 발굴되었습니다.",
        icon: "🚢",
        src: "/relics/goryeo_taean_shipwreck.webp",
      },
    ],
  },
  tripitakaBoards: {
    type: "diagram",
    title: "[제2부 호국 불교] 구국의 염원, 합천 해인사 팔만대장경",
    caption: "몽골 침입을 물리치려는 간절한 염원으로 16년에 걸쳐 8만여 장의 목판을 새겼습니다.",
    source: "🏛️ 국가유산청 국가유산포털: 국보 합천 해인사 대장경판",
    items: [
      {
        title: "한 글자마다 절을 올린 정성",
        desc: "8만 1천여 장의 목판에 새긴 글자마다 오탈자가 거의 없는 세계 최고의 목판 인쇄술입니다.",
        icon: "📿",
        src: "/relics/goryeo_tripitaka_woodblock.webp",
      },
    ],
  },
  janggyeongPanjeon: {
    type: "diagram",
    title: "[제2부 호국 불교] 자연 과학의 결정체, 해인사 장경판전",
    caption: "창문 크기를 위아래 반대로 설계하고 숯과 소금을 깔아 목판을 썩지 않게 보관했습니다.",
    source: "🏛️ 국가유산청 국가유산포털: 국보·유네스코 세계유산 합천 해인사 장경판전",
    items: [
      {
        title: "수백 년을 지켜낸 과학의 건물",
        desc: "자연적인 통풍과 습도 조절만으로 경판이 뒤틀리거나 썩지 않도록 완벽히 보존했습니다.",
        icon: "🏛️",
        src: "/relics/goryeo_janggyeong_panjeon.webp",
      },
    ],
  },
  metalTypeInvention: {
    type: "diagram",
    title: "[제3부 인쇄 과학] 세계 인쇄사의 대혁명, 금속 활자 발명",
    caption: "글자를 자유롭게 조합하여 여러 종류의 책을 빠르게 찍어낼 수 있었습니다.",
    source: "🏛️ 국립중앙박물관: 고려 금속 활자 '복(復)'",
    items: [
      {
        title: "밀랍 주조로 만든 금속 활자",
        desc: "밀랍에 글자를 새겨 황토를 감싸고 쇳물을 부어 활자를 만든 뒤, 판에 배열하여 인쇄하는 세계 최초의 발명입니다.",
        icon: "🔥",
        src: "/relics/goryeo_metal_type.webp",
      },
    ],
  },
  jikjiWorldHeritage: {
    type: "diagram",
    title: "[제3부 인쇄 과학] 현존 세계 최고 금속활자본 『직지』 (1377년)",
    caption: "청주 흥덕사에서 인쇄된 『직지』는 서양의 구텐베르크 성서보다 78년이나 앞섰습니다.",
    source: "🏛️ 유네스코 세계기록유산: 백운화상초록불조직지심체요절(직지)",
    items: [
      {
        title: "세계가 공인한 인쇄 문화의 꽃",
        desc: "현재 전 세계에 남아 있는 가장 오래된 금속 활자 인쇄본으로 세계기록유산에 등재되었습니다.",
        icon: "📖",
        src: "/relics/goryeo_jikji.webp",
      },
    ],
  },
  cottonSeedMunikjeom: {
    type: "diagram",
    title: "[제4부 의생활 혁명] 문익점과 정천익의 목화씨 재배",
    caption: "원나라에서 들여온 목화씨를 장인 정천익과 함께 정성껏 싹틔워 전국에 보급했습니다.",
    source: "🏛️ 국가유산청 국가유산포털: 사적 산청 목면시배 유지",
    items: [
      {
        title: "백성을 위해 품어온 기적의 씨앗",
        desc: "원나라에서 목화씨를 들여와 실패를 딛고 재배에 성공하여 실을 뽑는 기술을 개발했습니다.",
        icon: "🌱",
        src: "/relics/goryeo_cotton_site.webp",
      },
    ],
  },
  cottonClothesLife: {
    type: "diagram",
    title: "[제4부 의생활 혁명] 백성의 겨울 추위를 녹인 따뜻한 무명옷",
    caption: "겨울에도 삼베와 모시를 입던 일반 백성들에게 따뜻하고 솜털 같은 무명옷을 입혔습니다.",
    source: "💡 이해를 돕기 위한 생성형 AI 이미지: 온 백성의 겨울을 바꾼 따뜻한 목화솜 무명옷",
    items: [
      {
        title: "백성의 의생활을 바꾼 무명의 보급",
        desc: "목화솜으로 짠 무명옷과 이불 덕분에 온 백성이 비로소 겨울 추위를 견딜 수 있었습니다.",
        icon: "👕",
        src: "/relics/goryeo_cotton_clothes_winter.webp",
      },
    ],
  },
};

// 🏛️ 3페이즈 보스 정의 (후삼국과 고려 시대 3단계 진화 보스)
export type BossPhase = 1 | 2 | 3;
export type HistoryBossInfo = {
  phase: BossPhase;
  name: string;
  title: string;
  shortName: string;
  themeEra: string;
  maxHp: number;
  attackPower: number;
  defense: number;
  barrier: number;
  dialogueIntro: string;
  dialogueDefeat: string;
  icon: string;
  color: string;
  image: string;
};

export const bossPhases: Record<BossPhase, HistoryBossInfo> = {
  1: {
    phase: 1,
    name: "후삼국의 전란 수호령",
    title: "후삼국 통일과 고려 사회 기틀의 시험관",
    shortName: "전란수호령",
    themeEra: "고려 건국·고려 사회",
    maxHp: 28,
    attackPower: 4,
    defense: 3,
    barrier: 3,
    dialogueIntro: "크아앙! 시간의 틈을 넘어 고려 시대로 들어온 여행자여!\n왕건의 후삼국 통일과 고려 사회의 모습을 증명하지 못하면 결코 다음 시대로 나아갈 수 없다!",
    dialogueDefeat: "크윽... 태조 왕건의 민족 통합과 고려 사회의 지혜를 완벽히 꿰뚫어 보다니...\n하지만 북방의 거센 폭풍을 다스리는 대초원의 군주가 기다린다!",
    icon: "👑",
    color: "#a16207",
    image: "/characters/boss-phase-1-goryeo-guardian.webp",
  },
  2: {
    phase: 2,
    name: "북방 대초원의 철기 군주",
    title: "거란·몽골의 침입과 벽란도 외교의 시험관",
    shortName: "철기 군주",
    themeEra: "주변 나라와의 관계",
    maxHp: 36,
    attackPower: 5,
    defense: 4,
    barrier: 4,
    dialogueIntro: "거란과 몽골의 대군이 몰려오는 역사의 격랑을 보아라!\n서희의 담판과 강감찬의 귀주 대첩, 김윤후와 백성들의 호국 지혜가 없다면 이 관문을 넘지 못할 것이다!",
    dialogueDefeat: "말도 안 돼... 강동 6주의 외교력과 귀주·처인성의 기상으로 내 방벽을 무너뜨리다니...\n마지막 시간의 수호자, 고려의 수호여제이시여!",
    icon: "🛡️",
    color: "#0369a1",
    image: "/characters/boss-phase-2-steppe-lord.webp",
  },
  3: {
    phase: 3,
    name: "고려의 수호여제",
    title: "고려 문화의 최종 수호자",
    shortName: "고려 수호여제",
    themeEra: "고려의 문화·전 범위 통합",
    maxHp: 44,
    attackPower: 6,
    defense: 4,
    barrier: 4,
    dialogueIntro: "내가 바로 시간의 문을 지키는 최종 시험관, 고려의 수호여제다!\n고려청자와 팔만대장경, 세계 최초 금속 활자 『직지』와 문익점의 목화까지 고려의 찬란한 문화를 증명해 보아라!",
    dialogueDefeat: "훌륭하다! 후삼국 통일부터 고려의 찬란한 문화유산까지 완벽히 마스터했구나.\n약속대로 시간의 문을 열어주마. 너희가 살던 따뜻한 집으로 당당히 돌아가라!",
    icon: "🏺",
    color: "#7e22ce",
    image: "/characters/boss-phase-3-goryeo-overlord.webp",
  },
};

// 📜 4단계 역사 탐구 스테이지 정의 (후삼국과 고려)
export const stages: Stage[] = [
  // ==========================================
  // STAGE 1: 고려의 건국과 후삼국 통일
  // ==========================================
  {
    id: 1,
    title: "1단계: 고려의 건국과 후삼국 통일 - 왕건과 민족 통합",
    shortTitle: "고려 건국과 통일",
    concept: "후삼국 통일, 발해 유민 수용, 훈요 10조",
    mission: "신라 말 혼란을 넘어 새로운 시대를 연 고려! 왕건의 후삼국 통일과 민족 통합 정책을 탐구하세요!",
    bossName: "후삼국의 전란 수호령",
    bossTitle: "후삼국 통일과 고려 사회 기틀의 시험관",
    bossShortName: "전란수호령",
    color: "#b45309",
    background: "linear-gradient(135deg, #78350f, #451a03)",
    bossImage: "/characters/boss-phase-1-goryeo-guardian.webp",
    dialogue: [
      // 인트로 티키타카
      {
        speaker: "주인공",
        text: "우와, 역사별이야! 시간의 틈을 지나 도착한 이곳은 어디지? 저 멀리 웅장한 궁궐과 성벽이 보여!",
      },
      {
        speaker: "역사별이",
        text: "수호자님, 무사히 도착하셨군요! 이곳은 오늘날 우리나라가 세계에서 '코리아(Korea)'로 불리게 된 유래인 [고려] 시대예요!\n우리 집으로 돌아가려면 후삼국 통일부터 고려의 역사를 하나씩 탐구해야 해요.",
      },
      // 1. 호족의 등장
      {
        speaker: "주인공",
        text: "역사별이야, 신라 말에 전국 곳곳에서 힘센 성주들이 일어났다는데 누구야?",
        visual: stage1Visuals.hojokRise,
      },
      {
        speaker: "역사별이",
        text: "신라 귀족들이 다투는 틈에 지방에서 군사와 재산을 모아 백성을 지킨 이들을 [호족]이라고 불렀어요!",
        visual: stage1Visuals.hojokRise,
      },
      // 2. 견훤의 후백제 건국
      {
        speaker: "주인공",
        text: "호족 중에서 가장 먼저 독자적인 나라를 세운 사람은 누구야?",
        visual: stage1Visuals.gyeonhwon,
      },
      {
        speaker: "역사별이",
        text: "바로 [견훤] 장군이에요! 옛 백제 백성들의 마음을 모아 완산주(전주)에 [후백제(900년)]를 세웠답니다.",
        visual: stage1Visuals.gyeonhwon,
      },
      // 3. 궁예와 후삼국 시대
      {
        speaker: "주인공",
        text: "그럼 북쪽에서는 누가 나라를 일으킨 거야?",
        visual: stage1Visuals.gungye,
      },
      {
        speaker: "역사별이",
        text: "신라 왕족 출신 [궁예]가 옛 고구려 땅에 나라를 세우며, 신라·후백제·후고구려의 [후삼국 시대]가 열렸어요!",
        visual: stage1Visuals.gungye,
      },
      // 4. 왕건의 고려 건국
      {
        speaker: "주인공",
        text: "궁예가 점점 난폭해지자 백성들과 호족들이 왕건을 새 왕으로 추대했다며?",
        visual: stage1Visuals.goryeoFounding,
      },
      {
        speaker: "역사별이",
        text: "맞아요! 왕건은 고구려를 계승한다는 뜻으로 [고려(918년)]를 세우고 수도를 [송악(개성)]으로 옮겼답니다.",
        visual: stage1Visuals.goryeoFounding,
      },
      // 5. 신라 항복과 통일 완성
      {
        speaker: "주인공",
        text: "세 나라로 갈라져 싸우던 후삼국은 어떻게 하나로 통일되었어?",
        visual: stage1Visuals.unificationFinish,
      },
      {
        speaker: "역사별이",
        text: "약해진 [신라의 평화적 항복(935년)]을 받고, 다툼에 빠진 [후백제를 격파(936년)]해 마침내 후삼국을 통일했어요!",
        visual: stage1Visuals.unificationFinish,
      },
      // 6. 발해 세자 대광현 맞이
      {
        speaker: "주인공",
        text: "북쪽에서 거란에 멸망한 발해 사람들까지 고려로 내려왔다고 들었어!",
        visual: stage1Visuals.daegwanghyeon,
      },
      {
        speaker: "역사별이",
        text: "왕건은 '발해는 우리의 친척 나라다!'라며 세자 [대광현]에게 왕실의 성(왕씨)과 토지를 주어 따뜻하게 품었지요.",
        visual: stage1Visuals.daegwanghyeon,
      },
      // 7. 진정한 민족 통합
      {
        speaker: "주인공",
        text: "신라와 백제뿐 아니라 발해 사람들까지 모두 한 가족이 된 거네?",
        visual: stage1Visuals.nationalUnity,
      },
      {
        speaker: "역사별이",
        text: "정확해요! 네 나라의 백성을 차별 없이 하나로 묶어 진정한 [우리 민족의 완전한 통합]을 이루어냈답니다!",
        visual: stage1Visuals.nationalUnity,
      },
      // 8. 농민 세금 감면
      {
        speaker: "주인공",
        text: "오랜 전쟁으로 지치고 굶주린 백성들을 위해 왕건은 어떤 정치를 펼쳤어?",
        visual: stage1Visuals.taxReduction,
      },
      {
        speaker: "역사별이",
        text: "농민들의 세금을 10분의 1로 대폭 낮추고 빚을 탕감해 백성들이 안심하고 농사짓게 했어요!",
        visual: stage1Visuals.taxReduction,
      },
      // 9. 훈요 10조의 당부
      {
        speaker: "주인공",
        text: "태조 왕건이 세상을 떠나기 전 후대 왕들에게 남긴 비밀 지침서가 있다면서?",
        visual: stage1Visuals.hunyo10Doc,
      },
      {
        speaker: "역사별이",
        text: "나라를 세운 바탕인 [불교]를 장려하고, 옛 고구려 수도인 [서경(평양)]을 중시하며, 거란 풍습을 경계하라는 당부를 담은 [『훈요 10조』]를 남겼답니다!",
        visual: stage1Visuals.hunyo10Doc,
      },
      // 확인문제 1-1
      {
        speaker: "역사별이",
        text: "★ [확인문제 1] 후삼국 시대의 시작부터 고려의 후삼국 통일까지의 과정을 순서대로 바르게 배열하시오.",
        ...withTask(orderSequence(
          [
            { id: "s1-order-3", text: "약해진 신라가 고려에 항복하고 후백제를 물리쳐 후삼국을 통일함", order: 3 },
            { id: "s1-order-1", text: "신라 말 호족이 성장하여 견훤이 후백제, 궁예가 후고구려를 세움", order: 1 },
            { id: "s1-order-2", text: "왕건이 궁예를 몰아내고 고구려를 계승한다는 뜻으로 고려를 건국함", order: 2 },
          ],
          "대단해요! 후삼국의 성립 ➔ 왕건의 고려 건국 ➔ 신라 항복과 후백제 격파로 이어지는 후삼국 통일 순서를 완벽히 이해했습니다!"
        )),
      },
      // 확인문제 1-2
      {
        speaker: "역사별이",
        text: "★ [확인문제 2] 다음 『훈요 10조』의 빈칸 ①, ②에 들어갈 알맞은 낱말을 고르시오.",
        ...withTask({
          type: "document-restore",
          instruction: "",
          docTitle: "『고려사』 태조 왕건의 훈요 10조",
          docBadge: "📜 고려 왕실 비전 문서",
          segments: [
            { text: "• 첫째, 우리 고려는 " },
            { text: "", slotId: "slot-1", slotLabel: "빈칸 ① (종교)" },
            { text: "의 힘으로 세운 나라이니 절을 세우고 주지를 보내 불도를 닦도록 하라.\n• 다섯째, " },
            { text: "", slotId: "slot-2", slotLabel: "빈칸 ② (옛 고구려 수도)" },
            { text: "은(는) 우리나라 땅의 중심이니 그곳에 자주 머물러 나라의 안녕을 이루라.\n• 일곱째, 세금을 줄여 농민의 부담을 가볍게 하고 백성을 돌보라." },
          ],
          options: [
            { id: "doc1-opt-1", text: "불교", targetSlotId: "slot-1", explanation: "첫째 조항은 '불교의 힘으로 세운 나라이니 불교를 장려하라'는 내용입니다!" },
            { id: "doc1-opt-2", text: "서경(평양)", targetSlotId: "slot-2", explanation: "다섯째 조항은 옛 고구려의 수도였던 '서경(평양)'을 중요하게 여기라는 내용입니다!" },
            { id: "doc1-opt-3", text: "거란 풍습", explanation: "훈요 10조에서는 거란의 풍습을 본받지 말고 고려 고유의 풍습을 지키라고 당부했습니다." },
            { id: "doc1-opt-4", text: "완산주(전주)", explanation: "완산주(전주)는 견훤이 세운 후백제의 수도입니다." },
          ],
          successFeedback: "완벽합니다! 불교 장려, 서경(평양) 중시, 농민 세금 감면이 담긴 왕건의 『훈요 10조』 고문서를 멋지게 복원했습니다!",
        }),
      },
      // 확인문제 1-3
      {
        speaker: "역사별이",
        text: "★ [확인문제 3] 태조 왕건의 정책에 대한 설명으로 맞으면 O, 틀리면 X를 선택하시오.",
        ...withTask({
          type: "ox-verdict",
          instruction: "",
          courtTitle: "고려 태조실록 역사 기록",
          statements: [
            {
              id: "s1-ox-3",
              text: "왕건은 고려 고유의 제도와 풍습을 모두 없애고 거란의 언어와 의복을 그대로 따르라고 명령했다.",
              isTrue: false,
              explanation: "틀렸어요(❌)! 왕건은 훈요 10조에서 거란의 풍습을 본받지 말고 고려 고유의 풍습을 지키라고 당부했습니다.",
            },
            {
              id: "s1-ox-1",
              text: "거란에 멸망한 발해 세자 대광현이 유민을 이끌고 오자, 친척의 나라로 여겨 왕씨 성을 내리고 토지와 집을 주었다.",
              isTrue: true,
              explanation: "맞아요(⭕)! 왕건은 고구려의 후손인 발해 유민까지 따뜻하게 받아들여 민족 통합을 이루었습니다.",
            },
            {
              id: "s1-ox-2",
              text: "백성의 생활을 안정시키기 위해 세금을 줄이고, 통일을 도운 호족 세력을 우대하면서도 적절히 견제했다.",
              isTrue: true,
              explanation: "맞아요(⭕)! 왕건은 세금을 줄여 백성을 돌보고 호족을 우대·견제하여 나라의 기틀을 다졌습니다.",
            },
          ],
          successFeedback: "정확한 판결입니다! 왕건의 후삼국 통일과 발해 유민 수용, 훈요 10조를 모두 마스터했습니다! [훈요 10조 나침반] 유물을 획득했습니다.",
        }),
      },
    ],
  },

  // ==========================================
  // STAGE 2: 고려 사회의 모습
  // ==========================================
  {
    id: 2,
    title: "2단계: 고려 사회의 모습 - 과거제, 신분과 여성, 불교 문화",
    shortTitle: "고려 사회의 모습",
    concept: "과거제와 노비 해방, 양인·천인, 여성 지위(손변), 연등회·팔관회",
    mission: "개경의 거리로 들어선 수호대! 고려의 나라 기틀 다지기와 신분, 높은 여성의 지위, 화려한 불교 문화를 탐구하세요!",
    bossName: "후삼국의 전란 수호령",
    bossTitle: "후삼국 통일과 고려 사회 기틀의 시험관",
    bossShortName: "전란수호령",
    color: "#059669",
    background: "linear-gradient(135deg, #065f46, #022c22)",
    bossImage: "/characters/boss-phase-1-goryeo-guardian.webp",
    dialogue: [
      // 인트로
      {
        speaker: "주인공",
        text: "와, 고려의 수도 개경 거리가 정말 활기차! 왕건의 뒤를 이은 왕들은 어떻게 나라의 기틀을 튼튼히 다졌을까?",
      },
      // 1. 노비안검법
      {
        speaker: "주인공",
        text: "광종 임금이 호족들의 눈치를 보지 않고 억울한 백성들을 구해줬다는데?",
        visual: stage2Visuals.nobiLaw,
      },
      {
        speaker: "역사별이",
        text: "호족에게 억울하게 끌려가 노비가 된 백성을 양인으로 풀어주는 [노비안검법]을 단행했답니다!",
        visual: stage2Visuals.nobiLaw,
      },
      // 2. 과거제 실시
      {
        speaker: "주인공",
        text: "가문이나 신분 대신 오직 실력으로 시험을 치러 관리를 뽑았다고?",
        visual: stage2Visuals.hongpaeExam,
      },
      {
        speaker: "역사별이",
        text: "맞아요! 실력 중심의 [과거제]를 실시했고, 저 붉은 종이가 바로 국왕 명의로 발급된 우리나라에서 가장 오래된 과거 합격증인 [장양수 홍패]예요!",
        visual: stage2Visuals.hongpaeExam,
      },
      // 3. 전국 지방관 파견
      {
        speaker: "주인공",
        text: "성종 임금은 수도뿐 아니라 먼 시골 백성들까지 돌보기 위해 어떻게 했어?",
        visual: stage2Visuals.localOfficials,
      },
      {
        speaker: "역사별이",
        text: "최승로의 건의를 받아들여 전국 주요 고을(12목)에 [중앙 관리]를 파견해 백성을 살폈지요.",
        visual: stage2Visuals.localOfficials,
      },
      // 4. 자유민 양인과 농민
      {
        speaker: "주인공",
        text: "고려의 백성들 중 대다수는 어떤 신분이었어?",
        visual: stage2Visuals.yanginFarmers,
      },
      {
        speaker: "역사별이",
        text: "자유민인 [양인]이었어요! 그중에서도 성실하게 농사지으며 나라의 기틀을 지탱한 농민들이 가장 많았답니다.",
        visual: stage2Visuals.yanginFarmers,
      },
      // 5. 천인 노비와 신분 상승
      {
        speaker: "주인공",
        text: "그럼 가장 낮은 신분인 천인은 계속 노비로만 살아야 했어?",
        visual: stage2Visuals.cheoninSlaves,
      },
      {
        speaker: "역사별이",
        text: "전쟁에서 큰 공을 세우거나 과거에 합격하면 신분이 올라갈 수 있을 만큼 고려는 역동적인 사회였어요!",
        visual: stage2Visuals.cheoninSlaves,
      },
      // 6. 아들딸 균등 상속과 손변의 판결
      {
        speaker: "주인공",
        text: "고려에서는 부모 재산을 아들과 딸에게 똑같이 물려주었다는 게 정말이야?",
        visual: stage2Visuals.equalInheritance,
      },
      {
        speaker: "역사별이",
        text: "그럼요! 현명한 관리 [손변]이 누나와 남동생에게 재산을 반씩 공평하게 나누어 준 재판 이야기로도 유명하답니다.",
        visual: stage2Visuals.equalInheritance,
      },
      // 7. 당당했던 고려 여성
      {
        speaker: "주인공",
        text: "가정에서 여성의 권리가 남성과 똑같았다니 정말 놀라워!",
        visual: stage2Visuals.freeWomenStatus,
      },
      {
        speaker: "역사별이",
        text: "아들딸이 돌아가며 부모 제사를 모시고, 여성이 집안의 [가장]이 될 수도 있었을 만큼 지위가 높았어요!",
        visual: stage2Visuals.freeWomenStatus,
      },
      // 8. 연등회와 팔관회
      {
        speaker: "주인공",
        text: "우와! 거리에 오색 등불이 켜지고 음악과 춤이 가득한 저 축제는 뭐야?",
        visual: stage2Visuals.yeondeunghoeFest,
      },
      {
        speaker: "역사별이",
        text: "부처님께 나라의 평안을 빈 [연등회]와, 외국 상인들까지 함께 어우러진 국가 대축제 [팔관회]예요!",
        visual: stage2Visuals.yeondeunghoeFest,
      },
      // 9. 웅장한 불교 예술
      {
        speaker: "주인공",
        text: "저 거대하고 독창적인 석조 불상은 어쩜 저렇게 웅장할까?",
        visual: stage2Visuals.buddhistTreasures,
      },
      {
        speaker: "역사별이",
        text: "높이가 무려 18미터에 달하는 [논산 관촉사 미륵보살]처럼, 고려인들은 담대하고 독창적인 불교 예술을 남겼답니다.",
        visual: stage2Visuals.buddhistTreasures,
      },
      // 확인문제 2-1
      {
        speaker: "역사별이",
        text: "★ [확인문제 1] 장양수 홍패에 대한 내용으로 올바른 것을 고르시오.",
        ...withTask({
          type: "relic-spotlight",
          instruction: "",
          relicName: "국보 장양수 홍패 (과거 합격증)",
          relicBadge: "📜 고려 시대 문서 유산",
          relicImage: "/relics/goryeo_hongpae.webp",
          relicHint: "🔍 단서: 고려 시대에 시험을 치러 관리로 뽑힌 장양수가 받은 붉은 종이의 합격증입니다.",
          options: [
            {
              id: "s2-relic-1",
              text: "개인의 능력을 중시하여 시험으로 관리를 뽑는 '과거제'를 실시해 큰 가문의 세력을 줄이고 왕권을 강화했다.",
              isAnswer: true,
              explanation: "정답입니다! 장양수 홍패는 고려가 시험으로 실력 있는 관리를 뽑는 '과거제'를 실시했음을 보여 주는 귀중한 유물입니다.",
            },
            {
              id: "s2-relic-2",
              text: "오직 태어난 신분에 따라서만 오를 수 있는 관직이 엄격히 정해져 있어 시험을 전혀 치르지 않았다.",
              isAnswer: false,
              explanation: "신분에 따라 관직 등급이 제한된 것은 신라의 특징이며, 고려는 과거제를 통해 개인의 능력을 중시했습니다.",
            },
            {
              id: "s2-relic-3",
              text: "예성강 하구의 벽란도에서 아라비아 상인들에게 비단과 향료를 사고팔 때 쓰던 무역 허가증이다.",
              isAnswer: false,
              explanation: "장양수 홍패는 무역 허가증이 아니라 과거 시험에 급제한 사람에게 내려준 합격증입니다.",
            },
            {
              id: "s2-relic-4",
              text: "몽골의 침입을 부처님의 힘으로 물리치기 위해 나무판에 불교 경전을 새긴 팔만대장경판이다.",
              isAnswer: false,
              explanation: "팔만대장경은 목판 인쇄 유산이며, 사진 속 유물은 과거 합격증인 장양수 홍패입니다.",
            },
          ],
          successFeedback: "명쾌한 감정입니다! 장양수 홍패를 통해 능력 중심으로 관리를 뽑은 고려의 과거제를 완벽히 밝혀냈습니다!",
        }),
      },
      // 확인문제 2-2
      {
        speaker: "역사별이",
        text: "★ [확인문제 2] 다음 역사 카드를 알맞은 신분([양인], [천인])으로 바르게 분류하시오.",
        ...withTask({
          type: "category-sort",
          instruction: "",
          leftBucketTitle: "양인 (자유민 계층)",
          leftBucketDesc: "왕족 · 관리 · 중간 계층 · 일반 농민",
          leftBucketEmoji: "🌾",
          rightBucketTitle: "천인 (예속 계층)",
          rightBucketDesc: "대다수가 노비",
          rightBucketEmoji: "📜",
          items: [
            {
              id: "s2-sort-1",
              text: "대부분 농사를 지으며 나라에 세금을 내는 일반 백성",
              emoji: "🌾",
              category: "left",
              explanation: "농사를 짓고 세금을 내는 일반 백성은 자유민인 '양인'에 속합니다.",
            },
            {
              id: "s2-sort-2",
              text: "나라를 다스리는 왕족과 높은 관리, 중간 계층",
              emoji: "🏛️",
              category: "left",
              explanation: "왕족과 높은 관리, 중간 계층 역시 '양인' 신분에 해당합니다.",
            },
            {
              id: "s2-sort-3",
              text: "대다수가 노비로 지배층이나 절을 위해 일한 사람들",
              emoji: "🧹",
              category: "right",
              explanation: "지배층이나 절에 속해 일하던 노비는 '천인' 신분입니다.",
            },
            {
              id: "s2-sort-4",
              text: "송광사 고려고문서에 재산처럼 기록되어 전해지는 절의 노비",
              emoji: "📜",
              category: "right",
              explanation: "송광사 고려고문서에 기록된 노비들은 '천인' 계층에 속합니다.",
            },
          ],
          successFeedback: "완벽하게 분류했습니다! 고려 사회의 양인(지배층·일반 농민)과 천인(노비)의 특징을 정확히 구분했습니다!",
        }),
      },
      // 확인문제 2-3
      {
        speaker: "역사별이",
        text: "★ [확인문제 3] 고려 시대 여성의 지위와 가족 제도에 대한 설명으로 맞으면 O, 틀리면 X를 선택하시오.",
        ...withTask({
          type: "ox-verdict",
          instruction: "",
          courtTitle: "고려 시대 여성의 지위와 가족 제도",
          statements: [
            {
              id: "s2-ox-1",
              text: "손변의 재판 이야기처럼 고려 시대에는 아들과 딸이 구별 없이 부모의 재산을 똑같이 상속받았다.",
              isTrue: true,
              explanation: "맞아요(⭕)! 고려 시대에는 아들과 딸이 구별 없이 유산을 균등하게 상속받았습니다.",
            },
            {
              id: "s2-ox-3",
              text: "결혼하면 무조건 여자가 남자의 집으로 들어가 살았고, 사위는 처가의 호적에 절대 오를 수 없었다.",
              isTrue: false,
              explanation: "틀렸어요(❌)! 고려 시대에는 결혼 후 남자가 여자의 집에서 사는 것이 일반적이었습니다.",
            },
            {
              id: "s2-ox-2",
              text: "아들과 딸이 돌아가며 부모의 제사를 지냈고, 여성의 재혼이 자유로웠으며 여성이 집안의 가장이 되기도 했다.",
              isTrue: true,
              explanation: "맞아요(⭕)! 가정생활에서 고려 여성은 남성과 동등한 지위를 가졌습니다.",
            },
          ],
          successFeedback: "명판결입니다! 고려의 신분 제도와 남성과 동등했던 여성의 지위를 모두 마스터했습니다! [연등회 소원 불씨] 유물을 획득했습니다!",
        }),
      },
    ],
  },

  // ==========================================
  // STAGE 3: 고려와 주변 나라의 관계
  // ==========================================
  {
    id: 3,
    title: "3단계: 고려와 주변 나라의 관계 - 거란·몽골 항쟁과 벽란도",
    shortTitle: "주변 나라와의 관계",
    concept: "벽란도와 코리아, 서희·강감찬과 천리장성, 몽골 침입과 김윤후",
    mission: "세계와 교류한 국제 무역항 벽란도를 탐구하고, 거란과 몽골의 침략을 지혜와 용기로 물리친 고려의 호국 역사를 정복하세요!",
    bossName: "북방 대초원의 철기 군주",
    bossTitle: "거란·몽골의 침입과 벽란도 외교의 시험관",
    bossShortName: "철기 군주",
    color: "#0284c7",
    background: "linear-gradient(135deg, #0369a1, #082f49)",
    bossImage: "/characters/boss-phase-2-steppe-lord.webp",
    dialogue: [
      // 인트로: 벽란도 국제 무역항 도착
      {
        speaker: "주인공",
        text: "역사별이야! 예성강 하구 벽란도에 큰 배들이 가득하고, 세계 각국에서 온 상인들로 북적이고 있어!",
      },
      // 1. 국제 무역항 벽란도
      {
        speaker: "주인공",
        text: "벽란도 항구에 이국적인 배들이 정말 빽빽해! 이곳에서는 어떤 나라 상인들이 오간 거야?",
        visual: stage3Visuals.byeongnandoPort,
      },
      {
        speaker: "역사별이",
        text: "수심이 깊어 큰 배가 닿기 좋았죠! 송나라의 비단과 약재, 일본과 여진 상인뿐 아니라 수많은 배가 오간 동아시아 최대 무역항이었어요!",
        visual: stage3Visuals.byeongnandoPort,
      },
      // 2. 아라비아 상인과 코리아
      {
        speaker: "주인공",
        text: "먼 서역 바다를 건너온 아라비아 상인들까지 벽란도를 찾아왔다면서?",
        visual: stage3Visuals.arabiaKorea,
      },
      {
        speaker: "역사별이",
        text: "수은과 향료를 가져온 그들이 고려청자와 인삼을 서양에 소개하며, 고려의 이름이 오늘날 [코리아(Korea)]로 전 세계에 알려졌답니다!",
        visual: stage3Visuals.arabiaKorea,
      },
      // 3. 거란 80만 대군의 침입
      {
        speaker: "주인공",
        text: "이렇게 번영하던 고려에 북쪽의 강력한 유목 민족 거란이 80만 대군을 이끌고 쳐들어왔대!",
        visual: stage3Visuals.khitanThreat,
      },
      {
        speaker: "역사별이",
        text: "거란군이 몰려오자 땅을 떼어주고 항복하자는 비겁한 주장 앞에 당당하게 일어선 외교관이 있었어요!",
        visual: stage3Visuals.khitanThreat,
      },
      // 4. 서희의 외교 담판과 강동 6주
      {
        speaker: "주인공",
        text: "칼과 창 대신 말 한마디로 적군을 물리쳤다는 분이 바로 서희 장군이지?",
        visual: stage3Visuals.seoHuiTalk,
      },
      {
        speaker: "역사별이",
        text: "고구려 계승 명분을 앞세워 거란군을 돌려보내고, 오히려 요충지인 [강동 6주] 땅까지 얻어냈답니다!",
        visual: stage3Visuals.seoHuiTalk,
      },
      // 5. 강감찬의 귀주 대첩과 천리장성
      {
        speaker: "주인공",
        text: "거란이 나중에 다시 10만 대군을 이끌고 쳐들어왔을 때는 어떻게 막았어?",
        visual: stage3Visuals.gangGamChan,
      },
      {
        speaker: "역사별이",
        text: "강감찬 장군이 귀주 벌판에서 통쾌하게 대승을 거두었고, 국경에 [천리장성]을 쌓아 튼튼한 방어선을 구축했어요!",
        visual: stage3Visuals.gangGamChan,
      },
      // 6. 세계 최강 몽골 제국의 침입과 강화도 천도
      {
        speaker: "주인공",
        text: "13세기에는 아시아와 유럽을 정복한 세계 최강 몽골 제국이 쳐들어왔다는데, 어떻게 버텨냈어?",
        visual: stage3Visuals.ganghwaIsland,
      },
      {
        speaker: "역사별이",
        text: "바다에 약한 몽골군에 맞서 수도를 [강화도]로 옮기고 온 백성이 30년 동안 끈질기게 저항했어요!",
        visual: stage3Visuals.ganghwaIsland,
      },
      // 7. 김윤후와 처인성 전투
      {
        speaker: "주인공",
        text: "작은 흙성인 처인성에서 정규군도 아닌 백성들이 몽골 대군을 물리쳤다고?",
        visual: stage3Visuals.kimYunHuCheoin,
      },
      {
        speaker: "역사별이",
        text: "승려 [김윤후]와 백성들이 힘을 합쳐 몽골군 총사령관 살리타를 활로 사살하고 대승을 거두었지요!",
        visual: stage3Visuals.kimYunHuCheoin,
      },
      // 8. 충주성 전투와 노비 문서 소각
      {
        speaker: "주인공",
        text: "충주성에서는 몽골군에 포위되었을 때 어떻게 위기를 이겨냈어?",
        visual: stage3Visuals.chungjuBattle,
      },
      {
        speaker: "역사별이",
        text: "김윤후가 노비 문서를 불태우며 '공을 세우면 누구나 양인이 된다!'고 선언하자 온 백성이 뭉쳐 성을 지켰답니다!",
        visual: stage3Visuals.chungjuBattle,
      },
      // 9. 고려양과 몽골풍
      {
        speaker: "주인공",
        text: "오랜 교류를 통해 두 나라의 옷차림과 음식, 악기까지 서로 섞였다면서?",
        visual: stage3Visuals.culturalBlend,
      },
      {
        speaker: "역사별이",
        text: "몽골에서 남성 머리인 [변발]과 혼례용 [족두리], 악기 [태평소], [만두]와 [설렁탕]이 전해졌고, 반대로 몽골에서는 [상추쌈]과 달콤한 [유밀과], [시루떡] 같은 고려 풍습(고려양)이 큰 인기를 끌었답니다!",
        visual: stage3Visuals.culturalBlend,
      },
      // 확인문제 3-1
      {
        speaker: "역사별이",
        text: "★ [확인문제 1] 외세의 침략에 맞서 나라를 지킨 인물과 활약상을 바르게 연결하시오.",
        ...withTask(matchPair(
          [
            { left: "서희", right: "거란의 1차 침입 때 외교 담판을 벌여 싸우지 않고 강동 6주를 얻음", emoji: "📜" },
            { left: "강감찬", right: "거란의 3차 침입 때 귀주에서 거란군을 크게 물리침 (귀주 대첩)", emoji: "⚔️" },
            { left: "김윤후", right: "처인성에서 몽골군 총사령관을 죽이고, 충주성에서 노비 문서를 불태우며 승리함", emoji: "🔥" },
          ],
          "대단해요! 서희의 외교 담판, 강감찬의 귀주 대첩, 김윤후의 처인성·충주성 활약을 완벽히 연결했습니다!"
        )),
      },
      // 확인문제 3-2
      {
        speaker: "역사별이",
        text: "★ [확인문제 2] 다음 벽란도 국제 무역 기록의 빈칸 ①, ②에 들어갈 알맞은 낱말을 고르시오.",
        ...withTask({
          type: "document-restore",
          instruction: "",
          docTitle: "『고려도경』 및 국제 교역 기록",
          docBadge: "⛵ 예성강 국제 무역 기록",
          segments: [
            { text: "• 개경과 가까운 예성강 하구에 위치한 항구인 " },
            { text: "", slotId: "slot-1", slotLabel: "빈칸 ① (국제 무역항)" },
            { text: "은(는) 수심이 깊어 큰 배가 오가기 쉬웠으며, 외국 사신이 머물던 벽란정이 있었다.\n• 이곳에서 송, 거란, 여진, 일본뿐만 아니라 대식국(아라비아) 상인들과도 교류하면서 '고려'라는 이름이 서양에 알려져 오늘날 " },
            { text: "", slotId: "slot-2", slotLabel: "빈칸 ② (우리나라 영문 이름)" },
            { text: "(으)로 불리게 되었다." },
          ],
          options: [
            { id: "doc3-opt-1", text: "벽란도", targetSlotId: "slot-1", explanation: "개경 근처 예성강 하구에 있던 고려의 대표 국제 무역항은 '벽란도'입니다!" },
            { id: "doc3-opt-2", text: "코리아(Korea)", targetSlotId: "slot-2", explanation: "아라비아 상인들을 통해 고려가 서양에 알려지면서 오늘날 '코리아(Korea)'로 불리게 되었습니다!" },
            { id: "doc3-opt-3", text: "강동 6주", explanation: "강동 6주는 서희가 거란과의 외교 담판으로 압록강 동쪽에 확보한 땅입니다." },
            { id: "doc3-opt-4", text: "천리장성", explanation: "천리장성은 거란의 침입을 물리친 뒤 북쪽 국경에 쌓은 성입니다." },
          ],
          successFeedback: "훌륭합니다! 국제 교류의 중심지 벽란도와 '코리아(Korea)'의 유래가 담긴 무역 기록을 완벽하게 복원했습니다!",
        }),
      },
      // 확인문제 3-3
      {
        speaker: "역사별이",
        text: "★ [확인문제 3] 고려와 몽골이 서로 교류하며 주고받은 풍습 카드를 알맞게 분류하시오.",
        ...withTask({
          type: "category-sort",
          instruction: "",
          leftBucketTitle: "몽골 ➔ 고려에 전해진 풍습·음식",
          leftBucketDesc: "고려 사람들의 생활에 들어온 몽골 문화",
          leftBucketEmoji: "🎺",
          rightBucketTitle: "고려 ➔ 몽골에 유행한 음식",
          rightBucketDesc: "몽골 사람들에게 큰 인기를 끈 고려 음식",
          rightBucketEmoji: "🥬",
          items: [
            {
              id: "s3-sort-1",
              text: "남성 머리 모양 '변발', 혼례용 '족두리', 나팔 악기 '태평소'",
              emoji: "🎺",
              category: "left",
              explanation: "변발, 족두리, 태평소는 몽골에서 고려로 전해진 풍습과 악기입니다.",
            },
            {
              id: "s3-sort-2",
              text: "몽골과의 교류를 통해 고려에 전해진 음식인 '만두'와 '설렁탕'",
              emoji: "🥟",
              category: "left",
              explanation: "만두와 설렁탕은 몽골과의 교류를 통해 고려에 전해진 대표적인 음식입니다.",
            },
            {
              id: "s3-sort-3",
              text: "신선한 상추에 밥과 반찬을 싸서 먹는 고려의 '상추쌈'",
              emoji: "🥬",
              category: "right",
              explanation: "상추쌈은 고려에서 몽골로 전해져 인기를 끈 대표 음식입니다.",
            },
            {
              id: "s3-sort-4",
              text: "꿀과 기름으로 만든 '유밀과(약과)'와 정성껏 찐 '시루떡'",
              emoji: "🍘",
              category: "right",
              explanation: "유밀과와 시루떡 역시 몽골에서 큰 인기를 끈 고려 음식입니다.",
            },
          ],
          successFeedback: "완벽합니다! 거란·몽골과의 항쟁과 벽란도 국제 교류, 고려·몽골 문화 교류까지 모두 마스터했습니다! [고려 청동 방울] 유물을 획득했습니다.",
        }),
      },
    ],
  },

  // ==========================================
  // STAGE 4: 고려의 문화와 생활
  // ==========================================
  {
    id: 4,
    title: "4단계: 고려의 문화와 생활 - 청자, 팔만대장경, 금속활자, 목화",
    shortTitle: "고려의 문화와 생활",
    concept: "상감청자와 보물선, 팔만대장경, 금속활자 『직지』, 문익점과 목화",
    mission: "집으로 가는 시간의 문이 있는 마지막 관문! 고려의 독창적인 청자와 인쇄술, 백성의 삶을 바꾼 목화를 탐구하세요!",
    bossName: "고려의 수호여제",
    bossTitle: "고려 문화의 최종 수호자",
    bossShortName: "고려 수호여제",
    color: "#7e22ce",
    background: "linear-gradient(135deg, #581c87, #3b0764)",
    bossImage: "/characters/boss-phase-3-goryeo-overlord.webp",
    dialogue: [
      // 인트로: 4대 문화 영역 로드맵
      {
        speaker: "주인공",
        text: "드디어 시간의 문이 기다리는 마지막 4단계야! 고려의 찬란한 문화는 청자 공예부터 팔만대장경, 금속 활자, 그리고 백성의 삶을 바꾼 목화도 있지!",
      },
      {
        speaker: "역사별이",
        text: "네, 맞아요! 흙과 불로 빚은 [비색 청자]에서 시작해, 구국의 염원을 담은 [팔만대장경], 인쇄 혁명의 [금속 활자], 그리고 온 백성을 따뜻하게 한 [목화]까지 4대 문화의 보물을 차례대로 탐구해 봐요!",
      },
      // ==========================================
      // [제1부: 흙과 불의 비색 예술 - 상감청자와 바다 보물선]
      // ==========================================
      // 1. 상감청자의 신비
      {
        speaker: "주인공",
        text: "우와! 먼저 첫 번째 보물인 도자기야! 푸른 비취색 도자기에 하늘을 나는 학이 살아 숨 쉬는 것 같아! 어떻게 새긴 걸까?",
        visual: stage4Visuals.sanggamCeladon,
      },
      {
        speaker: "역사별이",
        text: "도자기 표면을 파내고 다른 색 흙을 메꾸어 굽는 고려만의 독창적인 [상감 기법]으로 빚어냈답니다!",
        visual: stage4Visuals.sanggamCeladon,
      },
      // 2. 귀족들의 생활 속 청자
      {
        speaker: "주인공",
        text: "향로와 주전자, 연적까지 도자기로 만들었다니 고려 귀족들의 생활이 정말 화려했구나!",
        visual: stage4Visuals.noblesLifeCeladon,
      },
      {
        speaker: "역사별이",
        text: "비싸고 귀한 상감청자는 주로 왕실과 지배층이 사용하며 고려의 찬란한 문화 예술을 뽐냈어요.",
        visual: stage4Visuals.noblesLifeCeladon,
      },
      // 3. 바다 밑 태안 보물선
      {
        speaker: "주인공",
        text: "서해 태안 앞바다에서 청자를 가득 실은 침몰선이 발견되었다는 게 정말이야?",
        visual: stage4Visuals.taeanShipwreck,
      },
      {
        speaker: "역사별이",
        text: "전남 강진 가마터에서 수도 개경으로 가던 보물선이 800년 만에 온전한 모습으로 발굴되었답니다!",
        visual: stage4Visuals.taeanShipwreck,
      },
      // ==========================================
      // [제2부: 국난 극복의 호국 불교 - 팔만대장경과 장경판전]
      // 서사 브릿지: 화려한 귀족 예술 ➔ 외세 침략에 맞선 전 국민의 염원
      // ==========================================
      // 4. 팔만대장경판
      {
        speaker: "주인공",
        text: "귀족들의 화려한 청자 예술도 놀랍지만, 몽골의 침략이라는 큰 위기 속에서 온 나라의 염원을 모은 거대한 문화유산도 있다면서?",
        visual: stage4Visuals.tripitakaBoards,
      },
      {
        speaker: "역사별이",
        text: "맞아요! 몽골 침입을 부처님의 힘으로 물리치길 바라며 16년에 걸쳐 8만여 장의 나무판에 경전을 한 글자 한 글자 정성껏 새긴 [팔만대장경]이에요!",
        visual: stage4Visuals.tripitakaBoards,
      },
      // 5. 해인사 장경판전의 과학
      {
        speaker: "주인공",
        text: "나무판인데 수백 년 동안 썩거나 뒤틀리지 않고 지금까지 온전히 보존된 비결이 뭐야?",
        visual: stage4Visuals.janggyeongPanjeon,
      },
      {
        speaker: "역사별이",
        text: "창문의 크기를 위아래 반대로 내어 바람길을 내고, 바닥에 숯과 소금을 깐 과학적 설계 덕분이지요!",
        visual: stage4Visuals.janggyeongPanjeon,
      },
      // ==========================================
      // [제3부: 세계 인쇄사의 대혁명 - 금속 활자와 『직지』]
      // 서사 브릿지: 목판의 한계(수정 불가)를 뛰어넘은 지식 전파의 활자 혁명
      // ==========================================
      // 6. 금속 활자 발명
      {
        speaker: "주인공",
        text: "나무판으로 인쇄하는 팔만대장경도 대단하지만, 목판은 한 번 새기면 글자를 고칠 수 없잖아? 고려는 더 다양하고 많은 책을 찍기 위해 어떤 기술을 개발했을까?",
        visual: stage4Visuals.metalTypeInvention,
      },
      {
        speaker: "역사별이",
        text: "바로 글자를 쇠로 만들어 자유롭게 조합하는 [금속 활자]예요! 밀랍에 글자를 새겨 황토를 감싸고, 쇳물을 부어 식힌 뒤 활자를 떼어내 판에 배열해 찍어내는 세계 최초의 발명이었답니다!",
        visual: stage4Visuals.metalTypeInvention,
      },
      // 7. 세계 최고 금속활자본 『직지』
      {
        speaker: "주인공",
        text: "세계에서 가장 오래된 금속 활자 책이 바로 우리나라의 『직지』구나!",
        visual: stage4Visuals.jikjiWorldHeritage,
      },
      {
        speaker: "역사별이",
        text: "1377년 청주 흥덕사에서 인쇄된 [『직지』]는 서양보다 78년이나 앞선 자랑스러운 유네스코 세계기록유산이에요!",
        visual: stage4Visuals.jikjiWorldHeritage,
      },
      // ==========================================
      // [제4부: 백성의 겨울을 바꾼 의생활 혁명 - 문익점의 목화와 무명]
      // 서사 브릿지: 지배층·학자의 문화를 넘어 일반 백성의 삶을 바꾼 기적
      // ==========================================
      // 8. 문익점과 정천익의 목화씨
      {
        speaker: "주인공",
        text: "청자와 인쇄술이 왕실과 귀족, 학자들의 문화였다면, 겨울철 혹독한 추위에 떨던 보통 백성들의 고단한 삶을 따뜻하게 바꾼 기적 같은 사건도 있지?",
        visual: stage4Visuals.cottonSeedMunikjeom,
      },
      {
        speaker: "역사별이",
        text: "정말 핵심을 짚었어요! 문익점 선생님이 원나라에서 목화씨를 들여와, 장인 정천익과 함께 수많은 실패를 딛고 마침내 재배에 성공해 실을 뽑았답니다!",
        visual: stage4Visuals.cottonSeedMunikjeom,
      },
      // 9. 추위를 녹인 무명옷
      {
        speaker: "주인공",
        text: "목화솜으로 만든 무명옷 덕분에 백성들의 겨울이 완전히 달라졌겠네?",
        visual: stage4Visuals.cottonClothesLife,
      },
      {
        speaker: "역사별이",
        text: "겨울에도 삼베 옷을 입고 떨던 온 백성들에게 따뜻한 솜옷과 이불을 선물한 위대한 의생활 혁명이었어요!",
        visual: stage4Visuals.cottonClothesLife,
      },
      // 확인문제 4-1
      {
        speaker: "역사별이",
        text: "★ [확인문제 1] 청자 상감운학문 매병에 대한 설명으로 올바른 것을 고르시오.",
        ...withTask({
          type: "relic-spotlight",
          instruction: "",
          relicName: "국보 청자 상감운학문 매병",
          relicBadge: "🏺 고려 대표 공예 유산",
          relicImage: "/relics/goryeo_celadon_maebyeong.webp",
          relicHint: "🔍 단서: 푸른 비취색 바탕에 구름과 학 무늬가 새겨진 매병으로, 탐진(강진)에서 개경으로 운반하던 배가 태안 앞바다 보물선으로 발견되기도 했습니다.",
          options: [
            {
              id: "s4-relic-1",
              text: "겉면에 무늬를 새겨 파내고 다른 색의 흙으로 메꾼 뒤 유약을 발라 굽는 고려만의 독창적인 '상감 기법'으로 만들었으며, 비싸고 귀해 주로 지배층이 사용했다.",
              isAnswer: true,
              explanation: "정답입니다! 고려청자는 독창적인 상감 기법으로 만들어졌으며, 주로 지배층이 사용했습니다.",
            },
            {
              id: "s4-relic-2",
              text: "중국에서 상감 기법을 그대로 들여와 만들었으며, 값이 매우 싸서 주로 일반 서민들이 농사지을 때 사용했다.",
              isAnswer: false,
              explanation: "상감 기법은 중국에서 들여온 것이 아니라 고려 사람들이 발전시킨 독창적인 기법이며, 주로 지배층이 사용했습니다.",
            },
            {
              id: "s4-relic-3",
              text: "밀랍에 글자를 새기고 황토 반죽을 감싼 뒤 쇳물을 부어 만든 세계 최초의 금속 활자 인쇄본이다.",
              isAnswer: false,
              explanation: "그것은 고려의 금속 활자와 『직지』에 대한 설명입니다.",
            },
            {
              id: "s4-relic-4",
              text: "몽골의 침입을 물리치기 위해 자작나무 판에 글자를 새겨 해인사 장경판전에 보관한 목판이다.",
              isAnswer: false,
              explanation: "그것은 팔만대장경에 대한 설명입니다.",
            },
          ],
          successFeedback: "정확한 감정입니다! 독창적인 상감 기법과 지배층의 생활용품이었던 고려청자의 특징을 완벽히 밝혀냈습니다!",
        }),
      },
      // 확인문제 4-2
      {
        speaker: "역사별이",
        text: "★ [확인문제 2] 금속활자본 『직지』가 만들어지는 인쇄 과정을 순서대로 바르게 배열하시오.",
        ...withTask(orderSequence(
          [
            { id: "step-2", text: "황토 반죽을 감싼 밀랍 가지에 쇳물을 붓고 식은 후 활자 떼기", order: 2 },
            { id: "step-3", text: "인쇄할 내용에 맞추어 활자를 배열하고 인쇄하기", order: 3 },
            { id: "step-1", text: "밀랍에 글자를 새기고 밀랍 가지를 만들어 황토 반죽 감싸기", order: 1 },
          ],
          "대단해요! 밀랍 글자 새기기 및 황토 감싸기 ➔ 쇳물 부어 활자 떼기 ➔ 활자 배열 후 인쇄하기까지 금속 활자 제작 과정을 완벽히 마스터했습니다!"
        )),
      },
      // 확인문제 4-3
      {
        speaker: "역사별이",
        text: "★ [확인문제 3] 팔만대장경에 대한 기록을 읽고 빈칸 ①, ②에 들어갈 알맞은 말을 고르시오.",
        ...withTask({
          type: "document-restore",
          instruction: "",
          docTitle: "『고려 문화와 생활 총람』",
          docBadge: "📖 고려 문화유산 핵심 기록",
          segments: [
            { text: "• 고려 사람들은 부처님의 힘으로 몽골의 침입을 물리치기를 바라며 팔만여 장의 " },
            { text: "", slotId: "slot-1", slotLabel: "빈칸 ① (불교 경전 목판)" },
            { text: "을(를) 만들었고, 세계 최초로 금속 활자를 발명해 『직지』를 인쇄했다.\n• 또한 문익점이 원에서 가져온 목화씨를 장인 정천익과 함께 재배하는 데 성공하면서, 목화솜에서 실을 뽑아 만든 부드럽고 따뜻한 " },
            { text: "", slotId: "slot-2", slotLabel: "빈칸 ② (목화솜 옷감)" },
            { text: "이(가) 널리 퍼져 백성의 의생활이 크게 개선되었다." },
          ],
          options: [
            { id: "doc4-opt-1", text: "팔만대장경", targetSlotId: "slot-1", explanation: "몽골의 침입을 부처님의 힘으로 물리치기를 바라며 만든 목판은 '팔만대장경'입니다!" },
            { id: "doc4-opt-2", text: "무명옷", targetSlotId: "slot-2", explanation: "목화솜에서 실을 뽑아 만든 부드럽고 따뜻한 옷은 '무명옷'입니다!" },
            { id: "doc4-opt-3", text: "모시옷", explanation: "모시옷은 모시풀로 짠 옷감으로 까칠하고 바람이 잘 통해 여름에 주로 입었습니다." },
            { id: "doc4-opt-4", text: "장양수 홍패", explanation: "장양수 홍패는 고려 시대 과거 시험 합격증입니다." },
          ],
          successFeedback: "축하합니다! 고려의 건국부터 사회, 대외 관계, 찬란한 문화까지 4대 영역을 모두 정복했습니다! [비색 청자 거울] 유물을 획득했습니다.",
        }),
      },
      {
        speaker: "역사별이",
        text: "수호자님, 저길 보세요! 후삼국과 고려의 4대 역사 지혜를 모두 모으자 현대로 통하는 시간의 문을 지키는 3단계 고려 수호 보스들이 깨어났습니다!\n배운 역사 지식으로 3단계 보스를 모두 물리치고 시간의 문을 활짝 열어봐요!",
        bgImage: "/backgrounds/stage4_goryeo_bosses_awakened_bg.webp",
      },
    ],
  },

  // ==========================================
  // STAGE 5: 역사 카드배틀 (1~4단계 정복자 무제한 입장 모드)
  // ==========================================
  {
    id: 5,
    title: "5단계: 역사 카드배틀 - 고려 수호신 총력전",
    shortTitle: "역사 카드배틀",
    concept: "후삼국 통일부터 고려 문화까지 전 범위 총력 배틀",
    mission: "1~4단계에서 쌓은 모든 고려 역사 지식과 카드 전략으로 시간의 수호신과의 3단계 최종 결전을 돌파하세요!",
    bossName: "고려의 수호여제",
    bossTitle: "고려 문화의 최종 수호자",
    bossShortName: "고려 수호여제",
    color: "#dc2626",
    background: "linear-gradient(135deg, #450a0a, #1c1917)",
    bossImage: "/characters/boss-phase-3-goryeo-overlord.webp",
    dialogue: [
      {
        speaker: "역사별이",
        text: "수호자님, 환영합니다! 이곳은 1~4단계를 모두 정복한 진정한 역사 수호자만이 도전할 수 있는 [역사 카드배틀]의 전장입니다!\n후삼국 통일부터 고려의 사회·외교·문화까지 출제되는 전 범위 역사 퀴즈를 맞히고, 강력한 스탠스 카드로 고려 수호 보스를 물리쳐 보세요!",
      },
    ],
  },
];

// 캐릭터 선택지
export type CharacterId = "bau" | "ara" | "narae";
export type Character = {
  id: CharacterId;
  name: string;
  role: string;
  meaning: string;
  image: string;
  desc?: string;
  avatar?: string;
  physicalDefense: number;
  magicDefense: number;
};

export const characters: Character[] = [
  {
    id: "bau",
    name: "마루",
    role: "역사 지킴이",
    meaning: "산마루처럼 높고 바위처럼 단단하게 고려의 국경과 역사를 지키는 든든한 수호자",
    image: "/characters/maru.webp",
    desc: "단단한 역사 지식과 고려 호랑이 수호 방패로 동료를 지키는 든든한 지킴이",
    avatar: "🛡️",
    physicalDefense: 4,
    magicDefense: 0,
  },
  {
    id: "ara",
    name: "슬기",
    role: "역사 탐구자",
    meaning: "밝고 깊은 슬기로 고려의 유물과 유적 속 역사 진실을 예리하게 파헤치는 지혜로운 탐구자",
    image: "/characters/seulgi.webp",
    desc: "예리한 돋보기와 깊은 슬기로 고려 유적과 유물의 비밀을 파헤치는 탐구자",
    avatar: "🔍",
    physicalDefense: 2,
    magicDefense: 2,
  },
  {
    id: "narae",
    name: "아리",
    role: "시간 길잡이",
    meaning: "아리땁고 신비로운 별빛 지팡이로 후삼국과 고려 500년 시간의 흐름을 밝히는 길잡이",
    image: "/characters/ari.webp",
    desc: "영롱한 별빛 지팡이로 역사의 흐름과 시간을 꿰뚫어 보는 지혜로운 길잡이",
    avatar: "✨",
    physicalDefense: 0,
    magicDefense: 4,
  },
];
