CONZQ.Routers.AppRouter = Backbone.Router.extend({
  initialize: function (options) {
		this.$rootEl = options.$rootEl;
		this.$mainEl = options.$mainEl;
		
		var searchbarView = new CONZQ.Views.Searchbar({
			$sidebar: options.$sidebar
		});
		this.$rootEl.html(searchbarView.render().$el);
		this.$rootEl.append(this.$mainEl);
  },

  routes: {
    "tv/:id": "tvShow"
  },
	
	displaySearch: function (searchShowView) {
		this._swapViews(searchShowView);
	},

  tvShow: function (id) {
    var tvShowView = new CONZQ.Views.TvShowView({
      model: CONZQ.all_shows.getOrFetch(id)
    });
		
    this._swapViews(tvShowView);
  },	

  _swapViews: function (view) {
    if (this.currentView) {
      this.currentView.remove();
    }

    this.currentView = view;
    this.$mainEl.html(view.render().$el);
  }
});