/**
 * Created with IntelliJ IDEA.
 * User: trapezoid
 * Date: 2013/02/17
 * Time: 20:59
 * To change this template use File | Settings | File Templates.
 */


var backBuffer = null;
function showParticipants() {
  var participants = gapi.hangout.getParticipants();

  var retVal = '<p>Participants: </p><ul>';

  for (var index in participants) {
    var participant = participants[index];

    if (!participant.person) {
      retVal += '<li>A participant not running this app</li>';
    }
    retVal += '<li>' + participant.person.displayName + '</li>';
  }

  retVal += '</ul>';

  var div = document.getElementById('participantsDiv');

  div.innerHTML = retVal;

  showCommentOverlay(backBuffer.toDataURL(),0.0,0.0);
}

function startOvelay() {
  //var topHat = gapi.hangout.av.effects.createImageResource('http://hangoutmediastarter.appspot.com/static/topHat.png');
}
function showCommentOverlay(commentData, height, width) {
  var comment = gapi.hangout.av.effects.createImageResource(commentData);
  //var videoCanvas = gapi.hangout.layout.getVideoCanvas();
  var overlay = comment.createOverlay({
    'position': {x: -0.6, y: Math.random() - 0.5}
    //'scale': {magnitude: 1.0 / 13, reference: gapi.hangout.av.effects.ScaleReference.HEIGHT}
  });
  setInterval(function(){
    var position = overlay.getPosition();
    position.x = position.x + 0.01;
    overlay.setPosition(position);
  },100);
  overlay.setVisible(true)
}

var BackBuffer = (function() {
  function BackBuffer(document) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.measureSpan = document.createElement('span');
    this.measureSpan.style.position = "absolute";
    this.measureSpan.style.top = "-1000px";
    document.body.appendChild(this.measureSpan);
    this.measureCanvas = document.createElement('canvas');
    this.measureCanvas.width = 1;
    this.measureCanvas.height = 1;
    this.measureCtx = this.measureCanvas.getContext('2d');
  };

  BackBuffer.prototype.fillText = function(text, pt, fontName, isFlip) {
    fontName = fontName || "Arial";
    isFlip = isFlip || false;

    this.measureCtx.font   = pt + 'px ' + fontName;
    this.measureCtx.textBaseline = 'top';

    this.measureSpan.style.font = pt + 'px ' + fontName;
    this.measureSpan.textContent = text;
    var textMetrics = this.measureCtx.measureText(text);

    this.canvas.height = this.measureSpan.offsetHeight;
    this.canvas.width = textMetrics.width;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    var ctx = this.canvas.getContext('2d');
    ctx.font = this.measureCtx.font;
    ctx.textBaseline = 'top';

    if (isFlip) {
      ctx.transform(-1, 0, 0, 1, this.canvas.width, 0);
    }

    ctx.fillText(text, 0, 0);

    return this;
  }

  BackBuffer.prototype.flip = function() {
  }

  BackBuffer.prototype.toDataURL = function() {
    return this.canvas.toDataURL();
  }

  return BackBuffer;
})();

function init() {
  // When API is ready...
  gapi.hangout.onApiReady.add(
    function(eventObj) {
      if (eventObj.isApiReady) {
        try{
          backBuffer = new BackBuffer(document);
          backBuffer.fillText("ほげほげ", 108, "Arial", true);
          var result = document.getElementById('result');
          result.src = backBuffer.toDataURL();
          showCommentOverlay(backBuffer.toDataURL(),100,100);
        }catch(e){alert(e)}
        document.getElementById('showParticipants').style.visibility = 'visible';
      }
    });
}

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);