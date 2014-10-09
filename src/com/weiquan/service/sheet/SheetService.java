package com.weiquan.service.sheet;
import java.util.List;

import com.weiquan.domain.Element;
import com.weiquan.domain.Sheet;
public interface SheetService {
	
	public Sheet loadSheetInfo(long sheet);
	
	public void loadSheetElements(Sheet sheet);
}