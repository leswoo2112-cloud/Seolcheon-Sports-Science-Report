/*
=========================================================
 설천고 스포츠과학 훈련센터 PRO
 Dashboard Module
=========================================================
*/

const DashboardManager={

    initialized:false,

    charts:{},

    widgets:{},

    refreshRate:1000,

    timer:null

};

/* ==========================================
   초기화
========================================== */

function initializeDashboard(){

    DashboardManager.initialized=true;

    createWidgets();

    createCharts();

    startDashboard();

}

/* ==========================================
   위젯 생성
========================================== */

function createWidgets(){

    DashboardManager.widgets={

        athlete:

            document.getElementById("widgetAthlete"),

        ai:

            document.getElementById("widgetAI"),

        polar:

            document.getElementById("widgetPolar"),

        shooting:

            document.getElementById("widgetShooting"),

        biathlon:

            document.getElementById("widgetBiathlon"),

        weight:

            document.getElementById("widgetWeight"),

        schedule:

            document.getElementById("widgetSchedule")

    };

}

/* ==========================================
   차트 생성
========================================== */

function createCharts(){

    DashboardManager.charts.heartRate=

        createHeartRateChart();

    DashboardManager.charts.training=

        createTrainingChart();

    DashboardManager.charts.shooting=

        createShootingChart();

}

/* ==========================================
   자동 새로고침
========================================== */

function startDashboard(){

    stopDashboard();

    DashboardManager.timer=

        setInterval(

            refreshDashboard,

            DashboardManager.refreshRate

        );

}

/* ==========================================
   중지
========================================== */

function stopDashboard(){

    if(DashboardManager.timer){

        clearInterval(

            DashboardManager.timer

        );

    }

}

/* ==========================================
   종료
========================================== */

function destroyDashboard(){

    stopDashboard();

    DashboardManager.initialized=false;

}
/* ==========================================
   선수 카드
========================================== */

function updateAthleteWidget(){

    const widget=

        DashboardManager.widgets.athlete;

    if(!widget || !AIManager.athlete){

        return;

    }

    widget.innerHTML=`

        <h3>${AIManager.athlete.name}</h3>

        <p>${AIManager.athlete.team}</p>

        <p>${AIManager.athlete.event}</p>

    `;

}

/* ==========================================
   AI 카드
========================================== */

function updateAIWidget(){

    const widget=

        DashboardManager.widgets.ai;

    if(!widget){

        return;

    }

    widget.innerHTML=`

        <h2>${calculateAIScore()}</h2>

        <p>${calculateGrade()}</p>

        <small>${evaluateNationalLevel()}</small>

    `;

}

/* ==========================================
   Polar 카드
========================================== */

function updatePolarWidget(){

    const widget=

        DashboardManager.widgets.polar;

    if(!widget){

        return;

    }

    widget.innerHTML=`

        <h2>${PolarManager.heartRate}</h2>

        <p>bpm</p>

        <small>

        ${calculateHeartRateZone()}

        </small>

    `;

}

/* ==========================================
   사격 카드
========================================== */

function updateShootingWidget(){

    const widget=

        DashboardManager.widgets.shooting;

    if(!widget){

        return;

    }

    widget.innerHTML=`

        <h2>

        ${calculateAverageScore()}

        </h2>

        <p>평균 점수</p>

        <small>

        탄착군 :

        ${calculateGroupSize()}

        </small>

    `;

}

/* ==========================================
   바이애슬론 카드
========================================== */

function updateBiathlonWidget(){

    const widget=

        DashboardManager.widgets.biathlon;

    if(!widget){

        return;

    }

    widget.innerHTML=`

        <h2>

        ${calculateAverageSpeed()}

        </h2>

        <p>평균속도</p>

        <small>

        패널티 :

        ${BiathlonManager.penalty}

        </small>

    `;

}

/* ==========================================
   웨이트 카드
========================================== */

function updateWeightWidget(){

    const widget=

        DashboardManager.widgets.weight;

    if(!widget){

        return;

    }

    widget.innerHTML=`

        <h2>

        ${getWeeklyVolume()}

        </h2>

        <p>주간 볼륨</p>

        <small>

        PR :

        ${getBest1RM()}

        </small>

    `;

}

/* ==========================================
   일정 카드
========================================== */

function updateScheduleWidget(){

    const widget=

        DashboardManager.widgets.schedule;

    if(!widget){

        return;

    }

    widget.innerHTML=`

        <h3>

        오늘 훈련

        </h3>

        <p>

        ${new Date().toLocaleDateString()}

        </p>

    `;

}

/* ==========================================
   위젯 전체 갱신
========================================== */

function refreshWidgets(){

    updateAthleteWidget();

    updateAIWidget();

    updatePolarWidget();

    updateShootingWidget();

    updateBiathlonWidget();

    updateWeightWidget();

    updateScheduleWidget();

}
/* ==========================================
   심박수 차트
========================================== */

