/*
=========================================================
 설천고 스포츠과학 훈련센터 PRO
 File : shooting.js
 Version : 1.0.0
=========================================================
*/

const ShootingManager={

    sessions:[],

    current:null,

    athlete:null,

    target:null,

    shots:[],

    score:0,

    averageScore:0,

    totalShots:0,

    groupSize:0,

    weapon:"",

    distance:50,

    mode:"precision"

};

/* ==========================================
   초기화
========================================== */

function initializeShooting(){

    ShootingManager.sessions=

        loadShootingData()||[];

}

/* ==========================================
   세션 생성
========================================== */

function createSession(data){

    const session={

        id:Utils.uuid(),

        athleteId:data.athleteId,

        event:data.event,

        weapon:data.weapon,

        distance:data.distance,

        date:Utils.today(),

        shots:[],

        memo:"",

        createdAt:Utils.dateTime(),

        updatedAt:Utils.dateTime()

    };

    ShootingManager.current=session;

    return session;

}

/* ==========================================
   저장
========================================== */

function saveSession(){

    if(!ShootingManager.current){

        return;

    }

    ShootingManager.sessions.push(

        ShootingManager.current

    );

    saveShootingData(

        ShootingManager.sessions

    );

}

/* ==========================================
   삭제
========================================== */

function deleteSession(id){

    ShootingManager.sessions=

        ShootingManager.sessions.filter(

            item=>item.id!==id

        );

    saveShootingData(

        ShootingManager.sessions

    );

}

/* ==========================================
   불러오기
========================================== */

function getSession(id){

    return ShootingManager.sessions.find(

        item=>item.id===id

    );

}

/* ==========================================
   수정
========================================== */

function updateSession(id,data){

    const session=getSession(id);

    if(!session){

        return;

    }

    Object.assign(

        session,

        data

    );

    session.updatedAt=

        Utils.dateTime();

    saveShootingData(

        ShootingManager.sessions

    );

}
/* ==========================================
   탄착 추가
========================================== */

function addShot(x,y,score){

    if(!ShootingManager.current){

        return;

    }

    const shot={

        id:Utils.uuid(),

        x:Number(x),

        y:Number(y),

        score:Number(score),

        createdAt:Utils.dateTime()

    };

    ShootingManager.current.shots.push(shot);

    calculateStatistics();

}

/* ==========================================
   탄착 삭제
========================================== */

function deleteShot(id){

    if(!ShootingManager.current){

        return;

    }

    ShootingManager.current.shots=

        ShootingManager.current.shots.filter(

            shot=>shot.id!==id

        );

    calculateStatistics();

}

/* ==========================================
   총점
========================================== */

function calculateTotalScore(){

    if(!ShootingManager.current){

        return 0;

    }

    return ShootingManager.current.shots.reduce(

        (sum,shot)=>sum+shot.score,

        0

    );

}

/* ==========================================
   평균 점수
========================================== */

function calculateAverageScore(){

    if(

        !ShootingManager.current ||

        ShootingManager.current.shots.length===0

    ){

        return 0;

    }

    return Utils.round(

        calculateTotalScore()/

        ShootingManager.current.shots.length

    );

}

/* ==========================================
   최고 점수
========================================== */

function getBestShot(){

    if(

        !ShootingManager.current ||

        ShootingManager.current.shots.length===0

    ){

        return null;

    }

    return ShootingManager.current.shots.reduce(

        (best,current)=>

            current.score>best.score

            ?current

            :best

    );

}

/* ==========================================
   탄착군(Group Size)
========================================== */

function calculateGroupSize(){

    if(

        !ShootingManager.current ||

        ShootingManager.current.shots.length<2

    ){

        return 0;

    }

    let maxDistance=0;

    const shots=

        ShootingManager.current.shots;

    for(let i=0;i<shots.length;i++){

        for(let j=i+1;j<shots.length;j++){

            const d=Utils.distance(

                shots[i].x,

                shots[i].y,

                shots[j].x,

                shots[j].y

            );

            if(d>maxDistance){

                maxDistance=d;

            }

        }

    }

    return Utils.round(maxDistance);

}

/* ==========================================
   통계 계산
========================================== */

function calculateStatistics(){

    ShootingManager.totalShots=

        ShootingManager.current.shots.length;

    ShootingManager.score=

        calculateTotalScore();

    ShootingManager.averageScore=

        calculateAverageScore();

    ShootingManager.groupSize=

        calculateGroupSize();

}

/* ==========================================
   통계 출력
========================================== */

