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
    this.item_x = Math.floor(Math.random() * this.ROWS)
    this.item_x = Math.floor(Math.random() * this.COLS)
    this.board = new Board(this.ROWS, this.COLS).buildBoard()
  }

  draw() {
    if (!this.gameOver) {
      for (var x = 0; x < this.COLS; ++x) {
        for (var y = 0; y < this.ROWS; ++y) {
          if (y == this.item_y && x == this.item_x) {
            this.ctx.fillStyle = 'red'
          } else if (this.board[y][x].block) {
            this.ctx.fillStyle = 'white'
          } else {
            this.ctx.strokeStyle = 'black'
            this.ctx.lineWidth = '0.8'
            this.ctx.fillStyle = 'red'
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
