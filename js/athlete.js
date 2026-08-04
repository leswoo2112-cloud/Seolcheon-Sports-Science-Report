"use strict";

/* =========================================================
   설천고 스포츠과학 분석센터 PRO
   선수 등록 · 수정 · 삭제 · 선택 · 분석 · 리포트 연결
========================================================= */

const ATHLETE_STORAGE_KEY = "sspro-athletes";
const SELECTED_ATHLETE_KEY = "sspro-selected-athlete";

let athleteList = [];
let editingAthleteId = null;

/* =========================================================
   초기화
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeAthleteManagement();
});

function initializeAthleteManagement() {
    loadAthletes();

    bindAthleteEvents();

    renderAthleteTable();

    updateAthleteDashboardCount();

    restoreSelectedAthlete();

    createSelectedAthletePanel();
}

/* =========================================================
   HTML 요소
========================================================= */

function getAthleteElements() {
    return {
        name:
            document.getElementById("athleteName"),

        gender:
            document.getElementById("athleteGender"),

        birth:
            document.getElementById("athleteBirth"),

        sport:
            document.getElementById("athleteSport"),

        height:
            document.getElementById("athleteHeight"),

        weight:
            document.getElementById("athleteWeight"),

        saveButton:
            document.getElementById("saveAthleteButton"),

        tableBody:
            document.getElementById("athleteTableBody"),

        search:
            document.getElementById("athleteSearch")
    };
}

/* =========================================================
   이벤트 연결
========================================================= */

function bindAthleteEvents() {
    const elements = getAthleteElements();

    if (elements.saveButton) {
        elements.saveButton.addEventListener(
            "click",
            handleAthleteSave
        );
    }

    if (elements.search) {
        elements.search.addEventListener(
            "input",
            function () {
                renderAthleteTable(
                    elements.search.value
                );
            }
        );
    }
}

/* =========================================================
   선수 저장
========================================================= */

function handleAthleteSave() {
    const elements = getAthleteElements();

    const name =
        elements.name?.value.trim() || "";

    const gender =
        elements.gender?.value || "남자";

    const birth =
        elements.birth?.value || "";

    const sport =
        elements.sport?.value || "";

    const height =
        Number(elements.height?.value || 0);

    const weight =
        Number(elements.weight?.value || 0);

    if (!name) {
        showAthleteMessage(
            "선수 이름을 입력해 주세요.",
            "warning"
        );

        elements.name?.focus();

        return;
    }

    if (!sport) {
        showAthleteMessage(
            "선수 종목을 선택해 주세요.",
            "warning"
        );

        return;
    }

    if (height < 0 || weight < 0) {
        showAthleteMessage(
            "신장과 체중을 정확하게 입력해 주세요.",
            "warning"
        );

        return;
    }

    if (editingAthleteId) {
        updateAthlete({
            id: editingAthleteId,
            name,
            gender,
            birth,
            sport,
            height,
            weight
        });
    } else {
        addAthlete({
            name,
            gender,
            birth,
            sport,
            height,
            weight
        });
    }
}

/* =========================================================
   선수 추가
========================================================= */

function addAthlete(data) {
    const athlete = {
        id: createAthleteId(),

        name:
            data.name,

        gender:
            data.gender,

        birth:
            data.birth,

        sport:
            data.sport,

        height:
            data.height,

        weight:
            data.weight,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    };

    athleteList.push(athlete);

    saveAthletes();

    selectAthlete(
        athlete.id,
        false
    );

    clearAthleteForm();

    renderAthleteTable();

    updateAthleteDashboardCount();

    updateSelectedAthletePanel();

    showAthleteMessage(
        `${athlete.name} 선수가 등록되었습니다.`,
        "success"
    );
}

/* =========================================================
   선수 수정
========================================================= */

