/* 
 * Maximus, a WebGL renderering framework
 * author: daoshengmu, http://dsmu.me
 * date: 08/07/2015
 */

var Maximus = { REVISION: '1.1.0' };

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

Maximus.Vector2 = function( x, y ) {
  this.x = x | 0;
  this.y = y | 0;
};

Maximus.Vector2.prototype = {

  constructor: Maximus.Vector2,

  clone: function () {

    return new this.constructor( this.x, this.y );

  }
};

// THREE.Face3 = function ( a, b, c, normal, color, materialIndex ) {
//   this.a = a;
//   this.b = b;
//   this.c = c;

//   this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
//   this.vertexNormals = Array.isArray( normal ) ? normal : [];

//   this.color = color instanceof THREE.Color ? color : new THREE.Color();
//   this.vertexColors = Array.isArray( color ) ? color : [];

//   this.vertexTangents = [];

//   this.materialIndex = materialIndex !== undefined ? materialIndex : 0;
// };

// THREE.Face3.prototype = {

//   constructor: THREE.Face3,
// };

Maximus.LambertMaterial = function( color ) {
    var _color = color;
    
    this.getColor = function() {
        return _color;  
    };
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

Maximus.Cube = function() {
    var _cubeVertexBuffer;
    var _cubeIndexBuffer;
    var _material;
    
    this.init = function( renderer, mtr ) {
        _material = mtr;
        var gl = renderer.getContext();
        
        _cubeVertexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, _cubeVertexBuffer );

        var vertices = [ //(POS 3, COLOR 4, NORMAL 3)
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

        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
        _cubeVertexBuffer.itemSize = 10;
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
    
};

Maximus.Sphere = function() {
    var _sphereVertexBuffer;
    var _sphereIndexBuffer;
    var _material;
    
    this.init = function( renderer, mtr, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {
        
        radius = radius || 50;

        widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
        heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

        phiStart = phiStart !== undefined ? phiStart : 0;
        phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

        thetaStart = thetaStart !== undefined ? thetaStart : 0;
        thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

        var vertices = [];
        var indices = [];
        var x, y, verticesTemp = [], uvs = [];
        var itemSize = 10; // POS3 + COLOR4 + NORMAL3

        // Why segments loop size is less and EQUAL?
        // Construct vertex position
        for ( y = 0; y <= heightSegments; y++ ) {

          var verticesRow = [];
          var uvsRow = [];

          for ( x = 0; x <= widthSegments; x++ ) {

            var u = x / widthSegments;
            var v = y / heightSegments;

            var vertex = new Maximus.Vector3();
            vertex.x = -radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
            vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
            vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

            verticesTemp.push( vertex );
           // verticesRow.push( this.verticesTemp.length - 1 );
          //  uvsRow.push( new Maximus.Vector2( u, 1 - v ) );
            uvs.push( new Maximus.Vector2( u, 1 - v ) );
          }

         // vertices.push( verticesRow );
         // uvs.push( uvsRow );

        }

        // Construct face normal and index
        var faceCount = 0;
        var normalOffset = itemSize - 3;
        for ( y = 0; y < heightSegments; y++ ) {

          for ( x = 0; x < widthSegments; x++ ) {

            // var v1 = verticesTemp[ y ][ x + 1 ];
            // var v2 = verticesTemp[ y ][ x ];
            // var v3 = verticesTemp[ y + 1 ][ x ];
            // var v4 = verticesTemp[ y + 1 ][ x + 1 ];
            var v1 = y * (widthSegments+1) + x + 1;
            var v2 = y * (widthSegments+1) + x;
            var v3 = (y + 1) * (widthSegments+1) + x;
            var v4 = (y + 1) * (widthSegments+1) + x + 1;
            // var n1 = verticesTemp[ v1 ].clone().normalize();
            // var n2 = verticesTemp[ v2 ].clone().normalize();
            // var n3 = verticesTemp[ v3 ].clone().normalize();
            // var n4 = verticesTemp[ v4 ].clone().normalize();
            // var n1 = this.vertices[ v1 ].clone().normalize();
            // var n2 = this.vertices[ v2 ].clone().normalize();
            // var n3 = this.vertices[ v3 ].clone().normalize();
            // var n4 = this.vertices[ v4 ].clone().normalize();

            var uv1 = uvs[ y * (widthSegments+1) + x + 1 ].clone();
            var uv2 = uvs[ y * (widthSegments+1) + x ].clone();
            var uv3 = uvs[ (y + 1) * (widthSegments+1) + x ].clone();
            var uv4 = uvs[ (y + 1) * (widthSegments+1) + x + 1 ].clone();
           
            if ( Math.abs( verticesTemp[ v1 ].y ) === radius ) {

              var normal = computeFaceNormals( v1, v3, v4, verticesTemp );
             // vertices.push( normal.x, normal.y, normal.z ); // NORMAL 3
              vertices[ v1 * itemSize + normalOffset ] = normal.x;
              vertices[ v1 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v1 * itemSize + normalOffset + 2 ] = normal.z;

              vertices[ v3 * itemSize + normalOffset ] = normal.x;
              vertices[ v3 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v3 * itemSize + normalOffset + 2 ] = normal.z;

              vertices[ v4 * itemSize + normalOffset ] = normal.x;
              vertices[ v4 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v4 * itemSize + normalOffset + 2 ] = normal.z;

              uv1.x = ( uv1.x + uv2.x ) / 2;
            //  this.faces.push( new Maximus.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
              indices.push( v1, v3, v4 );
              ++faceCount;
             // this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

            } else if ( Math.abs( verticesTemp[ v3 ].y ) === radius ) {

              var normal = computeFaceNormals( v1, v2, v3, verticesTemp );
              //vertices.push( normal.x, normal.y, normal.z ); // NORMAL 3

              vertices[ v1 * itemSize + normalOffset ] = normal.x;
              vertices[ v1 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v1 * itemSize + normalOffset + 2 ] = normal.z;

              vertices[ v2 * itemSize + normalOffset ] = normal.x;
              vertices[ v2 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v2 * itemSize + normalOffset + 2 ] = normal.z;

              vertices[ v3 * itemSize + normalOffset ] = normal.x;
              vertices[ v3 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v3 * itemSize + normalOffset + 2 ] = normal.z;

              uv3.x = ( uv3.x + uv4.x ) * 0.5;
              indices.push( v1, v2, v3 );
              ++faceCount;
              //this.faces.push( new Maximus.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
             // this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

            } else {

              var normal = computeFaceNormals( v1, v2, v4, verticesTemp );
              //vertices.push( normal.x, normal.y, normal.z ); // NORMAL 3

              vertices[ v1 * itemSize + normalOffset ] = normal.x;
              vertices[ v1 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v1 * itemSize + normalOffset + 2 ] = normal.z;

              vertices[ v2 * itemSize + normalOffset ] = normal.x;
              vertices[ v2 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v2 * itemSize + normalOffset + 2 ] = normal.z;

              vertices[ v4 * itemSize + normalOffset ] = normal.x;
              vertices[ v4 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v4 * itemSize + normalOffset + 2 ] = normal.z;

              indices.push( v1, v2, v4 );
              ++faceCount;
             // this.faces.push( new Maximus.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
              //this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

              //var pos1 = verticesTemp[ y * widthSegments + x ];
              //vertices.push( pos1.x, pos1.y, pos1.z ); // Add POSITION.
              //vertices.push( 1.0, 0.0, 0.0, 1.0 ); // Add COLOR 4.

              normal = computeFaceNormals( v2, v3, v4, verticesTemp );
              //vertices.push( normal.x, normal.y, normal.z ); // NORMAL 3
              vertices[ v2 * itemSize + normalOffset ] = normal.x;
              vertices[ v2 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v2 * itemSize + normalOffset + 2 ] = normal.z;

              vertices[ v3 * itemSize + normalOffset ] = normal.x;
              vertices[ v3 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v3 * itemSize + normalOffset + 2 ] = normal.z;

              vertices[ v4 * itemSize + normalOffset ] = normal.x;
              vertices[ v4 * itemSize + normalOffset + 1 ] = normal.y;
              vertices[ v4 * itemSize + normalOffset + 2 ] = normal.z;

              indices.push( v2, v3, v4 );
              ++faceCount;
            //  this.faces.push( new Maximus.Face3( v2, v3, v4, [ n2.clone(), n3, n4.clone() ] ) );
             // this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

            }

          }

        }

        vertices = new Float32Array( faceCount * 3 * itemSize );
        var pos;

        for ( var i = 0; i < faceCount; i++ ) {

          var va = indices[ i * 3 ];
          var vb = indices[ i * 3 + 1 ];
          var vc = indices[ i * 3 + 2 ];
          var normal = computeFaceNormals( va, vb, vc, verticesTemp );

          pos = verticesTemp[ va ];

          // Add POSITION
          vertices[ va * itemSize ] = pos.x;
          vertices[ va * itemSize + 1 ] = pos.y;
          vertices[ va * itemSize + 2 ] = pos.z;

          // Add COLOR 4
          vertices[ va * itemSize + 3 ] = 1.0;
          vertices[ va * itemSize + 4 ] = 1.0;
          vertices[ va * itemSize + 5 ] = 1.0;
          vertices[ va * itemSize + 6 ] = 1.0;

          // Add NORMAL 3
          vertices[ va * itemSize + 7 ] = normal.x;
          vertices[ va * itemSize + 8 ] = normal.y;
          vertices[ va * itemSize + 9 ] = normal.z;

          pos = verticesTemp[ vb ];

          // Add POSITION
          vertices[ vb * itemSize ] = pos.x;
          vertices[ vb * itemSize + 1 ] = pos.y;
          vertices[ vb * itemSize + 2 ] = pos.z;

          // Add COLOR 4
          vertices[ vb * itemSize + 3 ] = 1.0;
          vertices[ vb * itemSize + 4 ] = 1.0;
          vertices[ vb * itemSize + 5 ] = 1.0;
          vertices[ vb * itemSize + 6 ] = 1.0;

          // Add NORMAL 3
          vertices[ vb * itemSize + 7 ] = normal.x;
          vertices[ vb * itemSize + 8 ] = normal.y;
          vertices[ vb * itemSize + 9 ] = normal.z;

          pos = verticesTemp[ vc ];

          // Add POSITION
          vertices[ vc * itemSize ] = pos.x;
          vertices[ vc * itemSize + 1 ] = pos.y;
          vertices[ vc * itemSize + 2 ] = pos.z;

          // Add COLOR 4
          vertices[ vc * itemSize + 3 ] = 1.0;
          vertices[ vc * itemSize + 4 ] = 1.0;
          vertices[ vc * itemSize + 5 ] = 1.0;
          vertices[ vc * itemSize + 6 ] = 1.0;

          // Add NORMAL 3
          vertices[ vc * itemSize + 7 ] = normal.x;
          vertices[ vc * itemSize + 8 ] = normal.y;
          vertices[ vc * itemSize + 9 ] = normal.z;

          //vertices.push( pos.x, pos.y, pos.z ); // Add POSITION.

          //vertices.push( [ 1.0, 0.0, 0.0, 1.0 ] ); // Add COLOR 4.
          //vertices.push( 1.0, 0.0, 0.0, 1.0 ); // Add COLOR 4.
          //vertices.push( 0.0, 0.0, 0.0 ); // Normal 3
        }

        //this.computeFaceNormals();

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
    
    function computeFaceNormals( index1, index2, index3, vertices ) {
      var cb = new Maximus.Vector3(), ab = new Maximus.Vector3();
      var vA = vertices[ index1 ];
      var vB = vertices[ index2 ];
      var vC = vertices[ index3 ];

      cb.subVectors( vC, vB );
      ab.subVectors( vA, vB );
      cb.cross( ab );
      cb.normalize();

      return cb;
    }

    this.getVertexBuffer = function() {
        return _sphereVertexBuffer;
    };
    
    this.getIndexBuffer = function() {
        return _sphereIndexBuffer;
    };   
    
    this.getMaterial = function() {
        return _material;
    };
}

Maximus.WebGLRenderer = function() {
    var _this = this;
    var _gl;

    this.initGL = function(canvas) {
       try {
           _gl = canvas.getContext("experimental-webgl")
                  || canvas.getContext('webgl');
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

    function getShader( context, code, type ) {
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

        return shader;
    }

    var shaderProgram;
    this.initShaders = function( vs, fs ) {

        var vertexShader = getShader(_gl, vs, "x-shader/x-vertex");
        var fragmentShader = getShader(_gl, fs, "x-shader/x-fragment");

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
 
    this.setSize = function( width, height ) {
      _gl.viewportWidth = width;
      _gl.viewportHeight = height;
    }

    this.setLight = function( directionalLight ) {
        
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

    this.drawScene = function( worldMtx, geometry ) {
        _gl.viewport( 0, 0, _gl.viewportWidth, _gl.viewportHeight );
        _gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );

        if ( !worldMtx || !geometry )
          return;

        mat4.perspective( pMatrix, 45, _gl.viewportWidth / _gl.viewportHeight, 0.1, 100.0 );
        mat4.multiply( mvMatrix, worldMtx, viewMtx );
    
        _gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.getVertexBuffer() );
        _gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3,
                        _gl.FLOAT, false, 4 * 10, 0 );
        _gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4,
                        _gl.FLOAT, false, 4 * 10, 3 * 4 );
        _gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3,
                        _gl.FLOAT, false, 4 * 10, (3 + 4) * 4 );
                   
        _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometry.getIndexBuffer() );
        _setMatrixUniform();
        _setMaterialColor( geometry.getMaterial().getColor() );
      
        _gl.drawElements( _gl.TRIANGLES, geometry.getIndexBuffer().numItems, _gl.UNSIGNED_SHORT, 0 );
    };

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var viewMtx = mat4.create();
    //mat4.identity( viewMtx );  // This can be removed.
    
    function _setMatrixUniform() {
        _gl.uniformMatrix4fv( shaderProgram.pMatrixUniform, false, pMatrix );
        _gl.uniformMatrix4fv( shaderProgram.mvMatrixUniform, false, mvMatrix );    
    }
    
    function _setMaterialColor( color ) {
        _gl.uniform4fv( shaderProgram.matDiffuse, color );
    }
       
};