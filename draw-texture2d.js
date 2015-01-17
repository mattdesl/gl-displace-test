var DefaultShader = require('gl-basic-shader')
var Batch = require('gl-sprite-batch')
var ortho = require('gl-mat4/ortho')
var identity = require('gl-mat4/identity')

var weakMap = typeof WeakMap === 'undefined' ? require('weak-map') : WeakMap

var cache = new weakMap()
var projection = identity([])
var zero = [0, 0]
var texcoord = [0, 0, 1, 1]
var color = [1, 1, 1, 1]

module.exports = function(gl, opt) {
    opt = opt||{}

    var cached
    //if user supplies both batch/shader, no need
    //to compile anything yet
    if (!opt.batch || !opt.shader)
        cached = getCached(gl)

    var batch = opt.batch || cached.batch
    var shader = opt.shader || cached.shader

    return function (texture, data) {
        batch.clear()
        batch.bind(shader)

        shader.uniforms.texture0 = 0

        var width = gl.drawingBufferWidth,
            height = gl.drawingBufferHeight

        //setup top-left ortho projection
        ortho(projection, 0, width, height, 0, 0, 1)
        shader.uniforms.projection = projection

        batch.texture = texture
        batch.position = (data && data.position) || zero
        batch.color = (data && data.color) || color
        batch.shape = (data && data.shape) || texture.shape
        batch.texcoord = (data && data.texcoord) || texcoord

        batch.push()
        batch.draw()
        batch.unbind()
    }
}

function getCached(gl) {
    var result = cache.get(gl)
    if (!result) {
        result = {
            batch: Batch(gl, { 
                dynamic: true, 
                capacity: 1,
                premultiplied: true
            }),
            shader: DefaultShader(gl, { texcoord: true, color: true })
        }

        cache.set(gl, result)
    }
    return result
}