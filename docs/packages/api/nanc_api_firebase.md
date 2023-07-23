# Firebase API

:::danger
Working with Firestore Database implies the use of a service account. This account will have full access to read and modify data in your database. Be very careful where you deploy your Nanc build - if third-party users can get into it - they will be able to find out and change your data. **Your security is on your shoulders.**
:::

:::note
In the future, instructions on how to customize Nanc's built-in functionality will appear here, allowing potentially dangerous Nanc builds to be published to the public.
:::

## Installing

```yaml
dependencies:
  nanc_api_firebase:
    path: ../nanc/nanc_api_firebase
```

## Configuring

### Creating Firebase Project

First, you need to create a Firebase project. If you want to use Nanc with an existing project, you can skip this section and [go to the key generation one](#get-firebase-service-key). Also, the official [documentation](https://pub.dev/packages/cloud_firestore) from Google will be the best instruction for actions. However, here we will show you the way to create a new Firebase project too.

#### Create new project

Go to [Firebase Console](https://console.firebase.google.com/) and click on **Add project** button

![](../../../static/screenshots/firebase_api/create_new_firebase_project.png)

Type your project name

![](../../../static/screenshots/firebase_api/type_firebase_project_name.png)

Enable or disable Google Analytics

![](../../../static/screenshots/firebase_api/enable_or_disable_firebase_analytics.png)

Wait while project will be created

![](../../../static/screenshots/firebase_api/wait_until_firebase_project_will_be_created.png)

#### Create Firestore Database

Build Firestore Database

![](../../../static/screenshots/firebase_api/build_firestore_database.png)
![](../../../static/screenshots/firebase_api/create_database.png)
![](../../../static/screenshots/firebase_api/start_in_production_mode.png)
![](../../../static/screenshots/firebase_api/select_location.png)
![](../../../static/screenshots/firebase_api/database_created.png)

## Get Firebase Service Key

Go to the project settings

![](../../../static/screenshots/firebase_api/project_settings.png)

Then you need to go to the service accounts settings, to create service account and generate its access key

![](../../../static/screenshots/firebase_api/go_to_service_accounts_permissions.png)

And generate the key

![](../../../static/screenshots/firebase_api/generate_key.png)

Then save it somewhere at your computer, for example - at the root, of your Nanc-CMS build project.

## Using

So you have a database and a JSON key to access it. Now you can create the required API instances to start using Firestore as a backend. The following code will shed some light on how you can implement this:

```dart
import 'dart:async';

import 'package:cms/cms.dart';
import 'package:config/config.dart';
import 'package:flutter/material.dart';
import 'package:nanc_api_firebase/nanc_api_firebase.dart';

import 'firebase_key.dart';

Future<void> main() async {
  await runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    /// ? Creating instances of needed APIs
    final FirebaseApi firebaseApi = await FirebaseApi.create(firebaseBase64EncodedKey);

    /// ? Backend-first ICollectionApi implementation
    final FirebaseCollectionApi firebaseCollectionApi = FirebaseCollectionApi(api: firebaseApi);

    /// ? Partially-local ICollectionApi implementation
    final FirebaseLocalCollectionApi firebaseLocalCollectionApi = FirebaseLocalCollectionApi(api: firebaseApi);

    final FirebaseDocumentApi firebasePageApi = FirebaseDocumentApi(api: firebaseApi, firebaseCollectionApi: firebaseCollectionApi);
    final FirebaseModelApi firebaseModelApi = FirebaseModelApi();

    await adminRunner(
      CmsConfig(
        /// ? Use them here
        collectionApi: firebaseCollectionApi,
        documentApi: firebasePageApi,
        modelApi: firebaseModelApi,
        networkConfig: NetworkConfig.simple(paginationLimitParameterDefaultValue: 50),
        imageBuilderDelegate: null,
        adminWrapperBuilder: null,
        predefinedModels: [],
        customRenderers: [],
        clickHandlers: [],
        customFonts: [],
      ),
    );
  }, ErrorsCatcher.catchZoneErrors);
}
```

The `firebaseBase64EncodedKey` variable holds the Base64-encoded contents of the JSON key downloaded in the previous step. This is the format in which the `FirebaseApi.create` constructor accepts the key from the Firestore service account.

Also, you might have noticed that there are two `ICollectionApi` implementations declared in the code - `FirebaseCollectionApi` and `FirebaseLocalCollectionApi`. Let's dwell on their differences a bit more.

## Backend-first Collection Api

`FirebaseCollectionApi` - is an implementation of working with collections through Firestore, which implies constant use of Firestore Database - any filtering, searching, pagination operations will be performed through a new call to the server. Also, the logic of data filtering and searching is implemented in full compliance with the capabilities of Firestore itself. And these capabilities are very limited. For example - you will not be able to find any document by partial coincidence of one of the fields of the document with the value you entered. Say - "find all movies whose title begins with the substring `Appo`". Also, filtering by multiple fields is very limited due to the architecture of Firestore itself, so with this API implementation you are limited in the complexity of filter combinations, and in addition, some filter variations will require you to create special Firestore indexes.

However, the latter is not a big deal - just pay attention to the error notifications that may appear in the lower left corner. If you see such a message when trying to find something - from the detailed information in this message you will be able to follow the link straight to the Firestore index creation window, where you will have to click just one button. Let's take a look at what this might look like in real life - **we will try to find movies, which release was from 1990 to 2000, or from 2010 to 2020, and box office is null (no data about box office)**:

<video src="/videos/missing_firebase_index_error.mp4" controls width="100%"></video>

### Reduced number of documents per page

To reduce read quota usage, you can reduce the number of documents output per page by using the following network configuration:

```dart
NetworkConfig.simple(paginationLimitParameterDefaultValue: 50),
```

## Partially-local Collection Api

:::caution
The first time any collection is queried, this API implementation will load the entire collection in its entirety. If you have large collections with more than 2-3 thousand documents, be very careful when using this API, as you may very quickly spend the free reading limits of Firestore, and if you use the paid version - it may lead to additional expenses.
:::

`FirebaseLocalCollectionApi` is an implementation that supports short-term caching of loaded collections, as well as search and filtering of any level of complexity, which will be performed locally. Also, when loading data of any collection, absolutely all documents included in this collection will be loaded. This implementation will be useful if you need a very powerful search mechanism in your document collections, otherwise you should use Backend-First implementation, which will use Firebase read limit much more carefully.

## Setting the cache lifetime

You can set the response caching time for both API implementations. But the purposes of these parameters are slightly different.

In `FirebaseCollectionApi` the default cache lifetime is zero - this means that caching is disabled. If you change the cache lifetime to something other than zero - then each unique collection request will be cached for the time you specify. For example - if you load the first page of a collection, it will be in the cache and if you flip through the pages and then back to the first page - it will be retrieved from the cache and you will save one request to Firestore that could have returned you N documents and you would have wasted N reads from the quota. If you apply filters - the current filtering configuration will also be saved in the cache, and if you use it again - the data will be retrieved from the cache.

In turn, `FirebaseLocalCollectionApi` caches all collection documents at once (as it loads them all at once). The lifetime of the cache is equal to how soon you will basically make the next request to Firestore to retrieve the data of a particular collection. If your data doesn't change too often, it makes sense to set the cache lifetime as long as possible.

However, keep in mind that caching is done in RAM (at least for now), which means that if you close your Nanc application - the next time you open it, there will be no cache and you will start wasting Firestore quota again.

```dart
FirebaseCollectionApi(api: firebaseApi, cacheTTL: const Duration(minutes: 5));
FirebaseLocalCollectionApi(api: firebaseApi, cacheTTL: const Duration(minutes: 10));
```