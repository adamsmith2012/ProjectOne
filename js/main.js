$(function() {

  game.setup();

  $("#deal-btn").on('click', function() {

    // get random card
    var rand = Math.floor(Math.random() * deck.cards.length);
    var card = deck.cards[rand].getImg();

    // TODO: add card value and suit to img
    $('#player-cards').append($('<img>').addClass('card').attr('src', card));
  })

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
  },
  shuffle: function() {
    // TODO:
  }
}

var game = {
  setup: function() {
    deck.create();
  }
}

var dealer = {
  // TODO:
}

var player = {
  // TODO:
}


/*************************
****** UI Modifiers ******
*************************/
var UI = {
  // changeShape: function($elem) {
  //   $elem.attr('class', App.classNames[App.clicks]);
  // }
}

/*************************
***** Event Handlers *****
*************************/
var EventHandlers = {
  // onClickChangeShape: function() {
  //   UI.changeShape($(this));
  //   App.incrementClicks();
  //   if (App.clicks == App.classNames.length) {
  //     App.clicks = 0;
  //   }
  // }



}
