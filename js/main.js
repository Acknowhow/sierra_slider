import {refreshDB, putKind, delKind} from './db.js';
import {backendLink, frontendLink, goUp, goDown} from './state.js';
import {setPhoto, uploadPhoto, attachDeleteListener} from './backend.js';

var IMG_WIDTH = 1920;
var IMG_HEIGHT = 1080;
var UPLOAD_KEY = 'public_W142hwsHxAAcmHJZkYjYnznhv6ay';
var GO_UP_KEY = 38;
var GO_DOWN_KEY = 40;

setPhoto({width: IMG_WIDTH, height: IMG_HEIGHT});
uploadPhoto({key: UPLOAD_KEY});
backendLink();
frontendLink();
attachDeleteListener();

window.addEventListener("keydown", function(inEvent) {
  var keycode;
  if (window.event) {
    keycode = inEvent.keyCode;
  } else if (e.which) {
    keycode = inEvent.which;
  }

  switch (keycode) {
    case GO_UP_KEY:
      goUp();
      break;
    case GO_DOWN_KEY:
      goDown();
      break;
  }
});
window.addEventListener(
    "load",
    function () {
      refreshDB();
    },
    false
);