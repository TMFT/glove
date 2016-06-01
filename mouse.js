var five = require("johnny-five");
var robot = require("robotjs");

var board = new five.Board();

var screenWidth = robot.getScreenSize().width;
var screenHeight = robot.getScreenSize().height;

robot.moveMouse(screenWidth/2, screenHeight/2);

board.on("ready", function() {
  var imu = new five.IMU({
    controller: "MPU6050"
  });

  imu.on("change", function() {

    var acc = this.accelerometer.acceleration*10;
    var acc_x = (this.accelerometer.y*100);
    var acc_y = (this.accelerometer.x*100);

    if (acc_x > 10 || acc_x < -10) {
      robot.moveMouse(robot.getMousePos().x+acc_x, robot.getMousePos().y);
    }
    if (acc_y > 20 || acc_y < -20) {
      robot.moveMouse(robot.getMousePos().x, robot.getMousePos().y+acc_y);
    }

    console.log(robot.getMousePos().x + " " + robot.getMousePos().y + " " + acc + " " + acc_x + " " + acc_y);
  });
});
