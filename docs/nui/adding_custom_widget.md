---
sidebar_position: 2
---

# How to add custom widget

There can be many reasons for adding a new widget type (with the corresponding tag addition) - lack of an implemented widget list, complex and specific animations that can only be implemented directly in Dart, or equally complex logic. In this example, we will look at the process of adding a new widget that will be responsible for displaying SVG images.

## Prerequisites

In order for you to create your own tagged widget, you need to import the [`nanc_renderer`](../packages/renderer) package.

## Tag renderer

The second step is to create a tag renderer.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:nanc_icons/nanc_icons.dart';
import 'package:nanc_renderer/nanc_renderer.dart';

TagRenderer svgRenderer() {
  return TagRenderer(
    icon: IconPack.mdi_svg,
    tagType: TagType.widget,
    tag: 'svg',
    description: const TagDescription(
      description: '',
      arguments: [],
      properties: [],
    ),
    example: '',
    builder: (BuildContext context, WidgetTag element, RichRenderer richRenderer) {
      return SvgPicture.asset('some_path');
    },
  );
}
```

First, let's look at the renderer preset: it's an instance of the `TagRenderer` class with several fields:
- Icon (can be any icon in `IconData` format.
- Tag type; in this case it's a regular `widget`, what other types there are we'll look at next.
- Tag - this is the very tag, writing which in XML code you will see your widget. Let us draw your attention to the fact that in one application there can be only one tag with a certain name at a time. Therefore, if you decide to add a new renderer with a tag that already exists - you will get a build error.
- Description is an interactive documentation for your tag, we will also dwell on it in detail, but later.
- Example is part of the interactive documentation.
- Builder - a function that returns some widget or null. We will start with its analysis.

### Builder

#### Widget tag

Builder takes three parameters as an argument. There is no point in dwelling on the context, so let's go straight to `WidgetTag` - this is a representation of the tag itself, in accordance with which you create your widget. The `WidgetTag` contains the arguments you specified in the xml code, as well as references to its descendants.

For example, such xml code would yield the following list of arguments:

```xml
<svg ref="https://cdn.ourhost.com/svg_icons/123.svg" color="red"/>
```

`final Map<String, String> arguments = element.arguments;`

```json
{
  "ref": "https://cdn.ourhost.com/svg_icons/123.svg",
  "color": "red"
}
```

As you understand from this example - only one value is matched to one parameter.

#### Arguments extraction

Let's extend our example and write a DTO in which we will collect all the values of the arguments we are going to process:

```dart
import 'package:flutter/material.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:nanc_renderer/nanc_renderer.dart';
import 'package:tools/tools.dart';

part 'svg_arguments.g.dart';

@JsonSerializable()
class SvgArguments {
  const SvgArguments({
    required this.ref,
    required this.vec,
    required this.height,
    required this.width,
    required this.size,
    required this.alignment,
    required this.package,
    required this.fit,
    required this.drawOutside,
    required this.clip,
    required this.color,
    required this.matchTextDirection,
  });

  factory SvgArguments.fromJson(dynamic json) => _$SvgArgumentsFromJson(castToJson(json));

  final String? ref;
  final String? vec;

  @JsonKey(fromJson: nullableDoubleFromJson)
  final double? height;

  @JsonKey(fromJson: nullableDoubleFromJson)
  final double? width;

  @JsonKey(fromJson: nullableDoubleFromJson)
  final double? size;

  @JsonKey(unknownEnumValue: JsonKey.nullForUndefinedEnumValue)
  final AlignmentEnum? alignment;

  final String? package;

  @JsonKey(unknownEnumValue: JsonKey.nullForUndefinedEnumValue)
  final BoxFit? fit;

  @JsonKey(fromJson: nullableBoolFromJson)
  final bool? drawOutside;

  final Clip? clip;

  @JsonKey(fromJson: nullableColorFromJson, toJson: colorToJson)
  final Color? color;

  @JsonKey(fromJson: nullableBoolFromJson)
  final bool? matchTextDirection;

