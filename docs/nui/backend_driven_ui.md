---
sidebar_position: 1
---

# Backend driven UI

Nanc Backend Driven UI, called **NUI**, allows you to implement an interface of almost any complexity out of the box. That being said, you can extend the widgets available to you relatively easily and do whatever you want.

You have access to logical operators that hide or show interface elements, cycles, templating and variables - defined directly in the UI code and accessible from the outside - for example, the entire parent context of the document, one of the fields of which is `Screen Field`.

## How to start

First you need to add the **Screen** field to your model. Depending on how it's created - with code or through the user interface - you'll use the appropriate paths. For the code you will need the `ScreenField` class from the fields package.

But we'll take a look at the approach to creating mobile application screens through the Nanc user interface.

### Adding Screen field

<video src="/videos/adding_screen_field.mp4" controls width="100%"></video>

When adding a field, you must select the type of screen you want to add. Let's take a closer look at them.

#### Scrollable

This type corresponds to the usual vertically scrolling screen, which can be any number of interface elements. All the widgets you will add to this screen will be drawn as if you were adding them to the `SliverList`. At the moment there is no support for slivers, but it will appear soon.

```dart
Widget build() {
  final List<Widget> widgets = [/* YOUR WIDGETS HERE */];

  return CustomScrollView(
    slivers: [
      SliverList(
        delegate: SliverChildBuilderDelegate(
          (BuildContext context, int index) => widgets[index],
          childCount: widgets.length,
        ),
      ),
    ],
  );
}
```

#### Stack

In this mode, all widgets you add will be displayed in the parent widget type `Stack`. This can be useful if you want to implement not just a scrolling list of something, but to add layering. Also, this mode allows you to implement not only screens as a minimal unit of visual functionality, but also individual small widgets that you can embed anywhere in your application as the most common widgets, but that you can completely change the appearance of these widgets at the initiative of the backend, thus updating your application.

```dart
Widget build() {
  final List<Widget> widgets = [/* YOUR WIDGETS HERE */];

  return Stack(
    fit: StackFit.expand,
    children: widgets,
  );
}
```

### UI syntax

The syntax chosen is XML/HTML, with some simplifications and modifications (not many).

The main simplification is that there is no requirement for your code to have a single root element. No matter what type your screen/component is - `Scrollable` or `Stack` - you can describe your interface starting from the first element you want to display.

Now to the modifications - they don't change the XML syntax, but add to it. To access variables you should use the syntax `{{ ... }}`, where instead of `...` is your expression - a reference to some variable.

For example, if there is a variable with the key `age` and a primitive value in the parent context (to be discussed below), you could create a widget-text describing the age of something or someone as follows:

```html
<text>
  This civilization age was {{ page.age }} centuries.
</text>
```

Another addition is a special expression for defining cycles. One way to draw something in a loop would be the following expression:

```html
<for in="{{ 0...10 }}">
  <!- YOUR WIDGET -->
</for>
```

The start and end of the loop can be any positive numbers. Next examples are correct too:

```html
<for in="{{ 20...100 }}">
  <!- YOUR WIDGET -->
</for>
```

```html
<for in="{{ 50...0 }}">
  <!- YOUR WIDGET -->
</for>
```

Also, there is no strict requirement on exactly how you should close tags. For some widgets, you simply have no choice but to close them in a paired way - because the key argument of the widget (tag) must be inside the body of the tag, and not be a parameter, for example:

```html
<text>
  Some text here
</text>
```

But for some tags, you can use a self-closing tag construct (also, as an paired variant):

```html
<sizedBox height="12"/>

<container height="1" color="#FFF77669"/>

<container>
  <padding all="8">
    <text>
      Some text here
    </text>
  </padding>
</container>
```

### Variables

#### Local variables

You can define custom variables right in your UI code, which can be useful when setting common indents, font names, colors, roundings, and more. You should use the `data` tag for this:

```html
<data id="gap" left="16" top="12" right="16" bottom="32"/>
```

#### Parent context variables

You, also, have access to the "parent context" - all fields of any type, in a parent object, one of whose fields is `Screen Field`.

Let's add some data to our test model to see how the interface can be handled in a data-driven approach:

<video src="/videos/parent_context.mp4" controls width="100%"></video>

And here how it will looks like, if we want to put data in the mobile app:

