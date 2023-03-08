let index = 0;
let standUp = false;

const readData = (property) => {
    const focus = document.querySelector(".on-focus");
    const id = focus.getAttribute('id');
    const object = document.querySelector(`#object-${id}`)
    const panel = document.querySelector(`#panel-${id}`)
    const panelText = panel.firstElementChild
    const caption = document.querySelector("#caption");
    const captionPanel = document.querySelector("#panel-caption");

    captionPanel.setAttribute("visible", true);
    setTimeout(() => {
      captionPanel.setAttribute("visible", false);
    }, "5000");
    if (property === 'weight') {
      sayText(`weight: ${object.getAttribute('object').weight}`)
      caption.setAttribute("value", `weight: ${object.getAttribute('object').weight}`);
    } else if (property === 'price') {
      sayText(`price: ${object.getAttribute('object').price}`)
      caption.setAttribute("value", `price: ${object.getAttribute('object').price}`);
    } else if (property === 'dimensions') {
      sayText(`dimensions: ${object.getAttribute('object').dimensions}`)
      caption.setAttribute("value", `dimensions: ${object.getAttribute('object').dimensions}`);
    } else {
      console.log('Error');
    }
};

AFRAME.registerComponent("right-controller", {
  init: function () {
    this.el.addEventListener("thumbstickmoved", this.logThumbstick);
    this.el.addEventListener("thumbstickdown", this.logThumbstickDown);
    this.el.addEventListener("abuttonup", this.logAbtnUp);
    this.el.addEventListener("bbuttonup", this.logBbtnUp);
    this.el.addEventListener("abuttondown", this.logAbtnDown);
    this.el.addEventListener("triggerdown", this.logTriggerDown);
    this.el.addEventListener("triggerup", this.logTriggerUp);
    this.el.addEventListener("triggertouchstart", this.touch);
    // this.el.addEventListener("griptouchstart", this.touch);
    // this.el.addEventListener("triggertouchend", this.logTriggerUp);
    this.el.addEventListener("gripdown", this.logGripDown);
    this.el.addEventListener("gripup", this.logGripUp);

//     this.el.addEventListener("collisions", function(e) {
//       // say which hand touch the object
//       sayText(e.target.getAttribute('id'))
//     })


    this.triggerDown = false

    this.stop = true
  },
  tick: function () {
    // const cameraHeight = document.querySelector('#cameraRig').getAttribute('position').y;
    // if (standUp && cameraHeight === 0) { document.querySelector("#cameraRig").object3D.position.y.set(0.5) }
  },
  logThumbstick: function (evt) {
    const cameraRig = document.querySelector("#cameraRig");
    const targets = document.querySelectorAll(".close");
    const caption = document.querySelector("#caption");

    let selected = targets[index];

    if (evt.detail.y > 0.95 && this.stop) {
      if (index < targets.length - 1) {
        selected.blur();
        index += 1
        targets[index].focus();
      }
      caption.setAttribute("value", targets[index].getAttribute('aria-label'));
      this.stop = false
    }
    if (evt.detail.y < -0.95 && this.stop) {
      if (index > 0) {
        selected.blur();
        index -= 1
        targets[index].focus();
      }
      caption.setAttribute("value", targets[index].getAttribute('aria-label'));
      this.stop = false
    }

    if (evt.detail.x < -0.95 && this.stop) {

      if (cameraRig.object3D.rotation.y > 3.141595) { cameraRig.object3D.rotation.y = -3.141595 }
      cameraRig.object3D.rotation.y += 0.785398;

      this.stop = false
    }
    if (evt.detail.x > 0.95 && this.stop) {

      if (cameraRig.object3D.rotation.y < -3.141595) { cameraRig.object3D.rotation.y = 3.141595 }
      cameraRig.object3D.rotation.y -= 0.785398;

      this.stop = false
    }
    if (evt.detail.x === 0 && evt.detail.y === 0) this.stop = true
  },
  logThumbstickDown: function(evt){
    const caption = document.querySelector("#caption");
    const captionPanel = document.querySelector("#panel-caption");
    const camera = document.querySelector('#camera');
    const cameraRig = document.querySelector('#cameraRig');
    captionPanel.setAttribute("visible", true);
    setTimeout(() => {
        captionPanel.setAttribute("visible", false);
      }, "3000");
    let camRot = camera.object3D.rotation.y
    let camRigRot = cameraRig.object3D.rotation.y
    let rot = camRot + camRigRot
    let direction = `You are facing South`

    const halfFortyFiveRad = 0.3926991;

    if (rot <= halfFortyFiveRad && rot >= -1 * halfFortyFiveRad) direction = `You are facing North`
    if (rot <= 3 * halfFortyFiveRad && rot >= halfFortyFiveRad) direction = `You are facing North West`
    if (rot <= 5 * halfFortyFiveRad && rot >= 3 * halfFortyFiveRad) direction = `You are facing West`
    if (rot <= 7 * halfFortyFiveRad && rot >= 5 * halfFortyFiveRad) direction = `You are facing South West`
    if (rot >= -3 * halfFortyFiveRad && rot <= -1 * halfFortyFiveRad) direction = `You are facing North East`
    if (rot >= -5 * halfFortyFiveRad && rot <= -3 * halfFortyFiveRad) direction = `You are facing East`
    if (rot >= -7 * halfFortyFiveRad && rot <= -5 * halfFortyFiveRad) direction = `You are facing South East`

    sayText(direction)
    caption.setAttribute("value", direction);

  },
  logAbtnDown: function() {
    if (this.triggerDown) {
      document.querySelector('#mini-map').setAttribute('visible', true);
      // document.querySelector('#rightHand').setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
    } else {
      responsiveVoice.cancel();
    }
  },
  logAbtnUp: function() {
    document.querySelector('#mini-map').setAttribute('visible', false);
    // document.querySelector('#rightHand').setAttribute('raycaster', "objects: .clickable; enabled: true; showLine: true");
  },
  logBbtnUp: function() {
    if (this.triggerDown) {
      const camera = document.querySelector('#camera');
      const cameraRig = document.querySelector('#cameraRig');
      const camPos = cameraRig.getAttribute('position');
      const caption = document.querySelector("#caption");
      const captionPanel = document.querySelector("#panel-caption");
      if (camera.object3D.position.y >= 1.4) { standUp = false }
      if (standUp) {
        // cameraRig.object3D.position.y = .3;
        cameraRig.setAttribute('position', `${camPos.x} .3 ${camPos.z}`)
        // cameraRig.setAttribute(
        //   "animation",
        //   `property: position; from: ${camPos.x} ${camPos.y} ${camPos.z}; to: ${camPos.x} .3 ${camPos.z}; dur: 1000; easing: linear`
        // );
        // cameraRig.object3D.position.set(camPos.x, .3, camPos.z);
        captionPanel.setAttribute("visible", true);
        setTimeout(() => {
          captionPanel.setAttribute("visible", false);
        }, "5000");

        sayText(`stand up`)
        caption.setAttribute("value", `Stand up /\\ `);
      } else {
        // cameraRig.object3D.position.y = 0;
        if (camera.object3D.position.y >= 1.4) {
          cameraRig.setAttribute('position', `${camPos.x} -.3 ${camPos.z}`)
          // cameraRig.object3D.position.set(camPos.x, -.3, camPos.z);
          // cameraRig.setAttribute(
          //   "animation",
          //   `property: position; from: ${camPos.x} ${camPos.y} ${camPos.z}; to: ${camPos.x} -.3 ${camPos.z}; dur: 1000; easing: linear`
          // );
        } else {
          cameraRig.setAttribute('position', `${camPos.x} 0 ${camPos.z}`)
          // cameraRig.object3D.position.set(camPos.x, 0, camPos.z);
          // cameraRig.setAttribute(
          //   "animation",
          //   `property: position; from: ${camPos.x} ${camPos.y} ${camPos.z}; to: ${camPos.x} 0 ${camPos.z}; dur: 1000; easing: linear`
          // );
        }
        captionPanel.setAttribute("visible", true);
        setTimeout(() => {
          captionPanel.setAttribute("visible", false);
        }, "5000");

        sayText(`Seated`)
        caption.setAttribute("value", `Seated \\/`);
      }
      standUp = !standUp;
    } else {
      const targetName = document.querySelector('.selected').getAttribute('aria-label')
      sayText(targetName);
    }
  },
  logTriggerDown: function(evt) {
    this.triggerDown = true
    if (this.gripDown) {
      evt.currentTarget.setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
      document.querySelector('#camera-cursor').setAttribute('raycaster', "objects: .clickable; enabled: true")
    }
  },
  logTriggerUp: function() { this.triggerDown = false },
  logGripDown: function(evt) {
    if (document.querySelector('#cameraRig').object3D.position.z != -10 && !this.triggerDown) {
      evt.currentTarget.setAttribute('raycaster', "objects: .clickable; enabled: true; showLine: true");
      document.querySelector('#camera-cursor').setAttribute('raycaster', "objects: .clickable; enabled: false")
    }
    this.gripDown = true
  },
  logGripUp: function(evt) {
    if (document.querySelector('#cameraRig').object3D.position.z != -10 || document.querySelector('#cameraRig').hasAttribute('animation')) {
      evt.currentTarget.setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
      document.querySelector('#camera-cursor').setAttribute('raycaster', "objects: .clickable; enabled: true")
    }
    this.gripDown = false
  },
  touch: function(evt) {
    evt.currentTarget.setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
  }
});

