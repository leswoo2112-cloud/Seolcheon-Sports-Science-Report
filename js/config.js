/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : config.js
 Version : 1.0.0
=========================================================
*/

const CONFIG = {

    /* ===============================
       프로그램
    =============================== */

    APP_NAME: "설천고 스포츠과학 분석센터 PRO",

    SHORT_NAME: "Seolcheon Sports Science",

    VERSION: "1.0.0",

    COMPANY: "Seolcheon High School",

    AUTHOR: "Lee Eun Seong",


    /* ===============================
       언어
    =============================== */

    DEFAULT_LANGUAGE: "ko",

    LANGUAGES: {

        ko: "한국어",

        en: "English",

        ja: "日本語",

        zh: "中文"

    },


    /* ===============================
       화면
    =============================== */

    DEFAULT_THEME: "dark",

    SPLASH_TIME: 3000,


    /* ===============================
       카메라
    =============================== */

    CAMERA: {

        DEFAULT: "user",

        WIDTH: 1280,

        HEIGHT: 720,

        FPS: 30

    },


    /* ===============================
       AI
    =============================== */

    AI: {

        ENABLE: true,

        POSE_SCORE: true,

        VIDEO_SCORE: true,

        REPORT_SCORE: true

    },


    /* ===============================
       Polar
    =============================== */

    POLAR: {

        AUTO_CONNECT: false,

        HEART_RATE: true,

        SPEED: true,

        DISTANCE: true,

        CALORIE: true

    },


    /* ===============================
       저장
    =============================== */

    STORAGE: {

        SETTINGS: "ssc_settings",

        ATHLETES: "ssc_athletes",

        REPORTS: "ssc_reports",

        LANGUAGE: "ssc_language",

        THEME: "ssc_theme"

    },


    /* ===============================
       리포트
    =============================== */

    REPORT: {

        AUTO_SAVE: true,

        PDF_NAME: "설천고 스포츠과학 리포트"

    }

};


/* ==========================================
    CONFIG 읽기
========================================== */

function getConfig(key){

    return CONFIG[key];

}


/* ==========================================
    버전
========================================== */

function getVersion(){

    return CONFIG.VERSION;

}


/* ==========================================
    프로그램명
========================================== */

function getProgramName(){

    return CONFIG.APP_NAME;

}