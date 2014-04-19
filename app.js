;(function(PACKAGE) {
var oldRequire = window.Require;
(function() {
  var cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith;

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

  loadPackage = function(parentModule, pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(parentModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, module, program, values;
    if (!(program = pkg.distribution[path])) {
      throw "Could not find program at " + path + " in " + pkg.name;
    }
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
      PACKAGE: pkg
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    program.apply(module, values);
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
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        return loadPackage(rootModule, otherPackage);
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

}).call(this);

var require = Require.generateFor(PACKAGE);
window.Require = oldRequire;
require('./main')
})({"source":{"LICENSE":{"path":"LICENSE","content":"The MIT License (MIT)\n\nCopyright (c) 2014 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.","mode":"100644","type":"blob"},"README.md":{"path":"README.md","content":"s3clip\n======\n\nCopy images to S3\n","mode":"100644","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","content":"S3 Clip\n=======\n\nClip images to an S3 bucket.\n\n    console.log \"Running\"\n\n    S3 = require \"s3\"\n\n    chrome.contextMenus.create\n      title: \"Send to S3\"\n      contexts: [\"image\"]\n      onclick: ({srcUrl}) ->\n        uploadToS3(srcUrl)\n    , ->\n      if error = chrome.runtime.lastError\n        console.error error\n      else\n        console.log \"Created!\"\n\n    uploadToS3 = (imageUrl) ->\n      console.log \"getting image data for #{imageUrl}\"\n      getImageBlob imageUrl, (blob) ->\n        console.log \"fetching s3 upload policy\"\n        chrome.storage.sync.get (policyData) ->\n          uploader = S3.uploader(policyData)\n          console.log \"uploading #{imageUrl} to S3\"\n          uploader.upload\n            key: \"uploads/#{imageUrl}\"\n            blob: blob\n      , (error) ->\n        console.error error\n\n    getImageBlob = (url, success, error) ->\n      xhr = new XMLHttpRequest()\n      xhr.open('GET', url)\n      xhr.responseType = 'blob'\n      xhr.onload = (e) ->\n        success @response\n      xhr.onerror = error\n\n      xhr.send()\n\n    global.setPolicy = (policyData) ->\n      chrome.storage.sync.set policyData\n","mode":"100644","type":"blob"},"pixie.cson":{"path":"pixie.cson","content":"author: \"STRd6\"\nname: \"S3 Clip\"\ndescription: \"Clip images to S3\"\nversion: \"0.1.0\"\ndependencies:\n  s3: \"distri/s3:v0.1.0\"\nmanifest_version: 2\nbackground:\n  scripts: [\"app.js\"] # This is a special hack to make the main entry point be a background app\npermissions: [\n  \"<all_urls>\"\n  \"contextMenus\"\n  \"storage\"\n]\n","mode":"100644","type":"blob"}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var S3, getImageBlob, uploadToS3;

  console.log("Running");

  S3 = require("s3");

  chrome.contextMenus.create({
    title: "Send to S3",
    contexts: ["image"],
    onclick: function(_arg) {
      var srcUrl;
      srcUrl = _arg.srcUrl;
      return uploadToS3(srcUrl);
    }
  }, function() {
    var error;
    if (error = chrome.runtime.lastError) {
      return console.error(error);
    } else {
      return console.log("Created!");
    }
  });

  uploadToS3 = function(imageUrl) {
    console.log("getting image data for " + imageUrl);
    return getImageBlob(imageUrl, function(blob) {
      console.log("fetching s3 upload policy");
      return chrome.storage.sync.get(function(policyData) {
        var uploader;
        uploader = S3.uploader(policyData);
        console.log("uploading " + imageUrl + " to S3");
        return uploader.upload({
          key: "uploads/" + imageUrl,
          blob: blob
        });
      });
    }, function(error) {
      return console.error(error);
    });
  };

  getImageBlob = function(url, success, error) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = function(e) {
      return success(this.response);
    };
    xhr.onerror = error;
    return xhr.send();
  };

  global.setPolicy = function(policyData) {
    return chrome.storage.sync.set(policyData);
  };

}).call(this);
;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"author":"STRd6","name":"S3 Clip","description":"Clip images to S3","version":"0.1.0","dependencies":{"s3":"distri/s3:v0.1.0"},"manifest_version":2,"background":{"scripts":["app.js"]},"permissions":["<all_urls>","contextMenus","storage"]};;

  return module.exports;
}},"progenitor":{"url":"http://www.danielx.net/editor/"},"version":"0.1.0","entryPoint":"main","remoteDependencies":undefined,"repository":{"branch":"master","default_branch":"master","full_name":"STRd6/s3clip","homepage":null,"description":"Copy images to S3","html_url":"https://github.com/STRd6/s3clip","url":"https://api.github.com/repos/STRd6/s3clip","publishBranch":"gh-pages"},"dependencies":{"s3":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2014 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"s3\n==\n\nUpload to S3\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"S3\n====\n\nUpload data directly to S3 from the client.\n\nUsage\n-----\n\n>     uploader = S3.uploader(JSON.parse(localStorage.S3Policy))\n>     uploader.upload\n>       key: \"myfile.text\"\n>       blob: new Blob [\"radical\"], type: \"text/plain\"\n\nThe policy is a JSON object with the following keys:\n\n- `accessKey`\n- `acl`\n- `bucket`\n- `policy`\n- `signature`\n\nSince these are all needed to create and sign the policy we keep them all\ntogether.\n\nGiving this object to the uploader method creates an uploader capable of \nasynchronously uploading files to the bucket specified in the policy.\n\nImplementation\n--------------\n\n    module.exports =\n      fetchPolicy: (callback) ->\n        xhr = new XMLHttpRequest\n        xhr.open('GET', \"http://locohost:5000/policy.json\", true)\n        xhr.onreadystatechange = ->\n          return if xhr.readyState != 4\n\n          callback JSON.parse(xhr.responseText)\n\n        xhr.send()\n\n        return xhr\n\n      uploader: (credentials) ->\n        {acl, bucket, policy, signature, accessKey} = credentials\n\n        upload: ({key, blob}) ->\n          sendForm \"https://#{bucket}.s3.amazonaws.com\",\n            key: key\n            \"Content-Type\": blob.type\n            AWSAccessKeyId: accessKey\n            acl: acl\n            policy: policy\n            signature: signature\n            file: blob\n\nHelpers\n-------\n\n    sendForm = (url, data) ->\n      xhr = new XMLHttpRequest\n      xhr.open('POST', url, true)\n\n      formData = Object.keys(data).reduce (formData, key) ->\n        formData.append(key, data[key])\n\n        return formData\n      , new FormData\n\n      xhr.send formData\n\n      return xhr\n\nTODO\n----\n\nAll the data could be extracted from the policy data itself without needing to\ndouble specify acl, bucket, etc.\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.1.0\"\n","type":"blob"},"test/upload.coffee":{"path":"test/upload.coffee","mode":"100644","content":"require \"/main\"\n","type":"blob"}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var sendForm;

  module.exports = {
    fetchPolicy: function(callback) {
      var xhr;
      xhr = new XMLHttpRequest;
      xhr.open('GET', "http://locohost:5000/policy.json", true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
          return;
        }
        return callback(JSON.parse(xhr.responseText));
      };
      xhr.send();
      return xhr;
    },
    uploader: function(credentials) {
      var accessKey, acl, bucket, policy, signature;
      acl = credentials.acl, bucket = credentials.bucket, policy = credentials.policy, signature = credentials.signature, accessKey = credentials.accessKey;
      return {
        upload: function(_arg) {
          var blob, key;
          key = _arg.key, blob = _arg.blob;
          return sendForm("https://" + bucket + ".s3.amazonaws.com", {
            key: key,
            "Content-Type": blob.type,
            AWSAccessKeyId: accessKey,
            acl: acl,
            policy: policy,
            signature: signature,
            file: blob
          });
        }
      };
    }
  };

  sendForm = function(url, data) {
    var formData, xhr;
    xhr = new XMLHttpRequest;
    xhr.open('POST', url, true);
    formData = Object.keys(data).reduce(function(formData, key) {
      formData.append(key, data[key]);
      return formData;
    }, new FormData);
    xhr.send(formData);
    return xhr;
  };

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.1.0"};;

  return module.exports;
},"test/upload":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("/main");

}).call(this);