function updateAthlete(data) {
    const athleteIndex =
        athleteList.findIndex(
            function (athlete) {
                return athlete.id === data.id;
            }
        );

    if (athleteIndex === -1) {
        showAthleteMessage(
            "수정할 선수를 찾을 수 없습니다.",
            "error"
        );

        return;
    }

    const oldAthlete =
        athleteList[athleteIndex];

    const updatedAthlete = {
        ...oldAthlete,

        name:
            data.name,

        gender:
            data.gender,

        birth:
            data.birth,

        sport:
            data.sport,

        height:
            data.height,

        weight:
            data.weight,

        updatedAt:
            new Date().toISOString()
    };

    athleteList[athleteIndex] =
        updatedAthlete;

    saveAthletes();

    const selectedAthlete =
        getSelectedAthlete();

    if (
        selectedAthlete &&
        selectedAthlete.id ===
            updatedAthlete.id
    ) {
        saveSelectedAthlete(
            updatedAthlete
        );
    }

    editingAthleteId = null;

    clearAthleteForm();

    renderAthleteTable();

    updateSelectedAthletePanel();

    showAthleteMessage(
        `${updatedAthlete.name} 선수 정보가 수정되었습니다.`,
        "success"
    );
}

/* =========================================================
   선수 삭제
========================================================= */

function deleteAthlete(athleteId) {
    const athlete =
        athleteList.find(
            function (item) {
                return item.id === athleteId;
            }
        );

    if (!athlete) {
        return;
    }

    const confirmed =
        window.confirm(
            `${athlete.name} 선수 정보를 삭제할까요?`
        );

    if (!confirmed) {
        return;
    }

    athleteList =
        athleteList.filter(
            function (item) {
                return item.id !== athleteId;
            }
        );

    saveAthletes();

    const selectedAthlete =
        getSelectedAthlete();

    if (
        selectedAthlete &&
        selectedAthlete.id === athleteId
    ) {
        localStorage.removeItem(
            SELECTED_ATHLETE_KEY
        );
    }

    if (
        editingAthleteId ===
        athleteId
    ) {
        editingAthleteId = null;

        clearAthleteForm();
    }

    renderAthleteTable();

    updateAthleteDashboardCount();

    updateSelectedAthletePanel();

    showAthleteMessage(
        `${athlete.name} 선수 정보가 삭제되었습니다.`,
        "info"
    );
}

/* =========================================================
   수정 모드
========================================================= */

