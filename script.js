// Vanilla JS debounce function, by Josh W. Comeau:
// https://www.joshwcomeau.com/snippets/javascript/debounce/
function debounce(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

// Define variables for search field
let searchFormFilledClassName = 'search-has-value';
let searchFormSelector = "form[role='search']";

// Clear the search input, and then return focus to it
function clearSearchInput(event) {
  event.target.closest(searchFormSelector).classList.remove(searchFormFilledClassName);

  let input;
  if (event.target.tagName === 'INPUT') {
    input = event.target;
  } else if (event.target.tagName === 'BUTTON') {
    input = event.target.previousElementSibling;
  } else {
    input = event.target.closest('button').previousElementSibling;
  }
  input.value = '';
  input.focus();
}

// Have the search input and clear button respond
// when someone presses the escape key, per:
// https://twitter.com/adambsilver/status/1152452833234554880
function clearSearchInputOnKeypress(event) {
  const searchInputDeleteKeys = ['Delete', 'Escape'];
  if (searchInputDeleteKeys.includes(event.key)) {
    clearSearchInput(event);
  }
}

// Create an HTML button that all users -- especially keyboard users --
// can interact with, to clear the search input.
// To learn more about this, see:
// https://adrianroselli.com/2019/07/ignore-typesearch.html#Delete
// https://www.scottohara.me/blog/2022/02/19/custom-clear-buttons.html
function buildClearSearchButton(inputId) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-controls', inputId);
  button.classList.add('clear-button');
  const buttonLabel = window.searchClearButtonLabelLocalized;
  const icon = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' role='img' viewBox='0 0 12 12' aria-label='${buttonLabel}'><path stroke='currentColor' stroke-linecap='round' stroke-width='2' d='M3 9l6-6m0 6L3 3'/></svg>`;
  button.innerHTML = icon;
  button.addEventListener('click', clearSearchInput);
  button.addEventListener('keyup', clearSearchInputOnKeypress);
  return button;
}

// Append the clear button to the search form
function appendClearSearchButton(input, form) {
  searchClearButton = buildClearSearchButton(input.id);
  form.append(searchClearButton);
  if (input.value.length > 0) {
    form.classList.add(searchFormFilledClassName);
  }
}

// Add a class to the search form when the input has a value;
// Remove that class from the search form when the input doesn't have a value.
// Do this on a delay, rather than on every keystroke.
const toggleClearSearchButtonAvailability = debounce(function (event) {
  const form = event.target.closest(searchFormSelector);
  form.classList.toggle(searchFormFilledClassName, event.target.value.length > 0);
}, 200);

