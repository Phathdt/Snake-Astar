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
}