function updateShootingInfo(){

    const info=document.getElementById(

        "shootingInfo"

    );

    if(!info){

        return;

    }

    info.innerHTML=`

        총 발수 :
        ${ShootingManager.totalShots}<br>

        총점 :
        ${ShootingManager.score}<br>

        평균 :
        ${ShootingManager.averageScore}<br>

        탄착군 :
        ${ShootingManager.groupSize}px

    `;

}
/* ==========================================
   탄착 중심(Center of Impact)
========================================== */

function calculateCenterOfImpact(){

    if(
        !ShootingManager.current ||
        ShootingManager.current.shots.length===0
    ){
        return {x:0,y:0};
    }

    let sumX=0;
    let sumY=0;

    ShootingManager.current.shots.forEach(shot=>{

        sumX+=shot.x;
        sumY+=shot.y;

    });

    return{

        x:Utils.round(sumX/ShootingManager.current.shots.length),

        y:Utils.round(sumY/ShootingManager.current.shots.length)

    };

}

/* ==========================================
   영점 편차
========================================== */

function calculateZeroOffset(){

    const center=calculateCenterOfImpact();

    return{

        leftRight:Utils.round(center.x),

        upDown:Utils.round(center.y)

    };

}

/* ==========================================
   좌우 흔들림
========================================== */

function calculateHorizontalSpread(){

    if(
        !ShootingManager.current ||
        ShootingManager.current.shots.length===0
    ){
        return 0;
    }

    const xs=ShootingManager.current.shots.map(

        shot=>shot.x

    );

    return Math.max(...xs)-Math.min(...xs);

}

/* ==========================================
   상하 흔들림
========================================== */

function calculateVerticalSpread(){

    if(
        !ShootingManager.current ||
        ShootingManager.current.shots.length===0
    ){
        return 0;
    }

    const ys=ShootingManager.current.shots.map(

        shot=>shot.y

    );

    return Math.max(...ys)-Math.min(...ys);

}

/* ==========================================
   조준 안정성
========================================== */

function calculateStability(){

    const group=calculateGroupSize();

    if(group<=10){

        return "매우 안정";

    }

    if(group<=20){

        return "안정";

    }

    if(group<=35){

        return "보통";

    }

    return "불안정";

}

/* ==========================================
   바람 보정
========================================== */

function calculateWindCorrection(speed,direction){

    return{

        speed:speed,

        direction:direction,

        correction:

            Utils.round(speed*0.15)

    };

}

/* ==========================================
   심박수 연결
========================================== */

function connectPolarShooting(data){

    ShootingManager.heartRate=data;

}

/* ==========================================
   AI 분석
========================================== */

function analyzeShootingAI(){

    return{

        center:

            calculateCenterOfImpact(),

        group:

            calculateGroupSize(),

        horizontal:

            calculateHorizontalSpread(),

        vertical:

            calculateVerticalSpread(),

        stability:

            calculateStability(),

        average:

            calculateAverageScore()

    };

}

/* ==========================================
   결과 출력
========================================== */

function updateAIResult(){

    const result=document.getElementById(

        "shootingAI"

    );

    if(!result){

        return;

    }

    const ai=analyzeShootingAI();

    result.innerHTML=`

    평균점수 : ${ai.average}<br>

    탄착군 : ${ai.group}<br>

    좌우편차 : ${ai.horizontal}<br>

    상하편차 : ${ai.vertical}<br>

    안정성 : ${ai.stability}

    `;

}
/* ==========================================
   시리즈 생성
========================================== */

function createSeries(size=5){

    if(!ShootingManager.current){

        return;

    }

    if(!ShootingManager.current.series){

        ShootingManager.current.series=[];

    }

    const shots=ShootingManager.current.shots;

    const series=[];

    for(let i=0;i<shots.length;i+=size){

        series.push(

            shots.slice(i,i+size)

        );

    }

    ShootingManager.current.series=series;

}

/* ==========================================
   시리즈 점수
========================================== */

function calculateSeriesScore(index){

    if(!ShootingManager.current){

        return 0;

    }

    const series=

        ShootingManager.current.series[index];

    if(!series){

        return 0;

    }

    return series.reduce(

        (sum,shot)=>sum+shot.score,

        0

    );

}

/* ==========================================
   발사 간격
========================================== */

function calculateShotIntervals(){

    if(!ShootingManager.current){

        return [];

    }

    const intervals=[];

    const shots=

        ShootingManager.current.shots;

    for(let i=1;i<shots.length;i++){

        intervals.push(

            (

                new Date(shots[i].createdAt)-

                new Date(shots[i-1].createdAt)

            )/1000

        );

    }

    return intervals;

}

/* ==========================================
   평균 발사 간격
========================================== */

function getAverageShotInterval(){

    const intervals=

        calculateShotIntervals();

    if(intervals.length===0){

        return 0;

    }

    const total=

        intervals.reduce(

            (a,b)=>a+b,

            0

        );

    return Utils.round(

        total/

        intervals.length

    );

}

