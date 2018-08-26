//function sendEmail() {
//    console.log("create post is working!") // sanity check
//    $.ajax({
//        url : "/contact/", // the endpoint
//        type : "POST", // http method
//        data : { the_post : $('#post-text').val() }, // data sent with the post request
//
//        // handle a successful response
//        success : function(json) {
//            console.log(json); // log the returned json to the console
//            console.log("success"); // another sanity check
//        },
//
//        // handle a non-successful response
//        error : function(xhr,errmsg,err) {
//            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
//        }
//    });
//};
//
//$( document ).ready(function() {
//
//    $('#contact-form').on('submit', function(event){
//        event.preventDefault();
//        console.log("form submitted!");
//        sendEmail();
//    });
//
//});

$(document).ready(function () {

    // Fade cover background on scroll
    $(window).scroll(function () {

        var multiplier = 0.1;

        var coverOpacity = (100 - $(this).scrollTop()*multiplier)/100;
        if (coverOpacity < 0) {
            coverOpacity = 0;
        }

        var boxShadowInitialOpacity = 0.2;
        var boxShadowOpacity = boxShadowInitialOpacity * coverOpacity;
        var boxShadowValue = '0 3px 15px rgba(0,0,0,' + boxShadowOpacity + ')';
        $('.cover').css({opacity: coverOpacity})
        $('#work').css({boxShadow: boxShadowValue})
    });

    // Add padding to in-page nav
    var offset = 50;

    $('.navbar li a').click(function(event) {
        event.preventDefault();
        $($(this).attr('href'))[0].scrollIntoView();
        scrollBy(0, -offset);
    });

    // Add WYSIWYG editor to textarea
    $('#message-text').trumbowyg({
        autogrow: true,
        // autogrowOnEnter: true,
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em'],
            ['unorderedList', 'orderedList'],
            ['fullscreen']
        ]
    });

});