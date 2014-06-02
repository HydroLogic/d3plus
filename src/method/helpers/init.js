//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Create dummy methods to catch deprecates
//------------------------------------------------------------------------------
d3plus.method.init = function( vars , obj , method ) {

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Initialize a few globals.
  //----------------------------------------------------------------------------
  obj.previous = false
  obj.changed  = false
  obj.initialized = false
  obj.getVars  = function(){
    return vars
  }

  if ( "init" in obj && !("value" in obj) ) {
    obj.value = obj.init( vars )
    delete obj.init
  }

  if ( "process" in obj ) {
    obj.value = d3plus.method.process( obj , obj.value )
  }

  for ( o in obj ) {

    if ( o === "deprecates" ) {

      var deps = obj[o] instanceof Array ? obj[o] : [obj[o]]

      deps.forEach(function(d){

        vars.self[d] = (function(dep,n) {

          return function(x) {

            var str = vars.format.locale.value.dev.deprecated
            dep = "\."+dep+"()"
            d3plus.console.warning(d3plus.string.format(str,dep,"\."+n+"()"))
            d3plus.console.log(d3plus.repo+"wiki/Methods")
            return vars.self;

          }

        })(d,method)

      })

    }
    else if ( o === "global" ) {

      if ( !(method in vars) ) {
        vars[method] = []
      }

    }
    else if ( d3plus.object.validate( obj[o] ) ) {

      d3plus.method.init( vars , obj[o] , o )

    }

  }

  obj.initialized = true

}