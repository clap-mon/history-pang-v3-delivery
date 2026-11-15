import type { StageId, BossPhase } from "./content.ts";
import { getOrDrawTemplateIndex } from "./quiz-deck.ts";

export type Difficulty = "EASY" | "NORMAL" | "HARD";
export type QuizOption = {
  id: string;
  text: string;
  symbol?: string;
  symbols?: string[];
  equation?: { leftIcon: string; rightIcons: string[] };
  isCorrect: boolean;
  isLucky: boolean;
  isBomb: boolean;
  explanation: string;
  misconception?: string;
};

export type ReferenceNote = {
  tag?: string;
  label: string;
  desc: string;
  symbol: string;
  source?: string;
};

export type Quiz = {
  id: string;
  stageId: StageId;
  prompt: string;
  diagram?: string;
  diagramTitle?: string;
  referenceNote?: ReferenceNote;
  difficulty: Difficulty;
  options: QuizOption[];
};

export function parseEquationOption(_text: string): { leftIcon: string; rightIcons: string[] } | null {
  return null;
}
export function getSymbolsForText(_text: string): string[] {
  return [];
}
export function getSymbolForText(_text: string): string | undefined {
  return undefined;
}

export function getDiagramForStage(stageId: StageId, _prompt: string): { src: string; title: string } | undefined {
  if (stageId === 1) return { src: "/backgrounds/stage1_goryeo_unification_bg.webp", title: "1단계: 고려의 건국과 후삼국 통일" };
  if (stageId === 2) return { src: "/backgrounds/stage2_goryeo_society_bg.webp", title: "2단계: 고려 사회의 모습" };
  if (stageId === 3) return { src: "/backgrounds/stage3_goryeo_diplomacy_bg.webp", title: "3단계: 고려와 주변 나라의 관계" };
  if (stageId === 4) return { src: "/backgrounds/stage4_goryeo_culture_bg.webp", title: "4단계: 고려의 문화와 생활" };
  return undefined;
}

export function makePrng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
  };
}

