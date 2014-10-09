$(function() {

	var $placeholder = $('input[placeholder]');

	if ($placeholder.length > 0) {

		var attrPh = $placeholder.attr('placeholder');

		$placeholder.attr('value', attrPh)
		  .bind('focus', function() {

			var $this = $(this),
				$form = $this.parents('.search');

			if($this.val() === attrPh)
				$this.val('').css('color','#333');

			$form.addClass('focus');

		}).bind('blur', function() {

			var $this = $(this),
				$form = $this.parents('.search');

			if($this.val() === '')
				$this.val(attrPh).css('color','#a9a9a9');

			$form.removeClass('focus');
		});
	}
	

});