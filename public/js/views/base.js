function BaseView(){
	this.$btnLogin = $('.btn-login');
	this.$btnLogout = $('.btn-logout');
	this.token = null;
	this.key = null;
	// events
	this.$btnLogin.on('click', $.proxy(this.getAuthentication, this));
	this.$btnLogout.on('click', $.proxy(this.logoutTrello, this));

	// construct
	this.updateAuthentication();
};

BaseView.prototype = {
	
	updateAuthentication: function() {
		console.log(this.isAuthorized());
		if ( this.isAuthorized() ) {
			console.log('voce esta logado');
		}
	},

	getAuthentication: function( event ) {
		event.preventDefault();
		
		if ( !this.isAuthorized() ) {			
			Trello.authorize({
		        type: 'popup',
		        name: "Trello daily cards",
				scope: {
					read: true,
					write: false 
				},
				success: this.authenticationSuccess
		    });
		}
	},

	authenticationSuccess: function() {
		this.token = Trello.token();
		this.key = Trello.key();

		console.log('this.token', this.token);
		console.log('this.key', this.key);

		$.get('/authentication/', {token: this.token, key: this.key}, function(data){
			console.log(data);
			if ( data.url ) {
				window.location = data.url;
			}
		});
	},

	logoutTrello: function( event ) {
		event.preventDefault();

		$.get('/logout/', function(data){
			console.log(data);
			if ( data.url ) {
				Trello.deauthorize();
				window.location = data.url;
			}
		});
	},

	isAuthorized: function() {
		return Trello.authorized();
	}
};

$(function(){
	var base = new BaseView();	
});