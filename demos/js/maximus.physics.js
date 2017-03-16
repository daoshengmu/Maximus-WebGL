
Maximus.Physics = function() {

	// Create physics world
    var world = this.world = new CANNON.World();

    var scene = [];

	this.addScene = function( title, initFunc ) {

		if ( typeof(title) !== "string" ){
            throw new Error("1st argument of Physics.addScene(title,initfunc) must be a string!");
        }

        if ( typeof(initFunc)!=="function" ){
            throw new Error("2nd argument of Physics.addScene(title,initfunc) must be a function!");
        }

        scene.push( initFunc );
	}

	this.getCamera = function() {
        return camera;
    }
}