function updateHeartRateChart(){

    if(!DashboardManager.charts.heartRate){

        return;

    }

    DashboardManager.charts.heartRate.data.labels =

        PolarManager.history.map(

            (_,index)=>index+1

        );

    DashboardManager.charts.heartRate.data.datasets[0].data =

        PolarManager.history.map(

            item=>item.bpm

        );

    DashboardManager.charts.heartRate.update();

}

/* ==========================================
   사격 그래프
========================================== */

function updateShootingChart(){

    if(!DashboardManager.charts.shooting){

        return;

    }

    DashboardManager.charts.shooting.data.labels =

        ShootingManager.current.shots.map(

            (_,index)=>index+1

        );

    DashboardManager.charts.shooting.data.datasets[0].data =

        ShootingManager.current.shots.map(

            shot=>shot.score

        );

    DashboardManager.charts.shooting.update();

}

/* ==========================================
   바이애슬론 그래프
========================================== */

function updateBiathlonChart(){

    if(!DashboardManager.charts.biathlon){

        return;

    }

    DashboardManager.charts.biathlon.data.labels =

        BiathlonManager.current.laps.map(

            lap=>lap.lapNumber

        );

    DashboardManager.charts.biathlon.data.datasets[0].data =

        BiathlonManager.current.laps.map(

            lap=>lap.speed

        );

    DashboardManager.charts.biathlon.update();

}

/* ==========================================
   웨이트 그래프
========================================== */

function updateWeightChart(){

    if(!DashboardManager.charts.weight){

        return;

    }

    DashboardManager.charts.weight.data.labels =

        WeightManager.workouts.map(

            item=>item.exercise

        );

    DashboardManager.charts.weight.data.datasets[0].data =

        WeightManager.workouts.map(

            item=>item.totalVolume

        );

    DashboardManager.charts.weight.update();

}

/* ==========================================
   AI 점수 그래프
========================================== */

function updateAIChart(){

    if(!DashboardManager.charts.ai){

        return;

    }

    DashboardManager.charts.ai.data.labels.push(

        new Date().toLocaleTimeString()

    );

    DashboardManager.charts.ai.data.datasets[0].data.push(

        calculateAIScore()

    );

    if(

        DashboardManager.charts.ai.data.labels.length>30

    ){

        DashboardManager.charts.ai.data.labels.shift();

        DashboardManager.charts.ai.data.datasets[0].data.shift();

    }

    DashboardManager.charts.ai.update();

}

/* ==========================================
   오늘 통계
========================================== */

function updateTodayStatistics(){

    const area=

        document.getElementById(

            "todayStatistics"

        );

    if(!area){

        return;

    }

    area.innerHTML=`

        선수 :

        ${AIManager.athlete?.name||"-"}

        <br>

        AI :

        ${calculateAIScore()}

        <br>

        심박 :

        ${PolarManager.heartRate}

        <br>

        사격 :

        ${calculateAverageScore()}

        <br>

        속도 :

        ${calculateAverageSpeed()}

    `;

}

/* ==========================================
   주간 통계
========================================== */

function updateWeeklyStatistics(){

    const area=

        document.getElementById(

            "weeklyStatistics"

        );

    if(!area){

        return;

    }

    area.innerHTML=`

        볼륨 :

        ${getWeeklyVolume()}

        <br>

        최고심박 :

        ${calculateMaxHeartRate()}

        <br>

        PR :

        ${getBest1RM()}

    `;

}

/* ==========================================
   월간 통계
========================================== */

function updateMonthlyStatistics(){

    const area=

        document.getElementById(

            "monthlyStatistics"

        );

    if(!area){

        return;

    }

    area.innerHTML=`

        월간 볼륨 :

        ${getMonthlyVolume()}

        <br>

        컨디션 :

        ${getConditionScore()}

        <br>

        국가대표 평가 :

        ${evaluateNationalLevel()}

    `;

}

/* ==========================================
   차트 전체 갱신
========================================== */

function refreshCharts(){

    updateHeartRateChart();

    updateShootingChart();

    updateBiathlonChart();

    updateWeightChart();

    updateAIChart();

    updateTodayStatistics();

    updateWeeklyStatistics();

    updateMonthlyStatistics();

}
/* ==========================================
   선수 랭킹 위젯
========================================== */

function updateRankingWidget(){

    const widget =

        document.getElementById(

            "widgetRanking"

        );

    if(!widget){

        return;

    }

    observeRanking(players=>{

        widget.innerHTML="";

        players.slice(0,5).forEach(

            (player,index)=>{

                widget.innerHTML+=`

                <div class="ranking-item">

                    <span>

                    ${index+1}위

                    </span>

                    <span>

                    ${player.name}

                    </span>

                    <strong>

                    ${player.score}

                    </strong>

                </div>

                `;

            }

        );

    });

}

/* ==========================================
   최근 훈련
========================================== */

