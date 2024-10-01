document.addEventListener("DOMContentLoaded", ()=>{
  const gridDisplay = document.querySelector('.grid-container');
  const scoreDisplay = document.querySelector('.score-container');
  const bestDisplay = document.querySelector('.best-container');
  const newGameButton = document.querySelector('.new-game-button');
  const tileContainer = document.querySelector('.tile-container');
  let tile = [];
  let score = 0;
  let best = 0;

  // creating the playing board
  function createBoard() {
    gridDisplay.innerHTML = ''; // clear previous grid cell
    tiles = []; // Reset tiles array
    for(let i = 0; i < 16; i++) {
      let tile = document.createElement('div');
      tile.classList.add('grid-cell');
      gridDisplay.appendChild(tile);
      tiles.push(0);
    }
    addNumber();
    addNumber();
  }

  // Add a number to the board
  function addNumber() {
    let emptyTiles = [];
    tiles.forEach((tile, index) => {
      if (tile === 0) emptyTiles.push(index);
    });
    if (emptyTiles.length > 0) {
      let randomNumber = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      tiles[randomNumber] = 2;
      displayTiles();
    }
  }

  // Display the tiles on the board

  function displayTiles() {
    tileContainer.innerHTML = '';
    if (window.innerWidth > 530) {
      tiles.forEach((tile, index) => {
        if (tile !== 0){
          let tileElement = document.createElement('div');
          tileElement.classList.add('tile');
          tileElement.classList.add(`tile-${tile}`);
          tileElement.innerText = tile;
          tileElement.style.top = `${Math.floor(index / 4) * 110}px`;
          tileElement.style.left = `${(index % 4) * 110}px`;
          tileContainer.appendChild(tileElement);
        }
      });
    } else {
      tiles.forEach((tile, index) => {
        if (tile !== 0) {
          let tileElement = document.createElement('div');
          tileElement.classList.add('tile');
          tileElement.classList.add(`tile-${tile}`);
          tileElement.innerText = tile;
          tileElement.style.top = `${Math.floor(index / 4) * 80}px`;
          tileElement.style.left = `${(index % 4) * 80}px`;
          tileElement.appendChild(tileElement);
        }
      });
    }

    checkForGameOver();
    checkForWin();
  }

  // Check for game over condition
  function checkForGameOver() {
    if (!tile.includes(0)) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let currenIndex = i * 4 + j;
          if ( j < 3 && tile[currenIndex] === tiles[currenIndex + 1]) return; //check for horizontal
          if ( i < 3 && tile[currenIndex] === tiles[currenIndex + 4]) return;
        }
      }
      alert("Game Over! No more moves avilable");
    }
  }

  // Check for 2048 tile
  function checkForWin() {
    if (tiles.includes(2048)) {
      alert(`Congratulations! You've reached the 2048 tile`);
    }
  }

  // Handle swipe events
  function moveTiles(direction) {
    let newTiles = [...tiles];
    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let j = 0; j < 4; j++) {
        if (direction === 'right' || direction === 'left') {
          row.push(newTiles[i * 4 + j]);
        } else {
          row.push(newTiles[j * 4 + i]);
        }
      }
      if (direction === 'right' || direction === 'down') {
        row = row.reverse();
      }
      row = slide(row);
      if (direction === 'right' || direction === 'down') {
        row = row.reverse();
      }
      for (let j = 0; j < 4; j++) {
        if (direction === 'right' || direction === 'left') {
          newTiles[i * 4 + j] = row[j];
        } else {
          newTiles[j * 4 + i] = row[j];
        }
      }
    }
    if (JSON.stringify(newTiles) !== JSON.stringify(tiles)) {
      tiles = newTiles;
      addNumber();
      displayTiles();
    }
  }

  function slide(row) {
    let newRow = row.filter(tile => tile);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          score += newRow[i];
          newRow.splice(i + 1, 1);
          newRow.push(0);
        }
      }
      while (newRow.length < 4) {
        newRow.push(0);
      }
      return newRow
    }

    // Listen for key presses
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        moveTiles('right');
      } else if (e.key === 'ArrowLeft') {
        moveTiles('left');
      } else if (e.key === 'ArrowUp') {
        moveTiles('up');
      } else if (e.key === 'ArrowDown') {
        moveTiles('down')
      }
      scoreDisplay.textContent = score;
      if (score > best) {
        best = score;
        bestDisplay.textContent = best;
      }
    });

    // Variables to store touch positions
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // Function to handle swipe detection
    function handleSwipe() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
          moveTiles('right');
        }else {
          moveTiles('left');
        }
      } else {
        // Vertical swipe
        if (diffY > 0) {
          moveTiles('down');
        } else {
          moveTiles('up')
        }
      }
      scoreDisplay.textContent = score;
      if (score > best) {
        best = score;
        bestDisplay.textContent = best;
      }
    }
    
    // Event listners for touch events
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    });

    //Start a new game
    newGameButton.addEventListener('click', () => {
      score = 0;
      scoreDisplay.textContent = "Current score =" + score;
      bestDisplay.textContent = "Best score =" + best;
      createBoard();
    });
  
    createBoard();
});