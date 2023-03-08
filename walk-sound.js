AFRAME.registerComponent("walk-sound", {
  init: function() {
    // this.stepSound;
    this.lastPosition = new THREE.Vector3();
    this.stop = true

  },
  tick: function() {
    let currentPosition = this.el.object3D.position;
    let samePosition = currentPosition.x === this.lastPosition.x && currentPosition.z === this.lastPosition.z
    let smallMovement = Math.round(currentPosition.x * 70)/70 === Math.round(this.lastPosition.x * 70)/70 && Math.round(currentPosition.z * 70)/70 === Math.round(this.lastPosition.z * 70)/70
    // if (animation) {
    //   console.log('walking')
    //   steps.play();
    //   this.stop = false;
    // }

    if (samePosition) {
      if (!this.stop) {
        // console.log('stopped');
        steps.stop();
        this.stop = true;
      }
    } else {
      if (this.stop) {
        // console.log('walking')
        steps.play();
        this.stop = false;
      }
    }

    // detecting collision
    if (!this.stop && smallMovement) {
      // console.log('colliding')
      this.collide = true
    } else {
      this.collide = false
    }
    if (this.collide) { steps.stop(); }
  },
  tock: function() {
    // update last stop
    this.lastPosition.copy(this.el.object3D.position);
  }
});
