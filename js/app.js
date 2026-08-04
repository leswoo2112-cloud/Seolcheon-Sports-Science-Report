/*
==========================================================
SEOLCHEON SPORTS SCIENCE PRO
Version : 1.0
File : app.js
==========================================================
*/

class SportsScienceApp {

    constructor() {

        this.currentPage = "dashboard";

        this.init();

    }

    init() {

        this.initSidebar();

        this.initHeader();

        this.loadDashboard();

        console.log("SEOLCHEON SPORTS SCIENCE PRO");

    }

    /* ==========================
        Sidebar
    ========================== */

    initSidebar() {

        const menus = document.querySelectorAll(".sidebar li");

        menus.forEach(menu => {

            menu.addEventListener("click", () => {

                menus.forEach(item => item.classList.remove("active"));

                menu.classList.add("active");

                this.currentPage = menu.innerText.trim();

                this.changePage(this.currentPage);

            });

        });

    }

    /* ==========================
        Header
    ========================== */

    initHeader() {

        const buttons = document.querySelectorAll(".header-right button");

        buttons.forEach((button,index)=>{

            button.addEventListener("click",()=>{

                switch(index){

                    case 0:
                        console.log("Search");
                        break;

                    case 1:
                        this.toggleDarkMode();
                        break;

                    case 2:
                        console.log("Profile");
                        break;

                }

            });

        });

    }

    /* ==========================
        Dashboard
    ========================== */

    loadDashboard() {

        const content = document.getElementById("content");

        content.innerHTML = `

        <div class="welcome">

            <h2>Welcome</h2>

            <p>SEOLCHEON SPORTS SCIENCE PRO</p>

        </div>

        `;

    }

    /* ==========================
        Page
    ========================== */

    changePage(page) {

        const content = document.getElementById("content");

        content.innerHTML = `

        <div class="page">

            <h2>${page}</h2>

            <p>준비 중...</p>

        </div>

        `;

        console.log(page);

    }

    /* ==========================
        Dark Mode
    ========================== */

    toggleDarkMode() {

        document.body.classList.toggle("light");

    }

}

/* ===================================== */

window.addEventListener("DOMContentLoaded",()=>{

    new SportsScienceApp();

});