function editAthlete(athleteId) {
    const athlete =
        athleteList.find(
            function (item) {
                return item.id === athleteId;
            }
        );

    if (!athlete) {
        return;
    }

    const elements =
        getAthleteElements();

    editingAthleteId =
        athlete.id;

    if (elements.name) {
        elements.name.value =
            athlete.name;
    }

    if (elements.gender) {
        elements.gender.value =
            athlete.gender;
    }

    if (elements.birth) {
        elements.birth.value =
            athlete.birth;
    }

    if (elements.sport) {
        elements.sport.value =
            athlete.sport;
    }

    if (elements.height) {
        elements.height.value =
            athlete.height || "";
    }

    if (elements.weight) {
        elements.weight.value =
            athlete.weight || "";
    }

    if (elements.saveButton) {
        elements.saveButton.textContent =
            "선수 수정 저장";
    }

    elements.name?.focus();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================================
   입력 초기화
========================================================= */

function clearAthleteForm() {
    const elements =
        getAthleteElements();

    if (elements.name) {
        elements.name.value = "";
    }

    if (elements.birth) {
        elements.birth.value = "";
    }

    if (elements.height) {
        elements.height.value = "";
    }

    if (elements.weight) {
        elements.weight.value = "";
    }

    if (elements.gender) {
        elements.gender.value = "남자";
    }

    if (elements.saveButton) {
        elements.saveButton.textContent =
            "선수 등록";
    }

    editingAthleteId = null;
}

/* =========================================================
   선수 선택
========================================================= */

function selectAthlete(
    athleteId,
    showMessage = true
) {
    const athlete =
        athleteList.find(
            function (item) {
                return item.id === athleteId;
            }
        );

    if (!athlete) {
        showAthleteMessage(
            "선수를 찾을 수 없습니다.",
            "error"
        );

        return;
    }

    saveSelectedAthlete(
        athlete
    );

    renderAthleteTable();

    updateSelectedAthletePanel();

    updateAnalysisAthleteDisplay();

    if (showMessage) {
        showAthleteMessage(
            `${athlete.name} 선수가 선택되었습니다.`,
            "success"
        );
    }
}

/* =========================================================
   선택 선수 저장
========================================================= */

function saveSelectedAthlete(
    athlete
) {
    localStorage.setItem(
        SELECTED_ATHLETE_KEY,
        JSON.stringify(athlete)
    );
}

/* =========================================================
   선택 선수 불러오기
========================================================= */

function getSelectedAthlete() {
    try {
        const saved =
            localStorage.getItem(
                SELECTED_ATHLETE_KEY
            );

        if (!saved) {
            return null;
        }

        return JSON.parse(saved);
    } catch (error) {
        console.error(
            "선택 선수 불러오기 오류:",
            error
        );

        return null;
    }
}

/* =========================================================
   선택 선수 복구
========================================================= */

function restoreSelectedAthlete() {
    const selectedAthlete =
        getSelectedAthlete();

    if (!selectedAthlete) {
        return;
    }

    const currentAthlete =
        athleteList.find(
            function (athlete) {
                return (
                    athlete.id ===
                    selectedAthlete.id
                );
            }
        );

    if (currentAthlete) {
        saveSelectedAthlete(
            currentAthlete
        );
    } else {
        localStorage.removeItem(
            SELECTED_ATHLETE_KEY
        );
    }
}

/* =========================================================
   선수 테이블 출력
========================================================= */

function renderAthleteTable(
    searchText = ""
) {
    const elements =
        getAthleteElements();

    if (!elements.tableBody) {
        return;
    }

    const keyword =
        String(searchText)
            .trim()
            .toLowerCase();

    const selectedAthlete =
        getSelectedAthlete();

    const filteredAthletes =
        athleteList.filter(
            function (athlete) {
                if (!keyword) {
                    return true;
                }

                return (
                    athlete.name
                        .toLowerCase()
                        .includes(keyword) ||
                    athlete.sport
                        .toLowerCase()
                        .includes(keyword)
                );
            }
        );

    if (
        filteredAthletes.length === 0
    ) {
        elements.tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:32px;
                    "
                >
                    등록된 선수가 없습니다.
                </td>
            </tr>
        `;

        return;
    }

    elements.tableBody.innerHTML =
        filteredAthletes
            .map(
                function (athlete) {
                    const isSelected =
                        selectedAthlete?.id ===
                        athlete.id;

                    return `
                        <tr
                            class="${
                                isSelected
                                    ? "selected-athlete-row"
                                    : ""
                            }"
                            data-athlete-id="${escapeHtml(
                                athlete.id
                            )}"
                            style="
                                cursor:pointer;
                                ${
                                    isSelected
                                        ? "outline:2px solid #2563eb;"
                                        : ""
                                }
                            "
                        >
                            <td>
                                <strong>
                                    ${escapeHtml(
                                        athlete.name
                                    )}
                                </strong>

                                ${
                                    isSelected
                                        ? `
                                            <span
                                                style="
                                                    display:inline-block;
                                                    margin-left:7px;
                                                    padding:3px 7px;
                                                    border-radius:999px;
                                                    background:#2563eb;
                                                    color:#fff;
                                                    font-size:11px;
                                                "
                                            >
                                                선택됨
                                            </span>
                                        `
                                        : ""
                                }
                            </td>

                            <td>
                                ${escapeHtml(
                                    athlete.gender
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    athlete.sport
                                )}
                            </td>

                            <td>
                                ${
                                    athlete.height
                                        ? `${athlete.height}cm`
                                        : "-"
                                }
                            </td>

                            <td>
                                ${
                                    athlete.weight
                                        ? `${athlete.weight}kg`
                                        : "-"
                                }
                            </td>

                            <td>
                                <div
                                    style="
                                        display:flex;
                                        gap:7px;
                                        flex-wrap:wrap;
                                    "
                                >
                                    <button
                                        type="button"
                                        class="primary"
                                        data-action="select"
                                        data-id="${escapeHtml(
                                            athlete.id
                                        )}"
                                    >
                                        선택
                                    </button>

                                    <button
                                        type="button"
                                        data-action="analysis"
                                        data-id="${escapeHtml(
                                            athlete.id
                                        )}"
                                    >
                                        자세분석
                                    </button>

                                    <button
                                        type="button"
                                        data-action="report"
                                        data-id="${escapeHtml(
                                            athlete.id
                                        )}"
                                    >
                                        리포트
                                    </button>

                                    <button
                                        type="button"
                                        data-action="edit"
                                        data-id="${escapeHtml(
                                            athlete.id
                                        )}"
                                    >
                                        수정
                                    </button>

                                    <button
                                        type="button"
                                        class="danger"
                                        data-action="delete"
                                        data-id="${escapeHtml(
                                            athlete.id
                                        )}"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }
            )
            .join("");

    bindAthleteTableActions();
}