function updateRecentTraining(){

    const widget=

        document.getElementById(

            "widgetRecentTraining"

        );

    if(!widget){

        return;

    }

    widget.innerHTML=`

        최근 운동 :

        ${new Date().toLocaleTimeString()}

        <br>

        AI 점수 :

        ${calculateAIScore()}

    `;

}

/* ==========================================
   공지사항
========================================== */

function updateNoticeWidget(){

    const widget=

        document.getElementById(

            "widgetNotice"

        );

    if(!widget){

        return;

    }

    observeNotice(data=>{

        widget.innerHTML="";

        data.slice(0,5).forEach(item=>{

            widget.innerHTML+=`

            <div>

                ${item.title}

            </div>

            `;

        });

    });

}

/* ==========================================
   Polar 상태
========================================== */

function updatePolarStatus(){

    const widget=

        document.getElementById(

            "widgetPolarStatus"

        );

    if(!widget){

        return;

    }

    widget.innerHTML=`

        연결 :

        ${PolarManager.connected?"🟢":"🔴"}

        <br>

        심박 :

        ${PolarManager.heartRate}

        bpm

    `;

}

/* ==========================================
   AI 알림
========================================== */

function updateAIAlert(){

    const widget=

        document.getElementById(

            "widgetAIAlert"

        );

    if(!widget){

        return;

    }

    const coaching=

        generateAICoaching();

    widget.innerHTML="";

    coaching.forEach(item=>{

        widget.innerHTML+=`

        <div class="alert">

            <strong>

            ${item.title}

            </strong>

            <br>

            ${item.message}

        </div>

        `;

    });

}

/* ==========================================
   부상 경고
========================================== */

function updateInjuryWidget(){

    const widget=

        document.getElementById(

            "widgetInjury"

        );

    if(!widget){

        return;

    }

    const risk=

        calculateInjuryRisk();

    widget.innerHTML=`

        위험도 :

        ${risk}%

        <br>

        ${risk>70?"⚠️ 회복 권장":"✅ 정상"}

    `;

}

/* ==========================================
   Grid Layout
========================================== */

function initializeGridLayout(){

    const dashboard=

        document.getElementById(

            "dashboard"

        );

    if(!dashboard){

        return;

    }

    dashboard.classList.add(

        "dashboard-grid"

    );

}

/* ==========================================
   Dashboard 전체 갱신
========================================== */

function refreshDashboard(){

    refreshWidgets();

    refreshCharts();

    updateRankingWidget();

    updateRecentTraining();

    updateNoticeWidget();

    updatePolarStatus();

    updateAIAlert();

    updateInjuryWidget();

}
/* ==========================================
   테마 변경
========================================== */

function applyTheme(theme){

    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );

    localStorage.setItem(

        "theme",

        theme

    );

}

/* ==========================================
   저장된 테마
========================================== */

function loadTheme(){

    const theme =

        localStorage.getItem(

            "theme"

        ) || "light";

    applyTheme(theme);

}

/* ==========================================
   전체화면
========================================== */

function toggleFullscreen(){

    if(!document.fullscreenElement){

        document.documentElement
            .requestFullscreen();

    }else{

        document.exitFullscreen();

    }

}

/* ==========================================
   언어 변경
========================================== */

function applyLanguage(language){

    if(typeof changeLanguage==="function"){

        changeLanguage(language);

    }

}

/* ==========================================
   브라우저 알림
========================================== */

async function notify(title,body){

    if(Notification.permission!=="granted"){

        await Notification.requestPermission();

    }

    if(Notification.permission==="granted"){

        new Notification(

            title,

            {

                body

            }

        );

    }

}

/* ==========================================
   설정 저장
========================================== */

function saveDashboardSettings(){

    localStorage.setItem(

        "dashboard",

        JSON.stringify({

            theme:

                document.documentElement
                .getAttribute(
                    "data-theme"
                ),

            refreshRate:

                DashboardManager.refreshRate

        })

    );

}

/* ==========================================
   설정 불러오기
========================================== */

function loadDashboardSettings(){

    const data=

        JSON.parse(

            localStorage.getItem(

                "dashboard"

            )||"{}"

        );

    if(data.theme){

        applyTheme(

            data.theme

        );

    }

    if(data.refreshRate){

        DashboardManager.refreshRate=

            data.refreshRate;

    }

}

/* ==========================================
   메모리 정리
========================================== */

function optimizeDashboard(){

    Object.keys(

        DashboardManager.charts

    ).forEach(key=>{

        const chart=

            DashboardManager.charts[key];

        if(chart){

            chart.update("none");

        }

    });

}

/* ==========================================
   자동 업데이트
========================================== */

function enableAutoUpdate(){

    stopDashboard();

    startDashboard();

}

/* ==========================================
   Dashboard 종료
========================================== */

function destroyDashboard(){

    stopDashboard();

    DashboardManager.charts={};

    DashboardManager.widgets={};

    DashboardManager.initialized=false;

}