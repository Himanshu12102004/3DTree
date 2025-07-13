import GlobalVariables from "./GlobalVariables";

export default class Events {
  static dragStartPos = { x: 0, y: 0 };
  static hasPassedDragThreshold = false;
  static DRAG_THRESHOLD = 3;
  static getDirectionVector(
    angleXZ: number,
    angleYZ: number
  ): [number, number, number] {
    let x = 0,
      y = 0,
      z = 1;

    const cosY = Math.cos(angleYZ);
    const sinY = Math.sin(angleYZ);
    const y1 = y * cosY - z * sinY;
    const z1 = y * sinY + z * cosY;
    y = y1;
    z = z1;

    const cosX = Math.cos(angleXZ);
    const sinX = Math.sin(angleXZ);
    const x1 = x * cosX + z * sinX;
    const z2 = -x * sinX + z * cosX;
    x = x1;
    z = z2;

    const len = Math.hypot(x, y, z);
    return [x / len, y / len, z / len];
  }

  static attachEvents() {
    this.addEvent("mousedown", Events.panStartCallback);
    this.addEvent("mousemove", Events.panDragCallback);
    window.addEventListener("resize", Events.resize);
    window.addEventListener("keydown", Events.keydownCallBack);
  }

  static addEvent<K extends keyof HTMLElementEventMap>(
    eventname: K,
    callback: (e: HTMLElementEventMap[K]) => void
  ) {
    GlobalVariables.canvas.addEventListener(
      eventname,
      callback as EventListener
    );
  }
  static moveInDirecionOfCamera(speed: number) {
    const direction = Events.getDirectionVector(
      GlobalVariables.cameraDirection[0],
      GlobalVariables.cameraDirection[1]
    );

    GlobalVariables.cameraPosition[0] += direction[0] * speed;
    GlobalVariables.cameraPosition[1] += direction[1] * speed;
    GlobalVariables.cameraPosition[2] += direction[2] * speed;
    GlobalVariables.gl.uniform3f(
      GlobalVariables.uniforms.cameraPosition!,
      GlobalVariables.cameraPosition[0],
      GlobalVariables.cameraPosition[1],
      GlobalVariables.cameraPosition[2]
    );
  }
  static keydownCallBack(e: KeyboardEvent) {
    if (e.key == "ArrowUp") {
      const speed =
        (GlobalVariables.cellDimensions[0] +
          GlobalVariables.cellDimensions[1] +
          GlobalVariables.cellDimensions[2]) /
        100;
      Events.moveInDirecionOfCamera(speed);
    } else if (e.key == "ArrowDown") {
      const speed = -(
        (GlobalVariables.cellDimensions[0] +
          GlobalVariables.cellDimensions[1] +
          GlobalVariables.cellDimensions[2]) /
        100
      );
      Events.moveInDirecionOfCamera(speed);
    }
  }
  
  static panDragCallback(e: MouseEvent) {
    if ((e.buttons & 1) === 0) {
      Events.hasPassedDragThreshold = false;
      return;
    }

    const dx = e.clientX - Events.dragStartPos.x;
    const dy = e.clientY - Events.dragStartPos.y;
    const sensitivity = 0.005;

    GlobalVariables.cameraDirection[0] += dx * sensitivity;
    GlobalVariables.cameraDirection[1] += dy * sensitivity;

    Events.dragStartPos = { x: e.clientX, y: e.clientY };

    GlobalVariables.gl.uniform2f(
      GlobalVariables.uniforms.cameraDirection!,
      GlobalVariables.cameraDirection[0],
      GlobalVariables.cameraDirection[1]
    );
  }

  static panStartCallback(e: MouseEvent) {
    if (e.button === 0) {
      Events.dragStartPos = { x: e.clientX, y: e.clientY };
      Events.hasPassedDragThreshold = false;
    }
  }
  static resize() {
    const { uniforms, gl } = GlobalVariables;
    GlobalVariables.dimensions.height =
      GlobalVariables.canvasParent.clientHeight;
    GlobalVariables.dimensions.width = GlobalVariables.canvasParent.clientWidth;
    GlobalVariables.canvas.height = GlobalVariables.canvasParent.clientHeight;
    GlobalVariables.canvas.width = GlobalVariables.canvasParent.clientWidth;
    GlobalVariables.gl.viewport(
      0,
      0,
      GlobalVariables.dimensions.width,
      GlobalVariables.dimensions.height
    );
    gl.uniform2f(
      uniforms.viewportDimensions!,
      GlobalVariables.dimensions.width,
      GlobalVariables.dimensions.height
    );
  }
}
