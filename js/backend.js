import {put, refreshDB, delAll} from './db.js';
import {startLoader, stopLoader} from './state.js';

var fileEl = document.getElementById('file');
var deleteEl = document.getElementById('delete-button');

function setPhoto(props) {
  fileEl.addEventListener('change', function (e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.readAsDataURL(file);
    reader.onload = function (e) {
      var image = new Image();
      image.src = reader.result;

      image.onload = function() {
        var height = this.height;
        var width = this.width;

        if (width !== props.width && height !== props.height) {
          alert(`Image size must be exactly ${props.width} x ${props.height}`);
          fileEl.value = '';
          return false;
        }
        return true;
      };
    };
  });
}

function uploadPhoto(props) {
  document.getElementById('submit-button').addEventListener('click', function(event) {
    event.preventDefault();

    var upload = Upload({
      apiKey: props.key
    });
    startLoader();

    if (!fileEl.files[0]) {
      stopLoader();
      alert('Please select image for uploading');
      return;
    }
    var onFileSelected = async function() {
      var file = fileEl.files[0];
      try {
        var { fileUrl } = await upload.uploadFile(
            file,
            {
              path: {
                folderPath: '/uploads/{UTC_YEAR}/{UTC_MONTH}/{UTC_DAY}',
                fileName: '{UNIQUE_DIGITS_8}{ORIGINAL_FILE_EXT}'
              }
            }
        );
        put(fileUrl);
        refreshDB();

        alert(`File successfully uploaded`);
        fileEl.value = null;
        stopLoader();
      } catch (e) {
        alert(`Upload failed: ${e.message}`);
        fileEl.value = null;
      }
    }
    return onFileSelected();
  });
}

function attachDeleteListener() {
  deleteEl.addEventListener('click', function(e) {
    e.preventDefault();

    delAll();
    refreshDB();
  });
}

export {setPhoto, uploadPhoto, attachDeleteListener};