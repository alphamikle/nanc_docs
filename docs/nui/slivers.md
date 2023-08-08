---
sidebar_position: 3
---

# Slivers

Along with most of the usual widgets, NUI also supports `Slivers` - special widgets responsible for implementing complex patterns related to scrolling on the screen.

You have two ways to use Slivers in your interface implemented with NUI:

1. You can use any implemented slivers as root elements, immediately in the main tag list, if you use the `scrollable` type, of the `ScreenField`.
2. You can use as descendants, such widgets (tags), directly inside the `<customScrollView></customScrollView>` tag.

If you want to add your own sliver tag, the flow of adding it is almost the same as adding a regular widget. The only difference is that you need to specify in the `tagType` parameter the value `TagType.sliver`, and also, add the function-checker, as an argument of `sliverChecker`, of the `CmsConfig` class, when configuring Nanc, and pass the same function as the same name to the `NuiListWidget` widget.

An example of using a sliver tag directly in the main `scrollable` (`NuiListWidget`) tag flow:
```html
<sliverAppBar floating="true" stretch="true" onStretchTrigger="snackbar: Stretched" expandedHeight="100">
  <alias name="title">
    <text color="white">
      Nanc App
    </text>
  </alias>
  <alias name="flexibleSpace">
    <flexibleSpaceBar blurBackground="true" zoomBackground="true" fadeTitle="true">
      <alias name="background">
        <image ref="https://flutter.github.io/assets-for-api-docs/assets/widgets/puffin.jpg" useCache="false" fit="cover"/>
      </alias>
    </flexibleSpaceBar>
  </alias>
</sliverAppBar>

<sizedBox height="8"/>

<for in="{{ 0...10 }}">
  <padding left="8" right="8" bottom="8">
    <container height="50" color="#80FF0000"/>
  </padding>
  <padding left="8" right="8" bottom="8">
    <container height="50" color="#8000FF24"/>
  </padding>
  <padding left="8" right="8" bottom="8">
    <container height="50" color="#8021A0E6"/>
  </padding>
</for>
```

An example of using a sliver tag right inside `<customScrollView>`, in `stack` (`NuiStackWidget`):
```html
<customScrollView>
  <sliverToBoxAdapter>
    <sizedBox height="8"/>
  </sliverToBoxAdapter>
  <sliverList>
    <for in="{{ 0...10 }}">
      <padding left="8" right="8" bottom="8">
        <container height="100" color="red"/>
      </padding>
    </for>
  </sliverList>
  <sliverToBoxAdapter>
    <padding left="8" right="8" bottom="8">
      <container height="100" color="green"/>
    </padding>
  </sliverToBoxAdapter>
  <sliverPadding left="8" right="8">
    <sliverList>
      <for in="{{ 0...5 }}">
        <padding bottom="8">
          <container height="100" color="yellow"/>
        </padding>
      </for>
    </sliverList>
  </sliverPadding>
  <sliverList>
    <for in="{{ 0...10 }}">
      <padding left="8" right="8" bottom="8">
        <container height="100" color="blue"/>
      </padding>
    </for>
  </sliverList>
</customScrollView>
```