var Promise = require('bluebird')
var glslify = require('glslify')
var baboon = require('baboon-image-uri')
var load = Promise.promisify(require('img'))
var domready = Promise.promisify(require('domready'))
var createTexture = require('gl-texture2d')
var lerp = require('lerp')
var touches = require('touch-position').emitter()

var images = [baboon, 'tex.jpg'].map(x => load(x))
domready()
    .then(() => Promise.all(images))
    .spread(ready)

function ready(image, displace) {
    var gl = require('webgl-context')({
        width: displace.width,
        height: displace.height
    })

    // if we wanted to enable retina scaling
    // require('canvas-fit')(gl.canvas, displace, window.devicePixelRatio)

    //turn the images into textures
    var tex = createTexture(gl, image)
    var tDisplace = createTexture(gl, displace)

    var draw = require('./draw-texture2d')(gl)
    var post = require('gl-post')(gl, glslify({
        vert: './shaders/post.vert',
        frag: './shaders/post.frag'
    }))

    var width = gl.drawingBufferWidth,
        height = gl.drawingBufferHeight

    var pad = 50
    var position = [ pad, pad ]
    var shape = [ width-pad*2, height-pad*2 ]

    function redraw() {
        //start drawing to the off-screen buffer
        post.bind()

        gl.clear(gl.COLOR_BUFFER_BIT)


        draw(tex, {
            position: position,
            shape: shape
        })

        //setup our post shader with the effect
        post.shader.bind()
        post.shader.uniforms.tDisplace = 1
        tDisplace.bind(1)

        //draw to the screen
        post.draw()
    }

    touches.on('move', function(ev) {
        ev.preventDefault()
        var str = touches.position[0] / displace.width
        update(str)
    })

    function update(strength) {
        var params = [
            1/3,
            1,
            lerp(0.2, 0.8, strength||0)
        ]
        post.shader.bind()
        post.shader.uniforms.params = params
        redraw()
    }

    update()
    document.body.appendChild(gl.canvas)
}