---
sidebar_position: 5
---

# Logic

Nanc not only allows you to render UIs from XML code, but has some support for execution logic that you can program as well, via XML markup.

This section will give a brief reference to existing widgets/tags, and other aspects related to logic execution. Data extraction and modification, and more.

We deliberately do not provide in-depth help on tags, as it is already well documented in Nanc itself, besides, Nanc documentation will allow you to see the results right on the screen, and modify them in real time. So if you want to learn more about any widget/tagging aspects - check out the Nanc documentation available in any `ScreenField` editor.

## If

Conditional rendering of widgets/tags is possible with the help of a special tag `<show>`. This tag allows you to show or hide subtrees of widgets placed inside it using logical conditions. In this case, the widget that "should not be rendered" will not be simply hidden, it will not be physically created, which will favorably affect the performance of your application.

## Iteration

A special widget/tag `<for>` allows you to iterate both values and prime numbers. You can specify a numeric range, or specify some list available from the `DataStorage` global data store

## Data

You can draw the NUI interface based on the data, and update this interface when the data is updated. The following widgets/tags will help you do this: `<data>` - a tag that allows you to specify certain values on keys to be placed in `DataStorage`. This can be useful if you want to be able to change over-used parameters in one place, or if you are forming some complex data structure that will determine the appearance of any elements on the screen. Second tag: `<dataBuilder>` - allows you to update nested elements when the data used in these elements changes, or generate events when the corresponding data changes.

In order to use this functionality, in addition to using the widgets themselves - `NuiListWidget` or `NuiStackWidget` - you need to use the following widget and class somewhere in the parent zone of these widgets:

```dart
class _RootViewState extends State<RootView> {
  /// Created DataStorage will contains all the data, from the subtree, under what's it will be declared
  /// You able to have as many DataStorage's as you want, or you can have only one for whole app
  final DataStorage dataStorage = DataStorage();

  @override
  Widget build(BuildContext context) {
    /// DataStorageProvider allows us to provide data from DataStorage below to it's subtree and update corresponding widget/tags
    return DataStorageProvider(
      dataStorage: dataStorage,
      child: Scaffold(
        body: NuiListWidget(
          renderers: [
            svgRenderer(),
          ],
          xmlContent: rootViewLayout,
          pageData: {},
        ),
      ),
    );
  }
}
```

## Variables

In the NUI, you have access to the following data sources:

- Parent context - data that is intended to be changed only by the "consumer" of the NUI widgets. For example, if you want to display a list of product cards, it makes sense to place the data of these products in this data source. No additional actions are required from your side to use it. And in XML code you can access any element in the following format: `someAttribute="{{ page.some.key }}"`.
- The global data store is `DataStorage`. This data source allows you to store the same list as the previous one, however, you can manipulate the data in this source through the NUI XML markup. You can access any value from the `DataStorage` by using `{{ data.some.key }}` or iterate through it with `in="{{ data.products }}"`. More on this below
- Templates and components - special widgets/tags that allow you to reuse your components described in XML. When declaring a template, inside the `<template>` tag you can place a call to any attributes in `{{ template.someKey }}` format. And then, using this template with the `<component>` tag, you can specify attributes with the same keys, thus passing the data inside the template component

## Events

Nanc offers an event-based model of user interaction. This means that those of the widgets/tags that involve some kind of interaction can send some kind of events that you can generate. Then, you implement handlers for the corresponding events, thus achieving as much complexity and flexibility in your application's logic model as you want.

## Interactivity

You can modify data in `DataStorage` with the `emit` pre-defined event, which, if the event contains metadata, allows you to create/save/modify in `DataStorage`. Those events that contain metadata are marked in Nanc documentation with a special bar - `This event will send you additional metadata with.....`. For example, `onChange` event of widget/tag `<textField>` contains metadata with `value` key and value - the text you entered into this field. If there is only one key in the metadata (which is the case in the vast majority of such events) - then this key is omitted, as its name will not carry any useful information anyway. Consider the following example:

```xml
<textField onChanged="emit:password"/>
```

When you change the text entered in this field, the value will be automatically stored in ``DataStorage``, with the `password` key:

```json
{
  "password": "your_password"
}
```

In this case, the keys can also be compound keys:

```xml
<textField onChanged="emit:user.name"/>
```

```json
{
  "user": {
    "name": "your_user_name"
  }
}
```