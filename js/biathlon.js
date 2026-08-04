/*
=========================================================
 설천고 스포츠과학 훈련센터 PRO
 File : biathlon.js
 Version : 1.0.0
=========================================================
*/

const BiathlonManager={

    sessions:[],

    current:null,

    athleteId:null,

    laps:[],

    shootings:[],

    skiTime:0,

    shootingTime:0,

    totalTime:0,

    penalty:0,

    distance:0,

    heartRate:[]

};

/* ==========================================
   초기화
========================================== */

function initializeBiathlon(){

    BiathlonManager.sessions=

        loadBiathlonData()||[];

}

/* ==========================================
   세션 생성
========================================== */

function createBiathlonSession(data){

    const session={

        id:Utils.uuid(),

        athleteId:data.athleteId,

        event:data.event,

        distance:data.distance,

        laps:[],

        shootings:[],

        memo:"",

        createdAt:Utils.dateTime(),

        updatedAt:Utils.dateTime()

    };

    BiathlonManager.current=session;

    return session;

}

/* ==========================================
   저장
========================================== */

function saveBiathlonSession(){

    if(!BiathlonManager.current){

        return;

    }

    BiathlonManager.sessions.push(

        BiathlonManager.current

    );

    saveBiathlonData(

        BiathlonManager.sessions

    );

}

/* ==========================================
   삭제
========================================== */

function deleteBiathlonSession(id){

    BiathlonManager.sessions=

        BiathlonManager.sessions.filter(

            item=>item.id!==id

        );

    saveBiathlonData(

        BiathlonManager.sessions

    );

}

/* ==========================================
   조회
========================================== */

function getBiathlonSession(id){

    return BiathlonManager.sessions.find(

        item=>item.id===id

    );

}

/* ==========================================
   수정
========================================== */

function updateBiathlonSession(id,data){

    const session=

        getBiathlonSession(id);

    if(!session){

        return;

    }

    Object.assign(

        session,

        data

    );

    session.updatedAt=

        Utils.dateTime();

    saveBiathlonData(

        BiathlonManager.sessions

    );

}
/* ==========================================
   랩 추가
========================================== */

function addLap(time,distance){

    if(!BiathlonManager.current){

        return;

    }

    const lap={

        id:Utils.uuid(),

        lapNumber:

            BiathlonManager.current.laps.length+1,

        time:Number(time),

        distance:Number(distance),

        speed:

            Utils.round(distance/time),

        createdAt:Utils.dateTime()

    };

    BiathlonManager.current.laps.push(lap);

    calculateRaceStatistics();

}

/* ==========================================
   랩 삭제
========================================== */

function deleteLap(id){

    if(!BiathlonManager.current){

        return;

    }

    BiathlonManager.current.laps=

        BiathlonManager.current.laps.filter(

            lap=>lap.id!==id

        );

    calculateRaceStatistics();

}

/* ==========================================
   사격 결과 추가
========================================== */

function addShootingResult(data){

    if(!BiathlonManager.current){

        return;

    }

    BiathlonManager.current.shootings.push({

        id:Utils.uuid(),

        stage:data.stage,

        hits:data.hits,

        misses:data.misses,

        shootingTime:data.shootingTime,

        createdAt:Utils.dateTime()

    });

    calculatePenalty();

    calculateRaceStatistics();

}

/* ==========================================
   패널티 계산
========================================== */

function calculatePenalty(){

    let misses=0;

    BiathlonManager.current.shootings.forEach(item=>{

        misses+=item.misses;

    });

    BiathlonManager.penalty=misses;

}

/* ==========================================
   총 랩타임
========================================== */

function calculateLapTime(){

    return BiathlonManager.current.laps.reduce(

        (sum,lap)=>sum+lap.time,

        0

    );

}

/* ==========================================
   평균 속도
========================================== */

function calculateAverageSpeed(){

    const totalDistance=

        BiathlonManager.current.laps.reduce(

            (sum,lap)=>sum+lap.distance,

            0

        );

    const totalTime=

        calculateLapTime();

    if(totalTime===0){

        return 0;

    }

    return Utils.round(

        totalDistance/

        totalTime

    );

}

/* ==========================================
   최고 속도
========================================== */

function calculateMaxSpeed(){

    if(

        BiathlonManager.current.laps.length===0

    ){

        return 0;

    }

    return Math.max(

        ...BiathlonManager.current.laps.map(

            lap=>lap.speed

        )

    );

}

/* ==========================================
   경기 통계
========================================== */

function calculateRaceStatistics(){

    BiathlonManager.skiTime=

        calculateLapTime();

    BiathlonManager.shootingTime=

        BiathlonManager.current.shootings.reduce(

            (sum,item)=>

            sum+item.shootingTime,

            0

        );

    BiathlonManager.totalTime=

        BiathlonManager.skiTime+

        BiathlonManager.shootingTime;

}

/* ==========================================
   경기 정보
========================================== */

