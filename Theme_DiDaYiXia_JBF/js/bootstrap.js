/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);




//datetimepicker
(function(factory){
  if (typeof define === 'function' && define.amd)
    define(['jquery'], factory);
  else if (typeof exports === 'object')
    factory(require('jquery'));
  else
    factory(jQuery);

}(function($, undefined){

// Add ECMA262-5 Array methods if not supported natively (IE8)
if (!('indexOf' in Array.prototype)) {
  Array.prototype.indexOf = function (find, i) {
    if (i === undefined) i = 0;
    if (i < 0) i += this.length;
    if (i < 0) i = 0;
    for (var n = this.length; i < n; i++) {
      if (i in this && this[i] === find) {
        return i;
      }
    }
    return -1;
  }
}

// Add timezone abbreviation support for ie6+, Chrome, Firefox
function timeZoneAbbreviation() {
  var abbreviation, date, formattedStr, i, len, matchedStrings, ref, str;
  date = (new Date()).toString();
  formattedStr = ((ref = date.split('(')[1]) != null ? ref.slice(0, -1) : 0) || date.split(' ');
  if (formattedStr instanceof Array) {
    matchedStrings = [];
    for (var i = 0, len = formattedStr.length; i < len; i++) {
      str = formattedStr[i];
      if ((abbreviation = (ref = str.match(/\b[A-Z]+\b/)) !== null) ? ref[0] : 0) {
        matchedStrings.push(abbreviation);
      }
    }
    formattedStr = matchedStrings.pop();
  }
  return formattedStr;
}

function UTCDate() {
  return new Date(Date.UTC.apply(Date, arguments));
}

// Picker object
var Datetimepicker = function (element, options) {
  var that = this;

  this.element = $(element);

  // add container for single page application
  // when page switch the datetimepicker div will be removed also.
  this.container = options.container || 'body';

  this.language = options.language || this.element.data('date-language') || 'en';
  this.language = this.language in dates ? this.language : this.language.split('-')[0]; // fr-CA fallback to fr
  this.language = this.language in dates ? this.language : 'en';
  this.isRTL = dates[this.language].rtl || false;
  this.formatType = options.formatType || this.element.data('format-type') || 'standard';
  this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || dates[this.language].format || DPGlobal.getDefaultFormat(this.formatType, 'input'), this.formatType);
  this.isInline = false;
  this.isVisible = false;
  this.isInput = this.element.is('input');
  this.fontAwesome = options.fontAwesome || this.element.data('font-awesome') || false;

  this.bootcssVer = options.bootcssVer || (this.isInput ? (this.element.is('.form-control') ? 3 : 2) : ( this.bootcssVer = this.element.is('.input-group') ? 3 : 2 ));

  this.component = this.element.is('.date') ? ( this.bootcssVer === 3 ? this.element.find('.input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-remove, .input-group-addon .glyphicon-calendar, .input-group-addon .fa-calendar, .input-group-addon .fa-clock-o').parent() : this.element.find('.add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar, .add-on .fa-calendar, .add-on .fa-clock-o').parent()) : false;
  this.componentReset = this.element.is('.date') ? ( this.bootcssVer === 3 ? this.element.find('.input-group-addon .glyphicon-remove, .input-group-addon .fa-times').parent():this.element.find('.add-on .icon-remove, .add-on .fa-times').parent()) : false;
  this.hasInput = this.component && this.element.find('input').length;
  if (this.component && this.component.length === 0) {
    this.component = false;
  }
  this.linkField = options.linkField || this.element.data('link-field') || false;
  this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data('link-format') || DPGlobal.getDefaultFormat(this.formatType, 'link'), this.formatType);
  this.minuteStep = options.minuteStep || this.element.data('minute-step') || 5;
  this.pickerPosition = options.pickerPosition || this.element.data('picker-position') || 'bottom-right';
  this.showMeridian = options.showMeridian || this.element.data('show-meridian') || false;
  this.initialDate = options.initialDate || new Date();
  this.zIndex = options.zIndex || this.element.data('z-index') || undefined;
  this.title = typeof options.title === 'undefined' ? false : options.title;
  this.timezone = options.timezone || timeZoneAbbreviation();

  this.icons = {
    leftArrow: this.fontAwesome ? 'fa-arrow-left' : (this.bootcssVer === 3 ? 'glyphicon-arrow-left' : 'icon-arrow-left'),
    rightArrow: this.fontAwesome ? 'fa-arrow-right' : (this.bootcssVer === 3 ? 'glyphicon-arrow-right' : 'icon-arrow-right')
  }
  this.icontype = this.fontAwesome ? 'fa' : 'glyphicon';

  this._attachEvents();

  this.clickedOutside = function (e) {
      // Clicked outside the datetimepicker, hide it
      if ($(e.target).closest('.datetimepicker').length === 0) {
          that.hide();
      }
  }

  this.formatViewType = 'datetime';
  if ('formatViewType' in options) {
    this.formatViewType = options.formatViewType;
  } else if ('formatViewType' in this.element.data()) {
    this.formatViewType = this.element.data('formatViewType');
  }

  this.minView = 0;
  if ('minView' in options) {
    this.minView = options.minView;
  } else if ('minView' in this.element.data()) {
    this.minView = this.element.data('min-view');
  }
  this.minView = DPGlobal.convertViewMode(this.minView);

  this.maxView = DPGlobal.modes.length - 1;
  if ('maxView' in options) {
    this.maxView = options.maxView;
  } else if ('maxView' in this.element.data()) {
    this.maxView = this.element.data('max-view');
  }
  this.maxView = DPGlobal.convertViewMode(this.maxView);

  this.wheelViewModeNavigation = false;
  if ('wheelViewModeNavigation' in options) {
    this.wheelViewModeNavigation = options.wheelViewModeNavigation;
  } else if ('wheelViewModeNavigation' in this.element.data()) {
    this.wheelViewModeNavigation = this.element.data('view-mode-wheel-navigation');
  }

  this.wheelViewModeNavigationInverseDirection = false;

  if ('wheelViewModeNavigationInverseDirection' in options) {
    this.wheelViewModeNavigationInverseDirection = options.wheelViewModeNavigationInverseDirection;
  } else if ('wheelViewModeNavigationInverseDirection' in this.element.data()) {
    this.wheelViewModeNavigationInverseDirection = this.element.data('view-mode-wheel-navigation-inverse-dir');
  }

  this.wheelViewModeNavigationDelay = 100;
  if ('wheelViewModeNavigationDelay' in options) {
    this.wheelViewModeNavigationDelay = options.wheelViewModeNavigationDelay;
  } else if ('wheelViewModeNavigationDelay' in this.element.data()) {
    this.wheelViewModeNavigationDelay = this.element.data('view-mode-wheel-navigation-delay');
  }

  this.startViewMode = 2;
  if ('startView' in options) {
    this.startViewMode = options.startView;
  } else if ('startView' in this.element.data()) {
    this.startViewMode = this.element.data('start-view');
  }
  this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
  this.viewMode = this.startViewMode;

  this.viewSelect = this.minView;
  if ('viewSelect' in options) {
    this.viewSelect = options.viewSelect;
  } else if ('viewSelect' in this.element.data()) {
    this.viewSelect = this.element.data('view-select');
  }
  this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);

  this.forceParse = true;
  if ('forceParse' in options) {
    this.forceParse = options.forceParse;
  } else if ('dateForceParse' in this.element.data()) {
    this.forceParse = this.element.data('date-force-parse');
  }
  var template = this.bootcssVer === 3 ? DPGlobal.templateV3 : DPGlobal.template;
  while (template.indexOf('{iconType}') !== -1) {
    template = template.replace('{iconType}', this.icontype);
  }
  while (template.indexOf('{leftArrow}') !== -1) {
    template = template.replace('{leftArrow}', this.icons.leftArrow);
  }
  while (template.indexOf('{rightArrow}') !== -1) {
    template = template.replace('{rightArrow}', this.icons.rightArrow);
  }
  this.picker = $(template)
    .appendTo(this.isInline ? this.element : this.container) // 'body')
    .on({
      click:     $.proxy(this.click, this),
      mousedown: $.proxy(this.mousedown, this)
    });

  if (this.wheelViewModeNavigation) {
    if ($.fn.mousewheel) {
      this.picker.on({mousewheel: $.proxy(this.mousewheel, this)});
    } else {
      console.log('Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option');
    }
  }

  if (this.isInline) {
    this.picker.addClass('datetimepicker-inline');
  } else {
    this.picker.addClass('datetimepicker-dropdown-' + this.pickerPosition + ' dropdown-menu');
  }
  if (this.isRTL) {
    this.picker.addClass('datetimepicker-rtl');
    var selector = this.bootcssVer === 3 ? '.prev span, .next span' : '.prev i, .next i';
    this.picker.find(selector).toggleClass(this.icons.leftArrow + ' ' + this.icons.rightArrow);
  }

  $(document).on('mousedown touchend', this.clickedOutside);

  this.autoclose = false;
  if ('autoclose' in options) {
    this.autoclose = options.autoclose;
  } else if ('dateAutoclose' in this.element.data()) {
    this.autoclose = this.element.data('date-autoclose');
  }

  this.keyboardNavigation = true;
  if ('keyboardNavigation' in options) {
    this.keyboardNavigation = options.keyboardNavigation;
  } else if ('dateKeyboardNavigation' in this.element.data()) {
    this.keyboardNavigation = this.element.data('date-keyboard-navigation');
  }

  this.todayBtn = (options.todayBtn || this.element.data('date-today-btn') || false);
  this.clearBtn = (options.clearBtn || this.element.data('date-clear-btn') || false);
  this.todayHighlight = (options.todayHighlight || this.element.data('date-today-highlight') || false);

  this.weekStart = 0;
  if (typeof options.weekStart !== 'undefined') {
    this.weekStart = options.weekStart;
  } else if (typeof this.element.data('date-weekstart') !== 'undefined') {
    this.weekStart = this.element.data('date-weekstart');
  } else if (typeof dates[this.language].weekStart !== 'undefined') {
    this.weekStart = dates[this.language].weekStart;
  }
  this.weekStart = this.weekStart % 7;
  this.weekEnd = ((this.weekStart + 6) % 7);
  this.onRenderDay = function (date) {
    var render = (options.onRenderDay || function () { return []; })(date);
    if (typeof render === 'string') {
      render = [render];
    }
    var res = ['day'];
    return res.concat((render ? render : []));
  };
  this.onRenderHour = function (date) {
    var render = (options.onRenderHour || function () { return []; })(date);
    var res = ['hour'];
    if (typeof render === 'string') {
      render = [render];
    }
    return res.concat((render ? render : []));
  };
  this.onRenderMinute = function (date) {
    var render = (options.onRenderMinute || function () { return []; })(date);
    var res = ['minute'];
    if (typeof render === 'string') {
      render = [render];
    }
    if (date < this.startDate || date > this.endDate) {
      res.push('disabled');
    } else if (Math.floor(this.date.getUTCMinutes() / this.minuteStep) === Math.floor(date.getUTCMinutes() / this.minuteStep)) {
      res.push('active');
    }
    return res.concat((render ? render : []));
  };
  this.onRenderYear = function (date) {
    var render = (options.onRenderYear || function () { return []; })(date);
    var res = ['year'];
    if (typeof render === 'string') {
      render = [render];
    }
    if (this.date.getUTCFullYear() === date.getUTCFullYear()) {
      res.push('active');
    }
    var currentYear = date.getUTCFullYear();
    var endYear = this.endDate.getUTCFullYear();
    if (date < this.startDate || currentYear > endYear) {
      res.push('disabled');
    }
    return res.concat((render ? render : []));
  }
  this.onRenderMonth = function (date) {
    var render = (options.onRenderMonth || function () { return []; })(date);
    var res = ['month'];
    if (typeof render === 'string') {
      render = [render];
    }
    return res.concat((render ? render : []));
  }
  this.startDate = new Date(-8639968443048000);
  this.endDate = new Date(8639968443048000);
  this.datesDisabled = [];
  this.daysOfWeekDisabled = [];
  this.setStartDate(options.startDate || this.element.data('date-startdate'));
  this.setEndDate(options.endDate || this.element.data('date-enddate'));
  this.setDatesDisabled(options.datesDisabled || this.element.data('date-dates-disabled'));
  this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data('date-days-of-week-disabled'));
  this.setMinutesDisabled(options.minutesDisabled || this.element.data('date-minute-disabled'));
  this.setHoursDisabled(options.hoursDisabled || this.element.data('date-hour-disabled'));
  this.fillDow();
  this.fillMonths();
  this.update();
  this.showMode();

  if (this.isInline) {
    this.show();
  }
};

