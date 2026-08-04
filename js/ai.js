/*
=========================================================
 설천고 스포츠과학 훈련센터 PRO
 File : ai.js
 Version : 1.0.0
=========================================================
*/

const AIManager = {

    athlete: null,

    pose: null,

    weight: null,

    shooting: null,

    biathlon: null,

    polar: null,

    heatmap: null,

    report: null,

    score: 0,

    prediction: {},

    recommendation: []

};

/* ==========================================
   초기화
========================================== */

function initializeAI(){

    AIManager.score = 0;

    AIManager.prediction = {};

    AIManager.recommendation = [];

}

/* ==========================================
   선수 연결
========================================== */

function connectAthlete(data){

    AIManager.athlete = data;

}

/* ==========================================
   Pose 연결
========================================== */

function connectPose(data){

    AIManager.pose = data;

}

/* ==========================================
   Weight 연결
========================================== */

function connectWeight(data){

    AIManager.weight = data;

}

/* ==========================================
   Shooting 연결
========================================== */

function connectShooting(data){

    AIManager.shooting = data;

}

/* ==========================================
   Biathlon 연결
========================================== */

function connectBiathlon(data){

    AIManager.biathlon = data;

}

/* ==========================================
   Polar 연결
========================================== */

function connectPolar(data){

    AIManager.polar = data;

}

/* ==========================================
   Heatmap 연결
========================================== */

function connectHeatmap(data){

    AIManager.heatmap = data;

}

/* ==========================================
   Report 연결
========================================== */

function connectReport(data){

    AIManager.report = data;

}
/* ==========================================
   자세 점수
========================================== */

function getPoseScore(){

    if(!AIManager.pose){

        return 0;

    }

    return AIManager.pose.score || 0;

}

/* ==========================================
   웨이트 점수
========================================== */

function getWeightScore(){

    if(!AIManager.weight){

        return 0;

    }

    const volume =

        AIManager.weight.totalVolume || 0;

    if(volume>=30000){

        return 100;

    }

    if(volume>=20000){

        return 90;

    }

    if(volume>=10000){

        return 80;

    }

    return 60;

}

/* ==========================================
   사격 점수
========================================== */

function getShootingScore(){

    if(!AIManager.shooting){

        return 0;

    }

    return AIManager.shooting.averageScore || 0;

}

/* ==========================================
   바이애슬론 점수
========================================== */

function getBiathlonScore(){

    if(!AIManager.biathlon){

        return 0;

    }

    return AIManager.biathlon.score || 0;

}

/* ==========================================
   컨디션 점수
========================================== */

function getConditionScore(){

    if(!AIManager.polar){

        return 0;

    }

    return AIManager.polar.condition || 0;

}

/* ==========================================
   종합 AI 점수
========================================== */

function calculateAIScore(){

    const pose = getPoseScore();

    const weight = getWeightScore();

    const shooting = getShootingScore();

    const biathlon = getBiathlonScore();

    const condition = getConditionScore();

    AIManager.score = Math.round(

        pose*0.20 +

        weight*0.20 +

        shooting*0.25 +

        biathlon*0.25 +

        condition*0.10

    );

    return AIManager.score;

}

/* ==========================================
   등급
========================================== */

function calculateGrade(){

    const score = calculateAIScore();

    if(score>=95){

        return "S";

    }

    if(score>=90){

        return "A+";

    }

    if(score>=80){

        return "A";

    }

    if(score>=70){

        return "B";

    }

    if(score>=60){

        return "C";

    }

    return "D";

}

/* ==========================================
   국가대표 평가
========================================== */

function evaluateNationalLevel(){

    const score = calculateAIScore();

    if(score>=95){

        return "국가대표 수준";

    }

    if(score>=90){

        return "상위 선수";

    }

    if(score>=80){

        return "우수 선수";

    }

    if(score>=70){

        return "성장 가능";

    }

    return "훈련 필요";

}

/* ==========================================
   화면 출력
========================================== */

function updateAIOverview(){

    const area =

        document.getElementById(

            "aiOverview"

        );

    if(!area){

        return;

    }

    area.innerHTML = `

        AI 점수 :
        ${calculateAIScore()}점

        <br>

        등급 :
        ${calculateGrade()}

        <br>

        평가 :
        ${evaluateNationalLevel()}

    `;

}
/* ==========================================
   부상 위험도 분석
========================================== */

function calculateInjuryRisk(){

    let risk = 0;

    if(AIManager.polar){

        if((AIManager.polar.trainingLoad || 0) > 150){

            risk += 30;

        }

        if((AIManager.polar.recovery || "") === "회복 필요"){

            risk += 30;

        }

    }

    if(AIManager.weight){

        if((AIManager.weight.totalVolume || 0) > 30000){

            risk += 20;

        }

    }

    if(AIManager.pose){

        if((AIManager.pose.balance || 0) > 10){

            risk += 20;

        }

    }

    return Math.min(risk,100);

}

/* ==========================================
   성장 추세
========================================== */

