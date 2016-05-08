(function($)
{
	$.Redactor.prototype.contrast = function() {
		return {
			init: function() {
        var that = this;
				$.extend(this.opts.shortcuts, {
						'f5': {func:'contrast.toggle',params:[]}
				});
			},
			toggle: function() {
					console.log('contrast toggle');
					 this.core.editor().toggleClass('redactor-editor_contrast');
			}
		};
	};
})(jQuery);
