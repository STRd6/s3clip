(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
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
    "lib/blob_sha.coffee.md": {
      "path": "lib/blob_sha.coffee.md",
      "content": "Get the SHA1 hash of a blob\n===========================\n\n    {SHA1} = CryptoJS = require \"sha1\"\n\n    module.exports = (blob, fn) ->\n      blobTypedArray blob, (arrayBuffer) ->\n        fn(SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString())\n\n    blobTypedArray = (blob, fn) ->\n      reader = new FileReader()\n\n      reader.onloadend = ->\n        fn(reader.result)\n\n      reader.readAsArrayBuffer(blob)\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "S3 Clip\n=======\n\nClip images to an S3 bucket.\n\n    console.log \"Running\"\n\n    S3Trinket = require \"s3-trinket\"\n\n    chrome.contextMenus.create\n      title: \"Send to S3\"\n      contexts: [\"image\"]\n      onclick: ({srcUrl}) ->\n        uploadToS3(srcUrl)\n    , ->\n      if error = chrome.runtime.lastError\n        console.error error\n      else\n        console.log \"Created!\"\n\n    uploadToS3 = (imageUrl) ->\n      console.log \"getting image data for #{imageUrl}\"\n      getImageBlob imageUrl, (blob) ->\n          console.log \"fetching s3 upload policy\"\n          chrome.storage.sync.get \"S3_POLICY\", ({S3_POLICY}) ->\n            trinket = S3Trinket(S3_POLICY)\n\n            console.log \"uploading to S3\"\n            trinket.post blob\n      , (error) ->\n        console.error error\n\n    getImageBlob = (url, success, error) ->\n      xhr = new XMLHttpRequest()\n      xhr.open('GET', url)\n      xhr.responseType = 'blob'\n      xhr.onload = (e) ->\n        success @response\n      xhr.onerror = error\n\n      xhr.send()\n\n    global.setPolicy = (policyData) ->\n      chrome.storage.sync.set\n        S3_POLICY: policyData\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "author: \"STRd6\"\nname: \"S3 Clip\"\ndescription: \"Clip images to S3\"\nversion: \"0.1.0\"\ndependencies:\n  \"s3-trinket\": \"distri/s3-trinket:v0.1.1\"\nmanifest_version: 2\nbackground:\n  scripts: [\"app.js\"] # This is a special hack to make the main entry point be a background app\npermissions: [\n  \"<all_urls>\"\n  \"contextMenus\"\n  \"storage\"\n]\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "lib/blob_sha": {
      "path": "lib/blob_sha",
      "content": "(function() {\n  var CryptoJS, SHA1, blobTypedArray;\n\n  SHA1 = (CryptoJS = require(\"sha1\")).SHA1;\n\n  module.exports = function(blob, fn) {\n    return blobTypedArray(blob, function(arrayBuffer) {\n      return fn(SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString());\n    });\n  };\n\n  blobTypedArray = function(blob, fn) {\n    var reader;\n    reader = new FileReader();\n    reader.onloadend = function() {\n      return fn(reader.result);\n    };\n    return reader.readAsArrayBuffer(blob);\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var S3Trinket, getImageBlob, uploadToS3;\n\n  console.log(\"Running\");\n\n  S3Trinket = require(\"s3-trinket\");\n\n  chrome.contextMenus.create({\n    title: \"Send to S3\",\n    contexts: [\"image\"],\n    onclick: function(_arg) {\n      var srcUrl;\n      srcUrl = _arg.srcUrl;\n      return uploadToS3(srcUrl);\n    }\n  }, function() {\n    var error;\n    if (error = chrome.runtime.lastError) {\n      return console.error(error);\n    } else {\n      return console.log(\"Created!\");\n    }\n  });\n\n  uploadToS3 = function(imageUrl) {\n    console.log(\"getting image data for \" + imageUrl);\n    return getImageBlob(imageUrl, function(blob) {\n      console.log(\"fetching s3 upload policy\");\n      return chrome.storage.sync.get(\"S3_POLICY\", function(_arg) {\n        var S3_POLICY, trinket;\n        S3_POLICY = _arg.S3_POLICY;\n        trinket = S3Trinket(S3_POLICY);\n        console.log(\"uploading to S3\");\n        return trinket.post(blob);\n      });\n    }, function(error) {\n      return console.error(error);\n    });\n  };\n\n  getImageBlob = function(url, success, error) {\n    var xhr;\n    xhr = new XMLHttpRequest();\n    xhr.open('GET', url);\n    xhr.responseType = 'blob';\n    xhr.onload = function(e) {\n      return success(this.response);\n    };\n    xhr.onerror = error;\n    return xhr.send();\n  };\n\n  global.setPolicy = function(policyData) {\n    return chrome.storage.sync.set({\n      S3_POLICY: policyData\n    });\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"author\":\"STRd6\",\"name\":\"S3 Clip\",\"description\":\"Clip images to S3\",\"version\":\"0.1.0\",\"dependencies\":{\"s3-trinket\":\"distri/s3-trinket:v0.1.1\"},\"manifest_version\":2,\"background\":{\"scripts\":[\"app.js\"]},\"permissions\":[\"<all_urls>\",\"contextMenus\",\"storage\"]};",
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
  "dependencies": {
    "s3-trinket": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "s3-trinket\n==========\n\nClip data to S3 and organize workspaces, whatever that means!\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "content": "S3 Trinket\n==========\n\nUsage\n-----\n\nInitializing\n\n>     S3Trinket = require \"s3-trinket\"\n>     trinket = S3Trinket(JSON.parse localStorage.TRINKET_POLICY)\n\nLoading a workspace\n\n>     trinket.loadWorkspace(\"master\")\n>     .then (data) ->\n>       console.log \"loaded workspace\", data\n\nSaving a workspace\n\n>     trinket.saveWorkspace \"master\", data\n\nPost edited images.\n\n>     trinket.post \"images\", imgBlob, (namespacedSha) ->\n\nAfter sifting post image sets.\n\n>     trinket.post \"image_sets\", json, (namespacedSha) ->\n\n    Uploader = require \"./uploader\"\n    SHA1 = require \"sha1\"\n\n    module.exports = S3Trinket = (policy) ->\n      uploader = Uploader(policy)\n\n      user = getUserFromPolicy(policy)\n      base = \"http://#{policy.bucket}.s3.amazonaws.com/#{user}\"\n\nPost a blob to S3 using the given namespace as a content addressable store.\n\n      post: (blob) ->\n        blobToS3 uploader, \"#{user}data\", blob\n\n      loadWorkspace: (name) ->\n        $.getJSON \"#{base}workspaces/#{name}.json\"\n\n      saveWorkspace: (name, data) ->\n        key = \"#{user}workspaces/#{name}.json\"\n        uploader.upload\n          key: key\n          blob: new Blob [JSON.stringify(data)], type: \"application/json\"\n          cacheControl: 60\n        .then ->\n          key\n\n      list: (namespace=\"\") ->\n        namespace = \"#{namespace}\"\n\n        url = \"#{base}#{namespace}\"\n\n        $.get(url).then (data) ->\n          $(data).find(\"Key\").map ->\n            this.innerHTML\n          .get()\n\nExpose SHA1 for others to use.\n\n    S3Trinket.SHA1 = SHA1\n\nHelpers\n-------\n\n    blobToS3 = (uploader, namespace, blob) ->\n      deferred = $.Deferred()\n\n      SHA1 blob, (sha) ->\n        key = \"#{namespace}/#{sha}\"\n\n        uploader.upload\n          key: key\n          blob: blob\n        .then ->\n          deferred.resolve key\n        , (error) ->\n          deferred.reject(error)\n\n      deferred.promise()\n\n    getUserFromPolicy = (policy) ->\n      conditions = JSON.parse(atob(policy.policy)).conditions.filter ([a, b, c]) ->\n        a is \"starts-with\" and b is \"$key\"\n\n      conditions[0][2]\n",
          "mode": "100644"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.1.1\"\nremoteDependencies: [\n  \"https://code.jquery.com/jquery-1.11.0.min.js\"\n]\ndependencies:\n  sha1: \"distri/sha1:v0.2.0\"\n",
          "mode": "100644"
        },
        "test/test.coffee": {
          "path": "test/test.coffee",
          "content": "S3Trinket = require \"../main\"\n\ntrinket = S3Trinket(JSON.parse(localStorage.TRINKET_POLICY))\n\ntrinket.saveWorkspace(\"yolo\", radical: true).then (key) ->\n  console.log key\n\ntrinket.post(new Blob([\"duder\"], type: \"text/plain\")).then (key) ->\n  console.log key\n",
          "mode": "100644"
        },
        "uploader.coffee.md": {
          "path": "uploader.coffee.md",
          "content": "S3\n====\n\nUpload data directly to S3 from the client.\n\nUsage\n-----\n\n>     uploader = S3.uploader(JSON.parse(localStorage.S3Policy))\n>     uploader.upload\n>       key: \"myfile.text\"\n>       blob: new Blob [\"radical\"]\n>       cacheControl: 60 # default 31536000\n\nThe policy is a JSON object with the following keys:\n\n- `accessKey`\n- `policy`\n- `signature`\n\nSince these are all needed to create and sign the policy we keep them all\ntogether.\n\nGiving this object to the uploader method creates an uploader capable of\nasynchronously uploading files to the bucket specified in the policy.\n\nNotes\n-----\n\nThe policy must specify a `Cache-Control` header because we always try to set it.\n\nImplementation\n--------------\n\n    module.exports = (credentials) ->\n      {policy, signature, accessKey} = credentials\n      {acl, bucket} = extractPolicyData(policy)\n\n      upload: ({key, blob, cacheControl}) ->\n        sendForm \"https://#{bucket}.s3.amazonaws.com\", objectToForm\n          key: key\n          \"Content-Type\": blob.type\n          \"Cache-Control\": \"max-age=#{cacheControl or 31536000}\"\n          AWSAccessKeyId: accessKey\n          acl: acl\n          policy: policy\n          signature: signature\n          file: blob\n\nHelpers\n-------\n\n    sendForm = (url, formData) ->\n      $.ajax\n        url: url\n        data: formData\n        processData: false\n        contentType: false\n        type: 'POST'\n\n    objectToForm = (data) ->\n      formData = Object.keys(data).reduce (formData, key) ->\n        formData.append(key, data[key])\n\n        return formData\n      , new FormData\n\n    extractPolicyData = (policy) ->\n      policyObject = JSON.parse(atob(policy))\n\n      conditions = policyObject.conditions\n\n      acl: getKey(conditions, \"acl\")\n      bucket: getKey(conditions, \"bucket\")\n\n    getKey = (conditions, key) ->\n      results = conditions.filter (condition) ->\n        typeof condition is \"object\"\n      .map (object) ->\n        object[key]\n      .filter (value) ->\n        value\n\n      results[0]\n",
          "mode": "100644"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var S3Trinket, SHA1, Uploader, blobToS3, getUserFromPolicy;\n\n  Uploader = require(\"./uploader\");\n\n  SHA1 = require(\"sha1\");\n\n  module.exports = S3Trinket = function(policy) {\n    var base, uploader, user;\n    uploader = Uploader(policy);\n    user = getUserFromPolicy(policy);\n    base = \"http://\" + policy.bucket + \".s3.amazonaws.com/\" + user;\n    return {\n      post: function(blob) {\n        return blobToS3(uploader, \"\" + user + \"data\", blob);\n      },\n      loadWorkspace: function(name) {\n        return $.getJSON(\"\" + base + \"workspaces/\" + name + \".json\");\n      },\n      saveWorkspace: function(name, data) {\n        var key;\n        key = \"\" + user + \"workspaces/\" + name + \".json\";\n        return uploader.upload({\n          key: key,\n          blob: new Blob([JSON.stringify(data)], {\n            type: \"application/json\"\n          }),\n          cacheControl: 60\n        }).then(function() {\n          return key;\n        });\n      },\n      list: function(namespace) {\n        var url;\n        if (namespace == null) {\n          namespace = \"\";\n        }\n        namespace = \"\" + namespace;\n        url = \"\" + base + namespace;\n        return $.get(url).then(function(data) {\n          return $(data).find(\"Key\").map(function() {\n            return this.innerHTML;\n          }).get();\n        });\n      }\n    };\n  };\n\n  S3Trinket.SHA1 = SHA1;\n\n  blobToS3 = function(uploader, namespace, blob) {\n    var deferred;\n    deferred = $.Deferred();\n    SHA1(blob, function(sha) {\n      var key;\n      key = \"\" + namespace + \"/\" + sha;\n      return uploader.upload({\n        key: key,\n        blob: blob\n      }).then(function() {\n        return deferred.resolve(key);\n      }, function(error) {\n        return deferred.reject(error);\n      });\n    });\n    return deferred.promise();\n  };\n\n  getUserFromPolicy = function(policy) {\n    var conditions;\n    conditions = JSON.parse(atob(policy.policy)).conditions.filter(function(_arg) {\n      var a, b, c;\n      a = _arg[0], b = _arg[1], c = _arg[2];\n      return a === \"starts-with\" && b === \"$key\";\n    });\n    return conditions[0][2];\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.1\",\"remoteDependencies\":[\"https://code.jquery.com/jquery-1.11.0.min.js\"],\"dependencies\":{\"sha1\":\"distri/sha1:v0.2.0\"}};",
          "type": "blob"
        },
        "test/test": {
          "path": "test/test",
          "content": "(function() {\n  var S3Trinket, trinket;\n\n  S3Trinket = require(\"../main\");\n\n  trinket = S3Trinket(JSON.parse(localStorage.TRINKET_POLICY));\n\n  trinket.saveWorkspace(\"yolo\", {\n    radical: true\n  }).then(function(key) {\n    return console.log(key);\n  });\n\n  trinket.post(new Blob([\"duder\"], {\n    type: \"text/plain\"\n  })).then(function(key) {\n    return console.log(key);\n  });\n\n}).call(this);\n",
          "type": "blob"
        },
        "uploader": {
          "path": "uploader",
          "content": "(function() {\n  var extractPolicyData, getKey, objectToForm, sendForm;\n\n  module.exports = function(credentials) {\n    var accessKey, acl, bucket, policy, signature, _ref;\n    policy = credentials.policy, signature = credentials.signature, accessKey = credentials.accessKey;\n    _ref = extractPolicyData(policy), acl = _ref.acl, bucket = _ref.bucket;\n    return {\n      upload: function(_arg) {\n        var blob, cacheControl, key;\n        key = _arg.key, blob = _arg.blob, cacheControl = _arg.cacheControl;\n        return sendForm(\"https://\" + bucket + \".s3.amazonaws.com\", objectToForm({\n          key: key,\n          \"Content-Type\": blob.type,\n          \"Cache-Control\": \"max-age=\" + (cacheControl || 31536000),\n          AWSAccessKeyId: accessKey,\n          acl: acl,\n          policy: policy,\n          signature: signature,\n          file: blob\n        }));\n      }\n    };\n  };\n\n  sendForm = function(url, formData) {\n    return $.ajax({\n      url: url,\n      data: formData,\n      processData: false,\n      contentType: false,\n      type: 'POST'\n    });\n  };\n\n  objectToForm = function(data) {\n    var formData;\n    return formData = Object.keys(data).reduce(function(formData, key) {\n      formData.append(key, data[key]);\n      return formData;\n    }, new FormData);\n  };\n\n  extractPolicyData = function(policy) {\n    var conditions, policyObject;\n    policyObject = JSON.parse(atob(policy));\n    conditions = policyObject.conditions;\n    return {\n      acl: getKey(conditions, \"acl\"),\n      bucket: getKey(conditions, \"bucket\")\n    };\n  };\n\n  getKey = function(conditions, key) {\n    var results;\n    results = conditions.filter(function(condition) {\n      return typeof condition === \"object\";\n    }).map(function(object) {\n      return object[key];\n    }).filter(function(value) {\n      return value;\n    });\n    return results[0];\n  };\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/"
      },
      "version": "0.1.1",
      "entryPoint": "main",
      "remoteDependencies": [
        "https://code.jquery.com/jquery-1.11.0.min.js"
      ],
      "repository": {
        "branch": "v0.1.1",
        "default_branch": "master",
        "full_name": "distri/s3-trinket",
        "homepage": null,
        "description": "Clip data to S3 and organize workspaces, whatever that means!",
        "html_url": "https://github.com/distri/s3-trinket",
        "url": "https://api.github.com/repos/distri/s3-trinket",
        "publishBranch": "gh-pages"
      },
      "dependencies": {
        "sha1": {
          "source": {
            "LICENSE": {
              "path": "LICENSE",
              "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
              "mode": "100644",
              "type": "blob"
            },
            "README.md": {
              "path": "README.md",
              "content": "sha1\n====\n\nSHA1 JS implementation. Currently wrapping CryptoJS with a more uniform API.\n\nUsage\n-----\n\nStrings\n\n    string = \"\"\n\n    SHA1 string, (sha) ->\n      sha # \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n\nBlobs\n\n    blob = new Blob\n\n    SHA1 blob, (sha) ->\n      sha # \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n\nArray buffers\n\n    arrayBuffer = new ArrayBuffer\n\n    SHA1 arrayBuffer, (sha) ->\n      sha # \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "lib/crypto.js": {
              "path": "lib/crypto.js",
              "content": "/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\nvar CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty(\"init\")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty(\"toString\")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},\nn=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<\n32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,\n2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error(\"Malformed UTF-8 data\");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},\nk=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){\"string\"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);\na._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,\nf)).finalize(b)}}});var s=p.algo={};return p}(Math);\n(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^\nk)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();\n\n/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\n(function(){if(\"function\"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,e=b.init;(b.init=function(a){a instanceof ArrayBuffer&&(a=new Uint8Array(a));if(a instanceof Int8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);if(a instanceof Uint8Array){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a[c]<<\n24-8*(c%4);e.call(this,d,b)}else e.apply(this,arguments)}).prototype=b}})();\n\nmodule.exports = CryptoJS;\n",
              "mode": "100644",
              "type": "blob"
            },
            "main.coffee.md": {
              "path": "main.coffee.md",
              "content": "SHA1\n====\n\nWrapping up CryptoJS SHA1 implementation to be a little nicer.\n\n    {SHA1} = CryptoJS = require(\"./lib/crypto\")\n\n    module.exports = (data, fn) ->\n      if data instanceof Blob\n        blobTypedArray data, (arrayBuffer) ->\n          fn(shaArrayBuffer(arrayBuffer))\n      else if data instanceof ArrayBuffer\n        defer ->\n          fn(shaArrayBuffer(data))\n      else\n        defer ->\n          fn(SHA1(data).toString())\n\nHelpers\n-------\n\n    defer = (fn) ->\n      setTimeout fn, 0\n\n    shaArrayBuffer = (arrayBuffer) ->\n      SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString()\n\n    blobTypedArray = (blob, fn) ->\n      reader = new FileReader()\n    \n      reader.onloadend = ->\n        fn(reader.result)\n    \n      reader.readAsArrayBuffer(blob)\n",
              "mode": "100644",
              "type": "blob"
            },
            "pixie.cson": {
              "path": "pixie.cson",
              "content": "version: \"0.2.0\"\n",
              "mode": "100644",
              "type": "blob"
            },
            "test/sha1.coffee": {
              "path": "test/sha1.coffee",
              "content": "SHA1 = require \"../main\"\n\ndescribe \"SHA1\", ->\n  it \"should hash stuff\", (done) ->\n    SHA1 \"\", (sha) ->\n      assert.equal sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n      done()\n\n  it \"should hash blobs\", (done) ->\n    blob = new Blob\n\n    SHA1 blob, (sha) ->\n      assert.equal sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n      done()\n\n  it \"should hash array buffers\", (done) ->\n    arrayBuffer = new ArrayBuffer\n\n    SHA1 arrayBuffer, (sha) ->\n      assert.equal sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\"\n      done()\n",
              "mode": "100644",
              "type": "blob"
            }
          },
          "distribution": {
            "lib/crypto": {
              "path": "lib/crypto",
              "content": "/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\nvar CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty(\"init\")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty(\"toString\")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},\nn=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<\n32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,\n2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error(\"Malformed UTF-8 data\");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},\nk=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){\"string\"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);\na._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,\nf)).finalize(b)}}});var s=p.algo={};return p}(Math);\n(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^\nk)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();\n\n/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\n(function(){if(\"function\"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,e=b.init;(b.init=function(a){a instanceof ArrayBuffer&&(a=new Uint8Array(a));if(a instanceof Int8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);if(a instanceof Uint8Array){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a[c]<<\n24-8*(c%4);e.call(this,d,b)}else e.apply(this,arguments)}).prototype=b}})();\n\nmodule.exports = CryptoJS;\n",
              "type": "blob"
            },
            "main": {
              "path": "main",
              "content": "(function() {\n  var CryptoJS, SHA1, blobTypedArray, defer, shaArrayBuffer;\n\n  SHA1 = (CryptoJS = require(\"./lib/crypto\")).SHA1;\n\n  module.exports = function(data, fn) {\n    if (data instanceof Blob) {\n      return blobTypedArray(data, function(arrayBuffer) {\n        return fn(shaArrayBuffer(arrayBuffer));\n      });\n    } else if (data instanceof ArrayBuffer) {\n      return defer(function() {\n        return fn(shaArrayBuffer(data));\n      });\n    } else {\n      return defer(function() {\n        return fn(SHA1(data).toString());\n      });\n    }\n  };\n\n  defer = function(fn) {\n    return setTimeout(fn, 0);\n  };\n\n  shaArrayBuffer = function(arrayBuffer) {\n    return SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString();\n  };\n\n  blobTypedArray = function(blob, fn) {\n    var reader;\n    reader = new FileReader();\n    reader.onloadend = function() {\n      return fn(reader.result);\n    };\n    return reader.readAsArrayBuffer(blob);\n  };\n\n}).call(this);\n",
              "type": "blob"
            },
            "pixie": {
              "path": "pixie",
              "content": "module.exports = {\"version\":\"0.2.0\"};",
              "type": "blob"
            },
            "test/sha1": {
              "path": "test/sha1",
              "content": "(function() {\n  var SHA1;\n\n  SHA1 = require(\"../main\");\n\n  describe(\"SHA1\", function() {\n    it(\"should hash stuff\", function(done) {\n      return SHA1(\"\", function(sha) {\n        assert.equal(sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\");\n        return done();\n      });\n    });\n    it(\"should hash blobs\", function(done) {\n      var blob;\n      blob = new Blob;\n      return SHA1(blob, function(sha) {\n        assert.equal(sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\");\n        return done();\n      });\n    });\n    return it(\"should hash array buffers\", function(done) {\n      var arrayBuffer;\n      arrayBuffer = new ArrayBuffer;\n      return SHA1(arrayBuffer, function(sha) {\n        assert.equal(sha, \"da39a3ee5e6b4b0d3255bfef95601890afd80709\");\n        return done();\n      });\n    });\n  });\n\n}).call(this);\n",
              "type": "blob"
            }
          },
          "progenitor": {
            "url": "http://www.danielx.net/editor/"
          },
          "version": "0.2.0",
          "entryPoint": "main",
          "repository": {
            "branch": "v0.2.0",
            "default_branch": "master",
            "full_name": "distri/sha1",
            "homepage": null,
            "description": "SHA1 JS implementation",
            "html_url": "https://github.com/distri/sha1",
            "url": "https://api.github.com/repos/distri/sha1",
            "publishBranch": "gh-pages"
          },
          "dependencies": {}
        }
      }
    }
  }
});