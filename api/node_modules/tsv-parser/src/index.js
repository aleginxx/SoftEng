import request from 'request'
import * as Rx from 'rxjs'
// const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1Bw7xBeaavCkQHjsciGovUZwOFZQuE4h-Hj4MCO5pY-Dl3fqiHpP9M0KavP_6gvf9uuBDcH1y-SFq/pub?gid=0&single=true&output=tsv'

const getAndParse = (url) => {
  return Rx.Observable.create(obs => {
    request({
      url,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }, (e, r, b) => {
      if (e)
        return obs.error(e)
      obs.next(parse(b))
      obs.complete()
    })
  })
}

const parse = (tsv) => {
  return tsv.split('\r\n').map(row => row.split('\t')).map(_objWithFirstAsHeader).slice(1)
}

const _objWithFirstAsHeader = (rowAry) => {
  _objWithFirstAsHeader.header = _objWithFirstAsHeader.header || rowAry
  return rowAry.reduce((p, c, i) => ({ [_objWithFirstAsHeader.header[i]]: c, ...p }), {})
}

export { getAndParse, parse }