/* =========================================================
   표 버튼 이벤트
========================================================= */

function bindAthleteTableActions() {
    const tableBody =
        document.getElementById(
            "athleteTableBody"
        );

    if (!tableBody) {
        return;
    }

    tableBody
        .querySelectorAll(
            "button[data-action]"
        )
        .forEach(
            function (button) {
                button.addEventListener(
                    "click",
                    function (event) {
                        event.stopPropagation();

                        const action =
                            button.dataset.action;

                        const athleteId =
                            button.dataset.id;

                        handleAthleteAction(
                            action,
                            athleteId
                        );
                    }
                );
            }
        );

    tableBody
        .querySelectorAll(
            "tr[data-athlete-id]"
        )
        .forEach(
            function (row) {
                row.addEventListener(
                    "click",
                    function () {
                        selectAthlete(
                            row.dataset.athleteId
                        );
                    }
                );
            }
        );
}

function handleAthleteAction(
    action,
    athleteId
) {
    switch (action) {
        case "select":
            selectAthlete(
                athleteId
            );
            break;

        case "analysis":
            openAthleteAnalysis(
                athleteId
            );
            break;

        case "report":
            openAthleteReport(
                athleteId
            );
            break;

        case "edit":
            editAthlete(
                athleteId
            );
            break;

        case "delete":
            deleteAthlete(
                athleteId
            );
            break;

        default:
            break;
    }
}

/* =========================================================
   선택 선수 정보 패널
========================================================= */

function createSelectedAthletePanel() {
    const athletePage =
        document.getElementById(
            "athletePage"
        );

    if (
        !athletePage ||
        document.getElementById(
            "selectedAthletePanel"
        )
    ) {
        updateSelectedAthletePanel();

        return;
    }

    const panel =
        document.createElement("div");

    panel.id =
        "selectedAthletePanel";

    panel.className =
        "panel";

    panel.style.marginTop =
        "22px";

    athletePage.appendChild(
        panel
    );

    updateSelectedAthletePanel();
}

function updateSelectedAthletePanel() {
    const panel =
        document.getElementById(
            "selectedAthletePanel"
        );

    if (!panel) {
        return;
    }

    const athlete =
        getSelectedAthlete();

    if (!athlete) {
        panel.innerHTML = `
            <h2>선택 선수</h2>

            <p>
                선수를 선택하면 자세분석과
                리포트를 실행할 수 있습니다.
            </p>
        `;

        return;
    }

    panel.innerHTML = `
        <div
            style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:20px;
                flex-wrap:wrap;
            "
        >
            <div>
                <p
                    style="
                        color:#94a3b8;
                        margin-bottom:5px;
                    "
                >
                    현재 선택 선수
                </p>

                <h2>
                    ${escapeHtml(
                        athlete.name
                    )}
                </h2>

                <p
                    style="
                        margin-top:7px;
                        color:#cbd5e1;
                    "
                >
                    ${escapeHtml(
                        athlete.gender
                    )}
                    ·
                    ${escapeHtml(
                        athlete.sport
                    )}
                    ·
                    ${
                        athlete.height
                            ? `${athlete.height}cm`
                            : "신장 미입력"
                    }
                    ·
                    ${
                        athlete.weight
                            ? `${athlete.weight}kg`
                            : "체중 미입력"
                    }
                </p>
            </div>

            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                "
            >
                <button
                    id="selectedAthleteAnalysisButton"
                    type="button"
                    class="primary"
                >
                    자세분석 시작
                </button>

                <button
                    id="selectedAthleteReportButton"
                    type="button"
                >
                    선수 리포트
                </button>
            </div>
        </div>
    `;

    document
        .getElementById(
            "selectedAthleteAnalysisButton"
        )
        ?.addEventListener(
            "click",
            function () {
                openAthleteAnalysis(
                    athlete.id
                );
            }
        );

    document
        .getElementById(
            "selectedAthleteReportButton"
        )
        ?.addEventListener(
            "click",
            function () {
                openAthleteReport(
                    athlete.id
                );
            }
        );
}

