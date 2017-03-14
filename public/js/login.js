var errors = [];

var Reg = Backbone.Model.extend({

    url: '#',

    defaults: {
        username: '',
        password: ''
    }

});
var RegView = Backbone.View.extend({
    className: 'main-login main-center',
    template: '\
            <form class="form-horizontal" method="post" action="/login">\
                <div class="form-group">\
                    <label for="username" class="cols-sm-2 control-label">Username</label>\
                    <div class="cols-sm-10">\
                        <div class="input-group">\
                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>\
                            <input type="text" class="form-control" name="username" id="username"  placeholder="Enter your Username"/>\
                        </div>\
                    </div>\
                </div>\
                <div class="form-group">\
                    <label for="password" class="cols-sm-2 control-label">Password</label>\
                    <div class="cols-sm-10">\
                        <div class="input-group">\
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>\
                            <input type="password" class="form-control" name="password" id="password"  placeholder="Enter your Password"/>\
                        </div>\
                    </div>\
                </div>\
                <div class="form-group ">\
                    <button type="submit" class="btn btn-primary btn-lg btn-block login-button" id="login">Login</button>\
                </div>\
                <div class="login-register">\
                    <a href="/register">Register</a>\
                 </div>\
            </form>\
        ',

    events: {
        'click #login': 'submitClicked'
    },
	
    render: function () {
        this.$el.html(this.template);
        return this;
    },

    submitClicked: function (e) {
        e.preventDefault();
        this.hideErrors();
        var me = this;
        errors = validation();
        if(!errors){
            me.hideErrors();
        }
        else{
            me.showErrors(errors);
        }

        var R = {
            username:  this.$('#username').val(),
            password: this.$('#password').val()
        };
        var options = {
            success: function (data) {
                if(data.changed.status == 'success'){
                    window.location.href = 'http://localhost:3000/main?username=' + R.username;
                }
                else{
                    alert(data.changed.status);
                    window.location.href = 'http://localhost:3000/login';
                }
            }
        };
        this.model.save(R,options);
    },

    showErrors: function(errors) {
        _.each(errors, function (error) {
            var controlGroup = this.$('#' + error.name);
            controlGroup.addClass('error');
            controlGroup.parent().parent().find('.error-inline').text(error.message);
        }, this);
    },

    hideErrors: function () {
        this.$('.control-group').removeClass('error');
        this.$('.error-inline').text('');
    }
});
var m = new Reg();
var v = new RegView ({model: m});
$('#login').append(v.render().el);

function validation(){
    errors = [];
    if ($('#password').val() == '') {
        errors.push({name: 'password', message: 'Please fill password field.'});
    }
    if ($('#username').val() == '') {
        errors.push({name: 'username', message: 'Please fill username field.'});
    }
    return errors.length > 0 ? errors : false;
}
