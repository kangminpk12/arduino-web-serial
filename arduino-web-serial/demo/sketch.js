// 복잡한 통신은 serial-helper.js가 처리합니다.
let serial, connectButton;
let ledOn = false;
let statusText = 'Arduino를 연결해 주세요.';

// LED 밝기 스크롤 바(슬라이더)
let brightnessSlider;
let brightness = 255;     // 0(꺼짐) ~ 255(최대 밝기)
let lastSent = -1;        // 마지막으로 보낸 밝기 값
let lastSendTime = 0;     // 너무 자주 보내지 않도록 시간 기록
let connectedAt = 0;      // 연결된 시각 (보드 재시작 대기용)

function setup() {
  createCanvas(600, 400);
  textFont('sans-serif');
  serial = new SerialHelper(9600, receiveLine, message => statusText = message);
  connectButton = createButton('Arduino 연결 / 해제');
  connectButton.mousePressed(() => serial.toggle());

  // 0~255 범위 슬라이더 (아두이노 analogWrite 범위와 같음)
  createP('LED 밝기 조절').style('margin', '16px 0 4px');
  brightnessSlider = createSlider(0, 255, brightness, 1);
  brightnessSlider.style('width', '300px');
}

function draw() {
  background(242, 246, 250);

  // 슬라이더 값을 읽어서, 바뀌었으면 아두이노로 전송
  brightness = brightnessSlider.value();
  sendBrightness();

  fill(25, 40, 60); noStroke(); textAlign(CENTER);
  textSize(24); text('Arduino Uno R3 · Web Serial', width / 2, 36);
  textSize(14); text(statusText, width / 2, 66);

  // LED 원: 켜져 있으면 밝기에 따라 회색 → 초록색으로 진해짐
  const offColor = color('#64748b');
  const onColor = color('#22c55e');
  fill(ledOn ? lerpColor(offColor, onColor, brightness / 255) : offColor);
  circle(width / 2, 190, 130);
  fill(255); textSize(24); text(ledOn ? 'ON' : 'OFF', width / 2, 198);

  fill(25, 40, 60); textSize(15);
  text('원을 클릭하면 LED 토글', width / 2, 290);
  textSize(20); text('밝기: ' + brightness + ' / 255', width / 2, 325);
  textSize(13); text('9600 baud · ON / OFF / PWM:0~255 + 줄바꿈', width / 2, 370);
}

// 밝기 값을 "PWM:값" 형식으로 보냄
async function sendBrightness() {
  if (!serial.writer) {                          // 아직 연결 전이면 보내지 않음
    connectedAt = 0; lastSent = -1; return;
  }
  if (connectedAt === 0) connectedAt = millis(); // 방금 연결된 시각 기록
  if (millis() - connectedAt < 2000) return;     // 연결 직후 2초는 보드가 재시작 중이라 기다림
  if (brightness === lastSent) return;           // 값이 그대로면 보내지 않음
  if (millis() - lastSendTime < 50) return;      // 0.05초에 한 번까지만 보냄
  lastSendTime = millis();
  const value = brightness;
  lastSent = value;
  if (await serial.send('PWM:' + value)) ledOn = value > 0;
  else lastSent = -1;                            // 실패하면 다음에 다시 시도
}

async function mousePressed() {
  if (dist(mouseX, mouseY, width / 2, 190) > 65) return;
  const next = !ledOn;
  if (await serial.send(next ? 'ON' : 'OFF')) ledOn = next;
}

function receiveLine(line) {
  // 아두이노가 LED 상태를 알려 주면 화면에 반영합니다.
  const message = line.trim().toUpperCase();
  if (message === 'LED: ON' || message === 'ON') ledOn = true;
  else if (message === 'LED: OFF' || message === 'OFF') ledOn = false;
}
