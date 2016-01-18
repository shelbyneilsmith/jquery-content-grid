# jquery-content-grid
*jQuery Plugin for Displaying Content in a grid form*

To start, you just need an unordered list with a class on the main "ul" element ('content-grid' is the default) and the class 'grid-square' on each "li" element. The inner contents of each li can be anything, but a square-ish image is preferable - no link ("a" element) is necessary.

``` js
<ul class='content-grid'>
  <li class='grid-square'>...</li>
  <li class='grid-square'>...</li>
  <li class='grid-square'>...</li>
</ul>
```

Next, you must create a new $.ContentGrid object, set an options you might want and then initialize the grid:

``` js
var cg = new $.ContentGrid();
cg.init();
```
## Getting Content

You will also need some sort of way to get the content that populates the "active-container" when each list item is clicked.
To do this, you can either access some sort of static content by sending a function to the "getActiveContent" option, or you can send parameters to the "ajax" option and generate dynamic content.

### Non-Ajax Way
First you must use the "getActiveContent" option to get your new content saved to a variable that is then passed to whatever function is sent to the "contentCallback" option.
``` js
var getActiveContentFunction = function() {
  // access static content here.
  // you don't have to worry about adding your content to the "active-container", this will be done for you automatically
};

var doSomethingWithContent = function() {
  // this is only necessary if you want to do anything extra after your content has been displayed
);

var cg = new $.ContentGrid({
  getActiveContent: getActiveContentFunction,
  contentCallback: doSomethingWithContent
});
```

### Ajax Way
To use ajax, again you can pass two separate functions to the plugin's options - one for generating the data to send to the ajax action, and one to run on success. Only the function to generate the data object is necessary though, as the new content will be added to the "active-container" element automatically.

``` js
var generateData = function() {
  // generate your data
  return {
    ...
  };
};

var successCallback = function() {
  // do something after content is displayed
};

var cg = new $.ContentGrid({
  ajax: {
    url: MyAjax.ajaxurl, // wordpress syntax
    ajaxDataFunction: generateData // this function needs to return a data object (including the action, if necessary)
  },
  contentCallback: successCallback
});
```

## Other Options

As of right now, there are only two other options for this plugin - one called "container" that allows you to override the default list container element of $('.content-grid') and the other is called "directionNav", which adds "next" and "previous" controls to the active container. This is set to false by default.

``` js
var cg = new $.ContentGrid({
  container: $('.some-other-element'),
  directionNav: true,
});
```

If the "directionNav" option is set to true, it not only adds the next and previous controls, but the user can access these controls with the left and right arrow keys as well as the on-screen navigation.
