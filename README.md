Backbone.Table
==============
Backbone.Table should be a simple View that renders collections.
Others tried to do this, but I always felt uncomfortable using them,
as they don't exactly implement backbones logic as they should.

For example they are using initialize to set up their logic, but in Backbone
you almost never have to call a parent, like

    Backbone.View.initialize.call(this, options)

First, we should use private functions that call methods that returns a default value
but can be overriden, without the need to call its parent method. For init process
there is for sure a nice way to implement this in the constructor.

Second I think, if we need a model definition
at all, it should be a model, too, as we can then listen perfectly to events. 