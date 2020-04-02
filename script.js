class Puzzle {
    constructor() {
        this.timer = null;

        this.config = [];
        this.movablePositions = [];

        this.countOfRows = 4;

        this.count = 0;
    }

    init() {
        let mainPuzzle = document.createElement('div');
        mainPuzzle.classList.add('puzzle');
        document.body.append(mainPuzzle);
        mainPuzzle.append(this.createCount())
        mainPuzzle.append(this.createElements());
        this.container.addEventListener('click', (event) => {
            this.moveElement(event)
        })


    }
    createElements() {
        this.container = document.createElement('div');
        this.container.classList.add('puzzle__container');
        for (let i = 0; i <= 15; i += 1) {
            this.config.push(i.toString())
        }
        this.config.sort(() => {
            return Math.random() - 0.5
        })

        this.config.forEach((number) => {
            let box = document.createElement('div');
            box.classList.add('puzzle__box', `item-${number}`);
            box.innerHTML = number;
            this.container.append(box);
        })
        return this.container;
    }

    createCount(){
        this.countElement = document.createElement('p');

        this.countElement.innerHTML = this.count;
        return this.countElement
    }

    changeElements(){
        
        [this.config[this.config.indexOf(event.target.innerHTML)], this.config[this.positionOfZero]] = [this.config[this.positionOfZero], this.config[this.config.indexOf(event.target.innerHTML)]]
    }

    moveElement() {
        this.positionOfZero = this.config.indexOf('0');

        if (event.target.innerHTML >= 0 && event.target.innerHTML <= 15)
            switch (event.target.innerHTML) {
                case this.config[this.positionOfZero - 1]: {
                    if (event.target.style.left == "") {
                        event.target.style.left = "103.5px";
                       
                    }
                    else {
                        event.target.style.left = parseFloat(event.target.style.left) + 103.5 + 'px'
                    }
                    this.changeElements();
                    this.countElement.innerHTML = this.count += 1;
                    break;
                };
                case this.config[this.positionOfZero + 1]: {
                    if (event.target.style.left == "") {
                        event.target.style.left = "-103.5px";
                    }
                    else {
                        event.target.style.left = parseFloat(event.target.style.left) - 103.5 + 'px'
                    }
                    this.changeElements(); 
                    this.countElement.innerHTML = this.count += 1;                   
                    break;
                };
                case this.config[this.positionOfZero + -4]: {
                    if (event.target.style.top == "") {
                        event.target.style.top = "103.5px";
                    }
                    else {
                        event.target.style.top = parseFloat(event.target.style.top) + 103.5 + 'px'
                    }
                    this.changeElements(); 
                    this.countElement.innerHTML = this.count += 1;                 
                    break;
                };
                case this.config[this.positionOfZero + 4]: {
                    if (event.target.style.top == "") {
                        event.target.style.top = "-103.5px";
                    }
                    else {
                        event.target.style.top = parseFloat(event.target.style.top) - 103.5 + 'px'
                    }
                    this.changeElements(); 
                    this.countElement.innerHTML = this.count += 1;                   
                    break;
                };
            }
    }

}

let puzzle = new Puzzle();
puzzle.init();