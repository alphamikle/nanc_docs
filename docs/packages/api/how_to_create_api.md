---
sidebar_position: 1
---

# How to create api

## Config package

The first thing is that you need to install the config package. You can use the instructions in its [description](../../packages/config) and then come back here.

## Collection api

Now, you need to implement the `ICollectionApi` interface, which you can import from the `config` package.

## Document api

Then - you need to implement the `IDocumentApi` interface.

## Model api

Last is the implementation of the `IModelApi` interface. Pay special attention to this API: if you want, for example, to automatically create tables, following the creation of Nanc models, or delete something, following the deletion of models - you will need to do it in the implementation of this interface.

## Using

```dart
import 'dart:async';

import 'package:nanc/nanc.dart';
import 'package:config/config.dart';
import 'package:flutter/material.dart';
import 'package:your_own_api/your_own_api.dart';

Future<void> main() async {
  await runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    await adminRunner(
      CmsConfig(
        collectionApi: YourOwnCollectionApi(),
        documentApi: YourOwnDocumentApi(),
        modelApi: YourOwnModelApi(),
        networkConfig: NetworkConfig.simple(paginationLimitParameterDefaultValue: 50),
        imageBuilderDelegate: null,
        adminWrapperBuilder: null,
        predefinedModels: [],
        customRenderers: [],
        eventsHandlers: [],
        customFonts: [],
      ),
    );
  }, ErrorsCatcher.catchZoneErrors);
}
```