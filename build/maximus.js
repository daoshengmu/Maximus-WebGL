/* 
 * Maximus, a WebGL renderering framework
 * author: daoshengmu, http://dsmu.me
 * date: 03/16/2017
 */

var Maximus = { REVISION: '1.1.1' };

Maximus.Param = {
  RGBAFormat: 1000,
  DEPTH16Format: 1001,
  DEPTH_COMPONENTFormat: 1002,

  COLOR_ATTACHMENT0: 1010,
  DEPTH_ATTACHMENT: 1011,

  UNSIGNED_BYTE: 1020,
  UNSIGNED_SHORT: 1021,
};

function paramToGL(gl, p) {
  if (p == Maximus.Param.RGBAFormat) { return gl.RGBA; }
  if (p == Maximus.Param.DEPTH16Format) { return gl.DEPTH_COMPONENT16; }
  if (p == Maximus.Param.DEPTH_COMPONENTFormat) { return gl.DEPTH_COMPONENT; }
  if (p == Maximus.Param.COLOR_ATTACHMENT0) { return gl.COLOR_ATTACHMENT0; }
  if (p == Maximus.Param.DEPTH_ATTACHMENT) { return gl.DEPTH_ATTACHMENT; }
  if (p == Maximus.Param.UNSIGNED_BYTE) { return gl.UNSIGNED_BYTE; }
  if (p == Maximus.Param.UNSIGNED_SHORT) { return gl.UNSIGNED_SHORT; }
}

Maximus.Math = {
    
  degToRad: function( degrees ) {
    var degreeToRadiansFactor = Math.PI / 180;

    return function ( degrees ) {
      return degrees * degreeToRadiansFactor;
    };
  }()    
};

Maximus.Vector3 = function( x, y, z ) {
  this.x = x | 0;
  this.y = y | 0;
  this.z = z | 0;
};

Maximus.Vector3.prototype = {

  constructor: Maximus.Vector3,

  subVectors: function( a, b ) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;

    return this;
  },

  cross: function( v ) {
    var x = this.x, y = this.y, z = this.z;

    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;

    return this;
  },

  length: function() {
    return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
  },

  divideScalar: function( scalar ) {
    if ( scalar !== 0 ) {

      var invScalar = 1 / scalar;

      this.x *= invScalar;
      this.y *= invScalar;
      this.z *= invScalar;

    } else {

      this.x = 0;
      this.y = 0;
      this.z = 0;

    }

    return this;
  },

  normalize: function() {
    return this.divideScalar( this.length() );
  }
};

Maximus.LambertMaterial = function( color, shader, texture ) {
    var _color = color;
    var _texture = texture;
    var _shader = shader;
    
    this.getColor = function() {
      return _color;  
    };

    this.getTexture = function() {
      return _texture;
    }

    this.setTexture = function(tex) {
      _texture = tex;
    }

    this.getShader = function() {
      return _shader;
    }
};

Maximus.DirectionalLight = function( color, intensity, direction ) {
    
    var _color = color;
    var _intensity = intensity;
    var _direction = vec3.create();
    
    vec3.normalize( _direction, direction );
    
    this.getDirection = function() {
        return _direction;
    };
    
    this.getColor = function() {
        return _color;
    };
    
    this.getIntensity = function() {
        return _intensity;
    };
};

Maximus.Geometry = function() {
  var _vertexBuffer;
  var _indexBuffer;
  var _material;
  var _worldMatrix = mat4.create();

  this.init = function( renderer, mtr ) {
    _material = mtr;
  };

  this.createVertexBuffer = function( renderer, vtxData, itemSize, numItems ) {
    var gl = renderer.getContext();
    
    _vertexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, _vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vtxData), gl.STATIC_DRAW );
    _vertexBuffer.itemSize = itemSize;
    _vertexBuffer.numItems = numItems;
  }

  this.createIndexBuffer = function( renderer, indexData, itemSize, numItems ) {
    var gl = renderer.getContext();

    _indexBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, _indexBuffer );
    
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW );
    _indexBuffer.itemSize = itemSize;
    _indexBuffer.numItems = numItems;
  }

  this.getVertexBuffer = function() {
    return _vertexBuffer;
  };
  
  this.getIndexBuffer = function() {
    return _indexBuffer;
  };
  
  this.getMaterial = function() {
    return _material;
  };

  this.setWorldMatrix = function( mtx ) {
    _worldMatrix = mtx;
  };

  this.getWorldMatrix = function() {
    return _worldMatrix;
  };
}

