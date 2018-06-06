class Node {
  constructor(x, y) {
    this.block = false
    this.x = x
    this.y = y
    this.parent = null
    this.gScore = -1
    this.fScore = -1
  }

  heuristicCalcu(to_x, to_y) {
    return Math.floor(Math.abs(to_x - this.x) + Math.abs(to_y - this.y))
  }

  static fScoreSort(FromNode, ToNode) {
    let dx = FromNode.x - ToNode.x
    let dy = FromNode.y - ToNode.y

    return Math.hypot(dx, dy)
  }

  static isInBoard(currNode, i, j) {
    if (this.board[currNode.y + i][currNode.x + j].block) {
      return false
    }
    return true
  }
}
