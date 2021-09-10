// import functions from "firebase-functions";  ES6
const functions = require("firebase-functions");
// import admin from "firebase-admin";
//  nodejs는 기본적으로 CommonJS 문법을 따르므로, 
//  Babel 같은 컴파일러 없이는 최신 문법이 적용 안 될 수도 있음
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

const express = require("express");
const app = express();

//  웹은 기본적으로 "동일출처정책(Same Origin Policy)"을 따른다.
//  하나의 출처에서 로드된 문서나 스크립트가 다른 출처에 존재하는
//  리소스와 상호작용하지 못하도록 제약을 걸어 둠.
//  클라이언트의 접속시도 포트와 서버가 열어둔 포트가 다를 때
//  "Access-Control-Origin" 헤더가 필요함.
//  cors(Cross-Origin Resource Sharing) 미들웨어를 이용한 SOP정책 우회
//      -> 모든 개발 환경, 서비스 환경이 같은 리소스 기반일 수는 없으므로
const cors = require("cors")({origin: true});
app.use = express();

//  비 로그인 유저
const anonymousUser = {
    id: "anon",
    name: "Anonymous",
    avatar: ""
}

//  로그인 유저 식별
//  IdToken을 전달받아 디코딩하여 무결성과 진위 검증 -> uid를 얻어 식별
const checkUser = (req, resp, next) => {
    req.user = anonymousUser;
    if (req.query.auth_token !== undefined) {
        let idToken = req.query.auth_token;
        admin
        .auth()
        .verifyIdToken(idToken)
        .then(decodeIdToken => {
            let authUser = {
                id: decodeIdToken.user_id,
                name: decodeIdToken.name,
                avatar: decodeIdToken.picture
            };
            req.user = authUser;
            next();
        }).catch(error => {
            next();
        });
    } else {
        next();
    };
};
//  next() -> 미들웨어 함수에 대한 콜백 인수(일반적으로 next로 부름)
//  미들웨어의 로드 시점을 조절하기 위해 사용한다.
//  스택 내의 그 다음 미들웨어 함수에 요청을 전달

app.use(checkUser);

function createChannel(cname) {
    let channelsRef = admin.database().ref("channels");
    let date1 = new Date();
    let date2 = new Date();
    date2.setSeconds(data2.getSeconds() + 1);   //  이거 왜 1 더하지?
    const defaultData = `{
        "messages" : {
            "1" : {
                "body" : "Welcome to #${cname} channel!",
                "date" : "${date1.toJSON()}",
                "user" : {
                    "avatar" : "",
                    "id" : "robot",
                    "name" : "Robot"
                }
            },
            "2" : {
                "body" : "첫 번째 메시지를 보내 봅시다.",
                "date" : "${date2.toJSON()}",
                "user" : {
                    "avatar" : "",
                    "id" : "robot",
                    "name" : "Robot"
                }
            }
        }
    }`;

}