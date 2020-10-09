
//轮播图
$('.lunbo').swiper({
	    		images:["img/demo1.jpg","img/demo2.jpg","img/demo3.jpg","img/demo4.jpg","img/demo5.jpg"],
	    		btnWidth:'40px',
	    		btnHeight:'60px',
	    		direction:'next',
	    		autoTimer:1000,
	    	});


//nav
$('.nav-list').on('click',function(){
	$('.list-nav',this).css({
		display:'block'
	});
}).on('mouseleave',function(){
	$('.list-nav',this).css({
		display:'none'
	});
});


//nowpos

window.onscroll =function(){  //监听滚动条事件
	if($(window).scrollTop() <=100){
	$('.nowpos').fadeOut(500,'swing');
}else{
	$('.nowpos').fadeIn(500,'swing');
}
}

$('.nowpos').on('click',function(){
	document.body.scrollTop=-200;
})
