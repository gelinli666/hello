/*
	gulp应用
	使用的插件
	gulp-htmlmin
	gulp-less
	gulp-cssmin
	gulp-concat
	gulp-uglify
	gulp-autoprefixer
	gulp-imagemin
	gulp-clean
	gulp-load-plugins
	browser-sync
*/

'use strict';
var gulp=require('gulp');
var $=require('gulp-load-plugins')();//根据依赖关系自动加载插件
var browserSync=require('browser-sync').create();

//创建一个全局变量，用来定义目录路径
var app={
	srcPath:'src/',//源码source
	devPath:'bulid/',//构建build，便于测试
	prdPath:'dist/'//发布
};
//html复制压缩的功能
gulp.task('html',function(){
	gulp.src(app.srcPath+'**/*.html')
	.pipe(gulp.dest(app.devPath))
	.pipe($.htmlmin({
		collapseWhitespace:true,
		removeComments:true,
		collapseBooleanAttributes:true,
		removeEmptyAttributes:true

	}))
	.pipe(gulp.dest(app.prdPath))
	.pipe(browserSync.stream());
});

//less编译，压缩
gulp.task('less',function(){
	gulp.src(app.srcPath+'style/itany.less')
	.pipe($.less())
	.pipe($.autoprefixer({
		browsers: ['last 20 versions'],//兼容主流浏览器的最新的20个版本
		cascade:false,
	}))
	.pipe(gulp.dest(app.devPath+'css'))
	.pipe($.cssmin())
	.pipe(gulp.dest(app.prdPath+'css'))
	.pipe(browserSync.stream());

});


//js合并的任务
gulp.task('js',function(){
	gulp.src(app.srcPath+'script/**/*.js')
	.pipe($.concat('index.js'))
	.pipe(gulp.dest(app.devPath+'js'))
	.pipe($.uglify())
	.pipe(gulp.dest(app.prdPath+'js'))
	.pipe(browserSync.stream());;

});

//图片压缩
gulp.task('image',function(){
	gulp.src(app.srcPath+'images/**/*')
	.pipe($.imagemin())//压缩图片,对于png有效
	.pipe(gulp.dest(app.devPath+'images/'))
	.pipe(gulp.dest(app.prdPath+'images/'));

});
//清空
gulp.task('clean',function(){
	gulp.src([app.devPath,app.prdPath])
	.pipe($.clean());
});

//定义一个监视任务
gulp.task('watch',['html','less','js','image'],function(){
	gulp.watch(app.srcPath+'**/*.html',['html']);//监视src目录下所有的html，文件，当发生变化时，进行监视，html任务也跟着变化
	gulp.watch(app.srcPath+'style/itany.less',['less']);
	gulp.watch(app.srcPath+'script/**/*.js',['js']);
	gulp.watch(app.srcPath+'images/**/*',['image']);
});

//启动一个broswer-sync静态服务器，实现浏览器的同步

gulp.task('default',['watch'],function(){
	browserSync.init({
		server:{
			baseDir:app.devPath
		}
	});
});


