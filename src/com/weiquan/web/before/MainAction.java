package com.weiquan.web.before;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.weiquan.cache.CacheInterface;
import com.weiquan.cache.map.impl.AttrMappingCache;
import com.weiquan.cache.map.impl.RoleTagMapCache;
import com.weiquan.common.WqCommonUtil;
import com.weiquan.common.WqContext;
import com.weiquan.common.WqDataDictionary;
import com.weiquan.domain.Sheet;
import com.weiquan.domain.Tag;
import com.weiquan.domain.User;
import com.weiquan.service.sheet.SheetService;

@Controller
public class MainAction {
	private WqContext wqContext;
	private SheetService sheetService;
	@RequestMapping("/index")
	public String index(@RequestParam("flag")Integer tagId, Model mav){
		if(tagId==0){tagId=1;}
		RoleTagMapCache tagsCache = (RoleTagMapCache)wqContext.getSysCacheMap().get(WqDataDictionary.CACHE_KEY_TAG);
		mav.addAttribute("tags", tagsCache.getAllValue());
		if(tagId == -1){
			return "/user/UserResigter";
		}
		Tag currTag = tagsCache.get(String.valueOf(tagId));
		currTag = currTag.clone();
		List<Sheet> sheets = new ArrayList<Sheet>();
		for(Sheet sheet:currTag.getSheets()){
			sheet = sheet.clone();
			this.sheetService.loadSheetElements(sheet);
			sheets.add(sheet);
		}
		currTag.setSheets(sheets);
		mav.addAttribute("sheets", sheets);
		return "/Index";
	}
	
	public void setWqContext(WqContext wqContext) {
		this.wqContext = wqContext;
	}

	public void setSheetService(SheetService sheetService) {
		this.sheetService = sheetService;
	}
}
