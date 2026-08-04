/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : heatmap.js
 Part 1 / 5
=========================================================
*/

const HeatmapManager = {

    points: [],

    canvas: null,

    ctx: null,

    width: 0,

    height: 0,

    sport: "축구",

    tracking: false

};

/* ==========================================
   초기화
========================================== */

function initializeHeatmap(){

    HeatmapManager.canvas =

        document.getElementById("heatmapCanvas");

    if(!HeatmapManager.canvas){

        return;

    }

    HeatmapManager.ctx =

        HeatmapManager.canvas.getContext("2d");

    HeatmapManager.width =

        HeatmapManager.canvas.width;

    HeatmapManager.height =

        HeatmapManager.canvas.height;

}

/* ==========================================
   추적 시작
========================================== */

function startTracking(){

    HeatmapManager.points=[];

    HeatmapManager.tracking=true;

}

/* ==========================================
   추적 종료
========================================== */

function stopTracking(){

    HeatmapManager.tracking=false;

}

/* ==========================================
   좌표 추가
========================================== */

function addPoint(x,y){

    if(!HeatmapManager.tracking){

        return;

    }

    HeatmapManager.points.push({

        x,

        y,

        time:Date.now()

    });

}

/* ==========================================
   전체 삭제
========================================== */

function clearHeatmap(){

    HeatmapManager.points=[];

    HeatmapManager.ctx.clearRect(

        0,

        0,

        HeatmapManager.width,

        HeatmapManager.height

    );

}
/* ==========================================
   히트맵 그리기
========================================== */

function drawHeatmap(){

    if(!HeatmapManager.ctx){

        return;

    }

    const ctx = HeatmapManager.ctx;

    ctx.clearRect(

        0,

        0,

        HeatmapManager.width,

        HeatmapManager.height

    );

    HeatmapManager.points.forEach(point=>{

        const gradient = ctx.createRadialGradient(

            point.x,

            point.y,

            5,

            point.x,

            point.y,

            35

        );

        gradient.addColorStop(

            0,

            "rgba(255,0,0,0.8)"

        );

        gradient.addColorStop(

            0.5,

            "rgba(255,165,0,0.5)"

        );

        gradient.addColorStop(

            1,

            "rgba(255,255,0,0)"

        );

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(

            point.x,

            point.y,

            35,

            0,

            Math.PI*2

        );

        ctx.fill();

    });

}

/* ==========================================
   이동경로
========================================== */

function drawPath(){

    if(

        HeatmapManager.points.length < 2

    ){

        return;

    }

    const ctx = HeatmapManager.ctx;

    ctx.beginPath();

    ctx.strokeStyle = "#00ffff";

    ctx.lineWidth = 3;

    HeatmapManager.points.forEach(

        (point,index)=>{

            if(index===0){

                ctx.moveTo(

                    point.x,

                    point.y

                );

            }

            else{

                ctx.lineTo(

                    point.x,

                    point.y

                );

            }

        }

    );

    ctx.stroke();

}

/* ==========================================
   시작 위치
========================================== */

function drawStartPoint(){

    if(

        HeatmapManager.points.length===0

    ){

        return;

    }

    const p = HeatmapManager.points[0];

    const ctx = HeatmapManager.ctx;

    ctx.beginPath();

    ctx.fillStyle="#00ff00";

    ctx.arc(

        p.x,

        p.y,

        10,

        0,

        Math.PI*2

    );

    ctx.fill();

}

/* ==========================================
   종료 위치
========================================== */

function drawEndPoint(){

    if(

        HeatmapManager.points.length===0

    ){

        return;

    }

    const p =

        HeatmapManager.points[

            HeatmapManager.points.length-1

        ];

    const ctx = HeatmapManager.ctx;

    ctx.beginPath();

    ctx.fillStyle="#ff0000";

    ctx.arc(

        p.x,

        p.y,

        10,

        0,

        Math.PI*2

    );

    ctx.fill();

}

/* ==========================================
   전체 갱신
========================================== */

function updateHeatmap(){

    drawHeatmap();

    drawPath();

    drawStartPoint();

    drawEndPoint();

}

/* ==========================================
   자동 갱신
========================================== */

setInterval(()=>{

    if(

        HeatmapManager.tracking

    ){

        updateHeatmap();

    }

},100);
/* ==========================================
   총 이동거리
========================================== */

