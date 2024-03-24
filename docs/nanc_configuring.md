---
sidebar_position: 2
---

# Nanc configuring

Nanc has powerful in-depth customization capabilities for many aspects of the view and behavior. The current version of the available settings for customization is shown below:

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
        sliverChecker: null,
        customIcons: null,
        themeBuilder: null,
      ),
    );
  }, ErrorsCatcher.catchZoneErrors);
}
```

Let's go through them one by one.

## Collection api

This option is responsible for setting up an API service that will perform all network activities related to your document collections. Be it filtering, pagination, search, and more.

## Document api

The `documentApi` is responsible for installing an API service that will perform network requests related to individual documents - opening a detailed document page, creating, deleting, modifying, etc.

## Model api

The `modelApi` allows you to set up an API service that will be responsible for network requests related to the [model](./packages/model). If you decide to change the very data structure of your documents - you will be changing the model. And all changes made to the model structure can be mirrored in your infrastructure. For example - when creating a new model, you may want to automatically create a corresponding table in your database. This service will be responsible for this logic.

However, some data providers do not require the explicit creation of tables or their counterparts, such as - Firebase. In this case, the implementation of this service can be empty, because you do not need additional actions to get a new data structure (a new document, in this case).

## Network config

This option allows you to set basic network settings:

### Page number name

`paginationPageNumberParameterName` may be useful when you are implementing your own `ICollectionApi` service. Like all network parameters, to be honest. Going back to this particular parameter - you can use it to set the name of the expected key of the response returned by the server with the collection of documents, which will contain information about the current page of the received data.

### Pagination limits name

`paginationLimitParameterName` - this option, in turn, will be sent as one of the parameters to your backend, to get a portion of the documents (part of the collection) with a certain amount (limit) in it.

### Pagination data name

`paginationDataContainerParameterName` the expected name of the field containing the document array in the response from your server when trying to retrieve a collection of documents.

### Total pages name

`paginationTotalPagesParameterName` expected name of the field containing the total number of pages with documents in the requested collection.

### Default pagination limits

`paginationLimitParameterDefaultValue` the default value that determines how many documents will be requested per collection page.

### Example of collection response with the default fields names

```json5
{
  "page": 1,
  "total_pages": 23,
  "data": [
    // ...
    {
      "id": "f2fe31b0-f473-4108-b7b6-935545a34fad",
      "some_field": 123,
      "some_another_field": "abc"
    },
    // ...
  ]
}
```

## Image builder delegate

The `imageBuilderDelegate` gives you the ability to customize the rendering behavior of the images you can display with the Nanc Server driven UI. You can implement your own preloader, show BlurHash or do whatever you see fit.

## Admin wrapper builder

The `adminWrapperBuilder` is a special builder-method that allows you to wrap the CMS into your own widget or even an entire application. For example, you can use this functionality to implement additional authorization by showing the user of your Nanc build a modal window asking for credentials to access the CMS. Or you can extend Nanc's functionality as much as you want.

## Predefined models

`predefinedModels` is a set of code-first models that will be available in your Nanc build immediately. You can also add here descriptions of those models that are created in Nanc through the interface. In this case, this model will become a hybrid model. What this is is described in detail in the section on [Models](./packages/model).

## Custom renderers

`customRenderers` - a setting responsible for extending the Nanc functionality related to rendering widgets in the Server driven UI. By implementing and adding a new renderer you will be able to use it at any time in your application using Nanc Server driven UI. You can learn more about this in this section: [Server driven UI](nui/backend_driven_ui.md).

## Events handlers

`eventsHandlers` - parameter responsible for extending the logic that you will be able to control through the Nanc Server driven UI. The current model is event-based. An event is a string that can contain anything. From a simple name, to a JSON structure, a link, or anything. The `EventHandler` is responsible for handling a certain class of events, for example - all events starting with the keyword `deeplink`. Or all events that contain a value corresponding to some `RegExp` pattern. How exactly the event handling will be implemented is entirely your responsibility, and your opportunity. By intelligently separating the possible events in your application into classes, you can reach a state where you can modify and create very complex user scenarios, and all this will be available to your users in real time. Read more about this in [Server driven UI](nui/backend_driven_ui.md) section.

:::tip
Also, you may want to consider just specifying an identifier as the event, the corresponding handler will take that identifier, go to the backend, and get all the necessary arguments from that identifier that you would otherwise have to specify in the event itself.
:::


## Custom fonts

`customFonts` - an option to expand the available fonts in the Nanc Server driven UI. You can add any custom font to your Nanc application (official instructions), then, specify the parameters of the added font in this parameter, which accepts a list of font extensions, and voila - in your Nanc build, your newly added font will appear in the `FontField` field, which you will be able to use in the app as well, relying on the [Nanc Server driven UI](nui/backend_driven_ui).

## Sliver checker

If you are going to add custom widget slivers implemented by you. You also need to add a function that will check if the widget is a sliver. And for your custom sliver - it should return `true`. In general - for all your custom widgets. See more [here](./nui/slivers).

## Custom icons

You can easily add your own custom icons to Nanc. For this purpose it is enough to pass `Map<String, IconData>` as an argument to `customIcons`. Configuring a mobile application using NUI is described in detail [here](./mobile_app_configuring).

## Preview theming

In order to be able to recreate your mobile app design in Nanc using [NUI](./nui/backend_driven_ui), you can use the theme from your mobile app. This way you will see in NUI pixel-perfect preview a result similar to what you will see in your mobile application when developing components / screens using [NUI](./nui/backend_driven_ui).

## Web app configuration

For the Nanc-IDE synchronization functionality to work correctly in a web environment, you need to add the following line to the `path_to_your_nanc_project/web/index.html` file:

```html
   <!-- This script adds the flutter initialization JS code -->
   <script src="flutter.js" defer></script>

    <!-- ⬇︎⬇︎ ADD THIS LINE HERE ⬇︎⬇︎ -->
   <script src="file_system_library.js" defer></script>
</head>
```

And copy the corresponding file `nanc/file_syncer/file_system_library.js` to the same path: `path_to_your_nanc_project/web/file_system_library.js`

> You can learn more about synchronization with the IDE in the Server driven UI section.

## Mobile app configuration

To configure the package used in the mobile app, see the [Mobile App Configuration section](./mobile_app_configuring).