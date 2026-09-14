import React from 'react';
import { CurriculumTab, UserRole } from '../types';

interface SidebarProps {
  currentTab: CurriculumTab;
  onSelectTab: (tab: CurriculumTab) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, userRole }) => {
  const navItems: { id: CurriculumTab; label: string; icon: string; instructorOnly?: boolean }[] = [
    { id: 'dashboard-overview', label: '대시보드 홈', icon: 'space_dashboard' },
    { id: 'live-class-workspace', label: '실시간 강의 실습실', icon: 'co_present' },
    { id: 'ai-prompt-sandbox', label: '스마트오피스 AI 샌드박스', icon: 'smart_toy' },
    { id: 'task-review-feedback', label: '과제 제출 및 AI 피드백', icon: 'assignment_turned_in' },
    { id: 'class-resources-archive', label: '강의 교안 & 프롬프트 아카이브', icon: 'folder_copy' },
    {
      id: 'instructor-management-console',
      label: userRole === 'instructor' ? '수강생 학습현황 관리' : '수강생 복습 & 현황',
      icon: 'manage_accounts',
    },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest z-40 flex flex-col justify-between py-space-lg border-r border-surface-container-high/60 shadow-xs">
      <div className="flex flex-col gap-space-lg px-space-md">
        <div className="px-space-sm">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
            CURRICULUM NAVIGATION
          </p>
        </div>
        <nav className="flex flex-col gap-space-xs">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all text-left w-full cursor-pointer ${
                  isActive
                    ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm font-semibold text-secondary">AI 실습 크레딧</span>
            <span className="font-code-sm text-code-sm text-tertiary font-semibold">78% 사용 가능</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-3/4"></div>
          </div>
          <p className="font-label-sm text-label-sm text-secondary mt-1">
            GPT-4o &amp; Claude 3.5 Sonnet 연동 완료
          </p>
        </div>
      </div>
    </aside>
  );
};
