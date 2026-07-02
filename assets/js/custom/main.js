// Rotating Text Animation - Hero Section

$(function () {
  const ANIM = 500,
    PAUSE = 2000,
    BUF = 4;
  const $w = $(".rotating-text");
  if (!$w.length) return;
  if (!$w.find(".rotating-text-inner").length)
    $w.children("span").wrapAll('<div class="rotating-text-inner"></div>');
  const $inner = $w.find(".rotating-text-inner");

  const copyProps = [
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "letter-spacing",
    "word-spacing",
    "text-transform",
    "line-height",
    "padding-left",
    "padding-right",
    "box-sizing",
  ];
  function measure($el) {
    const cs = window.getComputedStyle($el[0]);
    const $t = $el
      .clone()
      .css({
        position: "absolute",
        visibility: "hidden",
        whiteSpace: "nowrap",
        display: "inline-block",
        boxSizing: "border-box",
      })
      .appendTo("body");
    copyProps.forEach((p) => {
      try {
        $t.css(p, cs.getPropertyValue(p));
      } catch (e) {}
    });
    const w = Math.ceil($t[0].getBoundingClientRect().width);
    $t.remove();
    return w;
  }
  function rowH() {
    const $f = $inner.children("span").first();
    const $t = $f
      .clone()
      .css({
        position: "absolute",
        visibility: "hidden",
        whiteSpace: "nowrap",
        display: "inline-block",
        boxSizing: "border-box",
      })
      .appendTo("body");
    try {
      $t.css("font-size", getComputedStyle($f[0]).fontSize);
      $t.css("line-height", getComputedStyle($f[0]).lineHeight);
    } catch (e) {}
    const h = Math.ceil($t[0].getBoundingClientRect().height);
    $t.remove();
    return h;
  }

  let H = rowH();
  function apply($el) {
    const w = measure($el) + BUF;
    $w.css("width", w + "px");
    $inner.css("width", w + "px");
  }

  apply($inner.children("span").first());
  if (document.fonts && document.fonts.ready)
    document.fonts.ready
      .then(() => {
        H = rowH();
        apply($inner.children("span").first());
      })
      .catch(() => {});

  let rt;
  function rotate() {
    const $all = $inner.children("span");
    if ($all.length <= 1) return;
    const $cur = $all.eq(0),
      $next = $all.eq(1);
    apply($next);
    requestAnimationFrame(() =>
      $inner.css("transform", "translateY(-" + H + "px)"),
    );
    $inner.one("transitionend", (e) => {
      if (e.originalEvent && e.originalEvent.propertyName !== "transform")
        return;
      $inner.append($cur);
      const prev = $inner.css("transition");
      $inner.css("transition", "none").css("transform", "translateY(0)");
      $inner[0].offsetHeight;
      $inner.css(
        "transition",
        prev || "transform " + ANIM + "ms cubic-bezier(.78,0,.13,1)",
      );
      const final = measure($inner.children("span").first()) + BUF;
      const pW = $w.css("transition");
      $w.css("transition", "none").css("width", final + "px");
      $w[0].offsetHeight;
      $w.css("transition", pW || "width 320ms cubic-bezier(.2,.8,.2,1)");
    });
  }
  rt = setInterval(rotate, PAUSE);
  $w.data("rotator", {
    pause: () => {
      clearInterval(rt);
      rt = null;
    },
    resume: () => {
      if (!rt) rt = setInterval(rotate, PAUSE);
    },
  });
  $(window).on(
    "resize",
    (() => {
      let t;
      return () => {
        clearTimeout(t);
        t = setTimeout(() => {
          H = rowH();
          apply($inner.children("span").first());
        }, 160);
      };
    })(),
  );
});

// Rotating Text Animation - Hero Section - End

// Rotating Text Animation - Use Anywhere

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".rotating-text-animation").forEach((wrapper) => {
    const spans = Array.from(wrapper.querySelectorAll("span"));
    if (spans.length <= 1) return;

    // Create inner wrapper
    const inner = document.createElement("div");
    inner.className = "rotating-text-animation-inner";

    spans.forEach((span) => inner.appendChild(span));
    wrapper.innerHTML = "";
    wrapper.appendChild(inner);

    const lineHeight = spans[0].offsetHeight;

    setInterval(() => {
      // STEP 1: Animate UP by one item
      inner.style.transition = "transform 800ms cubic-bezier(0.78, 0, 0.13, 1)";
      inner.style.transform = `translateY(-${lineHeight}px)`;

      // STEP 2: After animation finishes
      setTimeout(() => {
        // Move first item to bottom
        inner.appendChild(inner.children[0]);

        // Instantly reset position (NO animation)
        inner.style.transition = "none";
        inner.style.transform = "translateY(0)";
      }, 600);
    }, 2500);
  });
});

// Rotating Text Animation - Use Anywhere End Here

// Dynamic Dropdown Menu Animation

