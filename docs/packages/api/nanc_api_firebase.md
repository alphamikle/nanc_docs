# Firebase API

## Installing

```yaml
dependencies:
  nanc_api_firebase:
    path: ../nanc/nanc_api_firebase
```

## Configuring

### Creating Firebase Project

First, you need to create a Firebase project. If you want to use Nanc with an existing project, you can skip this section. Also, the official [documentation](https://pub.dev/packages/cloud_firestore) from Google will be the best instruction for actions. However, here we will show you the way to create a new Firebase project too.

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
![](../../../static/screenshots/firebase_api/create_new_service_account.png)

Type any name of your new service account

![](../../../static/screenshots/firebase_api/type_name_and_create.png)

Select account role

![](../../../static/screenshots/firebase_api/select_account_role.png)

Finish account creation

![](../../../static/screenshots/firebase_api/finish_account_creation.png)

Open newly created account settings

![](../../../static/screenshots/firebase_api/go_to_account_settings.png)

Add key to the service account

![](../../../static/screenshots/firebase_api/add_service_key.png)

Create JSON key and then save it somewhere at your computer, for example - at the root, of your Nanc-CMS build project.

![](../../../static/screenshots/firebase_api/create_service_key.png)

Разрешения у созданного сервисного аккаунта - недостаточные. Нужно пересоздать новый аккаунт с полными разрешениями.

## Using

