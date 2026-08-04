/*
=========================================================
 설천고 스포츠과학 훈련센터 PRO
 File : firebase.js
 Version : 1.0.0
=========================================================
*/

const FirebaseManager={

    app:null,

    auth:null,

    db:null,

    storage:null,

    currentUser:null,

    initialized:false

};

/* ==========================================
   Firebase 초기화
========================================== */

async function initializeFirebase(config){

    FirebaseManager.app=

        firebase.initializeApp(config);

    FirebaseManager.auth=

        firebase.auth();

    FirebaseManager.db=

        firebase.firestore();

    FirebaseManager.storage=

        firebase.storage();

    FirebaseManager.initialized=true;

}

/* ==========================================
   로그인
========================================== */

async function login(email,password){

    return await FirebaseManager.auth

    .signInWithEmailAndPassword(

        email,

        password

    );

}

/* ==========================================
   로그아웃
========================================== */

async function logout(){

    return await FirebaseManager.auth

    .signOut();

}

/* ==========================================
   현재 사용자
========================================== */

function getCurrentUser(){

    return FirebaseManager.auth.currentUser;

}

/* ==========================================
   로그인 상태
========================================== */

function observeLogin(){

    FirebaseManager.auth.onAuthStateChanged(

        user=>{

            FirebaseManager.currentUser=user;

        }

    );

}

/* ==========================================
   선수 컬렉션
========================================== */

function athleteCollection(){

    return FirebaseManager.db

    .collection("athletes");

}
/* ==========================================
   선수 등록
========================================== */

async function addAthlete(athlete){

    return await athleteCollection()

        .add({

            ...athlete,

            createdAt:new Date()

        });

}

/* ==========================================
   선수 수정
========================================== */

async function updateAthlete(id,data){

    return await athleteCollection()

        .doc(id)

        .update({

            ...data,

            updatedAt:new Date()

        });

}

/* ==========================================
   선수 삭제
========================================== */

async function deleteAthlete(id){

    return await athleteCollection()

        .doc(id)

        .delete();

}

/* ==========================================
   선수 조회
========================================== */

async function getAthlete(id){

    const doc=

        await athleteCollection()

        .doc(id)

        .get();

    if(!doc.exists){

        return null;

    }

    return{

        id:doc.id,

        ...doc.data()

    };

}

/* ==========================================
   전체 선수 목록
========================================== */

async function getAthletes(){

    const snapshot=

        await athleteCollection().get();

    const athletes=[];

    snapshot.forEach(doc=>{

        athletes.push({

            id:doc.id,

            ...doc.data()

        });

    });

    return athletes;

}

/* ==========================================
   이름 검색
========================================== */

async function searchAthletes(keyword){

    const snapshot=

        await athleteCollection()

        .where(

            "name",

            ">=",

            keyword

        )

        .where(

            "name",

            "<=",

            keyword+"\uf8ff"

        )

        .get();

    const result=[];

    snapshot.forEach(doc=>{

        result.push({

            id:doc.id,

            ...doc.data()

        });

    });

    return result;

}

/* ==========================================
   실시간 선수 목록
========================================== */

function observeAthletes(callback){

    return athleteCollection()

        .onSnapshot(snapshot=>{

            const athletes=[];

            snapshot.forEach(doc=>{

                athletes.push({

                    id:doc.id,

                    ...doc.data()

                });

            });

            callback(athletes);

        });

}

/* ==========================================
   데이터 변경 감지
========================================== */

function observeAthlete(id,callback){

    return athleteCollection()

        .doc(id)

        .onSnapshot(doc=>{

            if(doc.exists){

                callback({

                    id:doc.id,

                    ...doc.data()

                });

            }

        });

}
/* ==========================================
   프로필 사진 업로드
========================================== */

async function uploadProfileImage(file, athleteId){

    const ref = FirebaseManager.storage

        .ref()

        .child(

            `athletes/${athleteId}/profile.jpg`

        );

    const task = await ref.put(file);

    return await task.ref.getDownloadURL();

}

