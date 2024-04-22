---
sidebar_position: 1
---

# Introduction

Nanc - CMS of new generation. Extensible, adaptable and powerful. You can use it with **your existing backend** (wrote by your hands) or with existed Firebase / Supabase / **any other kind project**, managing your content / data / applications from one place or you can start your new creation using Nanc as a management tool in combination with **any kind of data source** - any cloud or custom backend in the ordinary sense of the word.

Nanc allows you to manage data and content of any complexity, and provides an incredibly powerful mechanism for updating the interface and logic of your Flutter applications in real time, based on a Server driven UI approach pumped up to 999lvl and called Nui. Have you wanted to be able to update your application as if it were a web service? You've got it.

## For which purposes Nanc is better suited

- You want a data and content management system in your existing project
- You are creating a new project based on Firebase, Supabase or other cloud data and logic storage, and you want to manage content and data in them more flexibly and easily than using their own UIs
- You want a content management system, but don't want to use cumbersome Open Source "admin panels" or write everything from scratch for "a lot of money"
- You use Firebase as a backend, and you don't have enough functionality in its UI to make sense of your data
- You are building or have an existing Flutter application, and you want to accelerate the speed of delivery of features to production
- You create or have a Flutter application and want to update it without long and, sometimes, unpredictable reviews by stores
- You create or have a Flutter application and want to be able to change any aspect of its look and feel in an instant, spending a few minutes of development time instead of hours, days or weeks
- You want to have the easiest and the fastest way to do A/B tests
- You want to check your new hypothesis as fast as it possible on the web
- You want to create rich and beautiful Terms & Conditions, Readme, FAQ, intros, in-app notifications, etc. in your app

## Fast start

### Create your own app

First - you need to create an application oriented towards both Desktop and Web. Desktop will be very useful for development, testing improvements, and just in a dev environment. Web - is the target production platform. However, nothing prevents you from creating a full-fledged CMS application oriented towards Desktop; this is more than a viable scenario.

### Install Nanc as a dependency

To start, you will need at least two packages:
- [nanc](https://pub.dev/packages/nanc)
- [nanc_configuration](https://pub.dev/packages/nanc_configuration)

In such a scenario, the implementation of the API – layer, responsible for working with your specific data source, falls on your shoulders.

But Nanc includes several ready-to-use implementations:

- [nanc_api_local](https://pub.dev/packages/nanc_api_local)
- [nanc_api_firebase](https://pub.dev/packages/nanc_api_firebase)
- [nanc_api_supabase](https://pub.dev/packages/nanc_api_supabase)

A little bit more about APIs will be below.

```yaml
# pubspec.yaml
dependencies:
  # ... other dependencies
  nanc: any # you can use a specific version or just latest
  nanc_api_local: any
  nanc_configuration: any
```

### Replace main.dart file source code

Since Nanc is not just a package but a full-fledged application that you can expand. It means that this application has its own starting point, as well as its own initialization process.

Below is an example that you can use as a template, replacing all your source code in the `main.dart` file (or any other that serves as the starting point of your application) with the one presented below:

```dart
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:nanc/nanc.dart';
import 'package:nanc/services.dart';
import 'package:nanc_api_local/nanc_api_local.dart';
import 'package:nanc_configuration/nanc_configuration.dart';

Future<void> main() async {
  await runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    await adminRunner(
      CmsConfig(
        // Simplest API implementation
        collectionApi: LocalCollectionApi(),
        documentApi: LocalDocumentApi(),
        modelApi: LocalModelApi(),
        
        networkConfig: NetworkConfig.simple(),
        imageBuilderDelegate: null,
        adminWrapperBuilder: null,
        predefinedModels: [],
        customRenderers: [],
        eventsHandlers: [],
        customFonts: [],
        sliverChecker: null,
        customIcons: null,
        themeBuilder: null,
      ),
    );
  }, ErrorsCatcher.catchZoneErrors);
}
```

### Select API

On that stage, you should decide - which APIs you will use to connect to your data. For now already implemented several APIs:

#### [Local API](modules/api/nanc_api_local)

Which work with local JSON-file as a backend. On the web it will use LocalStorage.

> Local API is zero-config API, very simple to use and to get know Nanc.

#### [Supabase API](modules/api/nanc_api_supabase)

Completely ready solution for working with Supabase. It supports all features for managing your data directly from Nanc - powerful filtering, creating new tables, managing relationships, etc.

#### [Firebase API](modules/api/nanc_api_firebase)

Completely ready solution for working with Firebase. Makes it easy to get started with Nanc, using Firebase as a data source!

### Run and fun

If the API choice has been made, then all that remains is to launch the resulting application and try playing with it. Afterward, we will talk in more detail about the configuration of Nanc.