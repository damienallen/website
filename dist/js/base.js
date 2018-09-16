function sendEmail() {

    var form_data = {
        name : $('#id_name').val(),
        email : $('#id_email').val(),
        subject : $('#id_subject').val(),
        message : $('#message-text').val(),
        recaptcha: $('#g-recaptcha-response').val()
    };

    console.log(form_data);

    $.ajax({
        url : "/contact/",
        type : "POST",
        data : form_data,
        success : function(data) {
            // Show status modal
            $('#contact-modal-title').text('Message sent!');
            $('#contact-modal-body').text('I will try to return your message promptly.');
            $('#contact-modal').modal('show');

            // Disable form
            $('#submit-button').text('Sent!');
            $('#submit-button').prop('disabled', true);
        },
        error : function(data) {
            // Show status modal
            $('#contact-modal-title').text('Message not sent!');
            $('#contact-modal-body').text(data.responseJSON.message);
            $('#contact-modal').modal('show');
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

    // Hide modal initially
    $('#contact-modal').modal({ show: false});

    // Set initial background opacity and fade cover background on scroll
    adjustOpacity();
    $(window).scroll(function () {
        adjustOpacity();
    });

    // Add padding to in-page nav
    var offset = 50;

    $('#navbar-links #sections a, .down-arrow a').click(function(event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - offset
        }, 800);

    });

    // Add tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Initialize contact form
    $('#contact-form').on('submit', function(event){
        event.preventDefault();
        sendEmail();
    });

    // Add WYSIWYG editor to textarea
    $('#message-text').trumbowyg({
        // autogrow: true,
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

function adjustOpacity() {
    var windowHeight = window.innerHeight;
    var paddingOffset = 10;

    var coverOpacity = (windowHeight - paddingOffset - $(this).scrollTop())/windowHeight;
    if (coverOpacity < 0) {
        coverOpacity = 0;
    }

    var boxShadowInitialOpacity = 0.2;
    var boxShadowOpacity = boxShadowInitialOpacity * coverOpacity;
    var boxShadowValue = '0 3px 15px rgba(0,0,0,' + boxShadowOpacity + ')';
    $('.cover').css({opacity: coverOpacity})
    $('#work').css({boxShadow: boxShadowValue})
}