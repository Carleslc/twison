var Twison = {
  extractLinksFromText: function(text) {
    var links = text.match(/\[\[.+?\]\]( *{{ *([\d]+) *}})*/g);

    if (links) {
      var links = links.map(function(link) {
        var differentName = link.match(/\[\[(.*?)(\||\-\&gt;|\&lt;\-)(.*?)\]\](?: *{{ *([\d]+) *}})*/);

        text = text.replace(link, '');

        if (differentName) {
          // [[name->link]] or [[name|link]]
          passageName = differentName[1]
          passageLink = differentName[3]
          if (differentName[2] === "&lt;-") {
            // [[link<-name]]
            passageLink = differentName[1]
            passageName = differentName[3]
          }
          return {
            name: passageName,
            link: passageLink,
            timeout: differentName[4]
          };
        } else {
          // [[link]]
          link = link.substring(2, link.length - 2);
          return {
            name: link,
            link: link
          }
        }
      });

      return {
        links: links,
        text: text
      }
    }
  },

  extractStatementsFromText: function(text) {
    var statementRegex = /\((if): *([^)]*)\) *\[(\([^)]*\))\](?:\n\((else):\) *\[(\([^)]*\))\]){0,1}/gm,
      statements = [],
      newText = text,
      matches,
      _if,
      _else = null;

    var extractConditions = function(text) {
      var result = [],
        conditions = text.split('and');

      conditions.forEach(function(condition) {
        var variables = condition.trim().split(' ');
        result.push({
          variable: variables[0],
          operator: variables[1],
          operand: variables[2]
        });
      });

      return result;
    };

    while (matches = statementRegex.exec(text)) {
      _if = {
        conditions: extractConditions(matches[2]),
        actions: Twison.extractActions(matches[3]).actions
      };

      if (matches[5]) {
        _else = {
          actions: Twison.extractActions(matches[5]).actions
        }
      }

      statements.push({
        'if': _if,
        'else': _else
      });

      newText = newText.replace(matches[0], '');
    }

    return {
      text: newText,
      statements: statements
    };
  },

  extractActions: function(text, shouldReplaceText) {
    var actionRegex = /\(([^ :]+) *\: *([^)]*)\)/g,
      setRegex = /([^ ]+) *(to) *([^\n]*)/,
      actions = [],
      newText = text,
      matches,
      action,
      values,
      _values;

    while (matches = actionRegex.exec(text)) {
      action = {
        name: matches[1]
      };

      if (matches[1] === "set") {
        values = [];
        _values = matches[2].split(',');
        action.values = [];

        _values.forEach(function(value) {
          var res = value.trim();
          if (res.length) {
            values.push(res);
          }
        });

        values.forEach(function(value) {
          var setMatch = value.match(setRegex);
          if (setMatch) {
            action.values.push({
              variable: setMatch[1],
              operator: setMatch[2],
              operands: setMatch[3].split(' ')
            });
          } else {
            console.error('err', value);
          }
        });
      } else if (matches[1] === "go-to") {
        action.value = matches[2].replace(/\"/g, "");
      }

      actions.push(action);

      if (shouldReplaceText) {
        newText = newText.replace(matches[0], '');
      }
    }

    return {
      actions: actions,
      text: newText
    };
  },

  convertPassage: function(passage) {
    var dict = { text: passage.innerHTML };

    var result = Twison.extractLinksFromText(dict.text);
    if (result) {
      dict.links = result.links;
      dict.text = result.text;
    }

    result = Twison.extractStatementsFromText(dict.text);
    if (result) {
      dict.text = result.text;
      dict.statements = result.statements;
    }

    result = Twison.extractActions(dict.text, true);
    if (result) {
      dict.text = result.text;
      dict.actions = result.actions;
    }

    dict.text = dict.text.replace(/\n\s*\n/g, '\n');

    ["name", "pid", "tags"].forEach(function(attr) {
      var value = passage.attributes[attr].value;
      if (value) {
        dict[attr] = value;
      }
    });

    if (dict.position) {
      var position = dict.position.split(',')
      dict.position = {
        x: position[0],
        y: position[1]
      }
    }

    if (dict.tags) {
      dict.tags = dict.tags.split(" ");
    }

    return dict;
  },

  convertStory: function(story) {
    var passages = story.getElementsByTagName("tw-passagedata");
    var convertedPassages = Array.prototype.slice.call(passages).map(Twison.convertPassage);

    var dict = {
      passages: convertedPassages
    };

    ["name", "startnode", "creator", "creator-version", "ifid"].forEach(function(attr) {
      var value = story.attributes[attr].value;
      if (value) {
        dict[attr] = value;
      }
    });

    // Add PIDs to links
    var pidsByName = {};
    dict.passages.forEach(function(passage) {
      pidsByName[passage.name] = passage.pid;
    });

    dict.passages.forEach(function(passage) {
      if (!passage.links) return;
      passage.links.forEach(function(link) {
        link.pid = pidsByName[link.link];
        if (!link.pid) {
          link.broken = true;
        }
      });
    });

    return dict;
  },

  convert: function() {
    var storyData = document.getElementsByTagName("tw-storydata")[0];
    var json = JSON.stringify(Twison.convertStory(storyData), null, 2);
    document.getElementById("output").innerHTML = json;
  }
}

window.Twison = Twison;