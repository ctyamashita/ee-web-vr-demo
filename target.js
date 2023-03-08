const setWireframe = (e, color) => {
  const target = e.currentTarget;
  target.setAttribute(
    "material",
    `color: ${color}; shader: flat; wireframe: true; opacity: 0.12`
  );
};

// scales in reference to the target radius
const unselectZoneScale = 13

// Setting target
AFRAME.registerComponent("target", {
  schema: {
    label: { type: "string", default: "destination" },
    labelZ: { type: "string", default: "1.5" },
    labelY: { type: "string", default: "0" },
    labelX: { type: "string", default: "0" },
    destinationZ: { type: "string", default: "0" },
    destinationY: { type: "string", default: "0" },
    destinationX: { type: "string", default: "0" },
    destination: { type: "boolean", default: true },
    labelSize: { type: "int", default: 7 },
    light: { type: "boolean", default: true },
    radius: { type: "float", default: 0.1 },
  },
  init: function () {
    const data = this.data; // Component property values.
    const el = this.el; // Reference to the component's entity.

    // Get world position to selectionBox
    this.localpos = new THREE.Vector3();
    this.worldpos = new THREE.Vector3();

    // setting targets
    this.setTarget(el);

    this.farFromObj = true;
  },
  tick: function () {
    //finding world position of the object
    this.localpos.copy(this.el.object3D.position);
    this.el.object3D.getWorldPosition(this.worldpos);
    this.container.object3D.position.set(
      this.worldpos.x,
      this.worldpos.y,
      this.worldpos.z
    );

    //setting up wireframe
    // const elScale = this.el.getAttribute("scale");
    // this.selectionBox.setAttribute(
    //   "scale",
    //   `${elScale.x * 1.01} ${elScale.y * 1.01} ${elScale.z * 1.01}`
    // );

    //calculating angles to display label on user line of sight
    const cameraRig = document.querySelector("#cameraRig");
    const camera = document.querySelector("#camera");
    const camRot = camera.getAttribute("rotation");
    const camPos = camera.getAttribute('position');
    const rigRot = cameraRig.getAttribute("rotation");
    const rigPos = cameraRig.getAttribute('position');

    // distance between user and target component
    this.distance = Math.sqrt(
      Math.pow(this.worldpos.x - rigPos.x, 2) +
        Math.pow(this.worldpos.z - rigPos.z, 2)
    );

    const heightDiff = rigPos.y + camPos.y - this.worldpos.y;
    const angleRad = Math.atan(heightDiff / this.distance);
    const angleDeg = (180 / Math.PI) * angleRad;

    // fixing wireframe position
    const elRot = this.el.getAttribute('rotation');
    this.selectionBox.object3D.rotation.set(
      THREE.Math.degToRad(elRot.x + angleDeg),
      THREE.Math.degToRad(elRot.y - camRot.y - rigRot.y),
      THREE.Math.degToRad(elRot.z)
    );

    // this.localrot.copy(this.el.getAttribute('rotation'));
    // this.el.object3D.getWorldRotation(this.worldrot);
    // this.container.object3D.rotation.set(
    //   this.worldrot.x,
    //   this.worldrot.y,
    //   this.worldrot.z
    // );


    // rotating container to user line of sight
    this.container.setAttribute(
      "rotation",
      `${-angleDeg} ${camRot.y + rigRot.y} 0`
    );

    // displaying distance on label
    this.selectionBox.setAttribute('aria-label', `${this.data.label} [${Math.round(this.distance * 3.28084)}ft]`)
    // `${this.data.label} [${Math.round(this.distance * 10) / 10}m]` <-- for meters
    this.textlabel.setAttribute(
      "value",
      `${this.data.label} [${Math.round(this.distance * 3.28084)}ft]`
    );
    const width =
      `${this.data.label} [${Math.round(this.distance * 3.28084)}ft]`.length *
      0.12;

    // display label
    //   this.textlabel.setAttribute(
    //   "value",
    //   `${this.data.label}`
    // );
    // const width = this.data.label.length * .12

    // this.textlabel.setAttribute("wrap-count", "15");

    // adjusting label width by content size

    this.panel.setAttribute(
      "geometry",
      `primitive:plane; height: .4; width: ${width};`
    );

    let minScale = this.distance;
    // define limit sizes to label
    if (this.distance < 3) minScale = 3 * (this.data.labelSize / 7);
    // if (distFactorNew < .4) {
    //   distFactorNew = .4
    // } else if (distFactorNew < .7) {
    //   distFactorNew = .7;
    // } else if (distFactorNew > 2) {
    //   distFactorNew = 2;
    // }

    // adjusting scale based on distance
    this.panel.setAttribute(
      "scale",
      `${(minScale * this.data.labelSize) / 50} ${
        (minScale * this.data.labelSize) / 50
      } ${(minScale * this.data.labelSize) / 50}`
    );

    //rotating panel to be perpendicular to user camera
    this.panel.setAttribute("rotation", `${camRot.x + angleDeg} 0 0`);

    // console.log(Math.abs(this.data.labelZ) >= this.distance)
    // console.log(Math.abs(this.data.labelZ), this.distance)

    if (!responsiveVoice.isPlaying()) {
      if (this.farFromObj && unselectZoneScale * this.data.radius >= this.distance) {
        let arriveMsg = `You're close to the ${this.data.label}.`;
        if (this.data.label.includes("door") || this.data.label.includes("Entrance") || this.data.label.includes("Store"))
          arriveMsg = `You're at the ${this.data.label}.`;
        if (this.data.label.includes("Convenience")) this.el.components.sound.playSound()
        document.querySelector("#caption").setAttribute("value", arriveMsg);
        sayText(arriveMsg);
        document.querySelector("#panel-caption").setAttribute("visible", true);

        this.selectionBox.click();
        this.selectionBox.classList.add('clicked')
        this.selectionIn.setAttribute('scale', '0 0 0')
        console.log(document.querySelector('.clicked'));

        // Attempt to avoid selecting current place
        const currentPos = this.selectionBox.getAttribute('position')
        this.selectionBox.setAttribute('position', `${currentPos.x} ${currentPos.y - 1000} ${currentPos.z}`)

        this.farFromObj = false;
        // steps.stop();
        setTimeout(() => {
          document.querySelector("#panel-caption").setAttribute("visible", false);
        }, "4000");
      }
      if (this.distance > unselectZoneScale * this.data.radius) { this.farFromObj = true };

      if (this.distance >= this.data.radius * unselectZoneScale && this.selectionBox.classList.contains('clicked')) {
      this.selectionBox.classList.remove('clicked')
      this.selectionIn.setAttribute('scale', `${1/unselectZoneScale} 1 ${1/unselectZoneScale}`)
      const currentPos = this.selectionBox.getAttribute('position')
      this.selectionBox.setAttribute('position', `${currentPos.x} ${currentPos.y + 1000} ${currentPos.z}`)
    }

    }
  },
  remove: function () {
    // removing EventListeners
    this.selectionBox.removeEventListener("click", this.clickHandler);
    this.selectionBox.removeEventListener("mouseenter", this.hoverIn);
    this.selectionBox.removeEventListener("mouseleave", this.hoverOut);
    // this.selectionBox.removeEventListener("focus", this.hoverIn);
    // this.selectionBox.removeEventListener("blur", this.hoverOut);
    // this.selectionBox.removeEventListener("keyup", function (e) {
    //   if (e.key === "Enter") e.target.click();
    // });
  },
  // Setting selection box
  setTarget: function (el) {
    const elAriaLabel = this.data.label;
    this.selectionBox = document.createElement("a-entity");
    this.container = document.createElement("a-entity");
    this.destination = document.createElement('a-entity');

    this.destination.setAttribute('position', `${this.data.destinationX} 0 ${this.data.destinationZ}`);
    this.container.appendChild(this.destination);

    // setting id to el
    el.setAttribute('id', this.data.label.toLowerCase().replaceAll(' ','-'))

    // setting attributes
    this.selectionBox.setAttribute("geometry", `primitive: cylinder; height: 30; radius: ${this.data.radius}`);
    this.selectionBox.setAttribute('role', 'region')

    // setting spot light
    if (this.data.light === true) {
      const light = document.createElement('a-entity');
      light.setAttribute('light', "type: spot; color: #BBB; intensity: .5; angle: 15; penumbra:1")
      light.setAttribute('position', '0 4 0')
      light.setAttribute('rotation', '-90 0 0')

      this.el.appendChild(light)
    }

    this.selectionBox.setAttribute("visible", false);
    this.selectionBox.classList.add("clickable");
    // this.selectionBox.setAttribute("class", "clickable");
    // this.selectionBox.setAttribute("aria-label", elAriaLabel);
    // this.selectionBox.setAttribute("tabindex", "0");

    this.selectionIn = document.createElement('a-entity');

    const elGeometry = `primitive: cylinder; height: 30; radius: ${this.data.radius}`
    this.selectionIn.setAttribute("geometry", elGeometry);
    this.selectionIn.setAttribute("material", `color: red; shader: flat; wireframe: true; opacity: 0.05`)
    this.selectionIn.setAttribute('scale', `${1/unselectZoneScale} 1 ${1/unselectZoneScale}`);

    this.selectionBox.appendChild(this.selectionIn)

    document.querySelector("a-scene").appendChild(this.container);
    this.container.appendChild(this.selectionBox);

    // setting EventListeners
    if (this.data.destination) {
      this.selectionBox.addEventListener("click", this.clickHandler);
      // this.selectionBox.addEventListener("keyup", function (e) {
      //   if (e.key === "Enter") e.target.click();
      // });
    }
    this.selectionBox.addEventListener("mouseenter", this.hoverIn);
    this.selectionBox.addEventListener("mouseleave", this.hoverOut);
    // this.selectionBox.addEventListener("focus", this.hoverIn);
    // this.selectionBox.addEventListener("blur", this.hoverOut);

    //setting Labels
    //label
    this.panel = document.createElement("a-entity");
    const width = this.data.label.length * 0.3;
    this.panel.setAttribute(
      "geometry",
      `primitive:plane; height: .4; width: ${width};`
    );
    this.panel.setAttribute("material", "color:#222; shader:flat;");
    this.panel.setAttribute(
      "position",
      `${this.data.labelX} ${this.data.labelY} ${this.data.labelZ}`
    );
    this.panel.setAttribute("class", "selection-label");
    this.panel.setAttribute("visible", false);
    this.container.appendChild(this.panel);

    this.textlabel = document.createElement("a-text");
    this.textlabel.setAttribute("value", this.data.label);
    this.textlabel.setAttribute("align", "center");
    this.textlabel.setAttribute("color", "#eee");
    this.textlabel.setAttribute("position", "0 0 0.01");
    // this.textlabel.setAttribute("scale", "0.5 0.5 0.5");

    this.panel.appendChild(this.textlabel);

    console.log(`${this.data.label} set`);
  },
  // click handler
  clickHandler: function (e) {
    responsiveVoice.cancel();
    const el = e.target.parentNode;
    const cameraRig = document.querySelector("#cameraRig");
    const camera = document.querySelector("#camera");


    const targetPos = el.getAttribute('position');
    const cameraRot = cameraRig.getAttribute("rotation");

    // reset camera rotation <= Not a good practice for VR (can be disorienting)
    // const controls = camera.components["look-controls"];
    // controls.pitchObject.rotation.x = 0;
    // controls.yawObject.rotation.y = 0;

    // moving camera with animation
    const destination = e.target.previousElementSibling.getAttribute('position')
    const destinationX = destination.x;
    const destinationY = destination.y;
    const destinationZ = destination.z;
    const cameraPos = cameraRig.getAttribute('position');
    const distance = Math.sqrt(
      Math.pow(targetPos.x - cameraPos.x, 2) +
        Math.pow(targetPos.z - cameraPos.z, 2)
    );

    cameraRig.setAttribute(
      "animation",
      `property: position; from: ${cameraPos.x} ${cameraPos.y} ${cameraPos.z}; to: ${
        targetPos.x + destinationX
      } ${cameraPos.y} ${targetPos.z + destinationZ}; dur: ${(distance / 1.4) * 1000}; easing: linear`
    );

    // console.log(e.detail.intersection.point)

    // weird camera movement using nav-agent
    // cameraRig.setAttribute('nav-agent', {
    //   active: true,
    //   destination: {x: targetPos.x, y: 0, z: targetPos.z}
    // });

    //teleport camera
    // cameraRig.setAttribute('position', `${targetPos.x} ${targetPos.y} ${targetPos.z + 3}`) // height included
    // cameraRig.setAttribute('position', `${targetPos.x} 0 ${targetPos.z + 3}`)

    const cameraCursor = document.querySelector('#camera-cursor')
    // const message = `You moved next to ${e.currentTarget.ariaLabel}.`;
    if (distance > 2) {
      const message = `Moving towards the ${e.currentTarget.ariaLabel.match(/(.+) \[/)[1]}.`;
      // document.querySelector('#rightHand').setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
      // document.querySelector('#leftHand').setAttribute('raycaster', "objects: .clickable; enabled: false; showLine: false");
      document.querySelector('#mouse').setAttribute('raycaster', "objects: .clickable; enabled: false");
      document.querySelector('#camera-cursor').setAttribute('raycaster', "objects: .clickable; enabled: false");
      cameraRig.setAttribute('movement-controls', "speed: 0.06; constrainToNavMesh: true; enabled: false" )
      steps.play();
      const panel = document.querySelector("#panel-caption")
      panel.setAttribute("visible", true);
      document.querySelector("#caption").setAttribute("value", message);
      cameraCursor.setAttribute('visible', false)
      sayText(message);
      setTimeout(() => {
        panel.setAttribute("visible", false);
      }, "3000");
      let target = e.currentTarget.ariaLabel;
    }
    setTimeout(() => {
        steps.stop();
        cameraRig.removeAttribute("animation");
      setTimeout(()=> {
        // document.querySelector('#rightHand').setAttribute('raycaster', "objects: .clickable; enabled: true; showLine: true");
        // document.querySelector('#leftHand').setAttribute('raycaster', "objects: .clickable; enabled: true; showLine: true");
        document.querySelector('#mouse').setAttribute('raycaster', "objects: .clickable; enabled: true");
        document.querySelector('#camera-cursor').setAttribute('raycaster', "objects: .clickable; enabled: true");
        cameraRig.setAttribute('movement-controls', "speed: 0.06; constrainToNavMesh: true; enabled: true" )
        cameraCursor.setAttribute("visible", true);
      }, `3000`)
      }, `${((distance / 1.4) * 1000)}`);

  },
  hoverIn: function (e) {
    const target = e.currentTarget;
    if (!target.classList.contains('clicked')) {
      target.setAttribute("visible", true);
      target.nextElementSibling.setAttribute("visible", true);
      const previousSelection = document.querySelector(".selected");
      if (previousSelection) {
        previousSelection.classList.remove("selected");
      }
      target.classList.add("selected");

      target.setAttribute('scale', `${unselectZoneScale} 1 ${unselectZoneScale}`);


      const object = e.currentTarget.ariaLabel;
      sayText(object);

      if (e.type === "focus") {
        setWireframe(e, "black");
      } else {
        setWireframe(e, "#00FF00");
      }

       const inSnd = new window.Howl({
          src: `https://cdn.glitch.com/f2d55546-c372-4b99-b28f-91c8f8a3e2ed%2Fsblip.mp3?v=1610420175408`,
          autoplay: true,
          loop: false,
          volume: 0.9,
          onend: function() {

          }
        });
      inSnd.play();
    }
  },
  hoverOut: function (e) {
    const target = e.currentTarget
    const outSnd = new window.Howl({
      src: `https://cdn.glitch.com/f2d55546-c372-4b99-b28f-91c8f8a3e2ed%2Fsblop.mp3?v=1610420150327`,
      autoplay: true,
      loop: false,
      volume: 0.9,
    });

    target.setAttribute('scale', '1 1 1');

    outSnd.play();
    target.setAttribute("visible", false);
    target.nextElementSibling.setAttribute("visible", false);
  }
});
