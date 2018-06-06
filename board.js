class Board {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.board = []
  }

  buildBoard() {
    let board = new Array(this.cols)

    for (let i = 0; i < this.rows; i++) {
      board[i] = new Array(this.cols)
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (board[i][j] != '-') {
          board[i][j] = new Node(j, i)
        }
      }
    }

    this.board = board

    return this.board
  }
}
