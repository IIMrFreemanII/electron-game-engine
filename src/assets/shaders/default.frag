#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

in vec3 out_rgb;

// we need to declare an output for the fragment shader
out vec3 outColor;

void main() {
    // Just set the output to a constant reddish-purple
    outColor = out_rgb;
}
