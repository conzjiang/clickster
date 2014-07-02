CONZQ.Views.UserWall = Backbone.View.extend({
	initialize: function (options) {
		this.user = options.user;
		this.posts = this.user.posts();
		this.postViews = [];
		
		this.listenTo(this.posts, "sync add remove", this.render);
	},
	
	template: JST["users/wall"],
	
	render: function () {
		var content = this.template({
			
			user: this.user,
			userShowlist: this.user.showlist(),
			posts: this.posts.length > 0,
			isThisUser: CONZQ.currentUser.id === this.user.id
		
		});
		
		this.$el.html(content);
		
		var $postsUl = this.$el.find("ul.posts");
		var postViews = this.postViews;
		var that = this;
		
		that.posts.each(function (post) {
			var postView = new CONZQ.Views.UserPost({
				
				user: that.user,
				post: post,
				postsCollection: that.posts
				
			});
			
			$postsUl.append(postView.render().$el);
			postViews.push(postView);
		});
		
		return this;
	},
	
	remove: function () {
		this.postViews.each(function (view) { view.remove(); });
		return Backbone.View.prototype.remove.apply(this);
	}
});