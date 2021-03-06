class Snake {
  constructor(width, height, db, highestScore) {
    this.x = 20;
    this.y = 20;
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 0;
    this.tail = [];
    this.isStopped = false;
    this.lastxspeed = 0;
    this.lastyspeed = 0;
    this.height = height;
    this.width = width;
    this.db = db;
    this.highestScore = highestScore;
  }

  eat(pos) {
    if (dist(this.x, this.y, pos.x, pos.y) < 1) return true;
    else return false;
  }

  dir(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  death() {
    if (!this.isStopped) {
      let score = this.tail.length;
      if (!this.highestScore)
        this.db
          .set("highestScore", score)
          .set("highestScore", score)
          .write();
      else if (score > this.highestScore)
        this.db
          .set("highestScore", score)
          .set("highestScore", score)
          .write();

      for (let i = 0; i < this.tail.length; i++)
        if (dist(this.x, this.y, this.tail[i].x, this.tail[i].y) < 1) {
          this.total = 0;
          this.tail = [];
        }
    }
  }

  update() {
    document.title = `Score: ${this.tail.length}`;
    if (!this.isStopped) {
      if (this.x === this.width - 20 && this.xspeed === 1) this.x = -20;
      else if (this.x === 0 && this.xspeed === -1) this.x = this.width;
      if (this.y === this.height - 20 && this.yspeed === 1) this.y = -20;
      else if (this.y === 0 && this.yspeed === -1) this.y = this.height;

      if (this.total === this.tail.length)
        for (let i = 0; i < this.tail.length - 1; i++)
          this.tail[i] = this.tail[i + 1];

      this.tail[this.total - 1] = createVector(this.x, this.y);

      this.x = this.x + this.xspeed * scl;
      this.y = this.y + this.yspeed * scl;

      this.x = constrain(this.x, 0, width - scl);
      this.y = constrain(this.y, 0, height - scl);
    }
  }

  stop() {
    this.isStopped = true;
    this.lastxspeed = this.xspeed;
    this.lastyspeed = this.yspeed;
    this.xspeed = 0;
    this.yspeed = 0;
    document.getElementById("pause-menu").style.display = "block";
  }

  remuse() {
    document.getElementById("pause-menu").style.display = "none";
    this.isStopped = false;
    this.xspeed = this.lastxspeed;
    this.yspeed = this.lastyspeed;
  }

  show() {
    for (let i = 0; i < this.tail.length; i++) {
      fill(77, 17, 10 * i);

      let c = (i + 1) / this.tail.length;
      if (c < 0.3)
        c = 0.3;
      let scale = scl * c;
      arc(this.tail[i].x + scl / 2, this.tail[i].y + scl / 2, scale, scale, 0, Math.PI * 2);
    }
    fill(77, 17, 92);
    arc(this.x + scl / 2 + 1, this.y + scl / 2 + 1, scl, scl, 0, Math.PI * 2);

  }
}
