var LeeAlgorithm = require("../src/leeAlgorithm");
let db = require('electron').remote.getCurrentWindow().db;
let game;
let scl = 20;
let food;
let w;
let h;
var leeAlgorithm;
var arrayF;
var barriers = [];

const Figures =
{
  StartPosition: 0,
  EmptySpace: -1,
  Destination: -2,
  Path: -3,
  Barrier: -4,
}

function setup() {
  let { width, height, level } = db.get('config').value();
  let highestScore = db.get('highestScore').value();
  if (process.platform === 'darwin') {
    createCanvas(width - 2, height - 22);
    game = new Snake(width - 2, height - 22, db, highestScore);
  } else {
    createCanvas(width - 2, height - 2);
    game = new Snake(width - 2, height - 2, db, highestScore);
  }
  frameRate(level);

  spawnFood();

  w = game.width / scl;
  h = game.height / scl;
}

function draw() {
  background(31);

  if (game.eat(food)) {
    game.total++;
    spawnFood();
    leeAlgorithm = null;
  }

  try {

    let headSnake = { x: game.x / scl, y: game.y / scl };
    if (headSnake.x > 0 && headSnake.y > 0) {

      let array = GetArray(w, h);
      for (const point of game.tail) {
        array[point.x / scl][point.y / scl] = Figures.Barrier;
      }
      array[headSnake.x][headSnake.y] = Figures.StartPosition;
      array[food.x / scl][food.y / scl] = Figures.Destination;

      if (!leeAlgorithm) {
        leeAlgorithm = new LeeAlgorithm(array);
      }
      else if (leeAlgorithm && !leeAlgorithm.PathFound) {
        leeAlgorithm = new LeeAlgorithm(array);
      }
      else if (leeAlgorithm && leeAlgorithm.Path.length == 0) {
        leeAlgorithm = new LeeAlgorithm(array);
      }

      if (leeAlgorithm.PathFound) {
        let head = leeAlgorithm.Path[leeAlgorithm.Path.length - 1];
        let destination = leeAlgorithm.Path[leeAlgorithm.Path.length - 2];
        turnToPoint(head, destination);
        leeAlgorithm.Path.pop();

        for (const point of leeAlgorithm.Path) {
          fill(0, 200, 0);
          rect(point.x * scl + scl / 4, point.y * scl + scl / 4, scl / 2, scl / 2);
        }
      }
    }

  }
  catch (error) {
    console.log('error :', error);
  }

  fill(26, 0, 26);
  for (const point of barriers) {
    rect(point.x * scl, point.y * scl, scl, scl);
  }

  game.death();
  game.update();
  game.show();

  fill(255, 0, 0);
  rect(food.x, food.y, scl, scl);
}


function GetArray(w, h) {
  if (!arrayF) {

    arrayF = new Array(w);
    for (let i = 0; i < w; i++) {
      let line = new Array(h);
      for (let j = 0; j < h; j++) {
        if (Math.floor(Math.random() * 100) > 93) {
          line[j] = Figures.Barrier;
          barriers.push({ x: i, y: j });
        }
        else
          line[j] = Figures.EmptySpace;
      }
      arrayF[i] = line;
    }
  }
  return JSON.parse(JSON.stringify(arrayF));
}

function turnToPoint(headPoint, fistDirectionPoint) {
  if (headPoint && fistDirectionPoint) {
    if (headPoint.x - 1 == fistDirectionPoint.x && headPoint.y == fistDirectionPoint.y) game.dir(-1, 0);// Left);
    else if (headPoint.x + 1 == fistDirectionPoint.x && headPoint.y == fistDirectionPoint.y) game.dir(1, 0); // Right);
    else if (headPoint.x == fistDirectionPoint.x && headPoint.y - 1 == fistDirectionPoint.y) game.dir(0, -1); // Up);
    else if (headPoint.x == fistDirectionPoint.x && headPoint.y + 1 == fistDirectionPoint.y) game.dir(0, 1); // Down);
  }
}

function keyPressed() {
  if ((keyCode === UP_ARROW || keyCode === 87) && game.yspeed != 1) {
    game.dir(0, -1);
  } else if ((keyCode === DOWN_ARROW || keyCode === 83) && game.yspeed != -1) {
    game.dir(0, 1);
  } else if ((keyCode === RIGHT_ARROW || keyCode === 68) && game.xspeed != -1) {
    game.dir(1, 0);
  } else if ((keyCode === LEFT_ARROW || keyCode === 65) && game.xspeed != 1) {
    game.dir(-1, 0);
  } else if (keyCode === 32) {
    pause();
  }
  else if (keyCode === 72) {
    spawnFood();
  }
}

function pause() {
  if (game.isStopped) game.remuse();
  else game.stop();
}

function spawnFood() {
  let isConflict;
  do {
    isConflict = false;
    let cols = floor(width / scl);
    let rows = floor(height / scl);
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scl);

    for (const point of game.tail) {
      if (point.x == food.x && point.y == food.y) {
        isConflict = true;
        break;
      }
    }

    for (const point of barriers) {
      if (point.x * scl == food.x && point.y * scl == food.y) {
        isConflict = true;
        break;
      }
    }
  } while (isConflict)
}
