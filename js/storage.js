/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : storage.js
 Version : 1.0.0
=========================================================
*/

class StorageManager {

    /* ===============================
       저장
    =============================== */

    static save(key, value) {

        try {

            localStorage.setItem(key, JSON.stringify(value));

            return true;

        } catch (error) {

            console.error("저장 실패 :", error);

            return false;

        }

    }

    /* ===============================
       불러오기
    =============================== */

    static load(key, defaultValue = null) {

        try {

            const data = localStorage.getItem(key);

            if (data === null) {

                return defaultValue;

            }

            return JSON.parse(data);

        } catch (error) {

            console.error("불러오기 실패 :", error);

            return defaultValue;

        }

    }

    /* ===============================
       삭제
    =============================== */

    static remove(key) {

        localStorage.removeItem(key);

    }

    /* ===============================
       전체 삭제
    =============================== */

    static clear() {

        localStorage.clear();

    }

    /* ===============================
       존재 여부
    =============================== */

    static has(key) {

        return localStorage.getItem(key) !== null;

    }

    /* ===============================
       모든 Key
    =============================== */

    static keys() {

        return Object.keys(localStorage);

    }

}

/* ==========================================
    설정 저장
========================================== */

function saveSettings(settings) {

    StorageManager.save(

        CONFIG.STORAGE.SETTINGS,

        settings

    );

}

/* ==========================================
    설정 불러오기
========================================== */

function loadSettings() {

    return StorageManager.load(

        CONFIG.STORAGE.SETTINGS,

        {}

    );

}

/* ==========================================
    선수 저장
========================================== */

function saveAthletes(list) {

    StorageManager.save(

        CONFIG.STORAGE.ATHLETES,

        list

    );

}

/* ==========================================
    선수 불러오기
========================================== */

function loadAthletes() {

    return StorageManager.load(

        CONFIG.STORAGE.ATHLETES,

        []

    );

}

/* ==========================================
    리포트 저장
========================================== */

function saveReports(list) {

    StorageManager.save(

        CONFIG.STORAGE.REPORTS,

        list

    );

}

/* ==========================================
    리포트 불러오기
========================================== */

function loadReports() {

    return StorageManager.load(

        CONFIG.STORAGE.REPORTS,

        []

    );

}

/* ==========================================
    언어 저장
========================================== */

function saveLanguage(language) {

    StorageManager.save(

        CONFIG.STORAGE.LANGUAGE,

        language

    );

}

/* ==========================================
    언어 불러오기
========================================== */

function loadLanguage() {

    return StorageManager.load(

        CONFIG.STORAGE.LANGUAGE,

        CONFIG.DEFAULT_LANGUAGE

    );

}

/* ==========================================
    테마 저장
========================================== */

function saveTheme(theme) {

    StorageManager.save(

        CONFIG.STORAGE.THEME,

        theme

    );

}

/* ==========================================
    테마 불러오기
========================================== */

function loadTheme() {

    return StorageManager.load(

        CONFIG.STORAGE.THEME,

        CONFIG.DEFAULT_THEME

    );

}