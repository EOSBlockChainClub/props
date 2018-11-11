import {generateUuidV4} from './uuidGenerator';

export function isNullOrEmpty (obj) {
    if (obj === undefined) {
      return true;
    }
    if (obj === null) {
      return true;
    }
    //Check for an empty array too
    if (obj.hasOwnProperty('length')) {
      if (obj.length === 0) {
        return true;
      }
    }
    return (Object.keys(obj).length === 0 && obj.constructor === Object);
  }

export function now() {
    return new Date().toISOString();
}

  //if traceOnly is true, then this log entry is only created when TRACING_ENABLED (in env) is set to true
export function log(message, data, error, traceOnly = false) {
    //handle error object
    let err = (error) ? ` - Error: ${error}` : ``;
    let dataString = (data) ? JSON.stringify(data) : '';
    //construct message
    let logMessage = `${message}${dataString}${err}\n`;
    let localLogMessage = `${now()} -${logMessage}`;
    console.log(localLogMessage);
}

// Returns Null if parse fails
export function tryParseJSON (jsonString, unescape = false, skipQuoteReplace = false) {
    let doubleQuotes = '';
    if (!jsonString || !isAString(jsonString) || jsonString.trim() == '') return null;
    try {
      if (unescape) {
        jsonString = decodeURI(jsonString);
      }
      doubleQuotes = jsonString;
      if (skipQuoteReplace !== true) {
        doubleQuotes = jsonString.replaceAll('\'', '"');
        doubleQuotes = doubleQuotes.replaceAll('`', '"');
      }
      let o = JSON.parse(doubleQuotes);
      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object",
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === 'object') {
        return o;
      }
    }
    catch (e) {
      logTrace(`error parsing JSON`, {jsonString, doubleQuotes, e});
    }
  
    return null;
  
  }

  export const copyObject = (source) => {
    let result = {};
    Object.assign(result, source);
    return result;
  };

  export const seperateGraphqlArgs = (allArgs, modelArgNamesArray) => {
    let parentArgs = copyObject(allArgs);
    let submodelArgs = {};
    modelArgNamesArray.forEach(argName => {
      if (allArgs[argName]) {
        submodelArgs[argName] = allArgs[argName];
        delete parentArgs[argName];
      }
    });
    //Return null if no submodelArgs
    if (Object.keys(submodelArgs).length == 0) {
      submodelArgs = null;
    }
  
    return {parentArgs, submodelArgs};
  };

  export function createGuid () {
    return generateUuidV4();
  }