  Json toJson() => _$SvgArgumentsToJson(this);
}
```

As you can see, ready functions for field serialization / deserialization are actively used here, and in addition - all fields of our DTO are optional. It is highly recommended to always make all fields optional, as any of the arguments may not be present in the XML code. You can get ready functions for serialization / deserialization from the [`tools`](../packages/tools) package.

Let's take a look at the updated renderer:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:nanc_icons/nanc_icons.dart';
import 'package:nanc_renderer/nanc_renderer.dart';

import 'svg_arguments.dart';

TagRenderer svgRenderer() {
  return TagRenderer(
    icon: IconPack.mdi_svg,
    tagType: TagType.widget,
    tag: 'svg',
    description: const TagDescription(
      description: '',
      arguments: [],
      properties: [],
    ),
    example: '',
    builder: (BuildContext context, WidgetTag element, RichRenderer richRenderer) {
      final SvgArguments arguments = SvgArguments.fromJson(element.attributes);

      if (arguments.ref == null || arguments.ref!.isEmpty) {
        return null;
      }

      return SvgPicture.asset(
        arguments.ref!,
        height: arguments.size ?? arguments.height,
        width: arguments.size ?? arguments.width,
        alignment: arguments.alignment?.toAlignment() ?? Alignment.center,
        fit: arguments.fit ?? BoxFit.contain,
        allowDrawingOutsideViewBox: arguments.drawOutside ?? false,
        clipBehavior: arguments.clip ?? Clip.hardEdge,
        matchTextDirection: arguments.matchTextDirection ?? false,
      );
    },
  );
}
```

That's it! If we were creating a fairly simple widget that has no descendants, and no complex parameters, then that would be the end of our custom renderer creation, and we would only have to use it in the [Nanc configuration](../cms_configuration), and the [`NuiListWidget`/`NuiStackWidget`](../app_configuring) mobile application widget.

Also, note how the absence of the mandatory argument `ref` is handled - it may still be missing in the DTO and in this case our renderer will just return `null`, but if this argument is present - we can already build our widget and return it.

#### Rich renderer

What if you need to handle more complex widget parameters than the usual scalar variables or `enum`s? For example - a list of headers to get an SVG image over the network, or creating a parameter like `ColorFilter`?

This is where the third parameter of the `builder` function - `RichRenderer` - comes to our aid. The main task of this class is to render widgets from tags. Where to get these tags? Well - `WidgetTag` contains not only a description of itself, but also references to its descendants, which we can render.

This can be useful if you are creating a complex widget that may have descendant widgets. What about complex parameters?

This is where `RichRenderer` is helped by the auxiliary class `PropertiesExtractor`, which takes widgets processed by `RichRenderer` as input and can filter out those that are special widgets containing data.

Also, to make it clear which parameters we can and are going to extract, we need to write a handler for the corresponding parameter. This is almost similar to the `TagRenderer` concept, but somewhat simpler. Let's look at it on the example of both headers and color filter.

## Properties renderer

### Complex properties

Header property:

```dart
import 'package:flutter/material.dart';
import 'package:nanc_renderer/nanc_renderer.dart';

import 'header_arguments.dart';
import 'headers_property_widget.dart';

typedef Header = MapEntry<String, String>;

const String header = 'header';

PropertyTagRenderer<Header> headerProperty({String name = header}) {
  return PropertyTagRenderer(
    tag: name,
    builder: (BuildContext context, WidgetTag element, RichRenderer renderer) {
      final HeaderArguments headerArguments = HeaderArguments.fromJson(element.attributes);

      if (headerArguments.isEmpty) {
        return null;
      }

      return HeadersPropertyWidget(
        name: name,
        property: MapEntry(headerArguments.name!, headerArguments.value!),
      );
    },
  );
}
```

Header property arguments:

```dart
import 'package:json_annotation/json_annotation.dart';
import 'package:tools/tools.dart';

part 'header_arguments.g.dart';

@JsonSerializable()
class HeaderArguments {
  const HeaderArguments({
    required this.name,
    required this.value,
  });

  factory HeaderArguments.fromJson(dynamic json) => _$HeaderArgumentsFromJson(castToJson(json));

  final String? name;
  final String? value;

  bool get isEmpty => name == null || value == null || name!.isEmpty || value!.isEmpty;

  Json toJson() => _$HeaderArgumentsToJson(this);
}
```

Header property widget:

```dart
import 'package:nanc_renderer/nanc_renderer.dart';

import 'header_property.dart';

class HeaderPropertyWidget extends PropertyWidget<Header> {
  const HeaderPropertyWidget({
    required super.name,
    required super.property,
    super.key,
  });
}
```

What do network headers typically represent? It is some kind of object (Map), with a key - the name of the header, and a value - the value of the header. So we can build the resulting object with all the headers from the constituent parts - `MapEntry`s. And the brick of this puzzle will be one parameter `header`.

Let's take a look at the resulting widget renderer we have at the moment:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:nanc_icons/nanc_icons.dart';
import 'package:nanc_renderer/nanc_renderer.dart';
import 'package:vector_graphics/vector_graphics.dart';

import 'properties/color_filter/color_filter_property.dart';
import 'properties/header/header_property.dart';
import 'svg_arguments.dart';

