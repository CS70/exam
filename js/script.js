$(function() {

  var DURATION = 60 * 60 * 2;
  var ANNOUNCEMENTS = [
    new Announcement(15 * 60, "Out of courtesy for your classmates, do not leave the exam room at this time."),
    new Announcement(5 * 60, "Remember to write SID at the top of each page."),
  ];

  /**
   * Announcement class
   * :param remaining: the remaining time in seconds
   * :param message: the announcement to place in the bar
   */
  function Announcement(remaining, message) {

    this.remaining = function() {
      return remaining;
    };

    this.message = function() {
      return message;
    };
  }

  /**
   * Timer class
   * :param duration: Duration of timer in seconds
   */
  function Timer(duration) {

    var interval;
    var seconds = 0;
    var hooks = [];

    /**
     * Start the timer.
     */
    this.start = function() {
      if (!interval) {
        interval = setInterval(tick, 1000);
      }
    };

    /**
     * Pause the timer, without resetting the count.
     */
    this.pause = function() {
      clearInterval(interval);
    };

    /**
     * Stop the timer, resetting count.
     */
    this.stop = function() {
      this.pause();
      seconds = 0;
    };

    /**
     * Add a hook, which is called with every tick.
     */
    this.addHook = function(hook) {
      hooks.push(hook);
    };

    function tick() {
      ++seconds;
      hooks.forEach(function(hook) {
        hook(seconds);
      });
    }
  }

  /**
   * Method to run when the timer has run out.
   */
  function examFinished() {
    window.location.hash = '#slide3';
  }

  /**
   * Update the timer GUI.
   */
  function updateTimer(remaining) {
    var hours = Math.floor(remaining / 3600);
    var minutes = Math.floor(remaining / 60) % 60;
    var seconds = remaining % 60;

    $('.time .hours').html(pad(hours, 2));
    $('.time .minutes').html(pad(minutes, 2));
    $('.time .seconds').html(pad(seconds, 2));

    ANNOUNCEMENTS.forEach(function(announcement) {
      if (remaining === announcement.remaining()) {
        $('.announcement').html(announcement.message());
      }
    });
  }

  /**
   * Once the start exam button has been clicked, start the timer.
   */
  $('.start-exam').on('click', function() {
    timer.start();
    $(this).html('Resume');
  });

  /**
   * Initialize the timer with completion and GUI update hooks.
   */
  var timer = new Timer(DURATION);
  timer.addHook(function(seconds) {
    if (DURATION - seconds <= 0) {
      examFinished();
      timer.stop();
    }
  });
  timer.addHook(function(seconds) {
    updateTimer(DURATION - seconds);
  });
});

/**
 * Pad number with zeros.
 * Source: https://stackoverflow.com/a/10073788/4855984
 */
function pad(n, width, z) {
  z = z || '0';
  n = n.toString();
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
