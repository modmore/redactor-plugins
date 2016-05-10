(function($)
{
	$.Redactor.prototype.syntax = function() {
		return {
      offlineMode:false,
      editor:null,
      prettyContent:null,
			init: function() {
        var that = this;

        if(that.opts.aceLoaded === undefined) that.opts.aceLoaded = false;
        if(that.opts.aceLoaded) return;

        this.opts = $.extend({
          aceUseSoftTabs:true,
          aceTabSize:4,
          aceUseWrapMode:true,
          aceHighlightActiveLine:true,
          aceReadOnly:false
        }, this.opts);

        if(typeof ace === 'undefined') {
            that.syntax.offlineMode = true;
            $.getScript(that.opts.aceOfflineSource, function(){
                that.syntax.handleLoaded();
            });
        } else {
            that.syntax.handleLoaded();
        }
			},
      handleLoaded: function(){
        var that = this,
        textarea = that.$textarea;

        that.$textarea.after('<div class="redactor__modx-code-pretty-content" rows="4" style="display:none"></div>'); // not fun to have to do this http://stackoverflow.com/questions/6440439/how-do-i-make-a-textarea-an-ace-editor#comment9444773_7478430
        that.syntax.prettyContent = that.$textarea.parent().children('div.redactor__modx-code-pretty-content').attr('id','redactor__modx-code-pretty-content' + that.uuid);

        if(that.opts.aceOfflineSource) {
            ace.config.set("modePath",that.opts.assetsUrl + 'lib/ace/');
            ace.config.set("workerPath",that.opts.assetsUrl + 'lib/ace/');
            ace.config.set("themePath",that.opts.assetsUrl + 'lib/ace/');
        }

        that.syntax.editor = ace.edit('redactor__modx-code-pretty-content' + that.uuid);
        var editor = that.syntax.editor;

        editor.setTheme(that.opts.aceTheme || "ace/theme/chrome");
        editor.getSession().setMode(that.opts.aceMode || "ace/mode/html");
        editor.getSession().setUseWorker(that.opts.useWorkers || false);
        editor.setValue(textarea.val()); //that.tabifier.get(that.$textarea.val())
        if(that.opts.aceUseSoftTabs !== undefined) editor.getSession().setUseSoftTabs(that.opts.aceUseSoftTabs);
        if(that.opts.aceTabSize !== undefined && parseInt(that.opts.aceTabSize)) editor.getSession().setTabSize(parseInt(that.opts.aceTabSize));
        if(that.opts.aceUseWrapMode !== undefined) editor.getSession().setUseWrapMode(that.opts.aceUseWrapMode);
        if(that.opts.aceHighlightActiveLine !== undefined) editor.setHighlightActiveLine(that.opts.aceHighlightActiveLine);
        if(that.opts.aceReadOnly !== undefined) editor.setReadOnly(that.opts.aceReadOnly);

        this.core.editor().on('sourceToggle', $.proxy(this.syntax.sourceCallback, this));

        editor.on('change',function(e){
            that.source.$textarea.val(editor.getValue());
        });

        if(that.opts.aceFontSize !== undefined) editorDOM.css({fontSize:that.opts.aceFontSize});
        that.opts.aceLoaded = true;
      },
			sourceCallback: function(e,data){
        var that = this,
        editor = that.syntax.editor;

        if(data.sourceMode) {
          var _h = that.source.$textarea.height();

          that.source.$textarea.hide();

          editor.setValue(that.source.$textarea.val());
          that.syntax.prettyContent.show().height(_h);
          editor.resize();
        } else {
          var editorDOM = $(document.getElementById(('redactor__modx-code-pretty-content' + that.uuid)));
          that.insert.set(editor.getValue(), false);
          editorDOM.hide();
        }

			}
		};
	};
})(jQuery);
