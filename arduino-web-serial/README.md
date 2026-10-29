# p5.js로 Arduino LED 밝기 조절하기

창의설계입문 과제 — p5.js와 Web Serial API로 Arduino Uno R3의 LED를 켜고 끄고, 슬라이더로 밝기(PWM 0~255)를 조절합니다.

- `index.html` : 과제 소개 및 코드 설명 페이지
- `demo/` : 실제로 동작하는 p5.js 스케치 (`index.html`, `sketch.js`, `serial-helper.js`)
- `assets/` : 회로도, 시연 영상

## 통신 규칙 (9600 baud, 한 줄 = 메시지 하나)

| 방향 | 메시지 |
| --- | --- |
| p5.js → Arduino | `ON`, `OFF`, `PWM:0` ~ `PWM:255` |
| Arduino → p5.js | `LED: ON`, `LED: OFF` |

## 실행

GitHub Pages로 배포한 뒤 Chrome / Edge에서 `demo/` 페이지를 열고 **Arduino 연결 / 해제** 버튼을 누릅니다.
(Web Serial은 https 또는 localhost에서만 동작합니다.)

참고: 강의자료 「p5.js로 Arduino와 대화하기」, [원본 p5.js 예제](https://editor.p5js.org/bjc97r/sketches/04Ur1M6iy)