function calculateGrowthTrend(){

    const score = calculateAIScore();

    if(score >= 95){

        return "매우 빠르게 성장 중";

    }

    if(score >= 85){

        return "꾸준히 성장 중";

    }

    if(score >= 75){

        return "점진적 성장";

    }

    return "훈련 개선 필요";

}

/* ==========================================
   훈련 부하
========================================== */

function evaluateTrainingLoad(){

    if(!AIManager.polar){

        return "데이터 없음";

    }

    const load = AIManager.polar.trainingLoad || 0;

    if(load < 50){

        return "낮음";

    }

    if(load < 100){

        return "적절";

    }

    if(load < 150){

        return "높음";

    }

    return "매우 높음";

}

/* ==========================================
   회복 상태
========================================== */

function evaluateRecovery(){

    if(!AIManager.polar){

        return "데이터 없음";

    }

    return AIManager.polar.recovery || "확인 불가";

}

/* ==========================================
   경기력 예측
========================================== */

function predictPerformance(){

    const score = calculateAIScore();

    if(score >= 95){

        return "국제대회 메달권";

    }

    if(score >= 90){

        return "국가대표 경쟁 가능";

    }

    if(score >= 80){

        return "전국대회 상위권";

    }

    if(score >= 70){

        return "경기력 향상 중";

    }

    return "훈련 필요";

}

/* ==========================================
   메달 가능성
========================================== */

function predictMedalChance(){

    const score = calculateAIScore();

    return Math.min(

        100,

        Math.round(score * 0.95)

    );

}

/* ==========================================
   다음 훈련 추천
========================================== */

function recommendNextTraining(){

    const recommendation=[];

    if(calculateInjuryRisk()>60){

        recommendation.push(

            "회복 훈련"

        );

    }

    if(getShootingScore()<85){

        recommendation.push(

            "사격 집중 훈련"

        );

    }

    if(getWeightScore()<80){

        recommendation.push(

            "근력 강화"

        );

    }

    if(getConditionScore()<70){

        recommendation.push(

            "유산소 회복"

        );

    }

    if(recommendation.length===0){

        recommendation.push(

            "경기 시뮬레이션"

        );

    }

    return recommendation;

}

/* ==========================================
   AI 분석 결과
========================================== */

function generateAIAnalysis(){

    return{

        score : calculateAIScore(),

        grade : calculateGrade(),

        national :

            evaluateNationalLevel(),

        injuryRisk :

            calculateInjuryRisk(),

        growth :

            calculateGrowthTrend(),

        trainingLoad :

            evaluateTrainingLoad(),

        recovery :

            evaluateRecovery(),

        performance :

            predictPerformance(),

        medalChance :

            predictMedalChance(),

        recommendation :

            recommendNextTraining()

    };

}

/* ==========================================
   AI 결과 출력
========================================== */

function updateAIAnalysis(){

    const result =

        document.getElementById(

            "aiAnalysis"

        );

    if(!result){

        return;

    }

    const ai = generateAIAnalysis();

    result.innerHTML = `

        AI 점수 : ${ai.score}<br>

        등급 : ${ai.grade}<br>

        국가대표 평가 : ${ai.national}<br>

        부상 위험도 : ${ai.injuryRisk}%<br>

        성장 추세 : ${ai.growth}<br>

        훈련 부하 : ${ai.trainingLoad}<br>

        회복 상태 : ${ai.recovery}<br>

        경기력 예측 : ${ai.performance}<br>

        메달 가능성 : ${ai.medalChance}%<br>

        추천 훈련 : ${ai.recommendation.join(", ")}

    `;

}
/* ==========================================
   시즌 경기력 예측
========================================== */

function predictSeasonPerformance(){

    const score = calculateAIScore();

    const trend = calculateGrowthTrend();

    let prediction = "";

    if(score >= 95){

        prediction = "국가대표 선발 가능";

    }

    else if(score >= 90){

        prediction = "전국대회 입상 가능";

    }

    else if(score >= 80){

        prediction = "전국대회 결선권";

    }

    else{

        prediction = "지속적인 훈련 필요";

    }

    return{

        score,

        trend,

        prediction

    };

}

/* ==========================================
   기록 추세
========================================== */

function analyzeRecordTrend(records){

    if(!records || records.length < 2){

        return "데이터 부족";

    }

    const first = records[0];

    const last = records[records.length-1];

    if(last > first){

        return "향상";

    }

    if(last < first){

        return "감소";

    }

    return "유지";

}

/* ==========================================
   종목별 약점
========================================== */

function analyzeWeakness(){

    const weakness = [];

    if(getShootingScore() < 85){

        weakness.push("사격");

    }

    if(getWeightScore() < 80){

        weakness.push("근력");

    }

    if(getPoseScore() < 85){

        weakness.push("자세");

    }

    if(getConditionScore() < 70){

        weakness.push("컨디션");

    }

    return weakness;

}

/* ==========================================
   맞춤 훈련 계획
========================================== */

