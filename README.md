# Twison

[![Build Status](https://travis-ci.org/Carleslc/twison.svg?branch=master)](https://travis-ci.org/Carleslc/twison)

Twison is a story format for [Twine 2](http://twinery.org/2) that simply exports to JSON.

It is inspired by [Entweedle](http://www.maximumverbosity.net/twine/Entweedle/) as a model for how Twine 2 story formats work and [Harlowe](https://twine2.neocities.org/) ([src](https://bitbucket.org/_L_/harlowe/src/default/)) format to parse links and actions.

## Installation

From the Twine 2 story select screen, add a story format, and point it to the url `https://readteractive.netlify.com/format.js`.

From within your story, set the story format to Twison. Choosing "Play" will now give you a JSON file.

## Example

This is an example output for the example story at [test/fixture.html](https://github.com/Carleslc/twison/blob/master/test/fixture.html).

### Output

```json
{
  "passages": [
    {
      "text": "This is the first node.\nThere is a second node, and a third node.",
      "links": [
        {
          "name": "second",
          "link": "second",
          "pid": "2"
        },
        {
          "name": "third",
          "link": "another",
          "pid": "3"
        }
      ],
      "statements": [],
      "actions": [],
      "name": "Start",
      "pid": "1",
      "position": {
        "x": "511",
        "y": "47"
      },
      "tags": [
        "tag1",
        "tag2"
      ]
    },
    {
      "text": "Would you rather go to another?",
      "links": [
        {
          "name": "another",
          "link": "another",
          "pid": "3"
        }
      ],
      "statements": [],
      "actions": [],
      "name": "second",
      "pid": "2",
      "position": {
        "x": "328",
        "y": "197"
      }
    },
    {
      "text": "Would you rather go to second?",
      "links": [
        {
          "name": "second",
          "link": "second",
          "pid": "2"
        }
      ],
      "statements": [],
      "actions": [],
      "name": "another",
      "pid": "3",
      "position": {
        "x": "652",
        "y": "195"
      }
    },
    {
      "text": "I am unattached, and have a link that is broken.",
      "links": [
        {
          "name": "broken",
          "link": "broken",
          "broken": true
        }
      ],
      "statements": [],
      "actions": [],
      "name": "unattached",
      "pid": "4",
      "position": {
        "x": "893",
        "y": "116"
      }
    }
  ],
  "name": "Twison-Test",
  "startnode": "1",
  "creator": "Twine",
  "creator-version": "2.3.2",
  "ifid": "94716246-402E-4E05-914B-532937C5EE88"
}
```


## Interoperating with other systems

The goal of Twison is to make it easy to use Twine as a frontend for forms of storytelling that differ from Twine's default hypertext output. While being able to copy/paste your JSON from Twison's output into some other system is doable, it's easy to imagine how a tighter integration with external systems could make it a lot easier to use Twine as a prototyping tool.

The hope is that this will eventually take the form of some sort of module system that will make it easy for you to create an integration between Twine/Twison and your own engine. 

In the meanwhile, if you want to see what a custom integration of Twison might look like with another IF tool, check out [Tinsel](http://www.maketinsel.com), a tool that allows you to write telephone-based IF games. Although you can use Tinsel by writing game scripts in its own format, you can also create Tinsel games in Twine, by means of the [Tinsel-Twison](https://github.com/lazerwalker/tinsel-twison) project. 


## Development

If you want to hack on Twison itself:

1. Clone this repo and run `npm install` to install dependencies.
2. Make your changes to the unminified code in the `src` folder
3. Run `node build.js` to compile your source into a `format.js` file that Twine 2 can understand. Alternatively, you can run `node watch.js` to watch the `src` directory for changes and auto-recompile every time you save.


### Testing your changes locally

Running `npm start` will start the `watch.js` auto-compile behavior, and also start a local web server that serves the compiled `format.js` file. By default, this will be available at `http://localhost:3000/format.js`. Add that URL as a story format to your copy of Twine 2; every time you save a source file and then re-generate the "Play" view of your story in Twine, it should use the latest version of your code.

This is easier to do with the browser-based version of Twine 2 than with the downloadable copy, as you can just refresh your output page and it'll use the latest version of Twison.


All contributions are welcome! If making code changes, please be sure to run the test suite (`npm test`) before opening a pull request.


## License

Twison is licensed under the MIT license. See the LICENSE file for more information.
