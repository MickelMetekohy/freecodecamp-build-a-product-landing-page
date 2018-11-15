import $ from 'jquery';
import 'bootstrap';
import 'slick-carousel';
import './../scss/app.scss';

(function iffe() {
  const opts = {
    scrolltoSpeed: 1000,
    scrolltoOffset: 50,
    scrollSpyTarget: '#nav-bar',
    scrollSpyOffset: 100,
    cwPixels: document.body.clientWidth,
  };

  const pagePlayers = {};

  $('body').scrollspy({
    target: opts.scrollSpyTarget,
    offset: opts.scrollSpyOffset,
  });

  function openNav(navToggle, pageType) {
    if (pageType) {
      $('#header').removeClass('bg-transparent');
    } else {
      $('#header').addClass('position-absolute');
    }
    $('#header').addClass('h-100');
    $('.fa.fa-bars', navToggle)[0].style.display = 'none';
    $('.close-menu', navToggle)[0].style.display = 'inline-block';
    $('span', navToggle).text('Close');
  }

  function closeNav(navToggle, pageType) {
    if (pageType) {
      $('#header').addClass('bg-transparent');
    } else {
      $('#header').removeClass('position-absolute');
    }
    $('#header').removeClass('h-100');
    $('.fa.fa-bars', navToggle)[0].style.display = 'inline-block';
    $('.close-menu', navToggle)[0].style.display = 'none';
    $('span', navToggle).text('');
  }

  function compressNav() {
    if ($(window).scrollTop() >= 3) {
      $('#header').addClass('compressed position-fixed');
    } else {
      $('#header').removeClass('compressed position-fixed');
    }
  }

  function triggerNavClick() {
    if (!$('#header .navbar-toggler').hasClass('collapsed')) {
      $('#header .navbar-toggler').trigger('click');
    }
  }

  function intiCarousel(elm) {
    $(elm).slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 30000,
      responsive: [{
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      ],
    });
  }

  function footerCollapsibleItems() {
    Array.from(document.querySelectorAll('.collapsible-footer-item')).forEach((el) => {
      if (opts.cwPixels >= 768) {
        $(el.dataset.target).collapse('show');
        el.dataset.target = false;
      } else {
        el.dataset.target = `#${el.nextElementSibling.id}`;
        $(el.dataset.target).collapse('hide');
      }
    });
  }

  function loadYTAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function initYTPlayer(elmID, vidList) {
    return new window.YT.Player(elmID, {
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        playlist: vidList,
        rel: 0,
      },
    });
  }

  window.onYouTubeIframeAPIReady = (() => {
    Array.from(document.querySelectorAll('.yt-video')).forEach((el) => {
      const elmID = el.id;
      const vidList = el.dataset.vidlist || false;
      pagePlayers[elmID] = initYTPlayer(elmID, vidList);
    });
  });

  $('#header .navbar-toggler').on('click', function clickNavToggler(e) {
    e.preventDefault();
    if ($('#site-wrapper').hasClass('home-page')) {
      $(this).hasClass('collapsed') ? openNav(this, true) : closeNav(this, true);
    } else {
      $(this).hasClass('collapsed') ? openNav(this, false) : closeNav(this, false);
    }
  });

  // smooth scroll to nav, thanks to https://css-tricks.com
  $('a[href*="#"]:not([href="#"])').on('click', function smoothScroll() {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
      let target = $(this.hash);
      target = target.length ? target : $(`[name=${this.hash.slice(1)}]`);
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - opts.scrolltoOffset,
        }, opts.scrolltoSpeed);
        triggerNavClick();
        return false;
      }
    }
    return null;
  });

  $(window).on('scroll', () => {
    compressNav();
  });

  $(window).on('load', () => {
    setTimeout(() => {
      opts.cwPixels = document.body.clientWidth;
      footerCollapsibleItems();
    }, 100);
    loadYTAPI();
    intiCarousel('.wwd-carousel');
    intiCarousel('.logo-carousel');
  });

  $(window).on('resize', () => {
    setTimeout(() => {
      opts.cwPixels = document.body.clientWidth;
      footerCollapsibleItems();
      triggerNavClick();
    }, 100);
  });
}());
