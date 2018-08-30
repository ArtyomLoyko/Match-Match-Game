class NewGame {
  constructor() {
    this.skirt = "assets/img/skirt1.png";
    this.main = document.getElementById('main');
    this.imageArr = [
      'assets/img/pair1.png', 
      'assets/img/pair2.png',
      'assets/img/pair3.png',
      'assets/img/pair4.png',
      'assets/img/pair5.png'
    ];
    this.additionalImageArr1 = [
      'assets/img/pair6.png',
      'assets/img/pair7.png',
      'assets/img/pair8.png',
      'assets/img/pair9.png'
    ];
    this.additionalImageArr2 = [
      'assets/img/pair10.png',
      'assets/img/pair11.png',
      'assets/img/pair12.png'
    ];
  }
  
  selectSkirtCards(e) {
    if (e.target.tagName === 'IMG') {
      this.skirt = e.target.getAttribute('src');
      let border = document.querySelector('.border-for-skirt');
      if (border) border.classList.remove('border-for-skirt');
      e.target.classList.toggle('border-for-skirt');
    }
  }

  //check user data
  checkUser() {
    this.firstName = document.getElementById('first-name').value;
    this.lastName = document.getElementById('last-name').value;
    this.email = document.getElementById('email').value;
    if (!this.firstName && !this.lastName && !this.email) return false;
    else return true;
  }

  checkEmail() {
    if (this.email.indexOf('@') === -1) return false;
    else return true;
  }

  checkName() {
    if (this.firstName.length > 10 || this.lastName.length > 10) return false;
    else return true;
  }
  
  clearDesk() {
    this.introduction = document.getElementById('introduction');
    this.introduction.style.display = 'none';
  }
  
  //create new game
  createGameField() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('wrapper');

    this.gameFieldContainer = document.createElement('section');
    this.gameFieldContainer.classList.add('game-field-container');
    
    this.main.appendChild(this.wrapper);
    this.wrapper.appendChild(this.gameFieldContainer);  
    
    this.difficulty = document.getElementById('difficulty').value;

    this.placeCards(this.difficulty, this.skirt);

    this.gameFieldContainer.addEventListener('click', (e) => this.turnCard(e));
  }

  placeCards(difficulty, skirtCard) {
    let col = +difficulty.split('')[0];
    let row = +difficulty.split('')[2];
    for (let i = 0; i < row; i++) {
      let line = document.createElement('div');
      line.classList.add('line');
      this.gameFieldContainer.appendChild(line);
      if (row === 3) line.style.height = '30%';

      for (let j = 0; j < col; j++) {
        this.card = document.createElement('div');
        this.card.classList.add('card');
        line.appendChild(this.card);
        if (col === 6) this.card.style.width = '12%';
        if (col === 8) this.card.style.width = '10%';
      }
    }

    this.cards = document.querySelectorAll('.card');
    for(let i = 0; i < this.cards.length; i++) {
      this.cards[i].style.backgroundImage = `url(${skirtCard})`;
    }
  }
  
  randomPlace() {  
    if (this.cards.length === 18) {
      this.imageArr = this.imageArr.concat(this.additionalImageArr1);
    }

    if (this.cards.length === 24) {
      this.imageArr = this.imageArr.concat(this.additionalImageArr1, this.additionalImageArr2);
    }

    let imageRandomCollection = [];

    for (let i = 0; i < 2; i++) {
      this.imageArr.sort((a, b) => Math.random() - 0.5);
      imageRandomCollection = imageRandomCollection.concat(this.imageArr);
    }

    imageRandomCollection.sort((a, b) => Math.random() - 0.5);

    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].setAttribute('data-image-link', imageRandomCollection[i]);
    }
  }
  
  //create timer
  startTimer() {
    this.timer = document.createElement('div');
    this.timer.textContent = '00:00';
    this.timer.classList.add('timer');
    
    this.wrapper.insertBefore(this.timer, this.gameFieldContainer);

    this.timerId = setInterval(() => this.ticTac(), 1000);
  }

  ticTac() {
    let mm = this.timer.textContent.split(':')[0];
    let ss = this.timer.textContent.split(':')[1];

    ++ss;

    if (ss > 59) {
      ++mm;

      if (mm < 10) {
        mm = '0' + mm;
      }

      ss = 0;
    }

    if (ss < 10) {
      ss = '0' + ss;
    }

    this.timer.textContent = `${mm}:${ss}`;
  }

  //create 'new game' button
  addBtnEvents() {
    const skirtCards = document.getElementById('skirts');
    skirtCards.addEventListener('click', (e) => this.selectSkirtCards(e));

    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', (e) => {
      if (!this.checkUser()) {
        alert('Please, fill in all the fields!');
      } else if (!this.checkEmail()) {
        alert('Incorrect Email!');
      } else if (!this.checkName()) {
        alert('First and last name must not contain more than 10 symbols!');
      } else {
        this.clearDesk();
        this.createGameField(e);
        this.randomPlace();
        this.startTimer();
      }
    });
  }
  
  //game process
  turnCard(e) {
    if (e.target.parentElement.classList.contains("line")) {
      this.gameFieldContainer.style.pointerEvents = 'none';
  
      e.target.setAttribute('data-turned-card', true);
      e.target.style.transform = 'scaleX(-1)';

      setTimeout(() => {
        e.target.style.backgroundImage = `url( ${e.target.dataset.imageLink} )`;
        e.target.style.backgroundColor = 'white';
        e.target.style.border = '0';
      }, 200);

      setTimeout(() => {
        this.checkCards();
        this.gameFieldContainer.style.pointerEvents = '';
      }, 400);
    }
  }

  checkCards() {
    let pairCards = [];

    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].style.opacity === '0') continue;
      if (this.cards[i].hasAttribute('data-turned-card')) pairCards.push(this.cards[i]);
    } 

    if (pairCards.length === 2) {
      pairCards = document.querySelectorAll('.card[data-turned-card=true]');
   
      if (pairCards[0].style.backgroundImage === pairCards[1].style.backgroundImage) {
        pairCards.forEach(i => {
          i.style.opacity = '0';
          i.style.pointerEvents = 'none';
          
          i.removeAttribute('data-turned-card');
        });

        let counter = 0;
        Array.from(this.cards).forEach(i => {
          if (i.style.opacity === '0') counter++;
        });

        if (counter === this.cards.length) {
          this.endGame();
        }
      } else {
        pairCards.forEach(i => {
          i.removeAttribute('data-turned-card');

          i.style.background = `rgb(125, 244, 255) url(${this.skirt}) center no-repeat`;
          i.style.backgroundSize = '70% auto';
          i.style.border = '2px solid red';
          i.style.transform = 'scaleX(+1)';
        });
      }
    }
  }

  endGame() {
    clearInterval(this.timerId);

    this.finalTime = this.timer.textContent;

    this.arrResult = this.sortResult();

    this.main.removeChild(this.wrapper);

    this.userResult = document.createElement('section');
    this.userResult.classList.add('user-result');
    this.main.appendChild(this.userResult);

    let commonTime = document.createElement('p');
    commonTime.innerHTML = `<span>Congratulations!!!</span> </br> Your time: <span>${this.finalTime}</span>!`;
    this.userResult.appendChild(commonTime);

    this.createTableRecords();

    this.box = document.createElement('div');
    this.box.classList.add('buttons-container');
    this.userResult.appendChild(this.box);

    this.createEndGameBtns();
  }

  createEndGameBtns() {
    let tryAgainBtn = document.createElement('button');
    tryAgainBtn.textContent = 'Try again!';
    tryAgainBtn.style.margin = '0';
    tryAgainBtn.classList.add('start-game-btn');
    this.box.appendChild(tryAgainBtn);

    tryAgainBtn.addEventListener('click', (e) => {
      this.main.removeChild(this.userResult);
      
      this.createGameField(e);
      this.randomPlace();
      this.startTimer(); 
    });

    let newGameBtn = document.createElement('button');
    newGameBtn.textContent = 'Main menu';
    newGameBtn.style.margin = '0';
    newGameBtn.classList.add('start-game-btn');
    this.box.appendChild(newGameBtn);

    newGameBtn.addEventListener('click', () => {
      this.main.removeChild(this.userResult);
      
      this.introduction.style.display = 'block';
    });
  }

  //calculation results
  createTableRecords() {
    let tableRecords = document.createElement('table');
    tableRecords.classList.add('table-records');
    this.userResult.appendChild(tableRecords);

    let tableTitle = document.createElement('tr');
    tableRecords.appendChild(tableTitle);

    let textTitle = document.createElement('th');
    textTitle.textContent = 'Table records';

    tableTitle.appendChild(textTitle);
    
    for (let i = 0; i < 10; i++) {
      let rowTable = document.createElement('tr');
      tableRecords.appendChild(rowTable);

      let cellTable = document.createElement('td');
      
      if (this.arrResult[i]) {
        let resultInfo = this.arrResult[i].split(',');
        cellTable.textContent = `${i + 1}. ${resultInfo[0]} ${resultInfo[1]}, ${resultInfo[4]}`;
      } else {
        cellTable.textContent = `${i + 1}.`;
      }

      rowTable.appendChild(cellTable);
    }
  }

  setResult(time) {
    function getId() {
      return '_' + Math.random().toString(36).substr(2, 10);
    }
  
    const id = getId();

    localStorage[id] = [this.firstName, this.lastName, this.email, this.difficulty, time];
  }

  sortResult() {
    let arrResult = [];

    this.setResult(this.finalTime);

    for (let key in localStorage) {
      if (key.indexOf('_') !== -1) {
        let resultDifficulty = localStorage[key].split(',')[3];
        if (resultDifficulty === this.difficulty) arrResult.push( localStorage[key] );
      }
    }

    arrResult.sort((a, b) => {
      a = a.split(',')[4].split(':');
      a = a[0] + a[1];

      b = b.split(',')[4].split(':');
      b = b[0] + b[1];

      return +a - +b;
    });  

    return arrResult;
  }
}

