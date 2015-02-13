if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.wym = function()
	{
		return {
			init: function()
			{
                this.$editor.addClass('redactor-editor_wym');
			}
		};
	};
})(jQuery);