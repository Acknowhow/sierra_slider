import {startLoader, stopLoader, initializeSlider} from './state.js';

var appId = 'sierra.slider.app';
var kindId = appId + ":1";
var callerId = 'sierra.slider.app.*';
var slider;
var query = [{ prop: 'link', op: '!=', val: ''}];

function delAll() {
  webOS.service.request('luna://com.palm.db', {
    method: 'del',
    parameters: {
      query: {
        from: kindId,
        where: query,
      },
    },
    onSuccess: function (res) {
      console.log('[del] onSuccess: deleted ' + res.count + ' object(s).');
      if (slider) {
        slider.destroy();
      }
    },
    onFailure: function (res) {
      console.log('[del] onFailure');
      console.log('(' + res.errorCode + ') ' + res.errorText);
      return;
    },
  });
}

function refreshDB() {
  startLoader();

  return webOS.service.request('luna://com.palm.db', {
    method: 'find',
    parameters: {
      query: {
        from: kindId,
        where: query,
        groupBy: 'link'
      },
    },
    onSuccess: function (res) {
      var result = res.results;
      if (slider) {
        slider.destroy();
      }
      var sliderEl = document.getElementById('slider-swiper');
      sliderEl.innerHTML = '';

      for (let el of result) {
        if (el.link) {
          var slide = document.createElement('div');
          slide.className = 'swiper-slide';
          slide.innerHTML = `<img src="${el.link}"/>`
          sliderEl.appendChild(slide);
        }
      }

      var resultThumbs = result.slice(-3);
      var thumbContainer = document.querySelector('.thumbs');
      thumbContainer.innerHTML = '';

      for (let el of resultThumbs) {
        if (el.link) {
          thumbContainer.innerHTML += `<div class='thumb-container'><img src=${el.link} width='150' height='150'></div>`;
        }
      }

      if (result.length > 1) {
        slider = initializeSlider();
      }
      stopLoader();
      console.log('[refreshDB] onSuccess:', result);
    },
    onFailure: function (res) {
      console.log('(' + res.errorCode + ') ' + res.errorText);
      return;
    }
  });
}

function putKind() {
  webOS.service.request('luna://com.palm.db', {
    method: 'putKind',
    parameters: {
      id: kindId,
      owner: appId,
      schema: {
        id: kindId,
        type: 'object',
        properties: {
          _kind: {
            type: 'string',
            value: kindId,
          },
          link: {
            type: 'string',
            description: 'img link',
          }
        }
      },
      indexes: [
        {
          name: 'index0',
          props: [{ name: 'link' }]
        }
      ],
    },
    onSuccess: function (res) {
      console.log('[putKind] onSuccess');
    },
    onFailure: function (res) {
      console.log('[putKind] onFailure', res);
      return;
    },
  });
}

function put(link) {
  webOS.service.request('luna://com.palm.db', {
    method: 'put',
    parameters: {
      objects: [
        {
          _kind: kindId,
          link: link
        },
      ],
    },
    onSuccess: function (res) {
      console.log('[put] onSuccess: ' + link);
      return true;
    },
    onFailure: function (res) {
      console.log('[put] onFailure: ' + link);
      console.log('(' + res.errorCode + ') ' + res.errorText);
      return false;
    },
  });
}

function find(query) {
  webOS.service.request('luna://com.palm.db', {
    method: 'find',
    parameters: {
      query: {
        from: kindId,
        where: query,
        limit: 10,
      },
    },
    onSuccess: function (res) {
      var result = res.results;
      console.log('[find] onSuccess:', result);
    },
    onFailure: function (res) {
      console.log('[find] onFailure');
      console.log('(' + res.errorCode + ') ' + res.errorText);
      return;
    }
  });
}

function delKind() {
  webOS.service.request('luna://com.palm.db', {
    method: 'delKind',
    parameters: {
      id: kindId,
    },
    onSuccess: function (res) {
      console.log('[delKind] onSuccess');
    },
    onFailure: function (res) {
      console.log('[delKind] onFailure');
      return;
    },
  });
}

export {refreshDB, putKind, delKind, put, find, delAll};