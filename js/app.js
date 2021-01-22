if ("serviceWorker" in navigator) {
  // register service worker
  navigator.serviceWorker.register("service-worker.js");
}

function addSourceToVideo(element, src, type) {
  var source = document.createElement('source');

  source.src = src;
  source.type = type;

  element.appendChild(source);
}

const spinner = document.getElementById("spinner");
const spinnerW = document.getElementById("spinner-wrapper");

'use strict';

; (function (document, window, index) {
  var inputs = document.querySelectorAll('.inputfile');
  Array.prototype.forEach.call(inputs, function (input) {
    var label = input.nextElementSibling,
      labelVal = label.innerHTML;

    input.addEventListener('change', function (e) {
      spinner.removeAttribute('hidden');
      spinnerW.removeAttribute('hidden');
      var fileName = '';
      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
      else
        fileName = e.target.value.split('\\').pop();

      if (fileName)
        label.querySelector('span').innerHTML = fileName;
      else
        label.innerHTML = labelVal;
    });

    // Firefox bug fix
    input.addEventListener('focus', function () { input.classList.add('has-focus'); });
    input.addEventListener('blur', function () { input.classList.remove('has-focus'); });
  });
}(document, window, 0));

// Check for the File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  document.getElementById('file-2').addEventListener('change', handleFileSelect, false);
} else {
  alert('The File APIs are not fully supported in this browser.');
}

function handleFileSelect(evt) {
  var f = evt.target.files[0]; // FileList object
  var reader = new FileReader();
  // Closure to capture the file information.
  reader.onload = (function (theFile) {
    return function (e) {
      var binaryData = e.target.result;
      //Converting Binary Data to base 64
      var base64String = window.btoa(binaryData);
      //showing file converted to base64
      console.log(base64String);
      fetch("https://trace.moe/api/search", {
        method: "POST",
        body: JSON.stringify({ image: base64String }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          spinner.setAttribute('hidden', '');
          spinnerW.setAttribute('hidden', '');
          console.log(result);
          var id = (result.docs[0].anilist_id);
          var fname = (result.docs[0].filename);
          var at = (result.docs[0].at);
          var tokenthumb = (result.docs[0].tokenthumb);
          var vid = ("https://media.trace.moe/video/" + id + "/" + encodeURIComponent(fname) + "?t=" + at + "&token=" + tokenthumb);
          var video = document.createElement('video');

          document.getElementById('anime-title').textContent = result.docs[0].title_english + ' - Episode ' + result.docs[0].episode;
          document.getElementById('anime-season').textContent = result.docs[0].season;

          document.getElementById('vid-container').appendChild(video);

          addSourceToVideo(video, vid, 'video/mp4');

          video.play();
        });
    };
  })(f);
  // Read in the image file as a data URL.
  reader.readAsBinaryString(f);

}



