class Game {
  constructor() {
    this.ctx = document.getElementById('game-canvas').getContext('2d')

    this.WIDTH = 800
    this.HEIGHT = 800
    this.ROWS = 40
    this.COLS = 40
    this.BLOCK_W = this.WIDTH / this.ROWS
    this.BLOCK_H = this.HEIGHT / this.COLS
    this.gameOver = false

    this.rabbit = new Node(
      Math.floor(Math.random() * this.COLS),
      Math.floor(Math.random() * this.ROWS)
    )
    this.board = new Board(this.ROWS, this.COLS).buildBoard()
  }

  draw() {
    if (!this.gameOver) {
      for (var x = 0; x < this.COLS; ++x) {
        for (var y = 0; y < this.ROWS; ++y) {
          if (y == this.rabbit.y && x == this.rabbit.x) {
            this.ctx.fillStyle = 'red'
          } else if (this.board[y][x].block) {
            this.ctx.fillStyle = 'white'
          } else {
            this.ctx.strokeStyle = '#5F5B6B'
            this.ctx.lineWidth = '1'
            this.ctx.fillStyle = '#757180'
          }
          this.ctx.fillRect(
            this.BLOCK_W * x,
            this.BLOCK_H * y,
            this.BLOCK_W,
            this.BLOCK_H
          )
          this.ctx.strokeRect(
            this.BLOCK_W * x,
            this.BLOCK_H * y,
            this.BLOCK_W,
            this.BLOCK_H
          )
        }
      }
    }
  }
}
