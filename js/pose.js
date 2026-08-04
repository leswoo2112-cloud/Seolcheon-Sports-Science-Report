/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : pose.js
 Part 1 / 5
=========================================================
*/

const PoseManager = {

    pose: null,

    camera: null,

    video: null,

    canvas: null,

    ctx: null,

    results: null,

    running: false,

    mode: "live",

    score: 0,

    athlete: null

};

/* ==========================================
   초기화
========================================== */

async function initializePose(){

    PoseManager.video =

        document.getElementById("camera");

    PoseManager.canvas =

        document.getElementById("poseCanvas");

    if(PoseManager.canvas){

        PoseManager.ctx =

            PoseManager.canvas.getContext("2d");

    }

    PoseManager.pose = new Pose({

        locateFile:(file)=>{

            return

            "https://cdn.jsdelivr.net/npm/@mediapipe/pose/" + file;

        }

    });

    PoseManager.pose.setOptions({

        modelComplexity:2,

        smoothLandmarks:true,

        enableSegmentation:false,

        minDetectionConfidence:0.7,

        minTrackingConfidence:0.7

    });

    PoseManager.pose.onResults(onPoseResults);

}

/* ==========================================
   실시간 시작
========================================== */

async function startPose(){

    if(PoseManager.running){

        return;

    }

    await initializePose();

    PoseManager.camera = new Camera(

        PoseManager.video,

        {

            onFrame:async()=>{

                await PoseManager.pose.send({

                    image:PoseManager.video

                });

            },

            width:1280,

            height:720

        }

    );

    PoseManager.camera.start();

    PoseManager.running=true;

}

/* ==========================================
   종료
========================================== */

function stopPose(){

    PoseManager.running=false;

}

/* ==========================================
   분석 결과
========================================== */

function onPoseResults(results){

    PoseManager.results=results;

    drawPose(results);

    calculatePose(results);

}
/* ==========================================
   스켈레톤 그리기
========================================== */

function drawPose(results){

    if(

        !results.poseLandmarks ||

        !PoseManager.ctx

    ){

        return;

    }

    PoseManager.ctx.clearRect(

        0,

        0,

        PoseManager.canvas.width,

        PoseManager.canvas.height

    );

    drawConnectors(

        PoseManager.ctx,

        results.poseLandmarks,

        POSE_CONNECTIONS,

        {

            color:"#00ff88",

            lineWidth:4

        }

    );

    drawLandmarks(

        PoseManager.ctx,

        results.poseLandmarks,

        {

            color:"#ffffff",

            fillColor:"#0066ff",

            radius:5

        }

    );

    drawJointNumber(results.poseLandmarks);

    drawCenterLine();

}

/* ==========================================
   관절 번호
========================================== */

function drawJointNumber(points){

    PoseManager.ctx.font="12px Arial";

    PoseManager.ctx.fillStyle="#ffff00";

    points.forEach((point,index)=>{

        PoseManager.ctx.fillText(

            index,

            point.x*

            PoseManager.canvas.width,

            point.y*

            PoseManager.canvas.height

        );

    });

}

/* ==========================================
   기준선
========================================== */

function drawCenterLine(){

    const ctx=PoseManager.ctx;

    const w=PoseManager.canvas.width;

    const h=PoseManager.canvas.height;

    ctx.strokeStyle="#ff0000";

    ctx.lineWidth=2;

    ctx.beginPath();

    ctx.moveTo(w/2,0);

    ctx.lineTo(w/2,h);

    ctx.stroke();

}

/* ==========================================
   랜드마크 가져오기
========================================== */

function getLandmark(index){

    return PoseManager.results

        .poseLandmarks[index];

}

/* ==========================================
   좌표 변환
========================================== */

function point(index){

    const p=getLandmark(index);

    return{

        x:p.x,

        y:p.y

    };

}

/* ==========================================
   사람 감지 여부
========================================== */

function personDetected(){

    return(

        PoseManager.results &&

        PoseManager.results.poseLandmarks

    );

}

/* ==========================================
   랜드마크 개수
========================================== */

function landmarkCount(){

    if(!personDetected()){

        return 0;

    }

    return PoseManager.results

        .poseLandmarks.length;

}

/* ==========================================
   현재 상태
========================================== */

