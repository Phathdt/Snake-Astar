class Node {
  constructor(x, y) {
    this.snake = false
    this.x = x
    this.y = y
    this.parent = null
    this.gScore = -1
    this.fScore = -1
  }

  heuristicCalc(to_x, to_y) {
    return Math.floor(Math.abs(to_x - this.x) + Math.abs(to_y - this.y))
  }

  static isInBound(board, currNode, i, j) {
    if (
      currNode.x + j < 0 ||
      currNode.x + j > ROWS - 1 ||
      currNode.y + i < 0 ||
      currNode.y + i > COLS - 1
    ) {
      return false
    }

    if (board[currNode.y + i][currNode.x + j].block) {
      return false
    }

    if (
      (currNode.y + i == currNode.y && currNode.x + j == currNode.x) ||
      (i == -1 && j == -1) ||
      (i == -1 && j == 1) ||
      (i == 1 && j == -1) ||
      (i == 1 && j == 1)
    ) {
      return false
    }

    return true
  }
}
