const ResponseService = {

  createErrorResponse  (error, statusCode) {
      return {
        statusCode: statusCode || 501,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Date: new Date()
        },
        body: JSON.stringify({success: false, error: ResponseService.strErrorMessage(error)})
      }
    },
    createSuccessResponse (payload, statusCode) {
      return {
        statusCode: statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Date: new Date()
        },
        body:  JSON.stringify({ success: true  })
      }
    },
    createSuccessPayloadResponse (payload, statusCode) {
      return {
        statusCode: statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Date: new Date()
        },
        body:  JSON.stringify({response: payload, success: true  })
      }
    },
    strErrorMessage (error) {
      if (Array.isArray(error)) { return error.map(e => e.message.concat(e.dataPath ? e.dataPath : '')).join('\n') }
      return error.message
    }
  
  }
  
  module.exports = ResponseService