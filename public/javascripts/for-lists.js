(function() {

  //cutoff function
  var c = document.getElementById('cutoff');
  var s = document.getElementById('period');
  c.addEventListener('keyup', function(event) {
    multiplier = parseInt($('#period option:selected').val());
    rateMySpending(event.target.value, 125, multiplier);
  });
  c.addEventListener('change', function(event) {
    multiplier = parseInt($('#period option:selected').val());
    rateMySpending(event.target.value, 125, multiplier);
  });
  s.addEventListener('change', function() {
    multiplier = parseInt($('#period option:selected').val());
    rateMySpending(event.target.value, 125, multiplier);
  });

  //********************
  // Coloring the totals
  //********************
  function rateMySpending(expect, darkness, multiplier) {
    if (typeof expect !== Number) {
      expect = parseInt(expect);
    }
    // Check darkness val
    darkness = Math.abs(darkness);
    if (darkness > 255) {
      throw new Error('Please select val - 0 >= val >= 255');
      darkness = 255;
    }

    $('.total').each(function(i, box) {
      var amount = parseInt(box.innerHTML.match(/\d+/)[0]);
      var ratio = (((amount * multiplier) - expect) / expect) * 2;
      var absRatio = Math.abs(ratio);
      var clrIntensity = absRatio > 1 ? 255 : Math.round((absRatio * (255 - darkness)) + darkness);

      if (ratio >= 0) {
        $(box).css('color', `rgb(${clrIntensity},${darkness},${darkness})`);
      } else {
        $(box).css('color', `rgb(${darkness},${clrIntensity},${darkness})`);
      }
    });
  }

  //**************
  // FEEDBACK BOX
  //**************
  var fbb = document.getElementById('feedback-box');
  setTimeout(function() {
    if (fbb) {
      $(fbb).slideUp()
    };
  }, 5000)
  $('.glyphicon-remove').click(function(event) {
    $(fbb).slideUp(200);
  });

})();