// AFRAME.registerComponent("hands", {
//   init: function () {
//     this.el.addEventListener('', function() {

//     })
//   }
// }


AFRAME.registerComponent("left-controller", {
  init: function () {
    this.el.addEventListener("xbuttonup", this.logXbtn);
    this.el.addEventListener("ybuttonup", this.logYbtn);
    this.el.addEventListener("thumbstickdown", this.logThumbstickDown);
    this.el.addEventListener("gripdown", this.logGripDown);
    this.el.addEventListener("gripup", this.logGripUp);
    this.el.addEventListener("triggerdown", this.logTriggerDown);
    this.el.addEventListener("triggerup", this.logTriggerUp);
    this.el.addEventListener("triggertouchstart", this.touch);
    // this.el.addEventListener("griptouchstart", this.touch);
    // this.el.addEventListener("triggertouchend", this.logTriggerUp);
  },
  logXbtn: function(evt){
    readData('weight');
  },
  logYbtn: function(evt){
    readData('price');
  },
  logThumbstickDown: function(evt){
    readData('dimensions');
  },
  logTriggerDown: function(evt) {
    this.triggerDown = true
    if (this.gripDown) {
      evt.currentTarget.setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
      document.querySelector('#camera-cursor').setAttribute('raycaster', "objects: .clickable; enabled: true")
    }
  },
  logTriggerUp: function() { this.triggerDown = false },
  logGripDown: function(evt) {
    if (document.querySelector('#cameraRig').object3D.position.z != -10 && !this.triggerDown) {
      evt.currentTarget.setAttribute('raycaster', "objects: .clickable; enabled: true; showLine: true");
      document.querySelector('#camera-cursor').setAttribute('raycaster', "objects: .clickable; enabled: false")
    }
    this.gripDown = true
  },
  logGripUp: function(evt) {
    if (document.querySelector('#cameraRig').object3D.position.z != -10 || document.querySelector('#cameraRig').hasAttribute('animation')) {
      evt.currentTarget.setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
      document.querySelector('#camera-cursor').setAttribute('raycaster', "objects: .clickable; enabled: true")
    }
    this.gripDown = false
  },
  touch: function(evt) {
    evt.currentTarget.setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
  }
});