function updateRaceInfo(){

    const info=document.getElementById(

        "biathlonInfo"

    );

    if(!info){

        return;

    }

    info.innerHTML=`

    랩 :
    ${BiathlonManager.current.laps.length}<br>

    평균속도 :
    ${calculateAverageSpeed()}<br>

    최고속도 :
    ${calculateMaxSpeed()}<br>

    패널티 :
    ${BiathlonManager.penalty}<br>

    총시간 :
    ${BiathlonManager.totalTime}

    `;

}
/* ==========================================
   Polar 심박수 저장
========================================== */

function addHeartRate(time,bpm){

    if(!BiathlonManager.current){

        return;

    }

    BiathlonManager.heartRate.push({

        time:Number(time),

        bpm:Number(bpm)

    });

}

/* ==========================================
   평균 심박수
========================================== */

function calculateAverageHeartRate(){

    if(BiathlonManager.heartRate.length===0){

        return 0;

    }

    const total=

        BiathlonManager.heartRate.reduce(

            (sum,item)=>sum+item.bpm,

            0

        );

    return Math.round(

        total/

        BiathlonManager.heartRate.length

    );

}

/* ==========================================
   최고 심박수
========================================== */

function calculateMaxHeartRate(){

    if(BiathlonManager.heartRate.length===0){

        return 0;

    }

    return Math.max(

        ...BiathlonManager.heartRate.map(

            item=>item.bpm

        )

    );

}

/* ==========================================
   랩별 페이스
========================================== */

function calculateLapPace(){

    return BiathlonManager.current.laps.map(

        lap=>{

            return{

                lap:lap.lapNumber,

                pace:Utils.round(

                    lap.time/

                    lap.distance

                )

            };

        }

    );

}

/* ==========================================
   최고 랩
========================================== */

function getBestLap(){

    if(BiathlonManager.current.laps.length===0){

        return null;

    }

    return BiathlonManager.current.laps.reduce(

        (best,current)=>

            current.speed>best.speed

            ?current

            :best

    );

}

/* ==========================================
   사격장 체류시간
========================================== */

function calculateRangeTime(){

    return BiathlonManager.current.shootings.reduce(

        (sum,item)=>

        sum+item.shootingTime,

        0

    );

}

/* ==========================================
   스키 비율
========================================== */

function calculateSkiRatio(){

    if(BiathlonManager.totalTime===0){

        return 0;

    }

    return Utils.round(

        BiathlonManager.skiTime/

        BiathlonManager.totalTime*100

    );

}

/* ==========================================
   사격 비율
========================================== */

function calculateShootingRatio(){

    if(BiathlonManager.totalTime===0){

        return 0;

    }

    return Utils.round(

        BiathlonManager.shootingTime/

        BiathlonManager.totalTime*100

    );

}

/* ==========================================
   AI 경기 분석
========================================== */

function analyzeRace(){

    return{

        averageSpeed:

            calculateAverageSpeed(),

        maxSpeed:

            calculateMaxSpeed(),

        averageHeartRate:

            calculateAverageHeartRate(),

        maxHeartRate:

            calculateMaxHeartRate(),

        penalty:

            BiathlonManager.penalty,

        skiRatio:

            calculateSkiRatio(),

        shootingRatio:

            calculateShootingRatio()

    };

}

/* ==========================================
   화면 출력
========================================== */

function updateRaceAnalysis(){

    const result=

        document.getElementById(

            "raceAnalysis"

        );

    if(!result){

        return;

    }

    const ai=

        analyzeRace();

    result.innerHTML=`

    평균속도 :
    ${ai.averageSpeed}<br>

    최고속도 :
    ${ai.maxSpeed}<br>

    평균심박 :
    ${ai.averageHeartRate}<br>

    최고심박 :
    ${ai.maxHeartRate}<br>

    패널티 :
    ${ai.penalty}<br>

    스키 :
    ${ai.skiRatio}%<br>

    사격 :
    ${ai.shootingRatio}%

    `;

}
/* ==========================================
   사격 종류
========================================== */

function setShootingPosition(position){

    if(!BiathlonManager.current){

        return;

    }

    BiathlonManager.current.position = position;

}

/* ==========================================
   입사 시간
========================================== */

function setRangeEntryTime(){

    if(!BiathlonManager.current){

        return;

    }

    BiathlonManager.current.rangeEntryTime = Date.now();

}

/* ==========================================
   출사 시간
========================================== */

function setRangeExitTime(){

    if(!BiathlonManager.current){

        return;

    }

    BiathlonManager.current.rangeExitTime = Date.now();

}

/* ==========================================
   사격장 체류시간
========================================== */

function calculateRangeStayTime(){

    if(
        !BiathlonManager.current ||
        !BiathlonManager.current.rangeEntryTime ||
        !BiathlonManager.current.rangeExitTime
    ){

        return 0;

    }

    return Utils.round(

        (
            BiathlonManager.current.rangeExitTime-

            BiathlonManager.current.rangeEntryTime
        )/1000

    );

}

/* ==========================================
   사격 전 속도
========================================== */

function getPreShootingSpeed(){

    if(BiathlonManager.current.laps.length==0){

        return 0;

    }

    return BiathlonManager.current.laps[
        BiathlonManager.current.laps.length-1
    ].speed;

}

/* ==========================================
   사격 후 속도
========================================== */

