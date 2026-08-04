/*
=========================================================
 설천고 스포츠과학 훈련센터 PRO
 File : polar.js
 Version : 1.0.0
=========================================================
*/

const PolarManager={

    device:null,

    server:null,

    service:null,

    characteristic:null,

    connected:false,

    heartRate:0,

    battery:0,

    history:[],

    zones:[],

    athlete:null

};

/* ==========================================
   초기화
========================================== */

function initializePolar(){

    PolarManager.history=[];

    PolarManager.zones=[];

}

/* ==========================================
   Bluetooth 연결
========================================== */

async function connectPolar(){

    try{

        PolarManager.device=

            await navigator.bluetooth.requestDevice({

                filters:[

                    {

                        services:[

                            "heart_rate"

                        ]

                    }

                ]

            });

        PolarManager.server=

            await PolarManager.device.gatt.connect();

        PolarManager.connected=true;

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   연결 해제
========================================== */

function disconnectPolar(){

    if(

        PolarManager.device &&

        PolarManager.device.gatt.connected

    ){

        PolarManager.device.gatt.disconnect();

    }

    PolarManager.connected=false;

}

/* ==========================================
   선수 연결
========================================== */

function attachPolarAthlete(id){

    PolarManager.athlete=id;

}

/* ==========================================
   심박수 저장
========================================== */

function addHeartRate(bpm){

    PolarManager.heartRate=bpm;

    PolarManager.history.push({

        bpm:bpm,

        time:Date.now()

    });

}

/* ==========================================
   현재 심박수
========================================== */

function getCurrentHeartRate(){

    return PolarManager.heartRate;

}
/* ==========================================
   평균 심박수
========================================== */

function calculateAverageHeartRate(){

    if(PolarManager.history.length===0){

        return 0;

    }

    const total=

        PolarManager.history.reduce(

            (sum,item)=>sum+item.bpm,

            0

        );

    return Math.round(

        total/

        PolarManager.history.length

    );

}

/* ==========================================
   최고 심박수
========================================== */

function calculateMaxHeartRate(){

    if(PolarManager.history.length===0){

        return 0;

    }

    return Math.max(

        ...PolarManager.history.map(

            item=>item.bpm

        )

    );

}

/* ==========================================
   심박수 Zone
========================================== */

function calculateHeartRateZone(maxHR=200){

    const hr=

        PolarManager.heartRate;

    const percent=

        hr/maxHR*100;

    if(percent<60){

        return "Zone 1";

    }

    if(percent<70){

        return "Zone 2";

    }

    if(percent<80){

        return "Zone 3";

    }

    if(percent<90){

        return "Zone 4";

    }

    return "Zone 5";

}

/* ==========================================
   운동 강도
========================================== */

function calculateTrainingIntensity(){

    const zone=

        calculateHeartRateZone();

    switch(zone){

        case "Zone 1":

            return "회복";

        case "Zone 2":

            return "유산소";

        case "Zone 3":

            return "템포";

        case "Zone 4":

            return "역치";

        case "Zone 5":

            return "최대";

    }

}

/* ==========================================
   운동 시작
========================================== */

function startWorkout(){

    PolarManager.startTime=

        Date.now();

}

/* ==========================================
   운동 종료
========================================== */

function stopWorkout(){

    PolarManager.endTime=

        Date.now();

}

/* ==========================================
   운동 시간
========================================== */

function getWorkoutDuration(){

    if(

        !PolarManager.startTime ||

        !PolarManager.endTime

    ){

        return 0;

    }

    return Math.round(

        (

            PolarManager.endTime-

            PolarManager.startTime

        )/1000

    );

}

/* ==========================================
   그래프 데이터
========================================== */

function createHeartRateGraph(){

    return PolarManager.history.map(

        item=>{

            return{

                x:item.time,

                y:item.bpm

            };

        }

    );

}

/* ==========================================
   화면 갱신
========================================== */

function updatePolarInfo(){

    const info=

        document.getElementById(

            "polarInfo"

        );

    if(!info){

        return;

    }

    info.innerHTML=`

    현재심박 :

    ${PolarManager.heartRate} bpm

    <br>

    평균 :

    ${calculateAverageHeartRate()} bpm

    <br>

    최고 :

    ${calculateMaxHeartRate()} bpm

    <br>

    Zone :

    ${calculateHeartRateZone()}

    <br>

    운동강도 :

    ${calculateTrainingIntensity()}

    `;

}
/* ==========================================
   HRV(RMSSD)
========================================== */

function calculateHRV(){

    if(PolarManager.history.length<2){

        return 0;

    }

    let sum=0;

    for(let i=1;i<PolarManager.history.length;i++){

        const diff=

            PolarManager.history[i].bpm-

            PolarManager.history[i-1].bpm;

        sum+=diff*diff;

    }

    return Utils.round(

        Math.sqrt(

            sum/

            (PolarManager.history.length-1)

        )

    );

}

/* ==========================================
   칼로리 계산
========================================== */

function calculateCalories(weight=70){

    const duration=

        getWorkoutDuration()/60;

    const hr=

        calculateAverageHeartRate();

    const calories=

        (

            (

                -55.0969+

                (0.6309*hr)+

                (0.1988*weight)+

                (0.2017*20)

            )/4.184

        )*duration;

    return Math.max(

        0,

        Math.round(calories)

    );

}

/* ==========================================
   훈련부하
========================================== */

function calculateTrainingLoad(){

    const duration=

        getWorkoutDuration()/60;

    const intensity=

        PolarManager.heartRate/200;

    return Math.round(

        duration*

        intensity*

        10

    );

}

/* ==========================================
   회복 심박수(HRR)
========================================== */

function calculateRecoveryRate(){

    if(

        PolarManager.history.length<2

    ){

        return 0;

    }

    const max=

        calculateMaxHeartRate();

    const current=

        PolarManager.heartRate;

    return max-current;

}

/* ==========================================
   회복 상태
========================================== */

function calculateRecoveryStatus(){

    const hrr=

        calculateRecoveryRate();

    if(hrr>40){

        return "매우 좋음";

    }

    if(hrr>30){

        return "좋음";

    }

    if(hrr>20){

        return "보통";

    }

    return "회복 필요";

}

/* ==========================================
   AI 생리 분석
========================================== */

function analyzePhysiology(){

    return{

        averageHeartRate:

            calculateAverageHeartRate(),

        maxHeartRate:

            calculateMaxHeartRate(),

        hrv:

            calculateHRV(),

        calories:

            calculateCalories(),

        load:

            calculateTrainingLoad(),

        recovery:

            calculateRecoveryStatus()

    };

}

/* ==========================================
   Report 연결
========================================== */

function sendPolarReport(){

    if(

        typeof attachPolarResult

        !=="function"

    ){

        return;

    }

    attachPolarResult(

        analyzePhysiology()

    );

}

/* ==========================================
   화면 출력
========================================== */

function updatePolarAnalysis(){

    const area=

        document.getElementById(

            "polarAnalysis"

        );

    if(!area){

        return;

    }

    const data=

        analyzePhysiology();

    area.innerHTML=`

        평균심박 :
        ${data.averageHeartRate} bpm

        <br>

        최고심박 :
        ${data.maxHeartRate} bpm

        <br>

        HRV :
        ${data.hrv}

        <br>

        칼로리 :
        ${data.calories} kcal

        <br>

        Training Load :
        ${data.load}

        <br>

        회복상태 :
        ${data.recovery}

    `;

}
/* ==========================================
   Zone별 운동 시간
========================================== */

function calculateZoneTimes(maxHR = 200){

    const zones = {

        zone1:0,

        zone2:0,

        zone3:0,

        zone4:0,

        zone5:0

    };

    for(let i=1;i<PolarManager.history.length;i++){

        const hr = PolarManager.history[i].bpm;

        const dt =

            (PolarManager.history[i].time-

            PolarManager.history[i-1].time)/1000;

        const percent = hr/maxHR*100;

        if(percent<60){

            zones.zone1+=dt;

        }

        else if(percent<70){

            zones.zone2+=dt;

        }

        else if(percent<80){

            zones.zone3+=dt;

        }

        else if(percent<90){

            zones.zone4+=dt;

        }

        else{

            zones.zone5+=dt;

        }

    }

    return zones;

}

/* ==========================================
   TRIMP 계산
========================================== */

function calculateTRIMP(){

    const duration =

        getWorkoutDuration()/60;

    const intensity =

        PolarManager.heartRate/200;

    return Math.round(

        duration*

        intensity*

        intensity*

        100

    );

}

/* ==========================================
   훈련 준비도
========================================== */

function calculateReadiness(){

    const hrv = calculateHRV();

    const recovery =

        calculateRecoveryRate();

    let score = 50;

    score += Math.min(hrv,30);

    score += Math.min(recovery,20);

    return Math.min(

        100,

        Math.round(score)

    );

}

/* ==========================================
   회복 예상시간
========================================== */

function estimateRecoveryHours(){

    const load =

        calculateTrainingLoad();

    if(load<50){

        return 12;

    }

    if(load<100){

        return 24;

    }

    if(load<150){

        return 36;

    }

    if(load<200){

        return 48;

    }

    return 72;

}

/* ==========================================
   일간 통계
========================================== */

function getDailyStatistics(){

    return{

        averageHeartRate:

            calculateAverageHeartRate(),

        maxHeartRate:

            calculateMaxHeartRate(),

        calories:

            calculateCalories(),

        trimp:

            calculateTRIMP()

    };

}

/* ==========================================
   주간 통계
========================================== */

function getWeeklyStatistics(){

    return{

        sessions:

            PolarManager.history.length,

        averageHeartRate:

            calculateAverageHeartRate(),

        trainingLoad:

            calculateTrainingLoad()

    };

}

/* ==========================================
   Firebase 저장
========================================== */

async function uploadPolar(){

    console.log(

        "Polar Upload"

    );

}

/* ==========================================
   종목 연동
========================================== */

function synchronizeSports(){

    if(typeof connectPolarWorkout==="function"){

        connectPolarWorkout(

            analyzePhysiology()

        );

    }

    if(typeof connectPolarShooting==="function"){

        connectPolarShooting(

            analyzePhysiology()

        );

    }

    if(typeof addHeartRate==="function"){

        console.log(

            "Biathlon Connected"

        );

    }

}

/* ==========================================
   자동 업데이트
========================================== */

setInterval(()=>{

    if(!PolarManager.connected){

        return;

    }

    updatePolarInfo();

    updatePolarAnalysis();

},1000);
/* ==========================================
   AI 컨디션 점수
========================================== */

function calculateConditionScore(){

    const readiness = calculateReadiness();
    const recovery = calculateRecoveryRate();
    const hrv = calculateHRV();

    let score = 0;

    score += readiness * 0.5;
    score += Math.min(recovery,40) * 0.3;
    score += Math.min(hrv,30) * 0.2;

    return Math.min(
        100,
        Math.round(score)
    );

}

/* ==========================================
   오버트레이닝 위험도
========================================== */

function calculateOvertrainingRisk(){

    const load = calculateTrainingLoad();
    const recovery = calculateRecoveryRate();

    if(load > 200 && recovery < 20){

        return "매우 높음";

    }

    if(load > 150){

        return "높음";

    }

    if(load > 100){

        return "보통";

    }

    return "낮음";

}

/* ==========================================
   Report 연동
========================================== */

function createPolarReport(){

    if(typeof attachPolarResult !== "function"){

        return;

    }

    attachPolarResult({

        averageHeartRate:
            calculateAverageHeartRate(),

        maxHeartRate:
            calculateMaxHeartRate(),

        hrv:
            calculateHRV(),

        trimp:
            calculateTRIMP(),

        readiness:
            calculateReadiness(),

        condition:
            calculateConditionScore(),

        overtraining:
            calculateOvertrainingRisk()

    });

}

/* ==========================================
   CSV 저장
========================================== */

function exportPolarCSV(){

    const rows = [

        "시간,심박수"

    ];

    PolarManager.history.forEach(item=>{

        rows.push(

            `${item.time},${item.bpm}`

        );

    });

    Utils.download(

        "polar.csv",

        rows.join("\n")

    );

}

/* ==========================================
   자동 재연결
========================================== */

async function reconnectPolar(){

    if(PolarManager.connected){

        return;

    }

    try{

        await connectPolar();

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   Firebase 저장
========================================== */

async function synchronizePolar(){

    await uploadPolar();

}

/* ==========================================
   AI 코칭
========================================== */

function getPolarCoaching(){

    const advice=[];

    if(calculateConditionScore()<60){

        advice.push(

            "오늘은 회복 위주의 훈련을 권장합니다."

        );

    }

    if(calculateOvertrainingRisk()==="높음" ||

       calculateOvertrainingRisk()==="매우 높음"){

        advice.push(

            "훈련 강도를 낮추고 충분한 휴식을 취하세요."

        );

    }

    if(calculateAverageHeartRate()<120){

        advice.push(

            "훈련 강도를 조금 높여보세요."

        );

    }

    if(advice.length===0){

        advice.push(

            "현재 컨디션이 매우 좋습니다."

        );

    }

    return advice;

}

/* ==========================================
   종료
========================================== */

function destroyPolar(){

    disconnectPolar();

    PolarManager.history=[];

    PolarManager.connected=false;

    PolarManager.device=null;

    PolarManager.server=null;

}