/* ==========================================
   훈련 영상 업로드
========================================== */

async function uploadTrainingVideo(file, athleteId){

    const name =

        Date.now()+"_"+file.name;

    const ref = FirebaseManager.storage

        .ref()

        .child(

            `athletes/${athleteId}/videos/${name}`

        );

    const task = await ref.put(file);

    return await task.ref.getDownloadURL();

}

/* ==========================================
   리포트 업로드
========================================== */

async function uploadReport(file, athleteId){

    const name =

        Date.now()+"_"+file.name;

    const ref = FirebaseManager.storage

        .ref()

        .child(

            `athletes/${athleteId}/reports/${name}`

        );

    const task = await ref.put(file);

    return await task.ref.getDownloadURL();

}

/* ==========================================
   파일 삭제
========================================== */

async function deleteFile(path){

    const ref = FirebaseManager.storage

        .ref(path);

    await ref.delete();

}

/* ==========================================
   다운로드 URL
========================================== */

async function getDownloadURL(path){

    return await FirebaseManager.storage

        .ref(path)

        .getDownloadURL();

}

/* ==========================================
   업로드 진행률
========================================== */

function uploadWithProgress(file,path,callback){

    const ref = FirebaseManager.storage

        .ref(path);

    const task = ref.put(file);

    task.on(

        "state_changed",

        snapshot=>{

            const progress =

                Math.round(

                    snapshot.bytesTransferred/

                    snapshot.totalBytes*100

                );

            callback(progress);

        },

        error=>{

            console.error(error);

        },

        async()=>{

            const url=

                await task.snapshot.ref

                .getDownloadURL();

            callback(

                100,

                url

            );

        }

    );

}

/* ==========================================
   저장공간 정보
========================================== */

async function getStorageInfo(){

    return{

        initialized:

            FirebaseManager.initialized,

        connected:

            FirebaseManager.storage!=null

    };

}

/* ==========================================
   업로드 기록
========================================== */

async function saveUploadHistory(data){

    return await FirebaseManager.db

        .collection("uploads")

        .add({

            ...data,

            createdAt:new Date()

        });

}
/* ==========================================
   사용자 역할(Role)
========================================== */

async function setUserRole(uid, role){

    return await FirebaseManager.db
        .collection("users")
        .doc(uid)
        .set({
            role,
            updatedAt: new Date()
        }, { merge:true });

}

async function getUserRole(uid){

    const doc = await FirebaseManager.db
        .collection("users")
        .doc(uid)
        .get();

    if(!doc.exists){

        return "guest";

    }

    return doc.data().role || "guest";

}

/* ==========================================
   실시간 랭킹
========================================== */

async function updateRanking(athleteId, score){

    return await FirebaseManager.db
        .collection("ranking")
        .doc(athleteId)
        .set({

            athleteId,

            score,

            updatedAt:new Date()

        });

}

function observeRanking(callback){

    return FirebaseManager.db
        .collection("ranking")
        .orderBy("score","desc")
        .limit(100)
        .onSnapshot(snapshot=>{

            const ranking=[];

            snapshot.forEach(doc=>{

                ranking.push({

                    id:doc.id,

                    ...doc.data()

                });

            });

            callback(ranking);

        });

}

/* ==========================================
   공지사항
========================================== */

async function addNotice(title, content){

    return await FirebaseManager.db
        .collection("notice")
        .add({

            title,

            content,

            createdAt:new Date()

        });

}

function observeNotice(callback){

    return FirebaseManager.db
        .collection("notice")
        .orderBy("createdAt","desc")
        .limit(20)
        .onSnapshot(snapshot=>{

            const notices=[];

            snapshot.forEach(doc=>{

                notices.push({

                    id:doc.id,

                    ...doc.data()

                });

            });

            callback(notices);

        });

}

/* ==========================================
   훈련 일정
========================================== */

