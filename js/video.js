/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : video.js
 Version : 1.0.0
=========================================================
*/

const VideoManager = {

    video: null,

    canvas: null,

    ctx: null,

    isPlaying: false,

    playbackRate: 1,

    zoom: 1,

    rotation: 0,

    brightness: 100,

    contrast: 100,

    frameRate: 30,

    pointA: null,

    pointB: null,

    drawing: false,

    tool: "none",

    color: "#ff0000",

    lineWidth: 3,

    snapshots: []

};

/* ==========================================
   초기화
========================================== */

function initializeVideo(){

    VideoManager.video = document.getElementById("analysisVideo");

    VideoManager.canvas = document.getElementById("drawCanvas");

    if(VideoManager.canvas){

        VideoManager.ctx =

            VideoManager.canvas.getContext("2d");

    }

}

/* ==========================================
   영상 업로드
========================================== */

function loadVideo(file){

    if(!file){

        return;

    }

    const url = URL.createObjectURL(file);

    VideoManager.video.src = url;

}

/* ==========================================
   재생
========================================== */

function playVideo(){

    if(!VideoManager.video){

        return;

    }

    VideoManager.video.play();

    VideoManager.isPlaying = true;

}

/* ==========================================
   일시정지
========================================== */

function pauseVideo(){

    if(!VideoManager.video){

        return;

    }

    VideoManager.video.pause();

    VideoManager.isPlaying = false;

}

/* ==========================================
   정지
========================================== */

function stopVideo(){

    if(!VideoManager.video){

        return;

    }

    VideoManager.video.pause();

    VideoManager.video.currentTime = 0;

    VideoManager.isPlaying = false;

}

/* ==========================================
   다시 시작
========================================== */

function restartVideo(){

    stopVideo();

    playVideo();

}
/* ==========================================
   재생속도
========================================== */

function setPlaybackSpeed(speed){

    if(!VideoManager.video){

        return;

    }

    VideoManager.playbackRate = speed;

    VideoManager.video.playbackRate = speed;

    updatePlaybackLabel();

}

/* ==========================================
   슬로우모션
========================================== */

function slowMotion(){

    setPlaybackSpeed(0.25);

}

function superSlowMotion(){

    setPlaybackSpeed(0.10);

}

function normalSpeed(){

    setPlaybackSpeed(1);

}

function doubleSpeed(){

    setPlaybackSpeed(2);

}

/* ==========================================
   속도 표시
========================================== */

function updatePlaybackLabel(){

    const label = document.getElementById("playbackRate");

    if(!label){

        return;

    }

    label.innerHTML =

        VideoManager.playbackRate.toFixed(2) + "x";

}

/* ==========================================
   다음 프레임
========================================== */

function nextFrame(){

    if(!VideoManager.video){

        return;

    }

    VideoManager.video.pause();

    VideoManager.video.currentTime +=

        1 / VideoManager.frameRate;

}

/* ==========================================
   이전 프레임
========================================== */

function previousFrame(){

    if(!VideoManager.video){

        return;

    }

    VideoManager.video.pause();

    VideoManager.video.currentTime -=

        1 / VideoManager.frameRate;

}

/* ==========================================
   원하는 시간 이동
========================================== */

function seekVideo(second){

    if(!VideoManager.video){

        return;

    }

    VideoManager.video.currentTime = second;

}

/* ==========================================
   A 지점
========================================== */

function setPointA(){

    VideoManager.pointA =

        VideoManager.video.currentTime;

}

/* ==========================================
   B 지점
========================================== */

function setPointB(){

    VideoManager.pointB =

        VideoManager.video.currentTime;

}

/* ==========================================
   반복 시작
========================================== */

function startLoop(){

    if(

        VideoManager.pointA===null ||

        VideoManager.pointB===null

    ){

        return;

    }

    VideoManager.video.currentTime =

        VideoManager.pointA;

    VideoManager.video.play();

    VideoManager.video.addEventListener(

        "timeupdate",

        repeatLoop

    );

}

