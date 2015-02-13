if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.contrast = function()
	{
		return {
			init: function() {
                $.extend(this.opts.shortcuts, {
                    'f5': {func:'contrast.toggle',params:[]}
                });
			},
            toggle: function() {
                 this.$editor.toggleClass('redactor-editor_contrast');
            }
		};
	};
})(jQuery);