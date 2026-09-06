const cloudinary = require("cloudinary").v2;

/**
 * cloudinary upload params.
 * cloudinary will generate either a public_id automatically if none is passed during upload
 * @param {string} file - image file will be a base 64 encoded object
 * @param {string} public_id - can be provided by cloudinary on upload or you can upload yours. it's optional.
 * @param {string} overwrite - optional. overrides a pre-existing file with the same id with the new file if set to true
 * @param {string} invalidate- optional. invalidates the old file. if set to true
 * @returns {promise} resolves with both error and success. error will be handled in where the code will be used
 */

exports.upload = (file, public_id, overwrite, invalidate) => {
  console.log("file is ", file);
  return new Promise((resolve) => {
    // resolve everything and capture the error where the code is called
    cloudinary.uploader.upload(
      file,
      { resource_type: "image", public_id: "qwerty", overwrite, invalidate,  },
      (error, result) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
};

// module.exports = upload;
