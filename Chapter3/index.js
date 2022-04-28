/** 定点着色器 */
const vsSource = `
  attribute vec4 aVertexPosition;

  void main() {
    gl_Position = aVertexPosition;
  }
`
/** 片段着色器 */
const fsSource = `
  precision mediump float;
  uniform vec4 uColor;
  void main() {
    gl_FragColor = uColor;
  }
`

window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas-webgl');
  const gl = canvas.getContext('webgl');

  if (!gl) return alert('游览器暂不支持wegGl')

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  /** 初始化着色器程序 */
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)
  /** 先提前获取相关数据，挂载到着色器上方便使用 */
  shaderProgram.aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  shaderProgram.uColor = gl.getUniformLocation(shaderProgram, 'uColor')

  /** 原始三角形定点信息 */
  const vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
  ])

  draw(gl, shaderProgram, vertices)
  
})

function draw (gl, shaderProgram, vertices) {
  /** 存储所有三角形顶点数据 */
  const totalVertices = new Float32Array(3 * 2 * 4)
  /** 平移三角形平移量 */
  const translation = 0.5
  /** 缩放三角形缩放量 */
  const scale = 0.5
  /** 初始化原始三角形顶点信息 */
  for (let i = 0; i < 3 * 2; i+=2) {
    totalVertices[i]      = vertices[i]
    totalVertices[i + 1]  = vertices[i + 1]
  }

  /** 初始化平移三角形顶点信息 */
  for (let i = 0; i < 3 * 2 ; i+=2) {
    const index = i + 3 * 2
    totalVertices[index]      = vertices[i] + translation
    totalVertices[index + 1]  = vertices[i + 1] + translation
  }

  for (let i = 0; i < 3 * 2; i+=2) {
    const index = i + 3 * 2 + 3 * 2
    totalVertices[index]      = vertices[i] * scale
    totalVertices[index + 1]  = vertices[i + 1] * scale
  }

  console.log(totalVertices)

  initVertexBuffers(gl, shaderProgram, totalVertices)

  gl.clear(gl.COLOR_BUFFER_BIT)
  /** 设置原始三角形颜色为白色 */
  gl.uniform4f(shaderProgram.uColor, 1.0, 1.0, 1.0, 1.0)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  /** 设置偏移三角形颜色为红色 */
  gl.uniform4f(shaderProgram.uColor, 1.0, 0.0, 0.0, 1.0)
  gl.drawArrays(gl.TRIANGLES, 3, 3)
  /** 设置缩放三角形颜色为绿色 */
  gl.uniform4f(shaderProgram.uColor, 0.0, 1.0, 0.0, 1.0)
  gl.drawArrays(gl.TRIANGLES, 6, 3)
}

function initVertexBuffers(gl, shaderProgram, vertices) {
  /** 创建缓冲区对象 */
  const vertexBuffer = gl.createBuffer()

  /** 将缓冲区对象绑定到目标 */
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  /** 向缓冲区对象写入数据 */
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  /** 将缓冲区对象分配给aVertexPosition变量 */
  gl.vertexAttribPointer(shaderProgram.aVertexPosition, 2, gl.FLOAT, false, 0, 0)

  /** 允许aVertexPosition变量接收数据 */
  gl.enableVertexAttribArray(shaderProgram.aVertexPosition)
}