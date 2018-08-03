/*
EVENTER: simple data binding
- data-bind's a data-event to an element, then executes its handler below

IN THEORY:
<element
	data-bind='action'				// DOM event to bind
	data-event='handler'			// handle the event action
	data-more-attrs='more data'		// additional data to be handled
</element>

EXAMPLE:
- this image if bound by a click event
- when the image is clicked on it is handled by the linkTo event
- the linkTo event handler takes an additiional data-link attribute
- the link data is a url passed to redirect the window.location.href to
<img data-bind='click'					// binds image to click event
	data-event='linkTo'					// executes the linkTo handler
	data-link='http://www.url.com'		// takes a link arguement to redirect the URL to
/>
*/
(function($) {
	// when document ready
	$(document).ready(function() {
		// DOM global
		let self = $(this);
		// EVENTER — pass custom event handlers
		let eventBinder = new EventBinder({
			// toggles elements active state
			toggler: function() {
				// trigger element
				$(this).toggleClass('active');
				// toggled element
				let toggledElement = $(this).data('toggle');
				$(toggledElement).toggleClass('active');
			},
			// redirects to a data-link page url
			linkTo: function(event) {
				let linkTarget = event.target.getAttribute('data-link');
				if (linkTarget) { window.location.href = linkTarget; }
				return;
			},
			// creates a model/lightbox to display the data-view content
			fullscreen: function(event) {
				// do stuff with view content
				let viewContent = event.target.getAttribute('data-view');
				let box = $('#fullscreen-lightbox');
				// light box exists
				if (box.length) {
					// update view box content src
					let viewBox = box.find('.view-content')[0];
					$(viewBox).attr('src', viewContent);
					box.toggleClass('active');
				// light box does NOT exist
				} else {
					// add lightbox to DOM
					let FS_lightbox = '<div id="fullscreen-lightbox" class="fs-lightbox active">';
						FS_lightbox += '<a class="inner-toggle fs-lb-close" data-bind="click" data-event="toggler" data-toggle="#fullscreen-lightbox"><i class="fa fa-plus"></i> exit fullscreen</a>';
						FS_lightbox += '<div class="inner-content">';
						FS_lightbox += '<img class="view-content" src="' + viewContent + '"/>';
						FS_lightbox += '</div></div>';
					$('body').append(FS_lightbox);
					eventBinder.updateEvents();
				}
			}
		});
	});
	// EventBinder CLASS
	class EventBinder {
		// construct event handler obj
		constructor(handlers={}, start=true) {
			// elements to bind
			this.toBind = document.querySelectorAll('[data-bind]');
			// obj containing all the event actions
			this.handlers = handlers;
			// updater
			this.updateEvents = () => {
				this.toBind = document.querySelectorAll('[data-bind]');
				this.init();
			};
			// if initated
			if (start) { this.init(); }
			return this;
		}
		// bind event actions to DOM elements
		bindEvents() {
			// for each element
			this.toBind.forEach((element, index) => {
				// get variables
				let listener = element.getAttribute('data-bind') || 'click',
					handler = element.getAttribute('data-event'),
					binded = element.getAttribute('data-binded');
				// chech for the event listener in the handlers obj
				if (typeof this.handlers[listener] !== undefined) {
					// if not already bound
					if (!binded) {
						// bind each event to element
						element.setAttribute('data-binded', 'true');
						element.addEventListener(listener, this.handlers[handler]);
					}
				}
			});
		}
		// initiate event binding
		init() { return this.bindEvents(); }
	}
} (jQuery));