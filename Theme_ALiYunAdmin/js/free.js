$(function(){
	$('.menu-stretch').click(function(){
		if($('.left-container').hasClass('menu-onlyicon')){
			$('.left-container').removeClass('menu-onlyicon');
			$('.right-container').removeClass('right-container-large');
		} else {
			$('.left-container').addClass('menu-onlyicon');
			$('.right-container').addClass('right-container-large');
		}
	});
	
	$('.menu-row').click(function(){
		var menuList = $(this).next('.menu-list');
		if(menuList.hasClass('show-off')){
			menuList.removeClass('show-off');
		} else {
			menuList.addClass('show-off');
		}
	});
});
