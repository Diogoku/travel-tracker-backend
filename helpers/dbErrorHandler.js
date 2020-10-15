"use strict";

/**
 * Get unique error field name
 */
const uniqueMessage = (error) => {
  let output;
  try {
    let fieldName = error.message.substring(
      error.message.lastIndexOf(".$") + 1,
      error.message.lastIndexOf("_1")
    );
    output = fieldName.slice(1) + " already exists";
  } catch (ex) {
    output = "Unique field already exists";
  }

  return output;
};

/**
 * Get the errorors message from error object
 */
export const errorHandler = (error) => {
  let message = "";

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message) {
        message = error.errorors[errorName].message;
      }
    }
  }
  return message;
};
