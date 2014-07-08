# Changes

## 1.4.8

* FIX: In jquery amd dependency. Patch by Guido Contreras Woda. Thanks!
* ADD: Waffle.io badge. Will check out if it's cool to manage issues there.
* CHG: Using MagnificPopup instead of Colorbox in examples. Works better with endless scroll and filtering.

## 1.4.7
* ADD: `example-api` now has an additional example for a custom php based server app
* FIX: Example amd was missing required shim so imagesLoaded plugin attaches itself to jQuery
* ADD: "Mentioned or used by others" section to readme
* ADD: dryRun feature for filtering and the filter call will return the list resulting list of items as jQuery object
* CHG: Small optimization for window object
* CHG: Starting opacity for list items in examples is now 1 so opacity animations have a starting point

## 1.4.6
* New option 'verticalOffset'. Old option 'offset' still defines the horizontal offset between tiles.
* Added 'Reset filters' button to filter examples.
* 'flexibleWidth' will now be handled a bit differently. When set the plugin will try to fit as many columns into the container as possible. `itemWidth` is then the minimum width of those columns.

## 1.4.5
* Fix for placeholders in non-chrome browsers.
* The clear method of the wookmark instance will remove the instance itself.
* New introduction page with links to examples. Will work on that further on the way to 1.5.0.
* Fixed bug in example-amd with requirejs.
* CSS changes will be executed as bulk with requestAnimationFrame when available.
* Added progressbar to imagesloaded example.
* Filterclasses can be updated via the wookmarkInstance of the handler.

## 1.4.4
* Wookmark layouting won't break when container isn't visible at the start. But you should call 'refreshWookmark' after making it visible.
* Added 'possibleFilters' option. With this you can have filter even when no items fit. Patch by Aakash Goel. Thanks!
* Fix when filtering and no items match. Patch by Gabriel Kaam. Thanks!

## 1.4.3
* Enabled option 'direction'. This was an internal setting and can now be overriden to order the items from one direction but align them to a different side.

## 1.4.2
* 'flexibleWidth' now works as expected when it's greater than 50% or more than half of the containers width in pixels.

## 1.4.1
* New option 'outerOffset'. Optional offset to the sides of the tiles. The old 'offset' will only be used between tiles.

## 1.4.0
* New option 'comparator'. A comparison function which can be used to sort the items before they are positioned in the layout.
* Offset for first column is now correctly set when align is 'left' or 'right'.
* Column count behaviour improved, when browser window is resized.

## 1.3.1
* New option 'ignoreInactiveItems'. When set to 'false' inactive items will still be shown when filtered. This can be used to fade out filtered items. See the example-filter/fade.html example.

## 1.3.0
* New option 'fillEmptySpace' which creates placeholders at the bottom of the columns to create an even layout. See 'example-placeholder' on how to use it.

## 1.2.3
* FIX: layout now checks if active item count has changed and does a full relayout when that happens

## 1.2.2
* ADD: Wookmark can now be loaded as amd module
* FIX: Using load images function in all examples, so no specific load images example has been removed
* CHG: Some refactoring and cleanup in all examples

## 1.2.1
* ADD: Include filtering capability, see the examples in the example-filter folder
* FIX: Error when the layout tries to render less than 1 column