Datetimepicker.prototype = {
  constructor: Datetimepicker,

  _events:       [],
  _attachEvents: function () {
    this._detachEvents();
    if (this.isInput) { // single input
      this._events = [
        [this.element, {
          focus:   $.proxy(this.show, this),
          keyup:   $.proxy(this.update, this),
          keydown: $.proxy(this.keydown, this)
        }]
      ];
    }
    else if (this.component && this.hasInput) { // component: input + button
      this._events = [
        // For components that are not readonly, allow keyboard nav
        [this.element.find('input'), {
          focus:   $.proxy(this.show, this),
          keyup:   $.proxy(this.update, this),
          keydown: $.proxy(this.keydown, this)
        }],
        [this.component, {
          click: $.proxy(this.show, this)
        }]
      ];
      if (this.componentReset) {
        this._events.push([
          this.componentReset,
          {click: $.proxy(this.reset, this)}
        ]);
      }
    }
    else if (this.element.is('div')) {  // inline datetimepicker
      this.isInline = true;
    }
    else {
      this._events = [
        [this.element, {
          click: $.proxy(this.show, this)
        }]
      ];
    }
    for (var i = 0, el, ev; i < this._events.length; i++) {
      el = this._events[i][0];
      ev = this._events[i][1];
      el.on(ev);
    }
  },

  _detachEvents: function () {
    for (var i = 0, el, ev; i < this._events.length; i++) {
      el = this._events[i][0];
      ev = this._events[i][1];
      el.off(ev);
    }
    this._events = [];
  },

  show: function (e) {
    this.picker.show();
    this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
    if (this.forceParse) {
      this.update();
    }
    this.place();
    $(window).on('resize', $.proxy(this.place, this));
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.isVisible = true;
    this.element.trigger({
      type: 'show',
      date: this.date
    });
  },

  hide: function () {
    if (!this.isVisible) return;
    if (this.isInline) return;
    this.picker.hide();
    $(window).off('resize', this.place);
    this.viewMode = this.startViewMode;
    this.showMode();
    if (!this.isInput) {
      $(document).off('mousedown', this.hide);
    }

    if (
      this.forceParse &&
        (
          this.isInput && this.element.val() ||
            this.hasInput && this.element.find('input').val()
          )
      )
      this.setValue();
    this.isVisible = false;
    this.element.trigger({
      type: 'hide',
      date: this.date
    });
  },

  remove: function () {
    this._detachEvents();
    $(document).off('mousedown', this.clickedOutside);
    this.picker.remove();
    delete this.picker;
    delete this.element.data().datetimepicker;
  },

  getDate: function () {
    var d = this.getUTCDate();
    if (d === null) {
      return null;
    }
    return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
  },

  getUTCDate: function () {
    return this.date;
  },

  getInitialDate: function () {
    return this.initialDate
  },

  setInitialDate: function (initialDate) {
    this.initialDate = initialDate;
  },

  setDate: function (d) {
    this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)));
  },

  setUTCDate: function (d) {
    if (d >= this.startDate && d <= this.endDate) {
      this.date = d;
      this.setValue();
      this.viewDate = this.date;
      this.fill();
    } else {
      this.element.trigger({
        type:      'outOfRange',
        date:      d,
        startDate: this.startDate,
        endDate:   this.endDate
      });
    }
  },

  setFormat: function (format) {
    this.format = DPGlobal.parseFormat(format, this.formatType);
    var element;
    if (this.isInput) {
      element = this.element;
    } else if (this.component) {
      element = this.element.find('input');
    }
    if (element && element.val()) {
      this.setValue();
    }
  },

  setValue: function () {
    var formatted = this.getFormattedDate();
    if (!this.isInput) {
      if (this.component) {
        this.element.find('input').val(formatted);
      }
      this.element.data('date', formatted);
    } else {
      this.element.val(formatted);
    }
    if (this.linkField) {
      $('#' + this.linkField).val(this.getFormattedDate(this.linkFormat));
    }
  },

  getFormattedDate: function (format) {
    format = format || this.format;
    return DPGlobal.formatDate(this.date, format, this.language, this.formatType, this.timezone);
  },

  setStartDate: function (startDate) {
    this.startDate = startDate || this.startDate;
    if (this.startDate.valueOf() !== 8639968443048000) {
      this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language, this.formatType, this.timezone);
    }
    this.update();
    this.updateNavArrows();
  },

  setEndDate: function (endDate) {
    this.endDate = endDate || this.endDate;
    if (this.endDate.valueOf() !== 8639968443048000) {
      this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language, this.formatType, this.timezone);
    }
    this.update();
    this.updateNavArrows();
  },

  setDatesDisabled: function (datesDisabled) {
    this.datesDisabled = datesDisabled || [];
    if (!$.isArray(this.datesDisabled)) {
      this.datesDisabled = this.datesDisabled.split(/,\s*/);
    }
    var mThis = this;
    this.datesDisabled = $.map(this.datesDisabled, function (d) {
      return DPGlobal.parseDate(d, mThis.format, mThis.language, mThis.formatType, mThis.timezone).toDateString();
    });
    this.update();
    this.updateNavArrows();
  },

  setTitle: function (selector, value) {
    return this.picker.find(selector)
      .find('th:eq(1)')
      .text(this.title === false ? value : this.title);
  },

  setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
    this.daysOfWeekDisabled = daysOfWeekDisabled || [];
    if (!$.isArray(this.daysOfWeekDisabled)) {
      this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
    }
    this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
      return parseInt(d, 10);
    });
    this.update();
    this.updateNavArrows();
  },

  setMinutesDisabled: function (minutesDisabled) {
    this.minutesDisabled = minutesDisabled || [];
    if (!$.isArray(this.minutesDisabled)) {
      this.minutesDisabled = this.minutesDisabled.split(/,\s*/);
    }
    this.minutesDisabled = $.map(this.minutesDisabled, function (d) {
      return parseInt(d, 10);
    });
    this.update();
    this.updateNavArrows();
  },

  setHoursDisabled: function (hoursDisabled) {
    this.hoursDisabled = hoursDisabled || [];
    if (!$.isArray(this.hoursDisabled)) {
      this.hoursDisabled = this.hoursDisabled.split(/,\s*/);
    }
    this.hoursDisabled = $.map(this.hoursDisabled, function (d) {
      return parseInt(d, 10);
    });
    this.update();
    this.updateNavArrows();
  },

  place: function () {
    if (this.isInline) return;

    if (!this.zIndex) {
      var index_highest = 0;
      $('div').each(function () {
        var index_current = parseInt($(this).css('zIndex'), 10);
        if (index_current > index_highest) {
          index_highest = index_current;
        }
      });
      this.zIndex = index_highest + 10;
    }

    var offset, top, left, containerOffset;
    if (this.container instanceof $) {
      containerOffset = this.container.offset();
    } else {
      containerOffset = $(this.container).offset();
    }

    if (this.component) {
      offset = this.component.offset();
      left = offset.left;
      if (this.pickerPosition === 'bottom-left' || this.pickerPosition === 'top-left') {
        left += this.component.outerWidth() - this.picker.outerWidth();
      }
    } else {
      offset = this.element.offset();
      left = offset.left;
      if (this.pickerPosition === 'bottom-left' || this.pickerPosition === 'top-left') {
        left += this.element.outerWidth() - this.picker.outerWidth();
      }
    }

    var bodyWidth = document.body.clientWidth || window.innerWidth;
    if (left + 220 > bodyWidth) {
      left = bodyWidth - 220;
    }

    if (this.pickerPosition === 'top-left' || this.pickerPosition === 'top-right') {
      top = offset.top - this.picker.outerHeight();
    } else {
      top = offset.top + this.height;
    }

    top = top - containerOffset.top;
    left = left - containerOffset.left;

    this.picker.css({
      top:    top,
      left:   left,
      zIndex: this.zIndex
    });
  },

  hour_minute: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]",

  update: function () {
    var date, fromArgs = false;
    if (arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
      date = arguments[0];
      fromArgs = true;
    } else {
      date = (this.isInput ? this.element.val() : this.element.find('input').val()) || this.element.data('date') || this.initialDate;
      if (typeof date === 'string') {
        date = date.replace(/^\s+|\s+$/g,'');
      }
    }

    if (!date) {
      date = new Date();
      fromArgs = false;
    }

    if (typeof date === "string") {
      if (new RegExp(this.hour_minute).test(date) || new RegExp(this.hour_minute + ":[0-5][0-9]").test(date)) {
        date = this.getDate()
      }
    }

    this.date = DPGlobal.parseDate(date, this.format, this.language, this.formatType, this.timezone);

    if (fromArgs) this.setValue();

    if (this.date < this.startDate) {
      this.viewDate = new Date(this.startDate);
    } else if (this.date > this.endDate) {
      this.viewDate = new Date(this.endDate);
    } else {
      this.viewDate = new Date(this.date);
    }
    this.fill();
  },

  fillDow: function () {
    var dowCnt = this.weekStart,
      html = '<tr>';
    while (dowCnt < this.weekStart + 7) {
      html += '<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>';
    }
    html += '</tr>';
    this.picker.find('.datetimepicker-days thead').append(html);
  },

  fillMonths: function () {
    var html = '';
    var d = new Date(this.viewDate);
    for (var i = 0; i < 12; i++) {
      d.setUTCMonth(i);
      var classes = this.onRenderMonth(d);
      html += '<span class="' + classes.join(' ') + '">' + dates[this.language].monthsShort[i] + '</span>';
    }
    this.picker.find('.datetimepicker-months td').html(html);
  },

  fill: function () {
    if (!this.date || !this.viewDate) {
      return;
    }
    var d = new Date(this.viewDate),
      year = d.getUTCFullYear(),
      month = d.getUTCMonth(),
      dayMonth = d.getUTCDate(),
      hours = d.getUTCHours(),
      startYear = this.startDate.getUTCFullYear(),
      startMonth = this.startDate.getUTCMonth(),
      endYear = this.endDate.getUTCFullYear(),
      endMonth = this.endDate.getUTCMonth() + 1,
      currentDate = (new UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate())).valueOf(),
      today = new Date();
    this.setTitle('.datetimepicker-days', dates[this.language].months[month] + ' ' + year)
    if (this.formatViewType === 'time') {
      var formatted = this.getFormattedDate();
      this.setTitle('.datetimepicker-hours', formatted);
      this.setTitle('.datetimepicker-minutes', formatted);
    } else {
      this.setTitle('.datetimepicker-hours', dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
      this.setTitle('.datetimepicker-minutes', dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
    }
    this.picker.find('tfoot th.today')
      .text(dates[this.language].today || dates['en'].today)
      .toggle(this.todayBtn !== false);
    this.picker.find('tfoot th.clear')
      .text(dates[this.language].clear || dates['en'].clear)
      .toggle(this.clearBtn !== false);
    this.updateNavArrows();
    this.fillMonths();
    var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0),
      day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
    prevMonth.setUTCDate(day);
    prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
    var nextMonth = new Date(prevMonth);
    nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
    nextMonth = nextMonth.valueOf();
    var html = [];
    var classes;
    while (prevMonth.valueOf() < nextMonth) {
      if (prevMonth.getUTCDay() === this.weekStart) {
        html.push('<tr>');
      }
      classes = this.onRenderDay(prevMonth);
      if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() === year && prevMonth.getUTCMonth() < month)) {
        classes.push('old');
      } else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() === year && prevMonth.getUTCMonth() > month)) {
        classes.push('new');
      }
      // Compare internal UTC date with local today, not UTC today
      if (this.todayHighlight &&
        prevMonth.getUTCFullYear() === today.getFullYear() &&
        prevMonth.getUTCMonth() === today.getMonth() &&
        prevMonth.getUTCDate() === today.getDate()) {
        classes.push('today');
      }
      if (prevMonth.valueOf() === currentDate) {
        classes.push('active');
      }
      if ((prevMonth.valueOf() + 86400000) <= this.startDate || prevMonth.valueOf() > this.endDate ||
        $.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1 ||
        $.inArray(prevMonth.toDateString(), this.datesDisabled) !== -1) {
        classes.push('disabled');
      }
      html.push('<td class="' + classes.join(' ') + '">' + prevMonth.getUTCDate() + '</td>');
      if (prevMonth.getUTCDay() === this.weekEnd) {
        html.push('</tr>');
      }
      prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
    }
    this.picker.find('.datetimepicker-days tbody').empty().append(html.join(''));

    html = [];
    var txt = '', meridian = '', meridianOld = '';
    var hoursDisabled = this.hoursDisabled || [];
    d = new Date(this.viewDate)
    for (var i = 0; i < 24; i++) {
      d.setUTCHours(i);
      classes = this.onRenderHour(d);
      if (hoursDisabled.indexOf(i) !== -1) {
        classes.push('disabled');
      }
      var actual = UTCDate(year, month, dayMonth, i);
      // We want the previous hour for the startDate
      if ((actual.valueOf() + 3600000) <= this.startDate || actual.valueOf() > this.endDate) {
        classes.push('disabled');
      } else if (hours === i) {
        classes.push('active');
      }
      if (this.showMeridian && dates[this.language].meridiem.length === 2) {
        meridian = (i < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
        if (meridian !== meridianOld) {
          if (meridianOld !== '') {
            html.push('</fieldset>');
          }
          html.push('<fieldset class="hour"><legend>' + meridian.toUpperCase() + '</legend>');
        }
        meridianOld = meridian;
        txt = (i % 12 ? i % 12 : 12);
        if (i < 12) {
          classes.push('hour_am');
        } else {
          classes.push('hour_pm');
        }
        html.push('<span class="' + classes.join(' ') + '">' + txt + '</span>');
        if (i === 23) {
          html.push('</fieldset>');
        }
      } else {
        txt = i + ':00';
        html.push('<span class="' + classes.join(' ') + '">' + txt + '</span>');
      }
    }
    this.picker.find('.datetimepicker-hours td').html(html.join(''));

    html = [];
    txt = '';
    meridian = '';
    meridianOld = '';
    var minutesDisabled = this.minutesDisabled || [];
    d = new Date(this.viewDate);
    for (var i = 0; i < 60; i += this.minuteStep) {
      if (minutesDisabled.indexOf(i) !== -1) continue;
      d.setUTCMinutes(i);
      d.setUTCSeconds(0);
      classes = this.onRenderMinute(d);
      if (this.showMeridian && dates[this.language].meridiem.length === 2) {
        meridian = (hours < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
        if (meridian !== meridianOld) {
          if (meridianOld !== '') {
            html.push('</fieldset>');
          }
          html.push('<fieldset class="minute"><legend>' + meridian.toUpperCase() + '</legend>');
        }
        meridianOld = meridian;
        txt = (hours % 12 ? hours % 12 : 12);
        html.push('<span class="' + classes.join(' ') + '">' + txt + ':' + (i < 10 ? '0' + i : i) + '</span>');
        if (i === 59) {
          html.push('</fieldset>');
        }
      } else {
        txt = i + ':00';
        html.push('<span class="' + classes.join(' ') + '">' + hours + ':' + (i < 10 ? '0' + i : i) + '</span>');
      }
    }
    this.picker.find('.datetimepicker-minutes td').html(html.join(''));

    var currentYear = this.date.getUTCFullYear();
    var months = this.setTitle('.datetimepicker-months', year)
      .end()
      .find('.month').removeClass('active');
    if (currentYear === year) {
      // getUTCMonths() returns 0 based, and we need to select the next one
      // To cater bootstrap 2 we don't need to select the next one
      months.eq(this.date.getUTCMonth()).addClass('active');
    }
    if (year < startYear || year > endYear) {
      months.addClass('disabled');
    }
    if (year === startYear) {
      months.slice(0, startMonth).addClass('disabled');
    }
    if (year === endYear) {
      months.slice(endMonth).addClass('disabled');
    }

    html = '';
    year = parseInt(year / 10, 10) * 10;
    var yearCont = this.setTitle('.datetimepicker-years', year + '-' + (year + 9))
      .end()
      .find('td');
    year -= 1;
    d = new Date(this.viewDate);
    for (var i = -1; i < 11; i++) {
      d.setUTCFullYear(year);
      classes = this.onRenderYear(d);
      if (i === -1 || i === 10) {
        classes.push(old);
      }
      html += '<span class="' + classes.join(' ') + '">' + year + '</span>';
      year += 1;
    }
    yearCont.html(html);
    this.place();
  },

  updateNavArrows: function () {
    var d = new Date(this.viewDate),
      year = d.getUTCFullYear(),
      month = d.getUTCMonth(),
      day = d.getUTCDate(),
      hour = d.getUTCHours();
    switch (this.viewMode) {
      case 0:
        if (year <= this.startDate.getUTCFullYear()
          && month <= this.startDate.getUTCMonth()
          && day <= this.startDate.getUTCDate()
          && hour <= this.startDate.getUTCHours()) {
          this.picker.find('.prev').css({visibility: 'hidden'});
        } else {
          this.picker.find('.prev').css({visibility: 'visible'});
        }
        if (year >= this.endDate.getUTCFullYear()
          && month >= this.endDate.getUTCMonth()
          && day >= this.endDate.getUTCDate()
          && hour >= this.endDate.getUTCHours()) {
          this.picker.find('.next').css({visibility: 'hidden'});
        } else {
          this.picker.find('.next').css({visibility: 'visible'});
        }
        break;
      case 1:
        if (year <= this.startDate.getUTCFullYear()
          && month <= this.startDate.getUTCMonth()
          && day <= this.startDate.getUTCDate()) {
          this.picker.find('.prev').css({visibility: 'hidden'});
        } else {
          this.picker.find('.prev').css({visibility: 'visible'});
        }
        if (year >= this.endDate.getUTCFullYear()
          && month >= this.endDate.getUTCMonth()
          && day >= this.endDate.getUTCDate()) {
          this.picker.find('.next').css({visibility: 'hidden'});
        } else {
          this.picker.find('.next').css({visibility: 'visible'});
        }
        break;
      case 2:
        if (year <= this.startDate.getUTCFullYear()
          && month <= this.startDate.getUTCMonth()) {
          this.picker.find('.prev').css({visibility: 'hidden'});
        } else {
          this.picker.find('.prev').css({visibility: 'visible'});
        }
        if (year >= this.endDate.getUTCFullYear()
          && month >= this.endDate.getUTCMonth()) {
          this.picker.find('.next').css({visibility: 'hidden'});
        } else {
          this.picker.find('.next').css({visibility: 'visible'});
        }
        break;
      case 3:
      case 4:
        if (year <= this.startDate.getUTCFullYear()) {
          this.picker.find('.prev').css({visibility: 'hidden'});
        } else {
          this.picker.find('.prev').css({visibility: 'visible'});
        }
        if (year >= this.endDate.getUTCFullYear()) {
          this.picker.find('.next').css({visibility: 'hidden'});
        } else {
          this.picker.find('.next').css({visibility: 'visible'});
        }
        break;
    }
  },

  mousewheel: function (e) {

    e.preventDefault();
    e.stopPropagation();

    if (this.wheelPause) {
      return;
    }

    this.wheelPause = true;

    var originalEvent = e.originalEvent;

    var delta = originalEvent.wheelDelta;

    var mode = delta > 0 ? 1 : (delta === 0) ? 0 : -1;

    if (this.wheelViewModeNavigationInverseDirection) {
      mode = -mode;
    }

    this.showMode(mode);

    setTimeout($.proxy(function () {

      this.wheelPause = false

    }, this), this.wheelViewModeNavigationDelay);

  },

  click: function (e) {
    e.stopPropagation();
    e.preventDefault();
    var target = $(e.target).closest('span, td, th, legend');
    if (target.is('.' + this.icontype)) {
      target = $(target).parent().closest('span, td, th, legend');
    }
    if (target.length === 1) {
      if (target.is('.disabled')) {
        this.element.trigger({
          type:      'outOfRange',
          date:      this.viewDate,
          startDate: this.startDate,
          endDate:   this.endDate
        });
        return;
      }
      switch (target[0].nodeName.toLowerCase()) {
        case 'th':
          switch (target[0].className) {
            case 'switch':
              this.showMode(1);
              break;
            case 'prev':
            case 'next':
              var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
              switch (this.viewMode) {
                case 0:
                  this.viewDate = this.moveHour(this.viewDate, dir);
                  break;
                case 1:
                  this.viewDate = this.moveDate(this.viewDate, dir);
                  break;
                case 2:
                  this.viewDate = this.moveMonth(this.viewDate, dir);
                  break;
                case 3:
                case 4:
                  this.viewDate = this.moveYear(this.viewDate, dir);
                  break;
              }
              this.fill();
              this.element.trigger({
                type:      target[0].className + ':' + this.convertViewModeText(this.viewMode),
                date:      this.viewDate,
                startDate: this.startDate,
                endDate:   this.endDate
              });
              break;
            case 'clear':
              this.reset();
              if (this.autoclose) {
                this.hide();
              }
              break;
            case 'today':
              var date = new Date();
              date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);

              // Respect startDate and endDate.
              if (date < this.startDate) date = this.startDate;
              else if (date > this.endDate) date = this.endDate;

              this.viewMode = this.startViewMode;
              this.showMode(0);
              this._setDate(date);
              this.fill();
              if (this.autoclose) {
                this.hide();
              }
              break;
          }
          break;
        case 'span':
          if (!target.is('.disabled')) {
            var year = this.viewDate.getUTCFullYear(),
              month = this.viewDate.getUTCMonth(),
              day = this.viewDate.getUTCDate(),
              hours = this.viewDate.getUTCHours(),
              minutes = this.viewDate.getUTCMinutes(),
              seconds = this.viewDate.getUTCSeconds();

            if (target.is('.month')) {
              this.viewDate.setUTCDate(1);
              month = target.parent().find('span').index(target);
              day = this.viewDate.getUTCDate();
              this.viewDate.setUTCMonth(month);
              this.element.trigger({
                type: 'changeMonth',
                date: this.viewDate
              });
              if (this.viewSelect >= 3) {
                this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
              }
            } else if (target.is('.year')) {
              this.viewDate.setUTCDate(1);
              year = parseInt(target.text(), 10) || 0;
              this.viewDate.setUTCFullYear(year);
              this.element.trigger({
                type: 'changeYear',
                date: this.viewDate
              });
              if (this.viewSelect >= 4) {
                this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
              }
            } else if (target.is('.hour')) {
              hours = parseInt(target.text(), 10) || 0;
              if (target.hasClass('hour_am') || target.hasClass('hour_pm')) {
                if (hours === 12 && target.hasClass('hour_am')) {
                  hours = 0;
                } else if (hours !== 12 && target.hasClass('hour_pm')) {
                  hours += 12;
                }
              }
              this.viewDate.setUTCHours(hours);
              this.element.trigger({
                type: 'changeHour',
                date: this.viewDate
              });
              if (this.viewSelect >= 1) {
                this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
              }
            } else if (target.is('.minute')) {
              minutes = parseInt(target.text().substr(target.text().indexOf(':') + 1), 10) || 0;
              this.viewDate.setUTCMinutes(minutes);
              this.element.trigger({
                type: 'changeMinute',
                date: this.viewDate
              });
              if (this.viewSelect >= 0) {
                this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
              }
            }
            if (this.viewMode !== 0) {
              var oldViewMode = this.viewMode;
              this.showMode(-1);
              this.fill();
              if (oldViewMode === this.viewMode && this.autoclose) {
                this.hide();
              }
            } else {
              this.fill();
              if (this.autoclose) {
                this.hide();
              }
            }
          }
          break;
        case 'td':
          if (target.is('.day') && !target.is('.disabled')) {
            var day = parseInt(target.text(), 10) || 1;
            var year = this.viewDate.getUTCFullYear(),
              month = this.viewDate.getUTCMonth(),
              hours = this.viewDate.getUTCHours(),
              minutes = this.viewDate.getUTCMinutes(),
              seconds = this.viewDate.getUTCSeconds();
            if (target.is('.old')) {
              if (month === 0) {
                month = 11;
                year -= 1;
              } else {
                month -= 1;
              }
            } else if (target.is('.new')) {
              if (month === 11) {
                month = 0;
                year += 1;
              } else {
                month += 1;
              }
            }
            this.viewDate.setUTCFullYear(year);
            this.viewDate.setUTCMonth(month, day);
            this.element.trigger({
              type: 'changeDay',
              date: this.viewDate
            });
            if (this.viewSelect >= 2) {
              this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
            }
          }
          var oldViewMode = this.viewMode;
          this.showMode(-1);
          this.fill();
          if (oldViewMode === this.viewMode && this.autoclose) {
            this.hide();
          }
          break;
      }
    }
  },

  _setDate: function (date, which) {
    if (!which || which === 'date')
      this.date = date;
    if (!which || which === 'view')
      this.viewDate = date;
    this.fill();
    this.setValue();
    var element;
    if (this.isInput) {
      element = this.element;
    } else if (this.component) {
      element = this.element.find('input');
    }
    if (element) {
      element.change();
    }
    this.element.trigger({
      type: 'changeDate',
      date: this.getDate()
    });
    if(date === null)
      this.date = this.viewDate;
  },

  moveMinute: function (date, dir) {
    if (!dir) return date;
    var new_date = new Date(date.valueOf());
    //dir = dir > 0 ? 1 : -1;
    new_date.setUTCMinutes(new_date.getUTCMinutes() + (dir * this.minuteStep));
    return new_date;
  },

  moveHour: function (date, dir) {
    if (!dir) return date;
    var new_date = new Date(date.valueOf());
    //dir = dir > 0 ? 1 : -1;
    new_date.setUTCHours(new_date.getUTCHours() + dir);
    return new_date;
  },

  moveDate: function (date, dir) {
    if (!dir) return date;
    var new_date = new Date(date.valueOf());
    //dir = dir > 0 ? 1 : -1;
    new_date.setUTCDate(new_date.getUTCDate() + dir);
    return new_date;
  },

  moveMonth: function (date, dir) {
    if (!dir) return date;
    var new_date = new Date(date.valueOf()),
      day = new_date.getUTCDate(),
      month = new_date.getUTCMonth(),
      mag = Math.abs(dir),
      new_month, test;
    dir = dir > 0 ? 1 : -1;
    if (mag === 1) {
      test = dir === -1
        // If going back one month, make sure month is not current month
        // (eg, Mar 31 -> Feb 31 === Feb 28, not Mar 02)
        ? function () {
        return new_date.getUTCMonth() === month;
      }
        // If going forward one month, make sure month is as expected
        // (eg, Jan 31 -> Feb 31 === Feb 28, not Mar 02)
        : function () {
        return new_date.getUTCMonth() !== new_month;
      };
      new_month = month + dir;
      new_date.setUTCMonth(new_month);
      // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
      if (new_month < 0 || new_month > 11)
        new_month = (new_month + 12) % 12;
    } else {
      // For magnitudes >1, move one month at a time...
      for (var i = 0; i < mag; i++)
        // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
        new_date = this.moveMonth(new_date, dir);
      // ...then reset the day, keeping it in the new month
      new_month = new_date.getUTCMonth();
      new_date.setUTCDate(day);
      test = function () {
        return new_month !== new_date.getUTCMonth();
      };
    }
    // Common date-resetting loop -- if date is beyond end of month, make it
    // end of month
    while (test()) {
      new_date.setUTCDate(--day);
      new_date.setUTCMonth(new_month);
    }
    return new_date;
  },

  moveYear: function (date, dir) {
    return this.moveMonth(date, dir * 12);
  },

  dateWithinRange: function (date) {
    return date >= this.startDate && date <= this.endDate;
  },

  keydown: function (e) {
    if (this.picker.is(':not(:visible)')) {
      if (e.keyCode === 27) // allow escape to hide and re-show picker
        this.show();
      return;
    }
    var dateChanged = false,
      dir, newDate, newViewDate;
    switch (e.keyCode) {
      case 27: // escape
        this.hide();
        e.preventDefault();
        break;
      case 37: // left
      case 39: // right
        if (!this.keyboardNavigation) break;
        dir = e.keyCode === 37 ? -1 : 1;
        var viewMode = this.viewMode;
        if (e.ctrlKey) {
          viewMode += 2;
        } else if (e.shiftKey) {
          viewMode += 1;
        }
        if (viewMode === 4) {
          newDate = this.moveYear(this.date, dir);
          newViewDate = this.moveYear(this.viewDate, dir);
        } else if (viewMode === 3) {
          newDate = this.moveMonth(this.date, dir);
          newViewDate = this.moveMonth(this.viewDate, dir);
        } else if (viewMode === 2) {
          newDate = this.moveDate(this.date, dir);
          newViewDate = this.moveDate(this.viewDate, dir);
        } else if (viewMode === 1) {
          newDate = this.moveHour(this.date, dir);
          newViewDate = this.moveHour(this.viewDate, dir);
        } else if (viewMode === 0) {
          newDate = this.moveMinute(this.date, dir);
          newViewDate = this.moveMinute(this.viewDate, dir);
        }
        if (this.dateWithinRange(newDate)) {
          this.date = newDate;
          this.viewDate = newViewDate;
          this.setValue();
          this.update();
          e.preventDefault();
          dateChanged = true;
        }
        break;
      case 38: // up
      case 40: // down
        if (!this.keyboardNavigation) break;
        dir = e.keyCode === 38 ? -1 : 1;
        viewMode = this.viewMode;
        if (e.ctrlKey) {
          viewMode += 2;
        } else if (e.shiftKey) {
          viewMode += 1;
        }
        if (viewMode === 4) {
          newDate = this.moveYear(this.date, dir);
          newViewDate = this.moveYear(this.viewDate, dir);
        } else if (viewMode === 3) {
          newDate = this.moveMonth(this.date, dir);
          newViewDate = this.moveMonth(this.viewDate, dir);
        } else if (viewMode === 2) {
          newDate = this.moveDate(this.date, dir * 7);
          newViewDate = this.moveDate(this.viewDate, dir * 7);
        } else if (viewMode === 1) {
          if (this.showMeridian) {
            newDate = this.moveHour(this.date, dir * 6);
            newViewDate = this.moveHour(this.viewDate, dir * 6);
          } else {
            newDate = this.moveHour(this.date, dir * 4);
            newViewDate = this.moveHour(this.viewDate, dir * 4);
          }
        } else if (viewMode === 0) {
          newDate = this.moveMinute(this.date, dir * 4);
          newViewDate = this.moveMinute(this.viewDate, dir * 4);
        }
        if (this.dateWithinRange(newDate)) {
          this.date = newDate;
          this.viewDate = newViewDate;
          this.setValue();
          this.update();
          e.preventDefault();
          dateChanged = true;
        }
        break;
      case 13: // enter
        if (this.viewMode !== 0) {
          var oldViewMode = this.viewMode;
          this.showMode(-1);
          this.fill();
          if (oldViewMode === this.viewMode && this.autoclose) {
            this.hide();
          }
        } else {
          this.fill();
          if (this.autoclose) {
            this.hide();
          }
        }
        e.preventDefault();
        break;
      case 9: // tab
        this.hide();
        break;
    }
    if (dateChanged) {
      var element;
      if (this.isInput) {
        element = this.element;
      } else if (this.component) {
        element = this.element.find('input');
      }
      if (element) {
        element.change();
      }
      this.element.trigger({
        type: 'changeDate',
        date: this.getDate()
      });
    }
  },

  showMode: function (dir) {
    if (dir) {
      var newViewMode = Math.max(0, Math.min(DPGlobal.modes.length - 1, this.viewMode + dir));
      if (newViewMode >= this.minView && newViewMode <= this.maxView) {
        this.element.trigger({
          type:        'changeMode',
          date:        this.viewDate,
          oldViewMode: this.viewMode,
          newViewMode: newViewMode
        });

        this.viewMode = newViewMode;
      }
    }
    /*
     vitalets: fixing bug of very special conditions:
     jquery 1.7.1 + webkit + show inline datetimepicker in bootstrap popover.
     Method show() does not set display css correctly and datetimepicker is not shown.
     Changed to .css('display', 'block') solve the problem.
     See https://github.com/vitalets/x-editable/issues/37

     In jquery 1.7.2+ everything works fine.
     */
    //this.picker.find('>div').hide().filter('.datetimepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
    this.picker.find('>div').hide().filter('.datetimepicker-' + DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
    this.updateNavArrows();
  },

  reset: function () {
    this._setDate(null, 'date');
  },

  convertViewModeText:  function (viewMode) {
    switch (viewMode) {
      case 4:
        return 'decade';
      case 3:
        return 'year';
      case 2:
        return 'month';
      case 1:
        return 'day';
      case 0:
        return 'hour';
    }
  }
};

