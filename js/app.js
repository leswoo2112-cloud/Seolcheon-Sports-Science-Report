/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : app.js
 Part 1
=========================================================
*/

document.addEventListener("DOMContentLoaded", startApp);

/* ===============================
   프로그램 시작
=============================== */

function startApp() {

    console.log("설천고 스포츠과학 분석센터 PRO");

    console.log("Version :", getVersion());

    initializeApp();

}

/* ===============================
   초기화
=============================== */

function initializeApp() {

    initializeSettings();

    updateLanguage();

    showSplash();

}
/* ===============================
   Splash 화면
=============================== */

function showSplash() {

    const splash = document.getElementById("splash");

    if (!splash) {

        loadDashboard();

        return;

    }

    splash.style.display = "flex";

    let progress = 0;

    const progressBar = document.getElementById("loadingBar");

    const progressText = document.getElementById("loadingText");

    const loadingList = [

        "AI 엔진 로드 중...",

        "MediaPipe 초기화...",

        "카메라 확인...",

        "Polar 연결 확인...",

        "환경설정 불러오는 중...",

        "대시보드 준비 중..."

    ];

    const timer = setInterval(() => {

        progress += 2;

        if (progressBar) {

            progressBar.style.width = progress + "%";

        }

        if (progressText) {

            const index = Math.min(

                Math.floor(progress / 20),

                loadingList.length - 1

            );

            progressText.innerText =

                loadingList[index];

        }

        if (progress >= 100) {

            clearInterval(timer);

            setTimeout(() => {

                splash.style.display = "none";

                loadDashboard();

            }, 500);

        }

    }, 60);

}
/* ===============================
   대시보드
=============================== */

function loadDashboard() {

    Utils.log("대시보드 로드");

    updateDashboard();

    initializeMenu();

    initializeQuickButtons();

}
/* ===============================
   대시보드 데이터
=============================== */

function updateDashboard() {

    setText("athleteCount", loadAthletes().length);

    setText("analysisCount", 0);

    setText("reportCount", loadReports().length);

    setText("sessionCount", 0);

}
/* ===============================
   HTML 출력
=============================== */

function setText(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = value;

}
/* ===============================
   메뉴 이동
=============================== */

function initializeMenu() {

    const menus = document.querySelectorAll(".sidebar li");

    menus.forEach(menu => {

        menu.addEventListener("click", () => {

            menus.forEach(item => {

                item.classList.remove("active");

            });

            menu.classList.add("active");

            const page = menu.innerText.trim();

            changePage(page);

        });

    });

}
/* ===============================
   페이지 변경
=============================== */

function changePage(page) {

    Utils.log(page + " 페이지");

    switch(page){

        case "대시보드":

            updateDashboard();

            break;

        case "선수관리":

            loadAthletePage();

            break;

        case "자세분석":

            loadPosePage();

            break;

        case "영상분석":

            loadVideoPage();

            break;

        case "히트맵":

            loadHeatmapPage();

            break;

        case "웨이트":

            loadWeightPage();

            break;

        case "체대입시":

            loadPEPage();

            break;

        case "사격분석":

            loadShootingPage();

            break;

        case "바이애슬론":

            loadBiathlonPage();

            break;

        case "Polar":

            loadPolarPage();

            break;

        case "리포트":

            loadReportPage();

            break;

        case "설정":

            loadSettingsPage();

            break;

    }

}
/* ===============================
   임시 페이지
=============================== */

function loadAthletePage(){}

function loadPosePage(){}

function loadVideoPage(){}

function loadHeatmapPage(){}

function loadWeightPage(){}

function loadPEPage(){}

function loadShootingPage(){}

function loadBiathlonPage(){}

function loadPolarPage(){}

function loadReportPage(){}

function loadSettingsPage(){}
/* ===============================
   빠른 실행 버튼
=============================== */

function initializeQuickButtons() {

    connectButton("poseBtn", loadPosePage);

    connectButton("videoBtn", loadVideoPage);

    connectButton("weightBtn", loadWeightPage);

    connectButton("reportBtn", loadReportPage);

    connectButton("polarBtn", loadPolarPage);

    connectButton("biathlonBtn", loadBiathlonPage);

}

/* ===============================
   버튼 연결
=============================== */

function connectButton(id, callback) {

    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("click", callback);

}
/* ===============================
   실시간 시계
=============================== */

function startClock() {

    updateClock();

    setInterval(updateClock, 1000);

}

function updateClock() {

    const clock = document.getElementById("clock");

    if (!clock) return;

    const now = new Date();

    clock.innerHTML =

        now.toLocaleDateString("ko-KR")

        +

        " "

        +

        now.toLocaleTimeString("ko-KR");

}
/* ===============================
   프로그램 종료
=============================== */

function shutdownApp() {

    console.clear();

    Utils.log("프로그램 종료");

}
/* ===============================
   프로그램 정보
=============================== */

function appInfo() {

    console.table({

        프로그램: CONFIG.APP_NAME,

        버전: CONFIG.VERSION,

        제작자: CONFIG.AUTHOR,

        학교: CONFIG.COMPANY

    });

}
function initializeApp() {

    initializeSettings();

    updateLanguage();

    startClock();

    appInfo();

    showSplash();

}