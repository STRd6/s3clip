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
})({"source":{"LICENSE":{"path":"LICENSE","content":"The MIT License (MIT)\n\nCopyright (c) 2014 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.","mode":"100644","type":"blob"},"README.md":{"path":"README.md","content":"s3clip\n======\n\nCopy images to S3\n","mode":"100644","type":"blob"},"main.coffee.md":{"path":"main.coffee.md","content":"S3 Clip\n=======\n\nClip images to an S3 bucket.\n\n    console.log \"Running\"\n\n    chrome.runtime.onInstalled.addListener ->\n\n      chrome.contextMenus.create\n        id: \"send\"\n        title: \"Send to S3\"\n        contexts: [\"image\"]\n      , ->\n        if error = chrome.runtime.lastError\n          console.error error\n        else\n          console.log \"Created!\"\n\n      chrome.contextMenus.onClicked.addListener (data) ->\n        console.log data\n","mode":"100644","type":"blob"},"pixie.cson":{"path":"pixie.cson","content":"author: \"STRd6\"\nname: \"S3 Clip\"\ndescription: \"Clip images to S3\"\nversion: \"0.1.0\"\nmanifest_version: 2\napp:\n  background:\n    scripts: [\"app.js\"] # This is a special hack to make the main entry point be a background app\npermissions: [\n  \"<all_urls>\"\n  \"contextMenus\"\n]\n","mode":"100644","type":"blob"}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  console.log("Running");

  chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      id: "send",
      title: "Send to S3",
      contexts: ["image"]
    }, function() {
      var error;
      if (error = chrome.runtime.lastError) {
        return console.error(error);
      } else {
        return console.log("Created!");
      }
    });
    return chrome.contextMenus.onClicked.addListener(function(data) {
      return console.log(data);
    });
  });

}).call(this);
;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"author":"STRd6","name":"S3 Clip","description":"Clip images to S3","version":"0.1.0","manifest_version":2,"app":{"background":{"scripts":["app.js"]}},"permissions":["<all_urls>","contextMenus"]};;

  return module.exports;
}},"progenitor":{"url":"http://www.danielx.net/editor/"},"version":"0.1.0","entryPoint":"main","remoteDependencies":undefined,"repository":{"branch":"master","default_branch":"master","full_name":"STRd6/s3clip","homepage":null,"description":"Copy images to S3","html_url":"https://github.com/STRd6/s3clip","url":"https://api.github.com/repos/STRd6/s3clip","publishBranch":"gh-pages"},"dependencies":{}});