document.addEventListener('DOMContentLoaded', function () {
  // Key map
  var ENTER = 13;
  var ESCAPE = 27;
  var SPACE = 32;
  var UP = 38;
  var DOWN = 40;
  var TAB = 9;

  function closest(element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (
        (Element.prototype.matches && element.matches(selector)) ||
        (Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)) ||
        (Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector))
      ) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // Set up clear functionality for the search field
  const searchForms = [...document.querySelectorAll(searchFormSelector)];
  const searchInputs = searchForms.map((form) => form.querySelector("input[type='search']"));
  searchInputs.forEach((input) => {
    appendClearSearchButton(input, input.closest(searchFormSelector));
    input.addEventListener('keyup', clearSearchInputOnKeypress);
    input.addEventListener('keyup', toggleClearSearchButtonAvailability);
  });

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // In some cases we should preserve focus after page reload
  function saveFocus() {
    var activeElementId = document.activeElement.getAttribute('id');
    sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
  }
  var returnFocusTo = sessionStorage.getItem('returnFocusTo');
  if (returnFocusTo) {
    sessionStorage.removeItem('returnFocusTo');
    var returnFocusToEl = document.querySelector(returnFocusTo);
    returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
  }

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector('.comment-container textarea'),
    commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
      commentContainerFormControls.style.display = 'block';
      commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
    });

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block';
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector(
      '.request-container .comment-container .comment-show-container',
    ),
    requestCommentFields = document.querySelectorAll(
      '.request-container .comment-container .comment-fields',
    ),
    requestCommentSubmit = document.querySelector(
      '.request-container .comment-container .request-submit-comment',
    );

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function () {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function (e) {
        e.style.display = 'block';
      });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector(
      '.request-container .mark-as-solved:not([data-disabled])',
    ),
    requestMarkAsSolvedCheckbox = document.querySelector(
      '.request-container .comment-container input[type=checkbox]',
    ),
    requestCommentSubmitButton = document.querySelector(
      '.request-container .comment-container input[type=submit]',
    );

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function () {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector(
    '.request-container .comment-container textarea',
  );

  var usesWysiwyg = requestCommentTextarea && requestCommentTextarea.dataset.helper === 'wysiwyg';

  function isEmptyPlaintext(s) {
    return s.trim() === '';
  }

  function isEmptyHtml(xml) {
    var doc = new DOMParser().parseFromString(`<_>${xml}</_>`, 'text/xml');
    var img = doc.querySelector('img');
    return img === null && isEmptyPlaintext(doc.children[0].textContent);
  }

  var isEmpty = usesWysiwyg ? isEmptyHtml : isEmptyPlaintext;

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function () {
      if (isEmpty(requestCommentTextarea.value)) {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText =
            requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute(
            'data-solve-and-submit-translation',
          );
        }
        requestCommentSubmitButton.disabled = false;
      }
    });
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && isEmpty(requestCommentTextarea.value)) {
    requestCommentSubmitButton.disabled = true;
  }

  // Submit requests filter form on status or organization change in the request list page
  Array.prototype.forEach.call(
    document.querySelectorAll('#request-status-select, #request-organization-select'),
    function (el) {
      el.addEventListener('change', function (e) {
        e.stopPropagation();
        saveFocus();
        closest(this, 'form').submit();
      });
    },
  );

  // Submit requests filter form on search in the request list page
  var quickSearch = document.querySelector('#quick-search');
  quickSearch &&
    quickSearch.addEventListener('keyup', function (e) {
      if (e.keyCode === ENTER) {
        e.stopPropagation();
        saveFocus();
        closest(this, 'form').submit();
      }
    });

  var menuButton = document.getElementById('collapsible-sidebar-toggle');
  var menuList = document.querySelector('#user-nav-mobile');

  function toggleNavigation(toggle, menu) {
    var isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
    toggle.setAttribute('aria-expanded', !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute('aria-expanded', false);
    toggle.setAttribute('aria-expanded', false);
    toggle.focus();
  }
  if (menuButton) {
    menuButton.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleNavigation(this, menuList);
    });
  }

  if (menuButton) {
    menuList.addEventListener('keyup', function (e) {
      if (e.keyCode === ESCAPE) {
        e.stopPropagation();
        closeNavigation(menuButton, this);
      }
    });
  }

  // Toggles expanded aria to collapsible elements
  var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');

  Array.prototype.forEach.call(collapsible, function (el) {
    var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');

    el.addEventListener('click', function (e) {
      toggleNavigation(toggle, this);
    });

    el.addEventListener('keyup', function (e) {
      if (e.keyCode === ESCAPE) {
        closeNavigation(toggle, this);
      }
    });
  });

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function () {
      closest(this, 'form').submit();
    });
  }

  // If multibrand search has more than 5 help centers or categories collapse the list
  var multibrandFilterLists = document.querySelectorAll('.multibrand-filter-list');
  Array.prototype.forEach.call(multibrandFilterLists, function (filter) {
    if (filter.children.length > 6) {
      // Display the show more button
      var trigger = filter.querySelector('.see-all-filters');
      trigger.setAttribute('aria-hidden', false);

      // Add event handler for click
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        trigger.parentNode.removeChild(trigger);
        filter.classList.remove('multibrand-filter-list--collapsed');
      });
    }
  });

  // If there are any error notifications below an input field, focus that field
  var notificationElm = document.querySelector('.notification-error');
  if (
    notificationElm &&
    notificationElm.previousElementSibling &&
    typeof notificationElm.previousElementSibling.focus === 'function'
  ) {
    notificationElm.previousElementSibling.focus();
  }

  // Dropdowns

  function Dropdown(toggle, menu) {
    this.toggle = toggle;
    this.menu = menu;

    this.menuPlacement = {
      top: menu.classList.contains('dropdown-menu-top'),
      end: menu.classList.contains('dropdown-menu-end'),
    };

    this.toggle.addEventListener('click', this.clickHandler.bind(this));
    this.toggle.addEventListener('keydown', this.toggleKeyHandler.bind(this));
    this.menu.addEventListener('keydown', this.menuKeyHandler.bind(this));
  }

  Dropdown.prototype = {
    get isExpanded() {
      return this.menu.getAttribute('aria-expanded') === 'true';
    },

    get menuItems() {
      return Array.prototype.slice.call(this.menu.querySelectorAll("[role='menuitem']"));
    },

    dismiss: function () {
      if (!this.isExpanded) return;

      this.menu.setAttribute('aria-expanded', false);
      this.menu.classList.remove('dropdown-menu-end', 'dropdown-menu-top');
    },

    open: function () {
      if (this.isExpanded) return;

      this.menu.setAttribute('aria-expanded', true);
      this.handleOverflow();
    },

    handleOverflow: function () {
      var rect = this.menu.getBoundingClientRect();

      var overflow = {
        right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
        bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight,
      };

      if (overflow.right || this.menuPlacement.end) {
        this.menu.classList.add('dropdown-menu-end');
      }

      if (overflow.bottom || this.menuPlacement.top) {
        this.menu.classList.add('dropdown-menu-top');
      }

      if (this.menu.getBoundingClientRect().top < 0) {
        this.menu.classList.remove('dropdown-menu-top');
      }
    },

    focusNextMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var nextIndex =
        currentIndex === this.menuItems.length - 1 || currentIndex < 0 ? 0 : currentIndex + 1;

      this.menuItems[nextIndex].focus();
    },

    focusPreviousMenuItem: function (currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var previousIndex = currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1;

      this.menuItems[previousIndex].focus();
    },

    clickHandler: function () {
      if (this.isExpanded) {
        this.dismiss();
      } else {
        this.open();
      }
    },

    toggleKeyHandler: function (e) {
      switch (e.keyCode) {
        case ENTER:
        case SPACE:
        case DOWN:
          e.preventDefault();
          this.open();
          this.focusNextMenuItem();
          break;
        case UP:
          e.preventDefault();
          this.open();
          this.focusPreviousMenuItem();
          break;
        case ESCAPE:
          this.dismiss();
          this.toggle.focus();
          break;
      }
    },

    menuKeyHandler: function (e) {
      var firstItem = this.menuItems[0];
      var lastItem = this.menuItems[this.menuItems.length - 1];
      var currentElement = e.target;

      switch (e.keyCode) {
        case ESCAPE:
          this.dismiss();
          this.toggle.focus();
          break;
        case DOWN:
          e.preventDefault();
          this.focusNextMenuItem(currentElement);
          break;
        case UP:
          e.preventDefault();
          this.focusPreviousMenuItem(currentElement);
          break;
        case TAB:
          if (e.shiftKey) {
            if (currentElement === firstItem) {
              this.dismiss();
            } else {
              e.preventDefault();
              this.focusPreviousMenuItem(currentElement);
            }
          } else if (currentElement === lastItem) {
            this.dismiss();
          } else {
            e.preventDefault();
            this.focusNextMenuItem(currentElement);
          }
          break;
        case ENTER:
        case SPACE:
          e.preventDefault();
          currentElement.click();
          break;
      }
    },
  };

  var dropdowns = [];
  var dropdownToggles = Array.prototype.slice.call(document.querySelectorAll('.dropdown-toggle'));

  dropdownToggles.forEach(function (toggle) {
    var menu = toggle.nextElementSibling;
    if (menu && menu.classList.contains('dropdown-menu')) {
      dropdowns.push(new Dropdown(toggle, menu));
    }
  });

  document.addEventListener('click', function (evt) {
    dropdowns.forEach(function (dropdown) {
      if (!dropdown.toggle.contains(evt.target)) {
        dropdown.dismiss();
      }
    });
  });

  /* Desktop Navbar Animations
   ***********************************************************************/

  function getCookie(a) {
    if (typeof document !== 'undefined') {
      const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
      return b ? b.pop() : '';
    }
    return false;
  }
  const cookie = getCookie('getpostmanlogin');
  // Checks if login cookie exists and changes link in uber-nav from 'sign in' to 'launch postman'.
  // Hides 'register' button if signed in

  if (cookie !== 'yes') {
    const signInButton = document.querySelector('.nav-sign-in-button');
    const signUpButton = document.querySelector('.nav-sign-up-button');
    signInButton.classList.remove('d-none');
    signInButton.setAttribute(
      'href',
      'https://identity.getpostman.com/login?continue=https%3A%2F%2Fgo.postman.co%2Fbuild',
    );
    signUpButton.classList.remove('d-none');
    signUpButton.setAttribute(
      'href',
      'https://identity.getpostman.com/signup?continue=https%3A%2F%2Fgo.postman.co%2Fbuild',
    );
  } else {
    const launchPostmanButton = document.querySelector('.nav-launch-postman-button');
    launchPostmanButton.classList.remove('d-none');
    launchPostmanButton.setAttribute('href', 'https://go.postman.co/build');
  }

  /* Postman Status API
   ***********************************************************************/

  function setStatusIcon(icon) {
    const statusResponse = document.getElementById('pm-status');
    let fontAwesomeIcon = document.createElement('i');
    fontAwesomeIcon.className = icon;
    return statusResponse.prepend(fontAwesomeIcon);
  }

  const statusResponse = document.getElementById('pm-status');
  if (statusResponse !== null || undefined) {
    let postmanStatusAPI = new StatusPage.page({ page: 'ms1frkqnsp7r' });
    postmanStatusAPI.status({
      success: function (data) {
        const { indicator, description } = data.status;
        if (indicator === 'none') {
          statusResponse.prepend(`${description}. `);
          setStatusIcon(`icon-indicator fa-solid fa-check status-green`);
        } else if (indicator === 'minor') {
          statusResponse.prepend(`${description}. `);
          setStatusIcon('icon-indicator fa-solid fa-square-minus status-yellow');
        } else if (indicator === 'major') {
          statusResponse.prepend(`${description}. `);
          setStatusIcon('icon-indicator fa-solid fa-xmark status-red');
        } else if (indicator === 'critical') {
          statusResponse.prepend(`${description}. `);
          setStatusIcon('icon-indicator fa-solid fa-wrench status-blue');
        } else if (indicator === '') {
          statusResponse.prepend(`We're having issues retrieving data for Postman.`);
        }
      },
    });
  }

  /* Navbar Global and Secondary
   ***********************************************************************/
  $('.mobile-icon-button_caret').bind('click', function () {
    $('.icon-caret').toggleClass('open');
  });

  // Brandon animations start
  $('#secondaryNav').on('click', function () {
    $('body').toggleClass('menu-open');
    $('.nav-primary').toggleClass('activeMenu');
    $('.nav-secondary').toggleClass('activeMenu');
  });

  function showBsDropdown() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown(225);
    $(this).find('.arrow-icon').addClass('show');
  }

  function hideBsDropdown() {
    $(this).find('.dropdown-menu').stop(true, true).slideUp(225);
    $(this).find('.arrow-icon').removeClass('show');
  }
  $('.dropdown').on('show.bs.dropdown', showBsDropdown);
  $('.dropdown').on('hide.bs.dropdown', hideBsDropdown);

  function toggleGlobalNav() {
    // Global Mobile Icon Transition
    const toggler = document.getElementById('postman-primary-nav').getAttribute('aria-expanded');
    const body = document.querySelector('body');
    const icon1 = document.querySelector('#icon-wrap-one');
    if (toggler === 'true') {
      body.classList.add('lock');
      icon1.classList.add('open');
    } else {
      icon1.classList.remove('open');
      body.classList.remove('lock');
      const icon2 = document.getElementById('navbar-chevron-icons');
      const togglerSecondary = document
        .querySelector('#secondaryNav.navbar-toggler')
        .getAttribute('aria-expanded');
      if (togglerSecondary === 'true') {
        icon2.classList.remove('open');
      }
    }
  }

  let primaryNav = document.getElementById('postman-primary-nav');
  primaryNav.addEventListener('click', function (e) {
    toggleGlobalNav();
  });

  function showTargetElement() {
    const toggler = document.getElementById('secondaryNav').getAttribute('aria-expanded');
    const toggleChevron = document.getElementById('navbar-chevron-icons');
    if (toggler === 'false') {
      toggleChevron.classList.remove('open');
    } else {
      toggleChevron.classList.add('open');
    }
  }
  let secondaryNav = document.getElementById('secondaryNav');
  secondaryNav.addEventListener('click', function (e) {
    showTargetElement();
  });
  //  animations finish
});

