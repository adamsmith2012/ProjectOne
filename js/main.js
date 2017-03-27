$(function() {

  $("#start-btn").on('click', game.start);

  $("#hit-btn").on('click' , player.hit);
  $("#stand-btn").on('click' , player.stand);

})


/*************************
**** Helper Functions ****
*************************/

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

/*************************
****** Game Objects ******
*************************/

var card = function(initSuit, initValue) {
  var suit = initSuit;
  var value = initValue;
  var img = "images/cards/" + value + "_of_" + suit + ".png";

  this.getValue = function() {
    return value;
  }

  this.getImg = function() {
    return img;
  }

  this.display = function() {
    console.log(value + " of " + suit);
  }

  this.getPointValue = function() {
    switch (value) {
      case "ace":
        return 11;
        break;
      case "jack":
      case "queen":
      case "king":
        return 10;
        break;
      default:
        return parseInt(value);
    }
  }

  this.hide = function() {
    img = "images/cards/blue_back.jpg";
  }

  this.show = function() {
    img = "images/cards/" + value + "_of_" + suit + ".png";
  }
}

var chip = function(value) {
  // TODO:
}

var deck = {
  cards: [],
  create: function() {
    var suits = ["hearts", "clubs", "diamonds", "spades"];
    this.cards = [];

    var suitCounter;

    for (var i = 1; i <= 13; i++) {

      var value = i;

      switch (value) {
        case 1: // Ace
          value = 'ace';
          break;
        case 11: // Jack
          value = 'jack';
          break;
        case 12: // Queen
          value = 'queen';
          break;
        case 13: // King
          value = 'king';
          break;
      }

      for (var j = 0; j < suits.length; j++) {
        this.cards.push(new card(suits[j], value));
      }
    }
  },
  display: function() {
    for (var i = 0; i < this.cards.length; i++) {
      this.cards[i].display();
    }
  }
}

var game = {
  setup: function() {
    deck.create();
  },
  start: function() {

    $('#cards-col .card').remove();
    player.hand = [];
    dealer.hand = [];

    if (deck.cards.length < 15) {
      game.setup();
    }

    game.dealCards();
  },
  dealCards: function() {

    var isPlayerCard = true; // when true, card dealt goes to player, false goes to dealer
    for (var i = 0; i < 4; i++) {
      // get random card

      var rand = Math.floor(Math.random() * deck.cards.length);
      var card = deck.cards.splice(rand, 1)[0];

      var elemId = '';

      if (isPlayerCard) {
        player.hand.push(card);
        elemId = "#player-cards";
        isPlayerCard = false;
      } else {
        if (i == 3) { // if 2nd dealer card make it hidden
          card.hide();
        }
        dealer.hand.push(card);
        elemId = "#dealer-cards"
        isPlayerCard = true;
      }

      UI.displayCard(elemId, card.getImg()); // display card to the screen
    }

    player.calcHand();
  },
  endRound: function() {
    var playerWin;
    if(player.busted) {
      playerWin = false;
    } else if (dealer.busted || player.calcHand() > dealer.calcHand()) {
      playerWin = true;
    } else {
      playerWin = false;
    }

    if(playerWin) {
      UI.setPlayerWins(++player.wins);
    } else {
      UI.setPlayerLosses(++player.losses);
    }

    sleep(1000); // wait 1 second

    game.start();
  }
}

var dealer = {
  hand: [],
  busted: false,
  calcHand: function() {
    var total = 0;

    for (var i = 0; i < this.hand.length; i++) {
      //console.log(this.hand[i].getPointValue());
      total += this.hand[i].getPointValue();
    }
    return total;
  },
  doTurn: function() {

    $('#dealer-cards .card').remove();
    for (var i = 0; i < dealer.hand.length; i++) {
      var card = dealer.hand[i];
      card.show();
      UI.displayCard("#dealer-cards", card.getImg()); // display card to the screen
    }

    dealer.busted = false;

    var total = dealer.calcHand();

    while(total < 17) { // keep hitting while total is under 17
      dealer.hit();

      total = dealer.calcHand();
    }

    if (total > 21) {
      dealer.busted = true;
    }

    setTimeout(game.endRound, 2000);
  },
  hit: function() {
    var rand = Math.floor(Math.random() * deck.cards.length);
    var card = deck.cards.splice(rand, 1)[0];

    dealer.hand.push(card);

    UI.displayCard("#dealer-cards", card.getImg()); // display card to the screen
  }
}

var player = {
  hand: [],
  wins: 0,
  losses: 0,
  busted: false,
  calcHand: function() {
    var total = 0;
    for (var i = 0; i < this.hand.length; i++) {
      total += this.hand[i].getPointValue();
    }
    return total;
  },
  hit: function() {

    player.busted = false;

    var rand = Math.floor(Math.random() * deck.cards.length);
    var card = deck.cards.splice(rand, 1)[0];

    player.hand.push(card);

    UI.displayCard("#player-cards", card.getImg()); // display card to the screen

    var total = player.calcHand();

    if (total > 21) {
      setTimeout(player.bust, 1000);
    }
  },
  stand: function() {
    console.log("player: stand on " + player.calcHand());
    dealer.doTurn();
  },
  bust: function() {
    console.log("player: bust on " + player.calcHand());
    player.busted = true;
    game.endRound();
  }
}


/*************************
****** UI Modifiers ******
*************************/
var UI = {
  displayCard: function(elemId, img) {
    $(elemId).append($('<img>').addClass('card').attr('src', img));
  },
  setPlayerWins: function(val) {
    $('#player-wins').text("Wins: " + val);
  },
  setPlayerLosses: function(val) {
    $('#player-losses').text("Losses: " + val);
  }
}

/*************************
***** Event Handlers *****
*************************/
var EventHandlers = {



}
