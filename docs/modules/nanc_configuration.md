---
sidebar_position: 1
---

# Nanc configuration

This package contains the configurations used when running Nanc, and you can also customize some aspects of the CMS by passing environment variables:

`ERROR_DURATION=<int>` - specifies, in seconds, the time for which an error message will be shown

`SIMPLE_ERRORS=<bool>` - specifies whether detailed error messages or only human-readable headers will be shown

Also, this package will be useful to you if you are going to write your own API implementation for Nanc.

## Import

Install it from [pub.dev](https://pub.dev/packages/nanc_configuration):

```yaml
dependencies:
  nanc_configuration: any
```

More info about configuration for CMS you can find [here](../cms_configuration.md) and about mobile app configuration [here](../app_configuring.md).