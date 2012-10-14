/*
    Name        :   Backbone Table
    Author      :   Lukas Klinzing
    Description :   Read readme.md...
*/

(function() {

    Backbone.SchemaColumn = Backbone.Model.extend({
        parse:function(item) {
            if (typeof (item) == "string") {
                return {name:item};
            } else return item;
        }
    });
    Backbone.SchemaColumns = Backbone.Collection.extend({
        model : Backbone.SchemaColumn
    });

    Backbone.Schema = Backbone.Model.extend({
        initialize: function() {
            if (!this.columns)
                this.columns = new Backbone.SchemaColumns();
        },
        parse : function(data) {
            var d = _.extend({}, data);
            if (d.columns) {
                this.columns = new Backbone.SchemaColumns(d.columns, {parse:true});
                delete d.columns;
            }
            return d;
        }
    });

    var headTemplate = '<thead>\
                            <% _.each(columns, function(c) { %>\
                            <th><%=c.name%></th>\
                            <% }); %>\
                        </thead>';


    var rowTemplate = '<tr>\
                            <% _.each(columns, function(c) { %>\
                                <% if (rowData[c.name]) { %>\
                                    <td><% print(rowData[c.name]) %></td>\
                                <%}%>\
                            <%});%>\
                       </tr>';

    var emptyTemplate = '<tr>\
                            <td colspan="<%=columns.length%>"><%=text%></td>\
                         </tr>';


    Backbone.Table = Backbone.View.extend({
        tagName : "table",
        className : "table",
        constructor : function(options) {
            (options || (options = {}));
            this.schema = (options.schema) || (this.schema && _.result(this, "schema")) || null;
            if (this.schema == null && !options.schemaFromModel && options.collection) {
                this.schema = this.fetchSchema(options.collection.toJSON());
            }
            if (!(this.schema instanceof Backbone.Model))
                this.schema = new Backbone.Schema(this.schema, {parse:true});
            Backbone.Table.__super__.constructor.apply(this, arguments);
            if (!this.headTemplate) this.headTemplate = _.template(headTemplate);
            if (!this.rowTemplate) this.rowTemplate = _.template(rowTemplate);
            if (!this.emptyTemplate) this.emptyTemplate = _.template(emptyTemplate);
        },
        fetchSchema: function(data) {
            return {columns : _.uniq(_.flatten(_.map(data, function(i) {return _.keys(i)})))};
        },
        render: function() {
            this.$el.empty();
            var columns = this.schema.columns.toJSON();
            this.$el.append(this.headTemplate({columns:columns}));
            var self = this;
            if (this.collection.length == 0) {
                this.$el.append(this.emptyTemplate({columns:columns}));
            } else
                this.collection.each(function(model) {
                    self.$el.append(self.rowTemplate({
                        rowData : model.toJSON(),
                        columns : columns
                    }));
                });
            return this;
        }
    });

})();