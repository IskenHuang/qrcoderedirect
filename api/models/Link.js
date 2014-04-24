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
            unique: true,
            required: true,
            // maxLength: 20,
            // minLength: 5
        },
        urls: {
            type: 'json',
            defaultsTo: {},
            required: true,
            // maxLength: 20,
            // minLength: 5
        }
    },

    beforeValidation: function(link, cb) {
        sails.log.info('LinkModel beforeValidation link = ', link);

        var _urls = {};

        for(var i in link) {
            if(i.indexOf('url-') >= 0) {
                var _i = i.replace(/url\-/i, '');
                _urls[_i] = link[i];

                delete link[i];
            }
        }

        link.urls = _urls;
        sails.log.info('LinkModel beforeValidation link 2 = ', link);
        cb(null, link);
    },

    beforeCreate: function(link, cb) {
        sails.log.info('LinkModel beforeCreate link = ', link);

        var _urls = {};

        for(var i in link) {
            if(i.indexOf('url-') >= 0) {
                var _i = i.replace(/url\-/i, '');
                _urls[_i] = link[i];

                delete link[i];
            }
        }

        link.urls = _urls;

        delete link._csrf;

        sails.log.info('LinkModel beforeCreate link 2 = ', link);
        cb(null, link);
    },

    beforeUpdate: function(link, cb) {
        sails.log.info('LinkModel beforeUpdate link = ', link);

        var _urls = {};

        for(var i in link) {
            if(i.indexOf('url-') >= 0) {
                var _i = i.replace(/url\-/i, '');
                _urls[_i] = link[i];

                delete link[i];
            }
        }

        link.urls = _urls;

        delete link._csrf;

        sails.log.info('LinkModel beforeUpdate link 2 = ', link);
        cb(null, link);
    },
};

