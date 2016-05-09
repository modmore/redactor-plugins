(function($)
{
	$.Redactor.prototype.zoom = function() {
		return {
			init: function() {
				if(this.opts.zoomLevel === undefined) this.opts.zoomLevel = 0;
				$.extend(this.opts.shortcuts, {
						'ctrl+=': {func:'zoom.zoom',params:[1]},
						'ctrl+-': {func:'zoom.zoom',params:[-1]}
				});
			},
			zoom: function(amnt) {
					this.opts.zoomLevel += amnt;
					this.opts.zoomLevel = Math.min(3,this.opts.zoomLevel);
					this.opts.zoomLevel = Math.max(0,this.opts.zoomLevel);
					this.$editor.attr('data-zoom',this.opts.zoomLevel);
			}
		};
	};
})(jQuery);
