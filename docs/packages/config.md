# Config

This package contains the configurations used when running Nanc, and you can also customize some aspects of the CMS by passing environment variables:

`ERROR_DURATION=<int>` - specifies, in seconds, the time for which an error message will be shown

`SIMPLE_ERRORS=<bool>` - specifies whether detailed error messages or only human-readable headers will be shown

## Import

```yaml
dependencies:
  config:
    path: ../nanc/config
```

More info about configuration for CMS you can find [here](../nanc_configuring) and about mobile app configuration [here](../mobile_app_configuring).