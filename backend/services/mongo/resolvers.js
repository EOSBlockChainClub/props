import _ from 'lodash';
import {copyObject, createGuid, isNullOrEmpty, log, now, tryParseJSON} from '../../../utils';
import settings from '../../env.json';

var mongoTimeout = settings.MONGO_TIMEOUT;

const handleMongoError = (error, reject, message) => {
  const errorMessage = error || message;
  log(`MongoDB error`, {errorMessage});
  reject(`MongoDB error: ${errorMessage}`);
};

export async function aggregateMongo (context, MongoObject, aggregation) {
  return new Promise((resolve, reject) => {
    setTimeout(() => handleMongoTimeout(reject), mongoTimeout);
    MongoObject.aggregate(aggregation,
      (err, result) => {
        if (err) {
          handleMongoError(err, reject);
        }
        else {
          resolve(result);
        }
      });
  });
}

export async function deleteMongo (args, context, MongoObject) {
  //TODO: Limit by logged-in userId
  return new Promise((resolve, reject) => {
    let {argsOptions, argsFiltered} = argsToMongoOptions(args);
    argsOptions = argsOptions || {};
    setTimeout(() => handleMongoTimeout(reject), mongoTimeout);
    MongoObject.findOneAndRemove(argsFiltered, (err, result) => {
      if (err) {
        handleMongoError(err, reject);
      }
      else {
        if (result) {
          resolve( {success: true,  modifiedCount: 1} );
        }
        else {
          resolve( {success: false, modifiedCount: 0} );
        }
      }
    });
  });
}

export async function findMongo (args, context, MongoObject, searchableFields, withCount = false) {
  return new Promise((resolve, reject) => {
    var {argsOptions, argsFiltered} = argsToMongoOptions(args);
    argsFiltered = convertSelectedArgsToSearchableWildcards(argsFiltered, searchableFields); //convert some fields into wildcard searches
    argsOptions = argsOptions || {};
    log(`findMongo`, {argsOptions, argsFiltered});
    setTimeout(() => handleMongoTimeout(reject), mongoTimeout);
    MongoObject
    .find(argsFiltered)
    .select(argsOptions.select)
    .skip(argsOptions.skip)
    .limit(argsOptions.limit)
    .sort(argsOptions.sort)// example: { 'age' : -1, 'posts': 1 }    -- NOTE: Must include quotes around fields names and curly brackets around edge
    .then(data => {
      if (withCount === true) {
        MongoObject.find(argsFiltered).count().then(r => {
          resolve([data, r]);
        });
      } else {
        resolve(data);
      }
    })
    .catch(error => {
      handleMongoError(error, reject);
    });
  });
}

// use the ResultInt graphql type as the return type for this count
export async function countMongo (args, context, MongoObject) {
  //TODO: Limit by logged-in userId
  return new Promise((resolve, reject) => {
    var {argsOptions, argsFiltered} = argsToMongoOptions(args);// remove any non-fields
    setTimeout(() => handleMongoTimeout(reject), mongoTimeout);
    MongoObject.count(argsFiltered).then(data => {
      log(`countMongo`, {data});
      resolve(data);
    }).catch(error => {
      handleMongoError(error, reject);
    });
  });
}

export async function findOneMongo (context, MongoObject, args, searchableFields) {
  return new Promise((resolve, reject) => {
    var {argsOptions, argsFiltered} = argsToMongoOptions(args);// trims options from args
    argsFiltered = convertSelectedArgsToSearchableWildcards(argsFiltered, searchableFields);// convert some fields into wildcard searches
    log(`findOneMongo`, {argsOptions, argsFiltered});
    setTimeout(() => handleMongoTimeout(reject), mongoTimeout);
    MongoObject.findOne(argsFiltered).select(argsOptions.select).then(data => {
      resolve(data);
    }).catch(error => {
      handleMongoError(error, reject);
    });
  });
}

// find all records that have an _id that is present in the passed-in array
export async function inMongo (context, MongoObject, valuesArray) {
  //TODO: Limit by logged-in userId
  return new Promise((resolve, reject) => {
    setTimeout(() => handleMongoTimeout(reject), mongoTimeout);
    (MongoObject.find()).in('_id', valuesArray).then(data => {
      log(`inMongo`,{data});
      resolve(data);
    }).catch(error => {
      handleMongoError(error, reject);
    });
  });
}

export async function updateMongo (context, MongoObject, args) {
  const recordId = args._id;
  delete args['_id'];
  // removed _id field from args to update
  return new Promise((resolve, reject) => {
    setTimeout(() => handleMongoTimeout(reject), mongoTimeout);
    MongoObject.update({_id: recordId}, args, {multi: false}).then(response => {
      resolve({success: response.ok, modifiedCount: response.nModified});
    }).catch(error => {
      log(`There was an error updating the object (updateMongo)`,{}, error);
      handleMongoError(error, reject);
    });
  });
}

