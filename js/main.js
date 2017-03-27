$(function() {

  $("#start-btn").on('click', game.start);

  $("#hit-btn").on('click' , player.hit);

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
    game.setup();
    game.dealCards();
  },
  dealCards: function() {

    var isPlayerCard = true; // when true, card dealt goes to player, false goes to dealer
    for (var i = 0; i < 4; i++) {
      // get random card
      var rand = Math.floor(Math.random() * deck.cards.length);
      var card = deck.cards[rand];

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
  }
}

var dealer = {
  hand: [],
  calcHand: function() {
    for (var i = 0; i < this.hand.length; i++) {

    }
  }
}

var player = {
  hand: [],
  calcHand: function() {
    var total = 0;
    for (var i = 0; i < this.hand.length; i++) {
      //console.log(this.hand[i].getPointValue());
      total += this.hand[i].getPointValue();
    }
    console.log(total);
    return total;
  },
  hit: function() {
    var rand = Math.floor(Math.random() * deck.cards.length);
    var card = deck.cards[rand];

    player.hand.push(card);

    UI.displayCard("#player-cards", card.getImg()); // display card to the screen

    player.calcHand();
  }
}


/*************************
****** UI Modifiers ******
*************************/
var UI = {
  // changeShape: function($elem) {
  //   $elem.attr('class', App.classNames[App.clicks]);
  // }

  displayCard: function(elemId, img) {
    $(elemId).append($('<img>').addClass('card').attr('src', img));
  }
}

/*************************
***** Event Handlers *****
*************************/
var EventHandlers = {



}