async function saveTrainingSchedule(schedule){

    return await FirebaseManager.db
        .collection("schedule")
        .add({

            ...schedule,

            createdAt:new Date()

        });

}

function observeTrainingSchedule(callback){

    return FirebaseManager.db
        .collection("schedule")
        .orderBy("date")
        .onSnapshot(snapshot=>{

            const schedules=[];

            snapshot.forEach(doc=>{

                schedules.push({

                    id:doc.id,

                    ...doc.data()

                });

            });

            callback(schedules);

        });

}

/* ==========================================
   알림
========================================== */

async function sendNotification(notification){

    return await FirebaseManager.db
        .collection("notifications")
        .add({

            ...notification,

            read:false,

            createdAt:new Date()

        });

}

function observeNotification(uid, callback){

    return FirebaseManager.db
        .collection("notifications")
        .where("uid","==",uid)
        .orderBy("createdAt","desc")
        .onSnapshot(snapshot=>{

            const notifications=[];

            snapshot.forEach(doc=>{

                notifications.push({

                    id:doc.id,

                    ...doc.data()

                });

            });

            callback(notifications);

        });

}

/* ==========================================
   Dashboard 데이터
========================================== */

function observeDashboard(callback){

    return FirebaseManager.db
        .collection("dashboard")
        .doc("live")
        .onSnapshot(doc=>{

            if(doc.exists){

                callback(doc.data());

            }

        });

}
/* ==========================================
   전체 데이터 백업
========================================== */

async function backupDatabase(){

    const collections=[

        "athletes",
        "ranking",
        "schedule",
        "reports",
        "training"

    ];

    const backup={};

    for(const name of collections){

        const snapshot=

            await FirebaseManager.db

            .collection(name)

            .get();

        backup[name]=[];

        snapshot.forEach(doc=>{

            backup[name].push({

                id:doc.id,

                ...doc.data()

            });

        });

    }

    return backup;

}

/* ==========================================
   데이터 복원
========================================== */

async function restoreDatabase(data){

    for(const collection in data){

        for(const item of data[collection]){

            await FirebaseManager.db

                .collection(collection)

                .doc(item.id)

                .set(item);

        }

    }

}

/* ==========================================
   활동 로그
========================================== */

async function writeAuditLog(

    user,

    action,

    detail

){

    return await FirebaseManager.db

        .collection("audit")

        .add({

            user,

            action,

            detail,

            createdAt:new Date()

        });

}

/* ==========================================
   Analytics
========================================== */

function logEvent(

    event,

    params={}

){

    if(window.firebase.analytics){

        firebase.analytics()

        .logEvent(

            event,

            params

        );

    }

}

/* ==========================================
   오프라인 모드
========================================== */

function enableOfflineMode(){

    FirebaseManager.db

    .enablePersistence()

    .catch(error=>{

        console.error(error);

    });

}

/* ==========================================
   버전 확인
========================================== */

async function checkAppVersion(){

    const doc=

        await FirebaseManager.db

        .collection("system")

        .doc("version")

        .get();

    if(!doc.exists){

        return null;

    }

    return doc.data();

}

/* ==========================================
   Report 저장
========================================== */

async function uploadCloudReport(

    report

){

    return await FirebaseManager.db

        .collection("reports")

        .add({

            ...report,

            createdAt:new Date()

        });

}

/* ==========================================
   Dashboard 동기화
========================================== */

async function updateDashboardLive(

    data

){

    return await FirebaseManager.db

        .collection("dashboard")

        .doc("live")

        .set(

            data,

            {

                merge:true

            }

        );

}

/* ==========================================
   전체 동기화
========================================== */

async function synchronizeAll(){

    await updateDashboardLive({

        lastSync:new Date()

    });

}

/* ==========================================
   Firebase 종료
========================================== */

function destroyFirebase(){

    FirebaseManager.currentUser=null;

    FirebaseManager.initialized=false;

}