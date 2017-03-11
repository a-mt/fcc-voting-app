$(document).ready(function(){
    $('form input').one('blur keydown', function() {
      $(this).addClass('touched');
    });

    $('#add-option').unbind('click').on('click', function(){
      if($(this).hasClass('once')) {
        $(this).unbind('click').addClass('disabled');
      }
      $(this).prev('ol').append($('#add-option-tpl').html());
    });
    // Simple remove option without confirm
    $('.container').on('click', '.js-remove', function(){
      $(this).closest('.js-dismiss').remove();
    });

    // AJAX delete, ask confirm
    $('.js-delete').on('click', function(){
      var div   = $(this).closest('.js-dismiss');
      var title = $(this).siblings('.js-title').html();

      if(!confirm('Delete "' + title + '" ?')) {
        return;
      }
      $.ajax({
        url: '/delete/poll',
        method: 'POST',
        data: {
          id: $(this).data('id')
        },
        success: function() {
          var container = div.parent();
          div.remove();

          if(!$(container).children().length) {
            $('.js-empty').show();
          }
        },
        error: function(xhr) {
          alert('This poll could not be deleted (' + xhr.responseText + '), please refresh the page');
        }
      });
    });
});