function getTotalDistance(){

    let total = 0;

    for(let i=1;i<HeatmapManager.points.length;i++){

        const p1 = HeatmapManager.points[i-1];

        const p2 = HeatmapManager.points[i];

        total += Utils.distance(

            p1.x,

            p1.y,

            p2.x,

            p2.y

        );

    }

    return Utils.round(total);

}

/* ==========================================
   활동 시간
========================================== */

function getActivityTime(){

    if(HeatmapManager.points.length<2){

        return 0;

    }

    const first = HeatmapManager.points[0].time;

    const last =

        HeatmapManager.points[

            HeatmapManager.points.length-1

        ].time;

    return Utils.round(

        (last-first)/1000

    );

}

/* ==========================================
   평균 속도
========================================== */

function getAverageSpeed(){

    const time = getActivityTime();

    if(time===0){

        return 0;

    }

    return Utils.round(

        getTotalDistance()/time

    );

}

/* ==========================================
   최고 속도
========================================== */

function getMaxSpeed(){

    let max = 0;

    for(let i=1;i<HeatmapManager.points.length;i++){

        const p1 = HeatmapManager.points[i-1];

        const p2 = HeatmapManager.points[i];

        const distance = Utils.distance(

            p1.x,

            p1.y,

            p2.x,

            p2.y

        );

        const dt =

            (p2.time-p1.time)/1000;

        if(dt===0){

            continue;

        }

        const speed = distance/dt;

        if(speed>max){

            max = speed;

        }

    }

    return Utils.round(max);

}

/* ==========================================
   활동 강도
========================================== */

function getIntensity(){

    const speed = getAverageSpeed();

    if(speed<2){

        return "낮음";

    }

    if(speed<5){

        return "보통";

    }

    if(speed<8){

        return "높음";

    }

    return "매우 높음";

}

/* ==========================================
   활동 점수
========================================== */

function getActivityScore(){

    let score = 100;

    score += Math.min(

        getAverageSpeed()*2,

        20

    );

    score += Math.min(

        HeatmapManager.points.length/10,

        20

    );

    return Math.min(

        Math.round(score),

        100

    );

}

/* ==========================================
   정보 출력
========================================== */

function updateHeatmapInfo(){

    const info = document.getElementById(

        "heatmapInfo"

    );

    if(!info){

        return;

    }

    info.innerHTML = `

    총 이동거리 :
    ${getTotalDistance()} px

    <br>

    활동시간 :
    ${getActivityTime()} 초

    <br>

    평균속도 :
    ${getAverageSpeed()}

    <br>

    최고속도 :
    ${getMaxSpeed()}

    <br>

    활동강도 :
    ${getIntensity()}

    <br>

    활동점수 :
    ${getActivityScore()}점

    `;

}

/* ==========================================
   자동 업데이트
========================================== */

setInterval(()=>{

    if(

        HeatmapManager.tracking

    ){

        updateHeatmapInfo();

    }

},500);
/* ==========================================
   종목 선택
========================================== */

function setSport(sport){

    HeatmapManager.sport = sport;

}

/* ==========================================
   종목별 분석
========================================== */

function analyzeSportHeatmap(){

    switch(HeatmapManager.sport){

        case "축구":

            analyzeFootballHeatmap();

            break;

        case "농구":

            analyzeBasketballHeatmap();

            break;

        case "배구":

            analyzeVolleyballHeatmap();

            break;

        case "바이애슬론":

            analyzeBiathlonHeatmap();

            break;

        case "사격":

            analyzeShootingHeatmap();

            break;

        case "육상":

            analyzeRunningHeatmap();

            break;

        default:

            HeatmapManager.result =

            "분석할 종목을 선택하세요.";

    }

}

/* ==========================================
   축구
========================================== */

function analyzeFootballHeatmap(){

    const distance = getTotalDistance();

    const score = getActivityScore();

    HeatmapManager.result = {

        sport : "축구",

        activity : getIntensity(),

        distance : distance,

        score : score,

        comment :

        score >= 90 ?

        "활동량이 매우 우수합니다."

        :

        "활동량을 조금 더 늘려보세요."

    };

}

/* ==========================================
   농구
========================================== */

function analyzeBasketballHeatmap(){

    HeatmapManager.result = {

        sport : "농구",

        attackZone : "자동 분석",

        defenseZone : "자동 분석",

        transition : "자동 분석",

        score : getActivityScore()

    };

}

/* ==========================================
   배구
========================================== */

function analyzeVolleyballHeatmap(){

    HeatmapManager.result = {

        sport : "배구",

        movement : getTotalDistance(),

        jumpArea : "자동 분석",

        score : getActivityScore()

    };

}

