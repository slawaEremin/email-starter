'use strict';

var template = 'cbs',
    mailOptions = {
        litmus: {
            from: ' Foo ',
            to: 'lingualeo.runme.spam@previews.emailonacid.com',
            subject: 'Hello',
            html: 'app/' + template + '/index.html'
        }
    };



var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    assemble = require('gulp-assemble'),
    nodemailer = require('nodemailer'),
    fs = require('fs');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'examplte@gmail.com',
        pass: 'test'
    }
});

mailOptions.default = mailOptions.litmus;

var options = {
    data: 'app/' + template + '/layout/data/*.{json,yml}',
    layouts: 'app/' + template + '/layout/',
    partials: 'app/' + template + '/includes/*.hbs'
};

gulp.task('assemble', function () {
    gulp.src('app/' + template + '/pages/*.hbs')
        .pipe(assemble(options))
        .pipe(gulp.dest('app/' + template +'/'));
});


gulp.task('serve', ['assemble'], function () {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    server: ['app/'+ template]
  });

  gulp.watch('app/' + template +'/**/*.hbs', ['assemble']);
  gulp.watch('app/' + template +'/img/**/*', reload);
  gulp.watch('app/' + template +'/*.html', reload);
});

gulp.task('pp', ['assemble'], function () {
    browserSync({
        notify: false,
        logPrefix: 'WSK',
        server: ['app/' + template]
    });
});

gulp.task('send-test', function () {

    fs.readFile( mailOptions.default.html, function (err, data) {
        if (err) throw err;

        mailOptions.default.html = data;

        transporter.sendMail(mailOptions.default, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
    });
});

gulp.task('default', function () {
    gulp.start('serve');
});



