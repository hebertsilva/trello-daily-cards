function ProfileView() {
	this.boards = $('#template-boards-all').html();
	this.cards = $('#template-cards-all').html();
	this.showBoards = $('.show-boards');
	this.showCards = $('.show-cards');
	this.loading = $('.loading-page');

	this.onLoad();
	
	// actions
	$('body').on('click', '[data-board]', $.proxy(this.toggleCards, this));
};

ProfileView.prototype = {
	onLoad: function() {
		this.getBoardsAll();
	},

	getBoardsAll: function() {
		var that = this;

		$.get(window.__CARDS_ME__, function(data){
			var html = _.template( that.boards, { objects: data });

			that.disableLoagind();
			that.getCardAll(data);
			that.showBoards.empty().append(html);
		});
	},

	getCardAll: function( data ) {
		console.log(data);

		var that = this;
		var html = _.template( this.cards, { objects: data });
		this.showCards.empty().append(html);
	},

	disableLoagind: function() {
		this.loading.fadeOut();
	},

	enableLoagind: function() {
		this.loading.fadeIn();
	},

	toggleCards: function( event ) {
		var target = $(event.currentTarget);
		var idBoard = target.data('board');
		var board = $('.list-boards').find('.board').filter('[data-card="'+idBoard+'"]');

		console.log(board);

		if ( board.length ) {
			var visible = $('[data-card]').not(board).filter(':visible');

			if ( visible.length ) {
                visibles.stop().fadeOut(function() {
                    board.stop().fadeIn();
                });
            }
		}
	}
};

$(function(){
	var profile = new ProfileView();
});