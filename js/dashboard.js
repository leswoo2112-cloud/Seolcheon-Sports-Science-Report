/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : dashboard.js
 Version : 1.0.0
=========================================================
*/

const Dashboard = {

    athleteCount: 0,

    analysisCount: 0,

    reportCount: 0,

    sessionCount: 0,

    condition: "좋음",

    fatigue: 12,

    heartRate: 68,

    calories: 0,

    weather: "-"

};

/* ===============================
   시작
=============================== */

function initializeDashboard(){

    loadDashboardData();

    updateDashboardCards();

    updateAI();

    updatePolar();

    updateActivity();

}
/* ===============================
   데이터
=============================== */

function loadDashboardData(){

    Dashboard.athleteCount = loadAthletes().length;

    Dashboard.reportCount = loadReports().length;

    Dashboard.analysisCount = 0;

    Dashboard.sessionCount = 0;

}
/* ===============================
   카드
=============================== */

function updateDashboardCards(){

    setText(

        "athleteCount",

        Dashboard.athleteCount

    );

    setText(

        "analysisCount",

        Dashboard.analysisCount

    );

    setText(

        "reportCount",

        Dashboard.reportCount

    );

    setText(

        "sessionCount",

        Dashboard.sessionCount

    );

}
/* ===============================
   AI
=============================== */

function updateAI(){

    const condition = document.getElementById(

        "aiCondition"

    );

    const fatigue = document.getElementById(

        "aiFatigue"

    );

    if(condition){

        condition.innerHTML = Dashboard.condition;

    }

    if(fatigue){

        fatigue.innerHTML =

            Dashboard.fatigue + "%";

    }

}
/* ===============================
   Polar
=============================== */

function updatePolar(){

    const heart = document.getElementById(

        "heartRate"

    );

    if(!heart){

        return;

    }

    heart.innerHTML =

        Dashboard.heartRate + " BPM";

}
/* ===============================
   최근 활동
=============================== */

const Activity = [];

function addActivity(title, description) {

    Activity.unshift({

        id: Utils.randomId(),

        title: title,

        description: description,

        time: Utils.now()

    });

    if (Activity.length > 10) {

        Activity.pop();

    }

    updateActivity();

}

function updateActivity() {

    const container = document.getElementById("activityList");

    if (!container) return;

    container.innerHTML = "";

    Activity.forEach(item => {

        container.innerHTML += `

        <div class="activity-item">

            <div class="activity-time">

                ${item.time}

            </div>

            <div class="activity-title">

                ${item.title}

            </div>

            <div class="activity-desc">

                ${item.description}

            </div>

        </div>

        `;

    });

}
/* ===============================
   최근 리포트
=============================== */

function updateRecentReports() {

    const reports = loadReports();

    const container = document.getElementById("recentReports");

    if (!container) return;

    container.innerHTML = "";

    reports.slice(-5).reverse().forEach(report => {

        container.innerHTML += `

        <div class="report-item">

            <b>${report.title}</b>

            <span>${report.date}</span>

        </div>

        `;

    });

}
/* ===============================
   최근 자세분석
=============================== */

function updateRecentPose() {

    const container = document.getElementById("recentPose");

    if (!container) return;

    container.innerHTML = `

    <div class="empty-card">

        최근 자세분석 데이터가 없습니다.

    </div>

    `;

}
/* ===============================
   최근 영상분석
=============================== */

function updateRecentVideo() {

    const container = document.getElementById("recentVideo");

    if (!container) return;

    container.innerHTML = `

    <div class="empty-card">

        최근 영상분석 데이터가 없습니다.

    </div>

    `;

}
/* ===============================
   새로고침
=============================== */

function refreshDashboard() {

    loadDashboardData();

    updateDashboardCards();

    updateAI();

    updatePolar();

    updateActivity();

    updateRecentReports();

    updateRecentPose();

    updateRecentVideo();

}

/* ===============================
   자동 새로고침
=============================== */

setInterval(refreshDashboard,5000);