"use strict";

/* =========================================================
   설천고 스포츠과학 분석센터 PRO
   선수별 리포트 생성 · 저장 · 출력 · 공유
========================================================= */

const REPORT_STORAGE_KEY = "sspro-reports";
const ANALYSIS_STORAGE_KEY = "sspro-analysis-results";
const SELECTED_ATHLETE_KEY = "sspro-selected-athlete";

let reportList = [];
let reportChartInstance = null;

/* =========================================================
   초기화
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeReport();
});

function initializeReport() {
    loadReports();
    bindReportButtons();
    renderSelectedAthleteReport();
    updateReportCount();
}

/* =========================================================
   버튼 연결
========================================================= */

function bindReportButtons() {
    const createButton =
        document.getElementById("createReportButton");

    const printButton =
        document.getElementById("printReportButton") ||
        document.getElementById("printButton");

    const pdfButton =
        document.getElementById("pdfButton");

    const shareButton =
        document.getElementById("shareButton");

    createButton?.addEventListener(
        "click",
        createCurrentAthleteReport
    );

    printButton?.addEventListener(
        "click",
        printCurrentReport
    );

    pdfButton?.addEventListener(
        "click",
        saveReportAsPDF
    );

    shareButton?.addEventListener(
        "click",
        shareCurrentReport
    );
}

/* =========================================================
   선택 선수 불러오기
========================================================= */

function getReportAthlete() {
    if (
        typeof window.getSelectedAthlete ===
        "function"
    ) {
        const selected =
            window.getSelectedAthlete();

        if (selected) {
            return selected;
        }
    }

    try {
        const saved =
            localStorage.getItem(
                SELECTED_ATHLETE_KEY
            );

        return saved
            ? JSON.parse(saved)
            : null;
    } catch (error) {
        console.error(
            "선택 선수 불러오기 오류:",
            error
        );

        return null;
    }
}

/* =========================================================
   선수 분석 결과 불러오기
========================================================= */

function getAthleteAnalysisResults(
    athleteId
) {
    try {
        const saved =
            localStorage.getItem(
                ANALYSIS_STORAGE_KEY
            );

        const results =
            saved
                ? JSON.parse(saved)
                : [];

        if (!Array.isArray(results)) {
            return [];
        }

        return results
            .filter(function (result) {
                return (
                    result.athleteId ===
                    athleteId
                );
            })
            .sort(function (a, b) {
                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );
            });
    } catch (error) {
        console.error(
            "분석 결과 불러오기 오류:",
            error
        );

        return [];
    }
}

/* =========================================================
   현재 선수 리포트 생성
========================================================= */

function createCurrentAthleteReport() {
    const athlete =
        getReportAthlete();

    if (!athlete) {
        showReportMessage(
            "선수관리에서 선수를 먼저 선택해 주세요.",
            "warning"
        );

        if (
            typeof window.openPage ===
            "function"
        ) {
            window.openPage("athlete");
        }

        return;
    }

    const analysisResults =
        getAthleteAnalysisResults(
            athlete.id
        );

    const latestAnalysis =
        analysisResults[0] || null;

    const report =
        buildReportData(
            athlete,
            latestAnalysis,
            analysisResults
        );

    const existingIndex =
        reportList.findIndex(
            function (item) {
                return (
                    item.athleteId ===
                    athlete.id
                );
            }
        );

    if (existingIndex >= 0) {
        reportList[existingIndex] =
            report;
    } else {
        reportList.unshift(
            report
        );
    }

    saveReports();
    renderReport(report);
    updateReportCount();

    showReportMessage(
        `${athlete.name} 선수 리포트가 생성되었습니다.`,
        "success"
    );
}

/* =========================================================
   리포트 데이터 작성
========================================================= */

