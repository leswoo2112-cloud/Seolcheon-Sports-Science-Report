/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : athlete.js
 Part 1 / 5
=========================================================
*/

const AthleteManager = {

    athletes: [],

    currentAthlete: null

};

/* ==========================================
   초기화
========================================== */

function initializeAthlete(){

    AthleteManager.athletes = loadAthletes();

    renderAthleteList();

}

/* ==========================================
   선수 객체 생성
========================================== */

function createAthlete(data){

    return {

        id: Utils.uuid(),

        name: data.name || "",

        gender: data.gender || "남",

        birth: data.birth || "",

        sport: data.sport || "",

        team: data.team || "",

        position: data.position || "",

        height: Number(data.height) || 0,

        weight: Number(data.weight) || 0,

        bmi: Utils.bmi(

            Number(data.height)||0,

            Number(data.weight)||0

        ),

        photo: data.photo || "",

        memo: data.memo || "",

        createdAt: Utils.dateTime(),

        updatedAt: Utils.dateTime()

    };

}

/* ==========================================
   선수 목록
========================================== */

function getAthletes(){

    return AthleteManager.athletes;

}

/* ==========================================
   선수 선택
========================================== */

function selectAthlete(id){

    AthleteManager.currentAthlete =

        AthleteManager.athletes.find(

            athlete=>athlete.id===id

        );

}

/* ==========================================
   현재 선수
========================================== */

function currentAthlete(){

    return AthleteManager.currentAthlete;

}

/* ==========================================
   선수 수
========================================== */

function athleteCount(){

    return AthleteManager.athletes.length;

}

/* ==========================================
   선수 저장
========================================== */

function saveAthleteData(){

    saveAthletes(

        AthleteManager.athletes

    );

}
/* ==========================================
   선수 등록
========================================== */

function addAthlete(data){

    const athlete = createAthlete(data);

    AthleteManager.athletes.push(athlete);

    saveAthleteData();

    renderAthleteList();

    addActivity(

        "선수 등록",

        athlete.name + " 선수를 등록했습니다."

    );

}

/* ==========================================
   선수 수정
========================================== */

function updateAthlete(id,data){

    const athlete = AthleteManager.athletes.find(

        item => item.id === id

    );

    if(!athlete){

        return;

    }

    athlete.name = data.name;

    athlete.gender = data.gender;

    athlete.birth = data.birth;

    athlete.sport = data.sport;

    athlete.team = data.team;

    athlete.position = data.position;

    athlete.height = Number(data.height);

    athlete.weight = Number(data.weight);

    athlete.bmi = Utils.bmi(

        athlete.height,

        athlete.weight

    );

    athlete.photo = data.photo;

    athlete.memo = data.memo;

    athlete.updatedAt = Utils.dateTime();

    saveAthleteData();

    renderAthleteList();

    addActivity(

        "선수 수정",

        athlete.name + " 정보를 수정했습니다."

    );

}

/* ==========================================
   선수 삭제
========================================== */

function deleteAthlete(id){

    const athlete = AthleteManager.athletes.find(

        item => item.id === id

    );

    if(!athlete){

        return;

    }

    AthleteManager.athletes = AthleteManager.athletes.filter(

        item => item.id !== id

    );

    saveAthleteData();

    renderAthleteList();

    addActivity(

        "선수 삭제",

        athlete.name + " 선수를 삭제했습니다."

    );

}

/* ==========================================
   전체 삭제
========================================== */

function clearAthletes(){

    if(!confirm("모든 선수를 삭제하시겠습니까?")){

        return;

    }

    AthleteManager.athletes = [];

    saveAthleteData();

    renderAthleteList();

    addActivity(

        "선수 초기화",

        "모든 선수 데이터를 삭제했습니다."

    );

}

/* ==========================================
   새로고침
========================================== */

function reloadAthletes(){

    AthleteManager.athletes = loadAthletes();

    renderAthleteList();

}
/* ==========================================
   선수 검색
========================================== */

function searchAthlete(keyword){

    keyword = keyword.trim().toLowerCase();

    return AthleteManager.athletes.filter(athlete=>{

        return (

            athlete.name.toLowerCase().includes(keyword)

            ||

            athlete.sport.toLowerCase().includes(keyword)

            ||

            athlete.team.toLowerCase().includes(keyword)

        );

    });

}

/* ==========================================
   종목 필터
========================================== */

function filterSport(sport){

    if(sport==="전체"){

        return AthleteManager.athletes;

    }

    return AthleteManager.athletes.filter(

        athlete=>athlete.sport===sport

    );

}

/* ==========================================
   이름순 정렬
========================================== */

function sortByName(){

    AthleteManager.athletes.sort(

        (a,b)=>a.name.localeCompare(b.name)

    );

    renderAthleteList();

}

/* ==========================================
   종목순 정렬
========================================== */

function sortBySport(){

    AthleteManager.athletes.sort(

        (a,b)=>a.sport.localeCompare(b.sport)

    );

    renderAthleteList();

}

/* ==========================================
   등록일순 정렬
========================================== */

function sortByDate(){

    AthleteManager.athletes.sort(

        (a,b)=>new Date(b.createdAt)-new Date(a.createdAt)

    );

    renderAthleteList();

}

/* ==========================================
   선수 목록 출력
========================================== */

