var errors = [];

var Reg = Backbone.Model.extend();
var columnNumber = 0;
var content = '';
mainObject.data.forEach(function(element,index){
	if(index == 0){
		content = content + '<div class="row row1">';
		columnNumber = 0; 
	}
	else if(index == 3){
		content = content + '</div><div class="row row2">';
		columnNumber = 0;
	}
	else if(index == 6){
		content = content + '</div><div class="row row3">';
		columnNumber = 0;
	}
	columnNumber++;

	content = content + '<div class="col-md-4 col-sm-12 col-lg-4 col-xs-12 column' + columnNumber + '">' + '<p class="' + element.placeHolder + '">' + element.content + '</p></div>';
	if(index == (mainObject.data.length-1)){
		content = content + '</div>';
	}
});
var RegView = Backbone.View.extend({
	template: content,
    render: function () {
        this.$el.html(this.template);
        return this;
    }
    //this.model.save(R);
});
var m = new Reg();
var v = new RegView ({model: m});
$('#main').append(v.render().el);