$(document).ready(function(){
    $('form input').one('blur keydown', function() {
      $(this).addClass('touched');
    });
});