/* ==========================================
   바이애슬론
========================================== */

function analyzeBiathlonHeatmap(){

    HeatmapManager.result = {

        sport : "바이애슬론",

        skiDistance : getTotalDistance(),

        skiSpeed : getAverageSpeed(),

        shootingPoint :

        "자동 분석",

        score : getActivityScore()

    };

}

/* ==========================================
   사격
========================================== */

function analyzeShootingHeatmap(){

    HeatmapManager.result = {

        sport : "사격",

        stance :

        "자동 분석",

        movement :

        getTotalDistance(),

        score :

        getActivityScore()

    };

}

/* ==========================================
   육상
========================================== */

function analyzeRunningHeatmap(){

    HeatmapManager.result = {

        sport : "육상",

        distance :

        getTotalDistance(),

        averageSpeed :

        getAverageSpeed(),

        maxSpeed :

        getMaxSpeed(),

        score :

        getActivityScore()

    };

}

/* ==========================================
   결과 출력
========================================== */

function updateHeatmapResult(){

    const result = document.getElementById(

        "heatmapResult"

    );

    if(!result){

        return;

    }

    result.innerHTML =

        JSON.stringify(

            HeatmapManager.result,

            null,

            4

        );

}

/* ==========================================
   자동 분석
========================================== */

setInterval(()=>{

    if(!HeatmapManager.tracking){

        return;

    }

    analyzeSportHeatmap();

    updateHeatmapResult();

},1000);
/* ==========================================
   Polar GPS 데이터
========================================== */

HeatmapManager.gps = [];

function importGPSData(data){

    if(!Array.isArray(data)){

        return;

    }

    HeatmapManager.gps = data;

}

/* ==========================================
   GPS → 히트맵 변환
========================================== */

function convertGPSPoints(){

    HeatmapManager.points = [];

    HeatmapManager.gps.forEach(item=>{

        HeatmapManager.points.push({

            x:item.x,

            y:item.y,

            time:item.time

        });

    });

}

/* ==========================================
   Polar 심박수
========================================== */

HeatmapManager.heartRate = [];

function updateHeartRate(value){

    HeatmapManager.heartRate.push({

        time:Date.now(),

        bpm:value

    });

}

/* ==========================================
   평균 심박수
========================================== */

function getAverageHeartRate(){

    if(

        HeatmapManager.heartRate.length===0

    ){

        return 0;

    }

    let total=0;

    HeatmapManager.heartRate.forEach(item=>{

        total+=item.bpm;

    });

    return Math.round(

        total/

        HeatmapManager.heartRate.length

    );

}

/* ==========================================
   활동 구역
========================================== */

function calculateActivityZone(){

    const score=getActivityScore();

    if(score>=90){

        return "매우 활동적";

    }

    if(score>=75){

        return "활동적";

    }

    if(score>=60){

        return "보통";

    }

    return "활동 부족";

}

/* ==========================================
   AI 평가
========================================== */

function aiHeatmapEvaluation(){

    return{

        activity:getIntensity(),

        score:getActivityScore(),

        averageSpeed:getAverageSpeed(),

        maxSpeed:getMaxSpeed(),

        averageHeartRate:getAverageHeartRate(),

        zone:calculateActivityZone()

    };

}

/* ==========================================
   리포트 저장
========================================== */

function createHeatmapReport(){

    const reports=loadReports();

    reports.push({

        id:Utils.uuid(),

        type:"히트맵",

        sport:HeatmapManager.sport,

        score:getActivityScore(),

        distance:getTotalDistance(),

        averageSpeed:getAverageSpeed(),

        maxSpeed:getMaxSpeed(),

        averageHeartRate:getAverageHeartRate(),

        createdAt:Utils.dateTime()

    });

    saveReports(reports);

}

/* ==========================================
   Pose 연결
========================================== */

function connectPoseHeatmap(){

    console.log(

        "Pose Connected"

    );

}

/* ==========================================
   Video 연결
========================================== */

function connectVideoHeatmap(){

    console.log(

        "Video Connected"

    );

}

/* ==========================================
   Athlete 연결
========================================== */

function connectAthleteHeatmap(id){

    if(typeof selectAthlete==="function"){

        selectAthlete(id);

    }

}

/* ==========================================
   종료
========================================== */

function destroyHeatmap(){

    HeatmapManager.points=[];

    HeatmapManager.gps=[];

    HeatmapManager.heartRate=[];

    HeatmapManager.tracking=false;

}