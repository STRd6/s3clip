Get the SHA1 hash of a blob
===========================

    {SHA1} = require "sha1"

    module.exports = (blob, fn) ->
      blobTypedArray blob, (arrayBuffer) ->
        fn(SHA1(CryptoJS.lib.WordArray.create(arrayBuffer)).toString())

    blobTypedArray = (blob, fn) ->
      reader = new FileReader()

      reader.onloadend = ->
        fn(reader.result)

      reader.readAsArrayBuffer(blob)
