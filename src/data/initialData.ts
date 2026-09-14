import { LectureSessionData, ClassFileItem, AiReviewData, InfographicData } from '../types';

export const INITIAL_SESSION_DATA: LectureSessionData = {
  date: '2026-09-16',
  round: '5회차',
  displayDate: '2026. 09. 16 (수)',
  title: '생성형 AI를 접목한 고급 엑셀 매크로 자동화 및 대량 보고서 작성 실무',
  summary: `1. VBA 매크로 없이 파이썬 OpenPyXL과 LLM 프롬프트 결합으로 엑셀 자동 서식 구축
2. 반복성 월간 ERP 마감 데이터 정제: GPT-4o 멀티턴 프롬프트를 통한 12분 내 이상치 판별 및 시각화 파이프라인
3. 기업 보안 가이드라인 준수: 민감 개인정보(PII) 로컬 마스킹 처리 후 LLM 질의 프로토콜 준수 사항 점검`,
  difficulty: '중급 (Level 3/5)',
  deadline: '2026. 09. 18 (금) 23:59',
};

export const INITIAL_FILES: ClassFileItem[] = [
  {
    id: 'f-1',
    name: 'Lecture05_Python_Excel_HandsOn_Full.mp4',
    type: 'vod',
    size: '482.0MB',
    detail: '42분 러닝타임 • 1080p FHD',
    isPublic: true,
  },
  {
    id: 'f-2',
    name: 'SmartOffice_Lecture05_HandsOn.pdf',
    type: 'pdf',
    size: '24.8MB',
    detail: '분석 완료 • 28 슬라이드',
    isPublic: true,
  },
  {
    id: 'f-3',
    name: 'Dataset_Sales_Sep2026_Exercise.xlsx',
    type: 'xlsx',
    size: '13.8MB',
    detail: '시트 4개 • 18,400 행',
    isPublic: true,
  },
];

export const INITIAL_AI_REVIEW: AiReviewData = {
  tags: ['#SmartOffice_AI', '#ExcelAutomation', '#OpenPyXL', '#LLM_Security'],
  summary:
    '본 5회차 교안(SmartOffice_Lecture05_HandsOn.pdf)은 기업 환경에서 빈번히 발생하는 비정형 엑셀 데이터의 정제 및 보고서 작성을 자동화하는 실무 파이프라인을 다룹니다. 특히 단순 함수를 넘어 프롬프트 엔지니어링을 통해 다중 컬럼 조건 분기와 피벗 생성을 단 한 번의 요청으로 완수하는 실습 워크플로우를 증명했습니다.',
  actionItems: [
    {
      id: 'a-1',
      text: '실습 엑셀 파일(Dataset_Sales) 내 결측치 처리 프롬프트 실행 후 피벗 테이블 3종 생성',
      completed: false,
    },
    {
      id: 'a-2',
      text: '기업 내부망 사용을 가정한 사내 프롬프트 템플릿(보안 마스킹 규정 포함) 작성 후 샌드박스 검증',
      completed: false,
    },
    {
      id: 'a-3',
      text: '5회차 과제 제출함에 자동화 스크립트 실행 스크린샷 및 엑셀 결과본 .zip 압축 등록',
      completed: false,
    },
  ],
  confidenceScore: '신뢰도 98.4% (할루시네이션 위험 낮음)',
  tokenUsage: '3,420',
  isAttachedToStudent: true,
  lastSyncedAt: '2026-09-16 10:30',
};

export const INITIAL_INFOGRAPHIC: InfographicData = {
  prompt:
    '엑셀 파이썬 OpenPyXL 자동화 3단계 아키텍처: 1) 데이터 수집, 2) LLM 정제 및 이상치 탐지, 3) 피벗 리포트 시각화 및 자동 메일 발송 프로세스 인포그래픽',
  type: '인포그래픽 다이어그램',
  aspectRatio: '16:9 와이드 (수강생 권장)',
  theme: 'blue',
  isAttachedToStudent: true,
  steps: [
    {
      step: 'STEP 01',
      title: '비정형 엑셀 수집',
      desc: 'ERP 원천 결측치 자동 로드 및 로컬 마스킹 처리',
      icon: 'table_view',
      colorClass: 'text-primary',
    },
    {
      step: 'STEP 02',
      title: 'LLM 다중 분기 정제',
      desc: '멀티턴 프롬프트로 이상치 정제 및 피벗 산출 로직',
      icon: 'psychology',
      colorClass: 'text-tertiary',
    },
    {
      step: 'STEP 03',
      title: '자동화 보고서 생성',
      desc: 'OpenPyXL 차트 삽입 및 담당자 자동 발송 파이프라인',
      icon: 'insights',
      colorClass: 'text-primary-container',
    },
  ],
};