function poseStatus(){

    return{

        running:

            PoseManager.running,

        detected:

            personDetected(),

        landmarks:

            landmarkCount()

    };

}
/* ==========================================
   자세 계산
========================================== */

function calculatePose(results){

    if(!results.poseLandmarks){

        return;

    }

    calculateJointAngles();

    calculateBalance();

    calculateScore();

}

/* ==========================================
   관절 각도
========================================== */

function calculateJointAngles(){

    const leftKnee = Utils.angle(

        point(23),

        point(25),

        point(27)

    );

    const rightKnee = Utils.angle(

        point(24),

        point(26),

        point(28)

    );

    const leftHip = Utils.angle(

        point(11),

        point(23),

        point(25)

    );

    const rightHip = Utils.angle(

        point(12),

        point(24),

        point(26)

    );

    const leftElbow = Utils.angle(

        point(11),

        point(13),

        point(15)

    );

    const rightElbow = Utils.angle(

        point(12),

        point(14),

        point(16)

    );

    const leftShoulder = Utils.angle(

        point(13),

        point(11),

        point(23)

    );

    const rightShoulder = Utils.angle(

        point(14),

        point(12),

        point(24)

    );

    PoseManager.angles = {

        leftKnee,

        rightKnee,

        leftHip,

        rightHip,

        leftElbow,

        rightElbow,

        leftShoulder,

        rightShoulder

    };

}

/* ==========================================
   좌우 균형
========================================== */

function calculateBalance(){

    const left = PoseManager.angles.leftKnee;

    const right = PoseManager.angles.rightKnee;

    PoseManager.balance =

        Math.abs(left-right);

}

/* ==========================================
   AI 점수
========================================== */

function calculateScore(){

    let score = 100;

    score -= PoseManager.balance;

    if(score<0){

        score = 0;

    }

    PoseManager.score =

        Math.round(score);

}

/* ==========================================
   점수 출력
========================================== */

function updatePoseScore(){

    const score=document.getElementById(

        "poseScore"

    );

    if(!score){

        return;

    }

    score.innerHTML=

        PoseManager.score+"점";

}

/* ==========================================
   각도 출력
========================================== */

function updateAngleInfo(){

    const info=document.getElementById(

        "angleInfo"

    );

    if(!info){

        return;

    }

    info.innerHTML=`

    왼쪽 무릎 :
    ${PoseManager.angles.leftKnee}°

    <br>

    오른쪽 무릎 :
    ${PoseManager.angles.rightKnee}°

    <br>

    왼쪽 엉덩이 :
    ${PoseManager.angles.leftHip}°

    <br>

    오른쪽 엉덩이 :
    ${PoseManager.angles.rightHip}°

    <br>

    왼쪽 팔꿈치 :
    ${PoseManager.angles.leftElbow}°

    <br>

    오른쪽 팔꿈치 :
    ${PoseManager.angles.rightElbow}°

    `;

}

/* ==========================================
   화면 업데이트
========================================== */

setInterval(()=>{

    if(!PoseManager.running){

        return;

    }

    updatePoseScore();

    updateAngleInfo();

},100);
/* ==========================================
   종목별 분석
========================================== */

function analyzeSport(sport){

    switch(sport){

        case "웨이트":

            analyzeWeight();

            break;

        case "체대입시":

            analyzePE();

            break;

        case "사격":

            analyzeShooting();

            break;

        case "바이애슬론":

            analyzeBiathlon();

            break;

        case "축구":

            analyzeFootball();

            break;

        case "농구":

            analyzeBasketball();

            break;

        default:

            PoseManager.feedback="종목을 선택하세요.";

    }

}

/* ==========================================
   웨이트
========================================== */

function analyzeWeight(){

    const knee =

        PoseManager.angles.leftKnee;

    const hip =

        PoseManager.angles.leftHip;

    if(

        knee>=80 &&

        knee<=110 &&

        hip>=70 &&

        hip<=120

    ){

        PoseManager.feedback="좋은 자세입니다.";

        PoseManager.color="#00ff00";

    }

    else{

        PoseManager.feedback=

        "무릎과 엉덩이 각도를 조정하세요.";

        PoseManager.color="#ff0000";

    }

}

/* ==========================================
   체대입시
========================================== */

