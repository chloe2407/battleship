document.addEventListener('DOMContentLoaded', () => {
    // declaring all variables (info from index.html)

    // the shipD boards
    const userGrid = document.querySelector('.grid-user')
    const computerGrid = document.querySelector('.grid-computer')
    const displayGrid = document.querySelector('.grid-display')

    //collect all the battleships and assign names
    const ships = document.querySelectorAll('.ship')
    const shipA = document.querySelector('.shipA-container')
    const shipB = document.querySelector('.shipB-container')
    const shipC = document.querySelector('.shipC-container')
    const shipD = document.querySelector('.battleship-container')
    const shipE = document.querySelector('.shipE-container')

    // other information that is useful to the player to play the game
    const startButton = document.querySelector('#start')
    const rotateButton = document.querySelector('#rotate')
    const turnDisplay = document.querySelector('#whose-go')
    const infoDisplay = document.querySelector('#info')
    const setupButtons = document.getElementById('setup-buttons')

    // for the computer program to keep track of where the ships are located
    const userSquares = []
    const computerSquares = []

    // the state of the game, the ship direction, the current player, etc.
    let isHorizontal = true
    let isGameOver = false
    let currentPlayer = 'user'
    const width = 10
    let allShipsPlaced = false
    let shotFired = -1
    document.getElementById('info-startgame').style.visibility = "hidden"

    //Computer Ships declaration
    const shipArray = [
      {
        name: 'shipA',
        directions: [
          [0, 1],
          [0, width]
        ]
      },
      {
        name: 'shipB',
        directions: [
          [0, 1, 2],
          [0, width, width*2]
        ]
      },
      {
        name: 'shipC',
        directions: [
          [0, 1, 2],
          [0, width, width*2]
        ]
      },
      {
        name: 'shipD',
        directions: [
          [0, 1, 2, 3],
          [0, width, width*2, width*3]
        ]
      },
      {
        name: 'shipE',
        directions: [
          [0, 1, 2, 3, 4],
          [0, width, width*2, width*3, width*4]
        ]
      },
    ]
    
    // creating both the user and computer board
    createBoard(userGrid, userSquares)
    createBoard(computerGrid, computerSquares)
  
    //computer ships generated
    generate(shipArray[0])
    generate(shipArray[1])
    generate(shipArray[2])
    generate(shipArray[3])
    generate(shipArray[4])

  
    // listen to see when the user clicks the start button, making sure that all ships are places
    startButton.addEventListener('click', () => {
    if (allShipsPlaced) {
        document.getElementById('setup-title').style.display = 'none'
        setupButtons.style.display = 'none'
        playGame()
    } else infoDisplay.innerHTML = "Please place all ships"   
    })
    
  
    //Create Board function
    function createBoard(grid, squares) {
      for (let i = 0; i < width*width; i++) {
        const square = document.createElement('div')
        square.dataset.id = i
        grid.appendChild(square)
        squares.push(square)
      }
    }
  
    //Draw the computers ships in random locations
    function generate(ship) {
      let randomDirection = Math.floor(Math.random() * ship.directions.length)
      let current = ship.directions[randomDirection]
      if (randomDirection === 0) direction = 1
      if (randomDirection === 1) direction = 10
      let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)))
      const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'))
      const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
      const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)
  
      if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name))
  
      else generate(ship)
    }

  
    //Rotate the ships
    function rotate() {
      if (isHorizontal) {
        shipA.classList.toggle('shipA-container-vertical')
        shipB.classList.toggle('shipB-container-vertical')
        shipC.classList.toggle('shipCcontainer-vertical')
        shipD.classList.toggle('shipD-container-vertical')
        shipE.classList.toggle('shipE-container-vertical')
        isHorizontal = false
        return
      }
      if (!isHorizontal) {
        shipA.classList.toggle('shipA-container-vertical')
        shipB.classList.toggle('shipB-container-vertical')
        shipC.classList.toggle('shipCcontainer-vertical')
        shipD.classList.toggle('shipD-container-vertical')
        shipE.classList.toggle('shipE-container-vertical')
        isHorizontal = true
        return
      }
    }
    rotateButton.addEventListener('click', rotate)
  
    //move around user ship
    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragover', dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
    userSquares.forEach(square => square.addEventListener('drop', dragDrop))
    userSquares.forEach(square => square.addEventListener('dragend', dragEnd))
  
    let selectedShipNameWithIndex
    let draggedShip
    let draggedShipLength
  
    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
      selectedShipNameWithIndex = e.target.id
    }))
  
    //drag functions
    function dragStart() {
      draggedShip = this
      draggedShipLength = this.childNodes.length
      // console.log(draggedShip)
    }
  
    function dragOver(e) {
      e.preventDefault()
    }
  
    function dragEnter(e) {
      e.preventDefault()
    }
  
    function dragLeave() {
      // console.log('drag leave')
    }
  
    function dragDrop() {
      let shipNameWithLastId = draggedShip.lastChild.id
      let shipClass = shipNameWithLastId.slice(0, -2)
      let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
      let shipLastId = lastShipIndex + parseInt(this.dataset.id)

      // squares the last ship index is not allowed in
      const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
      const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]
      
      let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
      let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)
  
      selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))
  
      shipLastId = shipLastId - selectedShipIndex 
      
      if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
        for (let i=0; i < draggedShipLength; i++) {
          let directionClass
          if (i === 0) directionClass = 'start'
          if (i === draggedShipLength - 1) directionClass = 'end'
          userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass)
        }
      } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
        for (let i=0; i < draggedShipLength; i++) {
          let directionClass
          if (i === 0) directionClass = 'start'
          if (i === draggedShipLength - 1) directionClass = 'end'
          userSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', 'vertical', directionClass, shipClass)
        }
      } else return
      // console.log(userSquares)
      // console.log(userSquares[1].includes('taken'))
      // console.log(getAllIndexes(userSquares, 'taken'))
      displayGrid.removeChild(draggedShip)
      if(!displayGrid.querySelector('.ship')) allShipsPlaced = true
    }

    function getAllIndexes(arr, val) {
        var indexes = [], i;
        for(i = 0; i < arr.length; i++)
            if (arr[i].includes(val))
                indexes.push(i);
        return indexes;
    }
  
    function dragEnd() {
    //   console.log('dragend')
    }
  
  
    // Game Logic
    function playGame() {
      if (isGameOver) return
      document.getElementById('info-startgame').style.visibility = "visible"
      if (currentPlayer === 'user') {
        turnDisplay.innerHTML = 'Your Go'
        computerSquares.forEach(square => square.addEventListener('click', function(e) {
          shotFired = square.dataset.id
          revealSquare(square.classList)
        }))
      }
      if (currentPlayer === 'enemy') {
        turnDisplay.innerHTML = 'Computers Go'
        setTimeout(enemyGo, 1000)
      }
    }
  
    let shipACount = 0
    let shipBCount = 0
    let shipCCount = 0
    let shipDCount = 0
    let shipECount = 0
  
    function revealSquare(classList) {
      const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired}']`)
      const obj = Object.values(classList)
      if (!enemySquare.classList.contains('boom') && currentPlayer === 'user' && !isGameOver) {
        if (obj.includes('shipA')) {
            shipACount++
            document.getElementById(`eshipA-${shipACount - 1}`).classList.add('boom')
        }
        if (obj.includes('shipB')) {
            shipBCount++
            document.getElementById(`eshipB-${shipBCount - 1}`).classList.add('boom')
        }
        if (obj.includes('shipC')) {
            shipCCount++
            document.getElementById(`eshipC-${shipCCount} - 1}`).classList.add('boom')
        }
        if (obj.includes('shipD')) {
            shipDCount++
            document.getElementById(`eshipD-${shipDCount - 1}`).classList.add('boom')
        }
        if (obj.includes('shipE')) {
            shipECount++
            document.getElementById(`eshipE-${shipECount - 1}`).classList.add('boom')
        }
      }
      if (obj.includes('taken')) {
        enemySquare.classList.add('boom')
      } else {
        enemySquare.classList.add('miss')
      }
      checkForWins()
      currentPlayer = 'enemy'
      playGame()
    }
  
    let cpushipACount = 0
    let cpushipBCount = 0
    let cpushipCCount = 0
    let cpushipDCount = 0
    let cpushipECount = 0
  
  
    function enemyGo(square) {
      square = Math.floor(Math.random() * userSquares.length)
      if (!userSquares[square].classList.contains('boom')) {
        const hit = userSquares[square].classList.contains('taken')
        userSquares[square].classList.add(hit ? 'boom' : 'miss')
        if (userSquares[square].classList.contains('shipA')) cpushipACount++
        if (userSquares[square].classList.contains('shipB')) cpushipBCount++
        if (userSquares[square].classList.contains('shipC')) cpushipCCount++
        if (userSquares[square].classList.contains('shipD')) cpushipDCount++
        if (userSquares[square].classList.contains('shipE')) cpushipECount++
        checkForWins()
      } else enemyGo()
      currentPlayer = 'user'
      turnDisplay.innerHTML = 'Your Go'
    }
  
    function checkForWins() {
      let enemy = 'computer'
      if (shipACount === 2) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s shipA`
        shipACount = 10
      }
      if (shipBCount === 3) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s shipB`
        shipBCount = 10
      }
    if (shipCCount === 3) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s shipC`
        shipCCount = 10
      }
      if (shipDCount === 4) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s shipD`
        shipDCount = 10
      }
      if (shipECount === 5) {
        infoDisplay.innerHTML = `You sunk the ${enemy}'s shipE`
        shipECount = 10
      }
      if (cpushipACount === 2) {
        infoDisplay.innerHTML = `${enemy} sunk your shipA`
        cpushipACount = 10
      }
      if (cpushipBCount === 3) {
        infoDisplay.innerHTML = `${enemy} sunk your shipB`
        cpushipBCount = 10
      }
      if(cpushipCCount === 3) {
        infoDisplay.innerHTML = `${enemy} sunk your shipC`
        cpushipCCount = 10
      }
      if (cpushipDCount === 4) {
        infoDisplay.innerHTML = `${enemy} sunk your shipD`
        cpushipDCount = 10
      }
      if (cpushipECount === 5) {
        infoDisplay.innerHTML = `${enemy} sunk your shipE`
        cpushipECount = 10
      }
  
      if ((shipACount + shipBCount + shipCCount + shipDCount + shipECount) === 50) {
        infoDisplay.innerHTML = "YOU WIN"
        gameOver()
      }
      if ((cpushipACount + cpushipBCount + cpushipCCount + cpushipDCount + cpushipECount) === 50) {
        infoDisplay.innerHTML = `${enemy.toUpperCase()} WINS`
        gameOver()
      }
    }
  
    function gameOver() {
      isGameOver = true
      startButton.removeEventListener('click', playGame)
    }
  })