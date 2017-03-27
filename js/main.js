$(function() {

  $("#start-btn").on('click', game.start);

  $("#hit-btn").on('click' , player.hit);
  $("#stand-btn").on('click' , player.stand);

})

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

    $('.card').remove();
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

      var elemId = ''
      var img = card.getImg();

      if (isPlayerCard) {
        player.hand.push(card);
        elemId = "#player-cards";
        isPlayerCard = false;
      } else {
        dealer.hand.push(card);
        elemId = "#dealer-cards"
        isPlayerCard = true;
      }

      UI.displayCard(elemId, img); // display card to the screen
    }

    player.calcHand();
  }
}

var dealer = {
  hand: [],
  calcHand: function() {
    for (var i = 0; i < this.hand.length; i++) {
      var total = 0;
      for (var i = 0; i < this.hand.length; i++) {
        //console.log(this.hand[i].getPointValue());
        total += this.hand[i].getPointValue();
      }
      return total;
    }
  },
  doTurn: function() {
    var done = false;

    while(!done) {
      dealer.hit();

      var total = dealer.calcHand();

      if (total > 21) {
        dealer.bust();
        done = true;
      } else if (total > 16) {
        dealer.stand();
        done = true;
      }
    }
  },
  hit: function() {
    var rand = Math.floor(Math.random() * deck.cards.length);
    var card = deck.cards.splice(rand, 1)[0];

    dealer.hand.push(card);

    UI.displayCard("#dealer-cards", card.getImg()); // display card to the screen
  },
  stand: function() {
    console.log("dealer: stand on " + dealer.calcHand());
  },
  bust: function() {
    console.log("dealer: bust on " + dealer.calcHand());
    game.start();
  }
}

var player = {
  hand: [],
  calcHand: function() {
    var total = 0;
    for (var i = 0; i < this.hand.length; i++) {
      total += this.hand[i].getPointValue();
    }
    return total;
  },
  hit: function() {
    var rand = Math.floor(Math.random() * deck.cards.length);
    var card = deck.cards.splice(rand, 1)[0];

    player.hand.push(card);

    UI.displayCard("#player-cards", card.getImg()); // display card to the screen

    var total = player.calcHand();

    if (total > 21) {
      player.bust();
    }
  },
  stand: function() {
    console.log("player: stand on " + player.calcHand());
    dealer.doTurn();
  },
  bust: function() {
    console.log("player: bust on " + player.calcHand());
    game.start();
  }
}


/*************************
****** UI Modifiers ******
*************************/
var UI = {
  displayCard: function(elemId, img) {
    $(elemId).append($('<img>').addClass('card').attr('src', img));
  }
}

/*************************
***** Event Handlers *****
*************************/
var EventHandlers = {



}
