// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video; // 移除重複宣告，保留唯一的宣告
let handPose;
let hands = [];

let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
let circleRadius; // 圓的半徑

let isDragging = false; // 判斷是否正在拖曳圓

let fallingBlocks = []; // 儲存落下的方塊
let fallingDrops = []; // 新增獨立的物件儲存雨滴形狀圓球
let capturedBlocks = 0; // 計算 U 型圖案內接到的方塊數量

function preload() {
  // 確保 ml5.js 已正確載入
  if (typeof ml5 === 'undefined') {
    console.error("ml5.js 未正確載入，請確認是否已包含 ml5.js 的 CDN 或本地檔案。");
    return; // 停止執行後續代碼
  }

  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true }); // 修正初始化 HandPose 的參數
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480); // 修正 video 的大小設定
  video.hide();

  circleRadius = width / 5; // 將綠色 U 型圖案放大到螢幕邊框的 1/5

  // U 型圖案初始位置設置在 "TK" 的右邊
  circleX = 100 + circleRadius * 2;
  circleY = 50;

  // 確保 handPose 已正確初始化
  if (!handPose) {
    console.error("HandPose 模型未正確初始化，請確認 ml5.js 是否正確載入。");
    return; // 停止執行後續代碼
  }

  // Start detecting hands
  handPose.on('predict', gotHands); // 修正事件監聽器的使用方式

  setInterval(() => {
    // 每隔一段時間生成新的隨機圓形
    fallingBlocks.push({
      x: random(width),
      y: 0,
      size: random(20, 50), // 隨機大小
      color: color(random(255), random(255), random(255)), // 隨機顏色
    });
    console.log("New block added:", fallingBlocks); // 調試 fallingBlocks
  }, 1000);

  setInterval(() => {
    // 每隔一段時間生成新的雨滴形狀圓球
    fallingDrops.push({
      x: random(width),
      y: 0,
      size: random(10, 20), // 雨滴形狀圓球的大小
      color: color(0, 0, 255), // 藍色
    });
    console.log("New drop added:", fallingDrops); // 調試 fallingDrops
  }, 1000);

  setInterval(() => {
    // 每分鐘生成 100 個紅色小圓球
    for (let i = 0; i < 100; i++) {
      fallingBlocks.push({
        x: random(width),
        y: 0,
        size: random(10, 20), // 紅色小圓球的大小
        color: color(255, 0, 0), // 紅色
      });
    }
    console.log("Red blocks added:", fallingBlocks); // 調試 fallingBlocks
  }, 60000); // 每分鐘執行一次
}

function draw() {
  // 翻轉背景影像
  push();
  translate(width, 0); // 水平翻轉
  scale(-1, 1); // 翻轉 video
  image(video, 0, 0); // 使用背景影像作為背景
  pop();

  // 顯示左上角文字 "TK"
  fill(0);
  textSize(20);
  text("TK", 10, 30);

  // 顯示換行文字 "413730606黃宣禔"
  fill(0);
  rect(0, 40, 200, 40); // 黑底
  fill(255);
  textSize(16);
  text("413730606黃宣禔", 10, 70);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    let hand = hands[0]; // 使用第一隻手
    if (hand.handInViewConfidence > 0.1) { // 確保手掌在視野中
      let palmPosition = hand.landmarks[0]; // 手掌中心 (landmarks[0])
      circleX = palmPosition[0]; // 更新綠色碗型圖案的 X 座標
      circleY = palmPosition[1]; // 更新綠色碗型圖案的 Y 座標
    }
  }

  // 繪製綠色 U 型
  fill(0, 255, 0); // 綠色
  noStroke();
  beginShape();
  vertex(circleX - circleRadius, circleY); // 左邊緣
  vertex(circleX - circleRadius, circleY + circleRadius); // 左下角
  vertex(circleX, circleY + circleRadius * 1.5); // 底部中心
  vertex(circleX + circleRadius, circleY + circleRadius); // 右下角
  vertex(circleX + circleRadius, circleY); // 右邊緣
  endShape(CLOSE);

  // 繪製白色 U 型 (縮小版)
  fill(255); // 白色
  noStroke();
  beginShape();
  vertex(circleX - circleRadius * 0.6, circleY); // 左邊緣
  vertex(circleX - circleRadius * 0.6, circleY + circleRadius * 0.6); // 左下角
  vertex(circleX, circleY + circleRadius * 0.9); // 底部中心
  vertex(circleX + circleRadius * 0.6, circleY + circleRadius * 0.6); // 右下角
  vertex(circleX + circleRadius * 0.6, circleY); // 右邊緣
  endShape(CLOSE);

  // 更新落下的雨滴形狀圓球並確保其在最上方塗層
  for (let i = fallingDrops.length - 1; i >= 0; i--) {
    let drop = fallingDrops[i];
    drop.y += drop.size / 5; // 根據大小調整下落速度，使其像雨滴

    // 繪製雨滴形狀圓球
    fill(drop.color); // 使用藍色
    noStroke();
    ellipse(drop.x, drop.y, drop.size, drop.size * 1.5); // 雨滴形狀

    console.log("Drawing drop:", drop); // 調試 drop 的位置和大小

    // 檢查是否掉落在白色 U 型內
    if (
      drop.x > circleX - circleRadius * 0.6 &&
      drop.x < circleX + circleRadius * 0.6 &&
      drop.y > circleY &&
      drop.y < circleY + circleRadius * 0.9
    ) {
      capturedBlocks++;
      fallingDrops.splice(i, 1); // 移除雨滴形狀圓球
    }
    // 如果雨滴形狀圓球掉落至螢幕下方，移除
    else if (drop.y > height) {
      fallingDrops.splice(i, 1);
    }
  }

  // 更新落下的雨滴形狀圓球並確保其在最上方塗層
  for (let i = fallingBlocks.length - 1; i >= 0; i--) {
    let block = fallingBlocks[i];
    block.y += block.size / 5; // 根據大小調整下落速度，使其像雨滴

    // 繪製雨滴形狀圓球
    fill(block.color);
    noStroke();
    ellipse(block.x, block.y, block.size, block.size * 1.5); // 雨滴形狀

    console.log("Drawing block:", block); // 調試 block 的位置和大小

    // 檢查是否掉落在白色 U 型內
    if (
      block.x > circleX - circleRadius * 0.6 &&
      block.x < circleX + circleRadius * 0.6 &&
      block.y > circleY &&
      block.y < circleY + circleRadius * 0.9
    ) {
      capturedBlocks++;
      fallingBlocks.splice(i, 1); // 移除雨滴形狀圓球
    }
    // 如果雨滴形狀圓球掉落至螢幕下方，移除
    else if (block.y > height) {
      fallingBlocks.splice(i, 1);
    }
  }

  // 顯示接到的雨滴形狀圓球數量
  fill(0);
  textSize(20);
  text(`Captured Blocks: ${capturedBlocks}`, width - 200, 30);
}