// Notification Banner
if (window.location.href == "https://support.postman.com/hc/en-us") {
  document.addEventListener('DOMContentLoaded', async function () {
    // Article label to be considered for the alerts
    const label = 'Alert'
  
    // Show the article body within the alertbox? (Boolean: true/false)
    const showArticleBody = true
  
    // Get current help center locale
    const locale = document
      .querySelector('html')
      .getAttribute('lang')
      .toLowerCase()
  
    // URL to be called to get the alert data
    const url = `/api/v2/help_center/${locale}/articles.json?label_names=${label}`
  
    // Raw data collected from the endpoint above
    const data = await (await fetch(url)).json()
  
    // List of articles returned
    const articles = (data && data.articles) || []
  
    // Handle returned articles
    for (let i = 0; i < articles.length; i++) {
      const url = articles[i].html_url
      const title = articles[i].title
      const body = articles[i].body
  
      const html = `
        <div class="ns-box ns-bar ns-effect-slidetop ns-type-notice ns-show">
          <div class="ns-box-inner">
            ${showArticleBody ? `<p>${body}</p>` : ''} 
            <span class="ns-close">
            </span>
          </div>
        </div>
      `
  
      // Append current alert to the alertbox container
      document.querySelector('.alertbox').insertAdjacentHTML('beforeend', html)
    }
  })
  
  document.addEventListener('click', function (event) {
    // Close alertbox
    if (event.target.matches('.ns-close')) {
      event.preventDefault()
      event.target.parentElement.remove()
    }
  });
}