TagRenderer svgRenderer() {
  return TagRenderer(
    icon: IconPack.mdi_svg,
    tagType: TagType.widget,
    tag: 'svg',
    description: const TagDescription(
      description: '',
      arguments: [],
      properties: [],
    ),
    example: '',
    builder: (BuildContext context, WidgetTag element, RichRenderer richRenderer) {
      final SvgArguments arguments = SvgArguments.fromJson(element.attributes);
      
      /// Creating the extractor, to be able extract properties widgets and the UI widgets separately
      ///                       ⬇︎  ⬇︎  ⬇︎                                                     Rendering all the children of current tag
      ///                                                                                                   ⬇︎   ⬇︎   ⬇︎   ⬇︎
      final PropertiesExtractor extractor = PropertiesExtractor(context: context, rawChildren: richRenderer.renderChildren(context, element.children));

      if (arguments.ref == null || arguments.ref!.isEmpty) {
        return null;
      }

      final String ref = arguments.ref!;
      final bool isNetworkLink = ref.startsWith('http');

      return SvgPicture(
        isNetworkLink
            ? SvgNetworkLoader(
                ref,
                /// Here we are building our Map<String, String> from [header] properties
                ///      ⬇︎   ⬇︎   ⬇︎   ⬇︎   ⬇︎   ⬇︎   ⬇︎   ⬇︎   ⬇︎   ⬇︎   ⬇︎ 
                headers: Map.fromEntries(extractor.getProperties(header)),
              )
            : SvgAssetLoader(
                ref,
                packageName: arguments.package,
              ),
        height: arguments.size ?? arguments.height,
        width: arguments.size ?? arguments.width,
        alignment: arguments.alignment?.toAlignment() ?? Alignment.center,
        fit: arguments.fit ?? BoxFit.contain,
        allowDrawingOutsideViewBox: arguments.drawOutside ?? false,
        clipBehavior: arguments.clip ?? Clip.hardEdge,
        matchTextDirection: arguments.matchTextDirection ?? false,
      );
    },
  );
}
```

Let's speed things up a bit and implement the `ColorFilter` property:

Color filter property:

```dart
import 'package:flutter/material.dart';
import 'package:nanc_renderer/nanc_renderer.dart';

import 'color_filter_arguments.dart';
import 'color_filter_property_widget.dart';

const String colorFilter = 'colorFilter';

PropertyTagRenderer<ColorFilter> colorFilterProperty({String name = colorFilter}) {
  return PropertyTagRenderer(
    tag: name,
    builder: (BuildContext context, WidgetTag element, RichRenderer renderer) {
      final ColorFilterArguments arguments = ColorFilterArguments.fromJson(element.attributes);

      if (arguments.color == null || arguments.mode == null) {
        return null;
      }

      return ColorFilterPropertyWidget(
        name: name,
        property: ColorFilter.mode(arguments.color!, arguments.mode!),
      );
    },
  );
}
```

Color filter arguments:

```dart
import 'package:flutter/material.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:tools/tools.dart';

part 'color_filter_arguments.g.dart';

@JsonSerializable()
class ColorFilterArguments {
  const ColorFilterArguments({
    required this.color,
    required this.mode,
  });

  factory ColorFilterArguments.fromJson(dynamic json) => _$ColorFilterArgumentsFromJson(castToJson(json));

  @JsonKey(fromJson: nullableColorFromJson, toJson: colorToJson)
  final Color? color;

  @JsonKey(unknownEnumValue: JsonKey.nullForUndefinedEnumValue)
  final BlendMode? mode;

  Json toJson() => _$ColorFilterArgumentsToJson(this);
}
```

Color filter property widget:

```dart
import 'package:flutter/material.dart';
import 'package:nanc_renderer/nanc_renderer.dart';

