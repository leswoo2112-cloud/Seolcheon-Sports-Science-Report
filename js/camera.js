"use strict";

/* =========================================================
   설천고 스포츠과학 분석센터 PRO
   iPad / Safari 카메라 제어
========================================================= */

let cameraStream = null;
let cameraFacingMode = "environment";

let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;

let cameraVideo = null;
let poseCanvas = null;

let startCameraButton = null;
let stopCameraButton = null;
let switchCameraButton = null;
let captureButton = null;
let recordButton = null;
let analysisSport = null;
let analysisDirection = null;

/* =========================================================
   종목 목록
========================================================= */

const SUMMER_SPORTS = [
    "육상",
    "수영",
    "축구",
    "농구",
    "배구",
    "야구",
    "소프트볼",
    "테니스",
    "탁구",
    "배드민턴",
    "골프",
    "럭비",
    "핸드볼",
    "하키",
    "사격",
    "양궁",
    "체조",
    "태권도",
    "유도",
    "레슬링",
    "복싱",
    "펜싱",
    "사이클",
    "조정",
    "카누",
    "트라이애슬론",
    "역도",
    "스포츠클라이밍",
    "스케이트보드",
    "서핑",
    "근대5종",
    "승마",
    "다이빙",
    "아티스틱스위밍",
    "수구"
];

const WINTER_SPORTS = [
    "바이애슬론",
    "크로스컨트리",
    "알파인스키",
    "스키점프",
    "노르딕복합",
    "프리스타일스키",
    "스노보드",
    "스피드스케이팅",
    "쇼트트랙",
    "피겨스케이팅",
    "아이스하키",
    "컬링",
    "봅슬레이",
    "스켈레톤",
    "루지"
];

const WEIGHT_EXERCISES = [
    "스쿼트",
    "프론트 스쿼트",
    "불가리안 스플릿 스쿼트",
    "런지",
    "레그프레스",
    "레그 익스텐션",
    "레그 컬",
    "힙 스러스트",
    "데드리프트",
    "루마니안 데드리프트",
    "클린",
    "파워클린",
    "스내치",
    "벤치프레스",
    "인클라인 벤치프레스",
    "숄더프레스",
    "풀업",
    "랫풀다운",
    "바벨로우",
    "푸시업",
    "딥스",
    "플랭크"
];

const PE_ENTRANCE_SPORTS = [
    "제자리멀리뛰기",
    "서전트 점프",
    "10m 왕복달리기",
    "20m 왕복달리기",
    "50m 달리기",
    "100m 달리기",
    "메디신볼 던지기",
    "핸드볼 던지기",
    "배근력",
    "악력",
    "좌전굴",
    "윗몸일으키기",
    "턱걸이",
    "오래달리기",
    "높이뛰기"
];

/* =========================================================
   초기화
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeCameraElements();
    initializeCameraButtons();
    populateSportOptions();
    hideOldSportMenus();
    createCameraStatus();
    createCapturePreview();
});

function initializeCameraElements() {
    cameraVideo =
        document.getElementById("cameraVideo") ||
        document.getElementById("camera");

    poseCanvas =
        document.getElementById("poseCanvas");

    startCameraButton =
        document.getElementById("startCameraButton");

    stopCameraButton =
        document.getElementById("stopCameraButton");

    switchCameraButton =
        document.getElementById("switchCameraButton");

    captureButton =
        document.getElementById("captureButton") ||
        document.getElementById("capturePhotoButton");

    recordButton =
        document.getElementById("recordButton");

    analysisSport =
        document.getElementById("analysisSport") ||
        document.getElementById("sportSelect");

    analysisDirection =
        document.getElementById("analysisDirection") ||
        document.getElementById("poseViewMode");
}

function initializeCameraButtons() {
    startCameraButton?.addEventListener(
        "click",
        startCamera
    );

    stopCameraButton?.addEventListener(
        "click",
        stopCamera
    );

    switchCameraButton?.addEventListener(
        "click",
        switchCamera
    );

    captureButton?.addEventListener(
        "click",
        capturePhoto
    );

    recordButton?.addEventListener(
        "click",
        toggleRecording
    );

    window.addEventListener(
        "resize",
        syncCameraCanvas
    );

    window.addEventListener(
        "beforeunload",
        stopCamera
    );

    document.addEventListener(
        "visibilitychange",
        function () {
            if (
                document.visibilityState === "hidden" &&
                isRecording
            ) {
                stopRecording();
            }
        }
    );
}

/* =========================================================
   카메라 지원 확인
========================================================= */

