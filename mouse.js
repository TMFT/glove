var five = require("johnny-five");
var robot = require("robotjs");

var board = new five.Board();

var screenWidth = robot.getScreenSize().width;
var screenHeight = robot.getScreenSize().height;

var mouseX = (screenWidth)/2;
var mouseY = (screenHeight)/2;

robot.moveMouse(mouseX, mouseY);

board.on("ready", function() {
  var imu = new five.IMU({
    controller: "MPU6050"
  });

  imu.on("change", function() {

    var yawAngle = this.gyro.yaw.angle; // x angle
    var pitchAngle = this.gyro.pitch.angle; // y angle

    // if the mouse position has changed get to the new position
    if (mouseX != robot.getMousePos().x || mouseY != robot.getMousePos().y) {
      mouseX = robot.getMousePos().x;
      mouseY = robot.getMousePos().y;
      robot.moveMouse(mouseX, mouseY);
    }

    // if it's not outside the screen margins
    if(mouseX > 0 && mouseX < screenWidth) {
      // if yawAngle is positive move right
      // if yawAngle is negative move left
      if (yawAngle*-1 > 10) {
        // move only if it doesn't get stuck in a margin
        if ((mouseX + 1)<screenWidth) mouseX += 1;
        robot.moveMouse(mouseX, mouseY);
      } else if (yawAngle > 10) {
        // move only if it doesn't get stuck in a margin
        if ((mouseX - 1)>0) mouseX -= 1;
        robot.moveMouse(mouseX, mouseY);
      }
    }

    // if it's not outside the screen margins
    if(mouseY > 0 && mouseY < screenHeight) {
      // if pitchAngle is positive move right
      // if pitchAngle is negative move left
      if (pitchAngle > 10) {
        // move only if it doesn't get stuck in a margin
        if ((mouseY + 1)<screenHeight) mouseY += 1;
        robot.moveMouse(mouseX, mouseY);
      } else if (pitchAngle*-1 > 10) {
        // move only if it doesn't get stuck in a margin
        if ((mouseY - 1)>0) mouseY -= 1;
        robot.moveMouse(mouseX, mouseY);
      }
    }

    console.log(mouseX + " " + mouseY + " " + yawAngle + " " + pitchAngle);
  });
});
