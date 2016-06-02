var five = require("johnny-five");
var robot = require("robotjs");

var board = new five.Board();

var screenWidth = robot.getScreenSize().width;
var screenHeight = robot.getScreenSize().height;

var date1 = 0;
var date2 = 0;

robot.moveMouse(screenWidth/2, screenHeight/2);

board.on("ready", function() {
  var imu = new five.IMU({
    controller: "MPU6050"
  });

  imu.on("change", function() {

    var acc = this.accelerometer.acceleration*10;
    var acc_x = ((this.accelerometer.y + 0.035)*100);
    var acc_y = (this.accelerometer.x*100);

    date1 = date2;
    date2 = new Date().getSeconds() + new Date().getMilliseconds()*0.001;

    var dx = acc_x * Math.pow(date2 - date1, 2) * 100;
    var dy = acc_y * Math.pow(date2 - date1, 2) * -100;

    dx = (dx*(screenWidth/2))/30;
    dy = (dy*(screenHeight/2))/30;

    if (acc > 10) {
      robot.moveMouse(robot.getMousePos().x+dx, robot.getMousePos().y+dy);
    }

  });
});
