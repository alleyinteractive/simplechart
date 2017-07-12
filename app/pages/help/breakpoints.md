## Using Breakpoints

Simplechart is designed to draw charts with a fixed height and variable width. Sometimes, this requires special handling for different screen sizes, e.g. desktop vs. mobile. The **Breakpoints** feature allows you specify the chart's height depending on the available width of the screen or page design.

The default breakpoint sets a height of 400 pixels at all screen widths. At that height, a chart might look like this on a desktop monitor:

![400px chart height on desktop](http://simplechart.io/lib/images/help-docs/breakpoints/embed_desktop_400.png)

And this on a mobile device:

<p style="max-width: 225px">
![400px chart height on mobile](http://simplechart.io/lib/images/help-docs/breakpoints/embed_mobile_400.png)
</p>

If you wanted the chart to take up less of the screen on mobile devices, here's how you would change the height to 250 pixels on devices up to 400 pixels wide:

![Adding a breakpoint](http://simplechart.io/lib/images/help-docs/breakpoints/adding_breakpoint.gif)

Now, the chart looks like this:

<p style="max-width: 225px">
![250px chart height on mobile](http://simplechart.io/lib/images/help-docs/breakpoints/embed_mobile_250.png)
</p>

We did this by:

1. Clicking the green "Add Breakpoint" button
1. Setting the max width to `400`
1. Setting the height to `250`

After those steps, the chart has two breakpoints:

* Regardless of screen width, **Breakpoint 1** sets the _height_ to 400 pixels.
* On screens up to 400 pixels wide, **Breakpoint 2** supersedes Breakpoint 1 and reduces the height to 250 pixels.
