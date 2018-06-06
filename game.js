const WIDTH = 800
const HEIGHT = 800
const ROWS = 40
const COLS = 40
const BLOCK_W = WIDTH / ROWS
const BLOCK_H = HEIGHT / COLS

class Game {
  constructor() {
    this.ctx = document.getElementById('game-canvas').getContext('2d')

    this.gameOver = false

    this.board = new Board(ROWS, COLS).buildBoard()

    this.start_x = Math.floor(ROWS / 2)
    this.start_y = Math.floor(COLS / 2)
    this.snake = new Array()
    this.snake.push(this.board[this.start_y][this.start_x])

    this.board[Math.floor(ROWS / 2)][Math.floor(COLS / 2)].snake = true

    this.rabbit = new Node(
      Math.floor(Math.random() * COLS),
      Math.floor(Math.random() * ROWS)
    )
  }

  draw() {
    if (!this.gameOver) {
      for (var x = 0; x < COLS; ++x) {
        for (var y = 0; y < ROWS; ++y) {
          if (y == this.rabbit.y && x == this.rabbit.x) {
            this.ctx.fillStyle = '#FFFFFF'
          } else if (this.board[y][x].snake) {
            this.ctx.fillStyle = '#000000'
          } else {
            this.ctx.strokeStyle = '#5F5B6B'
            this.ctx.lineWidth = '1'
            this.ctx.fillStyle = '#757180'
          }
          this.ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H)
          this.ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H)
        }
      }
    }
  }

  Astar() {
    let closedSet = []
    let openSet = []
    openSet.push(this.board[this.start_y][this.start_x])
    this.board[this.start_y][this.start_x].gScore = 0
    this.board[this.start_y][this.start_x].fScore = this.board[this.start_y][
      this.start_x
    ].heuristicCalc(this.rabbit.x, this.rabbit.y)

    while (openSet.length > 0) {
      openSet.sort(function(a, b) {
        if (a.fScore < b.fScore) return -1
        if (a.fScore > b.fScore) return 1
        return 0
      })

      let currNode = openSet[0]
      if (currNode.x == this.rabbit.x && currNode.y == this.rabbit.y) {
        return this.reconstruct_path(currNode, this.start_x, this.start_y)
      }

      let index = openSet.indexOf(currNode)
      openSet.splice(index, 1)

      closedSet.push(currNode)

      for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
          if (!Node.isInBound(this.board, currNode, i, j)) {
            continue
          }

          var neighbour = this.board[currNode.y + i][currNode.x + j]
          if (closedSet.indexOf(neighbour) != -1) {
            continue
          }

          let tScore = neighbour.gScore + 1
          if (openSet.indexOf(neighbour) == -1) {
            openSet.push(neighbour)
          }

          neighbour.parent = currNode
          neighbour.gScore = tScore
          neighbour.fScore =
            neighbour.gScore +
            neighbour.heuristicCalc(this.rabbit.x, this.rabbit.y)
        }
      }
    }
    console.log(1)
  }

  reconstruct_path(currNode, start_x, start_y) {
    let totalPath = [currNode]

    // go through the parents to find how the route
    while (currNode.parent != null) {
      totalPath.push(currNode.parent)
      currNode = currNode.parent
    }

    return totalPath
  }

  getNextMove(end_x, end_y) {
    let nextLoc
    let lowestfScore = -1
    let lowestfScoreNode = null

    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (!Node.isInBound(this.board, this.snake[0], i, j)) {
          continue
        }

        let neighbour = this.board[this.snake[0].y + i][this.snake[0].x + j]

        // pathScore = fScore + pathLength
        var pathScore =
          neighbour.gScore +
          neighbour.heuristicCalc(end_x, end_y) +
          pathLength(neighbour) +
          1

        // find the largest pathScore
        if (pathScore > lowestfScore) {
          lowestfScore = pathScore
          lowestfScoreNode = neighbour
        }
      }
    }

    return lowestfScoreNode
  }

  pathLength(currNode) {
    let numOfNodes = 0
    let longestPathArray = new Array()

    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (!Node.isInBound(this.board, currNode, i, j)) {
          continue
        }

        currNode = this.board[currNode.y + i][currNode.x + j]

        // increment the number of nodes and reset the check to looking at the top node
        numOfNodes++
        i = -1
        j = -1

        longestPathArray.push(currNode)

        // check if no where else to go
        if (
          (!(currNode.x + 1 >= 0 && currNode.x + 1 < COLS) ||
            this.board[currNode.y][currNode.x + 1] == undefined ||
            this.board[currNode.y][currNode.x + 1].snake) &&
          (!(currNode.x - 1 >= 0 && currNode.x - 1 < COLS) ||
            this.board[currNode.y][currNode.x - 1] == undefined ||
            this.board[currNode.y][currNode.x - 1].snake) &&
          (!(currNode.y + 1 >= 0 && currNode.y + 1 < ROWS) ||
            this.board[currNode.y + 1][currNode.x] == undefined ||
            this.board[currNode.y + 1][currNode.x].snake) &&
          (!(currNode.y - 1 >= 0 && currNode.y - 1 < ROWS) ||
            this.board[currNode.y - 1][currNode.x] == undefined ||
            this.board[currNode.y - 1][currNode.x].snake)
        ) {
          // house keeping - reset blocks to false
          for (var i = 0; i < longestPathArray.length - 1; i++) {
            longestPathArray[i].snake = false
          }

          return numOfNodes
        }
        currNode.snake = true
      }
    }
  }

  tick() {
    let tail
    var nextLoc
    if (!this.gameOver) {
      var path = this.Astar()
      console.log(path)

      for (var j = 0; j < path.length - 1; j++) {
        path[j].parent = null
        path[j].gScore = -1
        path[j].fScore = -1
      }

      for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board.length; j++) {
          this.board[i][j].parent = null
          this.board[i][j].gScore = -1
          this.board[i][j].fScore = -1
        }
      }

      if (path) {
        var nextLoc = path[path.length - 2]
      } else {
        var nextNode = getNextMove(item_x, item_y)
        if (nextNode == null) {
          this.gameOver = true
          console.log('GAME OVER')
          return
        } else {
          nextLoc = nextNode
        }
      }

      // set next location
      this.snake.unshift(nextLoc)
      nextLoc.snake = true
      this.start_x = nextLoc.x
      this.start_y = nextLoc.y

      // if not at the item, pop the tail
      if (!(nextLoc.x == this.rabbit.x && nextLoc.y == this.rabbit.y)) {
        tail = this.snake.pop()
        tail.snake = false
        tail.gScore = -1
        tail.fScore = -1
      } else {
        // if at the item, set a new item location
        do {
          this.rabbit.x = Math.floor(Math.random() * ROWS)
          this.rabbit.y = Math.floor(Math.random() * COLS)
        } while (this.board[this.rabbit.y][this.rabbit.x].snake == true)
      }
    }
  }

  startGame() {
    this.draw()

    setInterval(this.tick(), 50)
    setInterval(this.draw(), 50)
  }
}
