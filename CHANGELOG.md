# Changes

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
