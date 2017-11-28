$(function(){
	// menu的显示与隐藏
	$('.free-menu-toggle').click(function(){
		var menu = $('.free-menu');
		if(menu.is(':visible')){
			// 可见，设置为不可见
			menu.animate({left:"-200px"}, 400, function() {
				menu.hide();
			});
		} else {
			// 不可见，设置为可见
			menu.show(100, function(){
				menu.animate({left:"0"}, 400);
			});
		}
	});
	
	// 点击free-container隐藏menu
	$('.free-container').click(function() {
		var menu = $('.free-menu');
		var screenWidth = $(window).width();
		if(screenWidth <= 991 && menu.is(':visible')){
			// 可见，设置为不可见
			menu.animate({left:"-200px"}, 400, function() {
				menu.hide();
			});
		}
	});
	
	// menu items展开
	$('.free-menu-parent').click(function(){
		var children = $(this).next('ul');
		if(children.hasClass('free-menu-children')){ 
			//confirm this is vnav-children
			if(children.is(':visible')){ 
				//change the arrow direction && set menu-children disable 
				$(this).children('span').last().html('<i class="fa fa-chevron-down" aria-hidden="true"></i>');
				children.slideUp(400);
			} else if (children.is(':hidden')) { 
				//change the arrow direction && set menu-children visible
				$(this).children('span').last().html('<i class="fa fa-chevron-up" aria-hidden="true"></i>');
				children.slideDown(400);
			}
		}
	});
});