function buildReportData(
    athlete,
    latestAnalysis,
    allResults
) {
    const scores =
        allResults
            .map(function (result) {
                return Number(
                    result.score ||
                    result.aiScore ||
                    0
                );
            })
            .filter(function (score) {
                return score > 0;
            });

    const averageScore =
        scores.length > 0
            ? Math.round(
                scores.reduce(
                    function (total, score) {
                        return total + score;
                    },
                    0
                ) / scores.length
            )
            : Number(
                latestAnalysis?.score ||
                latestAnalysis?.aiScore ||
                0
            );

    const balanceScore =
        Number(
            latestAnalysis?.balance ||
            latestAnalysis?.balanceScore ||
            0
        );

    const nationalRate =
        Number(
            latestAnalysis?.nationalRate ||
            latestAnalysis?.nationalCompare ||
            0
        );

    const injuryRisk =
        latestAnalysis?.injuryRisk ||
        calculateInjuryRisk(
            averageScore,
            balanceScore
        );

    const grade =
        calculateReportGrade(
            averageScore
        );

    const feedback =
        latestAnalysis?.feedback ||
        createReportFeedback(
            athlete,
            averageScore,
            balanceScore,
            injuryRisk
        );

    return {
        id:
            createReportId(),

        athleteId:
            athlete.id,

        athleteName:
            athlete.name,

        gender:
            athlete.gender,

        birth:
            athlete.birth,

        sport:
            athlete.sport,

        height:
            Number(
                athlete.height || 0
            ),

        weight:
            Number(
                athlete.weight || 0
            ),

        bmi:
            calculateBMI(
                athlete.height,
                athlete.weight
            ),

        age:
            calculateAge(
                athlete.birth
            ),

        score:
            averageScore,

        balance:
            balanceScore,

        nationalRate:
            nationalRate,

        injuryRisk:
            injuryRisk,

        grade:
            grade,

        analysisCount:
            allResults.length,

        feedback:
            feedback,

        trainingRecommendation:
            createTrainingRecommendation(
                athlete,
                averageScore,
                balanceScore,
                injuryRisk
            ),

        latestAnalysis:
            latestAnalysis,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    };
}

/* =========================================================
   리포트 화면 출력
========================================================= */

function renderSelectedAthleteReport() {
    const athlete =
        getReportAthlete();

    if (!athlete) {
        renderEmptyReport();
        return;
    }

    const savedReport =
        reportList.find(
            function (report) {
                return (
                    report.athleteId ===
                    athlete.id
                );
            }
        );

    if (savedReport) {
        renderReport(
            savedReport
        );

        return;
    }

    const analysisResults =
        getAthleteAnalysisResults(
            athlete.id
        );

    const temporaryReport =
        buildReportData(
            athlete,
            analysisResults[0] || null,
            analysisResults
        );

    renderReport(
        temporaryReport
    );
}

