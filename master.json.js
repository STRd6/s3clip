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
      "content": "S3 Clip\n=======\n\nClip images to an S3 bucket.\n\n    console.log \"Running\"\n\n    chrome.runtime.onInstalled.addListener ->\n\n      chrome.contextMenus.create\n        id: \"send\"\n        title: \"Send to S3\"\n        contexts: [\"image\"]\n      , ->\n        if error = chrome.runtime.lastError\n          console.error error\n        else\n          console.log \"Created!\"\n\n      chrome.contextMenus.onClicked.addListener (data) ->\n        console.log data\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "author: \"STRd6\"\nname: \"S3 Clip\"\ndescription: \"Clip images to S3\"\nversion: \"0.1.0\"\nmanifest_version: 2\napp:\n  background:\n    scripts: [\"app.js\"] # This is a special hack to make the main entry point be a background app\npermissions: [\n  \"<all_urls>\"\n  \"contextMenus\"\n]\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  console.log(\"Running\");\n\n  chrome.runtime.onInstalled.addListener(function() {\n    chrome.contextMenus.create({\n      id: \"send\",\n      title: \"Send to S3\",\n      contexts: [\"image\"]\n    }, function() {\n      var error;\n      if (error = chrome.runtime.lastError) {\n        return console.error(error);\n      } else {\n        return console.log(\"Created!\");\n      }\n    });\n    return chrome.contextMenus.onClicked.addListener(function(data) {\n      return console.log(data);\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"author\":\"STRd6\",\"name\":\"S3 Clip\",\"description\":\"Clip images to S3\",\"version\":\"0.1.0\",\"manifest_version\":2,\"app\":{\"background\":{\"scripts\":[\"app.js\"]}},\"permissions\":[\"<all_urls>\",\"contextMenus\"]};",
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