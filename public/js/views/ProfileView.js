function ProfileView() {
	this.cards = $('#template-cards-all').html();
	this.showCards = $('.show-cards');
	this.loading = $('.loading-page');

	this.onLoad();
};

ProfileView.prototype = {
	onLoad: function() {
		this.getCardsAll();
	},

	getCardsAll: function() {
		var that = this;

		$.get(window.__CARDS_ME__, function(data){
			console.log(data);
			var html = _.template( that.cards, { objects: data });

			that.disableLoagind();
			that.showCards.empty().append(html);
		});
	},

	disableLoagind: function() {
		this.loading.fadeOut();
	},

	enableLoagind: function() {
		this.loading.fadeIn();
	}
};

$(function(){
	var profile = new ProfileView();
});