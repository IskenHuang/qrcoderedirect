/**
 * LinkController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

'use strict';

module.exports = {
    find: function(req, res) {
        sails.log.info('LinkController find begin');

        var _id = req.params('id'),
            query = function(id){
                var isMongoId = (id.match(/^[0-9a-fA-F]{24}$/)) ? true : false;
                if(isMongoId) {
                    return Link.findOne(id);
                }else{
                    return Link.findOne({ name: id});
                }
            };

        query(_id).done(function(err, link){
            if(err) {
                return res.json();
            }

            return req.qrcode(link);
        });
    },

    qrcode: function(req, res) {
        sails.log.info('LinkController qrcode begin');

        return res.qrcode({});
    },

    edit: function(req, res) {
        sails.log.info('LinkController edit begin');

        res.json({});
    },

    delete: function(req, res) {
        sails.log.info('LinkController delete begin');

        res.json({});
    },

    new: function(req, res) {
        sails.log.info('LinkController new begin');

        res.json({});
    },
};
