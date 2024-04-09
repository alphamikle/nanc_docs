---
sidebar_position: 3
---

# App Configuration

All you need to start using the Nanc Server driven UI in your application is to install the **[`nui`](https://pub.dev/packages/nui)** package, and use one of the two widgets it exports:
- `NuiStackWidget`
- `NuiListWidget`

## Installation

To use `nui` package, you should add next string to your `pubspec.yaml` file:

```yaml
dependencies:
  nui: any # or specific version
```

Keep in mind that the major version of `nui` should always match the major version of `nanc`, which you want to support.

That is, all packages of version `1.x.x` will always be compatible with each other, just as packages of version `2.x.x`, and so on.

## Using

Now, you can use one of two built-in widgets, which supports rendering of Nanc XML. Let's assume, that we want to create a default Flutter Counter App. There are how it would will be:

```dart
import 'package:flutter/material.dart';
import 'package:nui/nui.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nui App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const MyHomePage(title: 'Nui Demo App'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({
    required this.title,
    super.key,
  });

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: NuiStackWidget(
          renderers: const [],
          imageErrorBuilder: null,
          imageFrameBuilder: null,
          imageLoadingBuilder: null,
          binary: null,
          nodes: null,
          xmlContent: '''
<center>
  <column mainAxisSize="min">
    <text size="18" align="center">
      You have pushed the button\nthis many times:
    </text>
    <text size="32">
      {{ page.counter }}
    </text>
  </column>
</center>
''',
          pageData: {
            'counter': _counter,
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

## Configuring

### Custom fonts

If you already use custom fonts in Nanc, you need to register them in the mobile app as well.

This procedure is quite simple:

- You need to declare fonts in pubspec, according to the standard registration flow, which you can find, for example, in the [official documentation](https://docs.flutter.dev/cookbook/design/fonts)

```yaml
flutter:
  uses-material-design: true
  fonts:
    - family: Blazeface
      fonts:
        - asset: assets/fonts/blazeface.ttf
    - family: Helvetica
      fonts:
        - asset: assets/fonts/helvetica.ttf
          weight: 400
        - asset: assets/fonts/helvetica_light.ttf
          weight: 300
        - asset: assets/fonts/helvetica_bold.ttf
          weight: 500
    - family: Helvetica Neue
      fonts:
        - asset: assets/fonts/helvetica_neue_wide.ttf
          weight: 400
        - asset: assets/fonts/helvetica_neue_light.ttf
          weight: 300
```

- You need to register the used fonts with the `FontsStorage` class from the [`nanc_fonts`](https://pub.dev/packages/nanc_fonts) **[package](./packages/nanc_fonts)**:

```dart
import 'package:nanc_fonts/nanc_fonts.dart';

void main() {
  FontsStorage.registerCustomFonts(
    [
      const CustomFont(font: 'Blazeface'),
      const CustomFont(font: 'Helvetica'),
      const CustomFont(font: 'Helvetica Neue'),
      const CustomFont(font: 'SomeAnotherFont', package: 'another_package'),
    ],
  );
}
```

You can do this, for example, when initializing an application. If you want to use fonts from another package, use the `package` property of the `CustomFont` class to specify the name of this third-party package.

### Custom icons

If you want to use custom icons, you will also need to register them. Registration of icons in Nanc is described in **[CMS configuration](./cms_configuration)** section. To do the same in the application, you should use `IconsStorage` class from [`nanc_icons`](./packages/nanc_icons) **[package](https://pub.dev/packages/nanc_icons)**:

```dart
import 'package:ionicons/ionicons.dart';
import 'package:nanc_icons/nanc_icons.dart';


void main() {
  /*
  Originally, there are a map of strings, but String-value is an encoded character number from the icon font

  const ioniconsMapping = {
    "accessibility-outline": "0xea01",
    "accessibility-sharp": "0xea02",
    "accessibility": "0xea03",
    ...
  };
   */
  final Map<String, IconData> customIcons = ioniconsMapping.map(
    (String key, String value) => MapEntry(
      'ionic_${key.replaceAll('-', '_')}',
      IoniconsData(
        int.parse(value),
      ),
    ),
  );

  IconsStorage.registerCustomIcons({
    'cup_collections': CupertinoIcons.collections,
    ...customIcons,
  });
}
```

Most off-the-shelf icon packages have some way to get an object of type `Map<String, IconData>`, such as the `ionicons` package offers - giving us access to the `ioniconsMapping` variable, which, however, still needs to be refined to be usable for our purposes.

Also, it is highly recommended that you add some kind of global prefix to your icons packages. First of all, it will be easier to find only those icons that are included in a certain package, and secondly, it will reduce the risk of collision of names of icons from different packages, which can happen, considering that even in the standard Nanc package there are many thousands of icons.

### Renderers

You can add your own custom `renderers`, the same extra-modules, which you can use in the Nanc configuration to extend support of new widgets, which will be rendered from your own new tags.

### Images

You can use `imageErrorBuilder`, `imageFrameBuilder` and `imageLoadingBuilder` for customizing logic of rendering images. It's the same thing as `imageBuilderDelegate` from the Nanc config, but not wrapped into the class - only functions.

### Slivers

If you want to implement your own tags for sliver widgets, and then use them in `NuiListWidget` - you need to pass in this widget and a checker function that will check if a certain widget is a sliver. And your slivers, of course, should be such according to the result of this function.

```dart
// ...
Widget build() {
  return NuiListWidget(
    // ...
    sliverChecker: yourSliverCheckerHere,
  );
}
```