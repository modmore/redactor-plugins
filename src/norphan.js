if(String.prototype.reverse === undefined) {
	String.prototype.reverse = function() {
		return this.split('').reverse().join('');
	}
}


(function($)
{
	$.Redactor.prototype.norphan = function() {
		return {
			init: function() {
        var that = this;

				if(this.opts.callbacks.syncBefore !== undefined) return;

				$.extend(this.opts.callbacks, {
					syncBefore:function(html){
						var _w = $(document.createElement('div'));
						_w.html(html);
						_w.find('div,p,h1,h2,h3,h4,h5,h6,blockquote,dd,dt,figcaption').each(function(){
								$(this).replaceWith(that.norphan.adopt($(this).get(0).outerHTML));
						});
						return that.code.cleaned(_w.html());
					}
				});
			},
			adopt: function(html) {
				var that = this;

				var _t = '';

				var _a = String(html).reverse().split('');
				var _firstSpace = false;
				var _sniffingNonWhiteSpace = false;

				for(var i = 0; i < _a.length; i++) {
						if(_a[i] == '>') {
								_ignore = true;
						} else if(_a[i] == '<') {
								_ignore = false;
								_sniffingNonWhiteSpace = true;
						} else if(_a[i].trim().length > 0) {
								_sniffingNonWhiteSpace = false;
						}

						if(!_ignore && !_firstSpace && _a[i] == ' ' && !_sniffingNonWhiteSpace) {
								_t += String('&nbsp;').reverse();
								_firstSpace = true;
						} else {
								_t += _a[i];
						}
				}

				return _t.reverse();

			}
		};
	};
})(jQuery);
