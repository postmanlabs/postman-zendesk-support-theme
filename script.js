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
let searchFormFilledClassName = "search-has-value";
let searchFormSelector = "form[role='search']";

// Clear the search input, and then return focus to it
function clearSearchInput(event) {
  event.target.closest(searchFormSelector).classList.remove(searchFormFilledClassName);
  
  let input;
  if (event.target.tagName === "INPUT") {
    input = event.target;
  } else if (event.target.tagName === "BUTTON") {
    input = event.target.previousElementSibling;
  } else {
    input = event.target.closest("button").previousElementSibling;
  }
  input.value = "";
  input.focus();
}

// Have the search input and clear button respond 
// when someone presses the escape key, per:
// https://twitter.com/adambsilver/status/1152452833234554880
function clearSearchInputOnKeypress(event) {
  const searchInputDeleteKeys = ["Delete", "Escape"];
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
  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute("aria-controls", inputId);
  button.classList.add("clear-button");
  const buttonLabel = window.searchClearButtonLabelLocalized;
  const icon = `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' role='img' viewBox='0 0 12 12' aria-label='${buttonLabel}'><path stroke='currentColor' stroke-linecap='round' stroke-width='2' d='M3 9l6-6m0 6L3 3'/></svg>`;
  button.innerHTML = icon;
  button.addEventListener("click", clearSearchInput);
  button.addEventListener("keyup", clearSearchInputOnKeypress);
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
const toggleClearSearchButtonAvailability = debounce(function(event) {
  const form = event.target.closest(searchFormSelector);
  form.classList.toggle(searchFormFilledClassName, event.target.value.length > 0);
}, 200)

document.addEventListener('DOMContentLoaded', function() {
  // Key map
  var ENTER = 13;
  var ESCAPE = 27;
  var SPACE = 32;
  var UP = 38;
  var DOWN = 40;
  var TAB = 9;

  function closest (element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (Element.prototype.matches && element.matches(selector)
        || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
        || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // Set up clear functionality for the search field
  const searchForms = [...document.querySelectorAll(searchFormSelector)];
  const searchInputs = searchForms.map(form => form.querySelector("input[type='search']"));
  searchInputs.forEach((input) => {
    appendClearSearchButton(input, input.closest(searchFormSelector));
    input.addEventListener("keyup", clearSearchInputOnKeypress);
    input.addEventListener("keyup", toggleClearSearchButtonAvailability);
  });

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // In some cases we should preserve focus after page reload
  function saveFocus() {
    var activeElementId = document.activeElement.getAttribute("id");
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
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
    requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
    requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function() {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

  var usesWysiwyg = requestCommentTextarea && requestCommentTextarea.dataset.helper === "wysiwyg";

  function isEmptyPlaintext(s) {
    return s.trim() === '';
  }

  function isEmptyHtml(xml) {
    var doc = new DOMParser().parseFromString(`<_>${xml}</_>`, "text/xml");
    var img = doc.querySelector("img");
    return img === null && isEmptyPlaintext(doc.children[0].textContent);
  }

  var isEmpty = usesWysiwyg ? isEmptyHtml : isEmptyPlaintext;

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function() {
      if (isEmpty(requestCommentTextarea.value)) {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
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
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    });
  });

  // Submit requests filter form on search in the request list page
  var quickSearch = document.querySelector('#quick-search');
  quickSearch && quickSearch.addEventListener('keyup', function(e) {
    if (e.keyCode === ENTER) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    }
  });

//   function toggleNavigation(toggle, menu) {
//     var isExpanded = menu.getAttribute('aria-expanded') === 'true';
//     menu.setAttribute('aria-expanded', !isExpanded);
//     toggle.setAttribute('aria-expanded', !isExpanded);
//   }

//   function closeNavigation(toggle, menu) {
//     menu.setAttribute('aria-expanded', false);
//     toggle.setAttribute('aria-expanded', false);
//     toggle.focus();
//   }

//   var menuButton = document.querySelector('.header .menu-button-mobile');
//   var menuList = document.querySelector('#user-nav-mobile');

//   menuButton.addEventListener('click', function(e) {
//     e.stopPropagation();
//     toggleNavigation(this, menuList);
//   });


//   menuList.addEventListener('keyup', function(e) {
//     if (e.keyCode === ESCAPE) {
//       e.stopPropagation();
//       closeNavigation(menuButton, this);
//     }
//   });

  // Toggles expanded aria to collapsible elements
  var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');

  Array.prototype.forEach.call(collapsible, function(el) {
    var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');

    el.addEventListener('click', function(e) {
      toggleNavigation(toggle, this);
    });

    el.addEventListener('keyup', function(e) {
      if (e.keyCode === ESCAPE) {
        closeNavigation(toggle, this);
      }
    });
  });

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  // If multibrand search has more than 5 help centers or categories collapse the list
  var multibrandFilterLists = document.querySelectorAll(".multibrand-filter-list");
  Array.prototype.forEach.call(multibrandFilterLists, function(filter) {
    if (filter.children.length > 6) {
      // Display the show more button
      var trigger = filter.querySelector(".see-all-filters");
      trigger.setAttribute("aria-hidden", false);

      // Add event handler for click
      trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        trigger.parentNode.removeChild(trigger);
        filter.classList.remove("multibrand-filter-list--collapsed")
      })
    }
  });

  // If there are any error notifications below an input field, focus that field
  var notificationElm = document.querySelector(".notification-error");
  if (
    notificationElm &&
    notificationElm.previousElementSibling &&
    typeof notificationElm.previousElementSibling.focus === "function"
  ) {
    notificationElm.previousElementSibling.focus();
  }

  // Dropdowns
  
  function Dropdown(toggle, menu) {
    this.toggle = toggle;
    this.menu = menu;

    this.menuPlacement = {
      top: menu.classList.contains("dropdown-menu-top"),
      end: menu.classList.contains("dropdown-menu-end")
    };

    this.toggle.addEventListener("click", this.clickHandler.bind(this));
    this.toggle.addEventListener("keydown", this.toggleKeyHandler.bind(this));
    this.menu.addEventListener("keydown", this.menuKeyHandler.bind(this));
  }

  Dropdown.prototype = {

    get isExpanded() {
      return this.menu.getAttribute("aria-expanded") === "true";
    },

    get menuItems() {
      return Array.prototype.slice.call(this.menu.querySelectorAll("[role='menuitem']"));
    },

    dismiss: function() {
      if (!this.isExpanded) return;

      this.menu.setAttribute("aria-expanded", false);
      this.menu.classList.remove("dropdown-menu-end", "dropdown-menu-top");
    },

    open: function() {
      if (this.isExpanded) return;

      this.menu.setAttribute("aria-expanded", true);
      this.handleOverflow();
    },

    handleOverflow: function() {
      var rect = this.menu.getBoundingClientRect();

      var overflow = {
        right: rect.left < 0 || rect.left + rect.width > window.innerWidth,
        bottom: rect.top < 0 || rect.top + rect.height > window.innerHeight
      };

      if (overflow.right || this.menuPlacement.end) {
        this.menu.classList.add("dropdown-menu-end");
      }

      if (overflow.bottom || this.menuPlacement.top) {
        this.menu.classList.add("dropdown-menu-top");
      }

      if (this.menu.getBoundingClientRect().top < 0) {
        this.menu.classList.remove("dropdown-menu-top")
      }
    },

    focusNextMenuItem: function(currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var nextIndex = currentIndex === this.menuItems.length - 1 || currentIndex < 0 ? 0 : currentIndex + 1;

      this.menuItems[nextIndex].focus();
    },

    focusPreviousMenuItem: function(currentItem) {
      if (!this.menuItems.length) return;

      var currentIndex = this.menuItems.indexOf(currentItem);
      var previousIndex = currentIndex <= 0 ? this.menuItems.length - 1 : currentIndex - 1;

      this.menuItems[previousIndex].focus();
    },

    clickHandler: function() {
      if (this.isExpanded) {
        this.dismiss();
      } else {
        this.open();
      }
    },

    toggleKeyHandler: function(e) {
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

    menuKeyHandler: function(e) {
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
    }
  }

  var dropdowns = [];
  var dropdownToggles = Array.prototype.slice.call(document.querySelectorAll(".dropdown-toggle"));

  dropdownToggles.forEach(function(toggle) {
    var menu = toggle.nextElementSibling;
    if (menu && menu.classList.contains("dropdown-menu")) {
      dropdowns.push(new Dropdown(toggle, menu));
    }
  });

  document.addEventListener("click", function(evt) {
    dropdowns.forEach(function(dropdown) {
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
  const signUpButton =   document.querySelector('.nav-sign-up-button')
  signInButton.classList.remove("d-none");
  signInButton.setAttribute('href', 'https://identity.getpostman.com/login?continue=https%3A%2F%2Fgo.postman.co%2Fbuild');
  signUpButton.classList.remove("d-none");
 	signUpButton.setAttribute('href', 'https://identity.getpostman.com/signup?continue=https%3A%2F%2Fgo.postman.co%2Fbuild');
  }
  else {
        const launchPostmanButton = document.querySelector(".nav-launch-postman-button")
    launchPostmanButton.classList.remove("d-none")
           launchPostmanButton.setAttribute('href', 'https://go.postman.co/build');
  }



/* pmTechConfig
***********************************************************************/
// if (window.pm) {
//   if (typeof window.pm.setScalp === 'function') {
//     window.pm.setScalp({
//       property: 'postman-support-center'
//     });
//   }
//   if (typeof window.pm.scalp === 'function') {
//     window.pm.scalp(
//       'pm-analytics',
//       'load',
//       document.location.pathname
//     );
//   }
//   if (typeof window.pm.trackClicks === 'function') {
//     window.pm.trackClicks();
//   }
// }
/* End of loading */
});

/* pmTechSDK
***********************************************************************/
// let ns;"undefined"==typeof exports?(window.pm=window.pm||{},ns=window.pm):ns=exports,ns.version="v1.1.94",ns.runtime="object"==typeof window,ns.log=function(t){const n=window.pm.output||[];window.pm.output=n,n.push(t)},ns.driveCampaignId=function(t){let n;const e="dcid=",o=t&&t.dcid||window.location.search&&window.location.search.match(e)&&window.location.search.split(e).pop().split("&").shift()||(document.cookie.match("(^|;) ?dcid=([^;]*)(;|$)")||[])[2];let c,i;const a=t&&t.form,s=t&&t.url||window.location.href;return function(t){const n=t;let c;const i=o&&o.replace(e,"");t&&(n.tagName?o&&!n.driver_campaign_id&&(c=document.createElement("input"),c.type="hidden",c.name="driver_campaign_id",c.value=i,n.appendChild(c)):o&&(n.driver_campaign_id=i))}(a),s.match(e)?(c=s.split(e).pop().split("&").shift(),i=new Date,i.setDate(i.getDate()+30),n="dcid="+c+"; expires="+i.toUTCString()+"; path=/",document.cookie=n,n):t},ns.enablePostmanAnalytics=function(t,n,e){if("function"!=typeof t||t.postmanAnalyticsEnabled||navigator.doNotTrack)return t;function o(t){return t.replace(/"/gi,'"')}function c(t){return"string"==typeof t&&t.split(window.location.host).pop()}return n||(n={}),t.postmanAnalyticsEnabled=!0,function(i,a,s,d){const r="load"!==a||window.location.href!==ns.currentURL;if(!r)return!1;t.apply(this,arguments);const p="gtm.uniqueEventId";let l,m,u,w;const f=a||e;ns.initCategory||(ns.initCategory=i);const h={category:i,action:f,indexType:"client-events",property:n._property||document.location.host,traceId:n._traceId||"anonymous",timestamp:(new Date).toISOString()},g=c(ns.currentURL)||document.referrer||ns.externalURL||"";h.meta={url:c(g)},s&&(h.entityId=s),"load"===h.action&&h.entityId&&document.body&&document.body.id&&(h.entityId=h.entityId+"#"+document.body.id),d&&(l=parseInt(d,10),m=l&&!l.isNaN&&l||null,w="string"==typeof d,u=w&&d.match(":")&&d.split(":").pop()||w&&d||"object"==typeof d&&o(JSON.stringify(d))||"",m&&(h.value=m),u&&(s?h.entityId+=":"+u:h.entityId=u));const y=Object.keys(n)||[];function b(t){const e=new XMLHttpRequest;e.open("POST",n._url),e.setRequestHeader("Accept","application/json"),e.setRequestHeader("Content-type","text/plain"),e.send(t)}function k(t,n){const e=t&&t.split(",")||[],o=e.length;let c,i;for(c=0;c<o;c+=1){const t=e[c];if(i=-1!==n.indexOf(t),i)break}return i}return y.forEach((function(t){"_"!==t.charAt(0)&&(h[t]=n[t])})),a||"object"!=typeof i||(h.action=i.action||i.event||i[Object.keys(i)[0]],i[p]&&(h.category=p+"-"+i[p])),"local"===h.env&&(h.env="beta"),"object"==typeof h.category&&h.category&&"string"==typeof h.category.category&&(h.category=h.category.category),["category","event","label"].forEach((function(t){"object"==typeof h[t]&&(h[t]=h[t]&&o(JSON.stringify(h[t])))})),h.userId=ns.getPubId()||h.userId,h.category&&h.action&&"function"==typeof n.fetch&&n.fetch(n._url,h)||h.entityId&&"object"==typeof document&&(()=>{const t=n._allow&&k(n._allow,document.location.pathname)||!n._allow&&!0,e=n._disallow&&k(n._disallow,document.location.pathname),o=btoa(JSON.stringify(h));if(t&&!e){if(fetch){if("load"===h.action){if(h.action&&!r)return ns.trackIt(),!1;h.entityId=h.entityId.split("#").shift()}fetch(n._url,{method:"POST",headers:{Accept:"text/html","Content-Type":"text/html"},body:o,mode:"no-cors",keepalive:!0}).catch((function(t){window.pm.log(t)})),ns.event=h}else b(o);ns.currentURL=window.location.href,-1===h.meta.url.indexOf(document.location.host)&&(ns.externalURL=h.meta.url)}})(),!0}},ns.ga=function(){"function"==typeof window.ga&&window.ga.apply(this,arguments)},ns.getEnv=function(t){let n;n="production";const e=t||document.location.hostname;return["beta","local","stag"].forEach((function(t){e.match(t)&&(n=t)})),n},ns.getPubId=function(){return(document.cookie.match("(^|;) ?_PUB_ID=([^;]*)(;|$)")||[])[2]},ns.setScalp=function(t){if("object"==typeof window){const n=(document.location.search&&document.location.search.match("dcid=([^;]*)(;|$)")||[])[1],e=n&&n.split("&").shift()||(document.cookie.match("(^|;) ?dcid=([^;]*)(;|$)")||[])[2],o=document.location.search.substr(1).split("&"),c=[];o.forEach((t=>{const n=t.match("([UTM|utm].*)=([^;]*)(;|$)");n&&(-1!==n[0].indexOf("utm")||-1!==n[0].indexOf("UTM"))&&c.push(n[0])}));const i=document.location.host.split("."),a=i.pop(),s=i.pop(),d=c.length&&c.join(".")||"",r="PM."+btoa((new Date).toISOString()),p=window.name&&window.name.match("|PM.")&&window.name.split("|").pop()||(document.cookie.match("(^|;) ?_pm=([^;]*)(;|$)")||[])[2];if(!p){const t=new Date,n=1080;t.setDate(t.getDate()+n);const e="_pm="+r+"; expires="+t.toUTCString()+"; domain=."+s+"."+a+"; path=/";document.cookie=e}const l="pm"+btoa((new Date).getTime());"string"==typeof window.name&&"pm"===window.name.substring(0,2)||(e&&-1===window.name.indexOf("DCID.")?window.name=l+"|DCID."+e+(d&&"|"+d||"")+"|"+(p||r):window.name=l+(d&&"|"+d||"")+"|"+(p||r));const m=window.parent&&window.parent.name||window.name,u=function(){window.pm.scalpCount||(window.pm.scalpCount=0),window.pm.scalpCount+=1},w=ns.getPubId()||p||window.name.split("|").pop(),f={env:"function"==typeof window.pm.getEnv&&window.pm.getEnv()||"production",type:"events-website",userId:w,_allow:!t.disllow&&t.allow,_disallow:!t.allow&&t.disallow,_property:t.property||document.location.host,_traceId:m},h=f.env.match("prod")?"https://bi.pst.tech/events":"https://bi-beta.pst.tech/events";f._url=t.url||h,document.cookie="_pm.traceId="+m+"; domain=."+s+"."+a+"; path=/",window.pm.scalp=window.pm.enablePostmanAnalytics(u,f),window.pm.traceId=m,window.pm.userId=w}},ns.getTraceUrl=function(t){const n=-1!==t.indexOf("?")?"&":"?";return t+n+"trace="+window.pm.traceId},ns.trace=function(t){document.location.href=ns.getTraceUrl(t)},ns.getUtmUrl=function(t){const n=-1!==t.indexOf("?")?"&":"?",e=window.pm.traceId.split(".").pop(),o=window.pm.traceId.split("."+e).shift().substr(1).split("."),c=[];return o.forEach((t=>{const n=t.match("([UTM|utm].*)=([^;]*)(;|$)");n&&(-1!==n[0].indexOf("utm")||-1!==n[0].indexOf("UTM"))&&c.push(n[0])})),t+n+(c.length&&c.join("&")||"utm="+document.location.host)},ns.utm=function(t){let n=ns.getUtmUrl(t);n.match("trace=")||(n=n+"&trace="+window.pm.traceId),document.location.href=n},ns.trackClicks=function(t,n){const e=function(e){const o=document.body&&document.body.id&&"#"+document.body.id||"";if(t){const c=e.target.getAttribute(t);c&&window.pm.scalp(n||ns.initCategory,"click","target",o+c)}else if(!t&&("string"==typeof e.target.className||"string"==typeof e.target.id)){const t=e.target.className||e.target.id||e.target.parentNode.className||-1;if("string"==typeof t){const c=document.location.pathname+o+":"+e.target.tagName+"."+t.split(" ").join("_");try{window.pm.scalp(n||ns.initCategory,"click",c)}catch(t){window.pm.log(t.message)}}}};document.body.getAttribute("data-trackClicks")||document.body.addEventListener("mousedown",e,!0),document.body.setAttribute("data-trackClicks",t||"default")},ns.driveTrack=function(t){let n;const e="_track=",o=t&&t._track||window.location.search&&window.location.search.match(e)&&window.location.search.split(e).pop().split("&").shift()||(document.cookie.match("(^|;) ?_track=([^;]*)(;|$)")||[])[2],c=t&&t.url||window.location.href,i=ns.getEnv(),a=i.match("stag")?"stage":i;return ns.tracking=!0,ns.trackIt(),c.match(e)?(n="postman-"+a+".track="+o+"; path=/",document.cookie=n,n):t},ns.trackIt=function(){const t=(document.cookie.match("(^|;) ?postman-[a-z]+.track=([^;]*)(;|$)")||[])[2];if(t&&ns.tracking){let n=document.location.href;const e=-1===n.indexOf("?")?"?":"&";-1===n.indexOf("_track")&&"default"!==t&&(n=`${n}${e}_track=${t}`,document.location.replace(n))}},ns.bff=function(t,n,e){const o=e?"/mkapi/":"https://www.postman.com/mkapi/",c=new XMLHttpRequest,i=o+t+".json?t="+(new Date).getTime();c.withCredentials=!0,c.addEventListener("readystatechange",(function(){4===this.readyState&&n(this.responseText)})),c.open("GET",i),c.send()};

