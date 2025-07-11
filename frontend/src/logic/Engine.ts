import { loadShader } from "@/helpers/loadShader";
import { shaderCompiler } from "../helpers/compileShaders";
import GlobalVariables from "./GlobalVariables";
import { createProgram } from "@/helpers/createProgram";
import createVao from "@/helpers/createVao";
import Events from "./Events";
class Engine {
  static async init() {
    const vertexShaderSource = await loadShader(
      "../shaders/vertexTriangle.glsl"
    );
    const fragmentShaderSource = await loadShader(
      "../shaders/fragmentTriangle.glsl"
    );
    GlobalVariables.vertexShader = shaderCompiler(
      vertexShaderSource,
      GlobalVariables.gl.VERTEX_SHADER,
      GlobalVariables.gl
    );
    GlobalVariables.fragmentShader = shaderCompiler(
      fragmentShaderSource,
      GlobalVariables.gl.FRAGMENT_SHADER,
      GlobalVariables.gl
    );
    GlobalVariables.program = createProgram(
      GlobalVariables.vertexShader,
      GlobalVariables.fragmentShader,
      GlobalVariables.gl
    );
    GlobalVariables.gl.useProgram(GlobalVariables.program);
    GlobalVariables.gl.viewport(
      0,
      0,
      GlobalVariables.dimensions.width,
      GlobalVariables.dimensions.height
    );
    GlobalVariables.vertexPositionLocation =
      GlobalVariables.gl.getAttribLocation(
        GlobalVariables.program,
        "vertexPosition"
      );
    GlobalVariables.uniforms.maxY = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "maxY"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.minI = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "minI"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.maxX = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "maxX"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.minX = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "minX"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.viewportDimensions =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "viewportDimensions"
      ) as WebGLUniformLocation;
    GlobalVariables.uniforms.iTime = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "iTime"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.cameraPosition =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "cameraPosition"
      ) as WebGLUniformLocation;
    GlobalVariables.uniforms.cameraDirection =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "cameraDirection"
      ) as WebGLUniformLocation;
    GlobalVariables.uniforms.angleX = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "angleX"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.angleZ = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "angleZ"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.iterationCount =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "iterationCount"
      ) as WebGLUniformLocation;
    GlobalVariables.gl.enableVertexAttribArray(
      GlobalVariables.vertexPositionLocation
    );
    GlobalVariables.uniforms.opSmoothRatio =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "opSmoothRatio"
      ) as WebGLUniformLocation;
    GlobalVariables.uniforms.rootRadius = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "rootRadius"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.rootHeight = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "rootHeight"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.rootColor = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      "rootColor"
    ) as WebGLUniformLocation;
    GlobalVariables.uniforms.branchColor =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "branchColor"
      ) as WebGLUniformLocation;
    GlobalVariables.uniforms.dampeningFactor =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "dampeningFactor"
      ) as WebGLUniformLocation;
    GlobalVariables.uniforms.cellDimensions =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "cellDimensions"
      ) as WebGLUniformLocation;

    const canvasVerticies = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    GlobalVariables.verticesVao = createVao(
      [
        {
          bufferArray: canvasVerticies,
          type: GlobalVariables.gl.ARRAY_BUFFER,
          location: GlobalVariables.vertexPositionLocation,
          howToRead: 2,
          normalized: false,
          startFrom: 0,
        },
      ],
      GlobalVariables.gl
    ) as WebGLVertexArrayObject;
    this.initializeUniforms();
  }

  static initializeUniforms() {
    const uniformLocations = GlobalVariables.uniforms;
    const gl = GlobalVariables.gl;
    gl.uniform2f(
      uniformLocations.viewportDimensions!,
      GlobalVariables.dimensions.width,
      GlobalVariables.dimensions.height
    );
    gl.uniform1f(uniformLocations.minI!, GlobalVariables.bounds.bottom);
    gl.uniform1f(uniformLocations.maxY!, GlobalVariables.bounds.top);
    gl.uniform1f(uniformLocations.minX!, GlobalVariables.bounds.left);
    gl.uniform1f(uniformLocations.maxX!, GlobalVariables.bounds.right);
    gl.uniform3fv(
      uniformLocations.cameraPosition!,
      new Float32Array(GlobalVariables.cameraPosition)
    );
    gl.uniform2fv(
      uniformLocations.cameraDirection!,
      new Float32Array(GlobalVariables.cameraDirection)
    );
    gl.uniform1i(
      uniformLocations.iterationCount!,
      GlobalVariables.iterationCount
    );
    gl.uniform1f(
      uniformLocations.angleX!,
      GlobalVariables.angleX * (Math.PI / 180)
    );
    gl.uniform1f(
      uniformLocations.angleZ!,
      GlobalVariables.angleZ * (Math.PI / 180)
    );
    gl.uniform1f(
      uniformLocations.opSmoothRatio!,
      GlobalVariables.opSmoothRatio
    );
    gl.uniform1f(uniformLocations.rootRadius!, GlobalVariables.rootRadius);
    gl.uniform1f(uniformLocations.rootHeight!, GlobalVariables.rootHeight);
    gl.uniform3fv(
      uniformLocations.rootColor!,
      new Float32Array(GlobalVariables.rootColor)
    );
    gl.uniform3fv(
      uniformLocations.branchColor!,
      new Float32Array(GlobalVariables.branchColor)
    );
    gl.uniform1f(
      uniformLocations.dampeningFactor!,
      GlobalVariables.dampeningFactor
    );
    gl.uniform3fv(
      uniformLocations.cellDimensions!,
      new Float32Array(GlobalVariables.cellDimensions)
    );
  }

  static play() {
    if (GlobalVariables.animationFrameNumber !== -1)
      throw new Error("Animation already running");

    const gl = GlobalVariables.gl;
    gl.clearColor(0, 0, 0, 1);

    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;
    let lastFrameTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const iTime = now / 1000;
      const delta = now - lastTime;
      const deltaPerFrame = now - lastFrameTime;
      lastFrameTime = now;
      frameCount++;
      if (delta >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;
        GlobalVariables.currentFps = fps;
        GlobalVariables.fpsMeter.innerHTML = `${GlobalVariables.currentFps} FPS`;
      }
      if (GlobalVariables.isAutoPilot) {
        if (!GlobalVariables.autoPilotBrakesInitiated) {
          GlobalVariables.autoPilotSpeed +=
            GlobalVariables.autoPilotAcceleration * deltaPerFrame;
          GlobalVariables.autoPilotSpeed = Math.min(
            (GlobalVariables.cellDimensions[0] +
              GlobalVariables.cellDimensions[2]) /
              (3 * fps),
            GlobalVariables.autoPilotSpeed
          );
        } else {
          GlobalVariables.autoPilotSpeed -=
            GlobalVariables.autoPilotAcceleration * deltaPerFrame;
          GlobalVariables.autoPilotSpeed = Math.max(
            0,
            GlobalVariables.autoPilotSpeed
          );
        }
        Events.moveInDirecionOfCamera(GlobalVariables.autoPilotSpeed);
      }
      if (GlobalVariables.isBreathing) {
        GlobalVariables.breathingITime += deltaPerFrame;
        const breathingSinParam = GlobalVariables.breathingITime / 2000;
        GlobalVariables.rootRadiusForBreathing =
          GlobalVariables.rootRadius + Math.sin(breathingSinParam) * 0.7;
        GlobalVariables.rootHeightForBreathing =
          GlobalVariables.rootHeight + Math.sin(breathingSinParam) * 0.7;
        GlobalVariables.gl.uniform1f(
          GlobalVariables.uniforms.rootHeight!,
          GlobalVariables.rootHeightForBreathing
        );
        GlobalVariables.gl.uniform1f(
          GlobalVariables.uniforms.rootRadius!,
          GlobalVariables.rootRadiusForBreathing
        );
      }
      gl.uniform1f(GlobalVariables.uniforms.iTime!, iTime);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
      gl.bindVertexArray(GlobalVariables.verticesVao);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      GlobalVariables.animationFrameNumber = requestAnimationFrame(animate);
    };

    animate();
  }

  static pause() {
    if (GlobalVariables.animationFrameNumber !== -1) {
      cancelAnimationFrame(GlobalVariables.animationFrameNumber);
      GlobalVariables.animationFrameNumber = -1;
    }
  }
}
export default Engine;