function analyzePE(){

    if(

        PoseManager.score>=90

    ){

        PoseManager.feedback=

        "체대입시 기준 우수";

        PoseManager.color="#00ff00";

    }

    else if(

        PoseManager.score>=70

    ){

        PoseManager.feedback=

        "보통";

        PoseManager.color="#ffff00";

    }

    else{

        PoseManager.feedback=

        "자세 교정 필요";

        PoseManager.color="#ff0000";

    }

}

/* ==========================================
   사격
========================================== */

function analyzeShooting(){

    PoseManager.feedback=

    "상체 흔들림 분석";

}

/* ==========================================
   바이애슬론
========================================== */

function analyzeBiathlon(){

    PoseManager.feedback=

    "스키 + 사격 자세 분석";

}

/* ==========================================
   축구
========================================== */

function analyzeFootball(){

    PoseManager.feedback=

    "킥 자세 분석";

}

/* ==========================================
   농구
========================================== */

function analyzeBasketball(){

    PoseManager.feedback=

    "슈팅 자세 분석";

}

/* ==========================================
   AI 피드백
========================================== */

function updateFeedback(){

    const feedback=

    document.getElementById(

        "poseFeedback"

    );

    if(!feedback){

        return;

    }

    feedback.innerHTML=

    PoseManager.feedback;

    feedback.style.color=

    PoseManager.color;

}

/* ==========================================
   자동 갱신
========================================== */

setInterval(()=>{

    if(!PoseManager.running){

        return;

    }

    const sport=document.getElementById(

        "sportSelect"

    );

    if(sport){

        analyzeSport(

            sport.value

        );

    }

    updateFeedback();

},100);
/* ==========================================
   자세 캡처
========================================== */

function capturePose(){

    if(typeof capturePhoto==="function"){

        capturePhoto();

    }

}

/* ==========================================
   선수 연결
========================================== */

function attachAthlete(id){

    PoseManager.athlete=id;

}

/* ==========================================
   Polar 심박수
========================================== */

PoseManager.heartRate=0;

function updateHeartRate(rate){

    PoseManager.heartRate=rate;

}

/* ==========================================
   리포트 생성
========================================== */

function createPoseReport(){

    const reports=loadReports();

    reports.push({

        id:Utils.uuid(),

        athleteId:PoseManager.athlete,

        type:"자세분석",

        score:PoseManager.score,

        balance:PoseManager.balance,

        heartRate:PoseManager.heartRate,

        feedback:PoseManager.feedback,

        date:Utils.today(),

        createdAt:Utils.dateTime()

    });

    saveReports(reports);

}

/* ==========================================
   영상분석 연결
========================================== */

function sendPoseToVideo(){

    console.log(

        "Video Analysis Connected"

    );

}

/* ==========================================
   히트맵 연결
========================================== */

function sendPoseToHeatmap(){

    console.log(

        "Heatmap Connected"

    );

}

/* ==========================================
   국가대표 평가
========================================== */

function nationalTeamEvaluation(){

    if(PoseManager.score>=95){

        return "국가대표 수준";

    }

    if(PoseManager.score>=90){

        return "우수";

    }

    if(PoseManager.score>=80){

        return "양호";

    }

    if(PoseManager.score>=70){

        return "보통";

    }

    return "교정 필요";

}

/* ==========================================
   AI 개선점
========================================== */

function aiRecommendation(){

    if(PoseManager.balance>10){

        return "좌우 균형 훈련이 필요합니다.";

    }

    if(PoseManager.score<80){

        return "관절 각도 개선이 필요합니다.";

    }

    return "현재 자세를 유지하세요.";

}

/* ==========================================
   AI 결과 출력
========================================== */

function updateAIResult(){

    const result=document.getElementById(

        "aiResult"

    );

    if(!result){

        return;

    }

    result.innerHTML=

    `
    <h3>${nationalTeamEvaluation()}</h3>

    <p>

    AI 점수 : ${PoseManager.score}

    </p>

    <p>

    심박수 : ${PoseManager.heartRate}

    BPM

    </p>

    <p>

    ${aiRecommendation()}

    </p>
    `;

}

/* ==========================================
   자동 저장
========================================== */

setInterval(()=>{

    if(!PoseManager.running){

        return;

    }

    updateAIResult();

},500);

/* ==========================================
   종료
========================================== */

function destroyPose(){

    PoseManager.running=false;

    PoseManager.results=null;

    PoseManager.score=0;

    PoseManager.balance=0;

}