```dart
Widget build() {
  return NUIWidget(
    type: NUIWidgetType.stack,
    renderers: const [],
    imageErrorBuilder: null,
    imageFrameBuilder: null,
    imageLoadingBuilder: null,
    xmlContent: '''
      <center>
        <column mainAxisSize="min">
          <text size="18">
            You have pushed the button this many times:
          </text>
          <text size="32">
            {{ page.counter }}
          </text>
        </column>
      </center>
    ''',
    /// ⬇︎⬇︎ Your data here ⬇︎⬇︎
    pageData: {
      'counter': _counter,
    },
  );
}
```

As you have already realized, to access variables externally, you must use the `page` keyword inside the double curly braces. You can refer to any nested element, at any level of nesting, say, if you have the following object:

```json5
// Just for example - parent context contains a data, which describing some car
{
  "make": "Toyota",
  "characteristics": [
    {
      "name": "engine",
      "value": "V6 Turbo"
    }
  ]
}
```

You can easily get the name of the engine somewhere: `page.characteristics.0.value`. In case you try to refer to some variable, at any depth, that does not exist - you will get `null` as a result: `page.characteristics.3.value.some.another.prop` will be returned as `null`.

### Implemented widgets

Currently implemented quite a large list of standard widgets that you can use to build the UI. This list will be constantly expanding until it covers all implemented widgets from the Flutter standard library. You can find out the full list in Nanc by adding `ScreenField` to some model, then start editing it and go to the `Help` section by the button on the top right.

### Logic

Nanc supports many ways to achieve interactivity - handling custom clicks/taps, long presses, gestures, creating and destroying widgets on the screen. You can come up with your own and implement them. In any case, the event you can catch and handle is a simple string that will be passed to the event handler when some action happens (click, long tap, widget appears, etc). In this example, we will understand the handling of an event that occurs when a user clicks on a screen element:

```html
<inkWell onPressed="addToCart:{{ page.product_id }}">
  <container>
    <center>
      <text>
        Buy
      </text>
    </center>
  </container>
</inkWell>
```

The value of the `onPressed` parameter - within the framework of Nanc concepts, is called an event. Event can be any string, and you can assign handlers for any events. Say, you can make a handler for events starting with the string `addToCart:`.

The event handler is a special `EventHandler` class that you can import from the [config](./packages/config) package.

Having implemented the required `EventHandler`s - you must implement them in your widget tree via another widget called `EventDelegate`, which you can import from the `nanc_renderer` package - the package required for your mobile application that is going to render the **NUI**:

```dart
Widget build() {
  return EventDelegate(
    handlers: [
      browserLinksHandler,
      snackbarHandler,
      deeplinkHandler,
      addToCardHandler,
      // ...
      // List of your own handlers
    ],
    child: child, // You can place in near to the top of your widget tree
  );
}
```

If you approach the design of events handlers with foresight, you can implement very complex user scenarios, say - by implementing an event handling queue:

```html
<inkWell onPressed="addToCart:12345 > showNotification:'You successfully added product to your cart!' > somethingElse">
  <productCard/>
</inkWell>
```

You are free to determine how you label events, what they will be, and what you can do with them.

:::tip
Also, you may want to consider just specifying an identifier as the event, the corresponding handler will take that identifier, go to the backend, and get all the necessary arguments from that identifier that you would otherwise have to specify in the event itself.
:::

### Help

As mentioned above - Nanc has built-in interactive documentation for each widget implemented as a tag, and each widget parameter. We will intentionally not list all of them here to encourage you to use the built-in Nanc documentation. We will only repeat how you can get acquainted with it:

- Create your first model
- Add `ScreenField` to this model
- Create the first document of the corresponding model
- Start editing the previously created `ScreenField` field
- Go to the `Help` section by clicking the appropriate button on the top right

<video src="/videos/screen_field_help.mp4" controls width="100%"></video>

### IDE sync

At the moment, the built-in code editor in Nanc is, frankly, crappy. In addition, if you are a developer, it will be much more convenient for you to develop a new screen or component in Nanc in your favorite and cozy IDE. That's why Nanc supports this feature - you can sync Nanc's screen editor with any file on your file system. It doesn't matter if Nanc is running in your browser, deployed somewhere, or if you run it locally under a desktop platform (Mac / Windows / Linux). But, don't forget - to have this ability in web-environment, you should [install](./nanc_configuring#web-app-configuration) additional thing too.

To understand what the essence is, you can watch the following video:

<video src="/videos/sync_with_ide.mp4" controls width="100%"></video>