function renderEmptyReport() {
    const container =
        getReportContainer();

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="panel">
            <h2>선수 리포트</h2>

            <p style="margin-top:12px;color:#cbd5e1;">
                선수관리에서 선수를 선택하면
                선수 정보와 자세분석 결과가 표시됩니다.
            </p>

            <button
                type="button"
                class="primary"
                id="emptyReportAthleteButton"
                style="margin-top:20px;"
            >
                선수관리로 이동
            </button>
        </div>
    `;

    document
        .getElementById(
            "emptyReportAthleteButton"
        )
        ?.addEventListener(
            "click",
            function () {
                if (
                    typeof window.openPage ===
                    "function"
                ) {
                    window.openPage(
                        "athlete"
                    );
                }
            }
        );
}

/* =========================================================
   리포트 HTML
========================================================= */

function renderReport(report) {
    const container =
        getReportContainer();

    if (!container) {
        return;
    }

    updateSummaryFields(
        report
    );

    container.innerHTML = `
        <article
            id="printableAthleteReport"
            class="report-card"
        >
            <header
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:20px;
                    flex-wrap:wrap;
                    margin-bottom:24px;
                "
            >
                <div>
                    <p
                        style="
                            color:#94a3b8;
                            margin-bottom:6px;
                        "
                    >
                        설천고 스포츠과학 분석센터 PRO
                    </p>

                    <h1>
                        ${escapeReportHtml(
                            report.athleteName
                        )} 선수 리포트
                    </h1>

                    <p
                        style="
                            margin-top:8px;
                            color:#cbd5e1;
                        "
                    >
                        ${escapeReportHtml(
                            report.sport
                        )}
                        ·
                        ${escapeReportHtml(
                            report.gender
                        )}
                        ·
                        ${formatDate(
                            report.updatedAt
                        )}
                    </p>
                </div>

                <span
                    style="
                        padding:9px 15px;
                        border-radius:999px;
                        background:#2563eb;
                        color:#fff;
                        font-weight:700;
                    "
                >
                    등급 ${escapeReportHtml(
                        report.grade
                    )}
                </span>
            </header>

            <section
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit,minmax(150px,1fr));
                    gap:14px;
                    margin-bottom:24px;
                "
            >
                ${createInfoCard(
                    "나이",
                    report.age !== null
                        ? `${report.age}세`
                        : "-"
                )}

                ${createInfoCard(
                    "신장",
                    report.height
                        ? `${report.height}cm`
                        : "-"
                )}

                ${createInfoCard(
                    "체중",
                    report.weight
                        ? `${report.weight}kg`
                        : "-"
                )}

                ${createInfoCard(
                    "BMI",
                    report.bmi || "-"
                )}

                ${createInfoCard(
                    "분석 횟수",
                    `${report.analysisCount}회`
                )}
            </section>

            <section
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit,minmax(180px,1fr));
                    gap:14px;
                    margin-bottom:24px;
                "
            >
                ${createScoreCard(
                    "종합 점수",
                    report.score,
                    "점"
                )}

                ${createScoreCard(
                    "균형 점수",
                    report.balance,
                    "%"
                )}

                ${createScoreCard(
                    "국가대표 도달률",
                    report.nationalRate,
                    "%"
                )}

                ${createTextCard(
                    "부상 위험",
                    report.injuryRisk
                )}
            </section>

            <section
                class="panel"
                style="margin-bottom:18px;"
            >
                <h2>선수 종합 그래프</h2>

                <div
                    style="
                        position:relative;
                        min-height:320px;
                        margin-top:18px;
                    "
                >
                    <canvas
                        id="athleteReportChart"
                    ></canvas>
                </div>
            </section>

            <section
                class="panel"
                style="margin-bottom:18px;"
            >
                <h2>AI 분석 의견</h2>

                <p
                    style="
                        margin-top:13px;
                        line-height:1.8;
                        color:#cbd5e1;
                    "
                >
                    ${escapeReportHtml(
                        report.feedback
                    )}
                </p>
            </section>

            <section class="panel">
                <h2>훈련 추천</h2>

                <ul
                    style="
                        margin-top:14px;
                        padding-left:22px;
                        line-height:1.9;
                        color:#cbd5e1;
                    "
                >
                    ${report.trainingRecommendation
                        .map(
                            function (item) {
                                return `
                                    <li>
                                        ${escapeReportHtml(
                                            item
                                        )}
                                    </li>
                                `;
                            }
                        )
                        .join("")}
                </ul>
            </section>
        </article>

        <div
            style="
                display:flex;
                gap:10px;
                flex-wrap:wrap;
                margin-top:20px;
            "
        >
            <button
                id="reportAnalysisButton"
                type="button"
                class="primary"
            >
                자세분석 시작
            </button>

            <button
                id="reportSaveButton"
                type="button"
            >
                리포트 저장
            </button>

            <button
                id="reportPrintButton"
                type="button"
            >
                인쇄
            </button>

            <button
                id="reportShareButton"
                type="button"
            >
                공유
            </button>
        </div>
    `;

    bindDynamicReportButtons(
        report
    );

    createReportChart(
        report
    );
}

/* =========================================================
   리포트 컨테이너 찾기
========================================================= */

function getReportContainer() {
    return (
        document.getElementById(
            "reportContainer"
        ) ||
        document.getElementById(
            "athleteReportSummary"
        ) ||
        document.querySelector(
            "#reportPage"
        )
    );
}

/* =========================================================
   동적 버튼
========================================================= */

function bindDynamicReportButtons(
    report
) {
    document
        .getElementById(
            "reportAnalysisButton"
        )
        ?.addEventListener(
            "click",
            function () {
                if (
                    typeof window.openAthleteAnalysis ===
                    "function"
                ) {
                    window.openAthleteAnalysis(
                        report.athleteId
                    );

                    return;
                }

                if (
                    typeof window.openPage ===
                    "function"
                ) {
                    window.openPage(
                        "camera"
                    );
                }
            }
        );

    document
        .getElementById(
            "reportSaveButton"
        )
        ?.addEventListener(
            "click",
            createCurrentAthleteReport
        );

    document
        .getElementById(
            "reportPrintButton"
        )
        ?.addEventListener(
            "click",
            printCurrentReport
        );

    document
        .getElementById(
            "reportShareButton"
        )
        ?.addEventListener(
            "click",
            shareCurrentReport
        );
}

/* =========================================================
   요약 필드 업데이트
========================================================= */

function updateSummaryFields(
    report
) {
    setReportText(
        "reportScore",
        report.score
    );

    setReportText(
        "reportGrade",
        report.grade
    );

    setReportText(
        "trainingLevel",
        getTrainingLevel(
            report.score
        )
    );

    setReportText(
        "reportRisk",
        report.injuryRisk
    );

    const feedback =
        document.getElementById(
            "reportFeedback"
        );

    if (feedback) {
        feedback.textContent =
            report.feedback;
    }
}

function setReportText(
    elementId,
    value
) {
    const element =
        document.getElementById(
            elementId
        );

    if (element) {
        element.textContent =
            value;
    }
}

/* =========================================================
   그래프
========================================================= */

function createReportChart(
    report
) {
    const canvas =
        document.getElementById(
            "athleteReportChart"
        ) ||
        document.getElementById(
            "reportChart"
        );

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {
        return;
    }

    if (reportChartInstance) {
        reportChartInstance.destroy();
    }

    const context =
        canvas.getContext("2d");

    reportChartInstance =
        new Chart(
            context,
            {
                type: "radar",

                data: {
                    labels: [
                        "종합 점수",
                        "균형",
                        "국가대표 비교",
                        "안정성",
                        "훈련 완성도"
                    ],

                    datasets: [
                        {
                            label:
                                report.athleteName,

                            data: [
                                normalizeScore(
                                    report.score
                                ),

                                normalizeScore(
                                    report.balance
                                ),

                                normalizeScore(
                                    report.nationalRate
                                ),

                                calculateSafetyScore(
                                    report.injuryRisk
                                ),

                                calculateTrainingScore(
                                    report.score,
                                    report.balance
                                )
                            ],

                            borderWidth: 2,

                            backgroundColor:
                                "rgba(37, 99, 235, 0.22)",

                            borderColor:
                                "rgba(37, 99, 235, 1)",

                            pointBackgroundColor:
                                "#ffffff",

                            pointBorderColor:
                                "#2563eb"
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    scales: {
                        r: {
                            min: 0,
                            max: 100,

                            ticks: {
                                display: false
                            },

                            grid: {
                                color:
                                    "rgba(148, 163, 184, 0.2)"
                            },

                            angleLines: {
                                color:
                                    "rgba(148, 163, 184, 0.2)"
                            },

                            pointLabels: {
                                color: "#cbd5e1",

                                font: {
                                    size: 13
                                }
                            }
                        }
                    },

                    plugins: {
                        legend: {
                            labels: {
                                color: "#f8fafc"
                            }
                        }
                    }
                }
            }
        );
}

/* =========================================================
   리포트 카드 생성
========================================================= */

function createInfoCard(
    title,
    value
) {
    return `
        <div class="card">
            <h3>
                ${escapeReportHtml(
                    title
                )}
            </h3>

            <h2>
                ${escapeReportHtml(
                    value
                )}
            </h2>
        </div>
    `;
}

function createScoreCard(
    title,
    value,
    unit
) {
    return `
        <div class="card">
            <h3>
                ${escapeReportHtml(
                    title
                )}
            </h3>

            <h1>
                ${normalizeScore(
                    value
                )}${escapeReportHtml(
                    unit
                )}
            </h1>
        </div>
    `;
}

function createTextCard(
    title,
    value
) {
    return `
        <div class="card">
            <h3>
                ${escapeReportHtml(
                    title
                )}
            </h3>

            <h1
                style="
                    font-size:32px;
                "
            >
                ${escapeReportHtml(
                    value
                )}
            </h1>
        </div>
    `;
}

/* =========================================================
   AI 의견
========================================================= */

function createReportFeedback(
    athlete,
    score,
    balance,
    injuryRisk
) {
    const messages = [];

    if (score >= 85) {
        messages.push(
            `${athlete.name} 선수는 전체적인 동작 완성도가 우수합니다.`
        );
    } else if (score >= 70) {
        messages.push(
            `${athlete.name} 선수는 기본 동작이 안정적이지만 세부적인 자세 교정이 필요합니다.`
        );
    } else if (score > 0) {
        messages.push(
            `${athlete.name} 선수는 기본 자세와 움직임 패턴을 우선적으로 교정하는 것이 좋습니다.`
        );
    } else {
        messages.push(
            `${athlete.name} 선수의 자세분석 기록이 아직 없습니다.`
        );
    }

    if (balance >= 85) {
        messages.push(
            "좌우 균형과 중심 이동이 안정적인 편입니다."
        );
    } else if (balance > 0) {
        messages.push(
            "좌우 균형과 중심 이동을 개선하는 훈련이 필요합니다."
        );
    }

    if (
        injuryRisk === "높음"
    ) {
        messages.push(
            "부상 위험이 높게 분석되어 강도 높은 훈련 전 자세 교정과 코치 확인이 필요합니다."
        );
    } else if (
        injuryRisk === "주의"
    ) {
        messages.push(
            "일부 동작에서 부상 위험 요소가 있으므로 훈련 강도를 단계적으로 높이는 것이 좋습니다."
        );
    } else {
        messages.push(
            "현재 분석 기준으로 큰 부상 위험 요소는 확인되지 않았습니다."
        );
    }

    return messages.join(" ");
}

/* =========================================================
   훈련 추천
========================================================= */

function createTrainingRecommendation(
    athlete,
    score,
    balance,
    injuryRisk
) {
    const recommendations = [];

    if (score < 70) {
        recommendations.push(
            "기본 동작을 낮은 속도로 반복하며 정확한 자세를 익힙니다."
        );
    } else {
        recommendations.push(
            "현재 자세를 유지하면서 실제 경기 속도에 가까운 동작 훈련을 진행합니다."
        );
    }

    if (balance < 80) {
        recommendations.push(
            "