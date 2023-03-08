const sayText = (text) => {
  // responsive voice (https://responsivevoice.org/)
  responsiveVoice.setDefaultVoice("US English Male");
  responsiveVoice.speak(text);
};

const steps = new Howl({
  src: [
    "https://cdn.glitch.global/3cd589f5-b029-4cde-9f12-b857ebb581e5/app_sounds_steps.wav?v=1661062079014",
  ],
  loop: true,
});

const bipSound = new Howl({
  src: [
    `https://cdn.glitch.com/f2d55546-c372-4b99-b28f-91c8f8a3e2ed%2Fsblip.mp3?v=1610420175408`
  ],
  loop: false
});

// document.addEventListener('enter-vr', function () {
//   const cameraRig = document.querySelector('#cameraRig');
//   const cameraHeight = document.querySelector('#camera').object3D.position.y;
//   if (cameraHeight >= 1.4) {
//     cameraRig.object3D.position.y = 0;
//   } else {
//     cameraRig.object3D.position.y = 1;
//   }
//   console.log("ENTERED VR");
// });

// const peopleSound = new Howl({
//   src: 'https://cdn.glitch.global/3cd589f5-b029-4cde-9f12-b857ebb581e5/crowd-talking-4%20(mp3cut.net)%20(1).mp3?v=1661512964119',
//   loop: true
// });

// const peoplePos = document.querySelector('#people').getAttribute('position');

// // Use the x/y/z position of the entity
// peopleSound.pos(peoplePos.x, peoplePos.y, peoplePos.z);

// peopleSound.play();
