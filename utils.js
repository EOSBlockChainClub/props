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