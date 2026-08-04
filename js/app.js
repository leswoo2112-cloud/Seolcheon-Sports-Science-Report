"use strict";

/* =========================================================
   설천고 스포츠과학 분석센터 PRO
   메인 앱 제어
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeQuickButtons();
    initializeHeaderButtons();
    initializeAthleteModal();
    initializeTheme();
    openInitialPage();
    closeSplashScreen();
}

/* =========================================================
   페이지 이름
========================================================= */

const PAGE_TITLES = {
    dashboard: "대시보드",
    athlete: "선수관리",
    pose: "자세분석",
    video: "영상분석",
    heatmap: "히트맵",
    sports: "경기분석",
    weight: "웨이트",
    pe: "체대입시",
    shooting: "사격분석",
    biathlon: "바이애슬론",
    polar: "Polar",
    records: "기록관리",
    report: "리포트",
    settings: "설정"
};

/* =========================================================
   사이드바 메뉴
========================================================= */

function initializeNavigation() {
    const menuLinks = document.querySelectorAll(
        ".sidebar a[data-page]"
    );

    menuLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const pageName = link.dataset.page;

            if (!pageName) {
                return;
            }

            navigate(pageName);
        });
    });

    window.addEventListener("hashchange", () => {
        const pageName = getPageFromHash();

        showPage(pageName, false);
    });
}

/* =========================================================
   페이지 이동
========================================================= */

function navigate(pageName) {
    const targetPage = document.getElementById(pageName);

    if (!targetPage) {
        console.warn(`페이지를 찾을 수 없습니다: ${pageName}`);
        showToast(
            `${PAGE_TITLES[pageName] || pageName} 화면을 찾을 수 없습니다.`,
            "warning"
        );
        return;
    }

    showPage(pageName, true);
}

/* 전역 함수로 등록 */
window.navigate = navigate;

function showPage(pageName, updateHash = true) {
    const pages = document.querySelectorAll(".page");
    const targetPage = document.getElementById(pageName);

    if (!targetPage) {
        return;
    }

    pages.forEach((page) => {
        const isTarget = page.id === pageName;

        page.hidden = !isTarget;
        page.classList.toggle("active", isTarget);
    });

    updateActiveMenu(pageName);
    updatePageTitle(pageName);

    if (updateHash) {
        const newHash = `#${pageName}`;

        if (window.location.hash !== newHash) {
            history.pushState(null, "", newHash);
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    runPageInitializer(pageName);
}

/* =========================================================
   첫 화면
========================================================= */

function openInitialPage() {
    const initialPage = getPageFromHash();

    showPage(initialPage, false);
}

function getPageFromHash() {
    const hashPage = window.location.hash.replace("#", "").trim();

    if (
        hashPage &&
        document.getElementById(hashPage)?.classList.contains("page")
    ) {
        return hashPage;
    }

    return "dashboard";
}

/* =========================================================
   활성 메뉴 표시
========================================================= */

function updateActiveMenu(pageName) {
    const menuItems = document.querySelectorAll(".sidebar nav li");

    menuItems.forEach((item) => {
        item.classList.remove("active");

        const link = item.querySelector("a[data-page]");

        if (link?.dataset.page === pageName) {
            item.classList.add("active");
        }
    });
}

/* =========================================================
   헤더 제목
========================================================= */

function updatePageTitle(pageName) {
    const titleElement = document.getElementById("pageTitle");

    if (!titleElement) {
        return;
    }

    const pageTitle = PAGE_TITLES[pageName] || "스포츠과학 분석센터";

    titleElement.textContent =
        `설천고 스포츠과학 분석센터 PRO · ${pageTitle}`;
}

/* =========================================================
   빠른 실행 버튼
========================================================= */

function initializeQuickButtons() {
    const quickButtons = document.querySelectorAll(
        "[data-open-page]"
    );

    quickButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const pageName = button.dataset.openPage;

            if (pageName) {
                navigate(pageName);
            }
        });
    });

    const quickPolarButton =
        document.getElementById("quickPolarButton");

    if (quickPolarButton) {
        quickPolarButton.addEventListener("click", () => {
            navigate("polar");
        });
    }
}

/* =========================================================
   페이지별 초기화
========================================================= */

