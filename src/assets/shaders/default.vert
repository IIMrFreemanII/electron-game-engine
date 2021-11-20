#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;
in vec3 in_rgb;

out vec3 out_rgb;

// all shaders have a main function
void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = vec4(a_position, 0, 1.0);
    out_rgb = in_rgb;
}
