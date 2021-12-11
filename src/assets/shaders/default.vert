#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
layout (location = 0) in vec4 a_position;
layout (location = 1) in vec3 a_normal;

// A matrix to transform the positions by
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
//uniform mat4 u_mvpMatrix;
uniform mat4 u_modelInverseTransposeMatrix;

// varying to pass the normal to the fragment shader
out vec3 v_normal;

// all shaders have a main function
void main() {

    // gl_Position is a special variable a vertex shader is responsible for setting
     gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * a_position;
//    gl_Position = u_mvpMatrix * a_position;
    v_normal = mat3(transpose(inverse(u_modelMatrix))) * a_normal;
}
