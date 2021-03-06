$(function() {

  game.setup();

  $('#start-btn').on('click', game.setup);

  $('#deal-btn').on('click', game.start);
  $('#hit-btn').on('click' , player.hit);
  $('#stand-btn').on('click' , player.stand);

  $('.chip').on('click', player.increaseBet);

})


/*************************
**** Helper Functions ****
*************************/

// From stack overflow
// http://stackoverflow.com/questions/907279/jquery-animate-moving-dom-element-to-new-parent
var moveAnimate = function(element, newParent){
    // Allow passing in either a jQuery object or selector
    element = $(element);
    newParent= $(newParent);

    var oldOffset = element.offset();
    element.appendTo(newParent);
    var newOffset = element.offset();

    var temp = element.clone().appendTo('body');
    temp.css({
        'position': 'absolute',
        'left': oldOffset.left,
        'top': oldOffset.top - 30
    });
    element.hide();
    temp.animate({'top': newOffset.top - 30, 'left': newOffset.left + 30}, 'slow', function(){
       element.show();
       temp.remove();
    });
}

// calculates the value of a given hand and returns a number
// params: hand - an array of card Objects
var calculateHand = function(hand) {

  var tempHand = [];
  // put point values into new array to be counted
  for (var i = 0; i < hand.length; i++) {
    tempHand.push(hand[i].getPointValue());
  }

  var finishedCalc = true;
  var busted = false;

  do {
    var total = 0;
    var isAce = false;
    finishedCalc = true;

    for (var i = 0; i < tempHand.length; i++) {
      if (tempHand[i] == 11) {
        if (busted) {
          tempHand[i] = 1;
          isAce = false;
          busted = false;
        } else {
          isAce = true;
        }
      }

      total += tempHand[i];
    }

    if (total > 21) {
      busted = true;
    }
    if (isAce && busted) {
      finishedCalc = false; // if there is an ace worth 11 left and the player is over 21, redo the calculation
    }

  }  while (!finishedCalc);

  return total;
}

/*************************
****** Game Objects ******
*************************/

var card = function(initSuit, initValue) {
  var suit = initSuit;
  var value = initValue;
  var img = "images/cards/" + value + "_of_" + suit + ".png";
  var backImg = "images/cards/blue_back.jpg";

  this.getValue = function() {
    return value;
  }

  this.getImg = function() {
    return img;
  }

  this.getBackImg = function() {
    return backImg;
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
  this.value = value;
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
  cardsDealt: false,
  setup: function() {
    player.reset();
    deck.create();

    $('#deal-btn').removeAttr('disabled');
    $('#hit-btn').attr('disabled', 'disabled');
    $('#stand-btn').attr('disabled', 'disabled');

    game.start();
  },
  start: function() {

    $('#cards-col .card').remove();
    player.hand = [];
    dealer.hand = [];
    player.busted = false;
    dealer.busted = false;

    if (deck.cards.length < 15) {
      deck.create();
    }

    if (player.chips == 0 && player.bet == 0) {
      UI.displayMessage("Select \'New Game\'");
    }
    else if (player.bet == 0) {
      UI.displayMessage("Please make a bet");
    } else {
      game.dealCards();
      if (game.cardsDealt) { // wont run if player got blackjack
        UI.displayMessage('Hit / Stand');
        UI.toggleUserAction();
      }
    }

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

      setTimeout(UI.displayAndDealCard.bind(null, elemId, card), 500 * i); // display card to the screen

    }

    game.cardsDealt = true;

    if (player.calcHand() == 21) {
      game.endRound();
    }
  },
  endRound: function() {

    var result = "";
    if(player.busted) {
      result = "loss";
    } else if (dealer.busted || player.calcHand() > dealer.calcHand()) {
      result = "win";
    } else if (player.calcHand() < dealer.calcHand()) {
      result = "loss";
    } else if (player.calcHand() == dealer.calcHand()){
      result = "push";
    }

    var message = ""; // message that will be displayed after round

    if(result === "win") {
      message = "You win!";

      player.chips += player.bet * 2;
      player.bet = 0;

      UI.updateChipsTotal();
      UI.updateBetTotal();
      UI.setPlayerWins(++player.wins);
    } else if (result === "loss"){
      message = "You lose!";

      player.bet = 0;

      UI.updateChipsTotal();
      UI.updateBetTotal();
      UI.setPlayerLosses(++player.losses);
    } else {
      message = "Push!";

      player.chips += player.bet;
      player.bet = 0;

      UI.updateChipsTotal();
      UI.updateBetTotal();
      UI.setPlayerPushes(++player.pushes);
    }

    game.cardsDealt = false;
    UI.displayMessage(message); // display message

  }
}