var old = $.fn.datetimepicker;
$.fn.datetimepicker = function (option) {
  var args = Array.apply(null, arguments);
  args.shift();
  var internal_return;
  this.each(function () {
    var $this = $(this),
      data = $this.data('datetimepicker'),
      options = typeof option === 'object' && option;
    if (!data) {
      $this.data('datetimepicker', (data = new Datetimepicker(this, $.extend({}, $.fn.datetimepicker.defaults, options))));
    }
    if (typeof option === 'string' && typeof data[option] === 'function') {
      internal_return = data[option].apply(data, args);
      if (internal_return !== undefined) {
        return false;
      }
    }
  });
  if (internal_return !== undefined)
    return internal_return;
  else
    return this;
};

$.fn.datetimepicker.defaults = {
};
$.fn.datetimepicker.Constructor = Datetimepicker;
var dates = $.fn.datetimepicker.dates = {
  en: {
    days:        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    daysShort:   ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    daysMin:     ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months:      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    meridiem:    ['am', 'pm'],
    suffix:      ['st', 'nd', 'rd', 'th'],
    today:       'Today',
    clear:       'Clear'
  }
};

var DPGlobal = {
  modes:            [
    {
      clsName: 'minutes',
      navFnc:  'Hours',
      navStep: 1
    },
    {
      clsName: 'hours',
      navFnc:  'Date',
      navStep: 1
    },
    {
      clsName: 'days',
      navFnc:  'Month',
      navStep: 1
    },
    {
      clsName: 'months',
      navFnc:  'FullYear',
      navStep: 1
    },
    {
      clsName: 'years',
      navFnc:  'FullYear',
      navStep: 10
    }
  ],
  isLeapYear:       function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
  },
  getDaysInMonth:   function (year, month) {
    return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
  },
  getDefaultFormat: function (type, field) {
    if (type === 'standard') {
      if (field === 'input')
        return 'yyyy-mm-dd hh:ii';
      else
        return 'yyyy-mm-dd hh:ii:ss';
    } else if (type === 'php') {
      if (field === 'input')
        return 'Y-m-d H:i';
      else
        return 'Y-m-d H:i:s';
    } else {
      throw new Error('Invalid format type.');
    }
  },
  validParts: function (type) {
    if (type === 'standard') {
      return /t|hh?|HH?|p|P|z|Z|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
    } else if (type === 'php') {
      return /[dDjlNwzFmMnStyYaABgGhHis]/g;
    } else {
      throw new Error('Invalid format type.');
    }
  },
  nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
  parseFormat: function (format, type) {
    // IE treats \0 as a string end in inputs (truncating the value),
    // so it's a bad format delimiter, anyway
    var separators = format.replace(this.validParts(type), '\0').split('\0'),
      parts = format.match(this.validParts(type));
    if (!separators || !separators.length || !parts || parts.length === 0) {
      throw new Error('Invalid date format.');
    }
    return {separators: separators, parts: parts};
  },
  parseDate: function (date, format, language, type, timezone) {
    if (date instanceof Date) {
      var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
      dateUTC.setMilliseconds(0);
      return dateUTC;
    }
    if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
      format = this.parseFormat('yyyy-mm-dd', type);
    }
    if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
      format = this.parseFormat('yyyy-mm-dd hh:ii', type);
    }
    if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
      format = this.parseFormat('yyyy-mm-dd hh:ii:ss', type);
    }
    if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
      var part_re = /([-+]\d+)([dmwy])/,
        parts = date.match(/([-+]\d+)([dmwy])/g),
        part, dir;
      date = new Date();
      for (var i = 0; i < parts.length; i++) {
        part = part_re.exec(parts[i]);
        dir = parseInt(part[1]);
        switch (part[2]) {
          case 'd':
            date.setUTCDate(date.getUTCDate() + dir);
            break;
          case 'm':
            date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
            break;
          case 'w':
            date.setUTCDate(date.getUTCDate() + dir * 7);
            break;
          case 'y':
            date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
            break;
        }
      }
      return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
    }
    var parts = date && date.toString().match(this.nonpunctuation) || [],
      date = new Date(0, 0, 0, 0, 0, 0, 0),
      parsed = {},
      setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P', 'z', 'Z'],
      setters_map = {
        hh:   function (d, v) {
          return d.setUTCHours(v);
        },
        h:    function (d, v) {
          return d.setUTCHours(v);
        },
        HH:   function (d, v) {
          return d.setUTCHours(v === 12 ? 0 : v);
        },
        H:    function (d, v) {
          return d.setUTCHours(v === 12 ? 0 : v);
        },
        ii:   function (d, v) {
          return d.setUTCMinutes(v);
        },
        i:    function (d, v) {
          return d.setUTCMinutes(v);
        },
        ss:   function (d, v) {
          return d.setUTCSeconds(v);
        },
        s:    function (d, v) {
          return d.setUTCSeconds(v);
        },
        yyyy: function (d, v) {
          return d.setUTCFullYear(v);
        },
        yy:   function (d, v) {
          return d.setUTCFullYear(2000 + v);
        },
        m:    function (d, v) {
          v -= 1;
          while (v < 0) v += 12;
          v %= 12;
          d.setUTCMonth(v);
          while (d.getUTCMonth() !== v)
            if (isNaN(d.getUTCMonth()))
              return d;
            else
              d.setUTCDate(d.getUTCDate() - 1);
          return d;
        },
        d:    function (d, v) {
          return d.setUTCDate(v);
        },
        p:    function (d, v) {
          return d.setUTCHours(v === 1 ? d.getUTCHours() + 12 : d.getUTCHours());
        },
        z:    function () {
          return timezone
        }
      },
      val, filtered, part;
    setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
    setters_map['dd'] = setters_map['d'];
    setters_map['P'] = setters_map['p'];
    setters_map['Z'] = setters_map['z'];
    date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
    if (parts.length === format.parts.length) {
      for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
        val = parseInt(parts[i], 10);
        part = format.parts[i];
        if (isNaN(val)) {
          switch (part) {
            case 'MM':
              filtered = $(dates[language].months).filter(function () {
                var m = this.slice(0, parts[i].length),
                  p = parts[i].slice(0, m.length);
                return m === p;
              });
              val = $.inArray(filtered[0], dates[language].months) + 1;
              break;
            case 'M':
              filtered = $(dates[language].monthsShort).filter(function () {
                var m = this.slice(0, parts[i].length),
                  p = parts[i].slice(0, m.length);
                return m.toLowerCase() === p.toLowerCase();
              });
              val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
              break;
            case 'p':
            case 'P':
              val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
              break;
            case 'z':
            case 'Z':
              timezone;
              break;

          }
        }
        parsed[part] = val;
      }
      for (var i = 0, s; i < setters_order.length; i++) {
        s = setters_order[i];
        if (s in parsed && !isNaN(parsed[s]))
          setters_map[s](date, parsed[s])
      }
    }
    return date;
  },
  formatDate:       function (date, format, language, type, timezone) {
    if (date === null) {
      return '';
    }
    var val;
    if (type === 'standard') {
      val = {
        t:    date.getTime(),
        // year
        yy:   date.getUTCFullYear().toString().substring(2),
        yyyy: date.getUTCFullYear(),
        // month
        m:    date.getUTCMonth() + 1,
        M:    dates[language].monthsShort[date.getUTCMonth()],
        MM:   dates[language].months[date.getUTCMonth()],
        // day
        d:    date.getUTCDate(),
        D:    dates[language].daysShort[date.getUTCDay()],
        DD:   dates[language].days[date.getUTCDay()],
        p:    (dates[language].meridiem.length === 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
        // hour
        h:    date.getUTCHours(),
        // minute
        i:    date.getUTCMinutes(),
        // second
        s:    date.getUTCSeconds(),
        // timezone
        z:    timezone
      };

      if (dates[language].meridiem.length === 2) {
        val.H = (val.h % 12 === 0 ? 12 : val.h % 12);
      }
      else {
        val.H = val.h;
      }
      val.HH = (val.H < 10 ? '0' : '') + val.H;
      val.P = val.p.toUpperCase();
      val.Z = val.z;
      val.hh = (val.h < 10 ? '0' : '') + val.h;
      val.ii = (val.i < 10 ? '0' : '') + val.i;
      val.ss = (val.s < 10 ? '0' : '') + val.s;
      val.dd = (val.d < 10 ? '0' : '') + val.d;
      val.mm = (val.m < 10 ? '0' : '') + val.m;
    } else if (type === 'php') {
      // php format
      val = {
        // year
        y: date.getUTCFullYear().toString().substring(2),
        Y: date.getUTCFullYear(),
        // month
        F: dates[language].months[date.getUTCMonth()],
        M: dates[language].monthsShort[date.getUTCMonth()],
        n: date.getUTCMonth() + 1,
        t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
        // day
        j: date.getUTCDate(),
        l: dates[language].days[date.getUTCDay()],
        D: dates[language].daysShort[date.getUTCDay()],
        w: date.getUTCDay(), // 0 -> 6
        N: (date.getUTCDay() === 0 ? 7 : date.getUTCDay()),       // 1 -> 7
        S: (date.getUTCDate() % 10 <= dates[language].suffix.length ? dates[language].suffix[date.getUTCDate() % 10 - 1] : ''),
        // hour
        a: (dates[language].meridiem.length === 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
        g: (date.getUTCHours() % 12 === 0 ? 12 : date.getUTCHours() % 12),
        G: date.getUTCHours(),
        // minute
        i: date.getUTCMinutes(),
        // second
        s: date.getUTCSeconds()
      };
      val.m = (val.n < 10 ? '0' : '') + val.n;
      val.d = (val.j < 10 ? '0' : '') + val.j;
      val.A = val.a.toString().toUpperCase();
      val.h = (val.g < 10 ? '0' : '') + val.g;
      val.H = (val.G < 10 ? '0' : '') + val.G;
      val.i = (val.i < 10 ? '0' : '') + val.i;
      val.s = (val.s < 10 ? '0' : '') + val.s;
    } else {
      throw new Error('Invalid format type.');
    }
    var date = [],
      seps = $.extend([], format.separators);
    for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
      if (seps.length) {
        date.push(seps.shift());
      }
      date.push(val[format.parts[i]]);
    }
    if (seps.length) {
      date.push(seps.shift());
    }
    return date.join('');
  },
  convertViewMode:  function (viewMode) {
    switch (viewMode) {
      case 4:
      case 'decade':
        viewMode = 4;
        break;
      case 3:
      case 'year':
        viewMode = 3;
        break;
      case 2:
      case 'month':
        viewMode = 2;
        break;
      case 1:
      case 'day':
        viewMode = 1;
        break;
      case 0:
      case 'hour':
        viewMode = 0;
        break;
    }

    return viewMode;
  },
  headTemplate: '<thead>' +
              '<tr>' +
              '<th class="prev"><i class="{iconType} {leftArrow}"/></th>' +
              '<th colspan="5" class="switch"></th>' +
              '<th class="next"><i class="{iconType} {rightArrow}"/></th>' +
              '</tr>' +
    '</thead>',
  headTemplateV3: '<thead>' +
              '<tr>' +
              '<th class="prev"><span class="{iconType} {leftArrow}"></span> </th>' +
              '<th colspan="5" class="switch"></th>' +
              '<th class="next"><span class="{iconType} {rightArrow}"></span> </th>' +
              '</tr>' +
    '</thead>',
  contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
  footTemplate: '<tfoot>' + 
                  '<tr><th colspan="7" class="today"></th></tr>' +
                  '<tr><th colspan="7" class="clear"></th></tr>' +
                '</tfoot>'
};
DPGlobal.template = '<div class="datetimepicker">' +
  '<div class="datetimepicker-minutes">' +
  '<table class=" table-condensed">' +
  DPGlobal.headTemplate +
  DPGlobal.contTemplate +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '<div class="datetimepicker-hours">' +
  '<table class=" table-condensed">' +
  DPGlobal.headTemplate +
  DPGlobal.contTemplate +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '<div class="datetimepicker-days">' +
  '<table class=" table-condensed">' +
  DPGlobal.headTemplate +
  '<tbody></tbody>' +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '<div class="datetimepicker-months">' +
  '<table class="table-condensed">' +
  DPGlobal.headTemplate +
  DPGlobal.contTemplate +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '<div class="datetimepicker-years">' +
  '<table class="table-condensed">' +
  DPGlobal.headTemplate +
  DPGlobal.contTemplate +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '</div>';
