const driver = require('promise-phantom');
const phantomjs = require('phantomjs-prebuilt');

function init(page, cb) {
  page.evaluate(function () {
    const $ = document.querySelector.bind(document);

    return {
      speed: Number($('#speed-value').textContent),
      unit: $('#speed-units').textContent.trim(),
      isDone: document.querySelectorAll('.succeeded').length > 0
    };
  })
  .then(result => {
    if (result.speed > 0) {
      cb(null, result);
    }

    if (result.isDone) {
      page.close();
    } else {
      setTimeout(init, 100, page, cb, result.speed);
    }
  })
}

module.exports = cb => {
  driver.create({path: phantomjs.path})
  .then(phantom => phantom.createPage())
  .then(page => page.open('http://fast.com').then(() => {
    init(page, cb);
  }))
};
