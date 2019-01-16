jQuery(document).ready(function ($) {
    //if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
    var MqL = 1170;
    //move nav element position according to window width
    moveNavigation();
    $(window).on('resize', function () {
        (!window.requestAnimationFrame) ? setTimeout(moveNavigation, 300) : window.requestAnimationFrame(moveNavigation);
    });

    //mobile - open lateral menu clicking on the menu icon
    $('.cd-nav-trigger').on('click', function (event) {
        event.preventDefault();
        if ($('.cd-main-content').hasClass('nav-is-visible')) {
            closeNav();
            $('.cd-overlay').removeClass('is-visible');
        } else {
            $(this).addClass('nav-is-visible');
            $('.cd-main-header').addClass('nav-is-visible');
            $('.cd-main-content').addClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                $('body').addClass('overflow-hidden');
            });
            toggleSearch('close');
            $('.cd-overlay').addClass('is-visible');
        }
    });

    //open search form
    $('.cd-search-trigger').on('click', function (event) {
        event.preventDefault();
        toggleSearch();
        closeNav();
    });


    //submenu items - go back link
    $('.go-back').on('click', function () {
        $(this).parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('moves-out');
    });

    function closeNav() {
        $('.cd-nav-trigger').removeClass('nav-is-visible');
        $('.cd-main-header').removeClass('nav-is-visible');
        $('.cd-primary-nav').removeClass('nav-is-visible');
        $('.has-children ul').addClass('is-hidden');
        $('.has-children a').removeClass('selected');
        $('.moves-out').removeClass('moves-out');
        $('.cd-main-content').removeClass('nav-is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            $('body').removeClass('overflow-hidden');
        });
    }

    function toggleSearch(type) {
        if (type == "close") {
            //close serach
            $('.cd-search').removeClass('is-visible');
            $('.cd-search-trigger').removeClass('search-is-visible');
            $('.cd-overlay').removeClass('search-is-visible');
        } else {
            //toggle search visibility
            $('.cd-search').toggleClass('is-visible');
            $('.cd-search-trigger').toggleClass('search-is-visible');
            $('.cd-overlay').toggleClass('search-is-visible');
            if ($(window).width() > MqL && $('.cd-search').hasClass('is-visible')) $('.cd-search').find('input[type="search"]').focus();
            ($('.cd-search').hasClass('is-visible')) ? $('.cd-overlay').addClass('is-visible') : $('.cd-overlay').removeClass('is-visible');
        }
    }

    function checkWindowWidth() {
        //check window width (scrollbar included)
        var e = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        if (e[a + 'Width'] >= MqL) {
            return true;
        } else {
            return false;
        }
    }

    function moveNavigation() {
        var navigation = $('.cd-nav');
        var desktop = checkWindowWidth();
        if (desktop) {
            navigation.detach();
            navigation.insertBefore('.cd-header-buttons');
        } else {
            navigation.detach();
            navigation.insertAfter('.cd-main-content');
        }
    }

    function test() {
        console.log('sdf')
    }

    var suggestions = [
        {name: "chicken"},
        {name: "bread"},
        {name: "pork"},
        {name: "persil"},
        {name: "flour"},
        {name: "egg"},
        {name: "duck"},
        {name: "tomato"},
        {name: "potato"},
    ];
    $('input').typeahead({
        source: suggestions
    });
    let data;
    let itemTemplate = $('.recipe-template').html();
    let input = $('#smart-search');
    let call = $.getJSON("/static/data.json", function (json) {
        data = json; // this will show the info it in firebug console
    });
    call.complete(function () {
        data.forEach(elem => {
            elem["ingredients_no"] = elem.ingredient.length;
        })
    })


    input.tagsinput({
        typeahead: {
            tagClass: 'big',
            source: suggestions.map(function (item) {
                return item.name
            }),
            cancelConfirmKeysOnEmpty: true,
        }
    })
    input.on('itemAdded', function (event) {
        if (event.item !== "") {

            displayFilteredData(event.item);
        }
    });
    let displayRecipes = [];

    function displayFilteredData(inputText) {
        $('.results-wrapper').html('')
        inputText = inputText.toLowerCase();
        let filteredData = [];
        if (displayRecipes.length === 0) {
            filteredData = data;
        } else {
            filteredData = displayRecipes;
            displayRecipes=[];
        }
        filteredData.forEach(elem => {
            let match = 0;
            $.grep(elem.ingredient, function (ingredient, index) {
                if (ingredient.toLowerCase().indexOf(inputText) >= 0) {
                    match++;
                }
            });
            if (match > 0) {
                if (displayRecipes.indexOf(JSON.stringify(elem)) === -1){
                   displayRecipes.push(elem)
                }

            }
        })
        console.log(displayRecipes);
        displayRecipes.forEach(item => {
            $(itemTemplate).map(function () {
                let $this = $(this);
                $this.find('.recipe-container-title').attr("href", '/receipes/' + item.id).html(item.title);
                if (item.cooktime.length!==0) {
                    $this.find('.cooktime').removeClass("hidden").html(`CookTime: ${item.cooktime}`);
                } else {
                    $this.find('.cooktime').addClass("hidden").html('');
                }
                if (item.preptime.length!==0) {
                    $this.find('.preptime').removeClass("hidden").html(`PrepTime: ${item.preptime}`);
                } else {
                    $this.find('.preptime').addClass("hidden").html('');
                }
                if (item.servings.length!==0) {
                    $this.find('.servings').removeClass("hidden").html(`Servings: ${item.servings}`);
                } else {
                    $this.find('.servings').addClass("hidden").html('');
                }

                $('.results-wrapper').append($this);
            })


        })
    }
});