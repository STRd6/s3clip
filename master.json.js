window["STRd6/s3clip:master"]({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "s3clip\n======\n\nCopy images to S3\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "S3 Clip\n=======\n\nClip images to an S3 bucket.\n\n    chrome.contextMenus.create \n      title: \"Send to S3\"\n      contexts:[\"image\"]\n      onclick: (info) ->\n        console.log info\n        alert \"yolo\"\n",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "author: \"STRd6\"\nname: \"S3 Clip\"\ndescription: \"Clip images to S3\"\nversion: \"0.1.0\"\nwidth: 480\nheight: 320\nentryPoint: \"main\"\npermissions: [\n  \"<all_urls>\"\n]\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  chrome.contextMenus.create({\n    title: \"Send to S3\",\n    contexts: [\"image\"],\n    onclick: function(info) {\n      console.log(info);\n      return alert(\"yolo\");\n    }\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"author\":\"STRd6\",\"name\":\"S3 Clip\",\"description\":\"Clip images to S3\",\"version\":\"0.1.0\",\"width\":480,\"height\":320,\"entryPoint\":\"main\",\"permissions\":[\"<all_urls>\"]};",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.1.0",
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/s3clip",
    "homepage": null,
    "description": "Copy images to S3",
    "html_url": "https://github.com/STRd6/s3clip",
    "url": "https://api.github.com/repos/STRd6/s3clip",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});