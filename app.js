

(function(){

require(['libs/text!templates/header.html', 'libs/text!templates/home.html', 'libs/text!templates/footer.html'], function (headerTpl, homeTpl, footerTpl) {
	HeaderView = Backbone.View.extend({
		el: "#header",
		templateFileName: "header.html",
		template: headerTpl,

		initialize: function() {
			// $.get(this.templateFileName, function(data){console.log(data);this.template=data});		
		},
		render: function() {
			$(this.el).html(_.template(this.template));
			this.scrollEffect();
		},
		scrollEffect: function(){
			window.addEventListener('scroll', function(e){
		    var distanceY = window.pageYOffset || document.documentElement.scrollTop,
		        shrinkOn = 25,
		        header = document.querySelector("header");
		    if (distanceY > shrinkOn) {
		        classie.add(header,"smaller");
		        $("#ncbs-home-text-collapsible").hide();
		    } else {
		    	$("#ncbs-home-text-collapsible").show();
		        if (classie.has(header,"smaller")) {
		            classie.remove(header,"smaller");
		        }
		    }
		});
		}

	});

	FooterView = Backbone.View.extend({
		el: "#footer",
		template: footerTpl,
		render: function() {
			this.$el.html(_.template(this.template));
		}
	})
	HomeView = Backbone.View.extend({
		el: "#content",
		template: homeTpl,
		
		
		initialize: function() {
			this.$container = $("#main");
			
		},
		render: function() {

			this.$container.append(this.$el.html(_.template(this.template)));
		}
		
	});	


	subthemeNav = Backbone.View.extend({
		el: "#content",
		template: _.template($('#sub-theme-nav-tabs').html()),
		initialize: function(options){
			this.siteMap = [
			["Identity","Space for biology", "Reflections", "Science in India", "Recognition"],
["Institution Building", "Space & autonomy", "Paper trails", "Architecture"],
["Growth", "Hiring", "Student selection", "Start-up days", "Collaborations", "Scaling"],
["Research", "Basic/applied toggle", "Queries and tools", "Processes", "Areas and shifts"],
["Education", "Building knowledge", "Mentorship"],
["Ripple Effect", "Effects and Toll", "Isolation/interaction"],
["Intersections", "Gender equality", "Hierarchy & class", "NCBS community", "Outside world"]];
			this.options = options || {};
			this.tags = this.options.tag.split('-');
			this.listenTo(this.collection, "add", this.render);
		},
		render: function(){
			this.model = this.collection.get(this.tags[0]);
			
			window.scrollTo(0,0);
			this.$el.html(this.template({content: this.model.toJSON(), sitemap:this.siteMap[this.tags[0]-1]}));
			this.$("#ncbs-narrative-container .nav-tabs li").first().addClass("active");
			this.$("#ncbs-narrative-container .tab-pane").first().addClass("active");
			this.mediaContainer = new storyMediaView({el:"#ncbs-narrative-container", tag: "1-india-ps-1"});
			this.mediaContainer.render();
		}
	});

	});

	storyMediaView = Backbone.View.extend({
		initialize: function(options) {
			this.options = options || {};
			this.spans = this.$("span");
			console.log(this.spans, this.options);
		},
		render: function() {
			this.slide1 = new imgSliderView({el: this.spans[1], content: dummy});
			//this.slide1.render();
			return this;
		}
	});

})();



