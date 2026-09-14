import React, { useState } from 'react';
import { InfographicData, ToastState } from '../types';

interface SwitchToStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SwitchToStudentModal: React.FC<SwitchToStudentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-xs transition-all duration-200">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-outline-variant/30 animate-in fade-in zoom-in-95">
        <div className="flex items-start gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-error-container/40 flex items-center justify-center text-error shrink-0">
            <span className="material-symbols-outlined text-[24px]">lock_reset</span>
          </div>
          <div className="flex flex-col flex-1">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              강사 관리 세션 만료 및 모드 전환
            </h3>
            <span className="font-label-sm text-label-sm text-secondary">수강생 화면 이동 보안 안내</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-secondary hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2">
          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
            수강생 모드로 이동합니다. 보안을 위해 <strong>강사 관리 세션이 즉시 만료</strong>되며, 다시 돌아올 때는 <strong>마스터 비밀번호 재인증</strong>이 반드시 필요합니다.
          </p>
          <div className="flex items-center gap-1.5 text-error font-code-sm text-[11px] font-semibold bg-error-container/40 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            비밀번호를 모르면 어떤 경로로도 콘솔에 접근할 수 없습니다.
          </div>
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            onClick={onClose}
            className="px-space-md py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary/90 shadow-sm transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            세션 종료 및 수강생 모드 이동
          </button>
        </div>
      </div>
    </div>
  );
};

interface MasterPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  masterPassword: string;
}

export const MasterPasswordModal: React.FC<MasterPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  masterPassword,
}) => {
  const [inputPw, setInputPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPw.trim()) {
      setErrorMsg('마스터 비밀번호를 입력해주세요.');
      return;
    }
    if (inputPw.trim() !== masterPassword) {
      setErrorMsg('비밀번호가 일치하지 않습니다. 다시 확인하세요.');
      return;
    }
    setErrorMsg('');
    setInputPw('');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-outline-variant/30 animate-in fade-in zoom-in-95">
        <div className="flex items-start gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary shrink-0">
            <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
          </div>
          <div className="flex flex-col flex-1">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              강사 관리자 마스터 인증
            </h3>
            <span className="font-label-sm text-label-sm text-secondary">
              콘솔 복귀를 위한 2차 보안 확인 (기본값: KMY0412)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-secondary hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
              마스터 비밀번호
            </label>
            <div className="relative flex items-center">
              <input
                type={showPw ? 'text' : 'password'}
                value={inputPw}
                onChange={(e) => {
                  setInputPw(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="강사 마스터 비밀번호 입력"
                autoFocus
                className="w-full h-11 pl-3.5 pr-11 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-outline-variant/30 font-code-sm tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2.5 text-secondary hover:text-on-surface p-1 cursor-pointer"
                title={showPw ? '숨기기' : '보기'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPw ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            {errorMsg && (
              <p className="text-error font-body-sm text-[12px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errorMsg}
              </p>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-on-surface-variant font-body-sm text-[12px] leading-relaxed">
            관리자 콘솔은 보안 세션으로 보호되며 마스터 비밀번호 인증 후 제어 권한이 활성화됩니다.
          </div>

          <div className="flex items-center justify-end gap-space-sm pt-space-xs">
            <button
              onClick={onClose}
              type="button"
              className="px-space-md py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-primary font-label-md text-label-md font-semibold shadow-sm cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">security</span>
              인증 후 관리자 진입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface InfographicZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  infographic: InfographicData;
}

export const InfographicZoomModal: React.FC<InfographicZoomModalProps> = ({
  isOpen,
  onClose,
  infographic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/80 backdrop-blur-md p-space-md">
      <div className="w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-outline-variant/30 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-primary text-on-primary font-code-sm text-[12px] font-bold">
              HD PREVIEW
            </span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Python OpenPyXL &amp; LLM Automation Architecture (1920x1080)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-outline-variant/30 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest p-space-xl flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-primary text-on-primary font-code-sm text-label-sm font-bold shadow-xs">
                INFOGRAPHIC ARCHITECTURE
              </span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                Python OpenPyXL &amp; LLM Automation Architecture
              </span>
            </div>
            <span className="font-code-sm text-code-sm text-secondary bg-surface-container-lowest px-2.5 py-1 rounded-full border border-outline-variant/20">
              2026. 09. 16 5회차 연계
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md py-8">
            {infographic.steps.map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-surface-container-lowest p-5 border border-outline-variant/30 flex flex-col gap-3 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-code-sm text-label-sm font-bold ${s.colorClass}`}>
                    {s.step}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center">
                    <span className={`material-symbols-outlined text-[22px] ${s.colorClass}`}>
                      {s.icon}
                    </span>
                  </div>
                </div>
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {s.title}
                </span>
                <p className="font-body-md text-body-md text-secondary leading-relaxed">
                  {s.desc}
                </p>
                <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-1 font-code-sm text-[11px] text-tertiary">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  검증 완료 모듈
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
            <span className="font-code-sm text-code-sm text-secondary">
              AI Visual Model: DALL-E 3 &amp; SVG Synthesizer Engine
            </span>
            <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              수강생 복습 카드 연동 활성
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-space-lg py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary/90 cursor-pointer shadow-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

interface VodPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

export const VodPlayerModal: React.FC<VodPlayerModalProps> = ({ isOpen, onClose, fileName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/85 backdrop-blur-md p-space-md">
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/30 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-space-lg py-3 bg-inverse-surface text-inverse-on-surface">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary-fixed">play_circle</span>
            <span className="font-label-md text-label-md font-bold truncate max-w-lg">{fileName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-inverse-on-surface/80 hover:text-inverse-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Video simulation player */}
        <div className="relative aspect-video bg-black flex flex-col items-center justify-center group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

          {/* Interactive screen simulation */}
          <div className="text-center text-white/90 z-10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[36px] text-white pl-1">play_arrow</span>
            </div>
            <p className="font-headline-sm text-headline-sm font-bold">
              [5회차 녹화 실습] Python OpenPyXL &amp; LLM Excel 매크로 자동화
            </p>
            <span className="font-code-sm text-code-sm text-white/70">
              1080p FHD • 42:15 러닝타임 • 스마트오피스 교육 허브 스트리밍
            </span>
          </div>

          {/* Bottom player controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 z-20">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div className="h-full bg-primary rounded-full w-1/3"></div>
            </div>
            <div className="flex items-center justify-between text-white text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] cursor-pointer">pause</span>
                <span className="material-symbols-outlined text-[18px] cursor-pointer">volume_up</span>
                <span>14:05 / 42:15</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px]">1080p FHD</span>
                <span className="material-symbols-outlined text-[18px] cursor-pointer">fullscreen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-space-md flex items-center justify-between bg-surface-container-low">
          <span className="font-body-sm text-body-sm text-secondary">
            수강생 복습용 VOD 스트리밍 플레이어 (속도 조절 1.25x ~ 2.0x 지원)
          </span>
          <button
            onClick={onClose}
            className="px-space-md py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-surface-container cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToastProps {
  toast: ToastState;
}

export const ToastNotification: React.FC<ToastProps> = ({ toast }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none rounded-xl bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md shadow-2xl flex items-center gap-3 border border-outline-variant/20 ${
        toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <span className="material-symbols-outlined text-tertiary-fixed text-[24px]">
        {toast.icon}
      </span>
      <div className="flex flex-col">
        <span className="font-label-md text-label-md font-bold">{toast.title}</span>
        <span className="font-body-sm text-body-sm text-inverse-on-surface/80">{toast.message}</span>
      </div>
    </div>
  );
};