let showMap = false;

//  Keyboard controls
const logKeyboard = (evt) => {
  if (evt.key === ' ') {
    const caption = document.querySelector("#caption");
    const captionPanel = document.querySelector("#panel-caption");
    const camera = document.querySelector('#camera');
    const cameraRig = document.querySelector('#cameraRig');
    captionPanel.setAttribute("visible", true);
    setTimeout(() => {
        captionPanel.setAttribute("visible", false);
      }, "3000");
    let camRot = camera.object3D.rotation.y
    let camRigRot = cameraRig.object3D.rotation.y
    let rot = camRot + camRigRot
    let direction = `You are facing South`

    const halfFortyFiveRad = 0.3926991;

    if (rot <= halfFortyFiveRad && rot >= -1 * halfFortyFiveRad) direction = `You are facing North`
    if (rot <= 3 * halfFortyFiveRad && rot >= halfFortyFiveRad) direction = `You are facing North West`
    if (rot <= 5 * halfFortyFiveRad && rot >= 3 * halfFortyFiveRad) direction = `You are facing West`
    if (rot <= 7 * halfFortyFiveRad && rot >= 5 * halfFortyFiveRad) direction = `You are facing South West`
    if (rot >= -3 * halfFortyFiveRad && rot <= -1 * halfFortyFiveRad) direction = `You are facing North East`
    if (rot >= -5 * halfFortyFiveRad && rot <= -3 * halfFortyFiveRad) direction = `You are facing East`
    if (rot >= -7 * halfFortyFiveRad && rot <= -5 * halfFortyFiveRad) direction = `You are facing South East`

    sayText(direction)
    caption.setAttribute("value", direction);
  }

  const cameraRig = document.querySelector('#cameraRig');
  if (evt.key === "q") {
    if (cameraRig.object3D.rotation.y > 3.141595) {
      cameraRig.object3D.rotation.y = -3.141595
    }
    cameraRig.object3D.rotation.y += 0.785398;
  }
  if (evt.key === 'e') {
    if (cameraRig.object3D.rotation.y < -3.141595) {
      cameraRig.object3D.rotation.y = 3.141595
    }
    cameraRig.object3D.rotation.y -= 0.785398;
  }

  if (evt.key === 'Control') {
    responsiveVoice.cancel()
  }

  if (evt.key === 'y') {
    const camera = document.querySelector('#camera')
    const caption = document.querySelector("#caption");
    const captionPanel = document.querySelector("#panel-caption");
    if (standUp) {
      // camera.object3D.position.y -= .45
      camera.object3D.position.y = 1.5
      captionPanel.setAttribute("visible", true);
        setTimeout(() => {
          captionPanel.setAttribute("visible", false);
        }, "5000");

        sayText(`Stand up`)
        caption.setAttribute("value", `Stand up /\\ `);
    } else {
      // camera.object3D.position.y += .45
      camera.object3D.position.y = 1
       captionPanel.setAttribute("visible", true);
        setTimeout(() => {
          captionPanel.setAttribute("visible", false);
        }, "5000");

        sayText(`Seated`)
        caption.setAttribute("value", `Seated \\/`);
    }
    standUp = !standUp;
  }

  if (evt.key === 'r') {
    const targetName = document.querySelector('.selected').getAttribute('aria-label')
    sayText(targetName);
  }

    const controls = camera.components["look-controls"];
  if (evt.key === '1') {
    cameraRig.setAttribute('position', `${0} ${0} ${7}`)
    controls.pitchObject.rotation.x = 0;
    controls.yawObject.rotation.y = 0;
  }

  if (evt.key === '2') {
    cameraRig.setAttribute('position', `${3} ${0} ${-7.7}`)
    // window.location.replace(`${window.location.href.match(/(.+)\?x?/)[1]}?x=3&y=0&z=-7.6`);
    controls.pitchObject.rotation.x = 0;
    controls.yawObject.rotation.y = 0;
  }

  if (evt.key === '3') {
    cameraRig.setAttribute('position', `${5.7} ${0} ${-7.7}`)
    controls.pitchObject.rotation.x = 0;
    controls.yawObject.rotation.y = 0;
  }
  // if (evt.key === 'm') {
  //   document.querySelector('#mini-map').setAttribute('visible', true)
  //   setTimeout(() => {
  //     document.querySelector('#mini-map').setAttribute('visible', false)
  //   }, "3000");
  // }

  if (evt.key === 'z') { readData('weight'); }

  if (evt.key === 'x') { readData('price'); }

  if (evt.key === 'c') { readData('dimensions'); }

  if (evt.key === 'm') {
    const map = document.querySelector('#mini-map-camera');
    map.setAttribute('visible', true);
    showMap = !showMap
    if (showMap) {
      map.setAttribute('visible', false);
    }
  }
}


document.addEventListener("keyup", logKeyboard);



// phasing through grabbable objects
AFRAME.registerComponent('phase-shift', {
  init: function () {
    var el = this.el
    el.addEventListener('gripdown', function () {
      el.setAttribute('collision-filter', {collisionForces: true})
    })
    el.addEventListener('gripup', function () {
      el.setAttribute('collision-filter', {collisionForces: false})
    })
  }
});
