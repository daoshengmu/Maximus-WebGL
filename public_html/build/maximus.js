/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Maximus = { REVISION: '66' };

Maximus.WebGLRenderer = function() {
    var _this = this;
    var _gl;

    this.initGL = function(canvas) {
       try {
           _gl = canvas.getContext("experimental-webgl");
           _gl.viewportWidth = canvas.width;
           _gl.viewportHeight = canvas.height;       
       }    
       catch(e) {

       }

       if ( !_gl ) {
           alert("Could not initialise WebGL...");
       }

       _gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
       _gl.enable(_gl.DEPTH_TEST);
    };

    this.setClearColor = function( r, g, b, a ) {
        _gl.clearColor( r, g, b, a );
    };

    function getShader( context, id ) {
        var shaderScript = id;
        if ( !shaderScript ) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while ( k ) {
            if ( k.nodeType === 3 ) {
                str += k.textContent;
            }

            k = k.nextSibling;
        }

        var shader;
        if ( shaderScript.type === "x-shader/x-fragment" ) {
            shader = context.createShader(_gl.FRAGMENT_SHADER);
        } else if ( shaderScript.type === "x-shader/x-vertex" ) {
            shader = context.createShader(_gl.VERTEX_SHADER);
        } else {
            return null;
        }

        context.shaderSource(shader, str);
        context.compileShader(shader);

        if ( !context.getShaderParameter(shader, context.COMPILE_STATUS) ) {
            alert( context.getShaderInfoLog(shader) );
            return null;
        }

        return shader;
    }

    var shaderProgram;
    this.initShaders = function( vs, fs ) {

        var vertexShader = getShader(_gl, vs);
        var fragmentShader = getShader(_gl, fs);

        shaderProgram = _gl.createProgram();
        _gl.attachShader( shaderProgram, vertexShader );
        _gl.attachShader( shaderProgram, fragmentShader );
        _gl.linkProgram( shaderProgram );

        if ( !_gl.getProgramParameter( shaderProgram, _gl.LINK_STATUS ) ) {

            alert( "Could not initialise shaders" );
        }

        _gl.useProgram( shaderProgram );

        shaderProgram.vertexPositionAttribute = _gl.getAttribLocation(shaderProgram, "POSITION");
        _gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute );
        shaderProgram.pMatrixUniform = _gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = _gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    function setMatrixUniform() {
        _gl.uniformMatrix4fv( shaderProgram.pMatrixUniform, false, pMatrix );
        _gl.uniformMatrix4fv( shaderProgram.mvMatrixUniform, false, mvMatrix );    
    }

    var squareVertexPositionBuffer;
    this.initBuffers = function() {
        squareVertexPositionBuffer = _gl.createBuffer();
        _gl.bindBuffer( _gl.ARRAY_BUFFER, squareVertexPositionBuffer );

        var vertices = [
          1.0, 1.0, 0.0,
          -1.0, 1.0, 0.0,
          1.0, -1.0, 0.0,
          -1.0, -1.0, 0.0
        ];

        _gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array(vertices), _gl.STATIC_DRAW );
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 4;
    };

    this.drawScene = function() {
        _gl.viewport( 0, 0, _gl.viewportWidth, _gl.viewportHeight );
        _gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );

        mat4.perspective( 45, _gl.viewportWidth / _gl.viewportHeight, 0.1, 100.0, pMatrix );

        mat4.identity( mvMatrix );
        mat4.translate( mvMatrix, [0.0, 0.0, -7.0] );

        _gl.bindBuffer(_gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        _gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize,
                        _gl.FLOAT, false, 0, 0 );

        setMatrixUniform();
        _gl.drawArrays( _gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems );
    };

};