export class Shader {
  public readonly name: string;

  private readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
  private readonly program: WebGLProgram;

  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    name: string,
    vertSrc: string,
    fragScr: string,
  ) {
    this.gl = gl;
    this.name = name;

    // create GLSL shaders, upload the GLSL source, compile the shaders
    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertSrc);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragScr);

    // Link the two shaders into a program
    this.program = this.createProgram(vertexShader, fragmentShader);
  }

  private compileShader(shaderType, shaderSource: string) {
    // Create the shader object
    const shader = this.gl.createShader(shaderType) as WebGLShader;

    // Set the shader source code.
    this.gl.shaderSource(shader, shaderSource);

    // Compile the shader
    this.gl.compileShader(shader);

    // Check if it compiled
    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (!success) {
      // Something went wrong during compilation; get the error
      throw "could not compile shader:" + this.gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  private createProgram(vertexShader, fragmentShader) {
    // create a program.
    const program = this.gl.createProgram() as WebGLProgram;

    // attach the shaders.
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);

    // link the program.
    this.gl.linkProgram(program);

    // Check if it linked.
    const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!success) {
      // something went wrong with the link; get the error
      throw "program failed to link:" + this.gl.getProgramInfoLog(program);
    }

    return program;
  }

  public getUniforms() {}

  public getAttributes() {}

  public getAttribLocation(name: string) {
    return this.gl.getAttribLocation(this.program, name);
  }

  public bind() {
    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(this.program);
  }

  public unbind() {
    this.gl.useProgram(null);
  }
}

/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
export function compileShader(gl, shaderType, shaderSource) {
  // Create the shader object
  const shader = gl.createShader(shaderType);

  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check if it compiled
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  const program = gl.createProgram();

  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link the program.
  gl.linkProgram(program);

  // Check if it linked.
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    // something went wrong with the link; get the error
    throw "program failed to link:" + gl.getProgramInfoLog(program);
  }

  return program;
}

/**
 * Creates a shader from the content of a script tag.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} scriptId The id of the script tag.
 * @param {string} opt_shaderType. The type of shader to create.
 *     If not passed in will use the type attribute from the
 *     script tag.
 * @return {!WebGLShader} A shader.
 */
export function createShaderFromScript(gl, scriptId, opt_shaderType) {
  // look up the script tag by id.
  const shaderScript = document.getElementById(scriptId) as HTMLScriptElement;
  if (!shaderScript) {
    throw "*** Error: unknown script element" + scriptId;
  }

  // extract the contents of the script tag.
  const shaderSource = shaderScript.text;

  // If we didn't pass in a type, use the 'type' from
  // the script tag.
  if (!opt_shaderType) {
    if (shaderScript.type == "x-shader/x-vertex") {
      opt_shaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type == "x-shader/x-fragment") {
      opt_shaderType = gl.FRAGMENT_SHADER;
    } else if (!opt_shaderType) {
      throw "*** Error: shader type not set";
    }
  }

  return compileShader(gl, opt_shaderType, shaderSource);
}

/**
 * Creates a program from 2 script tags.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} vertexShaderId The id of the vertex shader script tag.
 * @param {string} fragmentShaderId The id of the fragment shader script tag.
 * @return {!WebGLProgram} A program
 */
export function createProgramFromScripts(gl, vertexShaderId, fragmentShaderId) {
  const vertexShader = createShaderFromScript(gl, vertexShaderId, gl.VERTEX_SHADER);
  const fragmentShader = createShaderFromScript(gl, fragmentShaderId, gl.FRAGMENT_SHADER);
  return createProgram(gl, vertexShader, fragmentShader);
}
