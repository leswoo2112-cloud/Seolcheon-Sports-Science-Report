/*
=========================================================
 설천고 스포츠과학 훈련센터 PRO
 File : weight.js
 Version : 1.0.0
=========================================================
*/

const WeightManager = {

    workouts : [],

    current : null,

    athleteId : null,

    totalVolume : 0,

    totalSets : 0,

    totalReps : 0,

    totalWeight : 0

};

/* ==========================================
   초기화
========================================== */

function initializeWeight(){

    WeightManager.workouts = loadWeightData() || [];

}

/* ==========================================
   새 운동 생성
========================================== */

function createWorkout(data){

    return{

        id : Utils.uuid(),

        athleteId : data.athleteId,

        exercise : data.exercise,

        category : data.category,

        date : Utils.today(),

        sets : [],

        memo : "",

        createdAt : Utils.dateTime(),

        updatedAt : Utils.dateTime()

    };

}

/* ==========================================
   운동 추가
========================================== */

function addWorkout(data){

    const workout = createWorkout(data);

    WeightManager.workouts.push(workout);

    saveWeightData(

        WeightManager.workouts

    );

}

/* ==========================================
   운동 삭제
========================================== */

function deleteWorkout(id){

    WeightManager.workouts =

        WeightManager.workouts.filter(

            item=>item.id!==id

        );

    saveWeightData(

        WeightManager.workouts

    );

}

/* ==========================================
   운동 불러오기
========================================== */

function getWorkout(id){

    return WeightManager.workouts.find(

        item=>item.id===id

    );

}

/* ==========================================
   운동 수정
========================================== */

function updateWorkout(id,data){

    const workout=getWorkout(id);

    if(!workout){

        return;

    }

    Object.assign(

        workout,

        data

    );

    workout.updatedAt=

        Utils.dateTime();

    saveWeightData(

        WeightManager.workouts

    );

}
/* ==========================================
   세트 추가
========================================== */

function addSet(workoutId, weight, reps){

    const workout = getWorkout(workoutId);

    if(!workout){

        return;

    }

    workout.sets.push({

        id : Utils.uuid(),

        weight : Number(weight),

        reps : Number(reps),

        volume : Number(weight) * Number(reps),

        createdAt : Utils.dateTime()

    });

    workout.updatedAt = Utils.dateTime();

    calculateWorkoutVolume(workoutId);

    saveWeightData(

        WeightManager.workouts

    );

}

/* ==========================================
   세트 삭제
========================================== */

function deleteSet(workoutId, setId){

    const workout = getWorkout(workoutId);

    if(!workout){

        return;

    }

    workout.sets = workout.sets.filter(

        set => set.id !== setId

    );

    calculateWorkoutVolume(workoutId);

    saveWeightData(

        WeightManager.workouts

    );

}

/* ==========================================
   세트 수정
========================================== */

function updateSet(workoutId, setId, weight, reps){

    const workout = getWorkout(workoutId);

    if(!workout){

        return;

    }

    const set = workout.sets.find(

        item => item.id === setId

    );

    if(!set){

        return;

    }

    set.weight = Number(weight);

    set.reps = Number(reps);

    set.volume =

        set.weight * set.reps;

    calculateWorkoutVolume(workoutId);

    saveWeightData(

        WeightManager.workouts

    );

}

/* ==========================================
   총 볼륨 계산
========================================== */

function calculateWorkoutVolume(workoutId){

    const workout = getWorkout(workoutId);

    if(!workout){

        return;

    }

    let volume = 0;

    let reps = 0;

    let sets = workout.sets.length;

    let weight = 0;

    workout.sets.forEach(set=>{

        volume += set.volume;

        reps += set.reps;

        weight += set.weight;

    });

    workout.totalVolume = volume;

    workout.totalReps = reps;

    workout.totalSets = sets;

    workout.totalWeight = weight;

}

/* ==========================================
   운동 메모
========================================== */

function updateWorkoutMemo(workoutId, memo){

    const workout = getWorkout(workoutId);

    if(!workout){

        return;

    }

    workout.memo = memo;

    workout.updatedAt = Utils.dateTime();

    saveWeightData(

        WeightManager.workouts

    );

}

/* ==========================================
   운동 통계
========================================== */

function getWorkoutStatistics(workoutId){

    const workout = getWorkout(workoutId);

    if(!workout){

        return null;

    }

    return{

        sets : workout.totalSets,

        reps : workout.totalReps,

        weight : workout.totalWeight,

        volume : workout.totalVolume

    };

}
/* ==========================================
   1RM (Epley)
========================================== */

