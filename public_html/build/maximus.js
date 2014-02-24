/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var Maximus = { REVISION: '66' };

Maximus.Math = {
    
    degToRad: function( degrees ) {
        var degreeToRadiansFactor = Math.PI / 180;

        return function ( degrees ) {

                return degrees * degreeToRadiansFactor;

        };
    }()
    
};

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

        _gl.deleteShader( vertexShader );
        _gl.deleteShader( fragmentShader );
        if ( !_gl.getProgramParameter( shaderProgram, _gl.LINK_STATUS ) ) {

            alert( "Could not initialise shaders" );
        }

        _gl.useProgram( shaderProgram );

        shaderProgram.vertexPositionAttribute = _gl.getAttribLocation(shaderProgram, "POSITION");
        _gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute );
        shaderProgram.vertexColorAttribute = _gl.getAttribLocation(shaderProgram, "COLOR");
        _gl.enableVertexAttribArray( shaderProgram.vertexColorAttribute );
        shaderProgram.vertexNormalAttribute = _gl.getAttribLocation(shaderProgram, "NORMAL");
        _gl.enableVertexAttribArray( shaderProgram.vertexNormalAttribute );
       
        shaderProgram.pMatrixUniform = _gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = _gl.getUniformLocation(shaderProgram, "uMVMatrix");
        
        // Lambert lighting
        shaderProgram.matDiffuse = _gl.getUniformLocation(shaderProgram, "matDiffuse");
        shaderProgram.lightDir = _gl.getUniformLocation(shaderProgram, "lightDir");
        shaderProgram.lightColor = _gl.getUniformLocation(shaderProgram, "lightColor");
    };

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var viewMtx = mat4.create();
    var matDiffuse = new Float32Array( [ 1.0, 0.0, 0.0, 1.0 ] );
    mat4.identity( viewMtx );
    
    function _setMatrixUniform() {
        _gl.uniformMatrix4fv( shaderProgram.pMatrixUniform, false, pMatrix );
        _gl.uniformMatrix4fv( shaderProgram.mvMatrixUniform, false, mvMatrix );    
    }
    
    function _setMaterialColor() {
        _gl.uniform4fv( shaderProgram.matDiffuse, matDiffuse );
    }
    
    var lightDir = new Float32Array( [ 0.0, 0.0, 1.0, 0.0 ] );
    var lightColor = new Float32Array( [ 1, 1, 1, 1.0 ] );
    
    function _setLight() {
        _gl.uniform4fv( shaderProgram.lightDir, lightDir );
        _gl.uniform4fv( shaderProgram.lightColor, lightColor );
    }

    var cubeVertexBuffer;
    var cubeIndexBuffer;
    this.initBuffers = function() {
        cubeVertexBuffer = _gl.createBuffer();
        _gl.bindBuffer( _gl.ARRAY_BUFFER, cubeVertexBuffer );

//        var vertices = [
//          1.0, 1.0, 0.0,
//          -1.0, 1.0, 0.0,
//          1.0, -1.0, 0.0,
//          -1.0, -1.0, 0.0
//        ];

        var vertices = [
          // Front face
          -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,  
          1.0, -1.0, 1.0,  0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
          1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
          -1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
          
          // Back face
          -1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0,  
          -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0,
          1.0, 1.0, -1.0,  0.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0,
          1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0,
          
          // Top face
          -1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0,  
          -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
          1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0,
          1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
          
          // Bottom face
          -1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0,
          1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, -1.0, 0.0,
          1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0,
          -1.0, -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, -1.0, 0.0,
          
          // Right face
          1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,
          1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,
          1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0,
          1.0, -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0,
          
          // Left face
          -1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0,
          -1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, -1.0, 0.0, 0.0,
          -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0,
          -1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0, 0.0
        ];

        _gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array(vertices), _gl.STATIC_DRAW );
        cubeVertexBuffer.itemSize = 10;
        cubeVertexBuffer.numItems = 24;
        
        cubeIndexBuffer = _gl.createBuffer();
        _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer );
        var cubeIndices = [
            0, 1, 2,    0, 2, 3,
            4, 5, 6,    4, 6, 7,
            8, 9, 10,   8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ];
        
        _gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), _gl.STATIC_DRAW );
        cubeIndexBuffer.itemSize = 1;
        cubeIndexBuffer.numItems = 36;
    };

    this.drawScene = function( worldMtx ) {
        _gl.viewport( 0, 0, _gl.viewportWidth, _gl.viewportHeight );
        _gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );

        mat4.perspective( 45, _gl.viewportWidth / _gl.viewportHeight, 0.1, 100.0, pMatrix );

       // mat4.identity( mvMatrix );
        mat4.multiply( worldMtx, viewMtx, mvMatrix );
     //   mat4.translate( mvMatrix, [0.0, 0.0, -7.0] );

        _gl.bindBuffer( _gl.ARRAY_BUFFER, cubeVertexBuffer );
        _gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3,
                        _gl.FLOAT, false, 4 * 10, 0 );
        _gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4,
                        _gl.FLOAT, false, 4 * 10, 3 * 4 );
        _gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3,
                        _gl.FLOAT, false, 4 * 10, (3 + 4) * 4 );
                   
        _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer );
        _setMatrixUniform();
        _setMaterialColor();
        _setLight();
       // _gl.drawArrays( _gl.TRIANGLE_STRIP, 0, cubeVertexBuffer.numItems );
        _gl.drawElements( _gl.TRIANGLES, cubeIndexBuffer.numItems, _gl.UNSIGNED_SHORT, 0 );
    };

};