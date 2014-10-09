
oldLayer = null;
oldDataListNo = 0;
function MM_findObj(n, d) { //v4.01
	var p, i, x;
	if (!d) {
		d = document;
	}
	if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
		d = parent.frames[n.substring(p + 1)].document;
		n = n.substring(0, p);
	}
	if (!(x = d[n]) && d.all) {
		x = d.all[n];
	}
	for (i = 0; !x && i < d.forms.length; i++) {
		x = d.forms[i][n];
	}
	for (i = 0; !x && d.layers && i < d.layers.length; i++) {
		x = MM_findObj(n, d.layers[i].document);
	}
	if (!x && d.getElementById) {
		x = d.getElementById(n);
	}
	return x;
}
function MM_showHideLayers() { //v6.0
	var s, i, p, v, obj, args = MM_showHideLayers.arguments;
	for (i = 0; i < (args.length - 2); i += 3) {
		if ((obj = MM_findObj(args[i])) != null) {
			v = args[i + 2];
			if (obj.style) {
				obj = obj.style;
				v = (v == "show") ? "visible" : (v == "hide") ? "hidden" : v;
			}
			obj.visibility = v;
			if (v == "visible") {
				if (oldLayer != null && oldLayer != obj) {
					oldLayer.visibility = "hidden";
				}
				oldLayer = obj;
			}
		}
	}
}
function showInCenter(el) {
	if (navigator.appName == "Netscape") {
		JH = window.innerHeight;
		JW = window.innerWidth;
		JX = window.pageXOffset;
		JY = window.pageYOffset;
		el.top = (JH / 2 + JY - el.offsetHeight / 2);
		el.left = (JW / 2 + JX - el.offsetWidth / 2);
		el.visibility = "show";
	}
	if (navigator.appVersion.indexOf("MSIE") != -1) {
		if (navigator.appVersion.indexOf("Mac") == -1) {
			JH = document.body.clientHeight;
			JW = document.body.clientWidth;
			JX = document.body.scrollLeft;
			JY = document.body.scrollTop;
			el.style.top = (JH / 2 + JY - el.offsetHeight / 2);
			el.style.left = (JW / 2 + JX - el.offsetWidth / 2);
			el.style.visibility = "visible";
		}
	}
}
/**function getAbsolutePosition(el) {
	var r = {x:el.offsetLeft, y:el.offsetTop};
	if (el.offsetParent) {
		var tmp = getAbsolutePosition(el.offsetParent);
		r.x += tmp.x;
		r.y += tmp.y;
	}
	return r;
}
*/
function createMenuItem(path, caption) {
	document.write("              <tr>");
	document.write("                <td style=\"text-align:left\" onMouseOver=\"this.style.color='#3399ff'\" onMouseOut=\"this.style.color='black'\">&nbsp;");
	if (path.indexOf("javascript:") >= 0) {//½Å±¾
		document.write("                  <a onMouseOver=\"this.style.color='#3399ff'\" onMouseOut=\"this.style.color='black'\" href=\"" + path + "\">" + caption + "</a>");
	} else {
		document.write("                  <a onMouseOver=\"this.style.color='#3399ff'\" onMouseOut=\"this.style.color='black'\" href=\"" + path + "\" target=\"operation\">" + caption + "</a>");
	}
	document.write("                </td>");
	document.write("              </tr>");
}
function createMenu(name, className, left, top, width, menuItems) {
	document.write("<div id=\"" + name + "\" onMouseOver=\"MM_showHideLayers('" + name + "','','show')\"");
	if (name.indexOf("priceMenu") < 0) {
		document.write("      onMouseOut=\"MM_showHideLayers('" + name + "','','hide')\" ");
	}
	document.write("style=\"Z-INDEX: 1; VISIBILITY: hidden; POSITION: absolute; LEFT: " + left + "px; TOP: " + top + "px; WIDTH: " + width + "px;\">");
	document.write("<table class=\"" + className + "\" style=\"width:" + width + "\" cellpadding=1 cellspacing=0>");
	if (name.indexOf("priceMenu") >= 0) {
		createPriceItem(name, menuItems);
	} else {
		for (var i = 0; i < menuItems.length; i++) {
			createMenuItem(menuItems[i][0], menuItems[i][1]);
		}
	}
	document.write("          </table>");
	document.write("<iframe src=\"javascript:false\" style=\"position:absolute; visibility:inherit; top:0px; left:0px; width:" + width + "px; height:200px; z-index:-1; filter: Alpha(Opacity=0);\"></iframe> ");
	document.write("</div>");
	var thediv = MM_findObj(name);
	var ir = thediv.getElementsByTagName("iframe");
	if (ir.length > 0) {
		var theframe = ir[0];
		theframe.style.height = thediv.offsetHeight;
		if (name.indexOf("priceMenu") >= 0) {
		    thediv.style.overflowY="scroll";
			theframe.style.width = thediv.offsetWidth + 16;
		}
	}
}
function createPriceItem(name, menuItems) {
	document.write("               <tr align=\"center\">  <td>RATE PRICE");
	document.write("                </td></tr>");
	for (var i = 0; i < menuItems.length; i++) {
		document.write("               <tr align=\"left\"> <td onMouseOver=\"this.style.color='#3399ff'\" onMouseOut=\"this.style.color='black'\">&nbsp;");
		document.write(" <input name=\"checkbox2\" type=\"checkbox\" value=\"checkbox\" onclick=\"" + menuItems[i][0] + "\" id=\"pricecbx\" />&nbsp;" + menuItems[i][1]);
		document.write("                </td> </tr>");
	}
	document.write("              <tr>   <td align=\"center\"><input type=\"button\" value=\"¹Ø±Õ\" onClick=\"MM_showHideLayers('" + name + "','','hide')\" class=\"button_half\">");
	document.write("                </td> </tr>");
}