function checkCameraSupport() {
    if (!window.isSecureContext) {
        showCameraMessage(
            "카메라는 HTTPS 주소에서만 사용할 수 있습니다.",
            "error"
        );

        return false;
    }

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {
        showCameraMessage(
            "현재 브라우저에서 카메라를 지원하지 않습니다.",
            "error"
        );

        return false;
    }

    if (!cameraVideo) {
        showCameraMessage(
            "카메라 영상 영역을 찾을 수 없습니다.",
            "error"
        );

        return false;
    }

    return true;
}

/* =========================================================
   카메라 시작
========================================================= */

async function startCamera() {
    if (!checkCameraSupport()) {
        return;
    }

    setCameraButtonState(true);

    showCameraMessage(
        "카메라 연결 중...",
        "info"
    );

    try {
        stopCurrentStream();

        const constraints = {
            audio: false,

            video: {
                facingMode: {
                    ideal: cameraFacingMode
                },

                width: {
                    ideal: 1280
                },

                height: {
                    ideal: 720
                },

                frameRate: {
                    ideal: 30,
                    max: 60
                }
            }
        };

        cameraStream =
            await navigator.mediaDevices.getUserMedia(
                constraints
            );

        cameraVideo.srcObject = cameraStream;

        cameraVideo.setAttribute(
            "playsinline",
            ""
        );

        cameraVideo.setAttribute(
            "webkit-playsinline",
            ""
        );

        cameraVideo.muted = true;
        cameraVideo.autoplay = true;

        await waitForVideoMetadata();

        try {
            await cameraVideo.play();
        } catch (playError) {
            console.warn(
                "자동 재생 제한:",
                playError
            );

            cameraVideo.controls = true;
        }

        syncCameraCanvas();

        const videoTrack =
            cameraStream.getVideoTracks()[0];

        const settings =
            videoTrack?.getSettings?.() || {};

        const cameraName =
            cameraFacingMode === "environment"
                ? "후면 카메라"
                : "전면 카메라";

        showCameraMessage(
            `${cameraName} 연결 완료 · ${
                settings.width || 0
            }×${settings.height || 0}`,
            "success"
        );

        setCameraButtonState(false);
    } catch (error) {
        console.error(
            "카메라 시작 오류:",
            error
        );

        stopCurrentStream();
        setCameraButtonState(false);

        handleCameraError(error);
    }
}

/* =========================================================
   영상 메타데이터 대기
========================================================= */

function waitForVideoMetadata() {
    return new Promise(function (resolve) {
        if (
            cameraVideo.readyState >= 1 &&
            cameraVideo.videoWidth > 0
        ) {
            resolve();
            return;
        }

        const finish = function () {
            cameraVideo.removeEventListener(
                "loadedmetadata",
                finish
            );

            resolve();
        };

        cameraVideo.addEventListener(
            "loadedmetadata",
            finish,
            {
                once: true
            }
        );

        window.setTimeout(
            finish,
            3000
        );
    });
}

/* =========================================================
   카메라 종료
========================================================= */

function stopCamera() {
    if (isRecording) {
        stopRecording();
    }

    stopCurrentStream();

    if (cameraVideo) {
        cameraVideo.pause();
        cameraVideo.srcObject = null;
    }

    clearPoseCanvas();

    showCameraMessage(
        "카메라가 종료되었습니다.",
        "info"
    );

    setCameraButtonState(false);
}

function stopCurrentStream() {
    if (!cameraStream) {
        return;
    }

    cameraStream
        .getTracks()
        .forEach(function (track) {
            track.stop();
        });

    cameraStream = null;
}

/* =========================================================
   전면 / 후면 카메라 전환
========================================================= */

async function switchCamera() {
    cameraFacingMode =
        cameraFacingMode === "environment"
            ? "user"
            : "environment";

    showCameraMessage(
        cameraFacingMode === "environment"
            ? "후면 카메라로 전환합니다."
            : "전면 카메라로 전환합니다.",
        "info"
    );

    await startCamera();
}

/* =========================================================
   캔버스 크기 맞춤
========================================================= */

