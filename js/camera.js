/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : camera.js
 Part 1 / 5
=========================================================
*/

const CameraManager = {

    stream: null,

    video: null,

    facingMode: "environment",

    width: 1280,

    height: 720,

    fps: 30,

    isRunning: false

};

/* ==========================================
   초기화
========================================== */

function initializeCamera(){

    CameraManager.video =

        document.getElementById("camera");

}

/* ==========================================
   카메라 시작
========================================== */

async function startCamera(){

    try{

        CameraManager.stream =

            await navigator.mediaDevices.getUserMedia({

                video:{

                    facingMode:

                        CameraManager.facingMode,

                    width:

                        CameraManager.width,

                    height:

                        CameraManager.height,

                    frameRate:

                        CameraManager.fps

                },

                audio:false

            });

        CameraManager.video.srcObject =

            CameraManager.stream;

        CameraManager.isRunning = true;

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   카메라 종료
========================================== */

function stopCamera(){

    if(!CameraManager.stream){

        return;

    }

    CameraManager.stream

        .getTracks()

        .forEach(track=>track.stop());

    CameraManager.stream = null;

    CameraManager.isRunning = false;

}
/* ==========================================
   전면 / 후면 전환
========================================== */

async function switchCamera(){

    if(CameraManager.facingMode==="environment"){

        CameraManager.facingMode="user";

    }else{

        CameraManager.facingMode="environment";

    }

    stopCamera();

    await startCamera();

}

/* ==========================================
   후면 카메라
========================================== */

async function backCamera(){

    CameraManager.facingMode="environment";

    stopCamera();

    await startCamera();

}

/* ==========================================
   전면 카메라
========================================== */

async function frontCamera(){

    CameraManager.facingMode="user";

    stopCamera();

    await startCamera();

}

/* ==========================================
   해상도 변경
========================================== */

async function setResolution(width,height){

    CameraManager.width=width;

    CameraManager.height=height;

    stopCamera();

    await startCamera();

}

/* ==========================================
   FPS 변경
========================================== */

async function setFPS(fps){

    CameraManager.fps=fps;

    stopCamera();

    await startCamera();

}

/* ==========================================
   현재 카메라 정보
========================================== */

function cameraInfo(){

    return{

        width:CameraManager.width,

        height:CameraManager.height,

        fps:CameraManager.fps,

        facingMode:CameraManager.facingMode,

        running:CameraManager.isRunning

    };

}

/* ==========================================
   정보 출력
========================================== */

function updateCameraInfo(){

    const info=document.getElementById("cameraInfo");

    if(!info){

        return;

    }

    info.innerHTML=

    `
    ${CameraManager.width} × ${CameraManager.height}<br>
    ${CameraManager.fps} FPS<br>
    ${CameraManager.facingMode}
    `;

}

/* ==========================================
   자동 갱신
========================================== */

setInterval(()=>{

    if(CameraManager.isRunning){

        updateCameraInfo();

    }

},500);
/* ==========================================
   사진 저장 목록
========================================== */

CameraManager.photos = [];

/* ==========================================
   사진 촬영
========================================== */

function capturePhoto(){

    if(!CameraManager.video){

        return;

    }

    const canvas=document.createElement("canvas");

    canvas.width=CameraManager.video.videoWidth;

    canvas.height=CameraManager.video.videoHeight;

    const ctx=canvas.getContext("2d");

    ctx.drawImage(

        CameraManager.video,

        0,

        0

    );

    const image=canvas.toDataURL("image/png");

    CameraManager.photos.push(image);

    showLastPhoto();

}

/* ==========================================
   마지막 사진 표시
========================================== */

function showLastPhoto(){

    const preview=document.getElementById(

        "photoPreview"

    );

    if(!preview){

        return;

    }

    preview.src=

        CameraManager.photos[

            CameraManager.photos.length-1

        ];

}

/* ==========================================
   사진 다운로드
========================================== */

function downloadPhoto(index){

    if(

        CameraManager.photos[index]===undefined

    ){

        return;

    }

    const a=document.createElement("a");

    a.href=

        CameraManager.photos[index];

    a.download=

        "capture.png";

    a.click();

}

/* ==========================================
   전체 삭제
========================================== */

function clearPhotos(){

    CameraManager.photos=[];

}

/* ==========================================
   연속 촬영
========================================== */

function burstCapture(count=10,interval=200){

    let current=0;

    const timer=setInterval(()=>{

        capturePhoto();

        current++;

        if(current>=count){

            clearInterval(timer);

        }

    },interval);

}

/* ==========================================
   3초 타이머
========================================== */

function capture3(){

    setTimeout(

        capturePhoto,

        3000

    );

}

/* ==========================================
   5초 타이머
========================================== */

function capture5(){

    setTimeout(

        capturePhoto,

        5000

    );

}

/* ==========================================
   10초 타이머
========================================== */

function capture10(){

    setTimeout(

        capturePhoto,

        10000

    );

}

/* ==========================================
   촬영 개수
========================================== */

function photoCount(){

    return CameraManager.photos.length;

}
/* ==========================================
   녹화 변수
========================================== */

CameraManager.mediaRecorder = null;

CameraManager.recordChunks = [];

CameraManager.isRecording = false;

/* ==========================================
   녹화 시작
========================================== */

function startRecording(){

    if(!CameraManager.stream){

        return;

    }

    CameraManager.recordChunks=[];

    CameraManager.mediaRecorder=

        new MediaRecorder(CameraManager.stream);

    CameraManager.mediaRecorder.ondataavailable=(event)=>{

        if(event.data.size>0){

            CameraManager.recordChunks.push(event.data);

        }

    };

    CameraManager.mediaRecorder.start();

    CameraManager.isRecording=true;

}

/* ==========================================
   녹화 종료
========================================== */

function stopRecording(){

    if(

        !CameraManager.mediaRecorder ||

        !CameraManager.isRecording

    ){

        return;

    }

    CameraManager.mediaRecorder.stop();

    CameraManager.isRecording=false;

    CameraManager.mediaRecorder.onstop=()=>{

        saveRecording();

    };

}

/* ==========================================
   녹화 저장
========================================== */

function saveRecording(){

    const blob=new Blob(

        CameraManager.recordChunks,

        {

            type:"video/webm"

        }

    );

    const url=

        URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="camera_record.webm";

    a.click();

}

/* ==========================================
   MediaPipe 준비
========================================== */

function initializePose(){

    console.log(

        "MediaPipe Pose 초기화"

    );

}

/* ==========================================
   AI 분석 시작
========================================== */

function startPoseAnalysis(){

    if(!CameraManager.isRunning){

        return;

    }

    initializePose();

    console.log(

        "실시간 자세분석 시작"

    );

}

/* ==========================================
   AI 분석 종료
========================================== */

function stopPoseAnalysis(){

    console.log(

        "실시간 자세분석 종료"

    );

}

/* ==========================================
   현재 FPS 계산
========================================== */

CameraManager.currentFPS=0;

function updateFPS(){

    CameraManager.currentFPS=

        CameraManager.fps;

    const fps=document.getElementById(

        "cameraFPS"

    );

    if(!fps){

        return;

    }

    fps.innerHTML=

        CameraManager.currentFPS+

        " FPS";

}

/* ==========================================
   FPS 자동 갱신
========================================== */

setInterval(()=>{

    if(CameraManager.isRunning){

        updateFPS();

    }

},1000);
/* ==========================================
   자동 캡처
========================================== */

let autoCaptureTimer = null;

function startAutoCapture(interval = 1000){

    stopAutoCapture();

    autoCaptureTimer = setInterval(()=>{

        capturePhoto();

    },interval);

}

function stopAutoCapture(){

    if(autoCaptureTimer){

        clearInterval(autoCaptureTimer);

        autoCaptureTimer = null;

    }

}

/* ==========================================
   자세 사진 저장
========================================== */

function savePosePhoto(){

    capturePhoto();

    console.log("자세 사진 저장");

}

/* ==========================================
   영상 분석으로 보내기
========================================== */

function sendVideoToAnalysis(){

    if(typeof initializeVideo==="function"){

        initializeVideo();

    }

    console.log("영상 분석 모듈 연결");

}

/* ==========================================
   Pose 분석 연결
========================================== */

function connectPoseEngine(){

    if(typeof startPoseAnalysis==="function"){

        startPoseAnalysis();

    }

}

/* ==========================================
   선수 연결
========================================== */

function connectSelectedAthlete(id){

    if(typeof selectAthlete==="function"){

        selectAthlete(id);

    }

}

/* ==========================================
   Polar 연결
========================================== */

function connectPolarDevice(){

    console.log("Polar 연결");

}

/* ==========================================
   리포트 생성
========================================== */

function createCameraReport(){

    const reports = loadReports();

    reports.push({

        id: Utils.uuid(),

        type: "카메라 분석",

        createdAt: Utils.dateTime(),

        resolution:

            CameraManager.width +

            "×" +

            CameraManager.height,

        fps:

            CameraManager.fps,

        photos:

            CameraManager.photos.length

    });

    saveReports(reports);

}

/* ==========================================
   메모리 정리
========================================== */

function clearCameraMemory(){

    CameraManager.photos = [];

    CameraManager.recordChunks = [];

}

/* ==========================================
   카메라 종료
========================================== */

function destroyCamera(){

    stopRecording();

    stopAutoCapture();

    stopCamera();

    clearCameraMemory();

    console.log(

        "Camera Destroy"

    );

}