S3 Clip
=======

Clip images to an S3 bucket.

    console.log "Running"

    require "jquery"
    global.$ = jQuery

    S3Trinket = require "s3-trinket"

    chrome.contextMenus.create
      title: "Send to S3"
      contexts: ["image"]
      onclick: ({srcUrl}) ->
        uploadToS3(srcUrl)
    , ->
      if error = chrome.runtime.lastError
        console.error error
      else
        console.log "Created!"

    uploadToS3 = (imageUrl) ->
      console.log "getting image data for #{imageUrl}"
      getImageBlob imageUrl, (blob) ->
          console.log "fetching s3 upload policy"
          chrome.storage.sync.get "S3_POLICY", ({S3_POLICY}) ->
            trinket = S3Trinket(S3_POLICY)

            console.log "uploading to S3"
            trinket.post blob
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
      chrome.storage.sync.set
        S3_POLICY: policyData