function syncCameraCanvas() {
    if (
        !cameraVideo ||
        !poseCanvas
    ) {
        return;
    }

    const width =
        cameraVideo.videoWidth ||
        cameraVideo.clientWidth ||
        1280;

    const height =
        cameraVideo.videoHeight ||
        cameraVideo.clientHeight ||
        720;

    poseCanvas.width = width;
    poseCanvas.height = height;

    poseCanvas.style.width = "100%";
    poseCanvas.style.height = "100%";
}

function clearPoseCanvas() {
    if (!poseCanvas) {
        return;
    }

    const context =
        poseCanvas.getContext("2d");

    context.clearRect(
        0,
        0,
        poseCanvas.width,
        poseCanvas.height
    );
}

/* =========================================================
   사진 촬영
========================================================= */

function capturePhoto() {
    if (
        !cameraStream ||
        !cameraVideo ||
        cameraVideo.videoWidth === 0
    ) {
        showCameraMessage(
            "먼저 카메라를 시작해 주세요.",
            "warning"
        );

        return;
    }

    const captureCanvas =
        document.createElement("canvas");

    captureCanvas.width =
        cameraVideo.videoWidth;

    captureCanvas.height =
        cameraVideo.videoHeight;

    const context =
        captureCanvas.getContext("2d");

    if (cameraFacingMode === "user") {
        context.translate(
            captureCanvas.width,
            0
        );

        context.scale(
            -1,
            1
        );
    }

    context.drawImage(
        cameraVideo,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
    );

    if (poseCanvas) {
        context.drawImage(
            poseCanvas,
            0,
            0,
            captureCanvas.width,
            captureCanvas.height
        );
    }

    const imageData =
        captureCanvas.toDataURL(
            "image/jpeg",
            0.92
        );

    showCapturePreview(imageData);

    saveCaptureToStorage(imageData);

    showCameraMessage(
        "사진 촬영이 완료되었습니다.",
        "success"
    );
}

function createCapturePreview() {
    if (
        document.getElementById(
            "cameraCapturePreview"
        )
    ) {
        return;
    }

    const cameraPage =
        document.getElementById(
            "cameraPage"
        );

    if (!cameraPage) {
        return;
    }

    const previewPanel =
        document.createElement("div");

    previewPanel.id =
        "cameraCapturePanel";

    previewPanel.className =
        "panel camera-capture-panel";

    previewPanel.style.display =
        "none";

    previewPanel.innerHTML = `
        <h3>촬영 사진</h3>

        <img
            id="cameraCapturePreview"
            alt="촬영 사진"
            style="
                width:100%;
                max-width:700px;
                border-radius:16px;
                margin-top:12px;
            "
        >

        <div
            style="
                display:flex;
                gap:10px;
                flex-wrap:wrap;
                margin-top:14px;
            "
        >
            <button
                id="saveCaptureButton"
                type="button"
                class="primary"
            >
                사진 저장
            </button>

            <button
                id="deleteCaptureButton"
                type="button"
            >
                사진 삭제
            </button>
        </div>
    `;

    cameraPage.appendChild(
        previewPanel
    );

    document
        .getElementById(
            "saveCaptureButton"
        )
        ?.addEventListener(
            "click",
            downloadCapturePhoto
        );

    document
        .getElementById(
            "deleteCaptureButton"
        )
        ?.addEventListener(
            "click",
            clearCapturePreview
        );
}