function calculateEpley(weight,reps){

    return Math.round(

        weight*(1+reps/30)

    );

}

/* ==========================================
   1RM (Brzycki)
========================================== */

function calculateBrzycki(weight,reps){

    if(reps>=37){

        return weight;

    }

    return Math.round(

        weight*

        (36/(37-reps))

    );

}

/* ==========================================
   1RM (Lombardi)
========================================== */

function calculateLombardi(weight,reps){

    return Math.round(

        weight*

        Math.pow(reps,0.10)

    );

}

/* ==========================================
   최고 1RM
========================================== */

function getBest1RM(workoutId){

    const workout=getWorkout(workoutId);

    if(!workout){

        return 0;

    }

    let best=0;

    workout.sets.forEach(set=>{

        const rm=

            calculateEpley(

                set.weight,

                set.reps

            );

        if(rm>best){

            best=rm;

        }

    });

    return best;

}

/* ==========================================
   PR(개인 최고기록)
========================================== */

function getPersonalRecord(workoutId){

    return getBest1RM(workoutId);

}

/* ==========================================
   운동 강도(%)
========================================== */

function calculateIntensity(workoutId){

    const workout=getWorkout(workoutId);

    if(!workout){

        return [];

    }

    const max=getBest1RM(workoutId);

    return workout.sets.map(set=>{

        return{

            weight:set.weight,

            intensity:Math.round(

                (set.weight/max)*100

            )

        };

    });

}

/* ==========================================
   근육 부위
========================================== */

function getMuscleGroup(exercise){

    const muscles={

        "벤치프레스":"가슴",

        "인클라인 벤치":"가슴",

        "덤벨프레스":"가슴",

        "스쿼트":"하체",

        "레그프레스":"하체",

        "런지":"하체",

        "데드리프트":"등",

        "바벨로우":"등",

        "랫풀다운":"등",

        "오버헤드프레스":"어깨",

        "숄더프레스":"어깨",

        "사이드레터럴":"어깨",

        "바벨컬":"이두",

        "덤벨컬":"이두",

        "트라이셉스":"삼두"

    };

    return muscles[exercise]||

           "기타";

}

/* ==========================================
   주간 볼륨
========================================== */

function getWeeklyVolume(){

    let total=0;

    WeightManager.workouts.forEach(workout=>{

        total+=

        workout.totalVolume||0;

    });

    return total;

}

/* ==========================================
   월간 볼륨
========================================== */

function getMonthlyVolume(){

    return getWeeklyVolume();

}

/* ==========================================
   운동 그래프 데이터
========================================== */

function createWorkoutGraphData(workoutId){

    const workout=getWorkout(workoutId);

    if(!workout){

        return [];

    }

    return workout.sets.map(

        (set,index)=>{

            return{

                x:index+1,

                y:set.weight

            };

        }

    );

}
/* ==========================================
   운동 프로그램 생성
========================================== */

function createProgram(name){

    return{

        id:Utils.uuid(),

        name:name,

        createdAt:Utils.dateTime(),

        exercises:[]

    };

}

/* ==========================================
   운동 추가
========================================== */

function addExercise(program,exercise){

    if(!program){

        return;

    }

    program.exercises.push({

        id:Utils.uuid(),

        name:exercise,

        sets:0,

        reps:0,

        weight:0

    });

}

/* ==========================================
   운동 삭제
========================================== */

function removeExercise(program,id){

    if(!program){

        return;

    }

    program.exercises=

        program.exercises.filter(

            item=>item.id!==id

        );

}

/* ==========================================
   주간 운동 계획
========================================== */

function createWeeklyPlan(){

    return{

        monday:[],

        tuesday:[],

        wednesday:[],

        thursday:[],

        friday:[],

        saturday:[],

        sunday:[]

    };

}

/* ==========================================
   요일 추가
========================================== */

function addWorkoutDay(plan,day,program){

    if(

        !plan ||

        !plan[day]

    ){

        return;

    }

    plan[day].push(program);

}

/* ==========================================
   휴식 타이머
========================================== */

let restTimer=null;

function startRestTimer(seconds){

    stopRestTimer();

    let remain=seconds;

    const label=

        document.getElementById(

            "restTimer"

        );

    restTimer=setInterval(()=>{

        remain--;

        if(label){

            label.innerHTML=

                remain+"초";

        }

        if(remain<=0){

            stopRestTimer();

            if(label){

                label.innerHTML="완료";

            }

        }

    },1000);

}

