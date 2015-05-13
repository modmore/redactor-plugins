if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.breadcrumb = function()
	{
		return {
			init: function()
			{
                var that = this;
                
                $(this.$editor).after('<p class="redactor_message_box redactor_breadcrumb" id="redactor_breadcrumb-' + this.uuid + '"><i class="icon icon-code"></i>&nbsp;<span></span></p>');
                var _messageBox = $('#redactor_breadcrumb-' + this.uuid);

				this.$editor.on('keyup.redactor-limiter', $.proxy(function(e) {
                    this.breadcrumb.handleChange(e);
				  }, this))
                  .on('click', $.proxy(function(e) {
                    this.breadcrumb.handleChange(e);
				  }, this))
                  .on('sync', $.proxy(function(e) {
                    this.breadcrumb.handleChange(e);
				  }, this))
				;

                this.$element.on("sourceCallback",function(data){ // #janky REQUIRES redactor.js#L2717 hack.
                    if(!that.opts.visual) {
                        _messageBox.hide();
                    } else {
                        _messageBox.show();
                    }
                });
			},
            handleChange: function(e) {
                var that = this;
                var current = this.selection.getCurrent();
                var _messageBox = $('#redactor_breadcrumb-' + this.uuid);
                
                var cloned = $(current).clone();
                
                var _el = cloned.find('*[data-verified="redactor"]');
                
                var _editor = cloned.closest('div.redactor-editor');

                var _crumbs = [];
                
                if(!$(current).parent().is('div.redactor-editor')) {
                    var t = $(current);
                    while($(t)[0] && t.parent() !== undefined && !t.is('div.redactor-editor')) {
                        _crumbs.push($(t)[0].tagName);
                        t = t.parent();
                    }                        
                } else {
                    _crumbs.push($(cloned)[0].tagName);
                }
                
                _crumbs = _crumbs.reverse();
                
                _messageBox.children('span').html(_crumbs.join('&nbsp;&raquo;&nbsp;'));
            }
		};
	};
})(jQuery);