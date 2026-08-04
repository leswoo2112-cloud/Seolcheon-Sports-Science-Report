/*
=========================================================
 설천고 스포츠과학 분석센터 PRO
 File : utils.js
 Version : 1.0.0
=========================================================
*/

const Utils = {

    /* ===============================
       랜덤 ID
    =============================== */

    randomId(length = 10){

        return Math.random()

            .toString(36)

            .substring(2, length + 2);

    },

    /* ===============================
       UUID
    =============================== */

    uuid(){

        return crypto.randomUUID();

    },

    /* ===============================
       날짜
    =============================== */

    today(){

        return new Date().toLocaleDateString("ko-KR");

    },

    /* ===============================
       시간
    =============================== */

    now(){

        return new Date().toLocaleTimeString("ko-KR");

    },

    /* ===============================
       날짜 + 시간
    =============================== */

    dateTime(){

        return new Date().toLocaleString("ko-KR");

    },

    /* ===============================
       숫자 반올림
    =============================== */

    round(number,digit=2){

        return Number(number.toFixed(digit));

    },

    /* ===============================
       평균
    =============================== */

    average(array){

        if(array.length===0){

            return 0;

        }

        return array.reduce((a,b)=>a+b,0)/array.length;

    },

    /* ===============================
       최대
    =============================== */

    max(array){

        return Math.max(...array);

    },

    /* ===============================
       최소
    =============================== */

    min(array){

        return Math.min(...array);

    },

    /* ===============================
       퍼센트
    =============================== */

    percent(value,total){

        if(total===0){

            return 0;

        }

        return (value/total)*100;

    },

    /* ===============================
       거리
    =============================== */

    distance(x1,y1,x2,y2){

        return Math.sqrt(

            Math.pow(x2-x1,2)

            +

            Math.pow(y2-y1,2)

        );

    },

    /* ===============================
       각도
    =============================== */

    angle(A,B,C){

        const AB=Math.atan2(

            A.y-B.y,

            A.x-B.x

        );

        const CB=Math.atan2(

            C.y-B.y,

            C.x-B.x

        );

        let angle=(CB-AB)*180/Math.PI;

        angle=Math.abs(angle);

        if(angle>180){

            angle=360-angle;

        }

        return Utils.round(angle);

    },

    /* ===============================
       BMI
    =============================== */

    bmi(height,weight){

        const h=height/100;

        return Utils.round(

            weight/(h*h)

        );

    },

    /* ===============================
       1RM(Epley)
    =============================== */

    oneRM(weight,reps){

        return Utils.round(

            weight*(1+reps/30)

        );

    },

    /* ===============================
       다운로드
    =============================== */

    download(filename,text){

        const element=document.createElement("a");

        element.setAttribute(

            "href",

            "data:text/plain;charset=utf-8,"+

            encodeURIComponent(text)

        );

        element.setAttribute(

            "download",

            filename

        );

        element.style.display="none";

        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    },

    /* ===============================
       로그
    =============================== */

    log(message){

        console.log(

            "[SSSP]",

            message

        );

    }

};