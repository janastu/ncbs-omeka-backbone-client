

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

	aboutView = Backbone.View.extend({
		el: "#content",
		template: _.template($("#about-page-template").html()),
		
		
		initialize: function() {
			//this.$container = $("#main");
			
		},
		render: function() {
			this.$el.html(this.template);
		}
		
	});	

	subthemeNav = Backbone.View.extend({
		el: "#content",
		template: _.template($('#sub-theme-nav-tabs').html()),
		initialize: function(options){
			this.siteMap = [
			["Identity","Space for biology", "Science in India", "Recognition", "Reflections"],
			["Institution Building", "Space & Autonomy", "Paper Trails", "Architecture"],
			["Growth", "Hiring", "Start-ups", "Collaborations", "Student Selections", "Scaling"],
			["Research", "Basic/Applied toggle", "Areas and shifts", "Processes", "Queries and tools"],
			["Education", "Building knowledge", "Mentorship"],
			["Ripple Effect", "Effects and Toll", "Interaction/Isolation"],
			["Intersections", "Gender Equality", "Hierarchy & Class", "NCBS Community", "Outside World"]];
			this.options = options || {};
			this.tags = this.options.tag.split('-');
			this.listenTo(this.collection, "add", this.render);
		},
		render: function(){
			this.model = this.collection.get(this.tags[0]);
			
			window.scrollTo(0,0);
			this.$el.html(this.template({content: this.model.toJSON(), sitemap:this.siteMap[this.tags[0]-1]}));
			this.$("#ncbs-narrative-container .nav-tabs li:nth-child(2)").first().addClass("active");
			this.$("#ncbs-narrative-container .tab-pane:nth-child(2)").first().addClass("active");
			this.mediaContainer = new storyMediaView({
				el:"#ncbs-narrative-container", 
				tag: "1-india-ps-1", 
				media: this.options.content
			});
			this.mediaContainer.render();

		}
	});

	});

	storyMediaView = Backbone.View.extend({
		events: {
			"click .audio-player-trigger": "launchAudioPlayer"
		},
		initialize: function(options) {
			this.options = options || {};
			this.spans = this.$("span");
			this.groupedMedia = _.groupBy(this.options.media, function(item){
				return item.get('mime_type');
			});
			//console.log(this.groupedMedia);
	
		},
		render: function() {
			
			//iterate to each span from dom view
			_.each(this.spans, function(span){
				//find the matching tag from the file tags to match the tag in dom view
				var mappedAudio = _.find(this.groupedMedia["audio/mpeg"], function(item){
					//console.log(span.innerHTML, item.get('tags').name, 'matched?')
					if(span.innerHTML === item.get('tags').name){
						return item;	
					}
				});
				
				//append the audio icon to dom
				if(mappedAudio){
					$(span).html('<i class="fa fa-play-circle audio-player-trigger" aria-hidden="true" data-tag="'+mappedAudio.get('tags').name+'"></i>');
				}
			}, this);

			//iterate to each span from dom view
			_.each(this.spans, function(span){
				//find the matching tag from the file tags to match the tag in dom view
				//which will be an array of items for images
				var mapped = _.map(this.groupedMedia["image/jpeg"], function(item){
					//the grouping is based on the 3rd char in tag series seperated by -
					var tagArray = item.get('tags').name.split('-');
					var domTagmatch = tagArray.splice(3, 2);
					//console.log(tagArray, span, "map dom", domTagmatch);
					if(span.innerHTML === tagArray.join('-')){
						return item;
					}
				});
				//clean up the array of unwanted values
				var cleanedMapped = _.compact(mapped);
				//sort the array by order
				var sorted = _.sortBy(cleanedMapped, function(item){
					//console.log(item.get('tags').name.split('-')[3]);
					return item.get('tags').name.split('-')[3];
				});
				//since sort goes through a string of values - a natural order sorting is required
				var nsort = sorted.sort(naturalCompare);
				// append the list of images to Dom
				if(sorted.length){
					new imgSliderView({el: span, content: nsort});
				}
				
			}, this);
			
			//iterate to each span from dom view
			_.each(this.spans, function(span){
				//find the matching tag from the file tags to match the tag in dom view
				var mappedVideo = _.find(this.groupedMedia["video/mp4"], function(item){
					//console.log(span.innerHTML, item.get('tags').name, 'matched?')
					if(span.innerHTML === item.get('tags').name){
						return item;	
					}
				});
				
				//append the audio icon to dom
				if(mappedVideo){
					//console.log(mappedVideo.toJSON());
					new VideoView({el: span, content: mappedVideo});
				}
			}, this);

			return this;

		},
		launchAudioPlayer: function(event){
			//console.log(event.target.dataset, event.currentTarget, "clicked audio icon");
			new AudioView({el: "#audio-player-container", tags: event.target.dataset, content: this.groupedMedia["audio/mpeg"]});
		}
	});



function naturalCompare(a, b) {
    var ax = [], bx = [];
    //console.log(a, b);
    a.get('tags').name.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
    b.get('tags').name.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
    
    while(ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if(nn) return nn;
    }

    return ax.length - bx.length;
}


})();