DPGlobal.templateV3 = '<div class="datetimepicker">' +
  '<div class="datetimepicker-minutes">' +
  '<table class=" table-condensed">' +
  DPGlobal.headTemplateV3 +
  DPGlobal.contTemplate +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '<div class="datetimepicker-hours">' +
  '<table class=" table-condensed">' +
  DPGlobal.headTemplateV3 +
  DPGlobal.contTemplate +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '<div class="datetimepicker-days">' +
  '<table class=" table-condensed">' +
  DPGlobal.headTemplateV3 +
  '<tbody></tbody>' +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '<div class="datetimepicker-months">' +
  '<table class="table-condensed">' +
  DPGlobal.headTemplateV3 +
  DPGlobal.contTemplate +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '<div class="datetimepicker-years">' +
  '<table class="table-condensed">' +
  DPGlobal.headTemplateV3 +
  DPGlobal.contTemplate +
  DPGlobal.footTemplate +
  '</table>' +
  '</div>' +
  '</div>';
$.fn.datetimepicker.DPGlobal = DPGlobal;

/* DATETIMEPICKER NO CONFLICT
 * =================== */

$.fn.datetimepicker.noConflict = function () {
  $.fn.datetimepicker = old;
  return this;
};

/* DATETIMEPICKER DATA-API
 * ================== */

$(document).on(
  'focus.datetimepicker.data-api click.datetimepicker.data-api',
  '[data-provide="datetimepicker"]',
  function (e) {
    var $this = $(this);
    if ($this.data('datetimepicker')) return;
    e.preventDefault();
    // component click requires us to explicitly show it
    $this.datetimepicker('show');
  }
);
$(function () {
  $('[data-provide="datetimepicker-inline"]').datetimepicker();
});

}));


;(function($){
	$.fn.datetimepicker.dates['zh-CN'] = {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			today: "今天",
			suffix: [],
			meridiem: ["上午", "下午"]
	};
}(jQuery));