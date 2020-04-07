class Puzzle {
  constructor() {
    this.originalConfig = [];
    this.config = [];
    this.movablePositions = [];
    this.cells = [];

    this.countOfRows = 4;
    this.countOfCells = 16;
    this.min = 0;
    this.sec = 0;

    this.count = 0;
  }

  init() {
    if (localStorage.results === undefined) {
      localStorage.setItem('results', JSON.stringify([]));
    }

    this.mainPuzzle = document.createElement('div');
    this.mainPuzzle.classList.add('puzzle');
    document.body.append(this.mainPuzzle);

    this.createCount();
    this.createTimer();

    this.mainButtonsWrap = document.createElement('div');
    this.mainButtonsWrap.classList.add('puzzle__main-buttons-wrap');
    this.mainButtonsWrap.append(this.timerButton());
    this.mainButtonsWrap.append(this.newGameButton());
    this.mainButtonsWrap.append(this.saveGameButton());
    this.mainButtonsWrap.append(this.resultsButton());
    this.mainPuzzle.append(this.mainButtonsWrap);

    this.container = document.createElement('div');
    this.container.classList.add('puzzle__container');
    this.container.addEventListener('click', (event) => {
      this.moveElement(event);
    });
    this.mainPuzzle.append(this.container);

    this.createCells();

    this.zero = document.querySelector('.item-0');

    this.blockWindow = document.createElement('div');
    this.blockWindow.classList.add('puzzle__block-window', 'active');
    this.container.append(this.blockWindow);

    this.mainPuzzle.append(this.sizeButtons());
  }


  createCells() {
    for (let i = 0; i <= this.countOfCells - 1; i += 1) {
      this.config.push(i.toString());
      this.originalConfig.push(i.toString());
    }

    this.originalConfig.shift();
    this.originalConfig.push('0');

    this.config.sort(() => Math.random() - 0.5);

    if (localStorage.save === 'true') {
      this.config = JSON.parse(localStorage.gameInfo).config;
      this.countOfRows = JSON.parse(localStorage.gameInfo).countOfRows;
      this.countOfCells = JSON.parse(localStorage.gameInfo).countOfCells;
      localStorage.save = 'false';
    }

    this.config.forEach((number) => {
      const cell = document.createElement('div');
      cell.classList.add('puzzle__cell', `item-${number}`);
      cell.innerHTML = number;
      cell.style.left = 0;
      cell.style.top = 0;
      this.container.append(cell);
      this.cells.push(cell);
    });

    this.container.style.gridTemplateColumns = '1fr '.repeat(this.countOfRows);
  }

  sizeButtons() {
    this.sizeButtons = document.createElement('div');
    this.sizeButtons.classList.add('puzzle__size-buttons');
    for (let i = 3; i <= 8; i += 1) {
      const button = document.createElement('button');
      button.classList.add('puzzle__size-button', 'button');
      button.innerHTML = (`${i}x${i}`);
      this.sizeButtons.append(button);
    }

    this.sizeButtons.addEventListener('click', (event) => {
      if (event.target.classList.contains('button')) {
        [this.countOfRows] = [event.target.innerHTML[0]];
        this.countOfCells = this.countOfRows ** 2;
        this.refreshGame();
      }
    });

    return this.sizeButtons;
  }

  timerButton() {
    this.timerButton = document.createElement('button');
    this.timerButton.classList.add('puzzle__timer-button', 'button');
    this.timerButton.innerHTML = 'СТАРТ';
    this.timerButton.addEventListener('click', () => {
      if (this.timerButton.innerHTML === 'СТАРТ') {
        this.startTimer();
      } else {
        this.stopTimer();
      }
      this.timerButton.innerHTML = this.timerButton.innerHTML === 'СТАРТ' ? 'СТОП' : 'СТАРТ';
      this.blockWindow.classList.toggle('active');
    });
    return this.timerButton;
  }

  newGameButton() {
    this.newGameButton = document.createElement('button');
    this.newGameButton.classList.add('puzzle__new-game-button', 'button');
    this.newGameButton.innerHTML = 'Перемешать';
    this.newGameButton.addEventListener('click', () => {
      this.refreshGame();
    });
    return this.newGameButton;
  }

  saveGameButton() {
    this.saveGameButton = document.createElement('button');
    this.saveGameButton.classList.add('puzzle__save-game-button', 'button');
    this.saveGameButton.innerHTML = 'Сохранить';
    this.saveGameButton.addEventListener('click', () => {
      const gameInfo = {
        countOfRows: this.countOfRows,
        countOfCells: this.countOfCells,
        config: this.config,
        min: this.min,
        sec: this.sec,
        count: this.count,
      };
      localStorage.setItem('save', true);
      localStorage.setItem('gameInfo', JSON.stringify(gameInfo));
    });
    return this.saveGameButton;
  }

  resultsButton() {
    this.resultsButton = document.createElement('button');
    this.resultsButton.classList.add('puzzle__results-button', 'button');
    this.resultsButton.innerHTML = 'Результаты';
    this.resultsButton.addEventListener('click', () => {
      this.showResults();
    });
    return this.resultsButton;
  }

  removeCells() {
    this.config = [];
    this.originalConfig = [];
    this.cells.forEach((elem) => {
      elem.remove();
    });
  }

  createCount() {
    this.countElement = document.createElement('p');
    if (localStorage.save === 'true') {
      this.count = JSON.parse(localStorage.gameInfo).count;
    }
    this.countElement.innerHTML = `Количество ходов: ${this.count}`;
    this.mainPuzzle.append(this.countElement);
  }

  incremetCount() {
    this.countElement.innerHTML = `Количество ходов: ${this.count += 1}`;
  }

  refreshCount() {
    this.count = 0;
    this.countElement.innerHTML = `Количество ходов: ${this.count}`;
  }


  createTimer() {
    this.timer = document.createElement('p');
    if (localStorage.save === 'true') {
      this.min = JSON.parse(localStorage.gameInfo).min;
      this.sec = JSON.parse(localStorage.gameInfo).sec;
      this.timer.innerHTML = (this.sec < 9) ? `Время: ${this.min}:0${this.sec}` : `Время: ${this.min}:${this.sec}`;
    } else {
      this.timer.innerHTML = 'Время: 0:00';
    }
    this.mainPuzzle.append(this.timer);
  }

  startTimer() {
    this.runningTimer = setInterval(() => {
      if (this.sec < 9) {
        this.timer.innerHTML = `Время: ${this.min}:0${this.sec += 1}`;
      } else {
        this.timer.innerHTML = `Время: ${this.min}:${this.sec += 1}`;
      }

      if (this.sec === 60) {
        this.sec = 0;
        this.min += 1;
        this.timer.innerHTML = `Время: ${this.min}:0${this.sec}`;
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.runningTimer);
  }

  refreshTimer() {
    this.min = 0;
    this.sec = 0;
    this.timer.innerHTML = 'Время: 0:00';
    this.timerButton.innerHTML = 'СТАРТ';
  }

  changePositionsInConfig(event) {
    [this.config[this.config.indexOf(event.target.innerHTML)], this.config[this.positionOfZero]] = [this.config[this.positionOfZero], this.config[this.config.indexOf(event.target.innerHTML)]];
  }

  refreshGame() {
    this.stopTimer();
    this.refreshTimer();
    this.refreshCount();
    this.removeCells();
    this.createCells();
    this.blockWindow.classList.add('active');
  }

  moveElement(event) {
    this.positionOfZero = this.config.indexOf('0');

    const cellWidth = event.target.getBoundingClientRect().width + 3;

    if (event.target.innerHTML >= 0 && event.target.innerHTML <= this.countOfCells - 1) {
      switch (event.target.innerHTML) {
        case this.config[this.positionOfZero - 1]: {
          if (this.positionOfZero % this.countOfRows === 0) {
            break;
          }
          event.target.style.left = `${parseFloat(event.target.style.left) + cellWidth}px`;
          this.zero.style.left = `${parseFloat(this.zero.style.left) - cellWidth}px`;

          this.changePositionsInConfig(event);
          this.incremetCount();
          break;
        }
        case this.config[this.positionOfZero + 1]: {
          if ((this.positionOfZero + 1) % this.countOfRows === 0) {
            break;
          }
          event.target.style.left = `${parseFloat(event.target.style.left) - cellWidth}px`;
          this.zero.style.left = `${parseFloat(this.zero.style.left) + cellWidth}px`;
          this.changePositionsInConfig(event);
          this.incremetCount();
          break;
        }
        case this.config[this.positionOfZero + -this.countOfRows]: {
          event.target.style.top = `${parseFloat(event.target.style.top) + cellWidth}px`;
          this.zero.style.top = `${parseFloat(this.zero.style.top) - cellWidth}px`;
          this.changePositionsInConfig(event);
          this.incremetCount();
          break;
        }
        case this.config[this.positionOfZero + +this.countOfRows]: {
          event.target.style.top = `${parseFloat(event.target.style.top) - cellWidth}px`;
          this.zero.style.top = `${parseFloat(this.zero.style.top) + cellWidth}px`;
          this.changePositionsInConfig(event);
          this.incremetCount();
          break;
        }

        default: {
          this.checkWin();
        }
      }
    }
    this.checkWin();
  }

  showWinWindow() {
    this.winWindow = document.createElement('div');
    this.winWindow.classList.add('win-window');
    this.winWindow.innerHTML = `<p> Вы победили!</p>
                                 <p>Ваш результат:</p>
                                    <p>Ходов: ${this.count}</p>
                                    <p>Время: ${this.min}м. ${this.sec}с.<p>`;
    this.stopTimer();

    this.inputName = document.createElement('input');
    this.inputName.classList.add('win-window__inputName');
    this.inputName.setAttribute('placeholder', 'Введите ваше имя');
    this.inputName.setAttribute('maxlength', '12');
    this.winWindow.append(this.inputName);

    const block = document.createElement('div');
    block.classList.add('block-all');
    document.body.append(block);

    this.winApplyButton = document.createElement('button');
    this.winApplyButton.classList.add('win-window__apply-button', 'button');
    this.winApplyButton.innerHTML = 'Принять';
    this.winApplyButton.addEventListener('click', () => {
      let resultsArray = JSON.parse(localStorage.results);
      if (this.inputName.value === '') {
        this.inputName.value = 'Аноним';
      }
      resultsArray.push({
        name: this.inputName.value, turns: `Ходов: ${this.count}`, time: `Время: ${this.min}м. ${this.sec}с.`, sec: ((this.min * 60) + this.sec),
      });
      resultsArray.sort((elemA, elemB) => elemA.sec - elemB.sec);
      if (resultsArray.length > 9) {
        resultsArray = resultsArray.slice(0, 10);
      }
      localStorage.results = JSON.stringify(resultsArray);

      this.refreshGame();
      this.winWindow.remove();
      block.remove();
    });
    this.winWindow.append(this.winApplyButton);

    document.body.append(this.winWindow);
  }

  showResults() {
    this.resultsWindow = document.createElement('div');
    this.resultsWindow.classList.add('results-window');
    this.resultsWindow.innerHTML = '<p>Результаты</p>';

    const resultsArray = JSON.parse(localStorage.results);
    if (resultsArray.length !== 0) {
      resultsArray.forEach((obj, index) => {
        const playerInfo = document.createElement('p');
        playerInfo.classList.add('results-window__player-info');
        playerInfo.innerHTML = `${index + 1}. <b>${obj.name}</b> ${obj.time} ${obj.turns}`;
        this.resultsWindow.append(playerInfo);
      });
    } else {
      const noResults = document.createElement('p');
      noResults.innerHTML = 'Результатов нет.';
      noResults.style.fontSize = '14px';
      this.resultsWindow.append(noResults);
    }

    this.resultsCloseButton = document.createElement('button');
    this.resultsCloseButton.classList.add('results-window__close-button', 'button');
    this.resultsCloseButton.innerHTML = 'Закрыть';
    this.resultsCloseButton.addEventListener('click', () => {
      this.resultsWindow.remove();
    });
    this.resultsWindow.append(this.resultsCloseButton);

    document.body.append(this.resultsWindow);
  }

  checkWin() {
    let checkCount = 0;

    for (let i = 0; i < this.countOfCells; i += 1) {
      if (this.originalConfig[i] === this.config[i]) {
        checkCount += 1;
      } else {
        checkCount = 0;
      }
    }

    if (checkCount === this.config.length) {
      setTimeout(() => {
        this.showWinWindow();
      }, 550);
    }
  }
}

const puzzle = new Puzzle();
puzzle.init();
