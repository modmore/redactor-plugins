(function($) {
    $.Redactor.prototype.replacer = function() {
        return {
            getTemplate: function() {
                return String() +
										'<form id="redactor-modal-replacer">' +
	                    '<section>' +
			                    '<p>Search and replace found text.</p>' +
													'<div>' +
				                    '<label>' + 'Search' + '</label>' +
				                    '<input type="text" size="5" value="" id="redactor-replacer-find" required />' +
													'</div>' +
													'<div>' +
				                    '<label>' + 'Replace' + '</label>' +
				                    '<input type="text" size="5" value="" id="redactor-replacer-replace" required />' +
													'</div>' +
			                    '<div class="options">' +
				                    '<div class="ignore-case">' +
					                    '<label>' + 'Ignore Case' + '</label>' +
					                    '<input type="checkbox" id="redactor-replacer-ignore-case" />' +
				                    '</div>'
				                    //+ '<div class="replace-all">'
				                    //	+ '<label>' + 'Replace All' + '</label>'
				                    //	+ '<input type="checkbox" id="redactor-replacer-replace-all" checked disabled readonly />'
				                    //+ '</div>'
				                    +
			                    '</div>' +
													'<footer>'
														+ '<button id="redactor-modal-button-action" type="submit">Replace</button>'
														+ '<button id="redactor-modal-button-cancel">Cancel</button>'
												+ '</footer>'
	                    + '</section>'
										+ '</form>';
            },
            init: function() {
                var that = this;

                $.extend(this.opts.shortcuts, {
                    'ctrl+f': {
                        func: 'replacer.show',
                        params: []
                    }
                });
            },
            show: function() {
                var that = this;

                this.modal.addTemplate('replacer', this.replacer.getTemplate());

                this.modal.load('replacer', this.lang.get('replacer') || 'Replacer', 400);
                //this.modal.createCancelButton();

                //var button = this.modal.createActionButton('Replace');
                //button.on('click', this.replacer.replace);

								$('#redactor-modal-replacer').submit(function(e){
									e.preventDefault();
									that.replacer.replace();
								});

                if (this.sel && this.sel.toString()) {
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
                var _i = $('#redactor-replacer-ignore-case').is(":checked");

                if (_f && _r) this.insert.set(replaceAll(_f, _r, this.code.get(), 'g' + ((_i) ? 'i' : '')));

                this.modal.close();
                this.selection.restore();

                function replaceAll(find, replace, str, flags) {
                    return str.replace((find instanceof RegExp) ? find : new RegExp(find, flags), replace);
                }
            }
        };
    };
})(jQuery);
