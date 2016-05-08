(function($)
{
	$.Redactor.prototype.imageurl = function() {
		return {
			'url-tab' : String()
			+ '<form id="insert-image-form" class="redactor-modal-tab" data-title="URL">'
				+ '<section>'
					+ '<label>' + 'URL' + '</label>'
					+ '<input type="url" id="image-url-input" aria-label="' + 'Insert Image by URL' + '" />'
				+ '</section>'
				+ '<section>'
					+ '<button id="redactor-modal-button-action" type="submit">Insert</button>'
					+ '<button id="redactor-modal-button-cancel">Cancel</button>'
				+ '</section>'
			+ '</form>',
			init: function() {
        var that = this;

				$.extend(this.opts.modal, {
					image:this.opts.modal.image + this.imageurl['url-tab']
				});

				this.core.element().on('modalOpened.callback.redactor', $.proxy(this.imageurl.load, this));
			},
			load: function() {
				var that = this;

				if(!$('#redactor-modal-image-droparea').length) return;

				$('#insert-image-form').submit(function(e){
						e.preventDefault();

						that.image.insert({url:$('#image-url-input').val()});

						that.modal.close();
						that.selection.restore();
				});
			}
		};
	};
})(jQuery);
