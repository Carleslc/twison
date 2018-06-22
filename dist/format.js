window.storyFormat({
  "name": "Twison",
  "version": "0.0.1",
  "author": "Mike Lazer-Walker",
  "description": "Export your Twine 2 story as a JSON document",
  "proofing": false,
  "source": "<html>\r\n\t<head>\r\n\t\t<title>{{STORY_NAME}}</title>\r\n\t\t<script type=\"text/javascript\">\r\n/**\r\n * Twison - Twine 2 JSON Export Story Format\r\n * \r\n * Copyright (c) 2015 Mike Walker\r\n * https://lazerwalker.com\r\n *\r\n * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and\r\n * associated documentation files (the \"Software\"), to deal in the Software without restriction,\r\n * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,\r\n * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,\r\n * subject to the following conditions:\r\n *\r\n * The above copyright notice and this permission notice shall be included in all copies or substantial\r\n * portions of the Software.\r\n *\r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT\r\n * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\r\n * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\r\n * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\r\n * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\r\n */\r\nvar Twison={extractLinksFromText:function(t){var e=t.match(/\\[\\[.+?\\]\\]/g);if(e){var e=e.map(function(e){var n=e.match(/\\[\\[(.*?)\\-\\&gt;(.*?)\\]\\]/);return t=t.replace(e,\"\"),n?{name:n[1],link:n[2]}:(e=e.substring(2,e.length-2),{name:e,link:e})});return{links:e,text:t}}},extractStatementsFromText:function(t){for(var e,n=/\\(if: *([^ ]+) *(is) *([^ ])\\)\\[(\\([^)]+\\))\\]/gm,a=[],r=t;e=n.exec(t);)a.push({variable:e[1],operator:e[2],operand:e[3],actions:Twison.extractActions(e[4]).actions}),r=r.replace(e[0],\"\");return{text:r,statements:a}},extractActions:function(t,e){for(var n,a,r,s=/\\(([^ :]+) *\\: *([^)]*)\\)/g,o=/([^ ]+) *(to) *([^\\n]*)/,i=[],c=t;n=s.exec(t);)a={name:n[1]},\"set\"===n[1]?(r=n[2].split(\",\"),a.values=[],r.forEach(function(t){var e=t.match(o);a.values.push({variable:e[1],operator:e[2],operands:e[3].split(\" \")})})):\"go-to\"===n[1]&&(a.value=n[2].replace(/\\\"/g,\"\")),i.push(a),e&&(c=c.replace(n[0],\"\"));return{actions:i,text:c}},convertPassage:function(t){var e={text:t.innerHTML},n=Twison.extractLinksFromText(e.text);if(n&&(e.links=n.links,e.text=n.text),n=Twison.extractStatementsFromText(e.text),n&&(e.text=n.text,e.statements=n.statements),n=Twison.extractActions(e.text,!0),n&&(e.text=n.text,e.actions=n.actions),e.text=e.text.replace(/\\n\\s*\\n/g,\"\\n\"),[\"name\",\"pid\",\"tags\"].forEach(function(n){var a=t.attributes[n].value;a&&(e[n]=a)}),e.position){var a=e.position.split(\",\");e.position={x:a[0],y:a[1]}}return e.tags&&(e.tags=e.tags.split(\" \")),e},convertStory:function(t){var e=t.getElementsByTagName(\"tw-passagedata\"),n=Array.prototype.slice.call(e).map(Twison.convertPassage),a={passages:n};[\"name\",\"startnode\",\"creator\",\"creator-version\",\"ifid\"].forEach(function(e){var n=t.attributes[e].value;n&&(a[e]=n)});var r={};return a.passages.forEach(function(t){r[t.name]=t.pid}),a.passages.forEach(function(t){t.links&&t.links.forEach(function(t){t.pid=r[t.link],t.pid||(t.broken=!0)})}),a},convert:function(){var t=document.getElementsByTagName(\"tw-storydata\")[0],e=JSON.stringify(Twison.convertStory(t),null,2);document.getElementById(\"output\").innerHTML=e}};window.Twison=Twison;\t\t\r\n\t\t</script>\r\n\t</head>\r\n\t<body>\r\n\t\t<pre id=\"output\">\r\n\t\t\r\n\t\t</pre>\r\n\t\t<div id=\"storyData\" style=\"display: none;\">\r\n\t\t\t{{STORY_DATA}}\r\n\t\t</div>\r\n\t\t<script>\r\n\t\t\tTwison.convert()\r\n\t\t</script>\r\n\t</body>\r\n</html>"
});