$(function () {
  const $dropdowns = $(".nav-item.dropdown");
  
  // Initially prepare list items for animation but keep them in document flow
  // so that ul.dropdown-menu correctly calculates its full height for scaleY
  $(".dropdown-menu li").css({
    opacity: 0,
    transform: "translateY(15px)"
  });

  $dropdowns.each(function () {
    const $dropdown = $(this);
    const $items = $dropdown.find(".dropdown-menu li");
    let hoverTimeout;

    function openMenu() {
      clearTimeout(hoverTimeout);
      
      // Reset items state
      $items.stop(true, true).css({
        opacity: 0,
        transform: "translateY(15px)"
      });
      
      // Delay revealing items until the ul scaleY animation is partially done
      hoverTimeout = setTimeout(() => {
        $items.each(function (index) {
          $(this).delay(index * 80).animate(
            { opacity: 1 }, 
            {
              duration: 400,
              easing: "swing",
              step: function (now) {
                // Animate Y axis dynamically alongside opacity
                const y = 15 * (1 - now);
                $(this).css("transform", `translateY(${y}px)`);
              }
            }
          );
        });
      }, 350);
    }

    function closeMenu() {
      clearTimeout(hoverTimeout);
      
      // Reset items
      $items.stop(true, true).animate(
        { opacity: 0 }, 
        {
          duration: 200,
          step: function (now) {
            const y = 15 * (1 - now);
            $(this).css("transform", `translateY(${y}px)`);
          }
        }
      );
    }

    // Handle desktop hover interactions
    $dropdown.hover(
      function () {
        if (window.innerWidth >= 992) openMenu();
      },
      function () {
        if (window.innerWidth >= 992) closeMenu();
      }
    );

    // Handle touch interactions via Bootstrap events
    $dropdown.on('show.bs.dropdown', function () {
      openMenu();
    });

    $dropdown.on('hide.bs.dropdown', function () {
      closeMenu();
    });
  });

  // Toggle active/not-active for custom hamburger animation
  const offcanvasElement = document.getElementById('navbarSupportedContent');
  if (offcanvasElement) {
    offcanvasElement.addEventListener('show.bs.offcanvas', function () {
      $('.navbar-toggler.custom-toggler').removeClass('not-active').addClass('active');
    });
    offcanvasElement.addEventListener('hide.bs.offcanvas', function () {
      $('.navbar-toggler.custom-toggler').removeClass('active').addClass('not-active');
    });
  }

  // --- E-commerce Functionalities ---

  // 1. Search Functionality
  $('#searchForm').on('submit', function (e) {
    e.preventDefault();
    const query = $('#searchInput').val().trim();
    if (query) {
      console.log('Searching for:', query);
      // For demonstration, just close modal and clear input
      const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
      if (searchModal) searchModal.hide();
      $('#searchInput').val('');
      // Show dummy toast or alert
      alert('Searching for: ' + query);
    }
  });

  // 2. Login Functionality
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    if (email && password) {
      console.log('Logging in user:', email);
      // Close modal on successful simulated login
      const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      if (loginModal) loginModal.hide();
      $('#loginEmail').val('');
      $('#loginPassword').val('');
      alert('Successfully logged in as ' + email);
    }
  });

  // 3. Wishlist Functionality
  let wishlistCount = 0;
  
  // Example function to add item to wishlist (can be called from anywhere)
  window.addToWishlist = function(item) {
    wishlistCount++;
    $('.wishlist-count').text(wishlistCount).removeClass('d-none');
    
    $('#emptyWishlistMsg').hide();
    
    const wishlistItemHtml = `
      <div class="d-flex align-items-center justify-content-between border border-secondary p-2 rounded wishlist-item">
        <div class="d-flex align-items-center gap-3">
          <div class="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
            <img src="assets/images/favourite.svg" alt="Product" style="width: 24px; filter: invert(0.5);" />
          </div>
          <div>
            <h6 class="text-white mb-0">${item.name || 'Sample Product'}</h6>
            <small class="text-yellow">${item.price || '$99.00'}</small>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-danger remove-wishlist-item border-0">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;
    
    $('#wishlistItems').append(wishlistItemHtml);
  };

  // Handle removing items from wishlist
  $('#wishlistItems').on('click', '.remove-wishlist-item', function() {
    $(this).closest('.wishlist-item').remove();
    wishlistCount--;
    if (wishlistCount <= 0) {
      wishlistCount = 0;
      $('.wishlist-count').addClass('d-none');
      $('#emptyWishlistMsg').show();
    } else {
      $('.wishlist-count').text(wishlistCount);
    }
  });

  // Automatically add a sample product to wishlist for demonstration when the page loads (Optional)
  // setTimeout(() => { addToWishlist({ name: 'Modern Chair', price: '$120.00' }); }, 1500);

  // Close search modal when clicking outside the content
  $('#searchModal').on('click', function (e) {
    if (e.target === this) {
      const modalInstance = bootstrap.Modal.getInstance(this);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  });

});