/* =========================================================
   자세분석 화면으로 이동
========================================================= */

function openAthleteAnalysis(
    athleteId
) {
    selectAthlete(
        athleteId,
        false
    );

    const athlete =
        getSelectedAthlete();

    if (!athlete) {
        return;
    }

    localStorage.setItem(
        "sspro-analysis-athlete",
        JSON.stringify(athlete)
    );

    updateAnalysisAthleteDisplay();

    if (
        typeof window.openPage ===
        "function"
    ) {
        window.openPage(
            "camera"
        );
    } else {
        window.location.hash =
            "#camera";
    }

    window.setTimeout(
        function () {
            updateAnalysisAthleteDisplay();
        },
        100
    );

    showAthleteMessage(
        `${athlete.name} 선수 자세분석 화면으로 이동했습니다.`,
        "success"
    );
}

/* =========================================================
   자세분석 선수 표시
========================================================= */

function updateAnalysisAthleteDisplay() {
    const cameraPage =
        document.getElementById(
            "cameraPage"
        );

    if (!cameraPage) {
        return;
    }

    const athlete =
        getSelectedAthlete();

    let panel =
        document.getElementById(
            "analysisAthletePanel"
        );

    if (!panel) {
        panel =
            document.createElement(
                "div"
            );

        panel.id =
            "analysisAthletePanel";

        panel.className =
            "panel";

        panel.style.marginBottom =
            "20px";

        const pageHeader =
            cameraPage.querySelector(
                ".page-header"
            );

        if (pageHeader) {
            pageHeader.insertAdjacentElement(
                "afterend",
                panel
            );
        } else {
            cameraPage.prepend(
                panel
            );
        }
    }

    if (!athlete) {
        panel.innerHTML = `
            <h3>분석 선수</h3>

            <p>
                선수관리에서 선수를 선택해 주세요.
            </p>
        `;

        return;
    }

    panel.innerHTML = `
        <div
            style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                flex-wrap:wrap;
                gap:15px;
            "
        >
            <div>
                <p
                    style="
                        color:#94a3b8;
                    "
                >
                    현재 분석 선수
                </p>

                <h2>
                    ${escapeHtml(
                        athlete.name
                    )}
                </h2>

                <p>
                    ${escapeHtml(
                        athlete.sport
                    )}
                    ·
                    ${escapeHtml(
                        athlete.gender
                    )}
                </p>
            </div>

            <button
                id="analysisAthleteReportButton"
                type="button"
            >
                선수 리포트 보기
            </button>
        </div>
    `;

    const sportSelect =
        document.getElementById(
            "analysisSport"
        );

    if (sportSelect) {
        const matchingOption =
            Array.from(
                sportSelect.options
            ).find(
                function (option) {
                    return (
                        option.value ===
                            athlete.sport ||
                        option.textContent ===
                            athlete.sport
                    );
                }
            );

        if (matchingOption) {
            sportSelect.value =
                matchingOption.value;
        }
    }

    document
        .getElementById(
            "analysisAthleteReportButton"
        )
        ?.addEventListener(
            "click",
            function () {
                openAthleteReport(
                    athlete.id
                );
            }
        );
}

/* =========================================================
   리포트 화면으로 이동
========================================================= */

function openAthleteReport(
    athleteId
) {
    selectAthlete(
        athleteId,
        false
    );

    const athlete =
        getSelectedAthlete();

    if (!athlete) {
        return;
    }

    localStorage.setItem(
        "sspro-report-athlete",
        JSON.stringify(athlete)
    );

    updateAthleteReport();

    if (
        typeof window.openPage ===
        "function"
    ) {
        window.openPage(
            "report"
        );
    } else {
        window.location.hash =
            "#report";
    }

    window.setTimeout(
        updateAthleteReport,
        100
    );

    showAthleteMessage(
        `${athlete.name} 선수 리포트 화면으로 이동했습니다.`,
        "success"
    );
}

/* =========================================================
   선수 리포트 작성
========================================================= */