function getPostShootingSpeed(){

    if(BiathlonManager.current.laps.length<2){

        return 0;

    }

    return BiathlonManager.current.laps[
        BiathlonManager.current.laps.length-2
    ].speed;

}

/* ==========================================
   사격 전 평균 심박
========================================== */

function getHeartRateBefore(){

    if(BiathlonManager.heartRate.length==0){

        return 0;

    }

    return BiathlonManager.heartRate[
        BiathlonManager.heartRate.length-1
    ].bpm;

}

/* ==========================================
   사격 후 평균 심박
========================================== */

function getHeartRateAfter(){

    if(BiathlonManager.heartRate.length<2){

        return 0;

    }

    return BiathlonManager.heartRate[
        BiathlonManager.heartRate.length-2
    ].bpm;

}

/* ==========================================
   개인 최고 기록
========================================== */

function updatePersonalBest(){

    if(!BiathlonManager.current){

        return;

    }

    const current =

        BiathlonManager.totalTime;

    const best =

        localStorage.getItem(

            "biathlonPB"

        );

    if(

        !best ||

        current<Number(best)

    ){

        localStorage.setItem(

            "biathlonPB",

            current

        );

    }

}

/* ==========================================
   개인 최고 기록 조회
========================================== */

function getPersonalBest(){

    return Number(

        localStorage.getItem(

            "biathlonPB"

        )||0

    );

}

/* ==========================================
   Report 연결
========================================== */

function sendBiathlonReport(){

    if(

        typeof attachBiathlonResult

        !=="function"

    ){

        return;

    }

    attachBiathlonResult({

        totalTime:

            BiathlonManager.totalTime,

        penalty:

            BiathlonManager.penalty,

        averageSpeed:

            calculateAverageSpeed(),

        averageHeartRate:

            calculateAverageHeartRate(),

        personalBest:

            getPersonalBest()

    });

}
/* ==========================================
   속도 그래프 데이터
========================================== */

function createSpeedGraph(){

    if(!BiathlonManager.current){

        return [];

    }

    return BiathlonManager.current.laps.map(

        lap=>{

            return{

                x:lap.lapNumber,

                y:lap.speed

            };

        }

    );

}

/* ==========================================
   명중률
========================================== */

function calculateHitRate(){

    let hit=0;

    let total=0;

    BiathlonManager.current.shootings.forEach(

        item=>{

            hit+=item.hits;

            total+=item.hits+

                   item.misses;

        }

    );

    if(total===0){

        return 0;

    }

    return Utils.round(

        hit/total*100

    );

}

/* ==========================================
   Polar Zone
========================================== */

function calculateHeartRateZone(){

    const hr=

        calculateAverageHeartRate();

    if(hr<120){

        return "Zone 1";

    }

    if(hr<140){

        return "Zone 2";

    }

    if(hr<160){

        return "Zone 3";

    }

    if(hr<180){

        return "Zone 4";

    }

    return "Zone 5";

}

/* ==========================================
   AI 경기 점수
========================================== */

function calculateRaceScore(){

    let score=100;

    score-=BiathlonManager.penalty*5;

    score-=Math.max(

        0,

        calculateAverageHeartRate()-170

    )*0.2;

    return Math.max(

        0,

        Math.round(score)

    );

}

/* ==========================================
   AI 코칭
========================================== */

function getRaceCoaching(){

    const advice=[];

    if(calculateHitRate()<80){

        advice.push(

            "사격 명중률 향상 훈련을 추천합니다."

        );

    }

    if(BiathlonManager.penalty>2){

        advice.push(

            "패널티 감소를 위한 사격 안정성 훈련이 필요합니다."

        );

    }

    if(calculateAverageHeartRate()>175){

        advice.push(

            "심박 관리와 회복 훈련을 권장합니다."

        );

    }

    if(advice.length===0){

        advice.push(

            "현재 경기력이 매우 우수합니다."

        );

    }

    return advice;

}

/* ==========================================
   Report 연동
========================================== */

function createBiathlonReport(){

    if(typeof attachBiathlonResult!=="function"){

        return;

    }

    attachBiathlonResult({

        score:calculateRaceScore(),

        hitRate:calculateHitRate(),

        averageSpeed:calculateAverageSpeed(),

        averageHeartRate:

            calculateAverageHeartRate(),

        coaching:getRaceCoaching()

    });

}

/* ==========================================
   CSV 저장
========================================== */

function exportBiathlonCSV(){

    const rows=[

        "랩,시간,거리,속도"

    ];

    BiathlonManager.current.laps.forEach(

        lap=>{

            rows.push(

`${lap.lapNumber},${lap.time},${lap.distance},${lap.speed}`

            );

        }

    );

    Utils.download(

        "biathlon.csv",

        rows.join("\n")

    );

}

/* ==========================================
   Firebase
========================================== */

async function uploadBiathlon(){

    console.log(

        "Biathlon Upload"

    );

}

/* ==========================================
   종료
========================================== */

function destroyBiathlon(){

    BiathlonManager.current=null;

    BiathlonManager.laps=[];

    BiathlonManager.shootings=[];

    BiathlonManager.heartRate=[];

}