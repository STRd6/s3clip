S3 Clip
=======

Clip images to an S3 bucket.

    console.log "Running"

    chrome.runtime.onInstalled.addListener ->

      chrome.contextMenus.create
        id: "send"
        title: "Send to S3"
        contexts: ["image"]
      , ->
        if error = chrome.runtime.lastError
          console.error error
        else
          console.log "Created!"

      chrome.contextMenus.onClicked.addListener (data) ->
        console.log data
