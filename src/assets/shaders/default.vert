#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
layout (location = 0) in vec4 a_position;
layout (location = 1) in vec3 a_normal;

// A matrix to transform the positions by
uniform mat4 u_MVPMatrix;
uniform mat4 u_ModelInverseTransposeMatrix;

// varying to pass the normal to the fragment shader
out vec3 v_normal;

// all shaders have a main function
void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = u_MVPMatrix * a_position;
    v_normal = mat3(u_ModelInverseTransposeMatrix) * a_normal;
}
