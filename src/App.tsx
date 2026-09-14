/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  CurriculumTab,
  LectureSessionData,
  ClassFileItem,
  AiReviewData,
  InfographicData,
  ToastState,
} from './types';
import {
  INITIAL_SESSION_DATA,
  INITIAL_FILES,
  INITIAL_AI_REVIEW,
  INITIAL_INFOGRAPHIC,
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InstructorConsole } from './components/InstructorConsole';
import { StudentPortal } from './components/StudentPortal';
import { AuthGate } from './components/AuthGate';
import { OtherCurriculumViews } from './components/OtherCurriculumViews';
import {
  SwitchToStudentModal,
  MasterPasswordModal,
  InfographicZoomModal,
  VodPlayerModal,
  ToastNotification,
} from './components/Modals';

const STORAGE_KEY_SESSION = 'smartoffice_lecture_date_data';
const STORAGE_KEY_FILES = 'smartoffice_class_files';
const STORAGE_KEY_AI_REVIEW = 'smartoffice_ai_review_data';
const STORAGE_KEY_INFOGRAPHIC = 'smartoffice_infographic_data';
const STORAGE_KEY_ACCESS_CODE = 'student_daily_access_code';
const STORAGE_KEY_MASTER_PW = 'instructor_master_pw';

export default function App() {
  // Authentication & Role
  const [currentRole, setCurrentRole] = useState<UserRole>('instructor');
  const [currentTab, setCurrentTab] = useState<CurriculumTab>('instructor-management-console');
  const [userName, setUserName] = useState<string>('홍길동 수강생');
  const [userCohort, setUserCohort] = useState<string>('DX 실무 3기');

  // Master credentials
  const [accessCode, setAccessCode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ACCESS_CODE) || '12345';
  });
  const [masterPassword, setMasterPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_MASTER_PW) || 'KMY0412';
  });

  // Session & Educational content
  const [sessionData, setSessionData] = useState<LectureSessionData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSION);
      return saved ? JSON.parse(saved) : INITIAL_SESSION_DATA;
    } catch {
      return INITIAL_SESSION_DATA;
    }
  });

  const [files, setFiles] = useState<ClassFileItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILES);
      return saved ? JSON.parse(saved) : INITIAL_FILES;
    } catch {
      return INITIAL_FILES;
    }
  });

  const [aiReview, setAiReview] = useState<AiReviewData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AI_REVIEW);
      return saved ? JSON.parse(saved) : INITIAL_AI_REVIEW;
    } catch {
      return INITIAL_AI_REVIEW;
    }
  });

  const [infographic, setInfographic] = useState<InfographicData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INFOGRAPHIC);
      return saved ? JSON.parse(saved) : INITIAL_INFOGRAPHIC;
    } catch {
      return INITIAL_INFOGRAPHIC;
    }
  });

  // Modals & UI States
  const [isSwitchToStudentOpen, setIsSwitchToStudentOpen] = useState(false);
  const [isMasterPwModalOpen, setIsMasterPwModalOpen] = useState(false);
  const [isZoomInfographicOpen, setIsZoomInfographicOpen] = useState(false);
  const [isVodPlayerOpen, setIsVodPlayerOpen] = useState(false);
  const [vodFileName, setVodFileName] = useState('');
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<ToastState>({
    show: false,
    title: '',
    message: '',
    icon: 'check_circle',
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACCESS_CODE, accessCode);
  }, [accessCode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MASTER_PW, masterPassword);
  }, [masterPassword]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
  }, [sessionData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AI_REVIEW, JSON.stringify(aiReview));
  }, [aiReview]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INFOGRAPHIC, JSON.stringify(infographic));
  }, [infographic]);

  // Toast helper
  const showToast = (title: string, message: string, icon = 'check_circle') => {
    setToast({
      show: true,
      title,
      message,
      icon,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  // Switch to student mode handler
  const handleRequestStudentMode = () => {
    if (currentRole === 'instructor') {
      setIsSwitchToStudentOpen(true);
    } else {
      setCurrentRole('student');
      setCurrentTab('instructor-management-console');
    }
  };

  const handleConfirmSwitchToStudent = () => {
    setIsSwitchToStudentOpen(false);
    setCurrentRole('student');
    showToast('수강생 모드 전환 완료', '관리자 세션이 만료되었으며 수강생 복습 허브로 전환되었습니다.', 'school');
  };

  // Switch to instructor mode handler
  const handleRequestInstructorMode = () => {
    if (currentRole === 'instructor') {
      setCurrentTab('instructor-management-console');
      showToast('강사 관리 모드', '현재 강사 관리자 모드가 활성화되어 있습니다.', 'verified_user');
    } else {
      setIsMasterPwModalOpen(true);
    }
  };

  const handleMasterPwSuccess = () => {
    setIsMasterPwModalOpen(false);
    setCurrentRole('instructor');
    setCurrentTab('instructor-management-console');
    showToast('강사 관리자 세션 활성화', '마스터 인증 완료! 콘솔 제어 권한이 활성화되었습니다.', 'security');
  };

  // Student toggle checklist action item
  const handleToggleActionItem = (id: string) => {
    const updated = aiReview.actionItems.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setAiReview((prev) => ({ ...prev, actionItems: updated }));
    const target = updated.find((i) => i.id === id);
    if (target?.completed) {
      showToast('점검 완료', '실습 액션 아이템을 완료 처리했습니다.', 'check_circle');
    }
  };

  // Sessions navigation (< and >)
  const handlePrevSession = () => {
    showToast('이전 차시 조회', '4회차 [데이터 분석 입문: 엑셀 함수를 대체하는 LLM] 자료를 로드합니다.', 'chevron_left');
  };

  const handleNextSession = () => {
    showToast('다음 차시 조회', '6회차 [대시보드 시각화 & DALL-E 프레젠테이션] 예정 세션입니다.', 'chevron_right');
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-body-md text-on-surface antialiased">
      {/* Fixed Top Header */}
      <Header
        currentRole={currentRole}
        userName={currentRole === 'instructor' ? '김민영 강사' : userName}
        userCohort={userCohort}
        sessionDateDisplay={sessionData.displayDate || '2026. 09. 16 (수)'}
        sessionRound={sessionData.round}
        onPrevSession={handlePrevSession}
        onNextSession={handleNextSession}
        onRequestStudentMode={handleRequestStudentMode}
        onRequestInstructorMode={handleRequestInstructorMode}
        onLogout={() => setIsAuthGateOpen(true)}
      />

      {/* Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        userRole={currentRole}
      />

      {/* Main Content Area */}
      <div className="pl-64">
        <main className="w-full pt-16 min-h-screen bg-background px-margin py-space-lg">
          {currentTab === 'instructor-management-console' ? (
            currentRole === 'instructor' ? (
              <InstructorConsole
                sessionData={sessionData}
                onUpdateSessionData={(data) => setSessionData((prev) => ({ ...prev, ...data }))}
                files={files}
                onUpdateFiles={setFiles}
                aiReview={aiReview}
                onUpdateAiReview={(rev) => setAiReview((prev) => ({ ...prev, ...rev }))}
                infographic={infographic}
                onUpdateInfographic={(info) => setInfographic((prev) => ({ ...prev, ...info }))}
                accessCode={accessCode}
                onUpdateAccessCode={setAccessCode}
                masterPassword={masterPassword}
                onUpdateMasterPassword={setMasterPassword}
                onRequestStudentMode={handleRequestStudentMode}
                onShowToast={showToast}
                onOpenZoomInfographic={() => setIsZoomInfographicOpen(true)}
                onOpenVodPlayer={(fileName) => {
                  setVodFileName(fileName);
                  setIsVodPlayerOpen(true);
                }}
              />
            ) : (
              <StudentPortal
                sessionData={sessionData}
                files={files}
                aiReview={aiReview}
                infographic={infographic}
                userName={userName}
                onToggleActionItem={handleToggleActionItem}
                onOpenVodPlayer={(fileName) => {
                  setVodFileName(fileName);
                  setIsVodPlayerOpen(true);
                }}
                onOpenZoomInfographic={() => setIsZoomInfographicOpen(true)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onRequestInstructorMode={handleRequestInstructorMode}
                onShowToast={showToast}
              />
            )
          ) : (
            <OtherCurriculumViews
              currentTab={currentTab}
              sessionData={sessionData}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <SwitchToStudentModal
        isOpen={isSwitchToStudentOpen}
        onClose={() => setIsSwitchToStudentOpen(false)}
        onConfirm={handleConfirmSwitchToStudent}
      />

      <MasterPasswordModal
        isOpen={isMasterPwModalOpen}
        onClose={() => setIsMasterPwModalOpen(false)}
        onSuccess={handleMasterPwSuccess}
        masterPassword={masterPassword}
      />

      <InfographicZoomModal
        isOpen={isZoomInfographicOpen}
        onClose={() => setIsZoomInfographicOpen(false)}
        infographic={infographic}
      />

      <VodPlayerModal
        isOpen={isVodPlayerOpen}
        onClose={() => setIsVodPlayerOpen(false)}
        fileName={vodFileName}
      />

      {/* Auth Gate Modal (can also be invoked via top-right logout button) */}
      {isAuthGateOpen && (
        <AuthGate
          accessCode={accessCode}
          masterPassword={masterPassword}
          onLoginSuccess={(role, name) => {
            setCurrentRole(role);
            if (name) setUserName(name);
            setIsAuthGateOpen(false);
            showToast(
              '인증 완료',
              role === 'instructor'
                ? '강사 관리자 권한으로 로그인되었습니다.'
                : `${name}님 수강생으로 로그인되었습니다.`,
              'login'
            );
          }}
          onClose={() => setIsAuthGateOpen(false)}
          isModal={true}
        />
      )}

      {/* Global Toast Notification */}
      <ToastNotification toast={toast} />
    </div>
  );
}
