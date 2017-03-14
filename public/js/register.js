var errors = [];

function IsEmail(email) {

    var regex = /^[A-Za-z]([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function checkStrength(password){
    var strength = 0;

    if (password.length < 6) { 
        $('#result').removeClass()
        $('#result').addClass('short')
        return 'Too short'; 
    }

    if (password.length > 7) strength += 1

    //If password contains both lower and uppercase characters, increase strength value.
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1

    //If it has numbers and characters, increase strength value.
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1 

    //If it has one special character, increase strength value.
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1

    //if it has two special characters, increase strength value.
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1


    //Calculated strength value, we can return messages



    //If value is less than 2

    if (strength < 2 )
    {
        $('#result').removeClass()
        $('#result').addClass('weak')
        return 'Weak'           
    }
    else if (strength == 2 )
    {
        $('#result').removeClass()
        $('#result').addClass('good')
        return 'Good'       
    }
    else
    {
        $('#result').removeClass()
        $('#result').addClass('strong')
        return 'Strong'
    }
    }
 
var Reg = Backbone.Model.extend({

    url: '#',

    defaults: {
        name: '',
        email: '',
        username: '',
        password: '',
        confirm: ''
    }

});
var RegView = Backbone.View.extend({
    className: 'main-login main-center',
    template: '\
            <form id="registerForm" class="form-horizontal" method="post" action="/register">\
                <div class="form-group">\
                    <label for="name" class="cols-sm-2 control-label">Your Name</label>\
                    <div class="cols-sm-10">\
                        <div class="input-group">\
                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>\
                            <input type="text" class="form-control" name="name" id="name"  placeholder="Enter your Name"/>\
                        </div>\
                        <span class="error-inline"></span>\
                    </div>\
                </div>\
                <div class="form-group">\
                    <label for="email" class="cols-sm-2 control-label">Your Email</label>\
                    <div class="cols-sm-10">\
                        <div class="input-group">\
                            <span class="input-group-addon"><i class="glyphicon glyphicon-envelope"></i></span>\
                            <input type="text" class="form-control" name="email" id="email"  placeholder="Enter your Email"/>\
                        </div>\
                        <span class="error-inline"></span>\
                    </div>\
                </div>\
                <div class="form-group">\
                    <label for="username" class="cols-sm-2 control-label">Username</label>\
                    <div class="cols-sm-10">\
                        <div class="input-group">\
                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>\
                            <input type="text" class="form-control" name="username" id="username"  placeholder="Enter your Username"/>\
                        </div>\
                        <span class="error-inline"></span>\
                    </div>\
                </div>\
                <div class="form-group">\
                    <label for="password" class="cols-sm-2 control-label">Password</label>\
                    <div class="cols-sm-10">\
                        <div class="input-group">\
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>\
                            <input type="password" class="form-control" name="password" id="password"  placeholder="Enter your Password"/>\
                        </div>\
                        <span class="error-inline"></span>\
                    </div>\
                </div>\
                <div class="form-group">\
                    <label for="confirm" class="cols-sm-2 control-label">Confirm Password</label>\
                    <div class="cols-sm-10">\
                        <div class="input-group">\
                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>\
                            <input type="password" class="form-control" name="confirm" id="confirm"  placeholder="Confirm your Password"/>\
                        </div>\
                        <span class="error-inline"></span>\
                    </div>\
                </div>\
                <div class="form-group ">\
                    <button type="submit" class="btn btn-primary btn-lg btn-block login-button" id="register">Register</button>\
                </div>\
                <div class="login-register">\
                    <a href="/login">Login</a>\
                 </div>\
            </form>\
        ',

    events: {
        'click #register': 'submitClicked'
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

        var options = {
            success: function (data) {
                if(data.changed.status == 'success'){
                    window.location.href = 'http://localhost:3000/login'
                }
                else{
                    if(data.changed.status != 'empty'){
                        alert(data.changed.status);
                    }
                    window.location.href = 'http://localhost:3000/register'
                }
            }
        };

        var R = {
            name: this.$('#name').val(),
            email:  this.$('#email').val(),
            username:  this.$('#username').val(),
            password: this.$('#password').val(),
            confirm: this.$('#confirm').val()
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
$('#register').append(v.render().el);

function validation(){
    errors = [];
    if ($('#name').val() == '') {
        errors.push({name: 'name', message: 'Please fill name field.'});
    }
    if (!(IsEmail($('#email').val()))){
        errors.push({name: 'email', message: 'Please fill email field.'});
    }
    if (checkStrength($('#password').val()) == 'Too short') {
        errors.push({name: 'password', message: 'Password field is Too short'});
    }
    if (checkStrength($('#password').val()) == 'Weak') {
        errors.push({name: 'password', message: 'Password field is Weak'});
    }
    if ($('#username').val() == '') {
        errors.push({name: 'username', message: 'Please fill username field.'});
    }
    if ($('#confirm').val() != $('#password').val() || $('#confirm').val() == '') {
        errors.push({name: 'confirm', message: 'Please fill confirm Password field.'});
    }
    return errors.length > 0 ? errors : false;
}

$('#registerForm').find('input').on('focus',function(){
    $(this).parent().parent().find('.error-inline').text('');
});