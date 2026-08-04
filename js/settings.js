/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : settings.js
 Version : 1.0.0
=========================================================
*/

const DEFAULT_SETTINGS = {

    language: CONFIG.DEFAULT_LANGUAGE,

    theme: CONFIG.DEFAULT_THEME,

    autoSave: true,

    autoLogin: false,

    camera: CONFIG.CAMERA.DEFAULT,

    cameraResolution: "1280x720",

    fps: CONFIG.CAMERA.FPS,

    polarAutoConnect: CONFIG.POLAR.AUTO_CONNECT,

    notification: true,

    sound: true,

    vibration: false,

    reportAutoSave: true

};

/* ==========================================
   현재 설정
========================================== */

let settings = loadSettings();

/* ==========================================
   최초 실행
========================================== */

function initializeSettings(){

    if(Object.keys(settings).length === 0){

        settings = {...DEFAULT_SETTINGS};

        saveSettings(settings);

    }

}

/* ==========================================
   설정 저장
========================================== */

function updateSetting(key,value){

    settings[key]=value;

    saveSettings(settings);

}

/* ==========================================
   설정 읽기
========================================== */

function getSetting(key){

    return settings[key];

}

/* ==========================================
   다크모드
========================================== */

function setTheme(theme){

    updateSetting("theme",theme);

    document.body.setAttribute("data-theme",theme);

}

/* ==========================================
   언어
========================================== */

function changeLanguage(language){

    updateSetting("language",language);

    setLanguage(language);

}

/* ==========================================
   카메라
========================================== */

function changeCamera(camera){

    updateSetting("camera",camera);

}

/* ==========================================
   자동 저장
========================================== */

function toggleAutoSave(){

    updateSetting(

        "autoSave",

        !getSetting("autoSave")

    );

}

/* ==========================================
   Polar 자동 연결
========================================== */

function togglePolar(){

    updateSetting(

        "polarAutoConnect",

        !getSetting("polarAutoConnect")

    );

}

/* ==========================================
   알림
========================================== */

function toggleNotification(){

    updateSetting(

        "notification",

        !getSetting("notification")

    );

}

/* ==========================================
   소리
========================================== */

function toggleSound(){

    updateSetting(

        "sound",

        !getSetting("sound")

    );

}

/* ==========================================
   초기화
========================================== */

function resetSettings(){

    settings={...DEFAULT_SETTINGS};

    saveSettings(settings);

    location.reload();

}

/* ==========================================
   시작
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    initializeSettings();

    document.body.setAttribute(

        "data-theme",

        settings.theme

    );

});