/* ==========================================
   반복 종료
========================================== */

function stopLoop(){

    VideoManager.video.removeEventListener(

        "timeupdate",

        repeatLoop

    );

}

/* ==========================================
   반복
========================================== */

function repeatLoop(){

    if(

        VideoManager.video.currentTime

        >=

        VideoManager.pointB

    ){

        VideoManager.video.currentTime =

            VideoManager.pointA;

    }

}

/* ==========================================
   확대
========================================== */

function zoomIn(){

    VideoManager.zoom += 0.1;

    applyTransform();

}

function zoomOut(){

    VideoManager.zoom -= 0.1;

    if(VideoManager.zoom < 1){

        VideoManager.zoom = 1;

    }

    applyTransform();

}

/* ==========================================
   회전
========================================== */

function rotateLeft(){

    VideoManager.rotation -= 90;

    applyTransform();

}

function rotateRight(){

    VideoManager.rotation += 90;

    applyTransform();

}

/* ==========================================
   확대 + 회전 적용
========================================== */

function applyTransform(){

    if(!VideoManager.video){

        return;

    }

    VideoManager.video.style.transform =

        `scale(${VideoManager.zoom}) rotate(${VideoManager.rotation}deg)`;

}
/* ==========================================
   밝기
========================================== */

function setBrightness(value){

    VideoManager.brightness = value;

    applyFilter();

}

/* ==========================================
   대비
========================================== */

function setContrast(value){

    VideoManager.contrast = value;

    applyFilter();

}

/* ==========================================
   필터 적용
========================================== */

function applyFilter(){

    if(!VideoManager.video){

        return;

    }

    VideoManager.video.style.filter =

        `brightness(${VideoManager.brightness}%)
         contrast(${VideoManager.contrast}%)`;

}

/* ==========================================
   그리기 도구
========================================== */

function setTool(tool){

    VideoManager.tool = tool;

}

/* ==========================================
   색상
========================================== */

function setDrawColor(color){

    VideoManager.color = color;

}

/* ==========================================
   굵기
========================================== */

function setLineWidth(width){

    VideoManager.lineWidth = width;

}

/* ==========================================
   캔버스 초기화
========================================== */

function clearCanvas(){

    if(!VideoManager.ctx){

        return;

    }

    VideoManager.ctx.clearRect(

        0,

        0,

        VideoManager.canvas.width,

        VideoManager.canvas.height

    );

}

/* ==========================================
   실행취소
========================================== */

function undoCanvas(){

    alert("V2에서 실행취소 기능 추가 예정");

}

/* ==========================================
   마우스 누름
========================================== */

function startDraw(event){

    if(VideoManager.tool==="none"){

        return;

    }

    VideoManager.drawing = true;

    VideoManager.ctx.beginPath();

    VideoManager.ctx.moveTo(

        event.offsetX,

        event.offsetY

    );

}

/* ==========================================
   마우스 이동
========================================== */

function drawing(event){

    if(!VideoManager.drawing){

        return;

    }

    VideoManager.ctx.strokeStyle =

        VideoManager.color;

    VideoManager.ctx.lineWidth =

        VideoManager.lineWidth;

    VideoManager.ctx.lineTo(

        event.offsetX,

        event.offsetY

    );

    VideoManager.ctx.stroke();

}

/* ==========================================
   종료
========================================== */

function stopDraw(){

    VideoManager.drawing = false;

}

/* ==========================================
   각도 측정
========================================== */

function calculateAngle(A,B,C){

    return Utils.angle(

        A,

        B,

        C

    );

}

/* ==========================================
   선 그리기
========================================== */

function drawLine(x1,y1,x2,y2){

    VideoManager.ctx.beginPath();

    VideoManager.ctx.moveTo(x1,y1);

    VideoManager.ctx.lineTo(x2,y2);

    VideoManager.ctx.strokeStyle=

        VideoManager.color;

    VideoManager.ctx.lineWidth=

        VideoManager.lineWidth;

    VideoManager.ctx.stroke();

}

