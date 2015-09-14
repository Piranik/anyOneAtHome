$(document).ready(function(){
$.ajax({ url: "/check",
        context: document.body,
        success: function(data) {
                  if(data.length>0){
                    $('.jumbotron').attr('style', 'background-color: #348245');
                  }else{
                    $('.jumbotron').attr('style', 'background-color: #922E2E');
                  }
                  for(i =0 ;i<data.length;i++){
                      $('.orderedList').append('<li>'+data[i].alias+'</li>');
                  }
                }
      });
});

$('.list > li a').click(function() {
        $(this).parent().find('ul').toggle();
    });
