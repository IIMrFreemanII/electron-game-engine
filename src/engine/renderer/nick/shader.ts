import { SHADER_DATA_TYPE_TO_DEFAULT_VALUE, ShaderDataType } from "./webgl-constants";

export type Uniforms = Record<
  string,
  {
    type: ShaderDataType;
    value: any;
    setter: (value: any) => void;
  }
>;

export class Shader {
  public readonly name: string;
  public uniforms: Uniforms;

  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;

  constructor(gl: WebGL2RenderingContext, name: string, vertSrc: string, fragScr: string) {
    this.gl = gl;
    this.name = name;

    // create GLSL shaders, upload the GLSL source, compile the shaders
    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertSrc);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragScr);

    // Link the two shaders into a program
    this.program = this.createProgram(vertexShader, fragmentShader);
    this.uniforms = this.extractUniforms(vertSrc, fragScr);
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

    // delete shaders when program is linked
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);

    return program;
  }

  public getUniforms() {}

  public getAttributes() {}

  private extractUniforms(vertSrc: string, fragSrc: string): Uniforms {
    const vertUniforms = vertSrc.match(/uniform \w+ \w+/g);
    const vertResult = vertUniforms?.reduce((acc, item) => {
      const [_, type, name] = item.split(" ");
      const location = this.getUniformLocation(name);
      const value = SHADER_DATA_TYPE_TO_DEFAULT_VALUE[type];
      const setter = this.getUniformSetterByType(type as ShaderDataType)(location);

      return {
        ...acc,
        [name]: {
          type,
          value,
          setter,
        },
      };
    }, {});

    const fragUniforms = fragSrc.match(/uniform \w+ \w+/g);
    const fragResult = fragUniforms?.reduce((acc, item) => {
      const [_, type, name] = item.split(" ");
      const location = this.getUniformLocation(name);
      const value = SHADER_DATA_TYPE_TO_DEFAULT_VALUE[type];
      const setter = this.getUniformSetterByType(type as ShaderDataType)(location);

      return {
        ...acc,
        [name]: {
          type,
          value,
          setter,
        },
      };
    }, {});

    return { ...vertResult, ...fragResult };
  }

  public getAttribLocation(name: string) {
    return this.gl.getAttribLocation(this.program, name);
  }

  private getUniformSetterByType(type: ShaderDataType) {
    switch (type) {
      case "float":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniform1f(location, value);
      case "vec2":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniform2fv(location, value);
      case "vec3":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniform3fv(location, value);
      case "vec4":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniform4fv(location, value);
      case "mat3":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniformMatrix3fv(location, false, value);
      case "mat4":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniformMatrix4fv(location, false, value);
      case "int":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniform1i(location, value);
      case "ivec2":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniform2iv(location, value);
      case "ivec3":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniform3iv(location, value);
      case "ivec4":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniform4iv(location, value);
      case "bool":
        return (location: WebGLUniformLocation | null) => (value: any) =>
          this.gl.uniform1i(location, value);
    }
  }

  public getUniformLocation(name: string) {
    return this.gl.getUniformLocation(this.program, name);
  }

  public bind() {
    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(this.program);
  }

  public setUniforms() {
    for (const uniformsKey in this.uniforms) {
      this.uniforms[uniformsKey].setter(this.uniforms[uniformsKey].value);
    }
  }

  public unbind() {
    this.gl.useProgram(null);
  }

  public destroy() {
    this.gl.deleteProgram(this.program);
  }
}
