CONZQ.Views.Post = Backbone.View.extend({
	initialize: function (options) {
		this.user = options.user;
		this.post = options.post;
				
		this.$el.attr("data-id", this.post.id);
	},
	
	tagName: "li",
	
	id: "post",
	
	className: "group",
	
	template: JST["posts/post"],
	
	events: {
		"click #view-comments": "expand",
		"submit form#comment-form": "createComment",
		"click .x": "closePost",
		"dblclick section.post-left": "showDelete",
		"click button#delete-post": "deletePost",
		"click button#cancel-post": "cancelDelete"
	},
	
	expand: function () {
		this.$el.addClass("expand");
		
		this.commentsView = new CONZQ.Views.PostComments({
			post: this.post,
			comments: this.post.comments()
		});
		
		this.$el.find(".comments-right").html(this.commentsView.render().$el);
	},
	
	createComment: function () {
		event.preventDefault();
		
		var $formData = $(event.target);
		var commentParams = $formData.serializeJSON();
		
		var comments = this.post.comments();
		var view = this;
		
		view.post.save(commentParams, {
			success: function (comment) {
				comments.add(comment);
				view.$el.find("textarea").val("");
			}
		});
	},
	
	closePost: function () {
		this.$el.removeClass("expand");
	},
	
	showDelete: function () {
		this.$el.find("section.post-left").toggleClass("delete");
	},
	
	cancelDelete: function () {
		this.$el.find("section.post-left").removeClass("delete");
	},
	
	deletePost: function () {
		this.post.destroy();
		this.remove();
	},
	
	render: function () {
		var isThisUser;
		if (CONZQ.currentUser) isThisUser = CONZQ.currentUser.id === this.user.id;
		
		var content = this.template({
			post: this.post,
			signedIn: !!CONZQ.currentUser,
			isThisUser: isThisUser
		});
		
		this.$el.html(content);
		return this;
	},
	
	remove: function () {
		if (this.commentsView) this.commentsView.remove();
		return Backbone.View.prototype.remove.apply(this);
	}
});