function runPageInitializer(pageName) {
    const initializerNames = {
        dashboard: [
            "renderDashboard",
            "updateDashboard"
        ],
        athlete: [
            "renderAthletes",
            "loadAthletes"
        ],
        pose: [
            "initializePosePage"
        ],
        video: [
            "initializeVideoPage"
        ],
        heatmap: [
            "initializeHeatmap"
        ],
        sports: [
            "initializeSportsPage"
        ],
        weight: [
            "renderWeightRecords",
            "initializeWeightPage"
        ],
        shooting: [
            "initializeShooting"
        ],
        biathlon: [
            "renderBiathlon",
            "initializeBiathlon"
        ],
        polar: [
            "initializePolarPage"
        ],
        records: [
            "renderRecords",
            "loadRecords"
        ],
        report: [
            "refreshReport"
        ],
        settings: [
            "loadApplicationSettings"
        ]
    };

    const functionNames = initializerNames[pageName] || [];

    functionNames.forEach((functionName) => {
        const pageFunction = window[functionName];

        if (typeof pageFunction === "function") {
            try {
                pageFunction();
            } catch (error) {
                console.error(
                    `${functionName} 실행 오류:`,
                    error
                );
            }
        }
    });
}

/* =========================================================
   헤더 버튼
========================================================= */

function initializeHeaderButtons() {
    const themeButton =
        document.getElementById("themeButton");

    const fullscreenButton =
        document.getElementById("fullscreenButton");

    const searchButton =
        document.getElementById("searchButton");

    const notificationButton =
        document.getElementById("notificationButton");

    const profileButton =
        document.getElementById("profileButton");

    themeButton?.addEventListener("click", toggleTheme);

    fullscreenButton?.addEventListener(
        "click",
        toggleFullscreen
    );

    searchButton?.addEventListener("click", () => {
        showToast("검색 기능을 준비 중입니다.", "info");
    });

    notificationButton?.addEventListener("click", () => {
        showToast("새로운 알림이 없습니다.", "info");
    });

    profileButton?.addEventListener("click", () => {
        showToast("사용자 정보 기능을 준비 중입니다.", "info");
    });
}

/* =========================================================
   테마
========================================================= */

function initializeTheme() {
    const savedTheme =
        localStorage.getItem("sportsScienceTheme") || "dark";

    applyTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    const nextTheme =
        currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
}

function applyTheme(theme) {
    const safeTheme =
        theme === "light" ? "light" : "dark";

    document.documentElement.setAttribute(
        "data-theme",
        safeTheme
    );

    document.body.setAttribute(
        "data-theme",
        safeTheme
    );

    localStorage.setItem(
        "sportsScienceTheme",
        safeTheme
    );

    const themeButton =
        document.getElementById("themeButton");

    const darkModeToggle =
        document.getElementById("darkModeToggle");

    if (themeButton) {
        themeButton.innerHTML =
            safeTheme === "dark"
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';
    }

    if (darkModeToggle) {
        darkModeToggle.checked =
            safeTheme === "dark";
    }
}

window.applyTheme = applyTheme;

/* =========================================================
   전체 화면
========================================================= */

async function toggleFullscreen() {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error("전체 화면 오류:", error);

        showToast(
            "이 브라우저에서는 전체 화면 기능이 제한될 수 있습니다.",
            "warning"
        );
    }
}

window.toggleFullscreen = toggleFullscreen;

/* =========================================================
   선수 등록 모달
========================================================= */

function initializeAthleteModal() {
    const modal =
        document.getElementById("athleteModal");

    const openButton =
        document.getElementById("openAthleteModalButton");

    const closeButton =
        document.getElementById("closeAthleteModalButton");

    if (!modal) {
        return;
    }

    openButton?.addEventListener("click", () => {
        openAthleteModal();
    });

    closeButton?.addEventListener("click", () => {
        closeAthleteModal();
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeAthleteModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAthleteModal();
        }
    });
}

function openAthleteModal() {
    const modal =
        document.getElementById("athleteModal");

    if (!modal) {
        return;
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

function closeAthleteModal() {
    const modal =
        document.getElementById("athleteModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
}

window.openAthleteModal = openAthleteModal;
window.closeAthleteModal = closeAthleteModal;

/* =========================================================
   토스트 알림
========================================================= */

function showToast(message, type = "info") {
    const container =
        document.getElementById("toastContainer");

    if (!container) {
        console.log(message);
        return;
    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    window.setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(30px)";
    }, 2500);

    window.setTimeout(() => {
        toast.remove();
    }, 2900);
}

window.showToast = showToast;

/* =========================================================
   스플래시 종료
========================================================= */

function closeSplashScreen() {
    const splash =
        document.getElementById("splash");

    if (!splash) {
        return;
    }

    window.setTimeout(() => {
        splash.style.opacity = "0";
        splash.style.visibility = "hidden";
        splash.style.pointerEvents = "none";

        window.setTimeout(() => {
            splash.remove();
        }, 450);
    }, 700);
}