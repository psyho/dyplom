
var FBConnect = {

  /*
   * If this value is true alert boxes will be raised when various
   * types of configuration errors are detected.
   */
  debugVerbose : (window.location.href.indexOf('fbc_verbose_debug') != -1),

  initialized : false,

  init : function(api_key, plugin_path,
                  home_url, wp_user, app_config) {

    if (!api_key) {
      FBConnect.error("api_key is not set");
    }

    if (!plugin_path) {
      FBConnect.error("plugin path not provided");
    }

    // Check for properly configured template - note this test fails in IE!
    if (this.debugVerbose) {
      var html_tag = document.getElementsByTagName('html').item(0);
      if (html_tag.getAttribute('xmlns:fb') === null) {
        FBConnect.error('xmlns:fb not defined on html tag - check your templates');
      }
    }

    FBConnect.home_url = home_url || "/";

    FBConnect.plugin_path = plugin_path;
    FBConnect.wp_user = wp_user;

    FB.init(api_key, plugin_path + "xd_receiver.php", app_config);

    FBConnect.initialized = true;
  },

  appconfig_reload : {
    reloadIfSessionStateChanged: true
  },

  appconfig_none : {},

  appconfig_ajaxy : {
    ifUserConnected : fbc_onlogin_noauto,
    ifUserNotConnected : fbc_onlogout_noauto
  },

  logout : function() {
    FB.ensureInit(function() {
       FB.Connect.logout();
    });
  },

  redirect_home : function() {
    window.location = FBConnect.home_url;
  },

  /*
   wordpress specific functions
   */
  setup_feedform : function() {

    var comment_form = ge('commentform');
    if (!comment_form) {
      FBConnect.error('unable to locate id=commentform');
      return;
    }

    var orig_submit = ge('submit');
    if (orig_submit && orig_submit.getAttribute('name') === 'submit') {
      /* This is a bit of a hack. The default theme gives the submit
       button an id and name of "submit". This causes it to overwrite
       the .submit() function on the form. The solution is to delete
       the submit button and recreate it with a different id. See
       http://jibbering.com/faq/names/ for more info on why this is
       bad.  */

      var subbutton = document.createElement('input');
      subbutton.setAttribute('name', 'fbc_submit_hack');
      subbutton.setAttribute('type', 'submit');

      // restore the origional name
      subbutton.setAttribute('value', 'Submit Comment');

      comment_form.appendChild(subbutton);

      orig_submit.parentNode.replaceChild(subbutton, orig_submit);

    }

    /*
     * This is pretty terrible but I don't have a better option for
     * detecting a callable on IE since typeof(comment_form.submit)
     * returns object and 'call' in comment_form.submit is false.
     */
    if (comment_form.submit.nodeType) {
      FBConnect.error('unable to find .submit() on commentform');
      return;
    }

    comment_form.onsubmit = function() {
      return FBConnect.show_comment_feedform();
    }

  },

  show_comment_feedform : function() {

    var comment_text = '';

    var commentform = ge('commentform');
    if (commentform) {
      // if this isn't present something is seriously wrong
      var comment_box = commentform.comment;
      if (comment_box) {
        comment_text = comment_box.value;
      } else {
        FBConnect.error('unable to locate comment textarea');
        return true;
      }
    } else {
      FBConnect.error('unable to locate comment form, expected id=commentform');
      return true;
    }

    if (comment_text.length === 0) {
      // allow normal submit to complete
      return true;
    }

    FB.Connect.streamPublish(
      comment_text, // user_message
      { 
        name: FBConnect.article_title,
        href: window.location.href,
        caption: 'A post on the blog ' + FBConnect.blog_name,
        description: "\"" + FBConnect.excerpt + "\""
      }, // attachment
      null, // action links
      null, // target_id
      'My Comment', // prompt
      function() {
        // unconditional
        commentform.submit();
      }
    );

    // submit handled by streamPublish
    return false;

  },

  error : function(msg) {
    if (FBConnect.debugVerbose) {
      var emsg = 'Error: ' + msg;
      alert(emsg);
    }
  }

};

// end FBConnect

function fbc_onlogout_noauto() {
  fbc_set_visibility_by_class('fbc_hide_on_login', '');
  fbc_set_visibility_by_class('fbc_hide_on_logout', 'none');
}


function fbc_onlogin_noauto() {

  fbc_set_visibility_by_class('fbc_hide_on_login', 'none');
  fbc_set_visibility_by_class('fbc_hide_on_logout', '');
  FBConnect.setup_feedform();
}

function fbc_set_visibility_by_class(cls, vis) {
  var res = document.getElementsByClassName(cls);
  for(var i = 0; i < res.length; ++i) {
    res[i].style.visibility = vis;
  }
}


function ge(elem) {
  return document.getElementById(elem);
}