jQuery(document).ready(function () {
  /* pmtSDK
  ***********************************************************************/
  window.pmt = function () { var t = { version: "v2.0.4", log: function (e) { t.output = t.output || [], t.output.push(e) }, set: function (e, n) { t[e] = n }, getPubId: function () { return (document.cookie.match("(^|;) ?_PUB_ID=([^;]*)(;|$)") || [])[2] }, drivePubId: function (e) { const n = window.location.href, o = "pub_id="; let c, a; if (n.match(o)) { if (a = n.split(o).pop().split("&").shift(), c = "_PUB_ID=" + a + "; path=/", document.cookie = c, e) { let t = n.replace(o + a, ""); t = t.replace("?&", "?"), t = t.replace("&&", "&"); t.split("?").pop() || (t = t.split("?").shift()); const e = t.length - 1; "&" === t.charAt(e) && (t = t.substring(0, e)), window.location.replace(t) } return c } return t.getPubId() }, driveCampaignId: function (t) { let e; const n = "dcid=", o = t && t.dcid || window.location.search && window.location.search.match(n) && window.location.search.split(n).pop().split("&").shift() || (document.cookie.match("(^|;) ?dcid=([^;]*)(;|$)") || [])[2]; let c, a; const i = t && t.form, r = t && t.url || window.location.href; return function (t) { const e = t; let c; const a = o && o.replace(n, ""); t && (e.tagName ? o && !e.driver_campaign_id && (c = document.createElement("input"), c.type = "hidden", c.name = "driver_campaign_id", c.value = a, e.appendChild(c)) : o && (e.driver_campaign_id = a)) }(i), r.match(n) ? (c = r.split(n).pop().split("&").shift(), a = new Date, a.setDate(a.getDate() + 30), e = "dcid=" + c + "; expires=" + a.toUTCString() + "; path=/", document.cookie = e, e) : t }, enablePostmanAnalytics: function (e, n, o) { if ("function" != typeof e || e.postmanAnalyticsEnabled || navigator.doNotTrack && !n._disableDoNotTrack) return e; function c(t) { return t.replace(/"/gi, '"') } function a(t) { return "string" == typeof t && t.split(window.location.host).pop() } return n || (n = {}), e.postmanAnalyticsEnabled = !0, function (i, r, d, s) { const l = "load" !== r || window.location.href !== t.currentURL; if (!l) return !1; e.apply(this, arguments); const u = "gtm.uniqueEventId"; let p, m, f, h; const g = r || o; t.initCategory || (t.initCategory = i); const w = { category: i, action: g, indexType: "client-events", property: n._property || document.location.host, traceId: t.traceId || n._traceId || "anonymous", timestamp: (new Date).toISOString() }, y = a(t.currentURL) || document.referrer || t.externalURL || ""; w.meta = { url: a(y) }, d && (w.entityId = d), "load" === w.action && w.entityId && document.body && document.body.id && (w.entityId = w.entityId + "#" + document.body.id), s && (p = parseInt(s, 10), m = p && !p.isNaN && p || null, h = "string" == typeof s, f = h && s.match(":") && s.split(":").pop() || h && s || "object" == typeof s && c(JSON.stringify(s)) || "", m && (w.value = m), f && (d ? w.entityId += ":" + f : w.entityId = f)); const b = Object.keys(n) || []; function k(t) { const e = new XMLHttpRequest; e.open("POST", n._url), e.setRequestHeader("Accept", "application/json"), e.setRequestHeader("Content-type", "text/plain"), e.send(t) } function I(t, e) { const n = t && t.split(",") || [], o = n.length; let c, a; for (c = 0; c < o; c += 1) { const t = n[c]; if (a = -1 !== e.indexOf(t), a) break } return a } b.forEach((function (t) { "_" !== t.charAt(0) && (w[t] = n[t]) })), r || "object" != typeof i || (w.action = i.action || i.event || i[Object.keys(i)[0]], i[u] && (w.category = u + "-" + i[u])), "local" === w.env && (w.env = "beta"), "object" == typeof w.category && w.category && "string" == typeof w.category.category && (w.category = w.category.category), ["category", "event", "label"].forEach((function (t) { "object" == typeof w[t] && (w[t] = w[t] && c(JSON.stringify(w[t]))) })), w.userId = t.getPubId() || (document.cookie.match("(^|;) ?_pm=([^;]*)(;|$)") || [])[2] || w.userId, t.userId = w.userId; const v = t.traceId.split("|").pop(); return t.traceId = t.traceId.split(v).shift() + t.userId, window.name = t.traceId, w.category && w.action && "function" == typeof n.fetch && n.fetch(n._url, w) || w.entityId && "object" == typeof document && (() => { const e = n._allow && I(n._allow, document.location.pathname) || !n._allow && !0, o = n._disallow && I(n._disallow, document.location.pathname), c = btoa(JSON.stringify(w)); if (e && !o) { if (fetch) { if ("load" === w.action) { if (w.action && !l) return t.trackIt(), !1; w.entityId = w.entityId.split("#").shift() } t.traceId && (w.traceId = t.traceId), fetch(n._url, { method: "POST", headers: { Accept: "text/html", "Content-Type": "text/html" }, body: c, mode: "no-cors", keepalive: !0 }).catch((function (e) { t.log(e) })), t.event = w } else k(c); t.currentURL = window.location.href, -1 === w.meta.url.indexOf(document.location.host) && (t.externalURL = w.meta.url) } })(), !0 } }, ga: function () { "function" == typeof window.ga && window.ga.apply(this, arguments) }, getEnv: function (t) { let e; e = "production"; const n = t || document.location.hostname; return ["beta", "local", "stag"].forEach((function (t) { n.match(t) && (e = t) })), e }, setScalp: function (e) { if ("object" == typeof window) { const n = (document.location.search && document.location.search.match("dcid=([^;]*)(;|$)") || [])[1], o = n && n.split("&").shift() || (document.cookie.match("(^|;) ?dcid=([^;]*)(;|$)") || [])[2], c = document.location.search.substr(1).split("&"), a = []; c.forEach((t => { const e = t.match("([UTM|utm].*)=([^;]*)(;|$)"); e && (-1 !== e[0].indexOf("utm") || -1 !== e[0].indexOf("UTM")) && a.push(e[0]) })); const i = document.location.host.split("."), r = i.pop(), d = i.pop(), s = a.length && a.join(".") || "", l = "PM.", u = l + btoa((new Date).toISOString()), p = window.name && window.name.match("|PM.") && window.name.split("|").pop() || (document.cookie.match("(^|;) ?_pm=([^;]*)(;|$)") || [])[2], m = function (t) { const e = new Date; return e.setDate(e.getDate() + 1080), "_pm=" + t + "; expires=" + e.toUTCString() + "; domain=." + d + "." + r + "; path=/" }; (function (t) { const e = -1 !== document.cookie.indexOf("_pm"), n = -1 === t.indexOf(l), o = -1 !== document.cookie.indexOf(l); (!e || n || !window.location.hostname.match(/\.postman.com/) && o) && (document.cookie = m(t)) })(p || u); const f = "pm" + btoa((new Date).getTime()); "string" == typeof window.name && "pm" === window.name.substring(0, 2) || (o && -1 === window.name.indexOf("DCID.") ? window.name = f + "|DCID." + o + (s && "|" + s || "") + "|" + (p || u) : window.name = f + (s && "|" + s || "") + "|" + (p || u)); const h = window.parent && window.parent.name || window.name, g = function () { t.scalpCount || (t.scalpCount = 0), t.scalpCount += 1 }, w = t.getPubId() || p || window.name.split("|").pop(), y = { env: "function" == typeof t.getEnv && t.getEnv() || "production", type: "events-website", userId: w, _allow: !e.disallow && e.allow, _disableDoNotTrack: void 0 === e.disableDoNotTrack || e.disableDoNotTrack, _disallow: !e.allow && e.disallow, _property: e.property || document.location.host, _traceId: h }, b = y.env.match("prod") ? "https://bi.pst.tech/events" : "https://bi-beta.pst.tech/events"; y._url = e.url || b, document.cookie = "_pm.traceId=" + h + "; domain=." + d + "." + r + "; path=/", t.scalp = t.enablePostmanAnalytics(g, y), t.traceId = h, t.userId = w } }, getTraceUrl: function (e) { const n = -1 !== e.indexOf("?") ? "&" : "?"; return e + n + "trace=" + t.traceId }, trace: function (e) { document.location.href = t.getTraceUrl(e) }, getUtmUrl: function (e) { const n = -1 !== e.indexOf("?") ? "&" : "?", o = t.traceId.split(".").pop(), c = t.traceId.split("." + o).shift().substr(1).split("."), a = []; return c.forEach((t => { const e = t.match("([UTM|utm].*)=([^;]*)(;|$)"); e && (-1 !== e[0].indexOf("utm") || -1 !== e[0].indexOf("UTM")) && a.push(e[0]) })), e + n + (a.length && a.join("&") || "utm=" + document.location.host) }, utm: function (e) { let n = t.getUtmUrl(e); n.match("trace=") || (n = n + "&trace=" + t.traceId), document.location.href = n }, trackClicks: function (e, n) { const o = function (o) { const c = document.body && document.body.id && "#" + document.body.id || ""; if (e) { const a = o.target.getAttribute(e); a && t.scalp(n || t.initCategory, "click", "target", c + a) } else if (!e && ("string" == typeof o.target.className || "string" == typeof o.target.id)) { const e = o.target.className || o.target.id || o.target.parentNode.className || -1; if ("string" == typeof e) { const a = document.location.pathname + c + ":" + o.target.tagName + "." + e.split(" ").join("_"); try { t.scalp(n || t.initCategory, "click", a) } catch (e) { t.log(e.message) } } } }; document.body.getAttribute("data-trackClicks") || document.body.addEventListener("mousedown", o, !0), document.body.setAttribute("data-trackClicks", e || "default") }, driveTrack: function (e) { let n; const o = "_track=", c = e && e._track || window.location.search && window.location.search.match(o) && window.location.search.split(o).pop().split("&").shift() || (document.cookie.match("(^|;) ?_track=([^;]*)(;|$)") || [])[2], a = e && e.url || window.location.href, i = t.getEnv(), r = i.match("stag") ? "stage" : i; return t.tracking = !0, t.trackIt(), a.match(o) ? (n = "postman-" + r + ".track=" + c + "; path=/", document.cookie = n, n) : e }, trackIt: function () { const e = (document.cookie.match("(^|;) ?postman-[a-z]+.track=([^;]*)(;|$)") || [])[2]; if (e && t.tracking) { let t = document.location.href; const n = -1 === t.indexOf("?") ? "?" : "&"; -1 === t.indexOf("_track") && "default" !== e && (t = `${t}${n}_track=${e}`, document.location.replace(t)) } }, xhr: function (t, e) { const n = new XMLHttpRequest, o = "t=" + (new Date).getTime(), c = -1 === t.indexOf("?") ? "?" : "&", a = t + c + o; n.withCredentials = !0, n.addEventListener("readystatechange", (function () { 4 === this.readyState && e(this.responseText) })), n.open("GET", a), n.send() }, bff: function (e, n, o) { const c = (o ? "/mkapi/" : "https://www.postman.com/mkapi/") + e + ".json"; t.xhr(c, n) }, rt: function (e) { t.bff("pmTech", (function (n) { if (n) { const o = "pmTechSDK-runtime"; if (!document.getElementById(o)) try { const c = JSON.parse(n), a = atob(c.pmTech), i = c.config && c.config[e]; if (-1 === a.indexOf(t.version)) { const t = document.createElement("script"); t.setAttribute("id", o), t.innerHTML = a, document.head.appendChild(t); const e = document.getElementById("pmTechConfig"), n = i || e && e.innerText || document.getElementById("pmTechSDK").innerText.split("<pmTechConfig>").pop(); if (n) { const t = document.createElement("script"); t.setAttribute("id", "pmTechConfig-runtime"), t.innerText = n.split("</pmTechConfig>").shift(), document.head.appendChild(t) } } } catch (e) { t.log(e) } } }), "localhost" === document.location.hostname || !!document.location.hostname.match(/\.postman(-beta)?\.com/)) } }; return t.universal && t.rt(t.universal), setTimeout((function () { const t = document.getElementById("pmTechSDK"), e = t && t.getAttribute("data-track-category") || "pm-analytics", n = t && t.getAttribute("data-track-property"), o = t && t.getAttribute("data-track-url"), c = t && "false" !== t.getAttribute("data-track-disable-do-not-track"), a = t && "true" === t.getAttribute("data-drive-track"), i = t && "false" !== t.getAttribute("data-drive-campaign-id"), r = t && "false" !== t.getAttribute("data-drive-pub-id"), d = t && "false" !== t.getAttribute("data-track-load"), s = t && "false" !== t.getAttribute("data-track-clicks"), l = s && t.getAttribute("data-track-clicks-attribute") || null; if (n) { const t = { property: n }; o && (t.url = o), c && (t.disableDoNotTrack = c), window.pmt("setScalp", [t]), d && window.pmt("scalp", [e, "load", document.location.pathname]), s && window.pmt("trackClicks", [l, e]), i && window.pmt("driveCampaignId"), r && window.pmt("drivePubId", [!0]), a && window.pmt("driveTrack") } }), 1e3), function (e, n) { return t[e] ? "function" == typeof t[e] ? t[e].apply(t, n) : t[e] : null } }();

  /* pmtConfig
  ***********************************************************************/
  window.pmt('setScalp', [{ property: 'postman-support-center' }]);
  window.pmt('scalp', ['pm-analytics', 'load', document.location.pathname]);
  window.pmt('trackClicks', []);

});