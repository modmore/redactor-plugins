if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.replacer = function()
	{
		return {
			getTemplate: function()
			{
				return String()
				+ '<section id="redactor-modal-replacer">'
                    + '<p>Search and replace found text.</p>'
					+ '<label>' + 'Search' + '</label>'
					+ '<input type="text" size="5" value="2" id="redactor-replacer-find" required />'
					+ '<label>' + 'Replace' + '</label>'
					+ '<input type="text" size="5" value="3" id="redactor-replacer-replace" required />'
                    + '<div class="options">'
                        + '<div class="ignore-case">'
        					+ '<label>' + 'Ignore Case' + '</label>'
        					+ '<input type="checkbox" id="redactor-replacer-ignore-case" />'
                        + '</div>'
                        //+ '<div class="replace-all">'
        				//	+ '<label>' + 'Replace All' + '</label>'
        				//	+ '<input type="checkbox" id="redactor-replacer-replace-all" checked disabled readonly />'
                        //+ '</div>'
                    + '</div>'
				+ '</section>';
			},
			init: function()
			{
                //var button = this.button.add('replacer', 'replacer');

                //this.button.setAwesome('replacer', 'icon icon-eye');
                //this.button.addCallback(button, this.replacer.show);

                $.extend(this.opts.shortcuts, {
                    'ctrl+f': {func:'replacer.show',params:[]}
                });
			},
            show: function()
            {
				this.modal.addTemplate('replacer', this.replacer.getTemplate());

				this.modal.load('replacer', this.lang.get('replacer') || 'Replacer', 300);
				this.modal.createCancelButton();

				var button = this.modal.createActionButton('Replace');
				button.on('click', this.replacer.replace);

                if(this.sel && this.sel.toString()) {
                    $('#redactor-replacer-find').val(this.sel.toString());
                    $('#redactor-replacer-replace').focus();
                }

				this.selection.save();
				this.modal.show();

				$('#redactor-modal-replacer').focus();
            },
            replace: function() {
                var _f = $('#redactor-replacer-find').val();
                var _r = $('#redactor-replacer-replace').val();
                var _i = $('#redactor-replacer-ignore-case').is( ":checked" );

                if(_f && _r) this.insert.set(replaceAll(_f,_r,this.$editor.html(),'g' + ((_i) ? 'i' : '')));

				this.modal.close();
				this.selection.restore();

                function replaceAll(find, replace, str, flags) {
                  return str.replace((find instanceof RegExp) ? find : new RegExp(escapeRegExp(find), flags), replace);
                }

                function escapeRegExp(str) {
                  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                }
            }
		};
	};
})(jQuery);
