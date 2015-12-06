if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.imageurl = function()
	{
		return {
			init: function() {
                var that = this;

                this.$element.on('modalOpenedCallback', $.proxy(this.imageurl.load, this));
			},
			load: function() {
                var that = this;
                
                if(!$('#redactor-modal-image-insert').length) return;
                
                that.modal.addTab('image-url', 'Image URL', 'active');
                
                $('#redactor-modal-tabber a[rel="tabimage-url"]').click(function(e){
                    $('#redactor-modal').removeClass('expanded eureka-modal');
                    $('#eureka-modal-footer').hide();
                }); 
                
                $('#redactor-modal-image-insert').append($(document.createElement('form')).attr('id','insert-image-form').addClass('redactor-tab redactor-tabimage-url').hide().append(
                    [
                        $('<label for="image-url" class="redactor-image-link-option">').html('Image URL'),
                        $('<input type="url" name="image-url" id="image-url-input" placeholder="Absolute URL to Image">'),
                        $('<footer id="insert-image-footer">').html(
                            $('<button id="insert-url-btn" type="submit">').addClass('redactor-modal-btn redactor-modal-action-btn').html('Insert')
                        )
                    ]
                ));
                
                $('#insert-image-form').submit(function(e){
                    e.preventDefault();

                    that.image.insert({filelink:$('#image-url-input').val()});
                    that.image.onDrop();
                    
    				that.modal.close();
    				that.selection.restore();
                });
			}
		};
	};
})(jQuery);