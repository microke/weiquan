package com.weiquan.service.sheet.impl;
import java.util.List;
import org.apache.log4j.Logger;

import com.weiquan.domain.Element;
import com.weiquan.domain.Sheet;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.SheetDao;
import com.weiquan.service.element.ElementService;
import com.weiquan.service.sheet.SheetService;
import com.weiquan.service.ServiceCommonInterface;
public class SheetServiceImpl implements SheetService, ServiceCommonInterface<Sheet>{
	private Logger logger = Logger.getLogger(SheetServiceImpl.class);
	private SheetDao sheetDao;
	private ElementService elementService;
	
	@Override
	public Sheet loadSheetInfo(long id) {
		Sheet temp = this.sheetDao.get(new Sheet(id));
		loadSheetElements(temp);
		return temp;
	}
	
	@Override
	public void loadSheetElements(Sheet sheet) {
		this.logger.info("开始加载Sheet元素[sheetName:"+sheet.getSheetName()+", sheetType:"+sheet.getSheetType()+"]");
		sheet.setElements(elementService.loadElements(sheet.toElementQuery(), sheet.getSheetType()));
	}

	@Override
	public Sheet getInfoById(long id){
		return null;
	}
	@Override
	public Sheet getInfoById(Sheet arg){
		return this.sheetDao.get(arg);
	}
	public List<Sheet> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(Sheet arg){
		this.sheetDao.update(arg);
	}
	@Override
	public void insert(Sheet arg){
		this.sheetDao.insert(arg);
	}
	public void setSheetDao(SheetDao arg){
		this.sheetDao = arg;
	}

	public void setElementService(ElementService elementService) {
		this.elementService = elementService;
	}
}