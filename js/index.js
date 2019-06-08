var windowWidth = parseInt($(window).width());
var mobile = parseInt($(window).width()) < 768;

HeaderLoad = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'header.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState !== 4) {
            return;
        }
    
        if (this.status !== 200) {
            return;
        }
    
        document.getElementById('to-include').innerHTML= this.responseText;
    };
    
    xhr.send();    
}

ModeSwitching = () => {
    let modes = $('.mode-button');
    let mobileModes = $('.mobile-mode-button');
    let mainSection = $('#mainSection');

    $.map(modes, (el, i) => {
        $(el).on('click', () => {
            for(var j = 0; j < modes.length; j++) {
                mainSection.removeClass('moderation--mode-' + j.toString());
            }
            mainSection.addClass('moderation--mode-' + i);
        });
    });

    $.map(mobileModes, (el, i) => {
        $(el).on('click', () => {
            for(var j = 0; j < modes.length; j++) {
                mainSection.removeClass('moderation--mode-' + j.toString());
            }
            mobileModes.removeClass('mobile-nav__anchor--current');
            
            $(el).addClass('mobile-nav__anchor--current');
            mainSection.addClass('moderation--mode-' + i);
        });
    });
}

ReviewsOpening = () => {
    let reviewControlBtns = $('.review-control');
    let mobileControlBtns = $('.review .closing');

    $.map(reviewControlBtns, (el) => {
        $(el).on('click', () => {
            $(el).closest('.review').toggleClass('review--minimized');
        });
    });

    $.map(mobileControlBtns, (el) => {
        $(el).on('click', () => {
            $(el).parent().parent().addClass('review--minimized');
        });
    });
}

RangeInputControl = () => {
    let rangeInput = $('.input-level');
    let rating = $('.input-rating');
    let darkStripe = $('.input-stripe--dark');

    $.map(rangeInput, (el, i) => {
        $(el).on('input', () => {
            $(rating[i]).html($(el).val());
            $(darkStripe[i]).css({
               width: (parseInt($(el).val()) - 1) * 11.1111111111 + '%'
            });
        });
    });
}

SelectDropdownReturning = () => {
    let selectDropdowns = $('.button-select .select');
    let currentlySelectedOption;

    $.map(selectDropdowns, (el, i) => {
        $(el).on('change', () => {
            currentlySelectedOption = $(el).val();

            // console.log(currentlySelectedOption);

            $(el).val('default');
        });
    });
}

SlickSlider = () => {
    $('.slider').slick();

    //let btns = $('.screenshop-button');
    let btns = $('.screen-buttons');

    let sliders = $('.darkness-wrapper');
    let slidersWrappers = $('.slider-wrapper');
    let sliderParents = $('.slider');
    let mobileBtns = $('.slider-close');

    $.map(btns, (el, i) => {

        $.map($(el).find('.button'), (_el, j) => {

            $(_el).on('click', () => {

                $(sliders[i]).fadeIn(300);
                $(sliderParents)[i].slick.slickGoTo(j);
                $(sliderParents)[i].slick.refresh();

            });

        });

    });

    $.map(mobileBtns, (el) => {

        $(el).on('click', () => {
            $(el).parent().parent().fadeOut(300);
        });

    });

    $.map(sliders, (el, i) => {
        $(el).on('mousedown', (event) => {
            if(event.clientX > $(slidersWrappers[i]).offset().left &&
            event.clientY > $(slidersWrappers[i]).offset().top &&
            event.clientX < $(slidersWrappers[i]).offset().left + $(slidersWrappers[i]).outerWidth() &&
            event.clientY < $(slidersWrappers[i]).offset().top + $(slidersWrappers[i]).outerHeight()) {
            } else {
                $(el).fadeOut(300);
            }
        });
    });
}

DropdownControl = () => {
    let dropdowns = $('.dropdown__body');
    let dropdownOptions = $('.dropdown .option');
    let defaultDropdownText = $($('.dropdown__body')[0]).text();
    let dropdownOptionsChosen = Array(dropdowns.length).fill(0);

    $.map(dropdowns, (el, i) => {

        $(el).on('click', () => {
            $(el).parent().toggleClass('dropdown--open');
        });

        $.map($(el).parent().find('.option'), (_el, j) => {

            $(_el).on('click', () => {

                if($(_el).hasClass('option--active')) {
                    dropdownOptionsChosen[i] += 1;

                    let temp = document.createElement('span');
                    temp.classList.add('dropdown__added');
                    temp.append($(_el).text());    
                    $(el).append(temp);

                } else {
                    dropdownOptionsChosen[i] -= 1;

                    $.map($(el).find('.dropdown__added'), (__el) => {
                        if($(__el).text() == $(_el).text()) {
                            $(__el).remove();
                        }
                    });
                }
    
                if(dropdownOptionsChosen[i] > 0) {
                    $(el).find('.dropdown__text').html('');
                } else {
                    $(el).find('.dropdown__text').html(defaultDropdownText);
                }
    
            });

        });

    });
}

OptionsControl = () => {
    let options = $('.option');

    $.map(options, (el) => {

        $(el).on('click', () => {
            $(el).toggleClass('option--active');
        });

    });
}

OtherControls = () => {
    let commerceBtns = $('.form--commerce .content-row');

    $.map(commerceBtns, (el) => {
        $.map($(el).find('.button'), (_el) => {
            $(_el).on('click', () => {
                $(el).find('.button').removeClass('button--active');
                $(_el).addClass('button--active');
            });
        });
    });
}

$(document).ready(() => {
    HeaderLoad();
    ModeSwitching();
    ReviewsOpening();
    RangeInputControl();
    SelectDropdownReturning();
    SlickSlider();
    OptionsControl();
    DropdownControl();
    OtherControls();
});