function generateTrainingPlan(){

    const plan = [];

    const weakness = analyzeWeakness();

    weakness.forEach(item=>{

        switch(item){

            case "사격":

                plan.push("사격 안정화 훈련");

                break;

            case "근력":

                plan.push("하체·코어 근력 강화");

                break;

            case "자세":

                plan.push("자세 교정 및 밸런스");

                break;

            case "컨디션":

                plan.push("회복 및 유산소 훈련");

                break;

        }

    });

    if(plan.length===0){

        plan.push(

            "경기 시뮬레이션 훈련"

        );

    }

    return plan;

}

/* ==========================================
   국가대표 기준 비교
========================================== */

function compareNationalStandard(){

    const score = calculateAIScore();

    return{

        current:score,

        target:95,

        gap:Math.max(

            0,

            95-score

        )

    };

}

/* ==========================================
   경기 결과 시뮬레이션
========================================== */

function simulateCompetition(){

    const ai = calculateAIScore();

    const variation = Math.random()*6-3;

    return Math.max(

        0,

        Math.min(

            100,

            Math.round(ai+variation)

        )

    );

}

/* ==========================================
   Report AI 요약
========================================== */

function generateAISummary(){

    return{

        score:calculateAIScore(),

        grade:calculateGrade(),

        prediction:predictSeasonPerformance(),

        weakness:analyzeWeakness(),

        trainingPlan:generateTrainingPlan(),

        national:compareNationalStandard()

    };

}

/* ==========================================
   Report 연결
========================================== */

function sendAIReport(){

    if(typeof connectReport==="function"){

        connectReport(

            generateAISummary()

        );

    }

}

/* ==========================================
   화면 출력
========================================== */

function updateAIRecommendation(){

    const area =

        document.getElementById(

            "aiRecommendation"

        );

    if(!area){

        return;

    }

    const data =

        generateAISummary();

    area.innerHTML = `

        시즌 예측 :
        ${data.prediction.prediction}

        <br>

        약점 :
        ${data.weakness.join(", ")}

        <br>

        추천훈련 :
        ${data.trainingPlan.join(", ")}

        <br>

        국가대표 기준까지
        ${data.national.gap}점

    `;

}
/* ==========================================
   AI 코칭 엔진
========================================== */

function generateAICoaching(){

    const coaching=[];

    if(calculateInjuryRisk()>70){

        coaching.push({

            type:"warning",

            title:"부상 위험",

            message:"훈련 강도를 낮추고 회복을 우선하세요."

        });

    }

    if(getConditionScore()<70){

        coaching.push({

            type:"recovery",

            title:"컨디션",

            message:"회복훈련과 충분한 수면을 권장합니다."

        });

    }

    if(getShootingScore()<90){

        coaching.push({

            type:"shooting",

            title:"사격",

            message:"격발 안정성과 호흡 훈련을 추천합니다."

        });

    }

    if(getWeightScore()<85){

        coaching.push({

            type:"strength",

            title:"근력",

            message:"하체와 코어 근력 프로그램을 수행하세요."

        });

    }

    if(coaching.length===0){

        coaching.push({

            type:"success",

            title:"AI",

            message:"현재 훈련 상태가 매우 우수합니다."

        });

    }

    return coaching;

}

/* ==========================================
   주간 훈련 계획
========================================== */

function createWeeklyTrainingPlan(){

    return{

        monday:"근력",

        tuesday:"사격",

        wednesday:"인터벌",

        thursday:"근력",

        friday:"롤러스키",

        saturday:"모의경기",

        sunday:"회복"

    };

}

/* ==========================================
   부상 경고
========================================== */

function checkInjuryAlert(){

    return calculateInjuryRisk()>80;

}

/* ==========================================
   시즌 성과
========================================== */

function calculateSeasonPerformance(){

    return{

        averageScore:calculateAIScore(),

        injuryRisk:calculateInjuryRisk(),

        medalChance:predictMedalChance(),

        condition:getConditionScore()

    };

}

/* ==========================================
   선수 랭킹
========================================== */

function calculateRanking(players){

    if(!players){

        return [];

    }

    return players.sort(

        (a,b)=>b.score-a.score

    );

}

/* ==========================================
   Firebase 저장
========================================== */

async function uploadAI(){

    console.log(

        "AI Upload"

    );

}

/* ==========================================
   Dashboard 연결
========================================== */

function updateDashboardAI(){

    const widget=

        document.getElementById(

            "dashboardAI"

        );

    if(!widget){

        return;

    }

    widget.innerHTML=`

        AI 점수 :

        ${calculateAIScore()}

        <br>

        등급 :

        ${calculateGrade()}

        <br>

        메달 가능성 :

        ${predictMedalChance()}%

        <br>

        부상 위험 :

        ${calculateInjuryRisk()}%

    `;

}

/* ==========================================
   Report 연결
========================================== */

function finalizeAIReport(){

    sendAIReport();

}

/* ==========================================
   종료
========================================== */

function destroyAI(){

    AIManager.athlete=null;

    AIManager.pose=null;

    AIManager.weight=null;

    AIManager.shooting=null;

    AIManager.biathlon=null;

    AIManager.polar=null;

    AIManager.heatmap=null;

    AIManager.report=null;

    AIManager.score=0;

}