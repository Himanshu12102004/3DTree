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

    GlobalVariables.uniforms.viewportDimensions =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "viewportDimensions"
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
    GlobalVariables.uniforms.maxRayMarch =
      GlobalVariables.gl.getUniformLocation(
        GlobalVariables.program,
        "maxRayMarch"
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

    gl.uniform3f(
      uniformLocations.cameraPosition!,
      GlobalVariables.cameraPosition[0],
      GlobalVariables.cameraPosition[1],
      GlobalVariables.cameraPosition[2]
    );
    gl.uniform2f(
      uniformLocations.cameraDirection!,
      GlobalVariables.cameraDirection[0],
      GlobalVariables.cameraDirection[1]
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
    gl.uniform3f(
      uniformLocations.rootColor!,
      GlobalVariables.rootColor[0],
      GlobalVariables.rootColor[1],
      GlobalVariables.rootColor[2]
    );
    gl.uniform3f(
      uniformLocations.branchColor!,
      GlobalVariables.branchColor[0],
      GlobalVariables.branchColor[1],
      GlobalVariables.branchColor[2]
    );
    gl.uniform1f(
      uniformLocations.dampeningFactor!,
      GlobalVariables.dampeningFactor
    );
    gl.uniform3f(
      uniformLocations.cellDimensions!,
      GlobalVariables.cellDimensions[0],
      GlobalVariables.cellDimensions[1],
      GlobalVariables.cellDimensions[2]
    );
    gl.uniform1i(uniformLocations.maxRayMarch!, GlobalVariables.maxRayMarch);
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
      const delta = now - lastTime;
      const deltaPerFrame = (now - lastFrameTime) * 0.001;
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
        if (!GlobalVariables.cameraBrakesInitiated) {
          GlobalVariables.cameraSpeed +=
            GlobalVariables.cameraAutopilotAcceleration * deltaPerFrame;
          GlobalVariables.cameraSpeed = Math.min(
            GlobalVariables.maxCameraSpeed,
            GlobalVariables.cameraSpeed
          );
        } else {
          GlobalVariables.cameraSpeed -=
            GlobalVariables.cameraAutopilotAcceleration * deltaPerFrame;
          GlobalVariables.cameraSpeed = Math.max(
            0,
            GlobalVariables.cameraSpeed
          );
        }
        Events.moveInDirecionOfCamera(
          GlobalVariables.cameraSpeed * deltaPerFrame
        );
      } else {
        if (Events.isUpArrowPressed) {
          if (!GlobalVariables.cameraBrakesInitiated) {
            GlobalVariables.cameraSpeed +=
              GlobalVariables.cameraKeypressAcceleration * deltaPerFrame;
            GlobalVariables.cameraSpeed = Math.min(
              GlobalVariables.maxCameraSpeed,
              GlobalVariables.cameraSpeed
            );
          } else {
            GlobalVariables.cameraSpeed -=
              GlobalVariables.cameraKeypressAcceleration * deltaPerFrame;
            GlobalVariables.cameraSpeed = Math.max(
              0,
              GlobalVariables.cameraSpeed
            );
          }
          Events.moveInDirecionOfCamera(
            GlobalVariables.cameraSpeed * deltaPerFrame
          );
        } else if (Events.isDownArrowPressed) {
          if (!GlobalVariables.cameraBrakesInitiated) {
            GlobalVariables.cameraSpeed -=
              GlobalVariables.cameraKeypressAcceleration * deltaPerFrame;
            GlobalVariables.cameraSpeed = Math.max(
              -GlobalVariables.maxCameraSpeed,
              GlobalVariables.cameraSpeed
            );
          } else {
            GlobalVariables.cameraSpeed +=
              GlobalVariables.cameraKeypressAcceleration * deltaPerFrame;
            GlobalVariables.cameraSpeed = Math.min(
              0,
              GlobalVariables.cameraSpeed
            );
          }
          Events.moveInDirecionOfCamera(
            GlobalVariables.cameraSpeed * deltaPerFrame
          );
        }
      }
      if (GlobalVariables.isBreathing) {
        GlobalVariables.breathingITime += deltaPerFrame;
        const breathingSinParam = GlobalVariables.breathingITime / 2;
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
  static getCanvasBlob = async (): Promise<Blob | null> => {
    const canvas = GlobalVariables.canvas as HTMLCanvasElement;
    if (!canvas) return null;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  };
}
export default Engine;
