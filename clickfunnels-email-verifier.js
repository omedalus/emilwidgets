
$(document).ready(function() {
  $('input[type=email]').each(function() {
    let jqElem = $(this);
    let isFocused = false;
    let isValidated = false;
    let isDisposable = false;
    let lastValue = '';

    let clearBadNote = function() {
	  $('.email_address_bad', jqElem.parent()).remove();
    };

    let showBadNote = function(badaddr) {
      clearBadNote();
      let jqBadEmailNote = $(
        '<div class="email_suggestion email_address_bad"><strong>' +
        badaddr +
        '</strong> is not a real email address.</div>');
      jqBadEmailNote.appendTo(jqElem.parent());
    };

    let jqCheck = $('<img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Checkmark_green.svg">')
    jqCheck.css({position: 'absolute', right:'.5em', top:'1em', height:'3em', width: '3em'});
    jqCheck.appendTo(jqElem.parent());
    jqCheck.hide();

    let jqSpinner = $('<img src="https://www.michelin.nl/assets/img/launcher2/launcher-loader.gif">')
    jqSpinner.css({position: 'absolute', right:'.5em', top:'1em', height:'3em', width: '3em'});
    jqSpinner.appendTo(jqElem.parent());
    jqSpinner.hide();


    let updateValidationDisplay = function() {
      lastValue = jqElem.val();
      if (!isValidated || isDisposable) {
        showBadNote(lastValue);
        jqCheck.hide();
        jqElem.attr('placeholder', jqElem.val());
        jqElem.val('');
      } else {
        clearBadNote();
        jqCheck.show();
      }
    };

    let sendForValidation = function() {
      jqSpinner.show();
      let emailaddress = jqElem.val();
      $.ajax('https://api1.27hub.com/api/emh/a/v2', {
        data: {
          k: 'C07F6BB2',
          e: emailaddress
        },
        success: (response) => {
          jqSpinner.hide();
          isValidated = (response.result === "Ok");
          isDisposable = response.disposable;
          if (!isFocused) {
            jqElem.val(response.email);
          }
          updateValidationDisplay();
        }
      });
    };

    jqElem.focus(function() {
      isFocused = true;
    }).blur(function() {
      isFocused = false;
      sendForValidation();
      jqElem.attr('placeholder', jqElem.val());
      jqElem.val('');
    }).keydown(function(ev) {
      if (ev.which === 13) {
        jqElem.blur();
      } else {
        jqCheck.hide();
        clearBadNote();
      }
    });

    jqElem.keyup(_.debounce(sendForValidation, 500));
  });
});

