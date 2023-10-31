/*
    용어 정의
    source ~ : 번역할 텍스트, 번역할 언어의 타입(ko, ja..)
    target ~ : 번역된 결과 텍스트, 번역될 언어의 타입(ko, ja..)
*/

const [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');
const [sourceTextArea, targetTextArea] = document.getElementsByClassName('textarea');

let targetLanguage = 'en'; // 기본 값은 '영어'
let timer; // 타이머 변수 초기화


// 번역할 언어의 타입 변경 이벤트
targetSelect.addEventListener('change', (event) => { // event를 e로 줄여서 사용하기도 함
    // event - 특정 이벤트(마우스 클릭, 키보드 입력, 값 변경 등) 자체(객체)
    // target - 해당 이벤트가 발생한 타겟 엘리먼트(태그)
    // value - 해당 엘리먼트에 바인딩된(할당된) 값
    targetLanguage = event.target.value; // <select>의 <option> 태그 내에 있는 value attribute 값을 취득
});


// 번역할 텍스트인 sourceTextArea에 입력된 값 가져오기
sourceTextArea.addEventListener('input', (event) => {
    // console.log(event);
    const text = event.target.value; // 입력된 값

    // XMLHttpRequest활용해서 네이버 API 가이드 확인 후, 요청을 전송해보기
    detectLanguage(text);
});


// 언어 감지 기능 함수
const detectLanguage = (text) => {
    let sourceLanguage;

    const url = '/detect';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query: text})
    };

    // 이전 타이머를 취소하고 새로운 타이머를 설정
    clearTimeout(timer);

    // 3초 이후에 translateLanguage 함수 호출
    timer = setTimeout(() => {
        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                sourceLanguage = data.langCode;
                translateLanguage(sourceLanguage, text);
            });
    }, 2000); // 2초 (2000 밀리초) 타이머 설정

    return sourceLanguage;
}


// 언어 번역 요청 기능 함수
const translateLanguage = (sourceLanguage, text) => {
    const url = '/translate'; // Node.js 서버의 언어 번역 요청 API URL

    const body = {
        source: sourceLanguage,
        target: targetLanguage,
        text, // text: text와 같음.
    }

    const options = {
        method: 'POST',
        headers: { // HTTP 요청 시 header에 정보 추가
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    }

    // fetch를 통한 요청 전송
    // Node서버로 언어 번역 요청 전송
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            const result = data.message.result;
            targetTextArea.value = result.translatedText;
            targetSelect.value = result.tarLangType;
        })
}
