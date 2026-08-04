/*
=========================================================
 설천고 스포츠과학 훈련센터 PRO
 Main Application
 Version 2.0.0
=========================================================
*/

const App = {

    version : "2.0.0",

    initialized : false,

    currentPage : "dashboard",

    modules : {},

    language : "ko",

    theme : "light"

};

/* ==========================================
   앱 시작
========================================== */

async function initializeApp(){

    console.log(

        "Seolcheon Sports Science PRO"

    );

    initializeStorage();

    initializeSettings();

    initializeLanguage();

    initializeFirebase(firebaseConfig);

    initializeDashboard();

    initializePose();

    initializeCamera();

    initializeVideo();

    initializeHeatmap();

    initializeWeight();

    initializeShooting();

    initializeBiathlon();

    initializePolar();

    initializeAI();

    initializeReport();

    initializeAthlete();

    initializeRouter();

    loadApplicationSettings();

    App.initialized = true;

}

/* ==========================================
   라우터
========================================== */

function initializeRouter(){

    window.addEventListener(

        "hashchange",

        handleRoute

    );

    handleRoute();

}

/* ==========================================
   페이지 이동
========================================== */

function navigate(page){

    location.hash = page;

}

/* ==========================================
   라우트 처리
========================================== */

function handleRoute(){

    const page =

        location.hash.replace("#","")

        || "dashboard";

    App.currentPage = page;

    showPage(page);

}

/* ==========================================
   페이지 표시
========================================== */

function showPage(page){

    document

        .querySelectorAll(".page")

        .forEach(item=>{

            item.style.display="none";

        });

    const target =

        document.getElementById(page);

    if(target){

        target.style.display="block";

    }

}
/* ==========================================
   로그인 상태 확인
========================================== */

async function checkAuthentication(){

    return new Promise(resolve=>{

        FirebaseManager.auth.onAuthStateChanged(

            user=>{

                if(user){

                    App.user=user;

                    resolve(true);

                }else{

                    App.user=null;

                    navigate("login");

                    resolve(false);

                }

            }

        );

    });

}

/* ==========================================
   사용자 권한
========================================== */

async function loadUserRole(){

    if(!App.user){

        return;

    }

    App.role=

        await getUserRole(

            App.user.uid

        );

}

/* ==========================================
   권한 확인
========================================== */

function hasPermission(role){

    const level={

        guest:0,

        athlete:1,

        coach:2,

        admin:3

    };

    return level[App.role] >=

           level[role];

}

/* ==========================================
   언어 적용
========================================== */

function applyAppLanguage(){

    const language=

        localStorage.getItem(

            "language"

        ) || "ko";

    App.language=language;

    applyLanguage(language);

}

/* ==========================================
   테마 적용
========================================== */

function applyAppTheme(){

    const theme=

        localStorage.getItem(

            "theme"

        ) || "light";

    App.theme=theme;

    applyTheme(theme);

}

/* ==========================================
   설정 불러오기
========================================== */

function loadApplicationSettings(){

    applyAppLanguage();

    applyAppTheme();

}

/* ==========================================
   설정 저장
========================================== */

function saveApplicationSettings(){

    localStorage.setItem(

        "language",

        App.language

    );

    localStorage.setItem(

        "theme",

        App.theme

    );

}

/* ==========================================
   모바일 확인
========================================== */

function isMobile(){

    return /Android|iPhone|iPad|iPod/i

        .test(

            navigator.userAgent

        );

}

/* ==========================================
   레이아웃
========================================== */

function updateLayout(){

    const body=document.body;

    body.classList.remove(

        "mobile",

        "tablet",

        "desktop"

    );

    if(window.innerWidth<768){

        body.classList.add(

            "mobile"

        );

    }

    else if(window.innerWidth<1200){

        body.classList.add(

            "tablet"

        );

    }

    else{

        body.classList.add(

            "desktop"

        );

    }

}

/* ==========================================
   Resize
========================================== */

window.addEventListener(

    "resize",

    updateLayout

);
/* ==========================================
   카메라 자동 연결
========================================== */

async function connectCameraModule(){

    try{

        if(typeof initializeCamera==="function"){

            await initializeCamera();

        }

    }catch(error){

        console.error(error);

    }

}

/* ==========================================
   Polar 자동 연결
========================================== */

async function connectPolarModule(){

    try{

        if(typeof connectPolar==="function"){

            await connectPolar();

        }

    }catch(error){

        console.error(error);

    }

}

/* ==========================================
   AI 엔진 시작
========================================== */

function startAIEngine(){

    if(typeof initializeAI==="function"){

        initializeAI();

    }

}

/* ==========================================
   Firebase 동기화
========================================== */

async function synchronizeApplication(){

    try{

        if(typeof synchronizeAll==="function"){

            await synchronizeAll();

        }

    }catch(error){

        console.error(error);

    }

}

/* ==========================================
   Dashboard 자동 갱신
========================================== */

function startDashboardRefresh(){

    setInterval(()=>{

        if(typeof refreshDashboard==="function"){

            refreshDashboard();

        }

    },1000);

}

/* ==========================================
   Report 자동 생성
========================================== */

function autoGenerateReport(){

    setInterval(()=>{

        if(typeof createReport==="function"){

            createReport();

        }

    },60000);

}

/* ==========================================
   자동 저장
========================================== */

function autoSave(){

    setInterval(()=>{

        try{

            if(typeof saveWeightData==="function"){

                saveWeightData();

            }

            if(typeof saveShootingData==="function"){

                saveShootingData();

            }

            if(typeof saveBiathlonData==="function"){

                saveBiathlonData();

            }

        }catch(error){

            console.error(error);

        }

    },30000);

}

