---
sidebar_position: 1
---

# Introduction

Nanc - CMS of new generation. Extensible, adaptable and powerful. You can use it with **your existing backend** (wrote by your hands) or with existed Firebase / Supabase / **any other kind project**, managing your content / data / applications from one place or you can start your new creation using Nanc as a management tool in combination with **any kind of data provider** - any cloud or custom backend in the ordinary sense of the word.

Nanc allows you to manage data and content of any complexity, and provides an incredibly powerful mechanism for updating the interface and logic of your Flutter applications in real time, based on a Server driven UI approach pumped up to 999lvl and called NUI. Have you wanted to be able to update your application as if it were a web service? You've got it.

## For which purposes Nanc is better suited

- You want a data and content management system in your existing project
- You are creating a new project based on Firebase, Supabase or other cloud data and logic storage, and you want to manage content and data in them more flexibly and easily than using native UIs
- You want a content management system, but don't want to use cumbersome Open Source "admin panels" or write everything from scratch for "a lot of money"
- You use Firebase as a backend, and you don't have enough functionality in its UI to make sense of your data
- You are building or have an existing Flutter application, and you want to accelerate the speed of delivery of features to production
- You are building or have a Flutter application and want to be able to test different hypotheses in it **very quickly**
- You create or have a Flutter application and want to update it without long and unpredictable reviews by stores
- You create or have a Flutter application and want to be able to change any aspect of its look and feel in an instant, spending a few minutes of development time instead of hours, days or weeks

## Fast start

### Clone Nanc repo

To start using Nanc you should clone project:

```bash
git clone git@github.com:alphamikle/nanc.git
```

### Create your own app

Then - create a new Flutter-app project with targeting on web and any desktop platform (last is by your wish) on the same level as created previous folder `nanc`:

```
/some_directory
├── /nanc
└── /<your_nanc_cms_app_dir> <- Create a new directory on that level
```

### Install dependencies

Third step - install two critical dependencies into your created app:

```yaml
dependencies:
  nanc:
    path: ../nanc/nanc
  config:
    path: ../nanc/config
```

### Copy-paste app template

And fourth - add a base template for your application's core instead of the content in the `main.dart` file:

```dart
import 'dart:async';

import 'package:nanc/nanc.dart';
import 'package:config/config.dart';
import 'package:flutter/material.dart';

Future<void> main() async {
  await runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();
    await adminRunner(
      CmsConfig(
        /// ? Your should implement these APIs or use already implemented instead
        collectionApi: ICollectionApi(),
        documentApi: IDocumentApi(),
        modelApi: IModelApi(),
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
### Select api

On that stage, you should decide - which APIs you will use to connect to your data. For now already implemented several APIs:

#### [Local API](./packages/api/nanc_api_local)
Which work with local JSON-file as a backend. On the web it will use LocalStorage.

> Local API is zero-config API, very simple to use and to get know Nanc.

#### [Supabase API](./packages/api/nanc_api_supabase)
Completely ready solution for working with Supabase. It supports all features for managing your data directly from Nanc - powerful filtering, creating new tables, managing relationships, etc.

#### [Firebase API](./packages/api/nanc_api_firebase)
Completely ready solution for working with Firebase. Makes it easy to get started with Nanc, using as a data provider...Firebase!

### Add chosen api

```yaml
dependencies:
  nanc_api_local:
    path: ../nanc/nanc_api_local
```

### Use api

After you installed some API (like `nanc_local_api`) you should add it to the `CmsConfig` at the `main.dart` file:

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