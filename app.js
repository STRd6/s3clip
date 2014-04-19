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
})({"source":{"LICENSE":{"path":"LICENSE","content":"The MIT License (MIT)\n\nCopyright (c) 2014 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.","mode":"100644","type":"blob"},"README.md":{"path":"README.md","content":"s3clip\n======\n\nCopy images to S3\n","mode":"100644","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","content":"S3 Clip\n=======\n\nClip images to an S3 bucket.\n\n    console.log \"Running\"\n\n    S3 = require \"s3\"\n    SHA1 = require \"./lib/blob_sha\"\n\n    chrome.contextMenus.create\n      title: \"Send to S3\"\n      contexts: [\"image\"]\n      onclick: ({srcUrl}) ->\n        uploadToS3(srcUrl)\n    , ->\n      if error = chrome.runtime.lastError\n        console.error error\n      else\n        console.log \"Created!\"\n\n    uploadToS3 = (imageUrl) ->\n      console.log \"getting image data for #{imageUrl}\"\n      getImageBlob imageUrl, (blob) ->\n        SHA1 blob, (sha) ->\n          console.log \"fetching s3 upload policy\"\n          chrome.storage.sync.get (policyData) ->\n            uploader = S3.uploader(policyData)\n            console.log \"uploading #{imageUrl} to S3\"\n            uploader.upload\n              key: \"uploads/#{imageUrl}\"\n              blob: blob\n      , (error) ->\n        console.error error\n\n    getImageBlob = (url, success, error) ->\n      xhr = new XMLHttpRequest()\n      xhr.open('GET', url)\n      xhr.responseType = 'blob'\n      xhr.onload = (e) ->\n        success @response\n      xhr.onerror = error\n\n      xhr.send()\n\n    global.setPolicy = (policyData) ->\n      chrome.storage.sync.set policyData\n","mode":"100644","type":"blob"},"pixie.cson":{"path":"pixie.cson","content":"author: \"STRd6\"\nname: \"S3 Clip\"\ndescription: \"Clip images to S3\"\nversion: \"0.1.0\"\ndependencies:\n  s3: \"distri/s3:v0.1.0\"\n  sha1: \"distri/sha1:v0.1.0\"\nmanifest_version: 2\nbackground:\n  scripts: [\"app.js\"] # This is a special hack to make the main entry point be a background app\npermissions: [\n  \"<all_urls>\"\n  \"contextMenus\"\n  \"storage\"\n]\n","mode":"100644","type":"blob"},"lib/blob_sha.coffee.md":{"path":"lib/blob_sha.coffee.md","content":"Get the SHA1 hash of a blob\n===========================\n\n    {SHA1} = require \"sha1\"\n\n    module.exports = (blob, fn) ->\n      blobTypedArray blob (arrayBuffer) ->\n        fn(SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString())\n\n    blobTypedArray = (blob, fn) ->\n      reader = new FileReader()\n\n      reader.onloadend = ->\n        fn(reader.result)\n\n      reader.readAsArrayBuffer(blob)\n","mode":"100644","type":undefined}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var S3, SHA1, getImageBlob, uploadToS3;

  console.log("Running");

  S3 = require("s3");

  SHA1 = require("./lib/blob_sha");

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
      return SHA1(blob, function(sha) {
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
  module.exports = {"author":"STRd6","name":"S3 Clip","description":"Clip images to S3","version":"0.1.0","dependencies":{"s3":"distri/s3:v0.1.0","sha1":"distri/sha1:v0.1.0"},"manifest_version":2,"background":{"scripts":["app.js"]},"permissions":["<all_urls>","contextMenus","storage"]};;

  return module.exports;
},"lib/blob_sha":function(require, global, module, exports, PACKAGE) {
  (function() {
  var SHA1, blobTypedArray;

  SHA1 = require("sha1").SHA1;

  module.exports = function(blob, fn) {
    return blobTypedArray(blob(function(arrayBuffer) {
      return fn(SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString());
    }));
  };

  blobTypedArray = function(blob, fn) {
    var reader;
    reader = new FileReader();
    reader.onloadend = function() {
      return fn(reader.result);
    };
    return reader.readAsArrayBuffer(blob);
  };

}).call(this);
;

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
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.1.0","entryPoint":"main","repository":{"id":17414952,"name":"s3","full_name":"distri/s3","owner":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/s3","description":"Upload to S3","fork":false,"url":"https://api.github.com/repos/distri/s3","forks_url":"https://api.github.com/repos/distri/s3/forks","keys_url":"https://api.github.com/repos/distri/s3/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/s3/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/s3/teams","hooks_url":"https://api.github.com/repos/distri/s3/hooks","issue_events_url":"https://api.github.com/repos/distri/s3/issues/events{/number}","events_url":"https://api.github.com/repos/distri/s3/events","assignees_url":"https://api.github.com/repos/distri/s3/assignees{/user}","branches_url":"https://api.github.com/repos/distri/s3/branches{/branch}","tags_url":"https://api.github.com/repos/distri/s3/tags","blobs_url":"https://api.github.com/repos/distri/s3/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/s3/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/s3/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/s3/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/s3/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/s3/languages","stargazers_url":"https://api.github.com/repos/distri/s3/stargazers","contributors_url":"https://api.github.com/repos/distri/s3/contributors","subscribers_url":"https://api.github.com/repos/distri/s3/subscribers","subscription_url":"https://api.github.com/repos/distri/s3/subscription","commits_url":"https://api.github.com/repos/distri/s3/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/s3/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/s3/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/s3/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/s3/contents/{+path}","compare_url":"https://api.github.com/repos/distri/s3/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/s3/merges","archive_url":"https://api.github.com/repos/distri/s3/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/s3/downloads","issues_url":"https://api.github.com/repos/distri/s3/issues{/number}","pulls_url":"https://api.github.com/repos/distri/s3/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/s3/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/s3/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/s3/labels{/name}","releases_url":"https://api.github.com/repos/distri/s3/releases{/id}","created_at":"2014-03-04T19:56:43Z","updated_at":"2014-03-04T19:56:43Z","pushed_at":"2014-03-04T19:56:43Z","git_url":"git://github.com/distri/s3.git","ssh_url":"git@github.com:distri/s3.git","clone_url":"https://github.com/distri/s3.git","svn_url":"https://github.com/distri/s3","homepage":null,"size":0,"stargazers_count":0,"watchers_count":0,"language":null,"has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png","gravatar_id":null,"url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":2,"branch":"v0.1.0","publishBranch":"gh-pages"},"dependencies":{}},"sha1":{"source":{"LICENSE":{"path":"LICENSE","mode":"100644","content":"The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.","type":"blob"},"README.md":{"path":"README.md","mode":"100644","content":"sha1\n====\n\nSHA1 JS implementation\n","type":"blob"},"lib/crypto.js":{"path":"lib/crypto.js","mode":"100644","content":"/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\nvar CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty(\"init\")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty(\"toString\")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},\nn=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<\n32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,\n2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join(\"\")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error(\"Malformed UTF-8 data\");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},\nk=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){\"string\"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);\na._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,\nf)).finalize(b)}}});var s=p.algo={};return p}(Math);\n(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^\nk)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();\n\n/*\nCryptoJS v3.1.2\ncode.google.com/p/crypto-js\n(c) 2009-2013 by Jeff Mott. All rights reserved.\ncode.google.com/p/crypto-js/wiki/License\n*/\n(function(){if(\"function\"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,e=b.init;(b.init=function(a){a instanceof ArrayBuffer&&(a=new Uint8Array(a));if(a instanceof Int8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);if(a instanceof Uint8Array){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a[c]<<\n24-8*(c%4);e.call(this,d,b)}else e.apply(this,arguments)}).prototype=b}})();\n\nmodule.exports = CryptoJS;\n","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","mode":"100644","content":"SHA1\n====\n\nCurrently just exposing Crypto.js implementation.\n\n    module.exports = require(\"./lib/crypto\")\n","type":"blob"},"test/sha1.coffee":{"path":"test/sha1.coffee","mode":"100644","content":"CryptoJS = require \"../main\"\nSHA1 = CryptoJS.SHA1\n\ndescribe \"SHA1\", ->\n  it \"should hash stuff\", ->\n    sha = SHA1(\"\").toString()\n\n    assert sha\n\n  it \"should hash array buffers\", ->\n    arrayBuffer = new ArrayBuffer(0)\n\n    sha = SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString()\n\n    assert sha\n","type":"blob"},"pixie.cson":{"path":"pixie.cson","mode":"100644","content":"version: \"0.1.0\"\n","type":"blob"}},"distribution":{"lib/crypto":function(require, global, module, exports, PACKAGE) {
  /*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},
k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,
f)).finalize(b)}}});var s=p.algo={};return p}(Math);
(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^
k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){if("function"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,e=b.init;(b.init=function(a){a instanceof ArrayBuffer&&(a=new Uint8Array(a));if(a instanceof Int8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);if(a instanceof Uint8Array){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a[c]<<
24-8*(c%4);e.call(this,d,b)}else e.apply(this,arguments)}).prototype=b}})();

module.exports = CryptoJS;
;

  return module.exports;
},"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = require("./lib/crypto");

}).call(this);
;

  return module.exports;
},"test/sha1":function(require, global, module, exports, PACKAGE) {
  (function() {
  var CryptoJS, SHA1;

  CryptoJS = require("../main");

  SHA1 = CryptoJS.SHA1;

  describe("SHA1", function() {
    it("should hash stuff", function() {
      var sha;
      sha = SHA1("").toString();
      return assert(sha);
    });
    return it("should hash array buffers", function() {
      var arrayBuffer, sha;
      arrayBuffer = new ArrayBuffer(0);
      sha = SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString();
      return assert(sha);
    });
  });

}).call(this);
;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.1.0"};;

  return module.exports;
}},"progenitor":{"url":"http://strd6.github.io/editor/"},"version":"0.1.0","entryPoint":"main","repository":{"id":18529997,"name":"sha1","full_name":"distri/sha1","owner":{"login":"distri","id":6005125,"avatar_url":"https://avatars.githubusercontent.com/u/6005125?","gravatar_id":"192f3f168409e79c42107f081139d9f3","url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"private":false,"html_url":"https://github.com/distri/sha1","description":"SHA1 JS implementation","fork":false,"url":"https://api.github.com/repos/distri/sha1","forks_url":"https://api.github.com/repos/distri/sha1/forks","keys_url":"https://api.github.com/repos/distri/sha1/keys{/key_id}","collaborators_url":"https://api.github.com/repos/distri/sha1/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/distri/sha1/teams","hooks_url":"https://api.github.com/repos/distri/sha1/hooks","issue_events_url":"https://api.github.com/repos/distri/sha1/issues/events{/number}","events_url":"https://api.github.com/repos/distri/sha1/events","assignees_url":"https://api.github.com/repos/distri/sha1/assignees{/user}","branches_url":"https://api.github.com/repos/distri/sha1/branches{/branch}","tags_url":"https://api.github.com/repos/distri/sha1/tags","blobs_url":"https://api.github.com/repos/distri/sha1/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/distri/sha1/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/distri/sha1/git/refs{/sha}","trees_url":"https://api.github.com/repos/distri/sha1/git/trees{/sha}","statuses_url":"https://api.github.com/repos/distri/sha1/statuses/{sha}","languages_url":"https://api.github.com/repos/distri/sha1/languages","stargazers_url":"https://api.github.com/repos/distri/sha1/stargazers","contributors_url":"https://api.github.com/repos/distri/sha1/contributors","subscribers_url":"https://api.github.com/repos/distri/sha1/subscribers","subscription_url":"https://api.github.com/repos/distri/sha1/subscription","commits_url":"https://api.github.com/repos/distri/sha1/commits{/sha}","git_commits_url":"https://api.github.com/repos/distri/sha1/git/commits{/sha}","comments_url":"https://api.github.com/repos/distri/sha1/comments{/number}","issue_comment_url":"https://api.github.com/repos/distri/sha1/issues/comments/{number}","contents_url":"https://api.github.com/repos/distri/sha1/contents/{+path}","compare_url":"https://api.github.com/repos/distri/sha1/compare/{base}...{head}","merges_url":"https://api.github.com/repos/distri/sha1/merges","archive_url":"https://api.github.com/repos/distri/sha1/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/distri/sha1/downloads","issues_url":"https://api.github.com/repos/distri/sha1/issues{/number}","pulls_url":"https://api.github.com/repos/distri/sha1/pulls{/number}","milestones_url":"https://api.github.com/repos/distri/sha1/milestones{/number}","notifications_url":"https://api.github.com/repos/distri/sha1/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/distri/sha1/labels{/name}","releases_url":"https://api.github.com/repos/distri/sha1/releases{/id}","created_at":"2014-04-07T19:20:33Z","updated_at":"2014-04-07T19:20:33Z","pushed_at":"2014-04-07T19:20:33Z","git_url":"git://github.com/distri/sha1.git","ssh_url":"git@github.com:distri/sha1.git","clone_url":"https://github.com/distri/sha1.git","svn_url":"https://github.com/distri/sha1","homepage":null,"size":0,"stargazers_count":0,"watchers_count":0,"language":null,"has_issues":true,"has_downloads":true,"has_wiki":true,"forks_count":0,"mirror_url":null,"open_issues_count":0,"forks":0,"open_issues":0,"watchers":0,"default_branch":"master","master_branch":"master","permissions":{"admin":true,"push":true,"pull":true},"organization":{"login":"distri","id":6005125,"avatar_url":"https://avatars.githubusercontent.com/u/6005125?","gravatar_id":"192f3f168409e79c42107f081139d9f3","url":"https://api.github.com/users/distri","html_url":"https://github.com/distri","followers_url":"https://api.github.com/users/distri/followers","following_url":"https://api.github.com/users/distri/following{/other_user}","gists_url":"https://api.github.com/users/distri/gists{/gist_id}","starred_url":"https://api.github.com/users/distri/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/distri/subscriptions","organizations_url":"https://api.github.com/users/distri/orgs","repos_url":"https://api.github.com/users/distri/repos","events_url":"https://api.github.com/users/distri/events{/privacy}","received_events_url":"https://api.github.com/users/distri/received_events","type":"Organization","site_admin":false},"network_count":0,"subscribers_count":2,"branch":"v0.1.0","publishBranch":"gh-pages"},"dependencies":{}}}});