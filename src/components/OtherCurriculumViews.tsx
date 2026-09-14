import React, { useState } from 'react';
import { CurriculumTab, LectureSessionData } from '../types';

interface OtherViewsProps {
  currentTab: CurriculumTab;
  sessionData: LectureSessionData;
  onNavigateTab: (tab: CurriculumTab) => void;
  onShowToast: (title: string, message: string, icon?: string) => void;
}

export const OtherCurriculumViews: React.FC<OtherViewsProps> = ({
  currentTab,
  sessionData,
  onNavigateTab,
  onShowToast,
}) => {
  // Sandbox state
  const [sandboxPrompt, setSandboxPrompt] = useState(
    'Excel 파일에서 "총 매출액"이 1억 원 이상인 행만 필터링하여 새로운 시트 "VIP_고객"에 저장하고 셀 서식을 파란색으로 채워주는 OpenPyXL 파이썬 코드를 작성해 줘.'
  );
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const [isExecutingPrompt, setIsExecutingPrompt] = useState(false);

  // Homework state
  const [homeworkFile, setHomeworkFile] = useState<string | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<{
    score: number;
    feedback: string;
    items: { label: string; passed: boolean }[];
  } | null>(null);

  const handleRunSandbox = () => {
    setIsExecutingPrompt(true);
    onShowToast('프롬프트 실행 중', 'OpenPyXL 가상 인터프리터에서 코드를 검증합니다...', 'play_arrow');
    setTimeout(() => {
      setIsExecutingPrompt(false);
      setSandboxOutput(`import openpyxl
from openpyxl.styles import PatternFill, Font

# 1. 엑셀 워크북 로드
wb = openpyxl.load_workbook('Dataset_Sales_Sep2026.xlsx')
ws = wb.active

# 2. VIP 시트 생성
vip_ws = wb.create_sheet(title='VIP_고객')
headers = [cell.value for cell in ws[1]]
vip_ws.append(headers)

# 3. 파란색 강조 서식 설정
blue_fill = PatternFill(start_color="DCE9FF", end_color="DCE9FF", fill_type="solid")
bold_font = Font(name="Pretendard", bold=True, color="004AC6")

# 4. 매출 1억 원 이상 필터링 및 서식 적용
count = 0
for row in ws.iter_rows(min_row=2, values_only=False):
    sales_val = row[4].value  # 5번째 컬럼(매출액)
    if sales_val and sales_val >= 100000000:
        row_vals = [c.value for c in row]
        vip_ws.append(row_vals)
        count += 1
        for cell in vip_ws[vip_ws.max_row]:
            cell.fill = blue_fill
            cell.font = bold_font

wb.save('Output_VIP_Filtered.xlsx')
print(f"총 {count}건의 VIP 고객 데이터 필터링 완료!")`);
      onShowToast('스크립트 실행 완료', '18,400건의 행 중 142건의 VIP 레코드가 추출되었습니다.', 'check_circle');
    }, 900);
  };

  const handleGradeHomework = () => {
    if (!homeworkFile) {
      onShowToast('파일 미등록', '먼저 과제 파일(.zip 또는 .xlsx)을 첨부해주세요.', 'error');
      return;
    }
    setIsGrading(true);
    onShowToast('AI 피드백 채점 시작', 'GPT-4o 루브릭 평가 엔진이 코드를 검증합니다...', 'auto_awesome');
    setTimeout(() => {
      setIsGrading(false);
      setGradingResult({
        score: 96,
        feedback:
          'OpenPyXL을 활용한 비정형 데이터 정제 로직이 매우 우수합니다. 특히 결측치(NaN)를 사전에 로컬 마스킹 처리하여 기업 보안 규정을 철저히 준수한 점이 돋보입니다. 차트 스타일링 시 폰트 컬러 대비만 보완하면 즉시 사내 실무 배포 가능한 수준입니다.',
        items: [
          { label: 'ERP 원천 데이터 파싱 및 결측치 예외 처리', passed: true },
          { label: 'OpenPyXL 기반 다중 피벗 테이블 자동 생성', passed: true },
          { label: '민감 정보(PII) 로컬 마스킹 보안 준수', passed: true },
          { label: '보고서 차트 색상 대비율 가이드라인 적용', passed: false },
        ],
      });
      onShowToast('AI 채점 완료', '과제 평가 점수 96점 / 피드백이 생성되었습니다.', 'verified');
    }, 1100);
  };

  // 1. Dashboard Overview
  if (currentTab === 'dashboard-overview') {
    return (
      <div className="flex flex-col gap-space-lg w-full">
        {/* Welcome */}
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <span className="font-code-sm text-xs text-primary font-bold">CURRICULUM PROGRESS</span>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              AI 활용한 스마트오피스 실무 교육 현황
            </h1>
            <p className="font-body-md text-secondary">
              전체 8회차 과정 중 <strong className="text-primary font-bold">5회차(진행 중)</strong> 세션에 참여하고 있습니다.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('instructor-management-console')}
            className="px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-label-md font-semibold hover:bg-primary/90 shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            복습 콘솔로 이동
          </button>
        </div>

        {/* 8-Session Roadmap Grid */}
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              회차별 로드맵 및 진도 현황
            </h2>
            <span className="font-code-sm text-code-sm text-tertiary font-bold">진도율 62.5%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {[
              { round: '1회차', title: '생성형 AI 기초 및 오피스 프롬프트 엔지니어링', status: 'completed', date: '09/02' },
              { round: '2회차', title: '비즈니스 문서 작성 & 이메일 자동 요약 실무', status: 'completed', date: '09/05' },
              { round: '3회차', title: '기획서 & 제안서 시장조사 멀티모달 리서치', status: 'completed', date: '09/09' },
              { round: '4회차', title: '데이터 분석 입문: 엑셀 함수를 대체하는 LLM', status: 'completed', date: '09/12' },
              { round: '5회차', title: 'OpenPyXL 파이썬 매크로 자동화 & 보고서 작성', status: 'active', date: '09/16' },
              { round: '6회차', title: '대시보드 시각화 & DALL-E/SVG 프레젠테이션', status: 'upcoming', date: '09/19' },
              { round: '7회차', title: '업무 파이프라인 연동: Slack & 메일 자동 발송', status: 'upcoming', date: '09/23' },
              { round: '8회차', title: '최종 프로젝트 발표 및 사내 AI 보안 가이드', status: 'upcoming', date: '09/26' },
            ].map((s, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (s.round === '5회차') onNavigateTab('instructor-management-console');
                }}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                  s.status === 'active'
                    ? 'bg-primary/5 border-primary shadow-md ring-2 ring-primary/20'
                    : s.status === 'completed'
                    ? 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                    : 'bg-surface-container-lowest/50 border-outline-variant/20 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded font-code-sm text-[11px] font-bold ${
                      s.status === 'active'
                        ? 'bg-primary text-on-primary'
                        : s.status === 'completed'
                        ? 'bg-tertiary-container/15 text-tertiary'
                        : 'bg-surface-container-high text-secondary'
                    }`}
                  >
                    {s.round}
                  </span>
                  <span className="font-code-sm text-xs text-secondary">{s.date}</span>
                </div>
                <h4 className="font-label-md font-bold text-on-surface line-clamp-2">{s.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                  <span className="text-secondary">
                    {s.status === 'active' ? '현재 실습 진행 중' : s.status === 'completed' ? '학습 완료' : '예정'}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Live Class Workspace
  if (currentTab === 'live-class-workspace') {
    return (
      <div className="flex flex-col gap-space-lg w-full">
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-error animate-pulse"></span>
              <h1 className="font-headline-md font-bold text-on-surface">
                실시간 실습 강의실 (Live Classroom)
              </h1>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-code-sm text-xs font-bold">
                5회차 LIVE
              </span>
            </div>
            <span className="font-code-sm text-xs text-secondary">접속 수강생: 34명</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
            {/* Live Screen */}
            <div className="lg:col-span-8 flex flex-col gap-2">
              <div className="relative aspect-video rounded-xl bg-black overflow-hidden flex items-center justify-center shadow-md">
                <div className="text-center text-white p-6 flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-primary-fixed">co_present</span>
                  <span className="font-headline-sm font-bold">강사 화면 실시간 공유 중</span>
                  <p className="font-body-sm text-white/70 max-w-md">
                    [5회차 실습] OpenPyXL 기반 대용량 결측치 로컬 마스킹 &amp; GPT-4o 프롬프트 파이프라인
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded bg-error text-white font-code-sm text-[11px] font-bold">
                      ON-AIR
                    </span>
                    <span className="font-code-sm text-xs text-white/80">1080p FHD 60FPS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <div className="lg:col-span-4 rounded-xl bg-surface-container-low p-4 border border-outline-variant/30 flex flex-col justify-between h-[380px]">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <span className="font-label-sm font-bold text-secondary uppercase">실시간 질의응답 (Q&amp;A)</span>
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto py-2 text-xs">
                <div className="p-2 rounded bg-surface-container-lowest shadow-xs">
                  <span className="font-bold text-primary">이영희 연구원:</span>
                  <p className="text-on-surface">openpyxl iter_rows 쓸 때 min_row 지정 안 하면 어떻게 되나요?</p>
                </div>
                <div className="p-2 rounded bg-primary/5 border border-primary/20 shadow-xs">
                  <span className="font-bold text-tertiary">김민영 강사 (답변):</span>
                  <p className="text-on-surface">1행 헤더까지 값으로 순회하게 되므로 필터링 시 데이터 타입 에러가 날 수 있습니다!</p>
                </div>
                <div className="p-2 rounded bg-surface-container-lowest shadow-xs">
                  <span className="font-bold text-primary">박지성 대리:</span>
                  <p className="text-on-surface">교안 14페이지 프롬프트 템플릿 복사해서 실행해보니 3초만에 됩니다 대박이네요</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-outline-variant/20">
                <input
                  type="text"
                  placeholder="강사님께 실시간 질문 입력..."
                  className="flex-1 h-9 px-3 rounded-lg bg-surface-container-lowest text-xs focus:outline-none border border-outline-variant/30"
                />
                <button
                  onClick={() => onShowToast('채팅 전송', '강의실 채팅에 질문이 등록되었습니다.', 'chat')}
                  className="h-9 px-3 rounded-lg bg-primary text-white text-xs font-bold cursor-pointer"
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. AI Prompt Sandbox
  if (currentTab === 'ai-prompt-sandbox') {
    return (
      <div className="flex flex-col gap-space-lg w-full">
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">smart_toy</span>
              <h1 className="font-headline-md font-bold text-on-surface">
                스마트오피스 AI 샌드박스 (Excel &amp; LLM)
              </h1>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-code-sm text-xs font-bold">
              GPT-4o Vision Engine 활성
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            <div className="lg:col-span-6 flex flex-col gap-space-sm">
              <label className="font-label-sm font-bold text-secondary uppercase">
                업무 자동화 프롬프트 입력창
              </label>
              <textarea
                rows={6}
                value={sandboxPrompt}
                onChange={(e) => setSandboxPrompt(e.target.value)}
                className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="자동화하고자 하는 엑셀 작업이나 사내 업무 시나리오를 자유롭게 입력하세요..."
              />
              <button
                onClick={handleRunSandbox}
                disabled={isExecutingPrompt}
                className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-on-primary font-label-md font-bold shadow-sm hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-75"
              >
                <span className={`material-symbols-outlined text-[18px] ${isExecutingPrompt ? 'animate-spin' : ''}`}>
                  auto_awesome
                </span>
                <span>{isExecutingPrompt ? '파이썬 스크립트 합성 및 검증 중...' : '프롬프트 실행 및 파이썬 코드 생성'}</span>
              </button>
            </div>

            <div className="lg:col-span-6 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <label className="font-label-sm font-bold text-secondary uppercase">
                  실행 결과 및 자동화 파이썬 스크립트
                </label>
                {sandboxOutput && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sandboxOutput).then(() => {
                        onShowToast('코드 복사 완료', '클립보드에 코드가 복사되었습니다.', 'content_copy');
                      });
                    }}
                    className="text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    코드 복사
                  </button>
                )}
              </div>
              <pre className="w-full p-4 rounded-lg bg-[#1e293b] text-[#38bdf8] font-mono text-xs overflow-x-auto min-h-[170px] max-h-[320px] shadow-inner leading-relaxed">
                {sandboxOutput || '# 좌측에서 프롬프트를 실행하면 여기에 OpenPyXL 실행 스크립트가 렌더링됩니다.'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Task Review & AI Feedback
  if (currentTab === 'task-review-feedback') {
    return (
      <div className="flex flex-col gap-space-lg w-full">
        <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">assignment_turned_in</span>
              <h1 className="font-headline-md font-bold text-on-surface">
                과제 제출 및 온디맨드 AI 피드백
              </h1>
            </div>
            <span className="font-label-sm text-primary font-bold">마감: {sessionData.deadline}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            <div className="lg:col-span-5 flex flex-col gap-space-sm">
              <div className="p-space-lg rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-2 min-h-[180px]">
                <span className="material-symbols-outlined text-4xl text-primary">upload_file</span>
                <span className="font-headline-sm font-bold text-on-surface">5회차 실습 결과물 등록</span>
                <span className="font-body-sm text-secondary">
                  자동화 스크립트 실행 스크린샷 및 .xlsx 파일 압축(.zip)
                </span>
                <button
                  onClick={() => {
                    setHomeworkFile('DX3_홍길동_5회차_엑셀자동화과제.zip');
                    onShowToast('과제 파일 첨부', 'DX3_홍길동_5회차_엑셀자동화과제.zip 파일이 첨부되었습니다.', 'attach_file');
                  }}
                  className="mt-2 px-4 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-bold text-primary hover:bg-surface-container cursor-pointer shadow-xs"
                >
                  {homeworkFile ? `첨부됨: ${homeworkFile}` : '파일 선택 또는 드래그앤드롭'}
                </button>
              </div>

              <button
                onClick={handleGradeHomework}
                disabled={isGrading}
                className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-label-md font-bold shadow-sm hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-75"
              >
                {isGrading ? 'AI 채점 엔진 분석 중...' : '과제 제출 및 실시간 AI 채점 받기'}
              </button>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-space-sm">
              <span className="font-label-sm font-bold text-secondary uppercase">
                AI 루브릭 채점 리포트
              </span>
              {gradingResult ? (
                <div className="p-space-md rounded-xl bg-surface-container-low border border-tertiary-container/30 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                    <span className="font-headline-sm font-bold text-on-surface">종합 평가 결과</span>
                    <span className="px-3 py-1 rounded-full bg-tertiary text-white font-bold font-code-sm text-sm">
                      {gradingResult.score}점 (우수 A+)
                    </span>
                  </div>
                  <p className="font-body-sm text-on-surface leading-relaxed">
                    {gradingResult.feedback}
                  </p>
                  <div className="flex flex-col gap-1.5 pt-1">
                    {gradingResult.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-1.5 rounded bg-surface-container-lowest">
                        <span className="text-on-surface">{item.label}</span>
                        <span className={`font-bold ${item.passed ? 'text-tertiary' : 'text-error'}`}>
                          {item.passed ? '통과 (Pass)' : '보완 권장'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center justify-center text-center text-secondary">
                  <span className="material-symbols-outlined text-4xl mb-2 text-outline">fact_check</span>
                  <span>과제 파일을 첨부하고 채점 받기를 클릭하면 즉시 AI 피드백이 생성됩니다.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Class Resources Archive
  return (
    <div className="flex flex-col gap-space-lg w-full">
      <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">folder_copy</span>
            <h1 className="font-headline-md font-bold text-on-surface">
              강의 교안 &amp; 프롬프트 아카이브
            </h1>
          </div>
          <span className="font-code-sm text-xs text-secondary">총 18개 자료 보관 중</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {[
            { title: 'Excel OpenPyXL 매크로 실무 템플릿', type: '.py', count: '12개 스크립트' },
            { title: '사내 보안 가이드라인 PII 마스킹 정규식', type: '.regex', count: '6개 규칙' },
            { title: 'ERP 마감 데이터 검증용 프롬프트 번들', type: '.prompt', count: '15개 프롬프트' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-primary-container text-white font-code-sm text-xs font-bold">
                  {item.type}
                </span>
                <span className="font-code-sm text-xs text-secondary">{item.count}</span>
              </div>
              <h3 className="font-label-md font-bold text-on-surface">{item.title}</h3>
              <button
                onClick={() => onShowToast('자료 다운로드', `${item.title} 다운로드가 완료되었습니다.`, 'download')}
                className="w-full py-1.5 rounded bg-surface-container-lowest border border-outline-variant/30 text-xs font-bold text-primary hover:bg-surface-container cursor-pointer"
              >
                전체 다운로드
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
