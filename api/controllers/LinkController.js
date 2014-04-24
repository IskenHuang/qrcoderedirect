/**
 * LinkController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

'use strict';

module.exports = {
    get: function(req, res) {
        sails.log.info('LinkController find begin');

        var _id = req.param('id'),
            query = function(id){
                if(!id) {
                    return Link.find({}).limit(100);
                }

                var isMongoId = (id.match(/^[0-9a-fA-F]{24}$/)) ? true : false;
                if(isMongoId) {
                    return Link.findOne(id);
                }else{
                    return Link.findOne({ name: id});
                }
            };

        sails.log.debug('LinkController find _id = ', _id);

        query(_id).done(function(err, link){
            if(err) {
                return res.json(err);
            }
            sails.log.debug('LinkController find link = ', typeof(link), link);

            if(!link) {
                return res.json({
                    message: 'Can not find this link: ' + _id
                });
            }

            if(_.isArray(link)) {
                return res.json(link);
            }

            return res.qrcode(link);
        });
    },

    qrcode: function(req, res) {
        sails.log.info('LinkController qrcode begin');

        return res.qrcode(req.query);
    },

    edit: function(req, res) {
        sails.log.info('LinkController edit begin');

        var _id = req.param('id'),
            query = function(id){
                if(!id) {
                    return Link.find({}).limit(100);
                }

                var isMongoId = (id.match(/^[0-9a-fA-F]{24}$/)) ? true : false;
                if(isMongoId) {
                    return Link.findOne(id);
                }else{
                    return Link.findOne({ name: id});
                }
            };

        sails.log.debug('LinkController find _id = ', _id);

        query(_id).done(function(err, link){
            if(err) {
                return res.json(err);
            }
            sails.log.debug('LinkController find link = ', typeof(link), link);

            if(!link) {
                return res.json({
                    message: 'Can not find this link: ' + _id
                });
            }

            var l10n = res.getCatalog()[res.getLocale()],
                _platforms = [];

            for(var i in l10n) {
                if(i.indexOf('url-') >= 0 && i.length > 4){
                    _platforms.push(i);
                }
            }

            return res.view('edit.ejs', {
                layout: true,
                link: link,
                platforms: _platforms
            });
        });
    },

    remove: function(req, res) {
        sails.log.info('LinkController remove begin');

        var _id = req.param('id'),
            query = function(id){
                if(!id) {
                    return Link.find({}).limit(100);
                }

                var isMongoId = (id.match(/^[0-9a-fA-F]{24}$/)) ? true : false;
                if(isMongoId) {
                    return Link.findOne(id);
                }else{
                    return Link.findOne({ name: id});
                }
            };

        sails.log.debug('LinkController find _id = ', _id);

        query(_id).done(function(err, link){
            if(err) {
                return res.json(err);
            }
            sails.log.debug('LinkController find link = ', typeof(link), link);

            if(!link) {
                return res.json({
                    message: 'Can not find this link: ' + _id
                });
            }

            return res.view('remove.ejs', {
                layout: true,
                link: link,
            });
        });
    },

    new: function(req, res) {
        sails.log.info('LinkController new begin');

        var l10n = res.getCatalog()[res.getLocale()],
            _platforms = [];

        for(var i in l10n) {
            if(i.indexOf('url-') >= 0 && i.length > 4){
                _platforms.push(i);
            }
        }

        return res.view('new.ejs', {
            layout: true,
            title: res.i18n('new'),
            platforms: _platforms
        });
    },
};
