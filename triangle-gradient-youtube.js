const generateVertexShader = () => `
  precision mediump float;

  attribute vec3 vertPosition;
  attribute vec3 vertColor;

  varying vec3 fragColor;

  uniform mat4 mWorld;
  uniform mat4 mView;
  uniform mat4 mProj;

  void main() {
    fragColor = vertColor;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
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
    // X, Y, Z      R, G, B
    0, 0.5, 0,      0, 1, 1,
    -0.5, -0.5, 0,  1, 0, 1,
    0.5, -0.5, 0,   1, 1, 0,
  ]);

  // Create a buffer, bind it, and pass it our triangle vertices data
  const triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);


  // Set position
  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');

  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // Number of elements per attribute (it's a vec3, x/y/z)
    gl.FLOAT, // Type of elements
    gl.FALSE, // Is the data normalized? Don't worry for now.
    6 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
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
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );

  gl.enableVertexAttribArray(colorAttribLocation);

  // Tell OpenGL which program should be active
  gl.useProgram(program);

  const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  const worldMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const projMatrix = new Float32Array(16);

  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


  // Main render loop!
  const identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);

  let angle = 0;
  const loop = () => {
    angle = performance.now() / 1000 / 6 * 2 * Math.PI;

    mat4.rotate(worldMatrix, identityMatrix, angle, [1, 1, 1]);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.drawArrays(
      // draw type, skip, num to draw
      gl.TRIANGLES, 0,    3
    );

    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);

}


start();
