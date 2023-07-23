---
sidebar_position: 3
---

# Mobile App Configuring

All you need to start using the Nanc Backend Driven UI in your application is to import the `nanc_renderer` package from the Nanc mono repository, and use one of the two widgets it exports:
- `XmlWidgetStack`
- `XmlWidgetSliverList`

Let's assume that your application is in the same directory as the Nanc mono repository (as your CMS build from the CMS configuration section was):

```
/some_directory
├── /nanc
├── /<your_nanc_cms_app_dir>
└── /<your_mobile_app> <-
```

## Installation

In that case, to use `nanc_renderer` package, you should add next string to your `pubspec.yaml` file:

```yaml
dependencies:
  nanc_renderer:
    path: ../nanc/nanc_renderer
```

## Using

Now, you can use one of two built-in widgets, which supports rendering of Nanc XML. Let's assume, that we want to create a default Flutter Counter App. There are how it would will be:

```dart
import 'package:flutter/material.dart';
import 'package:nanc_renderer/nanc_renderer.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
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
        child: NUIWidget(
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

### Renderers

You can add your own custom `renderers`, the same extra-modules, which you can use in the Nanc configuration to extend support of new widgets, which will be rendered from your own new tags.

### Images

You can use `imageErrorBuilder`, `imageFrameBuilder` and `imageLoadingBuilder` for customizing logic of rendering images. It's the same thing as `imageBuilderDelegate` from the Nanc config, but not wrapped into the class - only functions.