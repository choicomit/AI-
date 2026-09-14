import React from 'react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  userName: string;
  userCohort: string;
  sessionDateDisplay: string;
  sessionRound: string;
  onPrevSession: () => void;
  onNextSession: () => void;
  onRequestStudentMode: () => void;
  onRequestInstructorMode: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  userName,
  userCohort,
  sessionDateDisplay,
  sessionRound,
  onPrevSession,
  onNextSession,
  onRequestStudentMode,
  onRequestInstructorMode,
  onLogout,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/60">
      <div className="h-16 w-full px-margin flex items-center justify-between gap-space-md">
        {/* Brand */}
        <div className="flex items-center gap-space-md min-w-[320px]">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-[0_2px_6px_rgba(0,74,198,0.25)]">
              <span className="material-symbols-outlined text-on-primary text-[20px]">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
                AI 활용한 스마트오피스 실무
              </span>
              <span className="font-code-sm text-code-sm text-secondary">
                Smart Office AI Practical Training
              </span>
            </div>
          </div>
          <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
            스마트 교육 허브
          </span>
        </div>

        {/* Date / Round Selector */}
        <div className="flex items-center bg-surface-container-low rounded-lg px-space-xs py-1 border border-outline-variant/30 shadow-xs">
          <button
            aria-label="이전 차시"
            onClick={onPrevSession}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <div className="flex items-center gap-space-xs px-space-sm cursor-pointer hover:bg-surface-container-high/60 rounded py-1 transition-colors">
            <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
            <span className="font-body-sm text-body-sm font-semibold text-on-surface tracking-tight" id="headerSessionDateText">
              {sessionDateDisplay}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-code-sm text-label-sm font-bold ml-1" id="headerSessionRoundBadge">
              {sessionRound}
            </span>
            <span className="material-symbols-outlined text-secondary text-[16px]">expand_more</span>
          </div>
          <button
            aria-label="다음 차시"
            onClick={onNextSession}
            className="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* Mode Switcher & User Profile */}
        <div className="flex items-center gap-space-md min-w-[340px] justify-end">
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
            <button
              id="headerStudentModeBtn"
              onClick={onRequestStudentMode}
              className={`px-space-md py-1.5 rounded-md font-label-md text-label-md transition-all flex items-center gap-1 cursor-pointer ${
                currentRole === 'student'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">school</span>
              수강생 모드
            </button>
            <button
              id="headerInstructorModeBtn"
              onClick={onRequestInstructorMode}
              className={`px-space-md py-1.5 rounded-md font-label-md text-label-md transition-all flex items-center gap-1 cursor-pointer ${
                currentRole === 'instructor'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              type="button"
            >
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              강사 전용 모드 (관리자)
            </button>
          </div>

          <div className="flex items-center gap-space-sm pl-space-xs">
            <div className="flex flex-col text-right">
              <span className="font-label-md text-label-md font-semibold text-on-surface leading-tight">
                {userName}
              </span>
              <span className="font-label-sm text-label-sm text-tertiary font-medium">
                {userCohort}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_2px_4px_rgba(0,74,198,0.2)]">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <button
              onClick={onLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-error transition-colors cursor-pointer"
              title="종료 / 모드 변경 및 로그아웃"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
