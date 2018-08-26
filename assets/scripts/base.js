function sendEmail() {
    console.log("create post is working!");
    $.ajax({
        url : "/contact/",
        type : "POST",
        data : { the_post : $('#post-text').val() },
        success : function(json) {
            console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}


$(document).ready(function () {

    // Get CSRF tokens for AJAX requests
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            }
        }
    });

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

    // Add tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Initialize contact form
    $('#contact-form').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!");
        sendEmail();
    });

    // Add WYSIWYG editor to textarea
    $('#message-text').trumbowyg({
        // autogrow: true,
        // autogrowOnEnterb: true,
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