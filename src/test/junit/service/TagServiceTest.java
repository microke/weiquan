package test.junit.service;

import java.util.ArrayList;
import java.util.List;

import com.weiquan.cache.map.impl.RoleTagMapCache;
import com.weiquan.common.WqContext;
import com.weiquan.common.WqDataDictionary;
import com.weiquan.domain.Sheet;
import com.weiquan.domain.Tag;
import com.weiquan.service.sheet.SheetService;

public class TagServiceTest extends BaseServiceTest{
	private WqContext wqContext;
	private SheetService sheetService;
	@Override
	protected String getContextPath() {
		return "/test/application.xml";
	}
	
	public void testLoad(){
		RoleTagMapCache tagsCache = (RoleTagMapCache)wqContext.getSysCacheMap().get(WqDataDictionary.CACHE_KEY_TAG);
		Tag currTag = tagsCache.get("1");
		currTag = currTag.clone();
		List<Sheet> sheets = new ArrayList<Sheet>();
		for(Sheet sheet:currTag.getSheets()){
			sheet = sheet.clone();
			this.sheetService.loadSheetElements(sheet);
			sheets.add(sheet);
		}
		currTag.setSheets(sheets);
	}
	
	@Override
	public void createEntity() {
		wqContext = (WqContext)super.context.getBean("wqContext");
		sheetService = (SheetService)super.context.getBean("sheetService");
	}

	@Override
	public void destroyEntity() {
		
	}

}