export function seedForQuiz(stageId: StageId | number, round: number, session = "historypang-v3"): number {
  let hash = 2166136261;
  for (const char of `${session}:${stageId}:${round}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function int(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}
function pick<T>(rng: () => number, values: T[]): T {
  return values[int(rng, 0, values.length - 1)];
}
function shuffle<T>(rng: () => number, values: T[]): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = int(rng, 0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function finalize(
  stageId: StageId,
  round: number,
  prompt: string,
  difficulty: Difficulty,
  rows: (Omit<QuizOption, "id" | "isLucky" | "isBomb"> & { symbol?: string })[],
  rng: () => number,
  referenceNote?: ReferenceNote,
): Quiz {
  if (rows.length !== 5 || rows.filter((row) => row.isCorrect).length !== 3 || new Set(rows.map((row) => row.text)).size !== 5) {
    throw new Error("퀴즈는 서로 다른 보기 5개와 정답 3개로 구성해야 합니다.");
  }
  const correct = rows.filter((row) => row.isCorrect);
  const wrong = rows.filter((row) => !row.isCorrect);
  const luckyText = pick(rng, correct).text;
  const bombText = pick(rng, wrong).text;
  const options = rows.map((row, index) => {
    return {
      ...row,
      id: `s${stageId}-r${round}-o${index}`,
      symbol: row.symbol,
      symbols: row.symbol ? [row.symbol] : [],
      isLucky: row.text === luckyText,
      isBomb: row.text === bombText,
    };
  });
  const diagramInfo = getDiagramForStage(stageId, prompt);
  return {
    id: `stage-${stageId}-round-${round}`,
    stageId,
    prompt,
    diagram: diagramInfo?.src,
    diagramTitle: diagramInfo?.title,
    referenceNote,
    difficulty,
    options,
  };
}

// 🏛️ 역사 퀴즈 템플릿 인터페이스
type RawQuizTemplate = {
  prompt: string;
  difficulty: Difficulty;
  correctPool: { text: string; explanation: string; symbol?: string }[];
  wrongPool: { text: string; explanation: string; misconception?: string; symbol?: string }[];
  referenceNote?: ReferenceNote;
};

// ============================================================================
// 1단계: 고려의 건국과 후삼국 통일 - 10개 템플릿
// ============================================================================
const stage1Templates: RawQuizTemplate[] = [
  {
    prompt: "통일신라 말의 혼란 속에서 성장한 [호족]과 [후삼국 시대의 시작]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "통일신라 말 지배층의 권력 다툼으로 나라가 혼란해지자 지방에서 호족이 성장했다.", explanation: "중앙 정부의 통제력이 약해지자 지방에서 새로운 세력이 일어났습니다.", symbol: "⚔️" },
      { text: "호족은 경제력과 군사력을 바탕으로 자기 지역을 스스로 다스린 지방 정치 세력이었다.", explanation: "성주나 장군을 칭하며 지방의 실질적인 지배자로 성장했습니다.", symbol: "🏰" },
      { text: "세력을 키운 견훤이 완산주(전주)를 수도로 삼아 후백제를 세웠다.", explanation: "견훤이 옛 백제 땅에서 후백제를 건국했습니다.", symbol: "🚩" },
      { text: "궁예가 후고구려를 세우면서 신라, 후백제와 함께 후삼국 시대가 시작되었다.", explanation: "신라, 후백제, 후고구려가 맞서는 후삼국 시대가 열렸습니다.", symbol: "🗺️" },
    ],
    wrongPool: [
      { text: "신라의 귀족들이 지방 호족들을 모두 왕경(경주)으로 불러들여 관직을 독점시켰다.", explanation: "신라 중앙 정부는 권력 다툼에 빠져 지방 호족들을 통제하거나 포섭하지 못했습니다.", symbol: "❌" },
      { text: "신라 말 왕권이 더욱 강해져 지방에는 아무런 세력도 나타나지 못했다.", explanation: "지배층의 권력 다툼으로 왕권이 약해지고 지방에서 호족이 성장했습니다.", symbol: "❌" },
      { text: "거란과 몽골이 신라 땅에 들어와 후백제와 후고구려를 세웠다.", explanation: "견훤과 궁예 등 지방 호족 세력이 후백제와 후고구려를 세웠습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "후삼국 성립", label: "호족의 성장과 후삼국", desc: "신라 말 경제력·군사력을 갖춘 호족이 성장해 후백제(견훤)와 후고구려(궁예)가 세워짐", symbol: "🏰" },
  },
  {
    prompt: "왕건이 세운 새로운 나라 [고려의 건국(918년)]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "왕건이 가혹한 정치를 펼치던 궁예를 몰아내고 신하들의 추대로 왕이 되었다.", explanation: "궁예가 무리한 정치로 민심을 잃자 왕건이 새 왕으로 추대되었습니다.", symbol: "👑" },
      { text: "고구려를 계승한다는 뜻으로 나라 이름을 '고려'라고 정했다.", explanation: "옛 고구려의 기상과 역사를 이어받는다는 의미를 담았습니다.", symbol: "🏛️" },
      { text: "왕건의 세력 기반이었던 송악(개성)으로 수도를 옮겨 통일의 기틀을 다졌다.", explanation: "919년 수도를 철원에서 송악(개성)으로 옮겼습니다.", symbol: "📍" },
      { text: "옛 고구려의 수도였던 서경(평양)을 북진과 통일의 중요 거점으로 여겼다.", explanation: "고구려 계승 의식을 바탕으로 서경을 매우 중요하게 여겼습니다.", symbol: "🧭" },
    ],
    wrongPool: [
      { text: "백제를 계승한다는 뜻으로 나라 이름을 '후백제'라고 정했다.", explanation: "후백제는 견훤이 세운 나라이며, 왕건은 고구려를 계승해 '고려'를 세웠습니다.", symbol: "❌" },
      { text: "처음부터 강화도에 수도를 정하고 몽골군과 30년간 전쟁을 벌였다.", explanation: "강화도 천도는 고려 후기 몽골 침입 때의 일입니다.", symbol: "❌" },
      { text: "신분에 따라 관직을 제한하던 신라의 제도를 그대로 이어받아 호족들의 진출을 막았다.", explanation: "왕건은 호족 세력을 적극 포용하며 새로운 나라를 세웠습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "고려 건국", label: "왕건의 고려 건국(918)", desc: "궁예를 몰아내고 고구려를 계승한다는 뜻으로 '고려'를 건국하고 송악을 수도로 삼음", symbol: "👑" },
  },
  {
    prompt: "고려가 이룩한 [후삼국 통일 과정]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "고려는 거란에 멸망한 발해 유민을 친척이라고 여기고 따뜻하게 받아들였다.", explanation: "발해 유민까지 포용하여 민족의 힘을 하나로 모았습니다.", symbol: "🤝" },
      { text: "국력이 약해진 신라가 스스로 고려에 나라를 넘기며 항복(935년)했다.", explanation: "약해진 신라가 전쟁 없이 평화롭게 고려에 항복했습니다.", symbol: "🏳️" },
      { text: "신라의 항복을 받은 뒤 후백제군을 물리쳐 후삼국을 통일(936년)했다.", explanation: "후백제를 최종적으로 물리치며 분열된 후삼국을 하나로 합쳤습니다.", symbol: "🚩" },
      { text: "고려 건국(918) ➔ 신라 항복(935) ➔ 후백제 멸망(936)의 순서로 통일을 완성했다.", explanation: "차례대로 후삼국 통일을 완성해 나갔습니다.", symbol: "📜" },
    ],
    wrongPool: [
      { text: "당나라 군대와 손잡고 백제와 고구려를 멸망시켜 삼국을 통일했다.", explanation: "당나라와 연합한 것은 신라의 삼국 통일이며, 고려는 외세의 도움 없이 자주적으로 후삼국을 통일했습니다.", symbol: "❌" },
      { text: "후백제를 먼저 멸망시킨 뒤 마지막에 고려가 세워졌다.", explanation: "고려 건국(918) 후 신라 항복(935), 후백제 멸망(936) 순으로 진행되었습니다.", symbol: "❌" },
      { text: "거란군의 군사 지원을 받아 신라와 후백제를 무력으로 정복했다.", explanation: "고려는 거란을 적대시했으며 스스로의 힘으로 후삼국을 통일했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "후삼국 통일", label: "후삼국 통일 완성 과정", desc: "고려 건국(918) ➔ 발해 유민 수용 ➔ 신라 항복(935) ➔ 후백제 멸망(936)", symbol: "⚔️" },
  },
  {
    prompt: "『고려사』 기록을 통해 알 수 있는 [왕건의 발해 유민 수용]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "거란에 멸망한 발해의 세자 대광현이 수만 명의 유민을 이끌고 고려로 왔다.", explanation: "발해가 멸망하자 많은 발해 유민이 같은 민족인 고려로 넘어왔습니다.", symbol: "🚶" },
      { text: "왕건은 대광현에게 고려 왕실의 성씨인 '왕' 씨 성을 내리고 왕족으로 삼았다.", explanation: "발해 세자를 왕족으로 예우하고 집안 제사를 받들게 했습니다.", symbol: "👑" },
      { text: "대광현을 따르는 발해 유민에게도 관직을 주고, 군사들에게는 토지와 집을 주었다.", explanation: "발해 유민들이 고려 사회에 안정적으로 정착하도록 적극 도왔습니다.", symbol: "🏘️" },
      { text: "신라와 후백제뿐만 아니라 발해 유민까지 받아들여 진정한 민족 통합을 이루었다.", explanation: "고구려를 함께 계승한 발해 유민까지 포용한 위대한 민족 통합이었습니다.", symbol: "🤝" },
    ],
    wrongPool: [
      { text: "발해 유민들을 적국의 백성으로 여겨 모두 섬으로 유배 보냈다.", explanation: "섬으로 유배 보낸 것은 거란의 사신들이며, 발해 유민은 친척처럼 우대했습니다.", symbol: "❌" },
      { text: "발해 세자 대광현의 재산을 빼앗고 모든 발해 유민을 노비로 삼았다.", explanation: "왕건은 대광현에게 왕씨 성을 내리고 유민들에게 관직과 토지를 주었습니다.", symbol: "❌" },
      { text: "거란과의 우호를 지키기 위해 발해 유민들을 다시 거란으로 돌려보냈다.", explanation: "왕건은 발해를 멸망시킨 거란을 미워하고 발해 유민을 따뜻하게 받아들였습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "민족 통합 사료", label: "발해 세자 대광현과 민족 통합", desc: "왕건은 발해 유민을 친척으로 여겨 대광현에게 왕씨 성을 내리고 토지와 집을 줌", symbol: "🤝" },
  },
  {
    prompt: "후삼국을 통일한 뒤 [태조 왕건이 펼친 정책]에 대한 설명으로 옳은 것을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "오랜 전쟁에 지친 백성의 생활을 안정시키기 위해 세금을 줄여 주었다.", explanation: "농민의 세금 부담을 줄여 백성이 편안하게 농사짓도록 했습니다.", symbol: "🌾" },
      { text: "가난한 백성이 굶주리지 않도록 곡식을 나누어 주는 등 민생 안정에 힘썼다.", explanation: "백성을 나라의 근본으로 여겨 굶주린 백성을 구제했습니다.", symbol: "🍚" },
      { text: "후삼국 통일에 도움을 준 호족 세력을 우대하면서도 적절히 견제했다.", explanation: "호족과 혼인하거나 혜택을 주면서도 왕권을 위협하지 못하게 견제했습니다.", symbol: "⚖️" },
      { text: "후대 왕들이 나라를 다스릴 때 지켜야 할 열 가지 가르침인 『훈요 10조』를 남겼다.", explanation: "훈요 10조는 고려 왕실의 중요한 통치 지침이 되었습니다.", symbol: "📜" },
    ],
    wrongPool: [
      { text: "전쟁 비용을 마련하기 위해 농민들에게 세금을 열 배로 무겁게 거두었다.", explanation: "왕건은 백성의 부담을 덜어 주기 위해 세금을 감면했습니다.", symbol: "❌" },
      { text: "통일을 도운 호족들을 하루아침에 모두 처형하고 사유 재산을 금지했다.", explanation: "왕건은 호족 세력을 우대하며 포용하는 동시에 적절히 견제했습니다.", symbol: "❌" },
      { text: "불교를 금지하고 전국의 모든 절과 탑을 허물도록 명령했다.", explanation: "왕건은 불교의 힘으로 나라를 세웠다며 불교를 적극 장려했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "왕건의 정책", label: "태조 왕건의 통치 정책", desc: "백성 세금 감면, 호족 우대와 견제, 후대 왕들을 위한 훈요 10조 제시", symbol: "📜" },
  },
  {
    prompt: "왕건이 후대 왕들에게 남긴 열 가지 가르침인 [훈요 10조]의 내용으로 옳은 것을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "불교의 힘으로 나라를 세웠으니 절을 세우고 불교를 장려할 것을 당부했다.", explanation: "불교를 나라를 지키는 정신적 기둥으로 삼았습니다.", symbol: "☸️" },
      { text: "옛 고구려의 수도였던 서경(평양)을 중요하게 여길 것을 강조했다.", explanation: "고구려의 옛 땅을 회복하려는 북진 의지가 담겨 있습니다.", symbol: "🧭" },
      { text: "농민의 세금과 노역 부담을 가볍게 하여 백성이 편안히 살게 하라고 가르쳤다.", explanation: "백성의 생활 안정이 나라의 근본임을 강조했습니다.", symbol: "🌾" },
      { text: "중국의 제도를 억지로 따르지 말고 거란의 풍습을 본받지 말라고 당부했다.", explanation: "고려 고유의 제도와 풍습을 자주적으로 지켜 나가길 바랐습니다.", symbol: "📜" },
    ],
    wrongPool: [
      { text: "발해를 멸망시킨 거란의 의복과 제도를 그대로 따라 배우라고 명령했다.", explanation: "훈요 10조에서는 거란의 풍습을 결코 본받지 말라고 경계했습니다.", symbol: "❌" },
      { text: "고려 고유의 풍습을 버리고 무조건 중국의 제도만 똑같이 따르라고 했다.", explanation: "중국의 제도를 억지로 따르지 말고 고려의 독자성을 지키라고 했습니다.", symbol: "❌" },
      { text: "서경(평양)을 버리고 오직 경주만 중요하게 여기라고 당부했다.", explanation: "옛 고구려 수도였던 서경(평양)을 중요하게 여기라고 했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "훈요 10조", label: "훈요 10조의 가르침", desc: "불교 장려, 서경(평양) 중시, 농민 부담 경감, 고려 고유 풍습 수호", symbol: "📜" },
  },
  {
    prompt: "평양 조선중앙역사박물관에 있는 [태조 왕건 청동상]과 왕건의 업적에 대해 옳은 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "왕건이 황제의 관을 쓰고 있는 모습을 통해 고려 왕실의 높은 자부심을 알 수 있다.", explanation: "황제의 관을 쓴 모습은 자주 국가 고려의 당당한 위상을 보여 줍니다.", symbol: "👑" },
      { text: "918년 고려를 세운 뒤 신라의 항복을 받고 후백제를 물리쳐 후삼국을 통일했다.", explanation: "분열되었던 후삼국을 하나로 통일한 고려의 초대 왕입니다.", symbol: "🚩" },
      { text: "발해 유민까지 따뜻하게 포용하여 우리 민족의 진정한 통합을 이룩했다.", explanation: "고구려·백제·신라·발해의 후손을 하나로 아우른 통일이었습니다.", symbol: "🤝" },
      { text: "세금 감면과 호족 포용, 훈요 10조를 통해 고려 왕조 500년의 기틀을 세웠다.", explanation: "안정적인 통치 체제의 기반을 마련했습니다.", symbol: "🏛️" },
    ],
    wrongPool: [
      { text: "신라의 마지막 왕 경순왕을 강제로 폐위시키고 처형한 냉혹한 정복 군주였다.", explanation: "왕건은 스스로 찾아와 항복한 신라 경순왕을 따뜻하게 예우하고 높은 벼슬을 내렸습니다.", symbol: "❌" },
      { text: "몽골의 침입을 받아 수도를 강화도로 옮긴 고려 후기의 왕이었다.", explanation: "왕건은 고려를 처음 세우고 후삼국을 통일한 제1대 왕(태조)입니다.", symbol: "❌" },
      { text: "원에서 목화씨를 가져와 무명옷을 보급한 고려 말의 관리였다.", explanation: "목화씨를 가져온 인물은 고려 말의 문익점입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "고려 왕실", label: "태조 왕건의 자주적 위상", desc: "황제의 관을 쓰고 있는 왕건의 모습으로 자주 국가 고려의 당당한 위상을 보여 줌", symbol: "👑" },
  },
  {
    prompt: "고려가 나라 이름을 ['고려'로 정한 까닭]과 고구려 계승 노력에 대한 설명으로 옳은 것을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "드넓은 만주와 한반도를 다스렸던 옛 고구려를 계승한다는 뜻으로 '고려'라 지었다.", explanation: "고구려의 역사와 영토를 이어받겠다는 확고한 의지를 담았습니다.", symbol: "🏛️" },
      { text: "옛 고구려의 수도였던 서경(평양)을 중시하여 북쪽으로 영토를 넓혔다.", explanation: "서경을 개경 못지않은 제2의 수도로 삼아 북진을 추진했습니다.", symbol: "🧭" },
      { text: "같이 고구려를 계승한 나라였던 발해의 유민들을 친척으로 여겨 받아들였다.", explanation: "발해와 고려 모두 고구려의 후손이라는 동질감을 가지고 있었습니다.", symbol: "🤝" },
      { text: "발해를 무너뜨린 거란을 약속을 어긴 나라로 여겨 외교를 끊고 경계했다.", explanation: "형제 나라인 발해를 멸망시킨 거란에 강경한 태도를 보였습니다.", symbol: "⚔️" },
    ],
    wrongPool: [
      { text: "아라비아 상인들이 지어 준 서양식 이름을 그대로 따서 고려라고 불렀다.", explanation: "고구려를 계승해 '고려'라 지었고, 이후 아라비아 상인들을 통해 서양에 '코리아'로 알려졌습니다.", symbol: "❌" },
      { text: "고구려의 역사를 부정하고 오직 중국 당나라의 이름만 따르려 했다.", explanation: "고려는 고구려 계승 의식을 바탕으로 세워진 자주 국가입니다.", symbol: "❌" },
      { text: "고구려의 옛 땅인 북쪽 지역을 포기하고 남쪽 바닷가로만 수도를 옮겼다.", explanation: "서경을 중시하며 북쪽으로 영토를 확장했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "고구려 계승", label: "고구려 계승 의식과 북진", desc: "나라 이름을 '고려'로 정하고, 서경(평양) 중시 및 발해 유민 포용 정책을 펼침", symbol: "🏹" },
  },
  {
    prompt: "후삼국 시대를 이끈 인물인 [견훤, 궁예, 왕건]에 대한 설명으로 옳은 것을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "견훤은 신라 말 혼란 속에서 세력을 키워 완산주(전주)에 후백제를 세웠다.", explanation: "견훤은 옛 백제 부흥을 내세우며 후백제를 건국했습니다.", symbol: "🚩" },
      { text: "궁예는 후고구려를 세웠으나, 나중에 가혹한 정치를 펼쳐 민심을 잃고 쫓겨났다.", explanation: "궁예의 무리한 정치로 신하와 백성들이 마음을 돌렸습니다.", symbol: "⚡" },
      { text: "왕건은 궁예를 몰아내고 고려를 건국한 뒤 신라와 후백제를 통합해 후삼국을 통일했다.", explanation: "왕건은 포용력과 지혜로 후삼국 통일을 완수했습니다.", symbol: "👑" },
      { text: "이 세 인물이 활약하던 시기는 신라 말 호족들이 성장하며 새로운 사회로 나아가던 때였다.", explanation: "지방 호족 세력이 역사의 중심에 등장한 시기였습니다.", symbol: "⚔️" },
    ],
    wrongPool: [
      { text: "견훤이 고려를 세우고 왕건이 후백제를 세워 끝까지 싸웠다.", explanation: "견훤은 후백제를, 왕건은 고려를 세웠습니다.", symbol: "❌" },
      { text: "궁예가 발해 유민을 받아들이고 후삼국을 최종 통일했다.", explanation: "발해 유민을 수용하고 후삼국을 통일한 인물은 태조 왕건입니다.", symbol: "❌" },
      { text: "세 인물 모두 몽골의 침입 때 강화도로 수도를 옮겨 싸운 장군들이었다.", explanation: "견훤, 궁예, 왕건은 10세기 초 후삼국 시대의 인물들입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "후삼국 인물", label: "후삼국 시대의 주역들", desc: "후백제를 세운 견훤, 후고구려를 세운 궁예, 고려를 세워 통일한 왕건", symbol: "👥" },
  },
  {
    prompt: "왕건이 [호족 세력을 우대하면서도 견제한 까닭]에 대해 옳은 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "후삼국을 통일하는 과정에서 큰 도움을 준 호족들의 공로를 인정해 주어야 했다.", explanation: "지방 호족들의 연합과 지원 덕분에 후삼국 통일이 가능했습니다.", symbol: "🤝" },
      { text: "호족들이 경제력과 군사력을 가지고 있어 자칫 왕권을 위협할 수 있었기 때문이다.", explanation: "지방 호족의 지나친 강성함은 왕실의 안전을 위협할 수 있었습니다.", symbol: "⚖️" },
      { text: "호족들과 혼인을 맺거나 성씨·관직을 주어 포용하는 동시에 지방 통제를 강화했다.", explanation: "우대책과 견제책을 조화롭게 사용하여 나라를 안정시켰습니다.", symbol: "👑" },
      { text: "새로 세운 고려 왕조의 정치적 안정을 이루고 나라를 체계적으로 다스리기 위해서였다.", explanation: "호족 통합은 통일 직후 국가 안정의 핵심 과제였습니다.", symbol: "🏛️" },
    ],
    wrongPool: [
      { text: "호족들이 모두 글자를 모르는 노비 출신이어서 관리로 쓸 수 없었기 때문이다.", explanation: "호족은 경제력과 군사력을 갖춘 유력한 지방 지배 세력이었습니다.", symbol: "❌" },
      { text: "왕의 권력을 모두 포기하고 나라를 수십 개의 작은 나라로 쪼개기 위해서였다.", explanation: "왕건은 나라를 하나로 통합하고 왕실의 기틀을 다지고자 했습니다.", symbol: "❌" },
      { text: "아라비아 상인들에게만 모든 관직을 나누어 주기 위해서였다.", explanation: "아라비아 상인들은 무역을 위해 벽란도를 방문한 외국 상인들이었습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "호족 정책", label: "호족 우대와 견제 정책", desc: "통일을 도운 호족을 포용하면서도 왕권 안정을 위해 적절히 견제함", symbol: "⚖️" },
  },
];

// ============================================================================
// 2단계: 고려 사회의 모습 - 11개 템플릿
// ============================================================================
const stage2Templates: RawQuizTemplate[] = [
  {
    prompt: "왕건의 뒤를 이은 왕들이 추진한 [억울하게 노비가 된 백성을 해방한 정책]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "후삼국 혼란기에 억울하게 호족의 노비가 된 백성의 원래 신분(양인)을 되찾아 주었다.", explanation: "억울하게 노비가 된 사람들의 신분을 조사해 양인으로 풀어 주었습니다.", symbol: "🔓" },
      { text: "많은 노비를 거느리며 세력을 키우던 호족들의 경제력과 군사력을 약화시켰다.", explanation: "호족이 거느리던 노비를 줄여 호족의 힘을 약하게 만들었습니다.", symbol: "📉" },
      { text: "양인이 되어 나라에 세금을 내는 백성의 수가 늘어나 국가 재정이 튼튼해졌다.", explanation: "노비는 세금을 내지 않지만 양인은 나라에 세금을 내기 때문입니다.", symbol: "🌾" },
      { text: "호족의 힘을 줄이고 왕권을 강화하여 나라를 더 잘 다스릴 수 있게 되었다.", explanation: "나라의 기틀을 다지는 핵심적인 왕권 강화 정책이었습니다.", symbol: "👑" },
    ],
    wrongPool: [
      { text: "전국에 있는 모든 일반 농민들을 강제로 호족의 노비로 만들었다.", explanation: "반대로 억울하게 호족의 노비가 된 백성을 풀어 주어 양인으로 삼았습니다.", symbol: "❌" },
      { text: "호족들에게 더 많은 노비와 군사를 나누어 주어 왕보다 강한 힘을 갖게 했다.", explanation: "호족의 힘을 약화시키고 왕권을 강화하기 위한 정책이었습니다.", symbol: "❌" },
      { text: "노비 제도를 영원히 없애 고려 시대에는 노비가 단 한 명도 존재하지 않게 되었다.", explanation: "억울하게 노비가 된 사람만 해방한 것이며, 고려 시대에도 천인 신분인 노비는 계속 존재했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "왕권 강화", label: "억울한 노비 해방 (노비안검법)", desc: "억울하게 호족의 노비가 된 백성을 풀어 주어 호족 세력을 약화시키고 세금 내는 백성을 늘림", symbol: "🔓" },
  },
  {
    prompt: "고려가 관리를 뽑기 위해 실시한 시험 제도인 [과거제]와 [장양수 홍패]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "시험을 치러 능력이 있는 사람을 관리로 뽑는 제도인 '과거제'를 실시했다.", explanation: "학문과 실력을 시험하여 인재를 등용했습니다.", symbol: "📝" },
      { text: "신분에 따라 오를 수 있는 관직이 정해진 신라에 비해 개인의 능력을 중시한 사회였다.", explanation: "신라 사회보다 훨씬 개방적이고 개인의 능력을 중시했습니다.", symbol: "💡" },
      { text: "왕권을 위협하던 큰 가문의 세력이 약해지고, 실력 있고 왕에게 충성하는 관리가 늘어났다.", explanation: "왕이 직접 뽑은 실력 있는 관리들이 왕권을 뒷받침했습니다.", symbol: "👑" },
      { text: "'장양수 홍패'는 고려 시대에 과거에 급제한 장양수가 받은 합격증이다.", explanation: "붉은 종이에 적힌 고려 시대의 소중한 과거 합격 문서 유물입니다.", symbol: "📜" },
    ],
    wrongPool: [
      { text: "오직 무술과 달리기 시합만 치러서 힘이 가장 센 사람만 왕으로 뽑았다.", explanation: "과거제는 학문과 능력을 시험하여 나라의 관리를 뽑는 제도였습니다.", symbol: "❌" },
      { text: "신라처럼 신분에 따라 오를 수 있는 관직을 엄격히 정해 시험 없이 귀족만 뽑았다.", explanation: "고려는 과거제를 통해 가문이 좋지 않아도 능력이 있으면 관리가 될 길을 열었습니다.", symbol: "❌" },
      { text: "장양수 홍패는 몽골 상인들이 벽란도에서 만두를 팔 때 쓰던 영수증이었다.", explanation: "장양수 홍패는 과거 시험에 급제한 장양수가 받은 합격증입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "과거제 유물", label: "과거제와 장양수 홍패", desc: "개인의 능력을 중시해 시험으로 관리를 뽑았으며, 장양수 홍패는 과거 합격증임", symbol: "/relics/goryeo_hongpae.webp", source: "국가유산청 국가유산포털 (공공누리 제1유형)" },
  },
  {
    prompt: "고려가 주요 지역에 실시한 [지방 관리 파견] 정책의 목적과 결과에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "주요 지방에 관청을 두고 중앙에서 관리를 보내 백성의 삶을 가까이서 살폈다.", explanation: "지방 백성들의 어려움을 살피고 행정을 돌보았습니다.", symbol: "🏛️" },
      { text: "왕의 명령이 지방까지 잘 전달되어 왕권이 한층 강화되었다.", explanation: "중앙 정부의 통치력이 전국 지방으로 뻗어 나갔습니다.", symbol: "👑" },
      { text: "지방을 독자적으로 다스리던 호족들의 영향력을 줄이고 나라를 체계적으로 다스렸다.", explanation: "호족 중심의 지방 지배에서 벗어나 중앙 집권 체제를 갖추었습니다.", symbol: "⚖️" },
      { text: "노비 해방, 과거제 실시와 함께 고려 초기 나라의 기틀을 다진 핵심 정책이었다.", explanation: "세 가지 정책이 어우러져 고려의 통치 체제가 완성되었습니다.", symbol: "✨" },
    ],
    wrongPool: [
      { text: "지방 관리를 모두 없애고 각 지역 호족들이 마음대로 세금을 걷게 방치했다.", explanation: "호족의 자의적 지배를 막기 위해 중앙에서 지방 관리를 파견했습니다.", symbol: "❌" },
      { text: "지방에 파견된 관리들이 각자 독립하여 수십 개의 새로운 나라를 세웠다.", explanation: "왕의 명령을 지방에 전달하여 나라를 하나로 체계화했습니다.", symbol: "❌" },
      { text: "오직 외국 상인들만 지방 관리로 임명하여 세금을 거두게 했다.", explanation: "과거제 등을 통해 선발된 고려의 중앙 관리들을 파견했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "지방 통치", label: "주요 지방에 관리 파견", desc: "지방에 관청을 두고 중앙 관리를 파견해 백성의 삶을 살피고 왕권을 강화함", symbol: "🏛️" },
  },
  {
    prompt: "고려 시대의 신분 제도인 [양인과 천인]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "고려의 신분은 크게 자유민인 '양인'과 천한 신분인 '천인'으로 구분되었다.", explanation: "양인과 천인으로 나뉜 신분 사회였습니다.", symbol: "👥" },
      { text: "양인에는 왕족과 높은 관리, 중간 계층, 그리고 대부분 농사를 짓는 일반 백성이 있었다.", explanation: "지배층부터 일반 농민까지 폭넓게 양인에 속했습니다.", symbol: "🌾" },
      { text: "천인은 대다수가 노비로, 지배층이나 절에 소속되어 일했다(송광사 고려 고문서).", explanation: "순천 송광사 고려 고문서에 당시 절에 속한 노비 기록이 남아 있습니다.", symbol: "📜" },
      { text: "신분제 사회였지만 전쟁에서 큰 공을 세우는 등 특별한 경우에는 신분이 올라가기도 했다.", explanation: "김윤후의 충주성 전투처럼 공을 세우면 신분 상승의 기회가 있었습니다.", symbol: "⬆️" },
    ],
    wrongPool: [
      { text: "농사를 짓는 일반 백성은 모두 천인(노비)이어서 세금을 내지 않았다.", explanation: "일반 농민은 양인 신분이었으며 나라에 세금을 내는 주축이었습니다.", symbol: "❌" },
      { text: "신라 골품제보다 더욱 엄격하여 평민은 관청 근처에도 가지 못하고 신분 이동이 불가능했다.", explanation: "고려는 신라의 골품제보다 개방적이었으며 과거제를 통해 신분이 상승할 수도 있었습니다.", symbol: "❌" },
      { text: "전쟁에서 아무리 큰 공을 세워도 절대로 신분이 올라갈 수 없었다.", explanation: "고려는 신분 이동이 비교적 열려 있어 큰 공을 세우면 신분이 오르기도 했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "고려의 신분", label: "고려의 신분: 양인과 천인", desc: "양인(왕족·관리·중간계층·농민)과 천인(노비)으로 구분되었으나 특별한 공을 세우면 신분 상승 가능", symbol: "👥" },
  },
  {
    prompt: "고려 시대 가정생활에서 나타난 [여성의 지위]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "사회 활동이 자유롭지는 않았으나, 가정생활에서는 남성과 동등한 지위를 가졌다.", explanation: "가족 제도 안에서 여성의 권리가 폭넓게 존중받았습니다.", symbol: "⚖️" },
      { text: "아들과 딸이 구별 없이 부모의 재산(유산)을 똑같이 나누어 상속받았다.", explanation: "남녀 차별 없는 균등 상속이 일반적인 모습이었습니다.", symbol: "🏠" },
      { text: "아들과 딸이 돌아가며 부모의 제사를 지냈고, 여성의 재혼도 자유로웠다.", explanation: "제사 의무와 재혼에 있어서도 남녀 차별이 없었습니다.", symbol: "🕯️" },
      { text: "결혼 후 남자가 여자의 집에서 사는 것이 일반적이었고, 집안의 가장이 여성인 경우도 있었다.", explanation: "사위가 여자의 집에서 생활하는 풍습과 여성 가장이 자연스러웠습니다.", symbol: "👩‍👧‍👦" },
    ],
    wrongPool: [
      { text: "부모의 재산은 무조건 큰아들에게만 물려주고 딸에게는 한 푼도 주지 않았다.", explanation: "고려 시대에는 아들과 딸이 똑같이 유산을 상속받았습니다.", symbol: "❌" },
      { text: "여성은 집안의 가장이 될 수 없었고 부모의 제사에도 참여할 수 없었다.", explanation: "여성이 집안의 가장이 되기도 했고 아들과 딸이 돌아가며 제사를 지냈습니다.", symbol: "❌" },
      { text: "남편이 죽으면 여성의 재혼을 법으로 엄격히 금지하고 처벌했다.", explanation: "고려 시대에는 여성의 재혼이 자유로웠습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "여성의 지위", label: "당당했던 고려 여성의 지위", desc: "아들과 딸의 균등 재산 상속, 돌아가며 제사, 재혼 자유, 처가살이, 여성 가장 인정", symbol: "⚖️" },
  },
  {
    prompt: "『고려사』에 전해지는 명재판인 [손변의 재판 이야기]를 통해 알 수 있는 사실로 옳은 것을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "남동생이 '고려에서는 일반적으로 아들과 딸이 똑같이 유산을 받는다'며 소송을 제기했다.", explanation: "당시 아들과 딸의 균등 상속이 당연한 상식이었음을 보여 줍니다.", symbol: "⚖️" },
      { text: "아버지가 어린 동생을 누나가 잘 돌보게 하려고 전 재산을 누나에게 맡긴 깊은 뜻이 있었다.", explanation: "동생이 다 자란 뒤 관청에 소송해 재산을 나누도록 배려한 아버지의 지혜였습니다.", symbol: "👨‍👧‍👦" },
      { text: "손변은 아버지의 뜻을 설명하고 누나와 남동생에게 재산을 반씩 똑같이 나누라고 판결했다.", explanation: "남매가 서로 부둥켜안고 울며 재산을 공평하게 나누었습니다.", symbol: "👨‍⚖️" },
      { text: "누나가 아버지를 이어 집안의 가장이 된 것처럼 여성이 가장이 되는 경우도 있었다.", explanation: "가정생활에서 여성의 지위가 남성과 다르지 않았음을 잘 보여 줍니다.", symbol: "🏠" },
    ],
    wrongPool: [
      { text: "손변은 여성이 재산을 가질 수 없다며 누나의 재산을 모두 빼앗아 남동생에게만 주었다.", explanation: "손변은 남매에게 재산을 반씩 똑같이 나누라고 판결했습니다.", symbol: "❌" },
      { text: "고려 시대에는 딸에게 유산을 물려주는 것이 법으로 금지되어 있었음을 보여 준다.", explanation: "반대로 아들과 딸이 구별 없이 유산을 똑같이 상속받았음을 보여 줍니다.", symbol: "❌" },
      { text: "손변은 거란군과 싸우다 전사한 장군으로 전쟁터에서 군법을 집행했다.", explanation: "손변은 남매의 유산 소송을 지혜롭게 해결한 고려의 명재판관이었습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "손변의 재판", label: "관리 손변의 명재판", desc: "누나와 남동생에게 유산을 반씩 나누게 한 판결로, 남녀 균등 상속과 여성 가장의 모습을 보여 줌", symbol: "⚖️" },
  },
  {
    prompt: "고려 시대에 성대하게 열린 대표적 불교 행사인 [연등회와 팔관회]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "매년 초에 열린 '연등회'에서는 전국 곳곳에 등불을 밝히고 백성이 행렬하며 소원을 빌었다.", explanation: "연등회는 부처님께 등불을 밝혀 복과 평안을 기원하는 축제였습니다.", symbol: "🏮" },
      { text: "한 해가 끝나 가는 11월에 열린 '팔관회'는 온 세상의 평안을 바라는 나라의 최고 행사였다.", explanation: "팔관회에서는 백성이 함께 춤, 노래, 놀이를 즐기며 나라의 번영을 빌었습니다.", symbol: "🥁" },
      { text: "팔관회는 아라비아 상인들을 비롯해 주변 여러 나라의 사신과 상인들까지 참여한 국제적 행사였다.", explanation: "외국 사신과 상인들이 축하 예물을 바치며 함께 즐긴 큰 축제였습니다.", symbol: "🌍" },
      { text: "불교가 나라의 지원을 받으며 왕실과 백성 모두의 삶 속에 깊이 자리 잡았음을 보여 준다.", explanation: "나라의 발전과 개인의 행복을 함께 기원하는 국가적 불교 행사였습니다.", symbol: "☸️" },
    ],
    wrongPool: [
      { text: "연등회와 팔관회는 백성들의 참여를 엄격히 금지하고 오직 왕 혼자서만 몰래 치렀다.", explanation: "전국 곳곳에서 백성이 함께 행렬하고 춤과 노래를 즐긴 축제였습니다.", symbol: "❌" },
      { text: "외국 상인이 행사 근처에 오면 즉시 감옥에 가두는 폐쇄적인 행사였다.", explanation: "팔관회에는 아라비아 상인과 주변국 사신들까지 참여해 교류했습니다.", symbol: "❌" },
      { text: "불교를 없애고 서양 종교를 받아들이기 위해 시작된 근대 행사였다.", explanation: "고려 태조 왕건의 훈요 10조에서도 강조된 고려의 전통 불교 행사였습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "불교 행사", label: "연등회와 팔관회", desc: "매년 초 등불을 밝히는 연등회와 11월 외국 상인까지 참여한 국가 최고 행사 팔관회", symbol: "🏮" },
  },
  {
    prompt: "고려 시대 불교의 발전을 보여 주는 [절과 석탑, 불상 문화유산]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "충청남도 논산에 세워진 거대한 불상인 [논산 관촉사 석조 미륵보살 입상]", explanation: "은진미륵으로도 불리는 고려 시대의 독창적이고 거대한 석조 불상입니다.", symbol: "🗿" },
      { text: "강원특별자치도 평창에 세워진 다각 다층 탑인 [평창 월정사 팔각 구층 석탑]", explanation: "팔각형 모양으로 9층을 쌓아 올린 화려하고 안정감 있는 고려 석탑입니다.", symbol: "🗼" },
      { text: "경상북도 영주에 남아 있는 아름다운 사찰 건물인 [영주 부석사 무량수전]", explanation: "배흘림기둥으로 유명한 고려 시대의 대표적인 목조 건축물입니다.", symbol: "🏯" },
      { text: "불교가 나라의 지원을 받으며 전국 곳곳에 아름다운 절과 탑, 불상이 세워졌다.", explanation: "고려 전역에 불교 예술이 화려하게 꽃피었습니다.", symbol: "☸️" },
    ],
    wrongPool: [
      { text: "조선 시대 유교 예법에 따라 역대 왕과 왕비의 신주를 모신 [종묘와 사직단]", explanation: "종묘와 사직단은 유교를 건국 이념으로 삼은 조선 시대의 국가 사당입니다.", symbol: "❌" },
      { text: "로마 제국에서 들여온 서양식 석조 신전인 [판테온 원형 기둥 건물]", explanation: "고려 사람들은 독창적인 불교 사찰과 석탑, 불상을 조성했습니다.", symbol: "❌" },
      { text: "불교를 배척하고 나라 곳곳의 사찰을 모두 불태운 뒤 세운 [유교 서원과 향교]", explanation: "고려는 불교를 국가적으로 장려하고 우대하여 전국의 절과 석탑이 크게 번창했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "불교 문화유산", label: "고려의 절·탑·불상 (월정사 팔각 구층석탑)", desc: "논산 관촉사 석조 미륵보살 입상, 평창 월정사 팔각 구층 석탑, 영주 부석사 무량수전", symbol: "/relics/goryeo_woljeongsa_pagoda.webp", source: "국가유산청 국가유산포털 (공공누리 제1유형)" },
  },
  {
    prompt: "『미륵하생경변상도』와 『송광사 고려 고문서』를 통해 알 수 있는 [고려의 사회 모습]에 대해 옳은 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "열심히 곡식을 베고 옮기는 농민들과 이를 감시하는 사람의 모습을 통해 신분에 따른 생활 차이를 알 수 있다.", explanation: "지배층과 일반 농민·노비의 역할과 생활 모습이 달랐습니다.", symbol: "🌾" },
      { text: "송광사 고려 고문서에는 당시 절에 속한 노비에 관한 내용이 기록되어 있다.", explanation: "천인 신분인 노비가 지배층이나 절에 소속되어 일했음을 보여 줍니다.", symbol: "📜" },
      { text: "양인의 대다수는 농사를 짓는 일반 백성이었으며 열심히 일해 세금을 납부했다.", explanation: "농민은 양인으로서 국가 경제의 기반을 이루었습니다.", symbol: "👨‍🌾" },
      { text: "고려는 양인과 천인으로 구분된 신분제 사회였음을 역사 자료로 확인할 수 있다.", explanation: "불화와 고문서를 통해 당시 신분 구조를 생생히 짐작할 수 있습니다.", symbol: "🔍" },
    ],
    wrongPool: [
      { text: "고려 시대에는 농사를 전혀 짓지 않고 오직 사냥과 채집만으로 먹고살았다.", explanation: "고려는 벼농사와 밭농사가 발달한 농경 중심 사회였습니다.", symbol: "❌" },
      { text: "절에는 노비가 단 한 명도 없었으며 모든 사람이 똑같은 재산을 나누어 가졌다.", explanation: "송광사 고문서를 통해 절에도 노비가 소속되어 있었음을 알 수 있습니다.", symbol: "❌" },
      { text: "기계식 트랙터와 콤바인으로 농사를 지어 사람이 일할 필요가 없었다.", explanation: "트랙터와 콤바인은 현대의 농기계입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "고려 사회 사료", label: "미륵하생경변상도와 송광사 고문서", desc: "곡식을 수확하는 농민과 감시하는 사람, 절에 속한 노비 기록을 통해 신분 사회임을 확인", symbol: "/relics/goryeo_slave_doc.webp", source: "국가유산청 국가유산포털 (공공누리 제1유형)" },
  },
  {
    prompt: "신라 사회와 비교했을 때 [고려 사회가 가진 발전된 특징]에 대한 설명으로 옳은 것을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "신분에 따라 오를 수 있는 관직이 정해진 신라에 비해 개인의 능력을 중시했다.", explanation: "과거제를 실시하여 능력 있는 인재가 관리로 나아갈 수 있었습니다.", symbol: "📝" },
      { text: "가문이 좋지 않아도 학문과 실력이 뛰어나면 과거 시험을 통해 관리가 될 수 있었다.", explanation: "시험을 통한 관리 선발로 사회의 역동성이 높아졌습니다.", symbol: "🎓" },
      { text: "전쟁에서 공을 세우는 등 특별한 경우에는 낮은 신분에서 높은 신분으로 올라가기도 했다.", explanation: "신라 사회에 비해 신분 상승의 기회가 열려 있었습니다.", symbol: "⬆️" },
      { text: "억울하게 노비가 된 백성을 해방하고 지방에 관리를 파견해 백성의 삶을 살폈다.", explanation: "왕권을 강화하고 민생을 돌보는 체계적인 통치를 펼쳤습니다.", symbol: "🏛️" },
    ],
    wrongPool: [
      { text: "고려는 신라에 비해 개인의 능력보다는 혈통과 신분만을 더욱 엄격히 따졌다.", explanation: "고려는 신라에 비해 과거제를 통해 개인의 능력을 중시한 사회였습니다.", symbol: "❌" },
      { text: "과거제를 폐지하고 오직 왕족에게만 모든 관직을 나누어 주었다.", explanation: "고려는 과거제를 도입하여 실력 있는 관리를 뽑았습니다.", symbol: "❌" },
      { text: "가정생활에서 여성의 지위가 신라보다 훨씬 낮아져 재산을 전혀 상속받지 못했다.", explanation: "고려 시대 여성은 가정생활에서 남성과 동등하게 재산을 상속받았습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "능력 중심 사회", label: "능력을 중시한 발전된 고려 사회", desc: "신분에 따라 관직이 정해진 신라에 비해 과거제를 통해 개인의 능력을 중시하고 신분 상승 기회도 열려 있었음", symbol: "💡" },
  },
  {
    prompt: "고려 초기 [나라의 기틀을 다진 세 가지 정책]과 그 결과를 바르게 연결한 것을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "[억울한 노비 해방] ➔ 많은 노비를 거느린 호족의 힘이 약해지고 세금 내는 백성이 늘어났다.", explanation: "억울하게 호족의 노비가 된 백성을 풀어 주어 호족 약화와 세금 확보를 동시에 이루었습니다.", symbol: "🔓" },
      { text: "[과거제 실시] ➔ 왕권을 위협하던 큰 가문의 세력이 약해지고 실력 있는 충성스러운 관리가 늘어났다.", explanation: "능력 중심의 관리 선발로 왕권을 뒷받침했습니다.", symbol: "📝" },
      { text: "[지방에 관리 파견] ➔ 왕의 명령이 지방까지 잘 전달되어 왕권이 강화되고 체계적으로 나라를 다스렸다.", explanation: "지방 관청과 관리 파견으로 중앙 집권 체제를 확립했습니다.", symbol: "🏛️" },
      { text: "이 세 가지 정책을 통해 호족들의 지나친 세력을 누르고 국왕 중심의 통치 질서를 세웠다.", explanation: "고려 왕조가 오랫동안 안정적으로 발전하는 밑거름이 되었습니다.", symbol: "👑" },
    ],
    wrongPool: [
      { text: "[과거제 실시] ➔ 글자를 아는 모든 관리를 해고하고 오직 호족들에게만 권력을 넘겨주었다.", explanation: "과거제는 호족·대가문의 세력을 약화시키고 실력 있는 관리를 뽑은 제도입니다.", symbol: "❌" },
      { text: "[억울한 노비 해방] ➔ 세금을 내는 백성이 모두 사라져 나라의 살림이 무너졌다.", explanation: "노비에서 양인이 된 백성들이 세금을 내게 되어 나라 살림이 튼튼해졌습니다.", symbol: "❌" },
      { text: "[지방에 관리 파견] ➔ 왕의 명령이 지방에 전혀 전달되지 않아 나라가 다시 후삼국으로 쪼개졌다.", explanation: "지방 관리 파견으로 왕의 명령이 지방까지 잘 전달되었습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "나라 기틀 다지기", label: "고려 초기의 3대 기틀 정책", desc: "노비 해방·과거제 실시·지방 관리 파견을 통해 호족 세력을 약화시키고 왕권을 강화함", symbol: "📜" },
  },
];

// ============================================================================
// 3단계: 고려와 주변 나라의 관계 - 11개 템플릿
// ============================================================================
const stage3Templates: RawQuizTemplate[] = [
  {
    prompt: "고려 건국 무렵 [왕건이 거란을 적대시한 까닭과 대응(만부교 사건)]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "거란이 발해와 잘 지내다가 갑자기 약속을 어기고 형제 나라인 발해를 멸망시켰기 때문이다.", explanation: "왕건은 발해를 친척의 나라로 여겼기에 거란의 침략 행위에 분노했습니다.", symbol: "💢" },
      { text: "거란이 사신 30명과 낙타 50필을 선물로 보내자, 사신들을 섬으로 유배 보냈다.", explanation: "거란의 화친 요청을 단호히 거절했습니다.", symbol: "🏝️" },
      { text: "거란이 보낸 낙타 50필을 개경의 만부교 다리 아래에 묶어 두어 모두 굶어 죽게 했다.", explanation: "『고려사』에 기록된 유명한 만부교 낙타 사건입니다.", symbol: "🐫" },
      { text: "발해를 멸망시킨 거란과는 거리를 두는 대신 중국의 송과는 좋은 관계를 유지했다.", explanation: "송과의 친선 교류를 이어 가자 거란이 이를 경계하며 침입하게 되었습니다.", symbol: "🤝" },
    ],
    wrongPool: [
      { text: "거란이 보낸 낙타 50필을 기쁘게 받아들여 거란에 나라의 땅을 떼어 주었다.", explanation: "왕건은 거란과 외교를 끊고 낙타를 만부교 아래에 묶어 굶어 죽게 했습니다.", symbol: "❌" },
      { text: "거란과 힘을 합쳐 송나라와 발해를 함께 공격하기 위해서였다.", explanation: "고려는 발해 유민을 포용하고 송과 친하게 지냈으며 거란을 배척했습니다.", symbol: "❌" },
      { text: "거란 사신들에게 과거 시험 합격증을 주고 고려의 높은 관리로 임명했다.", explanation: "왕건은 거란 사신 30명을 섬으로 유배 보냈습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "대거란 외교", label: "왕건의 대거란 강경 외교", desc: "발해를 멸망시킨 거란과 외교를 끊고 사신은 유배, 낙타 50필은 만부교 아래에서 굶어 죽게 함", symbol: "🛡️" },
  },
  {
    prompt: "거란의 1차 침입(993년)을 물리친 [서희의 외교 담판과 강동 6주]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "거란이 고려와 송의 친선 관계를 경계하며 침입하자 서희가 적진에 나가 외교 담판을 벌였다.", explanation: "무력 충돌 대신 뛰어난 외교력으로 거란 장수와 담판했습니다.", symbol: "📜" },
      { text: "거란의 진짜 의도가 영토 정복보다 '고려와 송의 관계를 끊는 것'임을 정확히 알아차렸다.", explanation: "적의 의도를 꿰뚫어 본 지혜로운 외교 전략이었습니다.", symbol: "💡" },
      { text: "송과 교류를 끊기로 약속하는 대신 압록강 동쪽의 '강동 6주' 지역을 얻어 영토를 넓혔다.", explanation: "싸우지 않고도 오히려 압록강 유역까지 영토를 확장하는 큰 성과를 거두었습니다.", symbol: "🗺️" },
      { text: "고려가 고구려를 계승한 나라임을 당당히 밝혀 거란군을 스스로 물러가게 했다.", explanation: "역사적 정통성과 외교 논리로 나라를 구했습니다.", symbol: "👑" },
    ],
    wrongPool: [
      { text: "거란에 항복하여 수도 개경과 한강 이북의 모든 땅을 거란에 넘겨주었다.", explanation: "서희는 땅을 빼앗기지 않고 오히려 '강동 6주' 지역을 얻어냈습니다.", symbol: "❌" },
      { text: "수도를 강화도로 옮기고 노비 문서를 불태우며 30년간 전쟁을 벌였다.", explanation: "강화도 천도와 노비 문서 소각은 몽골 침입 때의 일입니다.", symbol: "❌" },
      { text: "프랑스 군대를 불러들여 거란군을 바다에서 물리쳤다.", explanation: "서희가 직접 거란 장수와 외교 담판을 벌여 해결했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "강동 6주", label: "서희의 외교 담판과 강동 6주", desc: "거란의 의도를 파악한 서희가 외교 담판(993)을 벌여 싸우지 않고 강동 6주를 확보함", symbol: "📜" },
  },
  {
    prompt: "거란의 3차 침입(1019년)을 물리친 [강감찬의 귀주 대첩]과 그 결과에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "거란이 강동 6주 지역을 돌려 달라며 또다시 침입하자 강감찬 장군이 고려군을 이끌고 맞섰다.", explanation: "거란의 부당한 요구에 맞서 철저히 전쟁에 대비했습니다.", symbol: "⚔️" },
      { text: "귀주에서 거란군을 크게 물리쳐 살아서 돌아간 적군이 겨우 수천 명뿐이었다(귀주 대첩).", explanation: "『고려사』에 거란군이 이토록 심하게 패배한 적이 없었다고 기록된 대승입니다.", symbol: "🏹" },
      { text: "귀주 대첩 이후 거란은 고려를 다시는 넘보지 못했고 고려·거란·송의 외교 관계가 안정되었다.", explanation: "개성 현화사비에도 거란이 사신을 보내 화해를 요청하고 백성이 편안해졌다고 기록되었습니다.", symbol: "🕊️" },
      { text: "고려는 거란의 침입을 물리친 뒤 국경에 '천리장성'을 쌓아 외적의 침입에 대비했다.", explanation: "압록강 입구부터 동해안까지 긴 성을 쌓아 국방을 튼튼히 했습니다.", symbol: "🧱" },
    ],
    wrongPool: [
      { text: "귀주 대첩에서 패배하여 강동 6주와 서경(평양)을 거란에 모두 빼앗겼다.", explanation: "귀주 대첩에서 대승을 거두어 강동 6주와 고려의 영토를 굳건히 지켰습니다.", symbol: "❌" },
      { text: "몽골군의 총사령관을 처인성에서 활로 쏘아 물리친 전투였다.", explanation: "처인성 전투는 몽골 침입 때 승려 김윤후가 활약한 전투입니다.", symbol: "❌" },
      { text: "전쟁이 끝난 뒤 모든 군대와 성곽을 없애고 국경 수비를 포기했다.", explanation: "고려는 천리장성을 쌓아 외적의 침입에 더욱 철저히 대비했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "귀주 대첩", label: "강감찬의 귀주 대첩과 천리장성", desc: "귀주에서 거란군을 크게 물리치고 국경에 천리장성을 쌓아 평화와 안정을 이룩함", symbol: "⚔️" },
  },
  {
    prompt: "고려 시대 국제 교류의 중심지였던 무역항 [벽란도]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "수도 개경과 가까운 예성강 하구에 위치하여 수심이 깊어 큰 배가 오가기 쉬웠다.", explanation: "지리적 이점 덕분에 국제 무역의 중심 항구로 크게 발전했습니다.", symbol: "⛵" },
      { text: "송, 거란, 여진, 일본뿐만 아니라 멀리 아라비아 상인들과도 활발히 교류했다.", explanation: "다양한 나라의 상인과 사신들이 벽란도를 통해 고려를 방문했습니다.", symbol: "🌏" },
      { text: "벽란도에는 외국 사신이나 상인이 머물며 휴식을 취하던 건물인 '벽란정'이 있었다.", explanation: "송나라 사신이 남긴 『고려도경』에 벽란정에서 쉬고 개경으로 들어갔다는 기록이 있습니다.", symbol: "🏯" },
      { text: "아라비아 상인들에 의해 '고려'라는 이름이 서양에 알려져 오늘날 '코리아(Korea)'로 불리게 되었다.", explanation: "세계 속에 우리나라의 이름을 알린 역사적인 무역항입니다.", symbol: "🇰🇷" },
    ],
    wrongPool: [
      { text: "외국과의 교류를 완전히 금지하여 외국 배가 들어오면 모두 불태우던 군사 기지였다.", explanation: "벽란도는 외국 사신과 상인을 환영하며 무역하던 개방적인 국제 항구였습니다.", symbol: "❌" },
      { text: "백두산 꼭대기에 위치하여 말과 낙타로만 갈 수 있는 산속 마을이었다.", explanation: "벽란도는 개경 근처 예성강 하구에 위치한 바닷가 무역항이었습니다.", symbol: "❌" },
      { text: "오직 신라의 귀족들만 드나들던 경주 앞바다의 작은 포구였다.", explanation: "고려의 수도 개경과 가까운 예성강 하구의 국제 무역항이었습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "국제 무역항", label: "국제 무역항 벽란도와 코리아", desc: "예성강 하구의 무역항으로 송·거란·여진·일본·아라비아 상인과 교류하며 '코리아'의 유래가 됨", symbol: "⛵" },
  },
  {
    prompt: "벽란도를 통해 이루어진 [고려와 주변 나라들의 교역 물품]에 대해 옳은 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "대식국(아라비아) 상인들은 수은, 향료, 염색 재료 등을 가져와 바치고 금과 비단 등을 받아 갔다.", explanation: "1024년과 1040년 『고려사』 기록에 대식국 상인들과의 교류가 상세히 나와 있습니다.", symbol: "🧪" },
      { text: "송나라에는 인삼, 화문석, 도자기, 삼베 등을 수출하고 비단, 서적, 약재 등을 들여왔다.", explanation: "송과 가장 활발하게 문화 물품과 특산물을 주고받았습니다.", symbol: "🏺" },
      { text: "거란·여진과는 은, 말, 모피류 등을 교류했고 일본과는 유황, 수은 등을 교역했다.", explanation: "주변 여러 나라의 필요에 맞는 다양한 물품을 교류했습니다.", symbol: "🐎" },
      { text: "아라비아 상인들이 고려를 '코레(Corea)'로 부르며 서양 세계에 우리나라가 알려지게 되었다.", explanation: "오늘날 영문 국호 Korea의 역사적 뿌리가 되었습니다.", symbol: "🌍" },
    ],
    wrongPool: [
      { text: "고려는 쇄국 정책을 펼쳐 외국 상선이 벽란도 포구에 접근하는 것을 엄격히 금지했다.", explanation: "고려는 예성강 하구 벽란도를 개방하여 송, 아라비아, 여진, 일본 등 다양한 나라와 활발히 무역했습니다.", symbol: "❌" },
      { text: "아라비아 상인들이 고려에 감자와 옥수수, 스마트폰을 수출했다.", explanation: "아라비아 상인들은 수은, 향료, 염색 재료 등을 가져왔습니다.", symbol: "❌" },
      { text: "고려는 송나라와 전쟁만 벌였을 뿐 단 한 번도 무역을 하지 않았다.", explanation: "고려는 송과 친선 관계를 유지하며 가장 활발히 교류했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "대외 교류", label: "고려의 대외 교역 물품", desc: "인삼·도자기·화문석 수출 및 비단·서적·향료·수은 수입, 아라비아 상인을 통해 '코리아'가 알려짐", symbol: "🪙" },
  },
  {
    prompt: "고려 후기 [몽골의 침입과 고려의 대응]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "북쪽 지역에서 여러 부족을 통일한 몽골이 침입하자, 고려는 수도를 강화도로 옮기고 저항했다.", explanation: "바다에 약한 몽골군의 약점을 이용해 섬인 강화도로 천도하여 항전했습니다.", symbol: "🏝️" },
      { text: "고려군과 백성은 끈질기게 싸우며 처인성과 충주성 등 곳곳에서 몽골군을 물리쳤다.", explanation: "일반 백성과 천인(노비)까지 힘을 합쳐 나라를 지켰습니다.", symbol: "🛡️" },
      { text: "약 30년간 전쟁이 길어지면서 고려 땅이 황폐해지고 많은 백성이 죽거나 포로로 끌려갔다.", explanation: "오랜 전쟁으로 국토와 문화유산, 백성이 큰 피해를 입었습니다.", symbol: "😢" },
      { text: "결국 전쟁을 끝내자는 몽골의 제안을 받아들여 수도를 다시 개경으로 옮겼다(개경 환도).", explanation: "강화를 맺고 개경으로 돌아오면서 30년 전쟁이 끝났습니다.", symbol: "🏛️" },
    ],
    wrongPool: [
      { text: "몽골이 침입하자 수도를 제주도로 옮기고 단 하루 만에 전쟁을 끝냈다.", explanation: "고려는 제주도가 아니라 '강화도'로 수도를 옮겨 약 30년간 저항했습니다.", symbol: "❌" },
      { text: "서희가 적진에 나가 외교 담판을 벌여 강동 6주를 얻고 몽골군을 돌려보냈다.", explanation: "서희의 외교 담판과 강동 6주는 거란의 1차 침입 때의 일입니다.", symbol: "❌" },
      { text: "백성과 노비들은 전쟁에 전혀 참여하지 않고 오직 왕족들만 싸웠다.", explanation: "처인성과 충주성 전투 등에서 백성과 노비들이 앞장서서 몽골군을 물리쳤습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "대몽 항쟁", label: "강화도 천도와 대몽 항쟁", desc: "몽골이 침입하자 수도를 강화도로 옮겨 약 30년간 저항한 뒤 강화를 맺고 개경으로 환도함", symbol: "🐎" },
  },
  {
    prompt: "몽골의 침입 때 큰 활약을 펼친 승려 [김윤후와 백성들의 저항]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "승려 김윤후는 처인성에서 사회적으로 차별받던 백성을 모아 몽골군 총사령관을 죽이고 적을 물리쳤다.", explanation: "처인성 전투에서 몽골군의 총사령관을 사살하며 몽골군을 물러나게 했습니다.", symbol: "🏹" },
      { text: "몽골이 다시 침입하자 충주성에서 신분에 상관없이 힘을 다해 싸운 사람에게 벼슬을 주기로 약속했다.", explanation: "신분 차별을 없애고 백성과 노비의 사기를 크게 높였습니다.", symbol: "📜" },
      { text: "충주성에서 노비 문서를 불태우자, 노비를 비롯한 모든 사람이 힘을 합쳐 몽골군을 물리쳤다.", explanation: "차별받던 노비들도 내 나라와 자유를 지키기 위해 목숨 바쳐 싸웠습니다.", symbol: "🔥" },
      { text: "신분을 뛰어넘어 온 백성이 하나로 단결했기에 막강한 몽골군을 이길 수 있었다.", explanation: "단결과 평등의 약속이 승리의 원동력이었습니다.", symbol: "🤝" },
    ],
    wrongPool: [
      { text: "김윤후는 노비들에게 더 무거운 세금을 매기고 전쟁터에 나가지 못하게 막았다.", explanation: "노비 문서를 불태우고 신분에 상관없이 벼슬을 주겠다고 약속하며 함께 싸웠습니다.", symbol: "❌" },
      { text: "처인성과 충주성 전투에서 몽골군에게 항복하여 성문을 스스로 열어 주었다.", explanation: "두 전투 모두 김윤후와 백성들이 힘을 합쳐 몽골군을 크게 물리친 승리였습니다.", symbol: "❌" },
      { text: "김윤후는 신라 말에 후고구려를 세우고 가혹한 정치를 펼친 왕이었다.", explanation: "후고구려를 세운 인물은 궁예이며, 김윤후는 몽골군을 물리친 고려의 승려입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "처인성·충주성 전투", label: "김윤후의 처인성·충주성 전투", desc: "처인성에서 몽골 총사령관을 사살하고, 충주성에서 노비 문서를 불태우며 단결해 몽골군 격퇴", symbol: "🏹" },
  },
  {
    prompt: "전쟁 이후 원(몽골)의 간섭 속에서 나타난 [고려와 몽골의 문화 교류]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "앞머리털을 밀고 뒷머리털만 남겨 땋는 남성의 머리 모양인 '변발'이 유행했다.", explanation: "「고려 공민왕 엽기도」에도 몽골식 변발 모습이 남아 있습니다.", symbol: "💇" },
      { text: "오늘날 전통 혼례 때 신부가 머리에 쓰는 '족두리'와 나팔 모양 악기인 '태평소'가 전해졌다.", explanation: "몽골의 의복과 악기가 고려의 전통 풍습 속에 자리 잡았습니다.", symbol: "🎺" },
      { text: "몽골 사람들이 즐겨 먹던 '만두'와 따뜻한 고깃국에서 유래한 '설렁탕'이 고려에 전해졌다.", explanation: "만두와 설렁탕은 오늘날까지도 우리가 즐겨 먹는 음식이 되었습니다.", symbol: "🥟" },
      { text: "반대로 몽골에서는 상추쌈, 유밀과, 시루떡 등 고려의 음식과 풍습이 큰 인기를 끌었다.", explanation: "일방적인 수용이 아니라 서로에게 많은 영향을 주고받았습니다.", symbol: "🥬" },
    ],
    wrongPool: [
      { text: "몽골과의 교류를 완전히 차단하여 음식이나 옷차림에서 아무런 영향을 주고받지 않았다.", explanation: "교류가 늘어나면서 의복, 머리 모양, 악기, 음식 등에서 서로 많은 영향을 주었습니다.", symbol: "❌" },
      { text: "고려에서 몽골로 햄버거와 피자, 커피를 처음 전파해 유행시켰다.", explanation: "몽골에서 유행한 고려 음식은 상추쌈, 유밀과, 시루떡 등이었습니다.", symbol: "❌" },
      { text: "변발과 족두리는 거란의 침입 때 서희의 외교 담판으로 송나라에서 건너온 것이다.", explanation: "변발과 족두리는 고려 후기 원(몽골)의 간섭과 문화 교류 속에서 전해진 풍습입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "고려·원의 교류", label: "고려와 원의 문화 교류 (경천사지 십층석탑)", desc: "변발·족두리·태평소·만두·설렁탕이 고려에 전해지고, 상추쌈·유밀과·시루떡이 몽골에서 유행함", symbol: "/relics/goryeo_gyeongcheonsa_pagoda.webp", source: "국립중앙박물관 (공공누리 제1유형)" },
  },
  {
    prompt: "고려 후기 몽골과의 교류 속에 전해진 대표적인 음식인 [만두와 설렁탕]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "만두는 처음에는 주로 고려 지배층이 즐기다가 점차 개경의 길거리 가게에서도 팔 만큼 널리 퍼졌다.", explanation: "잔치 음식으로 정착된 뒤 일반 백성들 사이에서도 널리 인기를 끌었습니다.", symbol: "🥟" },
      { text: "고려 사람들은 고기와 채소로 속을 꽉 채운 만두를 잔치 음식과 별식으로 즐겨 먹었다.", explanation: "몽골에서 전해진 만두는 고려 사람들의 식탁을 풍성하게 해주는 별식이 되었습니다.", symbol: "🥟" },
      { text: "『고려사』에는 충혜왕 때 궁궐 주방에 침입해 만두를 훔쳤다가 벌을 받은 사람의 이야기가 전해진다.", explanation: "당시 궁궐에서도 만두를 즐겨 만들어 먹었음을 보여 주는 재미있는 기록입니다.", symbol: "📜" },
      { text: "'설렁탕'이라는 말은 몽골의 고깃국을 뜻하는 몽골말 '슐렁'에서 나왔다고 전해진다.", explanation: "(조선 시대 '선농탕'에서 이어졌다는 의견과 함께) 몽골 음식 문화의 영향을 보여 줍니다.", symbol: "🍲" },
    ],
    wrongPool: [
      { text: "만두와 설렁탕은 조선 후기에 처음 만들어진 순수 조선 고유의 음식이다.", explanation: "만두와 설렁탕은 고려 후기 몽골과의 교류를 통해 우리나라에 전해진 음식입니다.", symbol: "❌" },
      { text: "고려 시대에는 만두를 먹는 것이 법으로 금지되어 만두를 만들면 사형에 처해졌다.", explanation: "만두는 고려의 잔치 음식으로 정착되었고 길거리 가게에서도 널리 팔았습니다.", symbol: "❌" },
      { text: "만두와 설렁탕은 아라비아 상인들이 프랑스로 가져가서 만든 서양 과자였다.", explanation: "몽골(또는 중국)과의 교류를 통해 전해져 오늘날까지 사랑받는 우리 음식 문화입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "음식 문화 교류", label: "만두와 설렁탕의 전래", desc: "몽골과의 교류로 만두와 설렁탕이 전해져 고려의 음식 문화가 더욱 풍성해짐", symbol: "🥟" },
  },
  {
    prompt: "고려 시대 [거란의 침입과 몽골의 침입]을 비교한 설명으로 옳은 것을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "거란의 1차 침입 때는 서희가 외교 담판을 벌여 싸우지 않고 강동 6주를 얻었다.", explanation: "뛰어난 외교 담판으로 영토를 넓혔습니다.", symbol: "📜" },
      { text: "거란의 3차 침입 때는 강감찬 장군이 귀주에서 거란군을 크게 물리쳤다(귀주 대첩).", explanation: "귀주 대첩 이후 천리장성을 쌓아 북방 국경을 굳건히 지켰습니다.", symbol: "⚔️" },
      { text: "몽골의 침입 때는 수도를 강화도로 옮기고 김윤후와 백성들이 처인성·충주성에서 활약했다.", explanation: "약 30년간 끈질기게 대몽 항쟁을 이어갔습니다.", symbol: "🏝️" },
      { text: "두 차례의 큰 외침 모두 고려의 장군과 관리, 그리고 백성들의 지혜와 단결로 나라를 지켜냈다.", explanation: "외적의 침입에 굴하지 않은 고려인의 자주적 호국 정신을 보여 줍니다.", symbol: "🛡️" },
    ],
    wrongPool: [
      { text: "거란이 침입했을 때 수도를 강화도로 옮기고 팔만대장경을 만들었다.", explanation: "강화도 천도와 팔만대장경 제작은 거란이 아니라 '몽골'의 침입 때입니다.", symbol: "❌" },
      { text: "몽골이 침입했을 때 서희가 담판을 벌여 강동 6주를 얻었다.", explanation: "서희의 외교 담판과 강동 6주는 거란의 1차 침입 때입니다.", symbol: "❌" },
      { text: "강감찬 장군이 처인성에서 노비 문서를 불태우며 아라비아 상인들과 싸웠다.", explanation: "처인성·충주성 전투는 김윤후 승려가 몽골군과 싸운 전투입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "대외 항쟁 비교", label: "거란 항쟁 vs 몽골 항쟁", desc: "거란(서희 강동 6주, 강감찬 귀주 대첩, 천리장성) / 몽골(강화도 천도, 김윤후 처인성·충주성)", symbol: "⚔️" },
  },
  {
    prompt: "고려 전기와 후기의 [대외 관계와 국제 교류]를 종합한 설명으로 옳은 것을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "귀주 대첩 이후 고려와 거란, 송 사이의 외교 관계가 안정되어 평화가 이어졌다.", explanation: "강력한 국방력을 바탕으로 동북아시아의 세력 균형과 평화를 이루었습니다.", symbol: "🕊️" },
      { text: "개경 근처의 벽란도를 통해 송, 거란, 여진, 일본, 아라비아 상인들과 활발히 무역했다.", explanation: "열린 자세로 세계 여러 나라와 문물을 교류했습니다.", symbol: "⛵" },
      { text: "아라비아 상인들에 의해 고려가 서양에 알려져 오늘날 '코리아(Korea)'로 불리게 되었다.", explanation: "고려의 활발한 국제 교류가 남긴 세계사적 유산입니다.", symbol: "🌍" },
      { text: "몽골과의 오랜 전쟁 후에는 원의 간섭을 받았으나, 음식과 풍습 등에서 서로 영향을 주고받았다.", explanation: "변발·족두리·만두·설렁탕과 고려의 상추쌈·유밀과 등이 교류되었습니다.", symbol: "🥟" },
    ],
    wrongPool: [
      { text: "고려는 건국부터 멸망할 때까지 모든 항구를 닫고 어떤 나라와도 교류하지 않았다.", explanation: "벽란도를 중심으로 아라비아 상인까지 맞이하며 활발히 국제 교류를 펼쳤습니다.", symbol: "❌" },
      { text: "귀주 대첩 이후 거란이 고려를 완전히 지배하여 고려라는 나라 이름이 사라졌다.", explanation: "귀주 대첩에서 고려가 대승을 거두어 거란이 화해를 요청하고 고려를 다시 넘보지 못했습니다.", symbol: "❌" },
      { text: "'코리아'라는 이름은 조선 시대에 일본 상인들이 처음 지어 준 이름이다.", explanation: "고려 시대에 아라비아 상인들을 통해 '고려'가 서양에 알려지며 유래했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "대외 관계 종합", label: "고려의 대외 관계 총정리", desc: "외적의 침입(거란·몽골)은 단호히 물리치고, 벽란도를 통해 세계와 활발히 교류함", symbol: "🌏" },
  },
];

// ============================================================================
// 4단계: 고려의 문화와 생활 - 10개 템플릿
// ============================================================================
const stage4Templates: RawQuizTemplate[] = [
  {
    prompt: "고려 시대를 대표하는 예술품인 [고려청자와 상감 기법]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "처음에는 중국의 기술을 받아들였으나, 상감 기법을 활용하여 고려만의 독창적인 청자를 만들었다.", explanation: "청자 제작 기술을 발전시켜 세계 최고 수준의 상감청자를 완성했습니다.", symbol: "🏺" },
      { text: "상감 기법은 겉면에 무늬를 새겨 파내고 다른 색의 흙으로 메꾼 뒤 유약을 발라 구워 내는 기법이다.", explanation: "백토와 흑토를 메워 넣어 한 폭의 그림처럼 정교한 무늬를 표현했습니다.", symbol: "✨" },
      { text: "높은 온도로 도자기를 구울 수 있는 시설과 불을 다루는 기술, 푸른빛을 내는 방법을 모두 갖추어야 했다.", explanation: "뛰어난 과학 기술과 예술적 감각이 결합된 문화유산입니다.", symbol: "🔥" },
      { text: "다양한 생활용품으로 만들어졌으며, 비싸고 귀한 물건이었기 때문에 주로 지배층이 사용했다.", explanation: "왕실과 귀족 등 지배층이 주전자, 베개, 대접 등으로 애용했습니다.", symbol: "👑" },
    ],
    wrongPool: [
      { text: "상감 기법으로 청자를 만드는 기술은 중국에서 그대로 들여와 고려에서는 아무런 변화도 주지 않았다.", explanation: "상감 기법은 고려 사람들이 독창적으로 발전시킨 기법입니다.", symbol: "❌" },
      { text: "고려청자는 값이 매우 싸고 흔해서 지배층은 쓰지 않고 주로 서민과 노비들만 사용했다.", explanation: "고려청자는 비싸고 귀한 물건이어서 주로 지배층이 사용했습니다.", symbol: "❌" },
      { text: "도자기를 굽는 가마 없이 붉은 진흙을 햇볕에만 말려 서민들이 물을 긷던 거친 질그릇이었다.", explanation: "고려청자는 1200도 이상의 높은 온도에서 정교한 가마 시설과 유약을 사용해 완성한 고급 예술품입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "고려 상감청자", label: "청자 상감운학문 매병 (고려 상감청자)", desc: "겉면에 무늬를 파내고 다른 색의 흙을 메워 구운 독창적인 청자로, 주로 지배층이 사용함", symbol: "/relics/goryeo_celadon_maebyeong.webp", source: "국립중앙박물관 (공공누리 제1유형)" },
  },
  {
    prompt: "태안 앞바다에서 발굴된 [고려청자 보물선]을 통해 알 수 있는 사실로 옳은 것을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "충청남도 태안군 앞바다에서 고려청자 대접 등을 가득 실은 고려 시대 침몰선(보물선)이 발견되었다.", explanation: "수중 발굴 조사를 통해 수많은 고려청자와 선박 뼈대가 확인되었습니다.", symbol: "🚢" },
      { text: "고려청자 생산지였던 탐진(강진)에서 만들어진 청자를 실어 나르던 운반선이었다.", explanation: "전라도 강진 일대는 고려 시대 대표적인 청자 생산지였습니다.", symbol: "🏺" },
      { text: "배의 최종 목적지는 고려청자를 주로 사용하던 지배층이 모여 사는 수도 개경(벽란도)이었다.", explanation: "남해와 황해 바닷길을 따라 개경의 왕실과 귀족들에게 운반하던 길이었습니다.", symbol: "🧭" },
      { text: "당시 바닷길을 이용해 지방에서 생산된 귀한 물품을 수도 개경으로 활발히 운송했음을 보여 준다.", explanation: "고려 시대의 해상 운송 경로(강진➔군산➔태안➔벽란도➔개경)를 증명합니다.", symbol: "🌊" },
    ],
    wrongPool: [
      { text: "수도 개경에서 만든 청자를 남쪽 시골 농민들에게 무료로 나누어 주려고 내려가던 배였다.", explanation: "남쪽 생산지인 탐진(강진)에서 만들어 수도 개경의 지배층에게 올라가던 배였습니다.", symbol: "❌" },
      { text: "보물선 안에는 청자가 아니라 거란군이 사용하던 무기와 철제 안장만 가득 실려 있었다.", explanation: "태안 앞바다 보물선에는 강진에서 개경으로 운반하던 2만 3천여 점의 고려청자가 실려 있었습니다.", symbol: "❌" },
      { text: "몽골군이 강화도를 공격하기 위해 타고 온 철갑 군함이었다.", explanation: "강진에서 개경으로 고려청자를 운송하던 고려의 선박이었습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "해상 운송 유적", label: "강진 청자 운반선 발굴과 해상 유통", desc: "청자 생산지인 탐진(강진)에서 수도 개경의 지배층에게 청자를 운반하던 고려의 해상 교역로", symbol: "🚢" },
  },
  {
    prompt: "고려 사람들이 정성껏 만든 [팔만대장경(합천 해인사 대장경판)]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "거란 침입 때 만든 초조대장경판이 몽골의 침입으로 불타자, 다시 만든 대장경이다.", explanation: "불교의 힘에 의지해 마음을 모으면 나라를 구할 수 있다고 믿었습니다.", symbol: "📿" },
      { text: "부처님의 힘으로 사악한 몽골군의 침입을 물리치기를 바라는 간절한 마음으로 만들었다.", explanation: "『동국이상국집』 기도문에 몽골군이 물러가고 나라가 편안해지기를 빈 내용이 남아 있습니다.", symbol: "🙏" },
      { text: "부처의 가르침을 새긴 나무 경판의 수가 팔만여 장에 이르기 때문에 '팔만대장경'이라고 부른다.", explanation: "8만여 장에 달하는 방대한 불교 경전을 나무판에 새겼습니다.", symbol: "🪵" },
      { text: "오랜 시간에 걸쳐 만들었지만 글자 모양이 고르고 틀린 글자가 거의 없어 뛰어난 목판 인쇄 기술을 보여 준다.", explanation: "당시 여러 대장경을 철저히 비교해 내용도 매우 정확하고 풍부합니다.", symbol: "✨" },
    ],
    wrongPool: [
      { text: "몽골이 아니라 거란의 1차 침입을 물리치기 위해 쇳물을 부어 만든 금속 활자였다.", explanation: "팔만대장경은 '몽골'의 침입을 물리치기를 바라며 나무판에 새긴 '목판'입니다.", symbol: "❌" },
      { text: "글자 크기가 제각각이고 틀린 글자가 너무 많아 책을 인쇄할 수 없었다.", explanation: "글자의 모양이 한 사람이 쓴 것처럼 고르고 틀린 글자가 거의 없을 만큼 정교합니다.", symbol: "❌" },
      { text: "백성들의 세금을 열 배로 거두기 위해 만든 세금 장부였다.", explanation: "부처의 가르침이 담긴 경전을 하나로 모은 호국 불교 문화유산입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "목판 인쇄 유산", label: "합천 해인사 대장경판 (팔만대장경)", desc: "몽골의 침입을 물리치기를 바라는 마음으로 8만여 장의 나무판에 새긴 고려 목판 인쇄 기술의 정수", symbol: "/relics/goryeo_tripitaka_woodblock.webp", source: "국가유산청 국가유산포털 (공공누리 제1유형)" },
  },
  {
    prompt: "팔만대장경이 오늘날까지 온전히 전해질 수 있도록 보관해 온 [합천 해인사 장경판전]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "경상남도 합천군 해인사에 있으며 팔만대장경판을 안전하게 보관하기 위해 지은 건물이다.", explanation: "나무로 된 경판이 썩거나 뒤틀리지 않도록 보호하는 보관소입니다.", symbol: "🏛️" },
      { text: "과학적 원리에 따라 건물 내부의 온도와 습도가 일정하게 유지되도록 설계되었다.", explanation: "창문의 크기와 위치, 바닥 흙 등을 과학적으로 설계하여 자연 통풍이 이루어집니다.", symbol: "🌡️" },
      { text: "팔만대장경은 고려 시대에 만들어졌고, 이를 보관하는 장경판전은 조선 시대에 만들어졌다.", explanation: "고려 시대에 만든 팔만대장경을 안전하게 보관하기 위해 조선 시대에 과학적 원리로 지어진 보관 건물입니다.", symbol: "📜" },
      { text: "조상들의 뛰어난 과학적 건축 지혜 덕분에 8만여 장의 나무 경판이 오늘날까지 온전히 보존되었다.", explanation: "세계가 감탄하는 과학적 보존 기술의 결정체입니다.", symbol: "✨" },
    ],
    wrongPool: [
      { text: "전기와 대형 에어컨을 설치하여 팔만대장경을 얼려서 보관한 현대식 창고이다.", explanation: "기계 장치 없이 자연 지형과 바람길 등 과학적 건축 원리로 온도와 습도를 유지했습니다.", symbol: "❌" },
      { text: "태안 앞바다 물속에 잠겨 있던 고려청자 보물선의 이름이다.", explanation: "장경판전은 합천 해인사에서 팔만대장경판을 보관하는 건물입니다.", symbol: "❌" },
      { text: "벽란도에서 외국 사신들이 잠을 자고 휴식을 취하던 숙소 건물이었다.", explanation: "벽란도에서 외국 사신이 머물렀던 건물은 '벽란정'입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "과학적 건축물", label: "합천 해인사 장경판전", desc: "팔만대장경을 보관하려고 과학적 원리에 따라 온도와 습도가 일정하게 유지되도록 만든 건물", symbol: "/relics/goryeo_janggyeong_panjeon.webp", source: "국가유산청 국가유산포털 (공공누리 제1유형)" },
  },
  {
    prompt: "고려 사람들이 세계 최초로 발명한 [금속 활자와 『직지』]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "고려 사람들은 세계 최초로 금속 활자를 발명하여 책을 인쇄했다.", explanation: "서양의 구텐베르크 금속 활자보다 훨씬 앞선 세계 최초의 발명입니다.", symbol: "🖨️" },
      { text: "갈라지고 휘기 쉬운 목판과 달리 금속 활자는 쉽게 변하지 않고 보관이 편리했다.", explanation: "금속의 단단한 성질 덕분에 반영구적으로 보관할 수 있었습니다.", symbol: "🔩" },
      { text: "목판은 새긴 내용만 인쇄할 수 있었지만, 금속 활자는 글자를 조합하여 여러 종류의 책을 인쇄할 수 있었다.", explanation: "필요한 글자 활자를 골라 배열하면 다양한 책을 찍어낼 수 있었습니다.", symbol: "📚" },
      { text: "『직지』는 오늘날 남아 있는 세계에서 가장 오래된 금속 활자 인쇄본이다(프랑스 국립도서관 소장).", explanation: "개성 궁궐터에서 발견된 금속 활자와 함께 고려의 뛰어난 인쇄술을 증명합니다.", symbol: "📖" },
    ],
    wrongPool: [
      { text: "목판은 여러 종류의 책을 조합해 찍을 수 있었지만, 금속 활자는 단 한 권의 책만 찍고 버려야 했다.", explanation: "반대입니다! 목판은 새긴 내용만 찍을 수 있었고, 금속 활자가 활자를 조합해 여러 책을 인쇄할 수 있었습니다.", symbol: "❌" },
      { text: "『직지』는 나무판에 새겨 찍어 낸 합천 해인사 팔만대장경의 다른 이름이다.", explanation: "『직지』는 세계에서 가장 오래된 '금속 활자' 인쇄본입니다.", symbol: "❌" },
      { text: "금속 활자는 서양에서 먼저 발명된 기술을 아라비아 상인을 통해 수입한 것이다.", explanation: "고려 사람들이 세계 최초로 금속 활자를 발명했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "금속 활자 유산", label: "세계 최초 금속 활자와 『직지』", desc: "활자를 조합해 여러 책을 인쇄할 수 있는 금속 활자를 세계 최초로 발명했으며, 현존 최고 인쇄본은 『직지』임", symbol: "/relics/goryeo_jikji.webp", source: "국가유산청 국가유산포털 (공공누리 제1유형)" },
  },
  {
    prompt: "고려 시대에 발달한 [금속 활자의 제작과 인쇄 6단계 과정]에 대해 옳은 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "1~2단계: 꿀벌이 분비하는 물질인 '밀랍'에 글자를 새긴 뒤, 밀랍 가지를 만들어 황토 반죽으로 감싼다.", explanation: "열에 잘 녹는 밀랍으로 글자 모양을 만들고 황토로 거푸집을 만듭니다.", symbol: "🐝" },
      { text: "3~4단계: 황토 반죽을 감싼 밀랍 가지에 뜨거운 쇳물을 붓고, 쇳물이 식은 후 금속 활자를 떼어 낸다.", explanation: "쇳물의 열로 밀랍이 녹아 빠져나간 자리에 정교한 금속 글자가 만들어집니다.", symbol: "🔥" },
      { text: "5~6단계: 인쇄할 내용에 맞추어 활자를 판에 배열해 고정한 뒤 먹물을 묻혀 책을 인쇄한다.", explanation: "활자를 조합해 배열함으로써 원하는 책을 인쇄할 수 있었습니다.", symbol: "📖" },
      { text: "금속을 다루는 기술뿐만 아니라 활자를 판에 고정하는 기술, 먹과 종이를 만드는 기술까지 함께 발달했다.", explanation: "종합적인 과학 기술이 뒷받침되었기에 금속 활자 인쇄가 가능했습니다.", symbol: "⚙️" },
    ],
    wrongPool: [
      { text: "단단한 화강암 바위에 정과 망치로 글자를 직접 파내어 먹물을 묻힌 뒤 찍어 냈다.", explanation: "밀랍에 글자를 새기고 황토 반죽을 감싼 뒤 쇳물을 붓는 주조 방식으로 금속 활자를 만들었습니다.", symbol: "❌" },
      { text: "인쇄할 내용을 먼저 종이에 찍은 뒤에 마지막으로 밀랍에 글자를 새겼다.", explanation: "밀랍에 글자 새기기 ➔ 황토 감싸기 ➔ 쇳물 붓기 ➔ 활자 떼기 ➔ 활자 배열 ➔ 인쇄하기 순서입니다.", symbol: "❌" },
      { text: "흙으로 글자를 빚은 뒤 유약을 발라 청자 가마에서 푸른색으로 구워 냈다.", explanation: "유약을 발라 구워 내는 것은 고려청자 제작 방법입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "금속 활자 제작", label: "고려 금속활자(개성 만월대 출토)와 제작 과정", desc: "①밀랍 글자 새기기 ➔ ②황토 반죽 감싸기 ➔ ③쇳물 붓기 ➔ ④활자 떼기 ➔ ⑤활자 배열 ➔ ⑥인쇄하기", symbol: "/relics/goryeo_metal_type.webp", source: "국립중앙박물관 (공공누리 제1유형)" },
  },
  {
    prompt: "고려 백성들의 의생활을 크게 바꾸어 놓은 [문익점과 목화 보급]에 대해 옳은 설명을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "목화가 보급되기 전에는 비단과 가죽이 비싸서 일반 백성은 주로 까칠하고 바람이 잘 통하는 삼베나 모시 옷을 입었다.", explanation: "삼베와 모시는 추위를 막기 어려워 겨울에 백성들이 큰 고통을 겪었습니다.", symbol: "🍃" },
      { text: "문익점은 고려 사신으로 원에 갔다가 돌아올 때 목화씨를 얻어 와 장인인 정천익에게 심게 하였다.", explanation: "추위에 떠는 백성들을 위해 목화씨를 들여와 재배를 시도했습니다.", symbol: "🌱" },
      { text: "겨우 살아남은 한 줄기를 정성껏 길러 3년 만에 목화 재배에 성공하고, 실을 뽑아 옷감 짜는 기술도 널리 퍼뜨렸다.", explanation: "포기하지 않는 노력으로 재배와 방직 기술 보급에 모두 성공했습니다.", symbol: "🧶" },
      { text: "목화솜에서 실을 뽑아 만든 부드럽고 따뜻한 '무명옷'이 10년도 안 되어 나라 곳곳에 널리 퍼졌다.", explanation: "고려 백성들의 의생활이 획기적으로 따뜻하고 편리해졌습니다.", symbol: "👕" },
    ],
    wrongPool: [
      { text: "문익점이 목화를 들여온 뒤에도 무명옷은 오직 왕과 귀족만 입을 수 있었고 백성은 입지 못했다.", explanation: "무명옷은 10년이 되지 않아 나라 곳곳의 일반 백성들에게 널리 퍼졌습니다.", symbol: "❌" },
      { text: "목화솜으로 만든 옷감인 '모시'는 까칠하고 바람이 잘 통해 겨울에 더욱 추웠다.", explanation: "까칠하고 바람이 잘 통하는 것은 모시풀로 짠 '모시'이며, 목화솜으로 만든 부드럽고 따뜻한 옷감은 '무명'입니다.", symbol: "❌" },
      { text: "문익점은 목화 재배법을 비밀에 부치고 오직 자기 집안에서만 비싼 값에 무명옷을 팔았다.", explanation: "문익점과 정천익은 목화 재배 기술과 무명실 뽑는 기술을 나라 전체에 널리 보급했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "의생활의 변화", label: "문익점의 목화 도입과 백성의 의생활", desc: "목화 재배와 무명실 제직 기술을 보급하여 겨울 추위에 떨던 백성들의 의생활을 따뜻하게 바꿈", symbol: "🌱" },
  },
  {
    prompt: "고려의 두 인쇄 문화유산인 [팔만대장경(목판)]과 [금속 활자(『직지』)]를 바르게 비교한 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "목판 인쇄(팔만대장경)는 한 번 판을 새기면 동일한 책을 대량으로 찍기에 유리하고, 금속 활자(직지)는 활자를 재배열하여 다양한 책을 소량 찍기에 유리했다.", explanation: "인쇄 목적에 따라 목판과 금속 활자의 장단점이 달랐습니다.", symbol: "📚" },
      { text: "팔만대장경은 몽골 침략을 부처님의 힘으로 극복하고자 제작되었고, 『직지』는 청주 흥덕사에서 불교의 깨달음을 전하기 위해 간행되었다.", explanation: "두 유산 모두 고려 사람들의 정신과 신앙, 구국의 염원이 담겨 있습니다.", symbol: "📿" },
      { text: "목판은 나무를 소금물에 삶고 말려 뒤틀림을 방지했고, 금속 활자는 밀랍으로 글자 원형을 만들고 쇳물을 붓는 정밀 주조 기술을 썼다.", explanation: "재료와 제작 기법의 차이를 보여주는 뛰어난 전통 과학기술입니다.", symbol: "⚙️" },
      { text: "두 인쇄 문화유산 모두 세계적인 가치와 독창성을 인정받아 오늘날 유네스코 세계기록유산에 당당히 등재되어 있다.", explanation: "고려의 기록 문화는 인류 전체가 보존해야 할 위대한 유산입니다.", symbol: "🏛️" },
    ],
    wrongPool: [
      { text: "금속 활자는 한 번 활자를 주조하면 다른 글자로 바꿀 수 없어 오직 한 권의 책만 찍고 버려야 했다.", explanation: "활자를 재조합하여 여러 종류의 책을 계속해서 인쇄할 수 있는 것이 금속 활자의 최대 장점입니다.", symbol: "❌" },
      { text: "팔만대장경과 『직지』는 모두 고려의 기술이 아니라 아라비아 상인들이 전해준 서양 인쇄술을 그대로 모방한 것이다.", explanation: "목판 인쇄와 금속 활자 모두 고려 장인들이 독창적으로 발전시킨 고유 기술입니다.", symbol: "❌" },
      { text: "목판은 쇳물을 부어 만든 금속 인쇄본이고, 『직지』는 나무판에 글자를 깎아 만든 거대한 목판이다.", explanation: "팔만대장경이 목판이고, 『직지』가 세계 최초의 금속 활자본입니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "인쇄 문화 비교", label: "목판 인쇄(팔만대장경) vs 금속 활자(직지)", desc: "한 종류를 대량 인쇄하는 목판 인쇄와 활자를 조합해 여러 책을 찍는 금속 활자의 특성 비교", symbol: "📖" },
  },
  {
    prompt: "고려 시대 사람들의 [옷감과 의생활]에 대한 설명으로 옳은 것을 고르세요.",
    difficulty: "EASY",
    correctPool: [
      { text: "비단과 가죽으로 만든 옷은 따뜻하고 좋았지만 값이 비싸서 주로 지배층이 입었다.", explanation: "신분과 경제력에 따라 입는 옷의 재료가 달랐습니다.", symbol: "👑" },
      { text: "목화가 보급되기 전 일반 백성은 주로 삼베나 모시로 만든 옷을 입었다.", explanation: "삼베와 모시는 식물 줄기로 짜서 까칠하고 바람이 잘 통했습니다.", symbol: "🌿" },
      { text: "'무명'은 목화솜에서 실을 뽑아 만든 옷감으로, 부드럽고 따뜻하여 겨울 추위를 막는 데 좋았다.", explanation: "문익점과 정천익의 목화 재배 성공으로 무명옷이 보급되었습니다.", symbol: "☁️" },
      { text: "목화가 널리 재배되면서 일반 백성들의 의생활이 이전보다 훨씬 따뜻하고 풍요로워졌다.", explanation: "백성의 실생활을 크게 개선한 고마운 변화였습니다.", symbol: "👕" },
    ],
    wrongPool: [
      { text: "'모시'는 목화솜에서 실을 뽑아 만든 옷감으로 털옷보다 두껍고 따뜻했다.", explanation: "목화솜으로 만든 따뜻한 옷감은 '무명'이며, '모시'는 모시풀로 짠 시원하고 까칠한 옷감입니다.", symbol: "❌" },
      { text: "고려 시대에는 가락바퀴와 뼈바늘조차 없어서 모든 사람이 나뭇잎만 두르고 살았다.", explanation: "삼베, 모시, 비단, 가죽, 그리고 목화 보급 이후의 무명까지 다양한 옷감을 짜서 입었습니다.", symbol: "❌" },
      { text: "일반 농민들은 일 년 내내 값비싼 중국산 비단옷과 족두리만 착용하고 농사를 지었다.", explanation: "비단은 비싸서 지배층이 입었고, 일반 백성은 삼베·모시를 입다가 목화 보급 후 무명옷을 입었습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "목화와 무명옷", label: "삼베·모시에서 따뜻한 무명옷으로", desc: "비싼 비단·가죽 대신 까칠한 삼베·모시를 입던 백성들이 목화 보급으로 따뜻한 무명을 입게 됨", symbol: "👕" },
  },
  {
    prompt: "후삼국 통일부터 문화유산까지 [고려의 역사와 문화 발전]에 대한 설명으로 옳은 것을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "왕건은 고려를 건국한 뒤 발해 유민을 수용하고 후삼국을 통일했으며, 『훈요 10조』를 남겼다.", explanation: "민족 통합과 고려 통치의 기틀을 마련했습니다.", symbol: "👑" },
      { text: "고려는 과거제를 실시해 능력을 중시했고, 가정생활에서 여성은 남성과 동등한 지위를 유지했다.", explanation: "아들과 딸의 균등 상속(손변의 재판)과 여성 가장 등이 이를 보여 줍니다.", symbol: "⚖️" },
      { text: "서희의 외교 담판(강동 6주)과 강감찬의 귀주 대첩으로 거란을 물리쳤고, 벽란도를 통해 세계와 교류했다.", explanation: "외침을 슬기롭게 극복하고 '코리아'의 이름을 세계에 알렸습니다.", symbol: "⛵" },
      { text: "상감 기법의 고려청자, 몽골 격퇴를 기원한 팔만대장경, 세계 최초 금속 활자(『직지』), 문익점의 목화 보급 등 찬란한 문화를 꽃피웠다.", explanation: "고려 시대를 대표하는 자랑스러운 문화유산과 생활의 발전입니다.", symbol: "🏺" },
    ],
    wrongPool: [
      { text: "고려는 신라에 비해 개인의 능력보다 신분만을 더욱 중시하여 과거제를 실시하지 않았다.", explanation: "고려는 과거제를 실시해 신라에 비해 개인의 능력을 중시했습니다.", symbol: "❌" },
      { text: "고려 시대에는 가정생활에서 여성의 지위가 남성에 비해 매우 낮아 유산을 전혀 받지 못했다.", explanation: "가정생활에서 고려 여성은 남성과 동등한 지위를 누렸으며 아들과 딸이 똑같이 유산을 상속받았습니다.", symbol: "❌" },
      { text: "고려청자는 값이 싸서 주로 서민들이 사용했고, 팔만대장경은 거란과 친해지기 위해 만들었다.", explanation: "고려청자는 주로 지배층이 사용했고, 팔만대장경은 몽골 침입을 물리치기 위해 만들었습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "고려사 총정리", label: "고려 500년 역사와 문화 핵심 총정리", desc: "후삼국 통일과 국가 기틀 마련, 외침 극복과 세계 교류, 독창적인 문화유산과 의생활 발전", symbol: "🏆" },
  },
  {
    prompt: "고려 사람들이 일상생활과 의식에서 사용한 [고려청자의 다양한 형태와 쓰임새]에 대해 옳은 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "참외, 원숭이, 사자 등 자연 속 동식물의 독창적인 모습을 본떠 빚은 '상형 청자'를 다양하게 제작했다.", explanation: "교과서에 실린 청자 참외모양 병, 모자원숭이모양 연적 등이 대표적입니다.", symbol: "🏺" },
      { text: "청자는 밥그릇과 대접뿐만 아니라 주전자, 꽃병, 향로, 연적(물그릇) 등 다양한 생활용품으로 쓰였다.", explanation: "선비들의 문방사우부터 귀족들의 식기, 사찰의 의식 도구까지 널리 활용되었습니다.", symbol: "🪷" },
      { text: "아름다운 비취색(비색)과 정교한 조각이 어우러져 고려 왕실과 귀족의 세련된 문화 수준을 보여주었다.", explanation: "송나라 사람들도 고려의 비색 청자를 천하제일의 명품으로 칭송했습니다.", symbol: "✨" },
      { text: "청자는 흙을 빚고 굽는 과정이 매우 까다롭고 귀하여 주로 왕실, 귀족, 사찰 등 지배층이 사용했다.", explanation: "귀한 보물로 대우받았으며 개경으로 운반하다 침몰한 보물선이 발견되기도 했습니다.", symbol: "👑" },
    ],
    wrongPool: [
      { text: "고려청자는 값이 매우 싸서 일반 노비와 농민들이 밭일할 때 물통으로 널리 사용했다.", explanation: "청자는 제작이 까다롭고 비싸 주로 지배층이나 사찰에서 소중히 썼습니다.", symbol: "❌" },
      { text: "고려 사람들은 그릇 모양을 오직 둥근 접시 형태로만 규격화하여 엄격히 강제했다.", explanation: "동식물과 과일 등 자연의 온갖 형태를 자유롭게 조각해 만들었습니다.", symbol: "❌" },
      { text: "청자는 깨지기 쉬워 장식용으로만 두고 물이나 음식을 절대 담지 못하게 법으로 금지했다.", explanation: "식기, 주전자, 벼루 물그릇 등 실제 일상생활에서 소중히 쓰였습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "청자 형태와 쓰임", label: "고려청자의 다양한 형태와 쓰임새", desc: "참외 모양 병, 연적, 향로 등 동식물을 본뜬 상형 청자와 지배층의 품격 있는 생활 문화", symbol: "🏺" },
  },
  {
    prompt: "고려만의 독창적인 기술인 [상감청자의 제작 과정과 상감 기법]에 대해 옳은 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "그릇 표면에 무늬를 파낸 뒤 백토(흰 흙)나 흑토(검은 흙)를 메워 넣어 무늬를 내는 것이 상감 기법이다.", explanation: "교과서 탐구 활동에 실려 있는 상감청자만의 세계적인 독창적 공예 기법입니다.", symbol: "🎨" },
      { text: "그릇을 빚고 그늘에서 말린 뒤 조각칼로 구름, 학, 연꽃 등 자연의 무늬를 정성껏 파냈다.", explanation: "파낸 홈에 다른 색의 흙을 꼼꼼하게 채워 넣었습니다.", symbol: "🖌️" },
      { text: "초벌구이를 거친 그릇에 투명한 청자 유약을 골고루 바른 뒤, 가마에서 1,300도 고온으로 재벌구이했다.", explanation: "고온 소성을 통해 단단하고 영롱한 비색 유리질 광택이 완성됩니다.", symbol: "🔥" },
      { text: "상감 기법 덕분에 그릇을 구워냈을 때 푸른 비색 바탕에 흰색과 검은색 무늬가 선명하게 살아났다.", explanation: "청자 상감운학문 매병처럼 영롱하고 입체적인 무늬가 탄생했습니다.", symbol: "✨" },
    ],
    wrongPool: [
      { text: "상감 기법은 그릇을 다 구워낸 완성품 겉면에 색연필이나 페인트로 칠을 덧바르는 방법이다.", explanation: "흙이 마르기 전 홈을 파고 백토와 흑토를 채워 가마에 구워내는 고난도 기법입니다.", symbol: "❌" },
      { text: "고려 장인들은 흙을 전혀 쓰지 않고 쇳물을 거푸집에 부어 만든 쇠그릇을 깎아서 청자를 만들었다.", explanation: "고려청자는 점토(도자기 흙)로 빚어 가마에서 구워낸 도자기입니다.", symbol: "❌" },
      { text: "청자는 높은 온도로 구우면 터지기 때문에 불을 때지 않고 햇볕에만 말려서 썼다.", explanation: "가마에서 1,300도 이상의 강한 불길로 구워내야 단단한 자기가 됩니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "상감 제작 과정", label: "상감청자 6단계 제작 과정", desc: "흙 빚기 ➔ 무늬 파내기 ➔ 백토·흑토 메우기(상감) ➔ 초벌구이 ➔ 유약 바르기 ➔ 1,300도 재벌구이", symbol: "🏺" },
  },
  {
    prompt: "800년이 넘도록 나무 경판이 뒤틀리거나 썩지 않도록 한 [팔만대장경의 목판 가공 과학]에 대해 옳은 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "나무를 바닷물에 1~2년 담그거나 소금물에 삶아 나무 진액을 빼고 갈라짐과 벌레 먹음을 방지했다.", explanation: "교과서에 나오는 목판 제작의 핵심 과학으로, 목재의 신축성을 줄였습니다.", symbol: "🌊" },
      { text: "소금물 처리를 거친 나무를 바람이 잘 통하는 그늘에서 오랜 시간 말려 수분을 일정하게 유지했다.", explanation: "햇볕에 급히 말리면 뒤틀리므로 통풍이 잘되는 그늘에서 정성껏 건조했습니다.", symbol: "💨" },
      { text: "경판에 글자를 새긴 뒤 표면에 옻칠을 여러 번 덧칠하여 습기와 곰팡이, 벌레 침입을 완벽히 막았다.", explanation: "천연 방부제인 옻칠 덕분에 수백 년 동안 글자가 닳지 않고 보존되었습니다.", symbol: "🛡️" },
      { text: "나무판의 네 모서리에 구리판을 덧대어 경판이 휘어지거나 떨어뜨려 깨지는 것을 방지했다.", explanation: "경판의 변형을 막고 보관 시 마찰을 줄여주는 지혜로운 설계입니다.", symbol: "⚙️" },
    ],
    wrongPool: [
      { text: "나무를 전혀 건조하지 않고 산에서 갓 베어낸 생나무에 곧바로 글자를 새겨 밀봉해 두었다.", explanation: "수년간 소금물에 삶고 그늘에서 건조하는 치밀한 가공 과정을 거쳤습니다.", symbol: "❌" },
      { text: "나무가 썩는 것을 막기 위해 모든 경판을 뜨거운 기름에 튀겨서 밀랍 속에 묻어 두었다.", explanation: "소금물 삶기와 그늘 건조, 옻칠을 통해 나무 본래의 결을 지켰습니다.", symbol: "❌" },
      { text: "글자를 빨리 새기기 위해 인쇄 공장의 현대식 기계로 하루 만에 8만 장을 한꺼번에 찍어냈다.", explanation: "글자 하나를 새길 때마다 세 번씩 절을 올리며 온 정성을 다해 손으로 판각했습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "대장경 제작 과학", label: "팔만대장경 목판 제작의 비밀", desc: "바닷물 삶기(뒤틀림 방지) ➔ 그늘 건조 ➔ 정성 판각 ➔ 옻칠(방충·방습) ➔ 네 모서리 구리판", symbol: "🪵" },
  },
  {
    prompt: "목화솜을 가공하여 백성들의 따뜻한 무명 옷감을 만들기까지의 [전통 가공 과정과 도구]에 대해 옳은 설명을 고르세요.",
    difficulty: "NORMAL",
    correctPool: [
      { text: "'씨아'라는 나무 도구의 틈에 목화를 넣고 손잡이를 돌려 목화솜 속에 든 단단한 씨를 빼냈다.", explanation: "교과서에 실려 있는 전통 목화 가공 도구로 씨와 솜을 분리했습니다.", symbol: "⚙️" },
      { text: "씨를 뺀 솜을 부드럽게 부풀린 뒤, '물레'의 바퀴를 돌려 실을 팽팽하게 꼬아 길게 자아냈다.", explanation: "물레를 돌려 솜에서 실을 뽑아 가락에 감는 과정입니다.", symbol: "🧵" },
      { text: "물레로 뽑아낸 무명실을 '베틀'에 걸고 날실과 씨실을 교차시켜 부드럽고 촘촘한 무명 옷감을 짰다.", explanation: "베틀을 이용해 비로소 따뜻한 무명 천이 완성되었습니다.", symbol: "👕" },
      { text: "문익점의 장인 정천익은 목화 재배뿐만 아니라 실을 뽑고 무명베를 짜는 도구와 기술을 개발해 보급했다.", explanation: "승려 홍원의 도움을 받아 씨아와 물레를 제작하여 전국에 보급했습니다.", symbol: "🤝" },
    ],
    wrongPool: [
      { text: "목화씨를 기름에 튀겨서 백성들에게 식량으로 나누어 준 것이 무명 옷의 시초이다.", explanation: "목화는 솜에서 실을 뽑아 옷감을 만들기 위해 재배한 식물입니다.", symbol: "❌" },
      { text: "물레는 목화씨를 땅속에 깊이 심을 때 구멍을 파는 밭갈이 농기구의 일종이다.", explanation: "물레는 솜에서 실을 잣는(뽑아내는) 전통 방적 도구입니다.", symbol: "❌" },
      { text: "목화솜은 실을 짤 수 없어 가공하지 않고 통째로 몸에 줄로 묶어서 입고 다녔다.", explanation: "씨아와 물레, 베틀을 거쳐 정교한 직물(무명)로 짜서 입었습니다.", symbol: "❌" },
    ],
    referenceNote: { tag: "목화 가공 도구", label: "씨아·물레·베틀과 무명옷", desc: "씨아(씨 빼기) ➔ 솜 타기 ➔ 물레(실 잣기) ➔ 베틀(옷감 짜기)을 거쳐 백성의 겨울을 바꾼 무명 탄생", symbol: "🧵" },
  },
];

export function generateStageQuiz(stageId: StageId, round: number, session = "historypang-v3"): Quiz {
  const seed = seedForQuiz(stageId, round, session);
  const rng = makePrng(seed);

  let templatePool: RawQuizTemplate[] = [];
  if (stageId === 1) templatePool = stage1Templates;
  else if (stageId === 2) templatePool = stage2Templates;
  else if (stageId === 3) templatePool = stage3Templates;
  else if (stageId === 4) templatePool = stage4Templates;
  else if (stageId === 5) templatePool = [...stage1Templates, ...stage2Templates, ...stage3Templates, ...stage4Templates];

  // 🏛️ 글로벌 No-Repeat 덱 시스템 연동: 비복원 추출로 덱이 소진될 때까지 중복 절대 없음!
  let template: RawQuizTemplate;
  if (stageId >= 1 && stageId <= 4) {
    const drawnIndex = getOrDrawTemplateIndex(stageId, round, session);
    template = templatePool[drawnIndex % templatePool.length];
  } else {
    // 5단계(종합 모드): 통합 셔플
    const shuffledPool = shuffle(makePrng(seedForQuiz(stageId, 999, session)), templatePool);
    template = shuffledPool[(round - 1) % shuffledPool.length];
  }

  const correctOptions = shuffle(rng, template.correctPool).slice(0, 3).map((item) => ({
    text: item.text,
    isCorrect: true,
    explanation: item.explanation,
    symbol: item.symbol,
  }));
  const wrongOptions = shuffle(rng, template.wrongPool).slice(0, 2).map((item) => ({
    text: item.text,
    isCorrect: false,
    explanation: item.explanation,
    misconception: item.misconception,
    symbol: item.symbol,
  }));

  const allRows = shuffle(rng, [...correctOptions, ...wrongOptions]);
  return finalize(stageId, round, template.prompt, template.difficulty, allRows, rng, template.referenceNote);
}

// 👹 보스전 단계별 퀴즈 생성기 (Phase 1, 2, 3 글로벌 No-Repeat 덱 연동)
export function generateBossQuiz(phase: BossPhase, round: number, session = "boss-historypang-v3"): Quiz {
  let simulatedStageId: StageId = 1;
  if (phase === 1) {
    // 1단계 보스: 1~2R 고려 건국·통일(1단계), 3R~ 고려 사회(2단계)
    simulatedStageId = round <= 2 ? 1 : 2;
  } else if (phase === 2) {
    // 2단계 보스: 주변 나라와의 관계(3단계) 100%
    simulatedStageId = 3;
  } else {
    // 3단계 보스: 고려의 문화와 생활(4단계) 100%
    simulatedStageId = 4;
  }

  return generateStageQuiz(simulatedStageId, round, session);
}