class ColorFilterPropertyWidget extends PropertyWidget<ColorFilter> {
  const ColorFilterPropertyWidget({
    required super.name,
    required super.property,
    super.key,
  });
}
```

In general terms, there is no difference with headers. But there is in the application in the widget renderer.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:nanc_icons/nanc_icons.dart';
import 'package:nanc_renderer/nanc_renderer.dart';

import 'properties/color_filter/color_filter_property.dart';
import 'properties/header/header_property.dart';
import 'svg_arguments.dart';

TagRenderer svgRenderer() {
  return TagRenderer(
    icon: IconPack.mdi_svg,
    tagType: TagType.widget,
    tag: 'svg',
    description: const TagDescription(
      description: '',
      arguments: [],
      properties: [],
    ),
    example: '',
    builder: (BuildContext context, WidgetTag element, RichRenderer richRenderer) {
      final SvgArguments arguments = SvgArguments.fromJson(element.attributes);
      final PropertiesExtractor extractor = PropertiesExtractor(context: context, rawChildren: richRenderer.renderChildren(context, element.children));

      if (arguments.ref == null || arguments.ref!.isEmpty) {
        return null;
      }

      final String ref = arguments.ref!;
      final bool isNetworkLink = ref.startsWith('http');

      /// Extracting single property [ColorFilter] here ⬇︎
      ColorFilter? effectiveColorFilter = extractor.getProperty(colorFilter);

      if (effectiveColorFilter == null && arguments.color != null) {
        /// Using [color] argument, if we have no [ColorFilter] property with default blend mode
        effectiveColorFilter = ColorFilter.mode(arguments.color!, BlendMode.srcIn);
      }

      return SvgPicture(
        isNetworkLink
            ? SvgNetworkLoader(
                ref,
                headers: Map.fromEntries(extractor.getProperties(header)),
              )
            : SvgAssetLoader(
                ref,
                packageName: arguments.package,
              ),
        height: arguments.size ?? arguments.height,
        width: arguments.size ?? arguments.width,
        alignment: arguments.alignment?.toAlignment() ?? Alignment.center,
        fit: arguments.fit ?? BoxFit.contain,
        allowDrawingOutsideViewBox: arguments.drawOutside ?? false,
        clipBehavior: arguments.clip ?? Clip.hardEdge,
        matchTextDirection: arguments.matchTextDirection ?? false,
        /// Using final variant of parameter
        colorFilter: effectiveColorFilter,
      );
    },
  );
}
```

From this example, you could see that it is possible to use multiple parameters as well as one single parameter.

Well, it remains to go through the documentation...

Затем документация
И в конце пример с использованием детей-виджетов (можно вставить кусок кода из Column)

## Documentation

### Description

The documentation consists of two large sections - a description, and an example. The description, in turn, consists of, literally, a human description of the widget/tag you are creating. We advise you not to spare words and describe everything in such a way that you yourself could understand why this widget is needed a year later, and that a user who has no idea how to use Nanc or Flutter could still understand what we are talking about.