export async function upsertMongo (context, MongoObject, newItem, returnUpdatedItem = false, mergeFieldsWithExistingObject = false) {
  // TODO: Add userId
  const userId = ''; 
  return new Promise((resolve, reject) => {
    if (!newItem) {
      handleMongoError(null, reject, 'Error at upsertMongo : new object missing or not valid');
    }
    newItem.updatedBy = userId;
    newItem.updatedOn = now();
    if (!newItem._id) {
      newItem.createdBy = userId;
      newItem.createdOn = now();
    }

    log(`upsertMongo new upserted record`, {newItem});
    setTimeout(() => handleMongoTimeout(reject), mongoTimeout);
    let recordToUpdateIdFilter = (newItem._id) ? {_id: newItem._id} : {_id: createGuid()}; // if new record doesn't have an id, generate a guid

    const afterUpdate = (response) => {
      let newRecordId = (response.upserted && response.upserted.length > 0) ? response.upserted[0]._id : null;
      let returnVals = {success: response.ok, modifiedCount: response.nModified, _id: newRecordId};
      if (!returnUpdatedItem || returnVals.success !== response.ok) {
        return resolve(returnVals);
      } else { // get the updated row and add it to response (if requested)
        findOneMongo(
          context,
          MongoObject, {_id: newRecordId}
        ).then(updatedItem => {
          returnVals.updatedItem = updatedItem;
          return resolve(returnVals);
        }).catch(error => {
          handleMongoError(error, reject);
        });
      }
    };

    // replaceOne replaces the existing record with the passed-in object
    // updateOne updates just the fields in the incmoming object
    if (mergeFieldsWithExistingObject === false) {
      MongoObject.replaceOne(
        recordToUpdateIdFilter,
        newItem,
        {upsert: true, overwrite: true, new: true}
      ).then(afterUpdate).catch(error => {
        handleMongoError(error, reject);
      });
    }
    else {
      MongoObject.updateOne(
        recordToUpdateIdFilter,
        newItem,
        {upsert: true, new: true}
      ).then(afterUpdate).catch(error => {
        handleMongoError(error, reject);
      });
    }

  });
}

export function handleMongoTimeout (reject) {
  reject(`MongoDB timeout when fetching from MongoDB (timeout is ${mongoTimeout}ms)`);
}

// This function limits mongo keywords that can be passed in args to: sort, limit, select, skip
// ...not all mongo options which are... ['tailable', 'sort', 'limit', 'skip', 'maxScan', 'maxTime','batchSize', 'comment', 'snapshot', 'hint', 'slaveOk', 'safe', 'collection']
export function argsToMongoOptions (args) {
  if (!args) {
    return {options: null, args: null};
  }
  var argsFiltered = copyObject(args);
  const {sort, limit, skip, select} = args;

  const argsOptions = {
    sort: tryParseJSON(sort) || sort,
    limit: limit || null,
    select: select || null,
    skip: skip || 0
  };

  if ('sort' in argsFiltered) delete argsFiltered['sort'];
  if ('limit' in argsFiltered) delete argsFiltered['limit'];
  if ('select' in argsFiltered) delete argsFiltered['select'];
  if ('skip' in argsFiltered) delete argsFiltered['skip'];

  return ({argsOptions, argsFiltered});
}

export async function getIdsMatchingArgs (args, context, modelType, selectFieldsClause = {'_id': 1}) {

  return new Promise((resolve, reject) => {
    var newArgs = copyObject(args);
    Object.assign(newArgs, {select: selectFieldsClause}); // Only return the _id fields
    return findMongo(newArgs, context, modelType).then(results => {
      const resultsIds = results.map(r => r._id);
      resolve(resultsIds);
    }).catch(error => reject(error));
  });
}

// convert a start and end date string set to mongo argument
// update the params set as needed
export function convertArgsForDateParams (args, dateParamName, dateStartParamName, dateEndParamName) {

  if (!args[dateStartParamName] && !args[dateEndParamName]) return args;
  const startDate = Date.parse(args[dateStartParamName]);
  const endDate = Date.parse(args[dateEndParamName]);
  var dateArg = {};
  if (startDate) {
    dateArg.$gte = startDate;
    delete args[dateStartParamName];
  }
  if (endDate) {
    dateArg.$lte = endDate;
    delete args[dateEndParamName];
  }

  if (!isNullOrEmpty(dateArg)) {
    args[dateParamName] = dateArg; // e.g. {dateUpdate : {"$gte":"2017-06-30T11:11:00.000Z","$lte":"2017-07-02T11:11:00.000Z"}}
  }

  return args;
}

// Create a date range parameter set using $gte and $lte
export function constructMongoDateRangeCondition (dateStart, dateEnd) {
  if (!dateStart && !dateEnd) return null;
  const startDate = Date.parse(dateStart);
  const endDate = Date.parse(dateEnd);
  var dateArgs = {};
  if (startDate) {
    dateArgs.$gte = startDate;
  }
  if (endDate) {
    dateArgs.$lte = endDate;
  }

  return dateArgs; // e.g.  {"$gte":"2017-06-30T11:11:00.000Z","$lte":"2017-07-02T11:11:00.000Z"}
}

// Converts arguments for a selected set of fields (searchFields)
// into wildcard enabled search values e.g. converts 'myname' into   {'$regex' : `^myname$`, '$options': 'i'}
// fields can limit search to start of field (startsWith) or anywhere in field (wild) Example: {startWith:['name'], wild:['description']}
// Returns the updated args
// Note: {startsWith:['name'], wild:['description']}
export function convertSelectedArgsToSearchableWildcards (args, searchFields) {
  if (isNullOrEmpty(searchFields)) {
    return args;
  }
  var updatedArgs = copyObject(args);
  if (searchFields.startsWith) {
    searchFields.startsWith.forEach(field => {
      if (field in updatedArgs) {
        updatedArgs[field] = {'$regex': `^${updatedArgs[field]}`, '$options': 'i'};
      }
    });
  }
  if (searchFields.wild) {
    searchFields.wild.forEach(field => {
      if (field in updatedArgs) {
        updatedArgs[field] = {'$regex': `${updatedArgs[field]}`, '$options': 'i'};
      }
    });
  }

  return updatedArgs;
}
