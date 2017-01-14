const generateVertexShader = () => `
  precision mediump float;

  attribute vec2 vertPosition;
  attribute vec3 vertColor;

  varying vec3 fragColor;

  void main() {
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
  }
`;

const generateFragmentShader = () => `
  precision mediump float;

  varying vec3 fragColor;

  void main() {
    gl_FragColor = vec4(fragColor, 1.0);
  }
`;

function start() {
  const canvas = document.querySelector('#glcanvas');

  const gl = canvas.getContext('webgl');

  console.log(gl.VERTEX_SHADER);

  gl.clearColor(0.75, 0.85, 0.8, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create our shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, generateVertexShader());
  gl.compileShader(vertexShader);

  // Verify that our shader compiled
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error("Error compiling vertex shader", gl.getShaderInfoLog(vertexShader));
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, generateFragmentShader());
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error("Error compiling fragment shader", gl.getShaderInfoLog(fragmentShader));
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error', gl.getProgramInfoLog(program));
  }

  // Do this only in dev mode.
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('Program validation error', gl.getProgramInfoLog(program));
  }



  // Create an array of 32-bit floats, consisting of our triangle data
  const triangleVertices = new Float32Array([
    // X, Y       R, G, B
    0, 0.5,      1, 1, 0,
    -0.5, -0.5,   0, 1, 1,
    0.5, -0.5,    1, 0, 1,
  ]);

  // Create a buffer, bind it, and pass it our triangle vertices data
  const triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);


  // Set position
  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');

  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    2, // Number of elements per attribute (it's a vec2)
    gl.FLOAT, // Type of elements
    gl.FALSE, // Is the data normalized? Don't worry for now.
    5 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
    0// offset from the beginning of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);


  // Set colors
  const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );

  gl.enableVertexAttribArray(colorAttribLocation);


  // Main render loop!
  gl.useProgram(program);
  gl.drawArrays(
    // draw type, skip, num to draw
    gl.TRIANGLES, 0,    3
  );
}


start();