var dealer = {
  hand: [],
  busted: false,
  calcHand: function() {
    return calculateHand(this.hand);
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

    game.endRound();
  },
  hit: function() {
    var rand = Math.floor(Math.random() * deck.cards.length);
    var card = deck.cards.splice(rand, 1)[0];

    dealer.hand.push(card);

    UI.displayAndDealCard("#dealer-cards", card); // display card to the screen
  }
}

var player = {
  hand: [],
  chips: 500,
  bet: 0,
  wins: 0,
  losses: 0,
  pushes: 0,
  busted: false,
  reset: function() {
    player.chips = 500;
    player.bet = 0;
    player.wins = 0;
    player.losses = 0;
    player.pushes = 0;

    UI.setPlayerWins(0);
    UI.setPlayerLosses(0);
    UI.setPlayerPushes(0);
    UI.updateChipsTotal();
    UI.updateBetTotal();
  },
  calcHand: function() {
    return calculateHand(this.hand);
  },
  increaseBet: function() {
    if (!game.cardsDealt) {
      var bet = parseInt($(this).text())

      if (player.chips - bet >= 0) {
        player.bet += bet;
        player.chips -= bet;
      }

      UI.displayMessage("Press \'Deal\'");
      UI.updateChipsTotal();
      UI.updateBetTotal();
    }
  },
  hit: function() {

    player.busted = false;

    var rand = Math.floor(Math.random() * deck.cards.length);
    var card = deck.cards.splice(rand, 1)[0];

    player.hand.push(card);

    UI.displayAndDealCard("#player-cards", card); // display card to the screen

    var total = player.calcHand();

    if (total > 21) {
      player.bust();
    }
  },
  stand: function() {
    dealer.doTurn();
    UI.toggleUserAction();
  },
  bust: function() {
    player.busted = true;
    game.endRound();
    UI.toggleUserAction();
  }
}


/*************************
****** UI Modifiers ******
*************************/
var UI = {
  toggleUserAction: function() {
    var $btn = $('.user-action');
    for (var i = 0; i < $btn.length; i++) {
      if ($($btn[i]).attr('disabled')) {
        $($btn[i]).removeAttr('disabled');
      } else {
        $($btn[i]).attr('disabled', 'disabled');
      }
    }
  },
  displayAndDealCard: function(elemId, card) { // moves card from deck to elemId
    var $card = $('<img>').addClass('card').attr('src', card.getBackImg());

    $('#deck').append($card);

    moveAnimate($card, $(elemId));

    $card.attr('src', card.getImg());
  },
  displayCard: function(elemId, img) { // displays card at elemId
    var $card = $('<img>').addClass('card').attr('src', img);

    $(elemId).append($card);
  },
  setPlayerWins: function(val) {
    $('#player-wins span').text(val);
  },
  setPlayerLosses: function(val) {
    $('#player-losses span').text(val);
  },
  setPlayerPushes: function(val) {
    $('#player-pushes span').text(val);
  },
  displayMessage: function(message) {
    $('#dealer-cards').append($('#message-pane').text(message));
  },
  updateChipsTotal: function() {
    $('#chip-count span').text(player.chips);
  },
  updateBetTotal: function() {
    $('#player-bet span').text(player.bet);
  }
}
