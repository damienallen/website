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
        $('.cover').css({opacity: coverOpacity})
    });

});