function showCapturePreview(imageData) {
    const panel =
        document.getElementById(
            "cameraCapturePanel"
        );

    const preview =
        document.getElementById(
            "cameraCapturePreview"
        );

    if (
        !panel ||
        !preview
    ) {
        return;
    }

    preview.src = imageData;

    panel.style.display =
        "block";

    panel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function saveCaptureToStorage(imageData) {
    try {
        const captureData = {
            image: imageData,

            sport:
                analysisSport?.value ||
                "일반 분석",

            direction:
                analysisDirection?.value ||
                "front",

            createdAt:
                new Date().toISOString()
        };

        localStorage.setItem(
            "sspro-last-capture",
            JSON.stringify(captureData)
        );
    } catch (error) {
        console.warn(
            "촬영 사진 임시 저장 실패:",
            error
        );
    }
}

function downloadCapturePhoto() {
    const preview =
        document.getElementById(
            "cameraCapturePreview"
        );

    if (
        !preview ||
        !preview.src
    ) {
        return;
    }

    const anchor =
        document.createElement("a");

    anchor.href =
        preview.src;

    anchor.download =
        `sports-analysis-${createFileTime()}.jpg`;

    document.body.appendChild(
        anchor
    );

    anchor.click();
    anchor.remove();
}

function clearCapturePreview() {
    const panel =
        document.getElementById(
            "cameraCapturePanel"
        );

    const preview =
        document.getElementById(
            "cameraCapturePreview"
        );

    if (preview) {
        preview.removeAttribute(
            "src"
        );
    }

    if (panel) {
        panel.style.display =
            "none";
    }

    localStorage.removeItem(
        "sspro-last-capture"
    );
}

/* =========================================================
   영상 녹화
========================================================= */

function toggleRecording() {
    if (isRecording) {
        stopRecording();
        return;
    }

    startRecording();
}

function startRecording() {
    if (!cameraStream) {
        showCameraMessage(
            "먼저 카메라를 시작해 주세요.",
            "warning"
        );

        return;
    }

    if (
        typeof MediaRecorder ===
        "undefined"
    ) {
        showCameraMessage(
            "현재 브라우저에서는 영상 녹화를 지원하지 않습니다.",
            "error"
        );

        return;
    }

    try {
        recordedChunks = [];

        const mimeType =
            getSupportedRecordingType();

        const recorderOptions =
            mimeType
                ? {
                    mimeType
                }
                : {};

        mediaRecorder =
            new MediaRecorder(
                cameraStream,
                recorderOptions
            );

        mediaRecorder.addEventListener(
            "dataavailable",
            function (event) {
                if (
                    event.data &&
                    event.data.size > 0
                ) {
                    recordedChunks.push(
                        event.data
                    );
                }
            }
        );

        mediaRecorder.addEventListener(
            "stop",
            saveRecordedVideo
        );

        mediaRecorder.addEventListener(
            "error",
            function (event) {
                console.error(
                    "녹화 오류:",
                    event.error
                );

                showCameraMessage(
                    "영상 녹화 중 오류가 발생했습니다.",
                    "error"
                );
            }
        );

        mediaRecorder.start(
            1000
        );

        isRecording = true;

        if (recordButton) {
            recordButton.textContent =
                "녹화 종료";

            recordButton.classList.add(
                "danger"
            );
        }

        showCameraMessage(
            "영상 녹화를 시작했습니다.",
            "success"
        );
    } catch (error) {
        console.error(
            "녹화 시작 오류:",
            error
        );

        showCameraMessage(
            "영상 녹화를 시작할 수 없습니다.",
            "error"
        );
    }
}

function stopRecording() {
    if (
        !mediaRecorder ||
        mediaRecorder.state ===
            "inactive"
    ) {
        isRecording = false;
        updateRecordButton();
        return;
    }

    mediaRecorder.stop();

    isRecording = false;

    updateRecordButton();

    showCameraMessage(
        "영상 녹화를 종료했습니다.",
        "info"
    );
}

function updateRecordButton() {
    if (!recordButton) {
        return;
    }

    recordButton.textContent =
        "녹화 시작";

    recordButton.classList.remove(
        "danger"
    );
}

function saveRecordedVideo() {
    if (
        recordedChunks.length === 0
    ) {
        return;
    }

    const mimeType =
        mediaRecorder?.mimeType ||
        "video/webm";

    const videoBlob =
        new Blob(
            recordedChunks,
            {
                type: mimeType
            }
        );

    const videoURL =
        URL.createObjectURL(
            videoBlob
        );

    createRecordedVideoPreview(
        videoURL,
        videoBlob
    );
}

function createRecordedVideoPreview(
    videoURL,
    videoBlob
) {
    let panel =
        document.getElementById(
            "recordedVideoPanel"
        );

    if (!panel) {
        const cameraPage =
            document.getElementById(
                "cameraPage"
            );

        if (!cameraPage) {
            return;
        }

        panel =
            document.createElement("div");

        panel.id =
            "recordedVideoPanel";

        panel.className =
            "panel";

        cameraPage.appendChild(
            panel
        );
    }

    panel.innerHTML = `
        <h3>녹화 영상</h3>

        <video
            id="recordedVideoPreview"
            controls
            playsinline
            style="
                width:100%;
                max-width:800px;
                border-radius:16px;
                background:#000;
                margin-top:12px;
            "
        ></video>

        <div
            style="
                display:flex;
                gap:10px;
                margin-top:14px;
                flex-wrap:wrap;
            "
        >
            <button
                id="saveRecordedVideoButton"
                type="button"
                class="primary"
            >
                영상 저장
            </button>

            <button
                id="analyzeRecordedVideoButton"
                type="button"
            >
                영상분석으로 보내기
            </button>
        </div>
    `;

    const preview =
        document.getElementById(
            "recordedVideoPreview"
        );

    preview.src =
        videoURL;

    document
        .getElementById(
            "saveRecordedVideoButton"
        )
        ?.addEventListener(
            "click",
            function () {
                const anchor =
                    document.createElement(
                        "a"
                    );

                anchor.href =
                    videoURL;

                anchor.download =
                    `sports-recording-${createFileTime()}.webm`;

                document.body.appendChild(
                    anchor
                );

                anchor.click();
                anchor.remove();
            }
        );

    document
        .getElementById(
            "analyzeRecordedVideoButton"
        )
        ?.addEventListener(
            "click",
            function () {
                window.recordedCameraBlob =
                    videoBlob;

                if (
                    typeof window.openPage ===
                    "function"
                ) {
                    window.openPage(
                        "video"
                    );
                }

                showCameraMessage(
                    "녹화 영상을 영상분석 화면으로 전달했습니다.",
                    "success"
                );
            }
        );
}

/* =========================================================
   녹화 형식
========================================================= */

function getSupportedRecordingType() {
    const mimeTypes = [
        "video/mp4",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm"
    ];

    return (
        mimeTypes.find(
            function (type) {
                return (
                    MediaRecorder.isTypeSupported &&
                    MediaRecorder.isTypeSupported(
                        type
                    )
                );
            }
        ) || ""
    );
}

/* =========================================================
   종목 선택 목록 생성
========================================================= */

function populateSportOptions() {
    if (!analysisSport) {
        return;
    }

    const previousValue =
        analysisSport.value;

    analysisSport.innerHTML = "";

    addSportGroup(
        analysisSport,
        "동계종목",
        WINTER_SPORTS
    );

    addSportGroup(
        analysisSport,
        "하계종목",
        SUMMER_SPORTS
    );

    addSportGroup(
        analysisSport,
        "웨이트",
        WEIGHT_EXERCISES.map(
            function (exercise) {
                return `웨이트 · ${exercise}`;
            }
        )
    );

    addSportGroup(
        analysisSport,
        "체대입시",
        PE_ENTRANCE_SPORTS.map(
            function (sport) {
                return `체대입시 · ${sport}`;
            }
        )
    );

    const hasPreviousValue =
        Array.from(
            analysisSport.options
        ).some(
            function (option) {
                return (
                    option.value ===
                    previousValue
                );
            }
        );

    if (hasPreviousValue) {
        analysisSport.value =
            previousValue;
    } else {
        analysisSport.value =
            "바이애슬론";
    }

    analysisSport.addEventListener(
        "change",
        saveAnalysisSelection
    );

    analysisDirection?.addEventListener(
        "change",
        saveAnalysisSelection
    );

    restoreAnalysisSelection();
}

function addSportGroup(
    selectElement,
    label,
    sports
) {
    const group =
        document.createElement(
            "optgroup"
        );

    group.label = label;

    sports.forEach(
        function (sport) {
            const option =
                document.createElement(
                    "option"
                );

            option.value = sport;
            option.textContent = sport;

            group.appendChild(
                option
            );
        }
    );

    selectElement.appendChild(
        group
    );
}

function saveAnalysisSelection() {
    const selection = {
        sport:
            analysisSport?.value || "",

        direction:
            analysisDirection?.value ||
            "front"
    };

    localStorage.setItem(
        "sspro-analysis-selection",
        JSON.stringify(selection)
    );
}

function restoreAnalysisSelection() {
    try {
        const savedData =
            JSON.parse(
                localStorage.getItem(
                    "sspro-analysis-selection"
                )
            );

        if (
            savedData?.sport &&
            analysisSport
        ) {
            const optionExists =
                Array.from(
                    analysisSport.options
                ).some(
                    function (option) {
                        return (
                            option.value ===
                            savedData.sport
                        );
                    }
                );

            if (optionExists) {
                analysisSport.value =
                    savedData.sport;
            }
        }

        if (
            savedData?.direction &&
            analysisDirection
        ) {
            analysisDirection.value =
                savedData.direction;
        }
    } catch (error) {
        console.warn(
            "분석 설정 복원 실패:",
            error
        );
    }
}

/* =========================================================
   기존 개별 종목 메뉴 숨김
========================================================= */

function hideOldSportMenus() {
    const menuNamesToRemove = [
        "basketball",
        "soccer",
        "shooting",
        "biathlon"
    ];

    menuNamesToRemove.forEach(
        function (pageName) {
            const menuButton =
                document.querySelector(
                    `.menu[data-page="${pageName}"]`
                );

            if (menuButton) {
                menuButton.style.display =
                    "none";
            }
        }
    );
}

/* =========================================================
   상태 메시지
========================================================= */

function createCameraStatus() {
    if (
        document.getElementById(
            "cameraStatus"
        )
    ) {
        return;
    }

    const cameraPage =
        document.getElementById(
            "cameraPage"
        );

    if (!cameraPage) {
        return;
    }

    const status =
        document.createElement("div");

    status.id =
        "cameraStatus";

    status.className =
        "panel";

    status.style.marginTop =
        "18px";

    status.innerHTML =
        "카메라를 시작해 주세요.";

    const resultGrid =
        cameraPage.querySelector(
            ".analysis-result-grid"
        );

    if (resultGrid) {
        cameraPage.insertBefore(
            status,
            resultGrid
        );
    } else {
        cameraPage.appendChild(
            status
        );
    }
}

function showCameraMessage(
    message,
    type = "info"
) {
    const status =
        document.getElementById(
            "cameraStatus"
        );

    if (status) {
        status.textContent =
            message;

        status.dataset.type =
            type;

        status.style.borderLeft =
            type === "success"
                ? "5px solid #22c55e"
                : type === "error"
                    ? "5px solid #ef4444"
                    : type === "warning"
                        ? "5px solid #f59e0b"
                        : "5px solid #2563eb";
    }

    if (
        typeof window.showToast ===
        "function"
    ) {
        window.showToast(
            message,
            type
        );
    }
}

/* =========================================================
   카메라 오류 처리
========================================================= */

function handleCameraError(error) {
    const errorName =
        error?.name || "";

    let message =
        "카메라를 시작할 수 없습니다.";

    if (
        errorName ===
            "NotAllowedError" ||
        errorName ===
            "PermissionDeniedError"
    ) {
        message =
            "카메라 사용이 거부되었습니다. Safari 주소창의 설정에서 카메라를 허용해 주세요.";
    } else if (
        errorName ===
        "NotFoundError"
    ) {
        message =
            "사용 가능한 카메라를 찾을 수 없습니다.";
    } else if (
        errorName ===
            "NotReadableError" ||
        errorName ===
            "TrackStartError"
    ) {
        message =
            "다른 앱에서 카메라를 사용 중일 수 있습니다. 다른 앱을 종료한 뒤 다시 시도해 주세요.";
    } else if (
        errorName ===
        "OverconstrainedError"
    ) {
        message =
            "요청한 카메라 설정을 사용할 수 없습니다.";
    } else if (
        errorName ===
        "AbortError"
    ) {
        message =
            "카메라 연결이 중단되었습니다. 다시 시도해 주세요.";
    }

    showCameraMessage(
        message,
        "error"
    );
}

/* =========================================================
   버튼 상태
========================================================= */

function setCameraButtonState(
    isLoading
) {
    if (startCameraButton) {
        startCameraButton.disabled =
            isLoading;

        startCameraButton.textContent =
            isLoading
                ? "카메라 연결 중..."
                : "카메라 시작";
    }

    if (switchCameraButton) {
        switchCameraButton.disabled =
            isLoading;
    }
}

/* =========================================================
   파일 시간
========================================================= */

function createFileTime() {
    const now =
        new Date();

    const pad = function (value) {
        return String(
            value
        ).padStart(
            2,
            "0"
        );
    };

    return [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
        "-",
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds())
    ].join("");
}

/* =========================================================
   다른 파일에서 사용하도록 전역 등록
========================================================= */

window.startCamera =
    startCamera;

window.stopCamera =
    stopCamera;

window.switchCamera =
    switchCamera;

window.capturePhoto =
    capturePhoto;

window.startRecording =
    startRecording;

window.stopRecording =
    stopRecording;

window.populateSportOptions =
    populateSportOptions;