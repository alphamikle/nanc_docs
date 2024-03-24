---
sidebar_position: 4
---

# Local storage api

## Installing

```yaml
dependencies:
  nanc_api_local:
    path: ../nanc/nanc_api_local
```

## Using

This is the simplest implementation of the API for Nanc. Local API allows you to test the CMS as a whole and get an idea of how it works.

In the future this API will be supplemented - Sqlite will be used as a means of data storage, instead of the current implementation in the form of JSON-storage. This will allow to use Local API also as a mock / light version of your own SQL-backend or Supabase, as well as to transfer data between these databases.

```dart
import 'dart:async';

import 'package:nanc/nanc.dart';
import 'package:config/config.dart';
import 'package:flutter/material.dart';
import 'package:nanc_api_local/nanc_api_local.dart';

Future<void> main() async {
  await runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    await adminRunner(
      CmsConfig(
        /// ? Use them here
        collectionApi: LocalCollectionApi(),
        documentApi: LocalDocumentApi(),
        modelApi: LocalModelApi(),
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