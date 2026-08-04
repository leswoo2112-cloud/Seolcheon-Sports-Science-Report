/*
==========================================================
설천고 스포츠과학 분석센터 PRO
Version : 1.0
File : app.js
==========================================================
*/

class SportsScienceApp {

    constructor() {

        this.currentPage = "대시보드";

        this.initialize();

    }

    /* ==========================
        시작
    ========================== */

    initialize() {

        this.initializeMenu();

        this.initializeButtons();

        this.showWelcome();

        this.startClock();

        console.log("설천고 스포츠과학 분석센터 PRO 시작");

    }

    /* ==========================
        사이드 메뉴
    ========================== */

    initializeMenu() {

        const menus = document.querySelectorAll(".sidebar li");

        menus.forEach(menu => {

            menu.addEventListener("click", () => {

                menus.forEach(item => {

                    item.classList.remove("active");

                });

                menu.classList.add("active");

                this.currentPage = menu.innerText.trim();

                this.changePage(this.currentPage);

            });

        });

    }

    /* ==========================
        상단 버튼
    ========================== */

    initializeButtons() {

        const buttons = document.querySelectorAll(".header-menu button");

        buttons[0].addEventListener("click", () => {

            alert("검색 기능은 준비 중입니다.");

        });

        buttons[1].addEventListener("click", () => {

            alert("알림 기능은 준비 중입니다.");

        });

        buttons[2].addEventListener("click", () => {

            this.toggleTheme();

        });

        buttons[3].addEventListener("click", () => {

            alert("프로필 기능은 준비 중입니다.");

        });

    }

    /* ==========================
        첫 화면
    ========================== */

    showWelcome() {

        const content = document.getElementById("content");

        content.innerHTML = `

            <div class="welcome-card">

                <h2>환영합니다.</h2>

                <p>

                    설천고 스포츠과학 분석센터 PRO

                </p>

                <br>

                <p>

                    좌측 메뉴에서 원하는 분석을 선택하세요.

                </p>

            </div>

        `;

    }

    /* ==========================
        페이지 변경
    ========================== */

    changePage(page) {

        const content = document.getElementById("content");

        content.innerHTML = `

            <div class="welcome-card">

                <h2>${page}</h2>

                <p>

                    ${page} 기능은 현재 개발 중입니다.

                </p>

            </div>

        `;

        console.log(page);

    }

    /* ==========================
        다크모드
    ========================== */

    toggleTheme() {

        document.body.classList.toggle("light");

    }

    /* ==========================
        시계
    ========================== */

    startClock() {

        setInterval(() => {

            const now = new Date();

            console.log(now.toLocaleTimeString());

        },1000);

    }

}

/* ==========================
        실행
========================== */

window.addEventListener("DOMContentLoaded", () => {

    new SportsScienceApp();

});