function stopRestTimer(){

    if(restTimer){

        clearInterval(restTimer);

        restTimer=null;

    }

}

/* ==========================================
   피로도 계산
========================================== */

function calculateFatigue(workoutId){

    const workout=

        getWorkout(workoutId);

    if(!workout){

        return 0;

    }

    const volume=

        workout.totalVolume||0;

    if(volume<3000){

        return "낮음";

    }

    if(volume<7000){

        return "보통";

    }

    if(volume<12000){

        return "높음";

    }

    return "매우 높음";

}

/* ==========================================
   Polar 연결
========================================== */

function connectPolarWorkout(data){

    if(!data){

        return;

    }

    WeightManager.heartRate=data;

}

/* ==========================================
   AI 운동 추천
========================================== */

function recommendWorkout(){

    const volume=getWeeklyVolume();

    if(volume<10000){

        return "훈련량을 늘리는 것을 추천합니다.";

    }

    if(volume<25000){

        return "현재 훈련량이 적절합니다.";

    }

    return "회복 운동을 추가하는 것을 추천합니다.";

}

/* ==========================================
   Report 연결
========================================== */

function sendWorkoutToReport(){

    if(

        typeof attachWeightResult

        ==="function"

    ){

        attachWeightResult({

            totalVolume:getWeeklyVolume(),

            recommendation:

                recommendWorkout()

        });

    }

}
/* ==========================================
   목표 중량 설정
========================================== */

function setTargetWeight(workoutId,target){

    const workout=getWorkout(workoutId);

    if(!workout){

        return;

    }

    workout.targetWeight=Number(target);

    workout.updatedAt=Utils.dateTime();

    saveWeightData(

        WeightManager.workouts

    );

}

/* ==========================================
   목표 달성률
========================================== */

function getTargetProgress(workoutId){

    const workout=getWorkout(workoutId);

    if(

        !workout ||

        !workout.targetWeight

    ){

        return 0;

    }

    const best=getBest1RM(workoutId);

    return Math.min(

        100,

        Math.round(

            (best/workout.targetWeight)*100

        )

    );

}

/* ==========================================
   PR 자동 갱신
========================================== */

function updatePersonalRecord(workoutId){

    const workout=getWorkout(workoutId);

    if(!workout){

        return;

    }

    workout.personalRecord=

        getBest1RM(workoutId);

}

/* ==========================================
   Chart.js 데이터
========================================== */

function createWeightChartData(){

    return WeightManager.workouts.map(item=>{

        return{

            label:item.exercise,

            value:item.totalVolume||0

        };

    });

}

/* ==========================================
   Report.js 연결
========================================== */

function createWeightReport(){

    if(

        typeof attachWeightResult

        !=="function"

    ){

        return;

    }

    attachWeightResult({

        totalVolume:getWeeklyVolume(),

        monthlyVolume:getMonthlyVolume(),

        recommendation:recommendWorkout(),

        fatigue:WeightManager.workouts.map(

            item=>({

                exercise:item.exercise,

                fatigue:

                    calculateFatigue(item.id)

            })

        )

    });

}

/* ==========================================
   CSV 내보내기
========================================== */

function exportWeightCSV(){

    const rows=[

        "운동,세트,반복,총볼륨"

    ];

    WeightManager.workouts.forEach(item=>{

        rows.push(

            `${item.exercise},${item.totalSets||0},${item.totalReps||0},${item.totalVolume||0}`

        );

    });

    Utils.download(

        "weight.csv",

        rows.join("\n")

    );

}

/* ==========================================
   Firebase 저장
========================================== */

async function uploadWeight(){

    console.log(

        "Weight Firebase Upload"

    );

}

/* ==========================================
   AI 종합 평가
========================================== */

function evaluateTraining(){

    const volume=getWeeklyVolume();

    const fatigue=WeightManager.workouts.map(

        item=>calculateFatigue(item.id)

    );

    return{

        weeklyVolume:volume,

        recommendation:recommendWorkout(),

        fatigue

    };

}

/* ==========================================
   종료
========================================== */

function destroyWeight(){

    WeightManager.current=null;

    WeightManager.totalVolume=0;

    WeightManager.totalSets=0;

    WeightManager.totalReps=0;

    WeightManager.totalWeight=0;

}