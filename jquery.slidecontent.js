var SlideContentInUse = false;

(function($) {
    $.fn.SlideContent = function(element, position, slideParentHeight, speed, easing, callback) {
        if (SlideContentInUse) {
            return;
        }

		callback = callback || function (elem) {
			$(elem).remove();
		};
        slideParentHeight = slideParentHeight || true;
        var that = this;
        var speed = speed || 300;
        var easing = easing || 'swing';
        element = $(element);
        var sibling = this.children();

        // Save margins of container in variables
        var startMarginX = Math.abs(parseInt(this.css('margin-left')));
        var startMarginY = Math.abs(parseInt(this.css('margin-top')));

        /**
         * Animates the container (this) to the given height.
         * @param height The height to set
         */
        var animateContainerHeight = function (height) {
           if (slideParentHeight) {
               that.parent().animate({ 'height':  + Math.abs(parseInt( height )) + 'px' }, speed, easing);
           }
        };

        /**
         * Sets the margins of the given element back to zero.
         * @param element The element to set.
         * @returns jQuery
         */
        var resetCSSToZero = function (element) {
            return $(element).css({
                'margin-left': '0px',
                'margin-top': '0px'
            });
        };

        /**
         * Sets the margins of the given element back to start values.
         * @param element The element to set.
         * @returns jQuery
         */
        var resetCSSToStart = function (element) {
            return $(element).css({
                'margin-left': startMarginX + 'px',
                'margin-top': startMarginY + 'px'
            });
        };

        // If no slide is displayed yet, simply fade the given element in.
        if (0 == this.children().length) {
            this.append(resetCSSToStart(element.hide().detach()));

            SlideContentInUse = true;
            element.fadeIn(speed, function () {
                SlideContentInUse = false;
                callback(sibling.detach());
            });
            animateContainerHeight(element.outerHeight());
            return;

        // If the given element is already displayed, return.
        } else if (sibling.is(element)) {
            return;
        }

        // switch for the single fade directions.
        if ('left' == position) {
            var width = parseInt(element.outerWidth());
			
			// If the width of element could not be recieved, it will be assumed
			// that element has the same width as sbling
			if (0 == width) {
				width = parseInt(sibling.outerWidth());
			}

            element.css({
                'margin-left': ( startMarginX - width ) + 'px',
                'margin-top': startMarginY + 'px',
                'float': 'left'
            });
            sibling.css({
                'margin-left': '0px',
                'margin-top': startMarginY + 'px',
                'float': 'left'
            });

            this.prepend(element.detach());

            SlideContentInUse = true;
            $(element).animate({ 'margin-left': startMarginX + 'px' }, speed, easing, function () {
                SlideContentInUse = false;
                element.css('float', 'none');
                callback(resetCSSToStart(sibling.css('float', 'none')).detach());
            });

        } else if ('right' == position) {
            var width = parseInt(sibling.outerWidth());

            element.css({
                'margin-left': '0px',
                'margin-top': startMarginY + 'px',
                'float': 'left'
            });
            sibling.css('float', 'left');
            this.append(element.detach());

            SlideContentInUse = true;
            $(sibling).animate({ 'margin-left': ( startMarginX - width ) + 'px' }, speed, easing, function () {
                SlideContentInUse = false;
                callback(resetCSSToStart(sibling.detach()));
                resetCSSToStart(element.css('float', 'none'));
            });

        } else if ('top' == position) {
            element.css({
                'margin-left': startMarginX + 'px',
                'margin-top': ( startMarginY - parseInt(element.outerHeight()) )+ 'px'
            });
            sibling.css({
                'margin-left': startMarginX + 'px',
                'margin-top': 0 + 'px'
            });

            this.prepend(element.detach());

            SlideContentInUse = true;
            $(element).animate({ 'margin-top': startMarginY + 'px' }, speed, easing, function () {
                SlideContentInUse = false;
                callback(resetCSSToStart(sibling.detach()));
            });

        } else if ('bottom' == position) {

            element.css({
                'margin-left': startMarginX + 'px',
                'margin-top': '0px'
            });
            this.append(element.detach());

            SlideContentInUse = true;
            $(sibling).animate({ 'margin-top': ( startMarginY - parseInt(sibling.outerHeight()) ) + 'px' }, speed, easing, function () {
                SlideContentInUse = false;
                callback(resetCSSToStart(sibling.detach()));
                resetCSSToStart(element);
            });
        } else {
            SlideContentInUse = false;
            return;
        }

        animateContainerHeight(element.outerHeight());
    };
})(jQuery);