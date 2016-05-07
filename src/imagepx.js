(function($)
{
	$.Redactor.prototype.imagepx = function() {
		return {
			init: function() {
        var that = this;
				this.core.element().on('modalOpened.callback.redactor', $.proxy(this.imagepx.modalOpened, this));
			},
      modalOpened:function(type,data){
				var that = this;
				if(type == 'image-edit') {
					$('#redactor-image-link').attr('type','url');

					$('#redactor-modal .redactor-modal-tab-area section').last().before((function(){

						return $('<section>').addClass('dimension').append([
							createSection('Width','width'),
							createSection('Height','height')
						]);

						function createSection(title,name) {
							var div = $('<div>'),
							label = $('<label>'),
							input = $('<input name="' + name + '" type="number" min="0" step="1">');

							label.text(title);
							div.append([label,input]);

							return div;
						}
					})());

					$('section.dimension input[type="number"]').each(function(){
						$(this).on('change keyup',function(e){
							switch(e.target.name) {
								case 'width':
								$(that.observe.image).attr('width',$(e.target).val());
								break;

								case 'height':
								$(that.observe.image).attr('height',$(e.target).val());
								break;
							}
						});
					});

				}
      }
		};
	};
})(jQuery);