Maximus.Cube = function() {
    var _cubeVertexBuffer;
    var _cubeIndexBuffer;
    var _material;
    var _worldMatrix = mat4.create();
    
    this.init = function( renderer, mtr ) {
        _material = mtr;
        var gl = renderer.getContext();
        
        _cubeVertexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, _cubeVertexBuffer );

        var vertices = [ //(POS 3, COLOR 4, NORMAL 3, UV 2)
          // Front face
          -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,  
          1.0, -1.0, 1.0,  0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
          1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0,
          -1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
          
          // Back face
          -1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0,  
          -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 1.0, 0.0,
          1.0, 1.0, -1.0,  0.0, 0.0, 1.0, 1.0, 0.0, 0.0, -1.0, 1.0, 1.0,
          1.0, -1.0, -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 1.0,
          
          // Top face
          -1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0,
          -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
          1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0,
          1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
          
          // Bottom face
          -1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0, 0.0, 0.0,
          1.0, -1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.0,
          1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 1.0,
          -1.0, -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, -1.0, 0.0, 0.0, 1.0,
          
          // Right face
          1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0,
          1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
          1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0,
          1.0, -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
          
          // Left face
          -1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, -1.0, 0.0, 0.0, 0.0, 0.0,
          -1.0, -1.0, 1.0, 0.0, 1.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0,
          -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 1.0,
          -1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0, -1.0, 0.0, 0.0, 0.0, 1.0
        ];

        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
        _cubeVertexBuffer.itemSize = 12;
        _cubeVertexBuffer.numItems = 24;
        
        _cubeIndexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, _cubeIndexBuffer );
        var cubeIndices = [
            0, 1, 2,    0, 2, 3,
            4, 5, 6,    4, 6, 7,
            8, 9, 10,   8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ];
        
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW );
        _cubeIndexBuffer.itemSize = 1;
        _cubeIndexBuffer.numItems = 36;
        
    };
    
    this.getVertexBuffer = function() {
        return _cubeVertexBuffer;
    };
    
    this.getIndexBuffer = function() {
        return _cubeIndexBuffer;
    };   
    
    this.getMaterial = function() {
        return _material;
    };
    
    this.setWorldMatrix = function( mtx ) {
      _worldMatrix = mtx;
    };

    this.getWorldMatrix = function() {
      return _worldMatrix;
    };
};