The `description` parameter of the `TagDescription` class, by the way, accepts not just text - it is a full-fledged Markdown, and you can use all its features there, the list of which can be found in [this package](https://pub.dev/packages/flutter_markdown).

### Arguments

The `arguments` parameter allows you to describe all the arguments (simple variables, scalar type or `enum`) that your tag will accept. Basically the rule of thumb for naming arguments is to name them the same way they are named in the Flutter API, or the libraries whose widgets you want to implement as tags. But sometimes the names can be made much simpler, and the arguments can be expanded to make using the tag easier and more enjoyable.

In our case, one such extended argument is `color` - an argument that is considered `deprecated` in the original `SvgPicture` widget, but it is much easier to specify just color instead of the more complex `colorFilter` parameter, which is what was implemented.

The `nanc_renderer` library contains an extensive list of implemented arguments, and you can use them to document your custom widgets. And if something is missing, you can always create your own description for any argument using the `TagArgument` class.

### Properties

Properties are a more complex variety of argument parameters - they can both contain their own arguments, as you may have seen above, and other properties. The `TagProperty` class allows you to document all aspects of using a property, its arguments, and child properties, if any.

### Example

In this field, you can create basic XML code that shows exactly how your freshly created widget / tag can be used. Try to show as many variations of tag usage as possible, so that it is clear which argument and parameter is responsible for what.

When the user turns to the interactive documentation of Nanc, he will be able both to read the whole description and to "feel" your tag and modify its code.

<video src="/videos/svg_documentation.mp4" controls width="100%"></video>

### Final renderer code

```dart
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:nanc_icons/nanc_icons.dart';
import 'package:nanc_renderer/nanc_renderer.dart';
import 'package:vector_graphics/vector_graphics.dart';

import 'properties/color_filter/color_filter_property.dart';
import 'properties/header/header_property.dart';
import 'svg_arguments.dart';

TagRenderer svgRenderer() {
  return TagRenderer(
    icon: IconPack.mdi_svg,
    tagType: TagType.widget,
    tag: 'svg',
    description: TagDescription(
      description: '''
# Svg

A custom widget that allows you to use SVG images in your application.
Both located somewhere and located in the assets of your application.
You can also further optimize SVG images with a compiler.
And use optimized versions. Details can be found at the following [link](https://pub.dev/packages/flutter_svg#precompiling-and-optimizing-svgs).
      ''',
      arguments: [
        const TagArgument(
          name: 'ref',
          values: {'String', 'assets/svg_icons/star.svg', 'https://cdn.ourhost.com/svg_icons/star.svg'},
          description: 'The path to the SVG file, or the network path, URL, to the SVG file.',
        ),
        const TagArgument(
          name: 'vec',
          values: {'String', 'assets/svg_icons/star.svg.vec', 'https://cdn.ourhost.com/svg_icons/star.svg.vec'},
          description: '''
Path to a file pre-compiled into a special vector format. Details are available at this [link](https://pub.dev/packages/flutter_svg#precompiling-and-optimizing-svgs).
''',
        ),
        heightArgument(),
        widthArgument(),
        sizeArgument(),
        alignmentArgument(name: 'alignment'),
        packageArgument(),
        boxFitArgument(name: 'fit'),
        boolArgument(name: 'drawOutside'),
        clipArgument(name: 'clip'),
        boolArgument(name: 'matchTextDirection'),
        colorArgument(name: 'color'),
      ],
      properties: [
        const TagProperty(
          name: header,
          arguments: [
            TagArgument(
              name: 'name',
              values: {'String', 'Cache-Control', 'Authorization'},
            ),
            TagArgument(
              name: 'value',
              values: {'String', 'no-cache', 'eyJhbGciOiJIUzI1NiIsInR'},
            ),
          ],
          properties: [],
        ),
        TagProperty(
          name: colorFilter,
          arguments: [
            colorArgument(name: 'color'),
            blendModeArgument(name: 'mode'),
          ],
          properties: [],
        ),
      ],
    ),
    example: '''
<safeArea>
  <column>
    <svg ref="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/0.svg" color="green" height="50" width="50"/>
    <svg ref="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/1.svg" size="50">
      <prop:header name="Cache-Control" value="public"/>
      <prop:header name="ETag" value="737060cd8c284d8af7ad3082f209582d"/>
      <prop:colorFilter color="yellow" mode="color"/>
    </svg>
    <for in="{{ 2...10 }}">
      <svg ref="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/{{ cycle.value }}.svg" size="50"/>
    </for>
  </column>
</safeArea>
''',
    builder: (BuildContext context, WidgetTag element, RichRenderer richRenderer) {
      final SvgArguments arguments = SvgArguments.fromJson(element.attributes);
      final PropertiesExtractor extractor = PropertiesExtractor(context: context, rawChildren: richRenderer.renderChildren(context, element.children));

      if ((arguments.ref == null || arguments.ref!.isEmpty) && (arguments.vec == null || arguments.vec!.isEmpty)) {
        return null;
      }

      final bool isVector = arguments.vec != null && arguments.vec!.isNotEmpty;
      final String ref = isVector ? arguments.vec! : arguments.ref!;
      final bool isNetworkLink = ref.startsWith('http');

      ColorFilter? effectiveColorFilter = extractor.getProperty(colorFilter);

      if (effectiveColorFilter == null && arguments.color != null) {
        effectiveColorFilter = ColorFilter.mode(arguments.color!, BlendMode.srcIn);
      }

      if (isVector) {
        return SvgPicture(
          isNetworkLink
              ? NetworkBytesLoader(
                  Uri.parse(ref),
                  headers: Map.fromEntries(extractor.getProperties(header)),
                )
              : AssetBytesLoader(
                  ref,
                  packageName: arguments.package,
                ),
          height: arguments.size ?? arguments.height,
          width: arguments.size ?? arguments.width,
          alignment: arguments.alignment?.toAlignment() ?? Alignment.center,
          fit: arguments.fit ?? BoxFit.contain,
          allowDrawingOutsideViewBox: arguments.drawOutside ?? false,
          clipBehavior: arguments.clip ?? Clip.hardEdge,
          matchTextDirection: arguments.matchTextDirection ?? false,
          colorFilter: effectiveColorFilter,
        );
      }

      return SvgPicture(
        isNetworkLink
            ? SvgNetworkLoader(
                ref,
                headers: Map.fromEntries(extractor.getProperties(header)),
              )
            : SvgAssetLoader(
                ref,
                packageName: arguments.package,
              ),
        height: arguments.size ?? arguments.height,
        width: arguments.size ?? arguments.width,
        alignment: arguments.alignment?.toAlignment() ?? Alignment.center,
        fit: arguments.fit ?? BoxFit.contain,
        allowDrawingOutsideViewBox: arguments.drawOutside ?? false,
        clipBehavior: arguments.clip ?? Clip.hardEdge,
        matchTextDirection: arguments.matchTextDirection ?? false,
        colorFilter: effectiveColorFilter,
      );
    },
  );
}
```