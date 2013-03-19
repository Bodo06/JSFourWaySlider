(function ($) {
	$.fn.SlideContent = function (element, position, slideParentHeight, speed, easing, callback) {
		var that = this;

		var SlideContentInUseAttr = 'SlideContentInUse';
		if (typeof that.data(SlideContentInUseAttr) == 'undefined') {
			that.data(SlideContentInUseAttr, false);
		}
		if (that.data(SlideContentInUseAttr)) {
			return;
		}
		that.data(SlideContentInUseAttr, true);

		callback = callback || function (elem) {
			$(elem).remove();
		};
		slideParentHeight = slideParentHeight || true;
		var speed = speed || 300;
		var easing = easing || 'swing';
		element = $(element);
		var sibling = that.children();

		// Save margins of container in variables
		var startMarginX = Math.abs(parseInt(that.css('margin-left')));
		var startMarginY = Math.abs(parseInt(that.css('margin-top')));

		/**
		 * Animates the container (this) to the given height.
		 * @param height The height to set
		 */
		var animateContainerHeight = function (height) {
			if (slideParentHeight) {
				that.parent().animate({ 'height': +Math.abs(parseInt(height)) + 'px' }, speed, easing);
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

			element.fadeIn(speed, function () {
				that.data(SlideContentInUseAttr, false);
				callback(sibling.detach());
			});
			animateContainerHeight(element.outerHeight());
			return;

			// If the given element is already displayed, return.
		} else if (sibling.is(element)) {
			that.data(SlideContentInUseAttr, false);
			return;
		}

		// Append temp dir to
		var tempdir = $('<div>').attr('id', 'slidecontent_temp_container').css({
			'display': 'none',
			'visibility': 'hidden',
			'height': '0px',
			'width': '0px',
			'overflow': 'hidden'
		}).appendTo($('body'));

		// switch for the single fade directions.
		if ('left' == position) {
			tempdir.append(element);
			var width = parseInt(element.outerWidth());
			element.detach();

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

			$(element).animate({ 'margin-left': startMarginX + 'px' }, speed, easing, function () {
				that.data(SlideContentInUseAttr, false);
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

			$(sibling).animate({ 'margin-left': ( startMarginX - width ) + 'px' }, speed, easing, function () {
				that.data(SlideContentInUseAttr, false);
				callback(resetCSSToStart(sibling.detach()));
				resetCSSToStart(element.css('float', 'none'));
			});

		} else if ('top' == position) {
			tempdir.append(element);
			var height = parseInt(element.outerHeight());
			element.detach();

			element.css({
				'margin-left': startMarginX + 'px',
				'margin-top': ( startMarginY - height ) + 'px'
			});
			sibling.css({
				'margin-left': startMarginX + 'px',
				'margin-top': 0 + 'px'
			});

			this.prepend(element.detach());

			$(element).animate({ 'margin-top': startMarginY + 'px' }, speed, easing, function () {
				that.data(SlideContentInUseAttr, false);
				callback(resetCSSToStart(sibling.detach()));
			});

		} else if ('bottom' == position) {

			element.css({
				'margin-left': startMarginX + 'px',
				'margin-top': '0px'
			});
			this.append(element.detach());

			$(sibling).animate({ 'margin-top': ( startMarginY - parseInt(sibling.outerHeight()) ) + 'px' }, speed, easing, function () {
				that.data(SlideContentInUseAttr, false);
				callback(resetCSSToStart(sibling.detach()));
				resetCSSToStart(element);
			});
		} else {
			return;
		}

		tempdir.remove();
		animateContainerHeight(element.outerHeight());
		that.data(SlideContentInUseAttr, false);
	};
})(jQuery);