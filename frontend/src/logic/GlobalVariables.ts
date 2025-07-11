interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
interface Dimensions {
  height: number;
  width: number;
}

interface UniformLocations {
  viewportDimensions?: WebGLUniformLocation;
  minX?: WebGLUniformLocation;
  maxX?: WebGLUniformLocation;
  minI?: WebGLUniformLocation;
  maxY?: WebGLUniformLocation;
  maxZ?: WebGLUniformLocation;
  minZ?: WebGLUniformLocation;
  iTime?: WebGLUniformLocation;
  cameraPosition?: WebGLUniformLocation;
  cameraDirection?: WebGLUniformLocation;
  angleX?: WebGLUniformLocation;
  angleZ?: WebGLUniformLocation;
  iterationCount?: WebGLUniformLocation;
  opSmoothRatio?: WebGLUniformLocation;
  rootRadius?: WebGLUniformLocation;
  rootHeight?: WebGLUniformLocation;
  rootColor?: WebGLUniformLocation;
  branchColor?: WebGLUniformLocation;
  dampeningFactor?: WebGLUniformLocation;
  cellDimensions?: WebGLUniformLocation;
}
interface Point {
  x: number;
  y: number;
}
class GlobalVariables {
  static canvas: HTMLCanvasElement;
  static canvasParent: HTMLDivElement;
  static bounds: Bounds = { bottom: 0, top: 0, left: 0, right: 0 };
  static dimensions: Dimensions = { height: 0, width: 0 };
  static center: Point = { x: 0, y: 0 };
  static animationFrameNumber: number;
  static gl: WebGL2RenderingContext;
  static vertexShader: WebGLShader;
  static fragmentShader: WebGLShader;
  static vertexPositionLocation: number;
  static program: WebGLProgram;
  static verticesVao: WebGLVertexArrayObject;
  static zoomLevel: number;
  static uniforms: UniformLocations = {};
  static cameraPosition: number[];
  static cameraDirection: number[];
  static fpsMeter: HTMLDivElement;
  static angleX: number;
  static angleZ: number;
  static currentFps: number;
  static iterationCount: number;
  static opSmoothRatio: number;
  static rootRadius: number;
  static rootHeight: number;
  static rootRadiusForBreathing: number;
  static rootHeightForBreathing: number;
  static rootColor: [number, number, number];
  static branchColor: [number, number, number];
  static dampeningFactor: number;
  static cellDimensions: [number, number, number];
  static isInitialized = false;
  static navigationSpeed: number;
  static isAutoPilot = false;
  static isBreathing = true;
  static breathingITime = 0;
  static autoPilotAcceleration = 0.0001;
  static autoPilotSpeed = 0;
  static autoPilotBrakesInitiated = false;
  static init(canvas: HTMLCanvasElement, canvasParent: HTMLDivElement) {
    this.canvas = canvas;
    this.canvasParent = canvasParent;
    this.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    this.dimensions.height = this.canvasParent.clientHeight;
    this.dimensions.width = this.canvasParent.clientWidth;
    this.canvas.height = this.dimensions.height;
    this.canvas.width = this.dimensions.width;
    this.zoomLevel = 100;
    const verticals = this.dimensions.height / this.zoomLevel / 2;
    const horizontals = this.dimensions.width / this.zoomLevel / 2;
    this.bounds.bottom = this.center.y - verticals;
    this.bounds.top = this.center.y + verticals;
    this.bounds.left = this.center.x - horizontals;
    this.bounds.right = this.center.y + horizontals;
    this.animationFrameNumber = -1;
    this.cameraPosition = [-3, 0, -7];
    this.cameraDirection = [0.5, -0.5];
    this.angleX = 12;
    this.angleZ = 54;
    this.fpsMeter = document.querySelector(".fps") as HTMLDivElement;
    this.iterationCount = 9;
    this.opSmoothRatio = 2.98;
    this.rootRadius = 1;
    this.rootHeight = 4.22;
    this.rootColor = [0.08, 0.08, 0.08];
    this.branchColor = [0.255, 0.0039, 0.365];
    this.dampeningFactor = 1;
    this.cellDimensions = [32, 0, 20];
    this.navigationSpeed = 10;
    this.isInitialized = true;
  }
}
export default GlobalVariables;
