/**
 * LinkController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

'use strict';

var UAParser = require('ua-parser-js');

module.exports = {
    get: function(req, res) {
        sails.log.info('LinkController find begin');

        var _id = req.param('id'),
            query = function(id){
                if(!id) {
                    return Link.find({}).limit(100);
                }

                var isMongoId = (id.match(/^[0-9a-fA-F]{24}$/)) ? true : false;
                sails.log.debug('isMongoId = ', isMongoId);
                if(isMongoId) {
                    return Link.findOne(id);
                }else{
                    return Link.findOne({ name: id});
                }
            },
            uaParse = function(useragent) {
                /**
                 * {
                 *      chrome: false,
                 *      firefox: false,
                 *      ie: false,
                 *      mobile_safari: true,
                 *      mozilla: false,
                 *      opera: false,
                 *      safari: true,
                 *      webkit: true,
                 *      android: false,
                 *      version: '537.51.2'
                 *  }
                 *
                 */
                // var _ua = Useragent.is(useragent),
                //     result = 'default';
                // sails.log.debug('LinkController find _ua = ', _ua);

                /**
                 * {
                 *     ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D201 Safari/9537.53',
                 *     browser: { name: 'Mobile Safari', version: '7.0', major: '7' },
                 *     engine: { name: 'WebKit', version: '537.51.2' },
                 *     os: { name: 'iOS', version: '7.1.1' },
                 *     device: { model: 'iPhone', vendor: 'Apple', type: 'mobile' },
                 *     cpu: { architecture: undefined }
                 *  }
                 *
                 */
                var _ua = new UAParser().setUA(useragent).getResult(),
                    platform = 'default';
                sails.log.debug('LinkController find useragent = ', useragent);

                if(_ua.device.type) {
                    // is mobile
                    platform = 'mobile-all';

                    if(_ua.os.name.match(/ios/i)) {
                        // ios
                        platform = 'mobile-ios';

                        if(_ua.device.type.match(/mobile/i)) {
                            //iphone
                            platform = 'mobile-ios-phone';
                        }else if(_ua.device.type.match(/(pad|table)/i)){
                            // ipad
                            platform = 'mobile-ios-pad';
                        }
                    }else if(_ua.os.name.match(/android/i)){
                        // android
                        platform = 'mobile-android';

                        if(_ua.device.type.match(/mobile/i)) {
                            // phone
                            platform = 'mobile-android-phone';
                        }else if(_ua.device.type.match(/(pad|table)/i)){
                            // pad
                            platform = 'mobile-android-pad';
                        }
                    }else if(_ua.os.name.match(/windows/i)){
                        // windows phone
                        platform = 'mobile-windows';

                        if(_ua.device.type.match(/mobile/i)) {
                            // phone
                            platform = 'mobile-android-phone';
                        }else if(_ua.device.type.match(/(pad|table)/i)){
                            // pad
                            platform = 'mobile-android-pad';
                        }
                    }else{
                        // other os
                    }
                }else{
                    // is Desktop
                    platform = 'desktop-all';

                    if(_ua.os.name.match(/windows/i)) {
                        // windows
                        platform = 'desktop-windows';
                    }else if(_ua.os.name.match(/mac/i)) {
                        // mac
                        platform = 'desktop-mac';
                    }else if(_ua.os.name.match(/linux/i)) {
                        // linux
                        platform = 'desktop-linux';
                    }else{
                        // other os
                    }
                }

                return platform;
            };

        sails.log.debug('LinkController find _id = ', _id);
        sails.log.debug('LinkController find req user-agent = ', req.headers['user-agent']);


        uaParse(req.headers['user-agent']);

        query(_id).then(function(link){
            sails.log.debug('LinkController find link = ', typeof(link), link);

            if(!link) {
                return res.json({
                    message: 'Can not find this link: ' + _id
                });
            }

            var _ua = uaParse(req.headers['user-agent']),
                _link = link.urls['default'];
            sails.log.debug('parse UA = ', _ua);

            if(_ua.match(/^desktop/i)) {
                // desktop
                if((link.urls[_ua])) {
                    // get platform
                    _link = link.urls[_ua];
                }else if(link.urls['desktop-all']){
                    // platform all
                    _link = link.urls['desktop-all'];
                }
            }else if(_ua.match(/^mobile/i)){
                // mobile
                if((link.urls[_ua])) {
                    // get device
                    _link = link.urls[_ua];
                }else{
                    // get os
                    _ua = _ua.replace(/\-(phone|pad)/i, '');
                    if(link.urls[_ua]){
                        // get os
                        _link = link.urls[_ua];
                    }else if(link.urls['mobile-all']){
                        // get os
                        _link = link.urls['mobile-all'];
                    }
                }
            }

            sails.log.debug('Final link = ', _link);

            return res.redirect(_link);
        }).fail(function(err){
            return res.json(err);
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
