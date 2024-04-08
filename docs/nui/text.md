---
sidebar_position: 4
---

# Text

## Standard widgets for text manipulation

Nui offers flexible word processing options. You can both create plain text widgets, in which you can nevertheless change absolutely any aspect of the appearance applied to the entire text block.

But also, you can use an extremely flexible and powerful way of creating texts, where each letter can be customized uniquely.

For this, check out the `<text>` widgets/tags - a simple and flexible way to write texts and `<richText>` - a more complex but incredibly powerful tool that will allow you to create text content of the most mind-blowing sophistication.

## Custom Text Widgets

If you want to create your own custom widget/tag, and it will consume some textual content, you have two ways exactly how you will pass text to that widget:

- Using arguments and processing them in the usual way (just like any other argument)
- Writing text directly inside the tag, as is possible in the `<text>` and `<richText>` tags

You can combine both ways, allowing your users to do both. But to make the second way possible, pay attention to the helper functions available in the `nui` package, namely `extractTextFromChildren` and `extractTextFromChild`.

### Extract text from all descendants

If you know for sure that your widget can only contain and process text located inside tags, such as is done in the `<text>` tag:

```html
<text size="18">
  <prop:textStyle font="Rowdies"/>
  In the world of code and fancy trance,
  Lives a tool that's known as Nanc.
  It twists and turns, through data it dances,
  Making devs smile with second chances.

  No more headaches, no more fuss,
  Nanc's here to help, without a cuss.
  With a click and a drag, it's all so clear,
  Building apps, we now cheer!

  So here's to Nanc, our digital lance,
  Cutting through problems, giving us a chance.
  In the land of code, it takes a stance,
  Thank you, dear Nanc, for enhancing our dance!
</text>
```

The `extractTextFromChildren` method will be the most relevant for you - it extracts text from all descendants of the tag passed to it. Thus, even if the user mistakenly places a third-party tag inside such a widget/tag, and the text inside it - everything will still work perfectly.

### Extracting text from the first level

If you assume that your widget may contain not only text, but also other tags, like `<textSpan>` tag, then you will find it useful to use the second method `extractTextFromChild`, which extracts text directly from the tag that was passed to the method, but not from any other descendants located in this tag.

### Indents

When we talk about writing text directly inside tags, it is worth bearing in mind the formatting of the text, which, due to the peculiarities of `XML` can be a bit complicated. Namely - your text may be quite deep nested within the UI code, causing each line of text to start with a series of indents (spaces / tabs). That said, you can write text line by line, as it may just be more convenient. To solve possible problems and give you more options you are given the following features:

- The `\` key character, which allows you to explicitly specify that the specified indentation should be maintained on a given line
- The `separator` parameter, which defines how the lines typed inside the tag will be glued together.
- The `skipEmptyLines` parameter that allows both saving empty lines and deleting them.

Let's start with the first one. Let's assume that we have typed the following UI code:

```html
<text size="18">
  <prop:textStyle font="Rowdies"/>
  In the world of code and fancy trance,
  Lives a tool that's known as Nanc.
  It twists and turns, through data it dances,
  Making devs smile with second chances.

  No more headaches, no more fuss,
  Nanc's here to help, without a cuss.
  With a click and a drag, it's all so clear,
  Building apps, we now cheer!

  So here's to Nanc, our digital lance,
  Cutting through problems, giving us a chance.
  In the land of code, it takes a stance,
  Thank you, dear Nanc, for enhancing our dance!
</text>
```

By default, this text will be formatted so that the indentation on the left of each line is removed and the lines will run as they do in the text, one after the other:

```text.
In the world of code and fancy trance,
Lives a tool that's known as Nanc.
It twists and turns, through data it dances,
Making devs smile with second chances.
No more headaches, no more fuss,
Nanc's here to help, without a cuss.
With a click and a drag, it's all so clear,
Building apps, we now cheer!
So here's to Nanc, our digital lance,
Cutting through problems, giving us a chance.
In the land of code, it takes a stance,
Thank you, dear Nanc, for enhancing our dance!
```

If you want to indent paragraphs, the `\` symbol will help:

```html
<text size="18">
  <prop:textStyle font="Rowdies"/>
  \ In the world of code and fancy trance,
  Lives a tool that's known as Nanc.
  It twists and turns, through data it dances,
  Making devs smile with second chances.

  \ No more headaches, no more fuss,
  Nanc's here to help, without a cuss.
  With a click and a drag, it's all so clear,
  Building apps, we now cheer!

  \ So here's to Nanc, our digital lance,
  Cutting through problems, giving us a chance.
  In the land of code, it takes a stance,
  Thank you, dear Nanc, for enhancing our dance!
</text>
```

This will produce the following result:

```text
  In the world of code and fancy trance,
Lives a tool that's known as Nanc.
It twists and turns, through data it dances,
Making devs smile with second chances.
  No more headaches, no more fuss,
Nanc's here to help, without a cuss.
With a click and a drag, it's all so clear,
Building apps, we now cheer!
  So here's to Nanc, our digital lance,
Cutting through problems, giving us a chance.
In the land of code, it takes a stance,
Thank you, dear Nanc, for enhancing our dance!
```

Finally, if you want the text to be a single line rather than line-by-line, even though you wrote it in the image of the example, just set the `separator` parameter equal to, for example, a space - ` `, and we get the following result:

```text
 In the world of code and fancy trance, Lives a tool that's known as Nanc. It twists and turns, through data it dances, Making devs smile with second chances. No more headaches, no more fuss, Nanc's here to help, without a cuss. With a click and a drag, it's all so clear, Building apps, we now cheer! So here's to Nanc, our digital lance, Cutting through problems, giving us a chance. In the land of code, it takes a stance, Thank you, dear Nanc, for enhancing our dance!
```

And the last thing is empty strings. If you want to stylistically divide the text into paragraphs, you probably use blank lines to do this, for example like this:

```html
<text size="18">
  <prop:textStyle font="Rowdies"/>
  \ In the world of code and fancy trance,
  Lives a tool that's known as Nanc.
  It twists and turns, through data it dances,
  Making devs smile with second chances.

  \ No more headaches, no more fuss,
  Nanc's here to help, without a cuss.
  With a click and a drag, it's all so clear,
  Building apps, we now cheer!

  \ So here's to Nanc, our digital lance,
  Cutting through problems, giving us a chance.
  In the land of code, it takes a stance,
  Thank you, dear Nanc, for enhancing our dance!
</text>
```

By default such empty lines are discarded, if you want to keep them, set the `skipEmptyLines` parameter to `true` and the result is the following text:

```text
  In the world of code and fancy trance,
Lives a tool that's known as Nanc.
It twists and turns, through data it dances,
Making devs smile with second chances.

  No more headaches, no more fuss,
Nanc's here to help, without a cuss.
With a click and a drag, it's all so clear,
Building apps, we now cheer!

  So here's to Nanc, our digital lance,
Cutting through problems, giving us a chance.
In the land of code, it takes a stance,
Thank you, dear Nanc, for enhancing our dance!
```

The `separator` and `skipEmptyLines` arguments are available by default in `<text>` and `<textSpan>` widgets/tags. If you want to implement similar behavior in your custom widgets - you can do the same way as it is implemented in these widgets.