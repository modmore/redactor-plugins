(function($)
{
	$.Redactor.prototype.wym = function() {
		return {
			init: function() {
        this.core.editor().addClass('redactor-layer_wym');
			}
		};
	};
})(jQuery);
