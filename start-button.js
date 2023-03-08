let started = true
const query = window.location.search
AFRAME.registerComponent("start-button", {
  init: function() {
      const el = this.el;
      if (query && query.startsWith('?x=') || query.startsWith('?place=')) {
        if (started) {
          document.querySelector('#rightHand').setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
          document.querySelector('#leftHand').setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
          this.teleport()
          started = false
          el.parentElement.setAttribute('visible', false)
          el.removeAttribute('start-button')
        }
      } else {
        el.addEventListener('click', function(){
          const intro = "Study Overview. Equal Entry created several interactive samples for you to try, with respect to your 3D description preferences. Your data will be collected and published for other people to learn from. Press the trigger to participate."
          document.querySelector('#rightHand').setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
          document.querySelector('#leftHand').setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
          document.querySelector('#mouse').setAttribute('raycaster', 'objects: .clickable; enabled: false')
          if (started) {
            sayText(intro);
            started = false
          }

          setTimeout(() => {
          document.querySelector('#rightHand').setAttribute('raycaster', "objects: .clickable; enabled: true; showLine: true");
          document.querySelector('#leftHand').setAttribute('raycaster', "objects: .clickable; enabled: true; showLine: true");
          document.querySelector('#mouse').setAttribute('raycaster', 'objects: .clickable; far: 12; enabled: true')
          document.querySelector('#camera-cursor').setAttribute('raycaster', 'objects: .clickable; far: 12; enabled: true')
          el.addEventListener('click', function(){
            const cameraRig = document.querySelector("#cameraRig");
            cameraRig.object3D.position.set(0, 0, 7);
            setTimeout(() => {
              document.querySelector('#rightHand').setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
              document.querySelector('#leftHand').setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
              document.querySelector('#mouse').setAttribute('raycaster', 'objects: .clickable; far: 12; enabled: true')
              document.querySelector('#camera-cursor').setAttribute('raycaster', 'objects: .clickable; far: 12; enabled: true')
            }, `3000`)
            cameraRig.setAttribute('movement-controls', "speed: 0.06; constrainToNavMesh: true; enabled: true" )
            el.parentElement.setAttribute('visible', false)
            const sounds = document.querySelectorAll('.sound');
            sounds.forEach((el) => {el.components.sound.playSound();})
            el.removeAttribute('start-button')
          })
          }, `0`); //16000 to wait the speech to finish to allow controls
        });
        // this.startScreen = true
      }

  },
  remove: function() {
    const el = this.el
    el.removeEventListener('click', function(){
      const intro = "Study Overview. Equal Entry created several interactive samples for you to try with respect to your 3D description preferences. Your data will be collected and published for other people to learn from. Press the trigger to participate."
      sayText(intro);
      el.addEventListener('click', function(){
        const cameraRig = document.querySelector("#cameraRig");
        cameraRig.object3D.position.set(0, 0, 7);
        cameraRig.setAttribute('movement-controls', "speed: 0.06; constrainToNavMesh: true; enabled: true" )
        el.parentElement.setAttribute('visible', false)
        const sounds = document.querySelectorAll('.sound');
        sounds.forEach((el) => {el.components.sound.playSound();})
      })
    });
  },
  teleport: function() {
    const cameraRig = document.querySelector("#cameraRig");
    if (query.startsWith('?x=')) {
      const qPos = query.match(/\?x=(-?\d*\.?\d*)&y=(-?\d*\.?\d*)&z=(-?\d*\.?\d*)/)

      const qPosX = parseFloat(qPos[1]);
      const qPosY = parseFloat(qPos[2]);
      const qPosZ = parseFloat(qPos[3]);

      cameraRig.setAttribute('position', `${qPosX} ${qPosY} ${qPosZ}`)
      // cameraRig.object3D.position.set(qPosX, qPosY, qPosZ);
      // console.log(qPosX, qPosY, qPosZ)
    } else if (query.startsWith('?place=')) {
      const place = query.replace('?place=','')
      const target = document.querySelector(`#${place}`)
      if (target) {
        const targetPos = target.getAttribute('position')
        cameraRig.setAttribute('position', `${targetPos.x} 0 ${targetPos.z}`)
      } else {
        cameraRig.setAttribute('position', `0 0 7`)
      }

    } else {
      cameraRig.setAttribute('position', `0 0 7`)
    }
    cameraRig.setAttribute('movement-controls', "speed: 0.06; constrainToNavMesh: true; enabled: true" )
    // this.el.parentElement.setAttribute('visible', false)
    // const sounds = document.querySelectorAll('.sound');
    // sounds.forEach((el) => {el.components.sound.playSound();})
    this.el.removeAttribute('start-button')
  }
});
