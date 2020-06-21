// Import dependencies
import $ from 'jquery'
import { createPopper } from '@popperjs/core'
import 'trumbowyg'

// Import stylesheets
import 'trumbowyg/dist/ui/trumbowyg.css'
import 'normalize.css'

import './styles/base.scss'
import './styles/layout.scss'


// Handle form submission
const sendEmail = () => {

    const formData = {
        name: $('#id_name').val(),
        email: $('#id_email').val(),
        subject: $('#id_subject').val(),
        message: $('#message-text').val(),
        recaptcha: $('#g-recaptcha-response').val()
    }

    $.ajax({
        url: "/api/submit",
        type: "POST",
        data: formData,
        success: (data) => {
            $('#submit-button').text('Sent!')
            $('#submit-button').prop('disabled', true)
            $('#form-errors').text('')
            console.log(data.responseJSON.status.message)
        },
        error: (data) => {
            $('#form-errors').text(data.responseJSON.status.message)
            console.error(data.responseJSON)
        }
    })

}

// Fade cover on scroll
const adjustOpacity = () => {
    const windowHeight = window.innerHeight
    const paddingOffset = 10

    let coverOpacity = (windowHeight - paddingOffset - $(window).scrollTop()) / windowHeight
    if (coverOpacity < 0) {
        coverOpacity = 0
    }

    const boxShadowInitialOpacity = 0.2
    const boxShadowOpacity = boxShadowInitialOpacity * coverOpacity
    const boxShadowValue = '0 3px 15px rgba(0,0,0,' + boxShadowOpacity + ')'
    $('.cover').css({ opacity: coverOpacity })
    $('#work').css({ boxShadow: boxShadowValue })
}

// Scroll spy navigation
const offset = 50
let lastId = null
let menuItems = $('#navbar-links a')
let scrollItems = menuItems.map((ind, element) => {
    let item = $($(element).attr('href'))
    if (item.length) { return item }
})

const adjustScrollSpy = (scrollTop) => {

    // Get container scroll position
    const fromTop = scrollTop + offset + 50

    // Get id of current section
    let current = scrollItems.map((ind, element) => {
        if ($(element).offset().top < fromTop)
            return element
    })
    current = current[current.length - 1]
    const currentId = current && current.length ? current[0].id : ''

    // Set active class
    if (lastId !== currentId) {
        lastId = currentId
        menuItems.removeClass('active')
        menuItems.filter(`[href='#${currentId}']`).addClass('active')
    }
}

$(window).scroll((e) => {
    const scrollTop = $(e.currentTarget).scrollTop()
    adjustScrollSpy(scrollTop)
})

$(document).ready(() => {

    // Set initial background opacity and fade cover background on scroll
    adjustOpacity()
    $(window).scroll(() => {
        adjustOpacity()
    })

    // Add padding to in-page nav
    $('#navbar-links a, .down-arrow a').click((event) => {
        event.preventDefault()
        $('html, body').animate({
            scrollTop: $($(event.currentTarget).attr('href')).offset().top - offset
        }, 800)
    })

    // Add tooltips
    // createPopper($('[data-toggle="tooltip"]'), {
    //     placement: 'top',
    // })

    // Initialize contact form
    $('#contact-form').on('submit', (event) => {
        event.preventDefault()
        sendEmail()
    })

    // Add WYSIWYG editor to textarea
    $('#message-text').trumbowyg({
        svgPath: 'icons/trumbowyg_icons.svg',
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em'],
            ['unorderedList', 'orderedList'],
            ['fullscreen']
        ]
    })

})