// The method of constructing sphere geometry referes here, http://learningwebgl.com/blog/?p=1253
Maximus.Sphere = function() {
    var _sphereVertexBuffer;
    var _sphereIndexBuffer;
    var _material;
    var _worldMatrix = mat4.create();
    
    this.init = function( renderer, mtr, radius, latitudeBands, longitudeBands ) {
        _material = mtr;
        var gl = renderer.getContext();
        
        _sphereVertexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, _sphereVertexBuffer );

        radius = radius || 1;

        latitudeBands = Math.max( 8, Math.floor( latitudeBands ) || 30 );
        longitudeBands = Math.max( 8, Math.floor( longitudeBands ) || 30 );

        var vertices = [];
        var indices = [];
        var x, y, verticesTemp = [], uvs = [];
        var itemSize = 12; // POS3 + COLOR4 + NORMAL3 + UV2

        // Generate vertex data
        for ( var latNumber = 0; latNumber <= latitudeBands; latNumber++ ) {
          var theta = latNumber * Math.PI / latitudeBands;
          var sinTheta = Math.sin(theta);
          var cosTheta = Math.cos(theta);

           for ( var longNumber = 0; longNumber <= longitudeBands; longNumber++ ) {
              var phi = longNumber * 2 * Math.PI / longitudeBands;
              var sinPhi = Math.sin(phi);
              var cosPhi = Math.cos(phi);

              var x = cosPhi * sinTheta;
              var y = cosTheta;
              var z = sinPhi * sinTheta;
              var u = 1 - (longNumber / longitudeBands);
              var v = 1 - (latNumber / latitudeBands);

              // Add POSITION
              vertices.push( radius * x, radius * y, radius * z );

              // Add COLOR4
              vertices.push( 1.0, 0.0, 0.0, 1.0 );

              // Add NORMAL
              vertices.push( x, y, z );

              // Add UV
              vertices.push( u, v);
          }
        }

        _sphereIndexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, _sphereIndexBuffer );
        // Generate index data
        for ( var latNumber = 0; latNumber < latitudeBands; latNumber++ ) {
          for ( var longNumber = 0; longNumber < longitudeBands; longNumber++ ) {

            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;

            indices.push( first, second, first + 1 );
            indices.push( second, second + 1, first + 1 );
          }
        }

        _material = mtr;
        var gl = renderer.getContext();
        
        _sphereVertexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, _sphereVertexBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
        _sphereVertexBuffer.itemSize = itemSize;
        _sphereVertexBuffer.numItems = vertices.length / _sphereVertexBuffer.itemSize;
        
        _sphereIndexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, _sphereIndexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );
        _sphereIndexBuffer.itemSize = 1;
        _sphereIndexBuffer.numItems = indices.length;
    };

    this.getVertexBuffer = function() {
      return _sphereVertexBuffer;
    };
    
    this.getIndexBuffer = function() {
      return _sphereIndexBuffer;
    };   
    
    this.getMaterial = function() {
      return _material;
    };

    this.setWorldMatrix = function(mtx) {
      _worldMatrix = mtx;
    };

    this.getWorldMatrix = function() {
      return _worldMatrix;
    };
};

