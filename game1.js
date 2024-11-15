document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector('.grid-container');
  const scoreDisplay = document.querySelector('.score-container');
  const bestDisplay = document.querySelector('.best-container');
  const newGameButton = document.querySelector('.new-game-button');
  const tileContainer = document.querySelector('.tile-container');
  
  let tiles = []; // Array to store the tile values
  let score = 0;
  let best = 0;
  let noMergeCount = 0; // Counter for moves without any tile merging

  // Creating the playing board
  function createBoard() {
    gridDisplay.innerHTML = ''; // Clear previous grid cells
    tiles = []; // Reset tiles array
    for (let i = 0; i < 16; i++) {
      let tile = document.createElement('div');
      tile.classList.add('grid-cell');
      gridDisplay.appendChild(tile);
      tiles.push(0); // Initially set all tiles to 0
    }
    addNumber(); // Add a random number (2) to the board
    addNumber(); // Add another random number to the board
    noMergeCount = 0; // Reset the no merge count at the start of the new game
    score = 0; // Reset the score
    scoreDisplay.textContent = "Current score = " + score; // Update score display
  }

  // Add a number (2) to the board in a random empty tile
  function addNumber() {
    let emptyTiles = [];
    tiles.forEach((tile, index) => {
      if (tile === 0) emptyTiles.push(index); // Find all empty tiles (value is 0)
    });
    if (emptyTiles.length > 0) {
      let randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      tiles[randomIndex] = 2; // Place a '2' in a random empty tile
      displayTiles(); // Update the tile display
    }
  }

  // Display the tiles on the board
  function displayTiles() {
    tileContainer.innerHTML = ''; // Clear existing tiles on the board

    if (window.innerWidth > 530) { // Adjust tile size based on window width
      tiles.forEach((tile, index) => {
        if (tile !== 0) {
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
          tileContainer.appendChild(tileElement);
        }
      });
    }

    checkForGameOver(); // Check if game is over
    checkForWin(); // Check if player has won
  }

  // Check for game over condition (including no merge moves)
  function checkForGameOver() {
    let gameOver = true; // Assume game is over unless we find an empty space or a valid move

    // Loop through the tiles to check if there is any space or mergeable tiles
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let currentIndex = i * 4 + j;
        if (tiles[currentIndex] === 0) {
          gameOver = false; // If there’s an empty space, game is not over
          break;
        }

        // Check horizontal merges
        if (j < 3 && tiles[currentIndex] === tiles[currentIndex + 1]) {
          gameOver = false; // Merge possible, game is not over
          break;
        }

        // Check vertical merges
        if (i < 3 && tiles[currentIndex] === tiles[currentIndex + 4]) {
          gameOver = false; // Merge possible, game is not over
          break;
        }
      }
      if (!gameOver) break; // Break outer loop if game is not over
    }

    // If game over condition is met, display alert
    if (gameOver) {
      alert("Game Over! No more moves available");
      createBoard(); // Reset the board and restart the game
    }
    
    // Check if we reached 4 moves without a merge
    if (noMergeCount >= 4) {
      alert("Game Over! 4 moves without merging");
      createBoard(); // Reset the board and restart the game
    }
  }

  // Check if the player has won (reached the 2048 tile)
  function checkForWin() {
    if (tiles.includes(2048)) {
      alert("Congratulations! You've reached the 2048 tile");
      createBoard(); // Reset the board and restart the game
    }
  }

  // Move tiles in the specified direction ('right', 'left', 'up', 'down')
  function moveTiles(direction) {
    let newTiles = [...tiles]; // Copy current tiles array
    let merged = false; // Flag to check if any tiles were merged during the move

    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let j = 0; j < 4; j++) {
        if (direction === 'right' || direction === 'left') {
          row.push(newTiles[i * 4 + j]); // Get row tiles for horizontal movement
        } else {
          row.push(newTiles[j * 4 + i]); // Get column tiles for vertical movement
        }
      }

      if (direction === 'right' || direction === 'down') {
        row.reverse(); // Reverse row or column for 'right' or 'down' direction
      }

      let result = slide(row);
      if (result.merged) merged = true; // If any tiles merged, set merged flag

      row = result.row; // Get the resulting row after sliding

      if (direction === 'right' || direction === 'down') {
        row.reverse(); // Reverse back to original order
      }

      for (let j = 0; j < 4; j++) {
        if (direction === 'right' || direction === 'left') {
          newTiles[i * 4 + j] = row[j]; // Update tiles for horizontal direction
        } else {
          newTiles[j * 4 + i] = row[j]; // Update tiles for vertical direction
        }
      }
    }

    // If no merge happened, increment noMergeCount
    if (!merged) {
      noMergeCount++; // Increment non-merge move count
    } else {
      noMergeCount = 0; // Reset counter when a merge happens
    }

    // If the tiles array changed, add a new number and update the display
    if (JSON.stringify(newTiles) !== JSON.stringify(tiles)) {
      tiles = newTiles;
      addNumber();
      displayTiles();
    }
  }

  // Slide the tiles in a row, merging identical tiles and adding score
  function slide(row) {
    let newRow = row.filter(tile => tile); // Remove all 0s from the row
    let merged = false; // Flag to check if any merge happened
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2; // Merge tiles by doubling the value
        score += newRow[i]; // Add to the score
        newRow.splice(i + 1, 1); // Remove the merged tile
        newRow.push(0); // Add a 0 at the end of the row
        merged = true; // Set merge flag
      }
    }
    // Pad the row with 0s to make it 4 tiles long
    while (newRow.length < 4) {
      newRow.push(0);
    }
    return { row: newRow, merged: merged }; // Return row and merged status
  }

  // Listen for key presses (arrow keys) to move tiles
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      moveTiles('right');
    } else if (e.key === 'ArrowLeft') {
      moveTiles('left');
    } else if (e.key === 'ArrowUp') {
      moveTiles('up');
    } else if (e.key === 'ArrowDown') {
      moveTiles('down');
    }
    scoreDisplay.textContent = score; // Update score display
    if (score > best) {
      best = score; // Update best score if current score is higher
      bestDisplay.textContent = best;
    }
  });

  // Variables for touch events to detect swipes
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  // Function to handle swipe detection
  function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 0) {
        moveTiles('right');
      } else {
        moveTiles('left');
      }
    } else {
      // Vertical swipe
      if (diffY > 0) {
        moveTiles('down');
      } else {
        moveTiles('up');
      }
    }
    scoreDisplay.textContent = score; // Update score display
    if (score > best) {
      best = score; // Update best score if current score is higher
      bestDisplay.textContent = best;
    }
  }

  // Event listeners for touch events (mobile swipe detection)
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  });

  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe(); // Handle the swipe after touch ends
  });

  // Start a new game when the button is clicked
  newGameButton.addEventListener('click', () => {
    score = 0;
    scoreDisplay.textContent = "Current score = " + score; // Reset score
    bestDisplay.textContent = "Best score = " + best; // Display best score
    createBoard(); // Create a new board
  });

  createBoard(); // Initialize the board when the page loads
});
