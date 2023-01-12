// Import dependencies
import $ from 'jquery'
import 'trumbowyg'

// Import stylesheets
import 'trumbowyg/dist/ui/trumbowyg.css'
import 'modern-normalize/modern-normalize.css'

import './styles/base.scss'
import './styles/layout.scss'

// Handle form submission
const sendEmail = () => {
    const formData = {
        name: $('#form-name').val(),
        email: $('#form-email').val(),
        subject: $('#form-subject').val(),
        message: $('#form-message').val(),
        check: $('#form-check').val(),
    }

    $.ajax({
        url: '/api/submit',
        type: 'POST',
        data: formData,
        success: (data) => {
            $('#submit-button').text('Sent!')
            $('#submit-button').prop('disabled', true)
            $('#form-errors').text('')
            console.debug(data.status)
        },
        error: (data) => {
            $('#form-errors').text(data.status.message)
            console.error(data)
        },
    })
}

// Fade opacity on scroll
const adjustOpacity = () => {
    const windowHeight = window.innerHeight
    const paddingOffset = 10
    const baseOpacity = 0.2

    let coverOpacity = (windowHeight - paddingOffset - $(window).scrollTop()) / windowHeight
    if (coverOpacity < baseOpacity) {
        coverOpacity = baseOpacity
    }

    const navbarBackgroundOpacity = 1 - coverOpacity
    const navbarBackground = `rgba(23,23,32,${navbarBackgroundOpacity})`

    $('.cover').css({ opacity: coverOpacity })
    $('#navbar').css({ background: navbarBackground })
}

// Scroll spy navigation
const offset = 50
let lastId = null
let menuItems = $('#navbar-links a')
let scrollItems = menuItems.map((ind, element) => {
    let item = $($(element).attr('href'))
    if (item.length) {
        return item
    }
})

const adjustScrollSpy = (scrollTop) => {
    // Get container scroll position
    const fromTop = scrollTop + offset + 50

    // Get id of current section
    let current = scrollItems.map((ind, element) => {
        if ($(element).offset().top < fromTop) return element
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
        $('html, body').animate(
            {
                scrollTop: $($(event.currentTarget).attr('href')).offset().top - offset,
            },
            800
        )
        closeNav()
    })

    // Initialize contact form
    $('#contact-form').on('submit', (event) => {
        event.preventDefault()
        sendEmail()
    })

    // Add WYSIWYG editor to textarea
    $('#form-message').trumbowyg({
        svgPath: 'icons/trumbowyg_icons.svg',
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em'],
            ['unorderedList', 'orderedList'],
            ['fullscreen'],
        ],
    })
})

// Open mobile navigation overlay
const openNav = () => {
    $('#nav-open').hide()
    $('#nav-close').show()
    $('#navbar').addClass('open')
}

// Close navigation overlay
const closeNav = () => {
    $('#nav-open').show()
    $('#nav-close').hide()
    $('#navbar').removeClass('open')
}

// Set up navigation onclicks
$('#nav-open').click(openNav)
$('#nav-close').click(closeNav)
