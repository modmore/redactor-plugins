(function($)
{
	$.Redactor.prototype.breadcrumb = function() {
		return {
			messageBox:null,
			init: function() {
        var that = this;
				
				this.core.element().after('<p class="redactor_message_box redactor_breadcrumb" id="redactor_breadcrumb-' + this.uuid + '"><i class="fa fa-code icon icon-code"></i>&nbsp;<span></span></p>');
				this.breadcrumb.messageBox = $('#redactor_breadcrumb-' + this.uuid);

				this.core.editor().on('keyup.redactor-plugin-counter click sync', $.proxy(this.breadcrumb.handleChange, this));
			},
			handleChange: function(e) {
				var that = this;

				var current = this.selection.current(),
				cloned = $(current).clone(),
				_el = cloned.find('*[data-verified="redactor"]'),
				_editor = cloned.closest('div.redactor-layer'),
				_crumbs = [];

				if (!$(current).parent().is('div.redactor-layer')) {
						var t = $(current);
						while ($(t)[0] && t.parent() !== undefined && !t.is('div.redactor-layer')) {
								_crumbs.push($(t)[0].tagName);
								t = t.parent();
						}
				} else {
						_crumbs.push($(cloned)[0].tagName);
				}

				_crumbs = _crumbs.reverse();

				this.breadcrumb.messageBox.children('span').html(_crumbs.join('&nbsp;&raquo;&nbsp;').toLowerCase());
			}
		};
	};
})(jQuery);
