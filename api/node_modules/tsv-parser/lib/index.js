'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.getAndParse = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _rxjs = require('rxjs');

var Rx = _interopRequireWildcard(_rxjs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1Bw7xBeaavCkQHjsciGovUZwOFZQuE4h-Hj4MCO5pY-Dl3fqiHpP9M0KavP_6gvf9uuBDcH1y-SFq/pub?gid=0&single=true&output=tsv'

var getAndParse = function getAndParse(url) {
  return Rx.Observable.create(function (obs) {
    (0, _request2.default)({
      url: url,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }, function (e, r, b) {
      if (e) return obs.error(e);
      obs.next(parse(b));
      obs.complete();
    });
  });
};

var parse = function parse(tsv) {
  return tsv.split('\r\n').map(function (row) {
    return row.split('\t');
  }).map(_objWithFirstAsHeader).slice(1);
};

var _objWithFirstAsHeader = function _objWithFirstAsHeader(rowAry) {
  _objWithFirstAsHeader.header = _objWithFirstAsHeader.header || rowAry;
  return rowAry.reduce(function (p, c, i) {
    return _extends(_defineProperty({}, _objWithFirstAsHeader.header[i], c), p);
  }, {});
};

exports.getAndParse = getAndParse;
exports.parse = parse;