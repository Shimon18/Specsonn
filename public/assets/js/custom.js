jQuery('.drop-down .select-list span').on('click', function()
{          
	var dd_text = jQuery(this).text();  
	var dd_img = jQuery(this).css('background-image'); 
	var dd_val = jQuery(this).attr('value');   
	jQuery('.drop-down .button').html('<a href="javascript:void(0);" class="select-list-link"><span style=background-image:' + dd_img + '>' + dd_text + '<i class="fas fa-sort-down"></i></span>' + '</a>');      
	jQuery('.drop-down .select-list span').parent().removeClass('active');    
	jQuery(this).parent().addClass('active');     
	$('.drop-down select[name=options]').val( dd_val ); 
	$('.drop-down .select-list li').slideUp();     
});

jQuery('.drop-down .button').on('click','a.select-list-link', function()
{      
	jQuery('.drop-down ul li').slideToggle();  
});     
/* End */       


function DropDown(el) {
	this.dd = el;
	this.placeholder = this.dd.children('span');
	this.opts = this.dd.find('ul.dropdown > li');
	this.val = '';
	this.index = -1;
	this.initEvents();
}

DropDown.prototype = {
	initEvents : function() {
		var obj = this;

		obj.dd.on('click', function(event){
			$(this).toggleClass('active');
			return false;
		});

		obj.opts.on('click',function(){
			var opt = $(this);
			obj.val = opt.text();
			obj.index = opt.index();
			obj.placeholder.text(obj.val);
		});
	},
	getValue : function() {
		return this.val;
	},
	getIndex : function() {
		return this.index;
	}
}

$(function() {
	var dd = new DropDown( $('#dd') );
	$(document).click(function() {
		// all dropdowns
		$('.wrapper-dropdown-3').removeClass('active');
	});

});


// product detail page steps
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

	var href = $(e.target).attr('href');
	var $curr = $(".process-model  a[href='" + href + "']").parent();

	$('.process-model li').removeClass();

	$curr.addClass("active");
	$curr.prevAll().addClass("visited");
});
// end  script for tab steps

// product detail other info accordian js 
$(function() {
	$(".expand").on( "click", function() {
		// $(this).next().slideToggle(200);
		$expand = $(this).find(">:first-child");
		
		if($expand.text() == "+") {
		$expand.text("-");
		} else {
		$expand.text("+");
		}
	});
});


var $items = $('#vtab>ul>li');
$items.mouseover(function() {
    $items.removeClass('selected');
    $(this).addClass('selected');
 
    var index = $items.index($(this));
    $('#vtab>div').hide().eq(index).show();
}).eq(1).mouseover();


var $itemsA = $('#vtabA>ul>li');
$itemsA.mouseover(function() {
    $itemsA.removeClass('selected');
    $(this).addClass('selected');
 
    var index = $itemsA.index($(this));
    $('#vtabA>div').hide().eq(index).show();
}).eq(1).mouseover();

// add to cart modal qty

// home page header sticky script 15 oct 2019

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 100) {
        $(".iris_top_right_2 ul.col-lg-12 li.iris_1").addClass("iris_1A");
		$(".iris_top_currency_country").addClass("change");
		$(".iris_top_header").addClass("change3");
		$(".demo-13").addClass("change1");
		$(".mm .navbar").addClass("change1");
		$(".iris_main_menu").addClass("change2");
		$(".iris_PL_right_sidebar .iris_bredcrumb .row").addClass("iris_DA");
		$(".iris_top_middle_search_box .input-group").addClass("iris_2");
		$(".iris_product_listing .iris_PL_sidebar .bs-example").addClass("iris_6A");
		$(".navbar .dropdown-menu").addClass("iris_6");
		$(".iris_ab .modal-dialog .modal-content .modal-body .iris_top_middle_search_box .input-group").addClass("iris_5");
		
    } else {
		$(".iris_top_right_2 ul.col-lg-12 li.iris_1").removeClass("iris_1A");
        $(".iris_top_currency_country").removeClass("change");
		$(".iris_top_header").removeClass("change3");
		$(".demo-13").removeClass("change1");
		$(".mm .navbar").removeClass("change1");
		$(".iris_main_menu").removeClass("change2");
		$(".iris_PL_right_sidebar .iris_bredcrumb .row").removeClass("iris_DA");
		$(".iris_top_middle_search_box .input-group").removeClass("iris_2"); 
		$(".iris_product_listing .iris_PL_sidebar .bs-example").removeClass("iris_6A"); 
		$(".navbar .dropdown-menu").removeClass("iris_6"); 
		$(".iris_ab .modal-dialog .modal-content .modal-body .iris_top_middle_search_box .input-group").removeClass("iris_5"); 
    }
});


// menu category page
jQuery(function($) {
    $('.dropdown > a').click(function(){
        location.href = this.href;
    });
});
// checkout wizard

$(function(){
	$('.btn-circle').on('click',function(){
		$('.btn-circle.btn-info').removeClass('btn-info').addClass('btn-default');
		$(this).addClass('btn-info').removeClass('btn-default').blur();
	});

 	$('.next-step, .prev-step').on('click', function (e){
		var $activeTab = $('.tab-pane.active');

		$('.btn-circle.btn-info').removeClass('btn-info').addClass('btn-default');

		if ( $(e.target).hasClass('next-step') )
		{
			var nextTab = $activeTab.next('.tab-pane').attr('id');
			$('[href="#'+ nextTab +'"]').addClass('btn-info').removeClass('btn-default');
			$('[href="#'+ nextTab +'"]').tab('show');
		}
		else
		{
			var prevTab = $activeTab.prev('.tab-pane').attr('id');
			$('[href="#'+ prevTab +'"]').addClass('btn-info').removeClass('btn-default');
			$('[href="#'+ prevTab +'"]').tab('show');
		}
 	});
});

// avail dates drop down
$(".dropdown-menu li a").click(function(){
	var selText = $(this).text();
	$(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
});
// home Glasses image bullet styles

var navbar = document.getElementById("navbar");

function myFunction() {
	var sticky = navbar.offsetTop;
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}