Maximus.WebGLRenderer = function() {
    var _this = this;
    var _gl;

    this.initGL = function(canvas) {
       try {
          _gl = canvas.getContext('webgl2');
          let isWebGL2 = !!_gl;
          if (!isWebGL2) { // try to fallback to webgl 1
              _gl = canvas.getContext('webgl') ||
                    canvas.getContext('experimental-webgl');
          }
          if (!_gl) {
              console.log('your browser does not support WebGL');
          }
          _this.setSize( canvas.width, canvas.height );
       }    
       catch(e) {
          console.log( "initGL exception:" + e );
       }

       if ( !_gl ) {
           alert( "Could not initialise WebGL..." );
       }

       _gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
       _gl.enable(_gl.DEPTH_TEST);
    };

    this.setClearColor = function( r, g, b, a ) {
        _gl.clearColor( r, g, b, a );
    };

    this.createTexture = function( internalformat, width, height, border,
                                   format, type, pixels ) {
      var texture = _gl.createTexture();
      _gl.bindTexture(_gl.TEXTURE_2D, texture);
      // _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, image);
      _gl.texImage2D(_gl.TEXTURE_2D, 0, paramToGL(_gl, internalformat), width, height, border,
                     paramToGL(_gl, format), paramToGL(_gl, type), pixels);
      
      if (format != Maximus.Param.DEPTH_COMPONENTFormat) {
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR);
        _gl.generateMipmap(_gl.TEXTURE_2D);
      } else {
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
      }

      _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
      // Prevents t-coordinate wrapping (repeating).
      _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);

      _gl.bindTexture(_gl.TEXTURE_2D, null);

      return texture;
    };

    this.genElementTexture = function( domElement ) {
      var texture = _gl.createTexture();
      _gl.bindTexture(_gl.TEXTURE_2D, texture);
      var ext = _gl.getExtension("MOZ_texture_from_element");
      ext.texImage2D(_gl.TEXTURE_2D, 0, domElement);

     // _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, domElement);
      _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
      // _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_NEAREST);
      _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR);
      // _gl.generateMipmap(_gl.TEXTURE_2D);

      // Prevents s-coordinate wrapping (repeating).
      _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
      // Prevents t-coordinate wrapping (repeating).
      _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);
      _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      _gl.bindTexture(_gl.TEXTURE_2D, null);

      return texture;
    }

    this.updateElementTexture = function( texture, domElement ) {
      _gl.bindTexture(_gl.TEXTURE_2D, texture);
      var ext = _gl.getExtension("MOZ_texture_from_element");
      ext.texImage2D(_gl.TEXTURE_2D, 0, domElement);
    }

    function getShader(context, code, type, debugShader) {
        // var shaderScript = id;
        // if ( !shaderScript ) {
        //     return null;
        // }

        // var str = "";
        // var k = shaderScript.firstChild;
        // while ( k ) {
        //     if ( k.nodeType === 3 ) {
        //         str += k.textContent;
        //     }

        //     k = k.nextSibling;
        // }

        var shader;
        if ( type === "x-shader/x-fragment" ) {
            shader = context.createShader(_gl.FRAGMENT_SHADER);
        } else if ( type === "x-shader/x-vertex" ) {
            shader = context.createShader(_gl.VERTEX_SHADER);
        } else {
            return null;
        }

        context.shaderSource(shader, code);
        context.compileShader(shader);

        if ( !context.getShaderParameter(shader, context.COMPILE_STATUS) ) {
            alert( context.getShaderInfoLog(shader) );
            return null;
        }

        if (debugShader) {
          var src = context.getExtension('WEBGL_debug_shaders').getTranslatedShaderSource(shader);
          console.log(src);
        }

        return shader;
    }

    this.initShaders = function(vs, fs, debugShader) {
        var vertexShader = getShader(_gl, vs, "x-shader/x-vertex", debugShader);
        var fragmentShader = getShader(_gl, fs, "x-shader/x-fragment", debugShader);
        var shaderProgram = _gl.createProgram();

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
        shaderProgram.vertexUVAttribute = _gl.getAttribLocation(shaderProgram, "UV");
        _gl.enableVertexAttribArray( shaderProgram.vertexUVAttribute );
       
        shaderProgram.pMatrixUniform = _gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = _gl.getUniformLocation(shaderProgram, "uMVMatrix");
        
        // Lambert lighting
        shaderProgram.matDiffuse = _gl.getUniformLocation(shaderProgram, "matDiffuse");
        shaderProgram.lightDir = _gl.getUniformLocation(shaderProgram, "lightDir");
        shaderProgram.lightColor = _gl.getUniformLocation(shaderProgram, "lightColor");
        shaderProgram.uSampler = _gl.getUniformLocation( shaderProgram, "uSampler" );
    
        return shaderProgram;
    };
 
    this.setSize = function( width, height ) {
      _gl.viewportWidth = width;
      _gl.viewportHeight = height;
      mat4.perspective( pMatrix, 45, _gl.viewportWidth / _gl.viewportHeight, 0.1, 100.0 );
    }

    this.setLight = function( shaderProgram, directionalLight ) {
        var lightDir = directionalLight.getDirection();
        var lightColor = directionalLight.getColor();
        var intensity = directionalLight.getIntensity();
        
        _gl.uniform4fv( shaderProgram.lightDir, 
        [-lightDir[0], -lightDir[1], -lightDir[2], 1.0] );
        _gl.uniform4fv( shaderProgram.lightColor, 
        [lightColor[0] * intensity, lightColor[1] * intensity, lightColor[2] * intensity, 1.0] );
    };
    
    this.getContext = function() {
        return _gl;
    };

    this.createFramebuffer = function() {
      return _gl.createFramebuffer();
    };

    this.createRenderbuffer = function() {
      return _gl.createRenderbuffer();
    }

    this.bindFramebuffer = function(framebuffer) {
      _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);
    }

    this.bindRenderbuffer = function(renderbuffer, internalformat, width, height,
                                     texAttachment, rttTexture, bufAttachment) {
      _gl.bindRenderbuffer(_gl.RENDERBUFFER, renderbuffer);
      _gl.renderbufferStorage(_gl.RENDERBUFFER, paramToGL(_gl, internalformat), width, height);
      _gl.framebufferTexture2D(_gl.FRAMEBUFFER, paramToGL(_gl, texAttachment), _gl.TEXTURE_2D,
                               rttTexture, 0);
      _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, paramToGL(_gl, bufAttachment), _gl.RENDERBUFFER, renderbuffer);

      _gl.bindTexture(_gl.TEXTURE_2D, null);
      _gl.bindRenderbuffer(_gl.RENDERBUFFER, null);
      _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
    };

    this.bindDepthbuffer = function(renderbuffer, width, height,
                                    texAttachment, rttTexture, depthTexture) {
      _gl.bindRenderbuffer(_gl.RENDERBUFFER, renderbuffer);
      _gl.framebufferTexture2D(_gl.FRAMEBUFFER, paramToGL(_gl, texAttachment), _gl.TEXTURE_2D,
                               rttTexture, 0);
      _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.TEXTURE_2D,
                               depthTexture, 0);
      _gl.bindTexture(_gl.TEXTURE_2D, null);
      _gl.bindRenderbuffer(_gl.RENDERBUFFER, null);
      _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
    };

    this.drawScene = function( drawList, framebuffer ) {
        if (framebuffer) {
          this.bindFramebuffer(framebuffer);
        }

        _gl.viewport( 0, 0, _gl.viewportWidth, _gl.viewportHeight );
        _gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );

        for (var i = 0; i < drawList.length; ++i ) {
          var geometry = drawList[i];
          var worldMtx = geometry.getWorldMatrix();
          var shaderProgram = geometry.getMaterial().getShader();
          _gl.useProgram(shaderProgram);
          mat4.multiply( mvMatrix, worldMtx, viewMtx );

          _gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.getVertexBuffer() );
          _gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3,
                          _gl.FLOAT, false, 4 * 12, 0 );
          _gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4,
                          _gl.FLOAT, false, 4 * 12, 3 * 4 );
          _gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3,
                          _gl.FLOAT, false, 4 * 12, (3 + 4) * 4 );
          _gl.vertexAttribPointer(shaderProgram.vertexUVAttribute, 2,
                          _gl.FLOAT, false, 4 * 12, (3 + 4 + 3) * 4 );
                     
          _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometry.getIndexBuffer() );
          _setMatrixUniform(shaderProgram);
          _setMaterial( geometry.getMaterial() );
        
          _gl.drawElements( _gl.TRIANGLES, geometry.getIndexBuffer().numItems, _gl.UNSIGNED_SHORT, 0 );
        }
    };

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var viewMtx = mat4.create();
    //mat4.identity( viewMtx );  // This can be removed.
    
    function _setMatrixUniform(shaderProgram) {
        _gl.uniformMatrix4fv( shaderProgram.pMatrixUniform, false, pMatrix );
        _gl.uniformMatrix4fv( shaderProgram.mvMatrixUniform, false, mvMatrix );    
    }
    
    function _setMaterial(material) {
      var shaderProgram = material.getShader();

      _gl.uniform4fv( shaderProgram.matDiffuse, material.getColor() );
      // Set texture
      if (material.getTexture()) {  // FIXIT: workaround for texture mapping demo.
        _gl.activeTexture( _gl.TEXTURE0 );
        _gl.bindTexture( _gl.TEXTURE_2D, material.getTexture() );
      }
     // _gl.uniform1i( shaderProgram.uSampler, 0 ); // Need?
    }
       
};