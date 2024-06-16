 
(function(html) {

    'use strict';

    html.className = html.className.replace(/\bno-js\b/g, '') + 'js';

    const cfg = {
 
        finalDate : 'june 16, 2024 00:00:00',
     
        mailChimpURL : 'https://us13.admin.mailchimp.com/audience/forms/embedded-form/editor?a_id=1234897&f_id=573425' 

    };

 
    const ssPreloader = function() {

        const body = document.querySelector('body');
        const preloader = document.querySelector('#preloader');
        const details = document.querySelector('.s-details');

        if (!(preloader && details)) return;

        window.addEventListener('load', function() {

            body.classList.remove('ss-preload');
            body.classList.add('ss-loaded');

            // page scroll position to top
            preloader.addEventListener('transitionstart', function gotoTop(e) {
                if (e.target.matches('#preloader')) {
                    window.scrollTo(0, 0);
                    preloader.removeEventListener(e.type, gotoTop);
                }
            });

            preloader.addEventListener('transitionend', function afterTransition(e) {
                if (e.target.matches('#preloader'))  {
                    details.style.bottom = (window.innerHeight - details.offsetHeight) + 'px';
                    body.classList.add('ss-show');
                    e.target.style.display = 'none';
                    preloader.removeEventListener(e.type, afterTransition);
                }
            });

        });

        window.addEventListener('beforeunload' , function() {
            body.classList.remove('ss-show');
        });
    };

 
    const ssCountdown = function () {

        const finalDate = new Date(cfg.finalDate).getTime();
        const daysSpan = document.querySelector('.counter .ss-days');
        const hoursSpan = document.querySelector('.counter .ss-hours');
        const minutesSpan = document.querySelector('.counter .ss-minutes');
        const secondsSpan = document.querySelector('.counter .ss-seconds');
        let timeInterval;

        if (!(daysSpan && hoursSpan && minutesSpan && secondsSpan)) return;

        function timer() {

            const now = new Date().getTime();
            let diff = finalDate - now;

            if (diff <= 0) {
                if (timeInterval) { 
                    clearInterval(timeInterval);
                }
                return;
            }

            let days = Math.floor( diff/(1000*60*60*24) );
            let hours = Math.floor( (diff/(1000*60*60)) % 24 );
            let minutes = Math.floor( (diff/1000/60) % 60 );
            let seconds = Math.floor( (diff/1000) % 60 );

            if (days <= 99) {
                if (days <= 9) {
                    days = '00' + days;
                } else { 
                    days = '0' + days;
                }
            }

            hours <= 9 ? hours = '0' + hours : hours;
            minutes <= 9 ? minutes = '0' + minutes : minutes;
            seconds <= 9 ? seconds = '0' + seconds : seconds;

            daysSpan.textContent = days;
            hoursSpan.textContent = hours;
            minutesSpan.textContent = minutes;
            secondsSpan.textContent = seconds;

        }

        timer();
        timeInterval = setInterval(timer, 1000);
    };
 
    const ssModal = function() {

        const modal = document.querySelector('.ss-modal');
        const trigger = document.querySelector('.ss-modal-trigger');
        const closeButton = document.querySelector('.ss-modal__close');

        if (!(modal && trigger && closeButton)) return;

        function toggleModal() {
            modal.classList.toggle('show-modal');
        }
        function windowOnClick(event) {
            if (event.target === modal) {
                toggleModal();
            }
        }
        function pressEsc(event) {
            event = event || window.event;

            if (event.keyCode =='27') {
                modal.classList.remove('show-modal');
            }
        }

        trigger.addEventListener('click', toggleModal);
        closeButton.addEventListener('click', toggleModal);
        window.addEventListener('click', windowOnClick);
        window.addEventListener('keyup', pressEsc);

    }; 


  
    const ssSwiper = function() {

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            effect: 'fade',
            speed: 2000,
            autoplay: {
                delay: 5000,
            }

        });
    };

 
    const ssMailChimpForm = function() {

        const mcForm = document.querySelector('#mc-form');

        if (!mcForm) return;

   
        mcForm.setAttribute('novalidate', true);

  
        function hasError(field) {

            
            if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

    
            let validity = field.validity;

         
            if (validity.valid) return;

           
            if (validity.valueMissing) return 'Please enter an email address.';
 
            if (validity.typeMismatch) {
                if (field.type === 'email') return 'Please enter a valid email address.';
            }

        
            if (validity.patternMismatch) {

                
                if (field.hasAttribute('title')) return field.getAttribute('title');
 
                return 'Please match the requested format.';
            }

            
            return 'The value you entered for this field is invalid.';

        };

     
        function showError(field, error) {

          
            let id = field.id || field.name;
            if (!id) return;

            let errorMessage = field.form.querySelector('.mc-status');

        
            errorMessage.classList.remove('success-message');
            errorMessage.classList.add('error-message');
            errorMessage.innerHTML = error;

        };

        
        window.displayMailChimpStatus = function (data) {

            
            if (!data.result || !data.msg || !mcStatus ) return;

           
            mcStatus.innerHTML = data.msg;

   
            if (data.result === 'error') {
                mcStatus.classList.remove('success-message');
                mcStatus.classList.add('error-message');
                return;
            }

         
            mcStatus.classList.remove('error-message');
            mcStatus.classList.add('success-message');
        };

       
        function submitMailChimpForm(form) {

            let url = cfg.mailChimpURL;
            let emailField = form.querySelector('#mce-EMAIL');
            let serialize = '&' + encodeURIComponent(emailField.name) + '=' + encodeURIComponent(emailField.value);

            if (url == '') return;

            url = url.replace('/post?u=', '/post-json?u=');
            url += serialize + '&c=displayMailChimpStatus';

           
            var ref = window.document.getElementsByTagName( 'script' )[ 0 ];
            var script = window.document.createElement( 'script' );
            script.src = url;
 
            window.mcStatus = form.querySelector('.mc-status');
            window.mcStatus.classList.remove('error-message', 'success-message')
            window.mcStatus.innerText = 'Submitting...';

     
            ref.parentNode.insertBefore( script, ref );

             
            script.onload = function () {
                this.remove();
            };

        };

       
        mcForm.addEventListener('submit', function (event) {

            event.preventDefault();

            let emailField = event.target.querySelector('#mce-EMAIL');
            let error = hasError(emailField);

            if (error) {
                showError(emailField, error);
                emailField.focus();
                return;
            }

            submitMailChimpForm(this);

        }, false);
    };



 
    const sstabs = function(nextTab = false) {

        const tabList = document.querySelector('.tab-nav__list');
        const tabPanels = document.querySelectorAll('.tab-content__item');
        const tabItems = document.querySelectorAll('.tab-nav__list li');
        const tabLinks = [];

        if (!(tabList && tabPanels)) return;

        const tabClickEvent = function(tabLink, tabLinks, tabPanels, linkIndex, e) {
    
       
            tabLinks.forEach(function(link) {
                link.setAttribute('tabindex', '-1');
                link.setAttribute('aria-selected', 'false');
                link.parentNode.removeAttribute('data-tab-active');
                link.removeAttribute('data-tab-active');
            });
    
        
            tabLink.setAttribute('tabindex', '0');
            tabLink.setAttribute('aria-selected', 'true');
            tabLink.parentNode.setAttribute('data-tab-active', '');
            tabLink.setAttribute('data-tab-active', '');
    
       
            tabPanels.forEach(function(panel, index) {
                if (index != linkIndex) {
                    panel.setAttribute('aria-hidden', 'true');
                    panel.removeAttribute('data-tab-active');
                } else {
                    panel.setAttribute('aria-hidden', 'false');
                    panel.setAttribute('data-tab-active', '');
                }
            });

            window.dispatchEvent(new Event("resize"));

        };
    
        const keyboardEvent = function(tabLink, tabLinks, tabPanels, tabItems, index, e) {

            let keyCode = e.keyCode;
            let currentTab = tabLinks[index];
            let previousTab = tabLinks[index - 1];
            let nextTab = tabLinks[index + 1];
            let firstTab = tabLinks[0];
            let lastTab = tabLinks[tabLinks.length - 1];
    
     
            switch (keyCode) {
                case 'ArrowLeft':
                case 37:
                    e.preventDefault();
    
                    if (!previousTab) {
                        lastTab.focus();
                    } else {
                        previousTab.focus();
                    }
                    break;
    
                case 'ArrowRight':
                case 39:
                    e.preventDefault();
    
                    if (!nextTab) {
                        firstTab.focus();
                    } else {
                        nextTab.focus();
                    }
                    break;
            }
    
        };


      
        tabList.setAttribute('role','tablist');
        tabItems.forEach(function(item, index) {
    
            let link = item.querySelector('a');
    
            
            tabLinks.push(link);
            item.setAttribute('role', 'presentation');
    
            if (index == 0) {
                item.setAttribute('data-tab-active', '');
            }
    
        });
    
      
        tabLinks.forEach(function(link, i) {
            let anchor = link.getAttribute('href').split('#')[1];
            let attributes = {
                'id': 'tab-link-' + i,
                'role': 'tab',
                'tabIndex': '-1',
                'aria-selected': 'false',
                'aria-controls': anchor
            };
     
            if (i == 0) {
                attributes['aria-selected'] = 'true';
                attributes.tabIndex = '0';
                link.setAttribute('data-tab-active', '');
            };
    
            
            for (var key in attributes) {
                link.setAttribute(key, attributes[key]);
            }
                  
         
            link.addEventListener('click', function(e) {
                e.preventDefault();
            });
          
           
            link.addEventListener('focus', function(e) {
                tabClickEvent(this, tabLinks, tabPanels, i, e);
            });
    
   
            link.addEventListener('keydown', function(e) {
                keyboardEvent(link, tabLinks, tabPanels, tabItems, i, e);
            });
        });
    
        
        tabPanels.forEach(function(panel, i) {
    
            let attributes = {
                'role': 'tabpanel',
                'aria-hidden': 'true',
                'aria-labelledby': 'tab-link-' + i
            };
          
            if (nextTab) {
                let nextTabLink = document.createElement('a');
                let nextTabLinkIndex = (i < tabPanels.length - 1) ? i + 1 : 0;

          
                nextTabLink.setAttribute('href', '#tab-link-' + nextTabLinkIndex);
                nextTabLink.textContent = 'Next Tab';
                panel.appendChild(nextTabLink);
            }
               
            if (i == 0) {
                attributes['aria-hidden'] = 'false';
                panel.setAttribute('data-tab-active', '');
            }
    
            for (let key in attributes) {
                panel.setAttribute(key, attributes[key]);
            }
        });
    };


 
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box) {
            box.addEventListener('click', function(event) {
                if (event.target.matches('.alert-box__close')) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add('hideit');

                    setTimeout(function(){
                        box.style.display = 'none';
                    }, 500)
                }
            });
        })
    };


 
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; 

 
    const ssBackToTop = function() {
 
        const pxShow = 800;
        const goTopButton = document.querySelector('.ss-go-top');

        if (!goTopButton) return;

   
        if (window.scrollY >= pxShow) goTopButton.classList.add('link-is-visible');

        window.addEventListener('scroll', function() {
            if (window.scrollY >= pxShow) {
                if(!goTopButton.classList.contains('link-is-visible')) goTopButton.classList.add('link-is-visible')
            } else {
                goTopButton.classList.remove("link-is-visible")
            }
        });
    }; 


 
    const ssRevealingEffect = function() {

        const intro = document.querySelector('.s-intro');
        const details = document.querySelector('.s-details');

        if (!(intro && details)) return;

        const checkpoint = intro.offsetHeight;
        let opacity;

        details.style.bottom = (window.innerHeight - details.offsetHeight) + 'px';

        window.addEventListener('resize', function() {
            details.style.bottom = (window.innerHeight - details.offsetHeight) + 'px';
        });

        window.addEventListener('scroll', function() {

            const currentScroll = window.pageYOffset;

            if (currentScroll <= checkpoint) {
                opacity = 1 - currentScroll / checkpoint;
            } else {
                opacity = 0;
            }

            details.style.setProperty('--overlay-opacity', opacity);
        });

    };

 
    (function ssInit() {

        ssPreloader();
        ssCountdown();
        ssModal();
        ssSwiper();
        ssMailChimpForm();
        sstabs();
        ssAlertBoxes();
        ssMoveTo();
        ssBackToTop();
        ssRevealingEffect();

    })();

})(document.documentElement);