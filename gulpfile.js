var gulp = require('gulp'),
    connect = require('gulp-connect');
 
var paths = {
  htmlInputFiles: ['*.html'],
  mdFiles: ['./posts/*']
};
 
 
gulp.task('webserver', function() {
    connect.server({
    port: 4000,
    livereload: true
    });
});
 
 
 gulp.task('watch', function() {
    gulp.watch(paths.htmlInputFiles, ['reload']);
    gulp.watch(paths.mdFiles, ['reload']);
})
 
gulp.task('reload', function () {
  gulp.src(paths.htmlInputFiles)
    .pipe(connect.reload());
}); 
  
 
gulp.task('default', ['webserver', 'watch']);