function renderAthleteList(){

    const list=document.getElementById(

        "athleteList"

    );

    if(!list){

        return;

    }

    list.innerHTML="";

    AthleteManager.athletes.forEach(athlete=>{

        list.innerHTML+=`

        <div class="athlete-card"

             onclick="selectAthlete('${athlete.id}')">

            <img

                src="${
                    athlete.photo ||

                    'assets/images/default-profile.png'
                }"

                class="athlete-photo"

            >

            <div class="athlete-info">

                <h3>${athlete.name}</h3>

                <p>${athlete.sport}</p>

                <p>${athlete.team}</p>

                <p>

                    ${athlete.height} cm /

                    ${athlete.weight} kg

                </p>

            </div>

        </div>

        `;

    });

}
/* ==========================================
   선수 사진 변경
========================================== */

function updateAthletePhoto(id, photo) {

    const athlete = AthleteManager.athletes.find(

        item => item.id === id

    );

    if (!athlete) return;

    athlete.photo = photo;

    athlete.updatedAt = Utils.dateTime();

    saveAthleteData();

    renderAthleteList();

}

/* ==========================================
   선수 메모
========================================== */

function updateAthleteMemo(id, memo) {

    const athlete = AthleteManager.athletes.find(

        item => item.id === id

    );

    if (!athlete) return;

    athlete.memo = memo;

    athlete.updatedAt = Utils.dateTime();

    saveAthleteData();

}

/* ==========================================
   선수 기록
========================================== */

function updateAthleteRecord(id, record) {

    const athlete = AthleteManager.athletes.find(

        item => item.id === id

    );

    if (!athlete) return;

    athlete.record = {

        ...athlete.record,

        ...record

    };

    athlete.updatedAt = Utils.dateTime();

    saveAthleteData();

}

/* ==========================================
   BMI 다시 계산
========================================== */

function refreshBMI(id) {

    const athlete = AthleteManager.athletes.find(

        item => item.id === id

    );

    if (!athlete) return;

    athlete.bmi = Utils.bmi(

        athlete.height,

        athlete.weight

    );

    saveAthleteData();

}

/* ==========================================
   선수 상세 화면
========================================== */

function showAthleteProfile(id) {

    const athlete = AthleteManager.athletes.find(

        item => item.id === id

    );

    if (!athlete) return;

    const profile = document.getElementById(

        "athleteProfile"

    );

    if (!profile) return;

    profile.innerHTML = `

    <div class="profile-card">

        <img
            src="${athlete.photo || "assets/images/default-profile.png"}"
            class="profile-image">

        <h2>${athlete.name}</h2>

        <p>종목 : ${athlete.sport}</p>

        <p>팀 : ${athlete.team}</p>

        <p>포지션 : ${athlete.position}</p>

        <p>키 : ${athlete.height} cm</p>

        <p>몸무게 : ${athlete.weight} kg</p>

        <p>BMI : ${athlete.bmi}</p>

        <p>메모</p>

        <textarea
            readonly
        >${athlete.memo}</textarea>

    </div>

    `;

}
/* ==========================================
   즐겨찾기 선수
========================================== */

function toggleFavorite(id){

    const athlete = AthleteManager.athletes.find(

        item => item.id === id

    );

    if(!athlete){

        return;

    }

    athlete.favorite = !athlete.favorite;

    athlete.updatedAt = Utils.dateTime();

    saveAthleteData();

    renderAthleteList();

}

/* ==========================================
   즐겨찾기 목록
========================================== */

function getFavoriteAthletes(){

    return AthleteManager.athletes.filter(

        athlete => athlete.favorite === true

    );

}

/* ==========================================
   종목별 선수 수
========================================== */

function getSportStatistics(){

    const statistics = {};

    AthleteManager.athletes.forEach(athlete=>{

        const sport = athlete.sport || "기타";

        if(!statistics[sport]){

            statistics[sport]=0;

        }

        statistics[sport]++;

    });

    return statistics;

}

/* ==========================================
   선수 통계
========================================== */

function getAthleteStatistics(){

    return{

        total : AthleteManager.athletes.length,

        favorite : getFavoriteAthletes().length,

        sports : getSportStatistics()

    };

}

/* ==========================================
   리포트 연결
========================================== */

function createAthleteReport(id){

    const athlete = AthleteManager.athletes.find(

        item=>item.id===id

    );

    if(!athlete){

        return;

    }

    const report = {

        id:Utils.uuid(),

        athleteId:athlete.id,

        athleteName:athlete.name,

        sport:athlete.sport,

        date:Utils.today(),

        createdAt:Utils.dateTime(),

        type:"선수 리포트"

    };

    const reports = loadReports();

    reports.push(report);

    saveReports(reports);

    addActivity(

        "리포트 생성",

        athlete.name+" 선수 리포트를 생성했습니다."

    );

}

/* ==========================================
   자세분석 연결
========================================== */

function connectPose(id){

    selectAthlete(id);

}

/* ==========================================
   웨이트 연결
========================================== */

function connectWeight(id){

    selectAthlete(id);

}

/* ==========================================
   Polar 연결
========================================== */

function connectPolar(id){

    selectAthlete(id);

}

/* ==========================================
   바이애슬론 연결
========================================== */

function connectBiathlon(id){

    selectAthlete(id);

}

/* ==========================================
   선수 내보내기(JSON)
========================================== */

function exportAthletes(){

    Utils.download(

        "athletes.json",

        JSON.stringify(

            AthleteManager.athletes,

            null,

            4

        )

    );

}