class Puzzle {
    constructor() {
        this.originalConfig = []
        this.config = [];
        this.movablePositions = [];
        this.elements = [];
        this.countOfRows = 4;

        this.count = 0;  //Счетчик ходов
    }

    init() {
        this.mainPuzzle = document.createElement('div');
        this.mainPuzzle.classList.add('puzzle');
        document.body.append(this.mainPuzzle);
        this.mainPuzzle.append(this.createCount());

        this.container = document.createElement('div');
        this.container.classList.add('puzzle__container');
        this.mainPuzzle.append(this.container)
        this.createElements()
        this.mainPuzzle.append(this.createSizeButtons());
        this.container.addEventListener('click', (event) => {
            this.moveElement(event)
        });
        this.buttons.addEventListener('click', (event) => {
            this.countOfRows = event.target.innerHTML[0];
            this.removeElements();
            this.createElements()
        })


    }
    createElements() {
        for (let i = 0; i <= (this.countOfRows ** 2) - 1; i += 1) {
            this.config.push(i.toString())
            this.originalConfig.push(i.toString())
        }

        this.originalConfig.shift();
        this.originalConfig.push('0')

        this.config.sort(() => {
            return Math.random() - 0.5
        })

        this.config.forEach((number) => {
            let box = document.createElement('div');
            box.classList.add('puzzle__box', `item-${number}`);
            box.innerHTML = number;
            this.container.append(box);
            this.elements.push(box)
        })

        this.container.style.gridTemplateColumns = "1fr ".repeat(this.countOfRows);
    }

    removeElements(){
        this.config = [];
        this.originalConfig = []
        this.elements.forEach(elem => {
            elem.remove()
        });
    }

    createCount() {
        let fragment = document.createDocumentFragment();

        let text = document.createElement('span');
        text.innerHTML = "Количество ходов: ";
        fragment.append(text);

        this.countElement = document.createElement('span');
        this.countElement.innerHTML = this.count;
        fragment.append(this.countElement);

        return fragment;
    }

    createSizeButtons() {
        this.buttons = document.createElement('div');
        this.buttons.classList.add('puzzle__buttons')
        for (let i = 3; i <= 8; i++) {
            let button = document.createElement('button');
            button.innerHTML = (`${i}x${i}`);
            this.buttons.append(button)
        }
        return this.buttons
    }   

    changeElements() {

        [this.config[this.config.indexOf(event.target.innerHTML)], this.config[this.positionOfZero]] = [this.config[this.positionOfZero], this.config[this.config.indexOf(event.target.innerHTML)]]
    }

    moveElement() {
        this.positionOfZero = this.config.indexOf('0');

        let elementWidth = event.target.getBoundingClientRect().width + 3

        if (event.target.innerHTML >= 0 && event.target.innerHTML <= (this.countOfRows ** 2) - 1)
            switch (event.target.innerHTML) {
                case this.config[this.positionOfZero - 1]: {
                    if (event.target.style.left == "") {
                        event.target.style.left = elementWidth + 'px'
                    }
                    else {
                        event.target.style.left = parseFloat(event.target.style.left) + elementWidth + 'px'
                    }
                    this.changeElements();
                    this.countElement.innerHTML = this.count += 1;
                    break;
                };
                case this.config[this.positionOfZero + 1]: {
                    if (event.target.style.left == "") {
                        event.target.style.left = -elementWidth + 'px'
                    }
                    else {
                        event.target.style.left = parseFloat(event.target.style.left) - elementWidth + 'px'
                    }
                    this.changeElements();
                    this.countElement.innerHTML = this.count += 1;
                    break;
                };
                case this.config[this.positionOfZero + -this.countOfRows]: {
                    if (event.target.style.top == "") {
                        event.target.style.top = elementWidth + 'px'
                    }
                    else {
                        event.target.style.top = parseFloat(event.target.style.top) + elementWidth + 'px'
                    }
                    this.changeElements();
                    this.countElement.innerHTML = this.count += 1;
                    break;
                };
                case this.config[this.positionOfZero + +this.countOfRows]: {
                    if (event.target.style.top == "") {
                        event.target.style.top = -elementWidth + 'px'
                    }
                    else {
                        event.target.style.top = parseFloat(event.target.style.top) - elementWidth + 'px'
                    }
                    this.changeElements();
                    this.countElement.innerHTML = this.count += 1;
                    break;
                };
            }
        this.check();
    }

    winWindow() {
        let winWindow = document.createElement('div');
        winWindow.classList.add('win-window');
        winWindow.innerHTML = `Вы победили! Ваш результат: ${this.count} ходов`

        document.body.append(winWindow)
    }

    check() {
        let checkCount = 0;

        for (let i = 0; i < this.countOfRows ** 2; i++) {
            (this.originalConfig[i] === this.config[i]) ? checkCount += 1 : checkCount = 0;
        }

        if (checkCount === this.config.length) {
            setTimeout(() => {
                this.winWindow()
            }, 550);
        }

    }

}

let puzzle = new Puzzle();
puzzle.init();