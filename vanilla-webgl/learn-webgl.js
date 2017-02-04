// Tutorial from http://learningwebgl.com/blog/?p=28

function webGLStart() {
  const gl = initGL('#glcanvas');

  initGL(canvas);

  const mvMatrix = mat4.create();
  const pMatrix = mat4.create();

  const shaderProgram = initShaders(gl);

  // Create our buffers
  const triangleVertexPositionBuffer = createBuffer(gl, {
    itemSize: 3,
    numItems: 3,
    vertices: [
       0,  1, 0,
      -1, -1, 0,
       1, -1, 0,
    ],
  });
  const squareVertexPositionBuffer = createBuffer(gl, {
    itemSize: 3,
    numItems: 4,
    vertices: [
       1,  1, 0,
      -1,  1, 0,
       1, -1, 0,
      -1, -1, 0,
    ],
  });

  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  drawScene();
}

function initGL(selector) {
  const canvas = document.querySelector(selector);
  const gl = canvas.getContext('webgl');
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  return gl;
}

function initShaders(gl) {
  const vertexShader = getShader(gl, 'shader-vs');
  const fragmentShader = getShader(gl, 'shader-fs');

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialize shaders");
  }

  gl.useProgram(shaderProgram);

  return shaderProgram;
}

function createBuffer(gl, { vertices, itemSize, numItems }) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  buffer.itemSize = itemSize;
  buffer.numItems = numItems;

  return buffer;
}

function drawScene(gl) {
  // SETUP
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set our perspective mode so that items further away appear smaller.
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100, pMatrix);


  // TRIANGLE
  //
  // Run our identity matrix transform, to establish initial position
  // (presumably because previous `drawScene` calls move it?)
  // Do some logging to test this.
  mat4.identity(mvMatrix);

  // Move our model-view matrix back and to the left, to position our triangle.
  mat4.translate(mvMatrix, [-1.5, 0, -7]);

  // Set our triangle buffer as the 'current' buffer, and let it know that
  // it's a position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    triangleVertexPositionBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  // Move all of our vertex position matrix stuff onto the graphics card
  setMatrixUniforms();

  // Draw our triangle
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);


  // SQUARE
  //
  // Move 3 positions to the right.
  // Since we're already 1.5 to the left and 7 back, our new position will
  // become [1.5, 0, -7]. These are relative translates, not absolute.
  mat4.translate(mvMatrix, [3, 0, 0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    squareVertexPositionBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );

  setMatrixUniforms();

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}
