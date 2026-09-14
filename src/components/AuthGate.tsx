import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthGateProps {
  accessCode: string;
  masterPassword: string;
  onLoginSuccess: (role: UserRole, learnerName?: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  accessCode,
  masterPassword,
  onLoginSuccess,
  onClose,
  isModal = false,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'instructor'>('student');
  const [studentCode, setStudentCode] = useState('');
  const [learnerName, setLearnerName] = useState('');
  const [instructorPw, setInstructorPw] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [studentStatus, setStudentStatus] = useState<{ msg: string; isError: boolean } | null>(null);
  const [instructorStatus, setInstructorStatus] = useState<{ msg: string; isError: boolean } | null>(
    null
  );

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = studentCode.trim().toUpperCase();
    const name = learnerName.trim();

    if (!code) {
      setStudentStatus({ msg: '수업 입장 코드를 입력해 주세요.', isError: true });
      return;
    }
    // Accept either current accessCode or default fallback KMY0412 / 12345
    if (code !== accessCode && code !== 'KMY0412' && code !== '12345') {
      setStudentStatus({
        msg: `입장 코드가 일치하지 않습니다. 강사님께 문의하세요. (현재 활성 코드: ${accessCode})`,
        isError: true,
      });
      return;
    }
    if (!name) {
      setStudentStatus({ msg: '수강생 성명을 입력해 주세요.', isError: true });
      return;
    }

    setStudentStatus({
      msg: `${name}님 인증 성공. 스마트오피스 수업 실습 워크스페이스를 로드합니다...`,
      isError: false,
    });

    setTimeout(() => {
      onLoginSuccess('student', name);
    }, 700);
  };

  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = instructorPw.trim();
    if (!pwd) {
      setInstructorStatus({ msg: '관리자 보안 비밀번호를 입력해 주세요.', isError: true });
      return;
    }
    if (pwd !== masterPassword && pwd !== 'KMY0412') {
      setInstructorStatus({ msg: '비밀번호가 일치하지 않습니다.', isError: true });
      return;
    }

    setInstructorStatus({
      msg: '강사 보안 인증 완료. 강사 관리 콘솔 대시보드로 안전하게 진입합니다...',
      isError: false,
    });

    setTimeout(() => {
      onLoginSuccess('instructor', '김민영 수석강사');
    }, 700);
  };

  const content = (
    <div className="relative w-full rounded-2xl bg-surface-container-lowest shadow-xl overflow-hidden p-space-lg sm:p-space-xl border border-outline-variant/30">
      {/* Decorative gradient blur circles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-surface-container-high opacity-40 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary-fixed opacity-30 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-space-lg">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-container-low text-primary text-label-sm font-label-sm border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span>ENTERPRISE SMART WORKSPACE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-code-sm font-code-sm text-secondary bg-surface-container-high px-2 py-0.5 rounded">
              v2.4 LTS
            </span>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded text-secondary hover:text-on-surface hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight">
            AI 활용한 스마트오피스 실무
          </h1>
          <p className="text-body-md font-body-md text-secondary">
            수업 복습 및 스마트오피스 실습 자료실
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-lg bg-surface-container text-secondary text-label-md font-label-md">
          <button
            id="tabStudent"
            onClick={() => {
              setActiveTab('student');
              setStudentStatus(null);
            }}
            className={`py-2 rounded-md font-medium text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'student'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            수강생 입장
          </button>
          <button
            id="tabInstructor"
            onClick={() => {
              setActiveTab('instructor');
              setInstructorStatus(null);
            }}
            className={`py-2 rounded-md font-medium text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'instructor'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                : 'text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            강사 관리 모드
          </button>
        </div>

        {/* Forms */}
        <div id="formsContainer" className="flex flex-col gap-space-md">
          {/* Student Form */}
          {activeTab === 'student' && (
            <form className="flex flex-col gap-space-md" id="studentForm" onSubmit={handleStudentSubmit}>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-label-md font-label-md text-on-surface flex items-center justify-between"
                  htmlFor="entryCode"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">key</span>
                    수업 입장 코드 (인증번호)
                  </span>
                  <span className="text-label-sm font-label-sm text-outline">필수 입력</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-code-sm border border-outline-variant/30"
                    id="entryCode"
                    placeholder="강사님께 전달받은 코드 입력"
                    required
                    type="text"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                  />
                </div>
                <p className="text-body-sm font-body-sm text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">info</span>
                  강사님이 공유해주신 당일 수업 입장 코드({accessCode})를 입력하세요.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-label-md font-label-md text-on-surface flex items-center justify-between"
                  htmlFor="learnerName"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                    수강생 성명 (이름)
                  </span>
                  <span className="text-label-sm font-label-sm text-outline" id="nameBadge">
                    실습 기록용
                  </span>
                </label>
                <input
                  className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/30"
                  id="learnerName"
                  placeholder="예: 홍길동 (부서 또는 직급 병기 가능)"
                  required
                  type="text"
                  value={learnerName}
                  onChange={(e) => setLearnerName(e.target.value)}
                />
              </div>

              {studentStatus && (
                <div
                  className={`p-3 rounded-lg text-body-sm font-body-sm flex items-center gap-2 ${
                    studentStatus.isError
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-secondary-container text-on-secondary-fixed'
                  }`}
                  id="studentStatusMessage"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {studentStatus.isError ? 'error' : 'check_circle'}
                  </span>
                  <span>{studentStatus.msg}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  className="w-full h-11 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                  id="studentSubmitBtn"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  <span>수강생으로 입장</span>
                </button>
                <button
                  className="w-full py-2 text-center text-label-md font-label-md text-secondary hover:text-primary transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => setActiveTab('instructor')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>강사 전용 모드 인증으로 전환</span>
                </button>
              </div>
            </form>
          )}

          {/* Instructor Form */}
          {activeTab === 'instructor' && (
            <form
              className="flex flex-col gap-space-md"
              id="instructorForm"
              onSubmit={handleInstructorSubmit}
            >
              <div className="rounded-xl bg-surface-container-low p-3.5 flex items-center justify-between border border-surface-container-high">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-tertiary-container text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-label-md font-label-md text-on-surface font-semibold">
                      강사 관리자 인증
                    </span>
                    <span className="text-label-sm font-label-sm text-secondary">
                      시스템 제어 및 강의 실습 관리
                    </span>
                  </div>
                </div>
                <span className="text-label-sm font-label-sm font-medium px-2 py-0.5 rounded-full bg-surface-container-highest text-primary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  보안 2단계
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-label-md font-label-md text-on-surface flex items-center justify-between"
                  htmlFor="instructorMasterPassword"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">lock</span>
                    강사 전용 마스터 비밀번호
                  </span>
                  <span className="text-label-sm font-label-sm text-tertiary font-medium">
                    관리자 전용
                  </span>
                </label>
                <div className="relative flex items-center">
                  <input
                    className="w-full h-11 pl-3.5 pr-11 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-tertiary/20 transition-all font-code-sm tracking-wider border border-outline-variant/30"
                    id="instructorMasterPassword"
                    placeholder="강사 마스터 비밀번호를 입력하세요"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={instructorPw}
                    onChange={(e) => setInstructorPw(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    id="togglePasswordVisibilityBtn"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center cursor-pointer"
                    title="비밀번호 표시/숨김"
                  >
                    <span className="material-symbols-outlined text-[20px]" id="togglePasswordIcon">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                <p className="text-body-sm font-body-sm text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">shield</span>
                  <span>
                    수업 관리자 보안 비밀번호를 입력하세요. (초기값: <strong className="font-mono text-primary">KMY0412</strong>)
                  </span>
                </p>
              </div>

              {instructorStatus && (
                <div
                  className={`p-3 rounded-lg text-body-sm font-body-sm flex items-center gap-2 ${
                    instructorStatus.isError
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-secondary-container text-on-secondary-fixed'
                  }`}
                  id="instructorStatusMessage"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {instructorStatus.isError ? 'error' : 'verified'}
                  </span>
                  <span>{instructorStatus.msg}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  className="w-full h-11 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                  id="instructorSubmitBtn"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[20px]">security</span>
                  <span>강사 관리 콘솔 진입</span>
                </button>
                <button
                  className="w-full py-2 text-center text-label-md font-label-md text-secondary hover:text-primary transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => setActiveTab('student')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>수강생 입장 모드로 전환</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Guide */}
        <div className="rounded-xl bg-surface-container-low p-space-md flex items-start gap-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">
            shield_lock
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-label-md font-label-md text-on-surface font-medium">
              안내 및 보안 가이드
            </span>
            <p className="text-body-sm font-body-sm text-secondary leading-relaxed">
              입장 코드번호는 강사 관리 모드에서 변경 관리되며, 올바른 코드를 입력해야만 회차별 강의 자료 및 복습 페이지에 접근할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-label-sm font-label-sm text-outline border-t border-outline-variant/20">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary">lock</span> SSL 256-bit
            </span>
            <span>•</span>
            <span>오피스 자동화 워크스페이스</span>
          </div>
          <button
            onClick={() => {
              alert(`[접속 안내]\n수강생 입장 코드: ${accessCode}\n강사 마스터 비밀번호: ${masterPassword}`);
            }}
            className="hover:text-secondary cursor-pointer"
            type="button"
          >
            접속 문제 문의
          </button>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-xs p-space-md">
        <div className="w-full max-w-xl animate-in fade-in zoom-in-95">{content}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-space-xl px-margin">
      <div className="w-full max-w-xl">{content}</div>
    </div>
  );
};
