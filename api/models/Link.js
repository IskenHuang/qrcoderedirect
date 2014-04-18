/**
* Link.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*
*  Callbacks run on Create
*  - beforeValidation / *fn(values, cb)*
*  - beforeCreate / *fn(values, cb)*
*  - afterCreate / *fn(newlyInsertedRecord, cb)*
*
*  Callbacks run on Update:
*  - beforeValidation / *fn(valuesToUpdate, cb)*
*  - beforeUpdate / *fn(valuesToUpdate, cb)*
*  - afterUpdate / *fn(updatedRecord, cb)*
*
*  Callbacks run on Destroy:
*  - beforeDestroy / *fn(criteria, cb)*
*  - afterDestroy / *fn(cb)*
*/

module.exports = {

    attributes: {
        name: {
            type: 'string',
            defaultsTo: '',
            required: true,
            // maxLength: 20,
            // minLength: 5
        },
        url: {
            type: 'json',
            defaultsTo: {},
            required: true,
            // maxLength: 20,
            // minLength: 5
        }
    },

    beforeValidation: function(link, cb) {
        sails.log.info('LinkModel beforeValidation link = ', link);

        cb(null, link);
    },
};

