/**
 * 200 (QRCode)
 *
 * Usage:
 * return res.qrcode({
 *   type: 'png',
 *   level: 'M',
 *   margin: 1,
 *   url: 'ddd'
 * });
 */

'use strict';

var QRCode = require('qr-image');

module.exports = function qrcode(options) {
    var req = this.req,
        res = this.res;

    var defaults = {
            url: req.baseUrl + req.originalUrl,
            type: 'png',
            level: 'M',
            size: 10,
            sizeMax: 500,
            sizeMin: 1,
            margin: 1,
            marginMax: 20,
            marginMin: 1,
        },
        _typeArray = [
            'png',
            'svg',
            'eps',
            'pdf'
        ],
        _levelArray = [
            'L',
            'M',
            'Q',
            'H'
        ],
        _typeMap = {
            'png': 'image/png',
            'svg': 'image/svg+xml',
            'eps': 'application/postscript',
            'pdf': 'application/pdf',
        };

    options = req.query || {};

    sails.log.debug('LinkController qrcode options = ', options);
    options =  _.extend( _.clone(defaults), options);

    // busines logic
    // size
    options.size = (isNaN(options.size)) ? defaults.size : parseInt(options.size, 10);
    options.size = (options.size > defaults.sizeMax) ?  defaults.sizeMax : options.size;
    options.size = (options.size < defaults.sizeMin) ?  defaults.sizeMin : options.size;

    // margin
    options.margin = (isNaN(options.margin)) ? defaults.margin : parseInt(options.margin, 10);
    options.margin = (options.margin > defaults.marginMax) ?  defaults.marginMax : options.margin;
    options.margin = (options.margin < defaults.marginMin) ?  defaults.marginMin : options.margin;

    // type
    options.type = (typeof(options.type) === 'string') ? options.type : defaults.type;
    options.type = options.type.toLowerCase();
    options.type = (_typeArray.indexOf(options.type) < 0) ? defaults.type : options.type;

    // level
    options.level = (typeof(options.level) === 'string') ? options.level : defaults.level;
    options.level = options.level.toUpperCase();
    options.level = (_levelArray.indexOf(options.level) < 0) ? defaults.level : options.level;

    // url
    options.url = options.url + '';
    options.url = (options.url.match(/^(http|https)\:\/\//i)) ? options.url : 'http://' + options.url;

    sails.log.debug('LinkController qrcode options = ', options);

    // setup response header
    res.set({
        'Content-Type': _typeMap[options.type]
    });

    return QRCode.image( options.url, {
        // png, svg, eps, pdf
        type: options.type,

        // error correction level. One of L, M, Q, H. Default M.
        ec_level: options.level,

        // size (only png) — size of one module in pixels. Default 5.
        // 1 = 30px
        size: options.size,

        // margin (only png) — white space around QR image in modules. Default 4.
        // border size: 1 = 10px (total is 20px)
        margin: options.margin,

        // customize (only png) — function to customize qr bitmap before encoding to PNG
        // customize: 'PNG'
    }).pipe(res);
};