/* ==========================================
   명중률
========================================== */

function calculateHitRate(minScore=9){

    if(

        !ShootingManager.current ||

        ShootingManager.current.shots.length===0

    ){

        return 0;

    }

    const hit=

        ShootingManager.current.shots.filter(

            shot=>shot.score>=minScore

        ).length;

    return Utils.round(

        hit/

        ShootingManager.current.shots.length*100

    );

}

/* ==========================================
   점수 추이
========================================== */

function createScoreHistory(){

    if(!ShootingManager.current){

        return [];

    }

    return ShootingManager.current.shots.map(

        (shot,index)=>{

            return{

                x:index+1,

                y:shot.score

            };

        }

    );

}

/* ==========================================
   최고 경기
========================================== */

function getBestSession(){

    if(

        ShootingManager.sessions.length===0

    ){

        return null;

    }

    return ShootingManager.sessions.reduce(

        (best,current)=>{

            const bestScore=

                best.shots.reduce(

                    (a,b)=>a+b.score,

                    0

                );

            const currentScore=

                current.shots.reduce(

                    (a,b)=>a+b.score,

                    0

                );

            return currentScore>bestScore

                ?current

                :best;

        }

    );

}

/* ==========================================
   Report 연결
========================================== */

function sendShootingReport(){

    if(

        typeof attachShootingResult

        !=="function"

    ){

        return;

    }

    attachShootingResult({

        totalScore:

            calculateTotalScore(),

        averageScore:

            calculateAverageScore(),

        groupSize:

            calculateGroupSize(),

        hitRate:

            calculateHitRate(),

        stability:

            calculateStability()

    });

}
/* ==========================================
   조준 흔들림 분석
========================================== */

function calculateAimStability(){

    if(!ShootingManager.current){

        return 0;

    }

    const group=calculateGroupSize();

    const stability=Math.max(

        0,

        100-group

    );

    return Utils.round(stability);

}

/* ==========================================
   탄착군 변화
========================================== */

function getGroupTrend(){

    if(

        !ShootingManager.current ||

        !ShootingManager.current.series

    ){

        return [];

    }

    return ShootingManager.current.series.map(

        (series,index)=>{

            const temp={

                shots:series

            };

            const old=ShootingManager.current;

            ShootingManager.current=temp;

            const group=calculateGroupSize();

            ShootingManager.current=old;

            return{

                series:index+1,

                group

            };

        }

    );

}

/* ==========================================
   Polar 연동 분석
========================================== */

function analyzeHeartRateEffect(){

    if(

        !ShootingManager.heartRate

    ){

        return{

            average:0,

            comment:"심박 데이터 없음"

        };

    }

    const avg=

        ShootingManager.heartRate.average||

        0;

    return{

        average:avg,

        comment:

        avg>170

        ?

        "심박수가 높아 조준 안정성이 떨어질 수 있습니다."

        :

        "심박수가 안정적입니다."

    };

}

/* ==========================================
   경기 리포트 생성
========================================== */

function createShootingReport(){

    return{

        score:

            calculateTotalScore(),

        average:

            calculateAverageScore(),

        group:

            calculateGroupSize(),

        stability:

            calculateAimStability(),

        hitRate:

            calculateHitRate(),

        heartRate:

            analyzeHeartRateEffect()

    };

}

/* ==========================================
   CSV 저장
========================================== */

function exportShootingCSV(){

    const rows=[

        "번호,X,Y,점수"

    ];

    ShootingManager.current.shots.forEach(

        (shot,index)=>{

            rows.push(

                `${index+1},${shot.x},${shot.y},${shot.score}`

            );

        }

    );

    Utils.download(

        "shooting.csv",

        rows.join("\n")

    );

}

/* ==========================================
   Firebase 저장
========================================== */

async function uploadShooting(){

    console.log(

        "Firebase Upload"

    );

}

/* ==========================================
   AI 코칭
========================================== */

function getAICoaching(){

    const advice=[];

    if(calculateHitRate()<80){

        advice.push(

            "조준 안정성 훈련을 권장합니다."

        );

    }

    if(calculateGroupSize()>25){

        advice.push(

            "방아쇠 조작과 호흡을 점검하세요."

        );

    }

    if(calculateAimStability()<80){

        advice.push(

            "자세 유지 훈련을 늘려보세요."

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
   경기 모드
========================================== */

function setCompetitionMode(mode){

    ShootingManager.mode=mode;

}

/* ==========================================
   종료
========================================== */

function destroyShooting(){

    ShootingManager.current=null;

    ShootingManager.score=0;

    ShootingManager.averageScore=0;

    ShootingManager.totalShots=0;

    ShootingManager.groupSize=0;

}