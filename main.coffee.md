S3 Clip
=======

Clip images to an S3 bucket.

    console.log "Running"

    S3 = require "s3"

    chrome.contextMenus.create
      title: "Send to S3"
      contexts: ["image"]
      onclick: ({srcUrl}) ->
        console.log arguments
        alert "yolo"
    , ->
      if error = chrome.runtime.lastError
        console.error error
      else
        console.log "Created!"

    uploadToS3 = (imageUrl) ->
      getImageBlob imageUrl, (blob) ->
        chrome.storage.sync.get (policyData) ->
          uploader = S3.uploader(policyData)
          uploader.upload
            key: "uploads/#{imageUrl}"
            blob: blob
      , (error) ->
        console.error error

    getImageBlob = (url, success, error) ->
      xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.responseType = 'blob'
      xhr.onload = (e) ->
        success @response
      xhr.onerror = error

      xhr.send()

    global.setPolicy = (policyData) ->
      chrome.storage.sync.set policyData