//# sourceURL=test/upload.coffee;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.1.0","entryPoint":"main","repository":{"id":17414952,"name":"s3","full_name":"distri/s3","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/s3","description":"Upload to S3","fork":false,"url":"https://api.github.com/repos/distri/s3","forks_url":"https://api.github.com/repos/distri/s3/forks","keys_url":"https://api.github.com/repos/distri/s3/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/s3/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/s3/teams","hooks_url":"https://api.github.com/repos/distri/s3/hooks","issue_events_url":"https://api.github.com/repos/distri/s3/issues/events{/number}","events_url":"https://api.github.com/repos/distri/s3/events","assignees_url":"https://api.github.com/repos/distri/s3/assignees{/user}","branches_url":"https://api.github.com/repos/distri/s3/branches{/branch}","tags_url":"https://api.github.com/repos/distri/s3/tags","blobs_url":"https://api.github.com/repos/distri/s3/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/s3/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/s3/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/s3/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/s3/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/s3/languages","stargazers_url":"https://api.github.com/repos/distri/s3/stargazers","contributors_url":"https://api.github.com/repos/distri/s3/contributors","subscribers_url":"https://api.github.com/repos/distri/s3/subscribers","subscription_url":"https://api.github.com/repos/distri/s3/subscription","commits_url":"https://api.github.com/repos/distri/s3/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/s3/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/s3/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/s3/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/s3/contents/{+path}","compare_url":"https://api.github.com/repos/distri/s3/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/s3/merges","archive_url":"https://api.github.com/repos/distri/s3/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/s3/downloads","issues_url":"https://api.github.com/repos/distri/s3/issues{/number}","pulls_url":"https://api.github.com/repos/distri/s3/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/s3/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/s3/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/s3/labels{/name}","releases_url":"https://api.github.com/repos/distri/s3/releases{/id}","created_at":"2014-03-04T19:56:43Z","updated_at":"2014-03-04T19:56:43Z","pushed_at":"2014-03-04T19:56:43Z","git_url":"git://github.com/distri/s3.git","ssh_url":"git@github.com:distri/s3.git","clone_url":"https://github.com/distri/s3.git","svn_url":"https://github.com/distri/s3","homepage":null,"size":0,"stargazers_count":0,"watchers_count":0,"language":null,"has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":2,"branch":"v0.1.0","publishBranch":"gh-pages"},"dependencies":{}}}});