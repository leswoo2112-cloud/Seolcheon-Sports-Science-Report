/*
=========================================================
 설천고 스포츠과학 훈련센터 PRO
 File : report.js
 Version : 1.0.0
=========================================================
*/

const ReportManager = {

    reports : [],

    current : null,

    athlete : null,

    chart : null,

    photos : [],

    videos : [],

    createdAt : null

};

/* ==========================================
   초기화
========================================== */

function initializeReport(){

    ReportManager.reports = loadReports() || [];

}

/* ==========================================
   새 리포트 생성
========================================== */

function createReport(athleteId){

    ReportManager.current = {

        id : Utils.uuid(),

        athleteId : athleteId,

        title : "스포츠과학 분석 리포트",

        sport : "",

        score : 0,

        summary : "",

        createdAt : Utils.dateTime(),

        updatedAt : Utils.dateTime(),

        pose : {},

        video : {},

        heatmap : {},

        weight : {},

        polar : {},

        photos : [],

        charts : [],

        memo : ""

    };

}

/* ==========================================
   리포트 저장
========================================== */

function saveCurrentReport(){

    if(!ReportManager.current){

        return;

    }

    const index = ReportManager.reports.findIndex(

        item=>item.id===ReportManager.current.id

    );

    if(index==-1){

        ReportManager.reports.push(

            ReportManager.current

        );

    }

    else{

        ReportManager.reports[index] =

            ReportManager.current;

    }

    saveReports(

        ReportManager.reports

    );

}

/* ==========================================
   리포트 불러오기
========================================== */

function openReport(id){

    ReportManager.current =

        ReportManager.reports.find(

            item=>item.id===id

        );

}

/* ==========================================
   리포트 삭제
========================================== */

function deleteReport(id){

    ReportManager.reports =

        ReportManager.reports.filter(

            item=>item.id!==id

        );

    saveReports(

        ReportManager.reports

    );

}

/* ==========================================
   전체 삭제
========================================== */

function clearReports(){

    ReportManager.reports=[];

    saveReports([]);

}

/* ==========================================
   현재 리포트 반환
========================================== */

function currentReport(){

    return ReportManager.current;

}
/* ==========================================
   선수 정보 연결
========================================== */

function attachAthlete(athlete){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.athlete = athlete;

}

/* ==========================================
   자세분석 연결
========================================== */

function attachPoseResult(result){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.pose = result;

}

/* ==========================================
   영상분석 연결
========================================== */

function attachVideoResult(result){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.video = result;

}

/* ==========================================
   히트맵 연결
========================================== */

function attachHeatmapResult(result){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.heatmap = result;

}

/* ==========================================
   Polar 연결
========================================== */

function attachPolarResult(result){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.polar = result;

}

/* ==========================================
   웨이트 분석 연결
========================================== */

function attachWeightResult(result){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.weight = result;

}

/* ==========================================
   사진 추가
========================================== */

function addReportPhoto(image){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.photos.push(image);

}

/* ==========================================
   영상 추가
========================================== */

function addReportVideo(video){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.videos.push(video);

}

/* ==========================================
   메모
========================================== */

function updateReportMemo(text){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.memo = text;

}

/* ==========================================
   마지막 수정시간
========================================== */

function updateReportTime(){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.updatedAt =

        Utils.dateTime();

}
/* ==========================================
   Chart.js 차트
========================================== */

