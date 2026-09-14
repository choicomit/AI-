import React from 'react';
import {
  LectureSessionData,
  ClassFileItem,
  AiReviewData,
  InfographicData,
  CurriculumTab,
} from '../types';

interface StudentPortalProps {
  sessionData: LectureSessionData;
  files: ClassFileItem[];
  aiReview: AiReviewData;
  infographic: InfographicData;
  userName: string;
  onToggleActionItem: (id: string) => void;
  onOpenVodPlayer: (fileName: string) => void;
  onOpenZoomInfographic: () => void;
  onNavigateTab: (tab: CurriculumTab) => void;
  onRequestInstructorMode: () => void;
  onShowToast: (title: string, message: string, icon?: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  sessionData,
  files,
  aiReview,
  infographic,
  userName,
  onToggleActionItem,
  onOpenVodPlayer,
  onOpenZoomInfographic,
  onNavigateTab,
  onRequestInstructorMode,
  onShowToast,
}) => {
  const publicFiles = files.filter((f) => f.isPublic);
  const completedCount = aiReview.actionItems.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (aiReview.actionItems.length || 1)) * 100);

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Student Greeting & Live Sync Header */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary-container/10 via-surface-container to-surface-container-low p-space-lg shadow-sm border border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                수강생 복습 모드 (실시간 동기화 활성)
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-code-sm text-code-sm">
                출석 인증 완료
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mt-1">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                {userName}님의 {sessionData.round} 복습 허브
              </h1>
              <span className="font-body-sm text-body-sm text-secondary font-medium">
                {sessionData.date} 실습 자료 &amp; AI 리포트
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              강사님이 방금 갱신한 핵심 요약, 강의 교안, VOD 녹화 영상 및 온디맨드 AI 복습 브리핑을 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('ai-prompt-sandbox')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary shadow-xs hover:bg-surface-container transition-colors font-label-md text-label-md font-semibold cursor-pointer border border-outline-variant/30"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                AI 프롬프트 샌드박스
              </button>
              <button
                onClick={() => onNavigateTab('task-review-feedback')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary shadow-xs hover:bg-primary/90 transition-all font-label-md text-label-md font-semibold cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">upload</span>
                과제 제출하기
              </button>
            </div>
            <button
              onClick={onRequestInstructorMode}
              className="text-label-sm font-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
              강사 관리 모드로 전환 (마스터 비밀번호 필요)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left column (7 cols): Lecture Title, Summary, and Materials */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Lecture Summary Card */}
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-code-sm text-label-sm font-bold">
                  {sessionData.round}
                </span>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  수업 정보 &amp; 강사 주도 핵심 요약
                </h2>
              </div>
              <span className="font-code-sm text-code-sm text-secondary">
                {sessionData.displayDate || sessionData.date}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                강의 주제
              </span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                {sessionData.title}
              </h3>
            </div>

            <div className="flex flex-col gap-1.5 p-space-md rounded-lg bg-surface-container-low border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  강사 핵심 요약 브리핑
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sessionData.summary).then(() => {
                      onShowToast('요약 복사 완료', '클립보드에 복사되었습니다.', 'content_copy');
                    });
                  }}
                  className="p-1 rounded text-secondary hover:text-primary text-xs flex items-center gap-1 cursor-pointer"
                  title="요약 복사"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  복사
                </button>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                {sessionData.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-space-sm pt-1">
              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-secondary">실습 권장 난이도</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  {sessionData.difficulty}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-secondary">과제 제출 마감</span>
                <span className="font-label-md text-label-md font-bold text-primary">
                  {sessionData.deadline}
                </span>
              </div>
            </div>
          </div>

          {/* Class Files & VOD Library (Only Public Files) */}
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">download_for_offline</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  다운로드 가능 교안 및 녹화 동영상 ({publicFiles.length}건)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-tertiary-container/15 text-tertiary font-code-sm text-label-sm font-bold">
                강사 배포 완료
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {publicFiles.map((file) => {
                if (file.type === 'vod') {
                  return (
                    <div
                      key={file.id}
                      className="p-space-md rounded-xl bg-gradient-to-r from-primary/5 via-surface-container-low to-surface-container-low border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs shrink-0">
                          <span className="material-symbols-outlined text-[26px]">videocam</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                            {file.name}
                          </span>
                          <span className="font-code-sm text-code-sm text-secondary">
                            {file.size} • {file.detail}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenVodPlayer(file.name)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-xs hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">play_circle</span>
                        실습 VOD 바로 재생
                      </button>
                    </div>
                  );
                }

                const isPdf = file.type === 'pdf';
                return (
                  <div
                    key={file.id}
                    className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-between shadow-xs hover:bg-surface-container transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isPdf
                            ? 'bg-error-container/40 text-error'
                            : 'bg-tertiary-container/20 text-tertiary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          {isPdf ? 'picture_as_pdf' : 'table_chart'}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md font-semibold text-on-surface truncate">
                          {file.name}
                        </span>
                        <span className="font-code-sm text-code-sm text-secondary">
                          {file.size} • {file.detail}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        onShowToast(
                          '파일 다운로드 시작',
                          `${file.name} 다운로드가 준비되었습니다.`,
                          'download'
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-surface-container-lowest text-primary hover:bg-surface-container-highest border border-outline-variant/30 font-label-sm text-label-sm font-semibold shadow-xs cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      다운로드
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column (5 cols): AI Summary Report & Infographic */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* AI Extracted Summary Box */}
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[22px]">auto_awesome</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  AI 요약 리포트 &amp; 과제 액션 아이템
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-code-sm text-[11px] font-bold">
                실시간 연동
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              {aiReview.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-surface-container-low text-primary font-code-sm text-[11px] font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Executive Summary */}
            <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
              <span className="font-label-sm text-label-sm font-bold text-secondary uppercase">
                1. AI 핵심 요약 (Executive Summary)
              </span>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                {aiReview.summary}
              </p>
            </div>

            {/* Interactive Action Items Checklist */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm font-bold text-secondary uppercase">
                  2. 수강생 필수 점검 체크리스트 ({completedCount}/{aiReview.actionItems.length})
                </span>
                <span className="font-code-sm text-code-sm text-tertiary font-bold">
                  {progressPercent}% 완료
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-tertiary transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                {aiReview.actionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleActionItem(item.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                      item.completed
                        ? 'bg-tertiary-container/10 border-tertiary-container/30 text-secondary line-through'
                        : 'bg-surface-container-low border-outline-variant/20 text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${
                        item.completed ? 'text-tertiary' : 'text-outline'
                      }`}
                    >
                      {item.completed ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <span className="font-body-sm text-body-sm leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-primary-container/10 border border-primary-container/20 flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface">
                AI 신뢰도: {aiReview.confidenceScore}
              </span>
              <span className="font-code-sm text-[11px] text-secondary">
                {aiReview.lastSyncedAt ? `마지막 동기화: ${aiReview.lastSyncedAt}` : '실시간 반영'}
              </span>
            </div>
          </div>

          {/* AI Infographic Card (if attached by instructor) */}
          {infographic.isAttachedToStudent && (
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">image</span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    교안 시각자료 &amp; 인포그래픽
                  </h3>
                </div>
                <button
                  onClick={onOpenZoomInfographic}
                  className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-semibold hover:underline cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                  크게 보기
                </button>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest p-4 border border-outline-variant/30 flex flex-col gap-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-code-sm text-[10px] font-bold">
                    INFOGRAPHIC
                  </span>
                  <span className="font-code-sm text-[11px] text-secondary">
                    {sessionData.round} 매크로 자동화 아키텍처
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {infographic.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-md bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-code-sm text-xs font-bold ${step.colorClass}`}>
                          {step.step}
                        </span>
                        <span className="font-label-sm text-label-sm font-bold text-on-surface">
                          {step.title}
                        </span>
                      </div>
                      <span className="font-code-sm text-[11px] text-secondary truncate max-w-[150px]">
                        {step.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
