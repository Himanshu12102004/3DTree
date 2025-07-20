interface Dimensions {
  height: number;
  width: number;
}

interface UniformLocations {
  viewportDimensions?: WebGLUniformLocation;
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
  maxRayMarch?: WebGLUniformLocation;
}
interface Point {
  x: number;
  y: number;
}
class GlobalVariables {
  static canvas: HTMLCanvasElement;
  static canvasParent: HTMLDivElement;
  static dimensions: Dimensions = { height: 0, width: 0 };
  static center: Point = { x: 0, y: 0 };
  static animationFrameNumber: number;
  static gl: WebGL2RenderingContext;
  static vertexShader: WebGLShader;
  static fragmentShader: WebGLShader;
  static vertexPositionLocation: number;
  static program: WebGLProgram;
  static verticesVao: WebGLVertexArrayObject;
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
  static maxRayMarch: number;
  static isInitialized = false;
  static isConfigurationChanged = false;
  static navigationSpeed: number;
  static isAutoPilot = false;
  static isBreathing = true;
  static breathingITime = 0;
  static cameraAutopilotAcceleration = 2;
  static cameraKeypressAcceleration = 10;
  static cameraSpeed = 0;
  static maxCameraSpeed: number;
  static cameraBrakesInitiated = true;
  static areKeysUsedForNavigation = false;
  static autoPilotTimeOut: NodeJS.Timeout;
  static downArrowTimeOut: NodeJS.Timeout;
  static upArrowTimeOut: NodeJS.Timeout;
  static init(canvas: HTMLCanvasElement, canvasParent: HTMLDivElement) {
    this.canvas = canvas;
    this.canvasParent = canvasParent;
    this.gl = canvas.getContext("webgl2", {
      preserveDrawingBuffer: true,
    }) as WebGL2RenderingContext;
    this.dimensions.height = this.canvasParent.clientHeight;
    this.dimensions.width = this.canvasParent.clientWidth;
    this.canvas.height = this.dimensions.height;
    this.canvas.width = this.dimensions.width;
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
    this.maxRayMarch = 80;
    this.maxCameraSpeed =
      (this.cellDimensions[0] + this.cellDimensions[2]) * 0.4;
    this.currentFps = 60;
  }
}
export default GlobalVariables;