function updateAthleteReport() {
    const athlete =
        getSelectedAthlete();

    if (!athlete) {
        return;
    }

    const reportPage =
        document.getElementById(
            "reportPage"
        );

    if (!reportPage) {
        return;
    }

    let athleteReportPanel =
        document.getElementById(
            "athleteReportSummary"
        );

    if (!athleteReportPanel) {
        athleteReportPanel =
            document.createElement(
                "div"
            );

        athleteReportPanel.id =
            "athleteReportSummary";

        athleteReportPanel.className =
            "panel";

        athleteReportPanel.style.marginBottom =
            "20px";

        const pageHeader =
            reportPage.querySelector(
                ".page-header"
            );

        if (pageHeader) {
            pageHeader.insertAdjacentElement(
                "afterend",
                athleteReportPanel
            );
        } else {
            reportPage.prepend(
                athleteReportPanel
            );
        }
    }

    const age =
        calculateAthleteAge(
            athlete.birth
        );

    const bmi =
        calculateBMI(
            athlete.height,
            athlete.weight
        );

    athleteReportPanel.innerHTML = `
        <div
            style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:20px;
                flex-wrap:wrap;
            "
        >
            <div>
                <p
                    style="
                        color:#94a3b8;
                        margin-bottom:5px;
                    "
                >
                    선수 리포트
                </p>

                <h2>
                    ${escapeHtml(
                        athlete.name
                    )}
                </h2>

                <p
                    style="
                        margin-top:8px;
                        color:#cbd5e1;
                    "
                >
                    종목:
                    ${escapeHtml(
                        athlete.sport
                    )}
                    · 성별:
                    ${escapeHtml(
                        athlete.gender
                    )}
                </p>
            </div>

            <button
                id="reportStartAnalysisButton"
                type="button"
                class="primary"
            >
                자세분석 시작
            </button>
        </div>

        <div
            style="
                display:grid;
                grid-template-columns:
                    repeat(auto-fit, minmax(150px, 1fr));
                gap:12px;
                margin-top:20px;
            "
        >
            <div class="card">
                <h3>나이</h3>

                <h1>
                    ${
                        age !== null
                            ? `${age}세`
                            : "-"
                    }
                </h1>
            </div>

            <div class="card">
                <h3>신장</h3>

                <h1>
                    ${
                        athlete.height
                            ? `${athlete.height}cm`
                            : "-"
                    }
                </h1>
            </div>

            <div class="card">
                <h3>체중</h3>

                <h1>
                    ${
                        athlete.weight
                            ? `${athlete.weight}kg`
                            : "-"
                    }
                </h1>
            </div>

            <div class="card">
                <h3>BMI</h3>

                <h1>
                    ${
                        bmi !== null
                            ? bmi
                            : "-"
                    }
                </h1>
            </div>
        </div>
    `;

    document
        .getElementById(
            "reportStartAnalysisButton"
        )
        ?.addEventListener(
            "click",
            function () {
                openAthleteAnalysis(
                    athlete.id
                );
            }
        );

    updateExistingReportFields(
        athlete
    );
}

/* =========================================================
   기존 리포트 필드 업데이트
========================================================= */

function updateExistingReportFields(
    athlete
) {
    const reportFeedback =
        document.getElementById(
            "reportFeedback"
        );

    if (reportFeedback) {
        const storedResult =
            getAthleteAnalysisResult(
                athlete.id
            );

        if (storedResult) {
            reportFeedback.innerHTML = `
                <strong>
                    ${escapeHtml(
                        athlete.name
                    )} 선수 AI 분석
                </strong>

                <p
                    style="
                        margin-top:10px;
                    "
                >
                    ${
                        escapeHtml(
                            storedResult.feedback ||
                                "저장된 분석 결과가 있습니다."
                        )
                    }
                </p>
            `;
        } else {
            reportFeedback.innerHTML = `
                <strong>
                    ${escapeHtml(
                        athlete.name
                    )} 선수
                </strong>

                <p
                    style="
                        margin-top:10px;
                    "
                >
                    아직 저장된 자세분석 결과가 없습니다.
                    자세분석을 진행하면 점수와 훈련 추천이
                    여기에 표시됩니다.
                </p>
            `;
        }
    }
}

/* =========================================================
   선수 분석 결과 불러오기
========================================================= */

