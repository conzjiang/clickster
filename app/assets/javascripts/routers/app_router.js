CONZQ.Routers.AppRouter = Backbone.Router.extend({
  initialize: function (options) {
		this.$rootEl = options.$rootEl;
		this.$sidebar = options.$sidebar;
		this.$mainEl = options.$mainEl;
		
		this.tvShowStatus();
		
		var searchbarView = new CONZQ.Views.Searchbar({
			$sidebar: options.$sidebar
		});
		
		this.$rootEl.prepend(searchbarView.render().$el);
  },

  routes: {
		"": "index",
		"users/:id": "userShow"
  },
	
	index: function () {
		var frontPageShows = new CONZQ.Subsets.IndexShows([], {
			parentCollection: CONZQ.allShows
		});
		
		var that = this;
		frontPageShows.fetch({
			success: function () {
				var indexView = new CONZQ.Views.IndexView({
					currentlyShows: frontPageShows
				});
				
				that._swapViews(indexView);
			}
		});
	},	
	
	userShow: function (id) {
		var userShowView = new CONZQ.Views.UserShow({
			user: CONZQ.users.getOrFetch(id)
		});
	
		this._swapViews(userShowView);
	},
	
	tvShowStatus: function () {
		var $statusContainer = $("div#tv-show-page-statuses");
		
		if ($statusContainer.length > 0) {
			var tvId = $statusContainer.attr("data-id");
		
			this.showStatusView = new CONZQ.Views.StatusesView({
				tv: CONZQ.allShows.getOrFetch(tvId)
			});
		
			$statusContainer.html(this.showStatusView.render().$el);
		}
	},

  _swapViews: function (view) {
    if (this.showStatusView) this.showStatusView.remove();
		if (this.currentView) this.currentView.remove();
		
    this.currentView = view;
    this.$mainEl.html(view.render().$el);
  }
});