/* ==========================================
   원
========================================== */

function drawCircle(x,y,r){

    VideoManager.ctx.beginPath();

    VideoManager.ctx.arc(

        x,

        y,

        r,

        0,

        Math.PI*2

    );

    VideoManager.ctx.strokeStyle=

        VideoManager.color;

    VideoManager.ctx.lineWidth=

        VideoManager.lineWidth;

    VideoManager.ctx.stroke();

}

/* ==========================================
   사각형
========================================== */

function drawRectangle(x,y,w,h){

    VideoManager.ctx.strokeStyle=

        VideoManager.color;

    VideoManager.ctx.lineWidth=

        VideoManager.lineWidth;

    VideoManager.ctx.strokeRect(

        x,

        y,

        w,

        h

    );

}
/* ==========================================
   캡처
========================================== */

function captureFrame(){

    if(!VideoManager.video){

        return;

    }

    const canvas=document.createElement("canvas");

    canvas.width=VideoManager.video.videoWidth;

    canvas.height=VideoManager.video.videoHeight;

    const ctx=canvas.getContext("2d");

    ctx.drawImage(

        VideoManager.video,

        0,

        0

    );

    const image=canvas.toDataURL("image/png");

    VideoManager.snapshots.push(image);

}

/* ==========================================
   캡처 저장
========================================== */

function downloadSnapshot(index=0){

    if(

        !VideoManager.snapshots[index]

    ){

        return;

    }

    const link=document.createElement("a");

    link.href=

        VideoManager.snapshots[index];

    link.download=

        "snapshot.png";

    link.click();

}

/* ==========================================
   녹화
========================================== */

let mediaRecorder;

let recordedChunks=[];

function startRecording(stream){

    recordedChunks=[];

    mediaRecorder=

        new MediaRecorder(stream);

    mediaRecorder.ondataavailable=(event)=>{

        if(event.data.size>0){

            recordedChunks.push(event.data);

        }

    };

    mediaRecorder.start();

}

/* ==========================================
   녹화 종료
========================================== */

function stopRecording(){

    if(!mediaRecorder){

        return;

    }

    mediaRecorder.stop();

    mediaRecorder.onstop=()=>{

        const blob=new Blob(

            recordedChunks,

            {

                type:"video/mp4"

            }

        );

        const url=

            URL.createObjectURL(blob);

        const a=document.createElement("a");

        a.href=url;

        a.download="analysis.mp4";

        a.click();

    };

}

/* ==========================================
   AI 분석
========================================== */

function analyzeVideo(){

    console.log(

        "AI 영상 분석 시작"

    );

}

/* ==========================================
   Pose 연결
========================================== */

function connectPose(){

    console.log(

        "MediaPipe Pose 연결"

    );

}

/* ==========================================
   히트맵 연결
========================================== */

function connectHeatmap(){

    console.log(

        "Heatmap 연결"

    );

}

/* ==========================================
   Polar 연결
========================================== */

function connectPolar(){

    console.log(

        "Polar 연결"

    );

}

/* ==========================================
   선수 연결
========================================== */

function connectAthlete(id){

    selectAthlete(id);

}

/* ==========================================
   리포트 저장
========================================== */

function saveVideoReport(){

    const reports=loadReports();

    reports.push({

        id:Utils.uuid(),

        type:"영상분석",

        createdAt:Utils.dateTime(),

        playbackRate:

            VideoManager.playbackRate,

        brightness:

            VideoManager.brightness,

        contrast:

            VideoManager.contrast,

        zoom:

            VideoManager.zoom

    });

    saveReports(reports);

}

/* ==========================================
   종료
========================================== */

function destroyVideo(){

    stopVideo();

    clearCanvas();

    VideoManager.snapshots=[];

}