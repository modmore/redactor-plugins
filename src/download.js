if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.download = function()
	{
		return {
			init: function() {
				var button = this.button.add('download', 'Download');
                this.button.setAwesome('download', 'icon icon-download');
				this.button.addCallback(button, this.download.download);
			},
            download: function() {
                $('<a target="_blank" download="content.html" href="' + 'data:text/html,' + encodeURI(this.code.get()) + '"></a>').get(0).click();
            }
		};
	};
})(jQuery);