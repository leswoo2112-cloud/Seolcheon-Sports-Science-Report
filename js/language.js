/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : language.js
 Version : 1.0.0
=========================================================
*/

const LANGUAGE = {

    ko: {

        dashboard: "대시보드",
        athlete: "선수관리",
        pose: "자세분석",
        video: "영상분석",
        heatmap: "히트맵",
        match: "경기분석",
        weight: "웨이트",
        pe: "체대입시",
        shooting: "사격분석",
        biathlon: "바이애슬론",
        polar: "Polar",
        report: "리포트",
        settings: "설정"

    },

    en: {

        dashboard: "Dashboard",
        athlete: "Athletes",
        pose: "Pose Analysis",
        video: "Video Analysis",
        heatmap: "Heatmap",
        match: "Match Analysis",
        weight: "Weight",
        pe: "PE Entrance",
        shooting: "Shooting",
        biathlon: "Biathlon",
        polar: "Polar",
        report: "Report",
        settings: "Settings"

    },

    ja: {

        dashboard: "ダッシュボード",
        athlete: "選手管理",
        pose: "姿勢分析",
        video: "映像分析",
        heatmap: "ヒートマップ",
        match: "試合分析",
        weight: "ウェイト",
        pe: "体育大学入試",
        shooting: "射撃分析",
        biathlon: "バイアスロン",
        polar: "Polar",
        report: "レポート",
        settings: "設定"

    },

    zh: {

        dashboard: "仪表板",
        athlete: "运动员管理",
        pose: "姿势分析",
        video: "视频分析",
        heatmap: "热力图",
        match: "比赛分析",
        weight: "力量训练",
        pe: "体育考试",
        shooting: "射击分析",
        biathlon: "冬季两项",
        polar: "Polar",
        report: "报告",
        settings: "设置"

    }

};

/* ==========================================
    현재 언어
========================================== */

let currentLanguage = loadLanguage();

/* ==========================================
    언어 변경
========================================== */

function setLanguage(language){

    if(!LANGUAGE[language]){

        return;

    }

    currentLanguage = language;

    saveLanguage(language);

    updateLanguage();

}

/* ==========================================
    번역
========================================== */

function t(key){

    return LANGUAGE[currentLanguage][key] || key;

}

/* ==========================================
    화면 적용
========================================== */

function updateLanguage(){

    document.querySelectorAll("[data-lang]").forEach(item=>{

        const key = item.dataset.lang;

        item.textContent = t(key);

    });

}

/* ==========================================
    시작
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    updateLanguage();

});