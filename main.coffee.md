S3 Clip
=======

Clip images to an S3 bucket.

    console.log "Running"

    S3 = require "s3"
    SHA1 = require "./lib/blob_sha"

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
        SHA1 blob, (sha) ->
          console.log "fetching s3 upload policy"
          chrome.storage.sync.get (policyData) ->
            uploader = S3.uploader(policyData)
            key = "uploads/#{sha}"
            console.log "uploading #{key} to S3"
            uploader.upload
              key: key
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
