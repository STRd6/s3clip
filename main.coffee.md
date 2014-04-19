S3 Clip
=======

Clip images to an S3 bucket.

    chrome.contextMenus.create 
      title: "Send to S3"
      contexts:["image"]
      onclick: (info) ->
        console.log info
        alert "yolo"
