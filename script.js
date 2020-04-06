class Puzzle {
    constructor() {
        this.originalConfig = []
        this.config = [];
        this.movablePositions = [];
        this.elements = [];

        this.countOfRows = 4;
        this.countOfElements = 16;
        this.min = 0;
        this.sec = 0;

        this.count = 0;  //Счетчик ходов
    }

    init() {
        this.mainPuzzle = document.createElement('div');
        this.mainPuzzle.classList.add('puzzle');
        document.body.append(this.mainPuzzle);

        this.createCount();
        this.createTimer();

        this.mainButtonsWrap = document.createElement('div');
        this.mainButtonsWrap.classList.add('puzzle__main-buttons-wrap');
        this.mainPuzzle.append(this.mainButtonsWrap);

        this.createTimerButton();
        this.createNewGameButton();
        this.createSaveGameButton();
        this.createResultsButton();

        this.container = document.createElement('div');
        this.container.classList.add('puzzle__container');
        this.mainPuzzle.append(this.container)
        this.createElements();

        this.zero = document.querySelector('.item-0');

        this.blockWindow = document.createElement('div');
        this.blockWindow.classList.add('puzzle__block-window', 'active');
        this.container.append(this.blockWindow);

        this.mainPuzzle.append(this.createSizeButtons());
        this.container.addEventListener('click', (event) => {
            this.moveElement(event)
        });
        this.sizeButtons.addEventListener('click', (event) => { 
            if (event.target.classList.contains('button')){    //Ивент листенер для кнопок размеров поля
            this.countOfRows = event.target.innerHTML[0];
            this.countOfElements = this.countOfRows ** 2;
            this.refreshGame()
            }
        })
        this.timerButton.addEventListener('click', (event) => {     //Ивент листенер для кнопки таймера (старт стоп)
            if (this.timerButton.innerHTML === 'СТАРТ') {
                this.startTimer();
            }
            else {
                this.stopTimer()
            }
            this.timerButton.innerHTML = this.timerButton.innerHTML === 'СТАРТ' ? 'СТОП' : 'СТАРТ';
            this.blockWindow.classList.toggle('active')
        })

        this.newGameButton.addEventListener('click', (event) => {
            this.refreshGame();
        })

        this.saveGameButton.addEventListener('click', (event) => {
            let gameInfo = {
                'countOfRows': this.countOfRows,
                'countOfElements': this.countOfElements,
                'config': this.config,
                'min': this.min,
                'sec': this.sec,
                'count': this.count,
            };
            localStorage.setItem('save', true)
            localStorage.setItem('gameInfo', JSON.stringify(gameInfo))
            
        })

    }

    
    createElements() {
        for (let i = 0; i <= this.countOfElements - 1; i += 1) {
            this.config.push(i.toString())
            this.originalConfig.push(i.toString())
        }

        this.originalConfig.shift();
        this.originalConfig.push('0')

        this.config.sort(() => {
            return Math.random() - 0.5
        })

        if (localStorage.save === "true") {
            this.config = JSON.parse(localStorage.gameInfo).config;
            this.countOfRows = JSON.parse(localStorage.gameInfo).countOfRows;
            this.countOfElements = JSON.parse(localStorage.gameInfo).countOfElements;
            localStorage.save = "false"
        }

        this.config.forEach((number) => {
            let box = document.createElement('div');
            box.classList.add('puzzle__box', `item-${number}`);
            box.innerHTML = number;
            box.style.left = 0;
            box.style.top = 0;
            this.container.append(box);
            this.elements.push(box);
        })

        this.container.style.gridTemplateColumns = "1fr ".repeat(this.countOfRows);
    }

    removeElements() {
        this.config = [];
        this.originalConfig = []
        this.elements.forEach(elem => {
            elem.remove()
        });
    }

    createCount() {
        this.countElement = document.createElement('p');
        if (localStorage.save === "true") {
            this.count = JSON.parse(localStorage.gameInfo).count
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

    createSizeButtons() {
        this.sizeButtons = document.createElement('div');
        this.sizeButtons.classList.add('puzzle__size-buttons')
        for (let i = 3; i <= 8; i++) {
            let button = document.createElement('button');
            button.classList.add('puzzle__size-button', 'button')
            button.innerHTML = (`${i}x${i}`);
            this.sizeButtons.append(button)
        }
        return this.sizeButtons;
    }

    createTimer() {

        this.timer = document.createElement('p');
        if (localStorage.save === "true") {
            this.min = JSON.parse(localStorage.gameInfo).min;
            this.sec = JSON.parse(localStorage.gameInfo).sec;
            this.timer.innerHTML = (this.sec < 9) ? `Время: ${this.min}:0${this.sec}` : `Время: ${this.min}:${this.sec}`
        }
        else {
            this.timer.innerHTML = `Время: 0:00`;
        }
        this.mainPuzzle.append(this.timer);
    }

    createTimerButton() {
        this.timerButton = document.createElement('button');
        this.timerButton.classList.add('puzzle__timer-button', 'button');
        this.timerButton.innerHTML = 'СТАРТ'
        this.mainButtonsWrap.append(this.timerButton);
    }

    startTimer() {
        this.runningTimer = setInterval(() => {
            if (this.sec < 9) {
                this.timer.innerHTML = `Время: ${this.min}:0${this.sec += 1}`;
            }
            else {
                this.timer.innerHTML = `Время: ${this.min}:${this.sec += 1}`
            }

            if (this.sec === 59) {
                this.sec = 0;
                this.min += 1
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.runningTimer)
    }

    refreshTimer() {
        this.min = 0;
        this.sec = 0;
        this.timer.innerHTML = `Время: 0:00`;
        this.timerButton.innerHTML = 'СТАРТ';
    }

    createNewGameButton() {
        this.newGameButton = document.createElement('button');
        this.newGameButton.classList.add('puzzle__new-game-button', 'button');
        this.newGameButton.innerHTML = "Перемешать";
        this.mainButtonsWrap.append(this.newGameButton);
    }

    createSaveGameButton() {
        this.saveGameButton = document.createElement('button');
        this.saveGameButton.classList.add('puzzle__save-game-button', 'button');
        this.saveGameButton.innerHTML = "Сохранить";
        this.mainButtonsWrap.append(this.saveGameButton);
    }

    createResultsButton() {
        this.ResultsButton = document.createElement('button');
        this.ResultsButton.classList.add('puzzle__results-button', 'button');
        this.ResultsButton.innerHTML = "Результаты";
        this.mainButtonsWrap.append(this.ResultsButton);
    }

    changePositionsInConfig() {
        [this.config[this.config.indexOf(event.target.innerHTML)], this.config[this.positionOfZero]] = [this.config[this.positionOfZero], this.config[this.config.indexOf(event.target.innerHTML)]]
    }

    refreshGame(){
        this.stopTimer();
        this.refreshTimer();
        this.refreshCount()
        this.removeElements();
        this.createElements();
        this.blockWindow.classList.add('active');
    }

    moveElement() {
        this.positionOfZero = this.config.indexOf('0');

        let elementWidth = event.target.getBoundingClientRect().width + 3

        if (event.target.innerHTML >= 0 && event.target.innerHTML <= this.countOfElements - 1) {
            switch (event.target.innerHTML) {
                case this.config[this.positionOfZero - 1]: {
                    if (this.positionOfZero % this.countOfRows == 0) {
                        break;
                    }
                    event.target.style.left = parseFloat(event.target.style.left) + elementWidth + 'px';
                    this.zero.style.left = parseFloat(this.zero.style.left) - elementWidth + 'px';

                    this.changePositionsInConfig();
                    this.incremetCount();
                    break;
                };
                case this.config[this.positionOfZero + 1]: {
                    if ((this.positionOfZero + 1) % this.countOfRows == 0) {
                        break;
                    }
                    event.target.style.left = parseFloat(event.target.style.left) - elementWidth + 'px';
                    this.zero.style.left = parseFloat(this.zero.style.left) + elementWidth + 'px';
                    this.changePositionsInConfig();
                    this.incremetCount();
                    break;
                };
                case this.config[this.positionOfZero + -this.countOfRows]: {
                    event.target.style.top = parseFloat(event.target.style.top) + elementWidth + 'px';
                    this.zero.style.top = parseFloat(this.zero.style.top) - elementWidth + 'px';
                    this.changePositionsInConfig();
                    this.incremetCount();
                    break;
                };
                case this.config[this.positionOfZero + +this.countOfRows]: {

                    event.target.style.top = parseFloat(event.target.style.top) - elementWidth + 'px';
                    this.zero.style.top = parseFloat(this.zero.style.top) + elementWidth + 'px';
                    this.changePositionsInConfig();
                    this.incremetCount();
                    break;
                };
            }
        }
        this.check();
    }

    showWinWindow() {
        this.winWindow = document.createElement('div');
        this.winWindow.classList.add('win-window');
        this.winWindow.innerHTML = `<p> Вы победили!</p>
                                 <p>Ваш результат:</p>
                                    <p>Ходов: ${this.count}</p>
                                    <p>Время: ${this.min}м. ${this.sec}с.<p>`;
        this.stopTimer()

        this.inputName = document.createElement('input');
        this.inputName.classList.add('win-window__inputName');
        this.inputName.setAttribute('placeholder', 'Введите ваше имя');
        this.inputName.setAttribute('maxlength', '16')
        this.winWindow.append(this.inputName);

        this.winApplyButton = document.createElement('button');
        this.winApplyButton.classList.add('win-window__apply-button', 'button');
        this.winApplyButton.innerHTML = 'Принять';
        this.winWindow.append(this.winApplyButton);

        let block = document.createElement('div');
        block.classList.add('block-all');
        document.body.append(block);


        this.winApplyButton.addEventListener('click', (event) => {
            this.refreshGame();
            this.winWindow.remove();
            block.remove()

        })
        document.body.append(this.winWindow)
    }

    showResults(){
        
    }

    check() {
        let checkCount = 0;

        for (let i = 0; i < this.countOfElements; i++) {
            (this.originalConfig[i] === this.config[i]) ? checkCount += 1 : checkCount = 0;
        }

        if (checkCount === this.config.length) {
            setTimeout(() => {
                this.showWinWindow()
            }, 550);
        }

    }

}

let puzzle = new Puzzle();
puzzle.init();