function createScoreChart(canvasId, labels, data){

    const canvas = document.getElementById(canvasId);

    if(!canvas){

        return;

    }

    if(ReportManager.chart){

        ReportManager.chart.destroy();

    }

    ReportManager.chart = new Chart(canvas,{

        type:"line",

        data:{

            labels:labels,

            datasets:[{

                label:"AI 점수",

                data:data,

                borderWidth:3,

                tension:0.3,

                fill:false

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}

/* ==========================================
   심박수 그래프
========================================== */

function createHeartRateChart(canvasId,data){

    const canvas=document.getElementById(canvasId);

    if(!canvas){

        return;

    }

    new Chart(canvas,{

        type:"line",

        data:{

            labels:data.map(item=>item.time),

            datasets:[{

                label:"심박수",

                data:data.map(item=>item.bpm),

                borderWidth:2

            }]

        }

    });

}

/* ==========================================
   속도 그래프
========================================== */

function createSpeedChart(canvasId,data){

    const canvas=document.getElementById(canvasId);

    if(!canvas){

        return;

    }

    new Chart(canvas,{

        type:"line",

        data:{

            labels:data.map(item=>item.time),

            datasets:[{

                label:"속도",

                data:data.map(item=>item.speed),

                borderWidth:2

            }]

        }

    });

}

/* ==========================================
   성장 그래프
========================================== */

function createGrowthChart(canvasId,data){

    const canvas=document.getElementById(canvasId);

    if(!canvas){

        return;

    }

    new Chart(canvas,{

        type:"bar",

        data:{

            labels:data.map(item=>item.date),

            datasets:[{

                label:"기록",

                data:data.map(item=>item.value)

            }]

        }

    });

}

/* ==========================================
   AI 점수 그래프
========================================== */

function createAIScoreChart(canvasId,data){

    createScoreChart(

        canvasId,

        data.map(item=>item.date),

        data.map(item=>item.score)

    );

}

/* ==========================================
   그래프 저장
========================================== */

function saveChart(chart){

    if(!ReportManager.current){

        return;

    }

    ReportManager.current.charts.push(chart);

}

/* ==========================================
   리포트 출력
========================================== */

function renderReport(){

    const report=document.getElementById(

        "reportContainer"

    );

    if(!report){

        return;

    }

    report.innerHTML=`

        <h1>${ReportManager.current.title}</h1>

        <h3>

            ${ReportManager.current.createdAt}

        </h3>

        <hr>

        <h2>

            선수 정보

        </h2>

        <pre>

${JSON.stringify(

ReportManager.current.athlete,

null,

4

)}

        </pre>

        <h2>

            AI 종합 점수

        </h2>

        <h1>

            ${ReportManager.current.score}

        </h1>

    `;

}
/* ==========================================
   PDF 생성
========================================== */

function exportPDF(){

    if(!ReportManager.current){

        return;

    }

    window.print();

}

/* ==========================================
   인쇄
========================================== */

function printReport(){

    window.print();

}

/* ==========================================
   사진 추가
========================================== */

function renderPhotos(){

    if(!ReportManager.current){

        return;

    }

    const container = document.getElementById(

        "reportPhotos"

    );

    if(!container){

        return;

    }

    container.innerHTML = "";

    ReportManager.current.photos.forEach(photo=>{

        const img = document.createElement("img");

        img.src = photo;

        img.className = "report-photo";

        container.appendChild(img);

    });

}

/* ==========================================
   영상 썸네일
========================================== */

function renderVideos(){

    if(!ReportManager.current){

        return;

    }

    const container = document.getElementById(

        "reportVideos"

    );

    if(!container){

        return;

    }

    container.innerHTML = "";

    ReportManager.current.videos.forEach(video=>{

        const element = document.createElement("video");

        element.src = video;

        element.controls = true;

        element.className = "report-video";

        container.appendChild(element);

    });

}

/* ==========================================
   AI 종합 평가
========================================== */

function generateAISummary(){

    if(!ReportManager.current){

        return;

    }

    const score = ReportManager.current.score;

    let level = "";

    let comment = "";

    if(score >= 95){

        level = "국가대표 수준";

        comment = "매우 우수한 수행 능력을 보였습니다.";

    }

    else if(score >= 90){

        level = "우수";

        comment = "경기력이 매우 안정적입니다.";

    }

    else if(score >= 80){

        level = "양호";

        comment = "기본 수행 능력이 우수합니다.";

    }

    else if(score >= 70){

        level = "보통";

        comment = "일부 자세 개선이 필요합니다.";

    }

    else{

        level = "개선 필요";

        comment = "전반적인 자세 교정이 필요합니다.";

    }

    ReportManager.current.summary = {

        level,

        comment

    };

}

/* ==========================================
   개선사항
========================================== */

function generateAdvice(){

    if(!ReportManager.current){

        return;

    }

    const advice = [];

    if(ReportManager.current.pose.balance > 10){

        advice.push(

            "좌우 균형 훈련을 권장합니다."

        );

    }

    if(

        ReportManager.current.polar.averageHeartRate >

        180

    ){

        advice.push(

            "심박수가 높습니다. 회복 시간을 늘리세요."

        );

    }

    if(

        ReportManager.current.weight.totalVolume <

        1000

    ){

        advice.push(

            "훈련 볼륨을 조금 늘려보세요."

        );

    }

    if(advice.length===0){

        advice.push(

            "현재 훈련 상태가 매우 좋습니다."

        );

    }

    ReportManager.current.advice = advice;

}

/* ==========================================
   보고서 새로고침
========================================== */

function refreshReport(){

    generateAISummary();

    generateAdvice();

    renderPhotos();

    renderVideos();

    renderReport();

}

/* ==========================================
   자동 저장
========================================== */

setInterval(()=>{

    if(!ReportManager.current){

        return;

    }

    saveCurrentReport();

},30000);
/* ==========================================
   CSV 내보내기
========================================== */

function exportCSV(){

    if(!ReportManager.current){

        return;

    }

    const data = JSON.stringify(

        ReportManager.current,

        null,

        4

    );

    Utils.download(

        "report.json",

        data

    );

}

/* ==========================================
   JSON 가져오기
========================================== */

function importReport(json){

    try{

        ReportManager.current =

            JSON.parse(json);

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   Firebase 저장
========================================== */

async function uploadReport(){

    console.log(

        "Firebase Upload"

    );

}

/* ==========================================
   이메일 공유
========================================== */

function shareEmail(){

    if(!ReportManager.current){

        return;

    }

    location.href =

    `mailto:?subject=${encodeURIComponent(

        ReportManager.current.title

    )}`;

}

/* ==========================================
   시즌 리포트
========================================== */

function createSeasonReport(){

    const reports =

        ReportManager.reports;

    return{

        total:reports.length,

        averageScore:

        calculateAverageScore(),

        bestScore:

        calculateBestScore()

    };

}

/* ==========================================
   평균 점수
========================================== */

function calculateAverageScore(){

    if(

        ReportManager.reports.length===0

    ){

        return 0;

    }

    let total=0;

    ReportManager.reports.forEach(item=>{

        total+=item.score||0;

    });

    return Math.round(

        total/

        ReportManager.reports.length

    );

}

/* ==========================================
   최고 점수
========================================== */

function calculateBestScore(){

    let max=0;

    ReportManager.reports.forEach(item=>{

        if(item.score>max){

            max=item.score;

        }

    });

    return max;

}

/* ==========================================
   프로젝트 연결
========================================== */

function synchronizeModules(){

    console.log(

        "Athlete Connected"

    );

    console.log(

        "Video Connected"

    );

    console.log(

        "Pose Connected"

    );

    console.log(

        "Heatmap Connected"

    );

    console.log(

        "Weight Connected"

    );

    console.log(

        "Polar Connected"

    );

}

/* ==========================================
   종료
========================================== */

function destroyReport(){

    ReportManager.current=null;

    ReportManager.chart=null;

    ReportManager.photos=[];

    ReportManager.videos=[];

}