/* ==========================================
   네트워크 상태
========================================== */

function monitorNetwork(){

    function update(){

        const status=

            navigator.onLine

            ?"online"

            :"offline";

        document.body.dataset.network=

            status;

        console.log(

            "Network :",

            status

        );

    }

    window.addEventListener(

        "online",

        update

    );

    window.addEventListener(

        "offline",

        update

    );

    update();

}

/* ==========================================
   전체 서비스 시작
========================================== */

async function startServices(){

    await connectCameraModule();

    await connectPolarModule();

    startAIEngine();

    synchronizeApplication();

    startDashboardRefresh();

    autoGenerateReport();

    autoSave();

    monitorNetwork();

}
/* ==========================================
   Service Worker 등록
========================================== */

async function registerServiceWorker(){

    if(!("serviceWorker" in navigator)){

        return;

    }

    try{

        const registration =

            await navigator.serviceWorker.register(

                "/sw.js"

            );

        App.serviceWorker = registration;

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   업데이트 확인
========================================== */

async function checkForUpdates(){

    if(!App.serviceWorker){

        return;

    }

    try{

        await App.serviceWorker.update();

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   설치 프롬프트
========================================== */

let installPrompt = null;

window.addEventListener(

    "beforeinstallprompt",

    event=>{

        event.preventDefault();

        installPrompt = event;

    }

);

async function installApplication(){

    if(!installPrompt){

        return;

    }

    installPrompt.prompt();

    await installPrompt.userChoice;

    installPrompt = null;

}

/* ==========================================
   Push Notification
========================================== */

async function initializePushNotification(){

    if(!("Notification" in window)){

        return;

    }

    if(Notification.permission==="default"){

        await Notification.requestPermission();

    }

}

/* ==========================================
   전역 오류
========================================== */

window.addEventListener(

    "error",

    event=>{

        console.error(

            "[APP ERROR]",

            event.error

        );

    }

);

window.addEventListener(

    "unhandledrejection",

    event=>{

        console.error(

            "[PROMISE ERROR]",

            event.reason

        );

    }

);

/* ==========================================
   성능 모니터
========================================== */

function startPerformanceMonitor(){

    setInterval(()=>{

        if(window.performance){

            console.log(

                "Memory :",

                performance.memory

            );

        }

    },10000);

}

/* ==========================================
   시스템 로그
========================================== */

const SystemLog=[];

function addSystemLog(type,message){

    SystemLog.push({

        type,

        message,

        time:new Date()

    });

    if(SystemLog.length>1000){

        SystemLog.shift();

    }

}

function exportSystemLog(){

    const json=

        JSON.stringify(

            SystemLog,

            null,

            2

        );

    Utils.download(

        "system-log.json",

        json

    );

}

/* ==========================================
   앱 시작
========================================== */

async function startApplication(){

    await initializeApp();

    await checkAuthentication();

    await loadUserRole();

    await registerServiceWorker();

    await initializePushNotification();

    await startServices();

    startPerformanceMonitor();

    addSystemLog(

        "SYSTEM",

        "Application Started"

    );

}
/* ==========================================
   모든 모듈 연결
========================================== */

async function initializeModules(){

    const modules=[

        initializeStorage,
        initializeSettings,
        initializeLanguage,
        initializeFirebase,
        initializeAthlete,
        initializeDashboard,
        initializeCamera,
        initializeVideo,
        initializePose,
        initializeHeatmap,
        initializeWeight,
        initializeShooting,
        initializeBiathlon,
        initializePolar,
        initializeAI,
        initializeReport

    ];

    for(const module of modules){

        if(typeof module==="function"){

            try{

                await module();

            }

            catch(error){

                console.error(error);

            }

        }

    }

}

/* ==========================================
   프로젝트 상태 점검
========================================== */

function selfCheck(){

    return{

        firebase:FirebaseManager.initialized,

        dashboard:DashboardManager.initialized,

        ai:AIManager!==undefined,

        camera:CameraManager!==undefined,

        polar:PolarManager.connected,

        network:navigator.onLine,

        version:App.version

    };

}

/* ==========================================
   버전 확인
========================================== */

async function checkVersion(){

    try{

        const version=

            await checkAppVersion();

        if(

            version &&

            version.version!==App.version

        ){

            console.log(

                "새 버전 발견",

                version.version

            );

        }

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   메모리 최적화
========================================== */

function optimizeMemory(){

    if(window.gc){

        window.gc();

    }

    DashboardManager.charts={

        ...DashboardManager.charts

    };

}

/* ==========================================
   Splash 제거
========================================== */

function hideSplash(){

    const splash=

        document.getElementById(

            "splash"

        );

    if(!splash){

        return;

    }

    splash.classList.add(

        "fade-out"

    );

    setTimeout(()=>{

        splash.remove();

    },600);

}

/* ==========================================
   Release Mode
========================================== */

function enableReleaseMode(){

    console.log(

        "Release Mode Enabled"

    );

    App.release=true;

}

/* ==========================================
   종료
========================================== */

function shutdownApplication(){

    destroyDashboard();

    destroyPolar();

    destroyAI();

    destroyFirebase();

    App.initialized=false;

}

/* ==========================================
   메인 실행
========================================== */

window.addEventListener(

    "load",

    async()=>{

        await initializeModules();

        await startApplication();

        await checkVersion();

        optimizeMemory();

        enableReleaseMode();

        hideSplash();

        console.log(

            selfCheck()

        );

    }

);