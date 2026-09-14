import React, { useState, useRef } from 'react';
import {
  LectureSessionData,
  ClassFileItem,
  AiReviewData,
  InfographicData,
  ActionItem,
} from '../types';

interface InstructorConsoleProps {
  sessionData: LectureSessionData;
  onUpdateSessionData: (data: Partial<LectureSessionData>) => void;
  files: ClassFileItem[];
  onUpdateFiles: (files: ClassFileItem[]) => void;
  aiReview: AiReviewData;
  onUpdateAiReview: (review: Partial<AiReviewData>) => void;
  infographic: InfographicData;
  onUpdateInfographic: (info: Partial<InfographicData>) => void;
  accessCode: string;
  onUpdateAccessCode: (newCode: string) => void;
  masterPassword: string;
  onUpdateMasterPassword: (newPw: string) => void;
  onRequestStudentMode: () => void;
  onShowToast: (title: string, message: string, icon?: string) => void;
  onOpenZoomInfographic: () => void;
  onOpenVodPlayer: (fileName: string) => void;
}

export const InstructorConsole: React.FC<InstructorConsoleProps> = ({
  sessionData,
  onUpdateSessionData,
  files,
  onUpdateFiles,
  aiReview,
  onUpdateAiReview,
  infographic,
  onUpdateInfographic,
  accessCode,
  onUpdateAccessCode,
  masterPassword,
  onUpdateMasterPassword,
  onRequestStudentMode,
  onShowToast,
  onOpenZoomInfographic,
  onOpenVodPlayer,
}) => {
  // Local state for access code and visibility
  const [isCodeVisible, setIsCodeVisible] = useState(true);
  const [newCodeInput, setNewCodeInput] = useState('');

  // Local state for master password
  const [currentMasterPwInput, setCurrentMasterPwInput] = useState('');
  const [newMasterPwInput, setNewMasterPwInput] = useState('');

  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);

  // Infographic generation state
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleToggleCodeVisibility = () => {
    setIsCodeVisible(!isCodeVisible);
  };

  const handleCopyAccessCode = () => {
    navigator.clipboard.writeText(accessCode).then(() => {
      onShowToast(
        '입장 코드 복사 완료',
        `클립보드에 복사되었습니다: ${accessCode}`,
        'content_copy'
      );
    });
  };

  const handleUpdateCode = () => {
    const val = newCodeInput.trim().toUpperCase();
    if (val.length < 4) {
      onShowToast('입력 오류', '입장 코드는 최소 4자리 이상 입력해야 합니다.', 'error');
      return;
    }
    onUpdateAccessCode(val);
    setNewCodeInput('');
    onShowToast(
      '입장 코드 갱신 성공',
      `신규 코드 [${val}]로 접속 제어가 갱신되었습니다.`,
      'security'
    );
  };

  const handleSaveMasterPassword = () => {
    if (!currentMasterPwInput.trim()) {
      onShowToast('인증 오류', '현재 강사 마스터 비밀번호를 입력해주세요.', 'lock');
      return;
    }
    if (currentMasterPwInput.trim() !== masterPassword) {
      onShowToast('비밀번호 불일치', '현재 마스터 비밀번호가 올바르지 않습니다.', 'error');
      return;
    }
    if (newMasterPwInput.trim().length < 4) {
      onShowToast('입력 오류', '새 비밀번호는 최소 4자리 이상이어야 합니다.', 'warning');
      return;
    }
    onUpdateMasterPassword(newMasterPwInput.trim());
    setCurrentMasterPwInput('');
    setNewMasterPwInput('');
    onShowToast(
      '강사 마스터 비밀번호 변경 완료',
      '새 관리자 비밀번호가 즉시 시스템에 적용되었습니다.',
      'verified_user'
    );
  };

  const handleSaveReviewContent = () => {
    onShowToast(
      '복습 콘텐츠 동기화 완료',
      '수강생 [복습하러 가기] 대시보드에 즉시 갱신되었습니다.',
      'cloud_done'
    );
  };

  const handleFullSyncPublish = () => {
    onShowToast(
      '전체 동기화 발행 완료',
      '수강생 포털 전체에 수업 정보, 교안, AI 요약 및 시각자료가 일괄 배포되었습니다.',
      'published_with_changes'
    );
  };

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    onShowToast(
      'AI 멀티모달 분석 시작',
      '강의 교안 28개 슬라이드 및 엑셀 데이터셋 교차 분석을 진행합니다...',
      'auto_awesome'
    );

    setTimeout(() => {
      setIsAnalyzing(false);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      onUpdateAiReview({
        summary: `[AI 자동 추출 갱신 ${timeStr}]\n강의 교안 28개 슬라이드 및 실습 데이터셋 교차 분석 완료: 비정형 엑셀 데이터 정제 및 보고서 작성 자동화 실무 파이프라인. 기업 환경에 최적화된 GPT-4o 프롬프트 워크플로우와 로컬 파이썬 보안 가이드라인이 수강생 화면에 실시간 배포되었습니다.`,
        lastSyncedAt: `${sessionData.date} ${timeStr}`,
      });
      onShowToast(
        'AI 분석 완료! 수강생 화면에 실시간 동기화되었습니다',
        '수강생 모드 [복습하러 가기] AI 요약 리포트에 즉시 반영되었습니다.',
        'auto_awesome'
      );
    }, 1200);
  };

  const handlePublishAiSummary = () => {
    onUpdateAiReview({ isAttachedToStudent: true });
    onShowToast(
      '수강생 복습 화면 게시 완료',
      '수강생 모드의 복습 허브 [AI 요약 리포트] 영역에 즉시 발행 반영되었습니다.',
      'task_alt'
    );
  };

  const handleResetAiSummary = () => {
    onUpdateAiReview({
      summary:
        '본 5회차 교안(SmartOffice_Lecture05_HandsOn.pdf)은 기업 환경에서 빈번히 발생하는 비정형 엑셀 데이터의 정제 및 보고서 작성을 자동화하는 실무 파이프라인을 다룹니다. 특히 단순 함수를 넘어 프롬프트 엔지니어링을 통해 다중 컬럼 조건 분기와 피벗 생성을 단 한 번의 요청으로 완수하는 실습 워크플로우를 증명했습니다.',
    });
    onShowToast('요약 원본 복구', '기본 분석 데이터로 복구되었습니다.', 'history');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let type: 'vod' | 'pdf' | 'xlsx' | 'docx' = 'pdf';
      if (['mp4', 'mov', 'webm'].includes(ext)) type = 'vod';
      else if (['xlsx', 'xls', 'csv'].includes(ext)) type = 'xlsx';
      else if (['docx', 'doc'].includes(ext)) type = 'docx';

      const newFileItem: ClassFileItem = {
        id: `file-${Date.now()}`,
        name: file.name,
        type,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        detail: '신규 업로드됨 • 검증 대기',
        isPublic: true,
      };

      onUpdateFiles([newFileItem, ...files]);
      onShowToast(
        '파일 업로드 완료',
        `${file.name} 파일이 파이프라인에 등록되었습니다.`,
        'upload_file'
      );
    }
  };

  const handleToggleFilePublic = (id: string, isPublic: boolean) => {
    const updated = files.map((f) => (f.id === id ? { ...f, isPublic } : f));
    onUpdateFiles(updated);
    onShowToast(
      isPublic ? '수강생 공개 설정' : '비공개 설정',
      isPublic ? '수강생 복습 포털에 즉시 노출됩니다.' : '수강생에게 숨김 처리되었습니다.',
      isPublic ? 'visibility' : 'visibility_off'
    );
  };

  const handleDeleteFile = (id: string, name: string) => {
    const updated = files.filter((f) => f.id !== id);
    onUpdateFiles(updated);
    onShowToast('파일 삭제', `${name} 파일이 목록에서 제거되었습니다.`, 'delete');
  };

  const handleAddTag = () => {
    if (newTagInput.trim()) {
      const tag = newTagInput.startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
      if (!aiReview.tags.includes(tag)) {
        onUpdateAiReview({ tags: [...aiReview.tags, tag] });
      }
      setNewTagInput('');
      setShowAddTag(false);
    }
  };

  const handleActionItemChange = (index: number, newText: string) => {
    const items = [...aiReview.actionItems];
    items[index] = { ...items[index], text: newText };
    onUpdateAiReview({ actionItems: items });
  };

  const handleGenerateInfographic = () => {
    setIsGeneratingInfo(true);
    onShowToast(
      'AI 인포그래픽 고해상도 생성 중',
      '프롬프트와 아키텍처를 기반으로 1920x1080 다이어그램을 합성합니다...',
      'palette'
    );

    setTimeout(() => {
      setIsGeneratingInfo(false);
      onShowToast(
        '인포그래픽 생성 완료',
        '고해상도 시각자료 렌더링이 완료되어 프리뷰에 등록되었습니다.',
        'check_circle'
      );
    }, 1100);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low p-space-lg shadow-sm mb-space-lg border border-outline-variant/30">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container text-on-tertiary font-label-sm text-label-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
                강사 관리자 인증됨 (보안 세션 활성 / 이탈 시 즉시 잠금)
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-highest text-secondary font-code-sm text-code-sm">
                CONSOLE v2.4.9
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mt-1">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                강사 전용 관리 콘솔
              </h1>
              <span className="font-body-sm text-body-sm text-secondary font-medium">
                {sessionData.round} 실시간 세션 관제 &amp; AI 복습 파이프라인
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              실시간 입장 권한 토큰 제어, 수업 교안 클라우드 업로드 및 온디맨드 멀티모달 AI 요약 추출 엔진을 제어합니다.
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-space-sm">
                <button
                  id="btnSwitchToStudentMode"
                  onClick={onRequestStudentMode}
                  className="inline-flex items-center gap-2 px-space-md py-2 rounded-lg bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container transition-colors font-label-md text-label-md font-semibold cursor-pointer border border-outline-variant/30"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">school</span>
                  수강생 모드로 전환
                </button>
                <button
                  onClick={handleFullSyncPublish}
                  className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-primary text-on-primary shadow-sm hover:bg-primary/90 transition-all font-label-md text-label-md font-semibold cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">published_with_changes</span>
                  전체 동기화 발행
                </button>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-error-container/40 text-error font-code-sm text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">lock_reset</span>
                수강생 모드 전환 시 관리자 세션 즉시 만료 (복귀 시 마스터 비밀번호 필수)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left column (Access Code & LLM Status) & Right column (Review Content Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-lg">
        {/* Left Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Card 1: Access Code & Master Password Card */}
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden border border-outline-variant/30">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  수업 일자별 복습 콘텐츠 등록 &amp; 편집
                </h2>
                <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/30">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px]">calendar_month</span>
                    <input
                      id="lectureDateInputLeft"
                      type="date"
                      value={sessionData.date}
                      onChange={(e) => onUpdateSessionData({ date: e.target.value })}
                      className="bg-transparent font-code-sm text-code-sm font-medium text-on-surface focus:outline-none cursor-pointer"
                    />
                  </div>
                  <span className="text-outline font-code-sm">|</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[16px]">tag</span>
                    <input
                      id="lectureRoundInputLeft"
                      type="text"
                      placeholder="회차명 (예: 5회차)"
                      value={sessionData.round}
                      onChange={(e) => onUpdateSessionData({ round: e.target.value })}
                      className="w-20 bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/30 font-code-sm text-label-sm font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-label-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1 animate-pulse"></span>
                보안 활성
              </span>
            </div>

            {/* Access Code Section */}
            <div className="flex flex-col gap-space-sm pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">pin</span>
                  <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                    수강생 당일 수업 입장 코드
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-[11px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                    강사 인증 완료
                  </span>
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-label-sm text-[11px] font-semibold">
                    수강생 배포용
                  </span>
                </div>
              </div>

              {/* Master verification note */}
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-primary font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>강사 전용 입장 코드 열람 및 관리 권한 활성화됨</span>
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
                  강사는 마스터 비밀번호(<span className="font-mono font-bold text-primary">{masterPassword}</span>)로 인증 완료되어 당일 활성 입장 코드(기본값:{' '}
                  <span className="font-mono font-bold text-primary">{accessCode}</span>)를 직접 확인하고 수강생에게 즉시 복사/공유하거나 새 코드로 재설정할 수 있습니다.
                </p>
              </div>

              {/* Code Display Box */}
              <div className="rounded-lg bg-surface-container-low p-space-sm flex items-center justify-between border border-outline-variant/20 shadow-xs">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-label-sm text-secondary">현재 활성 입장 코드</span>
                    <span className="px-1.5 py-0.2 rounded bg-tertiary text-on-tertiary font-code-sm text-[10px] font-bold">
                      실시간 유효
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="font-code-sm text-[22px] font-bold tracking-widest text-primary font-mono select-all"
                      id="currentCodeDisplay"
                    >
                      {isCodeVisible ? accessCode : '••••••••'}
                    </span>
                    <span className="font-code-sm text-[11px] text-secondary font-medium">
                      (수강생용)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleToggleCodeVisibility}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-surface-container-lowest text-secondary hover:text-primary hover:bg-surface-container-highest border border-outline-variant/30 transition-all font-label-sm text-label-sm font-medium shadow-xs cursor-pointer"
                    id="toggleCodeBtn"
                    title="코드 숨기기/보기"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary" id="toggleCodeIcon">
                      {isCodeVisible ? 'visibility' : 'visibility_off'}
                    </span>
                    <span id="toggleCodeLabel">{isCodeVisible ? '숨기기' : '보기'}</span>
                  </button>
                  <button
                    onClick={handleCopyAccessCode}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-all font-label-sm text-label-sm font-semibold shadow-xs cursor-pointer"
                    id="copyCodeBtn"
                    title="코드 복사"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[17px]">content_copy</span>
                    <span>코드 복사</span>
                  </button>
                </div>
              </div>

              {/* Update code input */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    className="w-full h-9 px-3 uppercase tracking-wider font-code-sm text-code-sm rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 shadow-inner"
                    id="newAccessCodeInput"
                    maxLength={12}
                    placeholder="새 입장 코드 입력 (예: 12345, AI990)"
                    type="text"
                    value={newCodeInput}
                    onChange={(e) => setNewCodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateCode()}
                  />
                </div>
                <button
                  onClick={handleUpdateCode}
                  className="h-9 px-3.5 rounded-lg bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-semibold hover:bg-on-surface shadow-xs transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer"
                  id="updateCodeBtn"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  코드 갱신
                </button>
              </div>

              <div className="flex items-center justify-between text-secondary pt-0.5">
                <p className="font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[15px]">info</span>
                  수강생 실시간 세션 입장 시 본 코드를 입력하여 출석 인증합니다.
                </p>
                <span className="font-code-sm text-[11px] text-tertiary font-bold">기본: {accessCode}</span>
              </div>
            </div>

            {/* Master Password Setting Box */}
            <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col gap-space-sm border border-outline-variant/30 mt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">key</span>
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    강사 관리자 마스터 비밀번호
                  </span>
                </div>
                <span className="font-code-sm text-label-sm text-tertiary font-semibold" id="masterPwStatusBadge">
                  동기화 정상
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <p className="font-label-sm text-label-sm text-secondary leading-snug">
                  강사 전용 모드(관리자 콘솔) 진입에 사용되는 1차 마스터 인증키입니다. 분실하지 않도록 유의하세요.
                </p>
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-surface-container-lowest/95 border border-primary/20 text-on-surface font-label-sm text-[11px]">
                  <span className="material-symbols-outlined text-primary text-[15px]">security</span>
                  <span>
                    <strong>보안 통제:</strong> 수강생 모드로 전환 시 즉시 세션 파기되며, 마스터 비밀번호 없이는 어떤 경로로도 콘솔 진입이 불가합니다.
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="relative">
                  <input
                    className="w-full h-8 px-2.5 font-code-sm text-code-sm rounded-md bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 shadow-inner"
                    id="currentMasterPwInput"
                    placeholder="현재 마스터 비밀번호 입력"
                    type="password"
                    value={currentMasterPwInput}
                    onChange={(e) => setCurrentMasterPwInput(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    className="w-full h-8 px-2.5 font-code-sm text-code-sm rounded-md bg-surface-container-lowest text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 shadow-inner"
                    id="newMasterPwInput"
                    placeholder="새 마스터 비밀번호 (4자리 이상)"
                    type="password"
                    value={newMasterPwInput}
                    onChange={(e) => setNewMasterPwInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveMasterPassword()}
                  />
                  <button
                    onClick={handleSaveMasterPassword}
                    className="h-8 px-3 rounded-md bg-inverse-surface text-inverse-on-surface hover:bg-on-surface font-label-md text-label-md font-semibold transition-all whitespace-nowrap flex items-center gap-1 shadow-xs cursor-pointer"
                    id="saveMasterPwBtn"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    비밀번호 변경 저장
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-secondary border-t border-surface-container-high">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                현재 접속자: 34명 수강 중
              </span>
              <span className="font-code-sm text-code-sm">보안 상태: 정상</span>
            </div>
          </div>

          {/* Card 2: Cloud LLM Model Status Card */}
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    클라우드 LLM 모델 상태
                  </h3>
                  <p className="font-label-sm text-label-sm text-secondary">AI Pipeline Status</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">model_training</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    GPT-4o Vision &amp; Doc
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-tertiary font-semibold">
                  정상 (Latency 410ms)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">psychology</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Claude 3.5 Sonnet RAG
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-tertiary font-semibold">
                  대기중 (준비 완료)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">folder_zip</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    OCR 파서 스토리지
                  </span>
                </div>
                <span className="font-code-sm text-code-sm text-secondary">2.4 / 50 GB (4.8%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Lecture Content Editor */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-2 border-b border-surface-container-high">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  수업 일자별 복습 콘텐츠 등록 &amp; 편집
                </h2>
                <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/30">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px]">calendar_month</span>
                    <input
                      id="lectureDateInputRight"
                      type="date"
                      value={sessionData.date}
                      onChange={(e) => onUpdateSessionData({ date: e.target.value })}
                      className="bg-transparent font-code-sm text-code-sm font-medium text-on-surface focus:outline-none cursor-pointer"
                    />
                  </div>
                  <span className="text-outline font-code-sm">|</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[16px]">tag</span>
                    <input
                      id="lectureRoundInputRight"
                      type="text"
                      placeholder="회차명 (예: 5회차)"
                      value={sessionData.round}
                      onChange={(e) => onUpdateSessionData({ round: e.target.value })}
                      className="w-24 bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/30 font-code-sm text-label-sm font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveReviewContent}
                  className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary/90 shadow-sm transition-all cursor-pointer"
                  id="saveReviewContentBtn"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  복습 콘텐츠 저장
                </button>
              </div>
            </div>

            {/* Sync Notice banner */}
            <div className="rounded-lg bg-tertiary-container/10 p-space-sm flex items-center gap-2 border border-tertiary-container/20">
              <span className="material-symbols-outlined text-tertiary text-[18px]">bolt</span>
              <p className="font-label-sm text-label-sm text-tertiary font-medium">
                작성 및 저장된 내용은 수강생 모드의 <strong className="underline decoration-tertiary underline-offset-2">[복습하러 가기]</strong> 화면에 실시간 자동 반영됩니다.
              </p>
            </div>

            {/* Separated Date & Round Fields Bar */}
            <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[17px]">tune</span>
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    수업 일자 및 회차 정보 분리 지정
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-tertiary-container/15 text-tertiary font-label-sm text-[11px] font-semibold">
                    개별 필드 연동
                  </span>
                </div>
                <p className="font-label-sm text-label-sm text-secondary">
                  자동 결합 문자열 대신 강사가 지정한 날짜와 개별 회차명(예: 1회차, 5회차, 실무특강 등)을 독립 저장합니다.
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-[11px] text-secondary font-semibold uppercase">
                    수업 일자
                  </span>
                  <input
                    id="syncLectureDatePick"
                    type="date"
                    value={sessionData.date}
                    onChange={(e) => onUpdateSessionData({ date: e.target.value })}
                    className="h-8 px-2 rounded-md bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-code-sm text-code-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-[11px] text-secondary font-semibold uppercase">
                    회차 구분명
                  </span>
                  <input
                    id="syncLectureRoundText"
                    type="text"
                    value={sessionData.round}
                    onChange={(e) => onUpdateSessionData({ round: e.target.value })}
                    placeholder="예: 5회차"
                    className="w-28 h-8 px-2.5 rounded-md bg-surface-container-lowest border border-outline-variant/30 text-primary font-code-sm text-code-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Lecture Form Elements */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm font-semibold text-secondary uppercase">
                  강의 주제 (Lecture Title)
                </label>
                <input
                  className="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-headline-sm text-headline-sm font-bold placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 shadow-inner"
                  id="lectureTitleInput"
                  type="text"
                  value={sessionData.title}
                  onChange={(e) => onUpdateSessionData({ title: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm font-semibold text-secondary uppercase">
                    강사 주도 핵심 요약 (Key Summary Rich Editor)
                  </label>
                  <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-md border border-outline-variant/20">
                    <button
                      className="p-1 rounded text-secondary hover:bg-surface-container-highest hover:text-on-surface cursor-pointer"
                      title="굵게"
                      type="button"
                      onClick={() => onShowToast('서식 도구', '굵게 서식 태그가 적용되었습니다.', 'format_bold')}
                    >
                      <span className="material-symbols-outlined text-[16px]">format_bold</span>
                    </button>
                    <button
                      className="p-1 rounded text-secondary hover:bg-surface-container-highest hover:text-on-surface cursor-pointer"
                      title="글머리 기호"
                      type="button"
                      onClick={() => onShowToast('서식 도구', '글머리 기호 서식이 적용되었습니다.', 'format_list_bulleted')}
                    >
                      <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                    </button>
                    <button
                      className="p-1 rounded text-secondary hover:bg-surface-container-highest hover:text-on-surface cursor-pointer"
                      title="코드 인라인"
                      type="button"
                      onClick={() => onShowToast('서식 도구', '코드 서식이 적용되었습니다.', 'code')}
                    >
                      <span className="material-symbols-outlined text-[16px]">code</span>
                    </button>
                    <button
                      className="p-1 rounded text-secondary hover:bg-surface-container-highest hover:text-on-surface cursor-pointer"
                      title="중요 강조"
                      type="button"
                      onClick={() => onShowToast('서식 도구', '중요 강조 서식이 적용되었습니다.', 'priority_high')}
                    >
                      <span className="material-symbols-outlined text-[16px]">priority_high</span>
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full p-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md leading-relaxed placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 shadow-inner resize-y"
                  id="lectureSummaryInput"
                  rows={5}
                  value={sessionData.summary}
                  onChange={(e) => onUpdateSessionData({ summary: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 gap-space-sm pt-space-xs sm:grid-cols-2">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-secondary">실습 난이도 가이드</span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {sessionData.difficulty}
                  </span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-secondary">과제 제출 마감 일시</span>
                  <span className="font-label-md text-label-md font-semibold text-primary">
                    {sessionData.deadline}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Class File Upload & AI Analysis Engine (CORE ENGINE) */}
      <div className="w-full rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-lg mb-space-xl border border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                  수업 파일 업로드 &amp; AI 분석 요약기
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold">
                  CORE ENGINE
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary">
                강의 교안 문서를 임베딩하고 고밀도 실무 요약 및 액션 아이템을 실시간 자동 합성합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="group inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm font-bold shadow-md hover:bg-primary/95 hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
                id="runAiAnalysisBtn"
                type="button"
              >
                <span className={`material-symbols-outlined text-[22px] text-tertiary-fixed ${isAnalyzing ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>
                  bolt
                </span>
                <span>{isAnalyzing ? 'AI 심층 분석 실행 중...' : 'AI 파일 자동 분석 및 핵심 요약 실행'}</span>
                <span className="ml-1 px-2 py-0.5 rounded-full bg-surface-container-lowest/20 text-on-primary font-label-sm text-label-sm font-semibold">
                  자동 동기화
                </span>
              </button>
              <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[15px]">sync</span>
                수강생 복습 포털 동기화 연동됨 • 클릭 시 실시간 즉시 반영
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left subcolumn: Dropzone & File Library */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Drag and Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const file = e.dataTransfer.files[0];
                  const newFileItem: ClassFileItem = {
                    id: `file-${Date.now()}`,
                    name: file.name,
                    type: file.name.endsWith('.mp4') ? 'vod' : 'pdf',
                    size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
                    detail: '신규 업로드됨',
                    isPublic: true,
                  };
                  onUpdateFiles([newFileItem, ...files]);
                  onShowToast('파일 업로드 완료', `${file.name} 파일이 등록되었습니다.`, 'upload_file');
                }
              }}
              className="relative group cursor-pointer rounded-xl bg-surface-container-low hover:bg-surface-container transition-all p-space-lg flex flex-col items-center justify-center text-center gap-space-sm shadow-inner min-h-[190px] border border-dashed border-outline-variant/40"
              id="dropzone"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-highest group-hover:scale-110 transition-transform flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  강의 교안 문서 및 녹화 동영상(VOD) 업로드
                </span>
                <span className="font-body-sm text-body-sm text-secondary">
                  파일을 끌어다 놓거나 <span className="text-primary font-semibold underline">직접 찾아보기</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 font-label-sm text-label-sm text-outline">
                <span className="px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-code-sm">
                  문서: PDF, PPTX, XLSX, DOCX (100MB)
                </span>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-code-sm font-semibold">
                  동영상: MP4, MOV, WebM (최대 2GB)
                </span>
              </div>
              <input
                ref={fileInputRef}
                accept=".pdf,.pptx,.xlsx,.docx,.mp4,.mov,.webm"
                className="hidden"
                id="fileUploadInput"
                type="file"
                onChange={handleFileUpload}
              />
            </div>

            {/* File Library List */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">
                    등록된 교안 &amp; 동영상 라이브러리 ({files.length}건)
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-tertiary-container/15 text-tertiary font-code-sm text-[11px] font-semibold">
                    미디어 스트리밍 활성
                  </span>
                </div>
                <span className="font-code-sm text-code-sm text-secondary">총 520.6MB</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {files.map((file) => {
                  if (file.type === 'vod') {
                    return (
                      <div
                        key={file.id}
                        className="flex flex-col gap-2 p-space-sm rounded-lg bg-surface-container-low border border-primary/20 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-space-sm min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <span className="material-symbols-outlined text-[22px]">videocam</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                                  {file.name}
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-secondary font-code-sm text-[11px]">
                                  VOD
                                </span>
                              </div>
                              <span className="font-code-sm text-code-sm text-secondary">
                                {file.size} • {file.detail}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenVodPlayer(file.name)}
                              className="p-1 rounded text-secondary hover:text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
                              title="미리보기 재생"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">play_circle</span>
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file.id, file.name)}
                              className="p-1 rounded text-secondary hover:text-error hover:bg-surface-container-highest transition-colors cursor-pointer"
                              title="삭제"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest/80 px-2.5 py-1.5 rounded-md">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-tertiary text-[17px]">visibility</span>
                            <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                              수강생 모드 노출 허용
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-tertiary-container/15 text-tertiary font-code-sm text-[11px] font-bold">
                              {file.isPublic ? '수강생 복습 포털에 즉시 공개됨' : '비공개 숨김'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleFilePublic(file.id, true)}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                                file.isPublic
                                  ? 'bg-tertiary text-on-tertiary shadow-xs'
                                  : 'bg-surface-container-high text-secondary hover:text-on-surface'
                              }`}
                              type="button"
                            >
                              {file.isPublic && <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>}
                              공개 ON
                            </button>
                            <button
                              onClick={() => handleToggleFilePublic(file.id, false)}
                              className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                                !file.isPublic
                                  ? 'bg-inverse-surface text-inverse-on-surface shadow-xs font-semibold'
                                  : 'bg-surface-container-high text-secondary hover:text-on-surface'
                              }`}
                              type="button"
                            >
                              비공개 OFF
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const iconName = file.type === 'pdf' ? 'picture_as_pdf' : 'table_chart';
                  const iconColor =
                    file.type === 'pdf' ? 'text-error bg-error-container/40' : 'text-tertiary bg-tertiary-container/20';

                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low shadow-xs border border-outline-variant/20"
                    >
                      <div className="flex items-center gap-space-sm min-w-0">
                        <div className={`w-8 h-8 rounded ${iconColor} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined text-[20px]">{iconName}</span>
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
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleFilePublic(file.id, !file.isPublic)}
                            className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold cursor-pointer ${
                              file.isPublic
                                ? 'bg-tertiary-container/15 text-tertiary'
                                : 'bg-surface-container-high text-secondary'
                            }`}
                            type="button"
                          >
                            {file.isPublic ? '수강생 공개 ON' : '비공개 OFF'}
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            className="p-1 rounded text-secondary hover:text-error hover:bg-surface-container-highest cursor-pointer"
                            title="삭제"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Summary Extraction Parameters */}
            <div className="rounded-lg bg-surface-container-low p-space-md flex flex-col gap-2 border border-outline-variant/20">
              <span className="font-label-sm text-label-sm font-semibold text-secondary uppercase">
                AI 요약 추출 파라미터
              </span>
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface">분석 모드</span>
                  <select className="h-9 px-2 rounded bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none border border-outline-variant/30">
                    <option>실무 핵심 위주 요약 (Executive)</option>
                    <option>실습 코드 &amp; 프롬프트 발췌 모드</option>
                    <option>전체 교안 상세 텍스트 해설</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface">출력 대상</span>
                  <select className="h-9 px-2 rounded bg-surface-container-lowest font-body-sm text-body-sm text-on-surface focus:outline-none border border-outline-variant/30">
                    <option>수강생 복습 페이지 자동연동</option>
                    <option>강사용 비공개 강의노트</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right subcolumn: AI Analysis Results Preview & Edit */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[20px]">smart_toy</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  AI 자동 분석 결과 프리뷰 및 수정 박스
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-label-sm font-semibold"
                  id="aiStatusBadge"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  {isAnalyzing ? 'AI 분석 연산 중...' : '최신 분석 완료'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-container/10 text-primary font-code-sm text-code-sm font-semibold">
                  <span className="material-symbols-outlined text-[14px]">cloud_done</span>
                  수강생 복습 화면 실시간 연동 중
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-low p-space-lg flex flex-col gap-space-md shadow-inner border border-outline-variant/30">
              <div className="p-space-sm rounded-lg bg-surface-container-lowest border border-tertiary-container/20 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">published_with_changes</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium">
                    ⚡ 실행 시 수강생 복습 화면 하단 <strong className="text-primary font-bold">[AI 요약 리포트]</strong>에 실시간 즉시 반영됩니다.
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-tertiary-container/15 text-tertiary font-code-sm text-label-sm font-semibold">
                  실시간 동기화 ON
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-label-sm text-label-sm text-secondary font-semibold mr-1">
                  생성된 태그:
                </span>
                {aiReview.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest text-primary font-code-sm text-code-sm font-semibold shadow-xs border border-outline-variant/20"
                  >
                    {tag}
                  </span>
                ))}
                {showAddTag ? (
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="#태그입력"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      className="h-6 px-2 text-xs rounded bg-surface-container-lowest border border-primary font-code-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="text-xs bg-primary text-white px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      추가
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddTag(true)}
                    className="p-1 rounded text-secondary hover:text-primary font-label-sm text-label-sm flex items-center cursor-pointer"
                    title="태그 추가"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                )}
              </div>

              {/* 1. Executive Summary */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-semibold text-secondary uppercase">
                    1. 핵심 요약 브리핑 (Executive Summary)
                  </span>
                  <span className="font-code-sm text-code-sm text-secondary">수정 가능</span>
                </div>
                <textarea
                  className="w-full p-space-md rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md leading-relaxed placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs resize-y border border-outline-variant/20"
                  id="aiSummaryField"
                  rows={4}
                  value={aiReview.summary}
                  onChange={(e) => onUpdateAiReview({ summary: e.target.value })}
                />
              </div>

              {/* 2. Action Items */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-semibold text-secondary uppercase">
                    2. 수강생 필수 점검 액션 아이템 (Action Items)
                  </span>
                  <span className="font-code-sm text-code-sm text-secondary">수정 가능</span>
                </div>
                <div className="flex flex-col gap-2">
                  {aiReview.actionItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 p-2 rounded-lg bg-surface-container-lowest shadow-xs border border-outline-variant/20"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <input
                        className="flex-1 font-body-md text-body-md text-on-surface bg-transparent focus:outline-none"
                        type="text"
                        value={item.text}
                        onChange={(e) => handleActionItemChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Verification score */}
              <div className="p-space-sm rounded-lg bg-primary-container/10 flex items-center justify-between border border-primary-container/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    AI 검증 점수: {aiReview.confidenceScore}
                  </span>
                </div>
                <span className="font-code-sm text-code-sm text-secondary">
                  Token Usage: {aiReview.tokenUsage}
                </span>
              </div>

              <div className="pt-space-xs flex items-center justify-end gap-space-sm">
                <button
                  onClick={handleResetAiSummary}
                  className="px-space-md py-2 rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                  id="resetAiSummaryBtn"
                  type="button"
                >
                  초기값 복원
                </button>
                <button
                  onClick={handlePublishAiSummary}
                  className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-tertiary text-on-tertiary font-label-md text-label-md font-semibold hover:bg-tertiary/90 shadow-md transition-all cursor-pointer"
                  id="publishAiSummaryBtn"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  수강생 복습 화면에 AI 요약 게시하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 5: AI Visual Studio & Infographic Generator */}
      <div className="w-full rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-lg mb-space-xl border border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-2 border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary flex items-center justify-center text-on-tertiary shadow-sm">
              <span className="material-symbols-outlined text-[24px]">palette</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                  AI 인포그래픽 &amp; 시각자료 생성 스튜디오
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm font-semibold">
                  AI VISUAL STUDIO
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary">
                수업 핵심 개념, 파이썬 매크로 파이프라인 아키텍처 및 실습 플로우차트를 생성형 AI로 시각화하여 수강생 복습 카드에 즉시 첨부합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-secondary font-code-sm text-code-sm border border-outline-variant/20">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              DALL-E 3 &amp; SVG Synth 엔진 연동됨
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left subcol: Infographic Generation Parameters */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm font-semibold text-secondary uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[16px]">prompt_suggestion</span>
                시각자료 생성 프롬프트
              </label>
              <textarea
                className="w-full p-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm leading-relaxed placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 border border-outline-variant/20 shadow-inner resize-y"
                id="infographicPromptInput"
                rows={3}
                placeholder="생성할 시각자료의 주제와 핵심 키워드를 입력하세요."
                value={infographic.prompt}
                onChange={(e) => onUpdateInfographic({ prompt: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm font-semibold text-secondary uppercase">
                  생성 유형
                </label>
                <select
                  value={infographic.type}
                  onChange={(e) => onUpdateInfographic({ type: e.target.value })}
                  className="h-9 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                >
                  <option>인포그래픽 다이어그램</option>
                  <option>프로세스 플로우차트</option>
                  <option>실무 핵심 요약 카드 이미지</option>
                  <option>개념 비교 매트릭스</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm font-semibold text-secondary uppercase">
                  가로세로 비율
                </label>
                <select
                  value={infographic.aspectRatio}
                  onChange={(e) => onUpdateInfographic({ aspectRatio: e.target.value })}
                  className="h-9 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                >
                  <option>16:9 와이드 (수강생 권장)</option>
                  <option>4:3 프레젠테이션</option>
                  <option>1:1 정방형 썸네일</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  테마 스타일 템플릿
                </span>
                <span className="font-label-sm text-label-sm text-secondary">
                  {infographic.theme === 'blue'
                    ? '미니멀 테크 블루 & 다크 모던'
                    : infographic.theme === 'emerald'
                    ? '에메랄드 그린'
                    : '슬레이트 다크'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onUpdateInfographic({ theme: 'blue' })}
                  className={`w-6 h-6 rounded-full bg-primary cursor-pointer transition-all ${
                    infographic.theme === 'blue' ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title="스마트오피스 블루"
                  type="button"
                />
                <button
                  onClick={() => onUpdateInfographic({ theme: 'emerald' })}
                  className={`w-6 h-6 rounded-full bg-tertiary cursor-pointer transition-all ${
                    infographic.theme === 'emerald' ? 'ring-2 ring-tertiary ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title="에메랄드 그린"
                  type="button"
                />
                <button
                  onClick={() => onUpdateInfographic({ theme: 'slate' })}
                  className={`w-6 h-6 rounded-full bg-inverse-surface cursor-pointer transition-all ${
                    infographic.theme === 'slate' ? 'ring-2 ring-inverse-surface ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title="슬레이트 다크"
                  type="button"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateInfographic}
              disabled={isGeneratingInfo}
              className="group inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-75"
              id="generateInfographicBtn"
              type="button"
            >
              <span className={`material-symbols-outlined text-[20px] text-tertiary-fixed ${isGeneratingInfo ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>
                auto_awesome
              </span>
              <span>{isGeneratingInfo ? '고해상도 다이어그램 렌더링 중...' : 'AI 인포그래픽 고해상도 생성 실행'}</span>
            </button>
          </div>

          {/* Right subcol: Infographic Preview & Distribution */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">image</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  생성된 시각자료 프리뷰 &amp; 수강생 배포
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-tertiary-container/15 text-tertiary font-code-sm text-label-sm font-bold">
                렌더링 완료 (1920x1080 FHD)
              </span>
            </div>

            <div className="rounded-xl bg-surface-container-low p-space-md border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="relative rounded-lg overflow-hidden border border-outline-variant/30 bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-lowest p-space-md flex flex-col justify-between shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-code-sm text-[11px] font-bold">
                      INFOGRAPHIC
                    </span>
                    <span className="font-label-md text-label-md font-bold text-on-surface truncate max-w-sm">
                      Python OpenPyXL &amp; LLM Automation Architecture
                    </span>
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary">
                    {sessionData.date} {sessionData.round} 연계
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm py-4">
                  {infographic.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-surface-container-lowest p-3 border border-outline-variant/30 flex flex-col gap-1.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-code-sm text-[11px] font-bold ${step.colorClass}`}>
                          {step.step}
                        </span>
                        <span className={`material-symbols-outlined text-[18px] ${step.colorClass}`}>
                          {step.icon}
                        </span>
                      </div>
                      <span className="font-label-md text-label-md font-bold text-on-surface">
                        {step.title}
                      </span>
                      <p className="font-label-sm text-label-sm text-secondary leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                  <span className="font-code-sm text-code-sm text-secondary">
                    AI Visual Model: DALL-E 3 &amp; SVG Synthesizer
                  </span>
                  <button
                    onClick={onOpenZoomInfographic}
                    className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-semibold hover:underline cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                    원본 크게 보기
                  </button>
                </div>
              </div>

              {/* Student Sync Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest border border-tertiary-container/20 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">send_to_mobile</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-md text-label-md font-bold text-on-surface">
                        수강생 복습 화면 첨부 여부
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-tertiary-container/15 text-tertiary font-code-sm text-[11px] font-bold">
                        {infographic.isAttachedToStudent ? '동기화 연동 활성' : '숨김 상태'}
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary">
                      수강생 모드의 [복습하러 가기 &gt; 교안 시각자료] 섹션에 이 인포그래픽 카드가 표시됩니다.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      onUpdateInfographic({ isAttachedToStudent: true });
                      onShowToast('시각자료 첨부 완료', '수강생 복습 화면에 인포그래픽이 노출됩니다.', 'visibility');
                    }}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold transition-all cursor-pointer ${
                      infographic.isAttachedToStudent
                        ? 'bg-tertiary text-on-tertiary shadow-xs'
                        : 'bg-surface-container-high text-secondary hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    {infographic.isAttachedToStudent && <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>}
                    첨부 ON
                  </button>
                  <button
                    onClick={() => {
                      onUpdateInfographic({ isAttachedToStudent: false });
                      onShowToast('시각자료 첨부 해제', '수강생 복습 화면에서 인포그래픽이 숨김 처리되었습니다.', 'visibility_off');
                    }}
                    className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer ${
                      !infographic.isAttachedToStudent
                        ? 'bg-inverse-surface text-inverse-on-surface shadow-xs font-semibold'
                        : 'bg-surface-container-high text-secondary hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    첨부 OFF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
