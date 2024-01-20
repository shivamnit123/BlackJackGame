let Blackjack = {
  'you': { 'spanscore': '#box-1-result', 'div': '.box-1', 'score': 0 },
  'dealer': { 'spanscore': '#box-2-result', 'div': '.box-2', 'score': 0 },
  'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
  'cardMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11] },
  'wins': 0,
  'loss': 0,
  'draws': 0,
  'forStand': false,
  'Turnover': false,
};
const You = Blackjack['you'];
const Dealer = Blackjack['dealer'];

const sound = new Audio('./sounds/swish.m4a');
const winSound = new Audio('./sounds/cash.mp3');
const lossSound = new Audio('./sounds/aww.mp3');
const playSound = new Audio('./sounds/game-bonus-144751.mp3');
document.querySelector('.btn-1').addEventListener('click', Hitbutton);
document.querySelector('.btn-2').addEventListener('click', DealerLogic);
document.querySelector('.btn-3').addEventListener('click', DealButton);

function Hitbutton() {
  if (Blackjack['forStand'] === false) {
    let card = randomCard();
    console.log(card);
    showCard(card, You);
    updateScore(card, You);
    console.log(You['score']);
    toShowScore(You);
  }
}
function randomCard() {
  let random = Math.floor(Math.random() * 13);
  return Blackjack['cards'][random];
}
function showCard(card, activePlayer) {
  if (activePlayer['score'] <= 21) {
    var createImage = document.createElement('img');
    createImage.src = `assets/${card}.png`;
    document.querySelector(activePlayer['div']).append(createImage);
    sound.play();
  }
}

function DealButton() {
  // ShowResult(CheckWinner());
  if (Blackjack['Turnover'] === true) {
    Blackjack['forStand'] = false;
    let Box1HitImage = document.querySelector('.box-1').querySelectorAll('img');
    let Box2DealImage = document.querySelector('.box-2').querySelectorAll('img');
    for (i = 0; i < Box1HitImage.length; i++) {
      Box1HitImage[i].remove();
    }
    for (i = 0; i < Box2DealImage.length; i++) {
      Box2DealImage[i].remove();
    }

    You['score'] = 0;
    Dealer['score'] = 0;
    document.querySelector('#result-Message').textContent = 'Lets Play!';
    document.querySelector('#result-Message').style.color = '#000';
    document.querySelector('#box-1-result').textContent = 0;
    document.querySelector('#box-2-result').textContent = 0;
    document.querySelector('#box-1-result').style.color = '#ffffff';
    document.querySelector('#box-2-result').style.color = '#ffffff';
    Blackjack['Turnover'] === true;
    playSound.play();
  }

}

function updateScore(card, activePlayer) {
  if (card === 'A') {
    if (activePlayer['score'] += Blackjack['cardMap'][card][1] <= 21) {
      activePlayer['score'] += Blackjack['cardMap'][card][1];
    } else {
      activePlayer['score'] += Blackjack['cardMap'][card][0];
    }
  } else {
    activePlayer['score'] += Blackjack['cardMap'][card];
  }
}

function toShowScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['spanscore']).textContent = 'BUST!';
    document.querySelector(activePlayer['spanscore']).style.color = 'red';
  } else {
    document.querySelector(activePlayer['spanscore']).textContent = activePlayer['score'];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function DealerLogic() {
  Blackjack['forStand'] = true;
  while (Dealer['score'] < 16 && Blackjack['forStand'] === true) {
    let card = randomCard();
    showCard(card, Dealer);
    updateScore(card, Dealer);
    toShowScore(Dealer);
    await sleep(1000);
  }

  if (Dealer['score'] > 15) {
    Blackjack['Turnover'] = true;
    let winner = CheckWinner();
    ShowResult(winner);
  }

}

function CheckWinner() {
  let winner;
  // if your score is higher then dealer or dealer bust but u are not-----------------
  if (You['score'] <= 21) {
    // if your score is greater than dealer--------------
    if (You['score'] > Dealer['score'] || Dealer['score'] > 21) {
      console.log('you Won');
      Blackjack['wins']++;
      winner = You;
    } else if (You['score'] < Dealer['score']) {
      console.log('you Lost');
      Blackjack['loss']++;
      winner = Dealer;
    }
    else if (You['score'] === Dealer['score']) {
      console.log('Match Draw');
      Blackjack['draws']++;
    }
  }
  // when user bust but dealer not-------------
  else if (You['score'] > 21 && Dealer['score'] <= 21) {
    console.log('You Lost');
    Blackjack['loss']++;
    winner = Dealer;
  }  // you and dealer both are bust-----
  else if (You['score'] > 21 && Dealer['score'] > 21) {
    console.log('Match Draw');
    Blackjack['draws']++;
  }
  return winner;
}
function ShowResult(winner) {
  if (Blackjack['Turnover'] === true) {
    let message, messageColor;
    if (winner === You) {
      document.querySelector('#Wins').textContent = Blackjack['wins'];
      message = 'You Win!';
      messageColor = 'green'
      winSound.play();
    } else if (winner === Dealer) {
      document.querySelector('#Losses').textContent = Blackjack['loss'];
      message = 'You Lost!';
      messageColor = 'red'
      lossSound.play();
    } else {
      document.querySelector('#Draws').textContent = Blackjack['draws'];
      message = 'Match Draw!';
    }
    document.querySelector('#result-Message').textContent = message;
    document.querySelector('#result-Message').style.color = messageColor;
  }
}
