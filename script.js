/*2.通用函数*/
function g(selector){
	var method = selector.substr(0,1) == '#' ? 'getElementById' : 'getElementsByClassName';
	return document[method](selector.substr(1));
}
//生成随机数,支持取值范围 random([min,max])
function random (range) {
	var max = Math.max(range[0],range[1]);
	var min = Math.min(range[0],range[1]);
	var diff = max - min;
	var num = Math.ceil(Math.random()*diff + min);
	return num;
}

/*3.输出所有照片*/
var data = data;
function addPhotos(){
	var template = g('#wrap').innerHTML;
	var html = [];
	var nav = [];
	for (var s = 0; s < data.length; s++) {
		var _html = template
							.replace('{{index}}',parseInt(s)+1)
							.replace('{{img}}',data[s].img)
							.replace('{{caption}}',data[s].caption)
							.replace('{{desc}}',data[s].desc);
		html.push(_html);
		nav.push('<span id= "nav-'+(s+1)+'" class="i" onclick="turn(g(\'#photo-'+(s+1)+'\'))"></span>');
	}
	html.push('<div class="nav">'+nav.join('')+'</div>');
	console.log(html);
	g('#wrap').innerHTML = html.join('');
	var num = random([0,data.length]);
	rsort(num);
}
addPhotos();
// 5.计算左右分区范围
function r() {
	var r = {
		left: {
			x: [],
			y: []
		},
		right: {
			x: [],
			y: []
		}
	};
	var wrap = {
		w: g('#wrap').clientWidth,
		h: g('#wrap').clientHeight
	};
	var photo = {
		w: g('.photo')[0].clientWidth,
		h: g('.photo')[0].clientHeight
	};
	r.wrap = wrap;
	r.photo = photo;
	r.left.x = [0-photo.w,wrap.w/2-photo.w/2];
	r.left.y=[0-photo.h,wrap.h];
	r.right.x=[wrap.w/2+photo.w/2,wrap.w+photo.w];
	r.right.y=r.left.y;
	return r;
}
/*4.重新排序*/
function rsort (n) {
	var _photo = g('.photo');
	var photos = [];
	var nav = [];
	for (s = 0; s < _photo.length; s++) {
		_photo[s].className = _photo[s].className.replace(/\s*photo-center\s*/,' ');
		_photo[s].className = _photo[s].className.replace(/\s*photo-front\s*/,' ');
		_photo[s].className = _photo[s].className.replace(/\s*photo-back\s*/,' ');
		_photo[s].style.left = '';
		_photo[s].style.top = '';
		_photo[s].style['-webkit-transform']='rotate(360deg)';
		_photo[s].style['transform']='rotate(360deg)scale(1.2)';
		_photo[s].className +=" photo-front ";
		photos.push(_photo[s]);
	}
	var photo_center = g('#photo-'+n);
	photo_center.className += ' photo-center';
	photo_center = photos.splice(n-1,1)[0];


	//把海报分成左右两个部分
	var photos_left = photos.splice(0,Math.ceil(photos.length/2));
	var photos_right = photos;
	var ranges = r();
	// console.log(ranges);
	for (s in photos_left) {
		var photo = photos_left[s];
		photo.style.left = random(ranges.left.x)+'px';
		photo.style.top = random(ranges.left.y)+'px';
		photo.style['transform'] = photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg)scale(1) ';
	}
	for(s in photos_right){
		var photo = photos_right[s];
		photo.style.left=random(ranges.right.x)+'px';
		photo.style.top=random(ranges.right.y)+'px';
		photo.style['transform'] = photo.style['-webkit-transform'] = 'rotate('+random([-100,100])+'deg)scale(1) ';
	}

	//控制按钮处理，清除之前的classname
	var navs = g('.i');
	for(var s = 0; s < navs.length; s++) {
		navs[s].className = navs[s].className.replace(/\s*i-current\s*/,' ');
		navs[s].className = navs[s].className.replace(/\s*i-back\s*/,' ');
	}
	g('#nav-'+n).className += ' i-current';
}

/*1.翻面控制*/
function turn(elem) {
	var cls = elem.className;
	var n = elem.id.split('-')[1];
	//判断点击的照片是否是当前居中照片，不是则不能翻转
	if (!/photo-center/.test(cls)) {
		return rsort(n);
	}
	if (/photo-front/.test(cls)) {
		cls = cls.replace(/photo-front/,'photo-back');
		g('#nav-'+n).className += ' i-back';
	}else {
		cls = cls.replace(/photo-back/,'photo-front');
		g('#nav-'+n).className = g('#nav-'+n).className.replace(/\s*i-back\s*/,' ');
	}
	return elem.className = cls;
}