function getAthleteAnalysisResult(
    athleteId
) {
    try {
        const results =
            JSON.parse(
                localStorage.getItem(
                    "sspro-analysis-results"
                ) || "[]"
            );

        return (
            results
                .filter(
                    function (result) {
                        return (
                            result.athleteId ===
                            athleteId
                        );
                    }
                )
                .sort(
                    function (a, b) {
                        return (
                            new Date(
                                b.createdAt
                            ) -
                            new Date(
                                a.createdAt
                            )
                        );
                    }
                )[0] || null
        );
    } catch (error) {
        return null;
    }
}

/* =========================================================
   저장소
========================================================= */

function loadAthletes() {
    try {
        const saved =
            localStorage.getItem(
                ATHLETE_STORAGE_KEY
            );

        athleteList =
            saved
                ? JSON.parse(saved)
                : [];

        if (
            !Array.isArray(
                athleteList
            )
        ) {
            athleteList = [];
        }
    } catch (error) {
        console.error(
            "선수 정보 불러오기 오류:",
            error
        );

        athleteList = [];
    }
}

function saveAthletes() {
    try {
        localStorage.setItem(
            ATHLETE_STORAGE_KEY,
            JSON.stringify(
                athleteList
            )
        );
    } catch (error) {
        console.error(
            "선수 정보 저장 오류:",
            error
        );

        showAthleteMessage(
            "선수 정보를 저장하지 못했습니다.",
            "error"
        );
    }
}

/* =========================================================
   대시보드 선수 수
========================================================= */

function updateAthleteDashboardCount() {
    const countElements = [
        document.getElementById(
            "dashboardAthleteCount"
        ),

        document.getElementById(
            "athleteCount"
        )
    ];

    countElements.forEach(
        function (element) {
            if (element) {
                element.textContent =
                    athleteList.length;
            }
        }
    );
}

/* =========================================================
   계산
========================================================= */

function calculateAthleteAge(
    birthDate
) {
    if (!birthDate) {
        return null;
    }

    const birth =
        new Date(birthDate);

    if (
        Number.isNaN(
            birth.getTime()
        )
    ) {
        return null;
    }

    const today =
        new Date();

    let age =
        today.getFullYear() -
        birth.getFullYear();

    const monthDifference =
        today.getMonth() -
        birth.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
                birth.getDate()
        )
    ) {
        age -= 1;
    }

    return age >= 0
        ? age
        : null;
}

function calculateBMI(
    height,
    weight
) {
    const heightNumber =
        Number(height);

    const weightNumber =
        Number(weight);

    if (
        heightNumber <= 0 ||
        weightNumber <= 0
    ) {
        return null;
    }

    const heightMeters =
        heightNumber / 100;

    return (
        weightNumber /
        (
            heightMeters *
            heightMeters
        )
    ).toFixed(1);
}

/* =========================================================
   ID 생성
========================================================= */

function createAthleteId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
            "function"
    ) {
        return window.crypto.randomUUID();
    }

    return (
        "athlete-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );
}

/* =========================================================
   HTML 안전 처리
========================================================= */

function escapeHtml(value) {
    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}

/* =========================================================
   알림
========================================================= */

function showAthleteMessage(
    message,
    type = "info"
) {
    if (
        typeof window.showToast ===
        "function"
    ) {
        window.showToast(
            message,
            type
        );

        return;
    }

    const toast =
        document.getElementById(
            "toast"
        );

    if (!toast) {
        console.log(message);

        return;
    }

    toast.textContent =
        message;

    toast.classList.add(
        "active"
    );

    window.clearTimeout(
        toast.hideTimer
    );

    toast.hideTimer =
        window.setTimeout(
            function () {
                toast.classList.remove(
                    "active"
                );
            },
            2500
        );
}

/* =========================================================
   다른 JS 파일에서 사용
========================================================= */

window.renderAthleteTable =
    renderAthleteTable;

window.selectAthlete =
    selectAthlete;

window.getSelectedAthlete =
    getSelectedAthlete;

window.openAthleteAnalysis =
    openAthleteAnalysis;

window.openAthleteReport =
    openAthleteReport;

window.updateAthleteReport =
    updateAthleteReport;

window.updateAnalysisAthleteDisplay =
    updateAnalysisAthleteDisplay;