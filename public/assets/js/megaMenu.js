// IRIS Mega Menu
$(document).ready(function(){
	$(".blog-menu-item .blog-menu-link").mouseover(function(e){
		var active_div = $(this).next();
		if ($(window).width() > 991) {
			$(this).next().addClass("active");
		}
	});
	$(document).on('click','.blog-menu-link',function(){
		if (!$(this).next().hasClass('show')) {
			$('.blog-menu-item-row').removeClass('show');
			$(this).next().addClass('show');
		}
		else if ($(this).next().hasClass('show')) {
			$(this).next().removeClass('show');
		}
		$(this).addClass('show');
		$(document).find(".blog-menu-link").not(this).removeClass('show');
		return false;
	});
});
