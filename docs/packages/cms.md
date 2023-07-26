---
sidebar_position: 1
---

# CMS

The Nanc kernel, which gives you a method to run the CMS, as well as a service to catch errors.

## Import

```yaml
dependencies:
  cms:
    path: ../nanc/cms
```

## Using

```dart
/// main.dart

import 'dart:async';

import 'package:cms/cms.dart';
import 'package:config/config.dart';
import 'package:flutter/material.dart';
import 'package:nanc_api_local/nanc_api_local.dart';

Future<void> main() async {
  await runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();
    await adminRunner(
      CmsConfig(
        /// ? Your should implement these APIs or use already implemented instead
        collectionApi: LocalCollectionApi(),
        documentApi: LocalDocumentApi(),
        modelApi: LocalModelApi(),
        networkConfig: NetworkConfig(
          paginationPageNumberParameterName: 'page',
          paginationLimitParameterName: 'limit',
          paginationDataContainerParameterName: 'data',
          paginationTotalPagesParameterName: 'total_pages',
          paginationLimitParameterDefaultValue: 100,
        ),
        imageBuilderDelegate: null,
        adminWrapperBuilder: null,
        predefinedModels: [
          /// ? Here will be a list of your predefined code-first models
        ],
        customRenderers: [],
        eventsHandlers: [],
        customFonts: [],
      ),
    );
  }, ErrorsCatcher.catchZoneErrors);
}
```