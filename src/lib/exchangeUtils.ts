
import {Promise} from 'es6-promise'

export function getXemRate() {
  return Promise.resolve()
    .then(() => {
      return Promise.all([
        fetch("https://poloniex.com/public?command=returnTicker").then((response) => response.json()),
        fetch("https://blockchain.info/ticker?cors=true").then((response) => response.json()),
      ]);
    })
    .then((jsonResponse) => {
      return jsonResponse[0].BTC_XEM.last * jsonResponse[1].JPY.last;
    })
}
